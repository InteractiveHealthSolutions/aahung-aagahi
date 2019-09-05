package com.ihsinformatics.aahung.model.metadata;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class PersonAttributeType {
    @SerializedName("attributeName")
    @Expose
    private String attributeName;
    @SerializedName("attributeTypeId")
    @Expose
    private Integer attributeTypeId;
    @SerializedName("dataType")
    @Expose
    private String dataType;
    @SerializedName("description")
    @Expose
    private String description;
    @SerializedName("isRetired")
    @Expose
    private Boolean isRetired;
    @SerializedName("shortName")
    @Expose
    private String shortName;
    @SerializedName("uuid")
    @Expose
    private String uuid;
    @SerializedName("validationRegex")
    @Expose
    private String validationRegex;

    public String getAttributeName() {
        return attributeName;
    }

    public void setAttributeName(String attributeName) {
        this.attributeName = attributeName;
    }

    public Integer getAttributeTypeId() {
        return attributeTypeId;
    }

    public void setAttributeTypeId(Integer attributeTypeId) {
        this.attributeTypeId = attributeTypeId;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
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

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getValidationRegex() {
        return validationRegex;
    }

    public void setValidationRegex(String validationRegex) {
        this.validationRegex = validationRegex;
    }
}
