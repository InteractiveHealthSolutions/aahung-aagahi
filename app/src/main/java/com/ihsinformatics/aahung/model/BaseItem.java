package com.ihsinformatics.aahung.model;

import java.io.Serializable;

public class BaseItem implements Serializable {

    Integer id;
    String name;
    String type = "";

    public BaseItem(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public BaseItem(Integer id, String name, String type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    public BaseItem() {
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setType(String type) {
        this.type = type;
    }
}
