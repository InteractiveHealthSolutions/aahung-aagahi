package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;

import com.google.android.material.button.MaterialButton;
import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.ButtonListener;

public class ButtonWidget {

    private Context context;
    private String text = "Submit";
    private View view;
    private Button button;
    private ButtonListener listener;

    public ButtonWidget(Context context, ButtonListener listener) {
        this.context = context;
        this.listener = listener;
        init();
    }

    public ButtonWidget addText(String text) {
        this.text = text;
        return this;
    }

    private void init() {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        view = inflater.inflate(R.layout.widget_button, null);
        button = view.findViewById(R.id.button);
        button.setText(text);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                listener.onSubmit();

            }
        });
    }

    public void disableButton() {
        button.setEnabled(false);
    }

    public void enableButton() {
        button.setEnabled(true);
    }

    public View getView() {
        return view;
    }


}
