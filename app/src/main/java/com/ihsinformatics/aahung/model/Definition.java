package com.ihsinformatics.aahung.model;

public enum Definition {
 /*   Country("1", "country", "Country", "d5113561-ca25-11e9-b422-0242ac130002"),
    LocationCategory("2", "location_category", "Location Category", "3871cce9-ca26-11e9-b422-0242ac130002"),
    TypeofSchool("3", "school_type", "Type of School", "387414aa-ca26-11e9-b422-0242ac130002"),
    ClassificationofSchoolbySex("4", "school_sex", "Classification of School by Sex", "38767641-ca26-11e9-b422-0242ac130002"),
    LevelofProgram("5", "school_level", "Level of Program", "3878e624-ca26-11e9-b422-0242ac130002"),
    Typeofprogramsimplementedinschool("6", "program_implemented", "Type of program(s) implemented in school", "387b55ba-ca26-11e9-b422-0242ac130002"),
    SchoolTier("7", "school_tier", "School Tier", "387dc55b-ca26-11e9-b422-0242ac130002"),
    NewSchoolsCategory("8", "school_category_new", "New Schools Category", "38806159-ca26-11e9-b422-0242ac130002"),
    RunningSchoolsCategory("9", "school_category_running", "Running Schools Category", "3882cba1-ca26-11e9-b422-0242ac130002"),
    ExitSchoolsCategory("10", "school_category_exit", "Exit Schools Category", "38854a3b-ca26-11e9-b422-0242ac130002"),
    Partnerwith("11", "partner_components", "Partner with", "3887c1dc-ca26-11e9-b422-0242ac130002"),
    TypeofInstitution("12", "institution_type", "Type of Institution", "388a48c3-ca26-11e9-b422-0242ac130002"),
    Subjectstaught("13", "subject_taught", "Subject(s) taught", "57ba6990-ca49-11e9-b422-0242ac130002"),
    LevelofEducation("14", "education_level", "Level of Education", "586a6dc8-ca49-11e9-b422-0242ac130002"),
    ParticipantAffliation("15", "participant_affiliation", "Participant Affliation", "591e6b8c-ca49-11e9-b422-0242ac130002"),
    TypeofParticipant("16", "participant_type", "Type of Participant", "59cbbba5-ca49-11e9-b422-0242ac130002"),
    RoleinInstitution("17", "instituition_role", "Role in Institution", "5a804bb4-ca49-11e9-b422-0242ac130002"),
    ProgramofStudent("18", "student_program", "Program of Student", "5b4f583b-ca49-11e9-b422-0242ac130002"),
    ProgramYearofStudent("19", "student_year", "Program Year of Student", "5c489f49-ca49-11e9-b422-0242ac130002"),
*/

    pakistan("7","pakistan","Pakistan","656a5ed3-ca28-11e9-b422-0242ac130002"),
    school("8","school","School","66ff4533-ca28-11e9-b422-0242ac130002"),
    institution("9","institution","Institution","67c24a96-ca28-11e9-b422-0242ac130002"),
    parent_organization("10","parent_organization","Parent Organization","68b61577-ca28-11e9-b422-0242ac130002"),
    school_public("11","school_public","Public","69806f89-ca28-11e9-b422-0242ac130002"),
    school_private("12","school_private","Private","6a839acb-ca28-11e9-b422-0242ac130002"),
    school_govt_adopted_private("13","school_govt_adopted_private","Government Adopted by Private","6bb708a1-ca28-11e9-b422-0242ac130002"),
    school_local_govt("14","school_local_govt","Local Government Schools","6d1c68c7-ca28-11e9-b422-0242ac130002"),
    school_sex_girls("15","school_sex_girls","Girls","6e553a78-ca28-11e9-b422-0242ac130002"),
    school_sex_boys("16","school_sex_boys","Boys","6f578fc8-ca28-11e9-b422-0242ac130002"),
    school_sex_coed("17","school_sex_coed","Co-ed","7071d54d-ca28-11e9-b422-0242ac130002"),
    school_level_primary("18","school_level_primary","Primary","716b2c00-ca28-11e9-b422-0242ac130002"),
    school_level_secondary("19","school_level_secondary","Secondary","725303d1-ca28-11e9-b422-0242ac130002"),
    school_program_csa("20","school_program_csa","CSA","734eaab4-ca28-11e9-b422-0242ac130002"),
    school_program_gender("21","school_program_gender","Gender","745426e3-ca28-11e9-b422-0242ac130002"),
    school_program_lsbe("22","school_program_lsbe","LSBE","754eb42a-ca28-11e9-b422-0242ac130002"),
    school_tier_new("23","school_tier_new","New","768c4c94-ca28-11e9-b422-0242ac130002"),
    school_tier_running("24","school_tier_running","Running","7796f76f-ca28-11e9-b422-0242ac130002"),
    school_tier_exit("25","school_tier_exit","Exit","78bc4653-ca28-11e9-b422-0242ac130002"),
    school_new_inducted("26","school_new_inducted","Newly Inducted","79e5bf56-ca28-11e9-b422-0242ac130002"),
    school_new_implementation("27","school_new_implementation","Implementation >1 Cycle","7ae4f791-ca28-11e9-b422-0242ac130002"),
    school_running_low("28","school_running_low","Low Performing","7bdaa655-ca28-11e9-b422-0242ac130002"),
    school_running_average("29","school_running_average","Average Performing","7cdc578f-ca28-11e9-b422-0242ac130002"),
    school_running_high("30","school_running_high","High Performing","7dfcddc3-ca28-11e9-b422-0242ac130002"),
    school_exit_initial_phase("31","school_exit_initial_phase","Initial Phase","7f1aef66-ca28-11e9-b422-0242ac130002"),
    school_exit_mid_phase("32","school_exit_mid_phase","Mid Phase","80278351-ca28-11e9-b422-0242ac130002"),
    school_exit_exit_phase("33","school_exit_exit_phase","Exit Phase","812c9325-ca28-11e9-b422-0242ac130002"),
    partner_lse("34","partner_lse","LSE","824c87fd-ca28-11e9-b422-0242ac130002"),
    partner_srhm("35","partner_srhm","SRHM","8361b1fd-ca28-11e9-b422-0242ac130002"),
    institution_medical("36","institution_medical","Medical","8467c6cf-ca28-11e9-b422-0242ac130002"),
    institution_nursing("37","institution_nursing","Nursing","8576f083-ca28-11e9-b422-0242ac130002"),
    institution_midwifery("38","institution_midwifery","Midwifery","869b9a6d-ca28-11e9-b422-0242ac130002"),
    institution_other("39","institution_other","Other","87a3577e-ca28-11e9-b422-0242ac130002"),
    math("40","math","Math","882ade94-ca42-11e9-b422-0242ac130002"),
    science("41","science","Science","89539aba-ca42-11e9-b422-0242ac130002"),
    english("42","english","English","8a92d7b5-ca42-11e9-b422-0242ac130002"),
    urdu("43","urdu","Urdu","8c0d2bc9-ca42-11e9-b422-0242ac130002"),
    social_studies("44","social_studies","Social Studies","8cf5b957-ca42-11e9-b422-0242ac130002"),
    islamiat("45","islamiat","Islamiat","8e963cba-ca42-11e9-b422-0242ac130002"),
    art("46","art","Art","8f949293-ca42-11e9-b422-0242ac130002"),
    music("47","music","Music","90b302eb-ca42-11e9-b422-0242ac130002"),
    other_subject("48","other_subject","Other","92970e44-ca42-11e9-b422-0242ac130002"),
    no_education("49","no_education","No Education","93d86f6a-ca42-11e9-b422-0242ac130002"),
    some_primary("50","some_primary","Some Primary","94fb8d0f-ca42-11e9-b422-0242ac130002"),
    primary_education("51","primary_education","Primary","964c4080-ca42-11e9-b422-0242ac130002"),
    secondary_education("52","secondary_education","Secondary","9809a61f-ca42-11e9-b422-0242ac130002"),
    college("53","college","College","9984f1a9-ca42-11e9-b422-0242ac130002"),
    undergraduate("54","undergraduate","Undergraduate","9afb092b-ca42-11e9-b422-0242ac130002"),
    postgraduate("55","postgraduate","Post-graduate","9c0bd9ee-ca42-11e9-b422-0242ac130002"),
    affiliation_hospital("56","affiliation_hospital","Hospital","9dc2dd43-ca42-11e9-b422-0242ac130002"),
    affiliation_ngo("57","affiliation_ngo","NGO","9eb87850-ca42-11e9-b422-0242ac130002"),
    affiliation_govt("58","affiliation_govt","Government","9fbe0e27-ca42-11e9-b422-0242ac130002"),
    affiliation_institute("59","affiliation_institute","Education Institute","a0ce9a24-ca42-11e9-b422-0242ac130002"),
    affiliation_none("60","affiliation_none","No affiliation","a2115c3f-ca42-11e9-b422-0242ac130002"),
    affiliation_private("61","affiliation_private","Private","a36ee62f-ca42-11e9-b422-0242ac130002"),
    affiliation_public("62","affiliation_public","Public","a4ce947e-ca42-11e9-b422-0242ac130002"),
    affiliation_other("63","affiliation_other","Other","a629fe99-ca42-11e9-b422-0242ac130002"),
    participant_preservice("64","participant_preservice","Pre-service providers","a7e9518b-ca42-11e9-b422-0242ac130002"),
    participant_inservice("65","participant_inservice","In-service providers","a97931b6-ca42-11e9-b422-0242ac130002"),
    participant_lhs("66","participant_lhs","LHS","aa9e142b-ca42-11e9-b422-0242ac130002"),
    participant_youth("67","participant_youth","Youth","ac13748a-ca42-11e9-b422-0242ac130002"),
    participant_project_staff("68","participant_project_staff","Project Staff","ad835b6e-ca42-11e9-b422-0242ac130002"),
    participant_student("69","participant_student","Student","af41740f-ca42-11e9-b422-0242ac130002"),
    participant_teacher("70","participant_teacher","Teacher","b0c7e03f-ca42-11e9-b422-0242ac130002"),
    participant_other("71","participant_other","Other","b24ca8f2-ca42-11e9-b422-0242ac130002"),
    role_faculty("72","role_faculty","Faculty","b3f20e79-ca42-11e9-b422-0242ac130002"),
    role_student("73","role_student","Student","b5279190-ca42-11e9-b422-0242ac130002"),
    role_doctor("74","role_doctor","Doctor","b74e11cb-ca42-11e9-b422-0242ac130002"),
    role_nurse("75","role_nurse","Nurse","b9d98f78-ca42-11e9-b422-0242ac130002"),
    role_other("76","role_other","Other","bb755d69-ca42-11e9-b422-0242ac130002"),
    student_medical("77","student_medical","Medical","bc7fdd16-ca42-11e9-b422-0242ac130002"),
    student_nursing("78","student_nursing","Nursing","bdd3af2b-ca42-11e9-b422-0242ac130002"),
    year_one("79","year_one","1","bf1627b6-ca42-11e9-b422-0242ac130002"),
    year_two("80","year_two","2","c090c961-ca42-11e9-b422-0242ac130002"),
    year_three("81","year_three","3","c2a2d91a-ca42-11e9-b422-0242ac130002"),
    year_four("82","year_four","4","c3b010aa-ca42-11e9-b422-0242ac130002"),
    year_five("83","year_five","5","c4c09435-ca42-11e9-b422-0242ac130002"),


            ;

    private String definitionId;
    private String shortName;
    private String fullName;
    private String uuid;

    Definition(String definitionId, String shortName, String fullName, String uuid) {
        this.definitionId = definitionId;
        this.shortName = shortName;
        this.fullName = fullName;
        this.uuid = uuid;
    }


    public static Definition getDefinitionByFullName(String fullName) {
        Definition definition = null;
        for (Definition mDefinition : Definition.values()) {
            if (mDefinition.getFullName().equals(fullName)) {
                definition = mDefinition;
            }
        }
        return definition;
    }

    public String getDefinitionId() {
        return definitionId;
    }

    public String getShortName() {
        return shortName;
    }

    public String getFullName() {
        return fullName;
    }

    public String getUuid() {
        return uuid;
    }
}
