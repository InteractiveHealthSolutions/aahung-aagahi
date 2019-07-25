package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.text.InputType;
import android.widget.LinearLayout;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.Keys;
import com.ihsinformatics.aahung.common.ScoreCalculator;
import com.ihsinformatics.aahung.model.FormDetails;
import com.ihsinformatics.aahung.model.MultiSwitcher;
import com.ihsinformatics.aahung.model.RadioSwitcher;
import com.ihsinformatics.aahung.model.ToggleWidgetData;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class DataProvider {

    public static final int NORMAL_LENGTH = 30;
    public static final int ID_LENGTH = 10;
    public static final int TWO = 2;
    public static final int PHONE_LENGTH = 11;
    public static final int FOUR = 4;
    public static final int THREE = 3;
    public static final int ONE = 1;
    public static final int SIX = 6;
    private Context context;
    private FormDetails details;


    public DataProvider(Context context, FormDetails details) {
        this.context = context;
        this.details = details;
    }

    public enum Forms {
        ParentOrganizationRegistrationLSE("Parent Organization Registration", "parent_organization", FormType.LSE),
        DonorDetail("Donor Details Form", "donor", FormType.LSE),
        SchoolDetails("School Details Form", "school", FormType.LSE),
        ParticipantsDetailsForm("Participants Details Form", "participants", FormType.LSE),
        TrainingDetailForm("Training Detail Form", "training", FormType.LSE),
        PrimaryMonitoringFormNew("Primary Monitoring Form - New", "primary_new", FormType.LSE),
        PrimaryMonitoringFormRunning("Primary Monitoring Form - Running", "primary_running", FormType.LSE),
        PrimaryMonitoringFormExit("Primary Monitoring Form - Exit", "primary_exit", FormType.LSE),
        SecondaryMonitoringFormNew("Secondary Monitoring Form - New", "Secondary_new", FormType.LSE),
        SecondaryMonitoringFormRunning("Secondary Monitoring Form - Running", "Secondary_running", FormType.LSE),
        SecondaryMonitoringFormExit("Secondary Monitoring Form - Exit", "Secondary_exit", FormType.LSE),
        SRHRPolicyForm("SRHR Policy Form", "srhr_policy", FormType.LSE),
        ParentSessionsForm("Parent Sessions Form", "parent_session", FormType.LSE),
        MasterTrainerEligibilityCriteriaAssessment("Master Trainer Eligibility Criteria Assessment", "master_eligibility_training", FormType.LSE),
        MasterTrainerMockSessionEvaluationForm("Master Trainer Eligibility Criteria Assessment", "master_evaulation", FormType.LSE),
        StepDownTrainingMonitoringForm("Step Down Training Monitoring Form", "master_evaulation", FormType.LSE),
        StakeholderMeetings("Stakeholder Meetings", "master_evaulation", FormType.LSE),
        OneTouchSessionDetailForm("One-Touch Session Detail Form", "master_evaulation", FormType.LSE),
        SchoolClosingForm("School Closing Form", "master_evaulation", FormType.LSE),


        ParentOrganizationRegistrationSRHM("Parent Organization Registration", "parent_organization", FormType.SRHM),
        NayaQadamStepDownTrainingDetailsForm("Naya Qadam Step Down Training Details Form", "master_evaulation", FormType.SRHM),
        InstitutionDetailsForm("Institution Details Form", "master_evaulation", FormType.SRHM),
        AmplifyChangeParticipantDetailsForm("Amplify Change Participant Details Form", "master_evaulation", FormType.SRHM),
        AmplifyChangeTrainingDetailsForm("Amplify Change Training Details Form", "master_evaulation", FormType.SRHM),
        AmplifyChangeStepDownTrainingDetailsForm("Amplify Change Step Down Training Details Form", "master_evaulation", FormType.SRHM),
        ParticipantsDetailsSRHMForm("Participants Details Form", "master_evaulation", FormType.SRHM),
        GeneralTrainingDetailsForm("General Training Details Form", "master_evaulation", FormType.SRHM),
        GeneralStepDownTrainingDetailsForm("General Training Details Form", "master_evaulation", FormType.SRHM),
        HealthCareProviderReachForm("Health Care Provider Reach Form", "master_evaulation", FormType.SRHM),
        OneTouchSensitizationSessionDetailsForm("One-Touch Sensitization Session Details Form", "master_evaulation", FormType.SRHM),
        InstitutionClosingForm("Institution Closing Form", "master_evaulation", FormType.SRHM),

        SocialMediaDetails("Social Media Details", "master_evaulation", FormType.COMMS),
        DistributionofCommunicationMaterial("Distribution of Communication Material", "master_evaulation", FormType.COMMS),
        RadioAppearanceForm("Radio Appearance Form", "master_evaulation", FormType.COMMS),
        MobileCinemaTheatreDetailsForm("Mobile Cinema/Theatre Details Form", "master_evaulation", FormType.COMMS),
        TrainingDetailsFormCommunications("Training Details Form - Communications", "master_evaulation", FormType.COMMS);


        private String name;
        private String endpoint;
        private FormType formType;

        Forms(String name, String endpoint, FormType formType) {
            this.name = name;
            this.endpoint = endpoint;
            this.formType = formType;
        }

        public String getName() {
            return name;
        }

        public FormType getFormType() {
            return formType;
        }

        public String getEndpoint() {
            return endpoint;
        }
    }

    public enum FormType {
        LSE,
        SRHM,
        COMMS
    }


    public List<Widget> getWidgets() {
        List<Widget> widgets = null;
        switch (details.getForms()) {
            case ParentOrganizationRegistrationLSE:
            case ParentOrganizationRegistrationSRHM:
                widgets = getParentOrganizationWidgets();
                break;
            case DonorDetail:
                widgets = getDonorDetailWidgets();
                break;
            case SchoolDetails:
                widgets = getSchoolDetailWidgets();
                break;
            case ParticipantsDetailsForm:
                widgets = getParticipantDetailsWidgets();
                break;
            case PrimaryMonitoringFormNew:
                widgets = getPrimaryMonitoringNewWidgets();
                break;
            case PrimaryMonitoringFormRunning:
                widgets = getPrimaryMonitoringRunningWidgets();
                break;
            case PrimaryMonitoringFormExit:
                widgets = getPrimaryMonitoringExitWidgets();
                break;
            case SecondaryMonitoringFormNew:
                widgets = getSecondaryMonitoringNewWidgets();
                break;
            case SecondaryMonitoringFormRunning:
                widgets = getSecondaryMonitoringRunningWidgets();
                break;
            case SecondaryMonitoringFormExit:
                widgets = getSecondaryMonitoringExitWidgets();
                break;

            case SRHRPolicyForm:
                widgets = getSRHRPolicyWidgets();
                break;
            case SchoolClosingForm:
                widgets = getSchoolClosingWidgets();
                break;


            default:
                widgets = getDonorDetailWidgets();
        }

        return widgets;
    }

    private List<Widget> getSRHRPolicyWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new SpinnerWidget(context, Keys.MONITORED_BY, "Monitored By", Arrays.asList(context.getResources().getStringArray(R.array.empty_list)), true));
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        final RadioWidget schoolClassification = new RadioWidget(context, Keys.SCHOOL_CLASSIFICATION, "Classification of School by Sex", true, "Girls", "Boys", "Co-ed");
        widgets.add(schoolClassification);

        ToggleWidgetData policyToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData policySkipper = policyToggler.addOption("Yes");
        RadioWidget policy = new RadioWidget(context,Keys.POLICY,"Has this school implemented the SRHR Policy Guildelines?",true,"Yes","No");
        widgets.add(policy.addHeader("SRHR Policy"));
        ScoreWidget scoreWidget = new ScoreWidget(context, Keys.MONITORING_SCORE);
        ScoreCalculator scoreCalculator = new ScoreCalculator(scoreWidget);
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context,Keys.STUDENT_AWARENESS_ABOUT_TEACHERS,"Student are aware of which teachers are trained on SRHR and are available for support",true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.student_awareness))).setScoreListener(scoreCalculator).addHeader("1. Promotion of SRH Education in Schools").hideView()));
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.MANAGEMENT_SAFE_AND_SECURE_PLACE, "School Management has created a safe and secure space where teachers trained on SRHR are able to teach and counsel students on SRHR issues", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.MANAGEMENT_INITIATIVE, "School Management takes the initiative to organize capacity building training sessions for teachers on a need basis", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.STUDENT_ACCESS_MATERIAL, "Students have access to SRHR IEC materials within the school vicinity", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.ENCOURAGE_ACTIVITIES, "School encourages all students of all genders to be involved in extracurricular activities, such as sports and arts", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.INVOLVES_PARENTS, "School Management involves parents in the SRHR programs through various activities throughout the school year", true).setScoreListener(scoreCalculator).addHeader("2. Parental Involvement to Strengthen SRH Education Programs in Schools")).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.SENSITIZED_SRHR, "Parents are sensitized on the SRHR curriculum and implementation of SRHR policies on an annual basis", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.PARENTS_ARE_UPDATED, "Parents are updated on their child's progress regarding the SRHR classes during parent teacher meetings", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.PARENTS_ARE_UPDATED, "Parents are updated on their child's progress regarding the SRHR classes during parent teacher meetings", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_ENCOURAGE, "School Management and teachers encourage the information and role of parent groups in school and support them in their initiatives", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.COUNSELING_SPACE, "Safe and secure spaces are available in the school where counseling can take palce", true,"Yes","No").setScoreListener(scoreCalculator).addHeader("3. Provision of Psychosocial Services to Address Student's SRHR and Other Issues")).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.CERTIFIED_COUNSELER, "Counselors at this school are trained and certified by a reputable organization", true,"Yes","No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.STUDENT_AWARENESS_ABOUT_COUNSELING, "Students are aware of the counseling services offered", true,"Yes","No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context,Keys.SCHOOL_USE_REFERRAL_GUIDE,"School Management and counselors use the Referral Guide provided by Aahung when needed",true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator).hideView()));
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context,Keys.COUNSELOR_INFORM_MANAGEMENT,"Counselors inform management about any cases that require urgent attention",true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator).hideView()));
        widgets.add(policySkipper.addWidgetToToggle(new MultiSelectWidget(context,Keys.SCHOOL_FIRST_AID,LinearLayout.VERTICAL,"This school has a proper First Aid Kit that includes the following",true,context.getResources().getStringArray(R.array.first_aid)).setScoreListener(scoreCalculator)).addHeader("4. Provision of First Aid Management").hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.FOCAL_PERSON_HAS_TRAINING, "There is a focal person for medical care who has First Aid training and is responsible for the First Aid kit", true,"Yes","No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.FIRST_AID_CHECKED, "The First Aid kit is checked on a monthly basis and refilled regularly", true,"Yes","No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.FOCAL_PERSON_INFORM_MANAGEMENT, "The focal person for medical care informs management about any cases that require urgent attention", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator)).hideView());

        Widget mhmKitAvailable = new RadioWidget(context, Keys.HYGIENE_MANAGEMENT, "The school has a menstrual hygiene management(MHM) kit readily available for students and teachers that include necessary items such as soap, pads and underwear", true,"Yes","No").setScoreListener(scoreCalculator);
        Widget personForKit = new RadioWidget(context, Keys.PERSON_FOR_KIT, "There is a focal person who oversees the maintenance of the MHM kit", true,"Yes","No").setScoreListener(scoreCalculator);
        Widget kitChecked = new RadioWidget(context, Keys.KIT_CHECKED, "The MHM kit is checked on a monthly basis and is regularly refilled", true,"Yes","No").setScoreListener(scoreCalculator);

        MultiSwitcher multiSwitcher = new MultiSwitcher(schoolClassification,policy);
        multiSwitcher.addNewOption().addKeys("Yes","Girls").addWidgets(mhmKitAvailable,personForKit,kitChecked).build();
        multiSwitcher.addNewOption().addKeys("Yes","Co-ed").addWidgets(mhmKitAvailable,personForKit,kitChecked).build();
        widgets.add(mhmKitAvailable.addHeader("5. Improving Menstrual Hygiene Management in Schools").hideView());
        widgets.add(personForKit.hideView());
        widgets.add(kitChecked.hideView());
        schoolClassification.setMultiWidgetSwitchListener(multiSwitcher);
        policy.setMultiWidgetSwitchListener(multiSwitcher);

        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.ACCESS_CLEAN_WATER, "Teachers and students have access to clean drinking water", true,"Yes","No").setScoreListener(scoreCalculator)).addHeader("6. Provision of Safe, Clean and Hygiene Food and Water Sanitation").hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.HYGIENE_SPACE_FOR_FOOD, "Teacher and students have access to a hygienic space where food can be consumed", true,"Yes","No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.HYGIENIC_SANITATION, "Teacher and Students have access to a hygienic space where food can be consumed", true,"Yes","No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.STAFF_HIRED, "Support staff hired to assist primary school children with going to the toilet are trained on appropriate use of language and cleaning techniques", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.SEPARATE_TOILETS, "Toilets for boys and girls are separate", true,"Yes","No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.CLOSE_TOILETS, "Toilets are within close proximity to the classrooms", true,"Yes","No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.TOILET_PERMISSION, "Teachers allow students to go to the toilet when they request permission", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.TOILET_WELL_EQUIPPED, "Toilets are well equipped with clean water, soap, tissue paper, toilet rolls and dust-bins", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.PROPER_USE_OF_TOILET, "Students are well aware of proper toilet etiquette to improve hygienic practices, i.e. importance of hand washing, flushing, cleaning the toilet seat and not wasting water", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.STAFF_CLEAN_TOILETS, "Support staff cleans the toilets at least 2-3 times a day with antibacterial products", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.ZERO_TOLERANCE, "School management maintains a zero tolerance policy for any teachers, students and staff that commit any of the following: discrimination; sexual harassment; verbal or physical abuse; use of alcohol or drugs on school premises; sharing confidential information of students; teachers or staff; using school premises for illegal activity; criminal activities, theft or fraud", true,"Yes","No").setScoreListener(scoreCalculator)).addHeader("7. Zero Tolerance Policy").hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.SECURITY_MEASURES, "The school management takes appropriate security measures (such as collecting their ID document) with all visitors entering the school premises", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator)).addHeader("8. Safety and Security").hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.UPDATE_PARENTS_ON_SECURITY, "School management updates parents on security related policies and concerns that impact students", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.ADULT_RESPONSIBLE, "School management is informed about the adult responsible for the pick/drop of student", true,"Yes","No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.STAFF_RELEASE_STUDENTS, "Staff release students only to the aforementioned individuals", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.MANAGEMENT_GUIDES_PARENTS, "Management guides parents on security precautions they should take to ensure the safety of their children when coming to/leaving school, i.e. have the van drivers' CNIC number and references, tell their child not to leave school premises alone or with someone they were not previously informed would be picking them up", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.STRINGENT_CODES, "School management enforces stringent codes of conduct around staff and student interactions", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.OPEN_DOOR_POLICY, "An open door policy is implemented to ensure transparency and clear glass windows are installed in all classrooms and offices where possible", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.MANAGEMENT_CHECKS, "Management checks for teachers, staff and students roaming around the premises in and out of school hours", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.CLEAR_BOUNDARIES, "Clear boundaries are enforced between teachers, staff and students - inappropriate body language, touch, or conversation are not acceptable", true).setScoreListener(scoreCalculator)).hideView());


        widgets.add(policySkipper.addWidgetToToggle(scoreWidget).hideView());

        policySkipper.build();
        policy.addDependentWidgets(policyToggler.getToggleMap());


        return widgets;
    }

    private List<Widget> getParentOrganizationWidgets() {
        List<Widget> widgets = new ArrayList<>();

        widgets.add(new EditTextWidget.Builder(context, Keys.PARENT_ORGANISATION_ID, "Parent Organization ID", InputType.TYPE_CLASS_NUMBER, SIX, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.PARENT_ORGANISATION_NAME, "Parent Organization Name", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.OFFICE_ADDRESS, "Office Address", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.POINT_OF_CONTACT, "Name of Point of Contact", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.PHONE_NUMBER, "Phone Number of point of contact", InputType.TYPE_CLASS_TEXT, PHONE_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.EMAIL, "Name of Point of Contact", InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS, NORMAL_LENGTH, true).build());

        //TODO need to fix the codebook first
        return widgets;
    }

    private List<Widget> getSecondaryMonitoringExitWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new SpinnerWidget(context, Keys.MONITORED_BY, "Monitored By", Arrays.asList(context.getResources().getStringArray(R.array.empty_list)), true));
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        final RadioWidget schoolClassification = new RadioWidget(context, Keys.SCHOOL_CLASSIFICATION, "Classification of School by Sex", true, "Girls", "Boys", "Co-ed");
        RadioWidget classClassification = new RadioWidget(context, Keys.CLASS_CLASSIFICATION, "Students in Class by Sex", true, "Girls", "Boys", "Co-ed");

        ToggleWidgetData schoolToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData coedSkipper = schoolToggler.addOption("Co-ed");
        coedSkipper.addWidgetToToggle(classClassification.hideView());
        coedSkipper.build();

        widgets.add(schoolClassification);
        widgets.add(classClassification);

        RadioSwitcher switcher = new RadioSwitcher(classClassification);
        switcher.add("Boys", "Boys");
        switcher.add("Girls", "Girls");
        schoolClassification.setWidgetSwitchListener(switcher);


        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_ID, "Teacher ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_NAME, "Name of Teacher", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());
        widgets.add(new RadioWidget(context, Keys.CLASS, "Class", true, "6", "7", "8", "9", "10"));
        widgets.add(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENDS, "Number of Students in Class", InputType.TYPE_CLASS_NUMBER, TWO, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.DURATION_OF_CLASS, "Time duration of class in minutes", InputType.TYPE_CLASS_NUMBER, THREE, true).build());

        ToggleWidgetData levelToggler = new ToggleWidgetData();
        RadioWidget level = new RadioWidget(context, Keys.LSBE_LEVEL, "LSBE Level", true, "Level 1", "Level 2");
        widgets.add(level.addHeader("LSBE Program"));

        ToggleWidgetData.SkipData levelOneSkipper = levelToggler.addOption("Level 1");
        widgets.add(levelOneSkipper.addWidgetToToggle(new SpinnerWidget(context, Keys.CHAPTERS_LEVEL_1, "LSBE Chapter - Level 1", Arrays.asList(context.getResources().getStringArray(R.array.level_one_chapters)), true)).hideView());
        levelOneSkipper.build();

        ToggleWidgetData.SkipData levelTwoSkipper = levelToggler.addOption("Level 2");
        widgets.add(levelTwoSkipper.addWidgetToToggle(new SpinnerWidget(context, Keys.CHAPTERS_LEVEL_2, "LSBE Chapter - Level 2", Arrays.asList(context.getResources().getStringArray(R.array.level_two_chapters)), true)).hideView());
        levelTwoSkipper.build();

        widgets.add(new RadioWidget(context, Keys.CSA_REVISION_OR_FIRSTTIME, "Revision or first time flashcard is being taught", true, "Revision", "First time"));

        ScoreWidget scoreWidget = new ScoreWidget(context, Keys.MONITORING_SCORE);
        ScoreCalculator scoreCalculator = new ScoreCalculator(scoreWidget);
        widgets.add(new RateWidget(context, Keys.USING_TEACHERS_GUIDE, "The teacher is actively using the teacher's guide to aid in facilitation of content", true).setScoreListener(scoreCalculator).addHeader("Facilitation"));
        widgets.add(new RateWidget(context, Keys.RELAYING_MAIN_MESSAGE, "The teacher is clearly relaying the main messages of the chapter, even if they are not actively using the teacher's guide", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.GOOD_UNDERSTANDING, "The teacher demonstrate good understanding of the LSBE content", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.PREPARED_MATERIAL, "The teacher had all materials prepared in advance for the class", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_WELL_PREPARED, "The teacher was well prepared to facilitate the session", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TIME_ALLOTED_FOR_ACTIVITY, "An appropriate amount of time is allotted for each activity and topic", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_COMFORTABLE_SPEAKING, "The teacher is comfortable speaking about this subject", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_JUDGEMENTAL_TONE, "The teacher uses a non-judgmental tone while facilitating the session", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_OWN_OPINIONS, "The teacher does not impose their own values or opinion on the participants", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_ENGAGING, "The teacher is engaging participants in discussion throughout session by providing probes", true).setScoreListener(scoreCalculator));

        widgets.add(new RateWidget(context, Keys.STUDENTS_UNDERSTAND_MESSAGE, "Students demonstrate clear understanding of the main messages of the chapter", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.STUDENTS_ACTIVELY_PARTICIPATE, "Students are actively participating in discussion on the chapter", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.STUDENTS_PAYING_ATTENTION, "Students are actively paying attention to the class while the teacher is instructing", true).setScoreListener(scoreCalculator));
        widgets.add(new RadioWidget(context, Keys.MANAGEMENT_INTEGRATED_LSBE, "Management has integrated the LSBE program into the school timetable", true, "Yes", "No").setScoreListener(scoreCalculator).addHeader("Management"));

        RadioWidget frequency = new RadioWidget(context, Keys.CLASS_FREQUENCY, "Frequency of class in time table", true, "Weekly", "Biweekly", "Monthly", "Other");
        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).build();
        ToggleWidgetData togglerOther = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = togglerOther.addOption("Other");
        skipData.addWidgetToToggle(other);
        skipData.build();
        frequency.addDependentWidgets(togglerOther.getToggleMap());

        widgets.add(frequency);
        widgets.add(other.hideView());
        widgets.add(new RadioWidget(context, Keys.TWO_TEACHER, "There are at least 2 teachers assigned to teach the LSBE program", true, "Yes", "No").setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.EXCELLENT_COORDINATION, "There is excellent coordination between management and teachers regarding the LSBE program", true).setScoreListener(scoreCalculator));
        widgets.add(new EditTextWidget.Builder(context, Keys.MASTER_TRAINERS, "Number of Master Trainer leading LSBE program", InputType.TYPE_CLASS_NUMBER, TWO, true).build());
        widgets.add(new RateWidget(context, Keys.COORDINATION_WITH_MASTER_TRAINERS, "There is excellent coordination between Master Trainers and teachers regarding the LSBE program", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.MASTER_TRAINER_CONDUCT_SESSION, "Master Trainer conduct regular monitoring sessions to maintain quality of LSBE program", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.MASTER_TRAINER_REFRESHER_TRAINING, "Master Trainer arrange and conduct refresher trainings as needed for LSBE teachers", true).setScoreListener(scoreCalculator));
        widgets.add(scoreWidget);

        RadioWidget scheduleClass = new RadioWidget(context, Keys.CHALLENGE_SCHEDULING, "The school is facing challenges scheduling the LSBE class", true, "Yes", "No");
        widgets.add(scheduleClass.addHeader("Challenges"));
        ToggleWidgetData challengeToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        scheduleClass.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget enoughResource = new RadioWidget(context, Keys.ENOUGH_RESOURCES, "There are not enough resources", true, "Yes", "No");
        widgets.add(enoughResource);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.ENOUGH_RESOURCES_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        enoughResource.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noRoom = new RadioWidget(context, Keys.NO_ROOM_FOR_CLASS, "There is no room for the class", true, "Yes", "No");
        widgets.add(noRoom);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_ROOM_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        noRoom.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noTeacher = new RadioWidget(context, Keys.NO_TEACHER_FOR_CLASS, "There are not enough teachers to teach the CSA class", true, "Yes", "No");
        widgets.add(noTeacher);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_TEACHER_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        noTeacher.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget irreleventContent = new RadioWidget(context, Keys.IRRELEVENT_CONTENT, "The content is irrelevent for the context of the students", true, "Yes", "No");
        widgets.add(irreleventContent);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.IRRELEVENT_CONTENT_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        irreleventContent.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget studentNotInterested = new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED, "Student are not interested in the content", true, "Yes", "No");
        widgets.add(studentNotInterested);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        studentNotInterested.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget resourceRequire = new RadioWidget(context, Keys.SCHOOL_REQUIRE_RESOURCES, "Does this school require any resources?", true, "Yes", "No");
        widgets.add(resourceRequire.addHeader("Resources"));

        final Widget workbookGirlOne = new EditTextWidget.Builder(context, Keys.WORKBOOK_1_GIRLS, "Workbook level 1 - Girls", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget workbookBoyOne = new EditTextWidget.Builder(context, Keys.WORKBOOK_1_BOYS, "Workbook level 1 - Boys", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget workbookBoyTwo = new EditTextWidget.Builder(context, Keys.WORKBOOK_2_BOYS, "Workbook level 2 - Boys", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget workbookGirlTwo = new EditTextWidget.Builder(context, Keys.WORKBOOK_2_GIRLS, "Workbook level 2 - Girls", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget requireOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER, "Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, false).build().hideView();
        MultiSwitcher multiSwitcher = new MultiSwitcher(schoolClassification, resourceRequire);
        multiSwitcher.addNewOption().addKeys("Boys", "Yes").addWidgets(workbookBoyOne, workbookBoyTwo, requireOther).build();
        multiSwitcher.addNewOption().addKeys("Girls", "Yes").addWidgets(workbookGirlOne, workbookGirlTwo, requireOther).build();
        multiSwitcher.addNewOption().addKeys("Co-ed", "Yes").addWidgets(workbookBoyOne, workbookBoyTwo, workbookGirlOne, workbookGirlTwo, requireOther).build();
        widgets.add(workbookGirlOne);
        widgets.add(workbookBoyOne);
        widgets.add(workbookGirlTwo);
        widgets.add(workbookBoyTwo);
        widgets.add(requireOther);
        schoolClassification.setMultiWidgetSwitchListener(multiSwitcher);
        resourceRequire.setMultiWidgetSwitchListener(multiSwitcher);

        RadioWidget resourceDistributed = new RadioWidget(context, Keys.SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, "Yes", "No");
        final Widget resourceworkbookGirlOne = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_1_GIRLS, "Workbook level 1 - Girls", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget resourceworkbookBoyOne = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_1_BOYS, "Workbook level 1 - Boys", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget resourceworkbookBoyTwo = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_2_BOYS, "Workbook level 2 - Boys", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget resourceworkbookGirlTwo = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_2_GIRLS, "Workbook level 2 - Girls", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget resourcerequireOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER, "Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, false).build().hideView();
        multiSwitcher = new MultiSwitcher(schoolClassification, resourceDistributed);
        multiSwitcher.addNewOption().addKeys("Boys", "Yes").addWidgets(resourceworkbookBoyOne, resourceworkbookBoyTwo, resourcerequireOther).build();
        multiSwitcher.addNewOption().addKeys("Girls", "Yes").addWidgets(resourceworkbookGirlOne, resourceworkbookGirlTwo, resourcerequireOther).build();
        multiSwitcher.addNewOption().addKeys("Co-ed", "Yes").addWidgets(resourceworkbookBoyOne, resourceworkbookBoyTwo, resourceworkbookGirlOne, resourceworkbookGirlTwo, resourcerequireOther).build();
        widgets.add(resourceDistributed);
        widgets.add(resourceworkbookGirlOne);
        widgets.add(resourceworkbookBoyOne);
        widgets.add(resourceworkbookGirlTwo);
        widgets.add(resourceworkbookBoyTwo);
        widgets.add(resourcerequireOther);
        schoolClassification.setMultiWidgetSwitchListener(multiSwitcher);
        resourceDistributed.setMultiWidgetSwitchListener(multiSwitcher);


        schoolClassification.addDependentWidgets(schoolToggler.getToggleMap());
        level.addDependentWidgets(levelToggler.getToggleMap());


        return widgets;
    }

    private List<Widget> getSecondaryMonitoringRunningWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new SpinnerWidget(context, Keys.MONITORED_BY, "Monitored By", Arrays.asList(context.getResources().getStringArray(R.array.empty_list)), true));
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        final RadioWidget schoolClassification = new RadioWidget(context, Keys.SCHOOL_CLASSIFICATION, "Classification of School by Sex", true, "Girls", "Boys", "Co-ed");
        RadioWidget classClassification = new RadioWidget(context, Keys.CLASS_CLASSIFICATION, "Students in Class by Sex", true, "Girls", "Boys", "Co-ed");

        ToggleWidgetData schoolToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData coedSkipper = schoolToggler.addOption("Co-ed");
        coedSkipper.addWidgetToToggle(classClassification.hideView());
        coedSkipper.build();

        widgets.add(schoolClassification);
        widgets.add(classClassification);

        RadioSwitcher switcher = new RadioSwitcher(classClassification);
        switcher.add("Boys", "Boys");
        switcher.add("Girls", "Girls");
        schoolClassification.setWidgetSwitchListener(switcher);


        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_ID, "Teacher ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_NAME, "Name of Teacher", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());
        widgets.add(new RadioWidget(context, Keys.CLASS, "Class", true, "6", "7", "8", "9", "10"));
        widgets.add(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENDS, "Number of Students in Class", InputType.TYPE_CLASS_NUMBER, TWO, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.DURATION_OF_CLASS, "Time duration of class in minutes", InputType.TYPE_CLASS_NUMBER, THREE, true).build());

        ToggleWidgetData levelToggler = new ToggleWidgetData();
        RadioWidget level = new RadioWidget(context, Keys.LSBE_LEVEL, "LSBE Level", true, "Level 1", "Level 2");
        widgets.add(level.addHeader("LSBE Program"));

        ToggleWidgetData.SkipData levelOneSkipper = levelToggler.addOption("Level 1");
        widgets.add(levelOneSkipper.addWidgetToToggle(new SpinnerWidget(context, Keys.CHAPTERS_LEVEL_1, "LSBE Chapter - Level 1", Arrays.asList(context.getResources().getStringArray(R.array.level_one_chapters)), true)).hideView());
        levelOneSkipper.build();

        ToggleWidgetData.SkipData levelTwoSkipper = levelToggler.addOption("Level 2");
        widgets.add(levelTwoSkipper.addWidgetToToggle(new SpinnerWidget(context, Keys.CHAPTERS_LEVEL_2, "LSBE Chapter - Level 2", Arrays.asList(context.getResources().getStringArray(R.array.level_two_chapters)), true)).hideView());
        levelTwoSkipper.build();

        widgets.add(new RadioWidget(context, Keys.CSA_REVISION_OR_FIRSTTIME, "Revision or first time flashcard is being taught", true, "Revision", "First time"));

        ScoreWidget scoreWidget = new ScoreWidget(context, Keys.MONITORING_SCORE);
        ScoreCalculator scoreCalculator = new ScoreCalculator(scoreWidget);
        widgets.add(new RateWidget(context, Keys.USING_TEACHERS_GUIDE, "The teacher is actively using the teacher's guide to aid in facilitation of content", true).setScoreListener(scoreCalculator).addHeader("Facilitation"));
        widgets.add(new RateWidget(context, Keys.RELAYING_MAIN_MESSAGE, "The teacher is clearly relaying the main messages of the chapter, even if they are not actively using the teacher's guide", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.GOOD_UNDERSTANDING, "The teacher demonstrate good understanding of the LSBE content", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.PREPARED_MATERIAL, "The teacher had all materials prepared in advance for the class", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_WELL_PREPARED, "The teacher was well prepared to facilitate the session", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TIME_ALLOTED_FOR_ACTIVITY, "An appropriate amount of time is allotted for each activity and topic", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_COMFORTABLE_SPEAKING, "The teacher is comfortable speaking about this subject", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_JUDGEMENTAL_TONE, "The teacher uses a non-judgmental tone while facilitating the session", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_OWN_OPINIONS, "The teacher does not impose their own values or opinion on the participants", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_ENGAGING, "The teacher is engaging participants in discussion throughout session by providing probes", true).setScoreListener(scoreCalculator));

        widgets.add(new RateWidget(context, Keys.STUDENTS_UNDERSTAND_MESSAGE, "Students demonstrate clear understanding of the main messages of the chapter", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.STUDENTS_ACTIVELY_PARTICIPATE, "Students are actively participating in discussion on the chapter", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.STUDENTS_PAYING_ATTENTION, "Students are actively paying attention to the class while the teacher is instructing", true).setScoreListener(scoreCalculator));
        widgets.add(new RadioWidget(context, Keys.MANAGEMENT_INTEGRATED_LSBE, "Management has integrated the LSBE program into the school timetable", true, "Yes", "No").setScoreListener(scoreCalculator).addHeader("Management"));

        RadioWidget frequency = new RadioWidget(context, Keys.CLASS_FREQUENCY, "Frequency of class in time table", true, "Weekly", "Biweekly", "Monthly", "Other");
        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).build();
        ToggleWidgetData togglerOther = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = togglerOther.addOption("Other");
        skipData.addWidgetToToggle(other);
        skipData.build();
        frequency.addDependentWidgets(togglerOther.getToggleMap());

        widgets.add(frequency);
        widgets.add(other.hideView());
        widgets.add(new RadioWidget(context, Keys.TWO_TEACHER, "There are at least 2 teachers assigned to teach the LSBE program", true, "Yes", "No").setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.EXCELLENT_COORDINATION, "There is excellent coordination between management and teachers regarding the LSBE program", true).setScoreListener(scoreCalculator));
        widgets.add(scoreWidget);


        RadioWidget scheduleClass = new RadioWidget(context, Keys.CHALLENGE_SCHEDULING, "The school is facing challenges scheduling the LSBE class", true, "Yes", "No");
        widgets.add(scheduleClass.addHeader("Challenges"));
        ToggleWidgetData challengeToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        scheduleClass.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget enoughResource = new RadioWidget(context, Keys.ENOUGH_RESOURCES, "There are not enough resources", true, "Yes", "No");
        widgets.add(enoughResource);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.ENOUGH_RESOURCES_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        enoughResource.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noRoom = new RadioWidget(context, Keys.NO_ROOM_FOR_CLASS, "There is no room for the class", true, "Yes", "No");
        widgets.add(noRoom);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_ROOM_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        noRoom.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noTeacher = new RadioWidget(context, Keys.NO_TEACHER_FOR_CLASS, "There are not enough teachers to teach the CSA class", true, "Yes", "No");
        widgets.add(noTeacher);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_TEACHER_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        noTeacher.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget irreleventContent = new RadioWidget(context, Keys.IRRELEVENT_CONTENT, "The content is irrelevent for the context of the students", true, "Yes", "No");
        widgets.add(irreleventContent);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.IRRELEVENT_CONTENT_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        irreleventContent.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget studentNotInterested = new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED, "Student are not interested in the content", true, "Yes", "No");
        widgets.add(studentNotInterested);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        studentNotInterested.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget resourceRequire = new RadioWidget(context, Keys.SCHOOL_REQUIRE_RESOURCES, "Does this school require any resources?", true, "Yes", "No");
        widgets.add(resourceRequire.addHeader("Resources"));

        final Widget workbookGirlOne = new EditTextWidget.Builder(context, Keys.WORKBOOK_1_GIRLS, "Workbook level 1 - Girls", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget workbookBoyOne = new EditTextWidget.Builder(context, Keys.WORKBOOK_1_BOYS, "Workbook level 1 - Boys", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget workbookBoyTwo = new EditTextWidget.Builder(context, Keys.WORKBOOK_2_BOYS, "Workbook level 2 - Boys", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget workbookGirlTwo = new EditTextWidget.Builder(context, Keys.WORKBOOK_2_GIRLS, "Workbook level 2 - Girls", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget requireOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER, "Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, false).build().hideView();
        MultiSwitcher multiSwitcher = new MultiSwitcher(schoolClassification, resourceRequire);
        multiSwitcher.addNewOption().addKeys("Boys", "Yes").addWidgets(workbookBoyOne, workbookBoyTwo, requireOther).build();
        multiSwitcher.addNewOption().addKeys("Girls", "Yes").addWidgets(workbookGirlOne, workbookGirlTwo, requireOther).build();
        multiSwitcher.addNewOption().addKeys("Co-ed", "Yes").addWidgets(workbookBoyOne, workbookBoyTwo, workbookGirlOne, workbookGirlTwo, requireOther).build();
        widgets.add(workbookGirlOne);
        widgets.add(workbookBoyOne);
        widgets.add(workbookGirlTwo);
        widgets.add(workbookBoyTwo);
        widgets.add(requireOther);
        schoolClassification.setMultiWidgetSwitchListener(multiSwitcher);
        resourceRequire.setMultiWidgetSwitchListener(multiSwitcher);

        RadioWidget resourceDistributed = new RadioWidget(context, Keys.SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, "Yes", "No");
        final Widget resourceworkbookGirlOne = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_1_GIRLS, "Workbook level 1 - Girls", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget resourceworkbookBoyOne = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_1_BOYS, "Workbook level 1 - Boys", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget resourceworkbookBoyTwo = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_2_BOYS, "Workbook level 2 - Boys", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget resourceworkbookGirlTwo = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_2_GIRLS, "Workbook level 2 - Girls", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget resourcerequireOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER, "Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, false).build().hideView();
        multiSwitcher = new MultiSwitcher(schoolClassification, resourceDistributed);
        multiSwitcher.addNewOption().addKeys("Boys", "Yes").addWidgets(resourceworkbookBoyOne, resourceworkbookBoyTwo, resourcerequireOther).build();
        multiSwitcher.addNewOption().addKeys("Girls", "Yes").addWidgets(resourceworkbookGirlOne, resourceworkbookGirlTwo, resourcerequireOther).build();
        multiSwitcher.addNewOption().addKeys("Co-ed", "Yes").addWidgets(resourceworkbookBoyOne, resourceworkbookBoyTwo, resourceworkbookGirlOne, resourceworkbookGirlTwo, resourcerequireOther).build();
        widgets.add(resourceDistributed);
        widgets.add(resourceworkbookGirlOne);
        widgets.add(resourceworkbookBoyOne);
        widgets.add(resourceworkbookGirlTwo);
        widgets.add(resourceworkbookBoyTwo);
        widgets.add(resourcerequireOther);
        schoolClassification.setMultiWidgetSwitchListener(multiSwitcher);
        resourceDistributed.setMultiWidgetSwitchListener(multiSwitcher);


        schoolClassification.addDependentWidgets(schoolToggler.getToggleMap());
        level.addDependentWidgets(levelToggler.getToggleMap());


        return widgets;
    }

    private List<Widget> getSecondaryMonitoringNewWidgets() {
        List<Widget> widgets = new ArrayList<>();

        widgets.add(new SpinnerWidget(context, Keys.MONITORED_BY, "Monitored By", Arrays.asList(context.getResources().getStringArray(R.array.empty_list)), true));
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        final RadioWidget schoolClassification = new RadioWidget(context, Keys.SCHOOL_CLASSIFICATION, "Classification of School by Sex", true, "Girls", "Boys", "Co-ed");
        RadioWidget classClassification = new RadioWidget(context, Keys.CLASS_CLASSIFICATION, "Students in Class by Sex", true, "Girls", "Boys", "Co-ed");

        ToggleWidgetData schoolToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData coedSkipper = schoolToggler.addOption("Co-ed");
        coedSkipper.addWidgetToToggle(classClassification.hideView());
        coedSkipper.build();

        widgets.add(schoolClassification);
        widgets.add(classClassification);

        RadioSwitcher switcher = new RadioSwitcher(classClassification);
        switcher.add("Boys", "Boys");
        switcher.add("Girls", "Girls");
        schoolClassification.setWidgetSwitchListener(switcher);


        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_ID, "Teacher ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_NAME, "Name of Teacher", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());
        widgets.add(new RadioWidget(context, Keys.CLASS, "Class", true, "6", "7", "8", "9", "10"));
        widgets.add(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENDS, "Number of Students in Class", InputType.TYPE_CLASS_NUMBER, TWO, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.DURATION_OF_CLASS, "Time duration of class in minutes", InputType.TYPE_CLASS_NUMBER, THREE, true).build());

        ToggleWidgetData levelToggler = new ToggleWidgetData();
        RadioWidget level = new RadioWidget(context, Keys.LSBE_LEVEL, "LSBE Level", true, "Level 1", "Level 2");
        widgets.add(level.addHeader("LSBE Program"));

        ToggleWidgetData.SkipData levelOneSkipper = levelToggler.addOption("Level 1");
        widgets.add(levelOneSkipper.addWidgetToToggle(new SpinnerWidget(context, Keys.CHAPTERS_LEVEL_1, "LSBE Chapter - Level 1", Arrays.asList(context.getResources().getStringArray(R.array.level_one_chapters)), true)).hideView());
        levelOneSkipper.build();

        ToggleWidgetData.SkipData levelTwoSkipper = levelToggler.addOption("Level 2");
        widgets.add(levelTwoSkipper.addWidgetToToggle(new SpinnerWidget(context, Keys.CHAPTERS_LEVEL_2, "LSBE Chapter - Level 2", Arrays.asList(context.getResources().getStringArray(R.array.level_two_chapters)), true)).hideView());
        levelTwoSkipper.build();

        widgets.add(new RadioWidget(context, Keys.CSA_REVISION_OR_FIRSTTIME, "Revision or first time flashcard is being taught", true, "Revision", "First time"));

        ScoreWidget scoreWidget = new ScoreWidget(context, Keys.MONITORING_SCORE);
        ScoreCalculator scoreCalculator = new ScoreCalculator(scoreWidget);
        widgets.add(new RateWidget(context, Keys.USING_TEACHERS_GUIDE, "The teacher is actively using the teacher's guide to aid in facilitation of content", true).setScoreListener(scoreCalculator).addHeader("Facilitation"));
        widgets.add(new RateWidget(context, Keys.RELAYING_MAIN_MESSAGE, "The teacher is clearly relaying the main messages of the chapter, even if they are not actively using the teacher's guide", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.GOOD_UNDERSTANDING, "The teacher demonstrate good understanding of the LSBE content", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.PREPARED_MATERIAL, "The teacher had all materials prepared in advance for the class", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_WELL_PREPARED, "The teacher was well prepared to facilitate the session", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TIME_ALLOTED_FOR_ACTIVITY, "An appropriate amount of time is allotted for each activity and topic", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_COMFORTABLE_SPEAKING, "The teacher is comfortable speaking about this subject", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_JUDGEMENTAL_TONE, "The teacher uses a non-judgmental tone while facilitating the session", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_OWN_OPINIONS, "The teacher does not impose their own values or opinion on the participants", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_ENGAGING, "The teacher is engaging participants in discussion throughout session by providing probes", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.STUDENTS_UNDERSTAND_MESSAGE, "Students demonstrate clear understanding of the main messages of the chapter", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.STUDENTS_ACTIVELY_PARTICIPATE, "Students are actively participating in discussion on the chapter", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.STUDENTS_PAYING_ATTENTION, "Students are actively paying attention to the class while the teacher is instructing", true).setScoreListener(scoreCalculator));
        widgets.add(new RadioWidget(context, Keys.MANAGEMENT_INTEGRATED_LSBE, "Management has integrated the LSBE program into the school timetable", true, "Yes", "No").setScoreListener(scoreCalculator).addHeader("Management"));

        RadioWidget frequency = new RadioWidget(context, Keys.CLASS_FREQUENCY, "Frequency of class in time table", true, "Weekly", "Biweekly", "Monthly", "Other");
        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).build();
        ToggleWidgetData togglerOther = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = togglerOther.addOption("Other");
        skipData.addWidgetToToggle(other);
        skipData.build();
        frequency.addDependentWidgets(togglerOther.getToggleMap());

        widgets.add(frequency);
        widgets.add(other.hideView());
        widgets.add(new RadioWidget(context, Keys.TWO_TEACHER, "There are at least 2 teachers assigned to teach the LSBE program", true, "Yes", "No").setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.EXCELLENT_COORDINATION, "There is excellent coordination between management and teachers regarding the LSBE program", true).setScoreListener(scoreCalculator));
        widgets.add(scoreWidget);


        RadioWidget scheduleClass = new RadioWidget(context, Keys.CHALLENGE_SCHEDULING, "The school is facing challenges scheduling the LSBE class", true, "Yes", "No");
        widgets.add(scheduleClass.addHeader("Challenges"));
        ToggleWidgetData challengeToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        scheduleClass.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget enoughResource = new RadioWidget(context, Keys.ENOUGH_RESOURCES, "There are not enough resources", true, "Yes", "No");
        widgets.add(enoughResource);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.ENOUGH_RESOURCES_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        enoughResource.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noRoom = new RadioWidget(context, Keys.NO_ROOM_FOR_CLASS, "There is no room for the class", true, "Yes", "No");
        widgets.add(noRoom);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_ROOM_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        noRoom.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noTeacher = new RadioWidget(context, Keys.NO_TEACHER_FOR_CLASS, "There are not enough teachers to teach the CSA class", true, "Yes", "No");
        widgets.add(noTeacher);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_TEACHER_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        noTeacher.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget irreleventContent = new RadioWidget(context, Keys.IRRELEVENT_CONTENT, "The content is irrelevent for the context of the students", true, "Yes", "No");
        widgets.add(irreleventContent);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.IRRELEVENT_CONTENT_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        irreleventContent.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget studentNotInterested = new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED, "Student are not interested in the content", true, "Yes", "No");
        widgets.add(studentNotInterested);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        studentNotInterested.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget resourceRequire = new RadioWidget(context, Keys.SCHOOL_REQUIRE_RESOURCES, "Does this school require any resources?", true, "Yes", "No");
        widgets.add(resourceRequire.addHeader("Resources"));

        final Widget workbookGirlOne = new EditTextWidget.Builder(context, Keys.WORKBOOK_1_GIRLS, "Workbook level 1 - Girls", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget workbookBoyOne = new EditTextWidget.Builder(context, Keys.WORKBOOK_1_BOYS, "Workbook level 1 - Boys", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget workbookBoyTwo = new EditTextWidget.Builder(context, Keys.WORKBOOK_2_BOYS, "Workbook level 2 - Boys", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget workbookGirlTwo = new EditTextWidget.Builder(context, Keys.WORKBOOK_2_GIRLS, "Workbook level 2 - Girls", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget requireOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER, "Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, false).build().hideView();
        MultiSwitcher multiSwitcher = new MultiSwitcher(schoolClassification, resourceRequire);
        multiSwitcher.addNewOption().addKeys("Boys", "Yes").addWidgets(workbookBoyOne, workbookBoyTwo, requireOther).build();
        multiSwitcher.addNewOption().addKeys("Girls", "Yes").addWidgets(workbookGirlOne, workbookGirlTwo, requireOther).build();
        multiSwitcher.addNewOption().addKeys("Co-ed", "Yes").addWidgets(workbookBoyOne, workbookBoyTwo, workbookGirlOne, workbookGirlTwo, requireOther).build();
        widgets.add(workbookGirlOne);
        widgets.add(workbookBoyOne);
        widgets.add(workbookGirlTwo);
        widgets.add(workbookBoyTwo);
        widgets.add(requireOther);
        schoolClassification.setMultiWidgetSwitchListener(multiSwitcher);
        resourceRequire.setMultiWidgetSwitchListener(multiSwitcher);

        RadioWidget resourceDistributed = new RadioWidget(context, Keys.SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, "Yes", "No");
        final Widget resourceworkbookGirlOne = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_1_GIRLS, "Workbook level 1 - Girls", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget resourceworkbookBoyOne = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_1_BOYS, "Workbook level 1 - Boys", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget resourceworkbookBoyTwo = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_2_BOYS, "Workbook level 2 - Boys", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget resourceworkbookGirlTwo = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_2_GIRLS, "Workbook level 2 - Girls", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget resourcerequireOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER, "Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, false).build().hideView();
        multiSwitcher = new MultiSwitcher(schoolClassification, resourceDistributed);
        multiSwitcher.addNewOption().addKeys("Boys", "Yes").addWidgets(resourceworkbookBoyOne, resourceworkbookBoyTwo, resourcerequireOther).build();
        multiSwitcher.addNewOption().addKeys("Girls", "Yes").addWidgets(resourceworkbookGirlOne, resourceworkbookGirlTwo, resourcerequireOther).build();
        multiSwitcher.addNewOption().addKeys("Co-ed", "Yes").addWidgets(resourceworkbookBoyOne, resourceworkbookBoyTwo, resourceworkbookGirlOne, resourceworkbookGirlTwo, resourcerequireOther).build();
        widgets.add(resourceDistributed);
        widgets.add(resourceworkbookGirlOne);
        widgets.add(resourceworkbookBoyOne);
        widgets.add(resourceworkbookGirlTwo);
        widgets.add(resourceworkbookBoyTwo);
        widgets.add(resourcerequireOther);
        schoolClassification.setMultiWidgetSwitchListener(multiSwitcher);
        resourceDistributed.setMultiWidgetSwitchListener(multiSwitcher);


        schoolClassification.addDependentWidgets(schoolToggler.getToggleMap());
        level.addDependentWidgets(levelToggler.getToggleMap());

        return widgets;
    }

    private List<Widget> getPrimaryMonitoringExitWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new SpinnerWidget(context, Keys.MONITORED_BY, "Monitored By", Arrays.asList(context.getResources().getStringArray(R.array.empty_list)), true));
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        RadioWidget schoolClassification = new RadioWidget(context, Keys.SCHOOL_CLASSIFICATION, "Classification of School by Sex", true, "Girls", "Boys", "Co-ed");
        RadioWidget classClassification = new RadioWidget(context, Keys.CLASS_CLASSIFICATION, "Students in Class by Sex", true, "Girls", "Boys", "Co-ed");

        ToggleWidgetData toggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData coedSkipper = toggler.addOption("Co-ed");
        coedSkipper.addWidgetToToggle(classClassification.hideView());
        coedSkipper.build();

        widgets.add(schoolClassification);
        widgets.add(classClassification);

        RadioSwitcher switcher = new RadioSwitcher(classClassification);
        switcher.add("Boys", "Boys");
        switcher.add("Girls", "Girls");
        schoolClassification.setWidgetSwitchListener(switcher);

        schoolClassification.addDependentWidgets(toggler.getToggleMap());
        RadioWidget program = new RadioWidget(context, Keys.PRIMARY_PROGRAM, "Primary Program", true, "CSA", "Gender");
        widgets.add(program);
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_ID, "Teacher ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_NAME, "Name of Teacher", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());
        widgets.add(new RadioWidget(context, Keys.CLASS, "Class", true, "1", "2", "3", "4", "5"));

        ToggleWidgetData programToggle = new ToggleWidgetData();
        ToggleWidgetData.SkipData csaSkipper = programToggle.addOption("CSA");

        widgets.add(csaSkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.CSA_FLASHCARD, LinearLayout.HORIZONTAL, "CSA Flashcard being run", true, context.getResources().getStringArray(R.array.csa_flashcard)).addHeader("CSA Program").hideView()));
        widgets.add(csaSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CSA_REVISION_OR_FIRSTTIME, "Revision or first time flashcard is being taught", true, "Revision", "First time")).hideView());

        ScoreWidget csaScoreWidget = new ScoreWidget(context, Keys.CSA_PROGRAM_SCORE);
        ScoreCalculator csaScoreCalculator = new ScoreCalculator(csaScoreWidget);

        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_USING_FLASHCARD, "The teacher is using the prompts provided in the CSA flashcard guide", true).setScoreListener(csaScoreCalculator).addHeader("Facilitation")).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_MEETING_OBJECTIVE, "The teacher is meeting the objective of each flashcard even if they are not using all prompts provided in the CSA flashcard guide ", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_HAD_MATERIAL, "The teacher had all materials prepared in advance for the class", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_WELL_PREPARED, "The teacher was well prepared to facilitate the session", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TIME_ALLOTED_FOR_ACTIVITY, "An appropriate amount of time is allotted for each activity and topic", true).setScoreListener(csaScoreCalculator)).hideView());

        RadioWidget newActivity = new RadioWidget(context, Keys.NEW_ACTIVITIES, "Teacher has gone beyond the teacher's guide to build on and/or develop new activities", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(newActivity).hideView());
        ToggleWidgetData toggleActivities = new ToggleWidgetData();
        ToggleWidgetData.SkipData activitySkipper = toggleActivities.addOption("Yes");
        widgets.add(activitySkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.TEACHERS_NEW, LinearLayout.VERTICAL, "What has the teacher done that is new?", true, context.getResources().getStringArray(R.array.activities)).hideView()).hideView());
        activitySkipper.build();
        newActivity.addDependentWidgets(toggleActivities.getToggleMap());

        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_COMFORTABLE_SPEAKING, "The teacher is comfortable speaking about this subject", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_JUDGEMENTAL_TONE, "The teacher uses a non-judgmental tone while facilitating the session", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_OWN_OPINIONS, "The teacher does not impose their own values or opinion on the participants", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.STUDENTS_ENGAGEMENT, "Students are engaged in discussion on flashcard(s)", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.STUDENTS_UNDERSTAND_MESSAGE, "Students understand the main messages of the flashcard(s)", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.STUDENTS_PAYING_ATTENTION, "Students are actively paying attention to the class while the teacher is instructing", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RadioWidget(context, Keys.MANAGEMENT_INTEGRATED_CSA, "Management has integrated the CSA program into the school timetable", true, "Yes", "No").setScoreListener(csaScoreCalculator).addHeader("Management")).hideView());

        RadioWidget frequency = new RadioWidget(context, Keys.CLASS_FREQUENCY, "Frequency of class in time table", true, "Weekly", "Biweekly", "Monthly", "Other");
        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).build();
        ToggleWidgetData togglerOther = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = togglerOther.addOption("Other");
        skipData.addWidgetToToggle(other);
        skipData.build();
        frequency.addDependentWidgets(togglerOther.getToggleMap());

        widgets.add(csaSkipper.addWidgetToToggle(frequency).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(other.hideView()).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RadioWidget(context, Keys.TWO_TEACHER_CSA, "There are at least 2 teachers assigned to teach the CSA program", true, "Yes", "No").setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.EXCELLENT_COORDINATION, "There is excellent coordination between management and teachers regarding the CSA program", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.MASTER_TRAINERS, "Number of Master Training leading CSA program", InputType.TYPE_CLASS_NUMBER, TWO, true).build()));
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.COORDINATION_WITH_MASTER_TRAINERS, "There is excellent coordination between Master Trainers and teachers regarding the CSA program", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_CONDUCT_SESSION, "Master Trainer conduct regular monitoring sessions to maintain quality of CSA program", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_REFRESHER_TRAINING, "Master Trainer arrange and conduct refresher trainings as needed for CSA teachers", true).setScoreListener(csaScoreCalculator)).hideView());

        widgets.add(csaSkipper.addWidgetToToggle(csaScoreWidget).hideView());

        RadioWidget scheduleCSA = new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_CSA, "The school is facing challenges scheduling the CSA class", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(scheduleCSA.addHeader("Challenges")).hideView());
        ToggleWidgetData challengeToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_CSA_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        scheduleCSA.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget enoughResource = new RadioWidget(context, Keys.ENOUGH_RESOURCES, "There are not enough resources", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(enoughResource).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.ENOUGH_RESOURCES_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        enoughResource.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noRoom = new RadioWidget(context, Keys.NO_ROOM_FOR_CLASS, "There is no room for the class", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(noRoom).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_ROOM_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        noRoom.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noTeacher = new RadioWidget(context, Keys.NO_TEACHER_FOR_CLASS, "There are not enough teachers to teach the CSA class", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(noTeacher).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_TEACHER_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        noTeacher.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget irreleventContent = new RadioWidget(context, Keys.IRRELEVENT_CONTENT, "The content is irrelevent for the context of the students", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(irreleventContent).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.IRRELEVENT_CONTENT_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        irreleventContent.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget studentNotInterested = new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED, "Student are not interested in the content", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(studentNotInterested).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        studentNotInterested.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget resourceRequire = new RadioWidget(context, Keys.SCHOOL_REQUIRE_RESOURCES, "Does this school require any resources?", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(resourceRequire.addHeader("Resources")).hideView());
        ToggleWidgetData resourceToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData resourceSkipper = resourceToggler.addOption("Yes");
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_FLASHCARD_GUIDES, "CSA Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER, "Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, false).build()).hideView());
        resourceSkipper.build();
        resourceRequire.addDependentWidgets(resourceToggler.getToggleMap());

        RadioWidget resourceDistributed = new RadioWidget(context, Keys.CSA_SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(resourceDistributed).hideView());
        resourceToggler = new ToggleWidgetData();
        resourceSkipper = resourceToggler.addOption("Yes");
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_FLASHCARD_GUIDES, "CSA Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_OTHER, "Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, false).build()).hideView());
        resourceSkipper.build();
        resourceDistributed.addDependentWidgets(resourceToggler.getToggleMap());
        csaSkipper.build();

        ToggleWidgetData.SkipData genderSkipper = programToggle.addOption("Gender");
        widgets.add(genderSkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.GENDER_FLASHCARD_RUN, LinearLayout.VERTICAL, "Gender Flashcard being run", true, context.getResources().getStringArray(R.array.gender_flashcard)).addHeader("Gender Program").hideView()));
        widgets.add(genderSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_REVISION_OR_FIRSTTIME, "Revision or first time flashcard is being taught", true, "Revision", "First time")));

        ScoreWidget genderScoreWidget = new ScoreWidget(context, Keys.GENDER_PROGRAM_SCORE);
        ScoreCalculator genderScoreCalculator = new ScoreCalculator(genderScoreWidget);

        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_USING_FLASHCARD, "The teacher is using the prompts provided in the Gender flashcard guide", true).setScoreListener(genderScoreCalculator).addHeader("Facilitation")).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_MEETING_OBJECTIVE, "The teacher is meeting the objective of each flashcard even if they are not using all prompts provided in the Gender flashcard guide ", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_HAD_MATERIAL, "The teacher had all materials prepared in advance for the class", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_WELL_PREPARED, "The teacher was well prepared to facilitate the session", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TIME_ALLOTED_FOR_ACTIVITY, "An appropriate amount of time is allotted for each activity and topic", true).setScoreListener(genderScoreCalculator)).hideView());

        newActivity = new RadioWidget(context, Keys.NEW_ACTIVITIES, "Teacher has gone beyond the teacher's guide to build on and/or develop new activities", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(newActivity).hideView());
        toggleActivities = new ToggleWidgetData();
        activitySkipper = toggleActivities.addOption("Yes");
        widgets.add(activitySkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.TEACHERS_NEW, LinearLayout.VERTICAL, "What has the teacher done that is new?", true, context.getResources().getStringArray(R.array.activities)).hideView()).hideView());
        activitySkipper.build();
        newActivity.addDependentWidgets(toggleActivities.getToggleMap());


        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_COMFORTABLE_SPEAKING, "The teacher is comfortable speaking about this subject", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_JUDGEMENTAL_TONE, "The teacher uses a non-judgmental tone while facilitating the session", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_OWN_OPINIONS, "The teacher does not impose their own values or opinion on the participants", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_STUDENTS_ENGAGEMENT, "Students are engaged in discussion on flashcard(s)", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_STUDENTS_UNDERSTAND_MESSAGE, "Students understand the main messages of the flashcard(s)", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_STUDENTS_PAYING_ATTENTION, "Students are actively paying attention to the class while the teacher is instructing", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_MANAGEMENT_INTEGRATED_CSA, "Management has integrated the Gender program into the school timetable", true, "Yes", "No").setScoreListener(genderScoreCalculator).addHeader("Management")).hideView());


        frequency = new RadioWidget(context, Keys.GENDER_CLASS_FREQUENCY, "Frequency of class in time table", true, "Weekly", "Biweekly", "Monthly", "Other");
        other = new EditTextWidget.Builder(context, Keys.GENDER_OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).build();
        togglerOther = new ToggleWidgetData();
        skipData = togglerOther.addOption("Other");
        skipData.addWidgetToToggle(other);
        skipData.build();
        frequency.addDependentWidgets(togglerOther.getToggleMap());

        widgets.add(genderSkipper.addWidgetToToggle(frequency).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(other.hideView()).hideView());

        widgets.add(genderSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_TWO_TEACHER_CSA, "There are at least 2 teachers assigned to teach the Gender program", true, "Yes", "No").setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_EXCELLENT_COORDINATION, "There is excellent coordination between management and teachers regarding the Gender program", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(genderScoreWidget).hideView());


        RadioWidget scheduleGender = new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_GENDER, "The school is facing challenges scheduling the Gender class", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(scheduleGender.addHeader("Challenges")).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_CSA_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        scheduleGender.addDependentWidgets(challengeToggler.getToggleMap());

        enoughResource = new RadioWidget(context, Keys.ENOUGH_RESOURCES, "There are not enough resources", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(enoughResource).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.ENOUGH_RESOURCES_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        enoughResource.addDependentWidgets(challengeToggler.getToggleMap());

        noRoom = new RadioWidget(context, Keys.NO_ROOM_FOR_CLASS, "There is no room for the class", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(noRoom).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_ROOM_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        noRoom.addDependentWidgets(challengeToggler.getToggleMap());

        noTeacher = new RadioWidget(context, Keys.NO_TEACHER_FOR_CLASS, "There are not enough teachers to teach the Gender class", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(noTeacher).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_TEACHER_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        noTeacher.addDependentWidgets(challengeToggler.getToggleMap());

        irreleventContent = new RadioWidget(context, Keys.IRRELEVENT_CONTENT, "The content is irrelevent for the context of the students", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(irreleventContent).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.IRRELEVENT_CONTENT_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        irreleventContent.addDependentWidgets(challengeToggler.getToggleMap());

        studentNotInterested = new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED, "Student are not interested in the content", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(studentNotInterested).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        studentNotInterested.addDependentWidgets(challengeToggler.getToggleMap());


        RadioWidget genderResourceRequire = new RadioWidget(context, Keys.SCHOOL_REQUIRE_RESOURCES, "Does this school require any resources?", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(genderResourceRequire.addHeader("Resources")).hideView());
        ToggleWidgetData genderResourceToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData genderResourceSkipper = genderResourceToggler.addOption("Yes");
        widgets.add(genderResourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_FLASHCARD_GUIDES, "Gender Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(genderResourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(genderResourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_OTHER, "Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, false).build()).hideView());
        genderResourceSkipper.build();
        genderResourceRequire.addDependentWidgets(genderResourceToggler.getToggleMap());

        RadioWidget genderResourceDistributed = new RadioWidget(context, Keys.GENDER_SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(genderResourceDistributed).hideView());
        genderResourceToggler = new ToggleWidgetData();
        genderResourceSkipper = genderResourceToggler.addOption("Yes");
        widgets.add(genderResourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_FLASHCARD_GUIDES, "Gender Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(genderResourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(genderResourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_OTHER, "Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, false).build()).hideView());
        genderResourceSkipper.build();
        genderResourceDistributed.addDependentWidgets(genderResourceToggler.getToggleMap());

        genderSkipper.build();
        program.addDependentWidgets(programToggle.getToggleMap());

        return widgets;
    }

    private List<Widget> getPrimaryMonitoringRunningWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new SpinnerWidget(context, Keys.MONITORED_BY, "Monitored By", Arrays.asList(context.getResources().getStringArray(R.array.empty_list)), true));
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
     /*   widgets.add(new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true));
        widgets.add(new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district)), true));
*/
        RadioWidget schoolClassification = new RadioWidget(context, Keys.SCHOOL_CLASSIFICATION, "Classification of School by Sex", true, "Girls", "Boys", "Co-ed");
        RadioWidget classClassification = new RadioWidget(context, Keys.CLASS_CLASSIFICATION, "Students in Class by Sex", true, "Girls", "Boys", "Co-ed");

        ToggleWidgetData toggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData coedSkipper = toggler.addOption("Co-ed");
        coedSkipper.addWidgetToToggle(classClassification.hideView());
        coedSkipper.build();

        widgets.add(schoolClassification);
        widgets.add(classClassification);

        RadioSwitcher switcher = new RadioSwitcher(classClassification);
        switcher.add("Boys", "Boys");
        switcher.add("Girls", "Girls");
        schoolClassification.setWidgetSwitchListener(switcher);

        schoolClassification.addDependentWidgets(toggler.getToggleMap());
        RadioWidget program = new RadioWidget(context, Keys.PRIMARY_PROGRAM, "Primary Program", true, "CSA", "Gender");
        widgets.add(program);
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_ID, "Teacher ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_NAME, "Name of Teacher", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());
        widgets.add(new RadioWidget(context, Keys.CLASS, "Class", true, "1", "2", "3", "4", "5"));
        widgets.add(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENDS, "Number of Students in Class", InputType.TYPE_CLASS_NUMBER, TWO, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.DURATION_OF_CLASS, "Time duration of class in minutes", InputType.TYPE_CLASS_NUMBER, THREE, true).build());

        ToggleWidgetData programToggle = new ToggleWidgetData();
        ToggleWidgetData.SkipData csaSkipper = programToggle.addOption("CSA");

        widgets.add(csaSkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.CSA_FLASHCARD, LinearLayout.HORIZONTAL, "CSA Flashcard being run", true, context.getResources().getStringArray(R.array.csa_flashcard)).addHeader("CSA Program").hideView()));
        widgets.add(csaSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CSA_REVISION_OR_FIRSTTIME, "Revision or first time flashcard is being taught", true, "Revision", "First time")).hideView());

        ScoreWidget csaScoreWidget = new ScoreWidget(context, Keys.CSA_PROGRAM_SCORE);
        ScoreCalculator csaScoreCalculator = new ScoreCalculator(csaScoreWidget);

        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_USING_FLASHCARD, "The teacher is using the prompts provided in the CSA flashcard guide", true).setScoreListener(csaScoreCalculator).addHeader("Facilitation")).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_MEETING_OBJECTIVE, "The teacher is meeting the objective of each flashcard even if they are not using all prompts provided in the CSA flashcard guide ", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_HAD_MATERIAL, "The teacher had all materials prepared in advance for the class", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_WELL_PREPARED, "The teacher was well prepared to facilitate the session", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TIME_ALLOTED_FOR_ACTIVITY, "An appropriate amount of time is allotted for each activity and topic", true).setScoreListener(csaScoreCalculator)).hideView());

        RadioWidget newActivity = new RadioWidget(context, Keys.NEW_ACTIVITIES, "Teacher has gone beyond the teacher's guide to build on and/or develop new activities", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(newActivity).hideView());
        ToggleWidgetData toggleActivities = new ToggleWidgetData();
        ToggleWidgetData.SkipData activitySkipper = toggleActivities.addOption("Yes");
        widgets.add(activitySkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.TEACHERS_NEW, LinearLayout.VERTICAL, "What has the teacher done that is new?", true, context.getResources().getStringArray(R.array.activities)).hideView()).hideView());
        activitySkipper.build();
        newActivity.addDependentWidgets(toggleActivities.getToggleMap());

        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_COMFORTABLE_SPEAKING, "The teacher is comfortable speaking about this subject", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_JUDGEMENTAL_TONE, "The teacher uses a non-judgmental tone while facilitating the session", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_OWN_OPINIONS, "The teacher does not impose their own values or opinion on the participants", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.STUDENTS_ENGAGEMENT, "Students are engaged in discussion on flashcard(s)", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.STUDENTS_UNDERSTAND_MESSAGE, "Students understand the main messages of the flashcard(s)", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.STUDENTS_PAYING_ATTENTION, "Students are actively paying attention to the class while the teacher is instructing", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RadioWidget(context, Keys.MANAGEMENT_INTEGRATED_CSA, "Management has integrated the CSA program into the school timetable", true, "Yes", "No").setScoreListener(csaScoreCalculator).addHeader("Management")).hideView());

        RadioWidget frequency = new RadioWidget(context, Keys.CLASS_FREQUENCY, "Frequency of class in time table", true, "Weekly", "Biweekly", "Monthly", "Other");
        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).build();
        ToggleWidgetData togglerOther = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = togglerOther.addOption("Other");
        skipData.addWidgetToToggle(other);
        skipData.build();
        frequency.addDependentWidgets(togglerOther.getToggleMap());

        widgets.add(csaSkipper.addWidgetToToggle(frequency).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(other.hideView()).hideView());

        widgets.add(csaSkipper.addWidgetToToggle(new RadioWidget(context, Keys.TWO_TEACHER_CSA, "There are at least 2 teachers assigned to teach the CSA program", true, "Yes", "No").setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.EXCELLENT_COORDINATION, "There is excellent coordination between management and teachers regarding the CSA program", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(csaScoreWidget).hideView());

        RadioWidget scheduleCSA = new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_CSA, "The school is facing challenges scheduling the CSA class", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(scheduleCSA.addHeader("Challenges")).hideView());
        ToggleWidgetData challengeToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_CSA_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        scheduleCSA.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget enoughResource = new RadioWidget(context, Keys.ENOUGH_RESOURCES, "There are not enough resources", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(enoughResource).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.ENOUGH_RESOURCES_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        enoughResource.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noRoom = new RadioWidget(context, Keys.NO_ROOM_FOR_CLASS, "There is no room for the class", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(noRoom).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_ROOM_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        noRoom.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noTeacher = new RadioWidget(context, Keys.NO_TEACHER_FOR_CLASS, "There are not enough teachers to teach the CSA class", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(noTeacher).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_TEACHER_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        noTeacher.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget irreleventContent = new RadioWidget(context, Keys.IRRELEVENT_CONTENT, "The content is irrelevent for the context of the students", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(irreleventContent).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.IRRELEVENT_CONTENT_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        irreleventContent.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget studentNotInterested = new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED, "Student are not interested in the content", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(studentNotInterested).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        studentNotInterested.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget resourceRequire = new RadioWidget(context, Keys.SCHOOL_REQUIRE_RESOURCES, "Does this school require any resources?", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(resourceRequire.addHeader("Resources")).hideView());
        ToggleWidgetData resourceToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData resourceSkipper = resourceToggler.addOption("Yes");
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_FLASHCARD_GUIDES, "CSA Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER, "Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, false).build()).hideView());
        resourceSkipper.build();
        resourceRequire.addDependentWidgets(resourceToggler.getToggleMap());

        RadioWidget resourceDistributed = new RadioWidget(context, Keys.CSA_SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(resourceDistributed).hideView());
        resourceToggler = new ToggleWidgetData();
        resourceSkipper = resourceToggler.addOption("Yes");
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_FLASHCARD_GUIDES, "CSA Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_OTHER, "Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, false).build()).hideView());
        resourceSkipper.build();
        resourceDistributed.addDependentWidgets(resourceToggler.getToggleMap());
        csaSkipper.build();

        ToggleWidgetData.SkipData genderSkipper = programToggle.addOption("Gender");
        widgets.add(genderSkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.GENDER_FLASHCARD_RUN, LinearLayout.VERTICAL, "Gender Flashcard being run", true, context.getResources().getStringArray(R.array.gender_flashcard)).addHeader("Gender Program").hideView()));
        widgets.add(genderSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_REVISION_OR_FIRSTTIME, "Revision or first time flashcard is being taught", true, "Revision", "First time")));

        ScoreWidget genderScoreWidget = new ScoreWidget(context, Keys.GENDER_PROGRAM_SCORE);
        ScoreCalculator genderScoreCalculator = new ScoreCalculator(genderScoreWidget);

        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_USING_FLASHCARD, "The teacher is using the prompts provided in the Gender flashcard guide", true).setScoreListener(genderScoreCalculator).addHeader("Facilitation")).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_MEETING_OBJECTIVE, "The teacher is meeting the objective of each flashcard even if they are not using all prompts provided in the Gender flashcard guide ", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_HAD_MATERIAL, "The teacher had all materials prepared in advance for the class", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_WELL_PREPARED, "The teacher was well prepared to facilitate the session", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TIME_ALLOTED_FOR_ACTIVITY, "An appropriate amount of time is allotted for each activity and topic", true).setScoreListener(genderScoreCalculator)).hideView());

        newActivity = new RadioWidget(context, Keys.NEW_ACTIVITIES, "Teacher has gone beyond the teacher's guide to build on and/or develop new activities", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(newActivity).hideView());
        toggleActivities = new ToggleWidgetData();
        activitySkipper = toggleActivities.addOption("Yes");
        widgets.add(activitySkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.TEACHERS_NEW, LinearLayout.VERTICAL, "What has the teacher done that is new?", true, context.getResources().getStringArray(R.array.activities)).hideView()).hideView());
        activitySkipper.build();
        newActivity.addDependentWidgets(toggleActivities.getToggleMap());


        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_COMFORTABLE_SPEAKING, "The teacher is comfortable speaking about this subject", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_JUDGEMENTAL_TONE, "The teacher uses a non-judgmental tone while facilitating the session", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_OWN_OPINIONS, "The teacher does not impose their own values or opinion on the participants", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_STUDENTS_ENGAGEMENT, "Students are engaged in discussion on flashcard(s)", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_STUDENTS_UNDERSTAND_MESSAGE, "Students understand the main messages of the flashcard(s)", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_STUDENTS_PAYING_ATTENTION, "Students are actively paying attention to the class while the teacher is instructing", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_MANAGEMENT_INTEGRATED_CSA, "Management has integrated the Gender program into the school timetable", true, "Yes", "No").setScoreListener(genderScoreCalculator).addHeader("Management")).hideView());


        frequency = new RadioWidget(context, Keys.GENDER_CLASS_FREQUENCY, "Frequency of class in time table", true, "Weekly", "Biweekly", "Monthly", "Other");
        other = new EditTextWidget.Builder(context, Keys.GENDER_OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).build();
        togglerOther = new ToggleWidgetData();
        skipData = togglerOther.addOption("Other");
        skipData.addWidgetToToggle(other);
        skipData.build();
        frequency.addDependentWidgets(togglerOther.getToggleMap());

        widgets.add(genderSkipper.addWidgetToToggle(frequency).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(other.hideView()).hideView());

        widgets.add(genderSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_TWO_TEACHER_CSA, "There are at least 2 teachers assigned to teach the Gender program", true, "Yes", "No").setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_EXCELLENT_COORDINATION, "There is excellent coordination between management and teachers regarding the Gender program", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(genderScoreWidget).hideView());


        RadioWidget scheduleGender = new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_GENDER, "The school is facing challenges scheduling the Gender class", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(scheduleGender.addHeader("Challenges")).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_CSA_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        scheduleGender.addDependentWidgets(challengeToggler.getToggleMap());

        enoughResource = new RadioWidget(context, Keys.ENOUGH_RESOURCES, "There are not enough resources", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(enoughResource).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.ENOUGH_RESOURCES_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        enoughResource.addDependentWidgets(challengeToggler.getToggleMap());

        noRoom = new RadioWidget(context, Keys.NO_ROOM_FOR_CLASS, "There is no room for the class", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(noRoom).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_ROOM_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        noRoom.addDependentWidgets(challengeToggler.getToggleMap());

        noTeacher = new RadioWidget(context, Keys.NO_TEACHER_FOR_CLASS, "There are not enough teachers to teach the Gender class", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(noTeacher).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_TEACHER_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        noTeacher.addDependentWidgets(challengeToggler.getToggleMap());

        irreleventContent = new RadioWidget(context, Keys.IRRELEVENT_CONTENT, "The content is irrelevent for the context of the students", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(irreleventContent).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.IRRELEVENT_CONTENT_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        irreleventContent.addDependentWidgets(challengeToggler.getToggleMap());

        studentNotInterested = new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED, "Student are not interested in the content", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(studentNotInterested).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        studentNotInterested.addDependentWidgets(challengeToggler.getToggleMap());


        RadioWidget genderResourceRequire = new RadioWidget(context, Keys.SCHOOL_REQUIRE_RESOURCES, "Does this school require any resources?", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(genderResourceRequire.addHeader("Resources")).hideView());
        ToggleWidgetData genderResourceToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData genderResourceSkipper = genderResourceToggler.addOption("Yes");
        widgets.add(genderResourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_FLASHCARD_GUIDES, "Gender Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(genderResourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(genderResourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_OTHER, "Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, false).build()).hideView());
        genderResourceSkipper.build();
        genderResourceRequire.addDependentWidgets(genderResourceToggler.getToggleMap());

        RadioWidget genderResourceDistributed = new RadioWidget(context, Keys.GENDER_SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(genderResourceDistributed).hideView());
        genderResourceToggler = new ToggleWidgetData();
        genderResourceSkipper = genderResourceToggler.addOption("Yes");
        widgets.add(genderResourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_FLASHCARD_GUIDES, "Gender Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(genderResourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(genderResourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_OTHER, "Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, false).build()).hideView());
        genderResourceSkipper.build();
        genderResourceDistributed.addDependentWidgets(genderResourceToggler.getToggleMap());

        genderSkipper.build();
        program.addDependentWidgets(programToggle.getToggleMap());

        return widgets;
    }


    private List<Widget> getPrimaryMonitoringNewWidgets() {
        List<Widget> widgets = new ArrayList<>();

        widgets.add(new SpinnerWidget(context, Keys.MONITORED_BY, "Monitored By", Arrays.asList(context.getResources().getStringArray(R.array.empty_list)), true));
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        /* FIXME School ID and name should be add as a location*/
        RadioWidget schoolClassification = new RadioWidget(context, Keys.SCHOOL_CLASSIFICATION, "Classification of School by Sex", true, "Girls", "Boys", "Co-ed");
        RadioWidget classClassification = new RadioWidget(context, Keys.CLASS_CLASSIFICATION, "Classification of School by Class", true, "Girls", "Boys", "Co-ed");


        ToggleWidgetData toggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData coedSkipper = toggler.addOption("Co-ed");
        coedSkipper.addWidgetToToggle(classClassification.hideView());
        coedSkipper.build();
        widgets.add(schoolClassification);
        widgets.add(classClassification);
        RadioSwitcher switcher = new RadioSwitcher(classClassification);
        switcher.add("Boys", "Boys");
        switcher.add("Girls", "Girls");
        schoolClassification.setWidgetSwitchListener(switcher);
        schoolClassification.addDependentWidgets(toggler.getToggleMap());

        RadioWidget program = new RadioWidget(context, Keys.PRIMARY_PROGRAM, "Primary Program", true, "CSA", "Gender");
        widgets.add(program);
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_NAME, "Name of Teacher", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_ID, "Teacher ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new RadioWidget(context, Keys.CLASS, "Class", true, "1", "2", "3", "4", "5"));
        widgets.add(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENDS, "Number of Students in Class", InputType.TYPE_CLASS_NUMBER, TWO, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.DURATION_OF_CLASS, "Time duration of class in minutes", InputType.TYPE_CLASS_NUMBER, THREE, true).build());

        ToggleWidgetData programToggle = new ToggleWidgetData();
        ToggleWidgetData.SkipData csaSkipper = programToggle.addOption("CSA");

        widgets.add(csaSkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.CSA_FLASHCARD, LinearLayout.HORIZONTAL, "CSA Flashcard being run", true, context.getResources().getStringArray(R.array.csa_flashcard)).addHeader("CSA Program").hideView()));
        widgets.add(csaSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CSA_REVISION_OR_FIRSTTIME, "Revision or first time flashcard is being taught", true, "Revision", "First time")).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CLASS, "Class", true, "1", "2", "3", "4", "5")).hideView());

        ScoreWidget csaScoreWidget = new ScoreWidget(context, Keys.CSA_PROGRAM_SCORE);
        ScoreCalculator csaScoreCalculator = new ScoreCalculator(csaScoreWidget);

        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_USING_FLASHCARD, "The teacher is using the prompts provided in the CSA flashcard guide", true).setScoreListener(csaScoreCalculator).addHeader("Facilitation")).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_MEETING_OBJECTIVE, "The teacher is meeting the objective of each flashcard even if they are not using all prompts provided in the CSA flashcard guide ", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_HAD_MATERIAL, "The teacher had all materials prepared in advance for the class", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_WELL_PREPARED, "The teacher was well prepared to facilitate the session", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TIME_ALLOTED_FOR_ACTIVITY, "An appropriate amount of time is allotted for each activity and topic", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_COMFORTABLE_SPEAKING, "The teacher is comfortable speaking about this subject", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_JUDGEMENTAL_TONE, "The teacher uses a non-judgmental tone while facilitating the session", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_OWN_OPINIONS, "The teacher does not impose their own values or opinion on the participants", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.STUDENTS_ENGAGEMENT, "Students are engaged in discussion on flashcard(s)", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.STUDENTS_UNDERSTAND_MESSAGE, "Students understand the main messages of the flashcard(s)", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.STUDENTS_PAYING_ATTENTION, "Students are actively paying attention to the class while the teacher is instructing", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RadioWidget(context, Keys.MANAGEMENT_INTEGRATED_CSA, "Management has integrated the CSA program into the school timetable", true, "Yes", "No").setScoreListener(csaScoreCalculator).addHeader("Management")).hideView());


        RadioWidget frequency = new RadioWidget(context, Keys.CLASS_FREQUENCY, "Frequency of class in time table", true, "Weekly", "Biweekly", "Monthly", "Other");
        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).build();
        ToggleWidgetData togglerOther = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = togglerOther.addOption("Other");
        skipData.addWidgetToToggle(other);
        skipData.build();
        frequency.addDependentWidgets(togglerOther.getToggleMap());

        widgets.add(csaSkipper.addWidgetToToggle(frequency).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(other.hideView()).hideView());

        widgets.add(csaSkipper.addWidgetToToggle(new RadioWidget(context, Keys.TWO_TEACHER_CSA, "There are at least 2 teachers assigned to teach the CSA program", true, "Yes", "No").setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.EXCELLENT_COORDINATION, "There is excellent coordination between management and teachers regarding the CSA program", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(csaScoreWidget).hideView());

        RadioWidget scheduleCSA = new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_CSA, "The school is facing challenges scheduling the CSA class", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(scheduleCSA.addHeader("Challenges")).hideView());
        ToggleWidgetData challengeToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_CSA_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        scheduleCSA.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget enoughResource = new RadioWidget(context, Keys.ENOUGH_RESOURCES, "There are not enough resources", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(enoughResource).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.ENOUGH_RESOURCES_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        enoughResource.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noRoom = new RadioWidget(context, Keys.NO_ROOM_FOR_CLASS, "There is no room for the class", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(noRoom).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_ROOM_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        noRoom.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noTeacher = new RadioWidget(context, Keys.NO_TEACHER_FOR_CLASS, "There are not enough teachers to teach the CSA class", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(noTeacher).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_TEACHER_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        noTeacher.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget irreleventContent = new RadioWidget(context, Keys.IRRELEVENT_CONTENT, "The content is irrelevent for the context of the students", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(irreleventContent).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.IRRELEVENT_CONTENT_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        irreleventContent.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget studentNotInterested = new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED, "Student are not interested in the content", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(studentNotInterested).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        studentNotInterested.addDependentWidgets(challengeToggler.getToggleMap());


        RadioWidget resourceRequire = new RadioWidget(context, Keys.SCHOOL_REQUIRE_RESOURCES, "Does this school require any resources?", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(resourceRequire.addHeader("Resources")).hideView());
        ToggleWidgetData resourceToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData resourceSkipper = resourceToggler.addOption("Yes");
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_FLASHCARD_GUIDES, "CSA Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER, "Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, false).build()).hideView());
        resourceSkipper.build();
        resourceRequire.addDependentWidgets(resourceToggler.getToggleMap());

        RadioWidget resourceDistributed = new RadioWidget(context, Keys.CSA_SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(resourceDistributed).hideView());
        resourceToggler = new ToggleWidgetData();
        resourceSkipper = resourceToggler.addOption("Yes");
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_FLASHCARD_GUIDES, "CSA Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_OTHER, "Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, false).build()).hideView());
        resourceSkipper.build();
        resourceDistributed.addDependentWidgets(resourceToggler.getToggleMap());
        csaSkipper.build();

        ToggleWidgetData.SkipData genderSkipper = programToggle.addOption("Gender");
        widgets.add(genderSkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.GENDER_FLASHCARD_RUN, LinearLayout.VERTICAL, "Gender Flashcard being run", true, context.getResources().getStringArray(R.array.gender_flashcard)).addHeader("Gender Program").hideView()));
        widgets.add(genderSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_REVISION_OR_FIRSTTIME, "Revision or first time flashcard is being taught", true, "Revision", "First time")));

        ScoreWidget genderScoreWidget = new ScoreWidget(context, Keys.GENDER_PROGRAM_SCORE);
        ScoreCalculator genderScoreCalculator = new ScoreCalculator(genderScoreWidget);

        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_USING_FLASHCARD, "The teacher is using the prompts provided in the Gender flashcard guide", true).setScoreListener(genderScoreCalculator).addHeader("Facilitation")).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_MEETING_OBJECTIVE, "The teacher is meeting the objective of each flashcard even if they are not using all prompts provided in the Gender flashcard guide ", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_HAD_MATERIAL, "The teacher had all materials prepared in advance for the class", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_WELL_PREPARED, "The teacher was well prepared to facilitate the session", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TIME_ALLOTED_FOR_ACTIVITY, "An appropriate amount of time is allotted for each activity and topic", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_COMFORTABLE_SPEAKING, "The teacher is comfortable speaking about this subject", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_JUDGEMENTAL_TONE, "The teacher uses a non-judgmental tone while facilitating the session", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_OWN_OPINIONS, "The teacher does not impose their own values or opinion on the participants", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_STUDENTS_ENGAGEMENT, "Students are engaged in discussion on flashcard(s)", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_STUDENTS_UNDERSTAND_MESSAGE, "Students understand the main messages of the flashcard(s)", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_STUDENTS_PAYING_ATTENTION, "Students are actively paying attention to the class while the teacher is instructing", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_MANAGEMENT_INTEGRATED_CSA, "Management has integrated the Gender program into the school timetable", true, "Yes", "No").setScoreListener(genderScoreCalculator).addHeader("Management")).hideView());


        frequency = new RadioWidget(context, Keys.GENDER_CLASS_FREQUENCY, "Frequency of class in time table", true, "Weekly", "Biweekly", "Monthly", "Other");
        other = new EditTextWidget.Builder(context, Keys.GENDER_OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).build();
        togglerOther = new ToggleWidgetData();
        skipData = togglerOther.addOption("Other");
        skipData.addWidgetToToggle(other);
        skipData.build();
        frequency.addDependentWidgets(togglerOther.getToggleMap());

        widgets.add(genderSkipper.addWidgetToToggle(frequency).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(other.hideView()).hideView());

        widgets.add(genderSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_TWO_TEACHER_CSA, "There are at least 2 teachers assigned to teach the Gender program", true, "Yes", "No").setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_EXCELLENT_COORDINATION, "There is excellent coordination between management and teachers regarding the Gender program", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(genderScoreWidget).hideView());


        RadioWidget scheduleGender = new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_GENDER, "The school is facing challenges scheduling the Gender class", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(scheduleGender.addHeader("Challenges")).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_CSA_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        scheduleGender.addDependentWidgets(challengeToggler.getToggleMap());

        enoughResource = new RadioWidget(context, Keys.ENOUGH_RESOURCES, "There are not enough resources", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(enoughResource).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.ENOUGH_RESOURCES_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        enoughResource.addDependentWidgets(challengeToggler.getToggleMap());

        noRoom = new RadioWidget(context, Keys.NO_ROOM_FOR_CLASS, "There is no room for the class", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(noRoom).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_ROOM_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        noRoom.addDependentWidgets(challengeToggler.getToggleMap());

        noTeacher = new RadioWidget(context, Keys.NO_TEACHER_FOR_CLASS, "There are not enough teachers to teach the Gender class", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(noTeacher).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_TEACHER_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        noTeacher.addDependentWidgets(challengeToggler.getToggleMap());

        irreleventContent = new RadioWidget(context, Keys.IRRELEVENT_CONTENT, "The content is irrelevent for the context of the students", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(irreleventContent).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.IRRELEVENT_CONTENT_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        irreleventContent.addDependentWidgets(challengeToggler.getToggleMap());

        studentNotInterested = new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED, "Student are not interested in the content", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(studentNotInterested).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED_STATUS, "Status of Challenge", true, "Resolved", "Unresolved").hideView()).hideView());
        challengeSkipper.build();
        studentNotInterested.addDependentWidgets(challengeToggler.getToggleMap());


        resourceRequire = new RadioWidget(context, Keys.SCHOOL_REQUIRE_RESOURCES, "Does this school require any resources?", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(resourceRequire.addHeader("Resources")).hideView());
        resourceToggler = new ToggleWidgetData();
        resourceSkipper = resourceToggler.addOption("Yes");
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_FLASHCARD_GUIDES, "Gender Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_OTHER, "Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, false).build()).hideView());
        resourceSkipper.build();
        resourceRequire.addDependentWidgets(resourceToggler.getToggleMap());

        resourceDistributed = new RadioWidget(context, Keys.GENDER_SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(resourceDistributed).hideView());
        resourceToggler = new ToggleWidgetData();
        resourceSkipper = resourceToggler.addOption("Yes");
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_FLASHCARD_GUIDES, "Gender Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_OTHER, "Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, false).build()).hideView());
        resourceSkipper.build();
        resourceDistributed.addDependentWidgets(resourceToggler.getToggleMap());


        genderSkipper.build();
        program.addDependentWidgets(programToggle.getToggleMap());
        return widgets;
    }

    private List<Widget> getSchoolClosingWidgets() {
        List<Widget> widgets = new ArrayList<>();

        widgets.add(new EditTextWidget.Builder(context, Keys.SCHOOL_ID, "School ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.SCHOOL_NAME, "Name of School", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());
        widgets.add(new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true));
        widgets.add(new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district)), true));
        widgets.add(new DateWidget(context, Keys.DATE_PARTNERSHIP_STARTED, "Date partnership with Aahung was formed", true));
        widgets.add(new DateWidget(context, Keys.DATE_PARTNERSHIP_ENDED, "Date partnership with Aahung ended", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.PARTNERSHIP_YEARS, "Number of years of partnership", InputType.TYPE_CLASS_TEXT, TWO, true).build());
        widgets.add(new SpinnerWidget(context, Keys.SCHOOL_TYPE, "Type of School", Arrays.asList(context.getResources().getStringArray(R.array.school_type)), true));
        widgets.add(new RadioWidget(context, Keys.SCHOOL_CLASSIFICATION, "Classification of School by Sex", true, "Girls", "Boys", "Co-ed"));
        RadioWidget programLevel = new RadioWidget(context, Keys.LEVEL_OF_PROGRAM, "Level of Program", true, "Primary", "Secondary");
        widgets.add(programLevel);

        RadioWidget tier = new RadioWidget(context, Keys.SCHOOL_TIER, "School Tier at Closing", true, "New", "Running", "Exit");
        widgets.add(tier);

        RadioWidget program = new RadioWidget(context, Keys.TYPE_OF_PROGRAM_IN_SCHOOL, "Type of program(s) implement in school", true, "CSA", "Gender", "LSBE");

        RadioSwitcher switcher = new RadioSwitcher(program);
        switcher.add("Secondary", "LSBE");
        programLevel.setWidgetSwitchListener(switcher);
        widgets.add(program);

        widgets.add(new EditTextWidget.Builder(context, Keys.REASON_PARTNERSHIP, "Reason for end of partnership", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());

        return widgets;
    }


    private List<Widget> getParticipantDetailsWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_ID, "Teacher ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_NAME, "Teacher Name", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.AGE, "Age", InputType.TYPE_CLASS_TEXT, TWO, true).build());
        widgets.add(new RadioWidget(context, Keys.SEX, "Sex", true, "Male", "Female", "Other"));
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_NAME, "Teacher Name", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());
        MultiSelectWidget subjects = new MultiSelectWidget(context, Keys.SUBJECT, LinearLayout.VERTICAL, "Subject(s) taught", true, context.getResources().getStringArray(R.array.subjects));

        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).build();
        ToggleWidgetData toggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = toggler.addOption("Other");
        skipData.addWidgetToToggle(other);
        skipData.build();

        subjects.addDependentWidgets(toggler.getToggleMap());
        widgets.add(subjects);
        widgets.add(other.hideView());
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHING_YEARS, "Number of years teaching", InputType.TYPE_CLASS_PHONE, TWO, true).build());
        widgets.add(new SpinnerWidget(context, Keys.EDUCATION_LEVEL, "Type of School", Arrays.asList(context.getResources().getStringArray(R.array.education_level)), true));

        return widgets;
    }

    private List<Widget> getSchoolDetailWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true));
        widgets.add(new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district)), true));
        widgets.add(new EditTextWidget.Builder(context, Keys.PARENT_ORGANISATION_ID, "Parent Organization ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.PARENT_ORGANISATION_NAME, "Parent Organization Name", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.SCHOOL_ID, "School ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.SCHOOL_NAME, "Name of School", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());
        widgets.add(new SpinnerWidget(context, Keys.SCHOOL_TYPE, "Type of School", Arrays.asList(context.getResources().getStringArray(R.array.school_type)), true));
        widgets.add(new RadioWidget(context, Keys.SCHOOL_CLASSIFICATION, "Classification of School by Sex", true, "Girls", "Boys", "Co-ed"));

        RadioWidget programLevel = new RadioWidget(context, Keys.LEVEL_OF_PROGRAM, "Level of Program", true, "Primary", "Secondary");
        widgets.add(programLevel);
        widgets.add(new SpinnerWidget(context, Keys.DONOR_ID, "Donor ID", Arrays.asList(context.getResources().getStringArray(R.array.empty_list)), false));
        RadioWidget tier = new RadioWidget(context, Keys.SCHOOL_TIER, "School Tier", true, "New", "Running", "Exit");
        widgets.add(tier);

        RadioWidget newSchoolType = new RadioWidget(context, Keys.NEW_SCHOOL_TYPE, "New School Category", true, "Newly Inducted", "implementation > 1 Cycle");
        RadioWidget runningSchoolType = new RadioWidget(context, Keys.RUNNING_SCHOOL_TYPE, "Running School Category", true, "Low Performing", "Average Performing", "High Performing");
        RadioWidget exitSchoolType = new RadioWidget(context, Keys.EXIT_SCHOOL_TYPE, "Exit School Category", true, "Initial Phase", "Mid Phase", "Exit Phase");

        widgets.add(newSchoolType.hideView());
        widgets.add(runningSchoolType.hideView());
        widgets.add(exitSchoolType.hideView());

        ToggleWidgetData toggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData newSkipLogic = toggler.addOption("New");
        newSkipLogic.addWidgetToToggle(newSchoolType);
        newSkipLogic.build();

        ToggleWidgetData.SkipData runningSkipLogic = toggler.addOption("Running");
        runningSkipLogic.addWidgetToToggle(runningSchoolType);
        runningSkipLogic.build();

        ToggleWidgetData.SkipData exitSkipLogic = toggler.addOption("Exit");
        exitSkipLogic.addWidgetToToggle(exitSchoolType);
        exitSkipLogic.build();

        tier.addDependentWidgets(toggler.getToggleMap());

        RadioWidget program = new RadioWidget(context, Keys.TYPE_OF_PROGRAM_IN_SCHOOL, "Type of program(s) implement in school", true, "CSA", "Gender", "LSBE");

        RadioSwitcher switcher = new RadioSwitcher(program);
        switcher.add("Secondary", "LSBE");
        programLevel.setWidgetSwitchListener(switcher);

        widgets.add(program);
        widgets.add(new EditTextWidget.Builder(context, Keys.PHONE_NUMBER, "Phone number for point of contact at school", InputType.TYPE_CLASS_PHONE, PHONE_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.EMAIL, "Email Address for point of contact at school", InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS, NORMAL_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.APPROX_STUDENTS, "Approximate number of students", InputType.TYPE_CLASS_PHONE, FOUR, true).build());

        return widgets;
    }

    private List<Widget> getDonorDetailWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new EditTextWidget.Builder(context, Keys.DONOR_ID, "Donor ID", InputType.TYPE_CLASS_NUMBER, 5, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.DONOR_NAME, "Name of Donor", InputType.TYPE_CLASS_TEXT, 15, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.PROPOSAL_NAME, "Name of Proposal", InputType.TYPE_CLASS_TEXT, 15, true).build());
        widgets.add(new DateWidget(context, Keys.DATE_GRANT_BEGINS, "Date grant begins", true));
        widgets.add(new DateWidget(context, Keys.DATE_GRANT_ENDS, "Date grant ends", true));

        return widgets;
    }
}
