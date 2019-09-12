package com.ihsinformatics.aahung.common;

import com.ihsinformatics.aahung.views.Widget;

public interface WidgetContract {

    public interface ItemChangeListener{
        public void onItemChange(String data);
    }

    public interface TextChangeListener{
        public void onTextChanged(String item);
    }

    public interface ChangeNotifier{
        public void notifyChanged(String item);
    }

    public interface OnDataFetchedListener{
        public void onDataReceived(String item);
    }


}
