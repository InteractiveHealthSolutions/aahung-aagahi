/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/
package com.ihsinformatics.aahung.aagahi.service;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit4.SpringRunner;

import com.ihsinformatics.aahung.aagahi.BaseTestData;
import com.ihsinformatics.aahung.aagahi.model.DefinitionType;
import com.ihsinformatics.aahung.aagahi.model.User;
import com.ihsinformatics.aahung.aagahi.repository.RoleRepository;
import com.ihsinformatics.aahung.aagahi.repository.UserRepository;

/**
 * @author owais.hussain@ihsinformatics.com
 *
 */
@RunWith(SpringRunner.class)
public class _BaseServiceTest extends BaseTestData {

	@Mock
	private UserRepository userRepository;

	@Mock
	private RoleRepository roleRepository;

	@Mock
	private SecurityService securityService;

	@InjectMocks
	private BaseService baseService;
	
	@Before
	public void reset() {
		super.reset();
		initPrivileges();
		initRoles();
		dumbledore.setUserId(100);
		dumbledore.getUserRoles().add(headmaster);
		when(securityService.getLoggedInUsername()).thenReturn(dumbledore.getUsername());
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.BaseService#setCreateAuditAttributes(com.ihsinformatics.aahung.aagahi.model.BaseEntity)}.
	 */
	@Test
	public void testSetCreateAuditAttributesForEntity() {
		when(userRepository.findByUsername(any(String.class))).thenReturn(dumbledore);
		User entity = (User) baseService.setCreateAuditAttributes(tonks);
		assertNotNull(entity.getDateCreated());
		assertNotNull(entity.getCreatedBy());
		verify(userRepository, times(1)).findByUsername(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.BaseService#setCreateAuditAttributes(com.ihsinformatics.aahung.aagahi.model.BaseEntity)}.
	 */
	@Test
	public void testSetCreateAuditAttributesForMetadata() {
		DefinitionType entity = (DefinitionType) baseService.setCreateAuditAttributes(country);
		assertNotNull(entity.getDateCreated());
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.BaseService#setUpdateAuditAttributes(com.ihsinformatics.aahung.aagahi.model.BaseEntity)}.
	 */
	@Test
	public void testSetUpdateAuditAttributesForEntity() {
		when(userRepository.findByUsername(any(String.class))).thenReturn(dumbledore);
		User entity = (User) baseService.setUpdateAuditAttributes(tonks);
		assertNotNull(entity.getDateUpdated());
		assertNotNull(entity.getUpdatedBy());
		verify(userRepository, times(1)).findByUsername(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.BaseService#setUpdateAuditAttributes(com.ihsinformatics.aahung.aagahi.model.BaseEntity)}.
	 */
	@Test
	public void testSetUpdateAuditAttributesForMetadata() {
		DefinitionType entity = (DefinitionType) baseService.setUpdateAuditAttributes(country);
		assertNotNull(entity.getDateUpdated());
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.BaseService#setSoftDeleteAuditAttributes(com.ihsinformatics.aahung.aagahi.model.BaseEntity)}.
	 */
	@Test
	public void testSetSoftDeleteAuditAttributesForMetadata() {
		DefinitionType entity = (DefinitionType) baseService.setSoftDeleteAuditAttributes(country);
		assertNotNull(entity.getDateRetired());
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.BaseService#setSoftDeleteAuditAttributes(com.ihsinformatics.aahung.aagahi.model.BaseEntity)}.
	 */
	@Test
	public void testSetSoftDeleteAuditAttributesForEntity() {
		when(userRepository.findByUsername(any(String.class))).thenReturn(dumbledore);
		User entity = (User) baseService.setSoftDeleteAuditAttributes(dumbledore);
		assertNotNull(entity.getDateVoided());
		verify(userRepository, times(1)).findByUsername(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.BaseService#getAuditUser()}.
	 */
	@Test
	public void testGetAuditUser() {
		when(userRepository.findByUsername(any(String.class))).thenReturn(dumbledore);
		assertNotNull(baseService.getAuditUser());
		verify(userRepository, times(1)).findByUsername(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.BaseService#hasPrivilege(java.lang.String)}.
	 */
	@Test
	public void testHasPrivilege() {
		when(userRepository.findByUsername(any(String.class))).thenReturn(dumbledore);
		assertTrue(baseService.hasPrivilege(charm.getPrivilegeName()));
		verify(userRepository, times(1)).findByUsername(any(String.class));
	}

}
