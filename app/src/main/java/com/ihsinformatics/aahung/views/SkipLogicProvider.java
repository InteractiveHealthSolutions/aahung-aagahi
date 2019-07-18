package com.ihsinformatics.aahung.views;

import com.ihsinformatics.aahung.model.ToggleWidgetData;

import java.util.Map;

public interface SkipLogicProvider {
    public void addDependentWidgets(Map<String, ToggleWidgetData.SkipData> widgetMaps);
}
