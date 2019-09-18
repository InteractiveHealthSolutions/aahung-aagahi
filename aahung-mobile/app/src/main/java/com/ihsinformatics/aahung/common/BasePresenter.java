package com.ihsinformatics.aahung.common;

public interface BasePresenter<T> {

    public void takeView(T view);

    public void dropView();

}
