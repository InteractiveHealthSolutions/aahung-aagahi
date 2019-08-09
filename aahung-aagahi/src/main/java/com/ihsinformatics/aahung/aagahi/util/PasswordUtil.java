/* Copyright(C) 2018 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.apache.commons.codec.binary.Base64;

/**
 * This class provides password generating utilities. Be wise when selecting the
 * algorithm. MD5 is weakest and fastest, then comes SHA; SHA-512 uses 64 bits,
 * which makes it harder for GPU-based machines to attack it. BCrypt makes it
 * even more difficult. SCrypt (developed in 2009) exponentially grows memory as
 * well as processing time, making it the most secure of all.
 * 
 * @author owais.hussain@ihsinformatics.com
 *
 */
public class PasswordUtil {

    public enum HashingAlgorithm {
	MD5("MD5"), SHA512("SHA-512"), BCRYPT("BCRYPT"), SCRYPT("SCRYPT");

	private String name;

	HashingAlgorithm(String name) {
	    this.name = name;
	}

	public String getName() {
	    return name;
	}
    };

    private final HashingAlgorithm algorithm;
    private String salt;
    private int iterations;

    /**
     * @see PasswordUtil(HashingAlgorithm, String, int)
     * @param algorithm
     */
    public PasswordUtil(HashingAlgorithm algorithm) {
	this(algorithm, null, 1);
    }

    /**
     * Constructor
     * 
     * @param algorithm
     *            algorithm to be used for hashing
     * @param salt
     *            pass null if passwords are unsalted
     * @param iterations
     *            number of times hash is calculated
     */
    public PasswordUtil(HashingAlgorithm algorithm, String salt,
	    int iterations) {
	this.algorithm = algorithm;
	this.salt = salt;
	this.iterations = iterations;
	getMessageDigest();
    }

    public HashingAlgorithm getAlgorithm() {
	return algorithm;
    }

    public String getSalt() {
	return salt;
    }

    public void setSalt(String salt) {
	this.salt = salt;
    }

    /**
     * Encrypts the salt using DESede encryption algorithm
     * 
     * @param key
     * @return
     * @throws Exception
     */
    public byte[] encryptSalt(String key) throws Exception {
	EncryptionUtil util = new EncryptionUtil(key);
	return util.encrypt(salt);
    }

    /**
     * Decrypt the encrypted salt to original string using key
     * 
     * @param encryptedSalt
     * @param key
     * @return
     * @throws Exception
     */
    public String decryptSalt(byte[] encryptedSalt, String key)
	    throws Exception {
	EncryptionUtil util = new EncryptionUtil(key);
	return util.decrypt(encryptedSalt);
    }

    /**
     * Encodes the password using a MessageDigest. If salt is specified (i.e.
     * not null) it will be merged with the password before encoding.
     *
     * @param password
     *            The plain text password
     * @return Hex string of password digest
     */
    public String encode(String password) {
	String saltedPass = salt == null ? password
		: mergePasswordAndSalt(password, false);
	MessageDigest messageDigest = getMessageDigest();
	byte[] digest = messageDigest.digest(Utf8.encode(saltedPass));
	// "stretch" the encoded value if configured to do so
	for (int i = 1; i < this.iterations; i++) {
	    digest = messageDigest.digest(digest);
	}
	byte[] encoded = Base64.encodeBase64(digest);
	return Utf8.decode(encoded);
    }

    /**
     * Get a MessageDigest instance for the given algorithm. Throws an
     * IllegalArgumentException if <i>algorithm</i> is unknown
     *
     * @return MessageDigest instance
     * @throws IllegalArgumentException
     *             if NoSuchAlgorithmException is thrown
     */
    protected final MessageDigest getMessageDigest()
	    throws IllegalArgumentException {
	try {
	    return MessageDigest.getInstance(this.algorithm.getName());
	} catch (NoSuchAlgorithmException e) {
	    throw new IllegalArgumentException(
		    "No such algorithm " + algorithm + "");
	}
    }

    /**
     * Used by subclasses to generate a merged password and salt
     * <code>String</code>.
     * <P>
     * The generated password will be in the form of
     * <code>password{salt}</code>.
     * </p>
     * <p>
     * A <code>null</code> can be passed to either method, and will be handled
     * correctly. If the <code>salt</code> is <code>null</code> or empty, the
     * resulting generated password will simply be the passed
     * <code>password</code>. The <code>toString</code> method of the
     * <code>salt</code> will be used to represent the salt.
     * </p>
     *
     * @param password
     *            the password to be used (can be <code>null</code>)
     * @param strict
     *            ensures salt doesn't contain the delimiters
     *
     * @return a merged password and salt <code>String</code>
     *
     * @throws IllegalArgumentException
     *             if the salt contains '{' or '}' characters.
     */
    public String mergePasswordAndSalt(String password, boolean strict) {
	if (password == null) {
	    password = "";
	}
	if (strict && (salt != null)) {
	    if ((salt.toString().lastIndexOf("{") != -1)
		    || (salt.toString().lastIndexOf("}") != -1)) {
		throw new IllegalArgumentException(
			"Cannot use { or } in salt.toString()");
	    }
	}
	if ((salt == null) || "".equals(salt)) {
	    return password;
	} else {
	    return password + "{" + salt.toString() + "}";
	}
    }

    /**
     * Takes a previously encoded password hash and compares it with a raw
     * password after mixing in the salt and encoding that value
     *
     * @param passwordHash
     *            : encoded password
     * @param password
     *            : plain text password
     * @param salt
     *            : salt to mix into password
     * @return true or false
     */
    public boolean match(String passwordHash, String password) {
	String pass1 = "" + passwordHash;
	String pass2 = encode(password);
	return equals(pass1, pass2);
    }

    /**
     * Sets the number of iterations for which the calculated hash value should
     * be "stretched". If this is greater than one, the initial digest is
     * calculated, the digest function will be called repeatedly on the result
     * for the additional number of iterations.
     *
     * @param iterations
     *            the number of iterations which will be executed on the hashed
     *            password/salt value. Defaults to 1.
     */
    public void setIterations(int iterations) {
	if (iterations < 1) {
	    iterations = 1;
	} else {
	    this.iterations = iterations;
	}
    }

    /**
     * Constant time comparison to prevent against timing attacks.
     * 
     * @param expected
     * @param actual
     * @return
     */
    static boolean equals(String expected, String actual) {
	byte[] expectedBytes = Utf8.encode(expected);
	byte[] actualBytes = Utf8.encode(actual);
	int expectedLength = expectedBytes == null ? -1 : expectedBytes.length;
	int actualLength = actualBytes == null ? -1 : actualBytes.length;

	int result = expectedLength == actualLength ? 0 : 1;
	for (int i = 0; i < actualLength; i++) {
	    byte expectedByte = expectedLength <= 0 ? 0
		    : expectedBytes[i % expectedLength];
	    byte actualByte = actualBytes[i % actualLength];
	    result |= expectedByte ^ actualByte;
	}
	return result == 0;
    }
}
