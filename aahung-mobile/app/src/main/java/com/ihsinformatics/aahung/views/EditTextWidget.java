package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.text.Editable;
import android.text.InputFilter;
import android.text.InputType;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;

import androidx.databinding.DataBindingUtil;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.BaseAttribute;
import com.ihsinformatics.aahung.common.DataChangeListener;
import com.ihsinformatics.aahung.common.Keys;
import com.ihsinformatics.aahung.common.WidgetContract;
import com.ihsinformatics.aahung.common.WidgetIDListener;
import com.ihsinformatics.aahung.databinding.WidgetEdittextBinding;
import com.ihsinformatics.aahung.model.WidgetData;

import org.json.JSONArray;
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

public class EditTextWidget extends Widget implements TextWatcher, DataChangeListener.SimpleItemListener {

    public static final String EMAIL_REGEX = "^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$";
    public static final String RADIO_REGEX = "[1-9]{1}[0-9]{1,2}(\\.[0-9]{1,2})";


    private final Integer startRange;
    private final Integer endRange;
    private final boolean isDecimal;
    private final boolean isParticipantFieldsEnabled;
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
    private BaseAttribute attribute;
    private WidgetEdittextBinding binding;
    private WidgetContract.TextChangeListener textChangeListener;
    private WidgetIDListener widgetIDListener;
    private List<WidgetEdittextBinding> participantFieldList = new ArrayList<>();
    private Map<Integer, String> participantCounts = new HashMap<>();


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
        this.isDecimal = builder.isDecimal;
        this.isParticipantFieldsEnabled = builder.isParticipantFieldsEnabled;
    }

    public void setWidgetIDListener(WidgetIDListener widgetIDListener) {
        this.widgetIDListener = widgetIDListener;
    }

    @Override
    public View getView() {
        return binding.getRoot();
    }


    @Override
    public WidgetData getValue() {
        WidgetData widgetData = null;
        if (key != null) {
            if (!isParticipantFieldsEnabled)
                widgetData = new WidgetData(key, binding.editText.getText().toString());
            else {

                widgetData = new WidgetData(key, getParticipantCounts());
            }
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

    private JSONObject getParticipantCounts() {
        JSONObject base = new JSONObject();
        try {


            base.put(Keys.TRAINING_DAYS, Integer.valueOf(binding.editText.getText().toString()));

            JSONArray counts = new JSONArray();

            for (WidgetEdittextBinding edittextBinding : participantFieldList) {
                counts.put(Integer.valueOf(edittextBinding.editText.getText().toString()));
            }

            base.put(Keys.DAY_PARTICIPANT_COUNT, counts);

        } catch (JSONException e) {
            e.printStackTrace();
        }

        return base;
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
            } else if (isDecimal) {
                if (!binding.editText.getText().toString().matches(RADIO_REGEX)) {
                    binding.hint.setError("Please enter decimal number e.g 100.2");
                    isValid = false;
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

            if (isParticipantFieldsEnabled && !isValidParticipantFields()) {
                isValid = false;
            }


        } else {
            if (!isEmpty(binding.editText.getText().toString())) {
                if (binding.editText.getText().toString().matches("[0-9]+") && (startRange != null) && (endRange != null)) {
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
                    }else {
                        binding.hint.setError(null);
                    }

                }
            }
        }
        return isValid;
    }


    private boolean isValidParticipantFields() {
        boolean isValid = true;

        for (WidgetEdittextBinding binding : participantFieldList) {
            if (isEmpty(binding.editText.getText().toString())) {
                binding.editText.setError("this field is empty");
                isValid = false;
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

        if (widgetIDListener != null) {
            widgetIDListener.onWidgetChange(data, (key != null) ? key : attribute.getAttributeName());
        }

        if (isParticipantFieldsEnabled) {
            retainFieldsData();
            clearViews();
            if (!isEmpty(data)) {
                Integer days = Integer.valueOf(data);
                if (days <= endRange)
                    addParticipantCountFields(days);
            }
        }
    }

    private void clearViews() {
        binding.baselayout.removeAllViews();
        participantFieldList.clear();
    }

    private void retainFieldsData() {

        for (int i = 0; i < participantFieldList.size(); i++) {
            WidgetEdittextBinding edittextBinding = participantFieldList.get(i);
            String count = edittextBinding.editText.getText().toString();
            int day = i + 1;
            participantCounts.put(day, count);
        }

    }

    private void addParticipantCountFields(Integer days) {
        for (int i = 0; i < days; i++) {
            LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            WidgetEdittextBinding edittextBinding = DataBindingUtil.inflate(inflater, R.layout.widget_edittext, null, false);
            Integer day = i + 1;
            edittextBinding.hint.setHint("Number of Participant (Day " + day + ") *");
            edittextBinding.editText.setInputType(InputType.TYPE_CLASS_NUMBER);
            String counts = participantCounts.get(day);
            if (counts != null)
                edittextBinding.editText.setText(counts);
            binding.baselayout.addView(edittextBinding.getRoot());
            participantFieldList.add(edittextBinding);
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

    public void setText(String value) {
        binding.editText.setText(value);
        onDataChanged(value);
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
        private BaseAttribute attribute;
        private boolean isDecimal;
        private boolean isParticipantFieldsEnabled;


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

        public Builder enableDecimal() {
            isDecimal = true;
            return this;
        }

        public Builder enableParticipantCountFields() {
            isParticipantFieldsEnabled = true;
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
            String sterric = context.getResources().getString(R.string.is_mandatory);
            binding.hint.setHint(question + (isMandatory ? sterric : ""));
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

    @Override
    public Integer getAttributeTypeId() {
        return attribute.getAttributeID();
    }

    @Override
    public boolean isViewOnly() {
        return false;
    }
}
