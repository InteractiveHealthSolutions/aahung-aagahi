package com.ihsinformatics.aahung.model;


import com.ihsinformatics.aahung.common.WidgetContract;
import com.ihsinformatics.aahung.views.MultiSelectWidget;
import com.ihsinformatics.aahung.views.RadioWidget;
import com.ihsinformatics.aahung.views.Widget;

import java.util.HashMap;
import java.util.Map;

public class RadioSwitcher implements WidgetContract.ChangeNotifier {
    Widget actionWidget;
    Map<String, String> map = new HashMap<>();

    public RadioSwitcher(Widget actionWidget) {
        this.actionWidget = actionWidget;
    }

    public void add(String key, String value) {
        map.put(key, value);
    }


    @Override
    public void notifyChanged(String item) {
        String base = map.get(item);
        if (actionWidget instanceof RadioWidget) {
            ((RadioWidget) actionWidget).onItemChange(base);
        } else if (actionWidget instanceof MultiSelectWidget) {
            ((MultiSelectWidget) actionWidget).setItemStatus(base,true);
        }

    }
}
