/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/
package com.ihsinformatics.aahung.aagahi.service;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.validation.ValidationException;

import org.hibernate.HibernateException;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import com.ihsinformatics.aahung.aagahi.Context;
import com.ihsinformatics.aahung.aagahi.model.DataEntity;
import com.ihsinformatics.aahung.aagahi.model.FormData;
import com.ihsinformatics.aahung.aagahi.model.FormType;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.util.DateTimeUtil;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Component
public class FormServiceImpl extends BaseService implements FormService {

	@Autowired
	private ValidationService validationService;

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
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.FormService#getFormTypes(boolean)
	 */
	@Override
	public List<FormType> getAllFormTypes(boolean includeRetired) throws HibernateException {
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
	 * com.ihsinformatics.aahung.aagahi.service.FormService#getFormDataByDate(java.
	 * util.Date, java.util.Date, java.lang.Integer, java.lang.Integer,
	 * java.lang.String, boolean)
	 */
	@Override
	public List<FormData> getFormDataByDate(Date from, Date to, Integer page, Integer pageSize, String sortByField,
			boolean includeVoided) throws HibernateException {
		if (sortByField == null) {
			sortByField = "formDate";
		}
		Pageable pageable = PageRequest.of(page, pageSize, Sort.by(sortByField));
		Page<FormData> list = formDataRepository.findByDateRange(from, to, pageable);
		return list.getContent();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.FormService#getFormDataByLocation(
	 * com.ihsinformatics.aahung.aagahi.model.Location)
	 */
	@Override
	public List<FormData> getFormDataByLocation(Location location) throws HibernateException {
		return formDataRepository.findByLocation(location);
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
	 * @see com.ihsinformatics.aahung.aagahi.service.FormService#retireFormData(com.
	 * ihsinformatics.aahung.aagahi.model.FormType)
	 */
	@Override
	public void retireFormType(FormType obj) throws HibernateException {
		obj.setDateRetired(new Date());
		obj.setIsRetired(Boolean.TRUE);
		formTypeRepository.softDelete(obj);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.FormService#saveFormData(com.
	 * ihsinformatics.aahung.aagahi.model.FormData)
	 */
	@Override
	public FormData saveFormData(FormData obj) throws HibernateException, ValidationException, IOException {
		FormData found = formDataRepository.findByUuid(obj.getUuid());
		if (found != null) {
			throw new HibernateException("Make sure you are not trying to save duplicate FormData object!");
		}
		if (validationService.validateFormData(obj, new DataEntity())) {
			obj.setCreatedBy(Context.getCurrentUser());
			return formDataRepository.save(obj);
		}
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.FormService#saveFormType(com.
	 * ihsinformatics.aahung.aagahi.model.FormType)
	 */
	@Override
	public FormType saveFormType(FormType obj) throws HibernateException, ValidationException, JSONException {
		FormType found = formTypeRepository.findByUuid(obj.getUuid());
		if (found != null) {
			throw new HibernateException("Make sure you are not trying to save duplicate FormType object!");
		}
		if (validationService.validateFormType(obj)) {
			return formTypeRepository.save(obj);
		}
		return null;
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
	public List<FormData> searchFormData(FormType formType, Location location, Date from, Date to, Integer page, Integer pageSize,
			String sortByField, boolean includeVoided) throws HibernateException {
		Pageable pageable = PageRequest.of(page, pageSize, Sort.by(sortByField));
		FormData formData = FormData.builder().formType(formType).location(location).build();
		Page<FormData> list = formDataRepository.findAll(Example.of(formData), pageable);
		return list.getContent();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.FormService#unretireFormType(com.
	 * ihsinformatics.aahung.aagahi.model.FormType)
	 */
	@Override
	public void unretireFormType(FormType obj) throws HibernateException, ValidationException, JSONException {
		if (obj.getIsRetired()) {
			obj.setIsRetired(Boolean.FALSE);
			if (obj.getReasonRetired() == null) {
				obj.setReasonRetired("");
			}
			obj.setReasonRetired(obj.getReasonRetired() + "(Unretired on "
					+ DateTimeUtil.toSqlDateTimeString(obj.getDateRetired()) + ")");
			updateFormType(obj);
		}
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.FormService#unvoidFormData(com.
	 * ihsinformatics.aahung.aagahi.model.FormData)
	 */
	@Override
	public void unvoidFormData(FormData obj) throws HibernateException, ValidationException, IOException {
		if (obj.getIsVoided()) {
			obj.setIsVoided(Boolean.FALSE);
			if (obj.getReasonVoided() == null) {
				obj.setReasonVoided("");
			}
			obj.setReasonVoided(obj.getReasonVoided() + "(Unretired on "
					+ DateTimeUtil.toSqlDateTimeString(obj.getDateVoided()) + ")");
			updateFormData(obj);
		}
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.FormService#updateFormData(com.
	 * ihsinformatics.aahung.aagahi.model.FormData)
	 */
	@Override
	public FormData updateFormData(FormData obj) throws HibernateException, ValidationException, IOException {
		if (validationService.validateFormData(obj, new DataEntity())) {
			return formDataRepository.save(obj);
		}
		obj.setUpdatedBy(Context.getCurrentUser());
		obj.setDateUpdated(new Date());
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.FormService#updateFormType(com.
	 * ihsinformatics.aahung.aagahi.model.FormType)
	 */
	@Override
	public FormType updateFormType(FormType obj) throws HibernateException, ValidationException, JSONException {
		if (validationService.validateFormType(obj)) {
			return formTypeRepository.save(obj);
		}
		obj.setDateUpdated(new Date());
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.FormService#voidFormData(com.
	 * ihsinformatics.aahung.aagahi.model.FormData)
	 */
	@Override
	public void voidFormData(FormData obj) throws HibernateException {
		obj.setVoidedBy(Context.getCurrentUser());
		obj.setDateVoided(new Date());
		obj.setIsVoided(Boolean.TRUE);
		formDataRepository.softDelete(obj);
	}
}
