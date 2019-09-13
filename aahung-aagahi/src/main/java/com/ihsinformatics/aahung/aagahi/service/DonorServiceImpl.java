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

import org.hibernate.HibernateException;
import org.springframework.stereotype.Component;

import com.ihsinformatics.aahung.aagahi.annotation.MeasureProcessingTime;
import com.ihsinformatics.aahung.aagahi.model.Donor;
import com.ihsinformatics.aahung.aagahi.model.Project;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Component
public class DonorServiceImpl extends BaseService implements DonorService {

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#deleteDonor(com.ihsinformatics.aahung.aagahi.model.Donor)
	 */
	@Override
	public void deleteDonor(Donor obj) throws HibernateException {
		if(!getProjectsByDonor(obj).isEmpty()) {
			throw new HibernateException(
			        "One or more Project objects depend on this Donor. Please delete the dependent objects first.");
		}
		donorRepository.delete(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#deleteProject(com.ihsinformatics.aahung.aagahi.model.Project)
	 */
	@Override
	public void deleteProject(Project obj) throws HibernateException {
		projectRepository.delete(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getAllDonors()
	 */
	@Override
	@MeasureProcessingTime
	public List<Donor> getAllDonors() {
		return donorRepository.findAll();
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getAllProjects()
	 */
	@Override
	@MeasureProcessingTime
	public List<Project> getAllProjects() {
		return projectRepository.findAll();
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getDonorById(java.lang.Integer)
	 */
	@Override
	public Donor getDonorById(Integer id) {
		Optional<Donor> found = donorRepository.findById(id);
		if (found.isPresent()) {
			return found.get();
		}
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getDonorByShortName(java.lang.String)
	 */
	@Override
	public Donor getDonorByShortName(String shortName) {
		return donorRepository.findByShortName(shortName);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getDonorByUuid(java.lang.String)
	 */
	@Override
	public Donor getDonorByUuid(String uuid) {
		return donorRepository.findByUuid(uuid);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getDonorsByName(java.lang.String)
	 */
	@Override
	public List<Donor> getDonorsByName(String name) {
		return donorRepository.findByDonorName(name);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getProjectById(java.lang.Integer)
	 */
	@Override
	public Project getProjectById(Integer id) {
		Optional<Project> found = projectRepository.findById(id);
		if (found.isPresent()) {
			return found.get();
		}
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getProjectByShortName(java.lang.String)
	 */
	@Override
	public Project getProjectByShortName(String shortName) {
		return projectRepository.findByShortName(shortName);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getProjectByUuid(java.lang.String)
	 */
	@Override
	public Project getProjectByUuid(String uuid) {
		return projectRepository.findByUuid(uuid);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getProjectsByDonor(com.ihsinformatics.aahung.aagahi.model.Donor)
	 */
	@Override
	public List<Project> getProjectsByDonor(Donor donor) {
		return projectRepository.findByDonor(donor);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getProjectsByName(java.lang.String)
	 */
	@Override
	public List<Project> getProjectsByName(String name) {
		return projectRepository.findByProjectName(name);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#saveDonor(com.ihsinformatics.aahung.aagahi.model.Donor)
	 */
	@Override
	@MeasureProcessingTime
	public Donor saveDonor(Donor obj) {
		if (getDonorByShortName(obj.getShortName()) != null) {
			throw new HibernateException("Make sure you are not trying to save duplicate Donor!");
		}
		obj = (Donor) setCreateAuditAttributes(obj);
		return donorRepository.save(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#saveProject(com.ihsinformatics.aahung.aagahi.model.Project)
	 */
	@Override
	@MeasureProcessingTime
	public Project saveProject(Project obj) {
		if (getProjectByShortName(obj.getShortName()) != null) {
			throw new HibernateException("Make sure you are not trying to save duplicate Project!");
		}
		obj = (Project) setCreateAuditAttributes(obj);
		return projectRepository.save(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#updateDonor(com.ihsinformatics.aahung.aagahi.model.Donor)
	 */
	@Override
	@MeasureProcessingTime
	public Donor updateDonor(Donor obj) {
		obj = (Donor) setUpdateAuditAttributes(obj);
		return donorRepository.save(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#updateProject(com.ihsinformatics.aahung.aagahi.model.Project)
	 */
	@Override
	public Project updateProject(Project obj) {
		obj = (Project) setUpdateAuditAttributes(obj);
		return projectRepository.save(obj);
	}
}
