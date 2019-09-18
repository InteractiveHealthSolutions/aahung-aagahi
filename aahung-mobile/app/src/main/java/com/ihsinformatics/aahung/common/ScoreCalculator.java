package com.ihsinformatics.aahung.common;

import com.ihsinformatics.aahung.views.ScoreWidget;
import com.ihsinformatics.aahung.views.Widget;

import java.util.HashMap;
import java.util.Map;

public class ScoreCalculator implements ScoreContract.ScoreListener {

    private Map<Widget, Integer> widgetScore = new HashMap<>();
    private ScoreWidget scoreWidget;

    public ScoreCalculator(ScoreWidget scoreWidget) {
        this.scoreWidget = scoreWidget;
    }

    @Override
    public void onScoreUpdate(Widget widget, Integer score) {
        widgetScore.put(widget, score);
        scoreWidget.showScore(widgetScore);
    }

}
