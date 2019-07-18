package com.ihsinformatics.aahung.model;

public class WidgetData {

    private String param;
    private Object value;

    public WidgetData(String param, Object value) {
        this.param = param;
        this.value = value;
    }

    public String getParam() {
        return param;
    }

    public Object getValue() {
        return value;
    }
}
