package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.ihsinformatics.aahung.common.ButtonListener;
import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.common.Keys;
import com.ihsinformatics.aahung.model.WidgetData;
import com.ihsinformatics.aahung.model.FormDetails;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTES;

public class FormUI implements ButtonListener {


    public static final int TEXT_LENGTH = 100;
    public static final String PERSON = "person";
    public static final String LOCATION = "location";
    public static final String LOCATION_ID = "locationId";
    private Context context;
    private LinearLayout baseLayout;
    private FormListener formListener;
    private FormDetails formDetails;
    private List<Widget> widgets;


    private FormUI(Builder builder) {
        this.context = builder.context;
        this.baseLayout = builder.baseLayout;
        this.formDetails = builder.formDetails;
        this.formListener = builder.formListener;
        this.widgets = builder.widgets;
    }

    @Override
    public void onSubmit() {
        if (formDetails.getForms().getEndpoint().equals("participant")) {
            submitParticipantForm();
        } else {
            submitForm();
        }
    }

    private void submitParticipantForm() {
        int isNotValidCounts = 0;
        JSONObject person = new JSONObject();
        JSONObject baseObject = new JSONObject();
        JSONArray attributes = new JSONArray();
        for (Widget widget : widgets) {
            if (widget.getView().getVisibility() == View.VISIBLE) {
                if (widget.isValid()) {
                    WidgetData data = widget.getValue();

                    try {
                        if (widget.hasAttribute()) {
                            if (data.getValue() instanceof JSONObject)
                                attributes.put(data.getValue());
                            else if (data.getValue() instanceof JSONArray) {
                                JSONArray attributeList = (JSONArray) data.getValue();
                                for (int i = 0; i < attributeList.length(); i++) {
                                    JSONObject attributeObject = (JSONObject) attributeList.get(i);
                                    attributes.put(attributeObject);
                                }
                            }
                        } else {
                            if (data.getParam().equals(Keys.IDENTIFIER))
                                baseObject.put(data.getParam(), data.getValue());
                            else
                                person.put(data.getParam(), data.getValue());
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }


                } else {
                    isNotValidCounts++;
                }
            }
        }
        try {
            person.put(ATTRIBUTES, attributes);
            baseObject.put(PERSON, person);
            baseObject.put(LOCATION, getSelectedLocation());
        } catch (JSONException e) {
            e.printStackTrace();
        }

        if (isNotValidCounts != 0) {
            Toast.makeText(context, "Some field(s) are empty or with invalid input", Toast.LENGTH_SHORT).show();
        }
        if (GlobalConstants.SELECTED_LOCATION == null) {
            Toast.makeText(context, "Location is not selected. Please select location from the top", Toast.LENGTH_SHORT).show();
        } else {
            formListener.onCompleted(baseObject, formDetails.getForms().getEndpoint(),formDetails.getForms().getMethod());
        }

    }

    private JSONObject getSelectedLocation() throws JSONException {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put(LOCATION_ID, GlobalConstants.SELECTED_LOCATION);
        return jsonObject;
    }

    private void submitForm() {
        int isNotValidCounts = 0;
        JSONObject jsonObject = new JSONObject();
        JSONArray attributes = new JSONArray();
        for (Widget widget : widgets) {
            if (widget.getView().getVisibility() == View.VISIBLE) {
                if (widget.isValid() && !widget.isViewOnly()) {
                    WidgetData data = widget.getValue();
                    try {
                        if (widget.hasAttribute()) {
                            if (data.getValue() instanceof JSONArray) {
                                JSONArray attributeList = (JSONArray) data.getValue();
                                for (int i = 0; i < attributeList.length(); i++) {
                                    JSONObject attributeObject = (JSONObject) attributeList.get(i);
                                    attributes.put(attributeObject);
                                }
                            } else {
                                attributes.put(data.getValue());
                            }
                        } else
                            jsonObject.put(data.getParam(), data.getValue());
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                } else {
                    isNotValidCounts++;
                }
            }
        }

        try {
            jsonObject.put(ATTRIBUTES, attributes);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        if (isNotValidCounts == 0) {
            formListener.onCompleted(jsonObject, formDetails.getForms().getEndpoint(), formDetails.getForms().getMethod());
        } else {
            Toast.makeText(context, "Some field(s) are empty or with invalid inpuit", Toast.LENGTH_SHORT).show();
        }
    }

    public static class Builder {
        private Context context;
        private LinearLayout baseLayout;
        private FormDetails formDetails;
        private FormListener formListener;
        private List<Widget> widgets;

        public Builder(Context context, LinearLayout baseLayout, FormDetails formDetails, FormListener formListener) {
            this.context = context;
            this.baseLayout = baseLayout;
            this.formDetails = formDetails;
            this.formListener = formListener;

        }


        public FormUI createForm() {
            DataProvider dataProvider = new DataProvider(context, formDetails);
            this.widgets = dataProvider.getWidgets();
            for (Widget widget : widgets) {
                baseLayout.addView(widget.getView());
            }

            FormUI formUI = new FormUI(this);
            baseLayout.addView(new ButtonWidget(context, formUI).getView());
            return formUI;
        }
    }

    public interface FormListener {
        public void onCompleted(JSONObject json, String endpoint, DataProvider.Method method);
    }

}
