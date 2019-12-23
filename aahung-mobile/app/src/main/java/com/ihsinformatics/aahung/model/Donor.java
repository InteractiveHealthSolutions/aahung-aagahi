package com.ihsinformatics.aahung.model;

import androidx.room.Ignore;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Donor extends BaseItem {
    public static final String KEY = "donorId";
    @SerializedName("uuid")
    @Expose
    private String uuid;
    @SerializedName("donorId")
    @Expose
    private Integer donorId;
    @SerializedName("donorName")
    @Expose
    private String donorName;
    @SerializedName("shortName")
    @Expose
    private String shortName;


    @SerializedName("isVoided")
    @Expose
    private boolean isVoided;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public void setDonorId(Integer donorId) {
        this.donorId = donorId;
    }

    public void setDonorName(String donorName) {
        this.donorName = donorName;
    }

    public void setVoided(boolean voided) {
        isVoided = voided;
    }

    @Override
    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    @Override
    public Integer getID() {
        return donorId;
    }

    @Override
    public String getName() {
        return donorName;
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
