package com.ihsinformatics.aahung.di.module;

import com.ihsinformatics.aahung.db.dao.LocationDao;
import com.ihsinformatics.aahung.db.dao.UserDao;
import com.ihsinformatics.aahung.fragments.form.FormContract;
import com.ihsinformatics.aahung.fragments.form.FormPresenterImpl;
import com.ihsinformatics.aahung.fragments.location.LocationFilterContact;
import com.ihsinformatics.aahung.fragments.location.LocationFilterImpl;
import com.ihsinformatics.aahung.fragments.login.LoginContract;
import com.ihsinformatics.aahung.fragments.login.LoginPresenterImpl;
import com.ihsinformatics.aahung.network.ApiService;

import dagger.Module;
import dagger.Provides;

@Module
public class PresenterModule {

    @Provides
    public LoginContract.Presenter providesLoginPresenter(final ApiService apiService, final UserDao userDao) {
        return new LoginPresenterImpl(apiService,userDao);
    }

    @Provides
    public FormContract.Presenter providesFormPresenter( final ApiService apiService) {
        return new FormPresenterImpl(apiService);
    }

    @Provides
    public LocationFilterContact.Presenter provideLocationPresenter(final ApiService apiService, final LocationDao locationDao)
    {
        return new LocationFilterImpl(apiService,locationDao);
    }
}
