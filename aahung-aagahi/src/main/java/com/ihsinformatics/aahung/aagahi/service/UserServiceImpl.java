/**
 * 
 */
package com.ihsinformatics.aahung.aagahi.service;

import java.rmi.AlreadyBoundException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ihsinformatics.aahung.aagahi.model.User;
import com.ihsinformatics.aahung.aagahi.repository.UserRepository;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Component
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getParticipant(java.lang.String)
	 */
	@Override
	public User getUser(String uuid) {
		return userRepository.findByUuid(uuid);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getUsers()
	 */
	@Override
	public List<User> getUsers() {
		return userRepository.findAll();
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getUserByUsername(java.lang.String)
	 */
	@Override
	public User getUserByUsername(String username) {
		return userRepository.findByUsername(username);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getUsersByName(java.lang.String)
	 */
	@Override
	public List<User> getUsersByFullName(String fullName) {
		return userRepository.findByFullName(fullName);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#saveUsers(com.ihsinformatics.aahung.aagahi.model.User)
	 */
	@Override
	public User saveUsers(User user) throws AlreadyBoundException {
		if (getUser(user.getUsername()) != null) {
			throw new AlreadyBoundException("The username is already bound to another User object.");
		}
		return userRepository.save(user);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#updateUsers(com.ihsinformatics.aahung.aagahi.model.User)
	 */
	@Override
	public User updateUsers(User user) {
		return userRepository.save(user);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#deleteUsers(com.ihsinformatics.aahung.aagahi.model.User)
	 */
	@Override
	public void deleteUsers(User user) {
		userRepository.delete(user);
	}

}
