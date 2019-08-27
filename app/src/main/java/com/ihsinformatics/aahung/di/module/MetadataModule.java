package com.ihsinformatics.aahung.di.module;

import com.ihsinformatics.aahung.db.dao.MetadataDao;
import com.ihsinformatics.aahung.model.MetaDataHelper;
import com.ihsinformatics.aahung.network.ApiService;

import javax.inject.Singleton;

import dagger.Module;
import dagger.Provides;

@Module
public class MetadataModule {

    @Singleton
    @Provides
    public MetaDataHelper provideMetaDataHandler(final ApiService apiService, final MetadataDao metadataDao) {
        return new MetaDataHelper(apiService,metadataDao);
    }

}
