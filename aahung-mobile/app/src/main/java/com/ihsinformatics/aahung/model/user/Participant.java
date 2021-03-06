package com.ihsinformatics.aahung.model.user;

import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;
import androidx.room.TypeConverters;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import com.ihsinformatics.aahung.db.Converters;
import com.ihsinformatics.aahung.model.BaseItem;
import com.ihsinformatics.aahung.model.location.Location;
import com.ihsinformatics.aahung.model.results.AttributeResult;
import com.ihsinformatics.aahung.model.results.BaseResult;

import java.util.HashMap;

@Entity(tableName = "participants")
public class Participant extends BaseItem implements BaseResult {

    public static final String KEY = "participant_id";

    @SerializedName("uuid")
    @Expose
    private String uuid;
    @SerializedName("participantId")
    @Expose
    @PrimaryKey
    private Integer participantId;
    @TypeConverters(Converters.class)
    @SerializedName("person")
    @Expose
    private Person person;
    @SerializedName("identifier")
    @Expose
    private String identifier;
    @Ignore
    private HashMap<String, String> mapper = new HashMap<>();

    @Ignore
    @SerializedName("isVoided")
    @Expose
    private boolean isVoided;

    @SerializedName("location")
    @Expose
    @ColumnInfo(name = "locationId")
    @TypeConverters(Converters.class)
    private Location location;

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
    public String getShortName() {
        return identifier;
    }

    public void setVoided(boolean voided) {
        isVoided = voided;
    }

    @Override
    public String getUUID() {
        return uuid;
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
        String value = getMapper().get(key);
        return value != null ? value : "";
    }


    private HashMap<String, String> getMapper() {
        return mapper;
    }

    private void add(String key, String value) {
        this.mapper.put(key, value);
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    @Override
    public boolean isVoided() {
        return isVoided;
    }
}
