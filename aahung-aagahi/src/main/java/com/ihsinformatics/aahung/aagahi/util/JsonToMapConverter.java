/**
 * Purpose of this class is to convert a JSON object into a Map data structure
 */
package com.ihsinformatics.aahung.aagahi.util;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author Heril Muratovic (https://stackoverflow.com/users/4078505/heril-muratovic)
 */
@Converter
public class JsonToMapConverter implements AttributeConverter<String, Map<String, Object>> {

	@Override
	@SuppressWarnings("unchecked")
	public Map<String, Object> convertToDatabaseColumn(String attribute) {
		if (attribute == null) {
			return new HashMap<>();
		}
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			return objectMapper.readValue(attribute, HashMap.class);
		}
		catch (IOException e) {
			e.printStackTrace();
		}
		return new HashMap<>();
	}

	@Override
	public String convertToEntityAttribute(Map<String, Object> dbData) {
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			return objectMapper.writeValueAsString(dbData);
		}
		catch (JsonProcessingException e) {
			e.printStackTrace();
			return null;
		}
	}
}
