package com.ihsinformatics.aahung.fragments.location;

import com.ihsinformatics.aahung.common.ResponseCallback;
import com.ihsinformatics.aahung.db.AppDatabase;
import com.ihsinformatics.aahung.model.BaseItem;
import com.ihsinformatics.aahung.model.location.Location;
import com.ihsinformatics.aahung.model.metadata.Definition;
import com.ihsinformatics.aahung.model.results.AttributeResult;
import com.ihsinformatics.aahung.model.user.Participant;
import com.ihsinformatics.aahung.network.RestServices;

import java.util.List;

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
        Definition definition;
        if (locationType.equals(SCHOOL)) {
            definition = database.getMetadataDao().getDefinitionByShortName(RestServices.SCHOOL);
        } else {
            definition = database.getMetadataDao().getDefinitionByShortName(RestServices.INSTITUTION);
        }
        restServices.getLocations(this, definition.getUuid());
    }

    @Override
    public void getLocationById(String uuid) {
        restServices.getLocationById(uuid, new ResponseLocation() {
            @Override
            public void onSuccess(Location baseResult) {
                saveLocation(baseResult);
                saveAttributes(baseResult.getID(), baseResult.getAttributes());
                getParticipantsFromLocation(baseResult);
            }

            @Override
            public void onFailure(String message) {
                view.showToast(message);
            }
        });
    }

    private void saveAttributes(Integer id, List<AttributeResult> attributes) {
        for (AttributeResult attributeResult : attributes)
            attributeResult.setContextId(id);
        database.getLocationDao().saveAttributes(attributes);
    }

    private void getParticipantsFromLocation(final Location baseResult) {
        restServices.getParticipantByLocation(baseResult, new ResponseCallback() {
            @Override
            public void onSuccess(List<? extends BaseItem> items) {
                savePartipants((List<Participant>) items, baseResult.getID());
                if (view != null) {
                    view.dismissLoading();
                    view.finishDialog();
                }
            }

            @Override
            public void onFailure(String message) {
                if (view != null) {
                    view.dismissLoading();
                    view.finishDialog();
                }
            }
        });
    }

    private void savePartipants(List<Participant> participants, Integer locationId) {
        for (Participant participant : participants)
            participant.setLocationId(locationId);
        database.getPersonDao().saveParticipant(participants);
    }

    @Override
    public void getOfflineLocations(String locationType) {
        Definition definition;
        if (locationType.equals(SCHOOL)) {
            definition = database.getMetadataDao().getDefinitionByShortName(RestServices.SCHOOL);
        } else {
            definition = database.getMetadataDao().getDefinitionByShortName(RestServices.INSTITUTION);
        }

        List<BaseItem> items = (List<BaseItem>) (List<?>) database.getLocationDao().getLocationByCategory(definition.getDefinitionId());
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
        if (view != null) {
            view.dismissLoading();
            view.setAdapter((List<BaseItem>) items);
        }
    }

    @Override
    public void onFailure(String message) {
        view.showToast(message);
    }
}
