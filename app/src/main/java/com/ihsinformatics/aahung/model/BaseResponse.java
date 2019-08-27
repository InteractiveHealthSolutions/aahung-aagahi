package com.ihsinformatics.aahung.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class BaseResponse {

    @SerializedName("uuid")
    @Expose
    private String uuid;
    @SerializedName("isVoided")
    @Expose
    private Boolean isVoided;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public Boolean getVoided() {
        return isVoided;
    }

    public void setVoided(Boolean voided) {
        isVoided = voided;
    }
}
