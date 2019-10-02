package com.ihsinformatics.aahung.di.component;

import com.ihsinformatics.aahung.App;
import com.ihsinformatics.aahung.activities.LoginActivity;
import com.ihsinformatics.aahung.activities.MainActivity;
import com.ihsinformatics.aahung.di.module.ApplicationModule;
import com.ihsinformatics.aahung.di.module.CommonModule;
import com.ihsinformatics.aahung.di.module.DatabaseModule;

import com.ihsinformatics.aahung.di.module.NetworkModule;
import com.ihsinformatics.aahung.di.module.PresenterModule;
import com.ihsinformatics.aahung.fragments.TabFragment;
import com.ihsinformatics.aahung.fragments.form.FormFragment;
import com.ihsinformatics.aahung.fragments.location.LocationFilterDialogFragment;
import com.ihsinformatics.aahung.services.FormUploadWorker;
import com.ihsinformatics.aahung.views.DataProvider;
import com.ihsinformatics.aahung.views.FormUI;

import javax.inject.Singleton;

import dagger.Component;

@Singleton
@Component(modules = {ApplicationModule.class, NetworkModule.class, PresenterModule.class, DatabaseModule.class, CommonModule.class})
public interface AppComponent {
    void inject(App target);
    void inject(LoginActivity target);
    void inject(MainActivity target);
    void inject(LocationFilterDialogFragment locationFilterDialogFragment);
    void inject(FormFragment formFragment);
    void inject(DataProvider dataProvider);
    void inject(FormUI formUI);
    void inject(FormUploadWorker formUploadWorker);
    void inject(TabFragment tabFragment);
}
