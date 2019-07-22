/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.repository;

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

import com.ihsinformatics.aahung.aagahi.BaseTest;
import com.ihsinformatics.aahung.aagahi.model.Privilege;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(SpringRunner.class)
@DataJpaTest
public class PrivilegeRepositoryTest extends BaseTest {

	@Autowired
	private PrivilegeRepository privilegeRepository;
	
	private Privilege useCurses;
	
	@Before
	public void reset() {
		useCurses = Privilege.builder().privilegeName("USE CURSES").build();
	}

	@Test
	public void shouldSave() {
		useCurses = privilegeRepository.save(useCurses);
		privilegeRepository.flush();
		Object uuid = useCurses.getPrivilegeName();
		Privilege found = entityManager.find(Privilege.class, uuid);
		assertNotNull(found);
	}

	@Test
	public void shouldDelete() {
		useCurses = privilegeRepository.save(useCurses);
		privilegeRepository.flush();
		Object uuid = useCurses.getPrivilegeName();
		entityManager.detach(useCurses);
		privilegeRepository.delete(useCurses);
		Privilege found = entityManager.find(Privilege.class, uuid);		
		assertNull(found);
	}

	@Test
	public void shouldFindById() throws Exception {
		Object id = entityManager.persistAndGetId(useCurses);
		entityManager.flush();
		entityManager.detach(useCurses);
		Optional<Privilege> found = privilegeRepository.findById(id.toString());
		assertTrue(found.isPresent());
	}

	@Test
	public void shouldFindByUuid() throws Exception {
		useCurses = entityManager.persist(useCurses);
		entityManager.flush();
		String uuid = useCurses.getUuid();
		entityManager.detach(useCurses);
		Privilege found = privilegeRepository.findByUuid(uuid);
		assertNotNull(found);
	}

}
