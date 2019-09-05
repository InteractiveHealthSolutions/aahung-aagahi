package com.ihsinformatics.aahung.model.metadata;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import com.ihsinformatics.aahung.common.BaseAttribute;


@Entity(tableName = "location_attribute_type")
public class LocationAttributeType implements BaseAttribute {

    @PrimaryKey
    @SerializedName("attributeTypeId")
    @Expose
    private Integer attributeTypeId;
    @SerializedName("uuid")
    @Expose
    private String uuid;
    @SerializedName("description")
    @Expose
    private String description;
    @SerializedName("isRetired")
    @Expose
    private Boolean isRetired;

    @SerializedName("attributeName")
    @Expose
    private String attributeName;
    @SerializedName("shortName")
    @Expose
    private String shortName;
    @SerializedName("dataType")
    @Expose
    private String dataType;

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

    public Integer getAttributeTypeId() {
        return attributeTypeId;
    }

    public void setAttributeTypeId(Integer attributeTypeId) {
        this.attributeTypeId = attributeTypeId;
    }

    @Override
    public String getAttributeName() {
        return attributeName;
    }

    public void setAttributeName(String attributeName) {
        this.attributeName = attributeName;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }



    @Override
    public String getAttributeShortName() {
        return shortName;
    }

    @Override
    public Integer getAttributeID() {
        return attributeTypeId;
    }
}
