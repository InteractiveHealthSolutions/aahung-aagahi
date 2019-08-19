package com.ihsinformatics.aahung.network;



import com.ihsinformatics.aahung.model.location.BaseLocation;
import com.ihsinformatics.aahung.model.location.Location;
import com.ihsinformatics.aahung.model.user.User;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Query;

public interface ApiService {

    @GET(Endpoints.USER)
    Call<List<User>> login(@Header("Authorization") String auth, @Query("search") String username);

    @GET(Endpoints.LOCATION_LIST)
    Call<List<BaseLocation>> getLocations(@Header("Authorization") String auth);

    @GET(Endpoints.LOCATION_SEARCH)
    Call<List<Location>> getLocationsByName(@Header("Authorization") String auth,@Query("search") String shortName);

}
