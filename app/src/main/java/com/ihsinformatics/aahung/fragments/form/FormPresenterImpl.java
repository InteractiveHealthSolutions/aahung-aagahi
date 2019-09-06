package com.ihsinformatics.aahung.fragments.form;


import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.model.BaseResponse;
import com.ihsinformatics.aahung.model.location.Location;
import com.ihsinformatics.aahung.network.ApiService;

import org.json.JSONObject;

import java.util.List;

import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import static com.ihsinformatics.aahung.fragments.login.LoginPresenterImpl.BAD_CREDENTIALS;

public class FormPresenterImpl implements FormContract.Presenter {

    private final ApiService apiService;
    private FormContract.View view;

    public FormPresenterImpl(ApiService apiService) {
        this.apiService = apiService;
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
        RequestBody body = RequestBody.create(okhttp3.MediaType.parse("application/json; charset=utf-8"), (jsonObject.toString()));

        apiService.submitForm(GlobalConstants.AUTHTOKEN, endPoint, body).enqueue(new Callback<BaseResponse>() {
            @Override
            public void onResponse(Call<BaseResponse> call, Response<BaseResponse> response) {
                view.dismissLoading();
                if (response.isSuccessful() && response.body() != null) {
                    if (response.body().getUuid() != null) {
                        view.showToast("Submit successfully");
                        view.finish();
                    }

                } else {
                    view.showToast("Something went wrong during form submission");
                }
            }

            @Override
            public void onFailure(Call<BaseResponse> call, Throwable t) {
                view.dismissLoading();
                view.showToast("Login Failed");
            }
        });
    }

    @Override
    public void onFormUpdate(JSONObject jsonObject, String endPoint) {
        RequestBody body = RequestBody.create(okhttp3.MediaType.parse("application/json; charset=utf-8"), (jsonObject.toString()));

        apiService.updateForm(GlobalConstants.AUTHTOKEN, endPoint, body).enqueue(new Callback<BaseResponse>() {
            @Override
            public void onResponse(Call<BaseResponse> call, Response<BaseResponse> response) {
                view.dismissLoading();
                if (response.isSuccessful() && response.body() != null) {
                    if (response.body().getUuid() != null) {
                        view.showToast("Submit successfully");
                        view.finish();
                    }

                } else {
                    view.showToast("Something went wrong during form submission");
                }
            }

            @Override
            public void onFailure(Call<BaseResponse> call, Throwable t) {
                view.dismissLoading();
                view.showToast("Login Failed");
            }
        });
    }
}
