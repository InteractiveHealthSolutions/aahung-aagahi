package com.ihsinformatics.aahung.model;

import com.ihsinformatics.aahung.views.DataProvider;

import java.io.Serializable;

public class FormDetails implements Serializable {
    private DataProvider.Forms forms;
    private boolean hasAccess = false;

    public FormDetails(DataProvider.Forms name) {
        this.forms = name;
    }

    public DataProvider.Forms getForms() {
        return forms;
    }


    public void enableAccess() {
        hasAccess = true;
    }

    public boolean hasAccess() {
        return hasAccess;
    }
}
