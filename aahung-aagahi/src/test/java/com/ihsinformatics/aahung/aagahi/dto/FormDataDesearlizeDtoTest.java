/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.dto;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.json.JSONException;
import org.junit.Before;
import org.junit.Test;

import com.ihsinformatics.aahung.aagahi.BaseServiceTest;
import com.ihsinformatics.aahung.aagahi.model.FormType;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.LocationAttribute;
import com.ihsinformatics.aahung.aagahi.model.LocationAttributeType;
import com.ihsinformatics.aahung.aagahi.model.PersonAttribute;
import com.ihsinformatics.aahung.aagahi.model.PersonAttributeType;
import com.ihsinformatics.aahung.aagahi.service.DonorService;
import com.ihsinformatics.aahung.aagahi.service.LocationService;
import com.ihsinformatics.aahung.aagahi.service.MetadataService;
import com.ihsinformatics.aahung.aagahi.service.UserService;
import com.ihsinformatics.aahung.aagahi.util.DataType;

/**
 * @author owais.hussain@ihsinformatics.com
 */
public class FormDataDesearlizeDtoTest extends BaseServiceTest {

    private FormDataDesearlizeDto formDatasDesearlizeDto;

    @Before
    public void reset() {
	super.reset();
	formDatasDesearlizeDto = new FormDataDesearlizeDto(harryData.getFormId(), harryData.getUuid(), harryData.getFormType(), harryData.getLocation(), harryData.getFormDate(),
		    harryData.getReferenceId(), null, null);	
    }

    @Test
    public void shouldDecipaherIntegerLocationAttribute() throws JSONException {
    	assertNotNull(formDatasDesearlizeDto.getDecipherObject(numberElement, "2", metadataService, userService, participantService, donorService));
    }
    
    @Test
    public void shouldDecipaherStringLocationAttribute() throws JSONException {
    	
    	assertNotNull(formDatasDesearlizeDto.getDecipherObject(captainElement, "RON", metadataService, userService, participantService, donorService));
    }
    
    @Test
    public void shouldDecipaherLocationLocationAttribute() throws JSONException {
    	  	    	
    	assertNotNull(formDatasDesearlizeDto.getDecipherObject(numberElement, "2", metadataService, userService, participantService, donorService));
    }
    
    @Test
    public void shouldDecipaherJSONLocationAttribute() throws JSONException {
    		
    	assertNotNull(formDatasDesearlizeDto.getDecipherObject(titlesElement,"[{\"projectId\":7},{\"projectId\":8},{\"projectId\":9}]", metadataService, userService, participantService, donorService));
    }
    
    @Test
    public void shouldDecipaherDefinitionArrayLocationAttribute() throws JSONException {
    	    	
    	assertNotNull(formDatasDesearlizeDto.getDecipherObject(titlesElement, "[{\"definitionId\":7},{\"definitionId\":8},{\"definitionId\":9}]", metadataService, userService, participantService, donorService));
    }
    
    
    @Test
    public void shouldDecipaherDonorLocationAttribute() throws JSONException {
    	  	    	
    	assertNotNull(formDatasDesearlizeDto.getDecipherObject(titlesElement, "[{\"donorId\":7},{\"donorId\":8},{\"donorId\":9}]", metadataService, userService, participantService, donorService));
    }
    
    @Test
    public void shouldDecipaherUserArrayLocationAttribute() throws JSONException {
    	
    	assertNotNull(formDatasDesearlizeDto.getDecipherObject(titlesElement, "[{\"userId\":7},{\"userId\":8},{\"userId\":9}]", metadataService, userService, participantService, donorService));
    }
    
    @Test
    public void shouldDecipaherDefinitionLocationAttribute() throws JSONException {
    	    	
    	assertNotNull(formDatasDesearlizeDto.getDecipherObject(houseElement, "3", metadataService, userService, participantService, donorService));
    }
    
    @Test
    public void shouldDecipaherUserLocationAttribute() throws JSONException {
    	    	
    	assertNotNull(formDatasDesearlizeDto.getDecipherObject(refereeElement, "3", metadataService, userService, participantService, donorService));
    }
    
    @Test
    public void testFormDataDesearlizeDto() throws JSONException {
    	
    	harryData.setData("{\"date_start\":\"2019-09-24\",\"lastest_session_date\":\"2019-09-17\",\"facilitator_type\":{\"values\":[\"parents\"]},\"parent_session_score_pct\":28.55,\"parent_session_conducted\":\"1\",\"session_count\":\"10\",\"next_session_plan\":\"0\",\"avg_participant_count\":\"10\",\"parent_attendant\":\"mothers\",\"parent_session_score\":5,\"monitor\":[{\"userId\":9}],\"previous_topic_covered\":{\"values\":[\"understanding_family\"]}}");
    	assertNotNull(new FormDataDesearlizeDto (harryData,  locationService, participantService, metadataService, userService, donorService));
    }
    
    @Test
    public void testUnescape() throws JSONException {
    	
    	String unescape = formDatasDesearlizeDto.unescape("{\\\"date_start\\\":\\\"2019-09-24\\\",\\\"lastest_session_date\\\":\\\"2019-09-17\\\",\\\"facilitator_type\\\":{\\\"values\\\":[\\\"parents\\\"]},\\\"parent_session_score_pct\\\":28.55,\\\"parent_session_conducted\\\":\\\"1\\\",\\\"session_count\\\":\\\"10\\\",\\\"next_session_plan\\\":\\\"0\\\",\\\"avg_participant_count\\\":\\\"10\\\",\\\"parent_attendant\\\":\\\"mothers\\\",\\\"parent_session_score\\\":5,\\\"monitor\\\":[{\\\"userId\\\":9}],\\\"previous_topic_covered\\\":{\\\"values\\\":[\\\"understanding_family\\\"]}}");
    	assertEquals("{\"date_start\":\"2019-09-24\",\"lastest_session_date\":\"2019-09-17\",\"facilitator_type\":{\"values\":[\"parents\"]},\"parent_session_score_pct\":28.55,\"parent_session_conducted\":\"1\",\"session_count\":\"10\",\"next_session_plan\":\"0\",\"avg_participant_count\":\"10\",\"parent_attendant\":\"mothers\",\"parent_session_score\":5,\"monitor\":[{\"userId\":9}],\"previous_topic_covered\":{\"values\":[\"understanding_family\"]}}", unescape);

    }
    
}
