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
import com.ihsinformatics.aahung.aagahi.model.Project;
import com.ihsinformatics.aahung.aagahi.service.DonorService;
import com.ihsinformatics.aahung.aagahi.util.RegexUtil;

import io.swagger.annotations.ApiOperation;

/**
 * @author rabbia.hassan@ihsinformatics.com
 */
@RestController
@RequestMapping("/api")
public class ProjectController extends BaseController {

	private final Logger LOG = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private DonorService service;

	@ApiOperation(value = "Create new Project")
	@PostMapping("/project")
	public ResponseEntity<?> createProject(@RequestBody Project obj) throws URISyntaxException, AlreadyBoundException {
		LOG.info("Request to create project: {}", obj);
		try {
			Project result = service.saveProject(obj);
			return ResponseEntity.created(new URI("/api/project/" + result.getUuid())).body(result);
		}
		catch (HibernateException e) {
			LOG.info("Exception occurred while creating object: {}", e.getMessage());
			return super.resourceAlreadyExists(e.getMessage());
		}
	}

	@ApiOperation(value = "Delete Project")
	@DeleteMapping("/project/{uuid}")
	public ResponseEntity<?> deleteProject(@PathVariable String uuid) {
		LOG.info("Request to delete project: {}", uuid);
		service.deleteProject(service.getProjectByUuid(uuid));
		return ResponseEntity.noContent().build();
	}

	@ApiOperation(value = "Get Project By UUID")
	@GetMapping("/project/{uuid}")
	public ResponseEntity<?> getProject(@PathVariable String uuid) {
		Project obj = service.getProjectByUuid(uuid);
		if (obj != null) {
			return ResponseEntity.ok().body(obj);
		}
		return noEntityFoundResponse(uuid);
	}
	
	@ApiOperation(value = "Get Project By ID")
	@GetMapping("/project/id/{id}")
	public ResponseEntity<?> getProjectById(@PathVariable Integer id) {
		Project obj = service.getProjectById(id);
		if (obj != null) {
			return ResponseEntity.ok().body(obj);
		}
		return noEntityFoundResponse(id.toString());
	}

	@ApiOperation(value = "Get Project by short name")
	@GetMapping("/project/shortname/{shortName}")
	public ResponseEntity<?> getProjectByShortName(@PathVariable String shortName) {
		Project obj = service.getProjectByShortName(shortName);
		if (obj != null) {
			return ResponseEntity.ok().body(obj);
		}
		return noEntityFoundResponse(shortName);
	}

	@ApiOperation(value = "Get all Projects")
	@GetMapping("/projects")
	public Collection<?> getProjects() {
		return service.getAllProjects();
	}

	@ApiOperation(value = "Get Projects by Donor")
	@GetMapping("/projects/donor/{uuid}")
	public ResponseEntity<?> getProjectsByDonor(@PathVariable String uuid) {
		Donor donor = uuid.matches(RegexUtil.UUID) ? service.getDonorByUuid(uuid) : service.getDonorByShortName(uuid);
		List<Project> list = service.getProjectsByDonor(donor);
		if (!list.isEmpty()) {
			return ResponseEntity.ok().body(list);
		}
		return noEntityFoundResponse(uuid);
	}

	@ApiOperation(value = "Get Projects by name")
	@GetMapping("/projects/name/{name}")
	public ResponseEntity<?> getProjectsByName(@PathVariable String name) {
		List<Project> list = service.getProjectsByName(name);
		if (!list.isEmpty()) {
			return ResponseEntity.ok().body(list);
		}
		return noEntityFoundResponse(name);
	}

	@ApiOperation(value = "Update existing Project")
	@PutMapping("/project/{uuid}")
	public ResponseEntity<?> updateProject(@PathVariable String uuid, @Valid @RequestBody Project obj) {
		Project found = service.getProjectByUuid(uuid);
		if (found == null) {
			return noEntityFoundResponse(uuid);
		}
		obj.setProjectId(found.getProjectId());
		obj.setUuid(found.getUuid());
		LOG.info("Request to update project: {}", obj);
		return ResponseEntity.ok().body(service.updateProject(obj));
	}
}
