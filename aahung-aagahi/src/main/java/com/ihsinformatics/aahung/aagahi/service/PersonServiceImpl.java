/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/
package com.ihsinformatics.aahung.aagahi.service;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.hibernate.HibernateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ihsinformatics.aahung.aagahi.Initializer;
import com.ihsinformatics.aahung.aagahi.model.Person;
import com.ihsinformatics.aahung.aagahi.repository.PersonRepository;
import com.ihsinformatics.aahung.aagahi.util.SearchCriteria;
import com.ihsinformatics.aahung.aagahi.util.SearchQueryCriteriaConsumer;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Component
public class PersonServiceImpl implements PersonService {

	@Autowired
	private PersonRepository personRepository;

	@PersistenceContext
	private EntityManager entityManager;

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#getPersonByUuid(java.lang.String)
	 */
	@Override
	public Person getPersonByUuid(String uuid) throws HibernateException {
		return personRepository.findByUuid(uuid);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#getPeopleByName(java.lang.String)
	 */
	@Override
	public List<Person> getPeopleByName(String name) throws HibernateException {
		return personRepository.findByPersonName(name, name, name);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#getPeopleByAddress(java.lang.String, java.lang.String, java.lang.String, java.lang.String)
	 */
	@Override
	public List<Person> getPeopleByAddress(String address, String cityVillage, String stateProvince, String country)
	        throws HibernateException {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#getPeopleByContact(java.lang.String, boolean)
	 */
	@Override
	public List<Person> getPeopleByContact(String contact, boolean primaryContactOnly) throws HibernateException {
		return personRepository.findByContact(contact, primaryContactOnly);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#savePerson(com.ihsinformatics.aahung.aagahi.model.Person)
	 */
	@Override
	public Person savePerson(Person obj) throws HibernateException {
		obj.setCreatedBy(Initializer.getCurrentUser());
		return personRepository.save(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#updatePerson(com.ihsinformatics.aahung.aagahi.model.Person)
	 */
	@Override
	public Person updatePerson(Person obj) throws HibernateException {
		return personRepository.save(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#deletePerson(com.ihsinformatics.aahung.aagahi.model.Person)
	 */
	@Override
	public void deletePerson(Person obj) throws HibernateException {
		personRepository.delete(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#searchPeople(java.util.List)
	 */
	@Override
	public List<Person> searchPeople(List<SearchCriteria> params) throws HibernateException {
		CriteriaBuilder builder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Person> query = builder.createQuery(Person.class);
		Root<Person> r = query.from(Person.class);
		Predicate predicate = builder.conjunction();
		SearchQueryCriteriaConsumer searchConsumer = new SearchQueryCriteriaConsumer(predicate, builder, r);
		params.stream().forEach(searchConsumer);
		predicate = searchConsumer.getPredicate();
		query.where(predicate);
		List<Person> result = entityManager.createQuery(query).getResultList();
		return result;
	}

}
