package com.ihsinformatics.aahung.fragments.location;


import android.os.Bundle;

import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.databinding.LocationBarBinding;
import com.ihsinformatics.aahung.model.BaseItem;

import java.io.Serializable;

/**
 * A simple {@link Fragment} subclass.
 */
public class LocationBarFragment extends Fragment implements LocationFilterDialogFragment.OnFilterInteractionListener {


    public static final String FILTER_TAG = "filterTag";
    public static final int REQUEST_CODE = 33;

    public LocationBarFragment() {
        // Required empty public constructor
    }

    private transient LocationBarBinding binding;


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        binding = DataBindingUtil.inflate(inflater, R.layout.location_bar, container, false);
        init();
        return binding.getRoot();
    }

    private void init() {
        binding.addLocation.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                LocationFilterDialogFragment locationFragment = LocationFilterDialogFragment.newInstance(LocationBarFragment.this);
                locationFragment.show(getActivity().getSupportFragmentManager(), FILTER_TAG);
            }
        });
    }

    @Override
    public void onLocationClick(BaseItem location) {
        binding.locationName.setText(location.getName());
        binding.locationId.setText(String.valueOf(location.getID()));
        binding.noLocation.setVisibility(View.GONE);
        binding.locationName.setVisibility(View.VISIBLE);
        binding.locationId.setVisibility(View.VISIBLE);
    }
}
