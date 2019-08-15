/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.TypeMismatchException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ihsinformatics.aahung.aagahi.Initializer;
import com.ihsinformatics.aahung.aagahi.repository.DefinitionRepository;
import com.ihsinformatics.aahung.aagahi.repository.FormTypeRepository;
import com.ihsinformatics.aahung.aagahi.repository.MetadataRepository;
import com.ihsinformatics.aahung.aagahi.service.FormService;
import com.ihsinformatics.aahung.aagahi.service.FormServiceImpl;
import com.ihsinformatics.aahung.aagahi.service.UserServiceImpl;
import com.ihsinformatics.aahung.aagahi.util.DataType;
import com.ihsinformatics.aahung.aagahi.util.DateTimeUtil;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@AllArgsConstructor
@MappedSuperclass
@JsonIgnoreProperties(value = { "createdBy", "dateCreated", "updatedBy", "dateUpdated", "voidedBy",
        "dateVoided" }, allowGetters = true)
@Getter
@Setter
public class DataEntity extends BaseEntity {
	
	private static final long serialVersionUID = 2814244235550115484L;

	@Column(name = "voided", nullable = false)
	protected Boolean isVoided;
	
	@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
	@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinColumn(name = "created_by", updatable = false)
	protected User createdBy;

	@Column(name = "date_created", nullable = false, updatable = false)
	@Temporal(TemporalType.TIMESTAMP)
	@JsonFormat(pattern="yyyy-MM-dd")
	protected Date dateCreated;

	@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
	@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinColumn(name = "updated_by")
	protected User updatedBy;

	@Column(name = "date_updated")
	@Temporal(TemporalType.TIMESTAMP)
	@JsonFormat(pattern="yyyy-MM-dd")
	protected Date dateUpdated;

	@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
	@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinColumn(name = "voided_by")
	protected User voidedBy;

	@Column(name = "date_voided")
	@Temporal(TemporalType.TIMESTAMP)
	@JsonFormat(pattern="yyyy-MM-dd")
	protected Date dateVoided;

	@Column(name = "reason_voided", length = 255)
	protected String reasonVoided;

	public DataEntity() {
		super();
		this.isVoided = Boolean.FALSE;
		this.dateCreated = new Date();
		
		
		
		initGson();
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((createdBy == null) ? 0 : createdBy.hashCode());
		result = prime * result + ((dateCreated == null) ? 0 : dateCreated.hashCode());
		result = prime * result + ((dateUpdated == null) ? 0 : dateUpdated.hashCode());
		result = prime * result + ((dateVoided == null) ? 0 : dateVoided.hashCode());
		result = prime * result + ((isVoided == null) ? 0 : isVoided.hashCode());
		result = prime * result + ((updatedBy == null) ? 0 : updatedBy.hashCode());
		return result;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (!(obj instanceof DataEntity))
			return false;
		DataEntity other = (DataEntity) obj;
		if (createdBy == null) {
			if (other.createdBy != null)
				return false;
		} else if (!createdBy.equals(other.createdBy))
			return false;
		if (dateCreated == null) {
			if (other.dateCreated != null)
				return false;
		} else if (!dateCreated.equals(other.dateCreated))
			return false;
		if (dateUpdated == null) {
			if (other.dateUpdated != null)
				return false;
		} else if (!dateUpdated.equals(other.dateUpdated))
			return false;
		if (dateVoided == null) {
			if (other.dateVoided != null)
				return false;
		} else if (!dateVoided.equals(other.dateVoided))
			return false;
		if (isVoided == null) {
			if (other.isVoided != null)
				return false;
		} else if (!isVoided.equals(other.isVoided))
			return false;
		if (updatedBy == null) {
			if (other.updatedBy != null)
				return false;
		} else if (!updatedBy.equals(other.updatedBy))
			return false;
		return true;
	}

	/**
	 * Tries to convert the string value of attributeValue into respective Serializable object
	 * 
	 * @return
	 * @throws TypeMismatchException when the attribute value does not correspond to the Datatype
	 */
	public Serializable decipher(DataType dataType, String stringValue) throws TypeMismatchException {
		
		if(dataType == null)
			return stringValue;
		
		switch (dataType) {
			case BOOLEAN:
				return Boolean.parseBoolean(stringValue);
			case CHARACTER:
				return (stringValue.charAt(0));
			case DATE:
			case TIME:
				return DateTimeUtil.fromString(stringValue, Initializer.DEFAULT_DATE_FORMAT);
			case DATETIME:
				return DateTimeUtil.fromString(stringValue, Initializer.DEFAULT_DATETIME_FORMAT);
			case FLOAT:
				return Double.parseDouble(stringValue);
			case INTEGER:
				return Integer.parseInt(stringValue);
			case LOCATION:
				return MetadataRepository.getObjectByUuid(Location.class, stringValue);
			case USER:
				return MetadataRepository.getObjectByUuid(User.class, stringValue);
			case DEFINITION:
				FormServiceImpl service = new FormServiceImpl();
				return service.getDefinition(stringValue);
			case STRING:
			case UNKNOWN:
				return stringValue;
			default:
				break;
		}
		return null;
	}
	
}
