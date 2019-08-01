package com.ihsinformatics.aahung.common;

import com.ihsinformatics.aahung.views.RadioWidget;
import com.ihsinformatics.aahung.views.Widget;

public interface MultiWidgetContract {
    public interface ItemChangeListener{
        public String getSelectedText();
    }

    public interface ChangeNotifier{
        public void notifyWidget(Widget widget, String data);
        public void notifyWidget(Widget widget, String data,boolean isChecked);
    }
}
