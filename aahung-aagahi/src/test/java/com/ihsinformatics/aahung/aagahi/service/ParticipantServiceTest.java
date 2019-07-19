/**
 * 
 */
package com.ihsinformatics.aahung.aagahi.service;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
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

import com.ihsinformatics.aahung.aagahi.BaseTest;
import com.ihsinformatics.aahung.aagahi.model.Participant;
import com.ihsinformatics.aahung.aagahi.repository.ParticipantRepository;

/**
 * @author owais.hussain@ihsinformatics.com
 */
public class ParticipantServiceTest extends BaseTest {

	@Mock
	private ParticipantRepository participantRepository;

	@InjectMocks
	private ParticipantServiceImpl participantService;

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
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#getParticipant(java.lang.String)}.
	 */
	@Test
	public void testGetParticipant() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#getParticipants()}.
	 */
	@Test
	public void testGetParticipants() {
		when(participantRepository.findAll()).thenReturn(Arrays.asList(seeker, keeper, chaser));
		List<Participant> list = participantService.getParticipants();
		assertThat(list, Matchers.hasItems(seeker, keeper, chaser));
		verify(participantRepository, times(1)).findAll();
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#getParticipantsByName(java.lang.String)}.
	 */
	@Test
	public void testGetParticipantsByName() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#getParticipantsByName(java.lang.String)}.
	 */
	@Test
	public void shouldThrowExceptionOnGetAdminParticipant() {
		List<Participant> admin = participantService.getParticipantsByName("admin");
		assertTrue(admin.isEmpty());
		verifyZeroInteractions(participantRepository);
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#saveParticipant(com.ihsinformatics.aahung.aagahi.model.Participant)}.
	 */
	@Test
	public void testSaveParticipant() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#updateParticipant(com.ihsinformatics.aahung.aagahi.model.Participant)}.
	 */
	@Test
	public void testUpdateParticipant() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#deleteParticipant(com.ihsinformatics.aahung.aagahi.model.Participant)}.
	 */
	@Test
	public void testDeleteParticipant() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#getEvent(java.lang.String)}.
	 */
	@Test
	public void testGetEvent() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#getEvents()}.
	 */
	@Test
	public void testGetEvents() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#getEventsByTitle(java.lang.String)}.
	 */
	@Test
	public void testGetEventsByTitle() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#getEvents(java.time.Instant, java.time.Instant)}.
	 */
	@Test
	public void testGetEventsInstantInstant() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#saveEvent(com.ihsinformatics.aahung.aagahi.model.Event)}.
	 */
	@Test
	public void testSaveEvent() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#updateEvent(com.ihsinformatics.aahung.aagahi.model.Event)}.
	 */
	@Test
	public void testUpdateEvent() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.service.ParticipantServiceImpl#deleteEvent(com.ihsinformatics.aahung.aagahi.model.Event)}.
	 */
	@Test
	public void testDeleteEvent() {
		fail("Not yet implemented");
	}

}
