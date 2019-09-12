package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;

import androidx.databinding.DataBindingUtil;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.BaseAttribute;
import com.ihsinformatics.aahung.databinding.WidgetPhoneBinding;
import com.ihsinformatics.aahung.model.Attribute;
import com.ihsinformatics.aahung.model.WidgetData;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import static android.text.TextUtils.isEmpty;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTES;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE_ID;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE_VALUE;

public class PhoneWidget extends Widget {
    private Context context;
    private String question;
    private boolean isMandatory;
    private String key;
    private WidgetPhoneBinding binding;
    private String regex = "[0][3][0-9]{2}[-][0-9]{7}";
    private BaseAttribute attribute;


    public PhoneWidget(Context context, String key, String question, boolean isMandatory) {
        this.context = context;
        this.key = key;
        this.question = question;
        this.isMandatory = isMandatory;
        init();
    }

    public PhoneWidget(Context context, BaseAttribute attribute, String question, boolean isMandatory) {
        this.context = context;
        this.attribute = attribute;
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
        WidgetData widgetData = null;
        String phoneNo = new StringBuilder()
                .append(binding.phoneCode.getText().toString())
                .append("-")
                .append(binding.phoneExtention.getText().toString()).toString();


        if (key != null) {
            widgetData = new WidgetData(key, phoneNo);
        } else {
            JSONObject attributeType = new JSONObject();
            Map<String, Object> map = new HashMap();
            try {
                attributeType.put(ATTRIBUTE_TYPE_ID, attribute.getAttributeID());
                map.put(ATTRIBUTE_TYPE, attributeType);
                map.put(ATTRIBUTE_TYPE_VALUE, phoneNo);
                widgetData = new WidgetData(ATTRIBUTES, new JSONObject(map));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        return widgetData;
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
                isValid = false;
            } else if (!phoneNo.matches(regex)) {
                binding.title.setError("Phone number is not valid");
                isValid = false;
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

    @Override
    public boolean hasAttribute() {
        return attribute != null;
    }

    @Override
    public Integer getAttributeTypeId() {
        return attribute.getAttributeID();
    }

    @Override
    public boolean isViewOnly() {
        return false;
    }
}
