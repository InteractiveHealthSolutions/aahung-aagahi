/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/
package com.ihsinformatics.aahung.aagahi.service;

import java.util.List;
import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.hibernate.HibernateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ihsinformatics.aahung.aagahi.model.Definition;
import com.ihsinformatics.aahung.aagahi.model.DefinitionType;
import com.ihsinformatics.aahung.aagahi.model.Element;
import com.ihsinformatics.aahung.aagahi.repository.DefinitionRepository;
import com.ihsinformatics.aahung.aagahi.repository.DefinitionTypeRepository;
import com.ihsinformatics.aahung.aagahi.repository.ElementRepository;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Component
public class MetadataServiceImpl implements MetadataService {

	@Autowired
	private ElementRepository elementRepository;

	@Autowired
	private DefinitionRepository definitionRepository;

	@Autowired
	private DefinitionTypeRepository definitionTypeRepository;

	@PersistenceContext
	private EntityManager entityManager;

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#deleteDefinition(com.ihsinformatics.aahung.aagahi.model.Definition)
	 */
	@Override
	public void deleteDefinition(Definition definition) throws HibernateException {
		definitionRepository.delete(definition);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#deleteDefinitionType(com.ihsinformatics.aahung.aagahi.model.DefinitionType)
	 */
	@Override
	public void deleteDefinitionType(DefinitionType definitionType) throws HibernateException {
		definitionTypeRepository.delete(definitionType);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#deleteElement(com.ihsinformatics.aahung.aagahi.model.Element)
	 */
	@Override
	public void deleteElement(Element element) {
		elementRepository.delete(element);

	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#getDefinitionById(java.lang.Integer)
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
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#getDefinitionByShortName(java.lang.String)
	 */
	@Override
	public Definition getDefinitionByShortName(String shortName) {
		return definitionRepository.findByShortName(shortName);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#getDefinitionByUuid(java.lang.String)
	 */
	@Override
	public Definition getDefinitionByUuid(String uuid) {
		return definitionRepository.findByUuid(uuid);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#getDefinitionsByDefinitionType(com.ihsinformatics.aahung.aagahi.model.DefinitionType)
	 */
	@Override
	public List<Definition> getDefinitionsByDefinitionType(DefinitionType definitionType) {
		return definitionRepository.findByDefinitionType(definitionType);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#getDefinitionsByName(java.lang.String)
	 */
	@Override
	public List<Definition> getDefinitionsByName(String name) {
		return definitionRepository.findByName(name);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#getDefinitionTypeById(java.lang.Integer)
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
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#getDefinitionTypeByShortName(java.lang.String)
	 */
	@Override
	public DefinitionType getDefinitionTypeByShortName(String shortName) {
		return definitionTypeRepository.findByShortName(shortName);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#getDefinitionTypeByUuid(java.lang.String)
	 */
	@Override
	public DefinitionType getDefinitionTypeByUuid(String uuid) {
		return definitionTypeRepository.findByUuid(uuid);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#getDefinitionTypesByName(java.lang.String)
	 */
	@Override
	public List<DefinitionType> getDefinitionTypesByName(String name) {
		return definitionTypeRepository.findByName(name);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#getElementById(java.lang.Integer)
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
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#getElementByShortName(java.lang.String)
	 */
	@Override
	public Element getElementByShortName(String name) {
		return elementRepository.findByShortName(name);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#getElementByUuid(java.lang.String)
	 */
	@Override
	public Element getElementByUuid(String uuid) {
		return elementRepository.findByUuid(uuid);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#getElements()
	 */
	@Override
	public List<Element> getElements() {
		return elementRepository.findAll();
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#getElementsByName(java.lang.String)
	 */
	@Override
	public List<Element> getElementsByName(String name) {
		return elementRepository.findByName(name);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#saveDefinition(com.ihsinformatics.aahung.aagahi.model.Definition)
	 */
	@Override
	public Definition saveDefinition(Definition definition) {
		return definitionRepository.save(definition);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#saveDefinitionType(com.ihsinformatics.aahung.aagahi.model.DefinitionType)
	 */
	@Override
	public DefinitionType saveDefinitionType(DefinitionType definitionType) {
		return definitionTypeRepository.save(definitionType);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#saveElement(com.ihsinformatics.aahung.aagahi.model.Element)
	 */
	@Override
	public Element saveElement(Element element) {
		return elementRepository.save(element);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#updateDefinition(com.ihsinformatics.aahung.aagahi.model.Definition)
	 */
	@Override
	public Definition updateDefinition(Definition definition) {
		return definitionRepository.save(definition);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#updateDefinitionType(com.ihsinformatics.aahung.aagahi.model.DefinitionType)
	 */
	@Override
	public DefinitionType updateDefinitionType(DefinitionType definitionType) {
		return definitionTypeRepository.save(definitionType);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.MetadataService#updateElement(com.ihsinformatics.aahung.aagahi.model.Element)
	 */
	@Override
	public Element updateElement(Element element) {
		return elementRepository.save(element);
	}
}
