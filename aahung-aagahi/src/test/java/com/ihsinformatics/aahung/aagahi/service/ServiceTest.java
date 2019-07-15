/**
 * 
 */
package com.ihsinformatics.aahung.aagahi.service;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyZeroInteractions;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.repository.ParticipantRepository;

/**
 * @author owais.hussain@ihsinformatics.com
 */
public class ServiceTest {

	@Mock
	private ParticipantRepository participantRepository;

	@Mock
	MongoTemplate mongoTemplate;

	@InjectMocks
	private ServiceImpl service;

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
		MockitoAnnotations.initMocks(this);
	}

	@Test
	public void shouldReturnNull() {
		Participant participant = mock(Participant.class);
		assertNotNull(participant);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ServiceImpl#getParticipant(java.lang.String)}.
	 */
	@Test
	public void testGetParticipant() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ServiceImpl#getParticipants()}.
	 */
	@Test
	public void testGetParticipants() {
		Participant owais = new Participant("Owais", "Hussain");
		Participant rabbia = new Participant("Rabbia", "Hassan");
		Participant tahira = new Participant("Tahira", "Niazi");
		List<Participant> list = Arrays.asList(owais, rabbia, tahira);
		when(service.getParticipants()).thenReturn(list);
		assertThat(list, Matchers.hasItems(owais, rabbia, tahira));
		verify(participantRepository, times(1)).findAll();
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ServiceImpl#getParticipantsByName(java.lang.String)}.
	 */
	@Test
	public void testGetParticipantsByName() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ServiceImpl#getParticipantsByName(java.lang.String)}.
	 */
	@Test
	public void shouldThrowExceptionOnGetAdminParticipant() {
		when(participantRepository.findByParticipantName(anyString(), anyString(), anyString()))
		        .thenThrow(SecurityException.class);
		List<Participant> admin = service.getParticipantsByName("admin");
		assertNull(admin);
		verifyZeroInteractions(participantRepository);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ServiceImpl#saveParticipant(com.ihsinformatics.aahung.aagahi.model.Participant)}.
	 */
	@Test
	public void testSaveParticipant() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ServiceImpl#updateParticipant(com.ihsinformatics.aahung.aagahi.model.Participant)}.
	 */
	@Test
	public void testUpdateParticipant() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ServiceImpl#deleteParticipant(com.ihsinformatics.aahung.aagahi.model.Participant)}.
	 */
	@Test
	public void testDeleteParticipant() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ServiceImpl#getEvent(java.lang.String)}.
	 */
	@Test
	public void testGetEvent() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for {@link com.ihsinformatics.aahung.aagahi.service.ServiceImpl#getEvents()}.
	 */
	@Test
	public void testGetEvents() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ServiceImpl#getEventsByTitle(java.lang.String)}.
	 */
	@Test
	public void testGetEventsByTitle() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ServiceImpl#getEvents(java.time.Instant, java.time.Instant)}.
	 */
	@Test
	public void testGetEventsInstantInstant() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ServiceImpl#saveEvent(com.ihsinformatics.aahung.aagahi.model.Event)}.
	 */
	@Test
	public void testSaveEvent() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ServiceImpl#updateEvent(com.ihsinformatics.aahung.aagahi.model.Event)}.
	 */
	@Test
	public void testUpdateEvent() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ServiceImpl#deleteEvent(com.ihsinformatics.aahung.aagahi.model.Event)}.
	 */
	@Test
	public void testDeleteEvent() {
		fail("Not yet implemented");
	}

}
