package com.ihsinformatics.aahung.fragments.login;

import com.ihsinformatics.aahung.common.BasePresenter;


public interface LoginContract {

    interface View {
        void showToast(String Message);
        void startMainActivity();
    }


    interface Presenter extends BasePresenter<View> {
        void login(String username, String password);
    }

}
