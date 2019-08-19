package com.ihsinformatics.aahung.fragments.location;

import com.ihsinformatics.aahung.common.BasePresenter;
import com.ihsinformatics.aahung.model.location.BaseLocation;
import com.ihsinformatics.aahung.model.location.Location;

import java.util.List;

public interface LocationFilterContact {

    public interface View{
        void showToast(String message);
        void dismissLoading();
        void setAdapter(List<BaseLocation> body);
    }

    public interface Presenter extends BasePresenter<View> {
        void getLocations();
        void getLocationByName(String name);
    }


}
