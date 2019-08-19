/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/
package com.ihsinformatics.aahung.aagahi.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.hibernate.HibernateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.LocationAttribute;
import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.model.Person;
import com.ihsinformatics.aahung.aagahi.model.PersonAttribute;
import com.ihsinformatics.aahung.aagahi.model.User;
import com.ihsinformatics.aahung.aagahi.repository.LocationRepository;
import com.ihsinformatics.aahung.aagahi.repository.ParticipantRepository;
import com.ihsinformatics.aahung.aagahi.repository.PersonRepository;
import com.ihsinformatics.aahung.aagahi.util.SearchCriteria;
import com.ihsinformatics.aahung.aagahi.util.SearchQueryCriteriaConsumer;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Component
public class ParticipantServiceImpl implements ParticipantService {

	@Autowired
	private ParticipantRepository participantRepository;

	@Autowired
	private PersonRepository personRepository;
	
	@Autowired
	private LocationRepository locationRepository;
	
	@PersistenceContext
    private EntityManager entityManager;

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
		if (getParticipantByShortName(participant.getShortName()) != null) {
			throw new HibernateException("Trying to release duplicate Participant!");
		}
		
		UserServiceImpl service = new UserServiceImpl();
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String name = authentication.getName();
		User user = service.getUserByUsername(name);
		participant.setCreatedBy(user);
		participant.getPerson().setCreatedBy(user);
		for(PersonAttribute attribute : participant.getPerson().getAttributes())
			attribute.setCreatedBy(user);
		
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
	
	@Override
	public List<Participant> getParticipantsByLocationShortName(String locationShortName) {
		Location location = locationRepository.findByShortName(locationShortName);
		if(location != null)
			return participantRepository.findByLocation(location);
		else {
			return new ArrayList<Participant>();
		}
	}
	
	@Override
	public List<Participant> getParticipantsByLocationId(Integer locationId) {
		return participantRepository.findByLocationId(locationId);
		
	}
	
	@Override
	public Participant getParticipantByUuid(String uuid) throws HibernateException {
		return participantRepository.findByUuid(uuid);
	}
	
	// Example: http://localhost:8080/aahung-aagahi/api/participants?ABC DEF
	@Override
    public List<Participant> searchParticipants(List<SearchCriteria> params) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Participant> query = builder.createQuery(Participant.class);
        Root<Participant> r = query.from(Participant.class);
 
        Predicate predicate = builder.conjunction();
 
        SearchQueryCriteriaConsumer searchConsumer = 
          new SearchQueryCriteriaConsumer(predicate, builder, r);
        params.stream().forEach(searchConsumer);
        predicate = searchConsumer.getPredicate();
        query.where(predicate);
 
        List<Participant> result = entityManager.createQuery(query).getResultList();
        return result;
    }

	@Override
	public Participant getParticipantByShortName(String name) {
		return participantRepository.findByShortName(name);
	}

}
