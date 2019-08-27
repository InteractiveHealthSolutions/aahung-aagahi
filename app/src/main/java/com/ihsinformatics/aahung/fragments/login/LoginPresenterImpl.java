package com.ihsinformatics.aahung.fragments.login;


import androidx.room.Dao;

import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.db.dao.UserDao;
import com.ihsinformatics.aahung.model.BaseItem;
import com.ihsinformatics.aahung.model.user.User;
import com.ihsinformatics.aahung.network.ApiService;

import java.util.List;

import okhttp3.Credentials;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginPresenterImpl implements LoginContract.Presenter {


    public static final int BAD_CREDENTIALS = 401;
    private ApiService apiService;
    private UserDao userDao;
    private LoginContract.View view;

    public LoginPresenterImpl(ApiService apiService, UserDao userDao) {
        this.apiService = apiService;
        this.userDao = userDao;
    }

    @Override
    public void onlineLogin(final String username, final String password) {

        apiService.login(Credentials.basic(username, password), username).enqueue(new Callback<List<User>>() {
            @Override
            public void onResponse(Call<List<User>> call, Response<List<User>> response) {
                view.dismissLoading();
                if (response.isSuccessful() && response.body() != null) {
                    final String authToken = Credentials.basic(username, password);
                    User user = response.body().get(0);
                    user.setPassword(authToken);
                    userDao.saveUser(user);
                    GlobalConstants.AUTHTOKEN = authToken;
                    GlobalConstants.USER = user;
                    view.startMainActivity();
                } else {
                    if (response.code() == BAD_CREDENTIALS) {
                        view.showToast("incorrect username and password");
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

        User user = userDao.getUserByName(username);
        if (user != null) {
            final String authToken = Credentials.basic(username, password);
            if (user.getPassword().equals(authToken)) {
                GlobalConstants.AUTHTOKEN = authToken;
                GlobalConstants.USER = user;
                view.startMainActivity();
            } else
                view.showToast("incorrect username and password");
        }
        view.dismissLoading();
    }

    @Override
    public void takeView(LoginContract.View view) {
        this.view = view;
    }

    @Override
    public void dropView() {
        view = null;
    }
}
