package com.ihsinformatics.aahung.common;

import android.content.SharedPreferences;

import javax.inject.Inject;

public class DevicePreferences {


    public static final String SERVER_KEY = "server_address";
    public static final String PORT_KEY = "port_number";
    SharedPreferences preferences;

    @Inject
    public DevicePreferences(SharedPreferences preferences) {
        this.preferences = preferences;
    }

    public void putInteger(String key, int data) {
        preferences.edit().putInt(key, data).apply();
    }

    public int getInteger(String key) {
        return preferences.getInt(key, 0);
    }

    public void putString(String key, String data) {
        preferences.edit().putString(key, data).apply();
    }

    public String getString(String key) {
        return preferences.getString(key, "");
    }

    public String getServerAddress() {
        return "http://" +
                getString(SERVER_KEY) + ":" +
                getString(PORT_KEY) + "/aahung-aagahi/api/";
    }
}
