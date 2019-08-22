package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.text.Editable;
import android.text.InputFilter;
import android.text.InputType;
import android.text.TextWatcher;
import android.text.method.DigitsKeyListener;
import android.view.LayoutInflater;
import android.view.View;

import androidx.databinding.DataBindingUtil;

import com.google.gson.Gson;
import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.WidgetContract;
import com.ihsinformatics.aahung.databinding.WidgetEdittextBinding;
import com.ihsinformatics.aahung.model.Attribute;
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

public class EditTextWidget extends Widget implements TextWatcher {

    public static final String EMAIL_REGEX = "[a-zA-Z0-9._-]+@[a-z]+\\.+[a-z]+";
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
    private Attribute attribute;
    private WidgetEdittextBinding binding;
    private WidgetContract.TextChangeListener textChangeListener;


    private EditTextWidget(Builder builder) {
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
        this.startRange = builder.startRange;
        this.endRange = builder.endRange;
        this.binding = builder.binding;
        this.attribute = builder.attribute;
        binding.editText.addTextChangedListener(this);

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
        if (isMandatory) {
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
            } else if (inputType == InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS) {
                if (!binding.editText.getText().toString().matches(EMAIL_REGEX)) {
                    isValid = false;
                    binding.hint.setError("Please enter valid email address");
                } else
                    binding.hint.setError(null);

            } else if (binding.editText.getText().toString().length() < this.minimumValue) {
                isValid = false;
                binding.hint.setError("Please enter atleast " + this.minimumValue + " characters");
            } else {
                binding.hint.setError(null);
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
        if (textChangeListener != null) {
            textChangeListener.onTextChanged(data);
        }
    }


    public void setWidgetListener(WidgetContract.TextChangeListener textChangeListener) {
        this.textChangeListener = textChangeListener;
    }

    @Override
    public Widget addHeader(String headerText) {
        binding.layoutHeader.headerText.setText(headerText);
        binding.layoutHeader.headerRoot.setVisibility(View.VISIBLE);
        return this;
    }

    @Override
    public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

    }

    @Override
    public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
        onDataChanged(charSequence.toString());
    }

    @Override
    public void afterTextChanged(Editable editable) {

    }


    public static class Builder {
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
        private WidgetEdittextBinding binding;
        private Integer startRange;
        private Integer endRange;
        private Attribute attribute;


        public Builder(Context context, final String key, String question, int inputType, int length, boolean isMandatory) {
            this.context = context;
            this.question = question;
            this.inputType = inputType;
            this.length = length;
            this.isMandatory = isMandatory;
            this.key = key;
        }

        public Builder(Context context, final Attribute attribute, String question, int inputType, int length, boolean isMandatory) {
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

        public Builder setInputRange(int start, int end) {
            startRange = start;
            endRange = end;
            return this;
        }

        public EditTextWidget build() {

            LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            binding = DataBindingUtil.inflate(inflater, R.layout.widget_edittext, null, false);

            binding.hint.setHint(question);
            binding.editText.setInputType(inputType);
            InputFilter[] filters = getInputFilters();
            binding.editText.setFilters(filters);
            binding.editText.setText(defaultValue);
            binding.editText.setMaxLines(isSingleLine ? 1 : 4);

            return new EditTextWidget(this);
        }
    }

    @Override
    public boolean hasAttribute() {
        return attribute != null;
    }
}
