package com.ihsinformatics.aahung.di.module;


import com.ihsinformatics.aahung.common.DevicePreferences;
import com.ihsinformatics.aahung.db.AppDatabase;
import com.ihsinformatics.aahung.network.ApiService;
import com.ihsinformatics.aahung.network.BasicAuthInterceptor;
import com.ihsinformatics.aahung.network.RestServices;


import java.util.concurrent.TimeUnit;

import dagger.Module;
import dagger.Provides;
import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

@Module
public class NetworkModule {

    @Provides
    public OkHttpClient provideOkHttpClient() {
        HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor();
        loggingInterceptor.level(HttpLoggingInterceptor.Level.BODY);
        return new OkHttpClient.Builder()
                .addInterceptor(loggingInterceptor)
                .readTimeout(60, TimeUnit.SECONDS)
                .connectTimeout(60,TimeUnit.SECONDS)
                .build();
    }

    @Provides
    public Retrofit provideRetrofitClient(OkHttpClient okHttpClient, DevicePreferences devicePreferences) {
        return new Retrofit.Builder()
                .baseUrl("http://ihs.ihsinformatics.com:9990/aahung-aagahi/api/")
                //"http://aagahi.aahung.org:8080/aahung-aagahi/api/
                .addConverterFactory(GsonConverterFactory.create())
                .client(okHttpClient)
                .build();
    }

    @Provides
    public ApiService provideApiService(Retrofit retrofit) {
        return retrofit.create(ApiService.class);
    }

    @Provides
    public RestServices provideRestService(ApiService apiService, AppDatabase appDatabase) {
        return new RestServices(apiService,appDatabase);
    }
}
