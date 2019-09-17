/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.hibernate.engine.jdbc.connections.spi.ConnectionProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import org.springframework.stereotype.Component;

import com.ihsinformatics.aahung.aagahi.annotation.CheckPrivilege;
import com.ihsinformatics.aahung.aagahi.annotation.MeasureProcessingTime;
import com.opencsv.CSVWriter;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.export.HtmlExporter;
import net.sf.jasperreports.engine.export.JRCsvExporter;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.engine.util.JRSaver;
import net.sf.jasperreports.export.SimpleCsvExporterConfiguration;
import net.sf.jasperreports.export.SimpleCsvReportConfiguration;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleHtmlExporterConfiguration;
import net.sf.jasperreports.export.SimpleHtmlExporterOutput;
import net.sf.jasperreports.export.SimpleHtmlReportConfiguration;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimplePdfExporterConfiguration;
import net.sf.jasperreports.export.SimplePdfReportConfiguration;
import net.sf.jasperreports.export.SimpleWriterExporterOutput;
import net.sf.jasperreports.export.SimpleXlsxExporterConfiguration;
import net.sf.jasperreports.export.SimpleXlsxReportConfiguration;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Component
public class ReportServiceImpl extends BaseService {

	private final Logger LOG = LoggerFactory.getLogger(this.getClass());

	@Value("${report.data.dir}")
	private String dataDirectory;

	@Bean
	public DataSource dataSource() {
		return new EmbeddedDatabaseBuilder().setType(EmbeddedDatabaseType.HSQL).addScript("classpath:employee-schema.sql")
		        .build();
	}

	@MeasureProcessingTime
	@CheckPrivilege(privilege = "View FormData")
	public String generateJasperReport() throws JRException, SQLException {
		InputStream employeeReportStream = getClass().getResourceAsStream("/SampleReport.jrxml");
		JasperReport jasperReport = JasperCompileManager.compileReport(employeeReportStream);
		// Save the report as Jasper to avaoid compilation in the future
		JRSaver.saveObject(jasperReport, "employeeReport.jasper");
		// Attach parameters
		Map<String, Object> parameters = new HashMap<>();
		parameters.put("title", "Employee Report");
		parameters.put("minSalary", 15000.0);
		parameters.put("condition", " LAST_NAME ='Smith' ORDER BY FIRST_NAME");

		// Fill report on provided data source
		JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource().getConnection());

		// Export to PDF
		exportAsHTML(jasperPrint, "report.html");
		exportAsCSV(jasperPrint, "report.csv");
		exportAsXLS(jasperPrint, "report.xls");
		exportAsPDF(jasperPrint, "report.pdf");
		return "";
	}

	public void exportAsHTML(JasperPrint jasperPrint, String filePath) throws JRException {
		HtmlExporter exporter = new HtmlExporter();
		// Set input
		exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
		// Set output
		exporter.setExporterOutput(new SimpleHtmlExporterOutput(filePath));
		// Report config
		SimpleHtmlReportConfiguration reportConfig = new SimpleHtmlReportConfiguration();
		exporter.setConfiguration(reportConfig);
		// Export config
		SimpleHtmlExporterConfiguration exportConfig = new SimpleHtmlExporterConfiguration();
		exporter.setConfiguration(exportConfig);
		exporter.exportReport();
	}

	public void exportAsCSV(JasperPrint jasperPrint, String filePath) throws JRException {
		JRCsvExporter exporter = new JRCsvExporter();
		// Set input
		exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
		// Set output
		exporter.setExporterOutput(new SimpleWriterExporterOutput(filePath));
		// Report config
		SimpleCsvReportConfiguration reportConfig = new SimpleCsvReportConfiguration();
		exporter.setConfiguration(reportConfig);
		// Export config
		SimpleCsvExporterConfiguration exportConfig = new SimpleCsvExporterConfiguration();
		exporter.setConfiguration(exportConfig);
		exporter.exportReport();
	}

	public void exportAsXLS(JasperPrint jasperPrint, String filePath) throws JRException {
		JRXlsxExporter exporter = new JRXlsxExporter();
		// Set input
		exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
		// Set output
		exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(filePath));
		// Report config
		SimpleXlsxReportConfiguration reportConfig = new SimpleXlsxReportConfiguration();
		exporter.setConfiguration(reportConfig);
		reportConfig.setSheetNames(new String[] { "Employee Data" });
		// Export config
		SimpleXlsxExporterConfiguration exportConfig = new SimpleXlsxExporterConfiguration();
		exporter.setConfiguration(exportConfig);
		exporter.exportReport();
	}

	public void exportAsPDF(JasperPrint jasperPrint, String filePath) throws JRException {
		JRPdfExporter exporter = new JRPdfExporter();
		// Set input
		exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
		// Set output
		exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(filePath));
		// Report config
		SimplePdfReportConfiguration reportConfig = new SimplePdfReportConfiguration();
		reportConfig.setSizePageToContent(true);
		reportConfig.setForceLineBreakPolicy(false);
		exporter.setConfiguration(reportConfig);
		// Export config
		SimplePdfExporterConfiguration exportConfig = new SimplePdfExporterConfiguration();
		exportConfig.setMetadataAuthor("IHS");
		exportConfig.setEncrypted(true);
		exportConfig.setAllowedPermissionsHint("PRINTING");
		exporter.setConfiguration(exportConfig);
		exporter.exportReport();
	}

	@MeasureProcessingTime
	@CheckPrivilege(privilege = "View Definition")
	public String generateDefinitionsCSV() throws FileNotFoundException {
		StringBuilder query = new StringBuilder();
		query.append(
		    "select d.definition_id, d.uuid, t.short_name as definition_type, d.definition, d.short_name, d.description, d.retired, d.date_created from definition as d ");
		query.append("inner join definition_type as t on t.definition_type_id = d.definition_type_id ");
		String fileName = "definitions.csv";
		String filePath = dataDirectory + fileName;
		PrintWriter writer = new PrintWriter(filePath);
		try (CSVWriter csvWriter = new CSVWriter(writer, CSVWriter.DEFAULT_SEPARATOR, CSVWriter.DEFAULT_QUOTE_CHARACTER,
		        CSVWriter.DEFAULT_ESCAPE_CHARACTER, CSVWriter.DEFAULT_LINE_END);) {
			ResultSet data = getTableData(query.toString());
			csvWriter.writeAll(data, true);
		}
		catch (SQLException | IOException e) {
			LOG.error(e.getMessage());
		}
		return filePath;
	}

	@MeasureProcessingTime
	@CheckPrivilege(privilege = "View Donor")
	public String generateDonorsCSV() throws FileNotFoundException {
		StringBuilder query = new StringBuilder();
		query.append(
		    "select d.donor_id, d.uuid, d.donor_name, d.short_name, c.username as created_by, d.date_created, d.voided from donor as d ");
		query.append("inner join users as c on c.user_id = d.created_by ");
		String fileName = "donors.csv";
		String filePath = dataDirectory + fileName;
		PrintWriter writer = new PrintWriter(filePath);
		try (CSVWriter csvWriter = new CSVWriter(writer, CSVWriter.DEFAULT_SEPARATOR, CSVWriter.DEFAULT_QUOTE_CHARACTER,
		        CSVWriter.DEFAULT_ESCAPE_CHARACTER, CSVWriter.DEFAULT_LINE_END);) {
			ResultSet data = getTableData(query.toString());
			csvWriter.writeAll(data, true);
		}
		catch (SQLException | IOException e) {
			LOG.error(e.getMessage());
		}
		return filePath;
	}

	@MeasureProcessingTime
	@CheckPrivilege(privilege = "View Element")
	public String generateElementsCSV() throws FileNotFoundException {
		StringBuilder query = new StringBuilder();
		query.append(
		    "select e.element_id, e.uuid, e.element_name, e.description, e.short_name, e.datatype, e.validation_regex, e.date_created, e.retired from element as e ");
		String fileName = "elements.csv";
		String filePath = dataDirectory + fileName;
		PrintWriter writer = new PrintWriter(filePath);
		try (CSVWriter csvWriter = new CSVWriter(writer, CSVWriter.DEFAULT_SEPARATOR, CSVWriter.DEFAULT_QUOTE_CHARACTER,
		        CSVWriter.DEFAULT_ESCAPE_CHARACTER, CSVWriter.DEFAULT_LINE_END);) {
			ResultSet data = getTableData(query.toString());
			csvWriter.writeAll(data, true);
		}
		catch (SQLException | IOException e) {
			LOG.error(e.getMessage());
		}
		return filePath;
	}

	@MeasureProcessingTime
	@CheckPrivilege(privilege = "View FormData")
	public String generateFormDataCSV(String formTypeName) throws FileNotFoundException {
		StringBuilder query = new StringBuilder();
		query.append("select t.short_name as form_type, l.short_name as location, f.* from _");
		query.append(formTypeName.toLowerCase());
		query.append(" as f ");
		query.append("inner join form_type as t on t.form_type_id = f.form_type_id ");
		query.append("left outer join location as l on l.location_id = f.location_id ");
		String fileName = "formdata-" + formTypeName + ".csv";
		String filePath = dataDirectory + fileName;
		PrintWriter writer = new PrintWriter(filePath);
		try (CSVWriter csvWriter = new CSVWriter(writer, CSVWriter.DEFAULT_SEPARATOR, CSVWriter.DEFAULT_QUOTE_CHARACTER,
		        CSVWriter.DEFAULT_ESCAPE_CHARACTER, CSVWriter.DEFAULT_LINE_END);) {
			ResultSet data = getTableData(query.toString());
			csvWriter.writeAll(data, true);
		}
		catch (SQLException | IOException e) {
			LOG.error(e.getMessage());
		}
		return filePath;
	}

	@MeasureProcessingTime
	@CheckPrivilege(privilege = "View Location")
	public String generateLocationsCSV() throws FileNotFoundException {
		StringBuilder query = new StringBuilder();
		query.append(
		    "select l.location_id, l.uuid, l.location_name, l.short_name, l.description, d.short_name as category, p.short_name as parent_location, l.address1, l.address2, l.address3, l.city_village, l.state_province, l.country, l.email, l.landmark1, l.landmark2, l.latitude, l.longitude, l.postal_code, l.primary_contact, l.primary_contact_person, l.secondary_contact, l.secondary_contact_person, l.tertiary_contact, l.tertiary_contact_person, c.username as created_by, l.date_created, l.voided from location as l ");
		query.append("inner join definition as d on d.definition_id = l.category ");
		query.append("left outer join location as p on p.location_id = l.parent_location ");
		query.append("inner join users as c on c.user_id = l.created_by ");
		String fileName = "locations.csv";
		String filePath = dataDirectory + fileName;
		PrintWriter writer = new PrintWriter(filePath);
		try (CSVWriter csvWriter = new CSVWriter(writer, CSVWriter.DEFAULT_SEPARATOR, CSVWriter.DEFAULT_QUOTE_CHARACTER,
		        CSVWriter.DEFAULT_ESCAPE_CHARACTER, CSVWriter.DEFAULT_LINE_END);) {
			ResultSet data = getTableData(query.toString());
			csvWriter.writeAll(data, true);
		}
		catch (SQLException | IOException e) {
			LOG.error(e.getMessage());
		}
		return filePath;
	}

	@MeasureProcessingTime
	@CheckPrivilege(privilege = "View Project")
	public String generateProjectsCSV() throws FileNotFoundException {
		StringBuilder query = new StringBuilder();
		query.append(
		    "select p.project_id, p.uuid, p.project_name, p.short_name, d.short_name as donor, c.username as created_by, p.date_created, p.voided from project as p ");
		query.append("inner join donor as d on d.donor_id = p.donor_id ");
		query.append("inner join users as c on c.user_id = p.created_by ");
		String fileName = "projects.csv";
		String filePath = dataDirectory + fileName;
		PrintWriter writer = new PrintWriter(filePath);
		try (CSVWriter csvWriter = new CSVWriter(writer, CSVWriter.DEFAULT_SEPARATOR, CSVWriter.DEFAULT_QUOTE_CHARACTER,
		        CSVWriter.DEFAULT_ESCAPE_CHARACTER, CSVWriter.DEFAULT_LINE_END);) {
			ResultSet data = getTableData(query.toString());
			csvWriter.writeAll(data, true);
		}
		catch (SQLException | IOException e) {
			LOG.error(e.getMessage());
		}
		return filePath;
	}

	@MeasureProcessingTime
	@CheckPrivilege(privilege = "View User")
	public String generateUsersCSV() throws FileNotFoundException {
		String query = "select u.user_id, u.uuid, u.username, u.full_name, u.voided, u.date_created from users as u ";
		String fileName = "users.csv";
		String filePath = dataDirectory + fileName;
		PrintWriter writer = new PrintWriter(filePath);
		try (CSVWriter csvWriter = new CSVWriter(writer, CSVWriter.DEFAULT_SEPARATOR, CSVWriter.DEFAULT_QUOTE_CHARACTER,
		        CSVWriter.DEFAULT_ESCAPE_CHARACTER, CSVWriter.DEFAULT_LINE_END);) {
			ResultSet data = getTableData(query);
			csvWriter.writeAll(data, true);
		}
		catch (SQLException | IOException e) {
			LOG.error(e.getMessage());
		}
		return filePath;
	}

	private ResultSet getTableData(String sql) throws SQLException {
		Connection conn;
		conn = getSession().getSessionFactory().getSessionFactoryOptions().getServiceRegistry()
		        .getService(ConnectionProvider.class).getConnection();
		Statement statement = conn.createStatement();
		ResultSet resultSet = statement.executeQuery(sql);
		return resultSet;
	}
}
