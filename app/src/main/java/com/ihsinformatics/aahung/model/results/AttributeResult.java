package com.ihsinformatics.aahung.model.results;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class AttributeResult {

    @SerializedName("attributeId")
    @Expose
    private Integer attributeId;
    @SerializedName("attributeType")
    @Expose
    private AttributeType attributeType;
    @SerializedName("attributeValue")
    @Expose
    private String attributeValue;

    public String getAttributeValue() {
        return attributeValue;
    }

    public void setAttributeValue(String attributeValue) {
        this.attributeValue = attributeValue;
    }

    public Integer getAttributeId() {
        return attributeId;
    }

    public void setAttributeId(Integer attributeId) {
        this.attributeId = attributeId;
    }

    public AttributeType getAttributeType() {
        return attributeType;
    }

    public void setAttributeType(AttributeType attributeType) {
        this.attributeType = attributeType;
    }
}
