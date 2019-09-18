package com.ihsinformatics.aahung.db.dao;


import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import com.ihsinformatics.aahung.model.user.Participant;

import java.util.List;

@Dao
public interface PersonDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void saveParticipant(List<Participant> participants);

    @Query("select * from participants where locationId = :locationId")
    List<Participant> getParticipantByLocationId(Integer locationId);

    @Query("select * from participants where identifier = :shortName")
    Participant getParticipantByShortName(String shortName);
}
