package com.ihsinformatics.aahung.aagahi.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.TypeMismatchException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.ihsinformatics.aahung.aagahi.Context;
import com.ihsinformatics.aahung.aagahi.model.Definition;
import com.ihsinformatics.aahung.aagahi.model.Donor;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.LocationAttribute;
import com.ihsinformatics.aahung.aagahi.model.LocationAttributeType;
import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.model.PersonAttribute;
import com.ihsinformatics.aahung.aagahi.model.PersonAttributeType;
import com.ihsinformatics.aahung.aagahi.model.Project;
import com.ihsinformatics.aahung.aagahi.model.User;
import com.ihsinformatics.aahung.aagahi.service.DonorService;
import com.ihsinformatics.aahung.aagahi.service.DonorServiceImpl;
import com.ihsinformatics.aahung.aagahi.service.LocationService;
import com.ihsinformatics.aahung.aagahi.service.MetadataService;
import com.ihsinformatics.aahung.aagahi.service.ParticipantService;
import com.ihsinformatics.aahung.aagahi.service.PersonService;
import com.ihsinformatics.aahung.aagahi.service.PersonServiceImpl;
import com.ihsinformatics.aahung.aagahi.service.UserService;
import com.ihsinformatics.aahung.aagahi.service.UserServiceImpl;
import com.ihsinformatics.aahung.aagahi.util.DataType;
import com.ihsinformatics.aahung.aagahi.util.DateTimeUtil;
import com.ihsinformatics.aahung.aagahi.util.RegexUtil;

import lombok.Getter;
import lombok.Setter;

/**
 * @author rabbia.hassan@ihsinformatics.com
 */

@Setter
@Getter
public class ParticipantDesearlizeDto {
	
	private Integer participantId;
    private Location location;
    private String identifier;
    private Date dob;
    private String name;
    private String gender;
    private List<ParticipantMapObject> attributes = new ArrayList<>();

    
    public ParticipantDesearlizeDto(Integer participantId, Location location, String identifier,
			Date dob, String name, String gender, List<ParticipantMapObject> attributes) {
		super();
		this.participantId = participantId;
		this.location = location;
		this.identifier = identifier;
		this.dob = dob;
		this.name = name;
		this.gender = gender;
		this.attributes = attributes;
	}
    
    public ParticipantDesearlizeDto(Participant participant, LocationService locationService, MetadataService metadataService) {
    	
    	this.participantId =  participant.getParticipantId();
	    this.location = participant.getLocation();
	    this.identifier = participant.getIdentifier();		
		this.dob = participant.getPerson().getDob();
		this.name = participant.getPerson().getFirstName();
		this.gender = participant.getPerson().getGender();
		
		List<PersonAttribute> attributesList = participant.getPerson().getAttributes();
		
		for (int i = 0; i < attributesList.size(); i++) {
			ParticipantMapObject partMapObject = new ParticipantMapObject();
		 
			PersonAttribute attribute = attributesList.get(i);
			try {
				partMapObject = getDecipherObject(attribute, locationService, metadataService);
			} catch (TypeMismatchException | JSONException e) {
				continue;
			} 
			
			this.attributes.add(partMapObject);  
		  
		}
    	
    }
    
    
    

    public ParticipantMapObject getDecipherObject(PersonAttribute attribute, LocationService locationService, MetadataService metadataService) throws TypeMismatchException, JSONException {
	 	
    	ParticipantMapObject partMapObject = new ParticipantMapObject();
	 	partMapObject.setAttributeId(attribute.getAttributeId());
		PersonAttributeType personAttributeType = attribute.getAttributeType();
		partMapObject.setAttributeType(personAttributeType);
		String value = attribute.getAttributeValue();
		DataType dataType = personAttributeType.getDataType();
	 	partMapObject.setDataType(dataType.toString());

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
			    	 partMapObject.setDataType("definition_array");
		 			} else if(jObj.has("projectId")){
			    	 Project p =  donorService.getProjectById(jObj.getInt("projectId"));
			    	 returnJsonArray.put(p); 
			    	 partMapObject.setDataType("project_array");
		 			} else if(jObj.has("userId")){
			    	 User u =  userService.getUserById(jObj.getInt("userId"));
			    	 returnJsonArray.put(u); 
			    	 partMapObject.setDataType("user_array");
  		 		} else  if(jObj.has("donorId")){
			    	 Donor d =  donorService.getDonorById(jObj.getInt("donorId"));
			    	 returnJsonArray.put(d); 
			    	 partMapObject.setDataType("donor_array");
 		 		} 
				
      		 returnValue =  returnJsonArray;
			}
    	}
    	if(dataType.equals(DataType.STRING) || dataType.equals(DataType.UNKNOWN)){
    		returnValue = value;
    	}
    	
    	partMapObject.setValue(returnValue);
    	return partMapObject;
    } 


}
