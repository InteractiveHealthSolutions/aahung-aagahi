package com.ihsinformatics.aahung.model;

import android.content.Context;

import com.ihsinformatics.aahung.R;

import java.util.Arrays;
import java.util.List;

public class LocationService {
    Context context;

    public LocationService(Context context) {
        this.context = context;
    }

    public List<String> getFilteredDistrict(String province, boolean isNayaQadam)
    {
        List<String> districts;

        if (province.equals("Sindh")) {
            districts = Arrays.asList((isNayaQadam) ? context.getResources().getStringArray(R.array.district_sindh_naya_qadam) : context.getResources().getStringArray(R.array.district_sindh));
        } else if (province.equals("Punjab")) {
            districts = Arrays.asList((isNayaQadam) ? context.getResources().getStringArray(R.array.district_punjab_naya_qadam) :context.getResources().getStringArray(R.array.district_punjab));
        } else if (province.equals("Balochistan")) {
            districts = Arrays.asList(context.getResources().getStringArray(R.array.district_balochistan));
        } else if (province.equals("KP")) {
            districts = Arrays.asList(context.getResources().getStringArray(R.array.district_kp));
        } else if (province.equals("Gilgit-Baltistan")) {
            districts = Arrays.asList(context.getResources().getStringArray(R.array.district_gilgit_baldistan));
        } else {
            districts = Arrays.asList(context.getResources().getStringArray(R.array.district_sindh));
        }
        return districts;
    }


}
