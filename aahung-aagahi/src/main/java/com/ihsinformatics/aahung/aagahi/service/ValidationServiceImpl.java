/* Copyright(C) 2016 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
 */
package com.ihsinformatics.aahung.aagahi.service;

import java.io.IOException;
import java.util.Map.Entry;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

import javax.validation.ValidationException;

import org.hibernate.HibernateException;
import org.hibernate.cfg.NotYetImplementedException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ihsinformatics.aahung.aagahi.model.DataEntity;
import com.ihsinformatics.aahung.aagahi.model.Element;
import com.ihsinformatics.aahung.aagahi.model.FormData;
import com.ihsinformatics.aahung.aagahi.model.FormType;
import com.ihsinformatics.aahung.aagahi.util.DataType;
import com.ihsinformatics.aahung.aagahi.util.RegexUtil;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Service("validationService")
public class ValidationServiceImpl implements ValidationService {

	private final Logger LOG = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private MetadataService metadataService;

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
		}
		catch (Exception e) {
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
		// Looking at the com.ihsinformatics.tbreachapi.core.service.ValidationService example
		throw new NotYetImplementedException();
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
				}
				catch (NumberFormatException e) {
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

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.ValidationService#isValidJson(java.
	 * lang.String)
	 */
	@Override
	public boolean isValidJson(String jsonStr) {
		try {
			new JSONObject(jsonStr);
		}
		catch (JSONException ex) {
			try {
				new JSONArray(jsonStr);
			}
			catch (JSONException ex1) {
				return false;
			}
		}
		return true;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.ValidationService#validateFormData(
	 * com.ihsinformatics.aahung.aagahi.model.FormData)
	 */
	@Override
	public boolean validateFormData(FormData formData, DataEntity dataEntity)
	        throws HibernateException, ValidationException, IOException {
		if (dataEntity == null) {
			dataEntity = new DataEntity();
		}
		String data = formData.getData();
		if (!isValidJson(data)) {
			LOG.error("Data for the FormData {} is not valid JSON object.", formData.toString());
			return false;
		}
		try {
			formData.deserializeSchema();
		}
		catch (IOException e) {
			LOG.error("Schema for the FormData {} cannot be deserialized into a Map.", formData.toString());
			return false;
		}
		// The data packet must contain an array of objects expected to be saved against
		// defined elements
		boolean valid = true;
		for (Entry<String, Object> entry : formData.getDataMap().entrySet()) {
			// First, check whether a valid element exists
			Element element = findElementByIdentifier(entry.getKey());
			if (element == null) {
				LOG.error("Element against ID/Name {} does not exist.", entry.getKey());
				valid = false;
			} else {
				if (element.getIsRetired()) {
					LOG.warn("A retired element {} is being used.", element.getElementName());
				}
				// Now try to decipher the object
				Object obj = entry.getValue();
				try {
					Object object = dataEntity.decipher(element.getDataType(), obj.toString());
					if (object == null) {
						LOG.error("Object against reference ID {} does not exist.", obj.toString());
						valid = false;
					}
				}
				catch (Exception e) {
					LOG.error("Exception occurred when fetching object against reference ID {}.", obj.toString());
					valid = false;
				}
			}
		}
		return valid;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.ValidationService#validateFormType(
	 * com.ihsinformatics.aahung.aagahi.model.FormType)
	 */
	@Override
	public boolean validateFormType(FormType formType) throws HibernateException, ValidationException, JSONException {
		String schema = formType.getFormSchema();
		if (schema == null) {
			LOG.error("Schema for the FormType {} is cannot be NULL.", formType.toString());
			return false;
		}
		if (!isValidJson(schema)) {
			LOG.error("Schema for the FormType {} is not valid JSON object.", formType.toString());
			return false;
		}
		try {
			formType.deserializeSchema();
		}
		catch (IOException e) {
			LOG.error("Schema for the FormType {} cannot be deserialized into a Map.", formType.toString());
			return false;
		}
		if (!formType.getFormSchemaMap().containsKey("language")) {
			LOG.error("Schema for the FormType {} must specify 'language'.", formType.toString());
			return false;
		}
		if (!formType.getFormSchemaMap().containsKey("fields")) {
			LOG.error("Schema for the FormType {} must specify an array of fields.", formType.toString());
			return false;
		}
		JSONObject json = new JSONObject(formType.getFormSchemaMap());
		JSONArray fields = json.getJSONArray("fields");
		// Each element must contain page#, order# and UUID of an element
		boolean valid = true;
		for (int i = 0; i < fields.length(); i++) {
			JSONObject obj = fields.getJSONObject(i);
			try {
				obj.getInt("page");
			}
			catch (Exception e) {
				LOG.error("Field {} must specify 'page' as an integer.", obj);
				valid = false;
			}
			try {
				obj.getInt("order");
			}
			catch (Exception e) {
				LOG.error("Field {} must specify 'order' as an integer.", obj);
				valid = false;
			}
			String elementId = obj.getString("element");
			Element element = findElementByIdentifier(elementId);
			if (element == null) {
				LOG.error("Element against ID/Name {} does not exist.", elementId);
				valid = false;
			} else if (element.getIsRetired()) {
				LOG.warn("A retired element {} is being used.", element.getElementName());
			}
		}
		return valid;
	}

	/**
	 * This method inputs a string as identifier and tries to search an Element against it,
	 * depending on whether the identifier is a UUID, generated Id or short name
	 * 
	 * @param identifier
	 * @return
	 */
	private Element findElementByIdentifier(String identifier) {
		Element element = null;
		// Check if this is a UUID
		if (identifier.matches(RegexUtil.UUID)) {
			element = metadataService.getElementByUuid(identifier);
		}
		// Otherwise see if it's an Integer
		else if (RegexUtil.isNumeric(identifier, false)) {
			element = metadataService.getElementById(Integer.parseInt(identifier));
		}
		// Last resort, search by short name
		else {
			element = metadataService.getElementByShortName(identifier);
		}
		return element;
	}
}
