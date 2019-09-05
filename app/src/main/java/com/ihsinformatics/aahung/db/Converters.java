package com.ihsinformatics.aahung.db;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ihsinformatics.aahung.model.location.Category;
import com.ihsinformatics.aahung.model.metadata.DefinitionType;
import com.ihsinformatics.aahung.model.user.RolePrivilege;
import com.ihsinformatics.aahung.model.user.UserRole;

import java.lang.reflect.Type;
import java.util.ArrayList;
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
    public String fromUserRole(List<UserRole> role) {
        if (role == null) {
            return (null);
        }
        Gson gson = new Gson();
        Type type = new TypeToken<List<UserRole>>() {
        }.getType();
        String json = gson.toJson(role, type);
        return json;
    }

    @TypeConverter
    public List<UserRole> toUserRole(String role) {
        if (role == null) {
            return (null);
        }
        Gson gson = new Gson();
        Type type = new TypeToken<List<RolePrivilege>>() {
        }.getType();
        List<UserRole> userRoles = gson.fromJson(role, type);
        return userRoles;
    }


    @TypeConverter
    public Category toCategory(String json) {
        if (json == null) {
            return (null);
        }
        Gson gson = new Gson();
        Category category = gson.fromJson(json, Category.class);
        return category;
    }

    @TypeConverter
    public String fromCategory(Category category) {
        if (category == null) {
            return (null);
        }
        Gson gson = new Gson();
        String json = gson.toJson(category);
        return json;
    }


    @TypeConverter
    public DefinitionType toDefintionType(String json) {
        if (json == null) {
            return (null);
        }
        Gson gson = new Gson();
        DefinitionType definitionType = gson.fromJson(json, DefinitionType.class);
        return definitionType;
    }

    @TypeConverter
    public String fromDefinitionType(DefinitionType definitionType) {
        if (definitionType == null) {
            return (null);
        }
        Gson gson = new Gson();
        String json = gson.toJson(definitionType);
        return json;
    }
}
