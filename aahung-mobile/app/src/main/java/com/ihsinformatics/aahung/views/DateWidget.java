package com.ihsinformatics.aahung.views;

import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.content.Context;
import android.content.res.Resources;
import android.graphics.Color;
import android.text.Editable;
import android.text.Html;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.TextWatcher;
import android.text.style.ForegroundColorSpan;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.DatePicker;
import android.widget.TimePicker;

import androidx.databinding.DataBindingUtil;

import com.google.gson.Gson;
import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.BaseAttribute;
import com.ihsinformatics.aahung.common.DataChangeListener;
import com.ihsinformatics.aahung.common.IDListener;
import com.ihsinformatics.aahung.common.Utils;
import com.ihsinformatics.aahung.common.WidgetContract;
import com.ihsinformatics.aahung.common.WidgetIDListener;

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
import static com.ihsinformatics.aahung.common.Utils.getAge;
import static com.ihsinformatics.aahung.common.Utils.getDateStrFromDBDate;
import static com.ihsinformatics.aahung.common.Utils.getEstimatedDbDOB;

public class DateWidget extends Widget implements DatePickerDialog.OnDateSetListener, DataChangeListener.SimpleItemListener, TimePickerDialog.OnTimeSetListener, TextWatcher {

    private Context context;
    private WidgetDateBinding binding;
    private String question;
    private String key;
    private boolean isMandatory;
    private BaseAttribute attribute;
    private boolean isWithoutDay = false;
    private String dbValue;
    private WidgetContract.ChangeNotifier widgetChangeListener;
    private WidgetContract.DateChangeNotifier widgetDateChangeListener;
    private DataProvider.DateType dateType;
    private WidgetIDListener idListener;
    private boolean isFutureDateAllowed;
    private Date minDate;
    private Date maxDate;
    private boolean hasTime = false;
    private String dbtime = "";
    private boolean isAgeEnabled;

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
        binding.dob.setOnClickListener(new CustomClickListener());
        binding.layoutTime.setOnClickListener(new CustomClickListener());
        String sterric = context.getResources().getString(R.string.is_mandatory);
        binding.title.setText(Html.fromHtml(question + (isMandatory ? "<font color=\"#E22214\">" + sterric + "</font>" : "")));

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
    public void onTimeSet(TimePicker timePicker, int hourOfDay, int minute) {

        String minuteStr = (minute < 10) ? minuteStr = "0" + minute : "" + minute;

        if (hourOfDay == 12) {
            binding.time.setText(12 + ":" + minuteStr + " PM");
        } else if (hourOfDay == 0) {
            binding.time.setText(12 + ":" + minuteStr + " AM");
        } else if (hourOfDay > 12) {
            int hours = (hourOfDay - 12);
            String hourStr = (hours < 10) ? "0" + hours : "" + hours;
            binding.time.setText(hourStr + ":" + minuteStr + " PM");
        } else {
            String hourStr = (hourOfDay < 10) ? "0" + hourOfDay : "" + hourOfDay;
            binding.time.setText(hourStr + ":" + minuteStr + " AM");
        }

        dbtime = "" + hourOfDay + ":" + minuteStr + ":" + 00;
    }


    @Override
    public View getView() {
        return binding.getRoot();
    }

    @Override
    public WidgetData getValue() {
        WidgetData widgetData = null;

        if (key != null && !isEmpty(dbValue)) {
            if (hasTime) {
                String datetime = Utils.convertDateTime(dbValue, dbtime);
                widgetData = new WidgetData(key, datetime);
            } else
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

        if (isAgeEnabled) {
            if (isEmpty(binding.age.getText())) {
                binding.age.setError("Age can't be empty");
                isValid = false;
            } else if (Integer.valueOf(binding.age.getText().toString()) < 18) {
                binding.age.setError("Age can't be less than 18");
                isValid = false;
            } else {
                binding.age.setError(null);
            }
        }

        if (hasTime) {
            if (isMandatory && isEmpty(binding.time.getText())) {
                binding.title.setError("Please Select " + question);
                isValid = false;
            } else {
                binding.title.setError(null);
            }
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

    public DateWidget enableTime() {
        this.hasTime = true;
        binding.layoutTime.setVisibility(View.VISIBLE);
        return this;
    }

    @Override
    public void onDataChanged(String date) {
        binding.dob.setText(date);
        if (widgetChangeListener != null)
            widgetChangeListener.notifyChanged(date);

        if (widgetDateChangeListener != null)
            widgetDateChangeListener.onDateChange(dbValue, dateType);

        if (isAgeEnabled) {
            binding.age.setText("" + getAge(dbValue));
        }
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

    public void setDateChangeListener(WidgetContract.DateChangeNotifier widgetDateChangeListener, DataProvider.DateType dateType) {
        this.widgetDateChangeListener = widgetDateChangeListener;
        this.dateType = dateType;
    }

    public void setMinDate(Date minDate) {
        this.minDate = minDate;
    }

    public DateWidget setMaxDate(Date maxDate) {
        this.maxDate = maxDate;
        return this;
    }

    public void setDate(Date date) {
        String stringDate = Utils.convertDateToString(date);
        onDataChanged(stringDate);

    }

    public Widget enableAge() {
        isAgeEnabled = true;
        binding.age.setVisibility(View.VISIBLE);
        binding.age.addTextChangedListener(this);
        binding.or.setVisibility(View.VISIBLE);
        return this;
    }

    @Override
    public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
        //stub
    }

    @Override
    public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
        if (charSequence.length() > 0) {
            Integer age = Integer.valueOf(charSequence.toString());
            dbValue = getEstimatedDbDOB(age);
            String dateStrFromDBDate = getDateStrFromDBDate(dbValue);
            binding.dob.setText(dateStrFromDBDate);
        }
    }

    @Override
    public void afterTextChanged(Editable editable) {
        //stub
    }

    private class CustomClickListener implements View.OnClickListener {
        @Override
        public void onClick(View view) {
            if (view.equals(binding.dob)) {
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(new Date());
                int year = isAgeEnabled ? calendar.get(Calendar.YEAR) - 18 : calendar.get(Calendar.YEAR);
                int day = isAgeEnabled ? calendar.get(Calendar.DAY_OF_MONTH) - 1 : calendar.get(Calendar.DAY_OF_MONTH);
                DatePickerDialog datePickerDialog = new DatePickerDialog(context, R.style.MyDatePickerDialogTheme, DateWidget.this, year, calendar.get(Calendar.MONTH) + 1, day);
                Date date = new Date();
                if (isFutureDateAllowed) {
                    if (minDate != null) {
                        datePickerDialog.getDatePicker().setMinDate(minDate.getTime());
                    } else
                        datePickerDialog.getDatePicker().setMinDate(date.getTime());
                } else {
                    if (minDate != null)
                        datePickerDialog.getDatePicker().setMinDate(minDate.getTime());

                    if (maxDate != null)
                        datePickerDialog.getDatePicker().setMaxDate(maxDate.getTime());
                    else
                        datePickerDialog.getDatePicker().setMaxDate(date.getTime());
                }
                datePickerDialog.show();
            } else if (view.equals(binding.layoutTime)) {
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(new Date());
                TimePickerDialog datePickerDialog = new TimePickerDialog(context, R.style.MyDatePickerDialogTheme, DateWidget.this, calendar.get(Calendar.HOUR_OF_DAY), calendar.get(Calendar.MINUTE), false);
                datePickerDialog.show();
            }
        }
    }

    public boolean isAgeEnabled() {
        return isAgeEnabled;
    }

    @Override
    public boolean hasAttribute() {
        return attribute != null;
    }
}
