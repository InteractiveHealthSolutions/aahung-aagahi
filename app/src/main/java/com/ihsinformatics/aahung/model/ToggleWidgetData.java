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
        private List<Widget> widgetsToShow = new ArrayList<>();
        private List<Widget> widgetsToHide = new ArrayList<>();
        private List<Widget> widgetsToToggle = new ArrayList<>();
        private String option;

        SkipData(String option) {
            this.option = option;
        }

        public SkipData addWidgetToShow(Widget widget) {
            widgetsToShow.add(widget);
            return this;
        }

        public SkipData addWidgetToHide(Widget widget) {
            widgetsToHide.add(widget);
            return this;
        }


        public SkipData addWidgetToToggle(Widget widget) {
            widgetsToToggle.add(widget);
            return this;
        }

        public String getOption() {
            return option;
        }

        public List<Widget> getWidgetsToShow() {
            return widgetsToShow;
        }

        public List<Widget> getWidgetsToHide() {
            return widgetsToHide;
        }

        public List<Widget> getWidgetsToToggle() {
            return widgetsToToggle;
        }



        public void build() {
         ToggleWidgetData.this.build();
        }
    }


}
