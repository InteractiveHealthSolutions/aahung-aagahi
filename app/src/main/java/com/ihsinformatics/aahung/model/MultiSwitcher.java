package com.ihsinformatics.aahung.model;

import com.ihsinformatics.aahung.common.MultiWidgetContract;
import com.ihsinformatics.aahung.views.RadioWidget;
import com.ihsinformatics.aahung.views.Widget;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class MultiSwitcher implements MultiWidgetContract.ChangeNotifier {

    Map<Set<String>, List<Widget>> mapper = new HashMap<>();
    List<Widget> widgets;
    Set<String> keyset;
    Map<RadioWidget, RadioWidget> switches;

    public MultiSwitcher(RadioWidget fistWidget, RadioWidget secondWidget) {

        switches = new HashMap<>();
        switches.put(fistWidget, secondWidget);
        switches.put(secondWidget, fistWidget);
    }

    public MultiSwitcher addNewOption() {
        widgets = new ArrayList<>();
        keyset = new HashSet<>();
        return this;
    }


    public MultiSwitcher addWidgets(Widget... widget) {
        widgets.addAll(Arrays.asList(widget));
        return this;
    }

    public Widget addWidget(Widget widget) {
        widgets.add(widget);
        return widget;
    }


    public MultiSwitcher addKeys(String... keys) {
        keyset.addAll(Arrays.asList(keys));
        return this;
    }

    public void build() {
        mapper.put(keyset, widgets);
    }


    @Override
    public void notifyWidget(RadioWidget widget, String data) {
        Set<String> sets = new HashSet<>();
        RadioWidget otherWidget = switches.get(widget);
        sets.add(otherWidget.getSelectedText());
        sets.add(data);
        List<Widget> widgetsToToggle = mapper.get(sets);
        if (widgetsToToggle != null) {
            for (List<Widget> widgets : mapper.values()) {
                if (widgets == widgetsToToggle) {
                    for (Widget mWidget : widgets) {
                        mWidget.showView();
                    }
                } else {
                    for (Widget mWidget : widgets) {
                        if (!widgetsToToggle.contains(mWidget))
                            mWidget.hideView();
                        else
                            mWidget.showView();
                    }

                }
            }
        } else {
            for (List<Widget> widgets : mapper.values()) {

                for (Widget mappedWidget : widgets) {
                    mappedWidget.hideView();
                }
            }
        }
    }
}
