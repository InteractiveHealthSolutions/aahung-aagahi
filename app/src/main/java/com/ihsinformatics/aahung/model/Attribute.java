package com.ihsinformatics.aahung.model;

import com.ihsinformatics.aahung.common.Keys;

public enum Attribute {

    partnerWith("22", Keys.PARTNER_WITH,"Partner with","integer","87eca90c-ca29-11e9-b422-0242ac130002"),
    partner_components("22","partner_components","Partner with","definition","87eca90c-ca29-11e9-b422-0242ac130002"),
    organization_schools("23","organization_schools","No. of school under the organization","integer","0214865d-ca2a-11e9-b422-0242ac130002"),
    organization_institutions("24","organization_institutions","No. of institutions under the organization","integer","0216dde0-ca2a-11e9-b422-0242ac130002"),
    point_person_name("25","point_person_name","Point Person Name","string","02192dbb-ca2a-11e9-b422-0242ac130002"),
    point_person_contact("26","point_person_contact","Point Person Contact","string","021bc332-ca2a-11e9-b422-0242ac130002"),
    point_person_email("27","point_person_email","Email of point of contact","string","021e5540-ca2a-11e9-b422-0242ac130002"),
    partnership_start_date("28","partnership_start_date","Date of Partnership with Aahung","date","0220de23-ca2a-11e9-b422-0242ac130002"),
    institution_type("29","institution_type","Type of Institution","definition","0223b673-ca2a-11e9-b422-0242ac130002"),
    institution_type_other("30","institution_type_other","Other Type of Institution","string","02263dc1-ca2a-11e9-b422-0242ac130002"),
    projects("32","projects","Associated Projects","json","022b5483-ca2a-11e9-b422-0242ac130002"),
    partnership_years("33","partnership_years","Number of years of partnership","integer","022dbe56-ca2a-11e9-b422-0242ac130002"),
    school_type("34","school_type","Type of School","definition","02302553-ca2a-11e9-b422-0242ac130002"),
    school_sex("35","school_sex","Classification of School by Sex","definition","0232d516-ca2a-11e9-b422-0242ac130002"),
    school_level("36","school_level","Level of Program","definition","0235686f-ca2a-11e9-b422-0242ac130002"),
    program_implemented("37","program_implemented","Type of program(s) implemented in school","json","0237e060-ca2a-11e9-b422-0242ac130002"),
    school_tier("38","school_tier","School Tier","definition","023a9c56-ca2a-11e9-b422-0242ac130002"),
    school_category_new("39","school_category_new","New Schools Category","definition","023d0241-ca2a-11e9-b422-0242ac130002"),
    school_category_running("40","school_category_running","Running Schools Category","definition","023f4d8f-ca2a-11e9-b422-0242ac130002"),
    school_category_exit("41","school_category_exit","Exit Schools Category","definition","0241ae67-ca2a-11e9-b422-0242ac130002"),
    student_count("42","student_count","Approximate number of students","integer","02440064-ca2a-11e9-b422-0242ac130002"),
    partnership_end_date("43","partnership_end_date","Date partnership with Aahung ended","date","2af20abd-ca4c-11e9-b422-0242ac130002"),
    end_partnership_reason("44","end_partnership_reason","Reason for end of partnership","string","2bd73ee7-ca4c-11e9-b422-0242ac130002"),

    lse_teacher_participant("19","lse_teacher_participant","LSE Teacher ","boolean","01b09201-ca4a-11e9-b422-0242ac130002"),
    srhm_general_participant("20","srhm_general_participant","SRHM General Participant","boolean","0a96b8a4-ca4a-11e9-b422-0242ac130002"),
    srhm_ac_participant("21","srhm_ac_participant","SRHM AC Participant","boolean","0bbca889-ca4a-11e9-b422-0242ac130002"),
    subject_taught("22","subject_taught","Subject(s) taught","json","0c6aff79-ca4a-11e9-b422-0242ac130002"),
    subject_taught_other("23","subject_taught_other","Specify Other Subject","string","0d26f656-ca4a-11e9-b422-0242ac130002"),
    teaching_years("24","teaching_years","Number of years teaching","integer","0ddb22b8-ca4a-11e9-b422-0242ac130002"),
    education_level("25","education_level","Level of Education","definition","0f8910f9-ca4a-11e9-b422-0242ac130002"),
    participant_affiliation("26","participant_affiliation","Participant Affliation","json","104ba137-ca4a-11e9-b422-0242ac130002"),
    participant_affiliation_other("27","participant_affiliation_other","Specify Other Affliation","string","1210e951-ca4a-11e9-b422-0242ac130002"),
    participant_type("28","participant_type","Type of Participant","definition","12e3f0b6-ca4a-11e9-b422-0242ac130002"),
    participant_type_other("29","participant_type_other","Specify Other Type","string","13e5c110-ca4a-11e9-b422-0242ac130002"),
    instituition_role("30","instituition_role","Role in Institution","definition","14df7dbb-ca4a-11e9-b422-0242ac130002"),
    instituition_role_other("31","instituition_role_other","Specify Other Role","string","16256075-ca4a-11e9-b422-0242ac130002"),
    student_program("32","student_program","Program of Student","definition","1739b601-ca4a-11e9-b422-0242ac130002"),
    student_year("33","student_year","Program Year of Student","definition","18288c50-ca4a-11e9-b422-0242ac130002"),
    teacher_subject("34","teacher_subject","Teacher Subject","string","19216771-ca4a-11e9-b422-0242ac130002")

    ;

    private String attributeID;
    private String shortName;
    private String fullName;
    private String dataType;
    private String uuid;


    Attribute(String attributeID, String shortName, String fullName, String dataType, String uuid) {
        this.attributeID = attributeID;
        this.shortName = shortName;
        this.fullName = fullName;
        this.dataType = dataType;
        this.uuid = uuid;
    }

    public String getAttributeName() {
        return shortName;
    }

    public String getAttributeID() {
        return attributeID;
    }

    public String getShortName() {
        return shortName;
    }

    public String getFullName() {
        return fullName;
    }

    public String getDataType() {
        return dataType;
    }

    public String getUuid() {
        return uuid;
    }
}
