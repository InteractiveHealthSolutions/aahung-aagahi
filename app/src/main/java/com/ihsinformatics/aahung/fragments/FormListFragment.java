package com.ihsinformatics.aahung.fragments;


import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.FormAdapterListener;
import com.ihsinformatics.aahung.model.FormDetails;
import com.ihsinformatics.aahung.common.FormsAdaper;

import java.io.Serializable;
import java.util.List;

/**
 * A simple {@link Fragment} subclass.
 */
public class FormListFragment extends Fragment {


    private static final String FORMS_KEY = "forms";
    public static final String FORM_TAG = "form_tag";
    private List<FormDetails> forms;
    private View view;

    private FormListFragment() {
        // Required empty public constructor
    }

    public static FormListFragment newInstace(List<FormDetails> forms) {
        FormListFragment fragment = new FormListFragment();
        Bundle args = new Bundle();
        args.putSerializable(FORMS_KEY, (Serializable) forms);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            forms = (List<FormDetails>) getArguments().getSerializable(FORMS_KEY);
            initRecycler();
        }

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        view = inflater.inflate(R.layout.fragment_srhm, container, false);
        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initRecycler();
    }

    private void initRecycler() {
        if (view != null) {
            RecyclerView recyclerView = view.findViewById(R.id.recycler);
            recyclerView.setHasFixedSize(true);
            recyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));
            recyclerView.setAdapter(new FormsAdaper(forms, new FormAdapterListener() {
                @Override
                public void onFormClicked(FormDetails formDetails) {
                    getFragmentManager()
                            .beginTransaction()
                            .setCustomAnimations(R.anim.md_styled_slide_up_normal, R.anim.md_styled_slide_down_normal)
                            .add(R.id.baselayout,FormFragment.newInstance(formDetails), FORM_TAG)
                            .commit();
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
}
