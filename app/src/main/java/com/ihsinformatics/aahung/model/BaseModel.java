package com.ihsinformatics.aahung.model;

import java.io.Serializable;

public class BaseModel implements Serializable {

    String id;
    String name;

    public BaseModel(String id, String name) {
        this.id = id;
        this.name = name;
    }


    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
