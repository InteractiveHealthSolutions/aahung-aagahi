/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.service;

import java.util.List;

import org.hibernate.HibernateException;
import org.springframework.stereotype.Service;

import com.ihsinformatics.aahung.aagahi.model.Privilege;
import com.ihsinformatics.aahung.aagahi.model.Role;
import com.ihsinformatics.aahung.aagahi.model.User;
import com.ihsinformatics.aahung.aagahi.model.UserAttribute;
import com.ihsinformatics.aahung.aagahi.model.UserAttributeType;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Service
public interface UserService {

	/* Save methods */
	List<UserAttribute> saveUserAttributes(List<UserAttribute> attributes);

	Privilege savePrivilege(Privilege obj) throws HibernateException;

	Role saveRole(Role obj) throws HibernateException;

	UserAttributeType saveUserAttributeType(UserAttributeType obj) throws HibernateException;

	UserAttribute saveUserAttribute(UserAttribute obj) throws HibernateException;

	User saveUser(User obj) throws HibernateException;

	/* Update methods */
	Privilege updatePrivilege(Privilege obj) throws HibernateException;

	Role updateRole(Role obj) throws HibernateException;

	UserAttributeType updateUserAttributeType(UserAttributeType obj) throws HibernateException;

	UserAttribute updateUserAttribute(UserAttribute obj) throws HibernateException;

	User updateUser(User obj) throws HibernateException;

	/* Delete methods */
	void deletePrivilege(Privilege obj) throws HibernateException;

	/**
	 * Caution! Setting force true will remove the {@link Role} from all {@link User} entities as
	 * well
	 * 
	 * @param obj
	 * @param force
	 * @throws HibernateException
	 */
	void deleteRole(Role obj, boolean force) throws HibernateException;

	/**
	 * Caution! Setting force true will completely remove the user attribute from each dependent
	 * entity {@link UserAttribute} as well
	 * 
	 * @param obj
	 * @param force
	 * @throws HibernateException
	 */
	void deleteUserAttributeType(UserAttributeType obj, boolean force) throws HibernateException;

	void deleteUserAttribute(UserAttribute obj) throws HibernateException;

	void deleteUser(User obj) throws HibernateException;

	/* Fetch methods */
	/**
	 * Returns {@link Privilege} object by given UUID
	 * 
	 * @param uuid
	 * @return
	 */
	Privilege getPrivilegeByUuid(String uuid) throws HibernateException;

	/**
	 * Returns {@link Privilege} object matching given privilege name
	 * 
	 * @param name
	 * @return
	 */
	Privilege getPrivilegeByName(String name) throws HibernateException;

	/**
	 * Returns list of all {@link Privilege} objects
	 * 
	 * @return
	 */
	List<Privilege> getPrivileges() throws HibernateException;

	/**
	 * Returns list of {@link Privilege} objects from all roles the given {@link User} object has
	 * 
	 * @param user
	 * @return
	 * @throws HibernateException
	 */
	List<Privilege> getPrivilegesByUser(User user) throws HibernateException;

	/* Fetch methods for Role */
	/**
	 * Returns {@link Role} matching given Id
	 * 
	 * @param id
	 * @return
	 * @throws HibernateException
	 */
	Role getRoleById(Integer id) throws HibernateException;

	/**
	 * Returns {@link Role} matching given Id
	 * 
	 * @param id
	 * @return
	 * @throws HibernateException
	 */
	Role getRoleByUuid(String uuid) throws HibernateException;

	/**
	 * Returns {@link Role} matching given role name
	 * 
	 * @param name
	 * @return
	 * @throws HibernateException
	 */
	Role getRoleByName(String name) throws HibernateException;

	/**
	 * Returns list of all {@link Role} objects
	 * 
	 * @return
	 * @throws HibernateException
	 */
	List<Role> getRoles() throws HibernateException;

	/**
	 * Returns list of {@link Role} objects matching the instance given as example
	 * 
	 * @param role
	 * @return
	 * @throws HibernateException
	 */
	List<Role> getRolesByExample(Role role) throws HibernateException;

	/**
	 * Returns {@link UserAttributeType} object by given Id
	 * 
	 * @param id
	 * @return
	 * @throws HibernateException
	 */
	UserAttributeType getUserAttributeTypeById(Integer id) throws HibernateException;

	/**
	 * Returns {@link UserAttributeType} object by given UUID
	 * 
	 * @param uuid
	 * @return
	 * @throws HibernateException
	 */
	UserAttributeType getUserAttributeTypeByUuid(String uuid) throws HibernateException;

	/**
	 * Returns UserAttributeType object matching given name
	 * 
	 * @param name
	 * @return
	 * @throws HibernateException
	 */
	UserAttributeType getUserAttributeTypeByName(String name) throws HibernateException;

	/**
	 * Returns list of all UserAttributeType objects
	 * 
	 * @return
	 * @throws HibernateException
	 */
	List<UserAttributeType> getUserAttributeTypes() throws HibernateException;

	/**
	 * Returns {@link UserAttribute} object by given Id
	 * 
	 * @param id
	 * @return
	 * @throws HibernateException
	 */
	UserAttribute getUserAttributeById(Integer id) throws HibernateException;

	/**
	 * Returns {@link UserAttribute} object by given UUID
	 * 
	 * @param uuid
	 * @return
	 * @throws HibernateException
	 */
	UserAttribute getUserAttributeByUuid(String uuid) throws HibernateException;

	/**
	 * Returns {@link UserAttribute} object by given Person and Type
	 * 
	 * @param person
	 * @param attributeType
	 * @return
	 * @throws HibernateException
	 */
	List<UserAttribute> getUserAttribute(User user, UserAttributeType attributeType) throws HibernateException;

	/**
	 * Returns list of {@link UserAttribute} objects by given {@link UserAttributeType} object
	 * 
	 * @param attributeType
	 * @return
	 * @throws HibernateException
	 */
	List<UserAttribute> getUserAttributesByType(UserAttributeType attributeType) throws HibernateException;

	/**
	 * Returns list of {@link UserAttribute} objects by given {@link UserAttributeType} and its
	 * value
	 * 
	 * @param attributeType
	 * @param value
	 * @return
	 * @throws HibernateException
	 */
	List<UserAttribute> getUserAttributesByValue(UserAttributeType attributeType, String value) throws HibernateException;

	/**
	 * Returns list of {@link UserAttribute} objects by given {@link User}
	 * 
	 * @param user
	 * @return
	 * @throws HibernateException
	 */
	List<UserAttribute> getUserAttributesByUser(User user) throws HibernateException;

	/**
	 * Returns list of all {@link UserAttribute} objects matching given value. Caution! Using this
	 * method may introduce performance issues as the data grows
	 * 
	 * @param value
	 * @return
	 * @throws HibernateException
	 */
	List<UserAttribute> getUserAttributesByValue(String value) throws HibernateException;

	/* Fetch methods for User */
	/**
	 * Returns {@link User} object matching the given id
	 * 
	 * @param id
	 * @return
	 */
	User getUserById(Integer id) throws HibernateException;

	/**
	 * Returns {@link User} object matching the given UUID
	 * 
	 * @param uuid
	 * @return
	 */
	User getUserByUuid(String uuid) throws HibernateException;

	/**
	 * Returns {@link User} object matching given unique username
	 * 
	 * @param username
	 * @return
	 */
	User getUserByUsername(String username) throws HibernateException;

	/**
	 * Returns list of {@link User} objects having the same full name as given
	 * 
	 * @param name
	 * @return
	 */
	List<User> getUsersByFullName(String name) throws HibernateException;

	/**
	 * Returns list of all User objects
	 * 
	 * @return
	 * @throws HibernateException
	 */
	List<User> getUsers();

	/**
	 * Returns list of User objects matching the instance given as example
	 * 
	 * @param user
	 * @return
	 */
	List<User> getUsersByExample(User user) throws HibernateException;
}
