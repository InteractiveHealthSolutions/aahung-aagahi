package com.ihsinformatics.aahung.fragments.login;


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
    public void login(String username, String password) {
        apiService.login(Credentials.basic(username, password), username).enqueue(new Callback<List<User>>() {
            @Override
            public void onResponse(Call<List<User>> call, Response<List<User>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    view.startMainActivity();
                } else {
                    if (response.code() == BAD_CREDENTIALS)
                        view.showToast("incorrect username and password");
                    else
                        view.showToast("Something went wrong");
                }
            }

            @Override
            public void onFailure(Call<List<User>> call, Throwable t) {
                view.showToast("Login Failed");
            }
        });

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
