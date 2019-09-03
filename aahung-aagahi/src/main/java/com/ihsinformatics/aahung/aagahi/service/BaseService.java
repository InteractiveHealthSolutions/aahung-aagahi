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

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ihsinformatics.aahung.aagahi.model.BaseEntity;
import com.ihsinformatics.aahung.aagahi.model.DataEntity;
import com.ihsinformatics.aahung.aagahi.repository.DefinitionRepository;
import com.ihsinformatics.aahung.aagahi.repository.DefinitionTypeRepository;
import com.ihsinformatics.aahung.aagahi.repository.DonorRepository;
import com.ihsinformatics.aahung.aagahi.repository.ElementRepository;
import com.ihsinformatics.aahung.aagahi.repository.FormDataRepository;
import com.ihsinformatics.aahung.aagahi.repository.FormTypeRepository;
import com.ihsinformatics.aahung.aagahi.repository.LocationAttributeRepository;
import com.ihsinformatics.aahung.aagahi.repository.LocationAttributeTypeRepository;
import com.ihsinformatics.aahung.aagahi.repository.LocationRepository;
import com.ihsinformatics.aahung.aagahi.repository.ParticipantRepository;
import com.ihsinformatics.aahung.aagahi.repository.PersonRepository;
import com.ihsinformatics.aahung.aagahi.repository.PrivilegeRepository;
import com.ihsinformatics.aahung.aagahi.repository.ProjectRepository;
import com.ihsinformatics.aahung.aagahi.repository.RoleRepository;
import com.ihsinformatics.aahung.aagahi.repository.UserAttributeRepository;
import com.ihsinformatics.aahung.aagahi.repository.UserAttributeTypeRepository;
import com.ihsinformatics.aahung.aagahi.repository.UserRepository;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Service
public class BaseService {

	@Autowired
	protected DefinitionRepository definitionRepository;

	@Autowired
	protected DefinitionTypeRepository definitionTypeRepository;

	@Autowired
	protected DonorRepository donorRepository;

	@Autowired
	protected ElementRepository elementRepository;

	@Autowired
	protected FormDataRepository formDataRepository;

	@Autowired
	protected FormTypeRepository formTypeRepository;

	@Autowired
	protected LocationAttributeRepository locationAttributeRepository;

	@Autowired
	protected LocationAttributeTypeRepository locationAttributeTypeRepository;

	@Autowired
	protected LocationRepository locationRepository;

	@Autowired
	protected ParticipantRepository participantRepository;

	@Autowired
	protected PersonRepository personRepository;

	@Autowired
	protected PrivilegeRepository privilegeRepository;

	@Autowired
	protected ProjectRepository projectRepository;

	@Autowired
	protected RoleRepository roleRepository;

	@Autowired
	protected UserAttributeRepository userAttributeRepository;

	@Autowired
	protected UserAttributeTypeRepository userAttributeTypeRepository;

	@Autowired
	protected UserRepository userRepository;

	@Autowired
	private SecurityService securityService;

	@PersistenceContext
	protected EntityManager entityManager;

	/**
	 * @param obj
	 * @return
	 */
	protected BaseEntity setCreateAuditAttributes(BaseEntity obj) {
		if (obj instanceof DataEntity) {
			((DataEntity) obj).setCreatedBy(userRepository.findByUsername(securityService.getLoggedInUsername()));
		}
		return obj;
	}

	/**
	 * @param obj
	 * @return
	 */
	protected BaseEntity setUpdateAuditAttributes(BaseEntity obj) {
		if (obj instanceof DataEntity) {
			((DataEntity) obj).setUpdatedBy(userRepository.findByUsername(securityService.getLoggedInUsername()));
			((DataEntity) obj).setDateUpdated(new Date());
		}
		return obj;
	}
}