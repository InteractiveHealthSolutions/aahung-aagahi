/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.web;

import static org.junit.Assert.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

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
import com.ihsinformatics.aahung.aagahi.model.FormData;
import com.ihsinformatics.aahung.aagahi.model.FormType;
import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.service.FormService;
import com.ihsinformatics.aahung.aagahi.util.DateTimeUtil;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(MockitoJUnitRunner.class)
public class FormControllerTest extends BaseTestData {

	protected static String API_PREFIX = "/api/";

	protected MockMvc mockMvc;

	@Mock
	protected FormService metadataService;

	@InjectMocks
	protected FormController donorController;

	private FormType challengeForm, trainingForm;

	private FormData quidditch95, quidditch98, drinkingChallenge, reverseFlightTraining;

	@Before
	public void reset() {
		super.initData();
		MockitoAnnotations.initMocks(this);
		mockMvc = MockMvcBuilders.standaloneSetup(donorController).alwaysDo(MockMvcResultHandlers.print()).build();
		challengeForm = FormType.builder().formName("Challenge Participation Form").shortName("CHALLENGE").build();
		trainingForm = FormType.builder().formName("Training Registration Form").shortName("TRAINING").build();

		Set<Participant> participants = new HashSet<>();
		participants.add(seeker);
		participants.add(keeper);
		quidditch95 = FormData.builder().formType(quidditchForm).location(hogwartz)
				.formDate(DateTimeUtil.create(15, 1, 1995)).referenceId("1995").formParticipants(participants).build();
		participants.add(chaser);
		quidditch98 = FormData.builder().formType(quidditchForm).location(hogwartz)
				.formDate(DateTimeUtil.create(1, 2, 1998)).referenceId("1998").formParticipants(participants).build();
		drinkingChallenge = FormData.builder().formType(challengeForm).location(diagonalley)
				.formDate(DateTimeUtil.create(20, 6, 1995)).referenceId("DALLEY_CH_24").build();
		reverseFlightTraining = FormData.builder().formType(trainingForm).location(diagonalley)
				.formDate(DateTimeUtil.create(1, 2, 1998)).referenceId("DALLEY_TR_144").formParticipants(participants)
				.build();
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.FormController#createFormData(com.ihsinformatics.aahung.aagahi.model.FormData)}.
	 * 
	 * @throws Exception
	 */
	@Test
	public void shouldCreateFormData() throws Exception {
		when(metadataService.saveFormData(any(FormData.class))).thenReturn(quidditch95);
		String content = BaseEntity.getGson().toJson(quidditch95);
		RequestBuilder requestBuilder = MockMvcRequestBuilders.post(API_PREFIX + "formdata")
				.accept(MediaType.APPLICATION_JSON_UTF8).contentType(MediaType.APPLICATION_JSON_UTF8).content(content);
		ResultActions actions = mockMvc.perform(requestBuilder);
		actions.andExpect(status().isCreated());
		String expectedUrl = API_PREFIX + "formdata/" + quidditch95.getUuid();
		actions.andExpect(MockMvcResultMatchers.redirectedUrl(expectedUrl));
		verify(metadataService, times(1)).saveFormData(any(FormData.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.FormController#createFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 * 
	 * @throws Exception
	 */
	@Test
	public void shouldCreateFormType() throws Exception {
		when(metadataService.saveFormType(any(FormType.class))).thenReturn(quidditchForm);
		String content = BaseEntity.getGson().toJson(quidditchForm);
		RequestBuilder requestBuilder = MockMvcRequestBuilders.post(API_PREFIX + "definition")
				.accept(MediaType.APPLICATION_JSON_UTF8).contentType(MediaType.APPLICATION_JSON_UTF8).content(content);
		ResultActions actions = mockMvc.perform(requestBuilder);
		actions.andExpect(status().isCreated());
		String expectedUrl = API_PREFIX + "formtype/" + quidditchForm.getUuid();
		actions.andExpect(MockMvcResultMatchers.redirectedUrl(expectedUrl));
		verify(metadataService, times(1)).saveFormType(any(FormType.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.FormController#getFormData(java.lang.String)}.
	 */
	@Test
	public void shouldGetFormData() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.FormController#getFormDataByDateRange(java.util.Date, java.util.Date, java.lang.Integer, java.lang.Integer)}.
	 */
	@Test
	public void shouldGetFormDataByDateRange() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.FormController#getFormDataByLocation(java.lang.String)}.
	 */
	@Test
	public void shouldGetFormDataByLocation() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.FormController#getFormDataByReferenceId(java.lang.String)}.
	 */
	@Test
	public void shouldGetFormDataByReferenceId() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.FormController#getFormType(java.lang.String)}.
	 * 
	 * @throws Exception
	 */
	@Test
	public void shouldGetFormType() throws Exception {
		when(metadataService.getFormTypeByUuid(any(String.class))).thenReturn(quidditchForm);
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "formtype/{uuid}", quidditchForm.getUuid()));
		actions.andExpect(status().isOk());
		actions.andExpect(jsonPath("$.shortName", Matchers.is(quidditchForm.getShortName())));
		verify(metadataService, times(1)).getFormTypeByUuid(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.FormController#getFormTypeByShortName(java.lang.String)}.
	 * @throws Exception 
	 */
	@Test
	public void shouldGetFormTypeByShortName() throws Exception {
		when(metadataService.getFormTypeByName(any(String.class))).thenReturn(quidditchForm);
		ResultActions actions = mockMvc
				.perform(get(API_PREFIX + "formtype/name/{name}", quidditchForm.getShortName()));
		actions.andExpect(status().isOk());
		actions.andExpect(jsonPath("$.shortName", Matchers.is(quidditchForm.getShortName())));
		verify(metadataService, times(1)).getFormTypeByName(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.FormController#getFormTypes()}.
	 * @throws Exception 
	 */
	@Test
	public void shouldGetFormTypes() throws Exception {
		when(metadataService.getAllFormTypes(true)).thenReturn(Arrays.asList(quidditchForm, challengeForm, trainingForm));
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "formtypes"));
		actions.andExpect(status().isOk());
		actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
		actions.andExpect(jsonPath("$", Matchers.hasSize(3)));
		verify(metadataService, times(1)).getAllFormTypes(true);
		verifyNoMoreInteractions(metadataService);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.FormController#retireFormType(java.lang.String)}.
	 */
	@Test
	public void shouldRetireFormType() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.FormController#searchFormData(com.ihsinformatics.aahung.aagahi.model.FormType, com.ihsinformatics.aahung.aagahi.model.Location, java.util.Date, java.util.Date, java.lang.Integer, java.lang.Integer)}.
	 */
	@Test
	public void shouldSearchFormData() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.FormController#unretireFormType(java.lang.String)}.
	 */
	@Test
	public void shouldUnretireFormType() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.FormController#unvoidFormData(java.lang.String)}.
	 */
	@Test
	public void shouldUnvoidFormData() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.FormController#updateFormData(java.lang.String, com.ihsinformatics.aahung.aagahi.model.FormData)}.
	 */
	@Test
	public void shouldUpdateFormData() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.FormController#updateFormType(java.lang.String, com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 * @throws Exception 
	 */
	@Test
	public void shouldUpdateFormType() throws Exception {
		when(metadataService.updateFormType(any(FormType.class))).thenReturn(quidditchForm);
		String content = BaseEntity.getGson().toJson(quidditchForm);
		ResultActions actions = mockMvc.perform(put(API_PREFIX + "formtype/{uuid}", quidditchForm.getUuid())
				.contentType(MediaType.APPLICATION_JSON_UTF8).content(content));
		actions.andExpect(status().isOk());
		verify(metadataService, times(1)).updateFormType(any(FormType.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.FormController#voidFormData(java.lang.String)}.
	 */
	@Test
	public void shouldVoidFormData() {
		fail("Not yet implemented"); // TODO
	}
}
