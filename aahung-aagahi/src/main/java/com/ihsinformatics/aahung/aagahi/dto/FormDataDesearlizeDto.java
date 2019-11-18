/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.dto;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.hibernate.TypeMismatchException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.ihsinformatics.aahung.aagahi.Context;
import com.ihsinformatics.aahung.aagahi.model.Definition;
import com.ihsinformatics.aahung.aagahi.model.DefinitionType;
import com.ihsinformatics.aahung.aagahi.model.Donor;
import com.ihsinformatics.aahung.aagahi.model.Element;
import com.ihsinformatics.aahung.aagahi.model.FormData;
import com.ihsinformatics.aahung.aagahi.model.FormType;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.model.Project;
import com.ihsinformatics.aahung.aagahi.model.User;
import com.ihsinformatics.aahung.aagahi.service.DonorService;
import com.ihsinformatics.aahung.aagahi.service.FormService;
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
@JsonAutoDetect(fieldVisibility =  JsonAutoDetect.Visibility.ANY)
public class FormDataDesearlizeDto {

    private Integer formId;

    private String uuid;

    private FormType formType;

    private Location location;

    private Date formDate;

    private String referenceId;

    private Set<FormDataMapObject> data = new HashSet<>();

    private Set<String> formParticipantUuids = new HashSet<>();

    public FormDataDesearlizeDto(Integer formId, String uuid, FormType formType, Location location, Date formDate,
	    String referenceId, Set<FormDataMapObject> data, Set<String> formParticipantUuids) {
	this.formId = formId;
	this.uuid = uuid;
	this.formType = formType;
	this.location = location;
	this.formDate = formDate;
	this.referenceId = referenceId;
	this.data = data;
	this.formParticipantUuids = formParticipantUuids;
    }
    
    public FormDataDesearlizeDto(JSONObject jsonObject, FormService formService, LocationService locationService,
    	    ParticipantService participantService, MetadataService metadataService, UserService userService, DonorService donorService) throws JSONException {
    	
    	
    	this.formId = jsonObject.getInt("formId");
    	this.uuid = jsonObject.getString("uuid");
    	
    	JSONObject formTypeJson = jsonObject.getJSONObject("formType");
	    Integer formTypeId = formTypeJson.getInt("formTypeId");
	    this.formType = formService.getFormTypeById(formTypeId);
	    
	    if(!jsonObject.isNull("location")){
		    JSONObject locationJson = jsonObject.getJSONObject("location");
		    Integer locationId = locationJson.getInt("locationId");
		    this.location = locationService.getLocationById(locationId);
	    }

    	long val = jsonObject.getLong("formDate");
        Date date=new Date(val);
        SimpleDateFormat df2 = new SimpleDateFormat("dd/MM/yy");
        String dateText = df2.format(date);		
	    this.formDate = DateTimeUtil.fromSqlDateString(dateText);
	    
	    this.referenceId = jsonObject.getString("referenceId");
	    
	    String unescape = unescape(jsonObject.get("data").toString());
	    if(unescape.startsWith("\""))
	    	unescape = unescape.substring(1, unescape.length()-1);
	      
	    JSONObject dataObject =  new JSONObject(unescape);
	    Iterator<String> keys = dataObject.keys();

	    while(keys.hasNext()) {
	        String key = keys.next();
	        Element element = metadataService.getElementByShortName(key);
	        Object value = dataObject.get(key);
	        FormDataMapObject dmapObj = new FormDataMapObject();
	        if(element != null){
	        	
	        	dmapObj = getDecipherObject(element,value.toString(), element.getShortName(), metadataService, userService, participantService, donorService);
	  
	        }	
	        else{
	        	dmapObj.setKey(key);
	        	dmapObj.setDataType(DataType.STRING.toString());
	        	dmapObj.setValue(value);
	        }
	        data.add(dmapObj);
	    }
    	
   }
    
    
    public FormDataMapObject getDecipherObject(Element element, String value, String elementShortName, MetadataService metadataService, UserService userService, 
    		ParticipantService participantService, DonorService donorService) throws TypeMismatchException {
    	DataType dataType = element.getDataType();
    	FormDataMapObject dmapObj = new FormDataMapObject();
    	dmapObj.setKey(element);
    	dmapObj.setDataType(element.getDataType().toString());

    	Object returnValue = null;

    	if (dataType == null)
    		returnValue = value; 
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
    	    LocationService locationService = new LocationServiceImpl();
    	    if (value.matches(RegexUtil.UUID)) {
    	    	returnValue =  locationService.getLocationByUuid(value);
    	    } else {
    	    	returnValue = locationService.getLocationById(Integer.parseInt(value));
    	    }
    	}
    	if(dataType.equals(DataType.USER)){
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
    	    } else {
    	    List<Definition> definitions =  metadataService.getDefinitionByShortName(value);
    	    if(definitions.size() == 1)
    	    	returnValue = definitions.get(0);
		      else{
		    	 DefinitionType definitionType = metadataService.getDefinitionTypeByShortName(elementShortName);
		    	 List<Definition> dList = metadataService.getDefinitionsByDefinitionType(definitionType);
		    	 for(Definition df : dList){
		    		 if(df.getShortName().equals(value))
		    			 returnValue = df;
		    	 } 
		    	  
		      }
    	    
    	    }
    	}  
    	if(dataType.equals(DataType.JSON)){
    	   try {
    	    	    	
    		 JSONObject jsonObject =  new JSONObject(value);
    		 JSONArray jsonAAray = jsonObject.getJSONArray("values");
    		 
    		 JSONArray returnJsonArray = new JSONArray();
    		 for (int i = 0; i < jsonAAray.length(); i++) {
    			  String str = jsonAAray.getString(i);
    			  HashMap hashMap = new HashMap();
    			  try{
    				  
    				  JSONObject jObj =  new JSONObject(str);
    				  Iterator<String> keys = jObj.keys();

    				  while(keys.hasNext()) {
    				      String key = keys.next();
    				      hashMap.put(key, jObj.get(key));
    				  }
    				  
    				returnJsonArray.put(hashMap);
    				  
    			  } catch (JSONException e1) {
    	    			
    				  dmapObj.setDataType("definition_array");
    				  List<Definition> definitions = metadataService.getDefinitionByShortName(str);
        		      if(definitions.size() == 1)
        		    	  returnJsonArray.put(definitions.get(0));
        		      else{
        		    	 DefinitionType definitionType = metadataService.getDefinitionTypeByShortName(elementShortName);
        		    	 List<Definition> dList = metadataService.getDefinitionsByDefinitionType(definitionType);
        		    	 for(Definition df : dList){
        		    		 if(df.getShortName().equals(str))
        		    			 returnJsonArray.put(df); 
        		    	 } 
        		    	  
        		      }
    				  
    	    	  }
    			  	      
    		 }
    		 returnValue = returnJsonArray;
    	    } catch (JSONException e) {
    		try {
    			JSONArray jsonArray = new JSONArray(value);
    			JSONArray returnJsonArray = new JSONArray();
       		 	for (int i = 0; i < jsonArray.length(); i++) {
       		 		
       		 		JSONObject jObj = jsonArray.getJSONObject(i);
       		 		if(jObj.has("userId")){
				    	 User u =  userService.getUserById(jObj.getInt("userId"));
				    	 returnJsonArray.put(u); 
				    	 dmapObj.setDataType("user_array");
       		 		} else  if(jObj.has("donorId")){
				    	 Donor d =  donorService.getDonorById(jObj.getInt("donorId"));
				    	 returnJsonArray.put(d); 
				    	 dmapObj.setDataType("donor_array");
      		 		} else  if(jObj.has("projectId")){
				    	 Project p =  donorService.getProjectById(jObj.getInt("projectId"));
				    	 returnJsonArray.put(p); 
				    	 dmapObj.setDataType("project_array");
     		 		}
       		 		else {
       		 			
       		 		dmapObj.setDataType(element.getShortName());	
       		 			
       		 		HashMap hashMap = new HashMap();
      				Iterator<String> keys = jObj.keys();

	  				while(keys.hasNext()) {
	  				   String key = keys.next();
	  				   hashMap.put(key, jObj.get(key));
	  				 }
       		 			
	  				returnJsonArray.put(hashMap);
       		 	   }
       		 		
       		 		
       		 	}
       		 returnValue =  returnJsonArray;
    		} catch (JSONException e1) {
    			returnValue = null;
    		}
    	    }
    		
    	}
    	if(dataType.equals(DataType.STRING) || dataType.equals(DataType.UNKNOWN)){
    		if(elementShortName.equals("participant_id")){
    			if (value.matches(RegexUtil.INTEGER)) {
    				returnValue = participantService.getParticipantById(Integer.valueOf(value));
        	    }
    			else {
    				returnValue = participantService.getParticipantByIdentifier(value);
    			}
    			 dmapObj.setDataType("participant");
    		}
    		else
    			returnValue = value;
    	}
    	
    	dmapObj.setValue(returnValue);
    	return dmapObj;
    } 

    
    public static String unescape(String input) {
        StringBuilder builder = new StringBuilder();

        int i = 0;
        while (i < input.length()) {
          char delimiter = input.charAt(i); i++; // consume letter or backslash

          if(delimiter == '\\' && i < input.length()) {

            // consume first after backslash
            char ch = input.charAt(i); i++;

            if(ch == '\\' || ch == '/' || ch == '"' || ch == '\'') {
              builder.append(ch);
            }
            else if(ch == 'n') builder.append('\n');
            else if(ch == 'r') builder.append('\r');
            else if(ch == 't') builder.append('\t');
            else if(ch == 'b') builder.append('\b');
            else if(ch == 'f') builder.append('\f');
            else if(ch == 'u') {

              StringBuilder hex = new StringBuilder();

              // expect 4 digits
              if (i+4 > input.length()) {
                throw new RuntimeException("Not enough unicode digits! ");
              }
              for (char x : input.substring(i, i + 4).toCharArray()) {
                if(!Character.isLetterOrDigit(x)) {
                  throw new RuntimeException("Bad character in unicode escape.");
                }
                hex.append(Character.toLowerCase(x));
              }
              i+=4; // consume those four digits.

              int code = Integer.parseInt(hex.toString(), 16);
              builder.append((char) code);
            } else {
              throw new RuntimeException("Illegal escape sequence: \\"+ch);
            }
          } else { // it's not a backslash, or it's the last character.
            builder.append(delimiter);
          }
        }

        return builder.toString();
      }

}
