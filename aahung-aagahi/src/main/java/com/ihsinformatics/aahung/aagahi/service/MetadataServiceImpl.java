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
import java.util.Optional;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.HibernateException;
import org.springframework.stereotype.Component;

import com.ihsinformatics.aahung.aagahi.annotation.MeasureProcessingTime;
import com.ihsinformatics.aahung.aagahi.model.Definition;
import com.ihsinformatics.aahung.aagahi.model.DefinitionType;
import com.ihsinformatics.aahung.aagahi.model.Element;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Component
public class MetadataServiceImpl extends BaseService implements MetadataService {

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.MetadataService#deleteDefinition(com
	 * .ihsinformatics.aahung.aagahi.model.Definition)
	 */
	@Override
	public void deleteDefinition(Definition obj) throws HibernateException {
		definitionRepository.delete(obj);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.MetadataService#deleteDefinitionType
	 * (com.ihsinformatics.aahung.aagahi.model.DefinitionType)
	 */
	@Override
	public void deleteDefinitionType(DefinitionType obj) throws HibernateException {
		definitionTypeRepository.delete(obj);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.MetadataService#deleteElement(com.
	 * ihsinformatics.aahung.aagahi.model.Element)
	 */
	@Override
	public void deleteElement(Element obj) {
		elementRepository.delete(obj);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#getAllDefinitionTypes()
	 */
	@Override
	public List<DefinitionType> getAllDefinitionTypes() {
		return definitionTypeRepository.findAll();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#getElements()
	 */
	@Override
	public List<Element> getAllElements() {
		return elementRepository.findAll();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.MetadataService#getDefinitionById(
	 * java.lang.Integer)
	 */
	@Override
	public Definition getDefinitionById(Integer id) {
		Optional<Definition> found = definitionRepository.findById(id);
		if (found.isPresent()) {
			return found.get();
		}
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#
	 * getDefinitionByShortName(java.lang.String)
	 */
	@Override
	public Definition getDefinitionByShortName(String shortName) {
		return definitionRepository.findByShortName(shortName);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.MetadataService#getDefinitionByUuid(
	 * java.lang.String)
	 */
	@Override
	public Definition getDefinitionByUuid(String uuid) {
		return definitionRepository.findByUuid(uuid);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#
	 * getDefinitionsByDefinitionType(com.ihsinformatics.aahung.aagahi.model.
	 * DefinitionType)
	 */
	@Override
	public List<Definition> getDefinitionsByDefinitionType(DefinitionType definitionType) {
		return definitionRepository.findByDefinitionType(definitionType);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.MetadataService#getDefinitionsByName
	 * (java.lang.String)
	 */
	@Override
	public List<Definition> getDefinitionsByName(String name) {
		return definitionRepository.findByName(name);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#
	 * getDefinitionTypeById(java.lang.Integer)
	 */
	@Override
	public DefinitionType getDefinitionTypeById(Integer id) {
		Optional<DefinitionType> found = definitionTypeRepository.findById(id);
		if (found.isPresent()) {
			return found.get();
		}
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#
	 * getDefinitionTypeByShortName(java.lang.String)
	 */
	@Override
	public DefinitionType getDefinitionTypeByShortName(String shortName) {
		return definitionTypeRepository.findByShortName(shortName);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#
	 * getDefinitionTypeByUuid(java.lang.String)
	 */
	@Override
	public DefinitionType getDefinitionTypeByUuid(String uuid) {
		return definitionTypeRepository.findByUuid(uuid);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#
	 * getDefinitionTypesByName(java.lang.String)
	 */
	@Override
	public List<DefinitionType> getDefinitionTypesByName(String name) {
		return definitionTypeRepository.findByName(name);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.MetadataService#getElementById(java.
	 * lang.Integer)
	 */
	@Override
	public Element getElementById(Integer id) {
		Optional<Element> found = elementRepository.findById(id);
		if (found.isPresent()) {
			return found.get();
		}
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#
	 * getElementByShortName(java.lang.String)
	 */
	@Override
	public Element getElementByShortName(String name) {
		return elementRepository.findByShortName(name);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.MetadataService#getElementByUuid(
	 * java.lang.String)
	 */
	@Override
	public Element getElementByUuid(String uuid) {
		return elementRepository.findByUuid(uuid);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.MetadataService#getElementsByName(
	 * java.lang.String)
	 */
	@Override
	public List<Element> getElementsByName(String name) {
		return elementRepository.findByName(name);
	}

	/**
	 * Returns a {@link Serializable} object by class name and generated Id
	 * @param className
	 * @param id
	 * @return
	 * @throws ClassNotFoundException
	 */
	public Serializable getObjectById(String className, Integer id) throws ClassNotFoundException {
		return getObjectById(Class.forName(className), id);
	}
	
	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.MetadataService#getObjectById(java.
	 * lang.Class, java.lang.Integer)
	 */
	@Override
	public Serializable getObjectById(Class<?> clazz, Integer id) {
		return (Serializable) getEntityManager().find(clazz, id);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.MetadataService#getObjectByUuid(java
	 * .lang.Class, java.lang.String)
	 */
	public Serializable getObjectByUuid(Class<?> clazz, String uuid) {
		CriteriaBuilder criteriaBuilder = getEntityManager().getCriteriaBuilder();
		CriteriaQuery<?> criteriaQuery = criteriaBuilder.createQuery(clazz);
		Root<?> root = criteriaQuery.from(clazz);
		criteriaQuery.where(criteriaBuilder.equal(root.get("uuid"), uuid));
		TypedQuery<?> query = getEntityManager().createQuery(criteriaQuery);
		return (Serializable) query.getSingleResult();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.MetadataService#saveDefinition(com.
	 * ihsinformatics.aahung.aagahi.model.Definition)
	 */
	@Override
	public Definition saveDefinition(Definition obj) {
		obj = (Definition) setCreateAuditAttributes(obj);
		return definitionRepository.save(obj);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.MetadataService#saveDefinitionType(
	 * com.ihsinformatics.aahung.aagahi.model.DefinitionType)
	 */
	@Override
	public DefinitionType saveDefinitionType(DefinitionType obj) {
		obj = (DefinitionType) setCreateAuditAttributes(obj);
		return definitionTypeRepository.save(obj);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.MetadataService#saveElement(com.
	 * ihsinformatics.aahung.aagahi.model.Element)
	 */
	@Override
	public Element saveElement(Element obj) {
		obj = (Element) setCreateAuditAttributes(obj);
		return elementRepository.save(obj);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.MetadataService#updateDefinition(com
	 * .ihsinformatics.aahung.aagahi.model.Definition)
	 */
	@Override
	public Definition updateDefinition(Definition obj) {
		obj = (Definition) setUpdateAuditAttributes(obj);
		return definitionRepository.save(obj);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.MetadataService#updateDefinitionType
	 * (com.ihsinformatics.aahung.aagahi.model.DefinitionType)
	 */
	@Override
	public DefinitionType updateDefinitionType(DefinitionType obj) {
		obj = (DefinitionType) setUpdateAuditAttributes(obj);
		return definitionTypeRepository.save(obj);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.ihsinformatics.aahung.aagahi.service.MetadataService#updateElement(com.
	 * ihsinformatics.aahung.aagahi.model.Element)
	 */
	@Override
	public Element updateElement(Element obj) {
		obj = (Element) setUpdateAuditAttributes(obj);
		return elementRepository.save(obj);
	}
}
