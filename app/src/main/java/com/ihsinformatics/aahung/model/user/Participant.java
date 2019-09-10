package com.ihsinformatics.aahung.model.user;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import com.ihsinformatics.aahung.model.BaseItem;

public class Participant extends BaseItem {

    public static final String KEY = "participantId";
    @SerializedName("uuid")
    @Expose
    private String uuid;
    @SerializedName("participantId")
    @Expose
    private Integer participantId;
    @SerializedName("person")
    @Expose
    private Person person;
    @SerializedName("identifier")
    @Expose
    private String identifier;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public Integer getParticipantId() {
        return participantId;
    }

    public void setParticipantId(Integer participantId) {
        this.participantId = participantId;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }





    @Override
    public Integer getID() {
        return participantId;
    }

    @Override
    public String getName() {
        return person.getFirstName();
    }

    @Override
    public String getKey() {
        return KEY;
    }

    @Override
    public String getType() {
        return null;
    }

    @Override
    public String getShortName() {
        return identifier;
    }

    @Override
    public String getUUID() {
        return uuid;
    }
}
