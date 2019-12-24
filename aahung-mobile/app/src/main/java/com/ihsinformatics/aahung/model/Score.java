package com.ihsinformatics.aahung.model;

public class Score {
    Integer score;
    Double percentage;
    String scoreKey;
    String percentageKey;


    public Score(String scoreKey,Integer score,String percentageKey, Double percentage) {
        this.scoreKey = scoreKey;
        this.score = score;
        this.percentageKey = percentageKey;
        this.percentage = percentage;
    }

    public Integer getScore() {
        return score;
    }

    public Double getPercentage() {
        return percentage;
    }

    public String getScoreKey() {
        return scoreKey;
    }

    public String getPercentageKey() {
        return percentageKey;
    }
}
