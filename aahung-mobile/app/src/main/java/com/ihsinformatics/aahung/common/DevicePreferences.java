package com.ihsinformatics.aahung.common;

import android.content.SharedPreferences;

import com.google.gson.Gson;
import com.ihsinformatics.aahung.model.user.User;

import javax.inject.Inject;

public class DevicePreferences {


    public static final String SERVER_KEY = "server_address";
    public static final String PORT_KEY = "port_number";
    private static final String IS_FIRST_TIME = "isFirstTime";
    public static final String USER = "user";
    public static final String REMEMBER = "IS_REMEMBER";
    SharedPreferences preferences;

    public DevicePreferences(SharedPreferences preferences) {
        this.preferences = preferences;
    }

    private void putInteger(String key, int data) {
        preferences.edit().putInt(key, data).apply();
    }

    private int getInteger(String key) {
        return preferences.getInt(key, 0);
    }

    private void putString(String key, String data) {
        preferences.edit().putString(key, data).apply();
    }

    private String getString(String key) {
        return preferences.getString(key, "");
    }

    private boolean getBoolean(String key) {
        return preferences.getBoolean(key, true);
    }


    public String getServerAddress() {
        return "http://" +
                getString(SERVER_KEY) + ":" +
                getString(PORT_KEY) + "/aahung-aagahi/api/";
    }


    public boolean isFirstTime() {
        return preferences.getBoolean(IS_FIRST_TIME, true);
    }

    public void invalidateFirstTimeFlag() {
        preferences.edit().putBoolean(IS_FIRST_TIME, false).apply();
    }

    public void saveUser(User user) {
        String json = new Gson().toJson(user);
        preferences.edit().putString(USER, json).apply();
    }

    public User getLastUser() {
        String json = preferences.getString(USER, "");
        User user = new Gson().fromJson(json, User.class);
        return user;
    }

    public void rememberUser(boolean isRemember) {
        preferences.edit().putBoolean(REMEMBER, isRemember).apply();
    }

    public boolean isUserRemembered() {
        return preferences.getBoolean(REMEMBER, false);
    }
}
