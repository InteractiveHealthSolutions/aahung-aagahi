package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.CheckBox;
import android.widget.CompoundButton;

import androidx.databinding.DataBindingUtil;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.MultiWidgetContract;
import com.ihsinformatics.aahung.common.ScoreCalculator;
import com.ihsinformatics.aahung.common.ScoreContract;
import com.ihsinformatics.aahung.model.RadioSwitcher;
import com.ihsinformatics.aahung.model.ToggleWidgetData;
import com.ihsinformatics.aahung.model.WidgetData;
import com.ihsinformatics.aahung.databinding.WidgetMultiselectBinding;

import org.json.JSONArray;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class MultiSelectWidget extends Widget implements SkipLogicProvider, CompoundButton.OnCheckedChangeListener {

    public static final int PADDING = 12;
    private Context context;
    private String question;
    private boolean isMandatory;
    private List<String> choices;
    private WidgetMultiselectBinding binding;
    private String key;
    private int orientation;
    private List<CheckBox> checkBoxList = new ArrayList<>();
    private Map<String, ToggleWidgetData.SkipData> widgetMaps;
    private ScoreContract.ScoreListener scoreListener;
    private MultiWidgetContract.ChangeNotifier multiSwitchListener;

    public MultiSelectWidget(Context context, String key, int orientation, String question, boolean isMandatory, String... choices) {
        this.context = context;
        this.key = key;
        this.orientation = orientation;
        this.question = question;
        this.isMandatory = isMandatory;
        this.choices = Arrays.asList(choices);
        init();
    }

    private void init() {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        binding = DataBindingUtil.inflate(inflater, R.layout.widget_multiselect, null, false);
        binding.title.setText(question);
        binding.base.setOrientation(orientation);

        for (String choice : choices) {
            CheckBox checkBox = new CheckBox(context);
            checkBox.setButtonDrawable(R.drawable.custom_checkbox);
            checkBox.setPadding(PADDING, PADDING, PADDING, PADDING);
            checkBox.setText(choice);
            checkBox.setOnCheckedChangeListener(this);
            binding.base.addView(checkBox);
            checkBoxList.add(checkBox);
        }

    }


    @Override
    public View getView() {
        return binding.getRoot();
    }


    @Override
    public WidgetData getValue() {
        JSONArray array = new JSONArray();
        for (CheckBox checkBox : checkBoxList) {
            if (checkBox.isSelected())
                array.put(checkBox.getText().toString());

        }
        return new WidgetData(key, array);
    }


    @Override
    public boolean isValid() {
        boolean isValid = true;

        if (isMandatory) {
            for (CheckBox checkBox : checkBoxList) {
                if (checkBox.isSelected()) {
                    break;
                } else {
                    isValid = false;
                }
            }

            if (!isValid) {
                binding.title.setError("Please select atleast one answer");
            }else {
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
    public void addDependentWidgets(Map<String, ToggleWidgetData.SkipData> widgetMaps) {
        this.widgetMaps = widgetMaps;
    }


    @Override
    public void onCheckedChanged(CompoundButton compoundButton, boolean isChecked) {
        String selectedText = compoundButton.getText().toString();

        if (widgetMaps != null) {
            ToggleWidgetData.SkipData skipLogics = widgetMaps.get(selectedText);
            if (skipLogics != null) {

                for (Widget widget : skipLogics.getWidgetsToToggle()) {
                    if (isChecked)
                        widget.showView();
                    else
                        widget.hideView();
                }

            }
        }

        if (multiSwitchListener != null) {
            multiSwitchListener.notifyWidget(this, selectedText, isChecked);
        }

        if (scoreListener != null) {
            int count = 0;
            for (CheckBox checkBox : checkBoxList) {
                if (checkBox.isChecked())
                    count++;

            }
            scoreListener.onScoreUpdate(this, count);
        }

    }

    public Widget setScoreListener(ScoreContract.ScoreListener scoreListener) {
        this.scoreListener = scoreListener;
        return this;
    }

    public void setMultiWidgetSwitchListener(MultiWidgetContract.ChangeNotifier multiSwitchListener) {
        this.multiSwitchListener = multiSwitchListener;
    }

    public void onItemChange(String base) {
        for (CheckBox checkBox : checkBoxList) {
            if (checkBox.getText().equals(base)) {
                checkBox.setChecked(true);
            }
        }
    }

    public void setWidgetSwitchListener(RadioSwitcher switcher) {

    }
}
