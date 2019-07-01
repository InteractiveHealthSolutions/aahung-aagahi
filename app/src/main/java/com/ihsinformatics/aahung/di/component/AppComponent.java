package com.ihsinformatics.aahung.di.component;

import com.ihsinformatics.aahung.App;
import com.ihsinformatics.aahung.activities.MainActivity;
import com.ihsinformatics.aahung.di.module.ApplicationModule;
import com.ihsinformatics.aahung.di.module.NetworkModule;
import com.ihsinformatics.aahung.di.module.PresenterModule;

import javax.inject.Singleton;

import dagger.Component;

@Singleton
@Component(modules = {ApplicationModule.class, NetworkModule.class, PresenterModule.class})
public interface AppComponent {
    void inject(App target);

    void inject(MainActivity target);
}
