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
import java.util.HashSet;
import java.util.List;
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

import com.ihsinformatics.aahung.aagahi.dto.LocationMapper;
import com.ihsinformatics.aahung.aagahi.dto.ParticipantMapper;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.LocationAttributeType;
import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.model.Person;
import com.ihsinformatics.aahung.aagahi.model.PersonAttributeType;
import com.ihsinformatics.aahung.aagahi.model.User;
import com.ihsinformatics.aahung.aagahi.service.LocationService;
import com.ihsinformatics.aahung.aagahi.service.ParticipantService;
import com.ihsinformatics.aahung.aagahi.service.PersonService;
import com.ihsinformatics.aahung.aagahi.util.SearchCriteria;

import io.swagger.annotations.ApiOperation;

/**
 * @author rabbia.hassan@ihsinformatics.com
 */
@RestController
@RequestMapping("/api")
public class ParticipantController {

	private final Logger LOG = LoggerFactory.getLogger(this.getClass());

	private ParticipantService service;
	private PersonService personService;
	private LocationService locationService;

	public ParticipantController(ParticipantService service, LocationService locationService, PersonService personService) {
		this.service = service;
		this.locationService = locationService;
		this.personService = personService;
	}
	
	@ApiOperation(value = "Get All Participants / Search participant on different Criteria")
	@RequestMapping(method = RequestMethod.GET, value = "/participants/list")
    @ResponseBody
    public ResponseEntity<?> getLocationsLists(@RequestParam(value = "locId", required = false) List<Integer> locIds,
    		@RequestParam(value = "locShortName", required = false) List<String> locShortNames) {
		List<ParticipantMapper> mappedParticipant = new ArrayList();
		List<Participant> participant = new ArrayList();

		if(locIds == null && locShortNames == null){
			participant = service.getParticipants();
		}
		else if (locIds != null){
        	
        	for(int locationId : locIds){
        		Location loc = locationService.getLocationById(locationId);
        		if(loc != null)
        			participant.addAll(service.getParticipantsByLocationShortName(loc.getShortName()));
        	}	
		} else if (locShortNames != null){
		
			for(String shortName : locShortNames){
				participant.addAll(service.getParticipantsByLocationShortName(shortName));
        	}
			
		}
		
		for(Participant p : participant){
			
			ParticipantMapper mp = new ParticipantMapper(p.getParticipantId(),(p.getPerson().getFirstName() + " " + p.getPerson().getMiddleName() + " " + p.getPerson().getLastName()).trim(),p.getShortName(),p.getUuid(),p.getLocation().getLocationName());
			mappedParticipant.add(mp);
			
		}
		
        return ResponseEntity.ok(mappedParticipant);
    }
	
	
	
	/* Participant */
	
	// http://localhost:8080/aahung-aagahi/api/Participants?search=test123
	// http://localhost:8080/aahung-aagahi/api/participants?locId=3,1
	// http://localhost:8080/aahung-aagahi/api/participants?locShortName=test,test123
	@ApiOperation(value = "Get All Participants / Search Participants on different Criteria")
	@RequestMapping(method = RequestMethod.GET, value = "/participants")
    @ResponseBody
    public List<Participant> getParticipants(@RequestParam(value = "search", required = false) String search, @RequestParam(value = "locId", required = false) List<Integer> locIds,
    		 @RequestParam(value = "locShortName", required = false) List<String> locShortNames) {
        List<SearchCriteria> params = new ArrayList<SearchCriteria>();
        if (search != null) {
        	
        	if(!search.contains(":")){
        		
        		List<Participant> locList =  new ArrayList();
        		String[] splitArray = search.split(",");
        		
        		for(String s : splitArray){
	        		Participant participant = service.getParticipantByShortName(s);
	        		if(participant != null)
	        			locList.add(participant);
	        		else 
	        			locList.addAll( service.getParticipantsByName(s));
        		}
        		
        		return locList;
        		        		
        	}else {
        	
	            Pattern pattern = Pattern.compile("(\\w+?)(:|<|>)(\\w+?),");
	            Matcher matcher = pattern.matcher(search + ",");
	            while (matcher.find()) {
	                params.add(new SearchCriteria(matcher.group(1), 
	                  matcher.group(2), matcher.group(3)));
	            }
	            
        	}
        }
        
        else if (locIds != null){
        	
        	List<Participant> participantList = new ArrayList<Participant>();
        	
        	for(int locationId : locIds){
        		Location loc = locationService.getLocationById(locationId);
        		if(loc != null)
        			participantList.addAll(service.getParticipantsByLocationShortName(loc.getShortName()));
        	}
        		
        	return participantList;
        	
        }
        
        else if (locShortNames != null){
        	
        	List<Participant> participantList = new ArrayList<Participant>();
        	
        	for(String shortName : locShortNames){
        		participantList.addAll(service.getParticipantsByLocationShortName(shortName));
        	}
        		
        	return participantList;
        	
        }
        
        return service.searchParticipants(params);
    }
	
	
	@ApiOperation(value = "Get Participants for specific location uuid")
	@GetMapping("/location/{uuid}/participants")
	public List<Participant> readParticipantsByLocationUuid(@PathVariable String uuid) {
		
		List<Participant> participant = new ArrayList<Participant>();
		Optional<Location> location = Optional.of(locationService.getLocationByUuid(uuid));
		if(location == null)
			return participant;
		else {
			participant = service.getParticipantsByLocationShortName(location.get().getShortName());
			return participant;
		}
	}
	
    @ApiOperation(value = "Get Participant by UUID")
	@GetMapping("/participant/{uuid}")
	public ResponseEntity<Participant> readParticipant(@PathVariable String uuid) {
		Optional<Participant> participant = Optional.of(service.getParticipantByUuid(uuid));
		return participant.map(response -> ResponseEntity.ok().body(response))
		        .orElse(new ResponseEntity<Participant>(HttpStatus.NOT_FOUND));
	}

    @ApiOperation(value = "Create a new Participant")
	@PostMapping("/participant")
	public ResponseEntity<Participant> createParticipant(@Valid @RequestBody Participant participant) throws URISyntaxException, AlreadyBoundException {
		LOG.info("Request to create Participant: {}", participant);
		
		Person pResult = personService.savePerson(participant.getPerson());
		if(pResult!=null){
			participant.setPerson(pResult);
			participant.setParticipantId(pResult.getPersonId());
			Participant result = service.saveParticipant(participant);
			return ResponseEntity.created(new URI("/api/participant/" + result.getUuid())).body(result);
		}
		return null;
	}

    /*@ApiOperation(value = "Update an existing Location Attribute Type")
	@PutMapping("/user/{uuid}")
	public ResponseEntity<User> updateUser(@PathVariable String uuid, @Valid @RequestBody LocationAttributeType locationAttributeType) {
    	locationAttributeType.setUuid(uuid);
		LOG.info("Request to update user: {}", locationAttributeType);
		LocationAttributeType result = service.updateLocationAttributeType(locationAttributeType);
		return ResponseEntity.ok().body(result);
	}*/

    @ApiOperation(value = "Delete a Participant")
	@DeleteMapping("/participant/{uuid}")
	public ResponseEntity<Participant> deleteParticipant(@PathVariable String uuid) {
		LOG.info("Request to delete Participant: {}", uuid);
		service.deleteParticipant(service.getParticipantByUuid(uuid));
		return ResponseEntity.noContent().build();
	}
    
    
    @ApiOperation(value = "Get all Person Attribute Types")
	@GetMapping("/personAttributeTypes")
	public Collection<PersonAttributeType> getPersonAttributeTypes(@RequestParam(value = "shortName", required = false) String shortName) {

		if(shortName != null){
			
			List<PersonAttributeType> locList =  new ArrayList();
    		String[] splitArray = shortName.split(",");
    		
    		for(String s : splitArray){
    			PersonAttributeType personAttributeType = personService.getPersonAttributeTypeByShortName(s);
    			locList.add(personAttributeType);
    		}
    		
    		return locList;
			
		}
		return personService.getAllPersonAttributeTypes();
	}
	
}
