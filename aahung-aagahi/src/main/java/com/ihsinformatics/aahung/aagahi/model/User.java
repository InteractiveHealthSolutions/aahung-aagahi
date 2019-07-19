/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.model;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.codec.binary.Base64;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ihsinformatics.util.EncryptionUtil;
import com.ihsinformatics.util.PasswordUtil;
import com.ihsinformatics.util.PasswordUtil.HashingAlgorithm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@Entity
@Table(name = "users")
@Builder
public class User extends DataEntity {

	private static final long serialVersionUID = 438143645994205849L;

	public static final HashingAlgorithm HASHING_ALGORITHM = HashingAlgorithm.SHA512;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	@Column(name = "user_id")
	private Integer userId;

	@Column(name = "username", nullable = false, unique = true, length = 50)
	private String username;

	@Column(name = "full_name", nullable = false, length = 255)
	private String fullName;

	@Column(name = "password_hash", nullable = false, length = 255)
	@JsonIgnore
	@ToString.Exclude
	private String passwordHash;

	@Column(name = "password_salt", length = 255)
	@JsonIgnore
	@ToString.Exclude
	private String passwordSalt;

	public User() {
		super();
	}

	/**
	 * In order to set password, first a salt is generated and password hash is calculated using
	 * password + salt and set as password
	 * 
	 * @param password
	 * @throws Exception
	 */
	public void setPassword(String password) throws Exception {
		// Generate random UUID to be used as salt
		String salt = UUID.randomUUID().toString();
		// Instantiate PasswordUtil instance using given salt
		PasswordUtil util = new PasswordUtil(HASHING_ALGORITHM, salt, 1);
		// Encode the salted password
		String encodedPassword = util.encode(password);
		setPasswordHash(encodedPassword);
		// Now to save salt in encrypted form using the password as key
		EncryptionUtil encryptionUtil = new EncryptionUtil(password);
		byte[] encryptedSalt = encryptionUtil.encrypt(salt);
		// Byte array shouldn't be stored as raw, so use Base64 encoding
		setPasswordSalt(Base64.encodeBase64String(encryptedSalt));
	}

	/**
	 * Authenticates password using PasswordUtil
	 * 
	 * @param password
	 * @return
	 * @throws Exception
	 */
	public boolean matchPassword(String password) throws Exception {
		PasswordUtil util = new PasswordUtil(HASHING_ALGORITHM);
		// If the password was salted, then update the salt parameter
		if (getPasswordSalt() != null) {
			// Salt is stored in hex values, convert back to byte array
			byte[] bytes = Base64.decodeBase64(getPasswordSalt());
			String salt = util.decryptSalt(bytes, password);
			util.setSalt(salt);
		}
		return util.match(getPasswordHash(), password);
	}
}
