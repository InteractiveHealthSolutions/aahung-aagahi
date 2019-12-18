/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.web;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.hibernate.HibernateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ihsinformatics.aahung.aagahi.datawarehouse.DatawarehouseRunner;
import com.ihsinformatics.aahung.aagahi.model.FormType;
import com.ihsinformatics.aahung.aagahi.model.Location;
import com.ihsinformatics.aahung.aagahi.service.DatawarehouseService;
import com.ihsinformatics.aahung.aagahi.service.FormService;
import com.ihsinformatics.aahung.aagahi.service.ReportServiceImpl;
import com.ihsinformatics.aahung.aagahi.util.RegexUtil;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import net.sf.jasperreports.engine.JRException;

/**
 * @author owais.hussain@ihsinformatics.com
 */

@RestController
@RequestMapping("/api")
@Api(value = "Report Controller")
public class ReportController extends BaseController {
	
	@Autowired
    private DatawarehouseService datawarehouseService;

    @Autowired
    private FormService formService;

    @Autowired
    private ReportServiceImpl service;
    
    @ApiOperation(value = "Get results from SQL query")
    @GetMapping(value = "/report/query")
    public ResponseEntity<?> queryData(@RequestParam("query") String query) throws HibernateException {
	try {
	    List<String[]> data = service.getTableData(query);
	    if (!data.isEmpty()) {
		return ResponseEntity.ok().body(data);
	    } else {
		return noContent(query);
	    }
	} catch (SQLException e) {
	    return exceptionFoundResponse(query, e);
	}
    }


    @ApiOperation(value = "Download FormData as CSV by UUID/Name/Short Name of the FormType")
    @GetMapping("/report/form/{uuid}")
    public ResponseEntity<?> downloadData(@PathVariable String uuid) {
	try {
	    FormType formType = uuid.matches(RegexUtil.UUID) ? formService.getFormTypeByUuid(uuid)
		    : formService.getFormTypeByName(uuid);
	    String filePath = service.generateFormDataCSV(formType.getShortName());
	    String fileName = "formdata-" + uuid + ".csv";
	    return downloadResponse(filePath, fileName);
	} catch (IOException e) {
	    return exceptionFoundResponse("Downloading data.", e);
	}
    }

    @ApiOperation(value = "Download list of all Definitions as CSV")
    @GetMapping("/report/definitions.csv")
    public ResponseEntity<?> downloadDefinitions() {
	try {
	    String filePath = service.generateDefinitionsCSV();
	    String fileName = "definitions.csv";
	    return downloadResponse(filePath, fileName);
	} catch (IOException e) {
	    return exceptionFoundResponse("Downloading data.", e);
	}
    }

    @ApiOperation(value = "Download list of all Donors as CSV")
    @GetMapping("/report/donors.csv")
    public ResponseEntity<?> downloadDonors() {
	try {
	    String filePath = service.generateDonorsCSV();
	    String fileName = "donors.csv";
	    return downloadResponse(filePath, fileName);
	} catch (IOException e) {
	    return exceptionFoundResponse("Downloading data.", e);
	}
    }

    @ApiOperation(value = "Download list of all Elements as CSV")
    @GetMapping("/report/elements.csv")
    public ResponseEntity<?> downloadElements() {
	try {
	    String filePath = service.generateElementsCSV();
	    String fileName = "elements.csv";
	    return downloadResponse(filePath, fileName);
	} catch (IOException e) {
	    return exceptionFoundResponse("Downloading data.", e);
	}
    }

    @ApiOperation(value = "Download list of all Locaitions as CSV")
    @GetMapping("/report/locations.csv")
    public ResponseEntity<?> downloadLocations() {
	try {
	    String filePath = service.generateLocationsCSV();
	    String fileName = "locations.csv";
	    return downloadResponse(filePath, fileName);
	} catch (IOException e) {
	    return exceptionFoundResponse("Downloading data.", e);
	}
    }

    @ApiOperation(value = "Download list of all Projects as CSV")
    @GetMapping("/report/projects.csv")
    public ResponseEntity<?> downloadProjects() {
	try {
	    String filePath = service.generateProjectsCSV();
	    String fileName = "projects.csv";
	    return downloadResponse(filePath, fileName);
	} catch (IOException e) {
	    return exceptionFoundResponse("Downloading data.", e);
	}
    }

    @ApiOperation(value = "Download list of all Users as CSV")
    @GetMapping("/report/users.csv")
    public ResponseEntity<?> downloadUsers() {
	try {
	    String filePath = service.generateUsersCSV();
	    String fileName = "users.csv";
	    return downloadResponse(filePath, fileName);
	} catch (IOException e) {
	    return exceptionFoundResponse("Downloading data.", e);
	}
    }
    
    @ApiOperation(value = "Download report as csv")
    @GetMapping("/report/csv/{name}")
    public ResponseEntity<?> downloadCsvReport(@PathVariable String name, @RequestParam("start_date")String startDate, @RequestParam("end_date")String endDate,
   		 @RequestParam("province")String province, @RequestParam("city")String city, @RequestParam(required = false) Map<String, String> params) {
	try {
		String filePath = service.generateJasperReport(name, "csv", params);
		String fileName = name+".csv";
		return downloadResponse(filePath, fileName);	
	} catch (JRException | SQLException | IOException e) {
		return exceptionFoundResponse("Downloading data.", e);
	} 
    }
    
    @ApiOperation(value = "Download report as html")
    @GetMapping("/report/html/{name}")
    public ResponseEntity<?> downloadHtmlReport(@PathVariable String name, @RequestParam("start_date")String startDate, @RequestParam("end_date")String endDate,
   		 @RequestParam("province")String province, @RequestParam("city")String city, @RequestParam(required = false) Map<String, String> params) {
	try {
		String filePath = service.generateJasperReport(name, "html", params);
		String fileName = name+".html";
		return downloadResponse(filePath, fileName);	
	} catch (JRException | SQLException | IOException e) {
		return exceptionFoundResponse("Downloading data.", e);
	} 
    }
    
    @ApiOperation(value = "Download report as xls")
    @GetMapping("/report/xls/{name}")
    public ResponseEntity<?> downloadXlsReport(@PathVariable String name, @RequestParam("start_date")String startDate, @RequestParam("end_date")String endDate,
   		 @RequestParam("province")String province, @RequestParam("city")String city, @RequestParam(required = false) Map<String, String> params) {
	try {
		String filePath = service.generateJasperReport(name, "xls", params);
		String fileName = name+".xls";
		return downloadResponse(filePath, fileName);	
	} catch (JRException | SQLException | IOException e) {
		return exceptionFoundResponse("Downloading data.", e);
	} 
    }
    
    @ApiOperation(value = "Download report as pdf")
    @GetMapping("/report/pdf/{name}")
    public ResponseEntity<?> downloadPdfReport(@PathVariable String name, @RequestParam("start_date")String startDate, @RequestParam("end_date")String endDate,
    		@RequestParam("province")String province, @RequestParam("city")String city, @RequestParam(required = false) Map<String, String> params) {
    try {
    	String filePath = service.generateJasperReport(name, "pdf", params);
    	String fileName = name+".pdf";
    	return downloadResponse(filePath, fileName);	
    } catch (JRException | SQLException | IOException e) {
    	return exceptionFoundResponse("Downloading data.", e);
    }
    }

    @ApiOperation(value = "Run DWH")
    @GetMapping("/report/dwh")
    public ResponseEntity<?> runDwhProcess() {
    	datawarehouseService.executeTasks();
    	return ResponseEntity.ok().body("Datawarehouse proccess ended.");
    }
}
