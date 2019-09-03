package com.ihsinformatics.aahung.aagahi.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BaseController {

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
}
