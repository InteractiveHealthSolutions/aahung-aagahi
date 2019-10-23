package com.ihsinformatics.aahung.model.location;

import androidx.room.ColumnInfo;
import androidx.room.Embedded;
import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;
import androidx.room.TypeConverters;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import com.ihsinformatics.aahung.db.Converters;
import com.ihsinformatics.aahung.model.BaseItem;
import com.ihsinformatics.aahung.model.results.AttributeResult;
import com.ihsinformatics.aahung.model.results.BaseResult;

import java.util.HashMap;
import java.util.List;

@Entity(tableName = "location")
public class Location extends BaseItem implements BaseResult {

    public Location(Integer locationId, String locationName) {
        this.locationId = locationId;
        this.locationName = locationName;
    }

    public static final String KEY = "locationId";
    @SerializedName("uuid")
    @Expose
    private String uuid;
    @PrimaryKey
    @SerializedName("locationId")
    @Expose
    private Integer locationId;
    @SerializedName("locationName")
    @Expose
    private String locationName;
    @SerializedName("shortName")
    @Expose
    private String shortName;

    @SerializedName("primaryContact")
    @Expose
    private String primaryContact;

    @SerializedName("primaryContactPerson")
    @Expose
    private String primaryContactPerson;

    @SerializedName("email")
    @Expose
    private String email;

    @Ignore
    @SerializedName("country")
    @Expose
    private String country;

    @TypeConverters(Converters.class)
    @SerializedName("category")
    @Expose
    private Category category;
    @Ignore
    @SerializedName("attributes")
    @Expose
    private List<AttributeResult> attributes = null;

    @Ignore
    public HashMap<String, String> mapper = new HashMap<>();

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getUuid() {
        return uuid;
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

    public Integer getLocationId() {
        return locationId;
    }

    public String getLocationName() {
        return locationName;
    }

    public String getPrimaryContact() {
        return primaryContact;
    }

    public void setPrimaryContact(String primaryContact) {
        this.primaryContact = primaryContact;
    }

    public String getPrimaryContactPerson() {
        return primaryContactPerson;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    @Override
    public Integer getID() {
        return locationId;
    }

    @Override
    public String getName() {
        return locationName;
    }

    @Override
    public String getKey() {
        return KEY;
    }



    @Override
    public String getShortName() {
        return shortName;
    }

    @Override
    public String getUUID() {
        return uuid;
    }

    public List<AttributeResult> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<AttributeResult> attributes) {
        this.attributes = attributes;
    }




    public void setPrimaryContactPerson(String primaryContactPerson) {
        this.primaryContactPerson = primaryContactPerson;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public AttributeResult getAttributeValue(Integer key) {
        AttributeResult value = null;
        for (AttributeResult attribute : attributes) {
            if (attribute.getAttributeType().getAttributeTypeId().equals(key)) {
                value = attribute;
                break;
            }
        }
        return value;
    }

    @Override
    public String getValue(String key) {
        mapper = new HashMap<>();
        mapper.put("primaryContact",getPrimaryContact());
        mapper.put("primaryContactPerson",getPrimaryContactPerson());
        mapper.put("email",email);
        String value = getMapper().get(key);
        return value != null ? value : "";
    }



    public HashMap<String, String> getMapper() {
        return mapper;
    }

    public void add(String key, String value) {
        this.mapper.put(key, value);
    }

}
