package com.ihsinformatics.aahung.model;

public class Location extends BaseItem {
    String type;
    private String id;
    private String name;

    public Location(String id, String name,String type) {
        super(id, name);
        this.id = id;
        this.name = name;
        this.type = type;
    }

    public String getType() {
        return type;
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public String getName() {
        return name;
    }
}
