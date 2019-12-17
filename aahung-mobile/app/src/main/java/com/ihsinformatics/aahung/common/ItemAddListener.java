package com.ihsinformatics.aahung.common;

import com.ihsinformatics.aahung.model.BaseItem;

import java.io.Serializable;
import java.util.List;

public interface ItemAddListener {
    public interface SingleItemListener extends Serializable {
        public void onItemAdded(String shortName);
    }

    public interface ListItemListener extends Serializable {
        public void onListAdded(List<BaseItem> baseItemList);
    }

}
