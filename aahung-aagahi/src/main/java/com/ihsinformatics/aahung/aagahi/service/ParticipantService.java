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

import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.model.Person;
import com.ihsinformatics.aahung.aagahi.util.SearchCriteria;

/**
 * @author owais.hussain@ihsinformatics.com
 */
public interface ParticipantService {

	/**
	 * @param obj
	 * @throws HibernateException
	 */
	void deleteParticipant(Participant obj) throws HibernateException;

	/**
	 * Returns {@link Participant} object by generated Id
	 * 
	 * @param id
	 * @return
	 * @throws HibernateException
	 */
	Participant getParticipantById(Integer id) throws HibernateException;

	/**
	 * 
	 * @param identifier
	 * @return
	 * @throws HibernateException
	 */
	Participant getParticipantByIdentifier(String identifier) throws HibernateException;

	/**
	 * 
	 * @param uuid
	 * @return
	 * @throws HibernateException
	 */
	Participant getParticipantByUuid(String uuid) throws HibernateException;

	/**
	 * Returns list of {@link Participant} objects by given {@link Location} object
	 * 
	 * @param location
	 * @return
	 * @throws HibernateException
	 */
	List<Participant> getParticipantsByLocation(Location location) throws HibernateException;

	/**
	 * Returns list of {@link Participant} objects by matching given name
	 * 
	 * @param name
	 * @return
	 * @throws HibernateException
	 */
	List<Participant> getParticipantsByName(String name) throws HibernateException;

	/**
	 * Saves a new {@link Participant} object as well as a {@link Person} object
	 * 
	 * @param obj
	 * @return
	 * @throws HibernateException
	 */
	Participant saveParticipant(Participant obj) throws HibernateException;

	/**
	 * Returns a list of {@link Participant} objects by matching given list of parameters
	 * 
	 * @param params
	 * @return
	 * @throws HibernateException
	 */
	List<Participant> searchParticipants(List<SearchCriteria> params) throws HibernateException;

	/**
	 * @param obj
	 * @return
	 * @throws HibernateException
	 */
	Participant updateParticipant(Participant obj) throws HibernateException;
}
