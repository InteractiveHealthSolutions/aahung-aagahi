package com.ihsinformatics.aahung.fragments.login;


import com.ihsinformatics.aahung.common.DevicePreferences;
import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.common.ResponseCallback;
import com.ihsinformatics.aahung.db.AppDatabase;
import com.ihsinformatics.aahung.db.dao.UserDao;
import com.ihsinformatics.aahung.model.MetaDataHelper;
import com.ihsinformatics.aahung.model.metadata.Role;
import com.ihsinformatics.aahung.model.metadata.UserRole;
import com.ihsinformatics.aahung.model.results.BaseResult;
import com.ihsinformatics.aahung.model.user.User;
import com.ihsinformatics.aahung.network.RestServices;

import java.util.List;

import okhttp3.Credentials;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginPresenterImpl implements LoginContract.Presenter, MetaDataHelper.MetadataContact {


    public static final int BAD_CREDENTIALS = 401;
    public static final int NOT_FOUND = 404;
    private RestServices restServices;
    private AppDatabase database;
    private DevicePreferences devicePreferences;
    private MetaDataHelper metaDataHelper;
    private LoginContract.View view;
    private boolean isSyncOnly;

    public LoginPresenterImpl(RestServices apiService, AppDatabase database, DevicePreferences devicePreferences, MetaDataHelper metaDataHelper) {
        this.restServices = apiService;
        this.database = database;
        this.devicePreferences = devicePreferences;
        this.metaDataHelper = metaDataHelper;
    }


    @Override
    public void validateUserOnline(final String username, final String password, final boolean isRemember) {
        final String authToken = Credentials.basic(username, password);
        restServices.login(authToken, username, new ResponseCallback.ResponseUser() {
            @Override
            public void onSuccess(User user) {
                user.setPassword(password);
                devicePreferences.saveUser(user);
                devicePreferences.rememberUser(isRemember);
                GlobalConstants.AUTHTOKEN = authToken;
                GlobalConstants.USER = user;

                if (devicePreferences.isFirstTime()) {
                    syncMetadata(false);
                } else {

                    resetLocations();
                    updateUserRoles(user);
                    view.startMainActivity();
                    view.dismissLoading();
                }
            }

            @Override
            public void onFailure(String message) {
                view.dismissLoading();
                view.showToast(message);
            }
        });
    }

    private void updateUserRoles(User user) {
        if (database.getUserDao().getUserById(user.getID()) == null) {
            database.getUserDao().saveUser(user);
        }

        database.getMetadataDao().deleteUserRoles(user.getID());
        List<Role> userRoles = user.getUserRoles();
        for (Role role : userRoles)
            database.getMetadataDao().saveUserRoles(new UserRole(user.getUserId(), role.getRoleId()));
    }


    @Override
    public void validateUserOffine(String username, String password, boolean isRemember) {

        User user = devicePreferences.getLastUser();

        if (user != null) {
            final String authToken = Credentials.basic(username, password);
            final String lastAuthToken = Credentials.basic(user.getUsername(), user.getPassword());
            if (authToken.equals(lastAuthToken)) {
                devicePreferences.rememberUser(isRemember);
                GlobalConstants.AUTHTOKEN = authToken;
                GlobalConstants.USER = user;
                resetLocations();
                view.startMainActivity();
            } else
                view.showToast("incorrect username and password");
        }
    }

    @Override
    public void syncMetadata(boolean isSyncOnly) {
        this.isSyncOnly = isSyncOnly;
        metaDataHelper.getAllMetadata(this);
    }

    @Override
    public void restoreLastSavedUsed() {
        if (devicePreferences.isUserRemembered()) {
            User user = devicePreferences.getLastUser();
            view.autopopulateCredentials(user.getUsername(), user.getPassword(), devicePreferences.isUserRemembered());
        } else {
            view.autopopulateCredentials("", "", devicePreferences.isUserRemembered());
        }
    }

    @Override
    public void takeView(LoginContract.View view) {
        this.view = view;
    }

    @Override
    public void dropView() {
        view = null;
    }

    @Override
    public void onSaveCompleted() {
        devicePreferences.invalidateFirstTimeFlag();
        view.dismissLoading();
        view.showToast("sync successfully");
        if (!isSyncOnly) {
            resetLocations();
            view.startMainActivity();
        }
    }

    @Override
    public void onMetadataFailure() {
        view.dismissLoading();
        view.showToast("sync failed");
    }


    private void resetLocations() {
        GlobalConstants.selectedInstitute = null;
        GlobalConstants.selectedSchool = null;
    }

}
