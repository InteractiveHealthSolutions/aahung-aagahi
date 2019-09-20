package com.ihsinformatics.aahung.model.metadata;


import androidx.annotation.NonNull;
import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "user_role", primaryKeys = {"user_id", "role_id"})
public class UserRole {


    @NonNull
    @ColumnInfo(name = "user_id")
    private Integer userId;
    @NonNull
    @ColumnInfo(name = "role_id")
    private Integer roleId;


    public UserRole(Integer userId, Integer roleId) {
        this.userId = userId;
        this.roleId = roleId;
    }

    public Integer getUserId() {
        return userId;
    }

    public Integer getRoleId() {
        return roleId;
    }


    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }
}
