package com.ihsinformatics.aahung.network;

import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.common.ResponseCallback;
import com.ihsinformatics.aahung.model.Donor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RestServices {

    private ApiService apiService;

    public RestServices(ApiService apiService) {
        this.apiService = apiService;
    }


    public void getDonors(final ResponseCallback callback) {

        apiService.getDonors(GlobalConstants.AUTHTOKEN).enqueue(new Callback<List<Donor>>() {
            @Override
            public void onResponse(Call<List<Donor>> call, Response<List<Donor>> response) {
                if (response != null && response.body() != null) {
                    callback.onSuccess(response.body());
                }
            }

            @Override
            public void onFailure(Call<List<Donor>> call, Throwable t) {
                //TODO add failure method in callback method
            }
        });


    }

}
