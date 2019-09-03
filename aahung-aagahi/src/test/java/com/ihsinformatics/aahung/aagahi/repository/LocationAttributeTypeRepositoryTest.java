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

import java.util.Optional;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.ihsinformatics.aahung.aagahi.BaseTestData;
import com.ihsinformatics.aahung.aagahi.model.LocationAttributeType;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(SpringRunner.class)
@DataJpaTest
public class LocationAttributeTypeRepositoryTest extends BaseTestData {

	@Autowired
	private LocationAttributeTypeRepository locationAttributeTypeRepository;

	@Before
	public void reset() {
			super.reset();
	}

	@Test
	public void shouldSave() {
		noOfStudents = locationAttributeTypeRepository.save(noOfStudents);
		locationAttributeTypeRepository.flush();
		LocationAttributeType found = entityManager.find(LocationAttributeType.class, noOfStudents.getAttributeTypeId());
		assertNotNull(found);
	}

	@Test
	public void shouldDelete() {
		noOfTeachers = entityManager.persist(noOfTeachers);
		entityManager.flush();
		Integer id = noOfTeachers.getAttributeTypeId();
		entityManager.detach(noOfTeachers);
		locationAttributeTypeRepository.delete(noOfTeachers);
		LocationAttributeType found = entityManager.find(LocationAttributeType.class, id);
		assertNull(found);
	}

	@Test
	public void shouldFindById() throws Exception {
		Object id = entityManager.persistAndGetId(noOfStudents);
		entityManager.flush();
		entityManager.detach(noOfStudents);
		Optional<LocationAttributeType> found = locationAttributeTypeRepository.findById((Integer) id);
		assertTrue(found.isPresent());
	}

	@Test
	public void shouldFindByUuid() throws Exception {
		noOfStudents = entityManager.persist(noOfStudents);
		entityManager.flush();
		String uuid = noOfStudents.getUuid();
		entityManager.detach(noOfStudents);
		LocationAttributeType found = locationAttributeTypeRepository.findByUuid(uuid);
		assertNotNull(found);
	}

	@Test
	public void shouldFindByAttributeName() {
		noOfTeachers = entityManager.persist(noOfTeachers);
		entityManager.flush();
		entityManager.detach(noOfTeachers);
		LocationAttributeType found = locationAttributeTypeRepository.findByName("Students Enrolled");
		assertNotNull(found);
		assertEquals(noOfTeachers, found);
	}

}