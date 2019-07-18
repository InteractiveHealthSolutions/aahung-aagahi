package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;

import androidx.databinding.DataBindingUtil;

import com.ihsinformatics.aahung.R;

import com.ihsinformatics.aahung.common.WidgetContract;
import com.ihsinformatics.aahung.model.ToggleWidgetData;
import com.ihsinformatics.aahung.model.WidgetData;
import com.ihsinformatics.aahung.databinding.WidgetRadioBinding;

import java.util.Iterator;
import java.util.Map;
import java.util.Objects;

import lib.kingja.switchbutton.SwitchMultiButton;

import static android.text.TextUtils.isEmpty;

public class RadioWidget extends Widget implements SwitchMultiButton.OnSwitchListener, SkipLogicProvider, WidgetContract.ItemChangeListener {

    private Context context;
    private String key;
    private String question;
    private boolean isMandatory;
    private String selectedText;
    private WidgetRadioBinding binding;
    private Map<String, ToggleWidgetData.SkipData> widgetMaps;
    private String[] widgetTexts;
    private WidgetContract.ChangeNotifier listener;

    public RadioWidget(Context context, String key, String question, boolean isMandatory, String... widgetTexts) {
        this.context = context;
        this.key = key;
        this.question = question;
        this.isMandatory = isMandatory;
        this.widgetTexts = widgetTexts;
        init();
    }

    @Override
    public void addDependentWidgets(Map<String, ToggleWidgetData.SkipData> widgetMaps) {
        this.widgetMaps = widgetMaps;
    }



    @Override
    public View getView() {
        return binding.getRoot();
    }


    @Override
    public WidgetData getValue() {
        return new WidgetData(key, selectedText);
    }

    @Override
    public boolean isValid() {
        boolean isValid = true;
        if (isMandatory && isEmpty(selectedText)) {
            isValid = false;
            binding.title.setError("Please select any one value");
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

    public void setListener(WidgetContract.ChangeNotifier listener) {
        this.listener = listener;
    }

    @Override
    protected void onDataChanged(String data) {
        if (widgetMaps != null) {
            ToggleWidgetData.SkipData widgetData = widgetMaps.get(selectedText);
            if (widgetData != null) {
                for (Widget widget : widgetData.getWidgetsToShow()) {
                    widget.showView();
                }
                for (Widget widget : widgetData.getWidgetsToHide()) {
                    widget.hideView();
                }

                for (Widget widget : widgetData.getWidgetsToToggle()) {
                    widget.showView();
                }
            } else {

                for (ToggleWidgetData.SkipData skipData : widgetMaps.values()) {
                    for (Widget widget : skipData.getWidgetsToToggle()) {
                        widget.hideView();
                    }
                }
            }


        }


        if (listener != null) {
            listener.notifyChanged(data);
        }

    }

    @Override
    protected Widget addHeader(String headerText) {
        binding.layoutHeader.headerText.setText(headerText);
        binding.layoutHeader.headerRoot.setVisibility(View.VISIBLE);
        return this;
    }


    private void init() {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        binding = DataBindingUtil.inflate(inflater, R.layout.widget_radio, null, false);
        binding.title.setText(question);
        binding.radio.setText(widgetTexts);
        binding.radio.setOnSwitchListener(this);
    }


    @Override
    public void onSwitch(int position, String tabText) {
        selectedText = tabText;
        onDataChanged(selectedText);
    }


    @Override
    public void onItemChange(String data) {
        for (int i = 0; i < widgetTexts.length; i++) {
            if (widgetTexts[i].equalsIgnoreCase(data)) {
                binding.radio.setSelectedTab(i);
            }
        }
    }


}
