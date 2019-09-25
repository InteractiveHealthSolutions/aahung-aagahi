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
import java.util.List;

import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
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
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.ihsinformatics.aahung.aagahi.BaseTestData;
import com.ihsinformatics.aahung.aagahi.dto.LocationAttributeDto;
import com.ihsinformatics.aahung.aagahi.dto.LocationAttributePackageDto;
import com.ihsinformatics.aahung.aagahi.dto.LocationDto;
import com.ihsinformatics.aahung.aagahi.model.BaseEntity;
import com.ihsinformatics.aahung.aagahi.model.Definition;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.LocationAttribute;
import com.ihsinformatics.aahung.aagahi.model.LocationAttributeType;
import com.ihsinformatics.aahung.aagahi.service.LocationService;
import com.ihsinformatics.aahung.aagahi.service.MetadataService;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(MockitoJUnitRunner.class)
public class LocationControllerTest extends BaseTestData {

    private static String API_PREFIX = "/api/";

    private MockMvc mockMvc;

    @Mock
    private LocationService locationService;

    @Mock
    private MetadataService metadataService;

    @InjectMocks
    private LocationController locationController;

    @Before
    public void reset() {
	super.initData();
	MockitoAnnotations.initMocks(this);
	mockMvc = MockMvcBuilders.standaloneSetup(locationController).alwaysDo(MockMvcResultHandlers.print()).build();
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#createLocation(com.ihsinformatics.aahung.aagahi.model.Location)}.
     * 
     * @throws Exception
     */
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

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#createLocationAttribute(com.ihsinformatics.aahung.aagahi.model.LocationAttribute)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldCreateLocationAttribute() throws Exception {
	when(locationService.saveLocationAttribute(any(LocationAttribute.class))).thenReturn(noOfHogwartzStudents);
	String content = BaseEntity.getGson().toJson(noOfHogwartzStudents);
	RequestBuilder requestBuilder = MockMvcRequestBuilders.post(API_PREFIX + "locationattribute")
		.accept(MediaType.APPLICATION_JSON_UTF8).contentType(MediaType.APPLICATION_JSON_UTF8).content(content);
	ResultActions actions = mockMvc.perform(requestBuilder);
	actions.andExpect(status().isCreated());
	String expectedUrl = API_PREFIX + "locationattribute/" + noOfHogwartzStudents.getUuid();
	actions.andExpect(MockMvcResultMatchers.redirectedUrl(expectedUrl));
	actions.andDo(MockMvcResultHandlers.print());
	verify(locationService, times(1)).saveLocationAttribute(any(LocationAttribute.class));
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#createLocationAttributes(com.ihsinformatics.aahung.aagahi.dto.LocationAttributePackageDto))}.
     * 
     * @throws Exception
     */
    @SuppressWarnings("unchecked")
    @Test
    public void shouldCreateLocationAttributes() throws Exception {
	hogwartz.setLocationId(100);
	noOfTeachers.setAttributeTypeId(101);
	noOfStudents.setAttributeTypeId(102);
	initLocationAttributes();
	when(locationService.getLocationById(any(Integer.class))).thenReturn(hogwartz);
	when(locationService.getLocationAttributeTypeById(noOfStudents.getAttributeTypeId())).thenReturn(noOfStudents);
	when(locationService.getLocationAttributeTypeById(noOfTeachers.getAttributeTypeId())).thenReturn(noOfTeachers);
	when(locationService.saveLocationAttributes(any(List.class)))
		.thenReturn(Arrays.asList(noOfHogwartzStudents, noOfHogwartzTeachers));
	LocationAttributeDto noOfHogwartzStudentsDto = new LocationAttributeDto(noOfHogwartzStudents);
	LocationAttributeDto noOfHogwartzTeachersDto = new LocationAttributeDto(noOfHogwartzTeachers);
	LocationAttributePackageDto attributesPackage = new LocationAttributePackageDto(
		Arrays.asList(noOfHogwartzStudentsDto, noOfHogwartzTeachersDto));
	String content = BaseEntity.getGson().toJson(attributesPackage);
	RequestBuilder requestBuilder = MockMvcRequestBuilders.post(API_PREFIX + "locationattributes")
		.accept(MediaType.APPLICATION_JSON_UTF8).contentType(MediaType.APPLICATION_JSON_UTF8).content(content);
	ResultActions actions = mockMvc.perform(requestBuilder);
	actions.andExpect(status().isCreated());
	String expectedUrl = API_PREFIX + "location/" + hogwartz.getUuid();
	actions.andExpect(MockMvcResultMatchers.redirectedUrl(expectedUrl));
	actions.andDo(MockMvcResultHandlers.print());
	verify(locationService, times(1)).saveLocationAttributes(any(List.class));
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#createLocationAttributeType(com.ihsinformatics.aahung.aagahi.model.LocationAttributeType)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldCreateLocationAttributeType() throws Exception {
	when(locationService.saveLocationAttributeType(any(LocationAttributeType.class))).thenReturn(noOfStudents);
	String content = BaseEntity.getGson().toJson(noOfStudents);
	RequestBuilder requestBuilder = MockMvcRequestBuilders.post(API_PREFIX + "locationattributetype")
		.accept(MediaType.APPLICATION_JSON_UTF8).contentType(MediaType.APPLICATION_JSON_UTF8).content(content);
	ResultActions actions = mockMvc.perform(requestBuilder);
	actions.andExpect(status().isCreated());
	String expectedUrl = API_PREFIX + "locationattributetype/" + noOfStudents.getUuid();
	actions.andExpect(MockMvcResultMatchers.redirectedUrl(expectedUrl));
	actions.andDo(MockMvcResultHandlers.print());
	verify(locationService, times(1)).saveLocationAttributeType(any(LocationAttributeType.class));
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#deleteLocation(java.lang.String)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldDeleteLocation() throws Exception {
	when(locationService.getLocationByUuid(any(String.class))).thenReturn(diagonalley);
	doNothing().when(locationService).deleteLocation(diagonalley, true);
	ResultActions actions = mockMvc.perform(delete(API_PREFIX + "location/{uuid}", diagonalley.getUuid()));
	actions.andExpect(status().isNoContent());
	verify(locationService, times(1)).getLocationByUuid(diagonalley.getUuid());
	verify(locationService, times(1)).deleteLocation(diagonalley, true);
	verifyNoMoreInteractions(locationService);
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#deleteLocationAttribute(java.lang.String)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldDeleteLocationAttribute() throws Exception {
	when(locationService.getLocationAttributeByUuid(any(String.class))).thenReturn(noOfHogwartzStudents);
	doNothing().when(locationService).deleteLocationAttribute(noOfHogwartzStudents);
	ResultActions actions = mockMvc
		.perform(delete(API_PREFIX + "locationattribute/{uuid}", noOfHogwartzStudents.getUuid()));
	actions.andExpect(status().isNoContent());
	verify(locationService, times(1)).getLocationAttributeByUuid(noOfHogwartzStudents.getUuid());
	verify(locationService, times(1)).deleteLocationAttribute(noOfHogwartzStudents);
	verifyNoMoreInteractions(locationService);
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocation(java.lang.String)}.
     * 
     * @throws Exception
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

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocationAttribute(java.lang.String)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldGetLocationAttribute() throws Exception {
	when(locationService.getLocationAttributeByUuid(any(String.class))).thenReturn(noOfHogwartzStudents);
	ResultActions actions = mockMvc
		.perform(get(API_PREFIX + "locationattribute/{uuid}", noOfHogwartzStudents.getUuid()));
	actions.andExpect(status().isOk());
	actions.andExpect(
		jsonPath("$.attributeValue", Matchers.equalToIgnoringCase(noOfHogwartzStudents.getAttributeValue())));
	verify(locationService, times(1)).getLocationAttributeByUuid(any(String.class));
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocationAttributeById(java.lang.Integer)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldGetLocationAttributeById() throws Exception {
	when(locationService.getLocationAttributeById(any(Integer.class))).thenReturn(noOfHogwartzStudents);
	ResultActions actions = mockMvc.perform(get(API_PREFIX + "locationattribute/id/{id}", 1));
	actions.andExpect(status().isOk());
	actions.andExpect(jsonPath("$.uuid", Matchers.is(noOfHogwartzStudents.getUuid())));
	verify(locationService, times(1)).getLocationAttributeById(any(Integer.class));
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocationAttributesByLocation(java.lang.String)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldGetLocationAttributesByLocation() throws Exception {
	when(locationService.getLocationByUuid(any(String.class))).thenReturn(hogwartz);
	when(locationService.getLocationAttributesByLocation(any(Location.class)))
		.thenReturn(Arrays.asList(noOfHogwartzStudents, noOfHogwartzTeachers));
	ResultActions actions = mockMvc
		.perform(get(API_PREFIX + "locationattributes/location/{uuid}", hogwartz.getUuid()));
	actions.andExpect(status().isOk());
	actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
	actions.andExpect(jsonPath("$", Matchers.hasSize(2)));
	verify(locationService, times(1)).getLocationByUuid(any(String.class));
	verify(locationService, times(1)).getLocationAttributesByLocation(any(Location.class));
	verifyNoMoreInteractions(locationService);
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocationAttributesByLocation(java.lang.String)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldGetLocationAttributesByLocationShortName() throws Exception {
	when(locationService.getLocationByShortName(any(String.class))).thenReturn(hogwartz);
	when(locationService.getLocationAttributesByLocation(any(Location.class)))
		.thenReturn(Arrays.asList(noOfHogwartzStudents, noOfHogwartzTeachers));
	ResultActions actions = mockMvc
		.perform(get(API_PREFIX + "locationattributes/location/{uuid}", hogwartz.getShortName()));
	actions.andExpect(status().isOk());
	actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
	actions.andExpect(jsonPath("$", Matchers.hasSize(2)));
	verify(locationService, times(1)).getLocationByShortName(any(String.class));
	verify(locationService, times(1)).getLocationAttributesByLocation(any(Location.class));
	verifyNoMoreInteractions(locationService);
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocationAttributeType(java.lang.String)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldGetLocationAttributeType() throws Exception {
	when(locationService.getLocationAttributeTypeByUuid(any(String.class))).thenReturn(noOfStudents);
	ResultActions actions = mockMvc
		.perform(get(API_PREFIX + "locationattributetype/{uuid}", noOfStudents.getUuid()));
	actions.andExpect(status().isOk());
	actions.andExpect(jsonPath("$.shortName", Matchers.is(noOfStudents.getShortName())));
	verify(locationService, times(1)).getLocationAttributeTypeByUuid(any(String.class));
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocationAttributeTypeById(java.lang.Integer)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldGetLocationAttributeTypeById() throws Exception {
	when(locationService.getLocationAttributeTypeById(any(Integer.class))).thenReturn(noOfStudents);
	ResultActions actions = mockMvc.perform(get(API_PREFIX + "locationattributetype/id/{id}", 1));
	actions.andExpect(status().isOk());
	actions.andExpect(jsonPath("$.uuid", Matchers.is(noOfStudents.getUuid())));
	verify(locationService, times(1)).getLocationAttributeTypeById(any(Integer.class));
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocationAttributeTypeByShortName(java.lang.String)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldGetLocationAttributeTypeByShortName() throws Exception {
	when(locationService.getLocationAttributeTypeByShortName(any(String.class))).thenReturn(noOfStudents);
	ResultActions actions = mockMvc
		.perform(get(API_PREFIX + "locationattributetype/shortname/{shortName}", noOfStudents.getShortName()));
	actions.andExpect(status().isOk());
	actions.andExpect(jsonPath("$.shortName", Matchers.is(noOfStudents.getShortName())));
	actions.andExpect(jsonPath("$.attributeName", Matchers.is(noOfStudents.getAttributeName())));
	verify(locationService, times(1)).getLocationAttributeTypeByShortName(any(String.class));
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocationAttributeTypes()}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldGetLocationAttributeTypes() throws Exception {
	when(locationService.getAllLocationAttributeTypes()).thenReturn(Arrays.asList(noOfStudents, noOfTeachers));
	ResultActions actions = mockMvc.perform(get(API_PREFIX + "locationattributetypes"));
	actions.andExpect(status().isOk());
	actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
	actions.andExpect(jsonPath("$", Matchers.hasSize(2)));
	verify(locationService, times(1)).getAllLocationAttributeTypes();
	verifyNoMoreInteractions(locationService);
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocationAttributeTypesByName(java.lang.String)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldGetLocationAttributeTypesByName() throws Exception {
	when(locationService.getLocationAttributeTypeByName(any(String.class))).thenReturn(noOfTeachers);
	ResultActions actions = mockMvc
		.perform(get(API_PREFIX + "locationattributetype/name/{name}", noOfTeachers.getAttributeName()));
	actions.andExpect(status().isOk());
	actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
	actions.andExpect(jsonPath("$.shortName", Matchers.is(noOfTeachers.getShortName())));
	actions.andExpect(jsonPath("$.attributeName", Matchers.is(noOfTeachers.getAttributeName())));
	verify(locationService, times(1)).getLocationAttributeTypeByName(any(String.class));
	verifyNoMoreInteractions(locationService);
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocationById(java.lang.Integer)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldGetLocationById() throws Exception {
	when(locationService.getLocationById(any(Integer.class))).thenReturn(hogwartz);
	ResultActions actions = mockMvc.perform(get(API_PREFIX + "location/id/{id}", 1));
	actions.andExpect(status().isOk());
	actions.andExpect(jsonPath("$.shortName", Matchers.is(hogwartz.getShortName())));
	verify(locationService, times(1)).getLocationById(any(Integer.class));
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocationByShortName(java.lang.String)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldGetLocationByShortName() throws Exception {
	when(locationService.getLocationByShortName(any(String.class))).thenReturn(diagonalley);
	ResultActions actions = mockMvc
		.perform(get(API_PREFIX + "location/shortname/{shortName}", diagonalley.getShortName()));
	actions.andExpect(status().isOk());
	actions.andExpect(jsonPath("$.shortName", Matchers.is(diagonalley.getShortName())));
	actions.andExpect(jsonPath("$.locationName", Matchers.is(diagonalley.getLocationName())));
	verify(locationService, times(1)).getLocationByShortName(any(String.class));
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocationList()}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldGetLocationList() throws Exception {
	when(locationService.getAllLocations()).thenReturn(Arrays.asList(hogwartz, diagonalley));
	ResultActions actions = mockMvc.perform(get(API_PREFIX + "location/list"));
	actions.andExpect(status().isOk());
	actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
	actions.andExpect(jsonPath("$", Matchers.hasSize(2)));
	LocationDto hogwartzDto = new LocationDto(hogwartz);
	LocationDto diagonalleyDto = new LocationDto(diagonalley);
	actions.andExpect(jsonPath("$[0].shortName", Matchers.is(hogwartzDto.getShortName())));
	actions.andExpect(jsonPath("$[1].shortName", Matchers.is(diagonalleyDto.getShortName())));
	actions.andDo(MockMvcResultHandlers.print());
	verify(locationService, times(1)).getAllLocations();
	verifyNoMoreInteractions(locationService);
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocations()}.
     * 
     * @throws Exception
     */
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

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocationsByAddress(java.lang.String, java.lang.String, java.lang.String, java.lang.String)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldGetLocationsByAddress() throws Exception {
	when(locationService.getLocationsByAddress(any(String.class), any(String.class), any(String.class),
		any(String.class))).thenReturn(Arrays.asList(hogwartz, diagonalley));
	ResultActions actions = mockMvc.perform(get(API_PREFIX + "locations/address").param("address", "")
		.param("cityVillage", "").param("stateProvince", "").param("country", england.getDefinitionName()));
	actions.andExpect(status().isOk());
	actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
	actions.andExpect(jsonPath("$", Matchers.hasSize(2)));
	actions.andExpect(jsonPath("$[0].shortName", Matchers.is(hogwartz.getShortName())));
	verify(locationService, times(1)).getLocationsByAddress(any(String.class), any(String.class), any(String.class),
		any(String.class));
	verifyNoMoreInteractions(locationService);
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocationsByCategory(java.lang.String)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldGetLocationsByCategory() throws Exception {
	when(metadataService.getDefinitionByUuid(any(String.class))).thenReturn(school);
	when(locationService.getLocationsByCategory(any(Definition.class)))
		.thenReturn(Arrays.asList(hogwartz, diagonalley));
	ResultActions actions = mockMvc.perform(get(API_PREFIX + "locations/category/{uuid}", school.getUuid()));
	actions.andExpect(status().isOk());
	actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
	actions.andExpect(jsonPath("$", Matchers.hasSize(2)));
	actions.andExpect(jsonPath("$[0].shortName", Matchers.is(hogwartz.getShortName())));
	verify(metadataService, times(1)).getDefinitionByUuid(any(String.class));
	verify(locationService, times(1)).getLocationsByCategory(any(Definition.class));
	verifyNoMoreInteractions(locationService);
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocationsByCategory(java.lang.String)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldGetLocationsByCategoryShortName() throws Exception {
	when(metadataService.getDefinitionByShortName(any(String.class))).thenReturn(school);
	when(locationService.getLocationsByCategory(any(Definition.class)))
		.thenReturn(Arrays.asList(hogwartz, diagonalley));
	ResultActions actions = mockMvc.perform(get(API_PREFIX + "locations/category/{uuid}", school.getShortName()));
	actions.andExpect(status().isOk());
	actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
	actions.andExpect(jsonPath("$", Matchers.hasSize(2)));
	actions.andExpect(jsonPath("$[0].shortName", Matchers.is(hogwartz.getShortName())));
	verify(metadataService, times(1)).getDefinitionByShortName(any(String.class));
	verify(locationService, times(1)).getLocationsByCategory(any(Definition.class));
	verifyNoMoreInteractions(locationService);
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocationsByContact(java.lang.String, java.lang.Boolean)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldGetLocationsByContact() throws Exception {
	when(locationService.getLocationsByContact(any(String.class), any(Boolean.class)))
		.thenReturn(Arrays.asList(hogwartz, burrow));
	ResultActions actions = mockMvc.perform(get(API_PREFIX + "locations/contact").param("contact", "447911123456")
		.param("primaryContactOnly", "false"));
	actions.andExpect(status().isOk());
	actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
	actions.andExpect(jsonPath("$", Matchers.hasSize(2)));
	actions.andExpect(jsonPath("$[0].shortName", Matchers.is(hogwartz.getShortName())));
	verify(locationService, times(1)).getLocationsByContact(any(String.class), any(Boolean.class));
	verifyNoMoreInteractions(locationService);
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocationByName(java.lang.String)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldGetLocationsByName() throws Exception {
	when(locationService.getLocationsByName(any(String.class))).thenReturn(Arrays.asList(hogwartz));
	ResultActions actions = mockMvc.perform(get(API_PREFIX + "locations/name/{name}", hogwartz.getLocationName()));
	actions.andExpect(status().isOk());
	actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
	actions.andExpect(jsonPath("$", Matchers.hasSize(1)));
	verify(locationService, times(1)).getLocationsByName(any(String.class));
	verifyNoMoreInteractions(locationService);
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocationsByParent(java.lang.String)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldGetLocationsByParent() throws Exception {
	diagonalley.setParentLocation(hogwartz);
	when(locationService.getLocationByUuid(any(String.class))).thenReturn(hogwartz);
	when(locationService.getLocationsByParent(any(Location.class))).thenReturn(Arrays.asList(diagonalley));
	ResultActions actions = mockMvc.perform(get(API_PREFIX + "locations/parent/{uuid}", hogwartz.getUuid()));
	actions.andExpect(status().isOk());
	actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
	actions.andExpect(jsonPath("$", Matchers.hasSize(1)));
	actions.andExpect(jsonPath("$[0].shortName", Matchers.is(diagonalley.getShortName())));
	verify(locationService, times(1)).getLocationByUuid(any(String.class));
	verify(locationService, times(1)).getLocationsByParent(any(Location.class));
	verifyNoMoreInteractions(locationService);
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#getLocationsByParent(java.lang.String)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldGetLocationsByParentShortName() throws Exception {
	diagonalley.setParentLocation(hogwartz);
	when(locationService.getLocationByShortName(any(String.class))).thenReturn(hogwartz);
	when(locationService.getLocationsByParent(any(Location.class))).thenReturn(Arrays.asList(diagonalley));
	ResultActions actions = mockMvc.perform(get(API_PREFIX + "locations/parent/{uuid}", hogwartz.getShortName()));
	actions.andExpect(status().isOk());
	actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
	actions.andExpect(jsonPath("$", Matchers.hasSize(1)));
	actions.andExpect(jsonPath("$[0].shortName", Matchers.is(diagonalley.getShortName())));
	verify(locationService, times(1)).getLocationByShortName(any(String.class));
	verify(locationService, times(1)).getLocationsByParent(any(Location.class));
	verifyNoMoreInteractions(locationService);
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#deleteLocationAttributeType(java.lang.String)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldNotDeleteLocationAttributeType() throws Exception {
	ResultActions actions = mockMvc
		.perform(delete(API_PREFIX + "locationattributetype/{uuid}", noOfStudents.getUuid()));
	actions.andExpect(status().isNotImplemented());
	Mockito.verifyZeroInteractions(locationService);
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#searchLocations(java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String)}.
     * 
     * @throws Exception
     */
    @SuppressWarnings("unchecked")
    @Test
    public void shouldSearchLocations() throws Exception {
	when(metadataService.getDefinitionByShortName(any(String.class))).thenReturn(market);
	when(locationService.searchLocations(any(List.class))).thenReturn(Arrays.asList(diagonalley, burrow));

	MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
	params.add("category", market.getShortName());
	params.add("parent", "");
	params.add("landmark1", "");
	params.add("landmark2", "");
	params.add("cityVillage", "");
	params.add("stateProvince", "");
	params.add("country", england.getDefinitionName());
	params.add("primaryContact", "");
	params.add("primaryContactPerson", "");
	params.add("secondaryContact", "");
	params.add("secondaryContactPerson", "");
	params.add("email", "");
	ResultActions actions = mockMvc.perform(get(API_PREFIX + "locations/search").params(params));
	actions.andExpect(status().isOk());
	actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
	actions.andExpect(jsonPath("$", Matchers.hasSize(2)));
	actions.andExpect(jsonPath("$[0].shortName", Matchers.is(diagonalley.getShortName())));
	verify(metadataService, times(1)).getDefinitionByShortName(any(String.class));
	verify(locationService, times(1)).searchLocations(any(List.class));
	verifyNoMoreInteractions(locationService);
    }

    @Test
    public void shouldUpdateLocation() throws Exception {
	when(locationService.getLocationByUuid(any(String.class))).thenReturn(hogwartz);
	when(locationService.updateLocation(any(Location.class))).thenReturn(hogwartz);
	String content = BaseEntity.getGson().toJson(hogwartz);
	ResultActions actions = mockMvc.perform(put(API_PREFIX + "location/{uuid}", hogwartz.getUuid())
		.contentType(MediaType.APPLICATION_JSON_UTF8).content(content));
	actions.andExpect(status().isOk());
	verify(locationService, times(1)).getLocationByUuid(any(String.class));
	verify(locationService, times(1)).updateLocation(any(Location.class));
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#updateLocationAttribute(java.lang.String, com.ihsinformatics.aahung.aagahi.model.LocationAttribute)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldUpdateLocationAttribute() throws Exception {
	when(locationService.getLocationAttributeByUuid(any(String.class))).thenReturn(noOfDiagonalleyTeachers);
	when(locationService.updateLocationAttribute(any(LocationAttribute.class))).thenReturn(noOfDiagonalleyTeachers);
	String content = BaseEntity.getGson().toJson(hogwartz);
	ResultActions actions = mockMvc
		.perform(put(API_PREFIX + "locationattribute/{uuid}", noOfDiagonalleyTeachers.getUuid())
			.contentType(MediaType.APPLICATION_JSON_UTF8).content(content));
	actions.andExpect(status().isOk());
	verify(locationService, times(1)).getLocationAttributeByUuid(any(String.class));
	verify(locationService, times(1)).updateLocationAttribute(any(LocationAttribute.class));
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.web.LocationController#updateLocationAttributeType(java.lang.String, com.ihsinformatics.aahung.aagahi.model.LocationAttributeType)}.
     * 
     * @throws Exception
     */
    @Test
    public void shouldUpdateLoctaionAttributeType() throws Exception {
	when(locationService.getLocationAttributeTypeByUuid(any(String.class))).thenReturn(noOfTeachers);
	when(locationService.updateLocationAttributeType(any(LocationAttributeType.class))).thenReturn(noOfTeachers);
	String content = BaseEntity.getGson().toJson(hogwartz);
	ResultActions actions = mockMvc.perform(put(API_PREFIX + "locationattributetype/{uuid}", noOfTeachers.getUuid())
		.contentType(MediaType.APPLICATION_JSON_UTF8).content(content));
	actions.andExpect(status().isOk());
	verify(locationService, times(1)).getLocationAttributeTypeByUuid(any(String.class));
	verify(locationService, times(1)).updateLocationAttributeType(any(LocationAttributeType.class));
    }
}
