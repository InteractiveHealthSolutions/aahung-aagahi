/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.ihsinformatics.aahung.aagahi.util.DataType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_attribute_type")
@Builder
public class UserAttributeType extends MetadataEntity {

    private static final long serialVersionUID = -2288674874134225415L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attribute_type_id")
    private Integer attributeTypeId;

    @Column(name = "attribute_name", nullable = false, unique = true, length = 50)
    private String attributeName;

    @Column(name = "short_name", nullable = false, unique = true, length = 50)
    private String shortName;

    @Column(name = "datatype", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private DataType dataType;

    @Column(name = "validation_regex", length = 1024)
    private String validationRegex;

    @Column(name = "required")
    private Boolean isRequired;
}
