/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.repository;

import static org.junit.Assert.assertNotNull;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.ihsinformatics.aahung.aagahi.BaseTestData;
import com.ihsinformatics.aahung.aagahi.model.Definition;
import com.ihsinformatics.aahung.aagahi.model.Element;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(SpringRunner.class)
@DataJpaTest
public class DefinitionRepositoryTest extends BaseTestData {

	@Autowired
	private DefinitionRepository roleRepository;
	
	@Before
	public void reset() {
		super.reset();
		country = entityManager.persistAndFlush(country);
		initDefinitions();
	}

	@Test
	public void shouldSave() {
		scotland = roleRepository.save(scotland);
		roleRepository.flush();
		Definition found = entityManager.find(Definition.class, scotland.getDefinitionId());
		assertNotNull(found);
	}

	@Test
	public void shouldDelete() {
		// TODO
	}

	@Test
	public void shouldFindById() throws Exception {
		// TODO
	}

	@Test
	public void shouldFindByUuid() throws Exception {
		// TODO
	}

	@Test
	public void shouldFindByName() {
		// TODO
	}

	@Test
	public void shouldFindByShortName() {
		// TODO
	}
}
