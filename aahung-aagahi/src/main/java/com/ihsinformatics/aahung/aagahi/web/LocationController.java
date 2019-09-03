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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ihsinformatics.aahung.aagahi.dto.LocationDto;
import com.ihsinformatics.aahung.aagahi.model.Definition;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.LocationAttribute;
import com.ihsinformatics.aahung.aagahi.model.LocationAttributeType;
import com.ihsinformatics.aahung.aagahi.service.LocationService;
import com.ihsinformatics.aahung.aagahi.service.MetadataService;
import com.ihsinformatics.aahung.aagahi.util.RegexUtil;
import com.ihsinformatics.aahung.aagahi.util.SearchCriteria;
import com.ihsinformatics.aahung.aagahi.util.SearchOperator;

import io.swagger.annotations.ApiOperation;

/**
 * @author rabbia.hassan@ihsinformatics.com
 */
@RestController
@RequestMapping("/api")
public class LocationController extends BaseController {

	private final Logger LOG = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private LocationService service;

	@Autowired
	private MetadataService metadataService;

	@ApiOperation(value = "Create new Location")
	@PostMapping("/location")
	public ResponseEntity<?> createLocation(@RequestBody Location obj) throws URISyntaxException, AlreadyBoundException {
		LOG.info("Request to create location: {}", obj);
		try {
			Location result = service.saveLocation(obj);
			// See if attributes are attached
			if (obj.getAttributes() != null) {
				service.saveLocationAttributes(obj.getAttributes());
			}
			return ResponseEntity.created(new URI("/api/location/" + result.getUuid())).body(result);
		}
		catch (HibernateException e) {
			LOG.info("Exception occurred while creating object: {}", e.getMessage());
			return super.resourceAlreadyExists(e.getMessage());
		}
	}

	@ApiOperation(value = "Create new LocationAttribute")
	@PostMapping("/locationattribute")
	public ResponseEntity<?> createLocationAttribute(@RequestBody LocationAttribute obj)
	        throws URISyntaxException, AlreadyBoundException {
		LOG.info("Request to create location attribute: {}", obj);
		try {
			LocationAttribute result = service.saveLocationAttribute(obj);
			return ResponseEntity.created(new URI("/api/locationattribute/" + result.getUuid())).body(result);
		}
		catch (HibernateException e) {
			LOG.info("Exception occurred while creating object: {}", e.getMessage());
			return super.resourceAlreadyExists(e.getMessage());
		}
	}

	@ApiOperation(value = "Create new LocationAttributeType")
	@PostMapping("/locationattributetype")
	public ResponseEntity<?> createLocationAttributeType(@RequestBody LocationAttributeType obj)
	        throws URISyntaxException, AlreadyBoundException {
		LOG.info("Request to create location attribute type: {}", obj);
		try {
			LocationAttributeType result = service.saveLocationAttributeType(obj);
			return ResponseEntity.created(new URI("/api/locationattributetype/" + result.getUuid())).body(result);
		}
		catch (HibernateException e) {
			LOG.info("Exception occurred while creating object: {}", e.getMessage());
			return super.resourceAlreadyExists(e.getMessage());
		}
	}

	@ApiOperation(value = "Delete Location")
	@DeleteMapping("/location/{uuid}")
	public ResponseEntity<?> deleteLocation(@PathVariable String uuid) {
		LOG.info("Request to delete location: {}", uuid);
		service.deleteLocation(service.getLocationByUuid(uuid), true);
		return ResponseEntity.noContent().build();
	}

	@ApiOperation(value = "Delete a Location Attribute")
	@DeleteMapping("/locationattribute/{uuid}")
	public ResponseEntity<?> deleteLocationAttribute(@PathVariable String uuid) {
		LOG.info("Request to delete location attribute: {}", uuid);
		service.deleteLocationAttributeType(service.getLocationAttributeTypeByUuid(uuid), false);
		return ResponseEntity.noContent().build();
	}

	@ApiOperation(value = "Delete a LocationAttributeType")
	@DeleteMapping("/locationattributetype/{uuid}")
	public ResponseEntity<?> deleteLocationAttributeType(@PathVariable String uuid) {
		return notImplementedResponse(LocationAttributeType.class.getName());
	}

	@ApiOperation(value = "Get Location By UUID")
	@GetMapping("/location/{uuid}")
	public ResponseEntity<?> getLocation(@PathVariable String uuid) {
		Location obj = service.getLocationByUuid(uuid);
		if (obj != null) {
			return ResponseEntity.ok().body(obj);
		}
		return noEntityFoundResponse(uuid);
	}

	@ApiOperation(value = "Get LocationAttribute by UUID")
	@GetMapping("/locationattribute/{uuid}")
	public ResponseEntity<?> getLocationAttribute(@PathVariable String uuid) {
		LocationAttribute obj = service.getLocationAttributeByUuid(uuid);
		if (obj != null) {
			return ResponseEntity.ok().body(obj);
		}
		return noEntityFoundResponse(uuid);
	}

	@ApiOperation(value = "Get LocationAttributes by Location")
	@GetMapping("/locationattributes/location/{uuid}")
	public ResponseEntity<?> getLocationAttributesByLocation(@PathVariable String uuid) {
		Location location = uuid.matches(RegexUtil.UUID) ? service.getLocationByUuid(uuid)
		        : service.getLocationByShortName(uuid);
		List<LocationAttribute> list = service.getLocationAttributesByLocation(location);
		if (!list.isEmpty()) {
			return ResponseEntity.ok().body(list);
		}
		return noEntityFoundResponse(uuid);
	}

	@ApiOperation(value = "Get LocationAttributeType By UUID")
	@GetMapping("/locationattributetype/{uuid}")
	public ResponseEntity<?> getLocationAttributeType(@PathVariable String uuid) {
		LocationAttributeType obj = service.getLocationAttributeTypeByUuid(uuid);
		if (obj != null) {
			return ResponseEntity.ok().body(obj);
		}
		return noEntityFoundResponse(uuid);
	}

	@ApiOperation(value = "Get Location by short name")
	@GetMapping("/locationattributetype/shortname/{shortName}")
	public ResponseEntity<?> getLocationAttributeTypeByShortName(@PathVariable String shortName) {
		LocationAttributeType obj = service.getLocationAttributeTypeByShortName(shortName);
		if (obj != null) {
			return ResponseEntity.ok().body(obj);
		}
		return noEntityFoundResponse(shortName);
	}

	@ApiOperation(value = "Get all LocationAttributeTypes")
	@GetMapping("/locationattributetypes")
	public Collection<?> getLocationAttributeTypes() {
		return service.getAllLocationAttributeTypes();
	}

	@ApiOperation(value = "Get LocationAttributeType by name")
	@GetMapping("/locationattributetype/name/{name}")
	public ResponseEntity<?> getLocationAttributeTypesByName(@PathVariable String name) {
		LocationAttributeType obj = service.getLocationAttributeTypeByName(name);
		if (obj != null) {
			return ResponseEntity.ok().body(obj);
		}
		return noEntityFoundResponse(name);
	}

	@ApiOperation(value = "Get Locations by name")
	@GetMapping("/locations/name/{name}")
	public ResponseEntity<?> getLocationByName(@PathVariable String name) {
		List<Location> list = service.getLocationsByName(name);
		if (!list.isEmpty()) {
			return ResponseEntity.ok().body(list);
		}
		return noEntityFoundResponse(name);
	}

	@ApiOperation(value = "Get Location by short name")
	@GetMapping("/location/shortname/{shortName}")
	public ResponseEntity<?> getLocationByShortName(@PathVariable String shortName) {
		Location obj = service.getLocationByShortName(shortName);
		if (obj != null) {
			return ResponseEntity.ok().body(obj);
		}
		return noEntityFoundResponse(shortName);
	}

	@ApiOperation(value = "Get list of all Locations (lightweight objects)")
	@GetMapping("/location/list")
	public List<LocationDto> getLocationList() {
		List<Location> list = service.getAllLocations();
		List<LocationDto> locations = new ArrayList<>();
		for (Location location : list) {
			locations.add(new LocationDto(location.getLocationId(), location.getLocationName(), location.getShortName(),
			        location.getUuid(), location.getCategory().getUuid()));
		}
		return locations;
	}

	@ApiOperation(value = "Get all Locations")
	@GetMapping("/locations")
	public Collection<?> getLocations() {
		return service.getAllLocations();
	}

	@ApiOperation(value = "Get Locations by Address")
	@GetMapping(value = "/locations/address", params = { "address", "cityVillage", "stateProvince", "country" })
	public ResponseEntity<?> getLocationsByAddress(@RequestParam("address") String address,
	        @RequestParam("cityVillage") String cityVillage, @RequestParam("stateProvince") String stateProvince,
	        @RequestParam("country") String country) throws HibernateException {
		List<Location> list = service.getLocationsByAddress(address, cityVillage, stateProvince, country);
		if (!list.isEmpty()) {
			return ResponseEntity.ok().body(list);
		}
		return noEntityFoundResponse("Search by Address");
	}

	@ApiOperation(value = "Get Locations by category")
	@GetMapping("/locations/category/{uuid}")
	public ResponseEntity<?> getLocationsByCategory(@PathVariable String uuid) {
		Definition category = uuid.matches(RegexUtil.UUID) ? metadataService.getDefinitionByUuid(uuid)
		        : metadataService.getDefinitionByShortName(uuid);
		List<Location> list = service.getLocationsByCategory(category);
		if (!list.isEmpty()) {
			return ResponseEntity.ok().body(list);
		}
		return noEntityFoundResponse(uuid);
	}

	@ApiOperation(value = "Get Locations by Contact")
	@GetMapping(value = "/locations/contact", params = { "contact", "primaryContactOnly" })
	public ResponseEntity<?> getLocationsByContact(@RequestParam("contact") String contact,
	        @RequestParam("primaryContactOnly") Boolean primaryContactOnly) throws HibernateException {
		if (primaryContactOnly == null) {
			primaryContactOnly = Boolean.TRUE;
		}
		List<Location> list = service.getLocationsByContact(contact, primaryContactOnly);
		if (!list.isEmpty()) {
			return ResponseEntity.ok().body(list);
		}
		return noEntityFoundResponse("Search by Contact");
	}

	@ApiOperation(value = "Get Locations by parent Location")
	@GetMapping("/locations/parent/{uuid}")
	public ResponseEntity<?> getLocationsByParent(@PathVariable String uuid) {
		Location parent = uuid.matches(RegexUtil.UUID) ? service.getLocationByUuid(uuid)
		        : service.getLocationByShortName(uuid);
		List<Location> list = service.getLocationsByParent(parent);
		if (!list.isEmpty()) {
			return ResponseEntity.ok().body(list);
		}
		return noEntityFoundResponse(uuid);
	}

	@ApiOperation(value = "Get Locations by various parameters")
	@GetMapping(value = "/locations/search", params = { "category", "parent", "landmark1", "landmark2", "cityVillage",
	        "stateProvince", "country", "primaryContact", "primaryContactPerson", "secondaryContact",
	        "secondaryContactPerson", "email" })
	public ResponseEntity<?> searchLocations(@RequestParam("category") String categoryUuid,
	        @RequestParam("parent") String parentUuid, @RequestParam("landmark1") String landmark1,
	        @RequestParam("landmark2") String landmark2, @RequestParam("cityVillage") String cityVillage,
	        @RequestParam("stateProvince") String stateProvince, @RequestParam("country") String country,
	        @RequestParam("primaryContact") String primaryContact,
	        @RequestParam("primaryContactPerson") String primaryContactPerson,
	        @RequestParam("secondaryContact") String secondaryContact,
	        @RequestParam("secondaryContactPerson") String secondaryContactPerson, @RequestParam("email") String email)
	        throws HibernateException {
		List<SearchCriteria> params = new ArrayList<>();
		if (categoryUuid != null) {
			Definition category = metadataService.getDefinitionByUuid(categoryUuid);
			params.add(new SearchCriteria("category", SearchOperator.EQUALS, category));
		}
		if (parentUuid != null) {
			Location parent = service.getLocationByUuid(parentUuid);
			params.add(new SearchCriteria("parentLocation", SearchOperator.EQUALS, parent));
		}
		if (landmark1 != null) {
			params.add(new SearchCriteria("landmark1", SearchOperator.LIKE, landmark1));
		}
		if (landmark2 != null) {
			params.add(new SearchCriteria("landmark2", SearchOperator.LIKE, landmark2));
		}
		if (cityVillage != null) {
			params.add(new SearchCriteria("cityVillage", SearchOperator.LIKE, cityVillage));
		}
		if (stateProvince != null) {
			params.add(new SearchCriteria("stateProvince", SearchOperator.LIKE, stateProvince));
		}
		if (country != null) {
			params.add(new SearchCriteria("country", SearchOperator.EQUALS, country));
		}
		if (primaryContact != null) {
			params.add(new SearchCriteria("primaryContact", SearchOperator.EQUALS, primaryContact));
		}
		if (primaryContactPerson != null) {
			params.add(new SearchCriteria("primaryContactPerson", SearchOperator.LIKE, primaryContactPerson));
		}
		if (secondaryContact != null) {
			params.add(new SearchCriteria("secondaryContact", SearchOperator.EQUALS, secondaryContact));
		}
		if (secondaryContactPerson != null) {
			params.add(new SearchCriteria("secondaryContactPerson", SearchOperator.LIKE, secondaryContactPerson));
		}
		if (email != null) {
			params.add(new SearchCriteria("email", SearchOperator.EQUALS, email));
		}
		List<Location> list = service.searchLocation(params);
		if (!list.isEmpty()) {
			return ResponseEntity.ok().body(list);
		}
		return noEntityFoundResponse(Arrays.toString(params.toArray()));
	}

	@ApiOperation(value = "Update existing Location")
	@PutMapping("/location/{uuid}")
	public ResponseEntity<?> updateLoction(@PathVariable String uuid, @Valid @RequestBody Location obj) {
		obj.setUuid(uuid);
		LOG.info("Request to update location: {}", obj);
		return ResponseEntity.ok().body(service.updateLocation(obj));
	}

	@ApiOperation(value = "Update existing LocationAttribute")
	@PutMapping("/locationattribute/{uuid}")
	public ResponseEntity<?> updateLoctionAttribute(@PathVariable String uuid, @Valid @RequestBody LocationAttribute obj) {
		obj.setUuid(uuid);
		LOG.info("Request to update location attribute: {}", obj);
		return ResponseEntity.ok().body(service.updateLocationAttribute(obj));
	}

	@ApiOperation(value = "Update existing LocationAttributeType")
	@PutMapping("/locationattributetype/{uuid}")
	public ResponseEntity<?> updateLoctionAttributeType(@PathVariable String uuid,
	        @Valid @RequestBody LocationAttributeType obj) {
		obj.setUuid(uuid);
		LOG.info("Request to update location attribute type: {}", obj);
		return ResponseEntity.ok().body(service.updateLocationAttributeType(obj));
	}

}
