package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.content.res.ColorStateList;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Toast;

import androidx.core.content.ContextCompat;
import androidx.databinding.DataBindingUtil;

import com.google.android.material.chip.Chip;
import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.activities.MainActivity;
import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.common.ItemAddListener;
import com.ihsinformatics.aahung.common.BaseAttribute;
import com.ihsinformatics.aahung.common.ResponseCallback;
import com.ihsinformatics.aahung.common.UserContract;
import com.ihsinformatics.aahung.common.WidgetIDListener;
import com.ihsinformatics.aahung.databinding.WidgetParticipantsBinding;
import com.ihsinformatics.aahung.databinding.WidgetUserBinding;
import com.ihsinformatics.aahung.fragments.SelectUserFragment;
import com.ihsinformatics.aahung.model.BaseItem;
import com.ihsinformatics.aahung.model.WidgetData;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTES;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE_ID;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE_VALUE;
import static com.ihsinformatics.aahung.common.Utils.removeLastChar;

public class UserWidget extends Widget implements UserContract.UserFragmentInteractionListener, ResponseCallback {
    public static final String USER_TAG = "UserTag";
    private transient Context context;
    private String childKey;
    private transient WidgetUserBinding binding;
    private List<WidgetParticipantsBinding> participantsBindingList = new ArrayList<>();
    private String key;
    private String question;
    private List<BaseItem> users;
    private boolean isMandatory = true;
    private List<BaseItem> selectedUser = new ArrayList<>();
    private boolean isParticipants = false;
    private BaseAttribute attribute;
    private boolean isSingleSelect;
    private WidgetIDListener widgetIDListener;
    private ItemAddListener.SingleItemListener singleItemListener;
    private ItemAddListener.ListItemListener listItemListener;
    private boolean isStringJson = false;
    private DataProvider.FormSection formCategory;

    public UserWidget(Context context, String key, String question, List<? extends BaseItem> users) {
        this.context = context;
        this.key = key;
        this.question = question;
        this.users = (List<BaseItem>) users;
        init();
    }

    public UserWidget(Context context, BaseAttribute attribute, String question, boolean isMandatory) {
        this.context = context;
        this.attribute = attribute;
        this.question = question;
        this.isMandatory = isMandatory;
        init();
    }

    public UserWidget(Context context, String key, String childKey, String question) {
        this.context = context;
        this.childKey = childKey;
        this.key = key;
        this.question = question;
        init();
    }

    public UserWidget(Context context, String key, String question, List<? extends BaseItem> users, boolean isMandatory) {
        this.context = context;
        this.key = key;
        this.question = question;
        this.users = (List<BaseItem>) users;
        this.isMandatory = isMandatory;
        init();
    }

    public UserWidget enableSingleSelect() {
        isSingleSelect = true;
        return this;
    }


    public UserWidget enableParticipants(DataProvider.FormSection formCategory) {
        this.formCategory = formCategory;
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

        SelectUserFragment selectUserFragment = SelectUserFragment.newInstance(users, selectedUser, question, isSingleSelect, this);
        selectUserFragment.show(((MainActivity) context).getSupportFragmentManager(), USER_TAG);
    }

    @Override
    public View getView() {
        return binding.getRoot();
    }

    @Override
    public WidgetData getValue() {


        WidgetData widgetData = null;

        if (isSingleSelect) {
            if (key != null) {
                if (childKey != null) {
                    JSONObject jsonObject = new JSONObject();
                    try {
                        jsonObject.put(childKey, selectedUser.get(0).getID());
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    widgetData = new WidgetData(key, (isStringJson) ? jsonObject.toString() : jsonObject);
                } else {
                    widgetData = new WidgetData(key, selectedUser.get(0).getID());
                }
            }


        } else {
            if (key != null) {
                JSONArray jsonArray = new JSONArray();
                JSONObject jsonObject = new JSONObject();
                for (BaseItem baseModel : selectedUser) {

                    try {
                        if (isParticipants) {
                            jsonObject.put("participant_name", getScoresByName(baseModel));
                        } else {
                            Map<String, Object> objectMap = new HashMap<>();
                            objectMap.put(baseModel.getKey(), baseModel.getID());
                            jsonObject = new JSONObject(objectMap);
                        }

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                    jsonArray.put(jsonObject);
                }

                widgetData = new WidgetData(key, isStringJson ? jsonArray.toString() : jsonArray);
            } else if (attribute != null) {
                String value = "";
                for (BaseItem baseModel : selectedUser) {
                    value += baseModel.getID() + ",";
                }

                JSONObject attributeType = new JSONObject();
                Map<String, Object> map = new HashMap();
                try {
                    attributeType.put(ATTRIBUTE_TYPE_ID, attribute.getAttributeID());
                    map.put(ATTRIBUTE_TYPE, attributeType);
                    map.put(ATTRIBUTE_TYPE_VALUE, (removeLastChar(value)));
                    widgetData = new WidgetData(ATTRIBUTES, new JSONObject(map));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        return widgetData;
    }

    private JSONObject getScoresByName(BaseItem baseItem) {
        JSONObject jsonObject = new JSONObject();

        for (WidgetParticipantsBinding binding : participantsBindingList) {
            if (binding.title.getText().equals(baseItem.getName())) {
                try {
                    jsonObject.put("location_id", formCategory.equals(DataProvider.FormSection.LSE) ? GlobalConstants.selectedSchool.getID() : GlobalConstants.selectedInstitute.getID());
                    jsonObject.put("participant_id", baseItem.getID());
                    jsonObject.put("pre_test_score", binding.preScore.getText().toString());
                    jsonObject.put("post_test_score", binding.postScore.getText().toString());
                    jsonObject.put("pre_test_score_pct", binding.prePercentage.getText().toString());
                    jsonObject.put("post_test_score_pct", binding.postPercentage.getText().toString());
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
        if (isMandatory) {
            if (selectedUser.isEmpty()) {
                isValid = false;
                binding.title.setError("Please add atleast one person");
            } else {
                binding.title.setError(null);
            }
        } else {

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

        if (isSingleSelect && widgetIDListener != null) {
            widgetIDListener.onWidgetChange(users.size() > 0 ? users.get(0).getShortName() : "", key != null ? key : attribute.getAttributeName(), true);
        }

        if (isSingleSelect && singleItemListener != null) {
            if (users.size() > 0)
                singleItemListener.onItemAdded(users.get(0).getShortName());
        } else if (!isSingleSelect && listItemListener != null) {
            listItemListener.onListAdded(users);
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

    @Override
    public boolean hasAttribute() {
        return attribute != null;
    }

    @Override
    public void onSuccess(List<? extends BaseItem> items) {
        this.users = (List<BaseItem>) items;
    }

    @Override
    public void onFailure(String message) {
        if (!isParticipants) {
            Toast.makeText(context, message, Toast.LENGTH_SHORT).show();
            ((MainActivity) context).onBackPressed();
        }
    }

    public void setWidgetIDListener(WidgetIDListener widgetIDListener) {
        this.widgetIDListener = widgetIDListener;
    }

    public void setSingleItemListener(ItemAddListener.SingleItemListener itemAddListener) {
        this.singleItemListener = itemAddListener;
    }

    public UserWidget enableStringJson() {
        isStringJson = true;
        return this;
    }

    @Override
    public Integer getAttributeTypeId() {
        return attribute.getAttributeID();
    }

    @Override
    public boolean isViewOnly() {
        return false;
    }


    public void setListItemListener(ItemAddListener.ListItemListener listItemListener) {
        this.listItemListener = listItemListener;
    }
}