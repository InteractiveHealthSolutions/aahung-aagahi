package com.ihsinformatics.aahung.fragments.form;


import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.common.ResponseCallback;
import com.ihsinformatics.aahung.model.BaseResponse;
import com.ihsinformatics.aahung.network.RestServices;

import org.json.JSONObject;

import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FormPresenterImpl implements FormContract.Presenter {

    private final RestServices restServices;
    private FormContract.View view;

    public FormPresenterImpl(RestServices restServices) {
        this.restServices = restServices;
    }

    @Override
    public void takeView(FormContract.View view) {
        this.view = view;
    }

    @Override
    public void dropView() {

    }

    @Override
    public void onFormSubmission(JSONObject jsonObject, String endPoint) {
        restServices.submitForm(jsonObject,endPoint, new ResponseCallback.ResponseForm() {
            @Override
            public void onSuccess() {
                view.dismissLoading();
                view.showToast("Submit successfully");
                view.finish();
            }

            @Override
            public void onFailure(String message) {
                view.dismissLoading();
                view.showToast(message);
            }
        });
    }

    @Override
    public void onFormUpdate(JSONObject jsonObject, String uuid, String endPoint) {

        restServices.updateForm(jsonObject,endPoint,uuid, new ResponseCallback.ResponseForm() {
            @Override
            public void onSuccess() {
                view.showToast("Submit successfully");
                view.finish();
                view.dismissLoading();
            }

            @Override
            public void onFailure(String message) {
                view.dismissLoading();
                view.showToast(message);
            }
        });


    }

    @Override
    public void onFormSaved() {
        view.showToast("Saved successfully");
        view.finish();
    }
}
