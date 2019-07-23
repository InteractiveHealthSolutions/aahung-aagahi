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
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.ihsinformatics.aahung.aagahi.BaseIntegrationTest;
import com.ihsinformatics.aahung.aagahi.model.User;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(SpringRunner.class)
@DataJpaTest
public class UserRepositoryTest extends BaseIntegrationTest {

	@Autowired
	private UserRepository userRepository;
	private User umbridge, luna, fred, george;

	@Before
	public void reset() {
		try {
			umbridge = User.builder().username("dolores.umbridge").fullName("Dolores Jane Umbridge").attributes(new HashSet<>()).build();
			luna = User.builder().username("luna.lovegood").fullName("Luna Lovegood").attributes(new HashSet<>()).build();
			fred = User.builder().username("fred.weasley").fullName("Fred Weasley").attributes(new HashSet<>()).build();
			george = User.builder().username("george.weasley").fullName("George Weasley").attributes(new HashSet<>()).build();
			for (User u : Arrays.asList(umbridge, luna, fred, george)) {
				u.setPassword("none");
			}
		} catch (Exception e) {
		}
	}

	@Test
	public void shouldSave() {
		luna = userRepository.save(luna);
		userRepository.flush();
		User found = entityManager.find(User.class, luna.getUserId());
		assertNotNull(found);
	}

	@Test
	public void shouldDelete() {
		luna = entityManager.persist(luna);
		entityManager.flush();
		Integer id = luna.getUserId();
		entityManager.detach(luna);
		userRepository.delete(luna);
		User found = entityManager.find(User.class, id);
		assertNull(found);
	}

	@Test
	public void shouldFindById() throws Exception {
		Object id = entityManager.persistAndGetId(umbridge);
		entityManager.flush();
		entityManager.detach(umbridge);
		Optional<User> found = userRepository.findById((Integer) id);
		assertTrue(found.isPresent());
	}

	@Test
	public void shouldFindByUuid() throws Exception {
		luna = entityManager.persist(luna);
		entityManager.flush();
		String uuid = luna.getUuid();
		entityManager.detach(luna);
		User found = userRepository.findByUuid(uuid);
		assertNotNull(found);
	}

	@Test
	public void shouldFindByUsername() {
		fred = entityManager.persist(fred);
		entityManager.flush();
		entityManager.detach(fred);
		User found = userRepository.findByUsername("fred.weasley");
		assertNotNull(found);
		assertEquals(fred, found);
	}

	@Test
	public void shouldFindByFullName() {
		// Save some users
		for (User user : Arrays.asList(umbridge, luna, fred, george)) {
			entityManager.persist(user);
			entityManager.flush();
			entityManager.detach(user);
		}
		// Should be empty
		List<User> found = userRepository.findByFullName("Lovegood Luna");
		assertTrue(found.isEmpty());
		// Should return 1 object
		found = userRepository.findByFullName("Fred");
		assertEquals(1, found.size());
		// Should return 2 objects
		found = userRepository.findByFullName("Weasley");
		assertEquals(2, found.size());
	}
}
