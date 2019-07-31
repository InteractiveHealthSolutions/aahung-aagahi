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
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.hamcrest.Matchers;
import org.hibernate.HibernateException;
import org.junit.Before;
import org.junit.Test;

import com.ihsinformatics.aahung.aagahi.BaseServiceTest;
import com.ihsinformatics.aahung.aagahi.model.Privilege;
import com.ihsinformatics.aahung.aagahi.model.Role;
import com.ihsinformatics.aahung.aagahi.model.User;
import com.ihsinformatics.aahung.aagahi.model.UserAttribute;
import com.ihsinformatics.aahung.aagahi.model.UserAttributeType;

/**
 * @author owais.hussain@ihsinformatics.com
 */
public class UserServiceTest extends BaseServiceTest {

	@Before
	public void reset() {
		super.reset();
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
		when(userAttributeRepository.saveAll(any())).thenReturn(attributes);
		assertThat(userService.saveUserAttributes(attributes),
		    Matchers.containsInAnyOrder(dumbledoreBlood, dumbledoreOccupation, dumbledorePatronus));
		verify(userAttributeRepository, times(1)).saveAll(any());
		verifyNoMoreInteractions(userAttributeRepository);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#deletePrivilege(com.ihsinformatics.aahung.aagahi.model.Privilege)}.
	 */
	@Test
	public void shouldDeletePrivilege() {
		doNothing().when(privilegeRepository).delete(any(Privilege.class));
		userService.deletePrivilege(kill);
		// verify that the delete method has been invoked
		verify(privilegeRepository, times(1)).delete(any(Privilege.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#deletePrivilege(com.ihsinformatics.aahung.aagahi.model.Privilege)}.
	 */
	@Test
	public void shouldNotDeletePrivilege() {
		doNothing().when(privilegeRepository).delete(any(Privilege.class));
		userService.deletePrivilege(kill);
		// verify that the delete method has been invoked
		verify(privilegeRepository, times(1)).delete(any(Privilege.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#deleteRole(com.ihsinformatics.aahung.aagahi.model.Role)}.
	 */
	@Test
	public void shouldDeleteRole() {
		doNothing().when(roleRepository).delete(any(Role.class));
		userService.deleteRole(auror, false);
		// verify that the delete method has been invoked
		verify(roleRepository, times(1)).delete(any(Role.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#deleteRole(com.ihsinformatics.aahung.aagahi.model.Role)}.
	 */
	@Test(expected = HibernateException.class)
	public void shouldNotDeleteRole() {
		dumbledore.getUserRoles().add(auror);
		List<User> list = new ArrayList<>();
		list.add(dumbledore);
		when(userRepository.findAll()).thenReturn(list);
		doNothing().when(roleRepository).delete(any(Role.class));
		userService.deleteRole(auror, false);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#deleteRole(com.ihsinformatics.aahung.aagahi.model.Role)}.
	 */
	@Test
	public void shouldDetachRoleFromDependentUsersAndDelete() {
		dumbledore.getUserRoles().add(auror);
		List<User> list = new ArrayList<>();
		list.add(dumbledore);
		when(userRepository.findAll()).thenReturn(list);
		when(userRepository.save(any(User.class))).thenReturn(dumbledore);
		doNothing().when(roleRepository).delete(any(Role.class));
		userService.deleteRole(auror, true);
		verify(userRepository, times(1)).save(any(User.class));
		verify(roleRepository, times(1)).delete(any(Role.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#deleteUserAttributeType(com.ihsinformatics.aahung.aagahi.model.UserAttributeType, boolean)}.
	 */
	@Test
	public void shouldDeleteUserAttributeType() {
		doNothing().when(userAttributeTypeRepository).delete(any(UserAttributeType.class));
		userService.deleteUserAttributeType(patronus, false);
		// verify that the delete method has been invoked
		verify(userAttributeTypeRepository, times(1)).delete(any(UserAttributeType.class));
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
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getPrivilegeByName(java.lang.String)}.
	 */
	@Test
	public void shouldGetPrivilegeByName() {
		when(privilegeRepository.findByPrivilegeName(any(String.class))).thenReturn(magic);
		userService.getPrivilegeByName(magic.getPrivilegeName());
		verify(privilegeRepository, times(1)).findByPrivilegeName(any(String.class));
		verifyNoMoreInteractions(privilegeRepository);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getPrivileges()}.
	 */
	@Test
	public void shouldGetPrivileges() {
		when(privilegeRepository.findAll()).thenReturn(new ArrayList<Privilege>(privileges));
		assertEquals(userService.getPrivileges().size(), privileges.size());
		verify(privilegeRepository, times(1)).findAll();
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
		Optional<Role> optional = Optional.of(potionMaster);
		when(roleRepository.findById(any(Integer.class))).thenReturn(optional);
		assertEquals(userService.getRoleById(1), potionMaster);
		verify(roleRepository, times(1)).findById(any(Integer.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getRoleByName(java.lang.String)}.
	 */
	@Test
	public void shouldGetRoleByName() {
		when(roleRepository.findByRoleName(any(String.class))).thenReturn(headmaster);
		assertEquals(userService.getRoleByName("Head Master"), headmaster.getRoleName());
		verify(roleRepository, times(1)).findByRoleName(any(String.class));
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
}
