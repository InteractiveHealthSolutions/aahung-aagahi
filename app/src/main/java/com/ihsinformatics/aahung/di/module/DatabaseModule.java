package com.ihsinformatics.aahung.di.module;


import android.app.Application;

import androidx.room.Room;

import com.ihsinformatics.aahung.db.AppDatabase;
import com.ihsinformatics.aahung.db.dao.FormsDao;
import com.ihsinformatics.aahung.db.dao.LocationDao;
import com.ihsinformatics.aahung.db.dao.UserDao;

import javax.inject.Singleton;

import dagger.Module;
import dagger.Provides;

@Module
public class DatabaseModule {


    public static final String DB_NAME = "aahung-db";

    @Singleton
    @Provides
    public AppDatabase provideAppDatabase(Application application) {
        return  Room.databaseBuilder(application, AppDatabase.class, DB_NAME).allowMainThreadQueries().build();

    }

    @Singleton
    @Provides
    public FormsDao provideFormDao(AppDatabase appDatabase) {
        return appDatabase.getFormsDao();
    }

    @Singleton
    @Provides
    public UserDao provideUserDao(AppDatabase appDatabase) {
        return appDatabase.getUserDao();
    }

    @Singleton
    @Provides
    public LocationDao provideLocationDao(AppDatabase appDatabase) {
        return appDatabase.getLocationDao();
    }
}
