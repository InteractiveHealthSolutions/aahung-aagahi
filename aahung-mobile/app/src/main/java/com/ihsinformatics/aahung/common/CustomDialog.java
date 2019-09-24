package com.ihsinformatics.aahung.common;

import android.app.Activity;
import android.widget.LinearLayout;


import com.ihsinformatics.aahung.R;

import umairayub.madialog.MaDialog;
import umairayub.madialog.MaDialogListener;

public class CustomDialog {


/*    public void showDialog(Activity context, String title, String text, int resourceId, final DialogCallbacks callbacks) {
        new MaDialog.Builder(context)
                .setTitle(title)
                .setMessage(text)
                .setImage(resourceId)
                .setPositiveButtonText("Yes")
                .setNegativeButtonText("cancel")
                .setButtonOrientation(LinearLayout.HORIZONTAL)
                .setPositiveButtonListener(new MaDialogListener() {
                    @Override
                    public void onClick() {
                        callbacks.onPositiveButtonClicked();
                    }
                })
                .setNegativeButtonListener(new MaDialogListener() {
                    @Override
                    public void onClick() {

                    }
                })
                .build();

    }*/

    public void showDiscardDialog(Activity context, String title, String text, int resourceId, final DialogCallbacks callbacks) {
        new MaDialog.Builder(context)
                .setTitle(title)
                .setMessage(text)
                .setImage(resourceId)
                .setButtonOrientation(LinearLayout.HORIZONTAL)
                .AddNewButton(R.style.AppTheme_Button_Colored, "No, Discard these forms", new MaDialogListener() {
                    @Override
                    public void onClick() {
                        callbacks.onDiscarButtonClicked();
                    }
                })
                .AddNewButton(R.style.AppTheme_Button_Colored, "Yes", new MaDialogListener() {
                    @Override
                    public void onClick() {
                        callbacks.onPositiveButtonClicked();
                    }
                })
                .AddNewButton(R.style.AppTheme_Button_Colored, "Cancel", new MaDialogListener() {
                    @Override
                    public void onClick() {
                    }
                })

                .build();

    }


    public interface DialogCallbacks {
        public void onPositiveButtonClicked();

        public void onDiscarButtonClicked();
    }
}
