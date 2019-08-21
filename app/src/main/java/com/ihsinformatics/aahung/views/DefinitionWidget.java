package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.View;
import android.widget.TextView;

import com.google.gson.JsonObject;
import com.ihsinformatics.aahung.model.WidgetData;

import org.json.JSONException;
import org.json.JSONObject;

public class DefinitionWidget extends Widget {


    private Context context;
    private String definitionKey;
    private String value;

    public  DefinitionWidget(Context context,String definitionKey, String value)
    {
        this.context = context;
        this.definitionKey = definitionKey;
        this.value = value;
    }

    @Override
    public View getView() {
        return new TextView(context);
    }

    @Override
    public WidgetData getValue() {
        JSONObject definitionId = new JSONObject();
        try {
            definitionId.put("definitionId",value);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return new WidgetData(definitionKey,definitionId);
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
}
