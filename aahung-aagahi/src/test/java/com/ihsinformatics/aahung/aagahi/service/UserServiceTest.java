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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
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

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
		super.reset();
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#deletePrivilege(com.ihsinformatics.aahung.aagahi.model.Privilege)}.
	 */
	@Test
	public void shouldDeletePrivilege() {
		doNothing().when(privilegeRepository).delete(any(Privilege.class));
		userService.deletePrivilege(kill);
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
		verify(roleRepository, times(1)).delete(any(Role.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#deleteUser(com.ihsinformatics.aahung.aagahi.model.User)}.
	 */
	@Test
	public void shouldDeleteUser() {
		doNothing().when(userRepository).delete(any(User.class));
		userService.deleteUser(snape);
		verify(userRepository, times(1)).delete(any(User.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#deleteUserAttribute(com.ihsinformatics.aahung.aagahi.model.UserAttribute)}.
	 */
	@Test
	public void shouldDeleteUserAttribute() {
		doNothing().when(userAttributeRepository).delete(any(UserAttribute.class));
		userService.deleteUserAttribute(snapeBlood);
		verify(userAttributeRepository, times(1)).delete(any(UserAttribute.class));
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
	 * Test method for {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getAllRoles()}.
	 */
	@Test
	public void shouldGetAllRoles() {
		when(roleRepository.findAll()).thenReturn(new ArrayList<Role>(roles));
		assertEquals(userService.getAllRoles().size(), roles.size());
		verify(roleRepository, times(1)).findAll();
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getAllUserAttributeTypes()}.
	 */
	@Test
	public void shouldGetAllUserAttributeTypes() {
		when(userAttributeTypeRepository.findAll()).thenReturn(new ArrayList<UserAttributeType>(userAttributeTypes));
		assertEquals(userService.getAllUserAttributeTypes().size(), userAttributeTypes.size());
		verify(userAttributeTypeRepository, times(1)).findAll();
	}

	/**
	 * Test method for {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getAllUsers()}.
	 */
	@Test
	public void shouldGetAllUsers() {
		when(userRepository.findAll()).thenReturn(new ArrayList<User>(users));
		assertEquals(users.size(), userService.getAllUsers().size());
		verify(userRepository, times(1)).findAll();
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
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getAllPrivileges()}.
	 */
	@Test
	public void shouldGetPrivileges() {
		when(privilegeRepository.findAll()).thenReturn(new ArrayList<Privilege>(privileges));
		assertEquals(userService.getAllPrivileges().size(), privileges.size());
		verify(privilegeRepository, times(1)).findAll();
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
		assertEquals(userService.getRoleByName("Head Master").getRoleName(), headmaster.getRoleName());
		verify(roleRepository, times(1)).findByRoleName(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserAttribute(com.ihsinformatics.aahung.aagahi.model.User, com.ihsinformatics.aahung.aagahi.model.UserAttributeType)}.
	 */
	@Test
	public void shouldGetUserAttribute() {
		when(userAttributeRepository.findByUserAndAttributeType(any(User.class),any(UserAttributeType.class))).thenReturn(new ArrayList<UserAttribute>(Arrays.asList(snapeBlood)));
		assertEquals(1, userService.getUserAttribute(snape, blood).size());
		verify(userAttributeRepository, times(1)).findByUserAndAttributeType(any(User.class),any(UserAttributeType.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserAttributesByType(com.ihsinformatics.aahung.aagahi.model.UserAttributeType)}.
	 */
	@Test
	public void shouldGetUserAttributesByType() {
		when(userAttributeRepository.findByAttributeType(any(UserAttributeType.class))).thenReturn(new ArrayList<UserAttribute>(userAttributes));
		assertEquals(userService.getUserAttributesByType(blood).size(), userAttributes.size());
		verify(userAttributeRepository, times(1)).findByAttributeType(any(UserAttributeType.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserAttributesByUser(com.ihsinformatics.aahung.aagahi.model.User)}.
	 */
	@Test
	public void shouldGetUserAttributesByUser() {
		when(userAttributeRepository.findByUser(any(User.class))).thenReturn(Arrays.asList(snapeBlood));
		assertEquals(1, userService.getUserAttributesByUser(snape).size());
		verify(userAttributeRepository, times(1)).findByUser(any(User.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserAttributesByValue(java.lang.String)}.
	 */
	@Test
	public void shouldGetUserAttributesByValueString() {
		when(userAttributeRepository.findByAttributeTypeAndValue(any(UserAttributeType.class),any(String.class))).thenReturn(new ArrayList<UserAttribute>(Arrays.asList(snapeBlood, tonksBlood)));
		assertEquals(2, userService.getUserAttributesByValue(blood, "Half Blood").size());
		verify(userAttributeRepository, times(1)).findByAttributeTypeAndValue(any(UserAttributeType.class), any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserAttributeTypeByName(java.lang.String)}.
	 */
	@Test
	public void shouldGetUserAttributeTypeByName() {
		when(userAttributeTypeRepository.findByName(any(String.class))).thenReturn(occupation);
		assertEquals(userService.getUserAttributeTypeByName("Occupation").getAttributeName(), occupation.getAttributeName());
		verify(userAttributeTypeRepository, times(1)).findByName(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserByUsername(java.lang.String)}.
	 */
	@Test
	public void shouldGetUserByUsername() {
		when(userRepository.findByUsername(any(String.class))).thenReturn(snape);
		assertEquals(userService.getUserByUsername("severus.snape").getUsername(), snape.getUsername());
		verify(userRepository, times(1)).findByUsername(any(String.class));
		
	}
	
	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUserByUuid(java.lang.String)}.
	 */
	@Test
	public void shouldGetUserByUuid() {
		when(userRepository.findByUuid(any(String.class))).thenReturn(snape);
		assertEquals(userService.getUserByUsername("severus.snape").getUsername(), snape.getUsername());
		verify(userRepository, times(1)).findByUuid(any(String.class));
		
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#getUsersByFullName(java.lang.String)}.
	 */
	@Test
	public void shouldGetUsersByFullName() {
		when(userRepository.findByFullName(any(String.class))).thenReturn(new ArrayList<User>(Arrays.asList(lily)));
		assertEquals(1, userService.getUsersByFullName("potter").size());
		verify(userRepository, times(1)).findByFullName(any(String.class));
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
	@Test(expected = HibernateException.class)
	public void shouldNotDeleteRole() {
		dumbledore.getUserRoles().add(auror);
		List<User> list = new ArrayList<>();
		list.add(dumbledore);
		when(userRepository.findAll()).thenReturn(list);
		doNothing().when(roleRepository).delete(any(Role.class));
		userService.deleteRole(auror, false);
	}

	@Test
	public void shouldReturnAnObject() {
		User user = mock(User.class);
		assertNotNull(user);
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
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#updateUser(com.ihsinformatics.aahung.aagahi.model.User)}.
	 */
	@Test
	public void shouldUpdateUser() {
		when(userRepository.save(any(User.class))).thenReturn(snape);
		snape = userService.updateUser(snape);
		assertNotNull(snape.getDateUpdated());
		verify(userRepository, times(1)).save(any(User.class));
	}
	
	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#updateUserAttributeType(com.ihsinformatics.aahung.aagahi.model.UserAttributeType)}.
	 */
	@Test
	public void shouldUpdateUserAttribute() {
		when(userAttributeRepository.save(any(UserAttribute.class))).thenReturn(snapeBlood);
		assertNotNull(userService.updateUserAttribute(snapeBlood).getDateUpdated());
		verify(userAttributeRepository, times(1)).save(any(UserAttribute.class));
	}


	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.UserServiceImpl#updateUserAttributeType(com.ihsinformatics.aahung.aagahi.model.UserAttributeType)}.
	 */
	@Test
	public void shouldUpdateUserAttributeType() {
		when(userAttributeTypeRepository.save(any(UserAttributeType.class))).thenReturn(occupation);
		assertNotNull(userService.updateUserAttributeType(occupation).getDateUpdated());
		verify(userAttributeTypeRepository, times(1)).save(any(UserAttributeType.class));
	}
}
