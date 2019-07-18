package com.ihsinformatics.aahung.model;

import com.ihsinformatics.aahung.views.DataProvider;

import java.io.Serializable;

public class FormDetails implements Serializable {
    private DataProvider.Forms forms;
    private String desc;

    public FormDetails(DataProvider.Forms name, String desc) {
        this.forms = name;
        this.desc = desc;
    }

    public DataProvider.Forms getForms() {
        return forms;
    }

    public String getDesc() {
        return desc;
    }
}
