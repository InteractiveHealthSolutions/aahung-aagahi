/**
 * 
 */
package com.ihsinformatics.aahung.aagahi.service;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.hibernate.HibernateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.ihsinformatics.aahung.aagahi.Initializer;
import com.ihsinformatics.aahung.aagahi.model.Privilege;
import com.ihsinformatics.aahung.aagahi.model.Role;
import com.ihsinformatics.aahung.aagahi.model.User;
import com.ihsinformatics.aahung.aagahi.model.UserAttribute;
import com.ihsinformatics.aahung.aagahi.model.UserAttributeType;
import com.ihsinformatics.aahung.aagahi.repository.PrivilegeRepository;
import com.ihsinformatics.aahung.aagahi.repository.RoleRepository;
import com.ihsinformatics.aahung.aagahi.repository.UserAttributeRepository;
import com.ihsinformatics.aahung.aagahi.repository.UserAttributeTypeRepository;
import com.ihsinformatics.aahung.aagahi.repository.UserRepository;
import com.ihsinformatics.aahung.aagahi.util.SearchCriteria;
import com.ihsinformatics.aahung.aagahi.util.SearchQueryCriteriaConsumer;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Component
public class UserServiceImpl implements UserService {

	@Autowired
	private PrivilegeRepository privilegeRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserAttributeTypeRepository userAttributeTypeRepository;

	@Autowired
	private UserAttributeRepository userAttributeRepository;

	@PersistenceContext
	private EntityManager entityManager;

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#saveUserAttributes(java.util.List)
	 */
	@Override
	public List<UserAttribute> saveUserAttributes(List<UserAttribute> attributes) {
		for (UserAttribute attribute : attributes) {
			attribute.setCreatedBy(Initializer.getCurrentUser());
		}
		return userAttributeRepository.saveAll(attributes);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#savePrivilege(com.ihsinformatics.aahung.aagahi.model.Privilege)
	 */
	@Override
	public Privilege savePrivilege(Privilege obj) throws HibernateException {
		if (getPrivilegeByName(obj.getPrivilegeName()) != null) {
			throw new HibernateException("Trying to save duplicate Privilege!");
		}
		return privilegeRepository.save(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#saveRole(com.ihsinformatics.aahung.aagahi.model.Role)
	 */
	@Override
	public Role saveRole(Role obj) throws HibernateException {
		if (getRoleByName(obj.getRoleName()) != null) {
			throw new HibernateException("Trying to save duplicate Role!");
		}
		return roleRepository.save(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#saveUserAttributeType(com.ihsinformatics.aahung.aagahi.model.UserAttributeType)
	 */
	@Override
	public UserAttributeType saveUserAttributeType(UserAttributeType obj) throws HibernateException {
		if (getUserAttributeTypeByName(obj.getAttributeName()) != null) {
			throw new HibernateException("Trying to save duplicate UserAttributeType!");
		}
		return userAttributeTypeRepository.save(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#saveUserAttribute(com.ihsinformatics.aahung.aagahi.model.UserAttribute)
	 */
	@Override
	public UserAttribute saveUserAttribute(UserAttribute obj) throws HibernateException {
		obj.setCreatedBy(Initializer.getCurrentUser());
		return userAttributeRepository.save(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#saveUser(com.ihsinformatics.aahung.aagahi.model.User)
	 */
	@Override
	public User saveUser(User obj) throws HibernateException {
		if (getUserByUsername(obj.getUsername()) != null) {
			throw new HibernateException("Trying to save duplicate User!");
		}
		// TODO: What is this? 
		UserServiceImpl service = new UserServiceImpl();
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String name = authentication.getName();
		obj.setCreatedBy(service.getUserByUsername(name));
		return userRepository.save(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#updatePrivilege(com.ihsinformatics.aahung.aagahi.model.Privilege)
	 */
	@Override
	public Privilege updatePrivilege(Privilege obj) throws HibernateException {
		return privilegeRepository.save(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#updateRole(com.ihsinformatics.aahung.aagahi.model.Role)
	 */
	@Override
	public Role updateRole(Role obj) throws HibernateException {
		obj.setDateUpdated(new Date());
		return roleRepository.save(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#updateUserAttributeType(com.ihsinformatics.aahung.aagahi.model.UserAttributeType)
	 */
	@Override
	public UserAttributeType updateUserAttributeType(UserAttributeType obj) throws HibernateException {
		obj.setDateUpdated(new Date());
		return userAttributeTypeRepository.save(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#updateUserAttribute(com.ihsinformatics.aahung.aagahi.model.UserAttribute)
	 */
	@Override
	public UserAttribute updateUserAttribute(UserAttribute obj) throws HibernateException {
		obj.setDateUpdated(new Date());
		obj.setUpdatedBy(Initializer.getCurrentUser());
		return userAttributeRepository.save(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#updateUser(com.ihsinformatics.aahung.aagahi.model.User)
	 */
	@Override
	public User updateUser(User obj) throws HibernateException {
		obj.setDateUpdated(new Date());
		obj.setUpdatedBy(Initializer.getCurrentUser());
		return userRepository.save(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#deletePrivilege(com.ihsinformatics.aahung.aagahi.model.Privilege)
	 */
	@Override
	public void deletePrivilege(Privilege obj) throws HibernateException {
		// Check dependencies first
		List<Role> roles = roleRepository.findAll();
		for (Role role : roles) {
			if (role.getRolePrivileges().contains(obj)) {
				throw new HibernateException(
				        "One or more Role objects depend on this Privilege. Please remove this Privilege from all Role objects first.");
			}
		}
		privilegeRepository.delete(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#deleteRole(com.ihsinformatics.aahung.aagahi.model.Role)
	 */
	@Override
	public void deleteRole(Role obj, boolean force) throws HibernateException {
		// Check dependencies first
		List<User> users = userRepository.findAll();
		for (User user : users) {
			if (user.getUserRoles().contains(obj)) {
				if (force) {
					user.getUserRoles().remove(obj);
					updateUser(user);
				} else {
					throw new HibernateException(
					        "One or more User objects depend on this Role. Please remove this Role object from User objects (by setting the force parameter true) first.");
				}
			}
		}
		roleRepository.delete(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#deleteUserAttributeType(com.ihsinformatics.aahung.aagahi.model.UserAttributeType, boolean)
	 */
	@Override
	public void deleteUserAttributeType(UserAttributeType obj, boolean force) throws HibernateException {
		List<UserAttribute> attributesByType = getUserAttributesByType(obj);
		if (!attributesByType.isEmpty()) {
			if (force) {
				for (UserAttribute userAttribute : attributesByType) {
					deleteUserAttribute(userAttribute);
				}
			} else {
				throw new HibernateException(
				        "One or more UserAttribute objects depend on this UserAttributeType. Please delete the dependent objects first.");
			}
		}
		userAttributeTypeRepository.delete(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#deleteUserAttribute(com.ihsinformatics.aahung.aagahi.model.UserAttribute)
	 */
	@Override
	public void deleteUserAttribute(UserAttribute obj) throws HibernateException {
		userAttributeRepository.delete(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#deleteUser(com.ihsinformatics.aahung.aagahi.model.User)
	 */
	@Override
	public void deleteUser(User obj) throws HibernateException {
		userRepository.delete(obj);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getPrivilegeByUuid(java.lang.String)
	 */
	@Override
	public Privilege getPrivilegeByUuid(String uuid) throws HibernateException {
		return privilegeRepository.findByUuid(uuid);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getPrivilegeByName(java.lang.String)
	 */
	@Override
	public Privilege getPrivilegeByName(String name) throws HibernateException {
		return privilegeRepository.findByPrivilegeName(name);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getPrivileges()
	 */
	@Override
	public List<Privilege> getPrivileges() throws HibernateException {
		return privilegeRepository.findAll();
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getPrivilegesByUser(com.ihsinformatics.aahung.aagahi.model.User)
	 */
	@Override
	public List<Privilege> getPrivilegesByUser(User user) throws HibernateException {
		List<Role> roles = user.getUserRoles();
		Set<Privilege> privileges = new HashSet<>();
		for (Role role : roles) {
			privileges.addAll(role.getRolePrivileges());
		}
		return privileges.stream().collect(Collectors.toList());
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getRoleById(java.lang.Integer)
	 */
	@Override
	public Role getRoleById(Integer id) throws HibernateException {
		Optional<Role> found = roleRepository.findById(id);
		if (found.isPresent()) {
			return found.get();
		}
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getRoleByUuid(java.lang.String)
	 */
	@Override
	public Role getRoleByUuid(String uuid) throws HibernateException {
		return roleRepository.findByUuid(uuid);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getRoleByName(java.lang.String)
	 */
	@Override
	public Role getRoleByName(String name) throws HibernateException {
		return roleRepository.findByRoleName(name);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getRoles()
	 */
	@Override
	public List<Role> getRoles() throws HibernateException {
		List<Role> roles = roleRepository.findAll();
		for (Role role : roles) {
			if (role.getIsRetired()) {
				roles.remove(role);
			}
		}
		return roles;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getRolesByExample(com.ihsinformatics.aahung.aagahi.model.Role)
	 */
	@Override
	public List<Role> getRolesByExample(Role role) throws HibernateException {
		Example<Role> example = Example.of(role);
		return roleRepository.findAll(example);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getUserAttributeTypeById(java.lang.Integer)
	 */
	@Override
	public UserAttributeType getUserAttributeTypeById(Integer id) throws HibernateException {
		Optional<UserAttributeType> found = userAttributeTypeRepository.findById(id);
		if (found.isPresent()) {
			return found.get();
		}
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getUserAttributeTypeByUuid(java.lang.String)
	 */
	@Override
	public UserAttributeType getUserAttributeTypeByUuid(String uuid) throws HibernateException {
		return userAttributeTypeRepository.findByUuid(uuid);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getUserAttributeTypeByName(java.lang.String)
	 */
	@Override
	public UserAttributeType getUserAttributeTypeByName(String name) throws HibernateException {
		return userAttributeTypeRepository.findByName(name);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getUserAttributeTypes()
	 */
	@Override
	public List<UserAttributeType> getUserAttributeTypes() throws HibernateException {
		return userAttributeTypeRepository.findAll();
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getUserAttributeById(java.lang.Integer)
	 */
	@Override
	public UserAttribute getUserAttributeById(Integer id) throws HibernateException {
		Optional<UserAttribute> found = userAttributeRepository.findById(id);
		if (found.isPresent()) {
			return found.get();
		}
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getUserAttributeByUuid(java.lang.String)
	 */
	@Override
	public UserAttribute getUserAttributeByUuid(String uuid) throws HibernateException {
		return userAttributeRepository.findByUuid(uuid);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getUserAttribute(com.ihsinformatics.aahung.aagahi.model.User, com.ihsinformatics.aahung.aagahi.model.UserAttributeType)
	 */
	@Override
	public List<UserAttribute> getUserAttribute(User user, UserAttributeType attributeType) throws HibernateException {
		return userAttributeRepository.findByUserAndAttributeType(user, attributeType);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getUserAttributesByType(com.ihsinformatics.aahung.aagahi.model.UserAttributeType)
	 */
	@Override
	public List<UserAttribute> getUserAttributesByType(UserAttributeType attributeType) throws HibernateException {
		return userAttributeRepository.findByAttributeType(attributeType);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getUserAttributesByValue(com.ihsinformatics.aahung.aagahi.model.UserAttributeType, java.lang.String)
	 */
	@Override
	public List<UserAttribute> getUserAttributesByValue(UserAttributeType attributeType, String value)
	        throws HibernateException {
		return userAttributeRepository.findByAttributeType(attributeType);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getUserAttributesByUser(com.ihsinformatics.aahung.aagahi.model.User)
	 */
	@Override
	public List<UserAttribute> getUserAttributesByUser(User user) throws HibernateException {
		return userAttributeRepository.findByUser(user);
	}

	/*
	 * (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getUserAttributesByValue(java.lang.String)
	 */
	@Override
	public List<UserAttribute> getUserAttributesByValue(String value) throws HibernateException {
		return userAttributeRepository.findByValue(value);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getUserById(java.lang.Integer)
	 */
	@Override
	public User getUserById(Integer id) throws HibernateException {
		Optional<User> found = userRepository.findById(id);
		if (found.isPresent()) {
			return found.get();
		}
		return null;
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getUserByUuid(java.lang.String)
	 */
	@Override
	public User getUserByUuid(String uuid) throws HibernateException {
		return userRepository.findByUuid(uuid);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getUserByUsername(java.lang.String)
	 */
	@Override
	public User getUserByUsername(String username) throws HibernateException {
		return userRepository.findByUsername(username);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getUsersByFullName(java.lang.String)
	 */
	@Override
	public List<User> getUsersByFullName(String name) throws HibernateException {
		return userRepository.findByFullName(name);
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getUsers()
	 */
	@Override
	public List<User> getUsers() {
		return userRepository.findAll();
	}

	/* (non-Javadoc)
	 * @see com.ihsinformatics.aahung.aagahi.service.UserService#getUsersByExample(com.ihsinformatics.aahung.aagahi.model.User)
	 */
	@Override
	public List<User> getUsersByExample(User user) throws HibernateException {
		Example<User> example = Example.of(user);
		return userRepository.findAll(example);
	}

	@Override
	public List<User> getUsersByRole(Role role) throws HibernateException {
		return userRepository.findUsersByUserRolesRoleId(role.getRoleId());
	}

	@Override
	public List<User> searchUsers(List<SearchCriteria> params) throws HibernateException {

		CriteriaBuilder builder = entityManager.getCriteriaBuilder();
		CriteriaQuery<User> query = builder.createQuery(User.class);
		Root<User> r = query.from(User.class);

		Predicate predicate = builder.conjunction();

		SearchQueryCriteriaConsumer searchConsumer = new SearchQueryCriteriaConsumer(predicate, builder, r);
		params.stream().forEach(searchConsumer);
		predicate = searchConsumer.getPredicate();
		query.where(predicate);

		List<User> result = entityManager.createQuery(query).getResultList();
		return result;
	}
}
