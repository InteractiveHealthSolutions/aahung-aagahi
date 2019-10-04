package com.ihsinformatics.aahung.model.user;

import androidx.annotation.NonNull;
import androidx.room.ColumnInfo;
import androidx.room.Entity;

@Entity(tableName = "user_privileges",primaryKeys = {"user_id", "privileges_uuid"})
public class UserPrivileges  {

    @NonNull
    @ColumnInfo(name = "user_id")
    private Integer userId;
    @NonNull
    @ColumnInfo(name = "privileges_uuid")
    private String privilege;

}
