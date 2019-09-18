package com.ihsinformatics.aahung.activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.databinding.DataBindingUtil;

import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;
import androidx.work.Constraints;
import androidx.work.Data;
import androidx.work.ExistingWorkPolicy;
import androidx.work.NetworkType;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;

import android.content.Context;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;

import com.ihsinformatics.aahung.App;
import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.TabAdapter;
import com.ihsinformatics.aahung.databinding.ActivityMainBinding;
import com.ihsinformatics.aahung.db.AppDatabase;
import com.ihsinformatics.aahung.fragments.form.FormContract;
import com.ihsinformatics.aahung.model.Forms;
import com.ihsinformatics.aahung.network.ApiService;
import com.ihsinformatics.aahung.services.FormUploadWorker;
import com.ihsinformatics.aahung.views.FormUI;

import java.util.List;

import javax.inject.Inject;

import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

import static com.ihsinformatics.aahung.common.Utils.isInternetAvailable;
import static com.ihsinformatics.aahung.fragments.FormListFragment.FORM_TAG;

public class MainActivity extends AppCompatActivity {

    public static final String FORMS = "forms";
    public static final String SUBMIT_TAG = "submitForm";
    private ActivityMainBinding binding;

    @Inject
    AppDatabase database;

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
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.menu_item_logout:
                finish();
                break;
            case R.id.menu_item_upload:
                uploadForms();
                break;
        }
        return super.onOptionsItemSelected(item);
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
        WorkManager.getInstance(this).enqueueUniqueWork(SUBMIT_TAG, ExistingWorkPolicy.KEEP, uploadWorkRequest);
    }

    private void showMessage(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    @Override
    public boolean onSupportNavigateUp() {
        return Navigation.findNavController(this, R.id.my_nav_host_fragment).navigateUp();
    }
}
