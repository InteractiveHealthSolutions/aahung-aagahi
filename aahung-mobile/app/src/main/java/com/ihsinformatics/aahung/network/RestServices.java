package com.ihsinformatics.aahung.network;

import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.common.ResponseCallback;
import com.ihsinformatics.aahung.db.AppDatabase;
import com.ihsinformatics.aahung.model.BaseItem;
import com.ihsinformatics.aahung.model.BaseResponse;
import com.ihsinformatics.aahung.model.Donor;
import com.ihsinformatics.aahung.model.Project;
import com.ihsinformatics.aahung.model.location.BaseLocation;
import com.ihsinformatics.aahung.model.location.Location;
import com.ihsinformatics.aahung.model.user.Participant;
import com.ihsinformatics.aahung.model.user.User;
import com.ihsinformatics.aahung.views.DataProvider;

import org.json.JSONObject;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeoutException;

import okhttp3.RequestBody;
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
                if (response != null) {
                    if (response.isSuccessful() && response.body() != null)
                        callback.onSuccess(response.body());
                    else
                        callback.onFailure(getErrorMessage(response.code()));
                } else {
                    callback.onFailure("No Response from server");
                }
            }

            @Override
            public void onFailure(Call<List<Donor>> call, Throwable t) {
                callback.onFailure(getErrorMessage(t));
            }
        });


    }


    public void getProject(final ResponseCallback callback) {
        apiService.getProjects(GlobalConstants.AUTHTOKEN).enqueue(new Callback<List<Project>>() {
            @Override
            public void onResponse(Call<List<Project>> call, Response<List<Project>> response) {
                if (response != null) {
                    if (response.isSuccessful() && response.body() != null)
                        callback.onSuccess(response.body());
                    else
                        callback.onFailure(getErrorMessage(response.code()));
                } else {
                    callback.onFailure("No Response from server");
                }
            }

            @Override
            public void onFailure(Call<List<Project>> call, Throwable t) {
                callback.onFailure(getErrorMessage(t));
            }
        });

    }

    public void getSchools(final ResponseCallback callback) {
        String uuid = appDatabase.getMetadataDao().getDefinitionByShortName(SCHOOL).getUuid();
        apiService.getLocationByCategory(GlobalConstants.AUTHTOKEN, uuid).enqueue(new Callback<List<BaseLocation>>() {
            @Override
            public void onResponse(Call<List<BaseLocation>> call, Response<List<BaseLocation>> response) {
                if (response != null) {
                    if (response.isSuccessful() && response.body() != null)
                        callback.onSuccess(response.body());
                    else
                        callback.onFailure(getErrorMessage(response.code()));
                } else {
                    callback.onFailure("No Response from server");
                }
            }

            @Override
            public void onFailure(Call<List<BaseLocation>> call, Throwable t) {
                callback.onFailure(getErrorMessage(t));

            }
        });
    }

    public void getLocationByShortName(String shortName, final ResponseCallback.ResponseProvider responseProvider) {
        apiService.getSchoolByShortName(GlobalConstants.AUTHTOKEN, shortName).enqueue(new Callback<Location>() {
            @Override
            public void onResponse(Call<Location> call, Response<Location> response) {
                if (response != null) {
                    if (response.isSuccessful() && response.body() != null)
                        responseProvider.onSuccess(response.body());
                    else
                        responseProvider.onFailure(getErrorMessage(response.code()));
                } else {
                    responseProvider.onFailure("No Response from server");
                }
            }

            @Override
            public void onFailure(Call<Location> call, Throwable t) {
                responseProvider.onFailure(getErrorMessage(t));
            }
        });
    }

    public void getUsers(final ResponseCallback callback) {
        apiService.getAllUsers(GlobalConstants.AUTHTOKEN).enqueue(new Callback<List<User>>() {
            @Override
            public void onResponse(Call<List<User>> call, Response<List<User>> response) {
                if (response != null) {
                    if (response.isSuccessful() && response.body() != null)
                        callback.onSuccess(response.body());
                    else
                        callback.onFailure(getErrorMessage(response.code()));
                } else {
                    callback.onFailure("No Response from server");
                }
            }

            @Override
            public void onFailure(Call<List<User>> call, Throwable t) {
                callback.onFailure(getErrorMessage(t));
            }
        });
    }


    public void getUsersByRole(final ResponseCallback callback, String uuid) {
        apiService.getAllUsersByRole(GlobalConstants.AUTHTOKEN, uuid).enqueue(new Callback<List<User>>() {
            @Override
            public void onResponse(Call<List<User>> call, Response<List<User>> response) {
                if (response != null) {
                    if (response.isSuccessful() && response.body() != null)
                        callback.onSuccess(response.body());
                    else
                        callback.onFailure(getErrorMessage(response.code()));
                } else {
                    callback.onFailure("No Response from server");
                }
            }

            @Override
            public void onFailure(Call<List<User>> call, Throwable t) {
                callback.onFailure(getErrorMessage(t));

            }
        });
    }


    public void getParticipant(final ResponseCallback callback, DataProvider.FormSection formCategory) {
        apiService.getParticipantsByLocation(GlobalConstants.AUTHTOKEN,
                formCategory.equals(DataProvider.FormSection.LSE) ? GlobalConstants.selectedSchool.getUUID() : GlobalConstants.selectedInstitute.getUUID()).enqueue(new Callback<List<Participant>>() {
            @Override
            public void onResponse(Call<List<Participant>> call, Response<List<Participant>> response) {
                if (response != null) {
                    if (response.isSuccessful() && response.body() != null)
                        callback.onSuccess(response.body());
                    else
                        callback.onFailure(getErrorMessage(response.code()));
                } else {
                    callback.onFailure("No Response from server");
                }
            }

            @Override
            public void onFailure(Call<List<Participant>> call, Throwable t) {
                callback.onFailure(getErrorMessage(t));

            }
        });
    }

    public void getLocations(final ResponseCallback callback, String categoryUuid) {
        apiService.getLocationByCategory(GlobalConstants.AUTHTOKEN, categoryUuid).enqueue(new Callback<List<BaseLocation>>() {
            @Override
            public void onResponse(Call<List<BaseLocation>> call, Response<List<BaseLocation>> response) {
                if (response != null) {
                    if (response.isSuccessful() && response.body() != null)
                        callback.onSuccess(response.body());
                    else
                        callback.onFailure(getErrorMessage(response.code()));
                } else {
                    callback.onFailure("No Response from server");
                }
            }

            @Override
            public void onFailure(Call<List<BaseLocation>> call, Throwable t) {
                callback.onFailure(getErrorMessage(t));

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
                    if (count == counts)
                        callback.onSuccess(this.participants);
                }
            }
        };

        for (BaseItem baseItem : baseItemList) {
            apiService.getParticipantsByLocation(GlobalConstants.AUTHTOKEN, baseItem.getUUID()).enqueue(new Callback<List<Participant>>() {
                @Override
                public void onResponse(Call<List<Participant>> call, Response<List<Participant>> response) {
                    if (response != null) {
                        if (response.isSuccessful() && response.body() != null)
                            participantListeners.onParticipantReceived(response.body(), callback, baseItemList.size());
                        else
                            callback.onFailure(getErrorMessage(response.code()));
                    } else {
                        callback.onFailure("No Response from server");
                    }
                }

                @Override
                public void onFailure(Call<List<Participant>> call, Throwable t) {
                    callback.onFailure(getErrorMessage(t));

                }
            });
        }
    }

    public void getParticipantByLocation(BaseItem location, final ResponseCallback callback) {
        apiService.getParticipantsByLocation(GlobalConstants.AUTHTOKEN, location.getUUID()).enqueue(new Callback<List<Participant>>() {
            @Override
            public void onResponse(Call<List<Participant>> call, Response<List<Participant>> response) {
                if (response != null) {
                    if (response.isSuccessful() && response.body() != null)
                        callback.onSuccess(response.body());
                    else
                        callback.onFailure(getErrorMessage(response.code()));
                } else {
                    callback.onFailure("No Response from server");
                }
            }

            @Override
            public void onFailure(Call<List<Participant>> call, Throwable t) {
                callback.onFailure(getErrorMessage(t));

            }
        });
    }


    public void getParticipantByShortName(String shortName, final ResponseCallback.ResponseProvider responseProvider) {
        apiService.getParticipantById(GlobalConstants.AUTHTOKEN, shortName).enqueue(new Callback<Participant>() {
            @Override
            public void onResponse(Call<Participant> call, Response<Participant> response) {
                if (response != null) {
                    if (response.isSuccessful() && response.body() != null)
                        responseProvider.onSuccess(response.body());
                    else
                        responseProvider.onFailure(getErrorMessage(response.code()));
                } else {
                    responseProvider.onFailure("No Response from server");
                }
            }

            @Override
            public void onFailure(Call<Participant> call, Throwable t) {
                responseProvider.onFailure(getErrorMessage(t));

            }
        });

    }

    public void getLocationById(String uuid, final ResponseCallback.ResponseLocation responseCallback) {
        apiService.getLocationById(GlobalConstants.AUTHTOKEN, uuid).enqueue(new Callback<Location>() {
            @Override
            public void onResponse(Call<Location> call, Response<Location> response) {
                if (response != null) {
                    if (response.isSuccessful() && response.body() != null)
                        responseCallback.onSuccess(response.body());
                    else
                        responseCallback.onFailure(getErrorMessage(response.code()));
                } else {
                    responseCallback.onFailure("No Response from server");
                }
            }

            @Override
            public void onFailure(Call<Location> call, Throwable t) {
                responseCallback.onFailure(getErrorMessage(t));
            }
        });
    }

    private String getErrorMessage(Throwable t) {
        String message = "";
        if (t instanceof SocketTimeoutException || t instanceof TimeoutException) {
            message = "Oops something went wrong";
        } else {
            message = "Please check your internet connection...";
        }
        return message;
    }

    private String getErrorMessage(int code) {
        String message = "";
        switch (code) {
            case 401:
                message = "You are not authorized, Please login with the correct username/password";
                break;
            case 403:
                message = "You don't have privilege/role to access this service";
                break;
            case 404:
                message = "No data exist";
                break;
            case 405:
                message = "Method not allowed";
                break;
            case 406:
                message = "the data you are sending is not acceptable";
                break;
            default:
                message = "Something went wrong";
                break;

        }

        return message;
    }

    public void submitForm(JSONObject jsonObject, String endPoint, final ResponseCallback.ResponseForm callback) {
        RequestBody body = RequestBody.create(okhttp3.MediaType.parse("application/json; charset=utf-8"), (jsonObject.toString()));

        apiService.submitForm(GlobalConstants.AUTHTOKEN, endPoint, body).enqueue(new Callback<BaseResponse>() {
            @Override
            public void onResponse(Call<BaseResponse> call, Response<BaseResponse> response) {
                if (response != null) {
                    if (response.isSuccessful() && response.body() != null)
                        callback.onSuccess();
                    else {
                        try {

                            if (response.errorBody().string().contains("duplicate")) {
                                callback.onFailure("This form is Already exist. Make sure you are not trying to save duplicate form");
                            } else {
                                callback.onFailure(getErrorMessage(response.code()));
                            }

                        } catch (IOException e) {
                            callback.onFailure(getErrorMessage(response.code()));
                            e.printStackTrace();

                        }


                    }
                } else {
                    callback.onFailure("No Response from server");
                }
            }

            @Override
            public void onFailure(Call<BaseResponse> call, Throwable t) {
                callback.onFailure(getErrorMessage(t));
            }
        });

    }

    public void submitForm(JSONObject jsonObject, String endPoint, final Integer formId, final ResponseCallback.ResponseFormOffline callback) {
        RequestBody body = RequestBody.create(okhttp3.MediaType.parse("application/json; charset=utf-8"), (jsonObject.toString()));

        apiService.submitForm(GlobalConstants.AUTHTOKEN, endPoint, body).enqueue(new Callback<BaseResponse>() {
            @Override
            public void onResponse(Call<BaseResponse> call, Response<BaseResponse> response) {
                if (response != null) {
                    if (response.isSuccessful() && response.body() != null)
                        callback.onSuccess(formId);
                    else
                        callback.onFailure(getErrorMessage(response.code()), formId);
                } else {
                    callback.onFailure("No Response from server", formId);
                }
            }

            @Override
            public void onFailure(Call<BaseResponse> call, Throwable t) {
                callback.onFailure(getErrorMessage(t), formId);
            }
        });

    }

    public void updateForm(JSONObject jsonObject, String endPoint, String uuid, final ResponseCallback.ResponseForm callback) {
        RequestBody body = RequestBody.create(okhttp3.MediaType.parse("application/json; charset=utf-8"), (jsonObject.toString()));

        apiService.updateForm(GlobalConstants.AUTHTOKEN, endPoint, uuid, body).enqueue(new Callback<BaseResponse>() {
            @Override
            public void onResponse(Call<BaseResponse> call, Response<BaseResponse> response) {

                if (response != null) {
                    if (response.isSuccessful() && response.body() != null)
                        callback.onSuccess();
                    else
                        callback.onFailure(getErrorMessage(response.code()));
                } else {
                    callback.onFailure("No Response from server");
                }
            }

            @Override
            public void onFailure(Call<BaseResponse> call, Throwable t) {
                callback.onFailure(getErrorMessage(t));
            }
        });
    }

    public void login(String authToken, String username, final ResponseCallback.ResponseUser callback) {
        apiService.login(authToken, username).enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response != null) {
                    if (response.isSuccessful() && response.body() != null)
                        callback.onSuccess(response.body());
                    else
                        callback.onFailure(getErrorMessage(response.code()));
                } else {
                    callback.onFailure("No Response from server");
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                callback.onFailure(getErrorMessage(t));
            }
        });
    }


    private interface ParticipantListeners {
        public void onParticipantReceived(List<Participant> participants, ResponseCallback callback, int counts);
    }
}
