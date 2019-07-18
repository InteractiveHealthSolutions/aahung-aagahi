/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/
package com.ihsinformatics.aahung.aagahi.service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.model.Person;
import com.ihsinformatics.aahung.aagahi.repository.ParticipantRepository;
import com.ihsinformatics.aahung.aagahi.repository.PersonRepository;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Component
public class ParticipantServiceImpl implements ParticipantService {

	@Autowired
	private ParticipantRepository participantRepository;

	@Autowired
	private PersonRepository personRepository;

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.ParticipantService#getParticipant(java.lang.Long)
	 */
	@Override
	public Participant getParticipant(String uuid) {
		return participantRepository.findByUuid(uuid);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.ParticipantService#getParticipants()
	 */
	@Override
	public List<Participant> getParticipants() {
		return participantRepository.findAll();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.ParticipantService#getParticipants(java.lang.String)
	 */
	@Override
	public List<Participant> getParticipantsByName(String name) {
		if (name.toLowerCase().matches("admin|administrator")) {
			return Collections.emptyList();
		}
		List<Person> people = personRepository.findByPersonName(name, name, name, name);
		List<Participant> participants = Arrays.asList();
		people.forEach(person -> participants.add(participantRepository.findByUuid(person.getUuid())));
		return participants;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.ParticipantService#saveParticipant(com.ihsinformatics.
	 * cidemoapp.model.Participant)
	 */
	@Override
	public Participant saveParticipant(Participant participant) {
		return participantRepository.save(participant);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.ParticipantService#updateParticipant(com.
	 * ihsinformatics.cidemoapp.model.Participant)
	 */
	@Override
	public Participant updateParticipant(Participant participant) {
		return participantRepository.save(participant);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.ParticipantService#deleteParticipant(com.
	 * ihsinformatics.cidemoapp.model.Participant)
	 */
	@Override
	public void deleteParticipant(Participant participant) {
		participantRepository.delete(participant);
	}

}
