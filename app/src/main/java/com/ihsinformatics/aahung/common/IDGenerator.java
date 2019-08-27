package com.ihsinformatics.aahung.common;

import java.util.Date;
import java.util.concurrent.TimeUnit;

public class IDGenerator {
    private static final int RADIX = 36;

    /*public static void main(final String[] args) {
        long num = 15180823112462L;
        System.out.println(encode(num));
    }*/

    public static String encode(long value) {
        return Long.toString(value, RADIX);
    }

    public static long decode(String base36String) {
        return Long.parseLong(base36String, RADIX);
    }

    public static String getEncodedID() {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(GlobalConstants.USER.getID())
                .append(getTimeInSeconds());

        long value = Long.valueOf(stringBuilder.toString());
        String encode = encode(value);

        for(int i = encode.length(); i <10;i++)
        {
            encode += "0";
        }

        return encode.toUpperCase();
    }

    private static long getTimeInSeconds()
    {
        long seconds = TimeUnit.MILLISECONDS.toSeconds(new Date().getTime());
        return seconds;
    }
}
