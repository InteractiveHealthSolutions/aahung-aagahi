package com.ihsinformatics.aahung.common;

import com.ihsinformatics.aahung.model.BaseItem;
import com.ihsinformatics.aahung.model.location.Location;
import com.ihsinformatics.aahung.model.results.BaseResult;

import java.util.List;

public interface ResponseCallback {
    public void onSuccess(List<? extends BaseItem> items);
    public void onFailure(String message);

    public interface ResponseProvider {
        public void onSuccess(BaseResult baseResult);
        public void onFailure(String message);
    }

    public interface ResponseLocation {
        public void onSuccess(Location baseResult);
        public void onFailure(String message);
    }

    public interface ResponseForm {
        public void onSuccess();
        public void onFailure(String message);
    }
}
