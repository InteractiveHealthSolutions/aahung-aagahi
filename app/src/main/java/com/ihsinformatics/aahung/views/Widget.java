package com.ihsinformatics.aahung.views;

import android.view.View;

import com.ihsinformatics.aahung.model.WidgetData;

public abstract class Widget {
    public abstract View getView();
    public abstract WidgetData getValue();
    public abstract boolean isValid();
    protected abstract Widget hideView();
    protected abstract Widget showView();
    protected abstract void onDataChanged(String data);
    protected abstract Widget addHeader(String headerText);

}
