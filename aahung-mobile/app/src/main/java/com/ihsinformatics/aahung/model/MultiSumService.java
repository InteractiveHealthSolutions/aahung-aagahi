package com.ihsinformatics.aahung.model;

import com.ihsinformatics.aahung.common.WidgetContract;
import com.ihsinformatics.aahung.views.EditTextWidget;
import com.ihsinformatics.aahung.views.Widget;

import java.util.HashMap;
import java.util.Map;

public class MultiSumService implements WidgetContract.SumListener {

    private Map<Widget, Integer> sumMap;
    private EditTextWidget actionWidget;

    public MultiSumService(EditTextWidget actionWidget) {
        this.actionWidget = actionWidget;
        this.sumMap = new HashMap<>();
    }


    public Widget addSumWidget(Widget widget) {
        sumMap.put(widget, 0);
        if (widget instanceof EditTextWidget)
            ((EditTextWidget) widget).setSumListener(this);
        return widget;
    }


    @Override
    public void onValueChanged(Widget widget, Integer value) {
        Integer sum = 0;

        sumMap.put(widget, value);
        for (Integer valueToAdd : sumMap.values()) {
            sum += valueToAdd;
        }
        actionWidget.setText("" + sum);
    }
}
