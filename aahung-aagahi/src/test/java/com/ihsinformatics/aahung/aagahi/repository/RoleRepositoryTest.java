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

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.ihsinformatics.aahung.aagahi.BaseTestData;
import com.ihsinformatics.aahung.aagahi.model.Role;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(SpringRunner.class)
@DataJpaTest
public class RoleRepositoryTest extends BaseTestData {

	@Autowired
	private RoleRepository roleRepository;

	private Role herbologist;

	@Before
	public void reset() {
		super.reset();
		herbologist = Role.builder().roleName("Herbologist").build();
	}

	@After
	public void flushAll() {
		super.flushAll();
		try {
			entityManager.remove(herbologist);
		}
		catch (Exception e) {}
	}

	@Test
	public void shouldSave() {
		herbologist = roleRepository.save(herbologist);
		roleRepository.flush();
		Role found = entityManager.find(Role.class, herbologist.getRoleId());
		assertNotNull(found);
	}

	@Test
	public void shouldDelete() {
		herbologist = entityManager.persist(herbologist);
		entityManager.flush();
		Integer id = herbologist.getRoleId();
		entityManager.detach(herbologist);
		roleRepository.delete(herbologist);
		Role found = entityManager.find(Role.class, id);
		assertNull(found);
	}

	@Test
	public void shouldFindById() throws Exception {
		Object id = entityManager.persistAndGetId(herbologist);
		entityManager.flush();
		entityManager.detach(herbologist);
		Optional<Role> found = roleRepository.findById(Integer.parseInt(id.toString()));
		assertTrue(found.isPresent());
	}

	@Test
	public void shouldFindByUuid() throws Exception {
		herbologist = entityManager.persist(herbologist);
		entityManager.flush();
		String uuid = herbologist.getUuid();
		entityManager.detach(herbologist);
		Role found = roleRepository.findByUuid(uuid);
		assertNotNull(found);
	}

	@Test
	public void shouldFindByName() {
		herbologist = entityManager.persist(herbologist);
		entityManager.flush();
		entityManager.detach(herbologist);
		Role found = roleRepository.findByRoleName(herbologist.getRoleName());
		assertNotNull(found);
		// FIXME
		assertEquals(herbologist.getUuid(), found.getUuid());
	}
}
