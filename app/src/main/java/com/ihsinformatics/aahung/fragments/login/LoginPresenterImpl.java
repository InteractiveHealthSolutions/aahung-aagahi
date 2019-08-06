package com.ihsinformatics.aahung.fragments.login;


import com.ihsinformatics.aahung.network.ApiService;

public class LoginPresenterImpl implements LoginContract.Presenter {


    private ApiService apiService;
    private LoginContract.View view;

    public LoginPresenterImpl( ApiService apiService) {

        this.apiService = apiService;
    }

    @Override
    public void login(String username, String user) {
        view.startMainActivity();


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
