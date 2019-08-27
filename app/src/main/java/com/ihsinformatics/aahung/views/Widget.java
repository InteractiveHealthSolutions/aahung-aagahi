package com.ihsinformatics.aahung.views;

import android.view.View;

import com.ihsinformatics.aahung.model.WidgetData;

public abstract class Widget {
    public abstract View getView();
    public abstract WidgetData getValue();
    public abstract boolean isValid();
    public abstract boolean hasAttribute();
    public abstract Widget hideView();
    public abstract Widget showView();
    public abstract void onDataChanged(String data);
    public abstract Widget addHeader(String headerText);

}
