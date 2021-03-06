package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;

import androidx.databinding.DataBindingUtil;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.BaseAttribute;
import com.ihsinformatics.aahung.common.ScoreContract;
import com.ihsinformatics.aahung.databinding.WidgetScoreBinding;
import com.ihsinformatics.aahung.model.Score;
import com.ihsinformatics.aahung.model.Scores;
import com.ihsinformatics.aahung.model.WidgetData;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

public class ScoreWidget extends Widget implements ScoreContract.ScoreViewer {

    private String key;
    private String scoreText;
    private Context context;
    private String scoreKey;
    private String percentageKey;
    private WidgetScoreBinding binding;
    private BaseAttribute attribute;

    public ScoreWidget(Context context, String scoreKey, String percentageKey) {
        this.context = context;
        this.scoreKey = scoreKey;
        this.percentageKey = percentageKey;
        this.key = key;
        init();
    }

    public ScoreWidget(Context context, BaseAttribute attribute) {
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
    public void showScore(Map<Widget, Scores> scoreMap) {
        int obtainScore = 0;
        int totalScore = 0;
        double percentage = 0;

        for (Scores value : scoreMap.values()) {
            obtainScore += value.getScore();
            totalScore += value.getTotal();
        }

        if (totalScore > 0)
            percentage = (((double)obtainScore * 100) / (double)totalScore);

        binding.score.setText("" + obtainScore);
        binding.percentage.setText("" +  String.format("%.2f", percentage));
    }

    @Override
    public View getView() {
        return binding.getRoot();
    }

    @Override
    public WidgetData getValue() {
        Integer scoreValue = Integer.valueOf(binding.score.getText().toString());
        Double percentage = Double.valueOf(binding.percentage.getText().toString());
        Score score = new Score(scoreKey, scoreValue, percentageKey, percentage);
        return new WidgetData(key, score);
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
    public Widget addHeader(String headerText) {
        binding.layoutHeader.headerText.setText(headerText);
        binding.layoutHeader.headerRoot.setVisibility(View.VISIBLE);
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

    @Override
    public boolean hasAttribute() {
        return attribute != null;
    }
}
