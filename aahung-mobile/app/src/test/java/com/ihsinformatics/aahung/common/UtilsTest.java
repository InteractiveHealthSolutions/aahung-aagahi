package com.ihsinformatics.aahung.common;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.ParseException;

import com.ihsinformatics.aahung.model.metadata.Definition;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.RuntimeEnvironment;
import org.robolectric.Shadows;
import org.robolectric.shadows.ShadowConnectivityManager;
import org.robolectric.shadows.ShadowNetworkInfo;

import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static com.ihsinformatics.aahung.common.Utils.convertIntegerListToArray;
import static com.ihsinformatics.aahung.common.Utils.getCurrentDBDate;
import static com.ihsinformatics.aahung.common.Utils.getDateFromDBDateStr;
import static com.ihsinformatics.aahung.common.Utils.getDefinitionFromJson;
import static com.ihsinformatics.aahung.common.Utils.isInternetAvailable;
import static com.ihsinformatics.aahung.common.Utils.removeLastChar;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.*;

@RunWith(RobolectricTestRunner.class)
public class UtilsTest {

    private ShadowConnectivityManager shadowConnectivityManager;
    private ShadowNetworkInfo shadowOfActiveNetworkInfo;


    @Before
    public void setUp() throws Exception {
        ConnectivityManager connectivityManager = (ConnectivityManager) RuntimeEnvironment.application.getSystemService(Context.CONNECTIVITY_SERVICE);
        shadowConnectivityManager = Shadows.shadowOf(connectivityManager);
        shadowOfActiveNetworkInfo = Shadows.shadowOf(connectivityManager.getActiveNetworkInfo());

    }

    @Test
    public void shouldConnectedIfInternetIsAvailable() {
        NetworkInfo networkInfo = ShadowNetworkInfo.newInstance(NetworkInfo.DetailedState.CONNECTED, ConnectivityManager.TYPE_WIFI, 0, true, true);
        shadowConnectivityManager.setActiveNetworkInfo(networkInfo);

        boolean internetAvailable = isInternetAvailable(RuntimeEnvironment.application);

        assertTrue(internetAvailable);
    }


    @Test
    public void shouldDisconnectedIfInternetIsNotAvailable() {
        NetworkInfo networkInfo = ShadowNetworkInfo.newInstance(NetworkInfo.DetailedState.DISCONNECTED, ConnectivityManager.TYPE_WIFI, 0, true, false);
        shadowConnectivityManager.setActiveNetworkInfo(networkInfo);

        boolean internetAvailable = isInternetAvailable(RuntimeEnvironment.application);

        assertFalse(internetAvailable);
    }


    @Test
    public void shouldRemoveLastChar() {
        List<String> actual = Arrays.asList("EPSON ", "epson,", "google", "Google", "Vuzix");
        List<String> expected = Arrays.asList("EPSON", "epson", "googl", "Googl", "Vuzi");

        for (int i = 0; i < actual.size(); i++) {
            String stringWithoutLastCharacter = removeLastChar(actual.get(i));
            assertEquals(expected.get(i), stringWithoutLastCharacter);
        }
    }

    @Test
    public void shouldNullOnRemovingEmptyLastChar() {
        List<String> actual = Arrays.asList(null, "");

        for (int i = 0; i < actual.size(); i++) {
            String stringWithoutLastCharacter = removeLastChar(actual.get(i));
            assertNull(stringWithoutLastCharacter);
        }
    }



    @Test
    public void shouldReturnTodaysDate() {
        int expectedOutputIfDatesAreEqual = 0;
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date expected = calendar.getTime();

        Date actual = getDateFromDBDateStr(getCurrentDBDate());

        assertThat(actual.compareTo(expected),equalTo(expectedOutputIfDatesAreEqual));
    }

    @Test
    public void shouldReturnDefinitionFromJson() {
        Integer expectedDefinitionId = 14;
        String json = "[{\"definitionId\":"+expectedDefinitionId+"}]";

        List<Definition> definitions = getDefinitionFromJson(json);

        assertNotNull(definitions);
        assertEquals(expectedDefinitionId,definitions.get(0).getDefinitionId());
    }

    @Test
    public void shouldNullDefinitionOnEmptyJson() {
        String json = "";

        List<Definition> definitions = getDefinitionFromJson(json);

        assertNull(definitions);
    }

    @Test
    public void shouldConvertIntegerListToArray() {
        int[] expected = new int[]{123,45};
        List<Integer> values = Arrays.asList(123, 45);

        int[] actual = convertIntegerListToArray(values);

        for (int i = 0; i < expected.length; i++) {
            assertEquals(expected[i],actual[i]);
        }
    }


    @Test
    public void shouldConvertDBStringIntoDate() {
        String value = "2019-10-31";
        int expectedOutputIfDatesAreEqual = 0;
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.YEAR,2019);
        calendar.set(Calendar.MONTH,10-1);
        calendar.set(Calendar.DATE,31);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date expected = calendar.getTime();

        Date actual = getDateFromDBDateStr(value);

        assertThat(actual.compareTo(expected),equalTo(expectedOutputIfDatesAreEqual));
    }

    @Test
    public void shouldNullOnInvalidDate() {
        String value = "";

        Date actual = getDateFromDBDateStr(value);

        assertNull(actual);
    }

}