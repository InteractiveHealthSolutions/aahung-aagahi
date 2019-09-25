/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
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
