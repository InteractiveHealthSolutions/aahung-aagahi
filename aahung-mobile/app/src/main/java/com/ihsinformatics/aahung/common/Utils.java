package com.ihsinformatics.aahung.common;

import android.content.Context;
import android.net.ConnectivityManager;

import androidx.room.TypeConverter;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;
import com.ihsinformatics.aahung.model.BaseItem;
import com.ihsinformatics.aahung.model.Project;
import com.ihsinformatics.aahung.model.metadata.Definition;
import com.ihsinformatics.aahung.model.metadata.DefinitionType;

import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Type;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class Utils {
    public static boolean isInternetAvailable(Context context) {
        final ConnectivityManager connectivityManager = ((ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE));
        if (connectivityManager != null) {
            return connectivityManager.getActiveNetworkInfo() != null && connectivityManager.getActiveNetworkInfo().isConnected();
        }
        return false;
    }

    public static String removeLastChar(String s) {
        return (s == null || s.length() == 0)
                ? null
                : (s.substring(0, s.length() - 1));
    }

    public static String getCurrentDBDate() {
        Date date = Calendar.getInstance().getTime();
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String strDate = dateFormat.format(date);
        return strDate;
    }

    public static String getDateStrFromDBDate(String dbDate) {
        String dateStr = "";

        DateFormat dbFormat = new SimpleDateFormat("yyyy-MM-dd");
        DateFormat normalFormat = new SimpleDateFormat("dd/MM/yyyy");
        try {
            Date date = dbFormat.parse(dbDate);
            dateStr = normalFormat.format(date);


        } catch (ParseException e) {
            e.printStackTrace();
        }

        return dateStr;
    }

    public static Date getTeacherMinAge() {
        Calendar instance = Calendar.getInstance();
        int year = instance.get(Calendar.YEAR) - 18;
        instance.set(Calendar.YEAR, year);
        return instance.getTime();
    }

    public static int[] convertIntegerListToArray(List<Integer> list) {
        int[] integers = new int[list.size()];
        for (int i = 0; i < integers.length; i++) {
            integers[i] = list.get(i);
        }
        return integers;
    }

    public static Date getDateFromStr(String dateStr) {
        Date date = new Date();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        try {
            date = format.parse(dateStr);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;
    }

    public static int getAgeFromDate(String dateStr) {

        Date dateOfBirth = getDateFromStr(dateStr);

        Calendar today = Calendar.getInstance();
        Calendar birthDate = Calendar.getInstance();

        int age = 0;

        birthDate.setTime(dateOfBirth);
        if (birthDate.after(today)) {
            throw new IllegalArgumentException("Can't be born in the future");
        }

        age = today.get(Calendar.YEAR) - birthDate.get(Calendar.YEAR);

        // If birth date is greater than todays date (after 2 days adjustment of leap year) then decrement age one year
        if ((birthDate.get(Calendar.DAY_OF_YEAR) - today.get(Calendar.DAY_OF_YEAR) > 3) ||
                (birthDate.get(Calendar.MONTH) > today.get(Calendar.MONTH))) {
            age--;

            // If birth date and todays date are of same month and birth day of month is greater than todays day of month then decrement age
        } else if ((birthDate.get(Calendar.MONTH) == today.get(Calendar.MONTH)) &&
                (birthDate.get(Calendar.DAY_OF_MONTH) > today.get(Calendar.DAY_OF_MONTH))) {
            age--;
        }

        return age;
    }

    public static String getEstimatedDbDOB(Integer age) {

        String dob = "";

        Calendar today = Calendar.getInstance();

        int year = today.get(Calendar.YEAR) - age;
        dob = "" + year + "-" + today.get(Calendar.MONTH) + "-" + today.get(Calendar.DAY_OF_MONTH);

        return dob;
    }

    public static String convertDateTime(String dbValue, String dbtime) {
        Date date = new Date();
        String dateStr = dbValue + " " + dbtime;
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            date = format.parse(dateStr);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        String dateValue = format.format(date);
        return dateValue;
    }

    public static String convertDateToString(Date date) {
        DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        String strDate = dateFormat.format(date);
        return strDate;
    }

    public static List<Project> getItemsFromJson(String json) {
        if (json == null) {
            return (null);
        }
        Gson gson = new Gson();
        Type type = new TypeToken<List<Project>>() {
        }.getType();
        List<Project> projects = null;
        try {
            projects = gson.fromJson(json, type);
        } catch (JsonSyntaxException exceptions) {
            exceptions.printStackTrace();
        }

        return projects;
    }

    public static List<Definition> getDefinitionFromJson(String json) {
        if (json == null) {
            return (null);
        }
        Gson gson = new Gson();
        Type type = new TypeToken<List<Definition>>() {
        }.getType();
        List<Definition> definitions = null;
        try {
            definitions = gson.fromJson(json, type);
        } catch (JsonSyntaxException exceptions) {
            exceptions.printStackTrace();
        }
        return definitions;
    }

    public static String getJsonValue(JSONObject jsonObject, String key) {
        String value = "";

        try {
            value = jsonObject.getString(key);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return value;
    }
}
