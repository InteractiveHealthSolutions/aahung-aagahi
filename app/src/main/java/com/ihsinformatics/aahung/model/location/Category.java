package com.ihsinformatics.aahung.model.location;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;


@Entity(tableName = "category")
public class Category {
    @SerializedName("uuid")
    @Expose
    private String uuid;
    @PrimaryKey
    @SerializedName("definitionId")
    @Expose
    private Integer definitionId;
    @SerializedName("definitionName")
    @Expose
    private String definitionName;
    @SerializedName("shortName")
    @Expose
    private String shortName;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public Integer getDefinitionId() {
        return definitionId;
    }

    public void setDefinitionId(Integer definitionId) {
        this.definitionId = definitionId;
    }

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
}
