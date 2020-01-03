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
import java.util.List;
import java.util.Optional;

import javax.validation.ValidationException;

import org.hibernate.HibernateException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.ihsinformatics.aahung.aagahi.annotation.CheckPrivilege;
import com.ihsinformatics.aahung.aagahi.annotation.MeasureProcessingTime;
import com.ihsinformatics.aahung.aagahi.model.Donor;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.Project;
import com.ihsinformatics.aahung.aagahi.model.UserAttribute;
import com.ihsinformatics.aahung.aagahi.util.DateTimeUtil;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Component
public class DonorServiceImpl extends BaseService implements DonorService {

    /*
     * (non-Javadoc)
     * 
     * @see com.ihsinformatics.aahung.aagahi.service.DonorService#deleteDonor(com.
     * ihsinformatics.aahung.aagahi.model.Donor)
     */
    @Override
    @CheckPrivilege(privilege = "Delete Donor")
    public void deleteDonor(Donor obj) throws HibernateException {
	if (!getProjectsByDonor(obj).isEmpty()) {
	    throw new HibernateException(
		    "One or more Project objects depend on this Donor. Please delete the dependent objects first.");
	}
	donorRepository.delete(obj);
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.ihsinformatics.aahung.aagahi.service.DonorService#deleteProject(com.
     * ihsinformatics.aahung.aagahi.model.Project)
     */
    @Override
    @CheckPrivilege(privilege = "Delete Project")
    public void deleteProject(Project obj) throws HibernateException {
	projectRepository.delete(obj);
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getAllDonors()
     */
    @Override
    @MeasureProcessingTime
    @CheckPrivilege(privilege = "View Donor")
    public List<Donor> getAllDonors() {
	return donorRepository.findAll();
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.ihsinformatics.aahung.aagahi.service.DonorService#getAllProjects()
     */
    @Override
    @MeasureProcessingTime
    @CheckPrivilege(privilege = "View Project")
    public List<Project> getAllProjects() {
	return projectRepository.findAll();
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.ihsinformatics.aahung.aagahi.service.DonorService#getDonorById(java.lang.
     * Integer)
     */
    @Override
    @CheckPrivilege(privilege = "View Donor")
    public Donor getDonorById(Integer id) {
	Optional<Donor> found = donorRepository.findById(id);
	if (found.isPresent()) {
	    return found.get();
	}
	return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.ihsinformatics.aahung.aagahi.service.DonorService#getDonorByShortName(
     * java.lang.String)
     */
    @Override
    @CheckPrivilege(privilege = "View Donor")
    public Donor getDonorByShortName(String shortName) {
	return donorRepository.findByShortName(shortName);
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.ihsinformatics.aahung.aagahi.service.DonorService#getDonorByUuid(java.
     * lang.String)
     */
    @Override
    @CheckPrivilege(privilege = "View Donor")
    public Donor getDonorByUuid(String uuid) {
	return donorRepository.findByUuid(uuid);
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.ihsinformatics.aahung.aagahi.service.DonorService#getDonorsByName(java.
     * lang.String)
     */
    @Override
    @CheckPrivilege(privilege = "View Donor")
    public List<Donor> getDonorsByName(String name) {
	return donorRepository.findByDonorName(name);
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.ihsinformatics.aahung.aagahi.service.DonorService#getProjectById(java.
     * lang.Integer)
     */
    @Override
    @CheckPrivilege(privilege = "View Project")
    public Project getProjectById(Integer id) {
	Optional<Project> found = projectRepository.findById(id);
	if (found.isPresent()) {
	    return found.get();
	}
	return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.ihsinformatics.aahung.aagahi.service.DonorService#getProjectByShortName(
     * java.lang.String)
     */
    @Override
    @CheckPrivilege(privilege = "View Project")
    public Project getProjectByShortName(String shortName) {
	return projectRepository.findByShortName(shortName);
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.ihsinformatics.aahung.aagahi.service.DonorService#getProjectByUuid(java.
     * lang.String)
     */
    @Override
    @CheckPrivilege(privilege = "View Project")
    public Project getProjectByUuid(String uuid) {
	return projectRepository.findByUuid(uuid);
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.ihsinformatics.aahung.aagahi.service.DonorService#getProjectsByDonor(com.
     * ihsinformatics.aahung.aagahi.model.Donor)
     */
    @Override
    @CheckPrivilege(privilege = "View Project")
    public List<Project> getProjectsByDonor(Donor donor) {
	return projectRepository.findByDonor(donor);
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.ihsinformatics.aahung.aagahi.service.DonorService#getProjectsByName(java.
     * lang.String)
     */
    @Override
    @CheckPrivilege(privilege = "View Project")
    public List<Project> getProjectsByName(String name) {
	return projectRepository.findByProjectName(name);
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.ihsinformatics.aahung.aagahi.service.DonorService#saveDonor(com.
     * ihsinformatics.aahung.aagahi.model.Donor)
     */
    @Override
    @MeasureProcessingTime
    @CheckPrivilege(privilege = "Add Donor")
    public Donor saveDonor(Donor obj) {
	if (getDonorByShortName(obj.getShortName()) != null) {
	    throw new HibernateException("Make sure you are not trying to save duplicate Donor!");
	}
	obj = (Donor) setCreateAuditAttributes(obj);
	return donorRepository.save(obj);
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.ihsinformatics.aahung.aagahi.service.DonorService#saveProject(com.
     * ihsinformatics.aahung.aagahi.model.Project)
     */
    @Override
    @MeasureProcessingTime
    @CheckPrivilege(privilege = "Add Project")
    public Project saveProject(Project obj) {
	if (getProjectByShortName(obj.getShortName()) != null) {
	    throw new HibernateException("Make sure you are not trying to save duplicate Project!");
	}
	obj = (Project) setCreateAuditAttributes(obj);
	return projectRepository.save(obj);
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.ihsinformatics.aahung.aagahi.service.DonorService#updateDonor(com.
     * ihsinformatics.aahung.aagahi.model.Donor)
     */
    @Override
    @MeasureProcessingTime
    @CheckPrivilege(privilege = "Edit Donor")
    public Donor updateDonor(Donor obj) {
	obj = (Donor) setUpdateAuditAttributes(obj);
	return donorRepository.save(obj);
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.ihsinformatics.aahung.aagahi.service.DonorService#updateProject(com.
     * ihsinformatics.aahung.aagahi.model.Project)
     */
    @Override
    @CheckPrivilege(privilege = "Edit Project")
    public Project updateProject(Project obj) {
	obj = (Project) setUpdateAuditAttributes(obj);
	return projectRepository.save(obj);
    }
    
    /*
     * (non-Javadoc)
     * 
     * @see com.ihsinformatics.aahung.aagahi.service.FormService#voidProject(com.
     * ihsinformatics.aahung.aagahi.model.Project)
     */
    @Override
    @CheckPrivilege(privilege = "Void Project")
    @Transactional
    public void voidProject(Project obj) throws HibernateException {
	obj = (Project) setSoftDeleteAuditAttributes(obj);
	obj.setIsVoided(Boolean.TRUE);
	projectRepository.softDelete(obj);
    }
    
    /*
     * (non-Javadoc)
     * 
     * @see com.ihsinformatics.aahung.aagahi.service.FormService#unvoidProject(com.
     * ihsinformatics.aahung.aagahi.model.Project)
     */
    @Override
    @CheckPrivilege(privilege = "Void Project")
    @Transactional
    public void unvoidProject(Project obj) throws HibernateException, ValidationException, IOException {
	if (obj.getIsVoided()) {
	    obj.setIsVoided(Boolean.FALSE);
	    if (obj.getReasonVoided() == null) {
		obj.setReasonVoided("");
	    }
	    obj.setReasonVoided(obj.getReasonVoided() + "(Unvoided on "
		    + DateTimeUtil.toSqlDateTimeString(obj.getDateVoided()) + ")");
	    updateProject(obj);
	}
    }
    
    /*
     * (non-Javadoc)
     * 
     * @see com.ihsinformatics.aahung.aagahi.service.FormService#voidDonor(com.
     * ihsinformatics.aahung.aagahi.model.Donor)
     */
    @Override
    @CheckPrivilege(privilege = "Void Donor")
    @Transactional
    public void voidDonor(Donor obj) throws HibernateException {
	obj = (Donor) setSoftDeleteAuditAttributes(obj);
	obj.setIsVoided(Boolean.TRUE);
	
	List<Project> projects = projectRepository.findByDonor(obj);
	for(Project project: projects){
		if(Boolean.FALSE.equals(project.getIsVoided())){
			project.setIsVoided(Boolean.TRUE);
			project.setVoidedBy(obj.getVoidedBy());
			project.setDateVoided(obj.getDateVoided());
			project.setReasonVoided(obj.getReasonVoided() + " (Donor voided)");
			projectRepository.softDelete(project);
		}
	}
	
	donorRepository.softDelete(obj);
    }
    
    /*
     * (non-Javadoc)
     * 
     * @see com.ihsinformatics.aahung.aagahi.service.FormService#unvoidDonor(com.
     * ihsinformatics.aahung.aagahi.model.Donor)
     */
    @Override
    @CheckPrivilege(privilege = "Void Donor")
    @Transactional
    public void unvoidDonor(Donor obj) throws HibernateException, ValidationException, IOException {
	if (obj.getIsVoided()) {
	    obj.setIsVoided(Boolean.FALSE);
	    if (obj.getReasonVoided() == null) {
		obj.setReasonVoided("");
	    }
	    String voidedReason = obj.getReasonVoided();
	    obj.setReasonVoided(obj.getReasonVoided() + "(Unvoided on "
		    + DateTimeUtil.toSqlDateTimeString(obj.getDateVoided()) + ")");
	    
	    List<Project> projects = projectRepository.findByDonor(obj);
		for(Project project: projects){
			if(Boolean.TRUE.equals(project.getIsVoided()) && project.getReasonVoided().equals(voidedReason + " (Donor voided)")){
				project.setIsVoided(Boolean.FALSE);
				if (project.getReasonVoided() == null) {
					project.setReasonVoided("");
				 }
				project.setReasonVoided(project.getReasonVoided() + "(Donor unvoided on "
					    + DateTimeUtil.toSqlDateTimeString(obj.getDateVoided()) + ")");
				updateProject(project);
			}
		}
		
		updateDonor(obj);
	}
    }
}
