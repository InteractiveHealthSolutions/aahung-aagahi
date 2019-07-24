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

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.ihsinformatics.aahung.aagahi.model.Privilege;
import com.ihsinformatics.aahung.aagahi.model.Role;
import com.ihsinformatics.aahung.aagahi.model.User;
import com.ihsinformatics.aahung.aagahi.model.UserAttributeType;
import com.ihsinformatics.aahung.aagahi.repository.PrivilegeRepository;
import com.ihsinformatics.aahung.aagahi.repository.RoleRepository;
import com.ihsinformatics.aahung.aagahi.repository.UserAttributeRepository;
import com.ihsinformatics.aahung.aagahi.repository.UserAttributeTypeRepository;
import com.ihsinformatics.aahung.aagahi.repository.UserRepository;
import com.ihsinformatics.aahung.aagahi.service.UserServiceImpl;
import com.ihsinformatics.aahung.aagahi.util.DataType;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(SpringRunner.class)
@DataJpaTest
public class BaseServiceTest {

	protected static Privilege magic, charm, curse, release, arrest, kill;

	protected Set<Privilege> privileges = new HashSet<>();

	protected static Role headmaster, potionMaster, auror;

	protected static User dumbledore, snape, tonks;

	protected static UserAttributeType occupation, patronus, blood;

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
	protected UserServiceImpl userService;

	@Before
	public void reset() throws Exception {
		MockitoAnnotations.initMocks(this);
		magic = Privilege.builder().privilegeName("USE MAGIC").build();
		charm = Privilege.builder().privilegeName("USE CHARM").build();
		curse = Privilege.builder().privilegeName("USE CURSE").build();
		release = Privilege.builder().privilegeName("RELEASE").build();
		arrest = Privilege.builder().privilegeName("ARREST").build();
		kill = Privilege.builder().privilegeName("KILL").build();

		occupation = UserAttributeType.builder().attributeName("Occupation").dataType(DataType.STRING)
		        .isRequired(Boolean.TRUE).build();
		patronus = UserAttributeType.builder().attributeName("Patronus").dataType(DataType.STRING).isRequired(Boolean.FALSE)
		        .build();
		blood = UserAttributeType.builder().attributeName("Blood Status").dataType(DataType.STRING).isRequired(Boolean.TRUE)
		        .build();

		privileges.addAll(Arrays.asList(magic, charm, curse, release, arrest, kill));

		auror = Role.builder().roleId(2).roleName("Auror").rolePrivileges(privileges).build();
		privileges.remove(kill);
		headmaster = Role.builder().roleId(1).roleName("Headmaster").rolePrivileges(privileges).build();
		privileges.remove(arrest);
		privileges.remove(release);
		potionMaster = Role.builder().roleId(2).roleName("Potion Master").rolePrivileges(privileges).build();

		dumbledore = User.builder().userId(1).username("albus.dumbledore").fullName("Albus Dumbledore").build();
		dumbledore.setPassword("Expelliarmus");
		snape = User.builder().userId(2).username("severus.snape").fullName("Severus Snape").build();
		snape.setPassword("Sectumsempra");
		tonks = User.builder().userId(3).username("nymphadora.tonks").fullName("Nymphadora Tonks").build();
		tonks.setPassword("Stupify");
	}

	@Test
	public void contextLoads() {
		assertTrue(true);
	}
}
