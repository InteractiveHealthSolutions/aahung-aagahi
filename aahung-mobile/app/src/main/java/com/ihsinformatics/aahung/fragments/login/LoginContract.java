package com.ihsinformatics.aahung.fragments.login;

import com.ihsinformatics.aahung.common.BasePresenter;


public interface LoginContract {

    interface View {
        void showToast(String message);

        void dismissLoading();

        void startMainActivity();

        void autopopulateCredentials(String username,String password,boolean isRemember);

        void enableLoginButton();

        void enableSyncButton();
    }


    interface Presenter extends BasePresenter<View> {
        void validateUserOnline(String username, String password, boolean isRemember);

        void validateUserOffine(String username, String password, boolean isRemember);

        void syncMetadata(boolean isSyncOnly);

        void restoreLastSavedUsed();
    }

}
