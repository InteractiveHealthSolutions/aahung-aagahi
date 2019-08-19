package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.Toast;

import androidx.databinding.DataBindingUtil;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.MultiWidgetContract;
import com.ihsinformatics.aahung.common.ScoreContract;
import com.ihsinformatics.aahung.databinding.WidgetEdittextBinding;
import com.ihsinformatics.aahung.databinding.WidgetPostStatsBinding;
import com.ihsinformatics.aahung.model.ToggleWidgetData;
import com.ihsinformatics.aahung.model.WidgetData;
import com.ihsinformatics.aahung.databinding.WidgetMultiselectBinding;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import lib.kingja.switchbutton.SwitchMultiButton;

import static android.text.TextUtils.isEmpty;

public class MultiSelectWidget extends Widget implements SkipLogicProvider, CompoundButton.OnCheckedChangeListener {

    public static final int PADDING = 12;
    private Context context;
    private String question;
    private boolean isMandatory;
    private List<String> choices;
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


    public MultiSelectWidget(Context context, String key, int orientation, String question, boolean isMandatory, String... choices) {
        this.context = context;
        this.key = key;
        this.orientation = orientation;
        this.question = question;
        this.isMandatory = isMandatory;
        this.choices = Arrays.asList(choices);
        init();
    }

    private void init() {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        binding = DataBindingUtil.inflate(inflater, R.layout.widget_multiselect, null, false);
        binding.title.setText(question);
        binding.base.setOrientation(orientation);
        addChoices();
    }

    private void addChoices() {
        for (String choice : choices) {
            CheckBox checkBox = new CheckBox(context);
            checkBox.setButtonDrawable(R.drawable.custom_checkbox);
            checkBox.setPadding(PADDING, PADDING, PADDING, PADDING);
            checkBox.setText(choice);
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
        JSONArray array = new JSONArray();
        for (CheckBox checkBox : checkBoxList) {
            JSONObject jsonObject = new JSONObject();
            if (checkBox.isChecked()) {
                try {
                    jsonObject.put("name", checkBox.getText().toString());
                    if (isSocialMediaViewsEnable) {
                        jsonObject.put("stats", getStatsByName(checkBox.getText().toString()));
                    }
                    array.put(jsonObject);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

        }
        return new WidgetData(key, array);
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
                        break;
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

    private boolean validateStats(String name) {
        boolean isValid = true;

        for (WidgetPostStatsBinding binding : postBindingList) {
            if (binding.title.getText().equals(name)) {
                if (isEmpty(binding.likes.getText().toString())) {
                    binding.likes.setError("This field is empty");
                    isValid = false;
                } else if (Integer.parseInt(binding.likes.getText().toString()) == 0 || Integer.parseInt(binding.likes.getText().toString()) > 50000 ) {
                    binding.likes.setError("value should be between 0 to 50,000");
                    isValid = false;
                } else
                    binding.likes.setError(null);

                if (isEmpty(binding.comments.getText().toString())) {
                    binding.comments.setError("This field is empty");
                    isValid = false;
                } else if (Integer.parseInt(binding.comments.getText().toString()) == 0) {
                    binding.comments.setError("value should be greater then zero");
                    isValid = false;
                } else
                    binding.comments.setError(null);

                if (isEmpty(binding.share.getText().toString())) {
                    binding.share.setError("This field is empty");
                    isValid = false;
                } else if (Integer.parseInt(binding.share.getText().toString()) == 0) {
                    binding.share.setError("value should be greater then zero");
                    isValid = false;
                } else
                    binding.share.setError(null);

                if (binding.wasPostBoosted.radio.getSelectedTab() == -1) {
                    binding.wasPostBoosted.title.setError("Please select any one field");
                    isValid = false;
                } else
                    binding.wasPostBoosted.title.setError(null);

                if (isEmpty(binding.numberOfBoosts.getText().toString())) {
                    binding.numberOfBoosts.setError("This field is empty");
                    isValid = false;
                } else if (Integer.parseInt(binding.numberOfBoosts.getText().toString()) == 0) {
                    binding.numberOfBoosts.setError("value should be greater then zero");
                    isValid = false;
                } else
                    binding.numberOfBoosts.setError(null);

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
    public void onDataChanged(String data) {


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

        if (widgetMaps != null) {
            ToggleWidgetData.SkipData skipLogics = widgetMaps.get(selectedText);
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
            scoreListener.onScoreUpdate(this, count);
        }

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

    public void onItemChange(String base) {
        for (CheckBox checkBox : checkBoxList) {
            if (checkBox.getText().equals(base)) {
                checkBox.setChecked(true);
            }
        }
    }


    public void updateItems(String[] stringArray) {
        binding.base.removeAllViews();
        checkBoxList.clear();
        choices = Arrays.asList(stringArray);
        addChoices();
    }

    public void setCheckChangeListener(MultiWidgetContract.MultiSwitchListener
                                               checkChangeListener) {
        this.checkChangeListener = checkChangeListener;
    }

    public MultiSelectWidget enableSocialMediaStats() {
        isSocialMediaViewsEnable = true;
        return this;
    }

    private JSONObject getStatsByName(String name) {
        JSONObject jsonObject = new JSONObject();

        for (WidgetPostStatsBinding binding : postBindingList) {
            if (binding.title.getText().equals(name)) {
                try {
                    jsonObject.put("noOfLikes", binding.likes.getText().toString());
                    jsonObject.put("noOfComments", binding.comments.getText().toString());
                    jsonObject.put("noOfShares", binding.share.getText().toString());
                    jsonObject.put("noOfReached", binding.numberOfBoosts.getText().toString());
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }

        return jsonObject;
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

}
