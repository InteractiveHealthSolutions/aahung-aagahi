package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.TextView;

import androidx.databinding.DataBindingUtil;

import com.google.gson.JsonObject;
import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.model.WidgetData;

import org.json.JSONException;
import org.json.JSONObject;

public class DefinitionWidget extends Widget {


    private Context context;
    private String definitionKey;
    private String value;
    private View view;
    private boolean isChildrenEnabled = true;

    public DefinitionWidget(Context context, String definitionKey, String value) {
        this.context = context;
        this.definitionKey = definitionKey;
        this.value = value;
        init();
    }

    private void init() {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        view = inflater.inflate(R.layout.widget_definition, null);
    }

    @Override
    public View getView() {
        return view;
    }

    @Override
    public WidgetData getValue() {
        WidgetData widgetData = null;

        if (isChildrenEnabled) {
            JSONObject definitionId = new JSONObject();
            try {
                definitionId.put("definitionId", value);

            } catch (JSONException e) {
                e.printStackTrace();
            }
            widgetData = new WidgetData(definitionKey, definitionId);
        } else {
            widgetData = new WidgetData(definitionKey, value);
        }

        return widgetData;
    }

    @Override
    public boolean isValid() {
        return true;
    }

    @Override
    public boolean hasAttribute() {
        return false;
    }

    @Override
    public Widget hideView() {
        return this;
    }

    @Override
    public Widget showView() {
        return this;
    }

    @Override
    public void onDataChanged(String data) {
        //Do nothing
    }

    @Override
    public Widget addHeader(String headerText) {
        return null;
    }

    public DefinitionWidget disableChildObject() {
        isChildrenEnabled = false;

        return this;
    }
}
