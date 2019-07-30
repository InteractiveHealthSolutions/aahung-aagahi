package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.content.res.ColorStateList;
import android.view.LayoutInflater;
import android.view.View;

import androidx.core.content.ContextCompat;
import androidx.databinding.DataBindingUtil;

import com.google.android.material.chip.Chip;
import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.activities.MainActivity;
import com.ihsinformatics.aahung.common.UserContract;
import com.ihsinformatics.aahung.databinding.WidgetParticipantsBinding;
import com.ihsinformatics.aahung.databinding.WidgetUserBinding;
import com.ihsinformatics.aahung.fragments.SelectUserFragment;
import com.ihsinformatics.aahung.model.User;
import com.ihsinformatics.aahung.model.WidgetData;

import java.util.ArrayList;
import java.util.List;

public class UserWidget extends Widget implements UserContract.UserFragmentInteractionListener {
    public static final String USER_TAG = "UserTag";
    private Context context;
    private WidgetUserBinding binding;
    private List<WidgetParticipantsBinding> participantsBindingList = new ArrayList<>();
    private String question;
    private List<User> users;
    private List<User> selectedUser = new ArrayList<>();
    private boolean isParticipants = false;

    public UserWidget(Context context, String question, List<User> users) {
        this.context = context;
        this.question = question;
        this.users = users;
        init();
    }

    public UserWidget enableParticipants()
    {
        this.isParticipants = true;
        return this;
    }

    private void init() {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        binding = DataBindingUtil.inflate(inflater, R.layout.widget_user, null, false);
        binding.title.setText(question);

        binding.add.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showUserDialog();
            }
        });
    }

    private void showUserDialog() {
        SelectUserFragment selectUserFragment = SelectUserFragment.newInstance(users, selectedUser, this);
        selectUserFragment.show(((MainActivity) context).getSupportFragmentManager(), USER_TAG);
    }

    @Override
    public View getView() {
        return binding.getRoot();
    }

    @Override
    public WidgetData getValue() {
        return null;
    }

    @Override
    public boolean isValid() {
        return false;
    }

    @Override
    public Widget hideView() {
        return null;
    }

    @Override
    public Widget showView() {
        return null;
    }

    @Override
    public void onDataChanged(String data) {

    }

    @Override
    public Widget addHeader(String headerText) {
        return null;
    }

    @Override
    public void onCompleted(List<User> users) {
        selectedUser = users;
        clear();
        for (User user : users) {
            addChip(user);
            if (isParticipants)
                addScores(user);

        }
    }

    private void clear() {
        binding.scoreContainer.removeAllViews();
        binding.chipGroup.removeAllViews();
        participantsBindingList.clear();
    }

    private void addScores(User user) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        WidgetParticipantsBinding participantsBinding = DataBindingUtil.inflate(inflater, R.layout.widget_participants, null, false);
        participantsBinding.title.setText(user.getName());
        binding.scoreContainer.addView(participantsBinding.getRoot());
        participantsBindingList.add(participantsBinding);
    }

    private void addChip(User user) {
        Chip chip = new Chip(context);
        chip.setText(user.getName());
        chip.setTextColor(context.getResources().getColor(R.color.white));
        chip.setCheckable(false);
        chip.setClickable(true);
        chip.setChipBackgroundColor(ColorStateList.valueOf(ContextCompat.getColor(context, R.color.colorAccent)));
        chip.setTag(user);
        binding.chipGroup.addView(chip);
    }
}
