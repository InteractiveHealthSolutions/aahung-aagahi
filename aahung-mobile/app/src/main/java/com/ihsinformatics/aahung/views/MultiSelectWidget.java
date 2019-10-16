package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.text.Html;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;

import androidx.databinding.DataBindingUtil;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.BaseAttribute;
import com.ihsinformatics.aahung.common.DataChangeListener;
import com.ihsinformatics.aahung.common.MultiWidgetContract;
import com.ihsinformatics.aahung.common.ScoreContract;
import com.ihsinformatics.aahung.databinding.WidgetPostStatsBinding;
import com.ihsinformatics.aahung.model.ToggleWidgetData;
import com.ihsinformatics.aahung.model.WidgetData;
import com.ihsinformatics.aahung.databinding.WidgetMultiselectBinding;
import com.ihsinformatics.aahung.model.metadata.Definition;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import lib.kingja.switchbutton.SwitchMultiButton;

import static android.text.TextUtils.isEmpty;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTES;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE_ID;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE_VALUE;

public class MultiSelectWidget extends Widget implements SkipLogicProvider, CompoundButton.OnCheckedChangeListener, DataChangeListener.StatusChangeListener {

    public static final int PADDING = 12;
    public static final String DEFINITION_ID = "definitionId";
    private BaseAttribute attribute;
    private Context context;
    private String question;
    private boolean isMandatory;
    private List<Definition> choices;
    private WidgetMultiselectBinding binding;
    private String key;
    private int orientation;
    private List<CheckBox> checkBoxList = new ArrayList<>();
    private Map<String, ToggleWidgetData.SkipData> widgetMaps;
    private ScoreContract.ScoreListener scoreListener;
    private MultiWidgetContract.ChangeNotifier multiSwitchListener;
    private MultiWidgetContract.MultiSwitchListener checkChangeListener;
    private boolean isSocialMediaViewsEnable;
    private List<WidgetPostStatsBinding> postBindingList = new ArrayList<>();


    public MultiSelectWidget(Context context, String key, int orientation, String question, List<Definition> definitions, boolean isMandatory, String... choices) {
        this.context = context;
        this.key = key;
        this.orientation = orientation;
        this.question = question;
        this.isMandatory = isMandatory;
        this.choices = definitions;
        init();
    }

    public MultiSelectWidget(Context context, String key, int orientation, String question, List<Definition> definitions, boolean isMandatory) {
        this.context = context;
        this.key = key;
        this.orientation = orientation;
        this.question = question;
        this.isMandatory = isMandatory;
        this.choices = definitions;
        init();
    }

    public MultiSelectWidget(Context context, BaseAttribute attribute, int orientation, String question, List<Definition> definitions, boolean isMandatory, String... choices) {
        this.context = context;
        this.attribute = attribute;
        this.orientation = orientation;
        this.question = question;
        this.isMandatory = isMandatory;
        this.choices = definitions;
        init();
    }

    private void init() {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        binding = DataBindingUtil.inflate(inflater, R.layout.widget_multiselect, null, false);
        String sterric = context.getResources().getString(R.string.is_mandatory);
        binding.title.setText(Html.fromHtml(question +  (isMandatory? "<font color=\"#E22214\">" + sterric + "</font>" : "")));
        binding.base.setOrientation(orientation);
        addChoices();
    }


    private void addChoices() {
        for (Definition choice : choices) {
            CheckBox checkBox = new CheckBox(context);
            checkBox.setButtonDrawable(R.drawable.custom_checkbox);
            checkBox.setPadding(PADDING, PADDING, PADDING, PADDING);
            checkBox.setText(choice.getDefinitionName());
            checkBox.setTag(choice);
            checkBox.setOnCheckedChangeListener(this);
            binding.base.addView(checkBox);
            checkBoxList.add(checkBox);
        }
    }

    @Override
    public View getView() {
        return binding.getRoot();
    }


    @Override
    public WidgetData getValue() {
        WidgetData widgetData = null;
        if (key != null) {
            JSONArray array = new JSONArray();
            JSONObject values = new JSONObject();

            for (CheckBox checkBox : checkBoxList) {
                if (checkBox.isChecked()) {
                    Definition definition = (Definition) checkBox.getTag();
                    if (isSocialMediaViewsEnable) {
                        array.put(getStatsByName(definition).toString());
                    } else
                        array.put(definition.getShortName());
                }
            }

            try {
                values.put("values", array);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            if (scoreListener != null)
                widgetData = new WidgetData(key, values.length());
            else
                widgetData = new WidgetData(key, values.toString());
        } else {
            JSONArray childJsonArray = new JSONArray();
            JSONObject attributeType = new JSONObject();
            Map<String, Object> map = new HashMap();
            try {
                attributeType.put(ATTRIBUTE_TYPE_ID, attribute.getAttributeID());
            } catch (JSONException e) {
                e.printStackTrace();
            }

            map.put(ATTRIBUTE_TYPE, attributeType);
            for (CheckBox checkBox : checkBoxList) {
                if (checkBox.isChecked()) {
                    JSONObject jsonObject = new JSONObject();
                    try {
                        Definition definition = (Definition) checkBox.getTag();
                        jsonObject.put(DEFINITION_ID, definition.getDefinitionId());
                        childJsonArray.put(jsonObject);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
            map.put(ATTRIBUTE_TYPE_VALUE, childJsonArray.toString());
            widgetData = new WidgetData(ATTRIBUTES, new JSONObject(map));

        }
        return widgetData;


    }


    @Override
    public boolean isValid() {
        boolean isValid = true;

        if (isMandatory) {
            for (CheckBox checkBox : checkBoxList) {
                if (checkBox.isChecked()) {
                    isValid = true;
                    break;
                } else {
                    isValid = false;
                }
            }

            if (isSocialMediaViewsEnable) {
                for (CheckBox checkBox : checkBoxList) {
                    if (checkBox.isChecked()) {
                        isValid = validateStats(checkBox.getText().toString());
                    }
                }
            }

            if (!isValid) {
                binding.title.setError("Please select atleast one answer");
            } else {
                binding.title.setError(null);
            }
        }


        return isValid;
    }

    @Override
    public boolean hasAttribute() {
        return attribute != null;
    }

    private boolean validateStats(String name) {
        boolean isValid = true;

        for (WidgetPostStatsBinding binding : postBindingList) {
            if (binding.title.getText().equals(name)) {
                if (isEmpty(binding.likes.getText().toString())) {
                    binding.likes.setError("This field is empty");
                    isValid = false;
                } else if (Integer.parseInt(binding.likes.getText().toString()) > 50000) {
                    binding.likes.setError("value should be between 0 to 50,000");
                    isValid = false;
                } else
                    binding.likes.setError(null);

                if (isEmpty(binding.comments.getText().toString())) {
                    binding.comments.setError("This field is empty");
                    isValid = false;
                } else
                    binding.comments.setError(null);

                if (isEmpty(binding.share.getText().toString())) {
                    binding.share.setError("This field is empty");
                    isValid = false;
                } else
                    binding.share.setError(null);

                if (isEmpty(binding.url.getText().toString()) || binding.url.getText().toString().equals("https://")) {
                    binding.url.setError("This field is empty");
                    isValid = false;
                } else
                    binding.url.setError(null);

                if (binding.wasPostBoosted.radio.getSelectedTab() == -1) {
                    binding.wasPostBoosted.title.setError("Please select any one field");
                    isValid = false;
                } else
                    binding.wasPostBoosted.title.setError(null);

                if (binding.numberOfBoosts.getVisibility() == View.VISIBLE) {
                    if (isEmpty(binding.numberOfBoosts.getText().toString())) {
                        binding.numberOfBoosts.setError("This field is empty");
                        isValid = false;
                    } else
                        binding.numberOfBoosts.setError(null);
                }
            }
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
        binding.layoutHeader.headerText.setText(headerText);
        binding.layoutHeader.headerRoot.setVisibility(View.VISIBLE);
        return this;
    }

    @Override
    public void addDependentWidgets(Map<String, ToggleWidgetData.SkipData> widgetMaps) {
        this.widgetMaps = widgetMaps;
    }


    @Override
    public void onCheckedChanged(CompoundButton compoundButton, boolean isChecked) {
        String selectedText = compoundButton.getText().toString();
        onDataChanged(selectedText, isChecked);
    }

    private void addSocialMediaViews() {
        clear();
        for (CheckBox checkBox : checkBoxList) {
            if (checkBox.isChecked()) {
                LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
                WidgetPostStatsBinding statsBinding = DataBindingUtil.inflate(inflater, R.layout.widget_post_stats, null, false);
                statsBinding.title.setText(checkBox.getText().toString());
                statsBinding.wasPostBoosted.title.setText("Was this a boosted post");
                statsBinding.wasPostBoosted.radio.setText(context.getResources().getStringArray(R.array.yesNo));
                statsBinding.wasPostBoosted.radio.setOnSwitchListener(new BoostedPostListener(statsBinding.numberOfBoosts));

                binding.postStatsContainer.addView(statsBinding.getRoot());
                postBindingList.add(statsBinding);
            }
        }
    }

    private void clear() {
        binding.postStatsContainer.removeAllViews();
        postBindingList.clear();
    }

    public Widget setScoreListener(ScoreContract.ScoreListener scoreListener) {
        this.scoreListener = scoreListener;
        return this;
    }

    public void setMultiWidgetSwitchListener(MultiWidgetContract.ChangeNotifier
                                                     multiSwitchListener) {
        this.multiSwitchListener = multiSwitchListener;
    }


    public Widget enableOption(String base) {
        for (CheckBox checkBox : checkBoxList) {
            if (checkBox.getText().equals(base)) {
                checkBox.setChecked(true);
            }
        }
        return this;
    }

    public void updateItems(List<Definition> definitions) {
        binding.base.removeAllViews();
        checkBoxList.clear();
        choices = definitions;
        addChoices();
    }

    @Override
    public Widget hideOptions(String... optionShortNames) {

        for (int i = 0; i < optionShortNames.length; i++) {
            for (int j = 0; j < binding.base.getChildCount(); j++) {
                Definition definition = (Definition) binding.base.getChildAt(j).getTag();
                if (definition.getShortName().equals(optionShortNames[i])) {
                    binding.base.getChildAt(j).setVisibility(View.GONE);
                }
            }
        }
        return this;
    }

    public void setCheckChangeListener(MultiWidgetContract.MultiSwitchListener
                                               checkChangeListener) {
        this.checkChangeListener = checkChangeListener;
    }

    public MultiSelectWidget enableSocialMediaStats() {
        isSocialMediaViewsEnable = true;
        return this;
    }

    private JSONObject getStatsByName(Definition definition) {
        JSONObject jsonObject = new JSONObject();

        for (WidgetPostStatsBinding binding : postBindingList) {
            if (binding.title.getText().equals(definition.getDefinitionName())) {
                try {
                    jsonObject.put("post_platform", definition.getShortName());
                    jsonObject.put("post_boosted", binding.wasPostBoosted.radio.getSelectedTab() == 0 ? false : true);
                    jsonObject.put("post_likes_count", binding.likes.getText().toString());
                    jsonObject.put("post_comments_count", binding.comments.getText().toString());
                    jsonObject.put("post_shares_count", binding.share.getText().toString());
                    jsonObject.put("post_boosted_count", binding.numberOfBoosts.getText().toString());
                    jsonObject.put("post_url", binding.url.getText().toString());
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }

        return jsonObject;
    }

    @Override
    public void onDataChanged(String selectedText, boolean isChecked) {
        if (widgetMaps != null) {
            ToggleWidgetData.SkipData skipLogics = widgetMaps.get(selectedText.trim());
            if (skipLogics != null) {

                for (Widget widget : skipLogics.getWidgetsToToggle()) {
                    if (isChecked)
                        widget.showView();
                    else
                        widget.hideView();
                }
            }
        }

        if (multiSwitchListener != null) {
            multiSwitchListener.notifyWidget(this, selectedText, isChecked);
        }

        if (checkChangeListener != null) {
            checkChangeListener.onCheckedChanged(checkBoxList);
        }

        if (isSocialMediaViewsEnable) {
            addSocialMediaViews();
        }

        if (scoreListener != null) {
            int count = 0;
            for (CheckBox checkBox : checkBoxList) {
                if (checkBox.isChecked())
                    count++;

            }
            scoreListener.onScoreUpdate(this, count, choices.size());
        }

    }

    public void setItemStatus(String itemText, boolean status) {
        for (CheckBox checkBox : checkBoxList) {
            if (checkBox.getText().equals(itemText)) {
                checkBox.setChecked(status);
            }
        }
    }


    private class BoostedPostListener implements SwitchMultiButton.OnSwitchListener {

        EditText noOfBoosts;

        public BoostedPostListener(EditText numberOfBoosts) {
            this.noOfBoosts = numberOfBoosts;
        }

        @Override
        public void onSwitch(int position, String tabText) {
            if (tabText.equalsIgnoreCase("yes")) {
                noOfBoosts.setVisibility(View.VISIBLE);
            } else {
                noOfBoosts.setVisibility(View.GONE);
            }
        }
    }

    @Override
    public Integer getAttributeTypeId() {
        return attribute.getAttributeID();
    }

    @Override
    public boolean isViewOnly() {
        return false;
    }


}
