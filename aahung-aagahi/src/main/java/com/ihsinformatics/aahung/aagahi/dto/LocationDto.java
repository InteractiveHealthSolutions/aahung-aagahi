/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.dto;

import com.ihsinformatics.aahung.aagahi.model.Location;

import lombok.Getter;
import lombok.Setter;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Setter
@Getter
public class LocationDto {

	private Integer locationId;

	private String locationName;

	private String shortName;

	private String uuid;

	private String categoryUuid;

	public LocationDto(Integer locationId, String locationName, String shortName, String uuid, String categoryUuid) {
		this.locationId = locationId;
		this.locationName = locationName;
		this.shortName = shortName;
		this.uuid = uuid;
		this.categoryUuid = categoryUuid;
	}
	
	public LocationDto(Location location) {
		this.locationId = location.getLocationId();
		this.locationName = location.getLocationName();
		this.shortName = location.getShortName();
		this.uuid = location.getUuid();
		this.categoryUuid = location.getCategory().getUuid();
	}
}
