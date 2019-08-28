/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.repository;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.ihsinformatics.aahung.aagahi.BaseTestData;
import com.ihsinformatics.aahung.aagahi.model.PersonAttribute;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(SpringRunner.class)
@DataJpaTest
public class PersonAttributeRepositoryTest extends BaseTestData {

	@Autowired
	private PersonAttributeRepository personAttributeRepository;

	private PersonAttribute attribute1, attribute2;

	@Before
	public void reset() {
		try {
			attribute1 = PersonAttribute.builder().attributeId(1).person(ron).attributeType(height).attributeValue("5.6")
			        .build();
			attribute2 = PersonAttribute.builder().attributeId(1).person(ron).attributeType(socialStatus).attributeValue("Married").build();
		}
		catch (Exception e) {}
	}

	@Test
	public void shouldSave() {
		attribute1 = personAttributeRepository.save(attribute1);
		personAttributeRepository.flush();
		PersonAttribute found = entityManager.find(PersonAttribute.class, attribute1.getAttributeId());
		assertNotNull(found);
	}

	@Test
	public void shouldDelete() {
		attribute1 = entityManager.persist(attribute1);
		entityManager.flush();
		Integer id = attribute1.getAttributeId();
		entityManager.detach(attribute1);
		personAttributeRepository.delete(attribute1);
		PersonAttribute found = entityManager.find(PersonAttribute.class, id);
		assertNull(found);
	}

	@Test
	public void shouldFindById() throws Exception {
		Object id = entityManager.persistAndGetId(attribute1);
		entityManager.flush();
		entityManager.detach(attribute1);
		Optional<PersonAttribute> found = personAttributeRepository.findById((Integer) id);
		assertTrue(found.isPresent());
	}

	@Test
	public void shouldFindByUuid() throws Exception {
		attribute1 = entityManager.persist(attribute1);
		entityManager.flush();
		String uuid = attribute1.getUuid();
		entityManager.detach(attribute1);
		PersonAttribute found = personAttributeRepository.findByUuid(uuid);
		assertNotNull(found);
	}

	@Test
	public void shouldFindByUser() {
		// Save some users
		for (PersonAttribute attributes : Arrays.asList(attribute1, attribute2)) {
			entityManager.persist(attributes);
			entityManager.flush();
			entityManager.detach(attributes);
		}
		List<PersonAttribute> found = personAttributeRepository.findByPerson(ron);
		assertEquals(1, found.size());
		// Should return 1 object
		found = personAttributeRepository.findByPerson(ron);
		assertEquals(1, found.size());

	}

	@Test
	public void shouldFindByAttributeType() {
		// Save some users
		for (PersonAttribute attributes : Arrays.asList(attribute1, attribute2)) {
			entityManager.persist(attributes);
			entityManager.flush();
			entityManager.detach(attributes);
		}
		// Should be empty
		List<PersonAttribute> found = personAttributeRepository.findByAttributeType(height);
		assertTrue(found.isEmpty());
		// Should return 1 object
		found = personAttributeRepository.findByAttributeType(height);
		assertEquals(1, found.size());

	}

	@Test
	public void shouldFindByAttributeTypeAndValue() {
		// Save some users
		for (PersonAttribute attributes : Arrays.asList(attribute1, attribute2)) {
			entityManager.persist(attributes);
			entityManager.flush();
			entityManager.detach(attributes);
		}
		// Should be empty
		List<PersonAttribute> found = personAttributeRepository.findByAttributeTypeAndValue(socialStatus, "None");
		assertTrue(found.isEmpty());
		// Should return 1 object
		found = personAttributeRepository.findByAttributeTypeAndValue(socialStatus, "Married");
		assertEquals(1, found.size());

	}

	@Test
	public void shouldFindByUserAndAttributeType() {
		// Save some users
		for (PersonAttribute attributes : Arrays.asList(attribute1, attribute2)) {
			entityManager.persist(attributes);
			entityManager.flush();
			entityManager.detach(attributes);
		}
		// Should be empty
		List<PersonAttribute> found = personAttributeRepository.findByPersonAndAttributeType(harry, height);
		assertTrue(found.isEmpty());
		// Should return 1 object
		found = personAttributeRepository.findByPersonAndAttributeType(ron, socialStatus);
		assertEquals(1, found.size());

	}

	@Test
	public void shouldFindByalues() {
		// Save some users
		for (PersonAttribute attributes : Arrays.asList(attribute1, attribute2)) {
			entityManager.persist(attributes);
			entityManager.flush();
			entityManager.detach(attributes);
		}
		// Should be empty
		List<PersonAttribute> found = personAttributeRepository.findByValue("Pure Blood");
		assertTrue(found.isEmpty());
		// Should return 1 object
		found = personAttributeRepository.findByValue("Half Blood");
		assertEquals(1, found.size());

	}
}
