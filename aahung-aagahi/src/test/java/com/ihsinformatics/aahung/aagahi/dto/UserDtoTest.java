/**
 * 
 */
package com.ihsinformatics.aahung.aagahi.dto;

import static org.junit.Assert.assertNotNull;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.UUID;

import org.junit.Before;
import org.junit.Test;

import com.ihsinformatics.aahung.aagahi.BaseServiceTest;
import com.ihsinformatics.aahung.aagahi.model.User;

/**
 * @author owais.hussain@ihsinformatics.com
 */
public class UserDtoTest extends BaseServiceTest {

	private UserDto userDto;

	@Before
	public void reset() {
		userDto = new UserDto(1, "nymphadora.tonks", "Nymphadora Tonks", UUID.randomUUID().toString(), new ArrayList<>(),
		        new ArrayList<>());
	}

	@Test
	public void shouldConvertFromUser() {
		initUserAttributeTypes();
		initUserAttributes();
		tonks = User.builder().userId(1).username("nymphadora.tonks").fullName("Nymphadora Tonks")
		        .attributes(Arrays.asList(tonksBlood, tonksPatronus)).build();
		tonks.setPassword("Stupify");
		assertNotNull(new UserDto(tonks));
	}

	@Test
	public void shouldConvertToUser() {
		assertNotNull(userDto.toUser(userService));
	}
}
