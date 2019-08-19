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
import com.ihsinformatics.aahung.views.DataProvider.FormType;

import java.util.ArrayList;

import static com.ihsinformatics.aahung.views.DataProvider.FormType.*;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link TabFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 */
public class TabFragment extends Fragment {

    private OnFragmentInteractionListener mListener;
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

        for(DataProvider.Forms forms: DataProvider.Forms.values())
        {
            switch (forms.getFormType())
            {
                case LSE:
                    lseForms.add(new FormDetails(forms, "The Details are not available right now")); // FIXME  description should be coming from enum
                    break;
                case SRHM:
                    shrmForms.add(new FormDetails(forms, "The Details are not available right now"));
                    break;
                case COMMS:
                    commsForms.add(new FormDetails(forms, "The Details are not available right now"));
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
        adapter.addFragment(FormListFragment.newInstace(lseForms), "LSE");
        adapter.addFragment(FormListFragment.newInstace(shrmForms), "SRHM");
        adapter.addFragment(FormListFragment.newInstace(commsForms), "COMMS");
        binding.pager.setAdapter(adapter);
        binding.tabLayout.setupWithViewPager(binding.pager);

    }

    // TODO: Rename method, update argument and hook method into UI event
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


    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }
}
