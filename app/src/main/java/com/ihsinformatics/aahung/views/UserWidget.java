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
import com.ihsinformatics.aahung.model.BaseItem;
import com.ihsinformatics.aahung.model.WidgetData;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class UserWidget extends Widget implements UserContract.UserFragmentInteractionListener {
    public static final String USER_TAG = "UserTag";
    private transient Context context;
    private transient WidgetUserBinding binding;
    private List<WidgetParticipantsBinding> participantsBindingList = new ArrayList<>();
    private String key;
    private String question;
    private List<BaseItem> users;
    private List<BaseItem> selectedUser = new ArrayList<>();
    private boolean isParticipants = false;

    public UserWidget(Context context, String key, String question, List<? extends BaseItem> users) {
        this.context = context;
        this.key = key;
        this.question = question;
        this.users = (List<BaseItem>) users;
        init();
    }

    public UserWidget enableParticipants() {
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
        SelectUserFragment selectUserFragment = SelectUserFragment.newInstance(users, selectedUser, question, this);
        selectUserFragment.show(((MainActivity) context).getSupportFragmentManager(), USER_TAG);
    }

    @Override
    public View getView() {
        return binding.getRoot();
    }

    @Override
    public WidgetData getValue() {

        JSONArray jsonArray = new JSONArray();
        for (BaseItem baseModel : selectedUser) {
            JSONObject jsonObject = new JSONObject();
            try {
                jsonObject.put("id", baseModel.getID());
                jsonObject.put("name", baseModel.getName());

                if (isParticipants) {
                    jsonObject.put("scores", getScoresByName(baseModel.getName()));
                }

            } catch (JSONException e) {
                e.printStackTrace();
            }
            jsonArray.put(baseModel);
        }
        return new WidgetData(key, jsonArray);
    }

    private JSONObject getScoresByName(String name) {
        JSONObject jsonObject = new JSONObject();

        for (WidgetParticipantsBinding binding : participantsBindingList) {
            if (binding.title.getText().equals(name)) {
                try {
                    jsonObject.put("preTestScore", binding.preScore.getText().toString());
                    jsonObject.put("postTestScore", binding.postScore.getText().toString());
                    jsonObject.put("preTestPercentage", binding.prePercentage.getText().toString());
                    jsonObject.put("preTestPercentage", binding.postPercentage.getText().toString());
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }

        return jsonObject;
    }


    @Override
    public boolean isValid() {
        boolean isValid = true;
        if (selectedUser.isEmpty()) {
            isValid = false;
            binding.title.setError("Please add atleast one person");
        } else {
            binding.title.setError(null);
        }

        return isValid;
    }

    @Override
    public Widget hideView() {
        binding.getRoot().setVisibility(View.GONE);
        return this;
    }

    @Override
    public Widget showView() {
        binding.getRoot().setVisibility(View.VISIBLE);
        return this;
    }

    @Override
    public void onDataChanged(String data) {
        //TODO
    }

    @Override
    public Widget addHeader(String headerText) {
        return null;
    }

    @Override
    public void onCompleted(List<BaseItem> users) {
        selectedUser = users;
        clear();
        for (BaseItem user : users) {
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

    private void addScores(BaseItem user) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        WidgetParticipantsBinding participantsBinding = DataBindingUtil.inflate(inflater, R.layout.widget_participants, null, false);
        participantsBinding.title.setText(user.getName());
        binding.scoreContainer.addView(participantsBinding.getRoot());
        participantsBindingList.add(participantsBinding);
    }

    private void addChip(BaseItem user) {
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
