package com.ihsinformatics.aahung.di.module;


import android.content.Context;

import com.ihsinformatics.aahung.common.CustomDialog;
import com.ihsinformatics.aahung.db.AppDatabase;
import com.ihsinformatics.aahung.db.dao.MetadataDao;
import com.ihsinformatics.aahung.model.DataRepository;
import com.ihsinformatics.aahung.model.MetaDataHelper;
import com.ihsinformatics.aahung.network.ApiService;
import com.ihsinformatics.aahung.network.RestServices;

import javax.inject.Singleton;

import dagger.Module;
import dagger.Provides;

@Module
public class CommonModule {

    @Singleton
    @Provides
    public MetaDataHelper provideMetaDataHandler(final ApiService apiService, final MetadataDao metadataDao) {
        return new MetaDataHelper(apiService, metadataDao);
    }

    @Singleton
    @Provides
    public DataRepository provideDataRepository(final Context context, final AppDatabase appDatabase, final RestServices restServices) {
        return new DataRepository(context, appDatabase, restServices);
    }

    @Provides
    public CustomDialog provideCustomDialog() {
        return new CustomDialog();
    }
}
