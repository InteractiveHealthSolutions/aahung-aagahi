package com.ihsinformatics.aahung.model;

import com.ihsinformatics.aahung.views.DataProvider;

import java.io.Serializable;

public class FormDetails implements Serializable {
    private DataProvider.Forms forms;

    public FormDetails(DataProvider.Forms name) {
        this.forms = name;
    }

    public DataProvider.Forms getForms() {
        return forms;
    }


}
