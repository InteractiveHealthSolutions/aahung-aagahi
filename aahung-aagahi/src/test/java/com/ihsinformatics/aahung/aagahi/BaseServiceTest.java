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
import static org.mockito.Mockito.when;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.ihsinformatics.aahung.aagahi.repository.DefinitionRepository;
import com.ihsinformatics.aahung.aagahi.repository.DefinitionTypeRepository;
import com.ihsinformatics.aahung.aagahi.repository.DonorRepository;
import com.ihsinformatics.aahung.aagahi.repository.ElementRepository;
import com.ihsinformatics.aahung.aagahi.repository.FormDataRepository;
import com.ihsinformatics.aahung.aagahi.repository.FormTypeRepository;
import com.ihsinformatics.aahung.aagahi.repository.LocationAttributeRepository;
import com.ihsinformatics.aahung.aagahi.repository.LocationAttributeTypeRepository;
import com.ihsinformatics.aahung.aagahi.repository.LocationRepository;
import com.ihsinformatics.aahung.aagahi.repository.ParticipantRepository;
import com.ihsinformatics.aahung.aagahi.repository.PersonRepository;
import com.ihsinformatics.aahung.aagahi.repository.PrivilegeRepository;
import com.ihsinformatics.aahung.aagahi.repository.ProjectRepository;
import com.ihsinformatics.aahung.aagahi.repository.RoleRepository;
import com.ihsinformatics.aahung.aagahi.repository.UserAttributeRepository;
import com.ihsinformatics.aahung.aagahi.repository.UserAttributeTypeRepository;
import com.ihsinformatics.aahung.aagahi.repository.UserRepository;
import com.ihsinformatics.aahung.aagahi.service.BaseService;
import com.ihsinformatics.aahung.aagahi.service.DonorServiceImpl;
import com.ihsinformatics.aahung.aagahi.service.FormServiceImpl;
import com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl;
import com.ihsinformatics.aahung.aagahi.service.MetadataServiceImpl;
import com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl;
import com.ihsinformatics.aahung.aagahi.service.PersonServiceImpl;
import com.ihsinformatics.aahung.aagahi.service.SecurityServiceImpl;
import com.ihsinformatics.aahung.aagahi.service.UserServiceImpl;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(SpringRunner.class)
@DataJpaTest
public class BaseServiceTest extends BaseTestData {

	@Mock
	protected BaseService baseService;

	@Mock
	protected DonorRepository donorRepository;

	@Mock
	protected DefinitionRepository definitionRepository;

	@Mock
	protected DefinitionTypeRepository definitionTypeRepository;

	@Mock
	protected ElementRepository elementRepository;

	@Mock
	protected FormTypeRepository formTypeRepository;

	@Mock
	protected FormDataRepository formDataRepository;

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
	protected ProjectRepository projectRepository;

	@Mock
	protected RoleRepository roleRepository;

	@Mock
	protected UserRepository userRepository;

	@Mock
	protected UserAttributeRepository userAttributeRepository;

	@Mock
	protected UserAttributeTypeRepository userAttributeTypeRepository;

	@InjectMocks
	protected DonorServiceImpl donorService;

	@InjectMocks
	protected FormServiceImpl formService;

	@InjectMocks
	protected LocationServiceImpl locationService;

	@InjectMocks
	protected MetadataServiceImpl metadataService;

	@InjectMocks
	protected ParticipantServiceImpl participantService;

	@InjectMocks
	protected PersonServiceImpl personService;

	@InjectMocks
	protected SecurityServiceImpl securityService;

	@InjectMocks
	protected UserServiceImpl userService;

	public void reset() {
		super.reset();
		MockitoAnnotations.initMocks(this);
		// This is to ensure that audit methods don't throw exceptions
		when(baseService.getAuditUser()).thenReturn(admin);
	}

	@Test
	public void test() {
		assertTrue(true);
	}
}
