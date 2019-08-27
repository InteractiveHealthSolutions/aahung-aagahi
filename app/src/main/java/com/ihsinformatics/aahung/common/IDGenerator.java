package com.ihsinformatics.aahung.common;

import java.util.Date;

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
                .append(new Date().getTime());
        long value = Long.valueOf(stringBuilder.toString());
        return encode(value);
    }
}
