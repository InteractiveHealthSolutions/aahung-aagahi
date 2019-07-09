package com.ihsinformatics.aahung.model;

import java.io.Serializable;

public class FormDetails implements Serializable {
    private String name;
    private String desc;

    public FormDetails(String name, String desc) {
        this.name = name;
        this.desc = desc;
    }

    public String getName() {
        return name;
    }

    public String getDesc() {
        return desc;
    }
}
