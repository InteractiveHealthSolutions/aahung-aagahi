package com.ihsinformatics.aahung.fragments.form;

import android.content.Context;
import android.widget.LinearLayout;

import com.ihsinformatics.aahung.common.BasePresenter;

import org.json.JSONObject;

public interface FormContract {

    public interface View {
        void showToast(String message);

        void dismissLoading();

        void finish();
    }

    public interface Presenter extends BasePresenter<View> {

        public void onFormSubmission(JSONObject jsonObject, String endPoint);
        public void onFormUpdate(JSONObject jsonObject,String endPoint);

    }
}
