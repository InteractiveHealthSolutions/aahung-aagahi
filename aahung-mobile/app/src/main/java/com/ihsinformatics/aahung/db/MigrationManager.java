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

    public static final Migration MIGRATION_2_3 = new Migration(2, 3) {
        @Override
        public void migrate(SupportSQLiteDatabase database) {
            database.execSQL("ALTER TABLE location ADD COLUMN primaryContact VARCHAR");
            database.execSQL("ALTER TABLE location ADD COLUMN primaryContactPerson VARCHAR");
            database.execSQL("ALTER TABLE location ADD COLUMN email VARCHAR");
        }
    };

}
