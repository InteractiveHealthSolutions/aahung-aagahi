package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;

import androidx.databinding.DataBindingUtil;

import com.google.gson.Gson;
import com.ihsinformatics.aahung.R;

import com.ihsinformatics.aahung.common.BaseAttribute;
import com.ihsinformatics.aahung.common.MultiWidgetContract;
import com.ihsinformatics.aahung.common.WidgetContract;
import com.ihsinformatics.aahung.model.Attribute;
import com.ihsinformatics.aahung.model.MultiSwitcher;
import com.ihsinformatics.aahung.model.ToggleWidgetData;
import com.ihsinformatics.aahung.model.WidgetData;
import com.ihsinformatics.aahung.databinding.WidgetSpinnerBinding;
import com.ihsinformatics.aahung.model.metadata.Definition;


import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static android.text.TextUtils.isEmpty;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTES;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE_ID;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE_VALUE;

public class SpinnerWidget extends Widget implements SkipLogicProvider, AdapterView.OnItemSelectedListener {

    private final Context context;
    private String key;
    private final String question;
    private final List<String> items;
    private WidgetSpinnerBinding binding;
    private boolean isMandatory;
    private Map<String, ToggleWidgetData.SkipData> widgetMaps;
    private MultiWidgetContract.ChangeNotifier multiSwitchListener;
    private WidgetContract.ItemChangeListener itemChangeListener;
    private BaseAttribute attribute;

    public SpinnerWidget(Context context, String key, String question, List<String> items, boolean isMandatory) {
        this.context = context;
        this.key = key;
        this.question = question;
        this.items = items;
        this.isMandatory = isMandatory;
        init();
    }

    public SpinnerWidget(Context context, BaseAttribute attribute, String question, List<String> items, boolean isMandatory) {
        this.context = context;
        this.attribute = attribute;
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
        WidgetData widgetData = null;
        if (key != null) {
            widgetData = new WidgetData(key, binding.spinner.getSelectedItem().toString());
        } else {
            JSONObject attributeType = new JSONObject();
            Map<String,Object> map = new HashMap();
//            try {
//                attributeType.put(ATTRIBUTE_TYPE_ID, attribute.getAttributeID());
//                map.put(ATTRIBUTE_TYPE,attributeType);
//                Definition definition = Definition.getDefinitionByFullName( binding.spinner.getSelectedItem().toString());
//                map.put(ATTRIBUTE_TYPE_VALUE, definition != null ? definition.getDefinitionId() : "");
//                widgetData = new WidgetData(ATTRIBUTES, new JSONObject(map));
//            } catch (JSONException e) {
//                e.printStackTrace();
//            }
        }
        return widgetData;
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
        if (widgetMaps != null) {
            ToggleWidgetData.SkipData widgetData = widgetMaps.get(data);
            if (widgetData != null) {

                for (ToggleWidgetData.SkipData skipData : widgetMaps.values()) {
                    for (Widget widget : skipData.getWidgetsToToggle()) {
                        if (widgetData != skipData)
                            widget.hideView();
                        else
                            widget.showView();
                    }
                }
            } else {

                for (ToggleWidgetData.SkipData skipData : widgetMaps.values()) {
                    for (Widget widget : skipData.getWidgetsToToggle()) {
                        widget.hideView();
                    }
                }
            }
        }


        if (multiSwitchListener != null) {
            multiSwitchListener.notifyWidget(this, data);
        }

        if (itemChangeListener != null) {
            itemChangeListener.onItemChange(data);
        }

    }

    @Override
    public Widget addHeader(String headerText) {
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

    public void updateAdaper(List<String> items) {
        ArrayAdapter<String> adapter = new ArrayAdapter<>(context, android.R.layout.simple_list_item_1, items);
        binding.spinner.setAdapter(adapter);
    }

    public void setItemChangeListener(WidgetContract.ItemChangeListener itemChangeListener) {
        this.itemChangeListener = itemChangeListener;
    }


    public void setMultiWidgetSwitchListener(MultiWidgetContract.ChangeNotifier multiSwitchListener) {
        this.multiSwitchListener = multiSwitchListener;
    }

    @Override
    public boolean hasAttribute() {
        return attribute != null;
    }
}
