/* Copyright(C) 2018 Interactive Health Solutions, Pvt. Ltd.

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
import java.util.Collection;
import java.util.Optional;

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
import org.springframework.web.bind.annotation.RestController;

import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.service.Service;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RestController
@RequestMapping("/api")
public class ParticipantController {

	private final Logger log = LoggerFactory.getLogger(ParticipantController.class);

	private Service service;

	public ParticipantController(Service service) {
		this.service = service;
	}

	@GetMapping("/participants")
	Collection<Participant> participants() {
		return service.getParticipants();
	}

	@GetMapping("/participant/{uuid}")
	ResponseEntity<Participant> getParticipant(@PathVariable String uuid) {
		Optional<Participant> participant = Optional.of(service.getParticipant(uuid));
		return participant.map(response -> ResponseEntity.ok().body(response))
		        .orElse(new ResponseEntity<Participant>(HttpStatus.NOT_FOUND));
	}

	@PostMapping("/participant")
	ResponseEntity<Participant> createParticipant(@Valid @RequestBody Participant participant) throws URISyntaxException {
		log.info("Request to create participant: {}", participant);
		Participant result = service.saveParticipant(participant);
		return ResponseEntity.created(new URI("/api/participant/" + result.getUuid())).body(result);
	}

	@PutMapping("/participant/{uuid}")
	ResponseEntity<Participant> updateParticipant(@PathVariable String uuid, @Valid @RequestBody Participant participant) {
		participant.setUuid(uuid);
		log.info("Request to update participant: {}", participant);
		Participant result = service.saveParticipant(participant);
		return ResponseEntity.ok().body(result);
	}

	@DeleteMapping("/participant/{uuid}")
	public ResponseEntity<?> deleteParticipant(@PathVariable String uuid) {
		log.info("Request to delete participant: {}", uuid);
		service.deleteParticipant(service.getParticipant(uuid));
		return ResponseEntity.ok().build();
	}
}
