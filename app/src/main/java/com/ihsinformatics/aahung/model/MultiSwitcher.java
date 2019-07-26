package com.ihsinformatics.aahung.model;

import com.ihsinformatics.aahung.common.MultiWidgetContract;
import com.ihsinformatics.aahung.views.RadioWidget;
import com.ihsinformatics.aahung.views.SpinnerWidget;
import com.ihsinformatics.aahung.views.Widget;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class MultiSwitcher implements MultiWidgetContract.ChangeNotifier {

    Map<Set<String>, List<Widget>> mapper = new HashMap<>();
    List<Widget> widgets;
    Set<String> keyset;
    Map<Widget, List<Widget>> switches;

    public MultiSwitcher(Widget... widgetList) {
        List<Widget> widgets = Arrays.asList(widgetList);
        switches = new HashMap<>();
        for (Widget widget : widgets) {
            List<Widget> linkedList = new LinkedList<>();
            for (int i = 0; i < widgets.size(); i++) {
                if (widget != widgets.get(i)) {
                    linkedList.add(widgets.get(i));
                }
            }
            switches.put(widget, linkedList);
        }
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

    public MultiSwitcher addWidget(Widget widget) {
        widgets.add(widget);
        return this;
    }


    public MultiSwitcher addKeys(String... keys) {
        keyset.addAll(Arrays.asList(keys));
        return this;
    }

    public void build() {
        mapper.put(keyset, widgets);
    }


    @Override
    public void notifyWidget(Widget widget, String data) {
        Set<String> sets = new HashSet<>();

        List<Widget> otherWidgetList = switches.get(widget);
        for (Widget otherWidgets : otherWidgetList)
            sets.add(String.valueOf(otherWidgets.getValue().getValue()));
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
