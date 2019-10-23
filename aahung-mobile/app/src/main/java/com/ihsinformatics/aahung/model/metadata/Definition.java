package com.ihsinformatics.aahung.model.metadata;

import androidx.annotation.NonNull;
import androidx.room.Embedded;
import androidx.room.Entity;
import androidx.room.ForeignKey;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;
import androidx.room.TypeConverters;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import com.ihsinformatics.aahung.db.Converters;


@Entity(tableName = "definition")
public class Definition {

    @PrimaryKey
    @NonNull
    @SerializedName("uuid")
    @Expose
    private String uuid;
    @SerializedName("isRetired")
    @Expose
    private Boolean isRetired;
    @SerializedName("definitionId")
    @Expose
    private Integer definitionId;

//
//    @Ignore
//    private transient Integer definitionTypeId;

    @SerializedName("definitionType")
    @TypeConverters(Converters.class)
    @Expose
    private DefinitionType definitionType;

    @SerializedName("definitionName")
    @Expose
    private String definitionName;
    @SerializedName("shortName")
    @Expose
    private String shortName;

    public Definition(String definitionName) {
        this.definitionName = definitionName;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public Boolean getIsRetired() {
        return isRetired;
    }

    public void setIsRetired(Boolean isRetired) {
        this.isRetired = isRetired;
    }

    public Integer getDefinitionId() {
        return definitionId;
    }

    public void setDefinitionId(Integer definitionId) {
        this.definitionId = definitionId;
    }

//    public Integer getDefinitionTypeId() {
//        return definitionType.getDefinitionTypeId();
//    }
//
//    public void setDefinitionTypeId(Integer definitionType) {
//        this.definitionTypeId = definitionType;
//    }

    public String getDefinitionName() {
        return definitionName;
    }

    public void setDefinitionName(String definitionName) {
        this.definitionName = definitionName;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public DefinitionType getDefinitionType() {
        return definitionType;
    }

    public void setDefinitionType(DefinitionType definitionType) {
        this.definitionType = definitionType;
    }

    @Override
    public String toString() {
        return definitionName;
    }
}
