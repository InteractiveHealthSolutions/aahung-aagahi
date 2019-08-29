/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.service;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.UUID;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.ihsinformatics.aahung.aagahi.BaseServiceTest;
import com.ihsinformatics.aahung.aagahi.model.Element;
import com.ihsinformatics.aahung.aagahi.model.FormType;

/**
 * @author owais.hussain@ihsinformatics.com
 */
public class ValidationServiceTest extends BaseServiceTest {

	@Mock
	protected MetadataService metadataService;

	private FormType quidditch;

	@Before
	public void reset() {
		super.reset();
		MockitoAnnotations.initMocks(this);
		schoolElement.setElementId(97);
		houseElement.setElementId(98);
		broomstickElement.setElementId(99);
		for (Element element : Arrays.asList(schoolElement, houseElement, broomstickElement)) {
			when(metadataService.getElementByShortName(element.getShortName())).thenReturn(element);
			when(metadataService.getElementByUuid(element.getUuid())).thenReturn(element);
			when(metadataService.getElementById(element.getElementId())).thenReturn(element);
		}
		quidditch = FormType.builder().formName("Quidditch Registration Form").shortName("QRF").version(1).build();
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ValidationServiceImpl#isValidJson(java.lang.String)}.
	 */
	@Test
	public void shouldValidateJson() {
		String jsonStr = "{ \"book\": { \"name\": \"Harry Potter and the Goblet of Fire\", \"author\": \"J. K. Rowling\", \"year\": 2000, \"genre\": \"Fantasy Fiction\", \"bestseller\": true, \"tags\": [ \"Adventure\", \"Fiction\", \"Mystery\", \"Action\"] }}";
		assertTrue(validationService.isValidJson(jsonStr));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ValidationServiceImpl#validateFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 */
	@Test
	public void shouldValidateFormType() {
		JSONObject schema = new JSONObject();
		try {
			schema.put("language", "en");
			JSONArray fields = new JSONArray();
			fields.put(new JSONObject("{\"page\" : 1, \"order\" : 1, \"element\" : \"" + schoolElement.getUuid() + "\"}"));
			fields.put(
			    new JSONObject("{\"page\" : 1, \"order\" : 2, \"element\" : \"" + houseElement.getElementId() + "\"}"));
			schema.put("fields", fields);
		}
		catch (JSONException e) {}
		quidditch.setFormSchema(schema.toString());
		assertTrue(validationService.validateFormType(quidditch));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ValidationServiceImpl#validateFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 */
	@Test
	public void shouldValidateFormTypeWithElementShortNames() {
		JSONObject schema = new JSONObject();
		try {
			schema.put("language", "en");
			JSONArray fields = new JSONArray();
			fields.put(
			    new JSONObject("{\"page\" : 1, \"order\" : 1, \"element\" : \"" + schoolElement.getShortName() + "\"}"));
			fields.put(
			    new JSONObject("{\"page\" : 1, \"order\" : 2, \"element\" : \"" + houseElement.getShortName() + "\"}"));
			fields.put(
			    new JSONObject("{\"page\" : 2, \"order\" : 1, \"element\" : \"" + broomstickElement.getShortName() + "\"}"));
			schema.put("fields", fields);
		}
		catch (JSONException e) {}
		quidditch.setFormSchema(schema.toString());
		assertTrue(validationService.validateFormType(quidditch));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ValidationServiceImpl#validateFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 */
	@Test
	public void shouldNotValidateFormTypeWithoutLanguage() {
		JSONObject schema = new JSONObject();
		try {
			JSONArray fields = new JSONArray();
			fields.put(
			    new JSONObject("{\"page\" : 1, \"order\" : 1, \"element\" : \"" + schoolElement.getShortName() + "\"}"));
			schema.put("fields", fields);
		}
		catch (JSONException e) {}
		quidditch.setFormSchema(schema.toString());
		assertFalse(validationService.validateFormType(quidditch));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ValidationServiceImpl#validateFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 */
	@Test
	public void shouldNotValidateFormTypeWithoutFields() {
		JSONObject schema = new JSONObject();
		try {
			schema.put("language", "en");
		}
		catch (JSONException e) {}
		quidditch.setFormSchema(schema.toString());
		assertFalse(validationService.validateFormType(quidditch));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ValidationServiceImpl#validateFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 */
	@Test
	public void shouldNotValidateFormTypeWithoutOrderAndPage() {
		JSONObject schema = new JSONObject();
		try {
			schema.put("language", "en");
			JSONArray fields = new JSONArray();
			fields.put(
			    new JSONObject("{\"page\" : 1, \"element\" : \"" + schoolElement.getShortName() + "\"}"));
			fields.put(
			    new JSONObject("{\"order\" : 2, \"element\" : \"" + houseElement.getShortName() + "\"}"));
			schema.put("fields", fields);
		}
		catch (JSONException e) {}
		quidditch.setFormSchema(schema.toString());
		assertFalse(validationService.validateFormType(quidditch));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ValidationServiceImpl#validateFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 */
	@Test
	public void shouldNotValidateFormTypeWithInvalidElements() {
		JSONObject schema = new JSONObject();
		try {
			schema.put("language", "en");
			JSONArray fields = new JSONArray();
			fields.put(
			    new JSONObject("{\"page\" : 1, \"order\" : 1, \"element\" : \"" + schoolElement.getDataType() + "\"}"));
			fields.put(
			    new JSONObject("{\"page\" : 2, \"order\" : 1, \"element\" : \"" + UUID.randomUUID().toString() + "\"}"));
			schema.put("fields", fields);
		}
		catch (JSONException e) {}
		quidditch.setFormSchema(schema.toString());
		assertFalse(validationService.validateFormType(quidditch));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ValidationServiceImpl#validateFormData(com.ihsinformatics.aahung.aagahi.model.FormData)}.
	 */
	@Test
	public void shouldValidateFormData() {
		// TODO
	}
}
