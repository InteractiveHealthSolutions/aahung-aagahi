package com.ihsinformatics.aahung.common;

import com.ihsinformatics.aahung.views.DataProvider;
import com.ihsinformatics.aahung.views.TextWidget;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import static com.ihsinformatics.aahung.common.Keys.DISTRICT;
import static com.ihsinformatics.aahung.common.Keys.DONOR_NAME;
import static com.ihsinformatics.aahung.common.Keys.LEVEL_OF_PROGRAM;
import static com.ihsinformatics.aahung.common.Keys.LOCATION_NAME;
import static com.ihsinformatics.aahung.common.Keys.PROJECT_NAME;

public class IDListener implements WidgetIDListener, WidgetContract.ItemChangeListener, WidgetContract.ChangeNotifier {


    private final String randomID;
    private TextWidget widget;
    private DataProvider.IDType type;
    Map<String, String> idMap = new HashMap<>();


    public IDListener(TextWidget widget, DataProvider.IDType type) {
        this.widget = widget;
        this.type = type;
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

    private void updateWidget() {
        if (type.equals(DataProvider.IDType.DONOR_ID)) {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.append(idMap.get(DONOR_NAME) != null ? idMap.get(DONOR_NAME) : "")
                    .append("-")
                    .append(idMap.get(PROJECT_NAME) != null ? idMap.get(PROJECT_NAME) : "")
                    .append("-")
                    .append(randomID);

            widget.setText(stringBuilder.toString());
        } else if (type.equals(DataProvider.IDType.SCHOOL_ID)) {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.append(idMap.get(DISTRICT) != null ? idMap.get(DISTRICT) : "")
                    .append(idMap.get(LOCATION_NAME) != null ? idMap.get(LOCATION_NAME) : "")
                    .append(idMap.get(LEVEL_OF_PROGRAM) != null ? idMap.get(LEVEL_OF_PROGRAM) : "")
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

    @Override
    public void onItemChange(String district) {
        String districtWithoutSpace = district.replaceAll("\\s", "");
        idMap.put(DISTRICT, Districts.valueOf(districtWithoutSpace).getShortName());
        updateWidget();
    }

    @Override
    public void notifyChanged(String schoolName) {
        if (schoolName.toLowerCase().equals("primary")) {
            idMap.put(LEVEL_OF_PROGRAM, "PRI");
        } else if (schoolName.toLowerCase().equals("secondary")) {
            idMap.put(LEVEL_OF_PROGRAM, "SEC");
        }
        updateWidget();
    }
}
