package com.ihsinformatics.aahung.db;

import androidx.room.migration.Migration;
import androidx.sqlite.db.SupportSQLiteDatabase;

public class MigrationManager {

   public static final Migration MIGRATION_1_2 = new Migration(1, 2) {
        @Override
        public void migrate(SupportSQLiteDatabase database) {
            database.execSQL("ALTER TABLE role "
                    + " ADD COLUMN rolePrivileges VARCHAR");
        }
    };

}
