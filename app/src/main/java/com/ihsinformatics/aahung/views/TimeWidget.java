package com.ihsinformatics.aahung.views;

import android.app.TimePickerDialog;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.TimePicker;

import androidx.databinding.DataBindingUtil;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.databinding.WidgetDateBinding;
import com.ihsinformatics.aahung.databinding.WidgetTimeBinding;
import com.ihsinformatics.aahung.model.Attribute;
import com.ihsinformatics.aahung.model.WidgetData;

import java.util.Calendar;
import java.util.Date;

import static android.text.TextUtils.isEmpty;

public class TimeWidget extends Widget implements TimePickerDialog.OnTimeSetListener {

    private Context context;
    private WidgetTimeBinding binding;
    private String question;
    private String key;
    private boolean isMandatory;
    private Attribute attribute;

    public TimeWidget(Context context, String key, String question, boolean isMandatory) {
        this.context = context;
        this.question = question;
        this.key = key;
        this.isMandatory = isMandatory;
        init();
    }

    public TimeWidget(Context context, Attribute attribute, String question, boolean isMandatory) {
        this.context = context;
        this.question = question;
        this.attribute = attribute;
        this.isMandatory = isMandatory;
        init();
    }

    private void init() {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        binding = DataBindingUtil.inflate(inflater, R.layout.widget_time, null, false);
        binding.imageCalendar.setOnClickListener(new CustomClickListener());
        binding.time.setOnClickListener(new CustomClickListener());
        binding.title.setText(question);
    }


    @Override
    public View getView() {
        return binding.getRoot();
    }

    @Override
    public WidgetData getValue() {
        return new WidgetData(key, binding.time.getText().toString());
    }


    @Override
    public boolean isValid() {
        boolean isValid = true;
        if (isMandatory && isEmpty(binding.time.getText())) {
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
    public void onDataChanged(String data) {

    }

    @Override
    public Widget addHeader(String headerText) {
        binding.layoutHeader.headerText.setText(headerText);
        binding.layoutHeader.headerRoot.setVisibility(View.VISIBLE);
        return this;
    }

    @Override
    public void onTimeSet(TimePicker timePicker, int i, int i1) {

        if (i == 12) {
            binding.time.setText(12 + " : " + i1 + " PM");
        } else if (i == 0) {
            binding.time.setText(12 + " : " + i1 + " AM");
        } else if (i > 12) {
            binding.time.setText((i - 12) + " : " + i1 + " PM");
        } else {
            binding.time.setText(i + " : " + i1 + " AM");
        }
    }

    private class CustomClickListener implements View.OnClickListener {
        @Override
        public void onClick(View view) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(new Date());
            TimePickerDialog datePickerDialog = new TimePickerDialog(context, R.style.MyDatePickerDialogTheme, TimeWidget.this, calendar.get(Calendar.HOUR_OF_DAY), calendar.get(Calendar.MINUTE), false);
            datePickerDialog.show();
        }
    }

    @Override
    public boolean hasAttribute() {
        return attribute != null;
    }

    @Override
    public String getAttributeTypeId() {
        return attribute.getAttributeID();
    }

    @Override
    public boolean isViewOnly() {
        return false;
    }
}
