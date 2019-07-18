package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;

import androidx.databinding.DataBindingUtil;

import com.ihsinformatics.aahung.R;

import com.ihsinformatics.aahung.model.ToggleWidgetData;
import com.ihsinformatics.aahung.model.WidgetData;
import com.ihsinformatics.aahung.databinding.WidgetSpinnerBinding;


import java.util.List;
import java.util.Map;

import static android.text.TextUtils.isEmpty;

public class SpinnerWidget extends Widget implements SkipLogicProvider, AdapterView.OnItemSelectedListener {

    private final Context context;
    private String key;
    private final String question;
    private final List<String> items;
    private WidgetSpinnerBinding binding;
    private boolean isMandatory;
    private Map<String, ToggleWidgetData.SkipData> widgetMaps;

    public SpinnerWidget(Context context, String key, String question, List<String> items, boolean isMandatory) {
        this.context = context;
        this.key = key;
        this.question = question;
        this.items = items;
        this.isMandatory = isMandatory;
        init();

    }

    private void init() {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        binding = DataBindingUtil.inflate(inflater, R.layout.widget_spinner, null, false);
        ArrayAdapter<String> adapter = new ArrayAdapter<>(context, android.R.layout.simple_list_item_1, items);
        binding.spinner.setAdapter(adapter);
        binding.spinner.setOnItemSelectedListener(this);
        binding.title.setText(question);
    }


    @Override
    public View getView() {
        return binding.getRoot();
    }


    @Override
    public WidgetData getValue() {
        return new WidgetData(key, binding.spinner.getSelectedItem().toString());
    }

    @Override
    public boolean isValid() {
        boolean isValid = true;

        if ((isMandatory) && isEmpty(binding.spinner.getSelectedItem().toString())) {
            isValid = false;
        }
        return isValid;
    }

    @Override
    protected Widget hideView() {
        binding.getRoot().setVisibility(View.GONE);
        return this;
    }

    @Override
    protected Widget showView() {
        binding.getRoot().setVisibility(View.VISIBLE);
        return this;
    }

    @Override
    protected void onDataChanged(String data) {
        if (widgetMaps != null) {
            ToggleWidgetData.SkipData skipData = widgetMaps.get(data);
            if (skipData != null) {
                for (Widget widget : skipData.getWidgetsToShow())
                    widget.showView();

                for (Widget widget : skipData.getWidgetsToHide())
                    widget.hideView();

            }
        }

    }

    @Override
    protected Widget addHeader(String headerText) {
        binding.layoutHeader.headerText.setText(headerText);
        binding.layoutHeader.headerRoot.setVisibility(View.VISIBLE);
        return this;
    }


    @Override
    public void addDependentWidgets(Map<String, ToggleWidgetData.SkipData> widgetMaps) {
        this.widgetMaps = widgetMaps;
    }

    @Override
    public void onItemSelected(AdapterView<?> adapterView, View view, int position, long l) {
        String selectedValue = adapterView.getItemAtPosition(position).toString();
        onDataChanged(selectedValue);
    }

    @Override
    public void onNothingSelected(AdapterView<?> adapterView) {

    }
}
