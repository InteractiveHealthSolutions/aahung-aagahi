package com.ihsinformatics.aahung.model;

public class ParticipantScores {

    private String preScore;
    private String postScore;
    private String postScorePerc;
    private String preScorePerc;

    public ParticipantScores(String preScore, String postScore, String postScorePerc, String preScorePerc) {
        this.preScore = preScore;
        this.postScore = postScore;
        this.postScorePerc = postScorePerc;
        this.preScorePerc = preScorePerc;
    }

    public String getPreScore() {
        return preScore;
    }

    public void setPreScore(String preScore) {
        this.preScore = preScore;
    }

    public String getPostScore() {
        return postScore;
    }

    public void setPostScore(String postScore) {
        this.postScore = postScore;
    }

    public String getPostScorePerc() {
        return postScorePerc;
    }

    public void setPostScorePerc(String postScorePerc) {
        this.postScorePerc = postScorePerc;
    }

    public String getPreScorePerc() {
        return preScorePerc;
    }

    public void setPreScorePerc(String preScorePerc) {
        this.preScorePerc = preScorePerc;
    }
}
