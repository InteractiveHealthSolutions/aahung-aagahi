package com.ihsinformatics.aahung.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Project extends BaseItem{

    public static final String KEY = "projectId";
    @SerializedName("uuid")
    @Expose
    private String uuid;
    @SerializedName("projectId")
    @Expose
    private Integer projectId;
    @SerializedName("donor")
    @Expose
    private Donor donor;
    @SerializedName("projectName")
    @Expose
    private String projectName;
    @SerializedName("shortName")
    @Expose
    private String shortName;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public Integer getProjectId() {
        return projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }

    public Donor getDonor() {
        return donor;
    }

    public void setDonor(Donor donor) {
        this.donor = donor;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
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
        return projectId;
    }

    @Override
    public String getName() {
        return donor.getName();
    }

    @Override
    public String getKey() {
        return KEY;
    }

    @Override
    public String getUUID() {
        return uuid;
    }


}
