package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;

import androidx.databinding.DataBindingUtil;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.Keys;
import com.ihsinformatics.aahung.databinding.WidgetTextBinding;
import com.ihsinformatics.aahung.model.WidgetData;

public class TextWidget extends Widget {

    private Context context;
    private String key;
    private String question;
    private WidgetTextBinding binding;

    public TextWidget(Context context, String key, String question) {
        this.context = context;
        this.key = key;
        this.question = question;
        init();
    }

    private void init() {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        binding = DataBindingUtil.inflate(inflater, R.layout.widget_text, null, false);
        binding.title.setText(question);
    }

    @Override
    public View getView() {
        return binding.getRoot();
    }

    @Override
    public WidgetData getValue() {
        return new WidgetData(key,binding.text.getText());
    }

    @Override
    public boolean isValid() {
        return true;
    }

    @Override
    public boolean hasAttribute() {
        return false;
    }

    @Override
    public Widget hideView() {
        binding.getRoot().setVisibility(View.GONE);
        return this;
    }

    @Override
    public Widget showView() {
        binding.getRoot().setVisibility(View.VISIBLE);
        return this;
    }

    @Override
    public void onDataChanged(String data) {

    }

    @Override
    public Widget addHeader(String headerText) {
        binding.layoutHeader.headerText.setText(headerText);
        binding.layoutHeader.headerRoot.setVisibility(View.VISIBLE);
        return this;
    }
}
