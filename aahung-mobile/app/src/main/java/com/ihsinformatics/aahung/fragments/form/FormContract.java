package com.ihsinformatics.aahung.fragments.form;

import android.content.Context;
import android.widget.LinearLayout;

import com.ihsinformatics.aahung.common.BasePresenter;
import com.ihsinformatics.aahung.views.ButtonWidget;

import org.json.JSONObject;

public interface FormContract {

    public interface View {
        void showToast(String message);

        void dismissLoading();

        void finish();
    }

    public interface Presenter extends BasePresenter<View> {

        public void onFormSubmission(JSONObject jsonObject, String endPoint, ButtonWidget buttonWidget);
        public void onFormUpdate(JSONObject jsonObject,String uuid,String endPoint,ButtonWidget buttonWidget);
        public void onFormSaved();
    }
}
