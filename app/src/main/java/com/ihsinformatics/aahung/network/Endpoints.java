package com.ihsinformatics.aahung.network;

public class Endpoints {
    public static final String USER = "users/name/{name}";
    public static final String LOCATION_LIST = "location/list";
    public static final String LOCATION_SEARCH = "locations";
    public static final String LOCATION = "location/{uuid}";


    public static final String FORM_NAME = "{form_name}";
    public static final String DONOR_LIST = "donors";
    public static final String PARENT_LOCATION = "locations/category/{uuid}";
    public static final String DEFINITION_TYPES = "definitiontypes";
    public static final String DEFINITION_VIA_UUID = "definitions/definitiontype/{uuid}";
    public static final String LOCATION_ATTRIBUTE_TYPE = "locationattributetypes";
    public static final String PERSON_ATTRIBUTE_TYPE = "personattributetypes";
    public static final String PROJECTS = "projects";
    public static final String SCHOOLS = "locations/category/{uuid}";
    public static final String SCHOOL_BY_SHORTNAME = "location/shortname/{shortName}";
    public static final String FORM_UPDATE = "{form_name}/{uuid}";
    public static final String ELEMENTS = "elements";
    public static final String ALL_USERS = "users";
    public static final String FORM_TYPES = "formtypes";
    public static final String ROLES = "roles";
    public static final String USER_BY_ROLE = "users/role/{uuid}";
    public static final String PARTICIPANT_BY_LOCATION = "participants/location/{uuid}";
    public static final String PARTICIPANT_BY_ID = "participant/identifier/{id}";
}
