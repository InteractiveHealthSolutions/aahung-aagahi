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
import java.util.Optional;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.hibernate.HibernateException;
import org.springframework.stereotype.Component;

import com.ihsinformatics.aahung.aagahi.annotation.MeasureProcessingTime;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.model.Person;
import com.ihsinformatics.aahung.aagahi.model.PersonAttribute;
import com.ihsinformatics.aahung.aagahi.util.SearchCriteria;
import com.ihsinformatics.aahung.aagahi.util.SearchQueryCriteriaConsumer;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Component
public class ParticipantServiceImpl extends BaseService implements ParticipantService {

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.ParticipantService#deleteParticipant(com.
	 * ihsinformatics.cidemoapp.model.Participant)
	 */
	@Override
	public void deleteParticipant(Participant obj) {
		participantRepository.delete(obj);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.ParticipantService#getParticipantById(java.lang.Integer)
	 */
	@Override
	public Participant getParticipantById(Integer id) throws HibernateException {
		Optional<Participant> found = participantRepository.findById(id);
		if (found.isPresent()) {
			return found.get();
		}
		return null;
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.ParticipantService#getParticipantByIdentifier(java.lang.String)
	 */
	@Override
	public Participant getParticipantByIdentifier(String name) {
		return participantRepository.findByIdentifier(name);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.ParticipantService#getParticipant(java.lang.Long)
	 */
	@Override
	public Participant getParticipantByUuid(String uuid) {
		return participantRepository.findByUuid(uuid);
	}

	@Override
	public List<Participant> getParticipantsByLocation(Location location) {
		return participantRepository.findByLocation(location);
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
		List<Person> people = personRepository.findByPersonName(name, name, name);
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
	@MeasureProcessingTime
	public Participant saveParticipant(Participant obj) {
		if (getParticipantByIdentifier(obj.getIdentifier()) != null) {
			throw new HibernateException("Make sure you are not trying to save duplicate Participant!");
		}
		Optional<Location> location = locationRepository.findById(obj.getLocation().getLocationId());
		if (location.isPresent()) {
			obj.setLocation(location.get());			
		}
		Person person = personRepository.findByUuid(obj.getPerson().getUuid());
		if (person != null) {
			throw new HibernateException("Make sure you are not trying to save duplicate Person!");
		}
		person = personRepository.save(obj.getPerson());
		obj = (Participant) setCreateAuditAttributes(obj);
		obj.getPerson().setCreatedBy(obj.getCreatedBy());
		for (PersonAttribute attribute : obj.getPerson().getAttributes()) {
			attribute.setCreatedBy(obj.getCreatedBy());
		}
		obj.setPerson(person);
		return participantRepository.save(obj);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.ParticipantService#searchParticipants(java.util.List)
	 */
	@Override
	@MeasureProcessingTime
	public List<Participant> searchParticipants(List<SearchCriteria> params) {
		CriteriaBuilder builder = getEntityManager().getCriteriaBuilder();
		CriteriaQuery<Participant> query = builder.createQuery(Participant.class);
		Root<Participant> r = query.from(Participant.class);
		Predicate predicate = builder.conjunction();
		SearchQueryCriteriaConsumer searchConsumer = new SearchQueryCriteriaConsumer(predicate, builder, r);
		params.stream().forEach(searchConsumer);
		predicate = searchConsumer.getPredicate();
		query.where(predicate);
		List<Participant> result = getEntityManager().createQuery(query).getResultList();
		return result;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.ParticipantService#updateParticipant(com.
	 * ihsinformatics.cidemoapp.model.Participant)
	 */
	@Override
	public Participant updateParticipant(Participant obj) {
		obj = (Participant) setUpdateAuditAttributes(obj);
		return participantRepository.save(obj);
	}
}
