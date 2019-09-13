/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/
package com.ihsinformatics.aahung.aagahi.service;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.Mock;

import com.ihsinformatics.aahung.aagahi.BaseServiceTest;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.model.Person;

/**
 * @author owais.hussain@ihsinformatics.com
 */
public class ParticipantServiceTest extends BaseServiceTest {

	@Mock
	protected ValidationServiceImpl validationService;

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
		super.reset();
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#deleteParticipant(com.ihsinformatics.aahung.aagahi.model.Participant)}.
	 */
	@Test
	public void shouldDeleteParticipant() {
		when(participantRepository.findById(any(Integer.class))).thenReturn(null);
		doNothing().when(participantRepository).delete(any(Participant.class));
		participantService.deleteParticipant(seeker);
		verify(participantRepository, times(1)).delete(any(Participant.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#getParticipantById(java.lang.Integer)}.
	 */
	@Test
	public void shouldGetParticipantById() {
		Optional<Participant> attributeObj = Optional.of(seeker);
		when(participantRepository.findById(any(Integer.class))).thenReturn(attributeObj);
		assertThat(participantService.getParticipantById(1), is(seeker));
		verify(participantRepository, times(1)).findById(any(Integer.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#getParticipantByIdentifier(java.lang.String)}.
	 */
	@Test
	public void shouldGetParticipantByIdentifier() {
		when(participantRepository.findByIdentifier(any(String.class))).thenReturn(seeker);
		assertThat(participantService.getParticipantByIdentifier(seeker.getIdentifier()), is(seeker));
		verify(participantRepository, times(1)).findByIdentifier(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#getParticipantsByName(java.lang.String)}.
	 */
	@Test
	@Ignore
	public void shouldGetParticipantsByName() {
		seeker.getPerson().setPersonId(100);
		when(participantRepository.findById(any(Integer.class))).thenReturn(Optional.of(seeker));
		when(personRepository.findByPersonName(any(String.class), any(String.class), any(String.class)))
				.thenReturn(Arrays.asList(seeker.getPerson()));
		assertThat(participantService.getParticipantsByName(seeker.getPerson().getFirstName()), is(seeker.getPerson()));
		verify(personRepository, times(1)).findByPersonName(any(String.class), any(String.class), any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#getParticipantsByName(java.lang.String)}.
	 */
	@Test
	public void shouldNotGetParticipantsByName() {
		assertThat(participantService.getParticipantsByName("admin"), is(Collections.emptyList()));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#getParticipantByUuid(java.lang.String)}.
	 */
	@Test
	public void shouldGetParticipantByUuid() {
		when(participantRepository.findByUuid(any(String.class))).thenReturn(seeker);
		assertThat(participantService.getParticipantByUuid(seeker.getUuid()), is(seeker));
		verify(participantRepository, times(1)).findByUuid(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#getParticipantsByLocation(com.ihsinformatics.aahung.aagahi.model.Location)}.
	 */
	@Test
	public void shouldGetParticipantsByLocation() {
		when(participantRepository.findByLocation(any(Location.class))).thenReturn(Arrays.asList(seeker, keeper));
		assertThat(participantService.getParticipantsByLocation(hogwartz), Matchers.containsInAnyOrder(seeker, keeper));
		verify(participantRepository, times(1)).findByLocation(any(Location.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#saveParticipant(com.ihsinformatics.aahung.aagahi.model.Participant)}.
	 */
	@Test
	public void shouldSaveParticipant() {
		when(locationRepository.findById(any(Integer.class))).thenReturn(Optional.of(hogwartz));
		when(personRepository.findByUuid(any(String.class))).thenReturn(null);
		when(personRepository.save(any(Person.class))).thenReturn(harry);
		when(participantRepository.findByIdentifier(any(String.class))).thenReturn(null);
		hogwartz.setLocationId(1);
		seeker.setLocation(hogwartz);
		when(participantRepository.save(any(Participant.class))).thenReturn(seeker);
		assertThat(participantService.saveParticipant(seeker), is(seeker));
		verify(locationRepository, times(1)).findById(any(Integer.class));
		verify(personRepository, times(1)).findByUuid(any(String.class));
		verify(personRepository, times(1)).save(any(Person.class));
		verify(participantRepository, times(1)).save(any(Participant.class));
		verify(participantRepository, times(1)).findByIdentifier(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#updateParticipant(com.ihsinformatics.aahung.aagahi.model.Participant)}.
	 */
	@Test
	public void shouldUpdateParticipant() {
		when(participantRepository.save(any(Participant.class))).thenReturn(seeker);
		seeker = participantService.updateParticipant(seeker);
		assertNotNull(seeker.getDateUpdated());
		verify(participantRepository, times(1)).save(any(Participant.class));
	}
}
