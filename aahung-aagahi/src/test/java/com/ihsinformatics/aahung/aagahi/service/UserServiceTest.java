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
import static org.junit.Assert.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import com.ihsinformatics.aahung.aagahi.model.Role;
import com.ihsinformatics.aahung.aagahi.model.User;
import com.ihsinformatics.aahung.aagahi.model.UserAttribute;
import com.ihsinformatics.aahung.aagahi.model.UserAttributeType;

/**
 * @author owais.hussain@ihsinformatics.com
 */
public class UserServiceTest extends BaseServiceTest {

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void shouldReturnAnObject() {
		User user = mock(User.class);
		assertNotNull(user);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#savePrivilege(com.ihsinformatics.aahung.aagahi.model.Privilege)}.
	 */
	@Test
	public void shouldSavePrivilege() {
		when(userRepository.save(any(User.class))).thenReturn(dumbledore);
		assertThat(userService.saveUser(dumbledore), is(dumbledore));
		verify(userRepository, times(1)).save(any(User.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#saveRole(com.ihsinformatics.aahung.aagahi.model.Role)}.
	 */
	@Test
	public void shouldSaveRole() {
		when(roleRepository.save(any(Role.class))).thenReturn(headmaster);
		assertThat(userService.saveRole(headmaster), is(headmaster));
		verify(roleRepository, times(1)).save(any(Role.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#saveUser(com.ihsinformatics.aahung.aagahi.model.User)}.
	 */
	@Test
	public void shouldSaveUser() {
		when(userRepository.save(any(User.class))).thenReturn(snape);
		assertThat(userService.saveUser(snape), is(snape));
		verify(userRepository, times(1)).save(any(User.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#saveUserAttributeType(com.ihsinformatics.aahung.aagahi.model.UserAttributeType)}.
	 */
	@Test
	public void shouldSaveUserAttributeType() {
		when(userAttributeTypeRepository.save(any(UserAttributeType.class))).thenReturn(occupation);
		assertThat(userService.saveUserAttributeType(occupation), is(occupation));
		verify(userAttributeTypeRepository, times(1)).save(any(UserAttributeType.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#saveUserAttribute(com.ihsinformatics.aahung.aagahi.model.UserAttribute)}.
	 */
	@Test
	public void shouldSaveUserAttribute() {
		UserAttribute dumbledoreBlood = UserAttribute.builder().attributeId(1).attributeType(blood)
		        .attributeValue("Pure Blood").build();
		when(userAttributeRepository.save(any(UserAttribute.class))).thenReturn(dumbledoreBlood);
		assertThat(userService.saveUserAttribute(dumbledoreBlood), is(dumbledoreBlood));
		verify(userAttributeRepository, times(1)).save(any(UserAttribute.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#saveUserAttributes(java.util.List)}.
	 */
	@Test
	public void shouldSaveUserAttributes() {
		UserAttribute dumbledoreBlood = UserAttribute.builder().attributeId(1).attributeType(blood)
		        .attributeValue("Pure Blood").build();
		UserAttribute dumbledoreOccupation = UserAttribute.builder().attributeId(1).attributeType(occupation)
		        .attributeValue("Magician").build();
		UserAttribute dumbledorePatronus = UserAttribute.builder().attributeId(1).attributeType(patronus)
		        .attributeValue("Phoenix").build();
		List<UserAttribute> attributes = new ArrayList<UserAttribute>();
		attributes.add(dumbledoreBlood);
		attributes.add(dumbledoreOccupation);
		attributes.add(dumbledorePatronus);
		// TODO: THIS IS WHERE I LAST LEFT
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#updatePrivilege(com.ihsinformatics.aahung.aagahi.model.Privilege)}.
	 */
	@Test
	public void shouldUpdatePrivilege() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#updateRole(com.ihsinformatics.aahung.aagahi.model.Role)}.
	 */
	@Test
	public void shouldUpdateRole() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#updateUserAttributeType(com.ihsinformatics.aahung.aagahi.model.UserAttributeType)}.
	 */
	@Test
	public void shouldUpdateUserAttributeType() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#updateUserAttribute(com.ihsinformatics.aahung.aagahi.model.UserAttribute)}.
	 */
	@Test
	public void shouldUpdateUserAttribute() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#updateUser(com.ihsinformatics.aahung.aagahi.model.User)}.
	 */
	@Test
	public void shouldUpdateUser() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#deletePrivilege(com.ihsinformatics.aahung.aagahi.model.Privilege)}.
	 */
	@Test
	public void shouldDeletePrivilege() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#deleteRole(com.ihsinformatics.aahung.aagahi.model.Role)}.
	 */
	@Test
	public void shouldDeleteRole() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#deleteUserAttributeType(com.ihsinformatics.aahung.aagahi.model.UserAttributeType, boolean)}.
	 */
	@Test
	public void shouldDeleteUserAttributeType() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#deleteUserAttribute(com.ihsinformatics.aahung.aagahi.model.UserAttribute)}.
	 */
	@Test
	public void shouldDeleteUserAttribute() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#deleteUser(com.ihsinformatics.aahung.aagahi.model.User)}.
	 */
	@Test
	public void shouldDeleteUser() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getPrivilegeByUuid(java.lang.String)}.
	 */
	@Test
	public void shouldGetPrivilegeByUuid() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getPrivilegeByName(java.lang.String)}.
	 */
	@Test
	public void shouldGetPrivilegeByName() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getPrivileges()}.
	 */
	@Test
	public void shouldGetPrivileges() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getPrivilegesByUser(com.ihsinformatics.aahung.aagahi.model.User)}.
	 */
	@Test
	public void shouldGetPrivilegesByUser() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getRoleById(java.lang.Integer)}.
	 */
	@Test
	public void shouldGetRoleById() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getRoleByUuid(java.lang.String)}.
	 */
	@Test
	public void shouldGetRoleByUuid() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getRoleByName(java.lang.String)}.
	 */
	@Test
	public void shouldGetRoleByName() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getRoles()}.
	 */
	@Test
	public void shouldGetRoles() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getRolesByExample(com.ihsinformatics.aahung.aagahi.model.Role)}.
	 */
	@Test
	public void shouldGetRolesByExample() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserAttributeTypeById(java.lang.Integer)}.
	 */
	@Test
	public void shouldGetUserAttributeTypeById() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserAttributeTypeByUuid(java.lang.String)}.
	 */
	@Test
	public void shouldGetUserAttributeTypeByUuid() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserAttributeTypeByName(java.lang.String)}.
	 */
	@Test
	public void shouldGetUserAttributeTypeByName() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserAttributeTypes()}.
	 */
	@Test
	public void shouldGetUserAttributeTypes() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserAttributeById(java.lang.Integer)}.
	 */
	@Test
	public void shouldGetUserAttributeById() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserAttributeByUuid(java.lang.String)}.
	 */
	@Test
	public void shouldGetUserAttributeByUuid() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserAttribute(com.ihsinformatics.aahung.aagahi.model.User, com.ihsinformatics.aahung.aagahi.model.UserAttributeType)}.
	 */
	@Test
	public void shouldGetUserAttribute() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserAttributesByType(com.ihsinformatics.aahung.aagahi.model.UserAttributeType)}.
	 */
	@Test
	public void shouldGetUserAttributesByType() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserAttributesByValue(com.ihsinformatics.aahung.aagahi.model.UserAttributeType, java.lang.String)}.
	 */
	@Test
	public void shouldGetUserAttributesByValueUserAttributeTypeString() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserAttributesByUser(com.ihsinformatics.aahung.aagahi.model.User)}.
	 */
	@Test
	public void shouldGetUserAttributesByUser() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserAttributesByValue(java.lang.String)}.
	 */
	@Test
	public void shouldGetUserAttributesByValueString() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserById(java.lang.Integer)}.
	 */
	@Test
	public void shouldGetUserById() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserByUuid(java.lang.String)}.
	 */
	@Test
	public void shouldGetUserByUuid() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserByUsername(java.lang.String)}.
	 */
	@Test
	public void shouldGetUserByUsername() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUsersByFullName(java.lang.String)}.
	 */
	@Test
	public void shouldGetUsersByFullName() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUsers()}.
	 */
	@Test
	public void shouldGetUsers() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUsersByExample(com.ihsinformatics.aahung.aagahi.model.User)}.
	 */
	@Test
	public void shouldGetUsersByExample() {
		fail("Not yet implemented");
	}

}
