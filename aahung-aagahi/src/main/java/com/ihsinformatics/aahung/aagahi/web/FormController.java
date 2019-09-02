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
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;
import javax.validation.ValidationException;

import org.hibernate.HibernateException;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ihsinformatics.aahung.aagahi.model.FormData;
import com.ihsinformatics.aahung.aagahi.model.FormType;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.service.FormService;
import com.ihsinformatics.aahung.aagahi.service.LocationService;
import com.ihsinformatics.aahung.aagahi.util.DateTimeUtil;

import io.swagger.annotations.ApiOperation;

/**
 * @author rabbia.hassan@ihsinformatics.com
 */
@RestController
@RequestMapping("/api")
public class FormController extends BaseController {

	private final Logger LOG = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private FormService service;

	@Autowired
	private LocationService locationService;

	@ApiOperation(value = "Create New FormData")
	@PostMapping("/formdata")
	public ResponseEntity<?> createFormData(@RequestBody FormData obj) throws URISyntaxException, AlreadyBoundException {
		LOG.info("Request to create form data: {}", obj);
		try {
			FormData result = service.saveFormData(obj);
			return ResponseEntity.created(new URI("/api/formdata/" + result.getUuid())).body(result);
		}
		catch (HibernateException | IOException e) {
			LOG.info("Exception occurred while creating object: {}", e.getMessage());
			return super.resourceAlreadyExists(e.getMessage());
		}
	}

	@ApiOperation(value = "Create New FormType")
	@PostMapping("/formtype")
	public ResponseEntity<?> createFormType(@RequestBody FormType obj) throws URISyntaxException, AlreadyBoundException {
		LOG.info("Request to create form type: {}", obj);
		try {
			FormType result = service.saveFormType(obj);
			return ResponseEntity.created(new URI("/api/formtype/" + result.getUuid())).body(result);
		}
		catch (HibernateException | ValidationException | JSONException e) {
			LOG.info("Exception occurred while creating object: {}", e.getMessage());
			return super.resourceAlreadyExists(e.getMessage());
		}
	}

	@ApiOperation(value = "Get FormData By UUID")
	@GetMapping("/formdata/{uuid}")
	public ResponseEntity<?> getFormData(@PathVariable String uuid) {
		Optional<FormData> obj = Optional.of(service.getFormDataByUuid(uuid));
		if (obj.isPresent()) {
			return ResponseEntity.ok().body(obj.get());
		}
		return noEntityFoundResponse(uuid);
	}

	@ApiOperation(value = "Get FormData by Date range")
	@GetMapping(value = "/formdata/date", params = { "from", "to", "page", "size" })
	public ResponseEntity<?> getFormDataByDateRange(@RequestParam("from") Date from, @RequestParam("to") Date to,
	        @RequestParam("page") Integer page, @RequestParam("size") Integer size) {
		List<FormData> list = service.getFormDataByDate(from, to, page, size, "formDate", true);
		if (!list.isEmpty()) {
			return ResponseEntity.ok().body(list);
		}
		return noEntityFoundResponse(DateTimeUtil.toSqlDateTimeString(from) + ", " + DateTimeUtil.toSqlDateTimeString(to));
	}

	@ApiOperation(value = "Get FormData By UUID")
	@GetMapping("/formdata/location/{uuid}")
	public ResponseEntity<?> getFormDataByLocation(@PathVariable String uuid) {
		FormData obj = service.getFormDataByReferenceId(uuid);
		if (obj != null) {
			return ResponseEntity.ok().body(obj);
		}
		return noEntityFoundResponse(uuid);
	}

	@ApiOperation(value = "Get FormData By Reference ID")
	@GetMapping("/formdata/referenceid/{referenceId}")
	public ResponseEntity<?> getFormDataByReferenceId(@PathVariable String referenceId) {
		FormData obj = service.getFormDataByReferenceId(referenceId);
		if (obj != null) {
			return ResponseEntity.ok().body(obj);
		}
		return noEntityFoundResponse(referenceId);
	}

	@ApiOperation(value = "Get FormType By UUID")
	@GetMapping("/formtype/{uuid}")
	public ResponseEntity<?> getFormType(@PathVariable String uuid) {
		Optional<FormType> obj = Optional.of(service.getFormTypeByUuid(uuid));
		if (obj.isPresent()) {
			return ResponseEntity.ok().body(obj.get());
		}
		return noEntityFoundResponse(uuid);
	}

	@ApiOperation(value = "Get FormType by name/short name")
	@GetMapping("/formtype/name/{name}")
	public ResponseEntity<?> getFormTypeByShortName(@PathVariable String name) {
		FormType obj = service.getFormTypeByName(name);
		if (obj != null) {
			return ResponseEntity.ok().body(obj);
		}
		return noEntityFoundResponse(name);
	}

	@ApiOperation(value = "Get all FormTypes")
	@GetMapping("/formtypes")
	public Collection<?> getFormTypes() {
		return service.getAllFormTypes(true);
	}

	@ApiOperation(value = "Retire FormType")
	@DeleteMapping("/formtype/{uuid}")
	public ResponseEntity<?> retireFormType(@PathVariable String uuid) {
		LOG.info("Request to retire form type: {}", uuid);
		service.retireFormType(service.getFormTypeByUuid(uuid));
		return ResponseEntity.noContent().build();
	}

	@ApiOperation(value = "Get FormData by Date range")
	@GetMapping(value = "/formdata/search", params = { "formType", "location", "from", "to", "page", "size" })
	public ResponseEntity<?> searchFormData(@RequestParam("formType") String formTypeUuid,
	        @RequestParam("location") String locationUuid, @RequestParam("from") Date from, @RequestParam("to") Date to,
	        @RequestParam("page") Integer page, @RequestParam("size") Integer size) throws HibernateException {
		FormType formType = service.getFormTypeByUuid(formTypeUuid);
		Location location = locationService.getLocationByUuid(locationUuid);
		List<FormData> list = service.searchFormData(formType, location, from, to, page, size, "formDate", true);
		if (!list.isEmpty()) {
			return ResponseEntity.ok().body(list);
		}
		return noEntityFoundResponse(DateTimeUtil.toSqlDateTimeString(from) + ", " + DateTimeUtil.toSqlDateTimeString(to));
	}

	@ApiOperation(value = "Restore FormType")
	@PatchMapping("/formtype/{uuid}")
	public ResponseEntity<?> unretireFormType(@PathVariable String uuid) {
		LOG.info("Request to restore form type: {}", uuid);
		try {
			service.unretireFormType(service.getFormTypeByUuid(uuid));
		}
		catch (Exception e) {
			LOG.info("Exception occurred while restoring object: {}", e.getMessage());
			return exceptionFoundResponse(e.getMessage());
		}
		return ResponseEntity.noContent().build();
	}

	@ApiOperation(value = "Restore FormData")
	@PatchMapping("/formdata/{uuid}")
	public ResponseEntity<?> unvoidFormData(@PathVariable String uuid) {
		LOG.info("Request to restore form data: {}", uuid);
		try {
			service.unvoidFormData(service.getFormDataByUuid(uuid));
		}
		catch (HibernateException | ValidationException | IOException e) {
			LOG.info("Exception occurred while restoring object: {}", e.getMessage());
			return exceptionFoundResponse(e.getMessage());
		}
		return ResponseEntity.noContent().build();
	}

	@ApiOperation(value = "Update existing FormData")
	@PutMapping("/formdata/{uuid}")
	public ResponseEntity<?> updateFormData(@PathVariable String uuid, @Valid @RequestBody FormData obj) {
		obj.setUuid(uuid);
		LOG.info("Request to update form data: {}", obj);
		try {
			service.updateFormData(obj);
		}
		catch (HibernateException | ValidationException | IOException e) {
			LOG.info("Exception occurred while updating object: {}", e.getMessage());
			return exceptionFoundResponse(e.getMessage());
		}
		return ResponseEntity.ok().body(obj);
	}

	@ApiOperation(value = "Update existing FormType")
	@PutMapping("/formtype/{uuid}")
	public ResponseEntity<?> updateFormType(@PathVariable String uuid, @Valid @RequestBody FormType obj) {
		obj.setUuid(uuid);
		LOG.info("Request to update form type: {}", obj);
		try {
			return ResponseEntity.ok().body(service.updateFormType(obj));
		}
		catch (HibernateException | ValidationException | JSONException e) {
			LOG.info("Exception occurred while creating object: {}", e.getMessage());
			return super.resourceAlreadyExists(e.getMessage());
		}
	}

	@ApiOperation(value = "Void FormData")
	@DeleteMapping("/formdata/{uuid}")
	public ResponseEntity<?> voidFormData(@PathVariable String uuid) {
		LOG.info("Request to void form data: {}", uuid);
		service.voidFormData(service.getFormDataByUuid(uuid));
		return ResponseEntity.noContent().build();
	}
}
