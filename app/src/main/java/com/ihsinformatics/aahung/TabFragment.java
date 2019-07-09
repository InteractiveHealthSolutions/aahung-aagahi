package com.ihsinformatics.aahung;

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

import com.ihsinformatics.aahung.common.TabAdapter;
import com.ihsinformatics.aahung.databinding.FragmentTabBinding;
import com.ihsinformatics.aahung.fragments.FormListFragment;
import com.ihsinformatics.aahung.model.FormDetails;

import java.util.ArrayList;


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
        return binding.getRoot();
    }

    @Override
    public void onStart() {
        super.onStart();
        final String[] srhm = getResources().getStringArray(R.array.srhm);
        final String[] lse = getResources().getStringArray(R.array.lse);
        final String[] comms = getResources().getStringArray(R.array.comms);


        for (String formName : lse)
            lseForms.add(new FormDetails(formName, "The Details are not available right now"));

        for (String formName : srhm)
            shrmForms.add(new FormDetails(formName, "The Details are not available right now"));

        for (String formName : comms)
            commsForms.add(new FormDetails(formName, "The Details are not available right now"));

    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initList();
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
      /*  if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
        }*/
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }
}
