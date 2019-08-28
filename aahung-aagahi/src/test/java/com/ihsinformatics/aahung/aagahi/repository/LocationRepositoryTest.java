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

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.ihsinformatics.aahung.aagahi.BaseTestData;
import com.ihsinformatics.aahung.aagahi.model.Location;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(SpringRunner.class)
@DataJpaTest
public class LocationRepositoryTest extends BaseTestData {

	@Autowired
	private LocationRepository locationRepository;
	
	@Before
	public void reset() {
		super.reset();
	}
	
	@After
	public void flushAll() {
		super.flushAll();
	}

	@Test
	public void shouldSave() {
		hogwartz = locationRepository.save(hogwartz);
		locationRepository.flush();
		Location found = entityManager.find(Location.class, hogwartz.getLocationId());
		assertNotNull(found);
	}

	@Test
	public void shouldDelete() {
		diagonalley = entityManager.persist(diagonalley);
		entityManager.flush();
		Integer id = diagonalley.getLocationId();
		entityManager.detach(diagonalley);
		locationRepository.delete(diagonalley);
		Location found = entityManager.find(Location.class, id);
		assertNull(found);
	}

	@Test
	public void shouldFindById() throws Exception {
		Object id = entityManager.persistAndGetId(hogwartz);
		entityManager.flush();
		entityManager.detach(hogwartz);
		Optional<Location> found = locationRepository.findById((Integer) id);
		assertTrue(found.isPresent());
	}

	@Test
	public void shouldFindByUuid() throws Exception {
		diagonalley = entityManager.persist(diagonalley);
		entityManager.flush();
		String uuid = diagonalley.getUuid();
		entityManager.detach(diagonalley);
		Location found = locationRepository.findByUuid(uuid);
		assertNotNull(found);
	}

	@Test
	public void shouldFindByShortName() {
		diagonalley = entityManager.persist(hogwartz);
		entityManager.flush();
		entityManager.detach(diagonalley);
		Location found = locationRepository.findByShortName("HSWW");
		assertNotNull(found);
		assertEquals(hogwartz, found);
	}

	@Test
	public void shouldFindByName() {
		// Save some locations
		for (Location location : Arrays.asList(diagonalley, hogwartz)) {
			entityManager.persist(location);
			entityManager.flush();
			entityManager.detach(location);
		}
		// Should be empty
		List<Location> found = locationRepository.findByLocationName("Test 123");
		assertTrue(found.isEmpty());
		// Should return 1 object
		found = locationRepository.findByLocationName("Diagon Alley");
		assertEquals(1, found.size());
	}
	
	@Test
	public void shouldFindByCategory() {
		// Save some locations
		for (Location location : Arrays.asList(diagonalley, hogwartz)) {
			entityManager.persist(location);
			entityManager.flush();
			entityManager.detach(location);
		}
		// Should be empty
		List<Location> found = locationRepository.findByCategory(market);
		assertEquals(1, found.size());
		// Should return 1 object
		found = locationRepository.findByCategory(school);
		assertEquals(1, found.size());
	}
}
