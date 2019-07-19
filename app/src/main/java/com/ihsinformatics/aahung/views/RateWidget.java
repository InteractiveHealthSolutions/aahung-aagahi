package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.RadioButton;
import android.widget.RadioGroup;

import androidx.databinding.DataBindingUtil;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.ScoreContract;
import com.ihsinformatics.aahung.databinding.WidgetRateBinding;
import com.ihsinformatics.aahung.model.WidgetData;

public class RateWidget extends Widget implements RadioGroup.OnCheckedChangeListener {
    private WidgetRateBinding binding;
    private Context context;
    private String question;
    private String key;
    private boolean isMandatory;
    private ScoreContract.ScoreListener scoreListener;

    public RateWidget(Context context, String key, String question, boolean isMandatory) {
        this.context = context;
        this.question = question;
        this.key = key;
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
        return new WidgetData(key, binding.radioGroup);
    }

    @Override
    public boolean isValid() {

        boolean isValid = true;
        if (isMandatory) {
            if (getRadioGroupSelectedText(binding.radioGroup, binding.getRoot()).equals("")) {
                isValid = false;
                binding.title.setError("Please select any option");
            }
        }
        return isValid;
    }

    @Override
    protected Widget hideView() {
        binding.getRoot().setVisibility(View.GONE);
        return this;
    }

    @Override
    protected Widget showView() {
        binding.getRoot().setVisibility(View.VISIBLE);
        return this;
    }

    @Override
    protected void onDataChanged(String data) {
        Integer score = Integer.valueOf(data);
        if (scoreListener != null) {
            scoreListener.onScoreUpdate(this, score);
        }
    }

    @Override
    protected Widget addHeader(String headerText) {
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

    private String getRadioGroupTag(RadioGroup radioGroup, View root) {
        String radioButtonTag = "";

        if (!validateRadioGroupEmpty(binding.radioGroup)) {
            RadioButton button = (RadioButton) root.findViewById(radioGroup.getCheckedRadioButtonId());
            radioButtonTag = button.getTag().toString();
        }
        return radioButtonTag;
    }

    private Boolean validateRadioGroupEmpty(RadioGroup radioGroup) {
        Boolean isEmpty = false;

        if (radioGroup.getCheckedRadioButtonId() <= 0)
            isEmpty = true;

        return isEmpty;
    }

    @Override
    public void onCheckedChanged(RadioGroup radioGroup, int i) {
        onDataChanged(getRadioGroupTag(radioGroup, binding.getRoot()));
    }
}
