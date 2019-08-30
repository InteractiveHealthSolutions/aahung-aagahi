/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi;

import static org.junit.Assert.assertTrue;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.ihsinformatics.aahung.aagahi.repository.LocationAttributeRepository;
import com.ihsinformatics.aahung.aagahi.repository.LocationAttributeTypeRepository;
import com.ihsinformatics.aahung.aagahi.repository.LocationRepository;
import com.ihsinformatics.aahung.aagahi.repository.ParticipantRepository;
import com.ihsinformatics.aahung.aagahi.repository.PersonRepository;
import com.ihsinformatics.aahung.aagahi.repository.PrivilegeRepository;
import com.ihsinformatics.aahung.aagahi.repository.RoleRepository;
import com.ihsinformatics.aahung.aagahi.repository.UserAttributeRepository;
import com.ihsinformatics.aahung.aagahi.repository.UserAttributeTypeRepository;
import com.ihsinformatics.aahung.aagahi.repository.UserRepository;
import com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl;
import com.ihsinformatics.aahung.aagahi.service.PersonServiceImpl;
import com.ihsinformatics.aahung.aagahi.service.SecurityServiceImpl;
import com.ihsinformatics.aahung.aagahi.service.UserServiceImpl;
import com.ihsinformatics.aahung.aagahi.service.ValidationServiceImpl;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(SpringRunner.class)
@DataJpaTest
public class BaseServiceTest extends BaseTestData {

	@Mock
	protected LocationRepository locationRepository;

	@Mock
	protected LocationAttributeRepository locationAttributeRepository;

	@Mock
	protected LocationAttributeTypeRepository locationAttributeTypeRepository;

	@Mock
	protected PersonRepository personRepository;

	@Mock
	protected ParticipantRepository participantRepository;

	@Mock
	protected PrivilegeRepository privilegeRepository;

	@Mock
	protected RoleRepository roleRepository;

	@Mock
	protected UserRepository userRepository;

	@Mock
	protected UserAttributeRepository userAttributeRepository;

	@Mock
	protected UserAttributeTypeRepository userAttributeTypeRepository;
	
	@InjectMocks
	protected LocationServiceImpl locationService;

	@InjectMocks
	protected PersonServiceImpl personService;

	@InjectMocks
	protected SecurityServiceImpl securityService;

	@InjectMocks
	protected UserServiceImpl userService;

	@InjectMocks
	protected ValidationServiceImpl validationService;

	public void reset() {
		super.reset();
		MockitoAnnotations.initMocks(this);
	}

	@Test
	public void contextLoads() {
		assertTrue(true);
	}
}
