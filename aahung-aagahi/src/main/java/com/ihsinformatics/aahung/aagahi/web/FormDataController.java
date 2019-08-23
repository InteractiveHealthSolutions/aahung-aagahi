/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.web;

import java.util.Optional;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ihsinformatics.aahung.aagahi.model.Element;
import com.ihsinformatics.aahung.aagahi.model.FormData;
import com.ihsinformatics.aahung.aagahi.service.FormService;

import io.swagger.annotations.ApiOperation;

/**
 * @author rabbia.hassan@ihsinformatics.com
 */
@RestController
@RequestMapping("/api")
public class FormDataController {

	private final Logger LOG = LoggerFactory.getLogger(this.getClass());
	
	private FormService service;

	public FormDataController(FormService service) {
		this.service = service;
	}	
	
	@ApiOperation(value = "Get FormData By UUID")
	@GetMapping("/formdata/{uuid}")
	public ResponseEntity<FormData> getFormData(@PathVariable String uuid) {
		Optional<FormData> formData = Optional.of(service.getFormDataByUuid(uuid));
		JSONObject json = new JSONObject(formData.get().getData());
		JSONArray newFieldsData = includeElementNames(json.getJSONArray("fields"));
		json.put("fields", newFieldsData);
		formData.get().setData(json.toString());
		return formData.map(response -> ResponseEntity.ok().body(response))
		        .orElse(new ResponseEntity<FormData>(HttpStatus.NOT_FOUND));
	}
	
	private JSONArray includeElementNames(JSONArray jsonArray) {
		JSONArray newArray = new JSONArray();
		for (int i = 0; i < jsonArray.length(); i++) {
			JSONObject json = jsonArray.getJSONObject(i);
			String elementUuid = json.getString("element");
			Element element = null;
			// element = service.getElementByUuid(elementUuid);
			json.put("elementName", element.getElementName());
			json.put("dataType", element.getDataType());
			newArray.put(json);
		}
		return newArray;
	}
}
