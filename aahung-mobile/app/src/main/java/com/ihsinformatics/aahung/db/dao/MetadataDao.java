package com.ihsinformatics.aahung.db.dao;


import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import com.ihsinformatics.aahung.model.metadata.Definition;
import com.ihsinformatics.aahung.model.metadata.DefinitionType;
import com.ihsinformatics.aahung.model.metadata.FormElements;
import com.ihsinformatics.aahung.model.metadata.FormType;
import com.ihsinformatics.aahung.model.metadata.LocationAttributeType;
import com.ihsinformatics.aahung.model.metadata.PersonAttributeType;
import com.ihsinformatics.aahung.model.metadata.Role;
import com.ihsinformatics.aahung.model.metadata.UserRole;
import com.ihsinformatics.aahung.model.user.RolePrivilege;
import com.ihsinformatics.aahung.model.user.User;

import java.util.List;

@Dao
public interface MetadataDao {


    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void saveDefinitions(List<Definition> definitions);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void saveAllLocationAttributeType(List<LocationAttributeType> body);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void savePersonAttributeType(List<PersonAttributeType> body);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void saveFormElements(List<FormElements> body);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void saveFormTypes(List<FormType> body);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void saveDefinitionTypes(List<DefinitionType> body);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void saveRoles(List<Role> body);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void saveAllUser(List<User> body);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void saveUserRoles(UserRole body);


    @Query("select * from definition where definitionName = :name")
    Definition getDefinitionByName(String name);

    @Query("select * from definition where definitionId = :id")
    Definition getDefinitionById(String  id);

    @Query("select * from definition where shortName = :shortName")
    Definition getDefinitionByShortName(String shortName);

    @Query("select * from definition where shortName = :shortName and definitionType = :definitionType")
    Definition getDefinitionByType(String shortName,DefinitionType definitionType);

    @Query("select * from definition_type where def_type_shortName = :shortName")
    DefinitionType getDefinitionTypeByShortName(String shortName);

    @Query("select * from location_attribute_type where shortName = :name")
    LocationAttributeType getLocationAttributeTypeByShortName(String name);

    @Query("select * from location_attribute_type where attributeTypeId = :id")
    LocationAttributeType getLocationAttributeTypeById(Integer id);

    @Query("select * from person_attribute_type where shortName = :name")
    PersonAttributeType getPersonAttributeTypeByShortName(String name);

    @Query("SELECT * FROM definition inner join definition_type on definition.definitionType = definition_type.def_type_id and definition_type.def_type_shortName = :name;")
    List<Definition> getDefinitionsByShortName(String name);


    @Query("select * from form_type where shortName = :shortName")
    FormType getFormTypeByShortName(String shortName);

    @Query("select * from role where roleName = :name")
    Role getRoleByName(String name);

    @Query("DELETE FROM user_role where user_id = :id")
    void deleteUserRoles(Integer id);


}
