/**
 * 
 */
package com.ihsinformatics.aahung.aagahi.dto;

import static org.junit.Assert.assertNotNull;

import java.util.UUID;

import org.junit.Before;
import org.junit.Test;

import com.ihsinformatics.aahung.aagahi.BaseServiceTest;
import com.ihsinformatics.aahung.aagahi.model.FormType;

/**
 * @author owais.hussain@ihsinformatics.com
 */
public class FormTypeDtoTest extends BaseServiceTest {

	private FormTypeDto formTypeDto;

	@Before
	public void reset() {
		formTypeDto = new FormTypeDto(1, "Quidditch Registration Form", "QF", 1, null, null,
				UUID.randomUUID().toString());
	}

	@Test
	public void shouldConvertFromFormType() {
		quidditchForm = FormType.builder().formTypeId(1).formName("Quidditch Form").shortName("QF").version(1)
				.formSchema("").build();
		assertNotNull(new FormTypeDto(quidditchForm));
	}

	@Test
	public void shouldConvertToFormType() {
		assertNotNull(formTypeDto.toFormType(metadataService));
	}
}
