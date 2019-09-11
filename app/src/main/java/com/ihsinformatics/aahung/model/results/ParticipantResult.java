package com.ihsinformatics.aahung.model.results;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import com.ihsinformatics.aahung.model.user.Person;

public class ParticipantResult extends BaseResult {

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
        super.mapper.put("sex",person.getGender());
        this.person = person;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    @Override
    public AttributeResult getAttributeValue(Integer key) {
        AttributeResult value = null;
        for (AttributeResult attribute : getPerson().getAttributes()) {
            if (attribute.getAttributeType().getAttributeTypeId().equals(key)) {
                value = attribute;
                break;
            }
        }
        return value;
    }

    @Override
    public String getValue(String key) {
        mapper.put("gender",person.getGender());
        String value = super.getMapper().get(key);
        return value != null ? value : "";
    }



}
