package com.ihsinformatics.aahung.network;



import com.ihsinformatics.aahung.model.BaseItem;
import com.ihsinformatics.aahung.model.user.User;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface ApiService {
    @GET(Endpoints.USER)
    Call<List<User>> login(@Header("Authorization") String auth, @Query("search") String username);
}
