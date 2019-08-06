package com.ihsinformatics.aahung.fragments.location;


import android.os.Bundle;

import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.DialogFragment;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.databinding.FragmentLocationFilterDialogBinding;


/**
 * A simple {@link Fragment} subclass.
 */
public class LocationFilterDialogFragment extends DialogFragment {

    private FragmentLocationFilterDialogBinding binding;

    private LocationFilterDialogFragment() {
        // Required empty public constructor
    }


    public static LocationFilterDialogFragment createInstance() {
        LocationFilterDialogFragment fragment = new LocationFilterDialogFragment();
        return fragment;
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_location_filter_dialog, container, false);
        init();
        return binding.getRoot();
    }

    private void init() {
        binding.widgetLocationType.radio.setText("School","Institution");
    }

}
