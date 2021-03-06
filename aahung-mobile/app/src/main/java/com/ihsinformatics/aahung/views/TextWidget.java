package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;

import androidx.databinding.DataBindingUtil;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.BaseAttribute;
import com.ihsinformatics.aahung.common.MultiWidgetContract;
import com.ihsinformatics.aahung.common.WidgetContract;
import com.ihsinformatics.aahung.databinding.WidgetTextBinding;
import com.ihsinformatics.aahung.model.WidgetData;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTES;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE_ID;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE_VALUE;

public class TextWidget extends Widget {

    private Context context;
    private BaseAttribute attribute;
    private String key;
    private String question;
    private WidgetTextBinding binding;
    private boolean isViewOnly;
    private WidgetContract.OnDataFetchedListener onDataFetchedListener;
    private MultiWidgetContract.ChangeNotifier dataChangeListener;
    private WidgetContract.DateChangeNotifier widgetDateChangeListener;
    private DataProvider.DateType dateType;
    private boolean isWarning;

    public TextWidget(Context context, String key, String question) {
        this.context = context;
        this.key = key;
        this.question = question;
        init();
    }

    public TextWidget(Context context, BaseAttribute attribute, String question) {
        this.context = context;
        this.attribute = attribute;
        this.question = question;
        init();
    }

    private void init() {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        binding = DataBindingUtil.inflate(inflater, R.layout.widget_text, null, false);
        binding.title.setText(question);
    }

    public TextWidget setText(String text) {
        if (onDataFetchedListener != null)
            onDataFetchedListener.onDataReceived(text);

        if (dataChangeListener != null)
            dataChangeListener.notifyWidget(this, text);

        if(widgetDateChangeListener != null)
            widgetDateChangeListener.onDateChange(text, dateType);

        binding.text.setText(text);
        return this;
    }

    @Override
    public View getView() {
        return binding.getRoot();
    }

    @Override
    public WidgetData getValue() {
        WidgetData widgetData = null;
        if (key != null)
            widgetData = new WidgetData(key, binding.text.getText().toString());
        else {

            JSONObject attributeType = new JSONObject();
            Map<String, Object> map = new HashMap();
            try {
                attributeType.put(ATTRIBUTE_TYPE_ID, attribute.getAttributeID());
                map.put(ATTRIBUTE_TYPE, attributeType);
                map.put(ATTRIBUTE_TYPE_VALUE, binding.text.getText().toString());
                widgetData = new WidgetData(ATTRIBUTES, new JSONObject(map), binding.text.getText().toString());
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return widgetData;
    }

    @Override
    public boolean isValid() {
        return true;
    }

    @Override
    public boolean hasAttribute() {
        return key == null;
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
    public Widget addHeader(String headerText) {
        binding.layoutHeader.headerText.setText(headerText);
        binding.layoutHeader.headerRoot.setVisibility(View.VISIBLE);
        return this;
    }

    @Override
    public Integer getAttributeTypeId() {
        return attribute.getAttributeID();
    }

    public TextWidget enabledViewOnly() {
        isViewOnly = true;
        return this;
    }

    @Override
    public boolean isViewOnly() {
        return isViewOnly;
    }

    public void setListeners(WidgetContract.OnDataFetchedListener onDataFetchedListener) {
        this.onDataFetchedListener = onDataFetchedListener;
    }

    public void setMultiSwitchListenerList(MultiWidgetContract.ChangeNotifier dataChangeListener) {
        this.dataChangeListener = dataChangeListener;
    }

    public void setDateChangeListener(WidgetContract.DateChangeNotifier dateChangeListener, DataProvider.DateType dateType) {

        this.widgetDateChangeListener = dateChangeListener;
        this.dateType = dateType;
    }

    public TextWidget enableWarning() {
        isWarning = true;
        CharSequence text = binding.title.getText();
        binding.text.setText(text);
        binding.text.setTextColor(context.getResources().getColor(R.color.red));
        binding.title.setText("");
        return this;
    }
}
