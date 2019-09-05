/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.service;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.hibernate.HibernateException;
import org.junit.Before;
import org.junit.Test;

import com.ihsinformatics.aahung.aagahi.BaseServiceTest;
import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.model.Person;
import com.ihsinformatics.aahung.aagahi.util.SearchCriteria;
import com.ihsinformatics.aahung.aagahi.util.SearchOperator;

/**
 * @author owais.hussain@ihsinformatics.com
 */
public class PersonServiceTest extends BaseServiceTest {

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
		initPeople();
		initParticipants();
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.PersonServiceImpl#deletePerson(com.ihsinformatics.aahung.aagahi.model.Person)}.
	 */
	@Test
	public void shouldDeletePerson() {
		when(participantRepository.findById(any(Integer.class))).thenReturn(null);
		doNothing().when(personRepository).delete(any(Person.class));
		personService.deletePerson(hermione);
		verify(personRepository, times(1)).delete(any(Person.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.PersonServiceImpl#getPeopleByAddress(java.lang.String, java.lang.String, java.lang.String, java.lang.String)}.
	 */
	@Test
	public void shouldGetPeopleByAddress() {
		when(personRepository.findByAddress(any(String.class), any(String.class), any(String.class), any(String.class),
		    any(String.class))).thenReturn(Arrays.asList(ron, harry));
		assertEquals(2, personService.getPeopleByAddress("", "", "", "England").size());
		verify(personRepository, times(1)).findByAddress(any(String.class), any(String.class), any(String.class),
		    any(String.class), any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.PersonServiceImpl#getPeopleByContact(java.lang.String, boolean)}.
	 */
	@Test
	public void shouldGetPeopleByContact() {
		when(personRepository.findByContact(any(String.class), any(Boolean.class))).thenReturn(Arrays.asList(ron, hermione));
		assertEquals(2, personService.getPeopleByContact("03452345345", Boolean.TRUE).size());
		verify(personRepository, times(1)).findByContact(any(String.class), any(Boolean.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.PersonServiceImpl#getPeopleByName(java.lang.String)}.
	 */
	@Test
	public void shouldGetPeopleByName() {
		when(personRepository.findByPersonName(any(String.class), any(String.class), any(String.class)))
		        .thenReturn(Arrays.asList(ron, hermione));
		assertEquals(2, personService.getPeopleByName("Weasley").size());
		verify(personRepository, times(1)).findByPersonName(any(String.class), any(String.class), any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.PersonServiceImpl#deletePerson(com.ihsinformatics.aahung.aagahi.model.Person)}.
	 */
	@Test(expected = HibernateException.class)
	public void shouldNotDeletePerson() {
		seeker.getPerson().setPersonId(99);
		Optional<Participant> seekerObj = Optional.of(seeker);
		when(participantRepository.findById(any(Integer.class))).thenReturn(seekerObj);
		personService.deletePerson(harry);
	}

	@Test
	public void shouldReturnAnObject() {
		Person person = mock(Person.class);
		assertNotNull(person);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.PersonServiceImpl#savePerson(com.ihsinformatics.aahung.aagahi.model.Person)}.
	 */
	@Test
	public void shouldSavePerson() {
		when(personRepository.save(any(Person.class))).thenReturn(ron);
		assertThat(personService.savePerson(ron), is(ron));
		verify(personRepository, times(1)).save(any(Person.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.PersonServiceImpl#searchPeople(java.util.List)}.
	 */
	@SuppressWarnings("unchecked")
	@Test
	public void shouldSearchPeople() {
		when(personRepository.search(any(List.class))).thenReturn(Arrays.asList(ron, harry));
		List<SearchCriteria> params = new ArrayList<>();
		params.add(new SearchCriteria("gender", SearchOperator.EQUALS, "MALE"));
		List<Person> people = personService.searchPeople(params);
		assertEquals(2, people.size());
		verify(personRepository, times(1)).search(any(List.class));
	}
}
