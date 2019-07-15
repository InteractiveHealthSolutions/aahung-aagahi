/**
 * 
 */
package com.ihsinformatics.aahung.aagahi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.ihsinformatics.aahung.aagahi.model.Users;


/**
 * @author owais.hussain@ihsinformatics.com
 *
 */
public interface UsersRepository extends CrudRepository<Users, Long> {

	Users findByUuid(String uuid);

	List<Users> findByUsername(String username);

	@Query("SELECT u FROM Users u WHERE u.fullName LIKE CONCAT('%', :fullName, '%')")
    List<Users> findByFullName(@Param("fullName") String fullName);
}
