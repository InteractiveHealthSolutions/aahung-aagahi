/* Copyright(C) 2018 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.web;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.UUID;

import org.hamcrest.Matchers;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ihsinformatics.aahung.aagahi.BaseTest;
import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl;

/**
 * @author owais.hussain@ihsinformatics.com
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class ParticipantControllerTest extends BaseTest {

	protected static String API_PREFIX = "/api/";

	protected MockMvc mockMvc;

	@Mock
	private ParticipantServiceImpl service;

	@InjectMocks
	protected ParticipantController participantController;

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
		MockitoAnnotations.initMocks(this);
		mockMvc = MockMvcBuilders.standaloneSetup(participantController).build();
	}

	/**
	 * @throws java.lang.Exception
	 */
	@After
	public void tearDown() throws Exception {
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.ParticipantController#getParticipant(java.lang.Long)}.
	 * 
	 * @throws Exception
	 */
	@Test
	public void testGetParticipant() throws Exception {
		Participant participant = seeker;
		String uuid = UUID.randomUUID().toString();
		participant.setUuid(uuid);
		when(service.getParticipant(uuid.toString())).thenReturn(participant);
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "participant/{uuid}", participant.getUuid()));
		actions.andExpect(status().isOk());
		actions.andExpect(jsonPath("$.firstName", Matchers.is(participant.getPerson().getFirstName())));
		actions.andExpect(jsonPath("$.lastName", Matchers.is(participant.getPerson().getLastName())));
		verify(service, times(1)).getParticipant(uuid.toString());
	}

	@Test
	public void testGetParticipants() throws Exception {
		when(service.getParticipants()).thenReturn(Arrays.asList(seeker, keeper, chaser));
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "participants"));
		actions.andExpect(status().isOk());
		actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
		actions.andExpect(jsonPath("$", Matchers.hasSize(3)));
		verify(service, times(1)).getParticipants();
		verifyNoMoreInteractions(service);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.ParticipantController#createParticipant(com.ihsinformatics.aahung.aagahi.model.Participant)}.
	 */
	@Test
	public void testCreateParticipant() {
		// TODO:
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.ParticipantController#updateParticipant(java.lang.Long, com.ihsinformatics.aahung.aagahi.model.Participant)}.
	 */
	@Test
	public void testUpdateParticipant() {
		// TODO:
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.ParticipantController#deleteParticipant(java.lang.Long)}.
	 */
	@Test
	public void testDeleteParticipant() {
		// TODO:
	}
}
