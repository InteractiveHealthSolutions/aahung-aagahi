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
import com.ihsinformatics.aahung.aagahi.model.UserAttribute;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(SpringRunner.class)
@DataJpaTest
public class UserAttributeRepositoryTest extends BaseTestData {

	@Autowired
	private UserAttributeRepository userAttributeRepository;

	@Before
	public void reset() {
		super.reset();
	}

	@Test
	public void shouldSave() {
		userAttribute1 = userAttributeRepository.save(userAttribute1);
		userAttributeRepository.flush();
		UserAttribute found = entityManager.find(UserAttribute.class, userAttribute1.getAttributeId());
		assertNotNull(found);
	}

	@Test
	public void shouldDelete() {
		userAttribute1 = entityManager.persist(userAttribute1);
		entityManager.flush();
		Integer id = userAttribute1.getAttributeId();
		entityManager.detach(userAttribute1);
		userAttributeRepository.delete(userAttribute1);
		UserAttribute found = entityManager.find(UserAttribute.class, id);
		assertNull(found);
	}

	@Test
	public void shouldFindById() throws Exception {
		Object id = entityManager.persistAndGetId(userAttribute1);
		entityManager.flush();
		entityManager.detach(userAttribute1);
		Optional<UserAttribute> found = userAttributeRepository.findById((Integer) id);
		assertTrue(found.isPresent());
	}

	@Test
	public void shouldFindByUuid() throws Exception {
		userAttribute1 = entityManager.persist(userAttribute1);
		entityManager.flush();
		String uuid = userAttribute1.getUuid();
		entityManager.detach(userAttribute1);
		UserAttribute found = userAttributeRepository.findByUuid(uuid);
		assertNotNull(found);
	}

	@Test
	public void shouldFindByUser() {
		// Save some users
		for (UserAttribute attributes : Arrays.asList(userAttribute1, userAttribute2)) {
			entityManager.persist(attributes);
			entityManager.flush();
			entityManager.detach(attributes);
		}
		List<UserAttribute> found = userAttributeRepository.findByUser(admin);
		assertEquals(1, found.size());
		// Should return 1 object
		found = userAttributeRepository.findByUser(dumbledore);
		assertEquals(1, found.size());

	}

	@Test
	public void shouldFindByAttributeType() {
		// Save some users
		for (UserAttribute attributes : Arrays.asList(userAttribute1, userAttribute2)) {
			entityManager.persist(attributes);
			entityManager.flush();
			entityManager.detach(attributes);
		}
		// Should be empty
		List<UserAttribute> found = userAttributeRepository.findByAttributeType(occupation);
		assertTrue(found.isEmpty());
		// Should return 1 object
		found = userAttributeRepository.findByAttributeType(blood);
		assertEquals(1, found.size());

	}

	@Test
	public void shouldFindByAttributeTypeAndValue() {
		// Save some users
		for (UserAttribute attributes : Arrays.asList(userAttribute1, userAttribute2)) {
			entityManager.persist(attributes);
			entityManager.flush();
			entityManager.detach(attributes);
		}
		// Should be empty
		List<UserAttribute> found = userAttributeRepository.findByAttributeTypeAndValue(blood, "Pure Blood");
		assertTrue(found.isEmpty());
		// Should return 1 object
		found = userAttributeRepository.findByAttributeTypeAndValue(patronus, "Doe");
		assertEquals(1, found.size());

	}

	@Test
	public void shouldFindByUserAndAttributeType() {
		// Save some users
		for (UserAttribute attributes : Arrays.asList(userAttribute1, userAttribute2)) {
			entityManager.persist(attributes);
			entityManager.flush();
			entityManager.detach(attributes);
		}
		// Should be empty
		List<UserAttribute> found = userAttributeRepository.findByUserAndAttributeType(admin, patronus);
		assertTrue(found.isEmpty());
		// Should return 1 object
		found = userAttributeRepository.findByUserAndAttributeType(dumbledore, patronus);
		assertEquals(1, found.size());

	}

	@Test
	public void shouldFindByalues() {
		// Save some users
		for (UserAttribute attributes : Arrays.asList(userAttribute1, userAttribute2)) {
			entityManager.persist(attributes);
			entityManager.flush();
			entityManager.detach(attributes);
		}
		// Should be empty
		List<UserAttribute> found = userAttributeRepository.findByValue("Pure Blood");
		assertTrue(found.isEmpty());
		// Should return 1 object
		found = userAttributeRepository.findByValue("Half Blood");
		assertEquals(1, found.size());

	}

}
