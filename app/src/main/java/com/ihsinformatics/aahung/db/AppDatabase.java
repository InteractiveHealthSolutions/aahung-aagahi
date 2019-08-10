package com.ihsinformatics.aahung.db;

import android.content.Context;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

import com.ihsinformatics.aahung.db.dao.FormsDao;
import com.ihsinformatics.aahung.db.dao.UserDao;
import com.ihsinformatics.aahung.model.Forms;
import com.ihsinformatics.aahung.model.user.RolePrivilege;
import com.ihsinformatics.aahung.model.user.User;
import com.ihsinformatics.aahung.model.user.UserRole;

@Database(entities = {Forms.class, User.class, RolePrivilege.class, UserRole.class}, version = 1)
public abstract class AppDatabase extends RoomDatabase {

    public abstract FormsDao getFormsDao();
    public abstract UserDao getUserDao();
}
