package com.ihsinformatics.aahung.model.results;

import android.util.Base64;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import com.ihsinformatics.aahung.model.location.Category;

import java.util.List;

public class LocationResult extends BaseResult {


    @SerializedName("uuid")
    @Expose
    private String uuid;
    @SerializedName("locationId")
    @Expose
    private Integer locationId;
    @SerializedName("locationName")
    @Expose
    private String locationName;
    @SerializedName("shortName")
    @Expose
    private String shortName;
    @SerializedName("category")
    @Expose
    private Category category;
    @SerializedName("description")
    @Expose
    private Object description;
    @SerializedName("address1")
    @Expose
    private Object address1;
    @SerializedName("address2")
    @Expose
    private Object address2;
    @SerializedName("address3")
    @Expose
    private Object address3;
    @SerializedName("postalCode")
    @Expose
    private Object postalCode;
    @SerializedName("landmark1")
    @Expose
    private Object landmark1;
    @SerializedName("landmark2")
    @Expose
    private Object landmark2;
    @SerializedName("cityVillage")
    @Expose
    private Object cityVillage;
    @SerializedName("stateProvince")
    @Expose
    private Object stateProvince;
    @SerializedName("country")
    @Expose
    private String country;
    @SerializedName("latitude")
    @Expose
    private Object latitude;
    @SerializedName("longitude")
    @Expose
    private Object longitude;
    @SerializedName("primaryContact")
    @Expose
    private Object primaryContact;
    @SerializedName("primaryContactPerson")
    @Expose
    private Object primaryContactPerson;
    @SerializedName("secondaryContact")
    @Expose
    private Object secondaryContact;
    @SerializedName("secondaryContactPerson")
    @Expose
    private Object secondaryContactPerson;
    @SerializedName("tertiaryContact")
    @Expose
    private Object tertiaryContact;
    @SerializedName("tertiaryContactPerson")
    @Expose
    private Object tertiaryContactPerson;
    @SerializedName("email")
    @Expose
    private Object email;
    @SerializedName("parentLocation")
    @Expose
    private Object parentLocation;


    @SerializedName("attributes")
    @Expose
    private List<AttributeResult> attributeResultList = null;


    public List<AttributeResult> getAttributeResultList() {
        return attributeResultList;
    }

    public void setAttributeResultList(List<AttributeResult> attributeResultList) {
        this.attributeResultList = attributeResultList;
    }

    @Override
    public String getAttributeValue(String key) {
        String value = "";
        for (AttributeResult attribute : attributeResultList) {
            if (attribute.getAttributeId().equals(key)) {
                value = attribute.getAttributeValue();
            }
        }
        return value;
    }

    @Override
    public String getValue(String key) {
        String value = super.getMapper().get(key);
        return value != null ? value : "";
    }


    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public void setLocationId(Integer locationId) {
        this.locationId = locationId;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setDescription(Object description) {
        this.description = description;
    }

    public void setAddress1(Object address1) {
        this.address1 = address1;
    }

    public void setAddress2(Object address2) {
        this.address2 = address2;
    }

    public void setAddress3(Object address3) {
        this.address3 = address3;
    }

    public void setPostalCode(Object postalCode) {
        this.postalCode = postalCode;
    }

    public void setLandmark1(Object landmark1) {
        this.landmark1 = landmark1;
    }

    public void setLandmark2(Object landmark2) {
        this.landmark2 = landmark2;
    }

    public void setCityVillage(Object cityVillage) {
        this.cityVillage = cityVillage;
    }

    public void setStateProvince(Object stateProvince) {
        this.stateProvince = stateProvince;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public void setLatitude(Object latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(Object longitude) {
        this.longitude = longitude;
    }

    public void setPrimaryContact(Object primaryContact) {
        this.primaryContact = primaryContact;
    }

    public void setPrimaryContactPerson(Object primaryContactPerson) {
        this.primaryContactPerson = primaryContactPerson;
    }

    public void setSecondaryContact(Object secondaryContact) {
        this.secondaryContact = secondaryContact;
    }

    public void setSecondaryContactPerson(Object secondaryContactPerson) {
        this.secondaryContactPerson = secondaryContactPerson;
    }

    public void setTertiaryContact(Object tertiaryContact) {
        this.tertiaryContact = tertiaryContact;
    }

    public void setTertiaryContactPerson(Object tertiaryContactPerson) {
        this.tertiaryContactPerson = tertiaryContactPerson;
    }

    public void setEmail(Object email) {
        this.email = email;
    }

    public void setParentLocation(Object parentLocation) {
        this.parentLocation = parentLocation;
    }
}
