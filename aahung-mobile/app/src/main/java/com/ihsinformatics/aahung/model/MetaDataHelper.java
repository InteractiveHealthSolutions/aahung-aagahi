package com.ihsinformatics.aahung.model;

import com.ihsinformatics.aahung.db.dao.MetadataDao;
import com.ihsinformatics.aahung.model.metadata.Definition;
import com.ihsinformatics.aahung.model.metadata.DefinitionType;
import com.ihsinformatics.aahung.model.metadata.FormElements;
import com.ihsinformatics.aahung.model.metadata.FormType;
import com.ihsinformatics.aahung.model.metadata.LocationAttributeType;
import com.ihsinformatics.aahung.model.metadata.PersonAttributeType;
import com.ihsinformatics.aahung.model.metadata.Role;
import com.ihsinformatics.aahung.model.metadata.UserRole;
import com.ihsinformatics.aahung.model.user.User;
import com.ihsinformatics.aahung.network.ApiService;

import java.util.List;

import okhttp3.Credentials;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MetaDataHelper {

    static int sucessfulSave = 0;
    private ApiService apiService;
    private MetadataDao metadataDao;
    private MetadataContact metadataContact;
    private String syncAuthToken;

    public MetaDataHelper(ApiService apiService, MetadataDao metadataDao) {
        this.apiService = apiService;
        this.metadataDao = metadataDao;
        syncAuthToken = Credentials.basic("sync.user","sync123");
    }

    public void getAllMetadata(MetadataContact metadataContact) {
        this.metadataContact = metadataContact;
        getDefinitionTypes(metadataListener);
    }

    private MetadataListener metadataListener = new MetadataListener() {
        @Override
        public void onDefinitionTypeSaveCompleted(List<DefinitionType> definitionTypes) {
            sucessfulSave = 0;
            getDefinitions(definitionTypes, this);
        }

        @Override
        public void onDefinitionSaveCompleted(int totalCount) {
            sucessfulSave++;
            if (totalCount == sucessfulSave) {
                getLocationAttributeType();
            }

        }

        @Override
        public void onLocationAttributeTypeSaved() {
            getPersonAttributeTypes();
        }

        @Override
        public void onPersonAttributeTypeSaved() {
            getFormElements();
        }

        @Override
        public void onFormElementSaved() {
            getFormTypes();
        }

        @Override
        public void onFormTypesSaved() {
            getUserRoles();
        }

        @Override
        public void onUserRolesSaved() {
            getUsers();
        }

        @Override
        public void onUsersSaved() {
            metadataContact.onSaveCompleted();
        }


    };

    private void getUsers() {
        apiService.getAllUsers(syncAuthToken).enqueue(new Callback<List<User>>() {
            @Override
            public void onResponse(Call<List<User>> call, Response<List<User>> response) {
                if (response != null && response.body() != null) {
                    saveUsers(response);
                } else {
                    metadataContact.onMetadataFailure();
                }
            }

            @Override
            public void onFailure(Call<List<User>> call, Throwable t) {
                metadataContact.onMetadataFailure();
            }
        });
    }

    private void saveUsers(Response<List<User>> response) {
        metadataDao.saveAllUser(response.body());
        for (User user : response.body()) {
            for (Role role : user.getUserRoles())
                metadataDao.saveUserRoles(new UserRole(user.getUserId(), role.getRoleId()));
        }

        metadataListener.onUsersSaved();
    }

    private void getUserRoles() {
        apiService.getUserRoles(syncAuthToken).enqueue(new Callback<List<Role>>() {
            @Override
            public void onResponse(Call<List<Role>> call, Response<List<Role>> response) {
                if (response != null && response.body() != null) {
                    metadataDao.saveRoles(response.body());
                    metadataListener.onUserRolesSaved();
                } else {
                    metadataContact.onMetadataFailure();
                }
            }

            @Override
            public void onFailure(Call<List<Role>> call, Throwable t) {
                metadataContact.onMetadataFailure();
            }
        });
    }

    private void getFormTypes() {
        apiService.getFormTypes(syncAuthToken).enqueue(new Callback<List<FormType>>() {
            @Override
            public void onResponse(Call<List<FormType>> call, Response<List<FormType>> response) {
                if (response != null && response.body() != null) {
                    metadataDao.saveFormTypes(response.body());
                    metadataListener.onFormTypesSaved();
                } else {
                    metadataContact.onMetadataFailure();
                }
            }

            @Override
            public void onFailure(Call<List<FormType>> call, Throwable t) {
                metadataContact.onMetadataFailure();

            }
        });
    }

    private void getFormElements() {
        apiService.getFormElements(syncAuthToken).enqueue(new Callback<List<FormElements>>() {
            @Override
            public void onResponse(Call<List<FormElements>> call, Response<List<FormElements>> response) {
                if (response != null && response.body() != null) {
                    metadataDao.saveFormElements(response.body());
                    metadataListener.onFormElementSaved();
                } else {
                    metadataContact.onMetadataFailure();
                }
            }

            @Override
            public void onFailure(Call<List<FormElements>> call, Throwable t) {
                metadataContact.onMetadataFailure();
            }
        });
    }

    private void getPersonAttributeTypes() {
        apiService.getPersonAttributeType(syncAuthToken).enqueue(new Callback<List<PersonAttributeType>>() {
            @Override
            public void onResponse(Call<List<PersonAttributeType>> call, Response<List<PersonAttributeType>> response) {
                if (response != null && response.body() != null) {
                    metadataDao.savePersonAttributeType(response.body());
                    metadataListener.onPersonAttributeTypeSaved();
                } else {
                    metadataContact.onMetadataFailure();
                }
            }

            @Override
            public void onFailure(Call<List<PersonAttributeType>> call, Throwable t) {
                metadataContact.onMetadataFailure();
            }
        });
    }

    private void getLocationAttributeType() {
        apiService.getLocationAttributeType(syncAuthToken).enqueue(new Callback<List<LocationAttributeType>>() {
            @Override
            public void onResponse(Call<List<LocationAttributeType>> call, Response<List<LocationAttributeType>> response) {
                if (response != null && response.body() != null) {
                    metadataDao.saveAllLocationAttributeType(response.body());
                    metadataListener.onLocationAttributeTypeSaved();
                } else {
                    metadataContact.onMetadataFailure();
                }
            }

            @Override
            public void onFailure(Call<List<LocationAttributeType>> call, Throwable t) {
                metadataContact.onMetadataFailure();
            }
        });
    }

    private void getDefinitions(List<DefinitionType> definitionTypes, final MetadataListener metadataListener) {
        final int totalCount = definitionTypes.size();
        for (DefinitionType definitionType : definitionTypes) {
            apiService.getDefinitionByUUID(syncAuthToken, definitionType.getUuid()).enqueue(new Callback<List<Definition>>() {
                @Override
                public void onResponse(Call<List<Definition>> call, Response<List<Definition>> response) {
                    if (response != null && response.body() != null) {
                        metadataDao.saveDefinitions(response.body());
                        metadataListener.onDefinitionSaveCompleted(totalCount);
                    } else {
                        metadataContact.onMetadataFailure();
                    }
                }

                @Override
                public void onFailure(Call<List<Definition>> call, Throwable t) {
                    metadataContact.onMetadataFailure();
                }
            });
        }
    }

    private void getDefinitionTypes(final MetadataListener metadataListener) {
        apiService.getAllDefinitionTypes(syncAuthToken).enqueue(new Callback<List<DefinitionType>>() {
            @Override
            public void onResponse(Call<List<DefinitionType>> call, Response<List<DefinitionType>> response) {
                if (response != null && response.body() != null) {
                    metadataDao.saveDefinitionTypes(response.body());
                    metadataListener.onDefinitionTypeSaveCompleted(response.body());
                } else {
                    metadataContact.onMetadataFailure();
                }
            }

            @Override
            public void onFailure(Call<List<DefinitionType>> call, Throwable t) {
                metadataContact.onMetadataFailure();
            }
        });
    }


    private interface MetadataListener {
        public void onDefinitionTypeSaveCompleted(List<DefinitionType> definitionTypes);

        public void onDefinitionSaveCompleted(int totalCount);

        public void onLocationAttributeTypeSaved();

        public void onPersonAttributeTypeSaved();

        public void onFormElementSaved();

        public void onFormTypesSaved();

        public void onUserRolesSaved();

        public void onUsersSaved();

    }

    public interface MetadataContact {
        public void onSaveCompleted();

        public void onMetadataFailure();
    }
}
