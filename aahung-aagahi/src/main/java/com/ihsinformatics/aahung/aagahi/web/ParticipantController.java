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
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ihsinformatics.aahung.aagahi.dto.ParticipantDto;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.model.Person;
import com.ihsinformatics.aahung.aagahi.service.LocationService;
import com.ihsinformatics.aahung.aagahi.service.ParticipantService;
import com.ihsinformatics.aahung.aagahi.service.PersonService;
import com.ihsinformatics.aahung.aagahi.util.RegexUtil;
import com.ihsinformatics.aahung.aagahi.util.SearchCriteria;
import com.ihsinformatics.aahung.aagahi.util.SearchOperator;

import io.swagger.annotations.ApiOperation;

/**
 * @author rabbia.hassan@ihsinformatics.com
 */
@RestController
@RequestMapping("/api")
public class ParticipantController extends BaseController {

	private final Logger LOG = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private ParticipantService participantService;

	@Autowired
	private PersonService personService;

	@Autowired
	private LocationService locationService;

	@ApiOperation(value = "Get All Participants / Search participant on different Criteria")
	@GetMapping("/participants/list")
	@ResponseBody
	public ResponseEntity<?> getLocationsLists(@RequestParam(value = "locId", required = false) List<Integer> locIds,
	        @RequestParam(value = "locShortName", required = false) List<String> locShortNames) {
		List<ParticipantDto> mappedParticipant = new ArrayList<>();
		List<Participant> participant = new ArrayList<>();
		if (locIds == null && locShortNames == null) {
			// TODO: Disallow this
		} else if (locIds != null) {
			for (int locationId : locIds) {
				Location loc = locationService.getLocationById(locationId);
				if (loc != null)
					participant.addAll(participantService.getParticipantsByLocation(loc));
			}
		} else if (locShortNames != null) {
			for (String shortName : locShortNames) {
				Location loc = locationService.getLocationByShortName(shortName);
				participant.addAll(participantService.getParticipantsByLocation(loc));
			}
		}
		for (Participant p : participant) {
			ParticipantDto mp = new ParticipantDto(p.getParticipantId(),
			        (p.getPerson().getFirstName() + " " + p.getPerson().getMiddleName() + " " + p.getPerson().getLastName())
			                .trim(),
			        p.getIdentifier(), p.getUuid(), p.getLocation().getLocationName());
			mappedParticipant.add(mp);
		}
		return ResponseEntity.ok(mappedParticipant);
	}

	/* Participant */

	// http://localhost:8080/aahung-aagahi/api/Participants?search=test123
	// http://localhost:8080/aahung-aagahi/api/participants?locId=3,1
	// http://localhost:8080/aahung-aagahi/api/participants?locShortName=test,test123
	@ApiOperation(value = "Get All Participants / Search Participants on different Criteria")
	@GetMapping("/participants")
	@ResponseBody
	public List<Participant> getParticipants(@RequestParam(value = "search", required = false) String search,
	        @RequestParam(value = "locId", required = false) List<Integer> locIds,
	        @RequestParam(value = "locShortName", required = false) List<String> locShortNames) {
		List<SearchCriteria> params = new ArrayList<SearchCriteria>();
		if (search != null) {
			if (!search.contains(":")) {
				List<Participant> locList = new ArrayList<>();
				String[] splitArray = search.split(",");
				for (String s : splitArray) {
					Participant participant = participantService.getParticipantByIdentifier(s);
					if (participant != null)
						locList.add(participant);
					else
						locList.addAll(participantService.getParticipantsByName(s));
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
		} else if (locIds != null) {
			List<Participant> participantList = new ArrayList<>();
			for (int locationId : locIds) {
				Location loc = locationService.getLocationById(locationId);
				if (loc != null)
					participantList.addAll(participantService.getParticipantsByLocation(loc));
			}
			return participantList;
		} else if (locShortNames != null) {
			List<Participant> participantList = new ArrayList<>();
			for (String shortName : locShortNames) {
				Location location = locationService.getLocationByShortName(shortName);
				participantList.addAll(participantService.getParticipantsByLocation(location));
			}
			return participantList;
		}
		return participantService.searchParticipants(params);
	}

	@ApiOperation(value = "Get Participants for specific location uuid")
	@GetMapping("/location/{uuid}/participants")
	public List<Participant> getParticipantsByLocation(@PathVariable String uuid) {
		List<Participant> participants = new ArrayList<>();
		Location obj = uuid.matches(RegexUtil.UUID) ? locationService.getLocationByUuid(uuid) : locationService.getLocationByShortName(uuid);
		if (obj != null) {
			participants = participantService.getParticipantsByLocation(obj);
			return participants;
		}
		return participants;
	}

	@ApiOperation(value = "Get Participant by UUID")
	@GetMapping("/participant/{uuid}")
	public ResponseEntity<Participant> getParticipant(@PathVariable String uuid) {
		Optional<Participant> participant = Optional.of(participantService.getParticipantByUuid(uuid));
		return participant.map(response -> ResponseEntity.ok().body(response))
		        .orElse(new ResponseEntity<Participant>(HttpStatus.NOT_FOUND));
	}

	@ApiOperation(value = "Create a new Participant")
	@PostMapping("/participant")
	public ResponseEntity<Participant> createParticipant(@Valid @RequestBody Participant participant)
	        throws URISyntaxException, AlreadyBoundException {
		LOG.info("Request to create Participant: {}", participant);
		Person pResult = personService.savePerson(participant.getPerson());
		if (pResult != null) {
			participant.setPerson(pResult);
			Participant result = participantService.saveParticipant(participant);
			return ResponseEntity.created(new URI("/api/participant/" + result.getUuid())).body(result);
		}
		return null;
	}

	@ApiOperation(value = "Delete a Participant")
	@DeleteMapping("/participant/{uuid}")
	public ResponseEntity<Participant> deleteParticipant(@PathVariable String uuid) {
		LOG.info("Request to delete Participant: {}", uuid);
		participantService.deleteParticipant(participantService.getParticipantByUuid(uuid));
		return ResponseEntity.noContent().build();
	}
}
