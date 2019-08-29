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
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ihsinformatics.aahung.aagahi.dto.LocationMapper;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.LocationAttributeType;
import com.ihsinformatics.aahung.aagahi.service.LocationService;
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

	private LocationService service;

	public LocationController(LocationService service) {
		this.service = service;
	}

	@ApiOperation(value = "Get All Locations / Search Location on different Criteria")
	@GetMapping("/locations/list")
	@ResponseBody
	public ResponseEntity<?> getLocationsLists(@RequestParam(value = "city", required = false) String city,
	        @RequestParam(value = "category", required = false) String category) {
		List<LocationMapper> mappedLocation = new ArrayList<>();
		List<Location> list = service.getAllLocations();
		for (Location loc : list) {
			if (city != null || category != null) {
				Boolean add = true;
				if (city != null && !city.equalsIgnoreCase(loc.getCityVillage())) {
					add = false;
				}
				if (category != null && !category.equalsIgnoreCase(loc.getCategory().getDefinitionName())) {
					add = false;
				}
				if (add) {
					LocationMapper mp = new LocationMapper(loc.getLocationId(), loc.getLocationName(), loc.getShortName(),
					        loc.getUuid(), loc.getCategory().getDefinitionName());
					mappedLocation.add(mp);
				}
			} else {
				LocationMapper mp = new LocationMapper(loc.getLocationId(), loc.getLocationName(), loc.getShortName(),
				        loc.getUuid(), loc.getCategory().getDefinitionName());
				mappedLocation.add(mp);
			}
		}
		return ResponseEntity.ok(mappedLocation);
	}

	/* Location */

	// Example: http://localhost:8080/aahung-aagahi/api/locations?search=shortName:test123,locationName:abc
	// http://localhost:8080/aahung-aagahi/api/locations?search=test123
	//	http://localhost:8080/aahung-aagahi/api/locations?search=test123,ihk123
	@ApiOperation(value = "Get All Locations / Search Location on different Criteria")
	@GetMapping("/locations")
	@ResponseBody
	public List<Location> getLocations(@RequestParam(value = "search", required = false) String search) {
		List<SearchCriteria> params = new ArrayList<SearchCriteria>();
		if (search != null) {
			if (!search.contains(":")) {
				List<Location> locList = new ArrayList<>();
				String[] splitArray = search.split(",");
				for (String s : splitArray) {
					Location location = service.getLocationByShortName(s);
					if (location != null)
						locList.add(location);
					else
						locList.addAll(service.getLocationByName(s));
				}
				return locList;
			} else {
				Pattern pattern = Pattern.compile("(\\w+?)(:|<|>)(\\w+?),");
				Matcher matcher = pattern.matcher(search + ",");
				while (matcher.find()) {
					params.add(new SearchCriteria(matcher.group(1),
					        SearchOperator.getSearchOperatorByAlias(matcher.group(2)), matcher.group(3)));
				}
			}
		}
		return service.searchLocation(params);
	}

	@ApiOperation(value = "Get All Locations / Search Location on different Criteria")
	@GetMapping("/location/list")
	@ResponseBody
	public List<List<String>> getLocationList() {
		List<Location> list = service.getAllLocations();
		List<List<String>> map = new ArrayList<>();
		for (Location location : list) {
			ArrayList<String> locationAsList = new ArrayList<>();
			locationAsList.add(location.getUuid());
			locationAsList.add(location.getShortName());
			map.add(locationAsList);
		}
		return map;
	}

	@ApiOperation(value = "Get Location By UUID")
	@GetMapping("/location/{uuid}")
	public ResponseEntity<Location> getLocation(@PathVariable String uuid) {
		Optional<Location> location = Optional.of(service.getLocationByUuid(uuid));
		return location.map(response -> ResponseEntity.ok().body(response))
		        .orElse(new ResponseEntity<Location>(HttpStatus.NOT_FOUND));
	}

	@ApiOperation(value = "Create New Location")
	@PostMapping("/location")
	public ResponseEntity<Location> createLocation(@Valid @RequestBody Location location)
	        throws URISyntaxException, AlreadyBoundException {
		LOG.info("Request to create location: {}", location);
		Location result = service.saveLocation(location);
		return ResponseEntity.created(new URI("/api/location/" + result.getUuid())).body(result);
	}

	@ApiOperation(value = "Update existing Location")
	@PutMapping("/location/{uuid}")
	public ResponseEntity<Location> updateLoction(@PathVariable String uuid, @Valid @RequestBody Location location) {
		location.setUuid(uuid);
		LOG.info("Request to update location: {}", location);
		Location result = service.updateLocation(location);
		return ResponseEntity.ok().body(result);
	}

	@ApiOperation(value = "Delete Location")
	@DeleteMapping("/location/{uuid}")
	public ResponseEntity<Location> deleteLocation(@PathVariable String uuid) {
		LOG.info("Request to delete location: {}", uuid);
		service.deleteLocation(service.getLocationByUuid(uuid), true);
		return ResponseEntity.ok().build();
	}

	/* Location Attributes Type */

	@ApiOperation(value = "Get all Location Attribute Types")
	@GetMapping("/locationAttributeTypes")
	public Collection<LocationAttributeType> getLocationAttributeTypes(
	        @RequestParam(value = "shortName", required = false) String shortName) {

		if (shortName != null) {

			List<LocationAttributeType> locList = new ArrayList<>();
			String[] splitArray = shortName.split(",");

			for (String s : splitArray) {
				LocationAttributeType locationAttributeType = service.getLocationAttributeTypeByShortName(s);
				locList.add(locationAttributeType);
			}

			return locList;

		}
		return service.getAllLocationAttributeTypes();
	}

	@ApiOperation(value = "Get Location Attribute Type by UUID")
	@GetMapping("/locationAttributeType/{uuid}")
	public ResponseEntity<LocationAttributeType> readLocationAttributeType(@PathVariable String uuid) {
		Optional<LocationAttributeType> locationAttributeType = Optional.of(service.getLocationAttributeTypeByUuid(uuid));
		return locationAttributeType.map(response -> ResponseEntity.ok().body(response))
		        .orElse(new ResponseEntity<LocationAttributeType>(HttpStatus.NOT_FOUND));
	}

	@ApiOperation(value = "Create a new Location Attribute Type")
	@PostMapping("/locationAttributeType")
	public ResponseEntity<LocationAttributeType> createLocationAttributeType(
	        @Valid @RequestBody LocationAttributeType locationAttributeType)
	        throws URISyntaxException, AlreadyBoundException {
		LOG.info("Request to create Location AttributeType: {}", locationAttributeType);
		LocationAttributeType result = service.saveLocationAttributeType(locationAttributeType);
		return ResponseEntity.created(new URI("/api/locationAttributeType/" + result.getUuid())).body(result);
	}

	@ApiOperation(value = "Delete a Location Attribute Type")
	@DeleteMapping("/locationAttributeType/{uuid}")
	public ResponseEntity<LocationAttributeType> deleteLocationAttributeType(@PathVariable String uuid) {
		LOG.info("Request to delete Location AttributeType: {}", uuid);
		service.deleteLocationAttributeType(service.getLocationAttributeTypeByUuid(uuid), false);
		return ResponseEntity.noContent().build();
	}
}
