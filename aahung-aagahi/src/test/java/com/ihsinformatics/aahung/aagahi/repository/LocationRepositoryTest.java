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

import java.util.ArrayList;
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
import com.ihsinformatics.aahung.aagahi.model.Definition;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.util.SearchCriteria;
import com.ihsinformatics.aahung.aagahi.util.SearchOperator;

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
		initDefinitionTypes();
		locationType = entityManager.persist(locationType);
		entityManager.flush();
		initDefinitions();
		market = entityManager.persist(market);
		school = entityManager.persist(school);
		entityManager.flush();
		initLocations();
	}

	@Test
	public void shouldDelete() {
		burrow = entityManager.persist(burrow);
		entityManager.flush();
		Integer id = burrow.getLocationId();
		entityManager.detach(burrow);
		locationRepository.delete(burrow);
		Location found = entityManager.find(Location.class, id);
		assertNull(found);
	}

	@Test
	public void shouldFindByCategory() {
		for (Location location : Arrays.asList(diagonalley, burrow)) {
			entityManager.persist(location);
			entityManager.flush();
			entityManager.detach(location);
		}
		List<Location> found = locationRepository.findByCategory(school);
		assertTrue(found.isEmpty());
		found = locationRepository.findByCategory(market);
		assertEquals(2, found.size());
	}

	@Test
	public void shouldFindById() throws Exception {
		Object id = entityManager.persistAndGetId(burrow);
		entityManager.flush();
		entityManager.detach(burrow);
		Optional<Location> found = locationRepository.findById((Integer) id);
		assertTrue(found.isPresent());
	}

	@Test
	public void shouldFindByName() {
		for (Location location : Arrays.asList(diagonalley, burrow)) {
			entityManager.persist(location);
			entityManager.flush();
			entityManager.detach(location);
		}
		List<Location> found = locationRepository.findByLocationName("Test 123");
		assertTrue(found.isEmpty());
		found = locationRepository.findByLocationName("Diagon Alley");
		assertEquals(1, found.size());
	}

	@Test
	public void shouldFindByShortName() {
		burrow = entityManager.persist(burrow);
		entityManager.flush();
		entityManager.detach(burrow);
		Location found = locationRepository.findByShortName(burrow.getShortName());
		assertNotNull(found);
		assertEquals(burrow.getUuid(), found.getUuid());
	}

	@Test
	public void shouldFindByUuid() throws Exception {
		burrow = entityManager.persist(burrow);
		entityManager.flush();
		String uuid = burrow.getUuid();
		entityManager.detach(burrow);
		Location found = locationRepository.findByUuid(uuid);
		assertNotNull(found);
	}

	@Test
	public void shouldSave() {
		burrow = locationRepository.save(burrow);
		locationRepository.flush();
		Location found = entityManager.find(Location.class, burrow.getLocationId());
		assertNotNull(found);
	}

	@Test
	public void shouldSearchLocationsByParams() {
		Definition institute = Definition.builder().definitionType(locationType).definitionName("institute")
				.shortName("INSTITUTE").build();
		institute = entityManager.persist(market);
		entityManager.flush();
		Location durmstrang = Location.builder().locationName("Durmstrang Institute for Magical Learning")
				.shortName("DIML").address1("Durmstrang-Institut für Zauberei").landmark1("Scandinavia")
				.postalCode(998877).category(institute).country("Germany").attributes(new ArrayList<>()).build();
		Location ilvermorny = Location.builder().locationName("Ilvermorny School of Witchcraft and Wizardry")
				.shortName("ISWW").address1("Mount Greylock").landmark1("Adams").stateProvince("Massachusetts")
				.postalCode(876543).category(institute).country("USA").attributes(new ArrayList<>()).build();
		Location eeylops = Location.builder().locationName("Eeylops Owl Emporium").shortName("EOE")
				.landmark1("burrow School").postalCode(100000).category(institute).country("England")
				.attributes(new ArrayList<>()).build();
		Location godricHollow = Location.builder().locationName("Godric's Hollow").shortName("GH").landmark1("burrow")
				.postalCode(100010).category(institute).country("England").attributes(new ArrayList<>()).build();
		Location harryHouse = Location.builder().locationName("Harry's House").shortName("HH")
				.address1("4, Private Drive").landmark1("Cupboard under the stairs").cityVillage("Little Whinging")
				.stateProvince("Surrey").postalCode(75840).category(institute).country("England")
				.attributes(new ArrayList<>()).build();
		Location diagonalley = Location.builder().locationName("Diagon Alley").shortName("DALLEY").category(institute)
				.landmark1("burrow").country("England").attributes(new ArrayList<>()).build();
		for (Location location : Arrays.asList(durmstrang, ilvermorny, eeylops, harryHouse, godricHollow,
				diagonalley)) {
			entityManager.persist(location);
			entityManager.flush();
			entityManager.detach(location);
		}
		List<SearchCriteria> params = new ArrayList<>();
		// Search by postal codes
		params.add(new SearchCriteria("postalCode", SearchOperator.GREATER_THAN_EQUALS, "870000"));
		List<Location> found = locationRepository.search(params);
		// Should return 2 objects
		assertEquals(2, found.size());
		params.clear();
		// Search by country and landmark
		params.add(new SearchCriteria("country", SearchOperator.EQUALS, "England"));
		params.add(new SearchCriteria("landmark1", SearchOperator.LIKE, "burrow"));
		found = locationRepository.search(params);
		// Should return 3 objects
		assertEquals(3, found.size());
		params.clear();
	}
}
