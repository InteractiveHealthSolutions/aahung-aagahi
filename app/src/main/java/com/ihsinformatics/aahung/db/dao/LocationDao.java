package com.ihsinformatics.aahung.db.dao;


import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import com.ihsinformatics.aahung.model.location.Location;
import com.ihsinformatics.aahung.model.user.User;

@Dao
public interface LocationDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void saveLocation(Location location);

    @Query("Select * from location where shortName = :name ")
    Location getLocationByShortName(String name);

}
