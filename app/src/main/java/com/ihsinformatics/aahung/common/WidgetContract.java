package com.ihsinformatics.aahung.common;

import com.ihsinformatics.aahung.views.Widget;

public interface WidgetContract {

    public interface ItemChangeListener{
        public void onItemChange(String data);
    }

    public interface ChangeNotifier{
        public void notifyChanged(String item);
    }

}
