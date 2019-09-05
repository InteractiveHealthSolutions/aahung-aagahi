package com.ihsinformatics.aahung.model;

import com.ihsinformatics.aahung.model.results.BaseResult;
import com.ihsinformatics.aahung.common.ResponseCallback;
import com.ihsinformatics.aahung.views.TextWidget;
import com.ihsinformatics.aahung.views.Widget;

import java.util.ArrayList;
import java.util.List;

import static android.text.TextUtils.isEmpty;

public class DataUpdater implements ResponseCallback.ResponseProvider {

    private List<Widget> widgetsToUpdate = new ArrayList<>();


    public Widget add(Widget widget) {
        widgetsToUpdate.add(widget);
        return widget;
    }


    @Override
    public void onSuccess(BaseResult baseResult) {
        for (Widget widget : widgetsToUpdate) {
            String value = "";
            if (widget.hasAttribute()) {
                value = baseResult.getAttributeValue(widget.getValue().getParam());
            } else {
                value = baseResult.getValue(widget.getValue().getParam());
            }

            if (widget instanceof TextWidget) {
                TextWidget textWidget = (TextWidget) widget;
                if (!isEmpty(value))
                    textWidget.setText(value);
            }
        }
    }
}
