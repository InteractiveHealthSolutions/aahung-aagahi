package com.ihsinformatics.aahung;

import android.app.Application;

import com.crashlytics.android.Crashlytics;
import com.droidnet.DroidNet;
import com.ihsinformatics.aahung.db.AppDatabase;
import com.ihsinformatics.aahung.di.component.AppComponent;

import com.ihsinformatics.aahung.di.component.DaggerAppComponent;
import com.ihsinformatics.aahung.di.module.ApplicationModule;

import io.fabric.sdk.android.Fabric;
import uk.co.chrisjenx.calligraphy.CalligraphyConfig;

public class App extends Application {

    private AppComponent component;

    @Override
    public void onCreate() {
        super.onCreate();
        DroidNet.init(this);
        Fabric.with(this, new Crashlytics());
        CalligraphyConfig.initDefault(new CalligraphyConfig.Builder()
                .setDefaultFontPath("fonts/Montserrat-Light.otf")
                .setFontAttrId(R.attr.fontPath)
                .build());
        component = DaggerAppComponent.builder()
                .applicationModule(new ApplicationModule(this))
                .build();
    }

    public AppComponent getComponent() {
        return component;
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        DroidNet.getInstance().removeAllInternetConnectivityChangeListeners();
    }
}
