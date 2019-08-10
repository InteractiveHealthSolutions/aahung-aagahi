package com.ihsinformatics.aahung.di.module;


import com.ihsinformatics.aahung.network.ApiService;
import com.ihsinformatics.aahung.network.BasicAuthInterceptor;


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
                //.addInterceptor(new BasicAuthInterceptor("admin", "admin123"))
                .addInterceptor(loggingInterceptor)
                .build();
    }

    @Provides
    public Retrofit provideRetrofitClient(OkHttpClient okHttpClient) {
        return new Retrofit.Builder()
                .baseUrl("http://199.172.1.76:8080/aahung-aagahi/api/")
                .addConverterFactory(GsonConverterFactory.create())
                .client(okHttpClient)
                .build();
    }

    @Provides
    public ApiService provideApiService(Retrofit retrofit) {
        return retrofit.create(ApiService.class);
    }
}
