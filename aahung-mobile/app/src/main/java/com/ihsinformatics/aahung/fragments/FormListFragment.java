package com.ihsinformatics.aahung.fragments;


import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import com.droidnet.DroidListener;
import com.droidnet.DroidNet;
import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.FormAdapterListener;
import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.common.Utils;
import com.ihsinformatics.aahung.databinding.FragmentListBinding;
import com.ihsinformatics.aahung.fragments.form.FormFragment;
import com.ihsinformatics.aahung.fragments.location.LocationFilterDialogFragment;
import com.ihsinformatics.aahung.model.BaseItem;
import com.ihsinformatics.aahung.model.FormDetails;
import com.ihsinformatics.aahung.common.FormsAdaper;
import com.ihsinformatics.aahung.views.DataProvider;

import java.io.Serializable;
import java.util.List;

/**
 * A simple {@link Fragment} subclass.
 */
public class FormListFragment extends Fragment implements FormFragment.OnFormFragmentInteractionListener, View.OnClickListener, LocationFilterDialogFragment.OnFilterInteractionListener {


    private static final String FORMS_KEY = "forms";
    public static final String FORM_TAG = "form_tag";
    public static final String FORM_TYPE = "formType";
    public static final String LOCATION_TYPE = "locationType";
    public static final String COMMS = "comms";
    public static final String LSE = "lse";
    public static final String SCHOOL = "school";
    public static final String INSTITUTE = "institute";
    public static final String SRHM = "srhm";
    public static final String FILTER_TAG = "filterTag";

    private List<FormDetails> forms;

    private boolean isFormLoading;
    private String formsType;
    private transient FragmentListBinding binding;

    private FormListFragment() {
        // Required empty public constructor
    }

    public static FormListFragment newInstace(List<FormDetails> forms, String formsType) {
        FormListFragment fragment = new FormListFragment();
        Bundle args = new Bundle();
        args.putSerializable(FORMS_KEY, (Serializable) forms);
        args.putString(FORM_TYPE, formsType);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            forms = (List<FormDetails>) getArguments().getSerializable(FORMS_KEY);
            formsType = getArguments().getString(FORM_TYPE);

            initRecycler();
        }
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_list, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initRecycler();
        initControls();
    }

    private void initControls() {
        binding.layoutLocation.addLocation.setOnClickListener(this);
        if (formsType.equals(COMMS))
            binding.layoutLocation.root.setVisibility(View.GONE);


    }

    private void initRecycler() {
        if (binding != null) {
            binding.recycler.setHasFixedSize(true);
            binding.recycler.setLayoutManager(new LinearLayoutManager(getActivity()));
            binding.recycler.setAdapter(new FormsAdaper(getContext(), forms, new FormAdapterListener() {
                @Override
                public void onFormClicked(FormDetails formDetails) {
                    if (!Utils.isInternetAvailable(getContext()) && formDetails.getForms().getMethod().equals(DataProvider.Method.PUT))
                        showError("This form is not available in offline mode");
                    else if (!isFormLoading) {
                        binding.progressBar.setVisibility(View.VISIBLE);
                        isFormLoading = true;
                        getFragmentManager()
                                .beginTransaction()
                                .setCustomAnimations(R.anim.md_styled_slide_up_normal, R.anim.md_styled_slide_down_normal)
                                .add(R.id.baselayout, FormFragment.newInstance(formDetails, FormListFragment.this), FORM_TAG)
                                .commit();

                    }
                }

                @Override
                public void showError(String message) {
                    Toast.makeText(getActivity(), message, Toast.LENGTH_SHORT).show();
                }
            }));
        }
    }


    @Override
    public void onSaveInstanceState(@NonNull Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putSerializable(FORMS_KEY, (Serializable) forms);
    }

    @Override
    public void onViewStateRestored(@Nullable Bundle savedInstanceState) {
        super.onViewStateRestored(savedInstanceState);
        if (savedInstanceState != null)
            forms = (List<FormDetails>) savedInstanceState.getSerializable(FORMS_KEY);
    }

    @Override
    public void onFormDestroy() {
        isFormLoading = false;
    }

    @Override
    public void onFormLoaded() {
        binding.progressBar.setVisibility(View.GONE);
    }

    @Override
    public void onClick(View view) {
        LocationFilterDialogFragment locationFragment = LocationFilterDialogFragment.newInstance(FormListFragment.this, formsType.equals(LSE) ? SCHOOL : INSTITUTE);
        locationFragment.show(getActivity().getSupportFragmentManager(), FILTER_TAG);

    }

    @Override
    public void onLocationClick(BaseItem location) {
        updateHeader(location);
        if (formsType.equals(LSE))
            GlobalConstants.selectedSchool = location;
        else if (formsType.equals(SRHM))
            GlobalConstants.selectedInstitute = location;

    }

    private void updateHeader(BaseItem location) {
        binding.layoutLocation.locationName.setText(location.getName());
        binding.layoutLocation.locationId.setText(location.getShortName());
        binding.layoutLocation.noLocation.setVisibility(View.GONE);
        binding.layoutLocation.locationName.setVisibility(View.VISIBLE);
        binding.layoutLocation.locationId.setVisibility(View.VISIBLE);
    }

    @Override
    public void onResume() {
        super.onResume();
        if (formsType != null && formsType.equals(LSE) && GlobalConstants.selectedSchool != null) {
            updateHeader(GlobalConstants.selectedSchool);
        } else if (formsType != null && formsType.equals(SRHM) && GlobalConstants.selectedInstitute != null) {
            updateHeader(GlobalConstants.selectedInstitute);
        }
    }


}
