package com.ihsinformatics.aahung.model.location;

import androidx.room.Embedded;
import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.room.TypeConverters;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import com.ihsinformatics.aahung.model.BaseItem;

@Entity(tableName = "location")
public class Location extends BaseItem {

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

    @SerializedName("category")
    @Expose
    private Category category;

    public Location(Integer locationId, String locationName) {
        this.locationId = locationId;
        this.locationName = locationName;
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

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Integer getLocationId() {
        return locationId;
    }

    public String getLocationName() {
        return locationName;
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
    public String getType() {
        return category.getDefinitionName();
    }

    @Override
    public String getShortName() {
        return shortName;
    }

    @Override
    public String getUUID() {
        return uuid;
    }
}
