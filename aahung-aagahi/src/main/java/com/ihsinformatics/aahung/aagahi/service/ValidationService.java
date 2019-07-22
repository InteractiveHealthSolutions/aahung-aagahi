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
import java.util.regex.PatternSyntaxException;

import javax.validation.ValidationException;

import org.hibernate.HibernateException;

import com.ihsinformatics.aahung.aagahi.util.DataType;

/**
 * @author owais.hussain@ihsinformatics.com
 *
 */
public interface ValidationService {

	/**
	 * Validates value according to given regular expression
	 * 
	 * @param regex
	 * @param value
	 * @return
	 * @throws PatternSyntaxException
	 */
	public boolean validateRegex(String regex, String value) throws PatternSyntaxException;

	/**
	 * Validates whether value is in given range. Range can be specified
	 * hyphened and/or comma separated values. E.g. "1-10", "2.2-3.0", "1,3,5",
	 * "1-5,7,9", etc.
	 * 
	 * @param range
	 * @param value
	 * @return
	 * @throws ValidationException
	 */
	public boolean validateRange(String range, Double value) throws ValidationException;

	/**
	 * Validates whether value is present in given comma-separated list
	 * 
	 * @param list
	 * @param value
	 * @return
	 * @throws ValidationException
	 */
	public boolean validateList(String list, String value) throws ValidationException;

	/**
	 * Validates whether value exists in given entity-field data. E.g.
	 * entity=Location, field=locationName will check whether value exists in
	 * locationName of location entity
	 * 
	 * @param entity
	 * @param field
	 * @param value
	 * @return
	 */
	public boolean validateRelation(String entity, String field, String value)
			throws HibernateException, ClassNotFoundException;

	/**
	 * Validates whether value is present in given SQL query. Caution! this
	 * method executes free query and is prone to SQL injections. Call only for
	 * last resort.
	 * 
	 * @param query
	 * @param value
	 * @return
	 * @throws SQLException
	 */
	@Deprecated
	public boolean validateQuery(String query, String value) throws SQLException;

	/**
	 * Father of validation methods. This method first checks if the input value
	 * is of give dataType (String, Double, etc.), then matches regex. The regex
	 * must be in format: LHS=RHS. If LHS is "regex", then RHS is expected to be
	 * a valid regular expression to match value with; If LHS is "list", then
	 * RHS should be a comma-separated list of strings to lookup value in; If
	 * LHS is "range", then RHS should be a set of range parts, like
	 * 1-10,2.2,3.2,5.5,17.1-18.9, etc. in which, the value will be checked; If
	 * LHS is "relation", then RHS is expected to be a Entity.fieldName (case
	 * sensitive) string to lookup the value in database
	 * 
	 * @param regex
	 * @param dataType
	 * @param value
	 * @return
	 * @throws ValidationException
	 * @throws PatternSyntaxException
	 */
	public boolean validateData(String regex, DataType dataType, String value)
			throws ValidationException, PatternSyntaxException, HibernateException, ClassNotFoundException;

}
