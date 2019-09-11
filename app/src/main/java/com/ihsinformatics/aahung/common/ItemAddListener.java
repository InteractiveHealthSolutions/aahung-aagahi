package com.ihsinformatics.aahung.common;

import com.ihsinformatics.aahung.model.BaseItem;

import java.util.List;

public interface ItemAddListener {
    public void onItemAdded(String shortName);
    public void onListAdded(List<BaseItem> baseItemList); // FIXME make serparate Interface if both interface are not used at same time
}
