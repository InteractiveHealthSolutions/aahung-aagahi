package com.ihsinformatics.aahung.model.metadata;

import androidx.annotation.NonNull;
import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

@Entity(tableName = "definition_type")
public class DefinitionType {


    @SerializedName("uuid")
    @Expose
    @NonNull
    @ColumnInfo(name = "def_type_uuid")
    private String uuid;
    @SerializedName("description")
    @Expose
    @ColumnInfo(name = "def_type_description")
    private String description;
    @SerializedName("isRetired")
    @Expose
    @ColumnInfo(name = "def_type_isRetired")
    private Boolean isRetired;
    @PrimaryKey
    @ColumnInfo(name = "def_type_id")
    @SerializedName("definitionTypeId")
    @Expose
    private Integer definitionTypeId;
    @SerializedName("typeName")
    @Expose
    @ColumnInfo(name = "def_type_typeName")
    private String typeName;
    @SerializedName("shortName")
    @Expose
    @ColumnInfo(name = "def_type_shortName")
    private String shortName;

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

    public Integer getDefinitionTypeId() {
        return definitionTypeId;
    }

    public void setDefinitionTypeId(Integer definitionTypeId) {
        this.definitionTypeId = definitionTypeId;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

}
