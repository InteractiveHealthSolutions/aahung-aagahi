package com.ihsinformatics.aahung.model;

public class Scores {
    private Integer score;
    private Integer total;

    public Scores(Integer score, Integer total) {
        this.score = score;
        this.total = total;
    }

    public Integer getScore() {
        return score;
    }

    public Integer getTotal() {
        return total;
    }
}
