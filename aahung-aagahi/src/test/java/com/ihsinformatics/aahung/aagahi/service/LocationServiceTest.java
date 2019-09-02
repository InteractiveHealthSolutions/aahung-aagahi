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
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.hibernate.HibernateException;
import org.junit.Before;
import org.junit.Test;

import com.ihsinformatics.aahung.aagahi.BaseServiceTest;
import com.ihsinformatics.aahung.aagahi.model.Definition;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.LocationAttribute;
import com.ihsinformatics.aahung.aagahi.model.LocationAttributeType;

/**
 * @author owais.hussain@ihsinformatics.com
 */
public class LocationServiceTest extends BaseServiceTest {

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
		super.reset();
	}

	@Test
	public void shouldReturnAnObject() {
		Location location = mock(Location.class);
		assertNotNull(location);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#saveLocation(com.ihsinformatics.aahung.aagahi.model.Location)}.
	 */
	@Test
	public void shouldSaveLocation() {
		when(locationRepository.findByShortName(any(String.class))).thenReturn(null);
		when(locationRepository.save(any(Location.class))).thenReturn(diagonalley);
		assertThat(locationService.saveLocation(diagonalley), is(diagonalley));
		verify(locationRepository, times(1)).save(any(Location.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#saveLocation(com.ihsinformatics.aahung.aagahi.model.Location)}.
	 */
	@Test(expected = HibernateException.class)
	public void shouldNotSaveLocation() {
		when(locationRepository.findByShortName(any(String.class))).thenReturn(diagonalley);
		locationService.saveLocation(diagonalley);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#saveLocationAttributes(java.util.List)}.
	 */
	@SuppressWarnings("unchecked")
	@Test
	public void shouldSaveLocationAttributes() {
		when(locationAttributeRepository.saveAll(any(List.class)))
		        .thenReturn(Arrays.asList(locationAttribute1, locationAttribute2));
		List<LocationAttribute> attributes = locationService
		        .saveLocationAttributes(locationAttributes.stream().collect(Collectors.toList()));
		assertEquals(locationAttributes.size(), attributes.size());
		assertThat(attributes, containsInAnyOrder(locationAttribute1, locationAttribute2));
		verify(locationAttributeRepository, times(1)).saveAll(any(List.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#saveLocationAttributeType(com.ihsinformatics.aahung.aagahi.model.LocationAttributeType)}.
	 */
	@Test
	public void shouldSaveLocationAttributeType() {
		when(locationAttributeTypeRepository.save(any(LocationAttributeType.class))).thenReturn(noOfStudents);
		assertThat(locationService.saveLocationAttributeType(noOfStudents), is(noOfStudents));
		verify(locationAttributeTypeRepository, times(1)).save(any(LocationAttributeType.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#saveLocationAttribute(com.ihsinformatics.aahung.aagahi.model.LocationAttribute)}.
	 */
	@Test
	public void shouldSaveLocationAttribute() {
		when(locationAttributeRepository.save(any(LocationAttribute.class))).thenReturn(locationAttribute1);
		assertThat(locationService.saveLocationAttribute(locationAttribute1), is(locationAttribute1));
		verify(locationAttributeRepository, times(1)).save(any(LocationAttribute.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#updateLocation(com.ihsinformatics.aahung.aagahi.model.Location)}.
	 */
	@Test
	public void shouldUpdateLocation() {
		when(locationRepository.save(any(Location.class))).thenReturn(hogwartz);
		hogwartz = locationService.updateLocation(hogwartz);
		assertNotNull(hogwartz.getDateUpdated());
		verify(locationRepository, times(1)).save(any(Location.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#deleteLocation(com.ihsinformatics.aahung.aagahi.model.Location)}.
	 */
	@Test
	public void shouldDeleteLocation() {
		doNothing().when(locationRepository).delete(any(Location.class));
		locationService.deleteLocation(hogwartz, true);
		verify(locationRepository, times(1)).delete(any(Location.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#deleteLocation(com.ihsinformatics.aahung.aagahi.model.Location)}.
	 */
	@Test(expected = HibernateException.class)
	public void shouldNotDeleteLocation() {
		hogwartz.getAttributes().add(locationAttribute1);
		doNothing().when(locationRepository).delete(any(Location.class));
		locationService.deleteLocation(hogwartz, false);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#deleteLocationAttribute(com.ihsinformatics.aahung.aagahi.model.LocationAttribute)}.
	 */
	@Test
	public void shouldDeleteLocationAttribute() {
		doNothing().when(locationAttributeRepository).delete(any(LocationAttribute.class));
		locationService.deleteLocationAttribute(locationAttribute1);
		verify(locationAttributeRepository, times(1)).delete(any(LocationAttribute.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#deleteLocationAttributeType(com.ihsinformatics.aahung.aagahi.model.LocationAttributeType)}.
	 */
	@Test
	public void shouldDeleteLocationAttributeType() {
		when(locationAttributeRepository.findByAttributeType(any(LocationAttributeType.class)))
		        .thenReturn(Collections.emptyList());
		doNothing().when(locationAttributeTypeRepository).delete(any(LocationAttributeType.class));
		locationService.deleteLocationAttributeType(noOfStudents, true);
		verify(locationAttributeRepository, times(1)).findByAttributeType(any(LocationAttributeType.class));
		verify(locationAttributeTypeRepository, times(1)).delete(any(LocationAttributeType.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#deleteLocationAttributeType(com.ihsinformatics.aahung.aagahi.model.LocationAttributeType)}.
	 */
	@Test(expected = HibernateException.class)
	public void shouldNotDeleteLocationAttributeType() {
		when(locationAttributeRepository.findByAttributeType(any(LocationAttributeType.class)))
		        .thenReturn(Arrays.asList(locationAttribute1));
		locationService.deleteLocationAttributeType(noOfStudents, false);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#getLocationById(java.lang.Integer)}.
	 */
	@Test
	public void shouldGetLocationById() {
		Optional<Location> hogwartzObj = Optional.of(hogwartz);
		when(locationRepository.findById(any(Integer.class))).thenReturn(hogwartzObj);
		assertThat(locationService.getLocationById(hogwartz.getLocationId()), is(hogwartz));
		verify(locationRepository, times(1)).findById(any(Integer.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#getLocationByShortName(java.lang.String)}.
	 */
	@Test
	public void shouldGetLocationByShortName() {
		when(locationRepository.findByShortName(any(String.class))).thenReturn(hogwartz);
		assertThat(locationService.getLocationByShortName(hogwartz.getShortName()), is(hogwartz));
		verify(locationRepository, times(1)).findByShortName(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#getLocationByName(java.lang.String)}.
	 */
	@Test
	public void shouldGetLocationsByName() {
		when(locationRepository.findByLocationName(any(String.class))).thenReturn(Arrays.asList(hogwartz, diagonalley));
		assertThat(locationService.getLocationByName(hogwartz.getLocationName()), containsInAnyOrder(hogwartz, diagonalley));
		verify(locationRepository, times(1)).findByLocationName(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#getLocationsByParent(com.ihsinformatics.aahung.aagahi.model.Location)}.
	 */
	@Test
	public void shouldGetLocationsByParent() {
		diagonalley.setParentLocation(hogwartz);
		when(locationRepository.findByParentLocation(any(Location.class))).thenReturn(Arrays.asList(diagonalley));
		assertThat(locationService.getLocationsByParent(hogwartz), containsInAnyOrder(diagonalley));
		verify(locationRepository, times(1)).findByParentLocation(any(Location.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#getLocationsByCategory(com.ihsinformatics.aahung.aagahi.model.Definition)}.
	 */
	@Test
	public void shouldGetLocationsByCategory() {
		when(locationRepository.findByCategory(any(Definition.class))).thenReturn(Arrays.asList(hogwartz, diagonalley));
		assertThat(locationService.getLocationsByCategory(school), containsInAnyOrder(diagonalley, hogwartz));
		verify(locationRepository, times(1)).findByCategory(any(Definition.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#getAllLocations()}.
	 */
	@Test
	public void shouldGetAllLocations() {
		when(locationRepository.findAll()).thenReturn(Arrays.asList(hogwartz, diagonalley));
		assertThat(locationService.getAllLocations(), containsInAnyOrder(diagonalley, hogwartz));
		verify(locationRepository, times(1)).findAll();
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#getLocationAttributesByTypeAndValue(com.ihsinformatics.aahung.aagahi.model.LocationAttributeType, java.lang.String)}.
	 */
	@Test
	public void shouldGetLocationAttributesByValue() {
		when(locationAttributeRepository.findByValue(any(String.class))).thenReturn(Arrays.asList(locationAttribute1));
		assertThat(locationService.getLocationAttributesByValue("1000"), contains(locationAttribute1));
		verify(locationAttributeRepository, times(1)).findByValue(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#getLocationAttributesByType(com.ihsinformatics.aahung.aagahi.model.LocationAttributeType)}.
	 */
	@Test
	public void shouldGetLocationAttributesByType() {
		when(locationAttributeRepository.findByAttributeType(any(LocationAttributeType.class)))
		        .thenReturn(Arrays.asList(locationAttribute1));
		assertThat(locationService.getLocationAttributesByType(noOfStudents), contains(locationAttribute1));
		verify(locationAttributeRepository, times(1)).findByAttributeType(any(LocationAttributeType.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#getLocationAttributeById(java.lang.Integer)}.
	 */
	@Test
	public void shouldGetLocationAttributeById() {
		Optional<LocationAttribute> attributeObj = Optional.of(locationAttribute1);
		when(locationAttributeRepository.findById(any(Integer.class))).thenReturn(attributeObj);
		assertThat(locationService.getLocationAttributeById(locationAttribute1.getAttributeId()), is(locationAttribute1));
		verify(locationAttributeRepository, times(1)).findById(any(Integer.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#getAllLocationAttributeTypes()}.
	 */
	@Test
	public void shouldGetAllLocationAttributeTypes() {
		when(locationAttributeTypeRepository.findAll()).thenReturn(Arrays.asList(noOfStudents, noOfTeachers));
		assertThat(locationService.getAllLocationAttributeTypes(), containsInAnyOrder(noOfStudents, noOfTeachers));
		verify(locationAttributeTypeRepository, times(1)).findAll();
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#getLocationAttributeTypeByName(java.lang.String)}.
	 */
	@Test
	public void shouldGetLocationAttributeTypeByName() {
		when(locationAttributeTypeRepository.findByName(any(String.class))).thenReturn(noOfStudents);
		assertThat(locationService.getLocationAttributeTypeByName(noOfStudents.getAttributeName()), is(noOfStudents));
		verify(locationAttributeTypeRepository, times(1)).findByName(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#getLocationAttributeTypeByShortName(java.lang.String)}.
	 */
	@Test
	public void shouldGetLocationAttributeTypeByShortName() {
		when(locationAttributeTypeRepository.findByShortName(any(String.class))).thenReturn(noOfStudents);
		assertThat(locationService.getLocationAttributeTypeByShortName(noOfStudents.getAttributeName()), is(noOfStudents));
		verify(locationAttributeTypeRepository, times(1)).findByShortName(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#getLocationAttributeTypeById(java.lang.Integer)}.
	 */
	@Test
	public void shouldGetLocationAttributeTypeById() {
		Optional<LocationAttributeType> attributeObj = Optional.of(noOfStudents);
		when(locationAttributeTypeRepository.findById(any(Integer.class))).thenReturn(attributeObj);
		assertThat(locationService.getLocationAttributeTypeById(noOfStudents.getAttributeTypeId()), is(noOfStudents));
		verify(locationAttributeTypeRepository, times(1)).findById(any(Integer.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl#searchLocation(java.util.List)}.
	 */
	@Test
	public void shouldSearchLocationsByParams() {
		// Refer to LocationRepositoryTest class
	}

}
