package com.ihsinformatics.aahung.common;

import com.ihsinformatics.aahung.model.BaseItem;

import java.io.Serializable;
import java.util.List;

public interface UserContract  {
    public interface UserFragmentInteractionListener extends Serializable {
        public void onCompleted(List<BaseItem> users);
    }

    public interface AdapterInteractionListener {
        public void onUserSelected(BaseItem user);
    }

}
