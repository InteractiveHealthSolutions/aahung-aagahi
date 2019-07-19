package com.ihsinformatics.aahung.model;

import com.ihsinformatics.aahung.views.Widget;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ToggleWidgetData {


    SkipData widgetList;
    Map<String, SkipData> questionMap = new HashMap();


    public Map<String, SkipData> getToggleMap() {
        return questionMap;
    }

    public SkipData addOption(String option) {
        widgetList = new SkipData(option);
        return widgetList;
    }

    private void build() {
        if (widgetList != null) {
            questionMap.put(widgetList.getOption(), widgetList);
        }
    }


    public class SkipData {
        private List<Widget> widgetsToToggle = new ArrayList<>();
        private String option;

        SkipData(String option) {
            this.option = option;
        }


        public Widget addWidgetToToggle(Widget widget) {
            widgetsToToggle.add(widget);
            return widget;
        }


        public String getOption() {
            return option;
        }

        public List<Widget> getWidgetsToToggle() {
            return widgetsToToggle;
        }



        public void build() {
         ToggleWidgetData.this.build();
        }
    }


}
