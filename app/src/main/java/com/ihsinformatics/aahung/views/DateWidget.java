package com.ihsinformatics.aahung.views;

import android.app.DatePickerDialog;
import android.content.Context;
import android.content.res.Resources;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.DatePicker;

import androidx.databinding.DataBindingUtil;

import com.google.gson.Gson;
import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.BaseAttribute;
import com.ihsinformatics.aahung.common.IDListener;
import com.ihsinformatics.aahung.common.WidgetContract;
import com.ihsinformatics.aahung.common.WidgetIDListener;
import com.ihsinformatics.aahung.model.Attribute;
import com.ihsinformatics.aahung.model.WidgetData;
import com.ihsinformatics.aahung.databinding.WidgetDateBinding;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static android.text.TextUtils.isEmpty;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTES;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE_ID;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE_VALUE;

public class DateWidget extends Widget implements DatePickerDialog.OnDateSetListener {

    private Context context;
    private WidgetDateBinding binding;
    private String question;
    private String key;
    private boolean isMandatory;
    private BaseAttribute attribute;
    private boolean isWithoutDay = false;
    private String dbValue;
    private WidgetContract.ChangeNotifier widgetChangeListener;
    private WidgetIDListener idListener;
    private boolean isFutureDateAllowed;

    public DateWidget(Context context, String key, String question, boolean isMandatory) {
        this.context = context;
        this.question = question;
        this.key = key;
        this.isMandatory = isMandatory;
        init();
    }

    public DateWidget(Context context, BaseAttribute attribute, String question, boolean isMandatory) {
        this.context = context;
        this.question = question;
        this.attribute = attribute;
        this.isMandatory = isMandatory;
        init();
    }

    private void init() {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        binding = DataBindingUtil.inflate(inflater, R.layout.widget_date, null, false);
        binding.imageCalendar.setOnClickListener(new CustomClickListener());
        binding.dob.setOnClickListener(new CustomClickListener());
        binding.title.setText(question);
    }

    public DateWidget enablePickerWithoutDay() {
        isWithoutDay = true;
        binding.dob.setHint("MM/YYYY");
        return this;
    }


    @Override
    public void onDateSet(DatePicker datePicker, int selectedYear, int selectedMonth, int selectedDay) {

        String mySelectedMonth, mySelectedDay;
        selectedMonth = selectedMonth + 1;    // Months start with 0

        if (selectedMonth / 10 < 1)
            mySelectedMonth = "0" + (selectedMonth);
        else
            mySelectedMonth = String.valueOf(selectedMonth);

        if (selectedDay / 10 < 1)
            mySelectedDay = "0" + (selectedDay);
        else
            mySelectedDay = String.valueOf(selectedDay);


        dbValue = selectedYear + "-" + (mySelectedMonth) + "-" + mySelectedDay;
        String date;
        if (isWithoutDay)
            date = (mySelectedMonth) + "/" + selectedYear;
        else
            date = mySelectedDay + "/" + (mySelectedMonth) + "/" + selectedYear;
        onDataChanged(date);

        if (idListener != null)
            idListener.onWidgetChange("" + selectedYear, key != null ? key : attribute.getAttributeName(), true);
    }

    @Override
    public View getView() {
        return binding.getRoot();
    }

    @Override
    public WidgetData getValue() {
        WidgetData widgetData = null;
        if (key != null && !isEmpty(dbValue)) {
            widgetData = new WidgetData(key, dbValue);
        } else {
            JSONObject attributeType = new JSONObject();
            Map<String, Object> map = new HashMap();
            try {
                attributeType.put(ATTRIBUTE_TYPE_ID, attribute.getAttributeID());
                map.put(ATTRIBUTE_TYPE, attributeType);
                map.put(ATTRIBUTE_TYPE_VALUE, dbValue);
                widgetData = new WidgetData(ATTRIBUTES, new JSONObject(map));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return widgetData;
    }


    @Override
    public boolean isValid() {
        boolean isValid = true;
        if (isMandatory && isEmpty(binding.dob.getText())) {
            binding.title.setError("Please Select " + question);
            isValid = false;
        } else {
            binding.title.setError(null);
        }
        return isValid;
    }

    @Override
    public Widget hideView() {
        binding.getRoot().setVisibility(View.GONE);
        return this;
    }

    @Override
    public Widget showView() {
        binding.getRoot().setVisibility(View.VISIBLE);
        return this;
    }

    @Override
    public void onDataChanged(String date) {
        binding.dob.setText(date);
        if (widgetChangeListener != null)
            widgetChangeListener.notifyChanged(date);
    }

    @Override
    public Widget addHeader(String headerText) {
        binding.layoutHeader.headerText.setText(headerText);
        binding.layoutHeader.headerRoot.setVisibility(View.VISIBLE);
        return this;
    }

    @Override
    public Integer getAttributeTypeId() {
        return attribute.getAttributeID();
    }

    @Override
    public boolean isViewOnly() {
        return false;
    }

    public void setWidgetChangeListener(WidgetContract.ChangeNotifier widgetChangeListener) {
        this.widgetChangeListener = widgetChangeListener;
    }

    public void setWidgetIDListener(WidgetIDListener idListener) {
        this.idListener = idListener;
    }

    public DateWidget enableFutureDates() {
        isFutureDateAllowed = true;
        return this;
    }

    private class CustomClickListener implements View.OnClickListener {
        @Override
        public void onClick(View view) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(new Date());
            DatePickerDialog datePickerDialog = new DatePickerDialog(context, R.style.MyDatePickerDialogTheme, DateWidget.this, calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH) + 1, calendar.get(Calendar.DAY_OF_MONTH));
            Date date = new Date();
            if (isFutureDateAllowed)
                datePickerDialog.getDatePicker().setMinDate(date.getTime());
            else
                datePickerDialog.getDatePicker().setMaxDate(date.getTime());
            datePickerDialog.show();
        }
    }

    @Override
    public boolean hasAttribute() {
        return attribute != null;
    }
}
