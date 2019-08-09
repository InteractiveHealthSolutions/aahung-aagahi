package com.ihsinformatics.aahung.fragments.location;


import android.content.Context;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.SearchView;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.DialogFragment;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.UserContract;
import com.ihsinformatics.aahung.databinding.FragmentLocationFilterDialogBinding;
import com.ihsinformatics.aahung.fragments.UserRecyclerViewAdapter;
import com.ihsinformatics.aahung.model.BaseItem;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;


/**
 * A simple {@link Fragment} subclass.
 */
public class LocationFilterDialogFragment extends DialogFragment implements UserContract.AdapterInteractionListener, SearchView.OnQueryTextListener {


    public static final String SCHOOL = "School";
    public static final String LISTENER = "listener";
    private FragmentLocationFilterDialogBinding binding;
    private UserRecyclerViewAdapter listAdapter;
    private OnFilterInteractionListener filterInteractionListener;

    private LocationFilterDialogFragment() {

    }


    public static LocationFilterDialogFragment newInstance(OnFilterInteractionListener interactionListener) {
        LocationFilterDialogFragment fragment = new LocationFilterDialogFragment();
        Bundle args = new Bundle();
        args.putSerializable(LISTENER,interactionListener);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            filterInteractionListener = (OnFilterInteractionListener) getArguments().getSerializable(LISTENER);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_location_filter_dialog, container, false);
        init();
        return binding.getRoot();
    }

    private void init() {

        binding.list.setLayoutManager(new LinearLayoutManager(binding.getRoot().getContext()));
        listAdapter = new UserRecyclerViewAdapter(getDummySchoolList(), this);
        binding.list.setAdapter(listAdapter);
        binding.search.setQueryHint("School Name or ID");
        binding.search.setOnQueryTextListener(this);

    }

    private List<BaseItem> getDummySchoolList() {
        List<BaseItem> users = new ArrayList<>();
        users.add(new BaseItem("a-211", "Metropolitan School", SCHOOL));
        users.add(new BaseItem("a-212", "Happy Palace Grammer School", SCHOOL));
        users.add(new BaseItem("a-213", "City School", SCHOOL));
        users.add(new BaseItem("a-213", "Sir Syed Secondary School", SCHOOL));
        users.add(new BaseItem("a-213", "BPS School", SCHOOL));
        users.add(new BaseItem("a-213", "Foundation School", SCHOOL));
        users.add(new BaseItem("a-213", "Nasra School", SCHOOL));
        users.add(new BaseItem("a-213", "Bahria  School", SCHOOL));
        users.add(new BaseItem("a-213", "St.Gregory's High School", SCHOOL));
        users.add(new BaseItem("a-213", "Fatmiya Boys School", SCHOOL));
        return users;
    }

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        if (getTargetFragment() != null) {
            filterInteractionListener = (OnFilterInteractionListener) getTargetFragment();
        }

    }

    @Override
    public boolean onQueryTextSubmit(String query) {
        listAdapter.getFilter().filter(query);
        return false;
    }

    @Override
    public boolean onQueryTextChange(String newText) {
        listAdapter.getFilter().filter(newText);
        return false;
    }


    @Override
    public void onUserSelected(BaseItem location) {
        filterInteractionListener.onLocationClick(location);
        dismiss();
    }


    public interface OnFilterInteractionListener extends Serializable {
        public void onLocationClick(BaseItem location);
    }
}
