package com.ihsinformatics.aahung.common;

import com.ihsinformatics.aahung.model.Scores;
import com.ihsinformatics.aahung.views.ScoreWidget;
import com.ihsinformatics.aahung.views.Widget;

import java.util.HashMap;
import java.util.Map;

public class ScoreCalculator implements ScoreContract.ScoreListener {

    private Map<Widget, Scores> widgetScore = new HashMap<>();
    private ScoreWidget scoreWidget;

    public ScoreCalculator(ScoreWidget scoreWidget) {
        this.scoreWidget = scoreWidget;
    }

    @Override
    public void onScoreUpdate(Widget widget, Integer score, Integer totalScore) {
        widgetScore.put(widget, new Scores(score, totalScore));
        scoreWidget.showScore(widgetScore);
    }

}
