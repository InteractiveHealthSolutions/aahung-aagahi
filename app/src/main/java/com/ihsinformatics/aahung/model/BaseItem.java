package com.ihsinformatics.aahung.model;

import java.io.Serializable;

public class BaseItem implements Serializable {

    String id;
    String name;
    String type = "";

    public BaseItem(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public BaseItem(String id, String name, String type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

}
