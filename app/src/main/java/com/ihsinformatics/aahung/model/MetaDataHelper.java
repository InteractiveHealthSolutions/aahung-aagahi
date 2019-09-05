package com.ihsinformatics.aahung.model;

import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.db.dao.MetadataDao;
import com.ihsinformatics.aahung.model.metadata.Definition;
import com.ihsinformatics.aahung.model.metadata.DefinitionType;
import com.ihsinformatics.aahung.model.metadata.LocationAttributeType;
import com.ihsinformatics.aahung.model.metadata.PersonAttributeType;
import com.ihsinformatics.aahung.network.ApiService;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MetaDataHelper {

    static int sucessfulSave = 0;
    private ApiService apiService;
    private MetadataDao metadataDao;
    private MetadataContact metadataContact;

    public MetaDataHelper(ApiService apiService, MetadataDao metadataDao) {
        this.apiService = apiService;
        this.metadataDao = metadataDao;
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
            metadataContact.onSaveCompleted();
            //getPersonAttributeTypes();
        }

        @Override
        public void onPersonAttributeTypeSaved() {
            metadataContact.onSaveCompleted();
        }


    };

    private void getPersonAttributeTypes() {
        apiService.getPersonAttributeType(GlobalConstants.AUTHTOKEN).enqueue(new Callback<List<PersonAttributeType>>() {
            @Override
            public void onResponse(Call<List<PersonAttributeType>> call, Response<List<PersonAttributeType>> response) {
                if (response != null && response.body() != null) {
                    // metadataDao.savePersonAttributeType(response.body()); //// FIXME uncomment after the query
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
        apiService.getLocationAttributeType(GlobalConstants.AUTHTOKEN).enqueue(new Callback<List<LocationAttributeType>>() {
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
            apiService.getDefinitionByUUID(GlobalConstants.AUTHTOKEN, definitionType.getUuid()).enqueue(new Callback<List<Definition>>() {
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
        apiService.getAllDefinitionTypes(GlobalConstants.AUTHTOKEN).enqueue(new Callback<List<DefinitionType>>() {
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

    }

    public interface MetadataContact {
        public void onSaveCompleted();

        public void onMetadataFailure();
    }
}
