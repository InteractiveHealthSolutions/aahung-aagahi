package com.ihsinformatics.aahung.common;

import com.ihsinformatics.aahung.model.Scores;
import com.ihsinformatics.aahung.views.Widget;

import java.util.Map;

public interface ScoreContract {

    public interface ScoreListener {
        public void onScoreUpdate(Widget widget, Integer score,Integer totalScore);
    }

    public interface ScoreViewer {
        public void showScore(Map<Widget, Scores> scoreMap);
    }

}
