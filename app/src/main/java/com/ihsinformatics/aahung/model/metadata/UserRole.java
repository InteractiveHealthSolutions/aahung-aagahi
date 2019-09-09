package com.ihsinformatics.aahung.model.metadata;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

@Entity(tableName = "user_role")
public class UserRole {
    @PrimaryKey
    @SerializedName("roleId")
    @Expose
    private Integer roleId;

    @SerializedName("uuid")
    @Expose
    private String uuid;
    @SerializedName("description")
    @Expose
    private String description;
    @SerializedName("isRetired")
    @Expose
    private Boolean isRetired;
    @SerializedName("dateCreated")
    @Expose
    private String dateCreated;
    @SerializedName("roleName")
    @Expose
    private String roleName;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsRetired() {
        return isRetired;
    }

    public void setIsRetired(Boolean isRetired) {
        this.isRetired = isRetired;
    }

    public String getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(String dateCreated) {
        this.dateCreated = dateCreated;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}
