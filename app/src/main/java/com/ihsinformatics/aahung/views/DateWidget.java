package com.ihsinformatics.aahung.views;

import android.app.DatePickerDialog;
import android.content.Context;
import android.content.res.Resources;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.DatePicker;

import androidx.databinding.DataBindingUtil;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.model.WidgetData;
import com.ihsinformatics.aahung.databinding.WidgetDateBinding;

import java.util.Calendar;
import java.util.Date;

import static android.text.TextUtils.isEmpty;

public class DateWidget extends Widget implements DatePickerDialog.OnDateSetListener {

    private Context context;
    private WidgetDateBinding binding;
    private String question;
    private String key;
    private boolean isMandatory;
    private boolean isWithoutDay = false;

    public DateWidget(Context context, String key, String question, boolean isMandatory) {
        this.context = context;
        this.question = question;
        this.key = key;
        this.isMandatory = isMandatory;
        init();
    }

    private void init() {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        binding = DataBindingUtil.inflate(inflater, R.layout.widget_date, null, false);
        binding.imageCalendar.setOnClickListener(new CustomClickListener());
        binding.title.setText(question);
    }

    public DateWidget enablePickerWithoutDay() {
        isWithoutDay = true;
        binding.dob.setHint("MM/YYYY");
        return this;
    }


    @Override
    public void onDateSet(DatePicker datePicker, int selectedYear, int selectedMonth, int selectedDay) {
        if (isWithoutDay)
            binding.dob.setText((selectedMonth + 1) + "/" + selectedYear);
        else
            binding.dob.setText(selectedDay + "/" + (selectedMonth + 1) + "/" + selectedYear);
    }

    @Override
    public View getView() {
        return binding.getRoot();
    }

    @Override
    public WidgetData getValue() {
        return new WidgetData(key, binding.dob.getText().toString());
    }


    @Override
    public boolean isValid() {
        boolean isValid = true;
        if (isMandatory && isEmpty(binding.dob.getText())) {
            binding.title.setError("Please Select " + question);
            isValid = false;
        }else {
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

    private class CustomClickListener implements View.OnClickListener {
        @Override
        public void onClick(View view) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(new Date());
            DatePickerDialog datePickerDialog = new DatePickerDialog(context, R.style.MyDatePickerDialogTheme, DateWidget.this, calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH) + 1, calendar.get(Calendar.DAY_OF_MONTH));
            Date date=new Date();
            datePickerDialog.getDatePicker().setMaxDate(date.getTime());
            datePickerDialog.show();


            //FIXME would work on later
      /*      if (isWithoutDay) {
                int daySpinnerId = Resources.getSystem().getIdentifier("date_picker_day", "id", "android");
                if (daySpinnerId != 0) {
                    View daySpinner = datePickerDialog.getDatePicker().findViewById(daySpinnerId);
                    if (daySpinner != null) {
                        daySpinner.setVisibility(View.GONE);
                    }
                }
            }*/




        }
    }
}
