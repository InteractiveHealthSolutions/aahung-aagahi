package com.ihsinformatics.aahung.fragments.location;

import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.db.dao.LocationDao;
import com.ihsinformatics.aahung.model.location.Location;
import com.ihsinformatics.aahung.network.ApiService;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LocationFilterImpl implements LocationFilterContact.Presenter {

    private ApiService apiService;
    private LocationDao locationDao;
    private LocationFilterContact.View view;


    public LocationFilterImpl(ApiService apiService, LocationDao locationDao) {

        this.apiService = apiService;
        this.locationDao = locationDao;
    }

    @Override
    public void getLocations() {
        apiService.getLocationsByName(GlobalConstants.AUTHTOKEN, "rab").enqueue(new Callback<List<Location>>() {
            @Override
            public void onResponse(Call<List<Location>> call, Response<List<Location>> response) {
                view.dismissLoading();
                if (response != null && response.isSuccessful() && response.body() != null) {
                    view.setAdapter(response.body());
                } else {
                    view.showToast("No response from server");
                }
            }

            @Override
            public void onFailure(Call<List<Location>> call, Throwable t) {

            }
        });
    }

    @Override
    public void getLocationByName(String name) {

    }

    @Override
    public void takeView(LocationFilterContact.View view) {
        this.view = view;
    }

    @Override
    public void dropView() {
        this.view = null;
    }
}
