/* Copyright(C) 2016 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
 */
package com.ihsinformatics.aahung.aagahi.service;

import java.sql.SQLException;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

import javax.validation.ValidationException;

import org.hibernate.HibernateException;
import org.hibernate.cfg.NotYetImplementedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ihsinformatics.aahung.aagahi.repository.MetadataRepository;
import com.ihsinformatics.aahung.aagahi.util.DataType;
import com.ihsinformatics.aahung.aagahi.util.RegexUtil;

/**
 * @author owais.hussain@ihsinformatics.com
 *
 */
@Service("validationService")
public class ValidationServiceImpl implements ValidationService {

	private final Logger LOG = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private MetadataRepository metadata;

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.ValidationService#validateRegex(java
	 * .lang.String, java.lang.String)
	 */
	@Override
	public boolean validateRegex(String regex, String value) throws PatternSyntaxException {
		try {
			Pattern.compile(regex);
		} catch (Exception e) {
			throw new PatternSyntaxException("Invalid regular expression provided for validation.", regex, -1);
		}
		return value.matches(regex);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.ValidationService#validateRange(java
	 * .lang.String, java.lang.Double)
	 */
	@Override
	public boolean validateRange(String range, Double value) throws ValidationException {
		boolean valid = false;
		if (!range.matches("^[0-9.,-]+")) {
			throw new ValidationException(
					"Invalid format provided for validation range. Must be a list of hyphenated or comma-separated tuples of numbers (1-10; 2.2-3.0; 1,3,5; 1-5,7,9).");
		}
		// Break into tuples
		String[] tuples = range.split(",");
		for (String tuple : tuples) {
			if (tuple.contains("-")) {
				String[] parts = tuple.split("-");
				double min = Double.parseDouble(parts[0]);
				double max = Double.parseDouble(parts[1]);
				valid = (value >= min && value <= max);
			} else {
				valid = (Double.compare(value.doubleValue(), Double.parseDouble(tuple)) == 0);
			}
			if (valid) {
				return true;
			}
		}
		return false;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.ValidationService#validateList(java.
	 * lang.String, java.lang.String)
	 */
	@Override
	public boolean validateList(String list, String value) throws ValidationException {
		if (!list.matches("^[A-Za-z0-9,_\\-\\s]+")) {
			throw new ValidationException(
					"Invalid format provided for validation list. Must be a comma-separated list of alpha-numeric values (white space, hypen and underscore allowed).");
		}
		String[] values = list.split(",");
		for (int i = 0; i < values.length; i++) {
			if (value.equalsIgnoreCase(values[i]))
				return true;
		}
		return false;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.ValidationService#validateRelation(
	 * java.lang.String, java.lang.String, java.lang.String)
	 */
	@Override
	public boolean validateRelation(String entity, String field, String value)
			throws HibernateException, ClassNotFoundException {
		// TODO: Complete this by looking at the
		// com.ihsinformatics.tbreachapi.core.service.ValidationService example
		throw new NotYetImplementedException();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.ValidationService#validateQuery(java
	 * .lang.String, java.lang.String)
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	@Deprecated
	public boolean validateQuery(String query, String value) throws SQLException {
		List list = metadata.getEntityManager().createNativeQuery(query).getResultList();
		for (Iterator<List<Object>> iter = list.iterator(); iter.hasNext();) {
			List<Object> values = iter.next();
			if (values.contains(value))
				return true;
		}
		return false;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.ValidationService#validateData(java.
	 * lang.String, java.lang.String, java.lang.String)
	 */
	@Override
	public boolean validateData(String regex, DataType dataType, String value)
			throws ValidationException, PatternSyntaxException, HibernateException, ClassNotFoundException {
		boolean isValidDataType = false;
		boolean isValidValue = false;
		// Validate according to given data type
		switch (dataType) {
		case BOOLEAN:
			isValidDataType = value.matches("Y|N|y|n|true|false|True|False|TRUE|FALSE|0|1");
			break;
		case CHARACTER:
			isValidDataType = value.length() == 1;
			break;
		case DATE:
			isValidDataType = value.matches(RegexUtil.SQL_DATE);
			break;
		case DATETIME:
			isValidDataType = value.matches(RegexUtil.SQL_DATETIME);
			break;
		case FLOAT:
			isValidDataType = value.matches(RegexUtil.DECIMAL);
			break;
		case INTEGER:
			isValidDataType = value.matches(RegexUtil.INTEGER);
			break;
		case STRING:
			isValidDataType = true;
			break;
		case TIME:
			isValidDataType = value.matches(RegexUtil.SQL_TIME);
			break;
		// Just check if the value is a valid UUID
		case DEFINITION:
		case LOCATION:
		case USER:
			isValidDataType = value.matches(RegexUtil.UUID);
			break;
		default:
			break;
		}
		// Check if validation regex is provided
		if (regex == null) {
			isValidValue = true;
		} else {
			String[] parts = regex.split("=");
			if (parts.length != 2) {
				throw new ValidationException("Invalid value provided for validation regex. Must be in format LHS=RHS");
			}
			String type = parts[0];
			String validatorStr = parts[1];
			// Validate regular expression
			if (type.equalsIgnoreCase("regex")) {
				isValidValue = validateRegex(validatorStr, value);
			}
			// Validate entity relationship
			else if (type.equalsIgnoreCase("relation")) {
				String[] relation = validatorStr.split(".");
				if (relation.length < 2) {
					throw new ValidationException(
							"Invalid relationship provided. Must be in format Entity.fieldName (case sensitive)");
				}
				isValidValue = validateRelation(relation[0], relation[1], value);
			}
			// Validate range
			else if (type.equalsIgnoreCase("range")) {
				try {
					double num = Double.parseDouble(value);
					isValidValue = validateRange(validatorStr, num);
				} catch (NumberFormatException e) {
					LOG.error(e.getMessage());
					isValidValue = false;
				}
			}
			// Validate comma-separated list
			else if (type.equalsIgnoreCase("list")) {
				isValidValue = validateList(validatorStr, value);
			}
		}
		return (isValidDataType && isValidValue);
	}
}
