package com.ihsinformatics.aahung.common;

import com.ihsinformatics.aahung.model.results.BaseResult;
import com.ihsinformatics.aahung.views.DataProvider;
import com.ihsinformatics.aahung.views.Widget;

public interface WidgetContract {

    public interface ItemChangeListener {
        public void onItemChange(String data);
    }

    public interface TextChangeListener {
        public void onTextChanged(String item);
    }

    public interface ChangeNotifier {
        public void notifyChanged(String item);
    }

    public interface PhoneListener {
        public void onLandlineNumber();

        public void onNonLandlineNumber();
    }

    public interface DateChangeNotifier {
        public void onDateChange(String item, DataProvider.DateType dateType);
    }

    public interface OnDataFetchedListener {
        public void onDataReceived(String item);
    }

    public interface DataUpdaterListener {
        public void onUpdateCompletion(BaseResult baseResult);
    }

    public interface SumListener {
        public void onValueChanged(Widget widget, Integer value);
    }

}
