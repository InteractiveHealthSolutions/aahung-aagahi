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
import com.ihsinformatics.aahung.fragments.login.LoginContract;
import com.ihsinformatics.aahung.network.ApiService;

import javax.inject.Inject;

import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class LoginActivity extends AppCompatActivity implements LoginContract.View {

    @Inject
    SharedPreferences preferences;

    @Inject
    ApiService apiService;

    @Inject
    LoginContract.Presenter presenter;

    @Inject
    UserDao userDao;

    ActivityLoginBinding binding;

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
    }

    @Override
    public void showToast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    public void onLoginButtonClicked(View view) {
        presenter.login(binding.username.getText().toString(), binding.password.getText().toString());
    }

    @Override
    public void startMainActivity() {
        startActivity(new Intent(LoginActivity.this, MainActivity.class));
    }
}
