/* Copyright(C) 2018 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/
package com.ihsinformatics.aahung.aagahi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.repository.ParticipantRepository;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Component
public class ServiceImpl implements Service {

	@Autowired
	private ParticipantRepository participantRepository;

	@Autowired
	MongoTemplate mongoTemplate;

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.Service#getParticipant(java.lang.Long)
	 */
	@Override
	public Participant getParticipant(String uuid) {
		return participantRepository.findByUuid(uuid);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.Service#getParticipants()
	 */
	@Override
	public List<Participant> getParticipants() {
		return participantRepository.findAll();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.Service#getParticipants(java.lang.String)
	 */
	@Override
	public List<Participant> getParticipantsByName(String name) {
		if (name.toLowerCase().matches("admin|administrator")) {
			return null;
		}
		return participantRepository.findByParticipantName(name, name, name);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.Service#saveParticipant(com.ihsinformatics.
	 * cidemoapp.model.Participant)
	 */
	@Override
	public Participant saveParticipant(Participant participant) {
		return participantRepository.save(participant);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.Service#updateParticipant(com.
	 * ihsinformatics.cidemoapp.model.Participant)
	 */
	@Override
	public Participant updateParticipant(Participant participant) {
		return participantRepository.save(participant);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.Service#deleteParticipant(com.
	 * ihsinformatics.cidemoapp.model.Participant)
	 */
	@Override
	public void deleteParticipant(Participant participant) {
		participantRepository.delete(participant);
	}

}
