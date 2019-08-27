package com.ihsinformatics.aahung.common;

import com.ihsinformatics.aahung.model.BaseItem;

import java.util.List;

public interface ResponseCallback {
    public void onSuccess(List<? extends BaseItem> items);
}
