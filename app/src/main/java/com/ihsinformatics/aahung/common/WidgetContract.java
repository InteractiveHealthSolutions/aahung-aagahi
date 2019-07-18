package com.ihsinformatics.aahung.common;

public interface WidgetContract {

    public interface ItemChangeListener{
        public void onItemChange(String data);
    }

    public interface ChangeNotifier{
        public void notifyChanged(String item);
    }

}
