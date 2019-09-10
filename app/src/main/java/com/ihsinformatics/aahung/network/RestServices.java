package com.ihsinformatics.aahung.network;

import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.common.ResponseCallback;
import com.ihsinformatics.aahung.db.AppDatabase;
import com.ihsinformatics.aahung.model.BaseItem;
import com.ihsinformatics.aahung.model.Donor;
import com.ihsinformatics.aahung.model.Project;
import com.ihsinformatics.aahung.model.location.BaseLocation;
import com.ihsinformatics.aahung.model.results.LocationResult;
import com.ihsinformatics.aahung.model.user.Participant;
import com.ihsinformatics.aahung.model.user.User;
import com.ihsinformatics.aahung.views.UserWidget;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RestServices {

    public static final String SCHOOL = "school";
    public static final String PARENT_ORGANIZATION = "parent_organization";
    public static final String INSTITUTION = "institution";
    private ApiService apiService;
    private AppDatabase appDatabase;

    public RestServices(ApiService apiService, AppDatabase appDatabase) {
        this.apiService = apiService;
        this.appDatabase = appDatabase;
    }


    public void getDonors(final ResponseCallback callback) {

        apiService.getDonors(GlobalConstants.AUTHTOKEN).enqueue(new Callback<List<Donor>>() {
            @Override
            public void onResponse(Call<List<Donor>> call, Response<List<Donor>> response) {
                if (response != null && response.body() != null) {
                    callback.onSuccess(response.body());
                }
            }

            @Override
            public void onFailure(Call<List<Donor>> call, Throwable t) {
                //TODO add failure method in callback method
            }
        });


    }

    public void getParentLocations(final ResponseCallback callback) {
        String uuid = appDatabase.getMetadataDao().getDefinitionByShortName(PARENT_ORGANIZATION).getUuid();
        apiService.getParentLocations(GlobalConstants.AUTHTOKEN, uuid).enqueue(new Callback<List<BaseLocation>>() {
            @Override
            public void onResponse(Call<List<BaseLocation>> call, Response<List<BaseLocation>> response) {
                if (response != null && response.body() != null) {
                    callback.onSuccess(response.body());
                }
            }

            @Override
            public void onFailure(Call<List<BaseLocation>> call, Throwable t) {
                //TODO add failure method in callback method
            }
        });
    }

    public void getProject(final ResponseCallback callback) {
        apiService.getProjects(GlobalConstants.AUTHTOKEN).enqueue(new Callback<List<Project>>() {
            @Override
            public void onResponse(Call<List<Project>> call, Response<List<Project>> response) {
                if (response != null && response.body() != null) {
                    callback.onSuccess(response.body());
                }
            }

            @Override
            public void onFailure(Call<List<Project>> call, Throwable t) {
                //TODO add failure method in callback method
            }
        });

    }

    public void getSchools(final ResponseCallback callback) {
        String uuid = appDatabase.getMetadataDao().getDefinitionByShortName(SCHOOL).getUuid();
        apiService.getLocationByCategory(GlobalConstants.AUTHTOKEN, uuid).enqueue(new Callback<List<BaseLocation>>() {
            @Override
            public void onResponse(Call<List<BaseLocation>> call, Response<List<BaseLocation>> response) {
                if (response != null && response.body() != null) {
                    callback.onSuccess(response.body());
                }
            }

            @Override
            public void onFailure(Call<List<BaseLocation>> call, Throwable t) {
                //TODO add failure method in callback method
            }
        });
    }

    public void getSchoolByShortName(String shortName, final ResponseCallback.ResponseProvider responseProvider) {
        apiService.getSchoolByShortName(GlobalConstants.AUTHTOKEN, shortName).enqueue(new Callback<LocationResult>() {
            @Override
            public void onResponse(Call<LocationResult> call, Response<LocationResult> response) {
                if (response != null && response.body() != null) {
                    responseProvider.onSuccess(response.body());
                }
            }

            @Override
            public void onFailure(Call<LocationResult> call, Throwable t) {

            }
        });
    }

    public void getUsers(final ResponseCallback callback) {
        apiService.getAllUsers(GlobalConstants.AUTHTOKEN).enqueue(new Callback<List<User>>() {
            @Override
            public void onResponse(Call<List<User>> call, Response<List<User>> response) {
                if (response != null && response.body() != null) {
                    callback.onSuccess(response.body());
                }
            }

            @Override
            public void onFailure(Call<List<User>> call, Throwable t) {
//TODO add failure method in callback method
            }
        });
    }


    public void getUsersByRole(final ResponseCallback callback, String uuid) {
        apiService.getAllUsersByRole(GlobalConstants.AUTHTOKEN, uuid).enqueue(new Callback<List<User>>() {
            @Override
            public void onResponse(Call<List<User>> call, Response<List<User>> response) {
                if (response != null && response.body() != null) {
                    callback.onSuccess(response.body());
                }
            }

            @Override
            public void onFailure(Call<List<User>> call, Throwable t) {
//TODO add failure method in callback method
            }
        });
    }


    public void getParticipant(final ResponseCallback callback) {
        apiService.getParticipantsByLocation(GlobalConstants.AUTHTOKEN, GlobalConstants.SELECTED_LOCATION_UUID).enqueue(new Callback<List<Participant>>() {
            @Override
            public void onResponse(Call<List<Participant>> call, Response<List<Participant>> response) {
                if (response != null && response.body() != null) {
                    callback.onSuccess(response.body());
                }
            }

            @Override
            public void onFailure(Call<List<Participant>> call, Throwable t) {
                //TODO add failure method in callback method
            }
        });
    }

    public void getInstitutions(final ResponseCallback callback) {
        String uuid = appDatabase.getMetadataDao().getDefinitionByShortName(INSTITUTION).getUuid();
        apiService.getLocationByCategory(GlobalConstants.AUTHTOKEN, uuid).enqueue(new Callback<List<BaseLocation>>() {
            @Override
            public void onResponse(Call<List<BaseLocation>> call, Response<List<BaseLocation>> response) {
                if (response != null && response.body() != null) {
                    callback.onSuccess(response.body());
                }
            }

            @Override
            public void onFailure(Call<List<BaseLocation>> call, Throwable t) {
                //TODO add failure method in callback method
            }
        });
    }


    public void getParticipantByLocation(final List<BaseItem> baseItemList, final ResponseCallback callback) {
        final ParticipantListeners participantListeners = new ParticipantListeners() {
            int count = 0;
            List<Participant> participants = new ArrayList<>();

            @Override
            public void onParticipantReceived(List<Participant> participants, ResponseCallback callback, int counts) {
                if (count < counts) {
                    this.participants.addAll(participants);
                    count++;
                    if(count == counts)
                        callback.onSuccess(this.participants);
                }

            }
        };

        for (BaseItem baseItem : baseItemList) {
            apiService.getParticipantsByLocation(GlobalConstants.AUTHTOKEN, baseItem.getUUID()).enqueue(new Callback<List<Participant>>() {
                @Override
                public void onResponse(Call<List<Participant>> call, Response<List<Participant>> response) {
                    if (response != null && response.body() != null) {
                        participantListeners.onParticipantReceived(response.body(), callback, baseItemList.size());
                    }
                }

                @Override
                public void onFailure(Call<List<Participant>> call, Throwable t) {

                }
            });
        }
    }


    private interface ParticipantListeners {
        public void onParticipantReceived(List<Participant> participants, ResponseCallback callback, int counts);
    }
}
