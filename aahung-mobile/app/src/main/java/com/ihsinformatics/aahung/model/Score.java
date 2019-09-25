package com.ihsinformatics.aahung.model;

public class Score {
    Integer score;
    Integer percentage;
    String scoreKey;
    String percentageKey;


    public Score(String scoreKey,Integer score,String percentageKey, Integer percentage) {
        this.scoreKey = scoreKey;
        this.score = score;
        this.percentageKey = percentageKey;
        this.percentage = percentage;
    }

    public Integer getScore() {
        return score;
    }


    public Integer getPercentage() {
        return percentage;
    }

    public String getScoreKey() {
        return scoreKey;
    }

    public String getPercentageKey() {
        return percentageKey;
    }
}
