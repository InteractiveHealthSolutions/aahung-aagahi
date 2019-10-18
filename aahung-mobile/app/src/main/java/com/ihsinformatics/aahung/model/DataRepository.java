package com.ihsinformatics.aahung.model;

import android.content.Context;

import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.common.ResponseCallback;
import com.ihsinformatics.aahung.db.AppDatabase;
import com.ihsinformatics.aahung.model.location.Location;
import com.ihsinformatics.aahung.model.metadata.Definition;
import com.ihsinformatics.aahung.model.metadata.Role;
import com.ihsinformatics.aahung.model.user.Participant;
import com.ihsinformatics.aahung.model.user.User;
import com.ihsinformatics.aahung.network.RestServices;
import com.ihsinformatics.aahung.views.DataProvider;

import java.util.ArrayList;
import java.util.List;

import static com.ihsinformatics.aahung.common.Utils.isInternetAvailable;
import static com.ihsinformatics.aahung.network.RestServices.INSTITUTION;
import static com.ihsinformatics.aahung.network.RestServices.PARENT_ORGANIZATION;
import static com.ihsinformatics.aahung.network.RestServices.SCHOOL;

public class DataRepository {

    private AppDatabase database;
    private RestServices restServices;
    private Context context;


    public DataRepository(Context context, AppDatabase database, RestServices restServices) {
        this.context = context;
        this.database = database;
        this.restServices = restServices;
    }


    public void getUsersByRole(ResponseCallback callback, Role role) {
        if (isInternetAvailable(context)) {
            restServices.getUsersByRole(callback, role.getUuid());
        } else {
            List<User> userByRole = database.getUserDao().getUserByRole(role.getRoleId());
            callback.onSuccess(userByRole);
        }
    }

    public void getSchools(ResponseCallback callback) {
        Definition definition = database.getMetadataDao().getDefinitionByShortName(SCHOOL);
        if (isInternetAvailable(context)) {
            restServices.getLocations(callback, definition.getUuid());
        } else {
            List<Location> schools = database.getLocationDao().getLocationByCategory(definition.getDefinitionId());
            callback.onSuccess(schools);
        }
    }

    public void getParticipant(ResponseCallback callback, DataProvider.FormSection formType) {
        if (isInternetAvailable(context)) {
            restServices.getParticipant(callback, formType);
        } else {
            Integer locationId = formType.equals(DataProvider.FormSection.LSE) ? GlobalConstants.selectedSchool.getID() : GlobalConstants.selectedInstitute.getID();
            callback.onSuccess(database.getPersonDao().getParticipantByLocationId(locationId));

        }
    }

    public void getLocationByShortName(String shortName, ResponseCallback.ResponseProvider responseProvider) {
        if (isInternetAvailable(context)) {
            restServices.getLocationByShortName(shortName, responseProvider);
        } else {
            Location location = database.getLocationDao().getLocationByShortName(shortName);
            location.setAttributes(database.getLocationDao().getAttributesByLocation(location.getLocationId()));
            responseProvider.onSuccess(location);
        }

    }

    public void getParticipantByShortName(String shortName, ResponseCallback.ResponseProvider responseProvider) {
        if (isInternetAvailable(context)) {
            restServices.getParticipantByShortName(shortName, responseProvider);
        } else {
            responseProvider.onSuccess(database.getPersonDao().getParticipantByShortName(shortName));
        }
    }



    public void getParticipantByLocation(List<BaseItem> locations, ResponseCallback callback) {
        if (isInternetAvailable(context)) {
            restServices.getParticipantByLocation(locations, callback);
        } else {
            List<Participant> participants = new ArrayList<>();
            for (BaseItem location : locations)
                participants.addAll(database.getPersonDao().getParticipantByLocationId(location.getID()));
            callback.onSuccess(participants);
        }
    }

    public void getUsers(ResponseCallback callback) {
        if (isInternetAvailable(context)) {
            restServices.getUsers(callback);
        } else {
            callback.onSuccess(database.getUserDao().getAllUsers());
        }

    }

    public void getParentLocations(ResponseCallback callback) {
        Definition definition = database.getMetadataDao().getDefinitionByShortName(PARENT_ORGANIZATION);
        if (isInternetAvailable(context)) {
            restServices.getLocations(callback, definition.getUuid());
        } else {
            List<Location> institutes = database.getLocationDao().getLocationByCategory(definition.getDefinitionId());
            callback.onSuccess(institutes);
        }
    }





    /*
     * Only Works in Online mode
     * */
    public void getProject(ResponseCallback callback) {
        restServices.getProject(callback);
    }

    /*
     * get Donors
     * Only works in online mode
     * */
    public void getDonors(ResponseCallback callback) {
        restServices.getDonors(callback);
    }


}
