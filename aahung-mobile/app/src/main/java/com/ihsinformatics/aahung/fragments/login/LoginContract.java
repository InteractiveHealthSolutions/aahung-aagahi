package com.ihsinformatics.aahung.fragments.login;

import com.ihsinformatics.aahung.common.BasePresenter;


public interface LoginContract {

    interface View {
        void showToast(String message);
        void dismissLoading();
        void startMainActivity();
    }


    interface Presenter extends BasePresenter<View> {
        void onlineLogin(String username, String password);
        void offlineLogin(String username, String password);
        void syncMetadata(boolean isSyncOnly);
    }

}
