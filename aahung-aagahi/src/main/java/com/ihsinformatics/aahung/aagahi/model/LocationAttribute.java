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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@Entity
@Table(name = "location_attribute")
@Builder
public class LocationAttribute extends DataEntity {

	private static final long serialVersionUID = -8955947110424426031L;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	@Column(name = "attribute_id")
	private Integer attributeId;

	@ManyToOne
	@JoinColumn(name = "location_id", nullable = false)
	private Location location;

	@ManyToOne
	@JoinColumn(name = "attribute_type_id", nullable = false)
	private PersonAttributeType attributeType;

	@Column(name = "attribute_value", nullable = false, length = 1024)
	private String attributeValue;

	@Transient
	private Serializable value;

	/**
	 * The value should never be set from implementation code
	 * 
	 * @param value
	 */
	private void setValue(Serializable value) {
		this.value = value;
	}

	/**
	 * @return
	 */
	public Serializable getValue() {
		if (value == null) {
			setValue(decipher(attributeType.getDataType(), attributeValue));
		}
		return value;
	}
}
