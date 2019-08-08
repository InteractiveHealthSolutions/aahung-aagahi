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
	

	/* Save methods */
	FormType saveFormType(FormType obj) throws HibernateException;

	FormData saveFormData(FormData obj) throws HibernateException;
	
	Element saveElement(Element element);
	
	Definition saveDefinition(Definition definition);
	
	DefinitionType saveDefinitionType(DefinitionType definitionType);

	/* Update methods */
	FormType updateFormType(FormType obj) throws HibernateException;

	FormData updateFormData(FormData obj) throws HibernateException;

	void retireFormType(FormType obj) throws HibernateException;

	void voidFormData(FormData obj) throws HibernateException;
	
	Element updateElement(Element element);
	
	Definition updateDefinition(Definition definition);
	
	DefinitionType updateDefinitionType(DefinitionType definitionType);


	/* Delete methods */
	void deleteFormType(FormType obj) throws HibernateException;

	void deleteFormData(FormData obj) throws HibernateException;
	
	void deleteElement(Element element) throws HibernateException;
	
	void deleteDefinition(Definition definition) throws HibernateException;

	void deleteDefinitionType(DefinitionType definitionType) throws HibernateException;

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
	 * Returns {@link FormType} object matching given form name. This method first
	 * searches for both full name, then short name if not found
	 * 
	 * @param name
	 * @return
	 * @throws HibernateException
	 */
	FormType getFormTypeByName(String name) throws HibernateException;

	/**
	 * Returns list of all {@link FormType} objects
	 * 
	 * @param includeRetired
	 * @return
	 * @throws HibernateException
	 */
	List<FormType> getFormTypes(boolean includeRetired) throws HibernateException;

	/**
	 * Returns {@link FormData} object by given UUID
	 * 
	 * @param uuid
	 * @return
	 * @throws HibernateException
	 */
	FormData getFormDataByUuid(String uuid) throws HibernateException;

	/**
	 * Returns {@link FormData} object by matching given reference ID
	 * 
	 * @param referenceId
	 * @return
	 * @throws HibernateException
	 */
	FormData getFormDataByReferenceId(String referenceId) throws HibernateException;

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
	 * Returns list of {@link FormData} objects by matching all the non-null
	 * parameters
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
	List<FormData> searchFormData(FormType formType, Location location, Integer page, Integer pageSize,
			String sortByField, boolean includeVoided) throws HibernateException;
	
	Element getElement(String uuid);
	
	List<Element> getElements();
	
	List<Element> getElementsByName(String name);
	
	Element getElementByShortName(String name);
	
	Definition getDefinition(String uuid);
	
	DefinitionType getDefinitionType(String uuid);
	
	List<Definition> getDefinitionsByName(String name);
	
	List<DefinitionType> getDefinitionTypesByName(String name);
	
	Definition getDefinitionByShortName(String shortName);
	
	DefinitionType getDefinitionTypeByShortName(String shortName);
	
	List<Definition> getDefinitionsByDefinitionType(DefinitionType definitionType);
	
	List<Element> searchElement(List<SearchCriteria> params);

}
