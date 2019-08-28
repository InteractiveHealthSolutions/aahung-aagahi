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

import org.hibernate.HibernateException;
import org.springframework.stereotype.Service;

import com.ihsinformatics.aahung.aagahi.model.Definition;
import com.ihsinformatics.aahung.aagahi.model.DefinitionType;
import com.ihsinformatics.aahung.aagahi.model.Element;
import com.ihsinformatics.aahung.aagahi.model.FormData;
import com.ihsinformatics.aahung.aagahi.model.FormType;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.util.SearchCriteria;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Service
public interface FormService {

	/**
	 * @param definition
	 * @throws HibernateException
	 */
	void deleteDefinition(Definition definition) throws HibernateException;

	/**
	 * @param definitionType
	 * @throws HibernateException
	 */
	void deleteDefinitionType(DefinitionType definitionType) throws HibernateException;

	/**
	 * @param element
	 * @throws HibernateException
	 */
	void deleteElement(Element element) throws HibernateException;

	/**
	 * @param obj
	 * @throws HibernateException
	 */
	void deleteFormData(FormData obj) throws HibernateException;

	/**
	 * @param obj
	 * @throws HibernateException
	 */
	void deleteFormType(FormType obj) throws HibernateException;

	/**
	 * @param uuid
	 * @return
	 */
	Definition getDefinition(String uuid);

	/**
	 * @param shortName
	 * @return
	 */
	Definition getDefinitionByShortName(String shortName);

	/**
	 * @param definitionType
	 * @return
	 */
	List<Definition> getDefinitionsByDefinitionType(DefinitionType definitionType);

	/**
	 * @param name
	 * @return
	 */
	List<Definition> getDefinitionsByName(String name);

	/**
	 * @param uuid
	 * @return
	 */
	DefinitionType getDefinitionType(String uuid);

	/**
	 * @param shortName
	 * @return
	 */
	DefinitionType getDefinitionTypeByShortName(String shortName);

	/**
	 * @param name
	 * @return
	 */
	List<DefinitionType> getDefinitionTypesByName(String name);

	/**
	 * @param uuid
	 * @return
	 */
	Element getElement(String uuid);

	/**
	 * @param name
	 * @return
	 */
	Element getElementByShortName(String name);

	/**
	 * @return
	 */
	List<Element> getElements();

	/**
	 * @param name
	 * @return
	 */
	List<Element> getElementsByName(String name);

	/**
	 * Returns list of {@link FormData} objects by given date range
	 * 
	 * @param from: starting range of {@link Date} object
	 * @param to: ending range of {@link Date} object
	 * @param page: page number to retrieve
	 * @param pageSize: number of objects in the page
	 * @param sortByField: name of the field to sort the data by
	 * @param includeVoided: whether to include voided records or not
	 * @return
	 * @throws HibernateException
	 */
	List<FormData> getFormDataByDate(Date from, Date to, Integer page, Integer pageSize, String sortByField,
	        boolean includeVoided) throws HibernateException;

	/**
	 * Returns {@link FormData} object by matching given reference ID
	 * 
	 * @param referenceId
	 * @return
	 * @throws HibernateException
	 */
	FormData getFormDataByReferenceId(String referenceId) throws HibernateException;

	/**
	 * Returns {@link FormData} object by given UUID
	 * 
	 * @param uuid
	 * @return
	 * @throws HibernateException
	 */
	FormData getFormDataByUuid(String uuid) throws HibernateException;

	/**
	 * Returns {@link FormType} object matching given form name. This method first searches for both
	 * full name, then short name if not found
	 * 
	 * @param name
	 * @return
	 * @throws HibernateException
	 */
	FormType getFormTypeByName(String name) throws HibernateException;

	/* Fetch methods */
	/**
	 * Returns {@link FormType} object by given UUID
	 * 
	 * @param uuid
	 * @return
	 * @throws HibernateException
	 */
	FormType getFormTypeByUuid(String uuid) throws HibernateException;

	/**
	 * Returns list of all {@link FormType} objects
	 * 
	 * @param includeRetired
	 * @return
	 * @throws HibernateException
	 */
	List<FormType> getFormTypes(boolean includeRetired) throws HibernateException;

	void retireFormType(FormType obj) throws HibernateException;

	Definition saveDefinition(Definition definition);

	DefinitionType saveDefinitionType(DefinitionType definitionType);

	Element saveElement(Element element);

	FormData saveFormData(FormData obj) throws HibernateException;

	/* Save methods */
	FormType saveFormType(FormType obj) throws HibernateException;

	List<Element> searchElement(List<SearchCriteria> params);

	/**
	 * Returns list of {@link FormData} objects by matching all the non-null parameters
	 * 
	 * @param formType: the {@link FormType} object
	 * @param location: the {@link Location} object
	 * @param page: page number to retrieve
	 * @param pageSize: number of objects in the page
	 * @param sortByField: name of the field to sort the data by
	 * @param includeVoided: whether to include voided records or not
	 * @return
	 * @throws HibernateException
	 */
	List<FormData> searchFormData(FormType formType, Location location, Integer page, Integer pageSize, String sortByField,
	        boolean includeVoided) throws HibernateException;

	/**
	 * @param definition
	 * @return
	 */
	Definition updateDefinition(Definition definition);

	/**
	 * @param definitionType
	 * @return
	 */
	DefinitionType updateDefinitionType(DefinitionType definitionType);

	/**
	 * @param element
	 * @return
	 */
	Element updateElement(Element element);

	/**
	 * @param obj
	 * @return
	 * @throws HibernateException
	 */
	FormData updateFormData(FormData obj) throws HibernateException;

	/**
	 * @param obj
	 * @return
	 * @throws HibernateException
	 */
	FormType updateFormType(FormType obj) throws HibernateException;

	/**
	 * @param obj
	 * @throws HibernateException
	 */
	void voidFormData(FormData obj) throws HibernateException;
}
