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

import org.hibernate.HibernateException;

import com.ihsinformatics.aahung.aagahi.model.Person;
import com.ihsinformatics.aahung.aagahi.util.SearchCriteria;

/**
 * @author owais.hussain@ihsinformatics.com
 */
public interface PersonService {

	/**
	 * Returns {@link Person} object by given UUID
	 * 
	 * @param uuid
	 * @return
	 * @throws HibernateException
	 */
	Person getPersonByUuid(String uuid) throws HibernateException;

	/**
	 * Returns list of {@link Person} objects by matching all names with given parameter
	 * 
	 * @param name
	 * @return
	 * @throws HibernateException
	 */
	List<Person> getPeopleByName(String name) throws HibernateException;

	/**
	 * Returns list of {@link Person} objects by matching given address parameters
	 * 
	 * @param address
	 * @param cityVillage
	 * @param stateProvince
	 * @param country
	 * @return
	 * @throws HibernateException
	 */
	List<Person> getPeopleByAddress(String address, String cityVillage, String stateProvince, String country)
	        throws HibernateException;

	/**
	 * Returns list of {@link Person} objects by matching given contact number
	 * 
	 * @param contact
	 * @param primaryContactOnly when true, only primary contact number is matched
	 * @return
	 * @throws HibernateException
	 */
	List<Person> getPeopleByContact(String contact, Boolean primaryContactOnly) throws HibernateException;

	Person savePerson(Person obj) throws HibernateException;

	Person updatePerson(Person obj) throws HibernateException;

	void deletePerson(Person obj) throws HibernateException;

	/**
	 * Returns list of {@link Person} objects by matching list of givem parameters
	 * 
	 * @param params
	 * @return
	 * @throws HibernateException
	 */
	List<Person> searchPeople(List<SearchCriteria> params) throws HibernateException;
}
