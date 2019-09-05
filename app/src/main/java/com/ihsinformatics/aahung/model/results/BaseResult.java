package com.ihsinformatics.aahung.model.results;

import com.ihsinformatics.aahung.model.Attribute;

import java.util.HashMap;


public abstract class BaseResult {

    public HashMap<String, String> mapper = new HashMap<>();

    public abstract String getAttributeValue(String key);

    public abstract String getValue(String key);


    public HashMap<String, String> getMapper() {
        return mapper;
    }

    public void add(String key, String value) {
        this.mapper.put(key, value);
    }
}
