package com.ihsinformatics.aahung.fragments.login;


import com.ihsinformatics.aahung.common.DevicePreferences;
import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.common.ResponseCallback;
import com.ihsinformatics.aahung.db.dao.UserDao;
import com.ihsinformatics.aahung.model.MetaDataHelper;
import com.ihsinformatics.aahung.model.results.BaseResult;
import com.ihsinformatics.aahung.model.user.User;
import com.ihsinformatics.aahung.network.RestServices;

import okhttp3.Credentials;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginPresenterImpl implements LoginContract.Presenter, MetaDataHelper.MetadataContact {


    public static final int BAD_CREDENTIALS = 401;
    public static final int NOT_FOUND = 404;
    private RestServices restServices;
    private DevicePreferences devicePreferences;
    private MetaDataHelper metaDataHelper;
    private LoginContract.View view;
    private boolean isSyncOnly;

    public LoginPresenterImpl(RestServices apiService, DevicePreferences devicePreferences, MetaDataHelper metaDataHelper) {
        this.restServices = apiService;
        this.devicePreferences = devicePreferences;
        this.metaDataHelper = metaDataHelper;
    }


    @Override
    public void onlineLogin(final String username, final String password) {
        final String authToken = Credentials.basic(username, password);
        restServices.login(authToken, username, new ResponseCallback.ResponseUser() {
            @Override
            public void onSuccess(User user) {
                user.setPassword(authToken);
                devicePreferences.saveUser(user);
                GlobalConstants.AUTHTOKEN = authToken;
                GlobalConstants.USER = user;
                if (devicePreferences.isFirstTime()) {
                    syncMetadata(false);
                } else {
                    resetLocations();
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


    @Override
    public void offlineLogin(String username, String password) {

        User user = devicePreferences.getLastUser();
        if (user != null) {
            final String authToken = Credentials.basic(username, password);
            if (user.getPassword().equals(authToken)) {
                GlobalConstants.AUTHTOKEN = authToken;
                GlobalConstants.USER = user;
                resetLocations();
                view.startMainActivity();
            } else
                view.showToast("incorrect username and password");
        }
        view.dismissLoading();
    }

    @Override
    public void syncMetadata(boolean isSyncOnly) {
        this.isSyncOnly = isSyncOnly;
        metaDataHelper.getAllMetadata(this);
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
