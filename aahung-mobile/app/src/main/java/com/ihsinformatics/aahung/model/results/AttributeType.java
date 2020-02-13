package com.ihsinformatics.aahung.model.results;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

public class AttributeType implements Serializable {

    @SerializedName("attributeTypeId")
    @Expose
    private Integer attributeTypeId;
    @SerializedName("attributeName")
    @Expose
    private String attributeName;
    @SerializedName("shortName")
    @Expose
    private String shortName;
    @SerializedName("dataType")
    @Expose
    private String dataType;

    public AttributeType(Integer attributeTypeId, String attributeName, String shortName, String dataType) {
        this.attributeTypeId = attributeTypeId;
        this.attributeName = attributeName;
        this.shortName = shortName;
        this.dataType = dataType;
    }

    public Integer getAttributeTypeId() {
        return attributeTypeId;
    }

    public void setAttributeTypeId(Integer attributeTypeId) {
        this.attributeTypeId = attributeTypeId;
    }

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
}
