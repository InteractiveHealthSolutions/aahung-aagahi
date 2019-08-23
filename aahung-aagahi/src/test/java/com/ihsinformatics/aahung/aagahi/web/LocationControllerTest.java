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
import com.ihsinformatics.aahung.aagahi.service.LocationService;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(MockitoJUnitRunner.class)
public class LocationControllerTest extends BaseTestData {

	protected static String API_PREFIX = "/api/";

	protected MockMvc mockMvc;

	@Mock
	protected LocationService locationService;

	@InjectMocks
	protected LocationController locationController;

	@Before
	public void reset() {
		super.initData();
		MockitoAnnotations.initMocks(this);
		mockMvc = MockMvcBuilders.standaloneSetup(locationController).alwaysDo(MockMvcResultHandlers.print()).build();
	}

	/**
	 * @throws java.lang.Exception
	 */
	@Test
	public void shouldGetLocation() throws Exception {
		when(locationService.getLocationByUuid(any(String.class))).thenReturn(hogwartz);
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "location/{uuid}", hogwartz.getUuid()));
		actions.andExpect(status().isOk());
		actions.andExpect(jsonPath("$.locationName", Matchers.is(hogwartz.getLocationName())));
		actions.andExpect(jsonPath("$.shortName", Matchers.is(hogwartz.getShortName())));
		verify(locationService, times(1)).getLocationByUuid(any(String.class));
	}

	@Test
	public void shouldGetLocations() throws Exception {
		when(locationService.getAllLocations()).thenReturn(Arrays.asList(hogwartz, diagonalley));
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "locations"));
		actions.andExpect(status().isOk());
		actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
		actions.andExpect(jsonPath("$", Matchers.hasSize(2)));
		verify(locationService, times(1)).getAllLocations();
		verifyNoMoreInteractions(locationService);
	}

	@Test
	public void shouldGetLocationList() throws Exception {
		when(locationService.getAllLocations()).thenReturn(Arrays.asList(hogwartz, diagonalley));
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "location/list"));
		actions.andExpect(status().isOk());
		actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
		actions.andExpect(jsonPath("$", Matchers.hasSize(2)));
		actions.andDo(MockMvcResultHandlers.print());
		verify(locationService, times(1)).getAllLocations();
		verifyNoMoreInteractions(locationService);
	}

	@Test
	public void shouldCreateLocation() throws Exception {
		when(locationService.saveLocation(any(Location.class))).thenReturn(diagonalley);
		String content = BaseEntity.getGson().toJson(diagonalley);
		RequestBuilder requestBuilder = MockMvcRequestBuilders.post(API_PREFIX + "location")
		        .accept(MediaType.APPLICATION_JSON_UTF8).contentType(MediaType.APPLICATION_JSON_UTF8).content(content);
		ResultActions actions = mockMvc.perform(requestBuilder);
		actions.andExpect(status().isCreated());
		String expectedUrl = API_PREFIX + "location/" + diagonalley.getUuid();
		actions.andExpect(MockMvcResultMatchers.redirectedUrl(expectedUrl));
		actions.andDo(MockMvcResultHandlers.print());
		verify(locationService, times(1)).saveLocation(any(Location.class));
	}

	@Test
	public void shouldUpdateLocation() throws Exception {
		when(locationService.updateLocation(any(Location.class))).thenReturn(hogwartz);
		String content = BaseEntity.getGson().toJson(hogwartz);
		ResultActions actions = mockMvc.perform(put(API_PREFIX + "location/{uuid}", hogwartz.getUuid())
		        .contentType(MediaType.APPLICATION_JSON_UTF8).content(content));
		actions.andExpect(status().isOk());
		verify(locationService, times(1)).updateLocation(any(Location.class));
	}

	@Test
	public void shouldDeleteLocation() throws Exception {
		when(locationService.getLocationByUuid(any(String.class))).thenReturn(diagonalley);
		doNothing().when(locationService).deleteLocation(diagonalley);
		ResultActions actions = mockMvc.perform(delete(API_PREFIX + "location/{uuid}", diagonalley.getUuid()));
		actions.andExpect(status().isNoContent());
		verify(locationService, times(1)).getLocationByUuid(diagonalley.getUuid());
		verify(locationService, times(1)).deleteLocation(diagonalley);
		verifyNoMoreInteractions(locationService);
	}
}
