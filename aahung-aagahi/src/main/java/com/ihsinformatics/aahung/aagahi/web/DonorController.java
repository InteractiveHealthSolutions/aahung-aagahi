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
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.hibernate.HibernateException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ihsinformatics.aahung.aagahi.model.Donor;
import com.ihsinformatics.aahung.aagahi.service.DonorService;

import io.swagger.annotations.ApiOperation;

/**
 * @author rabbia.hassan@ihsinformatics.com
 */
@RestController
@RequestMapping("/api")
public class DonorController extends BaseController {

	private final Logger LOG = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private DonorService service;

	@ApiOperation(value = "Create New Donor")
	@PostMapping("/donor")
	public ResponseEntity<?> createDonor(@RequestBody Donor obj) throws URISyntaxException, AlreadyBoundException {
		LOG.info("Request to create donor: {}", obj);
		try {
			Donor result = service.saveDonor(obj);
			return ResponseEntity.created(new URI("/api/donor/" + result.getUuid())).body(result);
		} catch (HibernateException e) {
			LOG.info("Exception occurred while creating object: {}", e.getMessage());
			return super.resourceAlreadyExists(e.getMessage());
		}
	}

	@ApiOperation(value = "Delete Donor")
	@DeleteMapping("/donor/{uuid}")
	public ResponseEntity<?> deleteDonor(@PathVariable String uuid) {
		LOG.info("Request to delete donor: {}", uuid);
		service.deleteDonor(service.getDonorByUuid(uuid));
		return ResponseEntity.noContent().build();
	}

	@ApiOperation(value = "Get Donor By UUID")
	@GetMapping("/donor/{uuid}")
	public ResponseEntity<?> getDonor(@PathVariable String uuid) {
		Optional<Donor> obj = Optional.of(service.getDonorByUuid(uuid));
		if (obj.isPresent()) {
			return ResponseEntity.ok().body(obj.get());
		}
		return noEntityFoundResponse(uuid);
	}

	@ApiOperation(value = "Get Donor by short name")
	@GetMapping("/donor/shortname/{shortName}")
	public ResponseEntity<?> getDonorByShortName(@PathVariable String shortName) {
		Donor obj = service.getDonorByShortName(shortName);
		if (obj != null) {
			return ResponseEntity.ok().body(obj);
		}
		return noEntityFoundResponse(shortName);
	}

	@ApiOperation(value = "Get all Donors")
	@GetMapping("/donors")
	public Collection<?> getDonors() {
		return service.getAllDonors();
	}

	@ApiOperation(value = "Get Donors by name")
	@GetMapping("/donors/name/{name}")
	public ResponseEntity<?> getDonorsByName(@PathVariable String name) {
		List<Donor> list = service.getDonorsByName(name);
		if (!list.isEmpty()) {
			return ResponseEntity.ok().body(list);
		}
		return noEntityFoundResponse(name);
	}

	@ApiOperation(value = "Update existing Donor")
	@PutMapping("/donor/{uuid}")
	public ResponseEntity<?> updateDonor(@PathVariable String uuid, @Valid @RequestBody Donor obj) {
		obj.setUuid(uuid);
		LOG.info("Request to update donor: {}", obj);
		return ResponseEntity.ok().body(service.updateDonor(obj));
	}
}