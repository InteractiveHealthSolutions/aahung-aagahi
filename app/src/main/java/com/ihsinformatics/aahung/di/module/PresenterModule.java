package com.ihsinformatics.aahung.di.module;

import com.ihsinformatics.aahung.App;
import com.ihsinformatics.aahung.common.DevicePreferences;
import com.ihsinformatics.aahung.db.AppDatabase;
import com.ihsinformatics.aahung.db.dao.LocationDao;
import com.ihsinformatics.aahung.db.dao.UserDao;
import com.ihsinformatics.aahung.fragments.form.FormContract;
import com.ihsinformatics.aahung.fragments.form.FormPresenterImpl;
import com.ihsinformatics.aahung.fragments.location.LocationFilterContact;
import com.ihsinformatics.aahung.fragments.location.LocationFilterImpl;
import com.ihsinformatics.aahung.fragments.login.LoginContract;
import com.ihsinformatics.aahung.fragments.login.LoginPresenterImpl;
import com.ihsinformatics.aahung.model.MetaDataHelper;
import com.ihsinformatics.aahung.network.ApiService;
import com.ihsinformatics.aahung.network.RestServices;

import dagger.Module;
import dagger.Provides;

@Module
public class PresenterModule {

    @Provides
    public LoginContract.Presenter providesLoginPresenter(final ApiService apiService, final UserDao userDao, final  DevicePreferences devicePreferences, final MetaDataHelper metaDataHandler) {
        return new LoginPresenterImpl(apiService, userDao,devicePreferences,metaDataHandler);
    }

    @Provides
    public FormContract.Presenter providesFormPresenter(final ApiService apiService) {
        return new FormPresenterImpl(apiService);
    }

    @Provides
    public LocationFilterContact.Presenter provideLocationPresenter(final RestServices restServices, final AppDatabase appDatabase) {
        return new LocationFilterImpl(restServices,appDatabase);
    }

}
