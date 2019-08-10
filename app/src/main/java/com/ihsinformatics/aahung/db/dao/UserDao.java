package com.ihsinformatics.aahung.db.dao;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;

import com.ihsinformatics.aahung.model.user.User;

import java.util.List;

@Dao
public interface UserDao {


    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void saveUser(User user);
}
