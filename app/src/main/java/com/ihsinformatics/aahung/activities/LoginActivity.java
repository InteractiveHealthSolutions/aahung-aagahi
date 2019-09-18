package com.ihsinformatics.aahung.activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.databinding.DataBindingUtil;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import com.ihsinformatics.aahung.App;
import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.databinding.ActivityLoginBinding;
import com.ihsinformatics.aahung.db.dao.UserDao;
import com.ihsinformatics.aahung.fragments.LoadingFragment;
import com.ihsinformatics.aahung.fragments.login.LoginContract;
import com.ihsinformatics.aahung.network.ApiService;

import javax.inject.Inject;

import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

import static android.text.TextUtils.isEmpty;
import static com.ihsinformatics.aahung.common.GlobalConstants.LOADING_TAG;
import static com.ihsinformatics.aahung.common.Utils.isInternetAvailable;

public class LoginActivity extends AppCompatActivity implements LoginContract.View {

    private static final String LOADING_TAG = "loading";

    @Inject
    LoginContract.Presenter presenter;


    private ActivityLoginBinding binding;

    private LoadingFragment loading;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = DataBindingUtil.setContentView(this, R.layout.activity_login);
        ((App) getApplication()).getComponent().inject(this);
        presenter.takeView(this);
        loading = new LoadingFragment();
    }

    @Override
    public void showToast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    @Override
    public void dismissLoading() {
        if (loading.isVisible())
            loading.dismiss();
    }

    public void onLoginButtonClicked(View view) {

        view.setClickable(false);
        if (isEmpty(binding.username.getText().toString()) || isEmpty(binding.username.getText().toString())) {
            Toast.makeText(this, "Username/Password is empty", Toast.LENGTH_SHORT).show();
        } else {
            if (!loading.isAdded()) {
                loading.show(getSupportFragmentManager(), LOADING_TAG);
            }
            if (isInternetAvailable(this))
                presenter.onlineLogin(binding.username.getText().toString(), binding.password.getText().toString());
            else
                presenter.offlineLogin(binding.username.getText().toString(), binding.password.getText().toString());
        }
    }



    @Override
    public void startMainActivity() {
        startActivity(new Intent(LoginActivity.this, MainActivity.class));
    }

    public void onSettingButtonClicked(View view) {
        startActivity(new Intent(LoginActivity.this, SettingsActivity.class));
    }

    public void onSyncButtonClicked(View view) {
        if (!loading.isAdded())
            loading.show(getSupportFragmentManager(), LOADING_TAG);
        presenter.syncMetadata(true);
    }

    @Override
    protected void onResume() {
        super.onResume();
        binding.loginButton.setClickable(true);

    }
}
