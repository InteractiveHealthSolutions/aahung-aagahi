/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.web;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

/**
 * 
 * @author owais.hussain@ihsinformatics.com
 *
 */
@RestController
public class BaseController {

	/**
	 * Called when an exception is caught during execution of a request
	 * 
	 * @param detail
	 * @return
	 */
	protected ResponseEntity<?> dependencyFailure(String detail) {
		if (detail == null) {
			detail = "";
		}
		return new ResponseEntity<>("Dependency check failed while executing the request. " + detail,
		        HttpStatus.FAILED_DEPENDENCY);
	}

	/**
	 * Called when an exception is caught during execution of a request
	 * 
	 * @param detail
	 * @return
	 */
	protected ResponseEntity<?> exceptionFoundResponse(String detail) {
		if (detail == null) {
			detail = "";
		}
		return new ResponseEntity<>("Exception thrown while executing the request. " + detail, HttpStatus.NOT_ACCEPTABLE);
	}

	/**
	 * Converts input from {@link InputStream} into a {@link JSONObject}
	 * 
	 * @param input
	 * @return
	 * @throws IOException
	 * @throws JSONException
	 */
	public JSONObject inputStreamToJson(InputStream input) throws IOException, JSONException {
		StringBuilder sb = new StringBuilder();
		BufferedReader in = new BufferedReader(new InputStreamReader(input));
		String line = null;
		while ((line = in.readLine()) != null) {
			sb.append(line);
		}
		JSONObject json = new JSONObject(sb.toString());
		return json;
	}

	/**
	 * Called when one or more arguments are invalid or missing
	 * 
	 * @param detail
	 * @return
	 */
	protected ResponseEntity<?> invalidArgumentResponse(String detail) {
		if (detail == null) {
			detail = "";
		}
		return new ResponseEntity<>("Argument(s) missing or invalid. " + detail, HttpStatus.NOT_ACCEPTABLE);
	}

	/**
	 * Called when an exception is caught during execution of a request
	 * 
	 * @param detail
	 * @return
	 */
	protected ResponseEntity<?> invalidDataResponse(String detail) {
		if (detail == null) {
			detail = "";
		}
		return new ResponseEntity<>("Invalid values in data found while executing the request. " + detail,
		        HttpStatus.NOT_ACCEPTABLE);
	}

	/**
	 * Called when content is expected but not found in request
	 * 
	 * @param detail
	 * @return
	 */
	protected ResponseEntity<?> noContent(String detail) {
		if (detail == null) {
			detail = "";
		}
		return new ResponseEntity<>("No content found while executing request. " + detail, HttpStatus.NO_CONTENT);
	}

	/**
	 * Called when an entity object is not found against a request
	 * 
	 * @param detail
	 * @return
	 */
	protected ResponseEntity<?> noEntityFoundResponse(String detail) {
		if (detail == null) {
			detail = "";
		}
		return new ResponseEntity<>("No entity found. " + detail, HttpStatus.NOT_FOUND);
	}

	/**
	 * Called when a request is documented, but not implemented
	 * 
	 * @param detail
	 * @return
	 */
	protected ResponseEntity<?> notImplementedResponse(String detail) {
		if (detail == null) {
			detail = "";
		}
		return new ResponseEntity<>("Implementation of this resource not found! " + detail, HttpStatus.NOT_IMPLEMENTED);
	}

	/**
	 * Called when a unique resource is being created multiple times
	 * 
	 * @param detail
	 * @return
	 */
	protected ResponseEntity<?> resourceAlreadyExists(String detail) {
		if (detail == null) {
			detail = "";
		}
		return new ResponseEntity<>("Resource already exists. " + detail,
		        HttpStatus.NOT_ACCEPTABLE);
	}
}
