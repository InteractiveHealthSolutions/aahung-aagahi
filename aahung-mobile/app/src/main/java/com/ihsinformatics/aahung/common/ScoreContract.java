package com.ihsinformatics.aahung.common;

import com.ihsinformatics.aahung.views.Widget;

import java.util.Map;

public interface ScoreContract {

    public interface ScoreListener {
        public void onScoreUpdate(Widget widget, Integer score);
    }

    public interface ScoreViewer {
        public void showScore(Map<Widget,Integer> scoreMap);
    }

}
