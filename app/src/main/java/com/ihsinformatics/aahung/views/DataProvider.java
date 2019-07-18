package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.text.InputType;
import android.widget.LinearLayout;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.Keys;
import com.ihsinformatics.aahung.model.FormDetails;
import com.ihsinformatics.aahung.model.RadioSwitcher;
import com.ihsinformatics.aahung.model.ToggleWidgetData;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class DataProvider {

    public static final int NORMAL_LENGTH = 30;
    public static final int ID_LENGTH = 10;
    public static final int YEARS_LENGTH = 2;
    public static final int PHONE_LENGTH = 11;
    public static final int QUANTITY_LENGTH = 4;
    public static final int DURATION_LENGTH = 3;
    private Context context;
    private FormDetails details;


    public DataProvider(Context context, FormDetails details) {
        this.context = context;
        this.details = details;
    }

    public enum Forms {
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
                widgets = getPrimaryMonitoringWidgets();
                break;



            case SchoolClosingForm:
                widgets = getSchoolClosingWidgets();
                break;

            default:
                widgets = getDonorDetailWidgets();
        }

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
        widgets.add(new EditTextWidget.Builder(context, Keys.PARTNERSHIP_YEARS, "Number of years of partnership", InputType.TYPE_CLASS_TEXT, YEARS_LENGTH, true).build());
        widgets.add(new SpinnerWidget(context, Keys.SCHOOL_TYPE, "Type of School", Arrays.asList(context.getResources().getStringArray(R.array.school_type)), true));
        widgets.add(new RadioWidget(context, Keys.SCHOOL_CLASSIFICATION, "Classification of School by Sex", true, "Girls", "Boys", "Co-ed"));
        RadioWidget programLevel = new RadioWidget(context, Keys.LEVEL_OF_PROGRAM, "Level of Program", true, "Primary", "Secondary");
        widgets.add(programLevel);

        RadioWidget tier = new RadioWidget(context, Keys.SCHOOL_TIER, "School Tier at Closing", true, "New", "Running", "Exit");
        widgets.add(tier);

        RadioWidget program = new RadioWidget(context, Keys.TYPE_OF_PROGRAM_IN_SCHOOL, "Type of program(s) implement in school", true, "CSA", "Gender", "LSBE");

        RadioSwitcher switcher = new RadioSwitcher(program);
        switcher.add("Secondary", "LSBE");
        programLevel.setListener(switcher);
        widgets.add(program);

        widgets.add(new EditTextWidget.Builder(context, Keys.REASON_PARTNERSHIP, "Reason for end of partnership", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());

        return widgets;
    }

    private List<Widget> getPrimaryMonitoringWidgets() {
        List<Widget> widgets = new ArrayList<>();

        widgets.add(new SpinnerWidget(context, Keys.MONITORED_BY, "Monitored By", Arrays.asList(context.getResources().getStringArray(R.array.empty_list)), true));
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        /*School ID and name should be add as a location*/
        RadioWidget schoolClassification = new RadioWidget(context, Keys.SCHOOL_CLASSIFICATION, "Classification of School by Sex", true, "Girls", "Boys", "Co-ed");
        RadioWidget classClassification = new RadioWidget(context, Keys.CLASS_CLASSIFICATION, "Students in School by Sex", true, "Girls", "Boys", "Co-ed");

        widgets.add(schoolClassification);
        widgets.add(classClassification.hideView());
        ToggleWidgetData toggler = new ToggleWidgetData();
        toggler.addOption("Co-ed").addWidgetToToggle(classClassification).build();

        RadioSwitcher switcher = new RadioSwitcher(classClassification);
        switcher.add("Boys", "Boys");
        switcher.add("Girls", "Girls");
        schoolClassification.setListener(switcher);
        schoolClassification.addDependentWidgets(toggler.getToggleMap());

        widgets.add(new RadioWidget(context, Keys.PRIMARY_PROGRAM, "Primary Program", true, "CSA", "Gender"));
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_NAME, "Name of Teacher", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_ID, "Teacher ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new RadioWidget(context, Keys.CLASS, "Class", true, "1", "2", "3", "4", "5"));
        widgets.add(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENDS, "Number of Students in Class", InputType.TYPE_CLASS_NUMBER, YEARS_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.DURATION_OF_CLASS, "Time duration of class in minutes", InputType.TYPE_CLASS_NUMBER, DURATION_LENGTH, true).build());
        widgets.add(new MultiSelectWidget(context, Keys.CSA_FLASHCARD, LinearLayout.HORIZONTAL, "CSA Flashcard being run", true, context.getResources().getStringArray(R.array.csa_flashcard)).addHeader("CSA Program"));
        widgets.add(new RadioWidget(context, Keys.REVISION_OR_FIRSTTIME, "Revision or first time flashcard is being taught", true, "Revision", "First time"));
        widgets.add(new RadioWidget(context, Keys.CLASS, "Class", true, "1", "2", "3", "4", "5"));
        widgets.add(new RateWidget(context, Keys.TEACHER_USING_FLASHCARD, "The teacher is using the prompts provided in the CSA flashcard guide", true).addHeader("Facilitation"));
        widgets.add(new RateWidget(context, Keys.TEACHER_MEETING_OBJECTIVE, "The teacher is meeting the objective of each flashcard even if they are not using all prompts provided in the CSA flashcard guide ", true));
        widgets.add(new RateWidget(context, Keys.TEACHER_HAD_MATERIAL, "The teacher had all materials prepared in advance for the class", true));
        widgets.add(new RateWidget(context, Keys.TEACHER_WELL_PREPARED, "The teacher was well prepared to facilitate the session", true));
        widgets.add(new RateWidget(context, Keys.TIME_ALLOTED_FOR_ACTIVITY, "An appropriate amount of time is allotted for each activity and topic", true));
        widgets.add(new RateWidget(context, Keys.TEACHER_COMFORTABLE_SPEAKING, "The teacher is comfortable speaking about this subject", true));
        widgets.add(new RateWidget(context, Keys.TEACHER_JUDGEMENTAL_TONE, "The teacher uses a non-judgmental tone while facilitating the session", true));
        widgets.add(new RateWidget(context, Keys.TEACHER_OWN_OPINIONS, "The teacher does not impose their own values or opinion on the participants", true));
        widgets.add(new RateWidget(context, Keys.STUDENTS_ENGAGEMENT, "Students are engaged in discussion on flashcard(s)", true));
        widgets.add(new RateWidget(context, Keys.STUDENTS_UNDERSTAND_MESSAGE, "Students understand the main messages of the flashcard(s)", true));
        widgets.add(new RateWidget(context, Keys.STUDENTS_PAYING_ATTENTION, "Students are actively paying attention to the class while the teacher is instructing", true));
        widgets.add(new RadioWidget(context, Keys.MANAGEMENT_INTEGRATED_CSA, "Management has integrated the CSA program into the school timetable", true, "Yes", "No").addHeader("Management"));

        RadioWidget frequency = new RadioWidget(context, Keys.CLASS_FREQUENCY, "Frequency of class in time table", true, "Weekly", "Biweekly", "Monthly", "Other");
        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).build();
        ToggleWidgetData togglerOther = new ToggleWidgetData();
        togglerOther.addOption("Other").addWidgetToToggle(other).build();
        frequency.addDependentWidgets(toggler.getToggleMap());
        widgets.add(frequency);
        widgets.add(other.hideView());

        widgets.add(new RateWidget(context, Keys.EXCELLENT_COORDINATION, "There is excellent coordination between management and teachers regarding the CSA program", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.MONITORING_SCORE, "Cumulative CSA Monitoring Score", InputType.TYPE_CLASS_NUMBER, YEARS_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.MONITORING_SCORE_PERCENTAGE, "% Monitoring Score", InputType.TYPE_CLASS_NUMBER, YEARS_LENGTH, true).build());
        //FIXME should be autocalculate
        widgets.add(new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_CSA, "The school is facing challenges scheduling the CSA class", true, "Yes", "No").addHeader("Challenges"));
        widgets.add(new RadioWidget(context, Keys.CHALLENGE_STATUS, "Status of Challenge", true, "Resolved", "Unresolved"));
        widgets.add(new RadioWidget(context, Keys.ENOUGH_RESOURCES, "There are not enough resources", true, "Resolved", "Unresolved"));


        return widgets;
    }

    private List<Widget> getParticipantDetailsWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_ID, "Teacher ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_NAME, "Teacher Name", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.AGE, "Age", InputType.TYPE_CLASS_TEXT, YEARS_LENGTH, true).build());
        widgets.add(new RadioWidget(context, Keys.SEX, "Sex", true, "Male", "Female", "Other"));
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_NAME, "Teacher Name", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());
        MultiSelectWidget subjects = new MultiSelectWidget(context, Keys.SUBJECT, LinearLayout.VERTICAL, "Subject(s) taught", true, context.getResources().getStringArray(R.array.subjects));

        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER, "Other", InputType.TYPE_CLASS_TEXT, 100, true).build();
        ToggleWidgetData toggler = new ToggleWidgetData();
        toggler.addOption("Other (Please Specify)").addWidgetToToggle(other).build();
        subjects.addDependentWidgets(toggler.getToggleMap());
        widgets.add(subjects);
        widgets.add(other.hideView());
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHING_YEARS, "Number of years teaching", InputType.TYPE_CLASS_PHONE, YEARS_LENGTH, true).build());
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
        toggler.addOption("New").addWidgetToShow(newSchoolType).addWidgetToHide(runningSchoolType).addWidgetToHide(exitSchoolType).build();
        toggler.addOption("Running").addWidgetToShow(runningSchoolType).addWidgetToHide(newSchoolType).addWidgetToHide(exitSchoolType).build();
        toggler.addOption("Exit").addWidgetToShow(exitSchoolType).addWidgetToHide(runningSchoolType).addWidgetToHide(newSchoolType).build();
        tier.addDependentWidgets(toggler.getToggleMap());

        RadioWidget program = new RadioWidget(context, Keys.TYPE_OF_PROGRAM_IN_SCHOOL, "Type of program(s) implement in school", true, "CSA", "Gender", "LSBE");

        RadioSwitcher switcher = new RadioSwitcher(program);
        switcher.add("Secondary", "LSBE");
        programLevel.setListener(switcher);

        widgets.add(program);
        widgets.add(new EditTextWidget.Builder(context, Keys.PHONE_NUMBER, "Phone number for point of contact at school", InputType.TYPE_CLASS_PHONE, PHONE_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.EMAIL, "Email Address for point of contact at school", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.APPROX_STUDENTS, "Approximate number of students", InputType.TYPE_CLASS_PHONE, QUANTITY_LENGTH, true).build());

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
