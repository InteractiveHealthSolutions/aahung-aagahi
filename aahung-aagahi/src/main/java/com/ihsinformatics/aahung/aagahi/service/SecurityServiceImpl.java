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

import org.hibernate.Hibernate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ihsinformatics.aahung.aagahi.annotation.MeasureProcessingTime;
import com.ihsinformatics.aahung.aagahi.model.User;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Service
public class SecurityServiceImpl extends BaseService implements SecurityService {

	private static User currentUser;

	@Override
	public User getAuditUser() {
		User user = getLoggedInUser();
		if (user == null) {
			try {
				return getEntityManager().find(User.class, 1);
			} catch (Exception e) {
				return null;
			}
		}
		return user;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.SecurityService#findLoggedInUser ()
	 */
	@Override
	public User getLoggedInUser() {
		if (currentUser != null) {
			return currentUser;
		}
		try {
			String username = SecurityContextHolder.getContext().getAuthentication().getName();
			User user = userRepository.findByUsername(username);
			currentUser = user;
		} catch (Exception e) {
		}
		return currentUser;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.SecurityService#hasAdminRole(com.
	 * ihsinformatics.aahung.aagahi.model.User)
	 */
	@Override
	public boolean hasAdminRole(User user) {
		try {
			if ("admin".equalsIgnoreCase(user.getUsername())) {
				return true;
			}
			List<User> list = userRepository.findUsersByUserRolesRoleId(1);
			return list.contains(user);
		} catch (Exception e) {
			return false;
		}
	}

	/**
	 * Returns true if current user has given privilege
	 * 
	 * @param privilege
	 * @return
	 */
	@Override
	public boolean hasPrivilege(String privilege) {
		return hasPrivilege(getLoggedInUser(), privilege);
	}

	/**
	 * Returns true if current user has given privilege
	 * 
	 * @param privilege
	 * @return
	 */
	@Override
	public boolean hasPrivilege(User user, String privilege) {
		if (hasAdminRole(user)) {
			return true;
		}
		if (!user.getUserPrivileges().isEmpty()) {
			return user.getUserPrivileges().stream().anyMatch(p -> p.getPrivilegeName().equals(privilege));
		}
		return false;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.SecurityService#login(java.lang.
	 * String, java.lang.String)
	 */
	@Override
	@MeasureProcessingTime
	public boolean login(String username, String password) throws SecurityException {
		logout();
		User user = userRepository.findByUsername(username);
		Hibernate.initialize(user);
		if (user == null) {
			throw new SecurityException("User not found!");
		}
		if (user.matchPassword(password)) {
			currentUser = user;
			return true;
		}
		return false;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.SecurityService#logout()
	 */
	@Override
	public void logout() {
		currentUser = null;
	}

	/**
	 * @return the currentUser
	 */
	public static User getCurrentUser() {
		return currentUser;
	}

	/**
	 * @param currentUser the currentUser to set
	 */
	public static void setCurrentUser(User currentUser) {
		SecurityServiceImpl.currentUser = currentUser;
	}
}
