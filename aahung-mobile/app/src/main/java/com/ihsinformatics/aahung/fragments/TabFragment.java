package com.ihsinformatics.aahung.fragments;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentPagerAdapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.TabAdapter;
import com.ihsinformatics.aahung.databinding.FragmentTabBinding;
import com.ihsinformatics.aahung.model.FormDetails;
import com.ihsinformatics.aahung.views.DataProvider;

import java.util.ArrayList;


public class TabFragment extends Fragment {


    private FragmentTabBinding binding;
    private TabAdapter adapter;
    private ArrayList<FormDetails> lseForms = new ArrayList<>();
    private ArrayList<FormDetails> shrmForms = new ArrayList<>();
    private ArrayList<FormDetails> commsForms = new ArrayList<>();

    public TabFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_tab, container, false);
        initList();
        return binding.getRoot();
    }

    @Override
    public void onStart() {
        super.onStart();

        for (DataProvider.Forms forms : DataProvider.Forms.values()) {
            switch (forms.getFormCategory()) {
                case LSE:
                    lseForms.add(new FormDetails(forms));
                    break;
                case SRHM:
                    shrmForms.add(new FormDetails(forms));
                    break;
                case COMMS:
                    commsForms.add(new FormDetails(forms));
                    break;
            }

        }
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

    }

    private void initList() {

        adapter = new TabAdapter(getActivity().getSupportFragmentManager(), FragmentPagerAdapter.BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT);
        adapter.addFragment(FormListFragment.newInstace(lseForms, "lse"), "LSE");
        adapter.addFragment(FormListFragment.newInstace(shrmForms, "srhm"), "SRHM");
        adapter.addFragment(FormListFragment.newInstace(commsForms, "comms"), "COMMS");
        binding.pager.setAdapter(adapter);
        binding.tabLayout.setupWithViewPager(binding.pager);

    }


}
