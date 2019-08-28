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

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.hibernate.HibernateException;
import org.springframework.stereotype.Component;

import com.ihsinformatics.aahung.aagahi.model.Donor;
import com.ihsinformatics.aahung.aagahi.model.Project;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Component
public class DonorServiceImpl implements DonorService {

	@PersistenceContext
	private EntityManager entityManager;

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#saveDonor(com.ihsinformatics.aahung.aagahi.model.Donor)
	 */
	@Override
	public Donor saveDonor(Donor obj) {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#saveProject(com.ihsinformatics.aahung.aagahi.model.Project)
	 */
	@Override
	public Project saveProject(Project obj) {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#updateDonor(com.ihsinformatics.aahung.aagahi.model.Donor)
	 */
	@Override
	public Donor updateDonor(Donor obj) {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#updateProject(com.ihsinformatics.aahung.aagahi.model.Project)
	 */
	@Override
	public Project updateProject(Project obj) {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#deleteDonor(com.ihsinformatics.aahung.aagahi.model.Donor)
	 */
	@Override
	public void deleteDonor(Donor obj) throws HibernateException {
		// TODO Auto-generated method stub

	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#deleteProject(com.ihsinformatics.aahung.aagahi.model.Project)
	 */
	@Override
	public void deleteProject(Project obj) throws HibernateException {
		// TODO Auto-generated method stub

	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getAllDonors()
	 */
	@Override
	public List<Donor> getAllDonors() {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getDonorById(java.lang.Integer)
	 */
	@Override
	public Donor getDonorById(Integer id) {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getDonorByUuid(java.lang.String)
	 */
	@Override
	public Donor getDonorByUuid(String uuid) {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getDonorsByName(java.lang.String)
	 */
	@Override
	public List<Donor> getDonorsByName(String name) {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getDonorByShortName(java.lang.String)
	 */
	@Override
	public Donor getDonorByShortName(String shortName) {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getAllProjects()
	 */
	@Override
	public List<Project> getAllProjects() {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getProjectById(java.lang.Integer)
	 */
	@Override
	public Project getProjectById(Integer id) {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getProjectByUuid(java.lang.String)
	 */
	@Override
	public Project getProjectByUuid(String uuid) {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getProjectsByName(java.lang.String)
	 */
	@Override
	public List<Project> getProjectsByName(String name) {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getProjectsByDonor(com.ihsinformatics.aahung.aagahi.model.Donor)
	 */
	@Override
	public List<Project> getProjectsByDonor(Donor donor) {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getProjectByShortName(java.lang.String)
	 */
	@Override
	public Project getProjectByShortName(String shortName) {
		// TODO Auto-generated method stub
		return null;
	}

}
