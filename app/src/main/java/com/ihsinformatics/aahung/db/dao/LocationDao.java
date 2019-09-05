package com.ihsinformatics.aahung.db.dao;


import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import com.ihsinformatics.aahung.model.location.Location;
import com.ihsinformatics.aahung.model.user.User;

import java.util.List;

@Dao
public interface LocationDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void saveLocation(Location location);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void saveAllLocation(List<Location> locations);

    @Query("Select * from location where shortName = :name ")
    List<Location> getLocationByShortName(String name);

    @Query("Select * from location")
    List<Location> getAllLocation();

}
