/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;

import com.ihsinformatics.aahung.aagahi.model.Definition;
import com.ihsinformatics.aahung.aagahi.model.DefinitionType;
import com.ihsinformatics.aahung.aagahi.model.Element;
import com.ihsinformatics.aahung.aagahi.model.FormData;
import com.ihsinformatics.aahung.aagahi.model.FormType;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.LocationAttribute;
import com.ihsinformatics.aahung.aagahi.model.LocationAttributeType;
import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.model.Person;
import com.ihsinformatics.aahung.aagahi.model.Privilege;
import com.ihsinformatics.aahung.aagahi.model.Role;
import com.ihsinformatics.aahung.aagahi.model.User;
import com.ihsinformatics.aahung.aagahi.model.UserAttribute;
import com.ihsinformatics.aahung.aagahi.model.UserAttributeType;
import com.ihsinformatics.aahung.aagahi.util.DataType;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(SpringRunner.class)
public class BaseTestData {

	@Autowired
	protected TestEntityManager entityManager;

	protected static User admin, dumbledore, snape, tonks, umbridge, luna, fred, george, lily;
	
	protected Set<User> users = new HashSet<>();

	protected static Privilege magic, charm, curse, release, arrest, kill;

	protected static FormType quidditchForm;

	protected static FormData harryData, hermioneData, ronData;

	protected static Set<Privilege> privileges = new HashSet<>();

	protected static Role headmaster, potionMaster, auror;
	
	protected Set<Role> roles = new HashSet<>();

	protected static UserAttributeType occupation, patronus, blood;
	
	protected Set<UserAttributeType> userAttributeTypes = new HashSet<>();
	
	protected static UserAttribute userAttribute1, userAttribute2;
	
	protected Set<UserAttribute> userAttributes = new HashSet<>();

	protected static DefinitionType locationType, country, house, broomStick;

	protected static Definition gryffindor, slytherine, hufflepuff, ravenclaw;

	protected static Definition comet, nimbus, firebolt;

	protected static Definition school, market;

	protected static Definition scotland, france, england;

	protected static Element schoolElement, houseElement, broomstickElement, captainElement;

	protected static Location hogwartz, diagonalley;
	
	protected static LocationAttributeType noOfStudents, noOfTeachers;
	
	protected Set<LocationAttributeType> locationAttributeTypes = new HashSet<>();
	
	protected static LocationAttribute locationAttribute1, locationAttribute2;
	
	protected Set<LocationAttribute> locationAttributes = new HashSet<>();
	
	protected static Person harry, ron, hermione;

	protected static Participant seeker, keeper, chaser;
	
	public void initData() {
		initPrivileges();
		initDefinitionTypes();
		initDefinitions();
		initUserAttributeTypes();
		initUserAttributes();
		initRoles();
		initUsers();
		initLocations();
		initFormTypes();
		initFormData();
		initPeople();
		initParticipants();
	}

	public void reset() {
		initData();
		entityManager.persistAndFlush(admin);
	}

	public void flushAll() {
		try {
			entityManager.remove(admin);
		}
		catch (Exception e) {}
	}

	public void initPrivileges() {
		magic = Privilege.builder().privilegeName("USE MAGIC").build();
		charm = Privilege.builder().privilegeName("USE CHARM").build();
		curse = Privilege.builder().privilegeName("USE CURSE").build();
		release = Privilege.builder().privilegeName("RELEASE").build();
		arrest = Privilege.builder().privilegeName("ARREST").build();
		kill = Privilege.builder().privilegeName("KILL").build();
		privileges.addAll(Arrays.asList(magic, charm, curse, release, arrest, kill));
	}

	public void initDefinitionTypes() {
		int count = 1;
		locationType = DefinitionType.builder().definitionTypeId(count++).typeName("Location Type").build();
		country = DefinitionType.builder().definitionTypeId(count++).typeName("Country").build();
		house = DefinitionType.builder().definitionTypeId(count++).typeName("House").build();
		broomStick = DefinitionType.builder().definitionTypeId(count++).typeName("Broom Stick").build();
	}

	public void initDefinitions() {
		int count = 1;
		school = Definition.builder().definitionType(locationType).definitionId(count++).definitionName("School").build();
		market = Definition.builder().definitionType(locationType).definitionId(count++).definitionName("Market").build();
		scotland = Definition.builder().definitionType(country).definitionId(count++).definitionName("Scotland").build();
		france = Definition.builder().definitionType(country).definitionId(count++).definitionName("France").build();
		england = Definition.builder().definitionType(country).definitionId(count++).definitionName("England").build();
		comet = Definition.builder().definitionType(broomStick).definitionId(count++).definitionName("Comet").build();
		nimbus = Definition.builder().definitionType(broomStick).definitionId(count++).definitionName("Nimbus").build();
		firebolt = Definition.builder().definitionType(broomStick).definitionId(count++).definitionName("Firebolt").build();
		gryffindor = Definition.builder().definitionType(house).definitionId(count++).definitionName("Gryffindor").build();
		slytherine = Definition.builder().definitionType(house).definitionId(count++).definitionName("Slytherine").build();
		hufflepuff = Definition.builder().definitionType(house).definitionId(count++).definitionName("Hufflepuff").build();
		ravenclaw = Definition.builder().definitionType(house).definitionId(count++).definitionName("Ravenclaw").build();
	}

	public void initRoles() {
		auror = Role.builder().roleId(1).roleName("Auror").rolePrivileges(privileges).build();
		headmaster = Role.builder().roleId(2).roleName("Headmaster").rolePrivileges(privileges).build();
		headmaster.getRolePrivileges().remove(kill);
		potionMaster = Role.builder().roleId(3).roleName("Potion Master").rolePrivileges(privileges).build();
		headmaster.getRolePrivileges().removeAll(Arrays.asList(kill, arrest, release));
		roles.addAll(Arrays.asList(headmaster, potionMaster, auror));
	}

	public void initUserAttributeTypes() {
		occupation = UserAttributeType.builder().attributeName("Occupation").dataType(DataType.STRING)
		        .isRequired(Boolean.TRUE).build();
		patronus = UserAttributeType.builder().attributeName("Patronus").dataType(DataType.STRING).isRequired(Boolean.FALSE)
		        .build();
		blood = UserAttributeType.builder().attributeName("Blood Status").dataType(DataType.STRING).isRequired(Boolean.TRUE)
		        .build();
		userAttributeTypes.addAll(Arrays.asList(occupation, patronus, blood));
	}

	public void initUsers() {
		admin = User.builder().username("dumbledore").fullName("Administrator").build();
		admin.setPassword("jingle94");
		dumbledore = User.builder().userId(2).username("albus.dumbledore").fullName("Albus Dumbledore").build();
		dumbledore.setPassword("Expelliarmus");
		snape = User.builder().userId(3).username("severus.snape").fullName("Severus Snape").build();
		snape.setPassword("Sectumsempra");
		tonks = User.builder().userId(4).username("nymphadora.tonks").fullName("Nymphadora Tonks").build();
		tonks.setPassword("Stupify");
		umbridge = User.builder().username("dolores.umbridge").fullName("Dolores Jane Umbridge").attributes(new HashSet<>())
		        .build();
		luna = User.builder().username("luna.lovegood").fullName("Luna Lovegood").attributes(new HashSet<>()).build();
		fred = User.builder().username("fred.weasley").fullName("Fred Weasley").attributes(new HashSet<>()).build();
		george = User.builder().username("george.weasley").fullName("George Weasley").attributes(new HashSet<>()).build();
		lily = User.builder().userId(5).username("lily.potter").fullName("Lilly Potter").build();
		for (User u : Arrays.asList(umbridge, luna, fred, george, lily)) {
			u.setPassword("none");
		}
		
	}
	
	public void initUserAttributes(){
		userAttribute1 = UserAttribute.builder().attributeId(1).user(snape).attributeType(blood).attributeValue("Half Blood").build();
		userAttribute2 = UserAttribute.builder().attributeId(1).user(tonks).attributeType(blood).attributeValue("Half Blood").build();
		userAttributes.addAll(Arrays.asList(userAttribute1,userAttribute2));
	}
	
	public void initLocationAttributeTypes() {
		noOfStudents = LocationAttributeType.builder().attributeName("Current number of Students Enrolled").dataType(DataType.INTEGER)
		        .isRequired(Boolean.FALSE).build();
		noOfTeachers = LocationAttributeType.builder().attributeName("Current number of Students Enrolled").dataType(DataType.INTEGER)
		        .isRequired(Boolean.FALSE).build();
		locationAttributeTypes.addAll(Arrays.asList(noOfStudents,noOfTeachers));
	}

	public void initLocations() {
		hogwartz = Location.builder().locationName("Hogwarts School of Witchcraft and Wizardry").shortName("HSWW")
		        .category(school).country(scotland).build();
		diagonalley = Location.builder().locationName("Diagon Alley").category(market).country(england).build();
	}
	
	public void initLocationAttributes(){
		locationAttribute1 = LocationAttribute.builder().attributeId(1).location(hogwartz).attributeType(noOfStudents).attributeValue("1000").build();
		locationAttribute2 = LocationAttribute.builder().attributeId(1).location(diagonalley).attributeType(noOfTeachers).attributeValue("20").build();
		locationAttributes.addAll(Arrays.asList(locationAttribute1,locationAttribute2));
	}

	public void initFormTypes() {
		quidditchForm = FormType.builder().formName("Quidditch Participation").shortName("QP Form").build();
	}

	public void initFormData() {
		harryData = FormData.builder().formType(quidditchForm).formDate(new Date()).referenceId("QP-2000").build();
		Map<String, Serializable> dataMap = new HashMap<>();
		dataMap.put("house", gryffindor.getUuid());
		dataMap.put("broom", firebolt.getUuid());
		dataMap.put("role", "Seeker");
		harryData.setDataMap(dataMap);
		hermioneData = FormData.builder().formType(quidditchForm).formDate(new Date()).referenceId("QP-2004").build();
		ronData = FormData.builder().formType(quidditchForm).formDate(new Date()).referenceId("QP-1905").build();
		dataMap.put("house", gryffindor.getUuid());
		dataMap.put("broom", nimbus.getUuid());
		dataMap.put("role", "Keeper");
		ronData.setDataMap(dataMap);
	}

	public void initPeople() {
		harry = Person.builder().firstName("Harry").lastName("Potter").build();
		ron = Person.builder().firstName("Ronald").lastName("Weasley").build();
		hermione = Person.builder().firstName("Hermione").lastName("Granger").build();
	}

	public void initParticipants() {
		seeker = Participant.builder().person(harry).build();
		keeper = Participant.builder().person(ron).build();
		chaser = Participant.builder().person(hermione).build();
	}
}
