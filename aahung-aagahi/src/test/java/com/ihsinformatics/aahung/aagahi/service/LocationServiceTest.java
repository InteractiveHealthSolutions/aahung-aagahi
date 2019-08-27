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
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.Before;
import org.junit.Test;

import com.ihsinformatics.aahung.aagahi.BaseServiceTest;
import com.ihsinformatics.aahung.aagahi.model.Location;
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
	}

	@Test
	public void shouldReturnAnObject() {
		Location location = mock(Location.class);
		assertNotNull(location);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#saveLocation(com.ihsinformatics.aahung.aagahi.model.Location)}.
	 */
	@Test
	public void shouldSaveLocation() {
		when(locationRepository.save(any(Location.class))).thenReturn(hogwartz);
		assertThat(locationService.saveLocation(hogwartz), is(hogwartz));
		verify(locationRepository, times(1)).save(any(Location.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#saveLocationAttributeType(com.ihsinformatics.aahung.aagahi.model.LocationAttributeType)}.
	 */
	@Test
	public void shouldSaveLocationAttributeType() {
		when(locationAttributeTypeRepository.save(any(LocationAttributeType.class))).thenReturn(noOfStudents);
		assertThat(locationService.saveLocationAttributeType(noOfStudents), is(noOfStudents));
		verify(locationAttributeTypeRepository, times(1)).save(any(LocationAttributeType.class));
	}

}
