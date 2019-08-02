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

import org.hibernate.HibernateException;
import org.springframework.stereotype.Service;

import com.ihsinformatics.aahung.aagahi.model.Definition;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.LocationAttribute;
import com.ihsinformatics.aahung.aagahi.model.LocationAttributeType;
import com.ihsinformatics.aahung.aagahi.util.SearchCriteria;

/**
 * @author rabbia.hassan@ihsinformatics.com
 */

@Service
public interface LocationService {
	
	/* Save methods */
	
	Location saveLocation(Location obj) throws HibernateException;
	
	List<LocationAttribute> saveLocationAttributes(List<LocationAttribute> attributes) throws HibernateException;
	
	LocationAttribute saveLocationAttribute(LocationAttribute obj) throws HibernateException; 
	
	LocationAttributeType saveLocationAttributeType(LocationAttributeType obj) throws HibernateException;
	
	/* Update methods */
	
	Location updateLocation(Location obj) throws HibernateException;
	
	/* Delete methods */
	
	void deleteLocation(Location obj) throws HibernateException;
	
	void deleteLocationAttribute(LocationAttribute obj) throws HibernateException;
	
	void deleteLocationAttributeType(LocationAttributeType obj) throws HibernateException;

	/* Fetch Methods */
	
	Location getLocationById(Integer id) throws HibernateException;
	
	Location getLocationByUuid(String uuid) throws HibernateException;

	Location getLocationByShortName(String shortName) throws HibernateException;

	List<Location> getLocationByName(String name) throws HibernateException;
	
	List<Location> getLocationsByParent(Location parentLocation) throws HibernateException;
	
	List<Location> getLocationsByCategory(Definition definition) throws HibernateException;
	
	List<Location> getAllLocations() throws HibernateException;
	
	List<LocationAttribute> getLocationAttributes(Location location, LocationAttributeType attributeType) throws HibernateException;

	List<LocationAttribute> getLocationAttributesByLocation(Location location) throws HibernateException;
	
	List<LocationAttribute> getLocationAttributesByValue(LocationAttributeType attributeType, String value) throws HibernateException;
	
	List<LocationAttribute> getLocationAttributesByType(LocationAttributeType attributeType) throws HibernateException;

	LocationAttribute getLocationAttributeByUuid(String uuid) throws HibernateException;
	
	LocationAttribute getLocationAttributeById(Integer id) throws HibernateException;
	
	List<LocationAttributeType> getAllLocationAttributeTypes() throws HibernateException;
	
	LocationAttributeType getLocationAttributeTypeByName(String name) throws HibernateException;

	LocationAttributeType getLocationAttributeTypeByUuid(String uuid) throws HibernateException;

	LocationAttributeType getLocationAttributeTypeById(Integer id) throws HibernateException;
	
	List<Location> searchLocation(List<SearchCriteria> params) throws HibernateException;

}
