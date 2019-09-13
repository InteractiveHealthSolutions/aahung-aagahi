package com.ihsinformatics.aahung.model;

public class WidgetData {

    private String param;
    private Object value;
    private String definitionName;

    public WidgetData(String param, Object value) {
        this.param = param;
        this.value = value;
    }

    public WidgetData(String param, Object value,String textValue) {
        this.param = param;
        this.value = value;
        this.definitionName = textValue;
    }

    public String getParam() {
        return param;
    }

    public Object getValue() {
        return value;
    }

    public String getDefinitionName() {
        return definitionName;
    }
}
