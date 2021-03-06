package com.ihsinformatics.aahung.model.user;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import com.ihsinformatics.aahung.model.results.AttributeResult;

import java.io.Serializable;
import java.util.List;

public class Person implements Serializable {
    @SerializedName("uuid")
    @Expose
    private String uuid;
    @SerializedName("personId")
    @Expose
    private Integer personId;
    @SerializedName("firstName")
    @Expose
    private String firstName;
    @SerializedName("gender")
    @Expose
    private String gender;
    @SerializedName("dob")
    @Expose
    private String dob;
    @SerializedName("attributes")
    @Expose
    private List<AttributeResult> attributes = null;


    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public Integer getPersonId() {
        return personId;
    }

    public void setPersonId(Integer personId) {
        this.personId = personId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public List<AttributeResult> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<AttributeResult> attributes) {
        this.attributes = attributes;
    }
}
