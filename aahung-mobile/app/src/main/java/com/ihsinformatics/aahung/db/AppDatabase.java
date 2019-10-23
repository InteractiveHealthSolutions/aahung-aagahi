package com.ihsinformatics.aahung.db;

import androidx.room.Database;
import androidx.room.RoomDatabase;
import androidx.room.TypeConverters;

import com.ihsinformatics.aahung.db.dao.FormsDao;
import com.ihsinformatics.aahung.db.dao.LocationDao;
import com.ihsinformatics.aahung.db.dao.MetadataDao;
import com.ihsinformatics.aahung.db.dao.PersonDao;
import com.ihsinformatics.aahung.db.dao.UserDao;
import com.ihsinformatics.aahung.model.Forms;
import com.ihsinformatics.aahung.model.location.Category;
import com.ihsinformatics.aahung.model.location.Location;
import com.ihsinformatics.aahung.model.metadata.Definition;
import com.ihsinformatics.aahung.model.metadata.DefinitionType;
import com.ihsinformatics.aahung.model.metadata.FormElements;
import com.ihsinformatics.aahung.model.metadata.FormType;
import com.ihsinformatics.aahung.model.metadata.LocationAttributeType;
import com.ihsinformatics.aahung.model.metadata.PersonAttributeType;
import com.ihsinformatics.aahung.model.metadata.Role;
import com.ihsinformatics.aahung.model.metadata.UserRole;
import com.ihsinformatics.aahung.model.results.AttributeResult;
import com.ihsinformatics.aahung.model.user.Participant;
import com.ihsinformatics.aahung.model.user.RolePrivilege;
import com.ihsinformatics.aahung.model.user.User;


@Database(entities = {Forms.class, User.class, Location.class, Category.class, Definition.class, DefinitionType.class, LocationAttributeType.class, PersonAttributeType.class, FormElements.class, FormType.class, Role.class, AttributeResult.class, Participant.class, UserRole.class}, version = 3)
@TypeConverters(Converters.class)
public abstract class AppDatabase extends RoomDatabase {

    public abstract FormsDao getFormsDao();

    public abstract UserDao getUserDao();

    public abstract LocationDao getLocationDao();

    public abstract MetadataDao getMetadataDao();

    public abstract PersonDao getPersonDao();

}
