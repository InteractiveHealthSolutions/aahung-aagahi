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

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.hibernate.HibernateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.ihsinformatics.aahung.aagahi.model.Definition;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.LocationAttribute;
import com.ihsinformatics.aahung.aagahi.model.LocationAttributeType;
import com.ihsinformatics.aahung.aagahi.model.UserAttributeType;
import com.ihsinformatics.aahung.aagahi.repository.LocationAttributeRepository;
import com.ihsinformatics.aahung.aagahi.repository.LocationAttributeTypeRepository;
import com.ihsinformatics.aahung.aagahi.repository.LocationRepository;
import com.ihsinformatics.aahung.aagahi.util.SearchCriteria;
import com.ihsinformatics.aahung.aagahi.util.SearchQueryCriteriaConsumer;

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

	/* Save Method */
	
	@Override
	public Location saveLocation(Location obj) throws HibernateException {
		if (getLocationByShortName(obj.getShortName()) != null) {
			throw new HibernateException("Trying to release duplicate Location!");
		}
		
		UserServiceImpl service = new UserServiceImpl();
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String name = authentication.getName();
		obj.setCreatedBy(service.getUserByUsername(name));
		
		for(LocationAttribute attribute : obj.getAttributes())
			attribute.setCreatedBy(service.getUserByUsername(name));
		
		return locationRepository.save(obj);
	}
	
	@Override
	public List<LocationAttribute> saveLocationAttributes(List<LocationAttribute> attributes) throws HibernateException {
		return locationAttributeRepository.saveAll(attributes);
	}
	
	@Override
	public LocationAttributeType saveLocationAttributeType(LocationAttributeType obj) throws HibernateException {
		return locationAttributeTypeRepository.save(obj);
	}
	
	@Override
	public LocationAttribute saveLocationAttribute(LocationAttribute attribute) throws HibernateException {
		return locationAttributeRepository.save(attribute);
	}

	/* Update Methods */
	
	@Override
	public Location updateLocation(Location obj) throws HibernateException { 
		return saveLocation(obj);
	}
	
	/* Delete Methods */

	@Override
	public void deleteLocation(Location obj) throws HibernateException {
		locationRepository.delete(obj);
	}
		
	@Override
	public void deleteLocationAttribute(LocationAttribute obj) throws HibernateException{
		locationAttributeRepository.delete(obj);
	}
	
	
	@Override
	public void deleteLocationAttributeType(LocationAttributeType obj) throws HibernateException{
		locationAttributeTypeRepository.delete(obj);
	}
	
	
	/* Fetch Methods*/

	
	@Override
	public Location getLocationById(Integer id) throws HibernateException {
		Optional<Location> found = locationRepository.findById(id);
		if (found.isPresent()) {
			return found.get();
		}
		return null;
	}

	@Override
	public Location getLocationByUuid(String uuid) throws HibernateException {
		return locationRepository.findByUuid(uuid);
	}

	@Override
	public Location getLocationByShortName(String shortName) throws HibernateException {
		return locationRepository.findByShortName(shortName);
	}

	@Override
	public List<Location> getLocationByName(String name) throws HibernateException {
		return locationRepository.findByLocationName(name);
	}

	@Override
	public List<Location> getLocationsByParent(Location parentLocation) throws HibernateException {
		return locationRepository.findByParent(parentLocation);
	}

	@Override
	public List<Location> getLocationsByCategory(Definition definition) throws HibernateException {
		return locationRepository.findByCategory(definition);
	}

	@Override
	public List<Location> getAllLocations() throws HibernateException {
		return locationRepository.findAll();
	}

	@Override
	public List<LocationAttribute> getLocationAttributes(Location location, LocationAttributeType attributeType)
			throws HibernateException {
		return locationAttributeRepository.findByLocationAttributeType(location, attributeType);
	}
	
	@Override
	public List<LocationAttribute> getLocationAttributesByLocation(Location location) 
			throws HibernateException {
		return locationAttributeRepository.findByLocation(location);
	}


	@Override
	public List<LocationAttribute> getLocationAttributesByValue(LocationAttributeType attributeType, String attributeValue)
			throws HibernateException {
		return locationAttributeRepository.findByAttributeTypeAndValue(attributeType, attributeValue);
	}

	@Override
	public List<LocationAttribute> getLocationAttributesByType(LocationAttributeType attributeType)
			throws HibernateException {
		return locationAttributeRepository.findByAttributeType(attributeType);
	}

	@Override
	public LocationAttribute getLocationAttributeByUuid(String uuid) throws HibernateException {
		return locationAttributeRepository.findByUuid(uuid);
	}

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
	
	
	@Override
    public List<Location> searchLocation(List<SearchCriteria> params) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Location> query = builder.createQuery(Location.class);
        Root<Location> r = query.from(Location.class);
 
        Predicate predicate = builder.conjunction();
 
        SearchQueryCriteriaConsumer searchConsumer = 
          new SearchQueryCriteriaConsumer(predicate, builder, r);
        params.stream().forEach(searchConsumer);
        predicate = searchConsumer.getPredicate();
        query.where(predicate);
 
        List<Location> result = entityManager.createQuery(query).getResultList();
        return result;
    }
	

}
