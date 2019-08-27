package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.text.InputType;
import android.text.method.DigitsKeyListener;
import android.widget.CheckBox;
import android.widget.LinearLayout;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.Keys;
import com.ihsinformatics.aahung.common.MultiWidgetContract;
import com.ihsinformatics.aahung.common.ScoreCalculator;
import com.ihsinformatics.aahung.common.WidgetContract;
import com.ihsinformatics.aahung.model.FormDetails;
import com.ihsinformatics.aahung.model.LocationService;
import com.ihsinformatics.aahung.model.MultiSwitcher;
import com.ihsinformatics.aahung.model.RadioSwitcher;
import com.ihsinformatics.aahung.model.ToggleWidgetData;
import com.ihsinformatics.aahung.model.BaseItem;
import com.ihsinformatics.aahung.model.location.Location;
import com.ihsinformatics.aahung.model.user.User;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static android.text.TextUtils.isEmpty;

public class DataProvider {

    public static final int NORMAL_LENGTH = 30;
    public static final int TWENTY = 20;
    public static final int ID_LENGTH = 10;
    public static final int TWO = 2;
    public static final int PHONE_LENGTH = 12;
    public static final int FOUR = 4;
    public static final int THREE = 3;
    public static final int ONE = 1;
    public static final int SIX = 6;
    public static final int HUNDRED = 100;
    public static final int TWO_HUNDRED = 200;
    public static final int FOUR_HUNDRED = 400;
    public static final int TWELVE = 12;
    private static final int INSTITUTION_ID_LENGTH = 10;
    private static final int FIVE = 5;
    private static final int TRAINER_ID_LENGTH = 10;
    private static final int TRAINING_ID_LENGTH = 10;
    private Context context;
    private FormDetails details;

    public static final String ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
    public static final String ALLOWED_CHARACTER_SET_NUMBERS = "0123456789";
    public static final String ALLOWED_CHARACTER_SET_NAME = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";
    public static final String ALLOWED_CHARACTER_SET_ID = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    public static final String ALLOWED_EMAIL_CHARACTER_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@._-";
    public static final String ALLOWED_ADDRESS_CHARACTER_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,/-";

    public static final String ALLOWED_CHARACTER_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";


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
        MasterTrainerMockSessionEvaluationForm("Master Trainer Mock Session Evaluation Form", "master_evaulation", FormType.LSE),
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
        GeneralStepDownTrainingDetailsForm("General Step Down Training Details Form", "master_evaulation", FormType.SRHM),
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
            case TrainingDetailForm:
                widgets = getTrainingDetailsWidgets();
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
            case MasterTrainerEligibilityCriteriaAssessment:
                widgets = getMasterEligibilityWidgets();
                break;
            case MasterTrainerMockSessionEvaluationForm:
                widgets = getMasterTrainerMockWidgets();
                break;
            case StepDownTrainingMonitoringForm:
                widgets = getStepDownTrainingWidgets();
                break;
            case StakeholderMeetings:
                widgets = getStakeHolderTrainingWidgets();
                break;
            case OneTouchSessionDetailForm:
                widgets = getOneTouchSessionForm();
                break;
            case ParentSessionsForm:
                widgets = getParentSessionForm();
                break;
            case SchoolClosingForm:
                widgets = getSchoolClosingWidgets();
                break;


            case NayaQadamStepDownTrainingDetailsForm:
                widgets = getNayaQadamStepDownTrainingDetailsFormWidgets();
                break;

            case InstitutionDetailsForm:
                widgets = getInstitutionDetailsFormWidgets();
                break;

            case AmplifyChangeParticipantDetailsForm:
                widgets = getAmplifyChangeParticipantDetailsFormWidgets();
                break;

            case AmplifyChangeTrainingDetailsForm:
                widgets = getAmplifyChangeTrainingDetailsFormWidgets();
                break;

            case AmplifyChangeStepDownTrainingDetailsForm:
                widgets = getAmplifyChangeStepDownTrainingDetailsFormWidgets();
                break;

            case ParticipantsDetailsSRHMForm:
                widgets = getParticipantsDetailsSRHMFormWidgets();
                break;

            case GeneralTrainingDetailsForm:
                widgets = getGeneralTrainingDetailsFormWidgets();
                break;

            case GeneralStepDownTrainingDetailsForm:
                widgets = getGeneralStepDownTrainingDetailsFormWidgets();
                break;

            case HealthCareProviderReachForm:
                widgets = getHealthCareProviderReachFormWidgets();
                break;

            case OneTouchSensitizationSessionDetailsForm:
                widgets = getOneTouchSensitizationSessionDetailsFormWidgets();
                break;

            case InstitutionClosingForm:
                widgets = getInstitutionClosingFormWidgets();
                break;

            case SocialMediaDetails:
                widgets = getSocialMediaDetailsWidgets();
                break;

            case DistributionofCommunicationMaterial:
                widgets = getDistributionofCommunicationMaterialWidgets();
                break;

            case RadioAppearanceForm:
                widgets = getRadioAppearanceFormWidgets();
                break;

            case MobileCinemaTheatreDetailsForm:
                widgets = getMobileCinemaTheatreDetailsFormWidgets();
                break;

            case TrainingDetailsFormCommunications:
                widgets = getTrainingDetailsFormCommunicationsWidgets();
                break;
            default:
                widgets = getDonorDetailWidgets();
        }

        return widgets;
    }


    private List<Widget> getTrainingDetailsWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new SpinnerWidget(context, Keys.VENUE, "Training Venue", Arrays.asList(context.getResources().getStringArray(R.array.training_venue)), true));

        RadioWidget programLevel = new RadioWidget(context, Keys.LEVEL_OF_PROGRAM, "Level of school(s) being trained", true, "Primary", "Secondary");
        widgets.add(programLevel);

        RadioWidget program = new RadioWidget(context, Keys.TYPE_OF_PROGRAM_IN_SCHOOL, "Type of program(s) implement in school", true, "CSA", "Gender", "LSBE");

        RadioSwitcher switcher = new RadioSwitcher(program);
        switcher.add("Secondary", "LSBE");
        programLevel.setWidgetSwitchListener(switcher);
        widgets.add(program);

        widgets.add(new UserWidget(context,Keys.TRAINERS,"Name(s) of Trainer(s)",getDummyList()));
        widgets.add(new EditTextWidget.Builder(context, Keys.DAYS_QUANTITY, "Number of Days", InputType.TYPE_CLASS_NUMBER, TWO, true).setInputRange(1,15).setMinimumValue(ONE).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.TRAINING_SCHOOLS_QUANTITY, "Number of schools in training", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputRange(1,999).setMinimumValue(ONE).build());
        widgets.add(new UserWidget(context,Keys.SCHOOLS,"Name(s) of School(s)",getDummySchoolList()));

        widgets.add(new UserWidget(context, Keys.PARTICPANTS, "Participant(s)", getDummyList()).enableParticipants());

        return widgets;
    }

    private List<Location> getDummySchoolList() {
        List<Location> users = new ArrayList<>();
        users.add(new Location(2123, "Metropolitan School"));
        users.add(new Location(1231, "Happy Palace Grammer School"));
        users.add(new Location(2134, "City School"));
        return users;
    }

    private List<User> getDummyList() {
        List<User> users = new ArrayList<>();
        users.add(new User(9483, "Kamal"));
        users.add(new User(82983, "Shadab"));
        users.add(new User(33, "Wahab"));
        return users;
    }

    private List<Widget> getStakeHolderTrainingWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));


        widgets.add(new EditTextWidget.Builder(context, Keys.VENUE, "Meeting Venue", InputType.TYPE_CLASS_TEXT, TWO_HUNDRED, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_ADDRESS_CHARACTER_SET)).build());

        widgets.add(new UserWidget(context, Keys.STAFF_MEMBERS, "Aahung Staff Members", getDummyList()));

        MultiSelectWidget participantType = new MultiSelectWidget(context, Keys.PARTICIPANT_TYPE, LinearLayout.VERTICAL, "Type of Participants", true, context.getResources().getStringArray(R.array.one_touch_participants));
        widgets.add(participantType);

        ToggleWidgetData participantToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData participantSkipper = participantToggler.addOption("Other");
        widgets.add(participantSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_PARTICIPANTS, "Specify Other", InputType.TYPE_CLASS_TEXT, TWO_HUNDRED, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build().hideView()));
        widgets.add(participantSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_POLICY_MAKER, "Number of Other", InputType.TYPE_CLASS_NUMBER, THREE, true).build().hideView()));
        participantSkipper.build();

        participantSkipper = participantToggler.addOption("Government");
        widgets.add(participantSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_GOVERNMENT, "Number of Government", InputType.TYPE_CLASS_NUMBER, THREE, true).build().hideView()));
        participantSkipper.build();

        participantSkipper = participantToggler.addOption("Policy Makers");
        widgets.add(participantSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_POLICY_MAKER, "Number of Policy Maker", InputType.TYPE_CLASS_NUMBER, THREE, true).build().hideView()));
        participantSkipper.build();


        participantSkipper = participantToggler.addOption("TAC");
        widgets.add(participantSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_TAC, "Number of TAC", InputType.TYPE_CLASS_NUMBER, THREE, true).build().hideView()));
        participantSkipper.build();

        participantSkipper = participantToggler.addOption("NGOs");
        widgets.add(participantSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_NGOs, "Number of NGOs", InputType.TYPE_CLASS_NUMBER, THREE, true).build().hideView()));
        participantSkipper.build();

        participantSkipper = participantToggler.addOption("School Partners");
        widgets.add(participantSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_SCHOOL_PARTNER, "Number of School Partners", InputType.TYPE_CLASS_NUMBER, THREE, true).build().hideView()));
        participantSkipper.build();

        participantType.addDependentWidgets(participantToggler.getToggleMap());

        widgets.add(new EditTextWidget.Builder(context, Keys.MEETING_PURPOSE, "Purpose of Meeting", InputType.TYPE_CLASS_TEXT, FOUR_HUNDRED, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build());

        SpinnerWidget topicsCovered = new SpinnerWidget(context, Keys.TOPICS_COVERED, "Topics Covered", Arrays.asList(context.getResources().getStringArray(R.array.topics_stakeholder)), true);
        widgets.add(topicsCovered);

        ToggleWidgetData otherToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData otherSkipper = otherToggler.addOption("Other");
        widgets.add(otherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_TOPICS, "Other", InputType.TYPE_CLASS_TEXT, TWO_HUNDRED, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build().hideView()));
        otherSkipper.build();
        topicsCovered.addDependentWidgets(otherToggler.getToggleMap());


        return widgets;
    }

    private List<Widget> getMasterEligibilityWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        ScoreWidget scoreWidget = new ScoreWidget(context, Keys.MONITORING_SCORE).setLabel("Cumulative Eligibility Score:", "Score %:");
        ScoreCalculator scoreCalculator = new ScoreCalculator(scoreWidget);

        widgets.add(new SpinnerWidget(context, Keys.CANDIDATE_NAME, "Name of Candidate", Arrays.asList(context.getResources().getStringArray(R.array.empty_list)), true));
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_ID, "Teacher ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new MultiSelectWidget(context, Keys.PARTICIPANT_TYPE, LinearLayout.HORIZONTAL, "Aahung program candidate has been trained on", true, "CSA", "LSBE"));
        widgets.add(new RadioWidget(context, Keys.MASTER_TRAINER_NOMINATED, "Aahung program candidate is being nominated as Master Trainer for", true, "CSA", "LSBE"));

        widgets.add(new UserWidget(context, Keys.EVALUATED_BY, "Evaluated By", getDummyList()));
        widgets.add(new RadioWidget(context, Keys.CANDIDATE_WILLING, "Candidate is willing to become a Master Trainer for this school", true, "Yes", "No").setScoreListener(scoreCalculator).addHeader("Eligibility Criteria"));
        widgets.add(new RadioWidget(context, Keys.CANDIDATE_WORKING_YEAR, "Candidate is likely to continue working at this school for the next 2-4 years", true, "Yes", "No").setScoreListener(scoreCalculator));
        widgets.add(new RadioWidget(context, Keys.CANDIDATE_TWO_YEAR, "Candidate is trained in Aahung’s CSA/LSBE program and has been teaching the course for at least 2 years in school", true, "Yes", "No").setScoreListener(scoreCalculator));
        widgets.add(new RadioWidget(context, Keys.CANDIDATE_INTEREST, "Candidate demonstrates a strong interest in leading and sustaining the CSA/LSBE program in this school through their dedication in teaching this program", true, "Yes", "No").setScoreListener(scoreCalculator));
        widgets.add(new RadioWidget(context, Keys.CANDIDATE_LEADERSHIP, "Candidate possesses strong leadership skills and has the ability to work in a team", true, "Yes", "No").setScoreListener(scoreCalculator));
        widgets.add(new RadioWidget(context, Keys.CANDIDATE_CAPABLE_REPLICATING, "Candidate is capable of replicating Aahung’s 6 day CSA/LSBE training with other teachers in this school", true, "Yes", "No").setScoreListener(scoreCalculator));
        widgets.add(new RadioWidget(context, Keys.CANDIDATE_CAPABLE_CONDUCTING, "Candidate is capable of conducting regular parent and teacher sensitization sessions related to Aahung’s CSA/LSBE program", true, "Yes", "No").setScoreListener(scoreCalculator));

        widgets.add(scoreWidget);
        widgets.add(new RadioWidget(context, Keys.FINAL_DECISION, "Final Decision - Selected as Master Trainer?", true, "Yes", "No"));

        return widgets;
    }

    private List<Widget> getParentSessionForm() {
        List<Widget> widgets = new ArrayList<>();
        ScoreWidget scoreWidget = new ScoreWidget(context, Keys.MONITORING_SCORE);
        ScoreCalculator scoreCalculator = new ScoreCalculator(scoreWidget);
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new UserWidget(context, Keys.MONITORED_BY, "Monitored By", getDummyList()));

        widgets.add(new RadioWidget(context, Keys.SCHOOL_CLASSIFICATION, "Classification of School by Sex", true, "Girls", "Boys", "Co-ed"));

        RadioWidget parentSession = new RadioWidget(context, Keys.PARENTS_SESSION, "Does this school conduct parent sessions?", true, "Yes", "No");
        widgets.add(parentSession.addHeader("Parent Sessions"));
        ToggleWidgetData sessionToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData sessionSkipper = sessionToggler.addOption("Yes");
        widgets.add(sessionSkipper.addWidgetToToggle(new RateWidget(context, Keys.MANAGEMENT_SESSION, "School Management is active in organizing parent sessions for parents of primary students", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(sessionSkipper.addWidgetToToggle(new DateWidget(context, Keys.SESSION_LAST_DATE, "Date of last parent session", true)).hideView());
        widgets.add(sessionSkipper.addWidgetToToggle(new LabeledEditTextWidget.Builder(context, Keys.SESSION_QUANTITY, "Number of parent sessions held since beginning of school year", InputType.TYPE_CLASS_NUMBER, TWO, true).build()).hideView());
        widgets.add(sessionSkipper.addWidgetToToggle(new LabeledEditTextWidget.Builder(context, Keys.AVERAGE_PARTICIPANTS, "Average number of participants in sessions", InputType.TYPE_CLASS_NUMBER, THREE, true).build()).hideView());

        RadioWidget parentGender = new RadioWidget(context, Keys.PARENTS_ATTEND_SESSION, "Which parent(s) attends the session?", true, "Mothers", "Fathers", "Both");
        widgets.add(sessionSkipper.addWidgetToToggle(parentGender.hideView()));

        MultiSwitcher sessionSwitcher = new MultiSwitcher(parentGender, parentSession);

        RadioWidget sessionOrganized = new RadioWidget(context, Keys.SESSION_ORGANIZED, "How are the sessions organized?", true, "Seperate sessions", "Joint sessions");
        widgets.add(sessionOrganized.hideView());

        sessionSwitcher.addNewOption().addKeys("Yes", "Both").addWidget(sessionOrganized).build();
        parentGender.setMultiSwitchListenerList(sessionSwitcher);
        parentSession.setMultiSwitchListenerList(sessionSwitcher);

        widgets.add(sessionSkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.FACILITATOR, LinearLayout.VERTICAL, "Facilitator", true, context.getResources().getStringArray(R.array.facilitators))).hideView());
        MultiSelectWidget topicCovered = new MultiSelectWidget(context, Keys.SESSION_TOPICS, LinearLayout.VERTICAL, "Topics covered in previous sessions", true, context.getResources().getStringArray(R.array.session_topics));
        widgets.add(sessionSkipper.addWidgetToToggle(topicCovered.hideView()));

        Widget other = new EditTextWidget.Builder(context, Keys.OTHER_SESSION, "Other", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build();
        widgets.add(other.hideView());

        MultiSwitcher otherSwitcher = new MultiSwitcher(topicCovered, parentSession);
        otherSwitcher.addNewOption().addKeys("Yes", "Other").addWidgets(other).build();
        parentSession.setMultiSwitchListenerList(otherSwitcher);
        topicCovered.setMultiWidgetSwitchListener(otherSwitcher);

        RadioWidget sessionPlanned = new RadioWidget(context, Keys.SESSION_PLANNED, "Is the next parent session planned?", true, "Yes", "No");
        widgets.add(sessionSkipper.addWidgetToToggle(sessionPlanned).hideView());
        sessionSwitcher = new MultiSwitcher(sessionPlanned, parentSession);

        DateWidget nextSessionDate = new DateWidget(context, Keys.DATE_NEXT_SESSION, "Date of next session", true);
        widgets.add(nextSessionDate.hideView());

        sessionSwitcher.addNewOption().addKeys("Yes", "Yes").addWidgets(nextSessionDate).build();
        sessionPlanned.setMultiSwitchListenerList(sessionSwitcher);
        parentSession.setMultiSwitchListenerList(sessionSwitcher);

        sessionSkipper.build();
        parentSession.addDependentWidgets(sessionToggler.getToggleMap());

        widgets.add(scoreWidget);

        return widgets;
    }

    private List<Widget> getOneTouchSessionForm() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));

        widgets.add(new EditTextWidget.Builder(context, Keys.INSTITUTION_NAME, "Name of Institution", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, HUNDRED, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new SpinnerWidget(context, Keys.TRAINER_NAME, "Name(s) of Trainer", Arrays.asList(context.getResources().getStringArray(R.array.empty_list)), true));
        final RadioWidget sessionType = new RadioWidget(context, Keys.SESSION_TYPE, "Type of session", true, "Puberty", "CSA", "LSBE", "Other");
        widgets.add(sessionType);

        ToggleWidgetData otherToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData otherSkipper = otherToggler.addOption("Other");
        widgets.add(otherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_SESSION, "Other", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        otherSkipper.build();
        sessionType.addDependentWidgets(otherToggler.getToggleMap());

        widgets.add(new RadioWidget(context, Keys.SEX_OF_PARTICIPANTS, "Sex of Participants", true, "Female", "Male", "Other"));
        widgets.add(new MultiSelectWidget(context, Keys.PARTICIPANTS_AGE_GROUP, LinearLayout.VERTICAL, "Participant Age Group", true, context.getResources().getStringArray(R.array.age_group)));
        MultiSelectWidget participantType = new MultiSelectWidget(context, Keys.PARTICIPANTS_TYPE, LinearLayout.VERTICAL, "Type of Participants", true, context.getResources().getStringArray(R.array.participant_type));
        widgets.add(participantType);

        ToggleWidgetData participantToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData participantrSkipper = participantToggler.addOption("Other");
        widgets.add(participantrSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_PARTICIPANTS, "Specify Other", InputType.TYPE_CLASS_TEXT, TWO_HUNDRED, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        widgets.add(participantrSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_OTHER, "Number of Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).build()).hideView());
        participantrSkipper.build();

        participantrSkipper = participantToggler.addOption("Students");
        widgets.add(participantrSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_STUDENTS, "Number of Students", InputType.TYPE_CLASS_NUMBER, THREE, true).build()).hideView());
        participantrSkipper.build();

        participantrSkipper = participantToggler.addOption("Parents");
        widgets.add(participantrSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_PARENTS, "Number of Parents", InputType.TYPE_CLASS_NUMBER, THREE, true).build()).hideView());
        participantrSkipper.build();

        participantrSkipper = participantToggler.addOption("Teachers");
        widgets.add(participantrSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_TEACHER, "Number of Teachers", InputType.TYPE_CLASS_NUMBER, THREE, true).build()).hideView());
        participantrSkipper.build();

        participantrSkipper = participantToggler.addOption("School Staff");
        widgets.add(participantrSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_SCHOOL_STAFF, "Number of School Staff", InputType.TYPE_CLASS_NUMBER, THREE, true).build()).hideView());
        participantrSkipper.build();

        participantrSkipper = participantToggler.addOption("Call Agents");
        widgets.add(participantrSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_CALL_AGENTS, "Number of Call Agents", InputType.TYPE_CLASS_NUMBER, THREE, true).build()).hideView());
        participantrSkipper.build();

        participantrSkipper = participantToggler.addOption("Other Professionals");
        widgets.add(participantrSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_OTHER_PROFESSION, "Number of Other Professionals", InputType.TYPE_CLASS_NUMBER, THREE, true).build()).hideView());
        participantrSkipper.build();

        participantType.addDependentWidgets(participantToggler.getToggleMap());

        widgets.add(new EditTextWidget.Builder(context, Keys.DAYS_QUANTITY, "Number of Days", InputType.TYPE_CLASS_NUMBER, TWO, true).build());
        return widgets;
    }

    private List<Widget> getStepDownTrainingWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));

        widgets.add(new UserWidget(context, Keys.MONITORED_BY, "Monitored By", getDummyList()));
        RadioWidget programLevel = new RadioWidget(context, Keys.LEVEL_OF_PROGRAM, "Level of Program", true, "Primary", "Secondary");
        widgets.add(programLevel);


        final RadioWidget programType = new RadioWidget(context, Keys.PARTICIPANT_TYPE, "Type of Program", true, "CSA", "LSBE");

        RadioSwitcher switcher = new RadioSwitcher(programType);
        switcher.add("Secondary", "LSBE");
        programLevel.setWidgetSwitchListener(switcher);
        widgets.add(programType);

        ToggleWidgetData programToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData csaSkipper = programToggler.addOption("CSA");
        ScoreWidget scoreWidget = new ScoreWidget(context, Keys.MONITORING_SCORE);
        ScoreCalculator scoreCalculator = new ScoreCalculator(scoreWidget);

        widgets.add(csaSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.MASTER_TRAINER_QUANTITY, "Total Number of Master Trainers", InputType.TYPE_CLASS_NUMBER, TWO, true).build()).hideView().addHeader("CSA Program"));
        widgets.add(csaSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.MASTER_TRAINER_NAME, "Name of Master Trainer", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, TWENTY, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build()).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.TEACHER_ID, "Teacher ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build()).hideView());

        final MultiSelectWidget subjects = new MultiSelectWidget(context, Keys.SUBJECT, LinearLayout.VERTICAL, "Subject Master Trainer is facilitating", true, context.getResources().getStringArray(R.array.facilities));
        widgets.add(csaSkipper.addWidgetToToggle(subjects).hideView());

        MultiSwitcher multiSwitcher = new MultiSwitcher(subjects, programType);

        final Widget masterTrainerSexualHealth = new RateWidget(context, Keys.MASTER_TRAINER_SEXUAL_HEALTH, "Master Trainer is able to accurately define sexual health", false).setScoreListener(scoreCalculator).hideView();
        widgets.add(masterTrainerSexualHealth);

        final Widget participatingDemo = new RateWidget(context, Keys.PARTICIPATING_DEMO, "Participants demonstrate an understanding of the three aspects of health and how they are interlinked", false).setScoreListener(scoreCalculator).hideView();
        widgets.add(participatingDemo);

        final Widget participatingSexGender = new RateWidget(context, Keys.PARTICIPATING_SEX_GENDER, "Participants demonstrate understanding of the difference between sex and gender", false).setScoreListener(scoreCalculator).hideView();
        widgets.add(participatingSexGender);

        final Widget participatingNorm = new RateWidget(context, Keys.PARTICIPATING_NORM, "Participants demonstrate understanding of gender norms and stereotypes and factors that regulate them", false).setScoreListener(scoreCalculator).hideView();
        widgets.add(participatingNorm);

        final Widget participatingCSA = new RateWidget(context, Keys.PARTICIPATING_UNDERSTAND_CSA, "Participants demonstrate understanding of the definition of CSA", false).setScoreListener(scoreCalculator).hideView();
        widgets.add(participatingCSA);

        final Widget participatingSign = new RateWidget(context, Keys.PARTICIPATING_SIGN, "Participants are able to accurately identify signs of CSA", false).setScoreListener(scoreCalculator).hideView();
        widgets.add(participatingSign);

        final Widget participatingPrevention = new RateWidget(context, Keys.PARTICIPATING_PREVENTION, "Participants are able to accurately identify signs of CSA", false).setScoreListener(scoreCalculator).hideView();
        widgets.add(participatingPrevention);

        final Widget masterTrainerMyth = new RateWidget(context, Keys.MASTER_TRAINER_MYTH, "Master Trainer accurately explains and dispels all myths associated with CSA", false).setScoreListener(scoreCalculator).hideView();
        widgets.add(masterTrainerMyth);

        final Widget masterTrainerAids = new RateWidget(context, Keys.MASTER_TRAINER_AIDS, "Master Trainer uses videos on CSA as aids in facilitation", false).setScoreListener(scoreCalculator).hideView();
        widgets.add(masterTrainerAids);

        final Widget masterTrainerBurgerMethod = new RateWidget(context, Keys.MASTER_TRAINER_AIDS, "Master Trainer provides constructive feedback to participants after implementation of flashcards using the ‘Burger Method’", false).setScoreListener(scoreCalculator).hideView();
        widgets.add(masterTrainerBurgerMethod);

        multiSwitcher.addNewOption().addKeys("Health", "CSA").addWidgets(masterTrainerSexualHealth, participatingDemo).build();
        multiSwitcher.addNewOption().addKeys("Gender", "CSA").addWidgets(participatingSexGender, participatingNorm).build();
        multiSwitcher.addNewOption().addKeys("CSA", "CSA").addWidgets(participatingCSA, participatingSign, participatingPrevention, masterTrainerMyth, masterTrainerAids).build();
        multiSwitcher.addNewOption().addKeys("Implementation Feedback", "CSA").addWidgets(masterTrainerBurgerMethod).build();

        subjects.setMultiWidgetSwitchListener(multiSwitcher);
        programType.setMultiSwitchListenerList(multiSwitcher);

        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_AIDS, "Master Trainer is actively using the training guide to aid in facilitation of content", false).setScoreListener(scoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_GOOD_UNDERSTANDING, "Master Trainer demonstrates good understanding of the training content", false).setScoreListener(scoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_MATERIAL, "Master Trainer had all materials prepared in advance for the session", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_WELL_PREPARED, "Master Trainer was well prepared in their facilitation of the content", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_ALLOTED_TIME, "An appropriate amount of time is allotted to each activity and topic", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_COMFORTABLE_SPEAKING, "Master Trainer is comfortable speaking about this subject", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_JUDGEMENTAL_TONE, "Master Trainer uses a non-judgmental tone while facilitating the session", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_OWN_OPINIONS, "Master Trainer does not impose their own values or opinion on the participants", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_PROBES, "Master Trainer is engaging participants in discussion throughout session by providing probes", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.PARTICIPANTS_DISCUSSION, "Participants are actively participating in discussion", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.PARTICIPANTS_ATTENTION, "Participants are actively paying attention to the session while the Master Trainer is instructing", true).setScoreListener(scoreCalculator)).hideView());


        widgets.add(csaSkipper.addWidgetToToggle(scoreWidget.hideView()));
        csaSkipper.build();

        ToggleWidgetData.SkipData lsbeSkipper = programToggler.addOption("LSBE");
        ScoreWidget lsbeWidget = new ScoreWidget(context, Keys.MONITORING_SCORE);
        ScoreCalculator lsbeScore = new ScoreCalculator(lsbeWidget);

        widgets.add(lsbeSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.MASTER_TRAINER_QUANTITY, "Total Number of Master Trainers", InputType.TYPE_CLASS_NUMBER, TWO, true).build()).addHeader("LSBE Program").hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.TEACHER_ID, "Teacher ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build()).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.MASTER_TRAINER_NAME, "Name of Master Trainer", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, TWENTY, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build()).hideView());

        final MultiSelectWidget lsbeSubjects = new MultiSelectWidget(context, Keys.SUBJECT, LinearLayout.VERTICAL, "Subject Master Trainer is facilitating", true, context.getResources().getStringArray(R.array.facilities_lsbe));
        widgets.add(lsbeSkipper.addWidgetToToggle(lsbeSubjects).hideView());
        MultiSwitcher lsbeSwitcher = new MultiSwitcher(lsbeSubjects, programType);

        final Widget masterTrainerCrossLine = new RateWidget(context, Keys.MASTER_TRAINER_CROSSLINE, "Master Trainer correctly conducts the Cross the Line activity", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerCrossLine);

        final Widget masterTrainerValues = new RateWidget(context, Keys.MASTER_TRAINER_VALUES, "Master Trainer clearly defines values", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerValues);

        final Widget participantUnderstand = new RateWidget(context, Keys.PARTICIPANTS_UNDERSTAND, "Participants clearly understand the factors that regulate values", false).setScoreListener(lsbeScore).hideView();
        widgets.add(participantUnderstand);

        final Widget masterTrainerRights = new RateWidget(context, Keys.MASTER_TRAINER_RIGHTS, "Master trainer clearly describes human rights", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerRights);

        final Widget participantRights = new RateWidget(context, Keys.PARTICIPANTS_RIGHTS, "Participants demonstrate clear understanding of the impact of human rights violations", false).setScoreListener(lsbeScore).hideView();
        widgets.add(participantRights);

        final Widget masterTrainerSexGender = new RateWidget(context, Keys.MASTER_TRAINER_SEX_GENDER, "Participants demonstrate understanding of the difference between sex and gender", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerSexGender);

        final Widget participatingNormLSBE = new RateWidget(context, Keys.PARTICIPATING_NORM, "Participants demonstrate understanding of gender norms and stereotypes and factors that regulate them", false).setScoreListener(lsbeScore).hideView();
        widgets.add(participatingNormLSBE);

        final Widget masterTrainerSexualHealthLSBE = new RateWidget(context, Keys.MASTER_TRAINER_SEXUAL_HEALTH, "Master Trainer is able to accurately define sexual health", false).setScoreListener(scoreCalculator).hideView();
        widgets.add(masterTrainerSexualHealthLSBE);

        final Widget participatingUnderstandHealth = new RateWidget(context, Keys.PARTICIPATING_UNDERSTAND_HEALTH, "Participants demonstrate understanding of gender norms and stereotypes and factors that regulate them", false).setScoreListener(lsbeScore).hideView();
        widgets.add(participatingUnderstandHealth);

        final Widget masterTrainerViolence = new RateWidget(context, Keys.MASTER_TRAINER_VIOLENCE, "Master Trainer has correctly described the different types of violence", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerViolence);

        final Widget masterTrainerViolenceImpact = new RateWidget(context, Keys.MASTER_TRAINER_VIOLENCE_IMPACT, "Master Trainer has effectively described the impact of violence on an individual’s life", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerViolenceImpact);

        final Widget masterTrainerPuberty = new RateWidget(context, Keys.MASTER_TRAINER_PUBERTY, "Master Trainer was able to clearly explain changes that occur during puberty for boys and girls", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerPuberty);

        final Widget masterTrainerPubertyMyth = new RateWidget(context, Keys.MASTER_TRAINER_PUBERTY_MYTH, "Master Trainer has clearly explained and dispelled myths related to puberty in both boys and girls", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerPubertyMyth);

        final Widget masterTrainerBurgerMethodLSBE = new RateWidget(context, Keys.MASTER_TRAINER_BURGER, "Master Trainer provides constructive feedback to participants after implementation of flashcards using the ‘Burger Method’", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerBurgerMethodLSBE);

        lsbeSwitcher.addNewOption().addKeys("VCAT", "LSBE").addWidgets(masterTrainerCrossLine, masterTrainerValues, participantUnderstand).build();
        lsbeSwitcher.addNewOption().addKeys("Human Rights", "LSBE").addWidgets(masterTrainerRights, participantRights).build();
        lsbeSwitcher.addNewOption().addKeys("Gender Equality", "LSBE").addWidgets(masterTrainerSexGender, participatingNormLSBE).build();
        lsbeSwitcher.addNewOption().addKeys("Sexual Health and Rights", "LSBE").addWidgets(masterTrainerSexualHealthLSBE, participatingUnderstandHealth).build();
        lsbeSwitcher.addNewOption().addKeys("Violence", "LSBE").addWidgets(masterTrainerViolence, masterTrainerViolenceImpact).build();
        lsbeSwitcher.addNewOption().addKeys("Puberty", "LSBE").addWidgets(masterTrainerPuberty, masterTrainerPubertyMyth).build();
        lsbeSwitcher.addNewOption().addKeys("Implementation Feedback", "LSBE").addWidgets(masterTrainerBurgerMethodLSBE).build();

        lsbeSubjects.setMultiWidgetSwitchListener(lsbeSwitcher);
        programType.setMultiSwitchListenerList(lsbeSwitcher);

        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_AIDS, "Master Trainer is actively using the training guide to aid in facilitation of content", false).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_GOOD_UNDERSTANDING, "Master Trainer demonstrates good understanding of the training content", false).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_MATERIAL, "Master Trainer had all materials prepared in advance for the session", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_WELL_PREPARED, "Master Trainer was well prepared in their facilitation of the content", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_ALLOTED_TIME, "An appropriate amount of time is allotted to each activity and topic", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_COMFORTABLE_SPEAKING, "Master Trainer is comfortable speaking about this subject", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_JUDGEMENTAL_TONE, "Master Trainer uses a non-judgmental tone while facilitating the session", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_OWN_OPINIONS, "Master Trainer does not impose their own values or opinion on the participants", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_PROBES, "Master Trainer is engaging participants in discussion throughout session by providing probes", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.PARTICIPANTS_DISCUSSION, "Participants are actively participating in discussion", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.PARTICIPANTS_ATTENTION, "Participants are actively paying attention to the session while the Master Trainer is instructing", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(lsbeWidget.hideView()));
        lsbeSkipper.build();

        programType.addDependentWidgets(programToggler.getToggleMap());

        return widgets;
    }

    private List<Widget> getMasterTrainerMockWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));

        widgets.add(new UserWidget(context, Keys.MONITORED_BY, "Monitored By", getDummyList()));

        widgets.add(new SpinnerWidget(context, Keys.TEACHER_NAME, "Name of Teacher", Arrays.asList(context.getResources().getStringArray(R.array.empty_list)), false));
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_ID, "Teacher ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());

        RadioWidget programLevel = new RadioWidget(context, Keys.LEVEL_OF_PROGRAM, "Level of Program", true, "Primary", "Secondary");
        widgets.add(programLevel);

        final RadioWidget programType = new RadioWidget(context, Keys.TYPE_OF_PROGRAM_IN_SCHOOL, "Type of program being evaluated", true, "CSA", "LSBE");

        RadioSwitcher programSwitcher = new RadioSwitcher(programType);
        programSwitcher.add("Secondary", "LSBE");
        programLevel.setWidgetSwitchListener(programSwitcher);
        widgets.add(programType);


        ToggleWidgetData programToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData csaSkipper = programToggler.addOption("CSA");
        ScoreWidget scoreWidget = new ScoreWidget(context, Keys.MONITORING_SCORE).setLabel("Cumulative MT Mock Session Score:", "% Score");
        ScoreCalculator scoreCalculator = new ScoreCalculator(scoreWidget);

        widgets.add(csaSkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.CSA_FLASHCARD, LinearLayout.HORIZONTAL, "CSA Flashcard being run", true, context.getResources().getStringArray(R.array.csa_flashcard)).addHeader("CSA Program").hideView()));
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_USING_PROMPTS, "Master Trainer is using the prompts provided in the CSA flashcard guide", true).setScoreListener(scoreCalculator).hideView()));
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_MEETING_OBJECTIVE, "Master Trainer is meeting the objective of their flashcard even if they are not using all prompts provided in the CSA flashcard guide", true).setScoreListener(scoreCalculator).hideView()));
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_GOOD_UNDERSTANDING, "Master Trainer shows good understanding of the message of the flashcard", true).setScoreListener(scoreCalculator).hideView()));
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_COMFORTABLE_SPEAKING, "Master Trainer is comfortable speaking about this subject", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_JUDGEMENTAL_TONE, "Master Trainer uses a non-judgmental tone while facilitating the session", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_OWN_OPINIONS, "Master Trainer does not impose their own values or opinion on the participants", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_PARTICIPANTS, "Master Trainer is leading participants to the main message of the flashcard through probes and not providing the message to participants in a lecture style presentation", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(scoreWidget).hideView());
        csaSkipper.build();

        ToggleWidgetData.SkipData lsbeSkipper = programToggler.addOption("LSBE");
        final RadioWidget lsbeLevel = new RadioWidget(context, Keys.LSBE_LEVEL, "Level Master Trainer is facilitating", true, "Level 1", "Level 2");
        final MultiSwitcher multiSwitcher = new MultiSwitcher(programType, lsbeLevel);

        widgets.add(lsbeSkipper.addWidgetToToggle(lsbeLevel.addHeader("LSBE Program")).hideView());

        final SpinnerWidget levelOneSubject = new SpinnerWidget(context, Keys.LEVEL_ONE_COURSE, "Subject Master Trainer is facilitating", Arrays.asList(context.getResources().getStringArray(R.array.lsbe_level_1_subject)), true);
        final SpinnerWidget levelTwoSubject = new SpinnerWidget(context, Keys.LEVEL_TWO_COURSE, "Subject Master Trainer is facilitating", Arrays.asList(context.getResources().getStringArray(R.array.lsbe_level_2_subject)), true);
        multiSwitcher.addNewOption().addKeys("LSBE", "Level 1").addWidget(levelOneSubject).build();
        multiSwitcher.addNewOption().addKeys("LSBE", "Level 2").addWidget(levelTwoSubject).build();
        widgets.add(levelOneSubject.hideView());
        widgets.add(levelTwoSubject.hideView());
        lsbeLevel.setMultiSwitchListenerList(multiSwitcher);
        programType.setMultiSwitchListenerList(multiSwitcher);


        final MultiSwitcher lsbeSwitcher = new MultiSwitcher(programType, lsbeLevel, levelOneSubject);
        final ScoreWidget lsbeScoreWidget = new ScoreWidget(context, Keys.MONITORING_SCORE);
        final ScoreCalculator lsbeScore = new ScoreCalculator(lsbeScoreWidget);

        final Widget masterTrainerCommunication = new RateWidget(context, Keys.MASTER_TRAINER_COMMUNICATION, "Master Trainer was able to effectively relay the importance of communication", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerCommunication);

        final Widget masterTrainerValues = new RateWidget(context, Keys.MASTER_TRAINER_VALUES, "Master Trainer was able to effectively define values", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerValues);

        final Widget masterTrainerGender = new RateWidget(context, Keys.MASTER_TRAINER_GENDER, "Master Trainer was able to correctly differentiate between sex and gender", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerGender);

        final Widget masterTrainerSelfProtection = new RateWidget(context, Keys.MASTER_TRAINER_SELF_PROTECTION, "Master Trainer was able to correctly explain methods of self-protection", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerSelfProtection);

        final Widget masterTrainerPeerPressure = new RateWidget(context, Keys.MASTER_TRAINER_PEER_PRESSURE, "Master Trainer was able to correctly explain peer pressure and its impacts", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerPeerPressure);

        final Widget masterTrainerPuberty = new RateWidget(context, Keys.MASTER_TRAINER_PUBERTY, "Master Trainer was able to clearly explain changes that occur during puberty for boys and girls", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerPuberty);

        final Widget masterTrainerDescribeComm = new RateWidget(context, Keys.MASTER_TRAINER_DESCRIBE_COMM, "Master Trainer has effectively described the different components of communication and their importance", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerDescribeComm);

        final Widget masterTrainerGenderNorms = new RateWidget(context, Keys.MASTER_TRAINER_GENDER_NORMS, "Master Trainer has clearly explained gender norms and stereotypes and their impact", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerGenderNorms);

        final Widget masterTrainerGenderDiscrimination = new RateWidget(context, Keys.MASTER_TRAINER_GENDER_DISC, "Master Trainer has accurately described gender discrimination and its impact", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerGenderDiscrimination);

        final Widget masterTrainerPubertyMyth = new RateWidget(context, Keys.MASTER_TRAINER_PUBERTY_MYTH, "Master Trainer has clearly explained and dispelled myths related to puberty in both boys and girls", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerPubertyMyth);

        final Widget masterTrainerMarriage = new RateWidget(context, Keys.MASTER_TRAINER_MARRIAGE, "Master Trainer has effectively described the nikah nama and its clauses", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerMarriage);

        final Widget masterTrainerMaternalMorality = new RateWidget(context, Keys.MASTER_TRAINER_MATERNAL_MORALITY, "Master Trainer has accurately described the causes of maternal mortality", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerMaternalMorality);

        final Widget masterTrainerMaternalHealth = new RateWidget(context, Keys.MASTER_TRAINER_MATERNAL_HEALTH, "Master Trainer has clearly linked early age marriage with negative consequences in maternal health", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerMaternalHealth);

        final Widget masterTrainerHIV = new RateWidget(context, Keys.MASTER_TRAINER_HIV, "Master Trainer has correctly described HIV", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerHIV);

        final Widget masterTrainerHIVModes = new RateWidget(context, Keys.MASTER_TRAINER_HIV_MODES, "Master Trainer has correctly described the modes of transmission of HIV", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerHIVModes);

        final Widget masterTrainerHIVPrevention = new RateWidget(context, Keys.MASTER_TRAINER_HIV_PREVENTION, "Master Trainer has correctly described HIV prevention strategies", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerHIVPrevention);

        final Widget masterTrainerViolence = new RateWidget(context, Keys.MASTER_TRAINER_VIOLENCE, "Master Trainer has correctly described the different types of violence", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerViolence);

        final Widget masterTrainerViolenceImpact = new RateWidget(context, Keys.MASTER_TRAINER_VIOLENCE_IMPACT, "Master Trainer has effectively described the impact of violence on an individual’s life", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerViolenceImpact);

        lsbeSwitcher.addNewOption().addKeys("LSBE", "Level 1", "Communication").addWidgets(masterTrainerCommunication).build();
        lsbeSwitcher.addNewOption().addKeys("LSBE", "Level 1", "Values").addWidgets(masterTrainerValues).build();
        lsbeSwitcher.addNewOption().addKeys("LSBE", "Level 1", "Gender").addWidgets(masterTrainerGender).build();
        lsbeSwitcher.addNewOption().addKeys("LSBE", "Level 1", "Self-Protection").addWidgets(masterTrainerSelfProtection).build();
        lsbeSwitcher.addNewOption().addKeys("LSBE", "Level 1", "Peer Pressure").addWidgets(masterTrainerPeerPressure).build();
        lsbeSwitcher.addNewOption().addKeys("LSBE", "Level 1", "Puberty").addWidgets(masterTrainerPuberty).build();

        levelOneSubject.setMultiWidgetSwitchListener(lsbeSwitcher);
        lsbeLevel.setMultiSwitchListenerList(lsbeSwitcher);
        programType.setMultiSwitchListenerList(lsbeSwitcher);

        final MultiSwitcher levelTwoSwitcher = new MultiSwitcher(levelTwoSubject, lsbeLevel, programType);

        levelTwoSwitcher.addNewOption().addKeys("LSBE", "Level 2", "Effective Communication").addWidgets(masterTrainerCommunication, masterTrainerDescribeComm).build();
        levelTwoSwitcher.addNewOption().addKeys("LSBE", "Level 2", "Gender").addWidgets(masterTrainerGender, masterTrainerGenderNorms, masterTrainerGenderDiscrimination).build();
        levelTwoSwitcher.addNewOption().addKeys("LSBE", "Level 2", "Puberty").addWidgets(masterTrainerPuberty, masterTrainerPubertyMyth).build();
        levelTwoSwitcher.addNewOption().addKeys("LSBE", "Level 2", "Youth and Family(Marriage)").addWidgets(masterTrainerMarriage).build();
        levelTwoSwitcher.addNewOption().addKeys("LSBE", "Level 2", "Maternal and Child Health").addWidgets(masterTrainerMaternalMorality, masterTrainerMaternalHealth).build();
        levelTwoSwitcher.addNewOption().addKeys("LSBE", "Level 2", "HIV/AIDS").addWidgets(masterTrainerHIV, masterTrainerHIVModes, masterTrainerHIVPrevention).build();
        levelTwoSwitcher.addNewOption().addKeys("LSBE", "Level 2", "Violence").addWidgets(masterTrainerViolence, masterTrainerViolenceImpact).build();

        levelTwoSubject.setMultiWidgetSwitchListener(levelTwoSwitcher);
        lsbeLevel.setMultiSwitchListenerList(levelTwoSwitcher);
        programType.setMultiSwitchListenerList(levelTwoSwitcher);

        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_FACILITATION, "Master Trainer is actively using the training guide to aid in facilitation of content", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_CONTENT_UNDERSTANDING, "Master Trainer demonstrates good understanding of the training content", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_MATERIAL, "Master Trainer had all materials prepared in advance for the session", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_WELL_PREPARED, "Master Trainer was well prepared in their facilitation of the content", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_ALLOTED_TIME, "An appropriate amount of time is allotted to each activity and topic", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_COMFORTABLE_SPEAKING, "Master Trainer is comfortable speaking about this subject", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_JUDGEMENTAL_TONE, "Master Trainer uses a non-judgmental tone while facilitating the session", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_OWN_OPINIONS, "Master Trainer does not impose their own values or opinion on the participants", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_PROBES, "Master Trainer is engaging participants in discussion throughout session by providing probes", true).setScoreListener(lsbeScore)).hideView());

        widgets.add(lsbeSkipper.addWidgetToToggle(lsbeScoreWidget.hideView()));
        lsbeSkipper.build();
        programType.addDependentWidgets(programToggler.getToggleMap());
        return widgets;
    }

    private List<Widget> getSRHRPolicyWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new UserWidget(context, Keys.MONITORED_BY, "Monitored By", getDummyList()));
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        final RadioWidget schoolClassification = new RadioWidget(context, Keys.SCHOOL_CLASSIFICATION, "Classification of School by Sex", true, "Girls", "Boys", "Co-ed");
        widgets.add(schoolClassification);

        ToggleWidgetData policyToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData policySkipper = policyToggler.addOption("Yes");
        RadioWidget policy = new RadioWidget(context, Keys.POLICY, "Has this school implemented the SRHR Policy Guildelines?", true, "Yes", "No");
        widgets.add(policy.addHeader("SRHR Policy"));
        ScoreWidget scoreWidget = new ScoreWidget(context, Keys.MONITORING_SCORE);
        ScoreCalculator scoreCalculator = new ScoreCalculator(scoreWidget);
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.STUDENT_AWARENESS_ABOUT_TEACHERS, "Student are aware of which teachers are trained on SRHR and are available for support", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.student_awareness))).setScoreListener(scoreCalculator).addHeader("1. Promotion of SRH Education in Schools").hideView()));
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.MANAGEMENT_SAFE_AND_SECURE_PLACE, "School Management has created a safe and secure space where teachers trained on SRHR are able to teach and counsel students on SRHR issues", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.MANAGEMENT_INITIATIVE, "School Management takes the initiative to organize capacity building training sessions for teachers on a need basis", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.STUDENT_ACCESS_MATERIAL, "Students have access to SRHR IEC materials within the school vicinity", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.ENCOURAGE_ACTIVITIES, "School encourages all students of all genders to be involved in extracurricular activities, such as sports and arts", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.INVOLVES_PARENTS, "School Management involves parents in the SRHR programs through various activities throughout the school year", true).setScoreListener(scoreCalculator).addHeader("2. Parental Involvement to Strengthen SRH Education Programs in Schools")).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.SENSITIZED_SRHR, "Parents are sensitized on the SRHR curriculum and implementation of SRHR policies on an annual basis", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.PARENTS_ARE_UPDATED, "Parents are updated on their child's progress regarding the SRHR classes during parent teacher meetings", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.PARENTS_ARE_UPDATED, "Parents are updated on their child's progress regarding the SRHR classes during parent teacher meetings", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_ENCOURAGE, "School Management and teachers encourage the information and role of parent groups in school and support them in their initiatives", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.COUNSELING_SPACE, "Safe and secure spaces are available in the school where counseling can take palce", true, "Yes", "No").setScoreListener(scoreCalculator).addHeader("3. Provision of Psychosocial Services to Address Student's SRHR and Other Issues")).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.CERTIFIED_COUNSELER, "Counselors at this school are trained and certified by a reputable organization", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.STUDENT_AWARENESS_ABOUT_COUNSELING, "Students are aware of the counseling services offered", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.SCHOOL_USE_REFERRAL_GUIDE, "School Management and counselors use the Referral Guide provided by Aahung when needed", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator).hideView()));
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.COUNSELOR_INFORM_MANAGEMENT, "Counselors inform management about any cases that require urgent attention", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator).hideView()));
        widgets.add(policySkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.SCHOOL_FIRST_AID, LinearLayout.VERTICAL, "This school has a proper First Aid Kit that includes the following", true, context.getResources().getStringArray(R.array.first_aid)).setScoreListener(scoreCalculator)).addHeader("4. Provision of First Aid Management").hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.FOCAL_PERSON_HAS_TRAINING, "There is a focal person for medical care who has First Aid training and is responsible for the First Aid kit", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.FIRST_AID_CHECKED, "The First Aid kit is checked on a monthly basis and refilled regularly", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.FOCAL_PERSON_INFORM_MANAGEMENT, "The focal person for medical care informs management about any cases that require urgent attention", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator)).hideView());

        Widget mhmKitAvailable = new RadioWidget(context, Keys.HYGIENE_MANAGEMENT, "The school has a menstrual hygiene management(MHM) kit readily available for students and teachers that include necessary items such as soap, pads and underwear", true, "Yes", "No").setScoreListener(scoreCalculator);
        Widget personForKit = new RadioWidget(context, Keys.PERSON_FOR_KIT, "There is a focal person who oversees the maintenance of the MHM kit", true, "Yes", "No").setScoreListener(scoreCalculator);
        Widget kitChecked = new RadioWidget(context, Keys.KIT_CHECKED, "The MHM kit is checked on a monthly basis and is regularly refilled", true, "Yes", "No").setScoreListener(scoreCalculator);

        MultiSwitcher multiSwitcher = new MultiSwitcher(schoolClassification, policy);
        multiSwitcher.addNewOption().addKeys("Yes", "Girls").addWidgets(mhmKitAvailable, personForKit, kitChecked).build();
        multiSwitcher.addNewOption().addKeys("Yes", "Co-ed").addWidgets(mhmKitAvailable, personForKit, kitChecked).build();
        widgets.add(mhmKitAvailable.addHeader("5. Improving Menstrual Hygiene Management in Schools").hideView());
        widgets.add(personForKit.hideView());
        widgets.add(kitChecked.hideView());
        schoolClassification.setMultiSwitchListenerList(multiSwitcher);
        policy.setMultiSwitchListenerList(multiSwitcher);

        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.ACCESS_CLEAN_WATER, "Teachers and students have access to clean drinking water", true, "Yes", "No").setScoreListener(scoreCalculator)).addHeader("6. Provision of Safe, Clean and Hygiene Food and Water Sanitation").hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.HYGIENE_SPACE_FOR_FOOD, "Teacher and students have access to a hygienic space where food can be consumed", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.HYGIENIC_SANITATION, "Teachers and students have easy access to safe, clean and hygienic sanitation facilities", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.STAFF_HIRED, "Support staff hired to assist primary school children with going to the toilet are trained on appropriate use of language and cleaning techniques", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.SEPARATE_TOILETS, "Toilets for boys and girls are separate", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.CLOSE_TOILETS, "Toilets are within close proximity to the classrooms", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.TOILET_PERMISSION, "Teachers allow students to go to the toilet when they request permission", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.TOILET_WELL_EQUIPPED, "Toilets are well equipped with clean water, soap, tissue paper, toilet rolls and dust-bins", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.PROPER_USE_OF_TOILET, "Students are well aware of proper toilet etiquette to improve hygienic practices, i.e. importance of hand washing, flushing, cleaning the toilet seat and not wasting water", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.STAFF_CLEAN_TOILETS, "Support staff cleans the toilets at least 2-3 times a day with antibacterial products", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.ZERO_TOLERANCE, "School management maintains a zero tolerance policy for any teachers, students and staff that commit any of the following: discrimination; sexual harassment; verbal or physical abuse; use of alcohol or drugs on school premises; sharing confidential information of students; teachers or staff; using school premises for illegal activity; criminal activities, theft or fraud", true, "Yes", "No").setScoreListener(scoreCalculator)).addHeader("7. Zero Tolerance Policy").hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.SECURITY_MEASURES, "The school management takes appropriate security measures (such as collecting their ID document) with all visitors entering the school premises", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator)).addHeader("8. Safety and Security").hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.UPDATE_PARENTS_ON_SECURITY, "School management updates parents on security related policies and concerns that impact students", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.ADULT_RESPONSIBLE, "School management is informed about the adult responsible for the pick/drop of student", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
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
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.PARENT_ORGANISATION_NAME, "Parent Organization Name", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.PARENT_ORGANISATION_ID, "Parent Organization ID", InputType.TYPE_CLASS_NUMBER, SIX, true).build());

        RadioWidget partnerType = new RadioWidget(context, Keys.PARTNER_WITH, "Partner with", true, "LSE", "SRHM");
        widgets.add(partnerType);

        ToggleWidgetData partnerToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData lseSkipper = partnerToggler.addOption("LSE");
        widgets.add(lseSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.SCHOOL_UNDER_ORGANIZATION, "No. of school under the organization", InputType.TYPE_CLASS_NUMBER, FOUR, true).setMinimumValue(ONE).build()).hideView());
        lseSkipper.build();

        ToggleWidgetData.SkipData srhmSkipper = partnerToggler.addOption("SRHM");
        widgets.add(srhmSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.INSTITUTE_UNDER_ORGANIZATION, "No. of institutions under the organization", InputType.TYPE_CLASS_NUMBER, FOUR, true).setMinimumValue(ONE).build()).hideView());
        srhmSkipper.build();

        partnerType.addDependentWidgets(partnerToggler.getToggleMap());

        widgets.add(new EditTextWidget.Builder(context, Keys.OFFICE_ADDRESS, "Office Address", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_ADDRESS_CHARACTER_SET)).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.POINT_OF_CONTACT, "Name of Point of Contact", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new PhoneWidget(context, Keys.PHONE_NUMBER, "Phone Number of point of contact", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.EMAIL, "Email of Point of Contact", InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_EMAIL_CHARACTER_SET)).build());

        return widgets;
    }

    private List<Widget> getSecondaryMonitoringExitWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        widgets.add(new UserWidget(context, Keys.MONITORED_BY, "Monitored By", getDummyList()));

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

        widgets.add(new SpinnerWidget(context, Keys.TEACHER_NAME, "Name of Teacher", Arrays.asList(context.getResources().getStringArray(R.array.empty_list)), false));
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_ID, "Teacher ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new RadioWidget(context, Keys.CLASS, "Class", true, "6", "7", "8", "9", "10"));
        widgets.add(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENTS, "Number of Students in Class", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.DURATION_OF_CLASS, "Time duration of class in minutes", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).build());

        ToggleWidgetData levelToggler = new ToggleWidgetData();
        RadioWidget level = new RadioWidget(context, Keys.LSBE_LEVEL, "LSBE Level", true, "Level 1", "Level 2");
        widgets.add(level.addHeader("LSBE Program"));

        ToggleWidgetData.SkipData levelOneSkipper = levelToggler.addOption("Level 1");
        widgets.add(levelOneSkipper.addWidgetToToggle(new SpinnerWidget(context, Keys.CHAPTERS_LEVEL_1, "LSBE Chapter - Level 1", Arrays.asList(context.getResources().getStringArray(R.array.level_one_chapters)), true)).hideView());
        levelOneSkipper.build();

        ToggleWidgetData.SkipData levelTwoSkipper = levelToggler.addOption("Level 2");
        widgets.add(levelTwoSkipper.addWidgetToToggle(new SpinnerWidget(context, Keys.CHAPTERS_LEVEL_2, "LSBE Chapter - Level 2", Arrays.asList(context.getResources().getStringArray(R.array.level_two_chapters)), true)).hideView());
        levelTwoSkipper.build();

        widgets.add(new RadioWidget(context, Keys.CSA_REVISION_OR_FIRSTTIME, "Revision or First time chapter is being taught", true, "Revision", "First time"));

        ScoreWidget scoreWidget = new ScoreWidget(context, Keys.MONITORING_SCORE).setLabel("Cumulative Monitoring Score","% Monitoring Score");
        ScoreCalculator scoreCalculator = new ScoreCalculator(scoreWidget);
        widgets.add(new RateWidget(context, Keys.USING_TEACHERS_GUIDE, "The teacher is actively using the teacher's guide to aid in facilitation of content", true).setScoreListener(scoreCalculator).addHeader("Facilitation"));
        widgets.add(new RateWidget(context, Keys.RELAYING_MAIN_MESSAGE, "The teacher is clearly relaying the main messages of the chapter, even if they are not actively using the teacher's guide", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.GOOD_UNDERSTANDING, "The teacher demonstrate good understanding of the LSBE content", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.PREPARED_MATERIAL, "The teacher had all materials prepared in advance for the class", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_WELL_PREPARED, "The teacher was well prepared to facilitate the session", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TIME_ALLOTED_FOR_ACTIVITY, "An appropriate amount of time is allotted for each activity and topic", true).setScoreListener(scoreCalculator));

        RadioWidget newActivities = new RadioWidget(context, Keys.BEYOND_GUIDE, "Teacher has gone beyond the teacher’s guide to build on and/or develop new activities", true, "Yes", "No");
        widgets.add(newActivities.setScoreListener(scoreCalculator));

        MultiSelectWidget activities = new MultiSelectWidget(context, Keys.NEW_ACTIVITIES, LinearLayout.VERTICAL, "What has the teacher done that is new?", true, context.getResources().getStringArray(R.array.activities));
        widgets.add(activities.hideView());

        ToggleWidgetData activitiesToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData activitiesSkipper = activitiesToggler.addOption("Yes");
        activitiesSkipper.addWidgetToToggle(activities);
        activitiesSkipper.build();
        newActivities.addDependentWidgets(activitiesToggler.getToggleMap());

        widgets.add(new RateWidget(context, Keys.TEACHER_COMFORTABLE_SPEAKING, "The teacher is comfortable speaking about this subject", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_JUDGEMENTAL_TONE, "The teacher uses a non-judgmental tone while facilitating the session", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_OWN_OPINIONS, "The teacher does not impose their own values or opinion on the participants", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_ENGAGING, "The teacher is engaging participants in discussion throughout session by providing probes", true).setScoreListener(scoreCalculator));

        widgets.add(new RateWidget(context, Keys.STUDENTS_UNDERSTAND_MESSAGE, "Students demonstrate clear understanding of the main messages of the chapter", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.STUDENTS_ACTIVELY_PARTICIPATE, "Students are actively participating in discussion on the chapter", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.STUDENTS_PAYING_ATTENTION, "Students are actively paying attention to the class while the teacher is instructing", true).setScoreListener(scoreCalculator));

        RadioWidget timetable = new RadioWidget(context, Keys.MANAGEMENT_INTEGRATED_LSBE, "Management has integrated the LSBE program into the school timetable", true, "Yes", "No");
        widgets.add(timetable.setScoreListener(scoreCalculator).addHeader("Management"));

        RadioWidget frequency = new RadioWidget(context, Keys.CLASS_FREQUENCY, "Frequency of class in time table", true, "Weekly", "Biweekly", "Monthly", "Other");
        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build();
        ToggleWidgetData togglerFrequency = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = togglerFrequency.addOption("Yes");
        skipData.addWidgetToToggle(frequency);
        skipData.build();
        widgets.add(frequency.hideView());
        timetable.addDependentWidgets(togglerFrequency.getToggleMap());

        MultiSwitcher timeTableMultiSwitcher = new MultiSwitcher(timetable,frequency);
        timeTableMultiSwitcher.addNewOption().addKeys("Yes","Other").addWidgets(other).build();
        frequency.setMultiSwitchListenerList(timeTableMultiSwitcher);
        timetable.setMultiSwitchListenerList(timeTableMultiSwitcher);
        widgets.add(other.hideView());


        widgets.add(new RadioWidget(context, Keys.TWO_TEACHER, "There are at least 2 teachers assigned to teach the LSBE program", true, "Yes", "No").setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.EXCELLENT_COORDINATION, "There is excellent coordination between management and teachers regarding the LSBE program", true).setScoreListener(scoreCalculator));
        widgets.add(new EditTextWidget.Builder(context, Keys.MASTER_TRAINERS, "Number of Master Trainer leading LSBE program", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).build());
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

        final Widget workbookGirlOne = new EditTextWidget.Builder(context, Keys.WORKBOOK_1_GIRLS, "Workbook level 1 - Girls", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).build().hideView();
        final Widget workbookBoyOne = new EditTextWidget.Builder(context, Keys.WORKBOOK_1_BOYS, "Workbook level 1 - Boys", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).build().hideView();
        final Widget workbookBoyTwo = new EditTextWidget.Builder(context, Keys.WORKBOOK_2_BOYS, "Workbook level 2 - Boys", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).build().hideView();
        final Widget workbookGirlTwo = new EditTextWidget.Builder(context, Keys.WORKBOOK_2_GIRLS, "Workbook level 2 - Girls", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).build().hideView();
        final EditTextWidget requireOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        final Widget resourceRequireOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        requireOther.setWidgetListener(new QuantityChangeListener(resourceRequireOther));
        MultiSwitcher multiSwitcher = new MultiSwitcher(schoolClassification, resourceRequire);
        multiSwitcher.addNewOption().addKeys("Boys", "Yes").addWidgets(workbookBoyOne, workbookBoyTwo, requireOther).build();
        multiSwitcher.addNewOption().addKeys("Girls", "Yes").addWidgets(workbookGirlOne, workbookGirlTwo, requireOther).build();
        multiSwitcher.addNewOption().addKeys("Co-ed", "Yes").addWidgets(workbookBoyOne, workbookBoyTwo, workbookGirlOne, workbookGirlTwo, requireOther).build();
        widgets.add(workbookGirlOne);
        widgets.add(workbookBoyOne);
        widgets.add(workbookGirlTwo);
        widgets.add(workbookBoyTwo);
        widgets.add(requireOther.hideView());
        widgets.add(resourceRequireOther);
        schoolClassification.setMultiSwitchListenerList(multiSwitcher);
        resourceRequire.setMultiSwitchListenerList(multiSwitcher);

        RadioWidget resourceDistributed = new RadioWidget(context, Keys.SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, "Yes", "No");
        final Widget resourceworkbookGirlOne = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_1_GIRLS, "Workbook level 1 - Girls", InputType.TYPE_CLASS_NUMBER, THREE, false).build().hideView();
        final Widget resourceworkbookBoyOne = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_1_BOYS, "Workbook level 1 - Boys", InputType.TYPE_CLASS_NUMBER, THREE, false).build().hideView();
        final Widget resourceworkbookBoyTwo = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_2_BOYS, "Workbook level 2 - Boys", InputType.TYPE_CLASS_NUMBER, THREE, false).build().hideView();
        final Widget resourceworkbookGirlTwo = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_2_GIRLS, "Workbook level 2 - Girls", InputType.TYPE_CLASS_NUMBER, THREE, false).build().hideView();
        final EditTextWidget resourceDistributedOtherQuantity = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        final Widget resourceDistributedOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        resourceDistributedOtherQuantity.setWidgetListener(new QuantityChangeListener(resourceDistributedOther));
        multiSwitcher = new MultiSwitcher(schoolClassification, resourceDistributed);
        multiSwitcher.addNewOption().addKeys("Boys", "Yes").addWidgets(resourceworkbookBoyOne, resourceworkbookBoyTwo, resourceDistributedOtherQuantity).build();
        multiSwitcher.addNewOption().addKeys("Girls", "Yes").addWidgets(resourceworkbookGirlOne, resourceworkbookGirlTwo, resourceDistributedOtherQuantity).build();
        multiSwitcher.addNewOption().addKeys("Co-ed", "Yes").addWidgets(resourceworkbookBoyOne, resourceworkbookBoyTwo, resourceworkbookGirlOne, resourceworkbookGirlTwo, resourceDistributedOtherQuantity).build();
        widgets.add(resourceDistributed);
        widgets.add(resourceworkbookGirlOne);
        widgets.add(resourceworkbookBoyOne);
        widgets.add(resourceworkbookGirlTwo);
        widgets.add(resourceworkbookBoyTwo);
        widgets.add(resourceDistributedOtherQuantity.hideView());
        widgets.add(resourceDistributedOther);
        schoolClassification.setMultiSwitchListenerList(multiSwitcher);
        resourceDistributed.setMultiSwitchListenerList(multiSwitcher);


        schoolClassification.addDependentWidgets(schoolToggler.getToggleMap());
        level.addDependentWidgets(levelToggler.getToggleMap());


        return widgets;
    }

    private List<Widget> getSecondaryMonitoringRunningWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new UserWidget(context, Keys.MONITORED_BY, "Monitored By", getDummyList()));

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

        widgets.add(new SpinnerWidget(context, Keys.TEACHER_NAME, "Name of Teacher", Arrays.asList(context.getResources().getStringArray(R.array.empty_list)), false));
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_ID, "Teacher ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new RadioWidget(context, Keys.CLASS, "Class", true, "6", "7", "8", "9", "10"));
        widgets.add(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENTS, "Number of Students in Class", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.DURATION_OF_CLASS, "Time duration of class in minutes", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).build());

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

        RadioWidget newActivities = new RadioWidget(context, Keys.BEYOND_GUIDE, "Teacher has gone beyond the teacher’s guide to build on and/or develop new activities", true, "Yes", "No");
        widgets.add(newActivities.setScoreListener(scoreCalculator));

        MultiSelectWidget activities = new MultiSelectWidget(context, Keys.NEW_ACTIVITIES, LinearLayout.VERTICAL, "What has the teacher done that is new?", true, context.getResources().getStringArray(R.array.activities));
        widgets.add(activities.hideView());

        ToggleWidgetData activitiesToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData activitiesSkipper = activitiesToggler.addOption("Yes");
        activitiesSkipper.addWidgetToToggle(activities);
        activitiesSkipper.build();
        newActivities.addDependentWidgets(activitiesToggler.getToggleMap());

        widgets.add(new RateWidget(context, Keys.TEACHER_COMFORTABLE_SPEAKING, "The teacher is comfortable speaking about this subject", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_JUDGEMENTAL_TONE, "The teacher uses a non-judgmental tone while facilitating the session", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_OWN_OPINIONS, "The teacher does not impose their own values or opinion on the participants", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.TEACHER_ENGAGING, "The teacher is engaging participants in discussion throughout session by providing probes", true).setScoreListener(scoreCalculator));

        widgets.add(new RateWidget(context, Keys.STUDENTS_UNDERSTAND_MESSAGE, "Students demonstrate clear understanding of the main messages of the chapter", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.STUDENTS_ACTIVELY_PARTICIPATE, "Students are actively participating in discussion on the chapter", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.STUDENTS_PAYING_ATTENTION, "Students are actively paying attention to the class while the teacher is instructing", true).setScoreListener(scoreCalculator));


        RadioWidget timetable = new RadioWidget(context, Keys.MANAGEMENT_INTEGRATED_LSBE, "Management has integrated the LSBE program into the school timetable", true, "Yes", "No");
        widgets.add(timetable.setScoreListener(scoreCalculator).addHeader("Management"));

        RadioWidget frequency = new RadioWidget(context, Keys.CLASS_FREQUENCY, "Frequency of class in time table", true, "Weekly", "Biweekly", "Monthly", "Other");
        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build();
        ToggleWidgetData togglerFrequency = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = togglerFrequency.addOption("Yes");
        skipData.addWidgetToToggle(frequency);
        skipData.build();
        widgets.add(frequency.hideView());
        timetable.addDependentWidgets(togglerFrequency.getToggleMap());

        MultiSwitcher timeTableMultiSwitcher = new MultiSwitcher(timetable,frequency);
        timeTableMultiSwitcher.addNewOption().addKeys("Yes","Other").addWidgets(other).build();
        frequency.setMultiSwitchListenerList(timeTableMultiSwitcher);
        timetable.setMultiSwitchListenerList(timeTableMultiSwitcher);
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

        final Widget workbookGirlOne = new EditTextWidget.Builder(context, Keys.WORKBOOK_1_GIRLS, "Workbook level 1 - Girls", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).build().hideView();
        final Widget workbookBoyOne = new EditTextWidget.Builder(context, Keys.WORKBOOK_1_BOYS, "Workbook level 1 - Boys", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).build().hideView();
        final Widget workbookBoyTwo = new EditTextWidget.Builder(context, Keys.WORKBOOK_2_BOYS, "Workbook level 2 - Boys", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).build().hideView();
        final Widget workbookGirlTwo = new EditTextWidget.Builder(context, Keys.WORKBOOK_2_GIRLS, "Workbook level 2 - Girls", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).build().hideView();
        final EditTextWidget requireOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        final Widget resourceRequireOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        requireOther.setWidgetListener(new QuantityChangeListener(resourceRequireOther));


        MultiSwitcher multiSwitcher = new MultiSwitcher(schoolClassification, resourceRequire);
        multiSwitcher.addNewOption().addKeys("Boys", "Yes").addWidgets(workbookBoyOne, workbookBoyTwo, requireOther).build();
        multiSwitcher.addNewOption().addKeys("Girls", "Yes").addWidgets(workbookGirlOne, workbookGirlTwo, requireOther).build();
        multiSwitcher.addNewOption().addKeys("Co-ed", "Yes").addWidgets(workbookBoyOne, workbookBoyTwo, workbookGirlOne, workbookGirlTwo, requireOther).build();
        widgets.add(workbookGirlOne);
        widgets.add(workbookBoyOne);
        widgets.add(workbookGirlTwo);
        widgets.add(workbookBoyTwo);
        widgets.add(requireOther.hideView());
        widgets.add(resourceRequireOther);
        schoolClassification.setMultiSwitchListenerList(multiSwitcher);
        resourceRequire.setMultiSwitchListenerList(multiSwitcher);


        RadioWidget resourceDistributed = new RadioWidget(context, Keys.SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, "Yes", "No");
        final Widget resourceworkbookGirlOne = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_1_GIRLS, "Workbook level 1 - Girls", InputType.TYPE_CLASS_NUMBER, FOUR, false).setMinimumValue(ONE).build().hideView();
        final Widget resourceworkbookBoyOne = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_1_BOYS, "Workbook level 1 - Boys", InputType.TYPE_CLASS_NUMBER, FOUR, false).setMinimumValue(ONE).build().hideView();
        final Widget resourceworkbookBoyTwo = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_2_BOYS, "Workbook level 2 - Boys", InputType.TYPE_CLASS_NUMBER, FOUR, false).setMinimumValue(ONE).build().hideView();
        final Widget resourceworkbookGirlTwo = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_2_GIRLS, "Workbook level 2 - Girls", InputType.TYPE_CLASS_NUMBER, FOUR, false).setMinimumValue(ONE).build().hideView();
        final EditTextWidget resourceDistributedOtherQuantity = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        final Widget resourceDistributedOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        resourceDistributedOtherQuantity.setWidgetListener(new QuantityChangeListener(resourceDistributedOther));

        multiSwitcher = new MultiSwitcher(schoolClassification, resourceDistributed);
        multiSwitcher.addNewOption().addKeys("Boys", "Yes").addWidgets(resourceworkbookBoyOne, resourceworkbookBoyTwo, resourceDistributedOtherQuantity).build();
        multiSwitcher.addNewOption().addKeys("Girls", "Yes").addWidgets(resourceworkbookGirlOne, resourceworkbookGirlTwo, resourceDistributedOtherQuantity).build();
        multiSwitcher.addNewOption().addKeys("Co-ed", "Yes").addWidgets(resourceworkbookBoyOne, resourceworkbookBoyTwo, resourceworkbookGirlOne, resourceworkbookGirlTwo, resourceDistributedOtherQuantity).build();
        widgets.add(resourceDistributed);
        widgets.add(resourceworkbookGirlOne);
        widgets.add(resourceworkbookBoyOne);
        widgets.add(resourceworkbookGirlTwo);
        widgets.add(resourceworkbookBoyTwo);
        widgets.add(resourceDistributedOtherQuantity.hideView());
        widgets.add(resourceDistributedOther);
        schoolClassification.setMultiSwitchListenerList(multiSwitcher);
        resourceDistributed.setMultiSwitchListenerList(multiSwitcher);


        schoolClassification.addDependentWidgets(schoolToggler.getToggleMap());
        level.addDependentWidgets(levelToggler.getToggleMap());


        return widgets;
    }

    private List<Widget> getSecondaryMonitoringNewWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        widgets.add(new UserWidget(context, Keys.MONITORED_BY, "Monitored By", getDummyList()));

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

        widgets.add(new SpinnerWidget(context,Keys.TEACHER_NAME,"Name of Teacher",Arrays.asList(context.getResources().getStringArray(R.array.empty_list)),true));
        widgets.add(new RadioWidget(context, Keys.CLASS, "Class", true, "6", "7", "8", "9", "10"));
        widgets.add(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENTS, "Number of Students in Class", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.DURATION_OF_CLASS, "Time duration of class in minutes", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).build());

        ToggleWidgetData levelToggler = new ToggleWidgetData();
        RadioWidget level = new RadioWidget(context, Keys.LSBE_LEVEL, "LSBE Level", true, "Level 1", "Level 2");
        widgets.add(level.addHeader("LSBE Program"));

        ToggleWidgetData.SkipData levelOneSkipper = levelToggler.addOption("Level 1");
        widgets.add(levelOneSkipper.addWidgetToToggle(new SpinnerWidget(context, Keys.CHAPTERS_LEVEL_1, "LSBE Chapter - Level 1", Arrays.asList(context.getResources().getStringArray(R.array.level_one_chapters)), true)).hideView());
        levelOneSkipper.build();

        ToggleWidgetData.SkipData levelTwoSkipper = levelToggler.addOption("Level 2");
        widgets.add(levelTwoSkipper.addWidgetToToggle(new SpinnerWidget(context, Keys.CHAPTERS_LEVEL_2, "LSBE Chapter - Level 2", Arrays.asList(context.getResources().getStringArray(R.array.level_two_chapters)), true)).hideView());
        levelTwoSkipper.build();

        widgets.add(new RadioWidget(context, Keys.CSA_REVISION_OR_FIRSTTIME, "Revision or First time chapter is being taught", true, "Revision", "First time"));

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

        RadioWidget timetable = new RadioWidget(context, Keys.MANAGEMENT_INTEGRATED_LSBE, "Management has integrated the LSBE program into the school timetable", true, "Yes", "No");
        widgets.add(timetable.setScoreListener(scoreCalculator).addHeader("Management"));

        RadioWidget frequency = new RadioWidget(context, Keys.CLASS_FREQUENCY, "Frequency of class in time table", true, "Weekly", "Biweekly", "Monthly", "Other");
        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build();
        ToggleWidgetData togglerFrequency = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = togglerFrequency.addOption("Yes");
        skipData.addWidgetToToggle(frequency);
        skipData.build();
        widgets.add(frequency.hideView());
        timetable.addDependentWidgets(togglerFrequency.getToggleMap());

        MultiSwitcher timeTableMultiSwitcher = new MultiSwitcher(timetable,frequency);
        timeTableMultiSwitcher.addNewOption().addKeys("Yes","Other").addWidgets(other).build();
        frequency.setMultiSwitchListenerList(timeTableMultiSwitcher);
        timetable.setMultiSwitchListenerList(timeTableMultiSwitcher);
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

        final Widget workbookGirlOne = new EditTextWidget.Builder(context, Keys.WORKBOOK_1_GIRLS, "Workbook level 1 - Girls", InputType.TYPE_CLASS_NUMBER, FOUR, false).setMinimumValue(ONE).build().hideView();
        final Widget workbookBoyOne = new EditTextWidget.Builder(context, Keys.WORKBOOK_1_BOYS, "Workbook level 1 - Boys", InputType.TYPE_CLASS_NUMBER, FOUR, false).setMinimumValue(ONE).build().hideView();
        final Widget workbookBoyTwo = new EditTextWidget.Builder(context, Keys.WORKBOOK_2_BOYS, "Workbook level 2 - Boys", InputType.TYPE_CLASS_NUMBER, FOUR, false).setMinimumValue(ONE).build().hideView();
        final Widget workbookGirlTwo = new EditTextWidget.Builder(context, Keys.WORKBOOK_2_GIRLS, "Workbook level 2 - Girls", InputType.TYPE_CLASS_NUMBER, FOUR, false).setMinimumValue(ONE).build().hideView();
        final EditTextWidget requireOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        final Widget resourceRequireOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        requireOther.setWidgetListener(new QuantityChangeListener(resourceRequireOther));


        MultiSwitcher multiSwitcher = new MultiSwitcher(schoolClassification, resourceRequire);
        multiSwitcher.addNewOption().addKeys("Boys", "Yes").addWidgets(workbookBoyOne, workbookBoyTwo, requireOther).build();
        multiSwitcher.addNewOption().addKeys("Girls", "Yes").addWidgets(workbookGirlOne, workbookGirlTwo, requireOther).build();
        multiSwitcher.addNewOption().addKeys("Co-ed", "Yes").addWidgets(workbookBoyOne, workbookBoyTwo, workbookGirlOne, workbookGirlTwo, requireOther).build();
        widgets.add(workbookGirlOne);
        widgets.add(workbookBoyOne);
        widgets.add(workbookGirlTwo);
        widgets.add(workbookBoyTwo);
        widgets.add(requireOther.hideView());
        widgets.add(resourceRequireOther);
        schoolClassification.setMultiSwitchListenerList(multiSwitcher);
        resourceRequire.setMultiSwitchListenerList(multiSwitcher);

        RadioWidget resourceDistributed = new RadioWidget(context, Keys.SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, "Yes", "No");
        final Widget resourceworkbookGirlOne = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_1_GIRLS, "Workbook level 1 - Girls", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).build().hideView();
        final Widget resourceworkbookBoyOne = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_1_BOYS, "Workbook level 1 - Boys", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).build().hideView();
        final Widget resourceworkbookBoyTwo = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_2_BOYS, "Workbook level 2 - Boys", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).build().hideView();
        final Widget resourceworkbookGirlTwo = new EditTextWidget.Builder(context, Keys.RESOURCE_WORKBOOK_2_GIRLS, "Workbook level 2 - Girls", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).build().hideView();
        final EditTextWidget resourceDistributedOtherQuantity = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        final Widget resourceDistributedOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        resourceDistributedOtherQuantity.setWidgetListener(new QuantityChangeListener(resourceDistributedOther));


        multiSwitcher = new MultiSwitcher(schoolClassification, resourceDistributed);
        multiSwitcher.addNewOption().addKeys("Boys", "Yes").addWidgets(resourceworkbookBoyOne, resourceworkbookBoyTwo, resourceDistributedOtherQuantity).build();
        multiSwitcher.addNewOption().addKeys("Girls", "Yes").addWidgets(resourceworkbookGirlOne, resourceworkbookGirlTwo, resourceDistributedOtherQuantity).build();
        multiSwitcher.addNewOption().addKeys("Co-ed", "Yes").addWidgets(resourceworkbookBoyOne, resourceworkbookBoyTwo, resourceworkbookGirlOne, resourceworkbookGirlTwo, resourceDistributedOtherQuantity).build();
        widgets.add(resourceDistributed);
        widgets.add(resourceworkbookGirlOne);
        widgets.add(resourceworkbookBoyOne);
        widgets.add(resourceworkbookGirlTwo);
        widgets.add(resourceworkbookBoyTwo);
        widgets.add(resourceDistributedOtherQuantity.hideView());
        widgets.add(resourceDistributedOther);
        schoolClassification.setMultiSwitchListenerList(multiSwitcher);
        resourceDistributed.setMultiSwitchListenerList(multiSwitcher);


        schoolClassification.addDependentWidgets(schoolToggler.getToggleMap());
        level.addDependentWidgets(levelToggler.getToggleMap());

        return widgets;
    }

    private List<Widget> getPrimaryMonitoringExitWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        widgets.add(new UserWidget(context, Keys.MONITORED_BY, "Monitored By", getDummyList()));
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
        widgets.add(new SpinnerWidget(context,Keys.TEACHER_NAME,"Name of Teacher",Arrays.asList(context.getResources().getStringArray(R.array.empty_list)),true));
        widgets.add(new RadioWidget(context, Keys.CLASS, "Class", true, "1", "2", "3", "4", "5"));
        widgets.add(new EditTextWidget.Builder(context, Keys.STUDENT_QUANTITY, "Number of Students in Class", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).build().hideView());
        widgets.add(new EditTextWidget.Builder(context, Keys.DURATION_OF_CLASS, "Time duration of class in minutes", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).build().hideView());

        RadioWidget program = new RadioWidget(context, Keys.PRIMARY_PROGRAM, "Primary Program", true, "CSA", "Gender");
        widgets.add(program);

        ToggleWidgetData programToggle = new ToggleWidgetData();
        ToggleWidgetData.SkipData csaSkipper = programToggle.addOption("CSA");

        widgets.add(csaSkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.CSA_FLASHCARD, LinearLayout.HORIZONTAL, "CSA Flashcard being run", true, context.getResources().getStringArray(R.array.csa_flashcard)).addHeader("CSA Program").hideView()));
        widgets.add(csaSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CSA_REVISION_OR_FIRSTTIME, "Revision or first time flashcard is being taught", true, "Revision", "First time").hideView()));

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


        RadioWidget timetable = new RadioWidget(context, Keys.MANAGEMENT_INTEGRATED_CSA, "Management has integrated the CSA program into the school timetable", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(timetable.setScoreListener(csaScoreCalculator).addHeader("Management")).hideView());

        RadioWidget frequency = new RadioWidget(context, Keys.CLASS_FREQUENCY, "Frequency of class in time table", true, "Weekly", "Biweekly", "Monthly", "Other");
        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build();
        ToggleWidgetData togglerFrequency = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = togglerFrequency.addOption("Yes");
        skipData.addWidgetToToggle(frequency);
        skipData.build();
        widgets.add(frequency.hideView());
        timetable.addDependentWidgets(togglerFrequency.getToggleMap());

        MultiSwitcher multiSwitcher = new MultiSwitcher(timetable,frequency);
        multiSwitcher.addNewOption().addKeys("Yes","Other").addWidgets(other).build();
        frequency.setMultiSwitchListenerList(multiSwitcher);
        timetable.setMultiSwitchListenerList(multiSwitcher);
        widgets.add(other.hideView());


        widgets.add(csaSkipper.addWidgetToToggle(new RadioWidget(context, Keys.TWO_TEACHER_CSA, "There are at least 2 teachers assigned to teach the CSA program", true, "Yes", "No").setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.EXCELLENT_COORDINATION, "There is excellent coordination between management and teachers regarding the CSA program", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.MASTER_TRAINERS, "Number of Master Training leading CSA program", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).build()).hideView());
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
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_FLASHCARD_GUIDES, "CSA Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).build()).hideView());
        final EditTextWidget resourceRequireQuantity = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).build();
        final Widget resourceRequireOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        resourceRequireQuantity.setWidgetListener(new QuantityChangeListener(resourceRequireOther));
        widgets.add(resourceSkipper.addWidgetToToggle(resourceRequireQuantity.hideView()));
        widgets.add(resourceRequireOther);


        resourceSkipper.build();
        resourceRequire.addDependentWidgets(resourceToggler.getToggleMap());

        RadioWidget resourceDistributed = new RadioWidget(context, Keys.CSA_SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(resourceDistributed).hideView());
        resourceToggler = new ToggleWidgetData();
        resourceSkipper = resourceToggler.addOption("Yes");
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_FLASHCARD_GUIDES, "CSA Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).build()).hideView());
        final EditTextWidget resourceDistributedQuantity = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        final Widget resourceDistributedOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        resourceDistributedQuantity.setWidgetListener(new QuantityChangeListener(resourceDistributedOther));
        widgets.add(resourceSkipper.addWidgetToToggle(resourceDistributedQuantity.hideView()));
        widgets.add(resourceDistributedOther);


        resourceSkipper.build();
        resourceDistributed.addDependentWidgets(resourceToggler.getToggleMap());
        csaSkipper.build();

        ToggleWidgetData.SkipData genderSkipper = programToggle.addOption("Gender");
        widgets.add(genderSkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.GENDER_FLASHCARD_RUN, LinearLayout.VERTICAL, "Gender Flashcard being run", true, context.getResources().getStringArray(R.array.gender_flashcard)).addHeader("Gender Program").hideView()));
        widgets.add(genderSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_REVISION_OR_FIRSTTIME, "Revision or first time flashcard is being taught", true, "Revision", "First time")).hideView());

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


        RadioWidget genderManagement = new RadioWidget(context, Keys.GENDER_MANAGEMENT_INTEGRATED_CSA, "Management has integrated the Gender program into the school timetable", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(genderManagement.setScoreListener(genderScoreCalculator).addHeader("Management")).hideView());

        RadioWidget genderFrequency = new RadioWidget(context, Keys.GENDER_CLASS_FREQUENCY, "Frequency of class in time table", true, "Weekly", "Biweekly", "Monthly", "Other");
        EditTextWidget genderOther = new EditTextWidget.Builder(context, Keys.GENDER_OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build();
        ToggleWidgetData genderTogglerFrequency = new ToggleWidgetData();
        ToggleWidgetData.SkipData genderSkipData = genderTogglerFrequency.addOption("Yes");
        genderSkipData.addWidgetToToggle(genderFrequency);
        genderSkipData.build();
        widgets.add(genderFrequency.hideView());
        genderManagement.addDependentWidgets(genderTogglerFrequency.getToggleMap());

        MultiSwitcher genderMultiSwitcher = new MultiSwitcher(genderManagement,genderFrequency);
        genderMultiSwitcher.addNewOption().addKeys("Yes","Other").addWidgets(genderOther).build();
        genderFrequency.setMultiSwitchListenerList(genderMultiSwitcher);
        genderManagement.setMultiSwitchListenerList(genderMultiSwitcher);
        widgets.add(genderOther.hideView());




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
        widgets.add(genderResourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_FLASHCARD_GUIDES, "Gender Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).build()).hideView());
        widgets.add(genderResourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).build()).hideView());
        EditTextWidget otherResourceQuantity = new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).build();
        Widget otherResource = new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        otherResourceQuantity.setWidgetListener(new QuantityChangeListener(otherResource));
        widgets.add(genderResourceSkipper.addWidgetToToggle(otherResourceQuantity).hideView());
        widgets.add(otherResource);
        genderResourceSkipper.build();
        genderResourceRequire.addDependentWidgets(genderResourceToggler.getToggleMap());

        RadioWidget genderResourceDistributed = new RadioWidget(context, Keys.GENDER_SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(genderResourceDistributed).hideView());
        genderResourceToggler = new ToggleWidgetData();
        genderResourceSkipper = genderResourceToggler.addOption("Yes");
        widgets.add(genderResourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_FLASHCARD_GUIDES, "Gender Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(genderResourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        EditTextWidget otherResourceDistributedQuantity = new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        widgets.add(genderResourceSkipper.addWidgetToToggle(otherResourceDistributedQuantity.hideView()));
        otherResource = new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        widgets.add(otherResource);
        otherResourceDistributedQuantity.setWidgetListener(new QuantityChangeListener(otherResource));

        genderResourceSkipper.build();
        genderResourceDistributed.addDependentWidgets(genderResourceToggler.getToggleMap());

        genderSkipper.build();
        program.addDependentWidgets(programToggle.getToggleMap());

        return widgets;
    }

    private List<Widget> getPrimaryMonitoringRunningWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new UserWidget(context, Keys.MONITORED_BY, "Monitored By", getDummyList()));

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
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_NAME, "Name of Teacher", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_ID, "Teacher ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new RadioWidget(context, Keys.CLASS, "Class", true, "1", "2", "3", "4", "5"));
        widgets.add(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENTS, "Number of Students in Class", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.DURATION_OF_CLASS, "Time duration of class in minutes", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).build());

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

        RadioWidget timetable = new RadioWidget(context, Keys.MANAGEMENT_INTEGRATED_CSA, "Management has integrated the CSA program into the school timetable", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(timetable.setScoreListener(csaScoreCalculator).addHeader("Management")).hideView());

        RadioWidget frequency = new RadioWidget(context, Keys.CLASS_FREQUENCY, "Frequency of class in time table", true, "Weekly", "Biweekly", "Monthly", "Other");
        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build();
        ToggleWidgetData togglerFrequency = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = togglerFrequency.addOption("Yes");
        skipData.addWidgetToToggle(frequency);
        skipData.build();
        widgets.add(frequency.hideView());
        timetable.addDependentWidgets(togglerFrequency.getToggleMap());

        MultiSwitcher multiSwitcher = new MultiSwitcher(timetable,frequency);
        multiSwitcher.addNewOption().addKeys("Yes","Other").addWidgets(other).build();
        frequency.setMultiSwitchListenerList(multiSwitcher);
        timetable.setMultiSwitchListenerList(multiSwitcher);
        widgets.add(other.hideView());


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
        final EditTextWidget resourceRequireQuantity = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        final Widget resourceRequireOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        resourceRequireQuantity.setWidgetListener(new QuantityChangeListener(resourceRequireOther));
        widgets.add(resourceSkipper.addWidgetToToggle(resourceRequireQuantity.hideView()));
        widgets.add(resourceRequireOther);
        resourceSkipper.build();

        resourceRequire.addDependentWidgets(resourceToggler.getToggleMap());

        RadioWidget resourceDistributed = new RadioWidget(context, Keys.CSA_SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(resourceDistributed).hideView());
        resourceToggler = new ToggleWidgetData();
        resourceSkipper = resourceToggler.addOption("Yes");
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_FLASHCARD_GUIDES, "CSA Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        final EditTextWidget resourceDistributedQuantity = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        final Widget resourceDistributedOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        resourceDistributedQuantity.setWidgetListener(new QuantityChangeListener(resourceDistributedOther));
        widgets.add(resourceSkipper.addWidgetToToggle(resourceDistributedQuantity.hideView()));
        widgets.add(resourceDistributedOther);
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


        RadioWidget genderManagement = new RadioWidget(context, Keys.GENDER_MANAGEMENT_INTEGRATED_CSA, "Management has integrated the Gender program into the school timetable", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(genderManagement.setScoreListener(genderScoreCalculator).addHeader("Management")).hideView());

        RadioWidget genderFrequency = new RadioWidget(context, Keys.GENDER_CLASS_FREQUENCY, "Frequency of class in time table", true, "Weekly", "Biweekly", "Monthly", "Other");
        EditTextWidget genderOther = new EditTextWidget.Builder(context, Keys.GENDER_OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build();
        ToggleWidgetData genderTogglerFrequency = new ToggleWidgetData();
        ToggleWidgetData.SkipData genderSkipData = genderTogglerFrequency.addOption("Yes");
        genderSkipData.addWidgetToToggle(genderFrequency);
        genderSkipData.build();
        widgets.add(genderFrequency.hideView());
        genderManagement.addDependentWidgets(genderTogglerFrequency.getToggleMap());

        MultiSwitcher genderMultiSwitcher = new MultiSwitcher(genderManagement,genderFrequency);
        genderMultiSwitcher.addNewOption().addKeys("Yes","Other").addWidgets(genderOther).build();
        genderFrequency.setMultiSwitchListenerList(genderMultiSwitcher);
        genderManagement.setMultiSwitchListenerList(genderMultiSwitcher);
        widgets.add(genderOther.hideView());



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
        EditTextWidget otherResourceQuantity = new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        Widget otherResource = new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        otherResourceQuantity.setWidgetListener(new QuantityChangeListener(otherResource));
        widgets.add(genderResourceSkipper.addWidgetToToggle(otherResourceQuantity).hideView());
        widgets.add(otherResource);
        genderResourceSkipper.build();
        genderResourceRequire.addDependentWidgets(genderResourceToggler.getToggleMap());

        RadioWidget genderResourceDistributed = new RadioWidget(context, Keys.GENDER_SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(genderResourceDistributed).hideView());
        genderResourceToggler = new ToggleWidgetData();
        genderResourceSkipper = genderResourceToggler.addOption("Yes");

        widgets.add(genderResourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_FLASHCARD_GUIDES, "Gender Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(genderResourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        EditTextWidget otherResourceDistributedQuantity = new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        widgets.add(genderResourceSkipper.addWidgetToToggle(otherResourceDistributedQuantity.hideView()));
        otherResource = new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        widgets.add(otherResource);
        otherResourceDistributedQuantity.setWidgetListener(new QuantityChangeListener(otherResource));
        genderResourceSkipper.build();
        genderResourceDistributed.addDependentWidgets(genderResourceToggler.getToggleMap());

        genderSkipper.build();
        program.addDependentWidgets(programToggle.getToggleMap());

        return widgets;
    }


    private List<Widget> getPrimaryMonitoringNewWidgets() {
        List<Widget> widgets = new ArrayList<>();

        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new UserWidget(context, Keys.MONITORED_BY, "Monitored By", getDummyList()));
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


        widgets.add(new SpinnerWidget(context, Keys.TEACHER_NAME, "Name of Teacher", Arrays.asList(context.getResources().getStringArray(R.array.empty_list)), true));
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_ID, "Teacher ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new RadioWidget(context, Keys.CLASS, "Class", true, "1", "2", "3", "4", "5"));
        widgets.add(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENTS, "Number of Students in Class", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.DURATION_OF_CLASS, "Time duration of class in minutes", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).build());
        RadioWidget program = new RadioWidget(context, Keys.PRIMARY_PROGRAM, "Primary Program", true, "CSA", "Gender");
        widgets.add(program);
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
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_COMFORTABLE_SPEAKING, "The teacher is comfortable speaking about this subject", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_JUDGEMENTAL_TONE, "The teacher uses a non-judgmental tone while facilitating the session", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_OWN_OPINIONS, "The teacher does not impose their own values or opinion on the participants", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.STUDENTS_ENGAGEMENT, "Students are engaged in discussion on flashcard(s)", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.STUDENTS_UNDERSTAND_MESSAGE, "Students understand the main messages of the flashcard(s)", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.STUDENTS_PAYING_ATTENTION, "Students are actively paying attention to the class while the teacher is instructing", true).setScoreListener(csaScoreCalculator)).hideView());



        RadioWidget timetable = new RadioWidget(context, Keys.MANAGEMENT_INTEGRATED_CSA, "Management has integrated the CSA program into the school timetable", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(timetable.setScoreListener(csaScoreCalculator).addHeader("Management")).hideView());

        RadioWidget frequency = new RadioWidget(context, Keys.CLASS_FREQUENCY, "Frequency of class in time table", true, "Weekly", "Biweekly", "Monthly", "Other");
        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build();
        ToggleWidgetData togglerFrequency = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = togglerFrequency.addOption("Yes");
        skipData.addWidgetToToggle(frequency);
        skipData.build();
        widgets.add(frequency.hideView());
        timetable.addDependentWidgets(togglerFrequency.getToggleMap());

        MultiSwitcher multiSwitcher = new MultiSwitcher(timetable,frequency);
        multiSwitcher.addNewOption().addKeys("Yes","Other").addWidgets(other).build();
        frequency.setMultiSwitchListenerList(multiSwitcher);
        timetable.setMultiSwitchListenerList(multiSwitcher);
        widgets.add(other.hideView());



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
        final EditTextWidget resourceRequireQuantity = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        final Widget resourceRequireOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        resourceRequireQuantity.setWidgetListener(new QuantityChangeListener(resourceRequireOther));
        widgets.add(resourceSkipper.addWidgetToToggle(resourceRequireQuantity.hideView()));
        widgets.add(resourceRequireOther);
        resourceSkipper.build();
        resourceRequire.addDependentWidgets(resourceToggler.getToggleMap());

        RadioWidget resourceDistributed = new RadioWidget(context, Keys.CSA_SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(resourceDistributed).hideView());
        resourceToggler = new ToggleWidgetData();
        resourceSkipper = resourceToggler.addOption("Yes");
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_FLASHCARD_GUIDES, "CSA Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        final EditTextWidget resourceDistributedQuantity = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        final Widget resourceDistributedOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        resourceDistributedQuantity.setWidgetListener(new QuantityChangeListener(resourceDistributedOther));
        widgets.add(resourceSkipper.addWidgetToToggle(resourceDistributedQuantity.hideView()));
        widgets.add(resourceDistributedOther);

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





        RadioWidget genderManagement = new RadioWidget(context, Keys.GENDER_MANAGEMENT_INTEGRATED_CSA, "Management has integrated the Gender program into the school timetable", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(genderManagement.setScoreListener(genderScoreCalculator).addHeader("Management")).hideView());

        RadioWidget genderFrequency = new RadioWidget(context, Keys.GENDER_CLASS_FREQUENCY, "Frequency of class in time table", true, "Weekly", "Biweekly", "Monthly", "Other");
        EditTextWidget genderOther = new EditTextWidget.Builder(context, Keys.GENDER_OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build();
        ToggleWidgetData genderTogglerFrequency = new ToggleWidgetData();
        ToggleWidgetData.SkipData genderSkipData = genderTogglerFrequency.addOption("Yes");
        genderSkipData.addWidgetToToggle(genderFrequency);
        genderSkipData.build();
        widgets.add(genderFrequency.hideView());
        genderManagement.addDependentWidgets(genderTogglerFrequency.getToggleMap());

        MultiSwitcher genderMultiSwitcher = new MultiSwitcher(genderManagement,genderFrequency);
        genderMultiSwitcher.addNewOption().addKeys("Yes","Other").addWidgets(genderOther).build();
        genderFrequency.setMultiSwitchListenerList(genderMultiSwitcher);
        genderManagement.setMultiSwitchListenerList(genderMultiSwitcher);
        widgets.add(genderOther.hideView());


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
        EditTextWidget otherResourceQuantity = new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        Widget otherResource = new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        otherResourceQuantity.setWidgetListener(new QuantityChangeListener(otherResource));
        widgets.add(resourceSkipper.addWidgetToToggle(otherResourceQuantity).hideView());
        widgets.add(otherResource);

        resourceSkipper.build();
        resourceRequire.addDependentWidgets(resourceToggler.getToggleMap());

        resourceDistributed = new RadioWidget(context, Keys.GENDER_SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(resourceDistributed).hideView());
        resourceToggler = new ToggleWidgetData();
        resourceSkipper = resourceToggler.addOption("Yes");
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_FLASHCARD_GUIDES, "Gender Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).build()).hideView());
        EditTextWidget otherResourceDistributedQuantity = new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        widgets.add(resourceSkipper.addWidgetToToggle(otherResourceDistributedQuantity.hideView()));
        otherResource = new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_DISTRIBUTED_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        widgets.add(otherResource);
        otherResourceDistributedQuantity.setWidgetListener(new QuantityChangeListener(otherResource));
        resourceSkipper.build();
        resourceDistributed.addDependentWidgets(resourceToggler.getToggleMap());


        genderSkipper.build();
        program.addDependentWidgets(programToggle.getToggleMap());
        return widgets;
    }

    private List<Widget> getSchoolClosingWidgets() {
        List<Widget> widgets = new ArrayList<>();

        widgets.add(new EditTextWidget.Builder(context, Keys.SCHOOL_ID, "School ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.SCHOOL_NAME, "Name of School", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());

        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));
        widgets.add(new DateWidget(context, Keys.DATE_PARTNERSHIP_STARTED, "Date partnership with Aahung was formed", true));
        widgets.add(new DateWidget(context, Keys.DATE_PARTNERSHIP_ENDED, "Date partnership with Aahung ended", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.PARTNERSHIP_YEARS, "Number of years of partnership", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).build());
        widgets.add(new SpinnerWidget(context, Keys.SCHOOL_TYPE, "Type of School", Arrays.asList(context.getResources().getStringArray(R.array.school_type)), true));
        widgets.add(new RadioWidget(context, Keys.SCHOOL_CLASSIFICATION, "Classification of School by Sex", true, "Girls", "Boys", "Co-ed"));
        RadioWidget programLevel = new RadioWidget(context, Keys.LEVEL_OF_PROGRAM, "Level of Program", true, "Primary", "Secondary");
        widgets.add(programLevel);


        MultiSelectWidget program = new MultiSelectWidget(context, Keys.TYPE_OF_PROGRAM_IN_SCHOOL, LinearLayout.HORIZONTAL, "Type of program(s) implemented in school", true, "CSA", "Gender", "LSBE");

        RadioSwitcher switcher = new RadioSwitcher(program);
        switcher.add("Secondary", "LSBE");
        programLevel.setWidgetSwitchListener(switcher);
        widgets.add(program);

        RadioWidget tier = new RadioWidget(context, Keys.SCHOOL_TIER, "School Tier at Closing", true, "New", "Running", "Exit");
        widgets.add(tier);

        widgets.add(new EditTextWidget.Builder(context, Keys.REASON_PARTNERSHIP, "Reason for end of partnership", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build());

        return widgets;
    }


    private List<Widget> getParticipantDetailsWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_ID, "Teacher ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHER_NAME, "Teacher Name", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new DateWidget(context, Keys.DATE_OF_BIRTH, "Date of Birth", true));


        widgets.add(new RadioWidget(context, Keys.SEX, "Sex", true, "Male", "Female", "Other"));
        MultiSelectWidget subjects = new MultiSelectWidget(context, Keys.SUBJECT, LinearLayout.VERTICAL, "Subject(s) taught", true, context.getResources().getStringArray(R.array.subjects));

        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build();
        ToggleWidgetData toggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = toggler.addOption("Other");
        skipData.addWidgetToToggle(other);
        skipData.build();

        subjects.addDependentWidgets(toggler.getToggleMap());
        widgets.add(subjects);
        widgets.add(other.hideView());
        widgets.add(new EditTextWidget.Builder(context, Keys.TEACHING_YEARS, "Number of years teaching", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).build());
        widgets.add(new SpinnerWidget(context, Keys.EDUCATION_LEVEL, "Level of Education", Arrays.asList(context.getResources().getStringArray(R.array.education_level)), true));

        return widgets;
    }

    private List<Widget> getSchoolDetailWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));

        widgets.add(new SpinnerWidget(context, Keys.PARENT_ORGANISATION_ID, "Parent Organization ID", Arrays.asList(context.getResources().getStringArray(R.array.empty_list)), true));
        widgets.add(new EditTextWidget.Builder(context, Keys.PARENT_ORGANISATION_NAME, "Parent Organization Name", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.SCHOOL_ID, "School ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.SCHOOL_NAME, "Name of School", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new DateWidget(context, Keys.DATE_PARTNERSHIP_STARTED, "Date partnership with Aahung was formed", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.PARTNERSHIP_YEARS, "Number of years of partnership", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).build());
        widgets.add(new SpinnerWidget(context, Keys.SCHOOL_TYPE, "Type of School", Arrays.asList(context.getResources().getStringArray(R.array.school_type)), true));
        widgets.add(new RadioWidget(context, Keys.SCHOOL_CLASSIFICATION, "Classification of School by Sex", true, "Girls", "Boys", "Co-ed"));

        RadioWidget programLevel = new RadioWidget(context, Keys.LEVEL_OF_PROGRAM, "Level of Program", true, "Primary", "Secondary");
        widgets.add(programLevel);

        MultiSelectWidget program = new MultiSelectWidget(context, Keys.TYPE_OF_PROGRAM_IN_SCHOOL, LinearLayout.HORIZONTAL, "Type of program(s) implement in school", true, "CSA", "Gender", "LSBE");
        RadioSwitcher switcher = new RadioSwitcher(program);
        switcher.add("Secondary", "LSBE");
        programLevel.setWidgetSwitchListener(switcher);
        widgets.add(program);

        widgets.add(new UserWidget(context,Keys.DONOR_NAME,"Donor",getDummyList()));
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


        widgets.add(new EditTextWidget.Builder(context, Keys.POINT_OF_CONTACT, "Name of point of contact for school", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, PHONE_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new PhoneWidget(context, Keys.PHONE_NUMBER, "Phone number for point of contact at school", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.EMAIL, "Email Address for point of contact at school", InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_EMAIL_CHARACTER_SET)).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.APPROX_STUDENTS, "Approximate number of students", InputType.TYPE_CLASS_NUMBER, FOUR, true).setMinimumValue(ONE).build());

        return widgets;
    }

    private List<Widget> getDonorDetailWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new EditTextWidget.Builder(context, Keys.DONOR_ID, "Donor ID", InputType.TYPE_CLASS_NUMBER, 5, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.DONOR_NAME, "Name of Donor", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, 15, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.PROPOSAL_NAME, "Name of Proposal", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, 15, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new DateWidget(context, Keys.DATE_GRANT_BEGINS, "Date grant begins", true).enablePickerWithoutDay());
        widgets.add(new DateWidget(context, Keys.DATE_GRANT_ENDS, "Date grant ends", true).enablePickerWithoutDay());

        return widgets;
    }


    //SRHM


    private List<Widget> getNayaQadamStepDownTrainingDetailsFormWidgets() {

        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province_naya_qadam)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district).enableNayaQadamFilteration());

        widgets.add(new EditTextWidget.Builder(context, Keys.FACILITATOR, "Facilitator Name", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new RadioWidget(context, Keys.DESIGNATION_OF_FACILITATOR, "Designation Of Facilitator", true, "Pre-service", "In-service", "LHS"));
        MultiSelectWidget topicCovered = new MultiSelectWidget(context, Keys.TOPICS_COVERED, LinearLayout.VERTICAL, "Topics Covered", true, "VCAT", "AYSRH Client Centred Care", "Prevention of unwanted pregnancy", "Provision of AYSRH services", "Other");
        widgets.add(topicCovered);
        ToggleWidgetData otherTopicToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData otherTopicSkipper = otherTopicToggler.addOption("Other");
        widgets.add(otherTopicSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        otherTopicSkipper.build();

        topicCovered.addDependentWidgets(otherTopicToggler.getToggleMap());

        widgets.add(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY, "Number of Participants", InputType.TYPE_CLASS_NUMBER, TWO, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).setInputRange(0,99).build());

        return widgets;
    }

    private List<Widget> getInstitutionDetailsFormWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));

        widgets.add(new EditTextWidget.Builder(context, Keys.INSTITUTION_NAME, "Name of Institution", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.INSTITUTION_ID, "Institution ID", InputType.TYPE_CLASS_NUMBER, INSTITUTION_ID_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build());
        widgets.add(new DateWidget(context, Keys.DATE_PARTNERSHIP_STARTED, "Date partnership with Aahung was formed", true));

        MultiSelectWidget tyeOfInstitution = new MultiSelectWidget(context, Keys.TYPE_OF_INSTITUION, LinearLayout.VERTICAL, "Type Of Institution", true, "Medical", "Nursing", "Midwifery", "Other");
        widgets.add(tyeOfInstitution);

        ToggleWidgetData tyeOfInstitutionToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherSkipper = tyeOfInstitutionToggler.addOption("Other");
        widgets.add(OtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        OtherSkipper.build();

        tyeOfInstitution.addDependentWidgets(tyeOfInstitutionToggler.getToggleMap());


        widgets.add(new UserWidget(context, Keys.DONOR_NAME, "Donor(s)", getDummyList()));

        widgets.add(new EditTextWidget.Builder(context, Keys.POINT_OF_CONTACT, "Name of point of contact for institution", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new PhoneWidget(context, Keys.PHONE_NUMBER, "Phone number for point of contact at institution", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.EMAIL, "Email Address for point of contact at institution", InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_EMAIL_CHARACTER_SET)).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.APPROX_STUDENTS, "Approximate number of students in institution", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).build());


        return widgets;
    }

    private List<Widget> getAmplifyChangeParticipantDetailsFormWidgets() {

        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.USER_ID, "User ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.PARTICIPANT_ID, "Participant ID", InputType.TYPE_CLASS_TEXT, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.PARTICIPANT_NAME, "Participant Name", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new DateWidget(context, Keys.DATE_OF_BIRTH, "Date of Birth", true));
        widgets.add(new RadioWidget(context, Keys.SEX, "Sex", true, "Male", "Female", "Other"));
        widgets.add(new EditTextWidget.Builder(context, Keys.INSTITUTION_ID, "Institution ID", InputType.TYPE_CLASS_NUMBER, INSTITUTION_ID_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.INSTITUTION_NAME, "Name of Institution", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());

        RadioWidget participant = new RadioWidget(context, Keys.PARTICIPANT_TYPE, "Type Of Participant", true, "Student", "Teacher");
        widgets.add(participant);

        ToggleWidgetData participantToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData teacherSkipper = participantToggler.addOption("Teacher");
        widgets.add(teacherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.TEACHER_SUBJECT, "Teacher Subject", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        widgets.add(teacherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.TEACHING_YEARS, "Number of years teaching", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).build()).hideView());
        widgets.add(teacherSkipper.addWidgetToToggle(new SpinnerWidget(context, Keys.EDUCATION_LEVEL, "Level of Education", Arrays.asList(context.getResources().getStringArray(R.array.education_level_srhm)), true)).hideView());
        teacherSkipper.build();

        ToggleWidgetData.SkipData studentSkipper = participantToggler.addOption("Student");
        widgets.add(studentSkipper.addWidgetToToggle(new RadioWidget(context, Keys.PROGRAM_OF_STUDENT, "Program of Student", true, "Medical", "Nursing")).hideView());
        widgets.add(studentSkipper.addWidgetToToggle(new RadioWidget(context, Keys.PROGRAM_YEAR_OF_STUDENT, "Program Year of Student", true, "1", "2", "3", "4","5")).hideView());
        studentSkipper.build();

        participant.addDependentWidgets(participantToggler.getToggleMap());


        return widgets;
    }

    private List<Widget> getAmplifyChangeTrainingDetailsFormWidgets() {

        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.USER_ID, "User ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.INSTITUTION_ID, "Institution ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.INSTITUTION_NAME, "Institution Name", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new UserWidget(context, Keys.TRAINER, "Trainer", getDummyList()));
        RadioWidget participant = new RadioWidget(context, Keys.PARTICIPANT_TYPE, "Type Of Participant", true, "Student", "Teacher");
        widgets.add(participant);

        ToggleWidgetData participantToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData teacherSkipper = participantToggler.addOption("Teacher");
        widgets.add(teacherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_TEACHERS, "Number of Teachers", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        teacherSkipper.build();

        ToggleWidgetData.SkipData studentSkipper = participantToggler.addOption("Student");
        widgets.add(studentSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENTS, "Number of Students", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        studentSkipper.build();

        participant.addDependentWidgets(participantToggler.getToggleMap());


        MultiSelectWidget topics_covered = new MultiSelectWidget(context, Keys.TOPICS_COVERED, LinearLayout.VERTICAL, "Topics covered", true, context.getResources().getStringArray(R.array.topics_covered_ac_training_form));
        widgets.add(topics_covered);

        ToggleWidgetData topicsCoveredToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherSkipper = topicsCoveredToggler.addOption("Other");
        widgets.add(OtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        OtherSkipper.build();

        topics_covered.addDependentWidgets(topicsCoveredToggler.getToggleMap());

        widgets.add(new EditTextWidget.Builder(context, Keys.NUMBER_OF_DAYS, "Number of Days", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build());
        widgets.add(new UserWidget(context, Keys.PARTICPANTS, "Participant(s)", getDummyList()).enableParticipants());

        return widgets;

    }

    private List<Widget> getAmplifyChangeStepDownTrainingDetailsFormWidgets() {

        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.USER_ID, "User ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());

        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));
        widgets.add(new EditTextWidget.Builder(context, Keys.PARTICIPANT_NAME, "Participant Name", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.PARTICIPANT_ID, "Participant ID", InputType.TYPE_CLASS_TEXT, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.INSTITUTION_NAME, "Name of Institution", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.INSTITUTION_ID, "Institution ID", InputType.TYPE_CLASS_NUMBER, INSTITUTION_ID_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build());
        widgets.add(new RadioWidget(context, Keys.TYPE_OF_FACILITATOR, "Type Of Facilitator", true, "Student", "Teacher"));


        MultiSelectWidget typeOfParticipants = new MultiSelectWidget(context, Keys.TYPE_OF_PARTICIPANTS, LinearLayout.VERTICAL, "Type Of Participants attending", true, "University Students", "Parents", "Community leaders", "Adolescents and Youth (Age 15-29)", "Children (Age 0-14)", "Other");
        widgets.add(typeOfParticipants);

        ToggleWidgetData typeOfParticipantsToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherParticipantsSkipper = typeOfParticipantsToggler.addOption("Other");
        widgets.add(OtherParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        widgets.add(OtherParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_OTHER, "Number of Other", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        OtherParticipantsSkipper.build();

        ToggleWidgetData.SkipData uniStudentsParticipantsSkipper = typeOfParticipantsToggler.addOption("University Students");
        widgets.add(uniStudentsParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENTS, "Number of University Students", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        uniStudentsParticipantsSkipper.build();

        ToggleWidgetData.SkipData parentsParticipantsSkipper = typeOfParticipantsToggler.addOption("Parents");
        widgets.add(parentsParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_PARENTS, "Number of Parents", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        parentsParticipantsSkipper.build();

        ToggleWidgetData.SkipData communityLeadersParticipantsSkipper = typeOfParticipantsToggler.addOption("Community leaders");
        widgets.add(communityLeadersParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_COMMUNITY_LEARDER, "Number of Community Leaders", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        communityLeadersParticipantsSkipper.build();

        ToggleWidgetData.SkipData youthParticipantsSkipper = typeOfParticipantsToggler.addOption("Adolescents and Youth (Age 15-29)");
        widgets.add(youthParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_YOUTH, "Number of Adolescents and Youth (Age 15-29)", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        youthParticipantsSkipper.build();

        ToggleWidgetData.SkipData childrenParticipantsSkipper = typeOfParticipantsToggler.addOption("Children (Age 0-14)");
        widgets.add(childrenParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_CHILDREN, "Number of Children (Age 0-14)", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        childrenParticipantsSkipper.build();

        typeOfParticipants.addDependentWidgets(typeOfParticipantsToggler.getToggleMap());
        RadioWidget sexOfParticipants = new RadioWidget(context, Keys.SEX, "Sex of Participants", true, "Male", "Female", "Other");
        widgets.add(sexOfParticipants);

        ToggleWidgetData sexToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData maleSkipper = sexToggler.addOption("Male");
        widgets.add(maleSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_MALE, "Number of Male", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        maleSkipper.build();

        ToggleWidgetData.SkipData femaleSkipper = sexToggler.addOption("Female");
        widgets.add(femaleSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_FEMALE, "Number of Female", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        femaleSkipper.build();

        ToggleWidgetData.SkipData otherSkipper = sexToggler.addOption("Other");
        widgets.add(otherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_OTHER, "Number of Other", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        otherSkipper.build();

        sexOfParticipants.addDependentWidgets(sexToggler.getToggleMap());

        widgets.add(new RadioWidget(context, Keys.AGE, "Age of Participants", true, "0-5", "6-10", "11-15", "16-20", "21-49", "50+"));

        MultiSelectWidget topics_covered = new MultiSelectWidget(context, Keys.TOPICS_COVERED, LinearLayout.VERTICAL, "Topics covered", true, context.getResources().getStringArray(R.array.topics_covered_ACStepDownTraining_form));
        widgets.add(topics_covered);

        ToggleWidgetData topicsCoveredToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherSkipper = topicsCoveredToggler.addOption("Other");
        widgets.add(OtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_2, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        OtherSkipper.build();

        topics_covered.addDependentWidgets(topicsCoveredToggler.getToggleMap());


        return widgets;
    }

    private List<Widget> getParticipantsDetailsSRHMFormWidgets() {

        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.USER_ID, "User ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.PARTICIPANT_ID, "Participant ID", InputType.TYPE_CLASS_TEXT, ID_LENGTH, true).setMinimumValue(ONE).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.PARTICIPANT_NAME, "Participant Name", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new DateWidget(context, Keys.DATE_OF_BIRTH, "Date of Birth", true));
        widgets.add(new RadioWidget(context, Keys.SEX, "Sex", true, "Male", "Female", "Other"));


        MultiSelectWidget participantAffliation = new MultiSelectWidget(context, Keys.PARTICIPANT_AFFLIATION, LinearLayout.VERTICAL, "Participant Affliation", true, context.getResources().getStringArray(R.array.participants_affliation));
        widgets.add(participantAffliation);

        ToggleWidgetData participantAffliationToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherSkipper = participantAffliationToggler.addOption("Other");
        widgets.add(OtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        OtherSkipper.build();

        participantAffliation.addDependentWidgets(participantAffliationToggler.getToggleMap());


        SpinnerWidget typeOfParticipants = new SpinnerWidget(context, Keys.TYPE_OF_PARTICIPANTS, "Type Of Participants", Arrays.asList(context.getResources().getStringArray(R.array.types_of_participants_general_participants_detail_form)), true);
        widgets.add(typeOfParticipants);

        ToggleWidgetData typeOfParticipantsToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherParticipantsSkipper = typeOfParticipantsToggler.addOption("Other");
        widgets.add(OtherParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_2, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        OtherParticipantsSkipper.build();

        typeOfParticipants.addDependentWidgets(typeOfParticipantsToggler.getToggleMap());


        widgets.add(new SpinnerWidget(context, Keys.EDUCATION_LEVEL, "Level of Education", Arrays.asList(context.getResources().getStringArray(R.array.education_level)), true));
        widgets.add(new EditTextWidget.Builder(context, Keys.INSTITUTION_ID, "Institution ID", InputType.TYPE_CLASS_NUMBER, INSTITUTION_ID_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.INSTITUTION_NAME, "Name of Institution", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());


        SpinnerWidget roleInInstitution = new SpinnerWidget(context, Keys.ROLE_IN_INSTITUTION, "Role In Institution",Arrays.asList(context.getResources().getStringArray(R.array.role_in_institution)) , true);
        widgets.add(roleInInstitution);

        ToggleWidgetData roleInInstitutionToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherRoleInInstitutionSkipper = roleInInstitutionToggler.addOption("Other");
        widgets.add(OtherRoleInInstitutionSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_3, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        OtherRoleInInstitutionSkipper.build();

        roleInInstitution.addDependentWidgets(roleInInstitutionToggler.getToggleMap());


        return widgets;
    }

    private List<Widget> getGeneralTrainingDetailsFormWidgets() {

        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.USER_ID, "User ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));
        widgets.add(new EditTextWidget.Builder(context, Keys.INSTITUTION_ID, "Institution ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.INSTITUTION_NAME, "Institution Name", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.TRAINER_ID, "Trainer ID", InputType.TYPE_CLASS_TEXT, TRAINER_ID_LENGTH, true).build());
        widgets.add(new UserWidget(context, Keys.TRAINER, "Trainer(s)", getDummyList()));
        widgets.add(new RadioWidget(context, Keys.TRAINING_TYPE, "Type Of Training", true, "First Training", "Refresher"));


        MultiSelectWidget topics_covered = new MultiSelectWidget(context, Keys.TOPICS_COVERED, LinearLayout.VERTICAL, "Topics covered", true, context.getResources().getStringArray(R.array.topics_covered_general_training_detail_form));
        widgets.add(topics_covered);

        ToggleWidgetData topicsCoveredToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherSkipper = topicsCoveredToggler.addOption("Other");
        widgets.add(OtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        OtherSkipper.build();

        topics_covered.addDependentWidgets(topicsCoveredToggler.getToggleMap());


        widgets.add(new EditTextWidget.Builder(context, Keys.NUMBER_OF_DAYS, "Number of Days", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.NUMBER_OF_PARTICIPANTS, "Number of Participants", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build());
        widgets.add(new UserWidget(context, Keys.PARTICPANTS, "Participant(s)", getDummyList()).enableParticipants());

        return widgets;

    }

    private List<Widget> getGeneralStepDownTrainingDetailsFormWidgets() {

        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.USER_ID, "User ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());

        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));
        widgets.add(new EditTextWidget.Builder(context, Keys.INSTITUTION_ID, "Institution ID", InputType.TYPE_CLASS_NUMBER, INSTITUTION_ID_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.INSTITUTION_NAME, "Name of Institution", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new SpinnerWidget(context, Keys.PARTICIPANT_NAME, "Participant Name", Arrays.asList(context.getResources().getStringArray(R.array.empty_list)), true));
        widgets.add(new EditTextWidget.Builder(context, Keys.PARTICIPANT_ID, "Participant ID", InputType.TYPE_CLASS_NUMBER, INSTITUTION_ID_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build());


        MultiSelectWidget typeOfParticipants = new MultiSelectWidget(context, Keys.TYPE_OF_PARTICIPANTS, LinearLayout.VERTICAL, "Type Of Participants attending", true, "University Students", "Parents", "Community leaders", "Adolescents and Youth (Age 15-29)", "Children (Age 0-14)", "Other");
        widgets.add(typeOfParticipants);

        ToggleWidgetData typeOfParticipantsToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherParticipantsSkipper = typeOfParticipantsToggler.addOption("Other");
        widgets.add(OtherParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        widgets.add(OtherParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_OTHER, "Number of Other", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        OtherParticipantsSkipper.build();

        ToggleWidgetData.SkipData uniStudentsParticipantsSkipper = typeOfParticipantsToggler.addOption("University Students");
        widgets.add(uniStudentsParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENTS, "Number of University Students", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        uniStudentsParticipantsSkipper.build();

        ToggleWidgetData.SkipData parentsParticipantsSkipper = typeOfParticipantsToggler.addOption("Parents");
        widgets.add(parentsParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_PARENTS, "Number of Parents", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        parentsParticipantsSkipper.build();

        ToggleWidgetData.SkipData communityLeadersParticipantsSkipper = typeOfParticipantsToggler.addOption("Community leaders");
        widgets.add(communityLeadersParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_COMMUNITY_LEARDER, "Number of Community Leaders", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        communityLeadersParticipantsSkipper.build();

        ToggleWidgetData.SkipData youthParticipantsSkipper = typeOfParticipantsToggler.addOption("Adolescents and Youth (Age 15-29)");
        widgets.add(youthParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_YOUTH, "Number of Adolescents and Youth (Age 15-29)", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        youthParticipantsSkipper.build();

        ToggleWidgetData.SkipData childrenParticipantsSkipper = typeOfParticipantsToggler.addOption("Children (Age 0-14)");
        widgets.add(childrenParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_CHILDREN, "Number of Children (Age 0-14)", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        childrenParticipantsSkipper.build();

        typeOfParticipants.addDependentWidgets(typeOfParticipantsToggler.getToggleMap());

        RadioWidget sexOfParticipants = new RadioWidget(context, Keys.SEX, "Sex of Participants", true, "Male", "Female", "Other");
        widgets.add(sexOfParticipants);

        ToggleWidgetData sexToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData maleSkipper = sexToggler.addOption("Male");
        widgets.add(maleSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_MALE, "Number of Male", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        maleSkipper.build();

        ToggleWidgetData.SkipData femaleSkipper = sexToggler.addOption("Female");
        widgets.add(femaleSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_FEMALE, "Number of Female", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        femaleSkipper.build();

        ToggleWidgetData.SkipData otherSkipper = sexToggler.addOption("Other");
        widgets.add(otherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_OTHER, "Number of Other", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        otherSkipper.build();

        sexOfParticipants.addDependentWidgets(sexToggler.getToggleMap());


        widgets.add(new RadioWidget(context, Keys.AGE, "Age of Participants", true, "0-5", "6-10", "11-15", "16-20", "21-49", "50+"));

        MultiSelectWidget topics_covered = new MultiSelectWidget(context, Keys.TOPICS_COVERED, LinearLayout.VERTICAL, "Topics covered", true, context.getResources().getStringArray(R.array.topics_covered_ACStepDownTraining_form));
        widgets.add(topics_covered);

        ToggleWidgetData topicsCoveredToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherSkipper = topicsCoveredToggler.addOption("Other");
        widgets.add(OtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_2, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        OtherSkipper.build();

        topics_covered.addDependentWidgets(topicsCoveredToggler.getToggleMap());


        return widgets;
    }


    private List<Widget> getHealthCareProviderReachFormWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.USER_ID, "User ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.PARTICIPANT_NAME, "Participant Name", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.PARTICIPANT_ID, "Participant ID", InputType.TYPE_CLASS_TEXT, ID_LENGTH, true).setMinimumValue(ONE).build());
        widgets.add(new RadioWidget(context, Keys.SEX, "Sex", true, "Male", "Female", "Other"));

        MultiSelectWidget participantAffliation = new MultiSelectWidget(context, Keys.PARTICIPANT_AFFLIATION, LinearLayout.VERTICAL, "Participant Affliation", true, context.getResources().getStringArray(R.array.participants_affliation));
        widgets.add(participantAffliation);

        ToggleWidgetData participantAffliationToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherSkipper = participantAffliationToggler.addOption("Other");
        widgets.add(OtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        OtherSkipper.build();

        participantAffliation.addDependentWidgets(participantAffliationToggler.getToggleMap());

        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));

        RadioWidget firstFollowup = new RadioWidget(context, Keys.LAST_FOLLOWUP, "Is this the first followup", true, "Yes", "No");
        widgets.add(firstFollowup);
        ToggleWidgetData firstFollowUpToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData followUpSkipper = firstFollowUpToggler.addOption("No");
        widgets.add(followUpSkipper.addWidgetToToggle(new DateWidget(context, Keys.DATE_OF_LAST_FOLLOWUP, "Date of Last Followup", true)).hideView());
        followUpSkipper.build();
        firstFollowup.addDependentWidgets(firstFollowUpToggler.getToggleMap());

        MultiSelectWidget sexReached = new MultiSelectWidget(context, Keys.SEX_OF_PEOPLE_REACHED, LinearLayout.VERTICAL, "Sex of People Reached", true, "Male", "Female", "Other");
        widgets.add(sexReached.addHeader("Secondary Beneficiary Demographics"));

        ToggleWidgetData sexOfPeopleReachedToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData sexOfMaleReachedSkipper = sexOfPeopleReachedToggler.addOption("Male");
        widgets.add(sexOfMaleReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.MALE, "Number of Male Reached", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).build()).hideView());
        sexOfMaleReachedSkipper.build();

        ToggleWidgetData.SkipData sexOfFemaleReachedSkipper = sexOfPeopleReachedToggler.addOption("Female");
        widgets.add(sexOfFemaleReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.FEMALE, "Number of Female Reached", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).build()).hideView());
        sexOfFemaleReachedSkipper.build();

        ToggleWidgetData.SkipData sexOfOtherGenderReachedSkipper = sexOfPeopleReachedToggler.addOption("Other");
        widgets.add(sexOfOtherGenderReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_GENDER, "Number of Other Gender Reached", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).build()).hideView());
        sexOfOtherGenderReachedSkipper.build();

        sexReached.addDependentWidgets(sexOfPeopleReachedToggler.getToggleMap());

        RadioWidget ageOfPeopleReached = new RadioWidget(context, Keys.AGE, "Age of People Reached", true, context.getResources().getStringArray(R.array.hcp_age_group));
        widgets.add(ageOfPeopleReached);

        ToggleWidgetData ageOfPeopleReachedToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData ageOfGroupOneReachedSkipper = ageOfPeopleReachedToggler.addOption("0-5");
        widgets.add(ageOfGroupOneReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_1, "Number of People Aged 0-5", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).build()).hideView());
        ageOfGroupOneReachedSkipper.build();

        ToggleWidgetData.SkipData ageOfGroupTwoReachedSkipper = ageOfPeopleReachedToggler.addOption("6-10");
        widgets.add(ageOfGroupTwoReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_2, "Number of People Aged 6-10", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).build()).hideView());
        ageOfGroupTwoReachedSkipper.build();

        ToggleWidgetData.SkipData ageOfGroupThreeReachedSkipper = ageOfPeopleReachedToggler.addOption("11-15");
        widgets.add(ageOfGroupThreeReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_3, "Number of People Aged 11-15", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).build()).hideView());
        ageOfGroupThreeReachedSkipper.build();

        ToggleWidgetData.SkipData ageOfGroupFourReachedSkipper = ageOfPeopleReachedToggler.addOption("16-20");
        widgets.add(ageOfGroupFourReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_4, "Number of People Aged 16-20", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).build()).hideView());
        ageOfGroupFourReachedSkipper.build();

        ToggleWidgetData.SkipData ageOfGroupFiveReachedSkipper = ageOfPeopleReachedToggler.addOption("21-49");
        widgets.add(ageOfGroupFiveReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_5, "Number of People Aged 21-49", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).build()).hideView());
        ageOfGroupFiveReachedSkipper.build();

        ToggleWidgetData.SkipData ageOfGroupSixReachedSkipper = ageOfPeopleReachedToggler.addOption("50+");
        widgets.add(ageOfGroupSixReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_6, "Number of People Aged 50", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).build()).hideView());
        ageOfGroupSixReachedSkipper.build();

        ageOfPeopleReached.addDependentWidgets(ageOfPeopleReachedToggler.getToggleMap());

        MultiSelectWidget services = new MultiSelectWidget(context, Keys.SERVICES_TYPE, LinearLayout.VERTICAL, "Type Of Services Provided", true, context.getResources().getStringArray(R.array.service_type));
        widgets.add(services);

        ToggleWidgetData otherServicesToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData otherServicesSkipper = otherServicesToggler.addOption("Other");
        widgets.add(otherServicesSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        otherServicesSkipper.build();

        services.addDependentWidgets(otherServicesToggler.getToggleMap());

        return widgets;
    }

    private List<Widget> getOneTouchSensitizationSessionDetailsFormWidgets() {

        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.USER_ID, "User ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());

        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));
        widgets.add(new EditTextWidget.Builder(context, Keys.INSTITUTION_NAME, "Name of Institution / Venue", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());

        widgets.add(new UserWidget(context, Keys.DONOR_NAME, "Donor Name", getDummyList()));

        widgets.add(new UserWidget(context, Keys.TRAINER, "Name(s) of Trainer(s)", getDummyList()));

        MultiSelectWidget topics_covered = new MultiSelectWidget(context, Keys.TOPICS_COVERED, LinearLayout.VERTICAL, "Topics covered", true, context.getResources().getStringArray(R.array.topics_covered_oneTouchSensitization_form));
        widgets.add(topics_covered);

        ToggleWidgetData topicsCoveredToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherSkipper = topicsCoveredToggler.addOption("Other");
        widgets.add(OtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        OtherSkipper.build();
        topics_covered.addDependentWidgets(topicsCoveredToggler.getToggleMap());


        widgets.add(new EditTextWidget.Builder(context, Keys.DAYS_QUANTITY, "Number of Days", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).build());

        RadioWidget sexOfParticipant = new RadioWidget(context, Keys.SEX, "Sex of Participants", true, "Male", "Female", "Other");
        widgets.add(sexOfParticipant);
        ToggleWidgetData sexOfParticipantToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData participantsOtherSkipper = sexOfParticipantToggler.addOption("Other");
        widgets.add(participantsOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_OTHER, "Number of Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        participantsOtherSkipper.build();

        ToggleWidgetData.SkipData participantsMaleSkipper = sexOfParticipantToggler.addOption("Male");
        widgets.add(participantsMaleSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_MALE, "Number of Males", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).build()).hideView());
        participantsMaleSkipper.build();

        ToggleWidgetData.SkipData participantsFemaleSkipper = sexOfParticipantToggler.addOption("Female");
        widgets.add(participantsFemaleSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_FEMALE, "Number of Females", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).build()).hideView());
        participantsFemaleSkipper.build();

        sexOfParticipant.addDependentWidgets(sexOfParticipantToggler.getToggleMap());

        widgets.add(new RadioWidget(context, Keys.AGE, "Participant Age Group", true, context.getResources().getStringArray(R.array.age_group)));


        MultiSelectWidget participantType = new MultiSelectWidget(context, Keys.PARTICIPANT_TYPE, LinearLayout.VERTICAL, "Type of Participants", true, context.getResources().getStringArray(R.array.one_touch_sensitization_SRHM_participants));
        widgets.add(participantType);

        ToggleWidgetData participantToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData participantSkipper = participantToggler.addOption("Other");
        widgets.add(participantSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_PARTICIPANTS, "Specify Other", InputType.TYPE_CLASS_TEXT, TWO_HUNDRED, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build().hideView()));
        participantSkipper.build();

        participantType.addDependentWidgets(participantToggler.getToggleMap());


        return widgets;

    }


    private List<Widget> getInstitutionClosingFormWidgets() {

        List<Widget> widgets = new ArrayList<>();

        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.USER_ID, "User ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.INSTITUTION_ID, "Institution ID", InputType.TYPE_CLASS_NUMBER, INSTITUTION_ID_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.INSTITUTION_NAME, "Name of Institution", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new DateWidget(context, Keys.DATE_PARTNERSHIP_STARTED, "Date partnership with Aahung was formed", true));
        widgets.add(new DateWidget(context, Keys.DATE_PARTNERSHIP_ENDED, "Date partnership with Aahung ended", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.PARTNERSHIP_YEARS, "Number of years of partnership", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).build());

        SpinnerWidget type_of_institution = new SpinnerWidget(context, Keys.TYPE_OF_INSTITUION, "Type of Institution", Arrays.asList(context.getResources().getStringArray(R.array.institution_type)), true);
        widgets.add(type_of_institution);

        ToggleWidgetData typeOfInstitutionToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherInstitutionSkipper = typeOfInstitutionToggler.addOption("Other");
        widgets.add(OtherInstitutionSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        OtherInstitutionSkipper.build();
        type_of_institution.addDependentWidgets(typeOfInstitutionToggler.getToggleMap());


        widgets.add(new EditTextWidget.Builder(context, Keys.REASON_PARTNERSHIP, "Reason for end of partnership", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build());

        return widgets;
    }


    //COMMS


    private List<Widget> getRadioAppearanceFormWidgets() {

        List<Widget> widgets = new ArrayList<>();

        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.USER_ID, "User ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new TimeWidget(context, Keys.TIME, "Time", true));

        widgets.add(new EditTextWidget.Builder(context, Keys.RADIO_NAME, "Name of Radio", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.RADIO_FREQ, "Radio Frequency", InputType.TYPE_CLASS_NUMBER, SIX, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build());


        SpinnerWidget city = new SpinnerWidget(context, Keys.CITY, "City", Arrays.asList(context.getResources().getStringArray(R.array.city)), true);
        widgets.add(city);

        ToggleWidgetData cityToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData cityOtherSkipper = cityToggler.addOption("Other");
        widgets.add(cityOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        cityOtherSkipper.build();
        city.addDependentWidgets(cityToggler.getToggleMap());


        SpinnerWidget topicsCovered = new SpinnerWidget(context, Keys.TOPICS_COVERED, "Topics Covered", Arrays.asList(context.getResources().getStringArray(R.array.topics_rado_appearance_form)), true);
        widgets.add(topicsCovered);

        ToggleWidgetData otherToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData otherSkipper = otherToggler.addOption("Other");
        widgets.add(otherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_TOPICS, "Other", InputType.TYPE_CLASS_TEXT, TWO_HUNDRED, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build().hideView()));
        otherSkipper.build();
        topicsCovered.addDependentWidgets(otherToggler.getToggleMap());

        widgets.add(new UserWidget(context, Keys.STAFF_ON_RADIO, "Aahung Staff on Radio", getDummyList()));
        widgets.add(new EditTextWidget.Builder(context, Keys.NO_OF_LIVE_CALLS, "Number of Live Calls During Show", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.NO_OF_LISTENERS, "Number of Listeners", InputType.TYPE_CLASS_NUMBER, THREE, false).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build());


        return widgets;
    }


    private List<Widget> getMobileCinemaTheatreDetailsFormWidgets() {
        List<Widget> widgets = new ArrayList<>();

        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.USER_ID, "User ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());

        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));

        widgets.add(new SpinnerWidget(context, Keys.TYPE_OF_SCREENING, "Type Of Screening", Arrays.asList(context.getResources().getStringArray(R.array.type_of_screening)), true));


        MultiSelectWidget topicCovered = new MultiSelectWidget(context, Keys.SESSION_TOPICS, LinearLayout.VERTICAL, "Topic Screened", true, context.getResources().getStringArray(R.array.topics_screened));
        widgets.add(topicCovered);

        ToggleWidgetData topicsCoveredToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData topicCoveredOtherSkipper = topicsCoveredToggler.addOption("Other");
        widgets.add(topicCoveredOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        topicCoveredOtherSkipper.build();
        topicCovered.addDependentWidgets(topicsCoveredToggler.getToggleMap());

        widgets.add(new EditTextWidget.Builder(context, Keys.NAME_OF_PERF, "Name of Video or Performance", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());


        MultiSelectWidget sexOfAudience = new MultiSelectWidget(context, Keys.SEX_OF_AUDIENCE, LinearLayout.VERTICAL, "Sex of Audience", true, context.getResources().getStringArray(R.array.audience_sex));
        widgets.add(sexOfAudience);

        ToggleWidgetData sexOfAudienceToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData participantsOtherSkipper = sexOfAudienceToggler.addOption("Other");
        widgets.add(participantsOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_OTHER, "Number of Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        participantsOtherSkipper.build();

        ToggleWidgetData.SkipData participantsMaleSkipper = sexOfAudienceToggler.addOption("Male");
        widgets.add(participantsMaleSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_MALE, "Number of Males", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).build()).hideView());
        participantsMaleSkipper.build();

        ToggleWidgetData.SkipData participantsFemaleSkipper = sexOfAudienceToggler.addOption("Female");
        widgets.add(participantsFemaleSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_FEMALE, "Number of Females", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).build()).hideView());
        participantsFemaleSkipper.build();

        sexOfAudience.addDependentWidgets(sexOfAudienceToggler.getToggleMap());


        MultiSelectWidget ageOfPeopleReached = new MultiSelectWidget(context, Keys.AGE, LinearLayout.VERTICAL, "Age of Audience", true, context.getResources().getStringArray(R.array.age_group_cinema_form));
        widgets.add(ageOfPeopleReached);

        ToggleWidgetData ageOfPeopleReachedToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData ageOfGroupOneReachedSkipper = ageOfPeopleReachedToggler.addOption("5-10");
        widgets.add(ageOfGroupOneReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_1, "Number of Audience Aged 5-10", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).build()).hideView());
        ageOfGroupOneReachedSkipper.build();

        ToggleWidgetData.SkipData ageOfGroupTwoReachedSkipper = ageOfPeopleReachedToggler.addOption("11-15");
        widgets.add(ageOfGroupTwoReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_2, "Number of Audience Aged 11-15", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).build()).hideView());
        ageOfGroupTwoReachedSkipper.build();

        ToggleWidgetData.SkipData ageOfGroupThreeReachedSkipper = ageOfPeopleReachedToggler.addOption("16-20");
        widgets.add(ageOfGroupThreeReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_3, "Number of Audience Aged 16-20", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).build()).hideView());
        ageOfGroupThreeReachedSkipper.build();

        ToggleWidgetData.SkipData ageOfGroupFiveReachedSkipper = ageOfPeopleReachedToggler.addOption("21-49");
        widgets.add(ageOfGroupFiveReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_4, "Number of Audience Aged 21-49", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).build()).hideView());
        ageOfGroupFiveReachedSkipper.build();

        ToggleWidgetData.SkipData ageOfGroupSixReachedSkipper = ageOfPeopleReachedToggler.addOption("50+");
        widgets.add(ageOfGroupSixReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_5, "Number of Audience Aged 50+", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).build()).hideView());
        ageOfGroupSixReachedSkipper.build();

        ageOfPeopleReached.addDependentWidgets(ageOfPeopleReachedToggler.getToggleMap());


        return widgets;
    }


    private List<Widget> getTrainingDetailsFormCommunicationsWidgets() {
        List<Widget> widgets = new ArrayList<>();

        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.USER_ID, "User ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());

        SpinnerWidget city = new SpinnerWidget(context, Keys.CITY, "City", Arrays.asList(context.getResources().getStringArray(R.array.city)), true);
        widgets.add(city);

        ToggleWidgetData cityToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData cityOtherSkipper = cityToggler.addOption("Other");
        widgets.add(cityOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        cityOtherSkipper.build();
        city.addDependentWidgets(cityToggler.getToggleMap());

        widgets.add(new EditTextWidget.Builder(context, Keys.TRAINING_ID, "Training ID", InputType.TYPE_CLASS_TEXT, TRAINING_ID_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build());
        widgets.add(new UserWidget(context, Keys.PARTICPANTS, "Aahung Trainer(s)", getDummyList()));

        SpinnerWidget training_venue = new SpinnerWidget(context, Keys.VENUE, "Training Venue", Arrays.asList("Aahung Office","Other"), true);
        widgets.add(training_venue);

        ToggleWidgetData trainingVenueToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData trainingVenueOtherSkipper = trainingVenueToggler.addOption("Other");
        widgets.add(trainingVenueOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_2, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        trainingVenueOtherSkipper.build();
        training_venue.addDependentWidgets(trainingVenueToggler.getToggleMap());

        widgets.add(new EditTextWidget.Builder(context, Keys.DAYS_QUANTITY, "Number of Days", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).build());

        MultiSelectWidget topicCovered = new MultiSelectWidget(context, Keys.TOPICS_COVERED, LinearLayout.VERTICAL, "Topics Covered", true, context.getResources().getStringArray(R.array.topics_covered_training_detail_comms));
        widgets.add(topicCovered);
        ToggleWidgetData otherTopicToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData otherTopicSkipper = otherTopicToggler.addOption("Other");
        widgets.add(otherTopicSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_TOPICS, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        otherTopicSkipper.build();

        topicCovered.addDependentWidgets(otherTopicToggler.getToggleMap());


        MultiSelectWidget typeOfParticipants = new MultiSelectWidget(context, Keys.TYPE_OF_PARTICIPANTS, LinearLayout.VERTICAL, "Type Of Participants", true, context.getResources().getStringArray(R.array.type_of_participants_training_detail_comms));
        widgets.add(typeOfParticipants);

        ToggleWidgetData typeOfParticipantsToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherParticipantsSkipper = typeOfParticipantsToggler.addOption("Other");
        widgets.add(OtherParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_PARTICIPANTS, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        widgets.add(OtherParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_OTHER, "Number of Other", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        OtherParticipantsSkipper.build();

        ToggleWidgetData.SkipData journalistsParticipantsSkipper = typeOfParticipantsToggler.addOption("Journalists");
        widgets.add(journalistsParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_JOURNALISTS, "Number of Journalists", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        journalistsParticipantsSkipper.build();

        ToggleWidgetData.SkipData bloggersParticipantsSkipper = typeOfParticipantsToggler.addOption("Bloggers");
        widgets.add(bloggersParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_BLOGGERS, "Number of Bloggers", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        bloggersParticipantsSkipper.build();

        ToggleWidgetData.SkipData screenwritersParticipantsSkipper = typeOfParticipantsToggler.addOption("Screenwriters");
        widgets.add(screenwritersParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_SCREENWRITERS, "Number of Screenwriters", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        screenwritersParticipantsSkipper.build();

        ToggleWidgetData.SkipData mediaPersonnelParticipantsSkipper = typeOfParticipantsToggler.addOption("Other Media Personnel");
        widgets.add(mediaPersonnelParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_MEDIA_PERSONNEL, "Number of Other Media Personnel", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).setMinimumValue(ONE).build()).hideView());
        mediaPersonnelParticipantsSkipper.build();

        typeOfParticipants.addDependentWidgets(typeOfParticipantsToggler.getToggleMap());


        return widgets;
    }


    private List<Widget> getSocialMediaDetailsWidgets() {

        List<Widget> widgets = new ArrayList<>();

        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        widgets.add(new MultiSelectWidget(context, Keys.POST_RELEVANT_FOR, LinearLayout.VERTICAL, "Post Relevant For", true, "LSE","SRHM","Comms"));
        widgets.add(new DateWidget(context, Keys.TIME_FOR_POST, "Date/Time of Post", true));

        SpinnerWidget typeOfPost = new SpinnerWidget(context, Keys.TYPE_OF_POST, "Type of Post", Arrays.asList(context.getResources().getStringArray(R.array.post_type)), true);
        widgets.add(typeOfPost);

        ToggleWidgetData typeOfPostToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData typeOfPostOtherSkipper = typeOfPostToggler.addOption("Other");
        widgets.add(typeOfPostOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        typeOfPostOtherSkipper.build();
        typeOfPost.addDependentWidgets(typeOfPostToggler.getToggleMap());

        MultiSelectWidget topicsCoveredByPost = new MultiSelectWidget(context, Keys.TOPICS_COVERED, LinearLayout.VERTICAL, "Topics Covered by Post", true, context.getResources().getStringArray(R.array.topics_covered_by_post));
        widgets.add(topicsCoveredByPost);

        ToggleWidgetData topicsCoveredByPostToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData topicsCoveredByPostOtherSkipper = topicsCoveredByPostToggler.addOption("Other");
        widgets.add(topicsCoveredByPostOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_2, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        topicsCoveredByPostOtherSkipper.build();
        topicsCoveredByPost.addDependentWidgets(topicsCoveredByPostToggler.getToggleMap());


        MultiSelectWidget platformsUsed = new MultiSelectWidget(context, Keys.PLATFORM_USED,LinearLayout.VERTICAL, "Platforms Used",true, context.getResources().getStringArray(R.array.platforms)).enableSocialMediaStats();
        widgets.add(platformsUsed);

        ToggleWidgetData platformsUsedToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData platformsUsedOtherSkipper = platformsUsedToggler.addOption("Other");
        widgets.add(platformsUsedOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_3, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        platformsUsedOtherSkipper.build();
        platformsUsed.addDependentWidgets(platformsUsedToggler.getToggleMap());

        return widgets;
    }


    private List<Widget> getDistributionofCommunicationMaterialWidgets() {

        List<Widget> widgets = new ArrayList<>();

        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.USER_ID, "User ID", InputType.TYPE_CLASS_NUMBER, ID_LENGTH, true).build());
        widgets.add(new SpinnerWidget(context, Keys.COMPONENT, "Component", Arrays.asList(context.getResources().getStringArray(R.array.component)), true));

        SpinnerWidget city = new SpinnerWidget(context, Keys.CITY, "City", Arrays.asList(context.getResources().getStringArray(R.array.city)), true);
        widgets.add(city);

        ToggleWidgetData cityToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData cityOtherSkipper = cityToggler.addOption("Other");
        widgets.add(cityOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        cityOtherSkipper.build();
        city.addDependentWidgets(cityToggler.getToggleMap());


        SpinnerWidget location = new SpinnerWidget(context, Keys.LOCATION, "Location", Arrays.asList(context.getResources().getStringArray(R.array.location)), true);
        widgets.add(location);

        ToggleWidgetData locationToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData locationOtherSkipper = locationToggler.addOption("Other");
        widgets.add(locationOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_2, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build()).hideView());
        locationOtherSkipper.build();
        location.addDependentWidgets(locationToggler.getToggleMap());

        widgets.add(new EditTextWidget.Builder(context, Keys.LOCATION_NAME, "Name of location", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());


        MultiSelectWidget typeOfMaterial = new MultiSelectWidget(context, Keys.TYPE_OF_MATERIAL, LinearLayout.VERTICAL, "Type of Material", true, context.getResources().getStringArray(R.array.type_of_material));
        widgets.add(typeOfMaterial);

        ToggleWidgetData typeOfMaterialtToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData typeOfMaterialOtherSkipper = typeOfMaterialtToggler.addOption("Other");
        widgets.add(typeOfMaterialOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_2, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        widgets.add(typeOfMaterialOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_NUMBER, "Number of Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        typeOfMaterialOtherSkipper.build();


        ToggleWidgetData.SkipData annualReportSkipper = typeOfMaterialtToggler.addOption("Annual Report");
        widgets.add(annualReportSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.ANNUAL_REPORT, "Number of Annual Report", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        annualReportSkipper.build();

        ToggleWidgetData.SkipData aahungProfileSkipper = typeOfMaterialtToggler.addOption("Aahung Profile");
        widgets.add(aahungProfileSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.AAHUNG_PROFILE, "Number of Aahung Profile", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        aahungProfileSkipper.build();

        ToggleWidgetData.SkipData PamphletSkipper = typeOfMaterialtToggler.addOption("Pamphlet");
        widgets.add(PamphletSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PAMPHLET, "Number of Pamphlet", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        PamphletSkipper.build();

        ToggleWidgetData.SkipData bookletSkipper = typeOfMaterialtToggler.addOption("Booklet");
        widgets.add(bookletSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.BOOKLET, "Number of Booklet", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        bookletSkipper.build();

        ToggleWidgetData.SkipData reportSkipper = typeOfMaterialtToggler.addOption("Report");
        widgets.add(reportSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.REPORT, "Number of Report", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        reportSkipper.build();

        ToggleWidgetData.SkipData brandingSkipper = typeOfMaterialtToggler.addOption("Aahung Branding Material");
        widgets.add(brandingSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.BRANDING_MATERIAL, "Number of Aahung Branding Material", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        brandingSkipper.build();

        typeOfMaterial.addDependentWidgets(typeOfMaterialtToggler.getToggleMap());

        MultiSelectWidget topics = new MultiSelectWidget(context, Keys.TOPIC, LinearLayout.VERTICAL, "Topic", true, context.getResources().getStringArray(R.array.topic_communication_material_comms_categoryB));
        widgets.add(topics);

        ToggleWidgetData topicToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData aahungInfo = topicToggler.addOption("Aahung Information");
        widgets.add(aahungInfo.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.AAHUNG_INFO, "Number of Aahung Information", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        aahungInfo.build();

        ToggleWidgetData.SkipData mugs = topicToggler.addOption("Aahung Mugs");
        widgets.add(mugs.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.AAHUNG_MUGS, "Number of Aahung Mugs", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        mugs.build();

        ToggleWidgetData.SkipData folder = topicToggler.addOption("Aahung Folders");
        widgets.add(folder.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.AAHUNG_FOLDERS, "Number of Aahung Folders", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        folder.build();

        ToggleWidgetData.SkipData notebooks = topicToggler.addOption("Aahung Notebooks");
        widgets.add(notebooks.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.AAHUNG_NOTEBOOk, "Number of Aahung Notebooks", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        notebooks.build();

        ToggleWidgetData.SkipData nikahNama = topicToggler.addOption("Nikah Nama");
        widgets.add(nikahNama.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NIKAH_NAMA, "Number of Nikah Nama", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        nikahNama.build();

        ToggleWidgetData.SkipData puberty = topicToggler.addOption("Puberty");
        widgets.add(puberty.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PUBERTY, "Number of Puberty", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        puberty.build();

        ToggleWidgetData.SkipData rtis = topicToggler.addOption("RTIs");
        widgets.add(rtis.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.RTIs, "Number of RTIs", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        rtis.build();

        ToggleWidgetData.SkipData ungei = topicToggler.addOption("UNGEI");
        widgets.add(ungei.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.UNGEI, "Number of UNGEI", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        ungei.build();

        ToggleWidgetData.SkipData sti = topicToggler.addOption("STIs");
        widgets.add(sti.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.STIs, "Number of STIs", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        sti.build();

        ToggleWidgetData.SkipData sexualHealth = topicToggler.addOption("Sexual Health");
        widgets.add(sexualHealth.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.SEXUAL_HEALTH, "Number of Sexual Health", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        sexualHealth.build();

        ToggleWidgetData.SkipData preMaritalInfo = topicToggler.addOption("Pre-marital Information");
        widgets.add(preMaritalInfo.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PRE_MARITAL_INFO, "Number of Pre-marital Information", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        preMaritalInfo.build();

        ToggleWidgetData.SkipData pac = topicToggler.addOption("PAC");
        widgets.add(pac.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PAC, "Number of PAC", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        pac.build();

        ToggleWidgetData.SkipData maternalHealth = topicToggler.addOption("Maternal Health");
        widgets.add(maternalHealth.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.MATERNAL_HEALTH, "Number of Maternal Health", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        maternalHealth.build();

        ToggleWidgetData.SkipData other = topicToggler.addOption("Other");
        widgets.add(other.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.DISTRIBUTION_OTHER, "Number of Other", InputType.TYPE_CLASS_NUMBER, NORMAL_LENGTH, true).setMinimumValue(ONE).build()).hideView());
        other.build();

        topics.addDependentWidgets(topicToggler.getToggleMap());

        typeOfMaterial.setCheckChangeListener(new AnnualInfoListener(topics));

        MultiSelectWidget typeOfParticipants = new MultiSelectWidget(context, Keys.TYPE_OF_PARTICIPANTS, LinearLayout.VERTICAL, "Type Of Participants", true, context.getResources().getStringArray(R.array.participants_type));
        widgets.add(typeOfParticipants);

        ToggleWidgetData typeOfParticipantsToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherParticipantsSkipper = typeOfParticipantsToggler.addOption("Other");
        widgets.add(OtherParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        OtherParticipantsSkipper.build();

        typeOfParticipants.addDependentWidgets(typeOfParticipantsToggler.getToggleMap());


        return widgets;

    }

    private class ProvinceListener implements WidgetContract.ItemChangeListener {
        private SpinnerWidget district;
        private boolean isNayaQadamForm;
        private LocationService locationService = new LocationService(context);


        public ProvinceListener(SpinnerWidget district) {
            this.district = district;
        }

        public ProvinceListener enableNayaQadamFilteration() {
            isNayaQadamForm = true;
            return this;
        }

        @Override
        public void onItemChange(String data) {
            List<String> districts = locationService.getFilteredDistrict(data, isNayaQadamForm);
            district.updateAdaper(districts);
        }
    }

    private class QuantityChangeListener implements WidgetContract.ChangeNotifier {
        private Widget widget;

        public QuantityChangeListener(Widget widget) {
            this.widget = widget;
        }

        @Override
        public void notifyChanged(String data) {
            if (!isEmpty(data)) {
                Integer value = Integer.valueOf(data);
                if (value > 0)
                    widget.showView();
                else
                    widget.hideView();
            } else
                widget.hideView();
        }
    }

    private class AnnualInfoListener implements MultiWidgetContract.MultiSwitchListener {
        private MultiSelectWidget distributionType;

        public AnnualInfoListener(MultiSelectWidget distributionType) {
            this.distributionType = distributionType;
        }


        @Override
        public void onCheckedChanged(List<CheckBox> choices) {
            for (CheckBox checkBox : choices) {
                if ((checkBox.getText().toString().equalsIgnoreCase("Annual Report")
                        || checkBox.getText().toString().equalsIgnoreCase("Aahung Profile")) && checkBox.isChecked()) {
                    distributionType.updateItems(context.getResources().getStringArray(R.array.topic_communication_material_comms_categoryA));
                    break;
                } else {
                    distributionType.updateItems(context.getResources().getStringArray(R.array.topic_communication_material_comms_categoryB));
                }
            }
        }
    }


}