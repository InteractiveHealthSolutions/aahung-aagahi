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
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import org.junit.Before;
import org.junit.Test;

import com.ihsinformatics.aahung.aagahi.BaseServiceTest;
import com.ihsinformatics.aahung.aagahi.Context;

/**
 * @author owais.hussain@ihsinformatics.com
 */
public class SecurityServiceTest extends BaseServiceTest {

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
		super.reset();
		initPrivileges();
		initRoles();
		initUsers();
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.SecurityServiceImpl#hasPrivilege(com.ihsinformatics.aahung.aagahi.model.Privilege)}.
	 */
	@Test
	public void shouldHavePrvilege() {
		when(userRepository.findByUsername(any(String.class))).thenReturn(dumbledore);
		dumbledore.getUserRoles().add(headmaster);
		securityService.login(dumbledore.getUsername(), "Expelliarmus");
		assertTrue(securityService.hasPrivilege(magic));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.SecurityServiceImpl#login(java.lang.String, java.lang.String)}.
	 * @throws Exception 
	 */
	@Test
	public void shouldLogin() throws Exception {
		when(userRepository.findByUsername(any(String.class))).thenReturn(dumbledore);
		boolean isLoggedIn = securityService.login(dumbledore.getUsername(), "Expelliarmus");
		assertTrue(isLoggedIn);
		assertThat(Context.getCurrentUser(), is(dumbledore));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.SecurityServiceImpl#logout()}.
	 */
	@Test
	public void shouldLogout() {
		securityService.logout();
		assertNull(Context.getCurrentUser());
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.SecurityServiceImpl#hasPrivilege(com.ihsinformatics.aahung.aagahi.model.Privilege)}.
	 */
	@Test
	public void shouldNotHavePrivilege() {
		when(userRepository.findByUsername(any(String.class))).thenReturn(dumbledore);
		dumbledore.getUserRoles().add(headmaster);
		securityService.login(dumbledore.getUsername(), "Expelliarmus");
		assertFalse(securityService.hasPrivilege(kill));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.SecurityServiceImpl#login(java.lang.String, java.lang.String)}.
	 */
	@Test
	public void shouldNotLogin() {
		when(userRepository.findByUsername(any(String.class))).thenReturn(dumbledore);
		boolean isLoggedIn = securityService.login(dumbledore.getUsername(), "InvalidPassword");
		assertFalse(isLoggedIn);
		assertNull(Context.getCurrentUser());
	}
}
