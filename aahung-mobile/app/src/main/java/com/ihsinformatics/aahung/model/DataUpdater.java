package com.ihsinformatics.aahung.model;

import android.content.Context;

import com.ihsinformatics.aahung.activities.MainActivity;
import com.ihsinformatics.aahung.common.Utils;
import com.ihsinformatics.aahung.db.dao.MetadataDao;
import com.ihsinformatics.aahung.model.metadata.Definition;
import com.ihsinformatics.aahung.model.results.AttributeResult;
import com.ihsinformatics.aahung.model.results.BaseResult;
import com.ihsinformatics.aahung.common.ResponseCallback;
import com.ihsinformatics.aahung.views.EditTextWidget;
import com.ihsinformatics.aahung.views.MultiSelectWidget;
import com.ihsinformatics.aahung.views.PhoneWidget;
import com.ihsinformatics.aahung.views.RadioWidget;
import com.ihsinformatics.aahung.views.TextWidget;
import com.ihsinformatics.aahung.views.UserWidget;
import com.ihsinformatics.aahung.views.Widget;

import java.util.ArrayList;
import java.util.List;

import static android.text.TextUtils.isEmpty;
import static com.ihsinformatics.aahung.common.Utils.removeLastChar;

public class DataUpdater implements ResponseCallback.ResponseProvider {

    public static final String DEFINITION = "DEFINITION";
    public static final String JSON = "JSON";
    private List<Widget> widgetsToUpdate = new ArrayList<>();
    private MetadataDao metadataDao;
    private Context context;

    public DataUpdater(Context context, MetadataDao metadataDao) {
        this.context = context;
        this.metadataDao = metadataDao;
    }

    public Widget add(Widget widget) {
        widgetsToUpdate.add(widget);
        return widget;
    }


    @Override
    public void onSuccess(BaseResult baseResult) {
        for (Widget widget : widgetsToUpdate) {
            String value = "";
            List<Definition> definitions = new ArrayList<>();
            List<Project> projects = new ArrayList<>();
            if (widget.hasAttribute()) {

                AttributeResult attribute = baseResult.getAttributeValue(widget.getAttributeTypeId());
                if (attribute != null) {
                    if (attribute.getAttributeType().getDataType().equals(DEFINITION)) {
                        value = metadataDao.getDefinitionById(attribute.getAttributeValue()).getDefinitionName();
                    } else if (attribute.getAttributeType().getDataType().equals(JSON)) {
                        definitions = Utils.getDefinitionFromJson(attribute.getAttributeValue());
                        if (definitions != null && !definitions.isEmpty() && definitions.get(0).getDefinitionId() != null) {
                            for (Definition definition : definitions) {
                                String definitionName = metadataDao.getDefinitionById(definition.getDefinitionId().toString()).getDefinitionName();
                                value += definitionName + ",";
                            }
                        } else {
                            projects = Utils.getItemsFromJson(attribute.getAttributeValue());

                        }
                        value = removeLastChar(value);

                    } else {
                        value = attribute.getAttributeValue();
                    }
                }
            } else {
                value = baseResult.getValue(widget.getValue().getParam());
            }


            if (widget instanceof TextWidget && !isEmpty(value)) {
                TextWidget textWidget = (TextWidget) widget;
                textWidget.setText(value);
                textWidget.showView();
            } else if (widget instanceof MultiSelectWidget) {
                MultiSelectWidget multiSelectWidget = (MultiSelectWidget) widget;
                if (definitions != null && definitions.isEmpty()) {
                    for (Definition definition : definitions) {
                        String definitionName = metadataDao.getDefinitionById(definition.getDefinitionId().toString()).getDefinitionName();
                        multiSelectWidget.setItemStatus(definitionName, true);
                    }
                } else if (!isEmpty(value)) {
                    multiSelectWidget.setItemStatus(value, true);
                }
                multiSelectWidget.showView();
            } else if (widget instanceof RadioWidget && !isEmpty(value)) {
                RadioWidget radioWidget = (RadioWidget) widget;
                radioWidget.onItemChange(value);
                radioWidget.showView();
            } else if (widget instanceof EditTextWidget && !isEmpty(value)) {
                EditTextWidget editTextWidget = (EditTextWidget) widget;
                editTextWidget.setText(value);
                editTextWidget.showView();
            } else if (widget instanceof PhoneWidget && !isEmpty(value)) {
                PhoneWidget phoneWidget = (PhoneWidget) widget;
                phoneWidget.setText(value);
                phoneWidget.showView();
            } else if (widget instanceof UserWidget) {
                UserWidget userWidget = (UserWidget) widget;
                if (projects != null && !projects.isEmpty()) {
                    userWidget.setValues(projects);
                    userWidget.showView();
                }
            }
        }
    }

    @Override
    public void onFailure(String message) {
        ((MainActivity) context).onBackPressed();
    }
}
