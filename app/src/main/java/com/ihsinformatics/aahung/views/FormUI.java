package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.ihsinformatics.aahung.common.ButtonListener;
import com.ihsinformatics.aahung.model.WidgetData;
import com.ihsinformatics.aahung.model.FormDetails;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

public class FormUI implements ButtonListener {


    public static final int TEXT_LENGTH = 100;
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
        JSONObject jsonObject = new JSONObject();
        for (Widget widget : widgets) {
            if (widget.getView().getVisibility()== View.VISIBLE && widget.isValid()) {
                WidgetData data = widget.getValue();
                try {
                    jsonObject.put(data.getParam(),data.getValue()) ;
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }

        if (jsonObject.length() == widgets.size()) {
            formListener.onCompleted(jsonObject, DataProvider.Forms.DonorDetail.getEndpoint());
            Toast.makeText(context, "Submitted", Toast.LENGTH_SHORT).show();
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
        public void onCompleted(JSONObject json, String endpoint);
    }

}
