package com.ihsinformatics.aahung.db;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ihsinformatics.aahung.model.location.Category;
import com.ihsinformatics.aahung.model.metadata.DefinitionType;
import com.ihsinformatics.aahung.model.metadata.Role;
import com.ihsinformatics.aahung.model.results.AttributeType;
import com.ihsinformatics.aahung.model.user.Person;
import com.ihsinformatics.aahung.model.user.RolePrivilege;


import java.lang.reflect.Type;
import java.util.List;

import androidx.room.TypeConverter;

public class Converters {

    @TypeConverter
    public static List<String> fromString(String value) {
        Type listType = new TypeToken<List<String>>() {
        }.getType();
        return new Gson().fromJson(value, listType);
    }

    @TypeConverter
    public static String fromList(List<String> list) {
        Gson gson = new Gson();
        String json = gson.toJson(list);
        return json;
    }

    @TypeConverter
    public String fromRolePrivilege(List<RolePrivilege> privilege) {
        if (privilege == null) {
            return (null);
        }
        Gson gson = new Gson();
        Type type = new TypeToken<List<RolePrivilege>>() {
        }.getType();
        String json = gson.toJson(privilege, type);
        return json;
    }

    @TypeConverter
    public List<RolePrivilege> toRolePrivilege(String privilege) {
        if (privilege == null) {
            return (null);
        }
        Gson gson = new Gson();
        Type type = new TypeToken<List<RolePrivilege>>() {
        }.getType();
        List<RolePrivilege> rolePrivileges = gson.fromJson(privilege, type);
        return rolePrivileges;
    }





    @TypeConverter
    public Category toCategory(Integer definitionId) {
        Category category = new Category();
        category.setDefinitionId(definitionId);
        return category;
    }

    @TypeConverter
    public Integer fromCategory(Category category) {
        return category.getDefinitionId();
    }


    @TypeConverter
    public DefinitionType toDefintionType(Integer value) {
        DefinitionType definitionType = new DefinitionType();
        definitionType.setDefinitionTypeId(value);
        return definitionType;
    }

    @TypeConverter
    public Integer fromDefinitionType(DefinitionType definitionType) {
        return definitionType.getDefinitionTypeId();
    }


    @TypeConverter
    public AttributeType toAttributeType(String json) {
        if (json == null) {
            return (null);
        }
        Gson gson = new Gson();
        AttributeType attribute = gson.fromJson(json, AttributeType.class);
        return attribute;
    }

    @TypeConverter
    public String fromAttributeType(AttributeType attribute) {
        if (attribute == null) {
            return (null);
        }
        Gson gson = new Gson();
        String json = gson.toJson(attribute);
        return json;
    }

    @TypeConverter
    public Person toPerson(String json) {
        if (json == null) {
            return (null);
        }
        Gson gson = new Gson();
        Person person = gson.fromJson(json, Person.class);
        return person;
    }

    @TypeConverter
    public String fromPerson(Person person) {
        if (person == null) {
            return (null);
        }
        Gson gson = new Gson();
        String json = gson.toJson(person);
        return json;
    }



    @TypeConverter
    public String fromRole(List<Role> userRoles) {
        if (userRoles == null) {
            return (null);
        }
        Gson gson = new Gson();
        Type type = new TypeToken<List<Role>>() {
        }.getType();
        String json = gson.toJson(userRoles, type);
        return json;
    }

    @TypeConverter
    public List<Role> toRoles(String privilege) {
        if (privilege == null) {
            return (null);
        }
        Gson gson = new Gson();
        Type type = new TypeToken<List<Role>>() {
        }.getType();
        List<Role> rolePrivileges = gson.fromJson(privilege, type);
        return rolePrivileges;
    }

}
