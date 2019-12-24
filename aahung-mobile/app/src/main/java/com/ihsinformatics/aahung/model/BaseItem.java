package com.ihsinformatics.aahung.model;

import java.io.Serializable;

public abstract class BaseItem implements Serializable {
    public abstract Integer getID();

    public abstract String getName();

    public abstract String getKey();

    public abstract String getShortName();

    public abstract String getUUID();

    public abstract boolean isVoided();

}
