package com.ihsinformatics.aahung.fragments.login;


import com.ihsinformatics.aahung.common.DevicePreferences;
import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.db.dao.UserDao;
import com.ihsinformatics.aahung.model.MetaDataHelper;
import com.ihsinformatics.aahung.model.user.User;
import com.ihsinformatics.aahung.network.ApiService;

import java.util.List;

import okhttp3.Credentials;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginPresenterImpl implements LoginContract.Presenter, MetaDataHelper.MetadataContact {


    public static final int BAD_CREDENTIALS = 401;
    public static final int NOT_FOUND = 404;
    private ApiService apiService;
    private UserDao userDao;
    private DevicePreferences devicePreferences;
    private MetaDataHelper metaDataHandler;
    private LoginContract.View view;
    private boolean isSyncOnly;

    public LoginPresenterImpl(ApiService apiService, UserDao userDao, DevicePreferences devicePreferences, MetaDataHelper metaDataHandler) {
        this.apiService = apiService;
        this.userDao = userDao;
        this.devicePreferences = devicePreferences;
        this.metaDataHandler = metaDataHandler;
    }

    @Override
    public void onlineLogin(final String username, final String password) {

        apiService.login(Credentials.basic(username, password), username).enqueue(new Callback<List<User>>() {
            @Override
            public void onResponse(Call<List<User>> call, Response<List<User>> response) {

                if (response.isSuccessful() && response.body() != null) {
                    final String authToken = Credentials.basic(username, password);
                    User user = response.body().get(0);
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
                } else {
                    if (response.code() == BAD_CREDENTIALS) {
                        view.showToast("incorrect username and password");
                    } else if (response.code() == NOT_FOUND) {
                        view.showToast("Server is not available for now.");
                    } else
                        view.showToast("Something went wrong");
                }
            }

            @Override
            public void onFailure(Call<List<User>> call, Throwable t) {
                view.dismissLoading();
                view.showToast("Login Failed");
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
        metaDataHandler.getAllMetadata(this);
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
