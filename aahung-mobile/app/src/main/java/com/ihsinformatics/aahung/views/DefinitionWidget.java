package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.BaseAttribute;
import com.ihsinformatics.aahung.model.WidgetData;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTES;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE_ID;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE_VALUE;

public class DefinitionWidget extends Widget {


    private Context context;
    private String definitionKey;
    private Object value;
    private View view;
    private boolean isChildrenEnabled = true;
    private boolean isViewOnly;
    private BaseAttribute attribute;

    public DefinitionWidget(Context context, String definitionKey, Object value) {
        this.context = context;
        this.definitionKey = definitionKey;
        this.value = value;
        init();
    }

    public DefinitionWidget(Context context, BaseAttribute attribute, Object value) {
        this.context = context;
        this.attribute = attribute;
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

       if(definitionKey != null) {
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
       }
       else {
           JSONObject attributeType = new JSONObject();
           Map<String, Object> map = new HashMap();
           try {
               attributeType.put(ATTRIBUTE_TYPE_ID, attribute.getAttributeID());
               map.put(ATTRIBUTE_TYPE, attributeType);
               map.put(ATTRIBUTE_TYPE_VALUE, value);
               widgetData = new WidgetData(ATTRIBUTES, new JSONObject(map));
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
        return attribute !=null;
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
    public Widget addHeader(String headerText) {
        return null;
    }

    @Override
    public Integer getAttributeTypeId() {
        return attribute.getAttributeID();
    }

    public DefinitionWidget disableChildObject() {
        isChildrenEnabled = false;

        return this;
    }

    public DefinitionWidget setViewOnly(boolean viewOnly) {
        isViewOnly = viewOnly;
        return this;
    }

    @Override
    public boolean isViewOnly() {
        return isViewOnly;
    }
}
