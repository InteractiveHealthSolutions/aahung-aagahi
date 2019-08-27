package com.ihsinformatics.aahung.fragments.location;

import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.db.dao.LocationDao;
import com.ihsinformatics.aahung.model.BaseItem;
import com.ihsinformatics.aahung.model.location.BaseLocation;
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
        apiService.getLocations(GlobalConstants.AUTHTOKEN).enqueue(new Callback<List<BaseLocation>>() {
            @Override
            public void onResponse(Call<List<BaseLocation>> call, Response<List<BaseLocation>> response) {
                view.dismissLoading();
                if (response != null && response.isSuccessful() && response.body() != null) {
                    List<BaseItem> items = (List<BaseItem>)(List<?>) response.body();
                    view.setAdapter(items);
                } else {
                    view.showToast("No response from server");
                }
            }

            @Override
            public void onFailure(Call<List<BaseLocation>> call, Throwable t) {

            }
        });
    }

    @Override
    public void getLocationById(String uuid) {
        apiService.getLocationById(GlobalConstants.AUTHTOKEN, uuid).enqueue(new Callback<List<Location>>() {
            @Override
            public void onResponse(Call<List<Location>> call, Response<List<Location>> response) {
                view.dismissLoading();
                if (response != null && response.isSuccessful() && response.body() != null) {
                    saveLocation(response.body());
                    view.finishDialog();
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
    public void getOfflineLocations() {
        List<Location> allLocation = locationDao.getAllLocation();
        List<BaseItem> items = (List<BaseItem>)(List<?>) allLocation;
        view.setAdapter(items);
    }

    private void saveLocation(List<Location> locations) {

        locationDao.saveAllLocation(locations);
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
