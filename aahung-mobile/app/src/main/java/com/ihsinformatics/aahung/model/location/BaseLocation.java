package com.ihsinformatics.aahung.model.location;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import com.ihsinformatics.aahung.model.BaseItem;

public class BaseLocation extends BaseItem {

    public static final String KEY = "locationId";
    @SerializedName("locationId")
    @Expose
    private Integer locationId;
    @SerializedName("locationName")
    @Expose
    private String locationName;
    @SerializedName("shortName")
    @Expose
    private String shortName;
    @SerializedName("uuid")
    @Expose
    private String uuid;
    @SerializedName("categoryUuid")
    @Expose
    private String categoryUuid;

    @SerializedName("isVoided")
    @Expose
    private boolean isVoided;


    public void setLocationId(Integer locationId) {
        this.locationId = locationId;
    }


    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    @Override
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

    public void setVoided(boolean voided) {
        isVoided = voided;
    }

    public void setCategoryUuid(String categoryUuid) {
        this.categoryUuid = categoryUuid;
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
    public String getUUID() {
        return uuid;
    }

    @Override
    public boolean isVoided() {
        return isVoided;
    }
}
