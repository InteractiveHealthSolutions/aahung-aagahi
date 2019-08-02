package com.ihsinformatics.aahung.fragments;

import android.content.res.ColorStateList;
import android.os.Bundle;

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
import com.ihsinformatics.aahung.model.BaseModel;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;


public class SelectUserFragment extends DialogFragment implements UserContract.AdapterInteractionListener, View.OnClickListener {


    private static final String ARG_USERS = "user";
    private static final String ARG_LISTENER = "listener";
    private static final String ARG_SELECTED_USERS = "selectedUsers";
    public static final String ARG_TITLE = "title";
    private List<BaseModel> selectedUsers;
    private UserContract.UserFragmentInteractionListener fragmentInteractionListener;
    private List<BaseModel> users;
    private FragmentUserListBinding binding;
    private UserRecyclerViewAdapter userRecyclerViewAdapter;
    private String title;

    public SelectUserFragment() {
    }

    public static SelectUserFragment newInstance(List<BaseModel> users, List<BaseModel> selectedUsers, String title, UserContract.UserFragmentInteractionListener userContract) {

        SelectUserFragment fragment = new SelectUserFragment();
        Bundle args = new Bundle();
        args.putSerializable(ARG_USERS, (Serializable) users);
        args.putSerializable(ARG_SELECTED_USERS, (Serializable) selectedUsers);
        args.putString(ARG_TITLE, title);
        args.putSerializable(ARG_LISTENER, (Serializable) userContract);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setCancelable(false);
        if (getArguments() != null) {
            users = (List<BaseModel>) getArguments().getSerializable(ARG_USERS);
            selectedUsers = (List<BaseModel>) getArguments().getSerializable(ARG_SELECTED_USERS);
            fragmentInteractionListener = (UserContract.UserFragmentInteractionListener) getArguments().getSerializable(ARG_LISTENER);
            title = getArguments().getString(ARG_TITLE);
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
        binding.layoutHeader.headerText.setText(title);
        binding.layoutHeader.headerRoot.setVisibility(View.VISIBLE);
        binding.done.setOnClickListener(this);

        for (BaseModel user : selectedUsers) {
            addChip(user);
        }
    }


    @Override
    public void onDetach() {
        super.onDetach();
    }


    @Override
    public void onUserSelected(BaseModel user) {
        addChip(user);
    }

    private void addChip(BaseModel user) {
        final Chip chip = new Chip(getContext());
        chip.setText(user.getName());
        chip.setChipBackgroundColor(ColorStateList.valueOf(ContextCompat.getColor(getContext(), R.color.colorAccent)));
        chip.setTextColor(getActivity().getResources().getColor(R.color.white));
        chip.setCheckable(false);
        chip.setClickable(true);
        chip.setCloseIconVisible(true);
        chip.setTag(user);
        chip.setOnCloseIconClickListener(this);
        binding.chipGroup.addView(chip);
    }

    @Override
    public void onClick(View v) {
        if (v.equals(binding.done)) {
            List<BaseModel> users = new ArrayList<>();
            for (int i = 0; i < binding.chipGroup.getChildCount(); i++) {
                View view = binding.chipGroup.getChildAt(i);
                BaseModel user = (BaseModel) view.getTag();
                users.add(user);
            }
            fragmentInteractionListener.onCompleted(users);
            SelectUserFragment.this.dismiss();
        } else {
            BaseModel mUser = (BaseModel) v.getTag();
            userRecyclerViewAdapter.addUser(mUser);
            binding.chipGroup.removeView((Chip) v);
        }

    }
}
