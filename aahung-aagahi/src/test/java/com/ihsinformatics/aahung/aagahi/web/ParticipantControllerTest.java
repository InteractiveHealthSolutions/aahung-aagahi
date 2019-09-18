/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.web;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;

import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ihsinformatics.aahung.aagahi.BaseTestData;
import com.ihsinformatics.aahung.aagahi.model.BaseEntity;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.service.LocationService;
import com.ihsinformatics.aahung.aagahi.service.ParticipantService;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(MockitoJUnitRunner.class)
public class ParticipantControllerTest extends BaseTestData {

	private static String API_PREFIX = "/api/";

	private MockMvc mockMvc;

	@Mock
	private ParticipantService participantService;

	@Mock
	private LocationService locationService;

	@InjectMocks
	private ParticipantController participantController;

	@Before
	public void reset() {
		super.initData();
		MockitoAnnotations.initMocks(this);
		mockMvc = MockMvcBuilders.standaloneSetup(participantController).alwaysDo(MockMvcResultHandlers.print())
				.build();
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.ParticipantController#createParticipant(com.ihsinformatics.aahung.aagahi.model.Participant)}.
	 * 
	 * @throws Exception
	 */
	@Test
	public void shouldCreateParticipant() throws Exception {
		when(participantService.saveParticipant(any(Participant.class))).thenReturn(seeker);
		String content = BaseEntity.getGson().toJson(seeker);
		RequestBuilder requestBuilder = MockMvcRequestBuilders.post(API_PREFIX + "participant")
				.accept(MediaType.APPLICATION_JSON_UTF8).contentType(MediaType.APPLICATION_JSON_UTF8).content(content);
		ResultActions actions = mockMvc.perform(requestBuilder);
		actions.andExpect(status().isCreated());
		String expectedUrl = API_PREFIX + "participant/" + seeker.getUuid();
		actions.andExpect(MockMvcResultMatchers.redirectedUrl(expectedUrl));
		verify(participantService, times(1)).saveParticipant(any(Participant.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.ParticipantController#deleteParticipant(java.lang.String)}.
	 * 
	 * @throws Exception
	 */
	@Test
	public void shouldDeleteParticipant() throws Exception {
		when(participantService.getParticipantByUuid(any(String.class))).thenReturn(seeker);
		doNothing().when(participantService).deleteParticipant(seeker);
		ResultActions actions = mockMvc.perform(delete(API_PREFIX + "participant/{uuid}", seeker.getUuid()));
		actions.andExpect(status().isNoContent());
		verify(participantService, times(1)).getParticipantByUuid(seeker.getUuid());
		verify(participantService, times(1)).deleteParticipant(seeker);
		verifyNoMoreInteractions(participantService);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.ParticipantController#getParticipant(java.lang.String)}.
	 * 
	 * @throws Exception
	 */
	@Test
	public void shouldGetParticipant() throws Exception {
		when(participantService.getParticipantByUuid(any(String.class))).thenReturn(seeker);
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "participant/{uuid}", seeker.getUuid()));
		actions.andExpect(status().isOk());
		actions.andExpect(jsonPath("$.uuid", Matchers.is(seeker.getUuid())));
		verify(participantService, times(1)).getParticipantByUuid(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.ParticipantController#getPeopleByName(java.lang.String)}.
	 * 
	 * @throws Exception
	 */
	@Test
	public void shouldGetParticipantsByName() throws Exception {
		when(participantService.getParticipantsByName(any(String.class))).thenReturn(Arrays.asList(seeker));
		ResultActions actions = mockMvc
				.perform(get(API_PREFIX + "participant/name/{name}", seeker.getPerson().getFirstName()));
		actions.andExpect(status().isOk());
		actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
		actions.andExpect(jsonPath("$", Matchers.hasSize(1)));
		verify(participantService, times(1)).getParticipantsByName(any(String.class));
		verifyNoMoreInteractions(participantService);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.ParticipantController#updateParticipant(java.lang.String, com.ihsinformatics.aahung.aagahi.model.Participant)}.
	 * 
	 * @throws Exception
	 */
	@Test
	public void shouldUpdateParticipant() throws Exception {
		when(participantService.getParticipantByUuid(any(String.class))).thenReturn(seeker);
		when(participantService.updateParticipant(any(Participant.class))).thenReturn(seeker);
		String content = BaseEntity.getGson().toJson(seeker);
		ResultActions actions = mockMvc.perform(put(API_PREFIX + "participant/{uuid}", seeker.getUuid())
				.contentType(MediaType.APPLICATION_JSON_UTF8).content(content));
		actions.andExpect(status().isOk());
		verify(participantService, times(1)).getParticipantByUuid(any(String.class));
		verify(participantService, times(1)).updateParticipant(any(Participant.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.ParticipantController#getParticipantByIdentifier(java.lang.String)}.
	 * @throws Exception 
	 */
	@Test
	public void testGetParticipantByIdentifier() throws Exception {
		when(participantService.getParticipantByIdentifier(any(String.class))).thenReturn(seeker);
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "participant/identifier/{uuid}", seeker.getIdentifier()));
		actions.andExpect(status().isOk());
		actions.andExpect(jsonPath("$.uuid", Matchers.is(seeker.getUuid())));
		verify(participantService, times(1)).getParticipantByIdentifier(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.ParticipantController#getParticipantsByLocation(java.lang.String)}.
	 * @throws Exception 
	 */
	@Test
	public void testGetParticipantsByLocation() throws Exception {
		when(locationService.getLocationByUuid(any(String.class))).thenReturn(hogwartz);
		when(participantService.getParticipantsByLocation(any(Location.class))).thenReturn(Arrays.asList(seeker, keeper, chaser));
		ResultActions actions = mockMvc
				.perform(get(API_PREFIX + "participants/location/{uuid}", hogwartz.getUuid()));
		actions.andExpect(status().isOk());
		actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
		actions.andExpect(jsonPath("$", Matchers.hasSize(3)));
		verify(locationService, times(1)).getLocationByUuid(any(String.class));
		verify(participantService, times(1)).getParticipantsByLocation(any(Location.class));
		verifyNoMoreInteractions(participantService);
	}
}
