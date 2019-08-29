/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.web;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.rmi.AlreadyBoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.validation.Valid;
import javax.validation.ValidationException;

import org.hibernate.HibernateException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ihsinformatics.aahung.aagahi.model.Element;
import com.ihsinformatics.aahung.aagahi.model.FormData;
import com.ihsinformatics.aahung.aagahi.service.FormService;
import com.ihsinformatics.aahung.aagahi.service.MetadataService;
import com.ihsinformatics.aahung.aagahi.util.SearchCriteria;
import com.ihsinformatics.aahung.aagahi.util.SearchOperator;

import io.swagger.annotations.ApiOperation;

/**
 * @author rabbia.hassan@ihsinformatics.com
 */
@RestController
@RequestMapping("/api")
public class FormDataController extends BaseController {

	private final Logger LOG = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private FormService formService;

	@Autowired
	private MetadataService metadataService;

	@ApiOperation(value = "Get FormData By UUID")
	@GetMapping("/formdata/{uuid}")
	public ResponseEntity<FormData> getFormData(@PathVariable String uuid) {
		Optional<FormData> formData = Optional.of(formService.getFormDataByUuid(uuid));
		JSONObject json;
		try {
			json = new JSONObject(formData.get().getData());
			JSONArray newFieldsData = includeElementNames(json.getJSONArray("fields"));
			json.put("fields", newFieldsData);
			formData.get().setData(json.toString());
		}
		catch (JSONException e) {
			e.printStackTrace();
		}
		return formData.map(response -> ResponseEntity.ok().body(response))
		        .orElse(new ResponseEntity<FormData>(HttpStatus.NOT_FOUND));
	}

	private JSONArray includeElementNames(JSONArray jsonArray) {
		JSONArray newArray = new JSONArray();
		for (int i = 0; i < jsonArray.length(); i++) {
			JSONObject json;
			try {
				json = jsonArray.getJSONObject(i);
				String elementUuid = json.getString("element");
				Element element = null;
				element = metadataService.getElementByUuid(elementUuid);
				json.put("elementName", element.getElementName());
				json.put("elementShortName", element.getShortName());
				json.put("elementDescription", element.getDescription());
				json.put("dataType", element.getDataType());
				newArray.put(json);
			}
			catch (JSONException e) {
				e.printStackTrace();
			}
		}
		return newArray;
	}

	@ApiOperation(value = "Delete a Form Data")
	@DeleteMapping("/formdata/{uuid}")
	public ResponseEntity<FormData> deleteFormData(@PathVariable String uuid) {
		formService.deleteFormData(formService.getFormDataByUuid(uuid));
		return ResponseEntity.noContent().build();
	}

	@ApiOperation(value = "Create a new Form Daata")
	@PostMapping("/formdata")
	public ResponseEntity<?> createFormData(@Valid @RequestBody FormData formdata)
	        throws URISyntaxException, AlreadyBoundException {
		FormData result = null;
		try {
			result = formService.saveFormData(formdata);
		}
		catch (HibernateException | ValidationException | IOException e) {
			LOG.error(e.getMessage());
			return invalidDataResponse(e.getMessage());
		}
		return ResponseEntity.created(new URI("/api/formdata/" + result.getUuid())).body(result);
	}

	@ApiOperation(value = "Update Form Data")
	@PutMapping("/formdata/{uuid}")
	public ResponseEntity<?> updateFormData(@PathVariable String uuid, @Valid @RequestBody FormData formData) {
		formData.setUuid(uuid);
		FormData result = null;
		try {
			result = formService.updateFormData(formData);
		}
		catch (HibernateException | ValidationException | IOException e) {
			LOG.error(e.getMessage());
			return invalidDataResponse(e.getMessage());
		}
		return ResponseEntity.ok().body(result);
	}

	@ApiOperation(value = "Get Element By UUID")
	@GetMapping("/element/{uuid}")
	public ResponseEntity<Element> getElement(@PathVariable String uuid) {
		Optional<Element> element = Optional.of(metadataService.getElementByUuid(uuid));
		return element.map(response -> ResponseEntity.ok().body(response))
		        .orElse(new ResponseEntity<Element>(HttpStatus.NOT_FOUND));
	}

	// Example: http://localhost:8080/aahung-aagahi/api/elements?search=shortName:test123
	// http://localhost:8080/aahung-aagahi/api/elements?search=test123
	@ApiOperation(value = "Get All Elements / Search Element on different Criteria")
	@GetMapping("elements")
	@ResponseBody
	public List<Element> getElements(@RequestParam(value = "search", required = false) String search) {
		List<SearchCriteria> params = new ArrayList<>();
		if (search != null) {
			if (!search.contains(":")) {
				List<Element> elementList = new ArrayList<>();
				String[] splitArray = search.split(",");
				for (String s : splitArray) {
					Element element = metadataService.getElementByShortName(s);
					if (element != null)
						elementList.add(element);
					else
						elementList.addAll(metadataService.getElementsByName(s));
				}
				return elementList;
			} else {
				Pattern pattern = Pattern.compile("(\\w+?)(:|<|>)(\\w+?),");
				Matcher matcher = pattern.matcher(search + ",");
				while (matcher.find()) {
					params.add(new SearchCriteria(matcher.group(1),
					        SearchOperator.getSearchOperatorByAlias(matcher.group(2)), matcher.group(3)));
				}
			}
		}
		return new ArrayList<>();
	}

}
