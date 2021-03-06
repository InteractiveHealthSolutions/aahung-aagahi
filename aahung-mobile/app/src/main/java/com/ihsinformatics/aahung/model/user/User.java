package com.ihsinformatics.aahung.model.user;

import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;
import androidx.room.TypeConverters;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import com.ihsinformatics.aahung.db.Converters;
import com.ihsinformatics.aahung.model.BaseItem;
import com.ihsinformatics.aahung.model.metadata.Role;

import java.util.List;

@Entity(tableName = "user")
public class User extends BaseItem {

    public static final String KEY = "userId";
    @SerializedName("uuid")
    @Expose
    private String uuid;
    @PrimaryKey
    @SerializedName("userId")
    @Expose
    private Integer userId;
    @SerializedName("username")
    @Expose
    private String username;
    @SerializedName("fullName")
    @Expose
    private String fullName;

    private String password;

    @Ignore
    @SerializedName("userRoles")
    @Expose
    private List<Role> userRoles = null;

    @Ignore
    @SerializedName("isVoided")
    @Expose
    private boolean isVoided;


    public User(Integer userId, String fullName) {
        this.userId = userId;
        this.fullName = fullName;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setVoided(boolean voided) {
        isVoided = voided;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public Integer getID() {
        return userId;
    }

    @Override
    public String getName() {
        return fullName;
    }

    @Override
    public String getKey() {
        return KEY;
    }


    @Override
    public String getUUID() {
        return uuid;
    }


    @Override
    public String getShortName() {
        return ""+ userId; // shortname is not available
    }

    public List<Role> getUserRoles() {
        return userRoles;
    }

    public void setUserRoles(List<Role> userRoles) {
        this.userRoles = userRoles;
    }

    @Override
    public boolean isVoided() {
        return isVoided;
    }
}
