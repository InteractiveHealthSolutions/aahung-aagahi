package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.ihsinformatics.aahung.App;
import com.ihsinformatics.aahung.common.ButtonListener;
import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.common.IDGenerator;
import com.ihsinformatics.aahung.common.Keys;
import com.ihsinformatics.aahung.db.AppDatabase;
import com.ihsinformatics.aahung.model.Forms;
import com.ihsinformatics.aahung.model.Score;
import com.ihsinformatics.aahung.model.WidgetData;
import com.ihsinformatics.aahung.model.FormDetails;
import com.ihsinformatics.aahung.model.metadata.FormType;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import javax.inject.Inject;

import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTES;
import static com.ihsinformatics.aahung.common.Keys.DATA;
import static com.ihsinformatics.aahung.common.Utils.getCurrentDBDate;
import static com.ihsinformatics.aahung.common.Utils.isInternetAvailable;

public class FormUI implements ButtonListener {


    public static final String PERSON = "person";
    public static final String LOCATION = "location";
    public static final String LOCATION_ID = "locationId";
    public static final String REFERENCE_ID = "referenceId";
    public static final String FORM_DATE = "formDate";
    private Context context;
    private LinearLayout baseLayout;
    private FormListener formListener;
    private FormDetails formDetails;
    private List<Widget> widgets;

    @Inject
    AppDatabase database;

    private FormUI(Builder builder) {
        this.context = builder.context;
        this.baseLayout = builder.baseLayout;
        this.formDetails = builder.formDetails;
        this.formListener = builder.formListener;
        this.widgets = builder.widgets;
        ((App) context.getApplicationContext()).getComponent().inject(this);
    }

    @Override
    public void onSubmit() {
        switch (formDetails.getForms().getFormCategory()) {
            case DONOR:
            case PROJECT:
            case LOCATION:
                submitForm();
                break;
            case PARTICIPANT:
                submitParticipantForm();
                break;
            case NORMAL_FORM:
                submitFormData();
                break;
        }

    }

    private void submitFormData() {

        int isNotValidCounts = 0;
        JSONObject formData = new JSONObject();
        JSONObject baseObject = new JSONObject();
        for (Widget widget : widgets) {
            if (widget.getView().getVisibility() == View.VISIBLE) {
                if (widget.isValid()) {
                    if (!widget.isViewOnly()) {
                        WidgetData data = widget.getValue();
                        try {
                            if (data.getValue() instanceof Score) {
                                Score score = (Score) data.getValue();
                                formData.put(score.getScoreKey(), score.getScore());
                                formData.put(score.getPercentageKey(), score.getPercentage());
                            } else
                                formData.put(data.getParam(), data.getValue());
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                } else {
                    isNotValidCounts++;
                }
            }
        }

        try {
            baseObject.put(DATA, formData.toString());
            FormType formType = database.getMetadataDao().getFormTypeByShortName(formDetails.getForms().getFormShortName());
            baseObject.put(FORM_DATE, getCurrentDBDate());
            baseObject.put(Keys.FORM_TYPE, getFormType(formType));
            if (GlobalConstants.selectedSchool != null && formDetails.getForms().isLocationDependent() && formDetails.getForms().getFormSection().equals(DataProvider.FormSection.LSE))
                baseObject.put(LOCATION, getSelectedLocation(DataProvider.FormSection.LSE));
            else if (GlobalConstants.selectedInstitute != null && formDetails.getForms().isLocationDependent() && formDetails.getForms().getFormSection().equals(DataProvider.FormSection.SRHM))
                baseObject.put(LOCATION, getSelectedLocation(DataProvider.FormSection.SRHM));
            baseObject.put(REFERENCE_ID, IDGenerator.getEncodedID());
        } catch (JSONException e) {
            e.printStackTrace();
        }


        if (isNotValidCounts == 0) {
            if (isInternetAvailable(context))
                formListener.onCompleted(baseObject, formDetails.getForms().getEndpoint());
            else {
                database.getFormsDao().saveForm(new Forms(baseObject.toString(), formDetails.getForms().getEndpoint()));
                formListener.onSaved();
            }
        } else {
            Toast.makeText(context, "Some field(s) are empty or with invalid input", Toast.LENGTH_SHORT).show();
        }

    }

    private JSONObject getFormType(FormType formType) throws JSONException {
        JSONObject formTypeId = new JSONObject();
        if (formType != null) {
            formTypeId.put(Keys.FORM_TYPE_ID, formType.getFormTypeId());
        }
        return formTypeId;
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
                            if (data.getValue() instanceof JSONObject) {
                                JSONObject object = (JSONObject) data.getValue();
                                String attributeValue = object.getString("attributeValue");
                                if (attributeValue != null && !attributeValue.equals("null"))
                                    attributes.put(data.getValue());
                            } else if (data.getValue() instanceof JSONArray) {
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
            if (GlobalConstants.selectedSchool != null && formDetails.getForms().isLocationDependent() && formDetails.getForms().getFormSection().equals(DataProvider.FormSection.LSE))
                baseObject.put(LOCATION, getSelectedLocation(DataProvider.FormSection.LSE));
            else if (GlobalConstants.selectedInstitute != null && formDetails.getForms().isLocationDependent() && formDetails.getForms().getFormSection().equals(DataProvider.FormSection.SRHM))
                baseObject.put(LOCATION, getSelectedLocation(DataProvider.FormSection.SRHM));
        } catch (JSONException e) {
            e.printStackTrace();
        }

        if (isNotValidCounts != 0) {
            Toast.makeText(context, "Some field(s) are empty or with invalid input", Toast.LENGTH_SHORT).show();
        } else if (GlobalConstants.selectedSchool == null && formDetails.getForms().getFormSection().equals(DataProvider.FormSection.LSE)) {

            Toast.makeText(context, "School is not selected. Please select School from the top", Toast.LENGTH_SHORT).show();
        } else if (GlobalConstants.selectedInstitute == null && formDetails.getForms().getFormSection().equals(DataProvider.FormSection.SRHM)) {
            Toast.makeText(context, "Institution is not selected. Please select Institution from the top", Toast.LENGTH_SHORT).show();
        } else {
            if (isInternetAvailable(context))
                formListener.onCompleted(baseObject, formDetails.getForms().getEndpoint());
            else {
                database.getFormsDao().saveForm(new Forms(baseObject.toString(), formDetails.getForms().getEndpoint()));
                formListener.onSaved();
            }

        }
    }


    private JSONObject getSelectedLocation(DataProvider.FormSection category) throws JSONException {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put(LOCATION_ID, category.equals(DataProvider.FormSection.LSE) ? GlobalConstants.selectedSchool.getID() : GlobalConstants.selectedInstitute.getID());
        return jsonObject;
    }

    private void submitForm() {
        int isNotValidCounts = 0;
        JSONObject jsonObject = new JSONObject();
        JSONArray attributes = new JSONArray();
        for (Widget widget : widgets) {
            if (widget.getView().getVisibility() == View.VISIBLE) {
                if (widget.isValid()) {
                    if (!widget.isViewOnly()) {
                        WidgetData data = widget.getValue();
                        try {
                            if (widget.hasAttribute()) {
                                if (data.getValue() instanceof JSONArray) {
                                    JSONArray attributeList = (JSONArray) data.getValue();
                                    for (int i = 0; i < attributeList.length(); i++) {
                                        JSONObject attributeObject = (JSONObject) attributeList.get(i);
                                        attributes.put(attributeObject);
                                    }
                                } else if (data.getValue() instanceof JSONObject) {
                                    JSONObject object = (JSONObject) data.getValue();
                                    String attributeValue = object.getString("attributeValue");
                                    if (attributeValue != null && !attributeValue.equals("null"))
                                        attributes.put(data.getValue());
                                } else {
                                    if (data.getValue() != null)
                                        attributes.put(data.getValue());
                                }
                            } else
                                jsonObject.put(data.getParam(), data.getValue());
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                } else {
                    isNotValidCounts++;
                }
            }
        }

        try {
            if (formDetails.getForms().getEndpoint().equals("locationattributesstream")) {

                if (GlobalConstants.selectedSchool != null && formDetails.getForms().isLocationDependent() && formDetails.getForms().getFormSection().equals(DataProvider.FormSection.LSE))
                    jsonObject.put(LOCATION_ID, GlobalConstants.selectedSchool.getID());
                else if (GlobalConstants.selectedInstitute != null && formDetails.getForms().isLocationDependent() && formDetails.getForms().getFormSection().equals(DataProvider.FormSection.SRHM))
                    jsonObject.put(LOCATION_ID, GlobalConstants.selectedInstitute.getID());
            }
            jsonObject.put(ATTRIBUTES, attributes);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        if (isNotValidCounts == 0) {
            if (formDetails.getForms().getMethod().equals(DataProvider.Method.POST)) {
                if (isInternetAvailable(context))
                    formListener.onCompleted(jsonObject, formDetails.getForms().getEndpoint());
                else {
                    database.getFormsDao().saveForm(new Forms(jsonObject.toString(), formDetails.getForms().getEndpoint()));
                    formListener.onSaved();
                }

            } else if (formDetails.getForms().getMethod().equals(DataProvider.Method.PUT)) {
                String uuid = "";
                try {
                    uuid = jsonObject.getString("uuid");
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                if (isInternetAvailable(context))
                    formListener.onCompleted(jsonObject, formDetails.getForms().getEndpoint(), uuid);
                else {
                    database.getFormsDao().saveForm(new Forms(jsonObject.toString(), formDetails.getForms().getEndpoint(), uuid));
                    formListener.onSaved();
                }
            }

        } else {
            Toast.makeText(context, "Some field(s) are empty or with invalid input", Toast.LENGTH_SHORT).show();
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

        public void onCompleted(JSONObject json, String endpoint, String uuid);

        public void onSaved();
    }

}
