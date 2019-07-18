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

import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.TypeMismatchException;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ihsinformatics.aahung.aagahi.Initializer;
import com.ihsinformatics.aahung.aagahi.util.DataType;
import com.ihsinformatics.util.DateTimeUtil;

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
	private Boolean isVoided;

	@ManyToOne
	@JoinColumn(name = "created_by", nullable = false)
	private User createdBy;

	@Column(name = "date_created", nullable = false, updatable = false)
	@Temporal(TemporalType.TIMESTAMP)
	private Date dateCreated;

	@ManyToOne
	@JoinColumn(name = "updated_by")
	private User updatedBy;

	@Column(name = "date_updated")
	@Temporal(TemporalType.TIMESTAMP)
	private Date dateUpdated;

	@ManyToOne
	@JoinColumn(name = "voided_by")
	private User voidedBy;

	@Column(name = "date_voided")
	@Temporal(TemporalType.TIMESTAMP)
	private Date dateVoided;

	@Column(name = "reason_voided", length = 255)
	private String reasonVoided;

	public DataEntity() {
		super();
		this.isVoided = Boolean.FALSE;
		initGson();
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((uuid == null) ? 0 : uuid.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		DataEntity other = (DataEntity) obj;
		if (uuid == null) {
			if (other.uuid != null)
				return false;
		} else if (!uuid.equals(other.uuid)) {
			return false;
		}
		return true;
	}

	/**
	 * Tries to convert the string value of attributeValue into respective Serializable object
	 * 
	 * @return
	 * @throws TypeMismatchException when the attribute value does not correspond to the Datatype
	 */
	public Serializable decipher(DataType dataType, String stringValue) throws TypeMismatchException {
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
				return Initializer.getMetadataRepository().getObjectByUuid(Location.class, stringValue);
			case USER:
				return Initializer.getMetadataRepository().getObjectByUuid(User.class, stringValue);
			case STRING:
			case UNKNOWN:
				return stringValue;
		}
		return null;
	}

}
