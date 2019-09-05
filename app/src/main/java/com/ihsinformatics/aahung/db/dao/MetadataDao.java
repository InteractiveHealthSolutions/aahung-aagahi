package com.ihsinformatics.aahung.db.dao;


import androidx.room.Dao;
import androidx.room.Ignore;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import com.ihsinformatics.aahung.common.BaseAttribute;
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

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void savePersonAttributeType(List<PersonAttributeType> body);

    @Query("select * from definition where definitionName = :name")
    Definition getDefinitionByName(String name);

    @Query("select * from location_attribute_type where shortName = :name")
    LocationAttributeType getLocationAttributeTypeByShortName(String name);


    @Query("select * from definition where definitionType = (select definitionType from definition_type where shortName = :name)")
    List<Definition> getDefinitionsByShortName(String name);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void saveDefinitionTypes(List<DefinitionType> body);


    /*@Ignore
    void savePersonAttributeType(List<PersonAttributeType> body);*/
}
