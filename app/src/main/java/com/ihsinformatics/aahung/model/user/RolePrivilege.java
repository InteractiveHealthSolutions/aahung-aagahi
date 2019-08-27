package com.ihsinformatics.aahung.model.user;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import org.jetbrains.annotations.NotNull;

@Entity(tableName = "role_priviliege")
public class RolePrivilege {
    @PrimaryKey
    @SerializedName("uuid")
    @Expose
    @NotNull
    private String uuid;
    @SerializedName("privilegeName")
    @Expose
    private String privilegeName;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getPrivilegeName() {
        return privilegeName;
    }

    public void setPrivilegeName(String privilegeName) {
        this.privilegeName = privilegeName;
    }



}
