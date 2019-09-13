package com.ihsinformatics.aahung.fragments.location;

import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.common.ResponseCallback;
import com.ihsinformatics.aahung.db.AppDatabase;
import com.ihsinformatics.aahung.db.dao.LocationDao;
import com.ihsinformatics.aahung.model.BaseItem;
import com.ihsinformatics.aahung.model.location.BaseLocation;
import com.ihsinformatics.aahung.model.location.Location;
import com.ihsinformatics.aahung.network.ApiService;
import com.ihsinformatics.aahung.network.RestServices;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import static com.ihsinformatics.aahung.fragments.FormListFragment.SCHOOL;

public class LocationFilterImpl implements LocationFilterContact.Presenter, ResponseCallback {

    private RestServices restServices;
    private AppDatabase database;
    private LocationFilterContact.View view;


    public LocationFilterImpl(RestServices apiService, AppDatabase appDatabase) {

        this.restServices = apiService;
        this.database = appDatabase;
    }

    @Override
    public void getLocations(String locationType) {
        if (locationType.equals(SCHOOL))
            restServices.getSchools(this);
        else
            restServices.getInstitutions(this);
    }

    @Override
    public void getLocationById(String uuid) {
        restServices.getLocationById(uuid, new ResponseLocation() {
            @Override
            public void onSuccess(Location baseResult) {
                saveLocation(baseResult);
                if (view != null) {
                    view.dismissLoading();
                    view.finishDialog();
                }
            }

            @Override
            public void onFailure(String message) {
                view.showToast(message);
            }
        });
    }

    @Override
    public void getOfflineLocations() {
        view.dismissLoading();
        List<Location> allLocation = database.getLocationDao().getAllLocation();
        List<BaseItem> items = (List<BaseItem>) (List<?>) allLocation;
        view.setAdapter(items);
    }

    private void saveLocation(Location locations) {
        database.getLocationDao().saveLocation(locations);
    }

    @Override
    public void takeView(LocationFilterContact.View view) {
        this.view = view;
    }

    @Override
    public void dropView() {
        this.view = null;
    }


    @Override
    public void onSuccess(List<? extends BaseItem> items) {
        view.dismissLoading();
        view.setAdapter((List<BaseItem>) items);
    }

    @Override
    public void onFailure(String message) {
        view.showToast(message);
    }
}
