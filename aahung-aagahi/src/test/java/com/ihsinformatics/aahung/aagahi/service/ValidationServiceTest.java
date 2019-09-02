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
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import javax.validation.ValidationException;

import org.hibernate.HibernateException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.ihsinformatics.aahung.aagahi.BaseServiceTest;
import com.ihsinformatics.aahung.aagahi.model.DataEntity;
import com.ihsinformatics.aahung.aagahi.model.Element;
import com.ihsinformatics.aahung.aagahi.model.FormData;
import com.ihsinformatics.aahung.aagahi.model.FormType;
import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.util.DataType;
import com.ihsinformatics.aahung.aagahi.util.DateTimeUtil;

/**
 * @author owais.hussain@ihsinformatics.com
 */
public class ValidationServiceTest extends BaseServiceTest {

	private Element numberElement = Element.builder().dataType(DataType.INTEGER).elementId(100)
			.elementName("Dress Number").shortName("NO").build();
	private Element heightElement = Element.builder().dataType(DataType.FLOAT).elementId(101).elementName("Height")
			.shortName("HEIGHT").build();
	private Element captainElement = Element.builder().dataType(DataType.BOOLEAN).elementId(102)
			.elementName("Is Team Captain").shortName("CAPTAIN").build();
	private Element genderElement = Element.builder().dataType(DataType.CHARACTER).elementName("Gender")
			.shortName("GENDER").build();
	private Element dateJoinedElement = Element.builder().dataType(DataType.DATE).elementName("Date Joined")
			.shortName("JOIN_DATE").build();
	private Element refereeElement = Element.builder().dataType(DataType.USER).elementName("Referred By")
			.shortName("REFEREE").build();
	private Element titlesElement = Element.builder().dataType(DataType.JSON).elementName("Titles").shortName("TITLES")
			.build();

	@Mock
	protected MetadataServiceImpl metadataService;
	
	@Mock
	private DataEntity dataEntity;

	private FormType quidditch;

	private FormData quidditchData;

	@Before
	public void reset() {
		super.reset();
		MockitoAnnotations.initMocks(this);
		int count = 50;
		numberElement = Element.builder().dataType(DataType.INTEGER).elementId(count++).elementName("Dress Number")
				.shortName("NO").build();
		heightElement = Element.builder().dataType(DataType.FLOAT).elementId(count++).elementName("Height")
				.shortName("HEIGHT").build();
		captainElement = Element.builder().dataType(DataType.BOOLEAN).elementId(count++).elementName("Is Team Captain")
				.shortName("CAPTAIN").build();
		genderElement = Element.builder().dataType(DataType.CHARACTER).elementId(count++).elementName("Gender").shortName("GENDER")
				.build();
		dateJoinedElement = Element.builder().dataType(DataType.DATE).elementId(count++).elementName("Date Joined").shortName("JOIN_DATE")
				.build();
		refereeElement = Element.builder().dataType(DataType.USER).elementId(count++).elementName("Referred By").shortName("REFEREE")
				.build();
		titlesElement = Element.builder().dataType(DataType.JSON).elementId(count++).elementName("Titles").shortName("TITLES").build();
		schoolElement.setElementId(count++);
		houseElement.setElementId(count++);
		broomstickElement.setElementId(count++);
		dumbledore.setUserId(count++);
		hogwartz.setLocationId(count++);
		ravenclaw.setDefinitionId(count++);
		firebolt.setDefinitionId(count++);
		quidditch = FormType.builder().formName("Quidditch Registration Form").shortName("QRF").version(1).build();
		Set<Participant> participants = new HashSet<>();
		participants.add(seeker);
		participants.add(keeper);
		quidditchData = FormData.builder().formType(quidditch).formDate(new Date()).referenceId("100")
				.location(hogwartz).formParticipants(participants).build();
		initMockConditions();
	}

	private void initMockConditions() {
		for (Element element : Arrays.asList(schoolElement, houseElement, broomstickElement, numberElement,
				heightElement, captainElement, genderElement, dateJoinedElement, refereeElement, titlesElement)) {
			when(metadataService.getElementByShortName(element.getShortName())).thenReturn(element);
			when(metadataService.getElementByUuid(element.getUuid())).thenReturn(element);
			when(metadataService.getElementById(element.getElementId())).thenReturn(element);
		}
		when(dataEntity.decipher(DataType.DEFINITION, String.valueOf(ravenclaw.getDefinitionId()))).thenReturn(ravenclaw);
		when(dataEntity.decipher(DataType.DEFINITION, String.valueOf(firebolt.getDefinitionId()))).thenReturn(firebolt);
		when(dataEntity.decipher(DataType.LOCATION, String.valueOf(hogwartz.getLocationId()))).thenReturn(hogwartz);
		when(dataEntity.decipher(DataType.USER, String.valueOf(dumbledore.getUserId()))).thenReturn(dumbledore);
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
	 * @throws JSONException 
	 * @throws ValidationException 
	 * @throws HibernateException 
	 */
	@Test
	public void shouldValidateFormType() throws HibernateException, ValidationException, JSONException {
		JSONObject schema = new JSONObject();
		try {
			schema.put("language", "en");
			JSONArray fields = new JSONArray();
			fields.put(
					new JSONObject("{\"page\" : 1, \"order\" : 1, \"element\" : \"" + schoolElement.getUuid() + "\"}"));
			fields.put(new JSONObject(
					"{\"page\" : 1, \"order\" : 2, \"element\" : \"" + houseElement.getElementId() + "\"}"));
			schema.put("fields", fields);
		} catch (JSONException e) {
		}
		quidditch.setFormSchema(schema.toString());
		assertTrue(validationService.validateFormType(quidditch));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ValidationServiceImpl#validateFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 * @throws JSONException 
	 * @throws ValidationException 
	 * @throws HibernateException 
	 */
	@Test
	public void shouldValidateFormTypeWithElementShortNames() throws HibernateException, ValidationException, JSONException {
		JSONObject schema = new JSONObject();
		try {
			schema.put("language", "en");
			JSONArray fields = new JSONArray();
			fields.put(new JSONObject(
					"{\"page\" : 1, \"order\" : 1, \"element\" : \"" + schoolElement.getShortName() + "\"}"));
			fields.put(new JSONObject(
					"{\"page\" : 1, \"order\" : 2, \"element\" : \"" + houseElement.getShortName() + "\"}"));
			fields.put(new JSONObject(
					"{\"page\" : 2, \"order\" : 1, \"element\" : \"" + broomstickElement.getShortName() + "\"}"));
			schema.put("fields", fields);
		} catch (JSONException e) {
		}
		quidditch.setFormSchema(schema.toString());
		assertTrue(validationService.validateFormType(quidditch));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ValidationServiceImpl#validateFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 * @throws JSONException 
	 * @throws ValidationException 
	 * @throws HibernateException 
	 */
	@Test
	public void shouldNotValidateFormTypeWithoutLanguage() throws HibernateException, ValidationException, JSONException {
		JSONObject schema = new JSONObject();
		try {
			JSONArray fields = new JSONArray();
			fields.put(new JSONObject(
					"{\"page\" : 1, \"order\" : 1, \"element\" : \"" + schoolElement.getShortName() + "\"}"));
			schema.put("fields", fields);
		} catch (JSONException e) {
		}
		quidditch.setFormSchema(schema.toString());
		assertFalse(validationService.validateFormType(quidditch));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ValidationServiceImpl#validateFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 * @throws JSONException 
	 * @throws ValidationException 
	 * @throws HibernateException 
	 */
	@Test
	public void shouldNotValidateFormTypeWithoutFields() throws HibernateException, ValidationException, JSONException {
		JSONObject schema = new JSONObject();
		try {
			schema.put("language", "en");
		} catch (JSONException e) {
		}
		quidditch.setFormSchema(schema.toString());
		assertFalse(validationService.validateFormType(quidditch));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ValidationServiceImpl#validateFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 * @throws JSONException 
	 * @throws ValidationException 
	 * @throws HibernateException 
	 */
	@Test
	public void shouldNotValidateFormTypeWithoutOrderAndPage() throws HibernateException, ValidationException, JSONException {
		JSONObject schema = new JSONObject();
		try {
			schema.put("language", "en");
			JSONArray fields = new JSONArray();
			fields.put(new JSONObject("{\"page\" : 1, \"element\" : \"" + schoolElement.getShortName() + "\"}"));
			fields.put(new JSONObject("{\"order\" : 2, \"element\" : \"" + houseElement.getShortName() + "\"}"));
			schema.put("fields", fields);
		} catch (JSONException e) {
		}
		quidditch.setFormSchema(schema.toString());
		assertFalse(validationService.validateFormType(quidditch));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ValidationServiceImpl#validateFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 * @throws JSONException 
	 * @throws ValidationException 
	 * @throws HibernateException 
	 */
	@Test
	public void shouldNotValidateFormTypeWithInvalidElements() throws HibernateException, ValidationException, JSONException {
		JSONObject schema = new JSONObject();
		try {
			schema.put("language", "en");
			JSONArray fields = new JSONArray();
			fields.put(new JSONObject(
					"{\"page\" : 1, \"order\" : 1, \"element\" : \"" + schoolElement.getDataType() + "\"}"));
			fields.put(new JSONObject(
					"{\"page\" : 2, \"order\" : 1, \"element\" : \"" + UUID.randomUUID().toString() + "\"}"));
			schema.put("fields", fields);
		} catch (JSONException e) {
		}
		quidditch.setFormSchema(schema.toString());
		assertFalse(validationService.validateFormType(quidditch));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ValidationServiceImpl#validateFormData(com.ihsinformatics.aahung.aagahi.model.FormData)}.
	 * @throws Exception 
	 */
	@Test
	public void shouldValidateFormDataWithPrimitiveElements() throws Exception {
		JSONObject data = new JSONObject();
		try {
			data.put(numberElement.getShortName(), 7);
			data.put(heightElement.getShortName(), 5.8);
			data.put(captainElement.getShortName(), "False");
			data.put(genderElement.getShortName(), "M");
			data.put(dateJoinedElement.getShortName(), DateTimeUtil.toSqlDateString(new Date()));
			JSONArray titlesArray = new JSONArray();
			titlesArray.put("\"Player of the Series 1992\"");
			titlesArray.put("\"Olympics Gold Medal 1993\"");
			titlesArray.put("\"Captain of the Year 1994\"");
			titlesArray.put("\"Hatrick Championship Title Winning Streak 1993-1995\"");
			data.put(titlesElement.getShortName(), titlesArray);
		} catch (JSONException e) {
		}
		quidditchData.setData(data.toString());
		assertTrue(validationService.validateFormData(quidditchData, null));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ValidationServiceImpl#validateFormData(com.ihsinformatics.aahung.aagahi.model.FormData)}.
	 * @throws Exception 
	 */
	@Test
	public void shouldValidateFormDataWithEntityElements() throws Exception {
		JSONObject data = new JSONObject();
		try {
			data.put(schoolElement.getShortName(), hogwartz.getLocationId());
			data.put(houseElement.getShortName(), ravenclaw.getDefinitionId());
			data.put(broomstickElement.getShortName(), firebolt.getDefinitionId());
			data.put(refereeElement.getShortName(), dumbledore.getUserId());
		} catch (JSONException e) {
		}
		quidditchData.setData(data.toString());
		assertTrue(validationService.validateFormData(quidditchData, dataEntity));
	}
}
