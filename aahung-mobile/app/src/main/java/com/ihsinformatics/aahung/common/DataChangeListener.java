package com.ihsinformatics.aahung.common;

public class DataChangeListener {

    public interface SimpleItemListener {
        public abstract void onDataChanged(String data);
    }

    public interface StatusChangeListener {
        public abstract void onDataChanged(String data,boolean isChecked);
    }
}
