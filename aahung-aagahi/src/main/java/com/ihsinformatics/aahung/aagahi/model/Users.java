/**
 * 
 */
package com.ihsinformatics.aahung.aagahi.model;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import org.apache.commons.codec.binary.Base64;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ihsinformatics.util.EncryptionUtil;
import com.ihsinformatics.util.PasswordUtil;
import com.ihsinformatics.util.PasswordUtil.HashingAlgorithm;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "username"))
public class Users extends BaseEntity {

	private static final long serialVersionUID = 5639287915088163382L;

	public static final HashingAlgorithm HASHING_ALGORITHM = HashingAlgorithm.SHA512;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	@Column(name = "user_id")
	private Long userId;

	@Column(name = "username", nullable = false, length = 50)
	private String username;

	@Column(name = "full_name", nullable = false, length = 255)
	private String fullName;

	@Column(name = "disabled")
	private Boolean disabled;

	@Column(name = "reason_disabled")
	private String reasonDisabled;

	@Column(name = "password_hash", nullable = false, length = 255)
	@JsonIgnore
	private String passwordHash;

	@Column(name = "password_salt", length = 255)
	@JsonIgnore
	private String passwordSalt;

	public Users() {
		super();
	}
	
	/**
	 * In order to set password, first a salt is generated and password hash is
	 * calculated using password + salt and set as password
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
