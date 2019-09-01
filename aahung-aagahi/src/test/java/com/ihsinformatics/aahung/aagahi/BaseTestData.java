/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
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
import com.ihsinformatics.aahung.aagahi.model.Donor;
import com.ihsinformatics.aahung.aagahi.model.Element;
import com.ihsinformatics.aahung.aagahi.model.FormData;
import com.ihsinformatics.aahung.aagahi.model.FormType;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.LocationAttribute;
import com.ihsinformatics.aahung.aagahi.model.LocationAttributeType;
import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.model.Person;
import com.ihsinformatics.aahung.aagahi.model.PersonAttribute;
import com.ihsinformatics.aahung.aagahi.model.PersonAttributeType;
import com.ihsinformatics.aahung.aagahi.model.Privilege;
import com.ihsinformatics.aahung.aagahi.model.Project;
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

	protected static Element schoolElement, houseElement, broomstickElement, captainElement, roleElement, numberElement,
			heightElement, genderElement, dateJoinedElement, refereeElement, titlesElement;

	protected static Location hogwartz, diagonalley;

	protected static LocationAttributeType noOfStudents, noOfTeachers;

	protected Set<LocationAttributeType> locationAttributeTypes = new HashSet<>();

	protected static LocationAttribute locationAttribute1, locationAttribute2;

	protected Set<LocationAttribute> locationAttributes = new HashSet<>();

	protected static Person harry, ron, hermione;

	protected static PersonAttributeType height, socialStatus;

	protected Set<PersonAttributeType> personAttributeTypes = new HashSet<>();

	protected static PersonAttribute personAttribute1, personAttribute2;

	protected Set<PersonAttribute> personAttributes = new HashSet<>();

	protected static Participant seeker, keeper, chaser;

	protected static Donor ministry;

	protected static Project triwizardTournament;

	public void initData() {
		initPrivileges();
		initDefinitionTypes();
		initDefinitions();
		initUserAttributeTypes();
		initUserAttributes();
		initRoles();
		initUsers();
		initLocations();
		initLocationAttributeTypes();
		initLocationAttributes();
		initElements();
		initFormTypes();
		initFormData();
		initPeople();
		initPersonAttributeTypes();
		initPersonAttributes();
		initParticipants();
		initDonors();
		initProjects();
	}

	public void reset() {
		initData();
		User found = entityManager.find(User.class, 1);
		if (found != null) {
			admin = found;
		} else {
			entityManager.persistAndFlush(admin);
		}
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
		int count = 100;
		locationType = DefinitionType.builder().definitionTypeId(count++).typeName("Location Type")
				.shortName("LOC_TYPE").build();
		country = DefinitionType.builder().definitionTypeId(count++).typeName("Country").shortName("COUNTRY").build();
		house = DefinitionType.builder().definitionTypeId(count++).typeName("House").shortName("HOUSE").build();
		broomStick = DefinitionType.builder().definitionTypeId(count++).typeName("Broom Stick").shortName("BROOM")
				.build();
	}

	public void initDefinitions() {
		int count = 100;
		school = Definition.builder().definitionType(locationType).definitionId(count++).definitionName("School")
				.shortName("SCHOOL").build();
		market = Definition.builder().definitionType(locationType).definitionId(count++).definitionName("Market")
				.shortName("MARKET").build();
		scotland = Definition.builder().definitionType(country).definitionId(count++).definitionName("Scotland")
				.shortName("SC").build();
		france = Definition.builder().definitionType(country).definitionId(count++).definitionName("France")
				.shortName("FR").build();
		england = Definition.builder().definitionType(country).definitionId(count++).definitionName("England")
				.shortName("EN").build();
		comet = Definition.builder().definitionType(broomStick).definitionId(count++).definitionName("Comet")
				.shortName("COMET").build();
		nimbus = Definition.builder().definitionType(broomStick).definitionId(count++).definitionName("Nimbus")
				.shortName("N2000").build();
		firebolt = Definition.builder().definitionType(broomStick).definitionId(count++).definitionName("Firebolt")
				.shortName("FB").build();
		gryffindor = Definition.builder().definitionType(house).definitionId(count++).definitionName("Gryffindor")
				.shortName("GRF").build();
		slytherine = Definition.builder().definitionType(house).definitionId(count++).definitionName("Slytherine")
				.shortName("SLY").build();
		hufflepuff = Definition.builder().definitionType(house).definitionId(count++).definitionName("Hufflepuff")
				.shortName("HFL").build();
		ravenclaw = Definition.builder().definitionType(house).definitionId(count++).definitionName("Ravenclaw")
				.shortName("RCW").build();
	}

	public void initRoles() {
		int count = 100;
		auror = Role.builder().roleId(count++).roleName("Auror").rolePrivileges(privileges).build();
		headmaster = Role.builder().roleId(count++).roleName("Headmaster").rolePrivileges(privileges).build();
		headmaster.getRolePrivileges().remove(kill);
		potionMaster = Role.builder().roleId(count++).roleName("Potion Master").rolePrivileges(privileges).build();
		headmaster.getRolePrivileges().removeAll(Arrays.asList(kill, arrest, release));
		roles.addAll(Arrays.asList(headmaster, potionMaster, auror));
	}

	public void initUserAttributeTypes() {
		occupation = UserAttributeType.builder().attributeName("Occupation").dataType(DataType.STRING)
				.isRequired(Boolean.TRUE).build();
		patronus = UserAttributeType.builder().attributeName("Patronus").dataType(DataType.STRING)
				.isRequired(Boolean.FALSE).build();
		blood = UserAttributeType.builder().attributeName("Blood Status").dataType(DataType.STRING)
				.isRequired(Boolean.TRUE).build();
		userAttributeTypes.addAll(Arrays.asList(occupation, patronus, blood));
	}

	public void initUsers() {
		admin = User.builder().username("dumbledore").fullName("Administrator").build();
		admin.setPassword("jingle94");
		dumbledore = User.builder().username("albus.dumbledore").fullName("Albus Dumbledore").build();
		dumbledore.setPassword("Expelliarmus");
		snape = User.builder().username("severus.snape").fullName("Severus Snape").build();
		snape.setPassword("Sectumsempra");
		tonks = User.builder().username("nymphadora.tonks").fullName("Nymphadora Tonks").build();
		tonks.setPassword("Stupify");
		umbridge = User.builder().username("dolores.umbridge").fullName("Dolores Jane Umbridge")
				.attributes(new HashSet<>()).build();
		luna = User.builder().username("luna.lovegood").fullName("Luna Lovegood").attributes(new HashSet<>()).build();
		fred = User.builder().username("fred.weasley").fullName("Fred Weasley").attributes(new HashSet<>()).build();
		george = User.builder().username("george.weasley").fullName("George Weasley").attributes(new HashSet<>())
				.build();
		lily = User.builder().username("lily.potter").fullName("Lilly Potter").build();
		for (User u : Arrays.asList(umbridge, luna, fred, george, lily)) {
			u.setPassword("none");
		}

	}

	public void initUserAttributes() {
		userAttribute1 = UserAttribute.builder().attributeId(1).user(snape).attributeType(blood)
				.attributeValue("Half Blood").build();
		userAttribute2 = UserAttribute.builder().attributeId(1).user(tonks).attributeType(blood)
				.attributeValue("Half Blood").build();
		userAttributes.addAll(Arrays.asList(userAttribute1, userAttribute2));
	}

	public void initLocationAttributeTypes() {
		noOfStudents = LocationAttributeType.builder().attributeName("Current number of Students Enrolled")
				.dataType(DataType.INTEGER).shortName("NO_STUDENTS").isRequired(Boolean.FALSE).build();
		noOfTeachers = LocationAttributeType.builder().attributeName("Current number of Students Enrolled")
				.dataType(DataType.INTEGER).shortName("NO_TEACHERS").isRequired(Boolean.FALSE).build();
		locationAttributeTypes.addAll(Arrays.asList(noOfStudents, noOfTeachers));
	}

	public void initLocations() {
		hogwartz = Location.builder().locationName("Hogwarts School of Witchcraft and Wizardry").shortName("HSWW")
				.category(school).country(scotland.getDefinitionName()).attributes(new ArrayList<>()).build();
		diagonalley = Location.builder().locationName("Diagon Alley").shortName("DALLEY").category(market)
				.country(england.getDefinitionName()).attributes(new ArrayList<>()).build();
	}

	public void initLocationAttributes() {
		locationAttribute1 = LocationAttribute.builder().attributeId(1).location(hogwartz).attributeType(noOfStudents)
				.attributeValue("1000").build();
		locationAttribute2 = LocationAttribute.builder().attributeId(1).location(diagonalley)
				.attributeType(noOfTeachers).attributeValue("20").build();
		locationAttributes.addAll(Arrays.asList(locationAttribute1, locationAttribute2));
	}

	public void initElements() {
		schoolElement = Element.builder().dataType(DataType.LOCATION).elementName("School Name").shortName("SCHOOL")
				.build();
		houseElement = Element.builder().dataType(DataType.DEFINITION).elementName("House").shortName("HOUSE").build();
		broomstickElement = Element.builder().dataType(DataType.DEFINITION).elementName("Broom Stick Model")
				.shortName("BROOM").build();
		captainElement = Element.builder().dataType(DataType.STRING).elementName("Captain Name").shortName("CAPTAIN")
				.build();
		roleElement = Element.builder().dataType(DataType.DEFINITION).elementName("Team Role").shortName("ROLE")
				.build();
		numberElement = Element.builder().dataType(DataType.INTEGER).elementName("Dress Number").shortName("NO")
				.build();
		heightElement = Element.builder().dataType(DataType.FLOAT).elementName("Height").shortName("HEIGHT").build();
		genderElement = Element.builder().dataType(DataType.CHARACTER).elementName("Gender").shortName("GENDER")
				.build();
		dateJoinedElement = Element.builder().dataType(DataType.DATE).elementName("Date Joined").shortName("JOIN_DATE")
				.build();
		refereeElement = Element.builder().dataType(DataType.USER).elementName("Referred By").shortName("REFEREE")
				.build();
		titlesElement = Element.builder().dataType(DataType.JSON).elementName("Titles").shortName("TITLES").build();

	}

	public void initFormTypes() {
		quidditchForm = FormType.builder().formName("Quidditch Participation").shortName("QP Form").build();
	}

	public void initFormData() {
		harryData = FormData.builder().formType(quidditchForm).formDate(new Date()).referenceId("QP-2000").build();
		Map<String, Object> dataMap = new HashMap<>();
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
		harry = Person.builder().firstName("Harry").lastName("Potter").gender("MALE").dob(new Date()).build();
		ron = Person.builder().firstName("Ronald").lastName("Weasley").gender("MALE").dob(new Date()).build();
		hermione = Person.builder().firstName("Hermione").lastName("Granger").gender("FEMALE").dob(new Date()).build();
	}

	public void initPersonAttributeTypes() {
		height = PersonAttributeType.builder().dataType(DataType.FLOAT).attributeName("Height").shortName("HT")
				.validationRegex("range=1-19").build();
		socialStatus = PersonAttributeType.builder().dataType(DataType.STRING).attributeName("Social Status")
				.shortName("STATUS").build();
		personAttributeTypes.addAll(Arrays.asList(height, socialStatus));
	}

	public void initPersonAttributes() {
		personAttribute1 = PersonAttribute.builder().person(ron).attributeType(height).attributeValue("5.6").build();
		personAttribute2 = PersonAttribute.builder().person(ron).attributeType(socialStatus).attributeValue("Married")
				.build();
	}

	public void initParticipants() {
		seeker = Participant.builder().person(harry).location(hogwartz).identifier("SEEKER").build();
		keeper = Participant.builder().person(ron).location(hogwartz).identifier("KEEPER").build();
		chaser = Participant.builder().person(hermione).location(diagonalley).identifier("CHASER").build();
	}

	public void initDonors() {
		ministry = Donor.builder().donorName("Ministry of Magic").shortName("MoM").build();
	}

	public void initProjects() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.YEAR, 1994);
		Date begin = calendar.getTime();
		calendar.set(Calendar.YEAR, 1995);
		Date end = calendar.getTime();
		triwizardTournament = Project.builder().donor(ministry).projectName("Triwizard Tournament")
				.shortName("MOM-TT-1994").dateGrantBegin(begin).dateGrantEnd(end).build();
	}
}
