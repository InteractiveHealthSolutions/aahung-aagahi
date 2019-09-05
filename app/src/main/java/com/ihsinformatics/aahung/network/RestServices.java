package com.ihsinformatics.aahung.network;

import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.common.ResponseCallback;
import com.ihsinformatics.aahung.model.DataUpdater;
import com.ihsinformatics.aahung.model.Donor;
import com.ihsinformatics.aahung.model.Project;
import com.ihsinformatics.aahung.model.location.BaseLocation;
import com.ihsinformatics.aahung.model.results.LocationResult;
import com.ihsinformatics.aahung.views.UserWidget;

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

    public void getParentLocations(final ResponseCallback callback) {
        apiService.getParentLocations(GlobalConstants.AUTHTOKEN).enqueue(new Callback<List<BaseLocation>>() {
            @Override
            public void onResponse(Call<List<BaseLocation>> call, Response<List<BaseLocation>> response) {
                if (response != null && response.body() != null) {
                    callback.onSuccess(response.body());
                }
            }

            @Override
            public void onFailure(Call<List<BaseLocation>> call, Throwable t) {
                //TODO add failure method in callback method
            }
        });
    }

    public void getProject(final ResponseCallback callback) {
        apiService.getProjects(GlobalConstants.AUTHTOKEN).enqueue(new Callback<List<Project>>() {
            @Override
            public void onResponse(Call<List<Project>> call, Response<List<Project>> response) {
                if (response != null && response.body() != null) {
                    callback.onSuccess(response.body());
                }
            }

            @Override
            public void onFailure(Call<List<Project>> call, Throwable t) {
                //TODO add failure method in callback method
            }
        });

    }

    public void getSchools(final ResponseCallback callback) {
        apiService.getSchools(GlobalConstants.AUTHTOKEN).enqueue(new Callback<List<BaseLocation>>() {
            @Override
            public void onResponse(Call<List<BaseLocation>> call, Response<List<BaseLocation>> response) {
                if (response != null && response.body() != null) {
                    callback.onSuccess(response.body());
                }
            }

            @Override
            public void onFailure(Call<List<BaseLocation>> call, Throwable t) {
                //TODO add failure method in callback method
            }
        });
    }

    public void getSchoolByShortName(String shortName, final ResponseCallback.ResponseProvider responseProvider) {
        apiService.getSchoolByShortName(GlobalConstants.AUTHTOKEN, shortName).enqueue(new Callback<LocationResult>() {
            @Override
            public void onResponse(Call<LocationResult> call, Response<LocationResult> response) {
                if (response != null && response.body() != null) {
                    responseProvider.onSuccess(response.body());
                }
            }

            @Override
            public void onFailure(Call<LocationResult> call, Throwable t) {

            }
        });
    }
}
