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

import com.ihsinformatics.aahung.App;
import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.common.UserContract;
import com.ihsinformatics.aahung.databinding.FragmentLocationFilterDialogBinding;
import com.ihsinformatics.aahung.db.dao.LocationDao;
import com.ihsinformatics.aahung.fragments.LoadingFragment;
import com.ihsinformatics.aahung.fragments.UserRecyclerViewAdapter;
import com.ihsinformatics.aahung.model.BaseItem;
import com.ihsinformatics.aahung.model.location.BaseLocation;
import com.ihsinformatics.aahung.model.location.Location;
import com.ihsinformatics.aahung.network.ApiService;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import static com.ihsinformatics.aahung.common.GlobalConstants.LOADING_TAG;


/**
 * A simple {@link Fragment} subclass.
 */
public class LocationFilterDialogFragment extends DialogFragment implements UserContract.AdapterInteractionListener, SearchView.OnQueryTextListener, LocationFilterContact.View {



    public static final String LISTENER = "listener";
    private FragmentLocationFilterDialogBinding binding;
    private UserRecyclerViewAdapter listAdapter;
    private OnFilterInteractionListener filterInteractionListener;

    @Inject
    LocationFilterContact.Presenter presenter;
    private LoadingFragment loadingFragment;

    private LocationFilterDialogFragment() {

    }


    public static LocationFilterDialogFragment newInstance(OnFilterInteractionListener interactionListener) {
        LocationFilterDialogFragment fragment = new LocationFilterDialogFragment();
        Bundle args = new Bundle();
        args.putSerializable(LISTENER, interactionListener);
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
        presenter.takeView(this);
        init();
        return binding.getRoot();
    }


    @Override
    public void onDestroy() {
        super.onDestroy();
        presenter.dropView();
    }

    private void init() {
        loadingFragment = new LoadingFragment();
        loadingFragment.show(getFragmentManager(), LOADING_TAG);
        presenter.getLocations();
        binding.search.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                binding.search.onActionViewExpanded();
            }
        });

    }


    @Override
    public void onAttach(@NonNull Context context) {
        ((App) context.getApplicationContext()).getComponent().inject(this);
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

    @Override
    public void showToast(String message) {

    }

    @Override
    public void dismissLoading() {
        if (loadingFragment != null)
            loadingFragment.dismiss();


    }

    @Override
    public void setAdapter(List<BaseLocation> locations) {
        binding.list.setLayoutManager(new LinearLayoutManager(binding.getRoot().getContext()));
        listAdapter = new UserRecyclerViewAdapter(locations, this);
        binding.list.setAdapter(listAdapter);
        binding.search.setQueryHint("School Name or ID");
        binding.search.setOnQueryTextListener(this);
    }


    public interface OnFilterInteractionListener extends Serializable {
        public void onLocationClick(BaseItem location);
    }
}
