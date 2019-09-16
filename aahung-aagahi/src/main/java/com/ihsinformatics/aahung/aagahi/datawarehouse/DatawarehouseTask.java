/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.datawarehouse;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

import org.hibernate.engine.jdbc.connections.spi.ConnectionProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ihsinformatics.aahung.aagahi.service.BaseService;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Component
public class DatawarehouseTask implements Runnable {

    private final Logger LOG = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private BaseService baseService;

    private List<Queue<String>> tasks;

    public DatawarehouseTask(List<Queue<String>> queryTasks) {
	this.tasks = queryTasks;
    }

    /**
     * Execute the queries given in the task queue
     */
    public void run() {
	if (tasks == null) {
	    return;
	}
	for (Queue<String> task : tasks) {
	    try {
		for (String query : task) {
		    executeSQL(query, false);
		}
	    } catch (SQLException e) {
		LOG.error(e.getMessage());
	    }
	}
    }

    public List<List<Object>> executeSQL(String sql, boolean selectOnly) throws SQLException {
	boolean dml = false;
	String sqlLower = sql.toLowerCase();
	if (sqlLower.startsWith("insert") || sqlLower.startsWith("update") || sqlLower.startsWith("delete")
		|| sqlLower.startsWith("alter") || sqlLower.startsWith("drop") || sqlLower.startsWith("create")
		|| sqlLower.startsWith("rename")) {
	    dml = true;
	}
	if (selectOnly && dml)
	    throw new IllegalArgumentException("Illegal command(s) found in query");
	PreparedStatement ps = null;
	List<List<Object>> results = new ArrayList<>();
	ResultSet resultSet = null;
	try {
	    Connection conn = baseService.getSession().getSessionFactory().getSessionFactoryOptions()
		    .getServiceRegistry().getService(ConnectionProvider.class).getConnection();
	    ps = conn.prepareStatement(sql);
	    if (dml) {
		Integer i = ps.executeUpdate();
		List<Object> row = new ArrayList<>();
		row.add(i);
		results.add(row);
	    } else {
		resultSet = ps.executeQuery();
		ResultSetMetaData rmd = resultSet.getMetaData();
		int columnCount = rmd.getColumnCount();
		while (resultSet.next()) {
		    List<Object> rowObjects = new ArrayList<>();
		    for (int x = 1; x <= columnCount; x++) {
			rowObjects.add(resultSet.getObject(x));
		    }
		    results.add(rowObjects);
		}
	    }
	} catch (Exception e) {
	    throw new SQLException("Error while executing sql: " + sql + " . Message: " + e.getMessage(), e);
	} finally {
	    if (resultSet != null) {
		resultSet.close();
	    }
	    if (ps != null) {
		try {
		    ps.close();
		} catch (SQLException e) {
		    LOG.error("Error generated while closing SQL connection", e);
		}
	    }
	}
	return results;
    }
}
