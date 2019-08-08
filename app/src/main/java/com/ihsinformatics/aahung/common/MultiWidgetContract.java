package com.ihsinformatics.aahung.common;

import android.widget.CheckBox;

import com.ihsinformatics.aahung.views.RadioWidget;
import com.ihsinformatics.aahung.views.Widget;

import java.util.List;

public interface MultiWidgetContract {
    public interface ItemChangeListener {
        public String getSelectedText();
    }

    public interface ChangeNotifier {
        public void notifyWidget(Widget widget, String data);
        public void notifyWidget(Widget widget, String data, boolean isChecked);
    }

    public interface MultiSwitchListener {
        public void onCheckedChanged(List<CheckBox> choices);
    }


}
