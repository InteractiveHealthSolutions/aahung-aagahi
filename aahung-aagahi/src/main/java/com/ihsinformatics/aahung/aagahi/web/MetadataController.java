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

import com.ihsinformatics.aahung.aagahi.model.Definition;
import com.ihsinformatics.aahung.aagahi.model.DefinitionType;
import com.ihsinformatics.aahung.aagahi.model.Element;
import com.ihsinformatics.aahung.aagahi.service.MetadataService;
import com.ihsinformatics.aahung.aagahi.util.RegexUtil;

import io.swagger.annotations.ApiOperation;

/**
 * @author rabbia.hassan@ihsinformatics.com
 */
@RestController
@RequestMapping("/api")
public class MetadataController extends BaseController {

	private final Logger LOG = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private MetadataService service;

	@ApiOperation(value = "Create New Definition")
	@PostMapping("/definition")
	public ResponseEntity<?> createDefinition(@RequestBody Definition obj)
			throws URISyntaxException, AlreadyBoundException {
		LOG.info("Request to create definition: {}", obj);
		try {
			Definition result = service.saveDefinition(obj);
			return ResponseEntity.created(new URI("/api/definition/" + result.getUuid())).body(result);
		} catch (HibernateException e) {
			LOG.info("Exception occurred while creating object: {}", e.getMessage());
			return super.resourceAlreadyExists(e.getMessage());
		}
	}

	@ApiOperation(value = "Create New DefinitionType")
	@PostMapping("/definitiontype")
	public ResponseEntity<?> createDefinitionType(@RequestBody DefinitionType obj)
			throws URISyntaxException, AlreadyBoundException {
		LOG.info("Request to create definition type: {}", obj);
		try {
			DefinitionType result = service.saveDefinitionType(obj);
			return ResponseEntity.created(new URI("/api/definitiontype/" + result.getUuid())).body(result);
		} catch (HibernateException e) {
			LOG.info("Exception occurred while creating object: {}", e.getMessage());
			return super.resourceAlreadyExists(e.getMessage());
		}
	}

	@ApiOperation(value = "Create New Element")
	@PostMapping("/element")
	public ResponseEntity<?> createElement(@RequestBody Element obj) throws URISyntaxException, AlreadyBoundException {
		LOG.info("Request to create element: {}", obj);
		try {
			Element result = service.saveElement(obj);
			return ResponseEntity.created(new URI("/api/element/" + result.getUuid())).body(result);
		} catch (HibernateException e) {
			LOG.info("Exception occurred while creating object: {}", e.getMessage());
			return super.resourceAlreadyExists(e.getMessage());
		}
	}

	@ApiOperation(value = "Delete Definition")
	@DeleteMapping("/definition/{uuid}")
	public ResponseEntity<?> deleteDefinition(@PathVariable String uuid) {
		LOG.info("Request to delete definition: {}", uuid);
		service.deleteDefinition(service.getDefinitionByUuid(uuid));
		return ResponseEntity.noContent().build();
	}

	@ApiOperation(value = "Delete DefinitionType")
	@DeleteMapping("/definitiontype/{uuid}")
	public ResponseEntity<?> deleteDefinitionType(@PathVariable String uuid) {
		return notImplementedResponse(DefinitionType.class.getName());
	}

	@ApiOperation(value = "Delete Element")
	@DeleteMapping("/element/{uuid}")
	public ResponseEntity<?> deleteElement(@PathVariable String uuid) {
		LOG.info("Request to delete element: {}", uuid);
		service.deleteElement(service.getElementByUuid(uuid));
		return ResponseEntity.noContent().build();
	}

	@ApiOperation(value = "Get Definition By UUID")
	@GetMapping("/definition/{uuid}")
	public ResponseEntity<?> getDefinition(@PathVariable String uuid) {
		Optional<Definition> obj = Optional.of(service.getDefinitionByUuid(uuid));
		if (obj.isPresent()) {
			return ResponseEntity.ok().body(obj.get());
		}
		return noEntityFoundResponse(uuid);
	}

	@ApiOperation(value = "Get Definition by short name")
	@GetMapping("/definition/shortname/{shortName}")
	public ResponseEntity<?> getDefinitionByShortName(@PathVariable String shortName) {
		Definition obj = service.getDefinitionByShortName(shortName);
		if (obj != null) {
			return ResponseEntity.ok().body(obj);
		}
		return noEntityFoundResponse(shortName);
	}

	@ApiOperation(value = "Get Definitions by DefinitionType")
	@GetMapping("/definitions/definitiontype/{uuid}")
	public ResponseEntity<?> getDefinitionsByDefinitionType(@PathVariable String uuid) {
		DefinitionType definitionType = uuid.matches(RegexUtil.UUID) ? service.getDefinitionTypeByUuid(uuid) : service.getDefinitionTypeByShortName(uuid);
		List<Definition> list = service.getDefinitionsByDefinitionType(definitionType);
		if (!list.isEmpty()) {
			return ResponseEntity.ok().body(list);
		}
		return noEntityFoundResponse(uuid);
	}

	@ApiOperation(value = "Get Definitions by name")
	@GetMapping("/definitions/name/{name}")
	public ResponseEntity<?> getDefinitionsByName(@PathVariable String name) {
		List<Definition> list = service.getDefinitionsByName(name);
		if (!list.isEmpty()) {
			return ResponseEntity.ok().body(list);
		}
		return noEntityFoundResponse(name);
	}

	@ApiOperation(value = "Get DefinitionType By UUID")
	@GetMapping("/definitiontype/{uuid}")
	public ResponseEntity<?> getDefinitionType(@PathVariable String uuid) {
		Optional<DefinitionType> obj = Optional.of(service.getDefinitionTypeByUuid(uuid));
		if (obj.isPresent()) {
			return ResponseEntity.ok().body(obj.get());
		}
		return noEntityFoundResponse(uuid);
	}

	@ApiOperation(value = "Get DefinitionType by short name")
	@GetMapping("/definitiontype/shortname/{shortName}")
	public ResponseEntity<?> getDefinitionTypeByShortName(@PathVariable String shortName) {
		DefinitionType obj = service.getDefinitionTypeByShortName(shortName);
		if (obj != null) {
			return ResponseEntity.ok().body(obj);
		}
		return noEntityFoundResponse(shortName);
	}

	@ApiOperation(value = "Get all DefinitionTypes")
	@GetMapping("/definitiontypes")
	public Collection<?> getDefinitionTypes() {
		return service.getAllDefinitionTypes();
	}

	@ApiOperation(value = "Get DefinitionTypes by name")
	@GetMapping("/definitiontypes/name/{name}")
	public ResponseEntity<?> getDefinitionTypesByName(@PathVariable String name) {
		List<DefinitionType> list = service.getDefinitionTypesByName(name);
		if (!list.isEmpty()) {
			return ResponseEntity.ok().body(list);
		}
		return noEntityFoundResponse(name);
	}

	@ApiOperation(value = "Get Element By UUID")
	@GetMapping("/element/{uuid}")
	public ResponseEntity<?> getElement(@PathVariable String uuid) {
		Optional<Element> obj = Optional.of(service.getElementByUuid(uuid));
		if (obj.isPresent()) {
			return ResponseEntity.ok().body(obj.get());
		}
		return noEntityFoundResponse(uuid);
	}

	@ApiOperation(value = "Get Element by short name")
	@GetMapping("/element/shortname/{shortName}")
	public ResponseEntity<?> getElementByShortName(@PathVariable String shortName) {
		Element obj = service.getElementByShortName(shortName);
		if (obj != null) {
			return ResponseEntity.ok().body(obj);
		}
		return noEntityFoundResponse(shortName);
	}

	@ApiOperation(value = "Get all Elements")
	@GetMapping("/elements")
	public Collection<?> getElements() {
		return service.getAllElements();
	}

	@ApiOperation(value = "Get Elements by name")
	@GetMapping("/elements/name/{name}")
	public ResponseEntity<?> getElementsByName(@PathVariable String name) {
		List<Element> list = service.getElementsByName(name);
		if (!list.isEmpty()) {
			return ResponseEntity.ok().body(list);
		}
		return noEntityFoundResponse(name);
	}

	@ApiOperation(value = "Update existing Definition")
	@PutMapping("/definition/{uuid}")
	public ResponseEntity<?> updateDefinition(@PathVariable String uuid, @Valid @RequestBody Definition obj) {
		obj.setUuid(uuid);
		LOG.info("Request to update definition: {}", obj);
		return ResponseEntity.ok().body(service.updateDefinition(obj));
	}

	@ApiOperation(value = "Update existing DefinitionType")
	@PutMapping("/definitiontype/{uuid}")
	public ResponseEntity<?> updateDefinitionType(@PathVariable String uuid, @Valid @RequestBody DefinitionType obj) {
		obj.setUuid(uuid);
		LOG.info("Request to update definition type: {}", obj);
		return ResponseEntity.ok().body(service.updateDefinitionType(obj));
	}

	@ApiOperation(value = "Update existing Element")
	@PutMapping("/element/{uuid}")
	public ResponseEntity<?> updateElement(@PathVariable String uuid, @Valid @RequestBody Element obj) {
		obj.setUuid(uuid);
		LOG.info("Request to update element: {}", obj);
		return ResponseEntity.ok().body(service.updateElement(obj));
	}
}