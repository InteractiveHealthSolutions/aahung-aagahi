package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;

import androidx.databinding.DataBindingUtil;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.ScoreContract;
import com.ihsinformatics.aahung.databinding.WidgetScoreBinding;
import com.ihsinformatics.aahung.model.Attribute;
import com.ihsinformatics.aahung.model.WidgetData;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

public class ScoreWidget extends Widget implements ScoreContract.ScoreViewer {

    private String key;
    private String scoreText;
    private Context context;
    private WidgetScoreBinding binding;
    private Attribute attribute;

    public ScoreWidget(Context context, String key) {
        this.context = context;
        this.key = key;
        init();
    }

    public ScoreWidget(Context context, Attribute attribute) {
        this.context = context;
        this.attribute = attribute;
        init();
    }

    public ScoreWidget setLabel(String scoreLabel, String percentageLabel) {
        binding.scoreLabel.setText(scoreLabel);
        binding.percentageLabel.setText(percentageLabel);
        return this;
    }

    private void init() {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        binding = DataBindingUtil.inflate(inflater, R.layout.widget_score, null, false);
    }

    @Override
    public void showScore(Map<Widget, Integer> scoreMap) {
        int obtainScore = 0;
        int totalScore = 0;

        for (Widget widget : scoreMap.keySet()) {
            if (widget instanceof RateWidget) {
                totalScore += 5;
            }

            if (widget instanceof RadioWidget) {
                totalScore += 1;
            }

            if (widget instanceof MultiSelectWidget) {
                totalScore += 8; //FIXME shouldn't be hardcoded
            }
        }

        for (Integer value : scoreMap.values()) {
            obtainScore += value;
        }

        int percentage = ((obtainScore * 100) / totalScore);

        binding.score.setText("" + obtainScore);
        binding.percentage.setText("" + percentage);
    }

    @Override
    public View getView() {
        return binding.getRoot();
    }

    @Override
    public WidgetData getValue() {
        JSONObject object = new JSONObject();
        try {
            object.put("score", binding.score.getText().toString());
            object.put("percentage", binding.percentage.getText().toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return new WidgetData(key, object);
    }

    @Override
    public boolean isValid() {
        return true; // no need to validate for now
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

    }

    @Override
    public Widget addHeader(String headerText) {
        binding.layoutHeader.headerText.setText(headerText);
        binding.layoutHeader.headerRoot.setVisibility(View.VISIBLE);
        return this;
    }

    @Override
    public boolean hasAttribute() {
        return attribute != null;
    }
}
