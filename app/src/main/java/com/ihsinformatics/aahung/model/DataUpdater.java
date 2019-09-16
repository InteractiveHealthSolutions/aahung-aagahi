package com.ihsinformatics.aahung.model;

import android.content.Context;

import com.google.gson.Gson;
import com.ihsinformatics.aahung.activities.MainActivity;
import com.ihsinformatics.aahung.common.Utils;
import com.ihsinformatics.aahung.db.dao.MetadataDao;
import com.ihsinformatics.aahung.model.metadata.Definition;
import com.ihsinformatics.aahung.model.results.AttributeResult;
import com.ihsinformatics.aahung.model.results.BaseResult;
import com.ihsinformatics.aahung.common.ResponseCallback;
import com.ihsinformatics.aahung.views.TextWidget;
import com.ihsinformatics.aahung.views.Widget;

import java.util.ArrayList;
import java.util.List;

import static android.text.TextUtils.isEmpty;

public class DataUpdater implements ResponseCallback.ResponseProvider {

    public static final String DEFINITION = "DEFINITION";
    public static final String JSON = "JSON";
    private List<Widget> widgetsToUpdate = new ArrayList<>();
    private MetadataDao metadataDao;
    private Context context;

    public DataUpdater(Context context,MetadataDao metadataDao) {
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
            if (widget.hasAttribute()) {

                AttributeResult attribute = baseResult.getAttributeValue(widget.getAttributeTypeId());
                if (attribute != null) {
                    if (attribute.getAttributeType().getDataType().equals(DEFINITION)) {
                        value = metadataDao.getDefinitionById(attribute.getAttributeValue()).getDefinitionName();
                    }
                    else if (attribute.getAttributeType().getDataType().equals(JSON)) {
                        List<Definition> definitions = Utils.getDefinitionFromJson(attribute.getAttributeValue());
                        for(Definition definition : definitions)
                        {
                            String definitionName = metadataDao.getDefinitionById(definition.getDefinitionId().toString()).getDefinitionName();
                            value += definitionName + " ";
                        }

                    } else {
                        value = attribute.getAttributeValue();
                    }
                }
            } else {
                value = baseResult.getValue(widget.getValue().getParam());
            }

            if (widget instanceof TextWidget) {
                TextWidget textWidget = (TextWidget) widget;
                if (!isEmpty(value))
                    textWidget.setText(value);
            }
        }
    }

    @Override
    public void onFailure(String message) {
        ((MainActivity)context).onBackPressed();
    }
}
