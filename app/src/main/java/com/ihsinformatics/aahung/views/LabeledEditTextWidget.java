package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.text.InputFilter;
import android.view.LayoutInflater;
import android.view.View;

import androidx.databinding.DataBindingUtil;

import com.google.gson.Gson;
import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.BaseAttribute;
import com.ihsinformatics.aahung.databinding.WidgetLabeledEdittextBinding;

import com.ihsinformatics.aahung.model.WidgetData;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static android.text.TextUtils.isEmpty;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTES;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE_ID;
import static com.ihsinformatics.aahung.common.Keys.ATTRIBUTE_TYPE_VALUE;

public class LabeledEditTextWidget extends Widget {

    private final Integer startRange;
    private final Integer endRange;
    private Context context;
    private String question;
    private String defaultValue;
    private int inputType;
    private int length;
    private int minimumValue;
    private boolean isMandatory;
    private boolean isSingleLine = true;
    private InputFilter inputFilter;
    private String key;

    private WidgetLabeledEdittextBinding binding;
    private BaseAttribute attribute;


    private LabeledEditTextWidget(Builder builder) {
        this.context = builder.context;
        this.question = builder.question;
        this.inputType = builder.inputType;
        this.length = builder.length;
        this.minimumValue = builder.minimumValue;
        this.isMandatory = builder.isMandatory;
        this.isSingleLine = builder.isSingleLine;
        this.inputFilter = builder.inputFilter;
        this.defaultValue = builder.defaultValue;
        this.key = builder.key;
        this.attribute = builder.attribute;
        this.binding = builder.binding;
        this.startRange = builder.startRange;
        this.endRange = builder.endRange;
    }

    @Override
    public View getView() {
        return binding.getRoot();
    }


    @Override
    public WidgetData getValue() {
        WidgetData widgetData = null;
        if (key != null) {
            widgetData = new WidgetData(key, binding.editText.getText().toString());
        } else {
            JSONObject attributeType = new JSONObject();
            Map<String, Object> map = new HashMap();
            try {
                attributeType.put(ATTRIBUTE_TYPE_ID, attribute.getAttributeID());
                map.put(ATTRIBUTE_TYPE, attributeType);
                map.put(ATTRIBUTE_TYPE_VALUE, binding.editText.getText().toString());
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
        if (isEmpty(binding.editText.getText().toString())) {
            isValid = false;
            binding.hint.setError("This field is empty");
        } else if (binding.editText.getText().toString().matches("[0-9]+") && (startRange != null) && (endRange != null)) {
            Integer value = Integer.valueOf(binding.editText.getText().toString());
            if (!(value >= startRange && value <= endRange)) {
                isValid = false;
                binding.hint.setError("Please enter value between " + startRange + " - " + endRange);
            } else {
                binding.hint.setError(null);
            }
        } else if (binding.editText.getText().toString().length() < this.minimumValue) {
            isValid = false;
            binding.hint.setError("Please enter more than two characters");
        } else {
            binding.hint.setError(null);
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
        //FIXME will be implement on EDitTextChange Requirement
    }

    @Override
    public Widget addHeader(String headerText) {
        binding.layoutHeader.headerText.setText(headerText);
        binding.layoutHeader.headerRoot.setVisibility(View.VISIBLE);
        return this;
    }


    public static class Builder {
        private BaseAttribute attribute;
        private Context context;
        private String question;
        private String defaultValue;
        private int inputType;
        private int length;
        private int minimumValue = 3;
        private boolean isMandatory;
        private boolean isSingleLine = true;
        private InputFilter inputFilter;
        private String key;
        private WidgetLabeledEdittextBinding binding;
        private int startRange;
        private int endRange;


        public Builder(Context context, final String key, String question, int inputType, int length, boolean isMandatory) {
            this.context = context;
            this.question = question;
            this.inputType = inputType;
            this.length = length;
            this.isMandatory = isMandatory;
            this.key = key;
        }

        public Builder(Context context, final BaseAttribute attribute, String question, int inputType, int length, boolean isMandatory) {
            this.context = context;
            this.question = question;
            this.inputType = inputType;
            this.length = length;
            this.isMandatory = isMandatory;
            this.attribute = attribute;
        }

        public Builder setDefaultValue(String defaultValue) {
            this.defaultValue = defaultValue;
            return this;
        }

        public Builder setSingleLine(boolean singleLine) {
            isSingleLine = singleLine;
            return this;
        }

        public Builder setInputFilter(InputFilter inputFilter) {
            this.inputFilter = inputFilter;
            return this;
        }

        public Builder setMinimumValue(int val) {
            this.minimumValue = val;
            return this;
        }


        private InputFilter[] getInputFilters() {
            List<InputFilter> filterList = new ArrayList<>();
            filterList.add(new InputFilter.LengthFilter(length));
            if (inputFilter != null)
                filterList.add(inputFilter);

            int size = filterList.size();
            return filterList.toArray(new InputFilter[size]);
        }

        public LabeledEditTextWidget build() {

            LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            binding = DataBindingUtil.inflate(inflater, R.layout.widget_labeled_edittext, null, false);

            binding.hint.setText(question);

            binding.editText.setInputType(inputType);
            InputFilter[] filters = getInputFilters();
            binding.editText.setFilters(filters);
            binding.editText.setText(defaultValue);
            binding.editText.setMaxLines(isSingleLine ? 1 : 4);

            return new LabeledEditTextWidget(this);
        }

        public Builder setInputRange(int startRange, int endRange) {
            this.startRange = startRange;
            this.endRange = endRange;

            return this;
        }
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
