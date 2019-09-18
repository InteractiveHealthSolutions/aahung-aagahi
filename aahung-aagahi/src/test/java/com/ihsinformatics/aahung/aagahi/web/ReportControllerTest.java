/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.web;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ihsinformatics.aahung.aagahi.BaseTestData;
import com.ihsinformatics.aahung.aagahi.service.FormService;
import com.ihsinformatics.aahung.aagahi.service.ReportServiceImpl;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(MockitoJUnitRunner.class)
public class ReportControllerTest extends BaseTestData {

	private static String API_PREFIX = "/api/";

	private MockMvc mockMvc;

	@Mock
	private FormService formService;

	@Mock
	private ReportServiceImpl service;

	@InjectMocks
	private ReportController reportController;

	private String fileName;

	@Before
	public void reset() {
		super.initData();
		MockitoAnnotations.initMocks(this);
		mockMvc = MockMvcBuilders.standaloneSetup(reportController).alwaysDo(MockMvcResultHandlers.print()).build();
		ClassLoader classLoader = getClass().getClassLoader();
		File file = new File(classLoader.getResource("application.properties").getFile());
		fileName = file.getPath();
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.ReportController#downloadData(java.lang.String)}.
	 * 
	 * @throws Exception
	 */
	@Test
	public void testDownloadData() throws Exception {
		when(formService.getFormTypeByName(any(String.class))).thenReturn(quidditchForm);
		when(service.generateFormDataCSV(any(String.class))).thenReturn(fileName);
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "report/form/{uuid}", quidditchForm.getShortName()));
		actions.andExpect(status().isOk());
		byte[] expected = Files.readAllBytes(Paths.get(fileName));
		actions.andExpect(content().bytes(expected));
		verify(service, times(1)).generateFormDataCSV(any(String.class));
		verify(formService, times(1)).getFormTypeByName(any(String.class));
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.ReportController#downloadDefinitions()}.
	 * @throws Exception 
	 */
	@Test
	public void testDownloadDefinitions() throws Exception {
		when(service.generateDefinitionsCSV()).thenReturn(fileName);
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "report/definitions.csv"));
		actions.andExpect(status().isOk());
		byte[] expected = Files.readAllBytes(Paths.get(fileName));
		actions.andExpect(content().bytes(expected));
		verify(service, times(1)).generateDefinitionsCSV();
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.ReportController#downloadDonors()}.
	 * @throws Exception 
	 */
	@Test
	public void testDownloadDonors() throws Exception {
		when(service.generateDonorsCSV()).thenReturn(fileName);
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "report/donors.csv"));
		actions.andExpect(status().isOk());
		byte[] expected = Files.readAllBytes(Paths.get(fileName));
		actions.andExpect(content().bytes(expected));
		verify(service, times(1)).generateDonorsCSV();
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.ReportController#downloadElements()}.
	 * @throws Exception 
	 */
	@Test
	public void testDownloadElements() throws Exception {
		when(service.generateElementsCSV()).thenReturn(fileName);
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "report/elements.csv"));
		actions.andExpect(status().isOk());
		byte[] expected = Files.readAllBytes(Paths.get(fileName));
		actions.andExpect(content().bytes(expected));
		verify(service, times(1)).generateElementsCSV();
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.ReportController#downloadLocations()}.
	 * @throws Exception 
	 */
	@Test
	public void testDownloadLocations() throws Exception {
		when(service.generateLocationsCSV()).thenReturn(fileName);
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "report/locations.csv"));
		actions.andExpect(status().isOk());
		byte[] expected = Files.readAllBytes(Paths.get(fileName));
		actions.andExpect(content().bytes(expected));
		verify(service, times(1)).generateLocationsCSV();

	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.ReportController#downloadProjects()}.
	 * @throws Exception 
	 */
	@Test
	public void testDownloadProjects() throws Exception {
		when(service.generateProjectsCSV()).thenReturn(fileName);
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "report/projects.csv"));
		actions.andExpect(status().isOk());
		byte[] expected = Files.readAllBytes(Paths.get(fileName));
		actions.andExpect(content().bytes(expected));
		verify(service, times(1)).generateProjectsCSV();
	}

	/**
	 * Test method for
	 * {@link com.ihsinformatics.aahung.aagahi.web.ReportController#downloadUsers()}.
	 * @throws Exception 
	 */
	@Test
	public void testDownloadUsers() throws Exception {
		when(service.generateUsersCSV()).thenReturn(fileName);
		ResultActions actions = mockMvc.perform(get(API_PREFIX + "report/users.csv"));
		actions.andExpect(status().isOk());
		byte[] expected = Files.readAllBytes(Paths.get(fileName));
		actions.andExpect(content().bytes(expected));
		verify(service, times(1)).generateUsersCSV();
	}
}
