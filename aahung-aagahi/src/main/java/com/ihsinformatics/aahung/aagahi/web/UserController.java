/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.web;

import java.net.URI;
import java.net.URISyntaxException;
import java.rmi.AlreadyBoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.validation.Valid;

import org.hibernate.HibernateException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ihsinformatics.aahung.aagahi.model.Privilege;
import com.ihsinformatics.aahung.aagahi.model.Role;
import com.ihsinformatics.aahung.aagahi.model.User;
import com.ihsinformatics.aahung.aagahi.model.UserAttribute;
import com.ihsinformatics.aahung.aagahi.model.UserAttributeType;
import com.ihsinformatics.aahung.aagahi.service.UserService;
import com.ihsinformatics.aahung.aagahi.util.SearchCriteria;
import com.ihsinformatics.aahung.aagahi.util.SearchOperator;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

/**
 * @author owais.hussain@ihsinformatics.com
 */

@RestController
@RequestMapping("/api")
@Api(value = "User Controller")
public class UserController extends BaseController {

	private final Logger LOG = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private UserService service;

	@ApiOperation(value = "Get all privileges")
	@GetMapping("/privileges")
	public Collection<Privilege> privileges() {
		return service.getAllPrivileges();
	}

	@ApiOperation(value = "Get privilege by UUID")
	@GetMapping("/privilege/{uuid}")
	public ResponseEntity<Privilege> readPrivilege(@PathVariable String uuid) {
		Optional<Privilege> privilege = Optional.of(service.getPrivilegeByUuid(uuid));
		return privilege.map(response -> ResponseEntity.ok().body(response))
		        .orElse(new ResponseEntity<Privilege>(HttpStatus.NOT_FOUND));
	}

	@ApiOperation(value = "Create a new privilege")
	@PostMapping("/privilege")
	public ResponseEntity<Privilege> createPrivilege(@Valid @RequestBody Privilege privilege)
	        throws URISyntaxException, AlreadyBoundException {
		LOG.info("Request to create privilege: {}", privilege);
		Privilege result = service.savePrivilege(privilege);
		return ResponseEntity.created(new URI("/api/privilege/" + result.getUuid())).body(result);
	}

	@ApiOperation(value = "Update an existing privilege")
	@PutMapping("/privilege/{uuid}")
	public ResponseEntity<Privilege> updateUser(@PathVariable String uuid, @Valid @RequestBody Privilege privilege) {
		privilege.setUuid(uuid);
		LOG.info("Request to update privilege: {}", privilege);
		Privilege result = service.updatePrivilege(privilege);
		return ResponseEntity.ok().body(result);
	}

	@ApiOperation(value = "Delete a privilege")
	@DeleteMapping("/privilege/{uuid}")
	public ResponseEntity<Privilege> deletePrivilege(@PathVariable String uuid) {
		LOG.info("Request to delete privilege: {}", uuid);
		service.deletePrivilege(service.getPrivilegeByUuid(uuid));
		return ResponseEntity.noContent().build();
	}

	@ApiOperation(value = "Get all roles")
	@GetMapping("/roles")
	public Collection<Role> roles() {
		return service.getAllRoles();
	}

	@ApiOperation(value = "Get role by UUID")
	@GetMapping("/role/{uuid}")
	public ResponseEntity<Role> readRole(@PathVariable String uuid) {
		Optional<Role> role = Optional.of(service.getRoleByUuid(uuid));
		return role.map(response -> ResponseEntity.ok().body(response))
		        .orElse(new ResponseEntity<Role>(HttpStatus.NOT_FOUND));
	}

	@ApiOperation(value = "Create a new role")
	@PostMapping("/role")
	public ResponseEntity<Role> createRole(@Valid @RequestBody Role role) throws URISyntaxException, AlreadyBoundException {
		LOG.info("Request to create role: {}", role);
		Role result = service.saveRole(role);
		return ResponseEntity.created(new URI("/api/role/" + result.getUuid())).body(result);
	}

	@ApiOperation(value = "Create an existing role")
	@PutMapping("/role/{uuid}")
	public ResponseEntity<Role> updateRole(@PathVariable String uuid, @Valid @RequestBody Role role) {
		role.setUuid(uuid);
		LOG.info("Request to update role: {}", role);
		Role result = service.updateRole(role);
		return ResponseEntity.ok().body(result);
	}

	@ApiOperation(value = "Delete a role")
	@DeleteMapping("/role/{uuid}")
	public ResponseEntity<Role> deleteRole(@PathVariable String uuid) {
		LOG.info("Request to delete role: {}", uuid);
		service.deleteRole(service.getRoleByUuid(uuid), false);
		return ResponseEntity.noContent().build();
	}

	@ApiOperation(value = "Get all user attribute types")
	@GetMapping("/userattributetypes")
	public Collection<UserAttributeType> userAttributeTypes() {
		return service.getAllUserAttributeTypes();
	}

	@ApiOperation(value = "Get user attribute type by UUID")
	@GetMapping("/userattributetype/{uuid}")
	public ResponseEntity<UserAttributeType> readUserAttributeType(@PathVariable String uuid) {
		Optional<UserAttributeType> userAttributeType = Optional.of(service.getUserAttributeTypeByUuid(uuid));
		return userAttributeType.map(response -> ResponseEntity.ok().body(response))
		        .orElse(new ResponseEntity<UserAttributeType>(HttpStatus.NOT_FOUND));
	}

	@ApiOperation(value = "Create a new user attribute type")
	@PostMapping("/userattributetype")
	public ResponseEntity<UserAttributeType> createRole(@Valid @RequestBody UserAttributeType userAttributeType)
	        throws URISyntaxException, AlreadyBoundException {
		LOG.info("Request to create role: {}", userAttributeType);
		UserAttributeType result = service.saveUserAttributeType(userAttributeType);
		return ResponseEntity.created(new URI("/api/userattributetype/" + result.getUuid())).body(result);
	}

	@ApiOperation(value = "Update an existing user attribute type")
	@PutMapping("/userattributetype/{uuid}")
	public ResponseEntity<UserAttributeType> updateUserAttributeType(@PathVariable String uuid,
	        @Valid @RequestBody UserAttributeType userAttributeType) {
		userAttributeType.setUuid(uuid);
		LOG.info("Request to update user attribute type: {}", userAttributeType);
		UserAttributeType result = service.updateUserAttributeType(userAttributeType);
		return ResponseEntity.ok().body(result);
	}

	@ApiOperation(value = "Delete a user attribute type")
	@DeleteMapping("/userattributetype/{uuid}")
	public ResponseEntity<UserAttributeType> deleteUserAttributeType(@PathVariable String uuid) {
		LOG.info("Request to delete user attribute type: {}", uuid);
		service.deleteUserAttributeType(service.getUserAttributeTypeByUuid(uuid), false);
		return ResponseEntity.noContent().build();
	}

	@ApiOperation(value = "Get All users / Search users on different Criteria")
	@GetMapping("/users")
	@ResponseBody
	public List<User> getUsers(@RequestParam(value = "search", required = false) String search,
	        @RequestParam(value = "roleName", required = false) List<String> roleName) {
		List<SearchCriteria> params = new ArrayList<SearchCriteria>();
		if (search != null) {
			if (!search.contains(":")) {
				User user = service.getUserByUsername(search);
				if (user != null)
					return Arrays.asList(user);
				else
					return service.getUsersByFullName(search);
			} else {
				Pattern pattern = Pattern.compile("(\\w+?)(:|<|>)(\\w+?),");
				Matcher matcher = pattern.matcher(search + ",");
				while (matcher.find()) {
					params.add(new SearchCriteria(matcher.group(1),
					        SearchOperator.getSearchOperatorByAlias(matcher.group(2)), matcher.group(3)));
				}
			}
		}
		else if (roleName != null) {
			List<User> userList = new ArrayList<User>();
			for (String name : roleName) {
				Role role = service.getRoleByName(name);
				userList.addAll(service.getUsersByRole(role));
			}
			return userList;
		}
		return service.searchUsers(params);
	}

	@ApiOperation(value = "Get user by UUID")
	@GetMapping("/user/{uuid}")
	public ResponseEntity<User> readUser(@PathVariable String uuid) {
		Optional<User> user = Optional.of(service.getUserByUuid(uuid));
		return user.map(response -> ResponseEntity.ok().body(response))
		        .orElse(new ResponseEntity<User>(HttpStatus.NOT_FOUND));
	}

	@ApiOperation(value = "Create a new user")
	@PostMapping("/user")
	public ResponseEntity<User> createUser(@Valid @RequestBody User user) throws URISyntaxException, AlreadyBoundException {
		LOG.info("Request to create user: {}", user);
		User result = service.saveUser(user);
		return ResponseEntity.created(new URI("/api/user/" + result.getUuid())).body(result);
	}

	@ApiOperation(value = "Update an existing usertype")
	@PutMapping("/user/{uuid}")
	public ResponseEntity<User> updateUser(@PathVariable String uuid, @Valid @RequestBody User user) {
		user.setUuid(uuid);
		LOG.info("Request to update user: {}", user);
		User result = service.updateUser(user);
		return ResponseEntity.ok().body(result);
	}

	@ApiOperation(value = "Delete a user")
	@DeleteMapping("/user/{uuid}")
	public ResponseEntity<User> deleteUser(@PathVariable String uuid) {
		LOG.info("Request to delete user: {}", uuid);
		service.deleteUser(service.getUserByUuid(uuid));
		return ResponseEntity.noContent().build();
	}

//	public void deletePrivilege(Privilege obj) throws HibernateException {
//	public void deleteRole(Role obj, boolean force) throws HibernateException {
//	public void deleteUser(User obj) throws HibernateException {
//	public void deleteUserAttribute(UserAttribute obj) throws HibernateException {
//	public void deleteUserAttributeType(UserAttributeType obj, boolean force) throws HibernateException {
	
//	public List<Privilege> getAllPrivileges() throws HibernateException {
//	public List<Role> getAllRoles() throws HibernateException {
//	public List<UserAttributeType> getAllUserAttributeTypes() throws HibernateException {
//	public List<User> getAllUsers() {
//	public Privilege getPrivilegeByName(String name) throws HibernateException {
//	public Privilege getPrivilegeByUuid(String uuid) throws HibernateException {
//	public Role getRoleByName(String name) throws HibernateException {
//	public Role getRoleByUuid(String uuid) throws HibernateException {
//	public List<Role> getRolesByExample(Role role) throws HibernateException {
//	public List<UserAttribute> getUserAttribute(User user, UserAttributeType attributeType) throws HibernateException {
//	public UserAttribute getUserAttributeByUuid(String uuid) throws HibernateException {
//	public List<UserAttribute> getUserAttributesByType(UserAttributeType attributeType) throws HibernateException {
//	public List<UserAttribute> getUserAttributesByUser(User user) throws HibernateException {
//	public List<UserAttribute> getUserAttributesByValue(String value) throws HibernateException {
//	public List<UserAttribute> getUserAttributesByValue(UserAttributeType attributeType, String value)
//	public UserAttributeType getUserAttributeTypeByName(String name) throws HibernateException {
//	public UserAttributeType getUserAttributeTypeByUuid(String uuid) throws HibernateException {
//	public User getUserByUsername(String username) throws HibernateException {
//	public User getUserByUuid(String uuid) throws HibernateException {
//	public List<User> getUsersByExample(User user) throws HibernateException {
//	public List<User> getUsersByFullName(String name) throws HibernateException {
//	public List<User> getUsersByRole(Role role) throws HibernateException {
//	public List<User> searchUsers(List<SearchCriteria> params) throws HibernateException {

//	public Privilege savePrivilege(Privilege obj) throws HibernateException {
//	public Role saveRole(Role obj) throws HibernateException {
//	public User saveUser(User obj) throws HibernateException {
//	public UserAttribute saveUserAttribute(UserAttribute obj) throws HibernateException {
//	public List<UserAttribute> saveUserAttributes(List<UserAttribute> attributes) {
//	public UserAttributeType saveUserAttributeType(UserAttributeType obj) throws HibernateException {
	
//	public Privilege updatePrivilege(Privilege obj) throws HibernateException {
//	public Role updateRole(Role obj) throws HibernateException {
//	public User updateUser(User obj) throws HibernateException {
//	public UserAttribute updateUserAttribute(UserAttribute obj) throws HibernateException {
//	public UserAttributeType updateUserAttributeType(UserAttributeType obj) throws HibernateException {
}
