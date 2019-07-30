package com.ihsinformatics.aahung.model;

import java.io.Serializable;

public class User implements Serializable {

    String userId;
    String Name;

    public User(String userId, String name) {
        this.userId = userId;
        Name = name;
    }


    public String getUserId() {
        return userId;
    }

    public String getName() {
        return Name;
    }
}
