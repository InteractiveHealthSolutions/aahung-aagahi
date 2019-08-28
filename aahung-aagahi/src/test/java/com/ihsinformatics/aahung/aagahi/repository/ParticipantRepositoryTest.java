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
import com.ihsinformatics.aahung.aagahi.model.Definition;
import com.ihsinformatics.aahung.aagahi.model.Participant;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(SpringRunner.class)
@DataJpaTest
public class ParticipantRepositoryTest extends BaseTestData {

	@Autowired
	private ParticipantRepository participantRepository;
	
	@Before
	public void reset() {
		super.reset();
		Definition category = entityManager.find(Definition.class, 1);
		hogwartz.setCategory(category);
		hogwartz = entityManager.persist(hogwartz);
		entityManager.flush();
		harry = entityManager.persist(harry);
		ron = entityManager.persist(ron);
		entityManager.flush();
		seeker.setPerson(harry);
		seeker.setLocation(hogwartz);
		keeper.setPerson(ron);
		keeper.setLocation(hogwartz);
		entityManager.flush();
	}

	@After
	public void flushAll() {
		super.flushAll();
	}

	@Test
	public void shouldSave() {
		seeker = participantRepository.save(seeker);
		participantRepository.flush();
		Participant found = entityManager.find(Participant.class, seeker.getParticipantId());
		assertNotNull(found);
	}

	@Test
	public void shouldDelete() {
		seeker = entityManager.persist(seeker);
		entityManager.flush();
		Integer id = seeker.getParticipantId();
		entityManager.detach(seeker);
		participantRepository.delete(seeker);
		Participant found = entityManager.find(Participant.class, id);
		assertNull(found);
	}

	@Test
	public void shouldFindById() throws Exception {
		Object id = entityManager.persistAndGetId(seeker);
		entityManager.flush();
		entityManager.detach(seeker);
		Optional<Participant> found = participantRepository.findById((Integer) id);
		assertTrue(found.isPresent());
	}

	@Test
	public void shouldFindByUuid() throws Exception {
		seeker = entityManager.persist(seeker);
		entityManager.flush();
		String uuid = seeker.getUuid();
		entityManager.detach(seeker);
		Participant found = participantRepository.findByUuid(uuid);
		assertNotNull(found);
	}

	@Test
	public void shouldFindByIdentifier() {
		seeker = entityManager.persist(seeker);
		entityManager.flush();
		entityManager.detach(seeker);
		Participant found = participantRepository.findByIdentifier(seeker.getIdentifier());
		assertNotNull(found);
		assertEquals(seeker, found);
	}

	@Test
	public void shouldFindByLocation() {
		for (Participant participant : Arrays.asList(seeker, keeper)) {
			entityManager.persist(participant);
			entityManager.flush();
			entityManager.detach(participant);
		}
		List<Participant> found = participantRepository.findByLocation(hogwartz);
		assertNotNull(found);
		assertEquals(2, found.size());
	}
}
