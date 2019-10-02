package com.ihsinformatics.aahung.activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.databinding.DataBindingUtil;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import com.ihsinformatics.aahung.App;
import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.databinding.ActivityLoginBinding;
import com.ihsinformatics.aahung.fragments.LoadingFragment;
import com.ihsinformatics.aahung.fragments.login.LoginContract;

import javax.inject.Inject;

import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

import static android.text.TextUtils.isEmpty;
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
        presenter.restoreLastSavedUsed();
        loading = new LoadingFragment();
    }

    @Override
    public void showToast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    @Override
    public void dismissLoading() {
        binding.loginButton.setClickable(true);
        if (loading.isVisible())
            loading.dismiss();
    }

    public void onLoginButtonClicked(View view) {

        view.setClickable(false);
        if (isEmpty(binding.username.getText().toString().trim()) || isEmpty(binding.password.getText().toString().trim())) {
            Toast.makeText(this, "Username/Password is empty", Toast.LENGTH_SHORT).show();
        } else {

            if (isInternetAvailable(this)) {
                if (!loading.isAdded())
                    loading.show(getSupportFragmentManager(), LOADING_TAG);
                presenter.validateUserOnline(binding.username.getText().toString(), binding.password.getText().toString(), binding.rememberMe.isChecked());
            } else
                presenter.validateUserOffine(binding.username.getText().toString(), binding.password.getText().toString(), binding.rememberMe.isChecked());
        }
    }


    @Override
    public void startMainActivity() {
        startActivity(new Intent(LoginActivity.this, MainActivity.class));
    }

    @Override
    public void autopopulateCredentials(String username, String password, boolean isRemember) {
        binding.username.setText(username);
        binding.password.setText(password);
        binding.rememberMe.setChecked(isRemember);
    }

    public void onSettingButtonClicked(View view) {
        startActivity(new Intent(LoginActivity.this, SettingsActivity.class));
    }

    public void onSyncButtonClicked(View view) {
        if (isInternetAvailable(this)) {
            if (!loading.isAdded())
                loading.show(getSupportFragmentManager(), LOADING_TAG);
            presenter.syncMetadata(true);
        }
        else {
            showToast("Internet is not available");
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        binding.loginButton.setClickable(true);

    }
}
