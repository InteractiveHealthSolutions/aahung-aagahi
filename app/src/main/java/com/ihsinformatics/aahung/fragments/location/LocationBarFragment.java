package com.ihsinformatics.aahung.fragments.location;


import android.os.Bundle;

import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.databinding.LocationBarBinding;

/**
 * A simple {@link Fragment} subclass.
 */
public class LocationBarFragment extends Fragment {


    public static final String FILTER_TAG = "filterTag";

    public LocationBarFragment() {
        // Required empty public constructor
    }

    private LocationBarBinding binding;


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        binding = DataBindingUtil.inflate(inflater,R.layout.location_bar,container,false);
        init();
        return binding.getRoot();
    }

    private void init() {
        binding.addLocation.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
               LocationFilterDialogFragment locationFragment =  LocationFilterDialogFragment.createInstance();
               locationFragment.show(getActivity().getSupportFragmentManager(), FILTER_TAG);
            }
        });
    }

}
