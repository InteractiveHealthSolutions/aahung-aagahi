package com.ihsinformatics.aahung.common;

import com.ihsinformatics.aahung.views.DataProvider;
import com.ihsinformatics.aahung.views.DateWidget;

import java.util.Date;

import static com.ihsinformatics.aahung.common.Utils.getDateFromDBDateStr;

public class DateWatcher implements WidgetContract.DateChangeNotifier {

    DateWidget startWidget;
    DateWidget endWidget;

    public DateWatcher(DateWidget startWidget, DateWidget endWidget) {
        this.startWidget = startWidget;
        this.endWidget = endWidget;
    }

    public DateWatcher(DateWidget endWidget) {
        this.endWidget = endWidget;
    }


    @Override
    public void onDateChange(String dateStr, DataProvider.DateType dateType) {
        Date date = getDateFromDBDateStr(dateStr);

        if (dateType.equals(DataProvider.DateType.START) && endWidget != null) {
            endWidget.setMinDate(date);
        } else if (dateType.equals(DataProvider.DateType.END) && startWidget != null) {
            startWidget.setMaxDate(date);
        }


    }
}
