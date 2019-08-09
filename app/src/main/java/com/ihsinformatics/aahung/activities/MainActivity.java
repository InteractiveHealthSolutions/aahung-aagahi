package com.ihsinformatics.aahung.activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.databinding.DataBindingUtil;

import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import android.content.Context;
import android.os.Bundle;
import android.view.Menu;

import com.ihsinformatics.aahung.App;
import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.TabAdapter;
import com.ihsinformatics.aahung.databinding.ActivityMainBinding;
import com.ihsinformatics.aahung.fragments.form.FormContract;
import com.ihsinformatics.aahung.network.ApiService;
import com.ihsinformatics.aahung.views.FormUI;

import javax.inject.Inject;

import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

import static com.ihsinformatics.aahung.fragments.FormListFragment.FORM_TAG;

public class MainActivity extends AppCompatActivity implements FormContract.View {

    @Inject
    FormContract.Presenter presenter;

    @Inject
    ApiService Apiservice;

    private ActivityMainBinding binding;
    private TabAdapter adapter;

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
    public boolean onSupportNavigateUp() {
        return Navigation.findNavController(this, R.id.my_nav_host_fragment).navigateUp();
    }
}
