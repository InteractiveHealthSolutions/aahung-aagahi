package com.ihsinformatics.aahung.aagahi;

import static org.junit.Assert.assertTrue;

import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;

import com.ihsinformatics.aahung.aagahi.model.Definition;
import com.ihsinformatics.aahung.aagahi.model.DefinitionType;
import com.ihsinformatics.aahung.aagahi.model.Element;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.model.Person;
import com.ihsinformatics.aahung.aagahi.model.User;
import com.ihsinformatics.aahung.aagahi.model.UserAttributeType;
import com.ihsinformatics.aahung.aagahi.util.DataType;

@RunWith(SpringRunner.class)
@DataJpaTest
public class BaseTest {

	protected static User admin;
	
	protected static UserAttributeType occupation, patronus, blood;

	protected static DefinitionType locationType, country, house, broomStick;
	
	protected static Definition gryffindor, slytherine, hufflepuff, ravenclaw;

	protected static Definition comet, nimbus, firebolt;

	protected static Definition school, market;

	protected static Definition scotland, france, england;
	
	protected static Element schoolElement, houseElement, broomstickElement, captainElement;

	protected static Location hogwartz, diagonalley;

	protected static Person harry, ron, hermione;

	protected static Participant seeker, keeper, chaser;

	@Autowired
	protected TestEntityManager entityManager;

	@BeforeClass
	public static void init() throws Exception {
		// Create admin user
		admin = new User(1, "admin", "Administrator", null, null, null);
		admin.setPassword("jingle94");
		
		// User Attribute Types
		occupation = UserAttributeType.builder().attributeName("Occupation").dataType(DataType.STRING).isRequired(Boolean.TRUE).build();
		patronus = UserAttributeType.builder().attributeName("Patronus").dataType(DataType.STRING).isRequired(Boolean.FALSE).build();
		blood = UserAttributeType.builder().attributeName("Blood Status").dataType(DataType.STRING).isRequired(Boolean.TRUE).build();

		// Definition Types
		int count = 1;
		locationType = DefinitionType.builder().definitionTypeId(count++).typeName("Location Type").build();
		country = DefinitionType.builder().definitionTypeId(count++).typeName("Country").build();
		house = DefinitionType.builder().definitionTypeId(count++).typeName("House").build();
		broomStick = DefinitionType.builder().definitionTypeId(count++).typeName("Broom Stick").build();

		// Definitions
		count = 1;
		school = Definition.builder().definitionType(locationType).definitionId(count++).definitionName("School")
				.build();
		market = Definition.builder().definitionType(locationType).definitionId(count++).definitionName("Market")
				.build();
		scotland = Definition.builder().definitionType(country).definitionId(count++).definitionName("Scotland")
				.build();
		france = Definition.builder().definitionType(country).definitionId(count++).definitionName("France").build();
		england = Definition.builder().definitionType(country).definitionId(count++).definitionName("England").build();
		comet = Definition.builder().definitionType(broomStick).definitionId(count++).definitionName("Comet").build();
		nimbus = Definition.builder().definitionType(broomStick).definitionId(count++).definitionName("Nimbus").build();
		firebolt = Definition.builder().definitionType(broomStick).definitionId(count++).definitionName("Firebolt")
				.build();
		gryffindor = Definition.builder().definitionType(house).definitionId(count++).definitionName("Gryffindor")
				.build();
		slytherine = Definition.builder().definitionType(house).definitionId(count++).definitionName("Slytherine")
				.build();
		hufflepuff = Definition.builder().definitionType(house).definitionId(count++).definitionName("Hufflepuff")
				.build();
		ravenclaw = Definition.builder().definitionType(house).definitionId(count++).definitionName("Ravenclaw")
				.build();

		// Locations
		hogwartz = Location.builder().locationName("Hogwarts School of Witchcraft and Wizardry").shortName("HSWW")
				.category(school).country(scotland).build();
		diagonalley = Location.builder().locationName("Diagon Alley").category(market).country(england).build();

		// People
		harry = Person.builder().firstName("Harry").lastName("Potter").build();
		ron = Person.builder().firstName("Ronald").lastName("Weasley").build();
		hermione = Person.builder().firstName("Hermione").lastName("Granger").build();

		// Participants
		seeker = Participant.builder().person(harry).build();
		keeper = Participant.builder().person(ron).build();
		chaser = Participant.builder().person(hermione).build();
	}

	@Before
	public void reset() {
		entityManager.persistAndFlush(admin);
	}
	
	@After
	public void flushAll() {
		entityManager.remove(admin);
	}

	@Test
	public void contextLoads() {
		assertTrue(true);
	}
}
