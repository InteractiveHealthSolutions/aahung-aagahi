/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.web;

import static org.junit.Assert.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;

import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ihsinformatics.aahung.aagahi.BaseTestData;
import com.ihsinformatics.aahung.aagahi.model.BaseEntity;
import com.ihsinformatics.aahung.aagahi.model.User;
import com.ihsinformatics.aahung.aagahi.model.UserAttributeType;
import com.ihsinformatics.aahung.aagahi.service.UserService;
import com.ihsinformatics.aahung.aagahi.model.Role;
import com.ihsinformatics.aahung.aagahi.model.Privilege;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(MockitoJUnitRunner.class)
public class UserControllerTest extends BaseTestData {

	protected static String API_PREFIX = "/api/";

	protected MockMvc mockMvc;

	@Mock
	protected UserService userService;

	@InjectMocks
	protected UserController userController;

	@Before
	public void reset() {
		super.initData();
		MockitoAnnotations.initMocks(this);
		mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
	}
	
	@Test
	public void shouldGetPrivileges() throws Exception {
		when(userService.getPrivileges()).thenReturn(Arrays.asList(curse, charm, magic));
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "privilege"));
		actions.andExpect(status().isOk());
		actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
		actions.andExpect(jsonPath("$", Matchers.hasSize(3)));
		verify(userService, times(1)).getRoles();
		verifyNoMoreInteractions(userService);
	}

	/*@Test
	public void shouldReadPrivilege() {
		fail("Not yet implemented");
	}*/

	@Test
	public void shouldCreatePrivilege() throws Exception {
		when(userService.savePrivilege(any(Privilege.class))).thenReturn(curse);
		String content = BaseEntity.getGson().toJson(curse);
		RequestBuilder requestBuilder = MockMvcRequestBuilders.post(API_PREFIX + "privilege")
		        .accept(MediaType.APPLICATION_JSON_UTF8).contentType(MediaType.APPLICATION_JSON_UTF8).content(content);
		ResultActions actions = mockMvc.perform(requestBuilder);
		actions.andExpect(status().isCreated());
		String expectedUrl = API_PREFIX + "privilege/" + curse.getUuid();
		actions.andExpect(MockMvcResultMatchers.redirectedUrl(expectedUrl));
		verify(userService, times(1)).savePrivilege(any(Privilege.class));
	}

	@Test
	public void shouldUpdateUserStringPrivilege() throws Exception {
		when(userService.updatePrivilege(any(Privilege.class))).thenReturn(charm);
		String content = BaseEntity.getGson().toJson(charm);
		ResultActions actions = mockMvc.perform(put(API_PREFIX + "privilege/{id}", charm.getUuid())
		        .contentType(MediaType.APPLICATION_JSON_UTF8).content(content));
		actions.andExpect(status().isOk());
		verify(userService, times(1)).updatePrivilege(any(Privilege.class));
	}

	@Test
	public void shouldDeletePrivilege() throws Exception {
		when(userService.getPrivilegeByUuid(any(String.class))).thenReturn(magic);
		doNothing().when(userService).deletePrivilege(magic);
		ResultActions actions = mockMvc.perform(delete(API_PREFIX + "privilege/{id}", magic.getUuid()));
		actions.andExpect(status().isNoContent());
		verify(userService, times(1)).getPrivilegeByUuid(magic.getUuid());
		verify(userService, times(1)).deletePrivilege(magic);
		verifyNoMoreInteractions(userService);
	}

	@Test
	public void shouldGetRoles() throws Exception {
		when(userService.getRoles()).thenReturn(Arrays.asList(headmaster, potionMaster, auror));
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "roles"));
		actions.andExpect(status().isOk());
		actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
		actions.andExpect(jsonPath("$", Matchers.hasSize(3)));
		verify(userService, times(1)).getRoles();
		verifyNoMoreInteractions(userService);
	}

	/*@Test
	public void shouldReadRole() {
		fail("Not yet implemented");
	}*/

	@Test
	public void shouldCreateRole() throws Exception {
		when(userService.saveRole(any(Role.class))).thenReturn(potionMaster);
		String content = BaseEntity.getGson().toJson(potionMaster);
		RequestBuilder requestBuilder = MockMvcRequestBuilders.post(API_PREFIX + "role")
		        .accept(MediaType.APPLICATION_JSON_UTF8).contentType(MediaType.APPLICATION_JSON_UTF8).content(content);
		ResultActions actions = mockMvc.perform(requestBuilder);
		actions.andExpect(status().isCreated());
		String expectedUrl = API_PREFIX + "role/" + potionMaster.getUuid();
		actions.andExpect(MockMvcResultMatchers.redirectedUrl(expectedUrl));
		verify(userService, times(1)).updateRole(any(Role.class));
	}

	@Test
	public void shouldUpdateRole() throws Exception {
		when(userService.updateRole(any(Role.class))).thenReturn(headmaster);
		String content = BaseEntity.getGson().toJson(occupation);
		ResultActions actions = mockMvc.perform(put(API_PREFIX + "role/{id}", headmaster.getUuid())
		        .contentType(MediaType.APPLICATION_JSON_UTF8).content(content));
		actions.andExpect(status().isOk());
		verify(userService, times(1)).updateRole(any(Role.class));
	}

	@Test
	public void shouldDeleteRole() throws Exception {
		when(userService.getRoleByUuid(any(String.class))).thenReturn(headmaster);
		doNothing().when(userService).deleteRole(headmaster, false);
		ResultActions actions = mockMvc.perform(delete(API_PREFIX + "role/{id}", headmaster.getUuid()));
		actions.andExpect(status().isNoContent());
		verify(userService, times(1)).getRoleByUuid(headmaster.getUuid());
		verify(userService, times(1)).deleteRole(headmaster, false);
		verifyNoMoreInteractions(userService);
	}

	@Test
	public void shouldGetUserAttributeTypes()  throws Exception {
		when(userService.getUserAttributeTypes()).thenReturn(Arrays.asList(occupation, patronus, blood));
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "userattributetypes"));
		actions.andExpect(status().isOk());
		actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
		actions.andExpect(jsonPath("$", Matchers.hasSize(3)));
		verify(userService, times(1)).getUserAttributeTypes();
		verifyNoMoreInteractions(userService);
	}

	/*@Test
	public void shouldReadUserAttributeType() {
		fail("Not yet implemented");
	}*/

	@Test
	public void shouldCreateUserAttributeType() throws Exception {
		when(userService.saveUserAttributeType(any(UserAttributeType.class))).thenReturn(blood);
		String content = BaseEntity.getGson().toJson(blood);
		RequestBuilder requestBuilder = MockMvcRequestBuilders.post(API_PREFIX + "userattributetype")
		        .accept(MediaType.APPLICATION_JSON_UTF8).contentType(MediaType.APPLICATION_JSON_UTF8).content(content);
		ResultActions actions = mockMvc.perform(requestBuilder);
		actions.andExpect(status().isCreated());
		String expectedUrl = API_PREFIX + "userattributetype/" + blood.getUuid();
		actions.andExpect(MockMvcResultMatchers.redirectedUrl(expectedUrl));
		verify(userService, times(1)).updateUserAttributeType(any(UserAttributeType.class));
	}

	@Test
	public void shouldUpdateUserAttributeType() throws Exception {
		when(userService.updateUserAttributeType(any(UserAttributeType.class))).thenReturn(occupation);
		String content = BaseEntity.getGson().toJson(occupation);
		ResultActions actions = mockMvc.perform(put(API_PREFIX + "userattributetype/{id}", occupation.getUuid())
		        .contentType(MediaType.APPLICATION_JSON_UTF8).content(content));
		actions.andExpect(status().isOk());
		verify(userService, times(1)).updateUserAttributeType(any(UserAttributeType.class));
	}

	@Test
	public void shouldDeleteUserAttributeType() throws Exception {
		when(userService.getUserAttributeTypeByUuid(any(String.class))).thenReturn(blood);
		doNothing().when(userService).deleteUserAttributeType(blood, false);
		ResultActions actions = mockMvc.perform(delete(API_PREFIX + "userattributetype/{id}", blood.getUuid()));
		actions.andExpect(status().isNoContent());
		verify(userService, times(1)).getUserAttributeTypeByUuid(blood.getUuid());
		verify(userService, times(1)).deleteUserAttributeType(blood, false);
		verifyNoMoreInteractions(userService);
	}
	

	@Test
	public void shouldGetUser() throws Exception {
		when(userService.getUserByUuid(any(String.class))).thenReturn(dumbledore);
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "user/{uuid}", dumbledore.getUuid()));
		actions.andExpect(status().isOk());
		actions.andExpect(jsonPath("$.username", Matchers.is(dumbledore.getUsername())));
		actions.andExpect(jsonPath("$.fullName", Matchers.is(dumbledore.getFullName())));
		verify(userService, times(1)).getUserByUuid(any(String.class));
	}

	@Test
	public void shouldGetUsers() throws Exception {
		when(userService.getUsers()).thenReturn(Arrays.asList(dumbledore, snape, tonks));
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "users"));
		actions.andExpect(status().isOk());
		actions.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE));
		actions.andExpect(jsonPath("$", Matchers.hasSize(3)));
		verify(userService, times(1)).getUsers();
		verifyNoMoreInteractions(userService);
	}

	@Test
	public void shouldCreateUser() throws Exception {
		when(userService.saveUser(any(User.class))).thenReturn(snape);
		String content = BaseEntity.getGson().toJson(snape);
		RequestBuilder requestBuilder = MockMvcRequestBuilders.post(API_PREFIX + "user")
		        .accept(MediaType.APPLICATION_JSON_UTF8).contentType(MediaType.APPLICATION_JSON_UTF8).content(content);
		ResultActions actions = mockMvc.perform(requestBuilder);
		actions.andExpect(status().isCreated());
		String expectedUrl = API_PREFIX + "user/" + snape.getUuid();
		actions.andExpect(MockMvcResultMatchers.redirectedUrl(expectedUrl));
		verify(userService, times(1)).saveUser(any(User.class));
	}

	@Test
	public void shouldUpdateUser() throws Exception {
		when(userService.updateUser(any(User.class))).thenReturn(dumbledore);
		String content = BaseEntity.getGson().toJson(dumbledore);
		ResultActions actions = mockMvc.perform(put(API_PREFIX + "user/{id}", dumbledore.getUuid())
		        .contentType(MediaType.APPLICATION_JSON_UTF8).content(content));
		actions.andExpect(status().isOk());
		verify(userService, times(1)).updateUser(any(User.class));
	}

	@Test
	public void shouldDeleteUser() throws Exception {
		when(userService.getUserByUuid(any(String.class))).thenReturn(dumbledore);
		doNothing().when(userService).deleteUser(dumbledore);
		ResultActions actions = mockMvc.perform(delete(API_PREFIX + "user/{id}", dumbledore.getUuid()));
		actions.andExpect(status().isNoContent());
		verify(userService, times(1)).getUserByUuid(dumbledore.getUuid());
		verify(userService, times(1)).deleteUser(dumbledore);
		verifyNoMoreInteractions(userService);
	}
}
