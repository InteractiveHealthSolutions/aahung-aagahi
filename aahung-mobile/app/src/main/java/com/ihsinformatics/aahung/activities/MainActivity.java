package com.ihsinformatics.aahung.activities;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.databinding.DataBindingUtil;

import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.navigation.Navigation;
import androidx.work.Constraints;
import androidx.work.Data;
import androidx.work.ExistingWorkPolicy;
import androidx.work.NetworkType;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkInfo;
import androidx.work.WorkManager;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Toast;

import com.ihsinformatics.aahung.App;
import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.CustomDialog;
import com.ihsinformatics.aahung.databinding.ActivityMainBinding;
import com.ihsinformatics.aahung.db.AppDatabase;
import com.ihsinformatics.aahung.model.Forms;
import com.ihsinformatics.aahung.services.FormUploadWorker;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

import static com.ihsinformatics.aahung.common.Utils.isInternetAvailable;
import static com.ihsinformatics.aahung.fragments.FormListFragment.FORM_TAG;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    public static final String SUBMIT_TAG = "submitForm";
    public static final String FORM_ID = "FORM_ID";
    public static final int EMAIL_REQUEST_CODE = 182;
    private ActivityMainBinding binding;

    @Inject
    CustomDialog dialog;

    @Inject
    AppDatabase database;

    private List<Forms> failedForms;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = DataBindingUtil.setContentView(MainActivity.this, R.layout.activity_main);
        ((App) getApplication()).getComponent().inject(this);
        setSupportActionBar(binding.appbar.toolbar);
        binding.appbar.uploadForm.setOnClickListener(this);
        binding.appbar.logout.setOnClickListener(this);


    }

    private void updateFormBadge() {
        int size = database.getFormsDao().getAllForms().size();
        if (size > 0)
            binding.appbar.uploadForm.setBadgeValue(size);
        else
            binding.appbar.uploadForm.clearBadge();
    }

    @Override
    public void onBackPressed() {
        Fragment fragment = getSupportFragmentManager().findFragmentByTag(FORM_TAG);
        if (fragment != null) {
            getSupportFragmentManager()
                    .beginTransaction()
                    .setCustomAnimations(R.anim.md_styled_slide_up_normal, R.anim.md_styled_slide_down_normal)
                    .remove(fragment)
                    .commit();

            updateFormBadge();
        } else {
            super.onBackPressed();
        }
    }



    @Override
    protected void onResume() {
        super.onResume();
        updateFormBadge();
    }


    private void uploadForms() {
        if (isInternetAvailable(this)) {
            if (database.getFormsDao().getAllForms().size() > 0)
                showMessage("uploading offline forms...");
            else
                showMessage("Nothing to upload.");
        } else
            showMessage("Forms will be uploaded automatically as soon as internet is available");

        Constraints networkConstraint = new Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build();
        OneTimeWorkRequest uploadWorkRequest = new OneTimeWorkRequest.Builder(FormUploadWorker.class)
                .setConstraints(networkConstraint)
                .build();

        WorkManager workManager = WorkManager.getInstance(this);
        workManager.enqueueUniqueWork(SUBMIT_TAG, ExistingWorkPolicy.KEEP, uploadWorkRequest);
        workManager.getWorkInfoByIdLiveData(uploadWorkRequest.getId()).observe(this, new Observer<WorkInfo>() {

            List<Forms> failedForms = new ArrayList<>();

            @Override
            public void onChanged(WorkInfo workInfo) {
                updateFormBadge();
                if (workInfo != null) {
                    if (workInfo.getState() == WorkInfo.State.FAILED) {
                        Data outputData = workInfo.getOutputData();
                        int[] forms = outputData.getIntArray(FORM_ID);
                        if (forms != null) {
                            for (int formId : forms) {
                                Forms form = database.getFormsDao().getFormById(formId);
                                failedForms.add(form);
                            }
                        }
                    }
                    if (workInfo.getState().isFinished()) {
                        if (failedForms.size() > 0)
                            showErrorDialog(failedForms);
                    }
                }
            }
        });


    }

    private void showErrorDialog(final List<Forms> forms) {


        dialog.showDiscardDialog(this, "Oh! Something went wrong", "The form(s) you saved offline has some issues. Would you like to share the details", R.drawable.failure, new CustomDialog.DialogCallbacks() {
            @Override
            public void onPositiveButtonClicked() {
                sendDetailsOnEmail(forms);
            }

            @Override
            public void onDiscarButtonClicked() {
                deleteForms(forms);
                updateFormBadge();
            }

        });
    }

    private void deleteForms(List<Forms> forms) {
        for (Forms form : forms) {
            database.getFormsDao().deleteForm(form.getFormId());
        }
    }

    private void sendDetailsOnEmail(List<Forms> forms) {
        Intent emailIntent = new Intent(Intent.ACTION_SENDTO, Uri.fromParts(
                "mailto", "moiz.ahmed@ihsinformatics.com", null));
        emailIntent.putExtra(Intent.EXTRA_SUBJECT, "Form Error");

        String emailText = "";
        for (Forms form : forms) {
            emailText += "\n"
                    + "form type ID:" + form.getFormId() + "\n"
                    + "endpoint:" + form.getEndPoint() + "\n"
                    + "Form packet:" + form.getFormData();
        }

        emailIntent.putExtra(Intent.EXTRA_TEXT, emailText);
        startActivityForResult(Intent.createChooser(emailIntent, "Send email..."), EMAIL_REQUEST_CODE);
        failedForms = forms;
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == EMAIL_REQUEST_CODE) {
            if (failedForms != null && failedForms.size() > 0) {
                deleteForms(failedForms);
                updateFormBadge();
                failedForms.clear();
            }
        }
    }

    private void showMessage(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    @Override
    public boolean onSupportNavigateUp() {
        return Navigation.findNavController(this, R.id.my_nav_host_fragment).navigateUp();
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.upload_form:
                uploadForms();
                break;
            case R.id.logout:
                finish();
                break;

        }
    }
}
