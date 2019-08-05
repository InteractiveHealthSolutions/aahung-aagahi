package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;

import androidx.databinding.DataBindingUtil;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.databinding.WidgetPhoneBinding;
import com.ihsinformatics.aahung.model.WidgetData;

import static android.text.TextUtils.isEmpty;

public class PhoneWidget extends Widget {
    private Context context;
    private String question;
    private boolean isMandatory;
    private String key;
    private WidgetPhoneBinding binding;
    private String regex = "[0][3][0-9]{2}[-][0-9]{7}";


    public PhoneWidget(Context context, String key, String question, boolean isMandatory) {
        this.context = context;
        this.key = key;
        this.question = question;
        this.isMandatory = isMandatory;
        init();
    }

    private void init() {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        binding = DataBindingUtil.inflate(inflater, R.layout.widget_phone, null, false);
        binding.title.setText(question);
    }


    @Override
    public View getView() {
        return binding.getRoot();
    }

    @Override
    public WidgetData getValue() {
        String phoneNo = new StringBuilder()
                .append(binding.phoneCode.getText().toString())
                .append("-")
                .append(binding.phoneExtention.getText().toString()).toString();


        return new WidgetData(key, phoneNo);
    }

    @Override
    public boolean isValid() {
        boolean isValid = true;

        String phoneNo = new StringBuilder()
                .append(binding.phoneCode.getText().toString())
                .append("-")
                .append(binding.phoneExtention.getText().toString()).toString();

        if (isMandatory) {
            if (isEmpty(binding.phoneCode.getText().toString()) || isEmpty(binding.phoneExtention.getText().toString())) {
                binding.title.setError("This field is empty");
            } else if (!phoneNo.matches(regex)) {
                binding.title.setError("Phone number is not valid");
            } else {
                binding.title.setError(null);
            }

        }

        return isValid;
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
