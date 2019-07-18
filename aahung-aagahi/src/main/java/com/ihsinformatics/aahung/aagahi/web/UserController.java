/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi.web;

import java.net.URI;
import java.net.URISyntaxException;
import java.rmi.AlreadyBoundException;
import java.util.Collection;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ihsinformatics.aahung.aagahi.model.User;
import com.ihsinformatics.aahung.aagahi.service.UserService;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@RestController
@RequestMapping("/api")
public class UserController {

	private final Logger log = LoggerFactory.getLogger(UserController.class);

	private UserService service;

	public UserController(UserService service) {
		this.service = service;
	}

	@GetMapping("/users")
	public Collection<User> users() {
		return service.getUsers();
	}

	@GetMapping("/user/{uuid}")
	public ResponseEntity<User> getUser(@PathVariable String uuid) {
		Optional<User> user = Optional.of(service.getUser(uuid));
		return user.map(response -> ResponseEntity.ok().body(response))
		        .orElse(new ResponseEntity<User>(HttpStatus.NOT_FOUND));
	}

	@PostMapping("/user")
	public ResponseEntity<User> createUser(@Valid @RequestBody User user) throws URISyntaxException, AlreadyBoundException {
		log.info("Request to create user: {}", user);
		User result = service.saveUsers(user);
		return ResponseEntity.created(new URI("/api/user/" + result.getUuid())).body(result);
	}

	@PutMapping("/user/{uuid}")
	public ResponseEntity<User> updateUser(@PathVariable String uuid, @Valid @RequestBody User user) {
		user.setUuid(uuid);
		log.info("Request to update user: {}", user);
		User result = service.updateUsers(user);
		return ResponseEntity.ok().body(result);
	}

	@DeleteMapping("/user/{uuid}")
	public ResponseEntity<?> deleteUser(@PathVariable String uuid) {
		log.info("Request to delete user: {}", uuid);
		service.deleteUsers(service.getUser(uuid));
		return ResponseEntity.ok().build();
	}
}
