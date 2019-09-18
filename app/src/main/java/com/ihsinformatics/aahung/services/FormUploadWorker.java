package com.ihsinformatics.aahung.services;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.work.ListenableWorker;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.google.common.util.concurrent.ListenableFuture;
import com.ihsinformatics.aahung.App;
import com.ihsinformatics.aahung.common.ResponseCallback;
import com.ihsinformatics.aahung.db.AppDatabase;
import com.ihsinformatics.aahung.model.Forms;
import com.ihsinformatics.aahung.network.RestServices;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import javax.inject.Inject;

public class FormUploadWorker extends ListenableWorker {

    @Inject
    AppDatabase appDatabase;

    @Inject
    RestServices restServices;

    public FormUploadWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
        ((App) context.getApplicationContext()).getComponent().inject(this);
    }

    @NonNull
    @Override
    public ListenableFuture<Result> startWork() {
        uploadForms();
        return null;
    }



    private void uploadForms() {
        List<Forms> forms = appDatabase.getFormsDao().getAllForms();
        for (Forms form : forms) {
            JSONObject jsonObject = null;
            try {
                jsonObject = new JSONObject(form.getFormData());
            } catch (JSONException e) {
                e.printStackTrace();
            }
            final int formId = form.getFormId();
            restServices.submitForm(jsonObject, form.endPoint, new ResponseCallback.ResponseForm() {
                @Override
                public void onSuccess() {
                    appDatabase.getFormsDao().deleteForm(formId);
                }

                @Override
                public void onFailure(String message) {
                    //TODO show something
                }
            });

        }
    }
}
