package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.text.InputType;
import android.widget.LinearLayout;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.CustomChangeListener;
import com.ihsinformatics.aahung.common.Keys;
import com.ihsinformatics.aahung.common.ScoreCalculator;
import com.ihsinformatics.aahung.common.WidgetContract;
import com.ihsinformatics.aahung.model.FormDetails;
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
            case SchoolClosingForm:
                widgets = getSchoolClosingWidgets();
                break;
            default:
                widgets = getDonorDetailWidgets();
        }

        return widgets;
    }

    private void multiMapper(RateWidget a, RadioWidget b) {

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
        schoolClassification.setListener(switcher);


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
        widgets.add(new RateWidget(context, Keys.TEACHER_WELL_PREPARED, "The teacher was well prepared to facilitate the session", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TIME_ALLOTED_FOR_ACTIVITY, "An appropriate amount of time is allotted for each activity and topic", true).setScoreListener(scoreCalculator));

        widgets.add(new RateWidget(context, Keys.TEACHER_COMFORTABLE_SPEAKING, "The teacher is comfortable speaking about this subject", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_JUDGEMENTAL_TONE, "The teacher uses a non-judgmental tone while facilitating the session", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_OWN_OPINIONS, "The teacher does not impose their own values or opinion on the participants", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.STUDENTS_ENGAGEMENT, "Students are engaged in discussion on flashcard(s)", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.STUDENTS_UNDERSTAND_MESSAGE, "Students understand the main messages of the flashcard(s)", true).setScoreListener(scoreCalculator));
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
        ToggleWidgetData resourceToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData resourceSkipper = resourceToggler.addOption("Yes");

        final Widget workbookGirlOne = new EditTextWidget.Builder(context, Keys.WORKBOOK_1_GIRLS, "Workbook level 1 - Girls", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget workbookBoyOne = new EditTextWidget.Builder(context, Keys.WORKBOOK_1_BOYS, "Workbook level 1 - Boys", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget workbookBoyTwo = new EditTextWidget.Builder(context, Keys.WORKBOOK_2_BOYS, "Workbook level 2 - Boys", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();
        final Widget workbookGirlTwo = new EditTextWidget.Builder(context, Keys.WORKBOOK_2_GIRLS, "Workbook level 2 - Girls", InputType.TYPE_CLASS_NUMBER, FOUR, false).build().hideView();

        widgets.add(workbookGirlOne);
        widgets.add(workbookBoyOne);
        widgets.add(workbookGirlTwo);
        widgets.add(workbookBoyTwo);

        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER, "Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, false).build()).hideView());
        resourceSkipper.build();
        resourceRequire.addDependentWidgets(resourceToggler.getToggleMap());


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
        schoolClassification.setListener(switcher);

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
        schoolClassification.setListener(switcher);

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
        schoolClassification.setListener(switcher);
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
        programLevel.setListener(switcher);
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
        programLevel.setListener(switcher);

        widgets.add(program);
        widgets.add(new EditTextWidget.Builder(context, Keys.PHONE_NUMBER, "Phone number for point of contact at school", InputType.TYPE_CLASS_PHONE, PHONE_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.EMAIL, "Email Address for point of contact at school", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build());
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
