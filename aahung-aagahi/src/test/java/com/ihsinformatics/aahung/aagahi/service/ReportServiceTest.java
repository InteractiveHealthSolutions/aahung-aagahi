/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.Mockito.when;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.engine.jdbc.connections.spi.ConnectionProvider;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.ihsinformatics.aahung.aagahi.BaseRepositoryData;
import com.ihsinformatics.aahung.aagahi.BaseServiceTest;
import com.ihsinformatics.aahung.aagahi.model.User;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RunWith(SpringRunner.class)
@DataJpaTest
public class ReportServiceTest extends BaseRepositoryData {

    @Mock
    private BaseService baseService;

    @InjectMocks
    private ReportServiceImpl reportService;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
	super.reset();
	MockitoAnnotations.initMocks(this);
	reportService.setDataDirectory("../");
    }

    public String[] readLines(String filePath) {
	File file = new File(filePath);
	ArrayList<String> lines = new ArrayList<String>();
	try {
	    FileInputStream fis = new FileInputStream(file);
	    DataInputStream dis = new DataInputStream(fis);
	    BufferedReader br = new BufferedReader(new InputStreamReader(dis));
	    String strLine;
	    while ((strLine = br.readLine()) != null) {
		lines.add(strLine);
	    }
	    dis.close();
	} catch (IOException e) {
	    e.printStackTrace();
	}
	return lines.toArray(new String[] {});
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.service.ReportServiceImpl#generateJasperReport()}.
     */
    @Test
    public void testGenerateJasperReport() {
	fail("Not yet implemented"); // TODO
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.service.ReportServiceImpl#exportAsHTML(net.sf.jasperreports.engine.JasperPrint, java.lang.String)}.
     */
    @Test
    public void testExportAsHTML() {
	fail("Not yet implemented"); // TODO
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.service.ReportServiceImpl#exportAsCSV(net.sf.jasperreports.engine.JasperPrint, java.lang.String)}.
     */
    @Test
    public void testExportAsCSV() {
	fail("Not yet implemented"); // TODO
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.service.ReportServiceImpl#exportAsXLS(net.sf.jasperreports.engine.JasperPrint, java.lang.String)}.
     */
    @Test
    public void testExportAsXLS() {
	fail("Not yet implemented"); // TODO
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.service.ReportServiceImpl#exportAsPDF(net.sf.jasperreports.engine.JasperPrint, java.lang.String)}.
     */
    @Test
    public void testExportAsPDF() {
	fail("Not yet implemented"); // TODO
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.service.ReportServiceImpl#generateDefinitionsCSV()}.
     */
    @Test
    public void testGenerateDefinitionsCSV() {
	fail("Not yet implemented"); // TODO
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.service.ReportServiceImpl#generateDonorsCSV()}.
     */
    @Test
    public void testGenerateDonorsCSV() {
	fail("Not yet implemented"); // TODO
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.service.ReportServiceImpl#generateElementsCSV()}.
     */
    @Test
    public void testGenerateElementsCSV() {
	fail("Not yet implemented"); // TODO
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.service.ReportServiceImpl#generateFormDataCSV(java.lang.String)}.
     */
    @Test
    public void testGenerateFormDataCSV() {
	fail("Not yet implemented"); // TODO
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.service.ReportServiceImpl#generateLocationsCSV()}.
     */
    @Test
    public void testGenerateLocationsCSV() {
	fail("Not yet implemented"); // TODO
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.service.ReportServiceImpl#generateProjectsCSV()}.
     */
    @Test
    public void testGenerateProjectsCSV() {
	fail("Not yet implemented"); // TODO
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.service.ReportServiceImpl#generateUsersCSV()}.
     * 
     * @throws FileNotFoundException
     */
    @Test
    public void testGenerateUsersCSV() throws FileNotFoundException {
	// Insert some users
	initUsers();
	List<User> users = Arrays.asList(snape, tonks, umbridge, luna, fred, george, lily);
	for (User user : users) {
	    entityManager.persist(user);
	}
	entityManager.flush();
	String filePath = reportService.generateUsersCSV();
	String[] lines = readLines(filePath);
	assertEquals(users.size(), lines.length);
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.service.ReportServiceImpl#getResultSet(java.lang.String)}.
     * 
     * @throws SQLException
     */
    @Test
    public void testGetResultSet() throws SQLException {
	ResultSet resultSet = reportService.getResultSet("select * from privileges");
	assertNotNull(resultSet);
    }

    /**
     * Test method for
     * {@link com.ihsinformatics.aahung.aagahi.service.ReportServiceImpl#getTableData(java.lang.String, java.lang.Integer, java.lang.Integer)}.
     * 
     * @throws SQLException
     */
    @Test
    public void testGetTableData() throws SQLException {
	List<String[]> data = reportService.getTableData("select * from privileges", null, null);
	assertFalse(data.isEmpty());
    }
}
