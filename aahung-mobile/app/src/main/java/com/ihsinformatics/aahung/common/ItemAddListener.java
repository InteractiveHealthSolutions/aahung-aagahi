package com.ihsinformatics.aahung.common;

import com.ihsinformatics.aahung.model.BaseItem;

import java.util.List;

public interface ItemAddListener {
    public interface SingleItemListener {
        public void onItemAdded(String shortName);
    }

    public interface ListItemListener {
        public void onListAdded(List<BaseItem> baseItemList);
    }

}
