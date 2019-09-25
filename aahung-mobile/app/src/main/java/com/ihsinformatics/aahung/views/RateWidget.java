package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.RadioButton;
import android.widget.RadioGroup;

import androidx.databinding.DataBindingUtil;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.BaseAttribute;
import com.ihsinformatics.aahung.common.DataChangeListener;
import com.ihsinformatics.aahung.common.ScoreContract;
import com.ihsinformatics.aahung.databinding.WidgetRateBinding;

import com.ihsinformatics.aahung.model.WidgetData;

import java.util.List;

public class RateWidget extends Widget implements RadioGroup.OnCheckedChangeListener , DataChangeListener.SimpleItemListener{
    private WidgetRateBinding binding;
    private Context context;
    private String question;
    private String key;
    private boolean isMandatory;
    private ScoreContract.ScoreListener scoreListener;
    private BaseAttribute attribute;
    private int selectedScore = 0;

    public RateWidget(Context context, String key, String question, boolean isMandatory) {
        this.context = context;
        this.question = question;
        this.key = key;
        this.isMandatory = isMandatory;
        init();
    }

    public RateWidget(Context context, BaseAttribute attribute, String question, boolean isMandatory) {
        this.context = context;
        this.question = question;
        this.attribute = attribute;
        this.isMandatory = isMandatory;
        init();
    }

    private void init() {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        binding = DataBindingUtil.inflate(inflater, R.layout.widget_rate, null, false);
        binding.title.setText(question);
        binding.radioGroup.setOnCheckedChangeListener(this);
    }

    public Widget setScoreListener(ScoreContract.ScoreListener scoreListener) {
        this.scoreListener = scoreListener;
        return this;
    }

    @Override
    public View getView() {
        return binding.getRoot();
    }

    @Override
    public WidgetData getValue() {
        return new WidgetData(key, selectedScore);
    }

    @Override
    public boolean isValid() {

        boolean isValid = true;
        if (isMandatory) {
            if (getRadioGroupSelectedText(binding.radioGroup, binding.getRoot()).equals("")) {
                isValid = false;
                binding.title.setError("Please select any option");
            }
            else {
                binding.title.setError(null);
            }
        }
        return isValid;
    }

    @Override
    public Widget hideView() {
        binding.getRoot().setVisibility(View.GONE);
        return this;
    }

    public Widget showView() {
        binding.getRoot().setVisibility(View.VISIBLE);
        return this;
    }

    @Override
    public void onDataChanged(String data) {
        Integer score = Integer.valueOf(data);
        if (scoreListener != null) {
            scoreListener.onScoreUpdate(this, score,5);
            selectedScore = score;
        }
    }

    /*
     * message shouldnot be extended to 5 or less then 5
     * */
    public RateWidget updateRatingMessage(List<String> message) {
        for (int i = 0; i < binding.radioGroup.getChildCount(); i++) {
            RadioButton radioButton = getRadioButtonByTag("" + (i + 1), binding.getRoot());
            if (radioButton != null) {
                radioButton.setText(message.get(i));
            }
        }
        return this;
    }

    @Override
    public Widget addHeader(String headerText) {
        binding.layoutHeader.headerText.setText(headerText);
        binding.layoutHeader.headerRoot.setVisibility(View.VISIBLE);
        return this;
    }

    private String getRadioGroupSelectedText(RadioGroup radioGroup, View root) {
        String radioButtonText = "";

        if (!validateRadioGroupEmpty(binding.radioGroup)) {
            RadioButton button = (RadioButton) root.findViewById(radioGroup.getCheckedRadioButtonId());
            radioButtonText = button.getText().toString();
        }
        return radioButtonText;
    }

    private String getSelectedRadioTag(RadioGroup radioGroup, View root) {
        String radioButtonTag = "";

        if (!validateRadioGroupEmpty(binding.radioGroup)) {
            RadioButton button = (RadioButton) root.findViewById(radioGroup.getCheckedRadioButtonId());
            radioButtonTag = button.getTag().toString();
        }
        return radioButtonTag;
    }


    private RadioButton getRadioButtonByTag(String tag, View root) {
        RadioButton button = null;
        button = (RadioButton) root.findViewWithTag(tag);
        return button;
    }


    private Boolean validateRadioGroupEmpty(RadioGroup radioGroup) {
        Boolean isEmpty = false;

        if (radioGroup.getCheckedRadioButtonId() == -1)
            isEmpty = true;

        return isEmpty;
    }

    @Override
    public void onCheckedChanged(RadioGroup radioGroup, int i) {
        onDataChanged(getSelectedRadioTag(radioGroup, binding.getRoot()));
    }


    @Override
    public boolean hasAttribute() {
        return attribute != null;
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
