package com.ihsinformatics.aahung.services;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.concurrent.futures.CallbackToFutureAdapter;
import androidx.work.Data;
import androidx.work.ListenableWorker;
import androidx.work.WorkerParameters;

import com.google.common.util.concurrent.ListenableFuture;
import com.ihsinformatics.aahung.App;
import com.ihsinformatics.aahung.common.ResponseCallback;
import com.ihsinformatics.aahung.db.AppDatabase;
import com.ihsinformatics.aahung.model.Forms;
import com.ihsinformatics.aahung.network.RestServices;

import org.jetbrains.annotations.NotNull;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import static com.ihsinformatics.aahung.activities.MainActivity.FORM_ID;
import static com.ihsinformatics.aahung.common.Utils.convertIntegerListToArray;

public class FormUploadWorker extends ListenableWorker {

    @Inject
    AppDatabase appDatabase;

    @Inject
    RestServices restServices;

    private static int counter = 0;


    public FormUploadWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
        ((App) context.getApplicationContext()).getComponent().inject(this);
    }

    @NonNull
    @Override
    public ListenableFuture<Result> startWork() {
        final List<Integer> failedForms = new ArrayList<>();
        final List<Forms> forms = appDatabase.getFormsDao().getAllForms();
        final int formCounts = forms.size();
        counter = 0;


        return CallbackToFutureAdapter.getFuture(new CallbackToFutureAdapter.Resolver<Result>() {
            @Nullable
            @Override
            public Object attachCompleter(@NonNull final CallbackToFutureAdapter.Completer<Result> completer) throws Exception {

                ResponseCallback.ResponseFormOffline callback = new ResponseCallback.ResponseFormOffline() {
                    @Override
                    public void onSuccess(Integer formId) {
                        appDatabase.getFormsDao().deleteForm(formId);
                        checkCompletion(formCounts, failedForms, completer);
                    }

                    @Override
                    public void onFailure(String message, Integer formId) {
                        failedForms.add(formId);
                        checkCompletion(formCounts, failedForms, completer);
                    }

                    private void checkCompletion(int counts, List<Integer> failedForms, @NonNull CallbackToFutureAdapter.Completer<Result> completer) {
                        counter++;
                        if (counts == counter) {
                            if (failedForms.size() > 0) {
                                Data data = getData(failedForms);
                                completer.set(Result.failure(data));
                            } else {
                                completer.set(Result.success());
                            }
                        }
                    }
                };


                for (Forms form : forms) {
                    JSONObject jsonObject = null;
                    try {
                        jsonObject = new JSONObject(form.getFormData());
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    final int formId = form.getFormId();
                    uploadForms(jsonObject, form.endPoint, formId, callback);
                }


                return callback;
            }

        });
    }

    @NotNull
    private Data getData(List<Integer> forms) {
        return new Data.Builder().putIntArray(FORM_ID, convertIntegerListToArray(forms)).build();
    }


    private void uploadForms(JSONObject jsonObject, String endPoint, int formId, ResponseCallback.ResponseFormOffline callback) {
        restServices.submitForm(jsonObject, endPoint, formId, callback);
    }
}
