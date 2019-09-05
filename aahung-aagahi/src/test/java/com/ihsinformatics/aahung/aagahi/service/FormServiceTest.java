/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/
package com.ihsinformatics.aahung.aagahi.service;

import static org.hamcrest.CoreMatchers.is;
/**
 * @author owais.hussain@ihsinformatics.com
 */
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.io.IOException;

import javax.validation.ValidationException;

import org.hibernate.HibernateException;
import org.json.JSONException;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;

import com.ihsinformatics.aahung.aagahi.BaseServiceTest;
import com.ihsinformatics.aahung.aagahi.model.DataEntity;
import com.ihsinformatics.aahung.aagahi.model.FormData;
import com.ihsinformatics.aahung.aagahi.model.FormType;
import com.ihsinformatics.aahung.aagahi.model.Location;

/**
 * @author owais.hussain@ihsinformatics.com
 *
 */
public class FormServiceTest extends BaseServiceTest {
	
	@Mock
	protected ValidationServiceImpl validationService;

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
		super.reset();
	}
	
	@Test
	public void shouldReturnAnObject() {
		FormType formType = mock(FormType.class);
		assertNotNull(formType);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#saveFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 * @throws JSONException 
	 * @throws ValidationException 
	 * @throws HibernateException 
	 */
	@Test
	public void shouldSaveFormType() throws HibernateException, ValidationException, JSONException {
		when(formTypeRepository.findByUuid(any(String.class))).thenReturn(null);
		when(validationService.validateFormType(any(FormType.class))).thenReturn(Boolean.TRUE);
		when(formTypeRepository.save(any(FormType.class))).thenReturn(quidditchForm);
		assertThat(formService.saveFormType(quidditchForm), is(quidditchForm));
		verify(formTypeRepository, times(1)).findByUuid(any(String.class));
		verify(validationService, times(1)).validateFormType(any(FormType.class));
		verify(formTypeRepository, times(1)).save(any(FormType.class));
		verifyNoMoreInteractions(formTypeRepository);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#saveFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 * @throws JSONException 
	 * @throws ValidationException 
	 * @throws HibernateException 
	 */
	@Test(expected = ValidationException.class)
	public void shouldNotSaveFormTypeWithoutSchema() throws HibernateException, ValidationException, JSONException {
		when(validationService.validateFormType(any(FormType.class))).thenCallRealMethod();
		quidditchForm.setFormSchema(null);
		formService.saveFormType(quidditchForm);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#saveFormData(com.ihsinformatics.aahung.aagahi.model.FormData)}.
	 * @throws IOException 
	 * @throws ValidationException 
	 * @throws HibernateException 
	 */
	@Test
	public void shouldSaveFormData() throws HibernateException, ValidationException, IOException {
		when(formDataRepository.findByUuid(any(String.class))).thenReturn(null);
		when(validationService.validateFormData(any(FormData.class), any(DataEntity.class))).thenReturn(Boolean.TRUE);
		when(formDataRepository.save(any(FormData.class))).thenReturn(harryData);
		assertThat(formService.saveFormData(harryData), is(harryData));
		verify(formDataRepository, times(1)).findByUuid(any(String.class));
		verify(validationService, times(1)).validateFormData(any(FormData.class), any(DataEntity.class));
		verify(formDataRepository, times(1)).save(any(FormData.class));
		verifyNoMoreInteractions(formDataRepository);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#updateFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 * @throws JSONException 
	 * @throws ValidationException 
	 * @throws HibernateException 
	 */
	@Test
	public void shouldUpdateFormType() throws HibernateException, ValidationException, JSONException {
		when(formDataRepository.findByUuid(any(String.class))).thenReturn(null);
		when(validationService.validateFormType(any(FormType.class))).thenReturn(Boolean.TRUE);
		when(formTypeRepository.save(any(FormType.class))).thenReturn(quidditchForm);
		quidditchForm = formService.updateFormType(quidditchForm);
		assertNotNull(quidditchForm.getDateUpdated());
		verify(formTypeRepository, times(1)).findByUuid(any(String.class));
		verify(validationService, times(1)).validateFormType(any(FormType.class));
		verify(formTypeRepository, times(1)).save(any(FormType.class));
		verifyNoMoreInteractions(formDataRepository);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#updateFormData(com.ihsinformatics.aahung.aagahi.model.FormData)}.
	 */
	@Test
	public void shouldUpdateFormData() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#retireFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 */
	@Test
	public void shouldRetireFormType() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#voidFormData(com.ihsinformatics.aahung.aagahi.model.FormData)}.
	 */
	@Test
	public void shouldVoidFormData() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#deleteFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 */
	@Test
	public void shouldDeleteFormType() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#deleteFormData(com.ihsinformatics.aahung.aagahi.model.FormData)}.
	 */
	@Test
	public void shouldDeleteFormData() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#getFormTypeByUuid(java.lang.String)}.
	 */
	@Test
	public void shouldGetFormTypeByUuid() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#getFormTypeByName(java.lang.String)}.
	 */
	@Test
	public void shouldGetFormTypeByName() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#getAllFormTypes(boolean)}.
	 */
	@Test
	public void shouldGetFormTypes() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#getFormDataByUuid(java.lang.String)}.
	 */
	@Test
	public void shouldGetFormDataByUuid() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#getFormDataByReferenceId(java.lang.String)}.
	 */
	@Test
	public void shouldGetFormDataByReferenceId() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#getFormDataByDate(java.util.Date, java.util.Date, java.lang.Integer, java.lang.Integer, java.lang.String, boolean)}.
	 */
	@Test
	public void shouldGetFormDataByDate() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#searchFormData(com.ihsinformatics.aahung.aagahi.model.FormType, com.ihsinformatics.aahung.aagahi.model.Location, java.lang.Integer, java.lang.Integer, java.lang.String, boolean)}.
	 */
	@Test
	public void shouldSearchFormData() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#validateFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 */
	@Test
	public void shouldValidateFormType() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#validateFormData(com.ihsinformatics.aahung.aagahi.model.FormData)}.
	 */
	@Test
	public void shouldValidateFormData() {
		fail("Not yet implemented");
	}

}
