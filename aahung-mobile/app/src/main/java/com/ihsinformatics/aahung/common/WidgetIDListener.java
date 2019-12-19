package com.ihsinformatics.aahung.common;

import java.io.Serializable;

public interface WidgetIDListener extends Serializable {
    public void onWidgetChange(String text,String key);
    public void onWidgetChange(String text,String key,boolean isfullText);
}
