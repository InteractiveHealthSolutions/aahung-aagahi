/**
 * 
 */
package com.ihsinformatics.aahung.aagahi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ihsinformatics.aahung.aagahi.model.User;


/**
 * @author owais.hussain@ihsinformatics.com
 *
 */
public interface UserRepository extends JpaRepository<User, Integer> {

	User findByUuid(String uuid);

	@Query("SELECT u FROM User u WHERE u.username = :username")
	User findByUsername(String username);

	@Query("SELECT u FROM User u WHERE u.fullName LIKE CONCAT('%', :fullName, '%')")
    List<User> findByFullName(@Param("fullName") String fullName);
}
