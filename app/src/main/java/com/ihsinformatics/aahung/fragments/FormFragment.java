package com.ihsinformatics.aahung.fragments;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;

import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.databinding.FragmentFormBinding;
import com.ihsinformatics.aahung.model.FormDetails;

import com.ihsinformatics.aahung.views.FormUI;

import org.json.JSONObject;


public class FormFragment extends Fragment implements FormUI.FormListener {

    private static final String FORM_DETAIL_KEY = "form_detail";


    private FormDetails formDetails;

    private OnFragmentInteractionListener mListener;

    private FormFragment() {
    }

    FragmentFormBinding binding;


    public static FormFragment newInstance(FormDetails form) {
        FormFragment fragment = new FormFragment();
        Bundle args = new Bundle();
        args.putSerializable(FORM_DETAIL_KEY, form);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            formDetails = (FormDetails) getArguments().getSerializable(FORM_DETAIL_KEY);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_form, container, false);
        setupForm(binding.baselayout);
        return binding.getRoot();
    }


    private void setupForm(LinearLayout baselayout) {
        binding.formName.setText(formDetails.getForms().getName());
        FormUI formUI = new FormUI.Builder(getActivity(), baselayout, formDetails, this).createForm();

    }

    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    @Override
    public void onCompleted(JSONObject json, String endpoint) {

    }

    public interface OnFragmentInteractionListener {

        void onFragmentInteraction(Uri uri);
    }


}
