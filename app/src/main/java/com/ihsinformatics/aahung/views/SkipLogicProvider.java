package com.ihsinformatics.aahung.views;

import com.ihsinformatics.aahung.model.ToggleWidgetData;
import com.ihsinformatics.aahung.model.metadata.Definition;

import java.util.List;
import java.util.Map;

public interface SkipLogicProvider {
    public void addDependentWidgets(Map<String, ToggleWidgetData.SkipData> widgetMaps);
    public Widget hideOptions(String... optionShortNames);
}
