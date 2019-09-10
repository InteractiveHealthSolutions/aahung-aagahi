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
import static org.junit.Assert.assertEquals;
/**
 * @author owais.hussain@ihsinformatics.com
 */
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.sql.Date;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import javax.validation.ValidationException;

import org.hamcrest.Matchers;
import org.hibernate.HibernateException;
import org.json.JSONException;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.ihsinformatics.aahung.aagahi.BaseServiceTest;
import com.ihsinformatics.aahung.aagahi.model.DataEntity;
import com.ihsinformatics.aahung.aagahi.model.FormData;
import com.ihsinformatics.aahung.aagahi.model.FormType;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.util.DateTimeUtil;

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

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#deleteFormData(com.ihsinformatics.aahung.aagahi.model.FormData)}.
	 */
	@Test
	public void shouldDeleteFormData() {
		doNothing().when(formDataRepository).delete(any(FormData.class));
		formService.deleteFormData(ronData);
		verify(formDataRepository, times(1)).delete(any(FormData.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#deleteFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 */
	@Test
	public void shouldDeleteFormType() {
		doNothing().when(formTypeRepository).delete(any(FormType.class));
		formService.deleteFormType(quidditchForm);
		verify(formTypeRepository, times(1)).delete(any(FormType.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#getFormDataByDate(java.util.Date, java.util.Date, java.lang.Integer, java.lang.Integer, java.lang.String, boolean)}.
	 */
	@Test
	@Ignore
	public void shouldGetFormDataByDate() {
		Page<FormData> values = new PageImpl<>(Arrays.asList(ronData, harryData));
		ArgumentCaptor<Pageable> pageCaptor = ArgumentCaptor.forClass(Pageable.class);
		when(formDataRepository.findByDateRange(any(Date.class), any(Date.class), pageCaptor.capture()))
				.thenReturn(values);
		List<FormData> list = formService.getFormDataByDate(ronData.getFormDate(), harryData.getFormDate(), 1, 1,
				"formDate", Boolean.TRUE);
		assertThat(list, Matchers.containsInAnyOrder(ronData, harryData));
		verify(formDataRepository, times(1)).findByDateRange(any(Date.class), any(Date.class), any(Pageable.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#getFormDataByReferenceId(java.lang.String)}.
	 */
	@Test
	public void shouldGetFormDataByReferenceId() {
		Optional<FormData> ronDataObj = Optional.of(ronData);
		when(formDataRepository.findByReference(any(String.class))).thenReturn(ronDataObj);
		assertEquals(formService.getFormDataByReferenceId(ronData.getReferenceId()), ronData);
		verify(formDataRepository, times(1)).findByReference(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#getFormDataByUuid(java.lang.String)}.
	 */
	@Test
	public void shouldGetFormDataByUuid() {
		when(formDataRepository.findByUuid(any(String.class))).thenReturn(ronData);
		assertEquals(formService.getFormDataByUuid(ronData.getUuid()), ronData);
		verify(formDataRepository, times(1)).findByUuid(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#getFormTypeByUuid(java.lang.String)}.
	 */
	@Test
	public void shouldGetFormTypeByUuid() {
		when(formTypeRepository.findByUuid(any(String.class))).thenReturn(quidditchForm);
		assertEquals(formService.getFormTypeByUuid(quidditchForm.getUuid()), quidditchForm);
		verify(formTypeRepository, times(1)).findByUuid(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#getAllFormTypes(boolean)}.
	 */
	@Test
	public void shouldGetFormTypes() {
		when(formTypeRepository.findAll()).thenReturn(Arrays.asList(quidditchForm));
		assertEquals(1, formService.getAllFormTypes(true).size());
		verify(formTypeRepository, times(1)).findAll();
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#retireFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 */
	@Test
	public void shouldRetireFormType() {
		doNothing().when(formTypeRepository).softDelete(any(FormType.class));
		formService.retireFormType(quidditchForm);
		verify(formTypeRepository, times(1)).softDelete(any(FormType.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#saveFormData(com.ihsinformatics.aahung.aagahi.model.FormData)}.
	 * 
	 * @throws IOException
	 * @throws ValidationException
	 * @throws HibernateException
	 */
	@Test
	public void shouldSaveFormData() throws HibernateException, ValidationException, IOException {
		when(formDataRepository.findByUuid(any(String.class))).thenReturn(null);
		doNothing().when(validationService).validateFormData(any(FormData.class), any(DataEntity.class));
		when(formDataRepository.save(any(FormData.class))).thenReturn(harryData);
		assertThat(formService.saveFormData(harryData), is(harryData));
		verify(formDataRepository, times(1)).findByUuid(any(String.class));
		verify(validationService, times(1)).validateFormData(any(FormData.class), any(DataEntity.class));
		verify(formDataRepository, times(1)).save(any(FormData.class));
		verifyNoMoreInteractions(formDataRepository);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#saveFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 * 
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
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#searchFormData(com.ihsinformatics.aahung.aagahi.model.FormType, com.ihsinformatics.aahung.aagahi.model.Location, java.lang.Integer, java.lang.Integer, java.lang.String, boolean)}.
	 */
	@Test
	@Ignore
	public void shouldSearchFormData() {
		ArgumentCaptor<Pageable> pageCaptor = ArgumentCaptor.forClass(Pageable.class);
		Page<FormData> values = new PageImpl<>(Arrays.asList(harryData, ronData));
		when(formDataRepository.search(any(FormType.class), any(Location.class), any(Date.class), any(Date.class),
				pageCaptor.capture())).thenReturn(values);
		assertThat(
				formService.searchFormData(quidditchForm, hogwartz, DateTimeUtil.create(1, 1, 1995),
						DateTimeUtil.create(31, 12, 1995), 1, 10, "formDate", true),
				Matchers.containsInAnyOrder(ronData, harryData));
		verify(formDataRepository, times(1)).search(any(FormType.class), any(Location.class), any(Date.class),
				any(Date.class), pageCaptor.capture());
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#updateFormData(com.ihsinformatics.aahung.aagahi.model.FormData)}.
	 * 
	 * @throws Exception
	 */
	@Test
	public void shouldUpdateFormData() throws HibernateException, ValidationException, IOException {
		doNothing().when(validationService).validateFormData(any(FormData.class), any(DataEntity.class));
		when(formDataRepository.save(any(FormData.class))).thenReturn(ronData);
		ronData = formService.updateFormData(ronData);
		assertNotNull(ronData.getDateUpdated());
		verify(validationService, times(1)).validateFormData(any(FormData.class), any(DataEntity.class));
		verify(formDataRepository, times(1)).save(any(FormData.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#updateFormType(com.ihsinformatics.aahung.aagahi.model.FormType)}.
	 * 
	 * @throws JSONException
	 * @throws ValidationException
	 * @throws HibernateException
	 */
	@Test
	public void shouldUpdateFormType() throws HibernateException, ValidationException, JSONException {
		when(validationService.validateFormType(any(FormType.class))).thenReturn(Boolean.TRUE);
		when(formTypeRepository.save(any(FormType.class))).thenReturn(quidditchForm);
		quidditchForm = formService.updateFormType(quidditchForm);
		assertNotNull(quidditchForm.getDateUpdated());
		verify(validationService, times(1)).validateFormType(any(FormType.class));
		verify(formTypeRepository, times(1)).save(any(FormType.class));
		verifyNoMoreInteractions(formDataRepository);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.FormServiceImpl#voidFormData(com.ihsinformatics.aahung.aagahi.model.FormData)}.
	 */
	@Test
	public void shouldVoidFormData() {
		doNothing().when(formDataRepository).softDelete(any(FormData.class));
		formService.voidFormData(ronData);
		verify(formDataRepository, times(1)).softDelete(any(FormData.class));
	}
}
