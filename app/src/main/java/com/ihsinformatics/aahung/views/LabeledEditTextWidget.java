package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.text.InputFilter;
import android.view.LayoutInflater;
import android.view.View;

import androidx.databinding.DataBindingUtil;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.databinding.WidgetLabeledEdittextBinding;
import com.ihsinformatics.aahung.model.WidgetData;

import java.util.ArrayList;
import java.util.List;

import static android.text.TextUtils.isEmpty;

public class LabeledEditTextWidget extends Widget {

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


    private LabeledEditTextWidget(Builder builder) {
        this.context = builder.context;
        this.question = builder.question;
        this.inputType = builder.inputType;
        this.length = builder.length;
        this.minimumValue=builder.minimumValue;
        this.isMandatory = builder.isMandatory;
        this.isSingleLine = builder.isSingleLine;
        this.inputFilter = builder.inputFilter;
        this.defaultValue = builder.defaultValue;
        this.key = builder.key;
        this.binding = builder.binding;
    }

    @Override
    public View getView() {
        return binding.getRoot();
    }


    @Override
    public WidgetData getValue() {
        return new WidgetData(key, binding.editText.getText().toString());
    }

    @Override
    public boolean isValid() {
        boolean isValid = true;
        if (isEmpty(binding.editText.getText().toString())) {
            isValid = false;
            binding.hint.setError("This field is empty");
        }else if(binding.editText.getText().toString().length()<this.minimumValue)
        {
            isValid = false;
            binding.hint.setError("Please enter more than two characters");
        }else {
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
        private Context context;
        private String question;
        private String defaultValue;
        private int inputType;
        private int length;
        private  int minimumValue=3;
        private boolean isMandatory;
        private boolean isSingleLine = true;
        private InputFilter inputFilter;
        private String key;
        private WidgetLabeledEdittextBinding binding;


        public Builder(Context context, final String key, String question, int inputType, int length, boolean isMandatory) {
            this.context = context;
            this.question = question;
            this.inputType = inputType;
            this.length = length;
            this.isMandatory = isMandatory;
            this.key = key;
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

        public Builder setMinimumValue(int val)
        {
            this.minimumValue=val;
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
            binding = DataBindingUtil.inflate(inflater,R.layout.widget_labeled_edittext, null,false);

            binding.hint.setText(question);

            binding.editText.setInputType(inputType);
            InputFilter[] filters = getInputFilters();
            binding.editText.setFilters(filters);
            binding.editText.setText(defaultValue);
            binding.editText.setMaxLines(isSingleLine ? 1 : 4);

            return new LabeledEditTextWidget(this);
        }


    }
}
