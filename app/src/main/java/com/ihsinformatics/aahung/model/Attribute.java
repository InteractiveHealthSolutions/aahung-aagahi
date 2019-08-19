package com.ihsinformatics.aahung.model;

public class Attribute {
    private String attributeName;
    private String attributeID;

    public Attribute(String attributeID , String attributeName) {
        this.attributeName = attributeName;
        this.attributeID = attributeID;
    }

    public String getAttributeName() {
        return attributeName;
    }

    public String getAttributeID() {
        return attributeID;
    }
}
