package com.ihsinformatics.aahung.common;

import com.ihsinformatics.aahung.model.BaseItem;
import com.ihsinformatics.aahung.model.results.BaseResult;

import java.util.List;

public interface ResponseCallback {
    public void onSuccess(List<? extends BaseItem> items);

    public interface ResponseProvider{
        public void onSuccess(BaseResult baseResult);
    }
}
