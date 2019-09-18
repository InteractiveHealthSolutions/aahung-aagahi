package com.ihsinformatics.aahung.fragments.location;

import com.ihsinformatics.aahung.common.BasePresenter;
import com.ihsinformatics.aahung.model.BaseItem;

import java.util.List;

public interface LocationFilterContact {

    public interface View{
        void showToast(String message);
        void dismissLoading();
        void setAdapter(List<BaseItem> body);
        void finishDialog();
    }

    public interface Presenter extends BasePresenter<View> {

        void getLocationById(String id);
        void getOfflineLocations(String locationType);
        void getLocations(String locationType);
    }


}
