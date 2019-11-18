/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.hibernate.TypeMismatchException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.ihsinformatics.aahung.aagahi.Context;
import com.ihsinformatics.aahung.aagahi.model.Definition;
import com.ihsinformatics.aahung.aagahi.model.DefinitionType;
import com.ihsinformatics.aahung.aagahi.model.Donor;
import com.ihsinformatics.aahung.aagahi.model.Element;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.LocationAttribute;
import com.ihsinformatics.aahung.aagahi.model.LocationAttributeType;
import com.ihsinformatics.aahung.aagahi.model.Project;
import com.ihsinformatics.aahung.aagahi.model.User;
import com.ihsinformatics.aahung.aagahi.service.DonorService;
import com.ihsinformatics.aahung.aagahi.service.DonorServiceImpl;
import com.ihsinformatics.aahung.aagahi.service.LocationService;
import com.ihsinformatics.aahung.aagahi.service.LocationServiceImpl;
import com.ihsinformatics.aahung.aagahi.service.MetadataService;
import com.ihsinformatics.aahung.aagahi.service.MetadataServiceImpl;
import com.ihsinformatics.aahung.aagahi.service.ParticipantService;
import com.ihsinformatics.aahung.aagahi.service.UserService;
import com.ihsinformatics.aahung.aagahi.service.UserServiceImpl;
import com.ihsinformatics.aahung.aagahi.util.DataType;
import com.ihsinformatics.aahung.aagahi.util.DateTimeUtil;
import com.ihsinformatics.aahung.aagahi.util.RegexUtil;

import lombok.Getter;
import lombok.Setter;

/**
 * @author owais.hussain@ihsinformatics.com
 */

@Setter
@Getter
public class LocationDesearlizeDto {


	private Integer locationId;

    private String locationName;

    private String shortName;

    private Definition category;

    private String description;

    private String address1;

    private String address2;

    private String address3;

    private Integer postalCode;

    private String landmark1;

    private String landmark2;

    private String cityVillage;

    private String stateProvince;

    private String country;

    private Double latitude;

    private Double longitude;

    private String primaryContact;

    private String primaryContactPerson;

    private String secondaryContact;

    private String secondaryContactPerson;

    private String tertiaryContact;

    private String tertiaryContactPerson;
    
    private String extension;

    private String email;

    private List<LocationMapObject> attributes = new ArrayList<>();

    private Location parentLocation;
    
    
    public LocationDesearlizeDto(Integer locationId, String locationName, String shortName, Definition category,
			String description, String address1, String address2, String address3, Integer postalCode, String landmark1,
			String landmark2, String cityVillage, String stateProvince, String country, Double latitude,
			Double longitude, String primaryContact, String primaryContactPerson, String secondaryContact,
			String secondaryContactPerson, String tertiaryContact, String tertiaryContactPerson, String extension,
			String email, List<LocationMapObject> attributes, Location parentLocation) {
		super();
		this.locationId = locationId;
		this.locationName = locationName;
		this.shortName = shortName;
		this.category = category;
		this.description = description;
		this.address1 = address1;
		this.address2 = address2;
		this.address3 = address3;
		this.postalCode = postalCode;
		this.landmark1 = landmark1;
		this.landmark2 = landmark2;
		this.cityVillage = cityVillage;
		this.stateProvince = stateProvince;
		this.country = country;
		this.latitude = latitude;
		this.longitude = longitude;
		this.primaryContact = primaryContact;
		this.primaryContactPerson = primaryContactPerson;
		this.secondaryContact = secondaryContact;
		this.secondaryContactPerson = secondaryContactPerson;
		this.tertiaryContact = tertiaryContact;
		this.tertiaryContactPerson = tertiaryContactPerson;
		this.extension = extension;
		this.email = email;
		this.attributes = attributes;
		this.parentLocation = parentLocation;
	}


	public LocationDesearlizeDto(JSONObject jsonObject, MetadataService metadataService, LocationService locationService) throws JSONException {
		
		this.locationId = jsonObject.getInt("locationId");
		this.locationName = jsonObject.getString("locationName");
		this.shortName = jsonObject.getString("shortName");
		this.category = metadataService.getDefinitionByUuid(jsonObject.getJSONObject("category").getString("uuid"));
		if(!jsonObject.isNull("description"))
			this.description = jsonObject.getString("description");
		if(!jsonObject.isNull("address1"))
			this.address1 = jsonObject.getString("address1");
		if(!jsonObject.isNull("address2"))
			this.address2 = jsonObject.getString("address2");
		if(!jsonObject.isNull("address3"))
			this.address3 = jsonObject.getString("address3");
		if(!jsonObject.isNull("postalCode"))
			this.postalCode = jsonObject.getInt("postalCode");
		if(!jsonObject.isNull("landmark1"))
			this.landmark1 = jsonObject.getString("landmark1");
		if(!jsonObject.isNull("landmark2"))
			this.landmark2 = jsonObject.getString("landmark2");
		if(!jsonObject.isNull("cityVillage"))
			this.cityVillage = jsonObject.getString("cityVillage");
		if(!jsonObject.isNull("stateProvince"))
			this.stateProvince = jsonObject.getString("stateProvince");
		if(!jsonObject.isNull("country"))
			this.country = jsonObject.getString("country");
		if(!jsonObject.isNull("latitude"))
			this.latitude = jsonObject.getDouble("latitude");
		if(!jsonObject.isNull("longitude"))
			this.longitude = jsonObject.getDouble("longitude");
		if(!jsonObject.isNull("primaryContact"))
			this.primaryContact = jsonObject.getString("primaryContact");
		if(!jsonObject.isNull("primaryContactPerson"))
			this.primaryContactPerson = jsonObject.getString("primaryContactPerson");
		if(!jsonObject.isNull("secondaryContact"))
			this.secondaryContact = jsonObject.getString("secondaryContact");
		if(!jsonObject.isNull("secondaryContactPerson"))
			this.secondaryContactPerson = jsonObject.getString("secondaryContactPerson");
		if(!jsonObject.isNull("tertiaryContact"))
			this.tertiaryContact = jsonObject.getString("tertiaryContact");
		if(!jsonObject.isNull("tertiaryContactPerson"))
			this.tertiaryContactPerson = jsonObject.getString("tertiaryContactPerson");
		if(!jsonObject.isNull("extension"))
			this.extension = jsonObject.getString("extension");
		if(!jsonObject.isNull("email"))
			this.email = jsonObject.getString("email");
		if(!jsonObject.isNull("parentLocation")){
		    JSONObject locationJson = jsonObject.getJSONObject("parentLocation");
		    Integer locationId = locationJson.getInt("locationId");
		    this.parentLocation = locationService.getLocationById(locationId);
	    }
		
		if(!jsonObject.isNull("attributes")){
			
			JSONArray jsonArray = jsonObject.getJSONArray("attributes");
			for (int i = 0; i < jsonArray.length(); i++) {
				LocationMapObject locMapObject = new LocationMapObject();
			 
				JSONObject jObj = jsonArray.getJSONObject(i);
				locMapObject = getDecipherObject(jObj, locationService, metadataService);
  			
				attributes.add(locMapObject);  
			  
			}
			
		}
		
		
	}
	
	
	
	 public LocationMapObject getDecipherObject(JSONObject jsonObject, LocationService locationService, MetadataService metadataService) throws TypeMismatchException, JSONException {
		 	
		 	LocationMapObject locMapObject = new LocationMapObject();
		 	locMapObject.setAttributeId(jsonObject.getInt("attributeId"));
			LocationAttributeType locAttributeType = locationService.getLocationAttributeTypeByUuid(jsonObject.getJSONObject("attributeType").getString("uuid"));
			locMapObject.setAttributeType(locAttributeType);
			String value = jsonObject.getString("attributeValue");
			DataType dataType = locAttributeType.getDataType();
		 	locMapObject.setDataType(dataType.toString());

	    	Object returnValue = null;

	    	if(dataType.equals(DataType.BOOLEAN))
	    		returnValue = Boolean.parseBoolean(value);
	    	if(dataType.equals(DataType.CHARACTER))
	    		returnValue = (value.charAt(0));
	    	if(dataType.equals(DataType.DATE))
	    		returnValue = DateTimeUtil.fromString(value, Context.DEFAULT_DATE_FORMAT);
	    	if(dataType.equals(DataType.DATETIME) || dataType.equals(DataType.TIME))
	    		returnValue = DateTimeUtil.fromString(value, Context.DEFAULT_DATETIME_FORMAT);
	    	if(dataType.equals(DataType.FLOAT))
	    		returnValue = Double.parseDouble(value);
	    	if(dataType.equals(DataType.INTEGER))
	    		returnValue = Integer.parseInt(value);
	    	if(dataType.equals(DataType.LOCATION)){
	    	    if (value.matches(RegexUtil.UUID)) {
	    	    	returnValue =  locationService.getLocationByUuid(value);
	    	    } else {
	    	    	returnValue = locationService.getLocationById(Integer.parseInt(value));
	    	    }
	    	}
	    	if(dataType.equals(DataType.USER)){
	    	    UserService userService = new UserServiceImpl();
	    	    if (value.matches(RegexUtil.UUID)) {
	    	    	returnValue =  userService.getUserByUuid(value);
	    	    } else {
	    	    	returnValue = userService.getUserById(Integer.parseInt(value));
	    	    }
	    	}
	    	if(dataType.equals(DataType.DEFINITION)){
	    	   if (value.matches(RegexUtil.UUID)) {
	    		   returnValue = metadataService.getDefinitionByUuid(value);
	    	    } else if (value.matches(RegexUtil.INTEGER)) {
	    	    	returnValue = metadataService.getDefinitionById(Integer.parseInt(value));
	    	    } 
	    	}
	    	if(dataType.equals(DataType.JSON)){
	    		DonorService donorService = new DonorServiceImpl();
	    		UserService userService = new UserServiceImpl();

    			JSONArray jsonArray = new JSONArray(value);
    			JSONArray returnJsonArray = new JSONArray();
    			for (int i = 0; i < jsonArray.length(); i++) {
    				JSONObject jObj = jsonArray.getJSONObject(i);
    				if(jObj.has("definitionId")){
				    	 Definition d =  metadataService.getDefinitionById(jObj.getInt("definitionId"));
				    	 returnJsonArray.put(d); 
				    	 locMapObject.setDataType("definition_array");
  		 			} else if(jObj.has("projectId")){
				    	 Project p =  donorService.getProjectById(jObj.getInt("projectId"));
				    	 returnJsonArray.put(p); 
				    	 locMapObject.setDataType("project_array");
   		 			} else if(jObj.has("userId")){
				    	 User u =  userService.getUserById(jObj.getInt("userId"));
				    	 returnJsonArray.put(u); 
				    	 locMapObject.setDataType("user_array");
      		 		} else  if(jObj.has("donorId")){
				    	 Donor d =  donorService.getDonorById(jObj.getInt("donorId"));
				    	 returnJsonArray.put(d); 
				    	 locMapObject.setDataType("donor_array");
     		 		} 
    				
          		 returnValue =  returnJsonArray;
    			}
	    	}
	    	if(dataType.equals(DataType.STRING) || dataType.equals(DataType.UNKNOWN)){
	    		returnValue = value;
	    	}
	    	
	    	locMapObject.setValue(returnValue);
	    	return locMapObject;
	    } 
	

	
}
		
		
		
		
    
    
    
    
    
    
    

    

