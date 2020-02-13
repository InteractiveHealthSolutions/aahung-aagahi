package com.ihsinformatics.aahung.fragments;

import android.content.res.ColorStateList;
import android.os.Bundle;

import androidx.appcompat.widget.SearchView;
import androidx.core.content.ContextCompat;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.DialogFragment;
import androidx.recyclerview.widget.LinearLayoutManager;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.google.android.material.chip.Chip;
import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.UserContract;
import com.ihsinformatics.aahung.databinding.FragmentUserListBinding;
import com.ihsinformatics.aahung.model.BaseItem;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;


public class SelectUserFragment extends DialogFragment implements UserContract.AdapterInteractionListener, View.OnClickListener, SearchView.OnQueryTextListener {


    private static final String ARG_USERS = "user";
    private static final String ARG_LISTENER = "listener";
    private static final String ARG_SELECTED_USERS = "selectedUsers";
    public static final String ARG_TITLE = "title";
    private static final String ARG_IS_SINGLE_SELECT = "singleSelect";
    private static final String ARG_IS_UPDATE_TRIGGER = "isUpateTriggered";
    private List<BaseItem> selectedUsers;
    private UserContract.UserFragmentInteractionListener fragmentInteractionListener;
    private List<BaseItem> users;
    private FragmentUserListBinding binding;
    private UserRecyclerViewAdapter userRecyclerViewAdapter;
    private String title;
    private boolean isSingleSelect;
    private boolean isUpdatedTriggered = false;


    private SelectUserFragment() {
    }

    public static SelectUserFragment newInstance(List<BaseItem> users, List<BaseItem> selectedUsers, String title, boolean isSingleSelect, boolean isUpdateTrigger, UserContract.UserFragmentInteractionListener userContract) {

        SelectUserFragment fragment = new SelectUserFragment();
        Bundle args = new Bundle();
        args.putSerializable(ARG_USERS, (Serializable) users);
        args.putSerializable(ARG_SELECTED_USERS, (Serializable) selectedUsers);
        args.putString(ARG_TITLE, title);
        args.putBoolean(ARG_IS_SINGLE_SELECT, isSingleSelect);
        args.putBoolean(ARG_IS_UPDATE_TRIGGER, isUpdateTrigger);
        args.putSerializable(ARG_LISTENER, (Serializable) userContract);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            users = (List<BaseItem>) getArguments().getSerializable(ARG_USERS);
            selectedUsers = (List<BaseItem>) getArguments().getSerializable(ARG_SELECTED_USERS);
            fragmentInteractionListener = (UserContract.UserFragmentInteractionListener) getArguments().getSerializable(ARG_LISTENER);
            title = getArguments().getString(ARG_TITLE);
            isSingleSelect = getArguments().getBoolean(ARG_IS_SINGLE_SELECT);
            isUpdatedTriggered = getArguments().getBoolean(ARG_IS_UPDATE_TRIGGER);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_user_list, container, false);

        init();

        return binding.getRoot();
    }

    private void init() {
        binding.list.setLayoutManager(new LinearLayoutManager(binding.getRoot().getContext()));
        userRecyclerViewAdapter = new UserRecyclerViewAdapter(users, this);
        binding.list.setAdapter(userRecyclerViewAdapter);
        if (users != null && !users.isEmpty()) {
            binding.list.setVisibility(View.VISIBLE);

        } else {
            if (isUpdatedTriggered)
                binding.noRecord.setVisibility(View.VISIBLE);
            else
                binding.loader.setVisibility(View.VISIBLE);
            binding.list.setVisibility(View.INVISIBLE);

        }
        binding.layoutHeader.headerText.setText(title);
        binding.layoutHeader.headerRoot.setVisibility(View.VISIBLE);
        binding.done.setOnClickListener(this);
        binding.search.setQueryHint("Search Name or ID");
        binding.search.setOnQueryTextListener(this);

        for (BaseItem user : selectedUsers) {
            addChip(user);
        }
    }


    @Override
    public void onDetach() {
        super.onDetach();
    }


    @Override
    public void onUserSelected(BaseItem user, int position) {
        if (!isUserAlreadyAdded(user)) {
            if (isSingleSelect && binding.chipGroup.getChildCount() < 1) {
                addChip(user);
                userRecyclerViewAdapter.removeAt(position);
            } else if (!isSingleSelect) {
                addChip(user);
                userRecyclerViewAdapter.removeAt(position);
            }
        } else {
            userRecyclerViewAdapter.removeAt(position);
        }
    }

    private boolean isUserAlreadyAdded(BaseItem newItem) {
        boolean isAlreadyAdded = false;

        for (int i = 0; i < binding.chipGroup.getChildCount(); i++) {
            View view = binding.chipGroup.getChildAt(i);
            BaseItem item = (BaseItem) view.getTag();
            if (item.getID().equals(newItem.getID())) {
                isAlreadyAdded = true;
                break;
            }
        }
        return isAlreadyAdded;
    }

    private void addChip(BaseItem user) {
        final Chip chip = new Chip(getContext());
        chip.setText(user.getName());
        chip.setChipBackgroundColor(ColorStateList.valueOf(ContextCompat.getColor(getContext(), R.color.colorAccent)));
        chip.setTextColor(getActivity().getResources().getColor(R.color.white));
        chip.setCheckable(false);
        chip.setClickable(true);
        chip.setCloseIconVisible(true);
        chip.setCloseIconTint(ColorStateList.valueOf(ContextCompat.getColor(getContext(), R.color.white)));
        chip.setTag(user);
        chip.setOnCloseIconClickListener(this);
        binding.chipGroup.addView(chip);
    }

    @Override
    public void onClick(View v) {
        if (v.equals(binding.done)) {
            List<BaseItem> users = new ArrayList<>();
            for (int i = 0; i < binding.chipGroup.getChildCount(); i++) {
                View view = binding.chipGroup.getChildAt(i);
                BaseItem user = (BaseItem) view.getTag();
                users.add(user);
            }
            fragmentInteractionListener.onCompleted(users);

            try {
                SelectUserFragment.this.dismiss();
            } catch (IllegalStateException ignored) {
                ignored.printStackTrace();
            }
        } else {
            BaseItem mUser = (BaseItem) v.getTag();
            userRecyclerViewAdapter.addUser(mUser);
            binding.chipGroup.removeView((Chip) v);
        }

    }

    @Override
    public boolean onQueryTextSubmit(String query) {
        userRecyclerViewAdapter.getFilter().filter(query);
        return false;
    }

    @Override
    public boolean onQueryTextChange(String query) {
        userRecyclerViewAdapter.getFilter().filter(query);
        return false;
    }

    public void updateDialog(List<BaseItem> users) {
        this.users = users;
        binding.loader.setVisibility(View.GONE);
        userRecyclerViewAdapter.updateData(users);
        userRecyclerViewAdapter.notifyDataSetChanged();
        if (users != null && users.isEmpty()) {
            binding.noRecord.setVisibility(View.VISIBLE);
        } else {
            binding.list.setVisibility(View.VISIBLE);
        }
    }

}
