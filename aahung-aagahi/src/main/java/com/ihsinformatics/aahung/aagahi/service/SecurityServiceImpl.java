/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.service;

import org.hibernate.HibernateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ihsinformatics.aahung.aagahi.Initializer;
import com.ihsinformatics.aahung.aagahi.model.Privilege;
import com.ihsinformatics.aahung.aagahi.model.User;
import com.ihsinformatics.aahung.aagahi.repository.UserRepository;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Service
public class SecurityServiceImpl implements SecurityService {

	@Autowired
	private UserRepository userRepository;

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.SecurityService#findLoggedInUsername()
	 */
	@Override
	public String getLoggedInUsername() {
		if (Initializer.getCurrentUser() != null) {
			return Initializer.getCurrentUser().getUsername();
		}
		return null;
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.SecurityService#login(java.lang.String, java.lang.String)
	 */
	@Override
	public boolean login(String username, String password) throws SecurityException {
		logout();
		User user = userRepository.findByUsername(username);
		if (user == null) {
			throw new SecurityException("User not found!");
		}
		if (user.matchPassword(password)) {
			Initializer.setCurrentUser(user);
			return true;
		}
		return false;
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.SecurityService#hasPrivilege(com.ihsinformatics.aahung.aagahi.model.Privilege)
	 */
	@Override
	public boolean hasPrivilege(Privilege privilege) throws HibernateException {
		return Initializer.getCurrentUser().getUserPrivileges().contains(privilege);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.SecurityService#logout()
	 */
	@Override
	public void logout() {
		Initializer.setCurrentUser(null);
	}
}
