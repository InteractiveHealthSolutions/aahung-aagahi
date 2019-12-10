package com.ihsinformatics.aahung.db.dao;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import com.ihsinformatics.aahung.model.metadata.Role;
import com.ihsinformatics.aahung.model.user.User;

import java.util.List;

@Dao
public interface UserDao {



    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void saveUser(User user);

    @Query("Select * from user where username = :name ")
    User getUserByName(String name);

    @Query("Select * from user")
    List<User> getAllUsers();

    @Query("SELECT * FROM user inner join user_role on user_role.user_id = user.userId and user_role.role_id = :roleId")
    List<User> getUserByRole(Integer roleId);

    @Query("SELECT * FROM user Left join user_role on user_role.user_id = user.userId  left join role on role.roleId= user_role.role_id where user.userId = :userId and role.roleName = :role")
    User getRole(Integer userId, String role);

}
