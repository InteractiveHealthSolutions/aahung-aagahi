package com.ihsinformatics.aahung.model;

import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;

@Entity(tableName = "forms")
public class Forms {

    @PrimaryKey(autoGenerate = true)
    public int formId;

    public String endPoint;

    public String uuid;

    public String formData;

    public Forms(String formData, String endPoint) {
        this.endPoint = endPoint;
        this.formData = formData;
    }

    @Ignore
    public Forms(String formData, String endPoint, String uuid) {
        this.endPoint = endPoint;
        this.uuid = uuid;
        this.formData = formData;
    }

    public int getFormId() {
        return formId;
    }

    public void setFormId(int formId) {
        this.formId = formId;
    }

    public String getEndPoint() {
        return endPoint;
    }

    public void setEndPoint(String endPoint) {
        this.endPoint = endPoint;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getFormData() {
        return formData;
    }

    public void setFormData(String formData) {
        this.formData = formData;
    }
}
