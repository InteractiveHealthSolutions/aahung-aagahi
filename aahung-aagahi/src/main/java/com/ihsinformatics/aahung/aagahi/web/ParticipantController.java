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
import java.util.List;

import javax.validation.Valid;

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

import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.service.LocationService;
import com.ihsinformatics.aahung.aagahi.service.ParticipantService;
import com.ihsinformatics.aahung.aagahi.util.RegexUtil;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

/**
 * @author rabbia.hassan@ihsinformatics.com
 */
@RestController
@RequestMapping("/api")
@Api(value = "Participant Controller")
public class ParticipantController extends BaseController {

    private final Logger LOG = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private ParticipantService service;

    @Autowired
    private LocationService locationService;

    @ApiOperation(value = "Create new Participant")
    @PostMapping("/participant")
    public ResponseEntity<?> createParticipant(@RequestBody Participant obj)
	    throws URISyntaxException, AlreadyBoundException {
	LOG.info("Request to create participant: {}", obj);
	try {
	    Participant result = service.saveParticipant(obj);
	    return ResponseEntity.created(new URI("/api/participant/" + result.getUuid())).body(result);
	} catch (Exception e) {
	    return exceptionFoundResponse("Reference object: " + obj, e);
	}
    }

    @ApiOperation(value = "Delete Participant")
    @DeleteMapping("/participant/{uuid}")
    public ResponseEntity<?> deleteParticipant(@PathVariable String uuid) {
	LOG.info("Request to delete participant: {}", uuid);
	try {
	    service.deleteParticipant(service.getParticipantByUuid(uuid));
	} catch (Exception e) {
	    return exceptionFoundResponse("Reference object: " + uuid, e);
	}
	return ResponseEntity.noContent().build();
    }

    @ApiOperation(value = "Get Participant By UUID")
    @GetMapping("/participant/{uuid}")
    public ResponseEntity<?> getParticipant(@PathVariable String uuid) {
	Participant obj = service.getParticipantByUuid(uuid);
	if (obj != null) {
	    return ResponseEntity.ok().body(obj);
	}
	return noEntityFoundResponse(uuid);
    }

    @ApiOperation(value = "Get Participant By Identifier")
    @GetMapping("/participant/identifier/{identifier}")
    public ResponseEntity<?> getParticipantByIdentifier(@PathVariable String identifier) {
	Participant obj = service.getParticipantByIdentifier(identifier);
	if (obj != null) {
	    return ResponseEntity.ok().body(obj);
	}
	return noEntityFoundResponse(identifier);
    }

    @ApiOperation(value = "Get Participants by Location")
    @GetMapping("/participants/location/{uuid}")
    public ResponseEntity<?> getParticipantsByLocation(@PathVariable String uuid) {
	Location location = uuid.matches(RegexUtil.UUID) ? locationService.getLocationByUuid(uuid)
		: locationService.getLocationByShortName(uuid);
	List<Participant> list = service.getParticipantsByLocation(location);
	if (!list.isEmpty()) {
	    return ResponseEntity.ok().body(list);
	}
	return noEntityFoundResponse(uuid);
    }

    @ApiOperation(value = "Get Participants by name")
    @GetMapping("/participant/name/{name}")
    public ResponseEntity<?> getParticipantsByName(@PathVariable String name) {
	List<Participant> list = service.getParticipantsByName(name);
	if (!list.isEmpty()) {
	    return ResponseEntity.ok().body(list);
	}
	return noEntityFoundResponse(name);
    }

    @ApiOperation(value = "Update existing Participant")
    @PutMapping("/participant/{uuid}")
    public ResponseEntity<?> updateParticipant(@PathVariable String uuid, @Valid @RequestBody Participant obj) {
	Participant found = service.getParticipantByUuid(uuid);
	if (found == null) {
	    return noEntityFoundResponse(uuid);
	}
	obj.setPerson(found.getPerson());
	obj.setUuid(found.getUuid());
	LOG.info("Request to update participant: {}", obj);
	return ResponseEntity.ok().body(service.updateParticipant(obj));
    }
}
