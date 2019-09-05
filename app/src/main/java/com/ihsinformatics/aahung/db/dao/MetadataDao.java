package com.ihsinformatics.aahung.db.dao;


import androidx.room.Dao;
import androidx.room.Ignore;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import com.ihsinformatics.aahung.model.metadata.Definition;
import com.ihsinformatics.aahung.model.metadata.DefinitionType;
import com.ihsinformatics.aahung.model.metadata.LocationAttributeType;
import com.ihsinformatics.aahung.model.metadata.PersonAttributeType;

import java.util.List;

@Dao
public interface MetadataDao {


    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void saveDefinitions(List<Definition> definitions);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void saveAllLocationAttributeType(List<LocationAttributeType> body);

    @Query("select * from definition where definitionName = :name")
    Definition getDefinitionByName(String name);

    /*@Ignore
    void savePersonAttributeType(List<PersonAttributeType> body);*/
}
