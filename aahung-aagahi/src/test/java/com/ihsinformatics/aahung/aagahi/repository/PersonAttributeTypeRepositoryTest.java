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

import com.ihsinformatics.aahung.aagahi.BaseRepositoryData;
import com.ihsinformatics.aahung.aagahi.model.PersonAttributeType;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(SpringRunner.class)
@DataJpaTest
public class PersonAttributeTypeRepositoryTest extends BaseRepositoryData {

	@Autowired
	private PersonAttributeTypeRepository personAttributeTypeRepository;

	@Before
	public void reset() {
		super.reset();
	}

	@Test
	public void shouldDelete() {
		height = entityManager.persist(height);
		entityManager.flush();
		Integer id = height.getAttributeTypeId();
		entityManager.detach(height);
		personAttributeTypeRepository.delete(height);
		PersonAttributeType found = entityManager.find(PersonAttributeType.class, id);
		assertNull(found);
	}

	@Test
	public void shouldFindById() throws Exception {
		Object id = entityManager.persistAndGetId(height);
		entityManager.flush();
		entityManager.detach(height);
		Optional<PersonAttributeType> found = personAttributeTypeRepository.findById((Integer) id);
		assertTrue(found.isPresent());
	}

	@Test
	public void shouldFindByName() {
		height = entityManager.persist(height);
		entityManager.flush();
		entityManager.detach(height);
		PersonAttributeType found = personAttributeTypeRepository.findByAttributeName(height.getAttributeName());
		assertNotNull(found);
		assertEquals(height, found);
	}

	@Test
	public void shouldFindByShortName() {
		height = entityManager.persist(height);
		entityManager.flush();
		entityManager.detach(height);
		PersonAttributeType found = personAttributeTypeRepository.findByAttributeName(height.getAttributeName());
		assertNotNull(found);
		assertEquals(height, found);
	}

	@Test
	public void shouldFindByUuid() throws Exception {
		height = entityManager.persist(height);
		entityManager.flush();
		String uuid = height.getUuid();
		entityManager.detach(height);
		PersonAttributeType found = personAttributeTypeRepository.findByUuid(uuid);
		assertNotNull(found);
	}

	@Test
	public void shouldSave() {
		height = personAttributeTypeRepository.save(height);
		personAttributeTypeRepository.flush();
		PersonAttributeType found = entityManager.find(PersonAttributeType.class, height.getAttributeTypeId());
		assertNotNull(found);
	}
}
