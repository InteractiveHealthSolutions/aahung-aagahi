package com.ihsinformatics.aahung.aagahi;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.model.Person;

@RunWith(SpringRunner.class)
@SpringBootTest
public class BaseTest {

	protected static Person cathy;

	protected static Person tara;

	protected static Person elizabeth;

	protected static Participant blossom;

	protected static Participant bubbles;

	protected static Participant buttercup;

	@Before
	public void init() {
		cathy = Person.builder().firstName("Cathy").lastName("Blossom").build();
		tara = Person.builder().firstName("Tara").lastName("Bubbles").build();
		elizabeth = Person.builder().firstName("Elizabeth").lastName("Buttercup").build();

		blossom = Participant.builder().person(cathy).build();
		bubbles = Participant.builder().person(tara).build();
		buttercup = Participant.builder().person(elizabeth).build();

	}

	@Test
	public void contextLoads() {
	}

}
