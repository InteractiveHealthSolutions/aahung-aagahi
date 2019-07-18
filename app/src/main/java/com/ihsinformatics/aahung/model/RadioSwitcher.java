package com.ihsinformatics.aahung.model;


import com.ihsinformatics.aahung.common.WidgetContract;
import com.ihsinformatics.aahung.views.RadioWidget;

import java.util.HashMap;
import java.util.Map;

public class RadioSwitcher implements WidgetContract.ChangeNotifier {
    String target;
    RadioWidget actionWidget;
    Map<String, String> map = new HashMap<>();

    public RadioSwitcher(RadioWidget actionWidget) {
        this.actionWidget = actionWidget;
    }

    public void add(String key, String value) {
        map.put(key, value);
    }


    @Override
    public void notifyChanged(String item) {
        String base = map.get(item);
        actionWidget.onItemChange(base);

    }
}
