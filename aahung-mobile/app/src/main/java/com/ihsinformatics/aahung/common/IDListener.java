package com.ihsinformatics.aahung.common;

import com.ihsinformatics.aahung.views.DataProvider;
import com.ihsinformatics.aahung.views.TextWidget;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import static com.ihsinformatics.aahung.common.Keys.DATE_GRANT_BEGINS;
import static com.ihsinformatics.aahung.common.Keys.CITY_VILLAGE;
import static com.ihsinformatics.aahung.common.Keys.DONOR;
import static com.ihsinformatics.aahung.common.Keys.DONOR_NAME;
import static com.ihsinformatics.aahung.common.Keys.LEVEL_OF_PROGRAM;
import static com.ihsinformatics.aahung.common.Keys.LOCATION_NAME;
import static com.ihsinformatics.aahung.common.Keys.PARTNER_WITH;
import static com.ihsinformatics.aahung.common.Keys.PROJECT_NAME;

public class IDListener implements WidgetIDListener, WidgetContract.ItemChangeListener, WidgetContract.ChangeNotifier {


    private final String randomID;
    private TextWidget widget;
    private DataProvider.IDType type;
    Map<String, String> idMap = new HashMap<>();


    public IDListener(TextWidget widget, DataProvider.IDType type) {
        this.widget = widget;
        this.type = type;

        if (type.equals(DataProvider.IDType.SCHOOL_ID))
            randomID = String.format("%04d", new Random().nextInt(10000));
        else if (type.equals(DataProvider.IDType.INSTITUTE_ID))
            randomID = String.format("%03d", new Random().nextInt(1000));
        else if (type.equals(DataProvider.IDType.PARENT_LOCATION_ID))
            randomID = String.format("%02d", new Random().nextInt(100));
        else
            randomID = String.format("%03d", new Random().nextInt(1000));
    }

    @Override
    public void onWidgetChange(String text, String key) {
        StringBuilder stringBuilder = new StringBuilder();
        String[] splitted = text.split(" ");
        for (String value : splitted) {
            if (value.length() > 0)
                stringBuilder.append(value.charAt(0));
        }
        idMap.put(key, stringBuilder.toString().toUpperCase());
        updateWidget();
    }

    @Override
    public void onWidgetChange(String text, String key, boolean isfullText) {
        if (isfullText)
            idMap.put(key, text.toUpperCase());

        updateWidget();
    }


    @Override
    public void onItemChange(String district) {
        String districtWithoutSpace = district.replaceAll("\\s", "");
        idMap.put(CITY_VILLAGE, Districts.valueOf(districtWithoutSpace).getShortName());
        updateWidget();
    }

    @Override
    public void notifyChanged(String value) {
        if (value.toLowerCase().equals("primary")) {
            idMap.put(LEVEL_OF_PROGRAM, "PRI");
        } else if (value.toLowerCase().equals("secondary")) {
            idMap.put(LEVEL_OF_PROGRAM, "SEC");
        } else if (value.equals("LSE") || value.equals("SRHM")) {
            idMap.put(PARTNER_WITH, value);
        }
        updateWidget();
    }


    private void updateWidget() {
        if (type.equals(DataProvider.IDType.DONOR_ID)) {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.append(idMap.get(DONOR_NAME) != null ? idMap.get(DONOR_NAME) : "");
            widget.setText(stringBuilder.toString());
        } else if (type.equals(DataProvider.IDType.SCHOOL_ID)) {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.append(idMap.get(CITY_VILLAGE) != null ? idMap.get(CITY_VILLAGE) : "")
                    .append(idMap.get(LOCATION_NAME) != null ? idMap.get(LOCATION_NAME) : "")
                    .append(idMap.get(LEVEL_OF_PROGRAM) != null ? idMap.get(LEVEL_OF_PROGRAM) : "")
                    .append("-")
                    .append(randomID);

            widget.setText(stringBuilder.toString());
        } else if (type.equals(DataProvider.IDType.PROJECT_ID)) {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.append(idMap.get(DONOR) != null ? idMap.get(DONOR) : "")
                    .append("-")
                    .append(idMap.get(PROJECT_NAME) != null ? idMap.get(PROJECT_NAME) : "")
                    .append("-")
                    .append(idMap.get(DATE_GRANT_BEGINS) != null ? idMap.get(DATE_GRANT_BEGINS) : "");

            widget.setText(stringBuilder.toString());

        } else if (type.equals(DataProvider.IDType.PARENT_LOCATION_ID)) {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.append(idMap.get(LOCATION_NAME) != null ? idMap.get(LOCATION_NAME) : "")
                    .append(idMap.get(PARTNER_WITH) != null ? idMap.get(PARTNER_WITH) : "")
                    .append("-")
                    .append(randomID);

            widget.setText(stringBuilder.toString());

        } else {
            StringBuilder stringBuilder = new StringBuilder();
            for (String value : idMap.values()) {
                stringBuilder.append(value);
            }
            stringBuilder.append("-")
                    .append(randomID);
            widget.setText(stringBuilder.toString());
        }


    }
}
