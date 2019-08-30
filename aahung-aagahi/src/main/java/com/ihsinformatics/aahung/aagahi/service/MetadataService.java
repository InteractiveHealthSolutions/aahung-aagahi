/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.service;

import java.io.Serializable;
import java.util.List;

import org.hibernate.HibernateException;
import org.springframework.stereotype.Service;

import com.ihsinformatics.aahung.aagahi.model.Definition;
import com.ihsinformatics.aahung.aagahi.model.DefinitionType;
import com.ihsinformatics.aahung.aagahi.model.Element;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Service
public interface MetadataService {

	/**
	 * Returns an object against given class and generated Id
	 * 
	 * @param clazz
	 * @param id
	 * @return
	 */
	Serializable getObjectById(Class<?> clazz, Integer id);

	/**
	 * Returns an object against given class and UUID
	 * 
	 * @param clazz
	 * @param uuid
	 * @return
	 */
	Serializable getObjectByUuid(Class<?> clazz, String uuid);

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
	 * Returns a {@link Definition} object by matching UUID
	 * 
	 * @param uuid
	 * @return
	 */
	Definition getDefinitionByUuid(String uuid);

	/**
	 * Returns a {@link Definition} object by generated Id
	 * 
	 * @param id
	 * @return
	 */
	Definition getDefinitionById(Integer id);

	/**
	 * Returns a {@link Definition} object by matching short name
	 * 
	 * @param shortName
	 * @return
	 */
	Definition getDefinitionByShortName(String shortName);

	/**
	 * Returns list of {@link Definition} objects by {@link DefinitionType}
	 * 
	 * @param definitionType
	 * @return
	 */
	List<Definition> getDefinitionsByDefinitionType(DefinitionType definitionType);

	/**
	 * Returns list of {@link Definition} objects by matching name
	 * 
	 * @param name
	 * @return
	 */
	List<Definition> getDefinitionsByName(String name);

	/**
	 * Returns {@link DefinitionType} object by matching UUID
	 * 
	 * @param uuid
	 * @return
	 */
	DefinitionType getDefinitionTypeByUuid(String uuid);

	/**
	 * Returns a {@link DefinitionType} object by generated Id
	 * 
	 * @param id
	 * @return
	 */
	DefinitionType getDefinitionTypeById(Integer id);

	/**
	 * Returns {@link DefinitionType} object by matching short name
	 * 
	 * @param shortName
	 * @return
	 */
	DefinitionType getDefinitionTypeByShortName(String shortName);

	/**
	 * Returns list of {@link DefinitionType} objects by matching name
	 * 
	 * @param name
	 * @return
	 */
	List<DefinitionType> getDefinitionTypesByName(String name);

	/**
	 * Returns {@link Element} object by matching UUID
	 * 
	 * @param uuid
	 * @return
	 */
	Element getElementByUuid(String uuid);

	/**
	 * Returns {@link Element} object by generated Id
	 * 
	 * @param uuid
	 * @return
	 */
	Element getElementById(Integer id);

	/**
	 * Returns {@link Element} object by matching short name
	 * 
	 * @param name
	 * @return
	 */
	Element getElementByShortName(String name);

	/**
	 * Returns list of all {@link Element} objects
	 * 
	 * @return
	 */
	List<Element> getElements();

	/**
	 * Returns list of all {@link Element} objects by matching name
	 * 
	 * @param name
	 * @return
	 */
	List<Element> getElementsByName(String name);

	/**
	 * @param definition
	 * @return
	 */
	Definition saveDefinition(Definition definition);

	/**
	 * @param definitionType
	 * @return
	 */
	DefinitionType saveDefinitionType(DefinitionType definitionType);

	/**
	 * @param element
	 * @return
	 */
	Element saveElement(Element element);

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

}
