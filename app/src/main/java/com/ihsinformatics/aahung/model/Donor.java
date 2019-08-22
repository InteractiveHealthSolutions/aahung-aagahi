package com.ihsinformatics.aahung.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Donor implements BaseItem {
    @SerializedName("uuid")
    @Expose
    private String uuid;
    @SerializedName("donarId")
    @Expose
    private Integer donarId;
    @SerializedName("donarName")
    @Expose
    private String donarName;
    @SerializedName("shortName")
    @Expose
    private String shortName;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public Integer getDonarId() {
        return donarId;
    }

    public void setDonarId(Integer donarId) {
        this.donarId = donarId;
    }

    public String getDonarName() {
        return donarName;
    }

    public void setDonarName(String donarName) {
        this.donarName = donarName;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    @Override
    public Integer getID() {
        return null;
    }

    @Override
    public String getName() {
        return donarName;
    }

    @Override
    public String getType() {
        return shortName;
    }
}
