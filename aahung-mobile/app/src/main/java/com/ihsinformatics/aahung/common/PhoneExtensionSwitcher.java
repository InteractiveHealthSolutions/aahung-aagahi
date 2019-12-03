package com.ihsinformatics.aahung.common;

import com.ihsinformatics.aahung.views.EditTextWidget;
import com.ihsinformatics.aahung.views.Widget;

public class PhoneExtensionSwitcher implements WidgetContract.PhoneListener {
    private Widget widget;

    public Widget add(Widget widget) {
        this.widget = widget;

        return widget;
    }

    @Override
    public void onLandlineNumber() {
        widget.showView();
    }

    @Override
    public void onNonLandlineNumber() {
        widget.hideView();
    }
}
