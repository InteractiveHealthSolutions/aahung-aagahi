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
import java.util.List;
import java.util.Optional;

import org.hibernate.HibernateException;
import org.springframework.stereotype.Component;

import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.model.Person;
import com.ihsinformatics.aahung.aagahi.model.PersonAttribute;
import com.ihsinformatics.aahung.aagahi.model.PersonAttributeType;
import com.ihsinformatics.aahung.aagahi.util.SearchCriteria;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Component
public class PersonServiceImpl extends BaseService implements PersonService {

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#deletePerson(com.ihsinformatics.aahung.aagahi.model.Person)
	 */
	@Override
	public void deletePerson(Person obj) throws HibernateException {
		Optional<Participant> found = participantRepository.findById(obj.getPersonId());
		if (found.isPresent()) {
			throw new HibernateException(
			        "A Participant object depend on this Person. Please delete the dependent object first.");
		}
		personRepository.delete(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#deletePersonAttribute(com.ihsinformatics.aahung.aagahi.model.PersonAttribute)
	 */
	@Override
	public void deletePersonAttribute(PersonAttribute obj) throws HibernateException {
		personAttributeRepository.delete(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#deletePersonAttributeType(com.ihsinformatics.aahung.aagahi.model.PersonAttributeType, boolean)
	 */
	@Override
	public void deletePersonAttributeType(PersonAttributeType obj, boolean force) throws HibernateException {
		List<PersonAttribute> attributesByType = getPersonAttributesByType(obj);
		if (!attributesByType.isEmpty()) {
			if (force) {
				for (PersonAttribute personAttribute : attributesByType) {
					deletePersonAttribute(personAttribute);
				}
			} else {
				throw new HibernateException(
				        "One or more PersonAttribute objects depend on this PersonAttributeType. Please delete the dependent objects (by setting the force parameter true) first.");
			}
		}
		personAttributeTypeRepository.delete(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#getAllPersonAttributeTypes()
	 */
	@Override
	public List<PersonAttributeType> getAllPersonAttributeTypes() throws HibernateException {
		return personAttributeTypeRepository.findAll();
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#getPeopleByAddress(java.lang.String, java.lang.String, java.lang.String, java.lang.String)
	 */
	@Override
	public List<Person> getPeopleByAddress(String address, String cityVillage, String stateProvince, String country)
	        throws HibernateException {
		return personRepository.findByAddress(address, address, cityVillage, stateProvince, country);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#getPeopleByContact(java.lang.String, java.lang.Boolean)
	 */
	@Override
	public List<Person> getPeopleByContact(String contact, Boolean primaryContactOnly) throws HibernateException {
		return personRepository.findByContact(contact, primaryContactOnly);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#getPeopleByName(java.lang.String)
	 */
	@Override
	public List<Person> getPeopleByName(String name) throws HibernateException {
		return personRepository.findByPersonName(name, name, name);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#getPersonAttributeById(java.lang.Integer)
	 */
	@Override
	public PersonAttribute getPersonAttributeById(Integer id) throws HibernateException {
		Optional<PersonAttribute> found = personAttributeRepository.findById(id);
		if (found.isPresent()) {
			return found.get();
		}
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#getPersonAttributeByUuid(java.lang.String)
	 */
	@Override
	public PersonAttribute getPersonAttributeByUuid(String uuid) throws HibernateException {
		return personAttributeRepository.findByUuid(uuid);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#getPersonAttributes(com.ihsinformatics.aahung.aagahi.model.Person, com.ihsinformatics.aahung.aagahi.model.PersonAttributeType)
	 */
	@Override
	public List<PersonAttribute> getPersonAttributes(Person person, PersonAttributeType attributeType)
	        throws HibernateException {
		return personAttributeRepository.findByPersonAndAttributeType(person, attributeType);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#getPersonAttributesByPerson(com.ihsinformatics.aahung.aagahi.model.Person)
	 */
	@Override
	public List<PersonAttribute> getPersonAttributesByPerson(Person person) throws HibernateException {
		return personAttributeRepository.findByPerson(person);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#getPersonAttributesByType(com.ihsinformatics.aahung.aagahi.model.PersonAttributeType)
	 */
	@Override
	public List<PersonAttribute> getPersonAttributesByType(PersonAttributeType attributeType) throws HibernateException {
		return personAttributeRepository.findByAttributeType(attributeType);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#getPersonAttributesByTypeAndValue(com.ihsinformatics.aahung.aagahi.model.PersonAttributeType, java.lang.String)
	 */
	@Override
	public List<PersonAttribute> getPersonAttributesByTypeAndValue(PersonAttributeType attributeType, String attributeValue)
	        throws HibernateException {
		return personAttributeRepository.findByAttributeTypeAndValue(attributeType, attributeValue);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#getPersonAttributeTypeById(java.lang.Integer)
	 */
	@Override
	public PersonAttributeType getPersonAttributeTypeById(Integer id) throws HibernateException {
		Optional<PersonAttributeType> found = personAttributeTypeRepository.findById(id);
		if (found.isPresent()) {
			return found.get();
		}
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#getPersonAttributeTypeByName(java.lang.String)
	 */
	@Override
	public PersonAttributeType getPersonAttributeTypeByName(String name) throws HibernateException {
		return personAttributeTypeRepository.findByAttributeName(name);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#getPersonAttributeTypeByShortName(java.lang.String)
	 */
	@Override
	public PersonAttributeType getPersonAttributeTypeByShortName(String shortName) throws HibernateException {
		return personAttributeTypeRepository.findByShortName(shortName);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#getPersonAttributeTypeByUuid(java.lang.String)
	 */
	@Override
	public PersonAttributeType getPersonAttributeTypeByUuid(String uuid) throws HibernateException {
		return personAttributeTypeRepository.findByUuid(uuid);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#getPersonById(java.lang.Integer)
	 */
	@Override
	public Person getPersonById(Integer id) throws HibernateException {
		Optional<Person> found = personRepository.findById(id);
		if (found.isPresent()) {
			return found.get();
		}
		return null;
	}
	
	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#getPersonByUuid(java.lang.String)
	 */
	@Override
	public Person getPersonByUuid(String uuid) throws HibernateException {
		return personRepository.findByUuid(uuid);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#savePerson(com.ihsinformatics.aahung.aagahi.model.Person)
	 */
	@Override
	public Person savePerson(Person obj) throws HibernateException {
		if (getPersonByUuid(obj.getUuid()) != null) {
			throw new HibernateException("Make sure you are not trying to save duplicate Location!");
		}
		obj = (Person) setCreateAuditAttributes(obj);
		obj = personRepository.save(obj);
		if (!obj.getAttributes().isEmpty()) {
			savePersonAttributes(obj.getAttributes());
		}
		return obj;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#savePersonAttribute(com.ihsinformatics.aahung.aagahi.model.PersonAttribute)
	 */
	@Override
	public PersonAttribute savePersonAttribute(PersonAttribute obj) throws HibernateException {
		obj = (PersonAttribute) setCreateAuditAttributes(obj);
		return personAttributeRepository.save(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#savePersonAttributes(java.util.List)
	 */
	@Override
	public List<PersonAttribute> savePersonAttributes(List<PersonAttribute> attributes) throws HibernateException {
		for (PersonAttribute obj : attributes) {
			obj = (PersonAttribute) setCreateAuditAttributes(obj);
		}
		return personAttributeRepository.saveAll(attributes);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#savePersonAttributeType(com.ihsinformatics.aahung.aagahi.model.PersonAttributeType)
	 */
	@Override
	public PersonAttributeType savePersonAttributeType(PersonAttributeType obj) throws HibernateException {
		return personAttributeTypeRepository.save(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#searchPeople(java.util.List)
	 */
	@Override
	public List<Person> searchPeople(List<SearchCriteria> params) throws HibernateException {
		if (params == null) {
			params = new ArrayList<>();
		}
		if (params.isEmpty()) {
			return new ArrayList<>();
		}
		return personRepository.search(params);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#updatePerson(com.ihsinformatics.aahung.aagahi.model.Person)
	 */
	@Override
	public Person updatePerson(Person obj) throws HibernateException {
		obj = (Person) setUpdateAuditAttributes(obj);
		return personRepository.save(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#updatePersonAttribute(com.ihsinformatics.aahung.aagahi.model.PersonAttribute)
	 */
	@Override
	public PersonAttribute updatePersonAttribute(PersonAttribute obj) throws HibernateException {
		obj = (PersonAttribute) setUpdateAuditAttributes(obj);
		return personAttributeRepository.save(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.PersonService#updatePersonAttributeType(com.ihsinformatics.aahung.aagahi.model.PersonAttributeType)
	 */
	@Override
	public PersonAttributeType updatePersonAttributeType(PersonAttributeType obj) throws HibernateException {
		obj = (PersonAttributeType) setUpdateAuditAttributes(obj);
		return personAttributeTypeRepository.save(obj);
	}
}
