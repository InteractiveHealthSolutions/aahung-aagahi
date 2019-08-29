/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.hibernate.HibernateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ihsinformatics.aahung.aagahi.Initializer;
import com.ihsinformatics.aahung.aagahi.model.Definition;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.LocationAttribute;
import com.ihsinformatics.aahung.aagahi.model.LocationAttributeType;
import com.ihsinformatics.aahung.aagahi.repository.LocationAttributeRepository;
import com.ihsinformatics.aahung.aagahi.repository.LocationAttributeTypeRepository;
import com.ihsinformatics.aahung.aagahi.repository.LocationRepository;
import com.ihsinformatics.aahung.aagahi.util.SearchCriteria;

/**
 * @author rabbia.hassan@ihsinformatics.com
 */
@Component
public class LocationServiceImpl implements LocationService {

	@Autowired
	private LocationRepository locationRepository;

	@Autowired
	private LocationAttributeTypeRepository locationAttributeTypeRepository;

	@Autowired
	private LocationAttributeRepository locationAttributeRepository;

	@PersistenceContext
	private EntityManager entityManager;

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#saveLocation(com.ihsinformatics.aahung.aagahi.model.Location)
	 */
	@Override
	public Location saveLocation(Location obj) throws HibernateException {
		if (getLocationByShortName(obj.getShortName()) != null) {
			throw new HibernateException("Trying to save duplicate Location!");
		}
		obj.setCreatedBy(Initializer.getCurrentUser());
		obj = locationRepository.save(obj);
		if (!obj.getAttributes().isEmpty()) {
			saveLocationAttributes(obj.getAttributes());
		}
		return obj;
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#saveLocationAttributes(java.util.List)
	 */
	@Override
	public List<LocationAttribute> saveLocationAttributes(List<LocationAttribute> attributes) throws HibernateException {
		for (LocationAttribute obj : attributes) {
			obj.setCreatedBy(Initializer.getCurrentUser());
		}
		return locationAttributeRepository.saveAll(attributes);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#saveLocationAttributeType(com.ihsinformatics.aahung.aagahi.model.LocationAttributeType)
	 */
	@Override
	public LocationAttributeType saveLocationAttributeType(LocationAttributeType obj) throws HibernateException {
		return locationAttributeTypeRepository.save(obj);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#saveLocationAttribute(com.ihsinformatics.aahung.aagahi.model.LocationAttribute)
	 */
	@Override
	public LocationAttribute saveLocationAttribute(LocationAttribute obj) throws HibernateException {
		obj.setCreatedBy(Initializer.getCurrentUser());
		return locationAttributeRepository.save(obj);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#updateLocation(com.ihsinformatics.aahung.aagahi.model.Location)
	 */
	@Override
	public Location updateLocation(Location obj) throws HibernateException {
		obj.setUpdatedBy(Initializer.getCurrentUser());
		obj.setDateUpdated(new Date());
		return locationRepository.save(obj);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#deleteLocation(com.ihsinformatics.aahung.aagahi.model.Location, boolean)
	 */
	@Override
	public void deleteLocation(Location obj, boolean force) throws HibernateException {
		// Check dependencies first
		if (!obj.getAttributes().isEmpty()) {
			if (force) {
				for (LocationAttribute attribute : obj.getAttributes()) {
					deleteLocationAttribute(attribute);
				}
			} else {
				throw new HibernateException(
				        "One or more LocationAttribute objects depend on this Location. Please delete the dependent objects (by setting the force parameter true) first.");
			}
		}
		locationRepository.delete(obj);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#deleteLocationAttribute(com.ihsinformatics.aahung.aagahi.model.LocationAttribute)
	 */
	@Override
	public void deleteLocationAttribute(LocationAttribute obj) throws HibernateException {
		locationAttributeRepository.delete(obj);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#deleteLocationAttributeType(com.ihsinformatics.aahung.aagahi.model.LocationAttributeType, boolean)
	 */
	@Override
	public void deleteLocationAttributeType(LocationAttributeType obj, boolean force) throws HibernateException {
		List<LocationAttribute> attributesByType = getLocationAttributesByType(obj);
		if (!attributesByType.isEmpty()) {
			if (force) {
				for (LocationAttribute locationAttribute : attributesByType) {
					deleteLocationAttribute(locationAttribute);
				}
			} else {
				throw new HibernateException(
				        "One or more LocationAttribute objects depend on this LocationAttributeType. Please delete the dependent objects (by setting the force parameter true) first.");
			}
		}
		locationAttributeTypeRepository.delete(obj);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#getLocationById(java.lang.Integer)
	 */
	@Override
	public Location getLocationById(Integer id) throws HibernateException {
		Optional<Location> found = locationRepository.findById(id);
		if (found.isPresent()) {
			return found.get();
		}
		return null;
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#getLocationByUuid(java.lang.String)
	 */
	@Override
	public Location getLocationByUuid(String uuid) throws HibernateException {
		return locationRepository.findByUuid(uuid);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#getLocationByShortName(java.lang.String)
	 */
	@Override
	public Location getLocationByShortName(String shortName) throws HibernateException {
		return locationRepository.findByShortName(shortName);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#getLocationByName(java.lang.String)
	 */
	@Override
	public List<Location> getLocationByName(String name) throws HibernateException {
		return locationRepository.findByLocationName(name);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#getLocationsByParent(com.ihsinformatics.aahung.aagahi.model.Location)
	 */
	@Override
	public List<Location> getLocationsByParent(Location parentLocation) throws HibernateException {
		return locationRepository.findByParentLocation(parentLocation);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#getLocationsByCategory(com.ihsinformatics.aahung.aagahi.model.Definition)
	 */
	@Override
	public List<Location> getLocationsByCategory(Definition definition) throws HibernateException {
		return locationRepository.findByCategory(definition);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#getAllLocations()
	 */
	@Override
	public List<Location> getAllLocations() throws HibernateException {
		return locationRepository.findAll();
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#getLocationAttributes(com.ihsinformatics.aahung.aagahi.model.Location, com.ihsinformatics.aahung.aagahi.model.LocationAttributeType)
	 */
	@Override
	public List<LocationAttribute> getLocationAttributes(Location location, LocationAttributeType attributeType)
	        throws HibernateException {
		return locationAttributeRepository.findByLocationAttributeType(location, attributeType);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#getLocationAttributesByLocation(com.ihsinformatics.aahung.aagahi.model.Location)
	 */
	@Override
	public List<LocationAttribute> getLocationAttributesByLocation(Location location) throws HibernateException {
		return locationAttributeRepository.findByLocation(location);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#getLocationAttributesByValue(com.ihsinformatics.aahung.aagahi.model.LocationAttributeType, java.lang.String)
	 */
	@Override
	public List<LocationAttribute> getLocationAttributesByTypeAndValue(LocationAttributeType attributeType,
	        String attributeValue) throws HibernateException {
		return locationAttributeRepository.findByAttributeTypeAndValue(attributeType, attributeValue);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#getLocationAttributesByValue(java.lang.String)
	 */
	@Override
	public List<LocationAttribute> getLocationAttributesByValue(String attributeValue) throws HibernateException {
		return locationAttributeRepository.findByValue(attributeValue);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#getLocationAttributesByType(com.ihsinformatics.aahung.aagahi.model.LocationAttributeType)
	 */
	@Override
	public List<LocationAttribute> getLocationAttributesByType(LocationAttributeType attributeType)
	        throws HibernateException {
		return locationAttributeRepository.findByAttributeType(attributeType);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#getLocationAttributeByUuid(java.lang.String)
	 */
	@Override
	public LocationAttribute getLocationAttributeByUuid(String uuid) throws HibernateException {
		return locationAttributeRepository.findByUuid(uuid);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#getLocationAttributeById(java.lang.Integer)
	 */
	@Override
	public LocationAttribute getLocationAttributeById(Integer id) throws HibernateException {
		Optional<LocationAttribute> found = locationAttributeRepository.findById(id);
		if (found.isPresent()) {
			return found.get();
		}
		return null;
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#getAllLocationAttributeTypes()
	 */
	@Override
	public List<LocationAttributeType> getAllLocationAttributeTypes() throws HibernateException {
		return locationAttributeTypeRepository.findAll();
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#getLocationAttributeTypeByName(java.lang.String)
	 */
	@Override
	public LocationAttributeType getLocationAttributeTypeByName(String name) throws HibernateException {
		return locationAttributeTypeRepository.findByName(name);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#getLocationAttributeTypeByUuid(java.lang.String)
	 */
	@Override
	public LocationAttributeType getLocationAttributeTypeByUuid(String uuid) throws HibernateException {
		return locationAttributeTypeRepository.findByUuid(uuid);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#getLocationAttributeTypeByShortName(java.lang.String)
	 */
	@Override
	public LocationAttributeType getLocationAttributeTypeByShortName(String shortName) throws HibernateException {
		return locationAttributeTypeRepository.findByShortName(shortName);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#getLocationAttributeTypeById(java.lang.Integer)
	 */
	@Override
	public LocationAttributeType getLocationAttributeTypeById(Integer id) throws HibernateException {
		Optional<LocationAttributeType> found = locationAttributeTypeRepository.findById(id);
		if (found.isPresent()) {
			return found.get();
		}
		return null;
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.LocationService#searchLocation(java.util.List)
	 */
	@Override
	public List<Location> searchLocation(List<SearchCriteria> params) {
		if (params == null) {
			params = new ArrayList<>();
		}
		if (params.isEmpty()) {
			return new ArrayList<>();
		}
		return locationRepository.search(params);
	}
}
