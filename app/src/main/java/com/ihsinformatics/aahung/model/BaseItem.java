package com.ihsinformatics.aahung.model;

import java.io.Serializable;

public interface BaseItem extends Serializable {
    public Integer getID();
    public String getName();
    public String getType();

}
