package com.ihsinformatics.aahung.fragments.form;

import android.content.Context;
import android.os.Bundle;

import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.ihsinformatics.aahung.App;
import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.activities.MainActivity;
import com.ihsinformatics.aahung.databinding.FragmentFormBinding;
import com.ihsinformatics.aahung.fragments.LoadingFragment;
import com.ihsinformatics.aahung.model.FormDetails;

import com.ihsinformatics.aahung.views.ButtonWidget;
import com.ihsinformatics.aahung.views.FormUI;

import org.json.JSONObject;

import java.io.Serializable;

import javax.inject.Inject;

import static com.ihsinformatics.aahung.common.GlobalConstants.LOADING_TAG;


public class FormFragment extends Fragment implements FormUI.FormListener, FormContract.View, View.OnClickListener {

    private static final String FORM_DETAIL_KEY = "form_detail";
    public static final String LISTENER = "Listener";


    private FormDetails formDetails;

    private OnFormFragmentInteractionListener onFormFragmentInteractionListener;

    private LoadingFragment loading;
    private FormUI.Builder formBuilder;

    private FormFragment() {
    }

    @Inject
    FormContract.Presenter presenter;

    FragmentFormBinding binding;


    public static FormFragment newInstance(FormDetails form, OnFormFragmentInteractionListener onFormFragmentInteractionListener) {

        FormFragment fragment = new FormFragment();
        Bundle args = new Bundle();
        args.putSerializable(FORM_DETAIL_KEY, form);
        args.putSerializable(LISTENER, onFormFragmentInteractionListener);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            formDetails = (FormDetails) getArguments().getSerializable(FORM_DETAIL_KEY);
            onFormFragmentInteractionListener = (OnFormFragmentInteractionListener) getArguments().getSerializable(LISTENER);
        }
    }

    @Override
    public void onStart() {
        super.onStart();
        loading = new LoadingFragment();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        onFormFragmentInteractionListener.onFormDestroy();
        onFormFragmentInteractionListener = null;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_form, container, false);
        presenter.takeView(this);
        setupForm(binding.baselayout);
        return binding.getRoot();
    }


    private void setupForm(LinearLayout baselayout) {
        binding.formReset.setOnClickListener(this);
        binding.formName.setText(formDetails.getForms().getName());
        formBuilder = new FormUI.Builder(getActivity(), baselayout, formDetails, this).createForm();
    }


    @Override
    public void onAttach(Context context) {
        ((App) context.getApplicationContext()).getComponent().inject(this);
        super.onAttach(context);
    }

    @Override
    public void onDetach() {
        super.onDetach();

    }

    @Override
    public void onCompleted(JSONObject json, String endpoint, ButtonWidget buttonWidget) {
        if (!loading.isAdded()) {
            loading.show(getActivity().getSupportFragmentManager(), LOADING_TAG);
            loading.setCancelable(false);
        }

        presenter.onFormSubmission(json, endpoint, buttonWidget);
    }

    @Override
    public void onCompleted(JSONObject json, String endpoint, String uuid, ButtonWidget buttonWidget) {
        if (!loading.isAdded()) {
            loading.show(getActivity().getSupportFragmentManager(), LOADING_TAG);
            loading.setCancelable(false);
        }
        presenter.onFormUpdate(json, uuid, endpoint, buttonWidget);
    }

    @Override
    public void onSaved() {
        presenter.onFormSaved();
    }

    @Override
    public void onFormLoaded() {
        onFormFragmentInteractionListener.onFormLoaded();
    }

    @Override
    public void showToast(String message) {
        if (getContext() != null)
            Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
    }

    @Override
    public void dismissLoading() {
        if (loading.isVisible()) {
            try {
                loading.dismiss();
            } catch (IllegalStateException ignored) {
                ignored.printStackTrace();
            }

        }
    }

    @Override
    public void finish() {
        if (getContext() != null)
            ((MainActivity) getContext()).onBackPressed();
    }

    @Override
    public void onClick(View view) {
        formBuilder.resetForm();
    }

    public interface OnFormFragmentInteractionListener extends Serializable {
        void onFormDestroy();
        void onFormLoaded();
    }


}
