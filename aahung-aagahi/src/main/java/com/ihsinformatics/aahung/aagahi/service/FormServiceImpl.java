/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/
package com.ihsinformatics.aahung.aagahi.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.validation.ValidationException;

import org.hibernate.HibernateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import com.ihsinformatics.aahung.aagahi.model.FormData;
import com.ihsinformatics.aahung.aagahi.model.FormType;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.repository.FormDataRepository;
import com.ihsinformatics.aahung.aagahi.repository.FormTypeRepository;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Component
public class FormServiceImpl implements FormService {

	@Autowired
	private FormTypeRepository formTypeRepository;

	@Autowired
	private FormDataRepository formDataRepository;

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.FormService#saveFormType(com.
	 * ihsinformatics.aahung.aagahi.model.FormType)
	 */
	@Override
	public FormType saveFormType(FormType obj) throws HibernateException {
		FormType found = formTypeRepository.findByUuid(obj.getUuid());
		if (found != null) {
			throw new HibernateException("Trying to save duplicate FormType object!");
		}
		return updateFormType(obj);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.FormService#saveFormData(com.
	 * ihsinformatics.aahung.aagahi.model.FormData)
	 */
	@Override
	public FormData saveFormData(FormData obj) throws HibernateException {
		FormData found = formDataRepository.findByUuid(obj.getUuid());
		if (found != null) {
			throw new HibernateException("Trying to save duplicate FormData object!");
		}
		return updateFormData(obj);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.FormService#updateFormType(com.
	 * ihsinformatics.aahung.aagahi.model.FormType)
	 */
	@Override
	public FormType updateFormType(FormType obj) throws HibernateException {
		if (validateFormType(obj)) {
			return formTypeRepository.save(obj);
		}
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.FormService#updateFormData(com.
	 * ihsinformatics.aahung.aagahi.model.FormData)
	 */
	@Override
	public FormData updateFormData(FormData obj) throws HibernateException {
		if (validateFormData(obj)) {
			return formDataRepository.save(obj);
		}
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.FormService#retireFormData(com.
	 * ihsinformatics.aahung.aagahi.model.FormType)
	 */
	@Override
	public void retireFormType(FormType obj) throws HibernateException {
		formTypeRepository.softDelete(obj);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.FormService#voidFormData(com.
	 * ihsinformatics.aahung.aagahi.model.FormData)
	 */
	@Override
	public void voidFormData(FormData obj) throws HibernateException {
		formDataRepository.softDelete(obj);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.FormService#deleteFormType(com.
	 * ihsinformatics.aahung.aagahi.model.FormType)
	 */
	@Override
	public void deleteFormType(FormType obj) throws HibernateException {
		formTypeRepository.delete(obj);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.FormService#deleteFormData(com.
	 * ihsinformatics.aahung.aagahi.model.FormData)
	 */
	@Override
	public void deleteFormData(FormData obj) throws HibernateException {
		formDataRepository.delete(obj);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.FormService#getFormTypeByUuid(java.
	 * lang.String)
	 */
	@Override
	public FormType getFormTypeByUuid(String uuid) throws HibernateException {
		return formTypeRepository.findByUuid(uuid);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.FormService#getFormTypeByName(java.
	 * lang.String)
	 */
	@Override
	public FormType getFormTypeByName(String name) throws HibernateException {
		FormType found = formTypeRepository.findByFormName(name);
		if (found == null) {
			found = formTypeRepository.findByShortName(name);
		}
		return found;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.FormService#getFormTypes(boolean)
	 */
	@Override
	public List<FormType> getFormTypes(boolean includeRetired) throws HibernateException {
		List<FormType> formTypes = formTypeRepository.findAll();
		if (!includeRetired) {
			for (FormType formType : formTypes) {
				if (formType.getIsRetired()) {
					formTypes.remove(formType);
				}
			}
		}
		return formTypes;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.FormService#getFormDataByUuid(java.
	 * lang.String)
	 */
	@Override
	public FormData getFormDataByUuid(String uuid) throws HibernateException {
		return formDataRepository.findByUuid(uuid);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.FormService#getFormDataByReferenceId
	 * (java.lang.String)
	 */
	@Override
	public FormData getFormDataByReferenceId(String referenceId) throws HibernateException {
		Optional<FormData> found = formDataRepository.findByReference(referenceId);
		if (found.isPresent()) {
			return found.get();
		}
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.FormService#getFormDataByDate(java.
	 * util.Date, java.util.Date, java.lang.Integer, java.lang.Integer,
	 * java.lang.String, boolean)
	 */
	@Override
	public List<FormData> getFormDataByDate(Date from, Date to, Integer page, Integer pageSize, String sortByField,
			boolean includeVoided) throws HibernateException {
		Pageable pageable = PageRequest.of(page, pageSize, Sort.by(sortByField));
		Page<FormData> list = formDataRepository.findByDateRange(from, to, pageable);
		return list.getContent();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.FormService#searchFormData(com.
	 * ihsinformatics.aahung.aagahi.model.FormType,
	 * com.ihsinformatics.aahung.aagahi.model.Location, java.lang.Integer,
	 * java.lang.Integer, java.lang.String, boolean)
	 */
	@Override
	public List<FormData> searchFormData(FormType formType, Location location, Integer page, Integer pageSize,
			String sortByField, boolean includeVoided) throws HibernateException {
		Pageable pageable = PageRequest.of(page, pageSize, Sort.by(sortByField));
		FormData formData = FormData.builder().formType(formType).location(location).build();
		Page<FormData> list = formDataRepository.findAll(Example.of(formData), pageable);
		return list.getContent();
	}

	/**
	 * Validates the JSON schema in given {@link FormType} object
	 * 
	 * @param formType
	 * @return
	 * @throws HibernateException
	 * @throws ValidationException
	 */
	private boolean validateFormType(FormType formType) throws HibernateException, ValidationException {
		// TODO: Complete validation
		return true;
	}

	/**
	 * Validates the JSON schema in given {@link FormData} object
	 * 
	 * @param formData
	 * @return
	 * @throws HibernateException
	 * @throws ValidationException
	 */
	private boolean validateFormData(FormData formData) throws HibernateException, ValidationException {
		// TODO: Complete validation
		return true;
	}
}
