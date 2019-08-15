/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.web;

import java.net.URI;
import java.net.URISyntaxException;
import java.rmi.AlreadyBoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.ihsinformatics.aahung.aagahi.dto.LocationMapper;
import com.ihsinformatics.aahung.aagahi.model.Donar;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.LocationAttributeType;
import com.ihsinformatics.aahung.aagahi.model.User;
import com.ihsinformatics.aahung.aagahi.service.FormService;
import com.ihsinformatics.aahung.aagahi.service.LocationService;
import com.ihsinformatics.aahung.aagahi.util.SearchCriteria;

import io.swagger.annotations.ApiOperation;

/**
 * @author rabbia.hassan@ihsinformatics.com
 */
@RestController
@RequestMapping("/api")
public class DonarController {

	private final Logger LOG = LoggerFactory.getLogger(this.getClass());

	private FormService service;

	public DonarController(FormService service) {
		this.service = service;
	}
		
	@ApiOperation(value = "Get all Donars")
	@GetMapping("/donars")
	public Collection<Donar> donars() {
		return service.getAllDonars();
	}
	
	
	@ApiOperation(value = "Get Donar By UUID")
	@GetMapping("/donar/{uuid}")
	public ResponseEntity<Donar> getDonar(@PathVariable String uuid) {
		Optional<Donar> donar = Optional.of(service.getDonarByUuid(uuid));
		return donar.map(response -> ResponseEntity.ok().body(response))
		        .orElse(new ResponseEntity<Donar>(HttpStatus.NOT_FOUND));
	}
	
	@ApiOperation(value = "Create New Donar")
	@PostMapping("/donar")
	public ResponseEntity<Donar> createLocation(@Valid @RequestBody Donar donar) throws URISyntaxException, AlreadyBoundException {
		LOG.info("Request to create donar: {}", donar);
		Donar result = service.saveDonar(donar);
		return ResponseEntity.created(new URI("/api/donar/" + result.getUuid())).body(result);
	}

	@ApiOperation(value = "Update existing Donar")
	@PutMapping("/donar/{uuid}")
	public ResponseEntity<Donar> updateDonar(@PathVariable String uuid, @Valid @RequestBody Donar donar) {
		donar.setUuid(uuid);
		LOG.info("Request to update donar: {}", donar);
		Donar result = service.updateDonar(donar);
		return ResponseEntity.ok().body(result);
	}

	@ApiOperation(value = "Delete Donar")
	@DeleteMapping("/donar/{uuid}")
	public ResponseEntity<Donar> deleteLocation(@PathVariable String uuid) {
		LOG.info("Request to delete donar: {}", uuid);
		service.deleteDonar(service.getDonarByUuid(uuid));
		return ResponseEntity.ok().build();
	}
	
}
