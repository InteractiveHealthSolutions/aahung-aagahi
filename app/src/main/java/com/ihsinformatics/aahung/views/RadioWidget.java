package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;

import androidx.databinding.DataBindingUtil;

import com.ihsinformatics.aahung.R;

import com.ihsinformatics.aahung.common.BaseAttribute;
import com.ihsinformatics.aahung.common.MultiWidgetContract;
import com.ihsinformatics.aahung.common.ScoreContract;
import com.ihsinformatics.aahung.common.WidgetContract;
import com.ihsinformatics.aahung.model.ToggleWidgetData;
import com.ihsinformatics.aahung.model.WidgetData;
import com.ihsinformatics.aahung.databinding.WidgetRadioBinding;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lib.kingja.switchbutton.SwitchMultiButton;

import static android.text.TextUtils.isEmpty;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTES;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE_ID;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE_VALUE;

public class RadioWidget extends Widget implements SwitchMultiButton.OnSwitchListener, SkipLogicProvider, WidgetContract.ItemChangeListener, MultiWidgetContract.ItemChangeListener {

    private BaseAttribute attribute;
    private Context context;
    private String key;
    private String question;
    private boolean isMandatory;
    private String selectedText;
    private WidgetRadioBinding binding;
    private Map<String, ToggleWidgetData.SkipData> widgetMaps;
    private String[] widgetTexts;
    private List<WidgetContract.ChangeNotifier> widgetSwitchListenerList = new ArrayList<>();
    private List<MultiWidgetContract.ChangeNotifier> multiSwitchListenerList = new ArrayList<>();
    private ScoreContract.ScoreListener scoreListener;

    public RadioWidget(Context context, String key, String question, boolean isMandatory, String... widgetTexts) {
        this.context = context;
        this.key = key;
        this.question = question;
        this.isMandatory = isMandatory;
        this.widgetTexts = widgetTexts;
        init();
    }

    public RadioWidget(Context context, BaseAttribute attribute, String question, boolean isMandatory, String... widgetTexts) {
        this.context = context;
        this.attribute = attribute;
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
        WidgetData widgetData = null;
        if (key != null) {
            widgetData = new WidgetData(key, selectedText);
        } else {
            JSONObject attributeType = new JSONObject();
            Map<String, Object> map = new HashMap();
//            try {
//                attributeType.put(ATTRIBUTE_TYPE_ID, attribute.getAttributeID());
//                map.put(ATTRIBUTE_TYPE, attributeType);
//                Definition definition = Definition.getDefinitionByFullName(selectedText);
//                map.put(ATTRIBUTE_TYPE_VALUE, definition != null ? definition.getDefinitionId() : selectedText);
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
        if (isMandatory && isEmpty(selectedText)) {
            isValid = false;
            binding.title.setError("Please select any one value");
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

    public void setWidgetSwitchListener(WidgetContract.ChangeNotifier widgetSwitchListener) {
        widgetSwitchListenerList.add(widgetSwitchListener);
    }

    @Override
    public void onDataChanged(String data) {
        checkSkipLogic(data, widgetMaps);

        for (WidgetContract.ChangeNotifier widgetSwitchListener : widgetSwitchListenerList)
            widgetSwitchListener.notifyChanged(data);


        for (MultiWidgetContract.ChangeNotifier listener : multiSwitchListenerList) {
            listener.notifyWidget(this, data);
        }

        if (scoreListener != null) {
            if (data.equalsIgnoreCase("Yes"))
                scoreListener.onScoreUpdate(this, 1);
            else if (data.equalsIgnoreCase("No"))
                scoreListener.onScoreUpdate(this, 0);

        }

    }

    private void checkSkipLogic(String data, Map<String, ToggleWidgetData.SkipData> widgetMaps) {
        boolean hasChildMap = false;
        RadioWidget radioWidget = null;

        if (data != null && widgetMaps != null) {
            ToggleWidgetData.SkipData widgetData = widgetMaps.get(data);
            if (widgetData != null) {

                for (ToggleWidgetData.SkipData skipData : widgetMaps.values()) {
                    for (Widget widget : skipData.getWidgetsToToggle()) {
                        if (widget instanceof RadioWidget) {
                            radioWidget = (RadioWidget) widget;
                            hasChildMap = radioWidget.widgetMaps != null;
                        }

                        if (widgetData != skipData) {
                            widget.hideView();
                            if (hasChildMap) {
                                hideAllChildren(radioWidget.widgetMaps);
                            }
                        } else {
                            widget.showView();
                            if (hasChildMap) {
                                if (widget.getValue().getValue() != null)
                                    checkSkipLogic(widget.getValue().getValue().toString(), radioWidget.widgetMaps);
                                else
                                    hideAllChildren(radioWidget.widgetMaps);
                            }

                        }
                    }
                }
            } else {
                hideAllChildren(widgetMaps);
            }
        }
    }

    private void hideAllChildren(Map<String, ToggleWidgetData.SkipData> widgetMaps) {
        for (ToggleWidgetData.SkipData skipData : widgetMaps.values()) {
            for (Widget widget : skipData.getWidgetsToToggle()) {
                widget.hideView();
            }
        }
    }

    @Override
    public Widget addHeader(String headerText) {
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

    @Override
    public String getSelectedText() {
        return selectedText;
    }


    public Widget setScoreListener(ScoreContract.ScoreListener scoreCalculator) {
        this.scoreListener = scoreCalculator;
        return this;
    }


    public void setMultiSwitchListenerList(MultiWidgetContract.ChangeNotifier multiSwitchListener) {
        multiSwitchListenerList.add(multiSwitchListener);
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
