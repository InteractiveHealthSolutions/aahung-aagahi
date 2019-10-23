package com.ihsinformatics.aahung.views;

import android.content.Context;
import android.text.InputType;
import android.text.method.DigitsKeyListener;
import android.widget.CheckBox;
import android.widget.LinearLayout;

import com.ihsinformatics.aahung.App;
import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.BaseAttribute;
import com.ihsinformatics.aahung.common.DateWatcher;
import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.common.IDGenerator;
import com.ihsinformatics.aahung.common.IDListener;
import com.ihsinformatics.aahung.common.ItemAddListener;
import com.ihsinformatics.aahung.common.Keys;
import com.ihsinformatics.aahung.common.MultiWidgetContract;
import com.ihsinformatics.aahung.common.ScoreCalculator;
import com.ihsinformatics.aahung.common.WidgetContract;
import com.ihsinformatics.aahung.db.AppDatabase;
import com.ihsinformatics.aahung.model.BaseItem;
import com.ihsinformatics.aahung.model.DataRepository;
import com.ihsinformatics.aahung.model.DataUpdater;
import com.ihsinformatics.aahung.model.FormDetails;
import com.ihsinformatics.aahung.model.LocationService;
import com.ihsinformatics.aahung.model.MultiSwitcher;
import com.ihsinformatics.aahung.model.RadioSwitcher;
import com.ihsinformatics.aahung.model.ToggleWidgetData;
import com.ihsinformatics.aahung.model.metadata.Definition;
import com.ihsinformatics.aahung.model.metadata.Role;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import static android.text.TextUtils.isEmpty;
import static com.ihsinformatics.aahung.common.Keys.LSBE_CHALLENGE_5_STATUS;
import static com.ihsinformatics.aahung.common.Keys.PAKISTAN;
import static com.ihsinformatics.aahung.common.Keys.PARTICIPANT_ID;
import static com.ihsinformatics.aahung.common.Keys.partnership_end_date;
import static com.ihsinformatics.aahung.common.Keys.partnership_start_date;


public class DataProvider {

    public static final int NORMAL_LENGTH = 200;
    public static final int TWO = 2;
    public static final int FOUR = 4;
    public static final int THREE = 3;
    public static final int ONE = 1;
    public static final int SIX = 6;
    public static final int HUNDRED = 100;
    public static final int TWO_HUNDRED = 200;
    public static final int FOUR_HUNDRED = 400;
    private static final int FIVE = 5;
    private static final int EIGHT = 8;

    private Context context;
    private FormDetails details;

    public static final String ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
    public static final String ALLOWED_CHARACTER_SET_NUMBERS = "0123456789";
    private static final String ALLOWED_CHARACTER_SET_NUMBERS_DECIMALS = ".0123456789";
    public static final String ALLOWED_CHARACTER_SET_NAME = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";
    private static final String ALLOWED_CHARACTER_SET_NAME_DECIMAL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";

    public static final String ALLOWED_CHARACTER_RADIO = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
    public static final String ALLOWED_EMAIL_CHARACTER_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@._-";
    public static final String ALLOWED_ADDRESS_CHARACTER_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,/- ";
    public static final String ALLOWED_CHARACTER_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    @Inject
    DataRepository dataRepository;

    @Inject
    AppDatabase database;

    public DataProvider(Context context, FormDetails details) {
        this.context = context;
        this.details = details;
        ((App) context.getApplicationContext()).getComponent().inject(this);
    }


    public enum Forms {
        ParentOrganizationRegistrationLSE("Parent Organization Registration", "location", FormCategory.LOCATION, FormSection.LSE, R.string.Parent_Organization_Registration, R.drawable.organization),
        DonorDetail("Donor Registration Form", "donor", FormCategory.DONOR, FormSection.LSE, R.string.Donor_Registration_Form, R.drawable.donor_form),
        ProjectDetail("Project Details Form", "project", FormCategory.PROJECT, FormSection.LSE, R.string.Project_Details_Form, R.drawable.project_form),
        SchoolDetails("School Details Form", "location", FormCategory.LOCATION, FormSection.LSE, R.string.School_Details_Form, R.drawable.school),
        ParticipantsDetailsForm("Participants Details Form", "participant", FormCategory.PARTICIPANT, FormSection.LSE, true, R.string.Participants_Details_Form_LSE, R.drawable.participants), /**/
        TrainingDetailForm("Training Detail Form", "formdata", FormSection.LSE, FormCategory.NORMAL_FORM, Keys.lse_training_detail, R.string.Training_Detail_Form, R.drawable.seminar),
        PrimaryMonitoringFormNew("Primary Monitoring Form - New", "formdata", FormSection.LSE, FormCategory.NORMAL_FORM, Keys.lse_primary_monitoring_new, true, R.string.Primary_Monitoring_Form_New, R.drawable.monitoring_forms),
        PrimaryMonitoringFormRunning("Primary Monitoring Form - Running", "formdata", FormSection.LSE, FormCategory.NORMAL_FORM, Keys.lse_primary_monitoring_running, true, R.string.Primary_Monitoring_Form_Running, R.drawable.monitoring_forms),
        PrimaryMonitoringFormExit("Primary Monitoring Form - Exit", "formdata", FormSection.LSE, FormCategory.NORMAL_FORM, Keys.lse_primary_monitoring_exit, true, R.string.Primary_Monitoring_Form_Exit, R.drawable.monitoring_forms),
        SecondaryMonitoringFormNew("Secondary Monitoring Form - New", "formdata", FormSection.LSE, FormCategory.NORMAL_FORM, Keys.lse_secondary_monitoring_new, true, R.string.Secondary_Monitoring_Form_New, R.drawable.monitoring_forms),
        SecondaryMonitoringFormRunning("Secondary Monitoring Form - Running", "formdata", FormSection.LSE, FormCategory.NORMAL_FORM, Keys.lse_secondary_monitoring_running, true, R.string.Secondary_Monitoring_Form_Running, R.drawable.monitoring_forms),
        SecondaryMonitoringFormExit("Secondary Monitoring Form - Exit", "formdata", FormSection.LSE, FormCategory.NORMAL_FORM, Keys.lse_secondary_monitoring_exit, true, R.string.Secondary_Monitoring_Form_Exit, R.drawable.monitoring_forms),
        SRHRPolicyForm("SRHR Policy Form", "formdata", FormSection.LSE, FormCategory.NORMAL_FORM, Keys.lse_srhr_policy, true, R.string.SRHR_Policy_Form, R.drawable.policy),
        ParentSessionsForm("Parent Sessions Form", "formdata", FormSection.LSE, FormCategory.NORMAL_FORM, Keys.lse_parent_sessions, true, R.string.Parent_Sessions_Form, R.drawable.training),
        MasterTrainerEligibilityCriteriaAssessment("Master Trainer Eligibility Criteria Assessment", "formdata", FormSection.LSE, FormCategory.NORMAL_FORM, Keys.lse_mt_eligibility_criteria_assessment, true, R.string.Master_Trainer_Eligibility_Criteria_Assessment, R.drawable.evaluation_checklist),
        MasterTrainerMockSessionEvaluationForm("Master Trainer Mock Session Evaluation Form", "formdata", FormSection.LSE, FormCategory.NORMAL_FORM, Keys.lse_mt_mock_session_evaluation, true, R.string.Master_Trainer_Mock_Session_Evaluation_Form, R.drawable.assessment_stars),
        StepDownTrainingMonitoringForm("Step Down Training Monitoring Form", "formdata", FormSection.LSE, FormCategory.NORMAL_FORM, Keys.lse_step_down_training_monitoring, true, R.string.Step_Down_Training_Monitoring_Form, R.drawable.monitoring_forms),
        StakeholderMeetings("Stakeholder Meetings", "formdata", FormSection.LSE, FormCategory.NORMAL_FORM, Keys.lse_one_touch_session_detail, R.string.Stakeholder_Meetings, R.drawable.stakeholder_meeting),
        OneTouchSessionDetailForm("One-Touch Session Detail Form", "formdata", FormSection.LSE, FormCategory.NORMAL_FORM, Keys.lse_one_touch_session_detail, R.string.One_Touch_Session_Detail_Form, R.drawable.touch_sensation),
        SchoolClosingForm("School Closing Form", "locationattributesstream", FormCategory.LOCATION, FormSection.LSE, true, R.string.School_Closing_Form, R.drawable.school),


        ParentOrganizationRegistrationSRHM("Parent Organization Registration", "location", FormCategory.LOCATION, FormSection.SRHM, R.string.Parent_Organization_Registration, R.drawable.organization),
        DonorDetailSRHM("Donor Registration Form", "donor", FormCategory.DONOR, FormSection.SRHM, R.string.Donor_Registration_Form, R.drawable.donor_form),
        ProjectDetailSRHM("Project Details Form", "project", FormCategory.PROJECT, FormSection.SRHM, R.string.Project_Details_Form, R.drawable.project_form),
        NayaQadamStepDownTrainingDetailsForm("Naya Qadam Step Down Training Details Form", "formdata", FormSection.SRHM, FormCategory.NORMAL_FORM, Keys.srhm_naya_qadam_step_down_training_details, R.string.Naya_Qadam_Step_Down_Training_Details_Form, R.drawable.naya_qadam),
        InstitutionDetailsForm("Institution Details Form", "location", FormCategory.LOCATION, FormSection.SRHM, R.string.Institution_Project_Details_Form, R.drawable.institution),
        AmplifyChangeParticipantDetailsForm("Amplify Change Participant Details Form", "participant", FormCategory.PARTICIPANT, FormSection.SRHM, true, R.string.Amplify_Change_Participant_Details_Form, R.drawable.participants2),
        AmplifyChangeTrainingDetailsForm("Amplify Change Training Details Form", "formdata", FormSection.SRHM, FormCategory.NORMAL_FORM, Keys.srhm_amplify_change_training_details, true, R.string.Amplify_Change_Training_Details_Form, R.drawable.training2),
        AmplifyChangeStepDownTrainingDetailsForm("Amplify Change Step Down Training Details Form", "formdata", FormSection.SRHM, FormCategory.NORMAL_FORM, Keys.srhm_amplify_change_step_down_training_details, true, R.string.Amplify_Change_Step_Down_Training_Details_Form, R.drawable.training3),
        ParticipantsDetailsSRHMForm("Participants Details Form", "participant", FormCategory.PARTICIPANT, FormSection.SRHM, true, R.string.Participants_Details_Form_SRHM, R.drawable.participants),
        GeneralTrainingDetailsForm("General Training Details Form", "formdata", FormSection.SRHM, FormCategory.NORMAL_FORM, Keys.srhm_general_training_details, true, R.string.General_Training_Details_Form, R.drawable.training2),
        GeneralStepDownTrainingDetailsForm("General Step Down Training Details Form", "formdata", FormSection.SRHM, FormCategory.NORMAL_FORM, Keys.srhm_general_step_down_training_details, true, R.string.General_Step_Down_Training_Details_Form, R.drawable.training),
        HealthCareProviderReachForm("Health Care Provider Reach Form", "formdata", FormSection.SRHM, FormCategory.NORMAL_FORM, Keys.srhm_health_care_provider_reach, true, R.string.Health_Care_Provider_Reach_Form, R.drawable.health_care),
        OneTouchSensitizationSessionDetailsForm("One-Touch Sensitization Session Details Form", "formdata", FormSection.SRHM, FormCategory.NORMAL_FORM, Keys.srhm_one_touch_sensitization_session_details, R.string.One_Touch_Sensitization_Session_Details_Form, R.drawable.touch_sensation),
        InstitutionClosingForm("Institution Closing Form", "locationattributesstream", FormCategory.LOCATION, FormSection.SRHM, true, R.string.Institution_Project_Closing_Form, R.drawable.institution),

        SocialMediaDetails("Social Media Details", "formdata", FormSection.COMMS, FormCategory.NORMAL_FORM, Keys.comms_social_media_details, R.string.Social_Media_Details, R.drawable.social_media),
        DistributionofCommunicationMaterial("Distribution of Communication Material", "formdata", FormSection.COMMS, FormCategory.NORMAL_FORM, Keys.comms_distribution_of_communication_material, R.string.Distribution_of_Communication_Material, R.drawable.distributed),
        RadioAppearanceForm("Radio Appearance Form", "formdata", FormSection.COMMS, FormCategory.NORMAL_FORM, Keys.comms_radio_appearance, R.string.Radio_Appearance_Form, R.drawable.ic_radio),
        MobileCinemaTheatreDetailsForm("Mobile Cinema/Theatre Details Form", "formdata", FormSection.COMMS, FormCategory.NORMAL_FORM, Keys.comms_mobile_cinema_theatre_details, R.string.Mobile_Cinema_Theatre_Details_Form, R.drawable.cinema),
        TrainingDetailsFormCommunications("Training Details Form - Communications", "formdata", FormSection.COMMS, FormCategory.NORMAL_FORM, Keys.comms_training_details_communications, R.string.Training_Details_Form_Communications, R.drawable.training);

        private String name;
        private String endpoint;
        private FormSection formSection;

        private FormCategory formCategory;
        private String formShortName;
        private boolean isLocationDependent = false;
        private Method method = Method.POST;
        private int description;
        private int imageID;


        Forms(String name, String endpoint, FormCategory formCategory, FormSection formSection, int descriptionID, int imageID) {
            this.name = name;
            this.endpoint = endpoint;
            this.formCategory = formCategory;
            this.formSection = formSection;
            this.description = descriptionID;
            this.imageID = imageID;
        }


        Forms(String name, String endpoint, FormSection formSection, FormCategory formCategory, String formShortName, int descriptionID, int imageID) {
            this.name = name;
            this.endpoint = endpoint;
            this.formSection = formSection;
            this.formCategory = formCategory;
            this.formShortName = formShortName;
            this.description = descriptionID;
            this.imageID = imageID;
        }

        Forms(String name, String endpoint, FormSection formSection, FormCategory formCategory, String formShortName, boolean isLocationDependent, int descriptionID, int imageID) {
            this.name = name;
            this.endpoint = endpoint;
            this.formSection = formSection;
            this.formCategory = formCategory;
            this.formShortName = formShortName;
            this.isLocationDependent = isLocationDependent;
            this.description = descriptionID;
            this.imageID = imageID;

        }

        Forms(String name, String endpoint, FormCategory formCategory, FormSection formSection, boolean isLocationDependent, int descriptionID, int imageID) {
            this.name = name;
            this.endpoint = endpoint;
            this.formCategory = formCategory;
            this.formSection = formSection;
            this.isLocationDependent = isLocationDependent;
            this.description = descriptionID;
            this.imageID = imageID;
        }

        public String getName() {
            return name;
        }

        public int getDescription() {
            return description;
        }

        public int getImageID() {
            return imageID;
        }


        public FormSection getFormSection() {
            return formSection;
        }

        public String getEndpoint() {
            return endpoint;
        }

        public Method getMethod() {
            return method;
        }

        public FormCategory getFormCategory() {
            return formCategory;
        }

        public String getFormShortName() {
            return formShortName;
        }

        public boolean isLocationDependent() {
            return isLocationDependent;
        }
    }

    public enum FormSection {
        LSE,
        SRHM,
        COMMS
    }

    public enum Method {
        POST,
        PUT,
        GET,
        DELETE
    }

    public enum DateType {
        START,
        END;
    }

    public enum IDType {
        DONOR_ID,
        SCHOOL_ID,
        PARENT_LOCATION_ID,
        PARTICIPANT_ID,
        INSTITUTE_ID,
        PROJECT_ID
    }

    /*it may needed in future if we filter forms on priviliges based*/
    public enum FormCategory {
        LOCATION("Add Location"),
        DONOR("Add Donor"),
        PROJECT("Add Project"),
        PARTICIPANT("Add People", "Add LSE Participant", "Add SRHM Participant"),
        NORMAL_FORM("Add FormData", "Add Comms Forms", "Add LSE Forms", "Add SRHM Forms");

        private List<String> privilege;

        FormCategory(String... privilege) {
            this.privilege = Arrays.asList(privilege);
        }

        public List<String> getPrivilege() {
            return privilege;
        }
    }

    public List<Widget> getWidgets() {
        List<Widget> widgets = null;
        switch (details.getForms()) {
            case ParentOrganizationRegistrationLSE:
            case ParentOrganizationRegistrationSRHM:
                widgets = getParentOrganizationWidgets();
                break;
            case DonorDetail:
            case DonorDetailSRHM:
                widgets = getDonorDetailWidgets();
                break;
            case ProjectDetail:
            case ProjectDetailSRHM:
                widgets = getProjectWidgets();
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

    //LSE

    private List<Widget> getTrainingDetailsWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));

        widgets.add(new SpinnerWidget(context, Keys.VENUE, "Training Venue", true, getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.training_venue)))));

        widgets.add(new SpinnerWidget(context, Keys.TRAINING_TYPE, "Type of training", true, getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.training_type)))));

        RadioWidget programLevel = new RadioWidget(context, Keys.LEVEL_OF_PROGRAM, "Level of school(s) being trained", true, getDefinitions(Keys.LEVEL_OF_PROGRAM));
        widgets.add(programLevel);

        RadioWidget program = new RadioWidget(context, Keys.TYPE_OF_PROGRAM, "Type of program(s) implement in school", true, getDefinitions(Keys.TYPE_OF_PROGRAM));

        RadioSwitcher switcher = new RadioSwitcher(program);
        switcher.add("Secondary", "LSBE");
        programLevel.setWidgetSwitchListener(switcher);
        widgets.add(program);

        UserWidget trainers = new UserWidget(context, Keys.TRAINER, Keys.USER_ID, "Name(s) of Trainer(s)").enableStringJson();
        widgets.add(trainers);
        dataRepository.getUsersByRole(trainers, getRoleByName(Keys.ROLE_LSE_TRAINER));


        widgets.add(new EditTextWidget.Builder(context, Keys.DAYS_QUANTITY, "Number of Days", InputType.TYPE_CLASS_NUMBER, TWO, true).setInputRange(1, 15).setMinimumValue(ONE).build());

        UserWidget schools = new UserWidget(context, Keys.SCHOOLS, Keys.LOCATION_ID, "Name(s) of School(s)").enableStringJson();
        widgets.add(schools);
        dataRepository.getSchools(schools);

        UserWidget participants = new UserWidget(context, Keys.PARTICPANTS, "Participant(s)", new ArrayList<BaseItem>()).enableParticipants(FormSection.LSE).enableStringJson();
        widgets.add(participants);
        schools.setListItemListener(new ParticipantUpdateListener(participants));

        return widgets;
    }

    private List<Widget> getStakeHolderTrainingWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));

        widgets.add(new EditTextWidget.Builder(context, Keys.MEETING_VENUE, "Meeting Venue", InputType.TYPE_CLASS_TEXT, TWO_HUNDRED, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_ADDRESS_CHARACTER_SET)).build());

        UserWidget staffMembers = new UserWidget(context, Keys.STAFF_MEMBERS, Keys.USER_ID, "Aahung Staff Members").enableStringJson();
        widgets.add(staffMembers);
        dataRepository.getUsers(staffMembers);

        MultiSelectWidget participantType = new MultiSelectWidget(context, Keys.EVENT_ATTENDANT, LinearLayout.VERTICAL, "Type of Participants", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.participants_stakeholder))), true);
        widgets.add(participantType);

        ToggleWidgetData participantToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData participantSkipper = participantToggler.addOption("Government");
        widgets.add(participantSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.QUANTITY_GOVERNMENT, "Number of Government", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView()));
        participantSkipper.build();

        participantSkipper = participantToggler.addOption("Policy Makers");
        widgets.add(participantSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.QUANTITY_POLICY, "Number of Policy Maker", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView()));
        participantSkipper.build();

        participantSkipper = participantToggler.addOption("TAC");
        widgets.add(participantSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.QUANTITY_TAC, "Number of TAC", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView()));
        participantSkipper.build();

        participantSkipper = participantToggler.addOption("NGOs");
        widgets.add(participantSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.QUANTITY_NGO, "Number of NGOs", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView()));
        participantSkipper.build();

        participantSkipper = participantToggler.addOption("School Partners");
        widgets.add(participantSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.QUANTITY_SCHOOL_PARTNER, "Number of School Partners", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView()));
        participantSkipper.build();

        participantSkipper = participantToggler.addOption("Other");
        widgets.add(participantSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_PARTICIPANTS, "Specify Other", InputType.TYPE_CLASS_TEXT, TWO_HUNDRED, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build().hideView()));
        widgets.add(participantSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_ATTENDANT_COUNT, "Number of Other", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView()));
        participantSkipper.build();

        participantType.addDependentWidgets(participantToggler.getToggleMap());

        widgets.add(new EditTextWidget.Builder(context, Keys.MEETING_PURPOSE, "Purpose of Meeting", InputType.TYPE_CLASS_TEXT, FOUR_HUNDRED, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build());

        SpinnerWidget topicsCovered = new SpinnerWidget(context, Keys.TOPICS_COVERED, "Topics Covered", true, getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.topics_stakeholder))));
        widgets.add(topicsCovered);

        ToggleWidgetData otherToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData otherSkipper = otherToggler.addOption("Other");
        widgets.add(otherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_SESSION, "Other", InputType.TYPE_CLASS_TEXT, TWO_HUNDRED, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build().hideView()));
        otherSkipper.build();
        topicsCovered.addDependentWidgets(otherToggler.getToggleMap());


        return widgets;
    }

    private List<Widget> getMasterEligibilityWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        ScoreWidget scoreWidget = new ScoreWidget(context, Keys.MASTER_TRAINER_ELIGIBILITY_SCORE, Keys.MASTER_TRAINER_ELIGIBILITY_SCORE_PCT).setLabel("Eligibility Score:", "Score %:");
        ScoreCalculator scoreCalculator = new ScoreCalculator(scoreWidget);

        UserWidget participants = new UserWidget(context, Keys.PARTICIPANT_ID, "Name of Candidate", new ArrayList<BaseItem>()).enableStringJson().enableSingleSelect();
        widgets.add(participants);
        dataRepository.getParticipant(participants, FormSection.LSE);

        widgets.add(new MultiSelectWidget(context, Keys.CANDIDATE_PROGRAM_TRAINING, LinearLayout.VERTICAL, "Aahung program candidate has been trained on", getDefinitions(Keys.CANDIDATE_PROGRAM_TRAINING), true)); /*getDefinitionsByName(Arrays.asList(new String[]{"csa", "lsbe"}))*/
        widgets.add(new RadioWidget(context, Keys.MASTER_TRAINER_NOMINATED, "Aahung program candidate is being nominated as Master Trainer for", true, getDefinitions(Keys.MASTER_TRAINER_NOMINATED)));

        UserWidget evaluatedBy = new UserWidget(context, Keys.EVALUATED_BY, "Evaluated By", new ArrayList<BaseItem>()).enableStringJson();
        widgets.add(evaluatedBy);
        dataRepository.getUsers(evaluatedBy);

        widgets.add(new RadioWidget(context, Keys.CANDIDATE_WILLING, "Candidate is willing to become a Master Trainer for this school", true, "Yes", "No").setScoreListener(scoreCalculator).addHeader("Eligibility Criteria"));
        widgets.add(new RadioWidget(context, Keys.CANDIDATE_WORKING_YEAR, "Candidate is likely to continue working at this school for the next 2-4 years", true, "Yes", "No").setScoreListener(scoreCalculator));
        widgets.add(new RadioWidget(context, Keys.CANDIDATE_TWO_YEAR, "Candidate is trained in Aahung’s CSA/LSBE program and has been teaching the course for at least 2 years in school", true, "Yes", "No").setScoreListener(scoreCalculator));
        widgets.add(new RadioWidget(context, Keys.CANDIDATE_INTEREST, "Candidate demonstrates a strong interest in leading and sustaining the CSA/LSBE program in this school through their dedication in teaching this program", true, "Yes", "No").setScoreListener(scoreCalculator));
        widgets.add(new RadioWidget(context, Keys.CANDIDATE_LEADERSHIP, "Candidate possesses strong leadership skills and has the ability to work in a team", true, "Yes", "No").setScoreListener(scoreCalculator));
        widgets.add(new RadioWidget(context, Keys.CANDIDATE_CAPABLE_REPLICATING, "Candidate is capable of replicating Aahung’s 6 day CSA/LSBE training with other teachers in this school", true, "Yes", "No").setScoreListener(scoreCalculator));
        widgets.add(new RadioWidget(context, Keys.CANDIDATE_CAPABLE_CONDUCTING, "Candidate is capable of conducting regular parent and teacher sensitization sessions related to Aahung’s CSA/LSBE program", true, "Yes", "No").setScoreListener(scoreCalculator));

        widgets.add(scoreWidget);
        widgets.add(new RadioWidget(context, Keys.FINAL_DECISION, "Final Decision - Selected as Master Trainer?", true, getDefinitions(Keys.FINAL_DECISION)));

        return widgets;
    }

    private List<Widget> getParentSessionForm() {
        List<Widget> widgets = new ArrayList<>();
        ScoreWidget scoreWidget = new ScoreWidget(context, Keys.PARENT_SESSION_SCORE, Keys.PARENT_SESSION_SCORE_PCT);
        ScoreCalculator scoreCalculator = new ScoreCalculator(scoreWidget);
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        UserWidget userWidget = new UserWidget(context, Keys.MONITOR, Keys.USER_ID, "Monitored By").enableStringJson();
        widgets.add(userWidget);
        dataRepository.getUsersByRole(userWidget, getRoleByName(Keys.ROLE_LSE_MONITOR));

        DataUpdater dataUpdater = new DataUpdater(context, database.getMetadataDao());
        FormUpdateListener formUpdateListener = new FormUpdateListener(dataUpdater, IDType.SCHOOL_ID);
        TextWidget sexSchool = new TextWidget(context, getLocationAttribute(Keys.school_sex), "Classification of School by Sex");
        widgets.add(dataUpdater.add(sexSchool));

        formUpdateListener.onItemAdded(GlobalConstants.selectedSchool.getShortName());

        RadioWidget parentSession = new RadioWidget(context, Keys.PARENTS_SESSION, "Does this school conduct parent sessions?", true, "Yes", "No");
        widgets.add(parentSession.setScoreListener(scoreCalculator).addHeader("Parent Sessions"));
        ToggleWidgetData sessionToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData sessionSkipper = sessionToggler.addOption("Yes");
        widgets.add(sessionSkipper.addWidgetToToggle(new RateWidget(context, Keys.MANAGEMENT_SESSION, "School Management is active in organizing parent sessions for parents of primary students", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(sessionSkipper.addWidgetToToggle(new DateWidget(context, Keys.SESSION_LAST_DATE, "Date of last parent session", true)).hideView());
        widgets.add(sessionSkipper.addWidgetToToggle(new LabeledEditTextWidget.Builder(context, Keys.SESSION_QUANTITY, "Number of parent sessions held since beginning of school year", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        widgets.add(sessionSkipper.addWidgetToToggle(new LabeledEditTextWidget.Builder(context, Keys.AVERAGE_PARTICIPANTS, "Average number of participants in sessions", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());

        RadioWidget parentGender = new RadioWidget(context, Keys.PARENTS_ATTEND_SESSION, "Which parent(s) attends the session?", true, getDefinitions(Keys.PARENTS_ATTEND_SESSION));
        widgets.add(sessionSkipper.addWidgetToToggle(parentGender.hideView()));

        MultiSwitcher sessionSwitcher = new MultiSwitcher(parentGender, parentSession);

        RadioWidget sessionOrganized = new RadioWidget(context, Keys.SESSION_ORGANIZED, "How are the sessions organized?", true, getDefinitions(Keys.SESSION_ORGANIZED));
        widgets.add(sessionOrganized.hideView());

        sessionSwitcher.addNewOption().addKeys("Yes", "Both").addWidget(sessionOrganized).build();
        parentGender.setMultiSwitchListenerList(sessionSwitcher);
        parentSession.setMultiSwitchListenerList(sessionSwitcher);

        widgets.add(sessionSkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.FACILITATOR, LinearLayout.VERTICAL, "Facilitator", getDefinitions(Keys.FACILITATOR), true)).hideView());
        MultiSelectWidget topicCovered = new MultiSelectWidget(context, Keys.SESSION_TOPICS_PREVIOUS, LinearLayout.VERTICAL, "Topics covered in previous sessions", getDefinitions(Keys.SESSION_TOPICS_PREVIOUS), true); /*, context.getResources().getStringArray(R.array.session_topics)*/
        widgets.add(sessionSkipper.addWidgetToToggle(topicCovered.hideView()));

        Widget other = new EditTextWidget.Builder(context, Keys.OTHER_TOPIC_COVERED, "Other", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build();
        widgets.add(other.hideView());

        MultiSwitcher otherSwitcher = new MultiSwitcher(topicCovered, parentSession);
        otherSwitcher.addNewOption().addKeys("Yes", "Other").addWidgets(other).build();
        parentSession.setMultiSwitchListenerList(otherSwitcher);
        topicCovered.setMultiWidgetSwitchListener(otherSwitcher);

        RadioWidget sessionPlanned = new RadioWidget(context, Keys.SESSION_PLANNED, "Is the next parent session planned?", true, "Yes", "No");
        widgets.add(sessionSkipper.addWidgetToToggle(sessionPlanned.setScoreListener(scoreCalculator)).hideView());
        sessionSwitcher = new MultiSwitcher(sessionPlanned, parentSession);

        DateWidget nextSessionDate = new DateWidget(context, Keys.DATE_NEXT_SESSION, "Date of next session", true).enableFutureDates();
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

        widgets.add(new EditTextWidget.Builder(context, Keys.INSTITUTION_SESSION_CONDUCT, "Name of Institution", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, HUNDRED, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());

        UserWidget userWidget = new UserWidget(context, Keys.TRAINER, Keys.USER_ID, "Name(s) of Trainer").enableStringJson();
        widgets.add(userWidget);
        dataRepository.getUsersByRole(userWidget, getRoleByName(Keys.ROLE_LSE_TRAINER));

        final RadioWidget sessionType = new RadioWidget(context, Keys.SESSION_TYPE, "Type of session", true, getDefinitionsByName(Arrays.asList(new String[]{"puberty", "csa", "lsbe", "other"})));
        widgets.add(sessionType);

        ToggleWidgetData otherToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData otherSkipper = otherToggler.addOption("Other");
        widgets.add(otherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_SESSION, "Other", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        otherSkipper.build();
        sessionType.addDependentWidgets(otherToggler.getToggleMap());

        MultiSelectWidget sexOfParticipant = new MultiSelectWidget(context, Keys.PARTICIPANTS_SEX, LinearLayout.HORIZONTAL, "Sex of Participants", getDefinitions(Keys.PARTICIPANTS_SEX), true);
        widgets.add(sexOfParticipant);
        ToggleWidgetData sexOfParticipantToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData participantsOtherSkipper = sexOfParticipantToggler.addOption("Other");
        widgets.add(participantsOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_SEX_QUANTITY_OTHER, "Number of Other", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        participantsOtherSkipper.build();

        ToggleWidgetData.SkipData participantsMaleSkipper = sexOfParticipantToggler.addOption("Male");
        widgets.add(participantsMaleSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_MALE, "Number of Males", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        participantsMaleSkipper.build();

        ToggleWidgetData.SkipData participantsFemaleSkipper = sexOfParticipantToggler.addOption("Female");
        widgets.add(participantsFemaleSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_FEMALE, "Number of Females", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        participantsFemaleSkipper.build();

        sexOfParticipant.addDependentWidgets(sexOfParticipantToggler.getToggleMap());


        widgets.add(new MultiSelectWidget(context, Keys.PARTICIPANTS_AGE_GROUP, LinearLayout.VERTICAL, "Participant Age Group", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.age_group_one_touch))), true));
        MultiSelectWidget participantType = new MultiSelectWidget(context, Keys.PARTICIPANTS_TYPE, LinearLayout.VERTICAL, "Type of Participants", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.one_touch_topics))), true);
        widgets.add(participantType);

        ToggleWidgetData participantToggler = new ToggleWidgetData();


        ToggleWidgetData.SkipData participantrSkipper = participantToggler.addOption("Students");
        widgets.add(participantrSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.QUANTITY_STUDENTS, "Number of Students", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        participantrSkipper.build();

        participantrSkipper = participantToggler.addOption("Parents");
        widgets.add(participantrSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.QUANTITY_PARENTS, "Number of Parents", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        participantrSkipper.build();

        participantrSkipper = participantToggler.addOption("Teachers");
        widgets.add(participantrSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.QUANTITY_TEACHER, "Number of Teachers", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        participantrSkipper.build();

        participantrSkipper = participantToggler.addOption("School Staff");
        widgets.add(participantrSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.QUANTITY_SCHOOL_STAFF, "Number of School Staff", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        participantrSkipper.build();

        participantrSkipper = participantToggler.addOption("Call Agents");
        widgets.add(participantrSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.QUANTITY_CALL_AGENT, "Number of Call Agents", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        participantrSkipper.build();

        participantrSkipper = participantToggler.addOption("Other Professionals");
        widgets.add(participantrSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.QUANTITY_OTHER_PRO, "Number of Other Professionals", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        participantrSkipper.build();


        participantrSkipper = participantToggler.addOption("Other");
        widgets.add(participantrSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_PARTICIPANTS, "Specify Other", InputType.TYPE_CLASS_TEXT, TWO_HUNDRED, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        widgets.add(participantrSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_ATTEDANT_OTHER, "Number of Other", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        participantrSkipper.build();


        participantType.addDependentWidgets(participantToggler.getToggleMap());

        widgets.add(new EditTextWidget.Builder(context, Keys.DAYS_QUANTITY, "Number of Days", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).setInputRange(1, 999999).build());
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

        UserWidget userWidget = new UserWidget(context, Keys.MONITOR, Keys.USER_ID, "Monitored By").enableStringJson();
        widgets.add(userWidget);
        dataRepository.getUsersByRole(userWidget, getRoleByName(Keys.ROLE_LSE_MONITOR));

        RadioWidget programLevel = new RadioWidget(context, Keys.LEVEL_OF_PROGRAM, "Level of Program", true, getDefinitions(Keys.LEVEL_OF_PROGRAM));
        widgets.add(programLevel);


        final RadioWidget programType = new RadioWidget(context, Keys.PROGRAM_TYPE, "Type of Program", true, getDefinitionsByName(Arrays.asList(new String[]{"csa", "lsbe"})));

        RadioSwitcher switcher = new RadioSwitcher(programType);
        switcher.add("Secondary", "LSBE");
        programLevel.setWidgetSwitchListener(switcher);
        widgets.add(programType);

        ToggleWidgetData programToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData csaSkipper = programToggler.addOption("CSA");
        ScoreWidget scoreWidget = new ScoreWidget(context, Keys.STEP_DOWN_TRAINING_SCORE, Keys.STEP_DOWN_TRAINING_SCORE_PCT);
        ScoreCalculator scoreCalculator = new ScoreCalculator(scoreWidget);

        widgets.add(csaSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.MASTER_TRAINER_QUANTITY, "Total Number of Master Trainers", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView().addHeader("CSA Program"));

        UserWidget participants = new UserWidget(context, Keys.PARTICIPANT_ID, "Name(s) of Master Trainer", new ArrayList<BaseItem>()).enableSingleSelect().enableStringJson();
        widgets.add(csaSkipper.addWidgetToToggle(participants.hideView()));
        dataRepository.getParticipant(participants, FormSection.LSE);


        final MultiSelectWidget subjects = new MultiSelectWidget(context, Keys.MT_SUBJECT, LinearLayout.VERTICAL, "Subject Master Trainer is facilitating", getDefinitions(Keys.MT_SUBJECT), true); /*, context.getResources().getStringArray(R.array.facilities)*/
        widgets.add(csaSkipper.addWidgetToToggle(subjects).hideView());

        MultiSwitcher multiSwitcher = new MultiSwitcher(subjects, programType);

        final Widget masterTrainerSexualHealth = new RateWidget(context, Keys.MASTER_TRAINER_SEXUAL_HEALTH, "Master Trainer is able to accurately define sexual health", true).setScoreListener(scoreCalculator).hideView();
        widgets.add(masterTrainerSexualHealth);

        final Widget participatingDemo = new RateWidget(context, Keys.PARTICIPATING_DEMO, "Participants demonstrate an understanding of the three aspects of health and how they are interlinked", true).setScoreListener(scoreCalculator).hideView();
        widgets.add(participatingDemo);

        final Widget participatingSexGender = new RateWidget(context, Keys.PARTICIPATING_SEX_GENDER, "Participants demonstrate understanding of the difference between sex and gender", true).setScoreListener(scoreCalculator).hideView();
        widgets.add(participatingSexGender);

        final Widget participatingNorm = new RateWidget(context, Keys.PARTICIPATING_NORM, "Participants demonstrate understanding of gender norms and stereotypes and factors that regulate them", true).setScoreListener(scoreCalculator).hideView();
        widgets.add(participatingNorm);

        final Widget participatingCSA = new RateWidget(context, Keys.PARTICIPATING_UNDERSTAND_CSA, "Participants demonstrate understanding of the definition of CSA", true).setScoreListener(scoreCalculator).hideView();
        widgets.add(participatingCSA);

        final Widget participatingSign = new RateWidget(context, Keys.PARTICIPATING_SIGN, "Participants are able to accurately identify signs of CSA", true).setScoreListener(scoreCalculator).hideView();
        widgets.add(participatingSign);

        final Widget participatingPrevention = new RateWidget(context, Keys.PARTICIPATING_PREVENTION, "Participants are able to identify CSA prevention strategies", true).setScoreListener(scoreCalculator).hideView();
        widgets.add(participatingPrevention);

        final Widget masterTrainerMyth = new RateWidget(context, Keys.MASTER_TRAINER_MYTH, "Master Trainer accurately explains and dispels all myths associated with CSA", true).setScoreListener(scoreCalculator).hideView();
        widgets.add(masterTrainerMyth);

        final Widget masterTrainerAids = new RateWidget(context, Keys.MASTER_TRAINER_AIDS, "Master Trainer uses videos on CSA as aids in facilitation", true).setScoreListener(scoreCalculator).hideView();
        widgets.add(masterTrainerAids);

        final Widget masterTrainerBurgerMethod = new RateWidget(context, Keys.MASTER_TRAINER_CONSTRUCTIVE_FEEDBACK, "Master Trainer provides constructive feedback to participants after implementation of flashcards using the ‘Burger Method’", true).setScoreListener(scoreCalculator).hideView();
        widgets.add(masterTrainerBurgerMethod);

        multiSwitcher.addNewOption().addKeys("Health", "CSA").addWidgets(masterTrainerSexualHealth, participatingDemo).build();
        multiSwitcher.addNewOption().addKeys("Gender", "CSA").addWidgets(participatingSexGender, participatingNorm).build();
        multiSwitcher.addNewOption().addKeys("CSA", "CSA").addWidgets(participatingCSA, participatingSign, participatingPrevention, masterTrainerMyth, masterTrainerAids).build();
        multiSwitcher.addNewOption().addKeys("Implementation Feedback", "CSA").addWidgets(masterTrainerBurgerMethod).build();

        subjects.setMultiWidgetSwitchListener(multiSwitcher);
        programType.setMultiSwitchListenerList(multiSwitcher);

        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_PROMPT, "Master Trainer is actively using the training guide to aid in facilitation of content", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_GOOD_UNDERSTANDING, "Master Trainer demonstrates good understanding of the training content", true).setScoreListener(scoreCalculator)).hideView());
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
        ScoreWidget lsbeWidget = new ScoreWidget(context, Keys.STEP_DOWN_TRAINING_SCORE, Keys.STEP_DOWN_TRAINING_SCORE_PCT);
        ScoreCalculator lsbeScore = new ScoreCalculator(lsbeWidget);

        widgets.add(lsbeSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.LSBE_MASTER_TRAINER_QUANTITY, "Total Number of Master Trainers", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).addHeader("LSBE Program").hideView());

        UserWidget participantsLsbe = new UserWidget(context, Keys.PARTICIPANT_ID, "Name(s) of Master Trainer", new ArrayList<BaseItem>()).enableSingleSelect().enableStringJson();
        widgets.add(lsbeSkipper.addWidgetToToggle(participantsLsbe.hideView()));
        dataRepository.getParticipant(participantsLsbe, FormSection.LSE);

        final MultiSelectWidget lsbeSubjects = new MultiSelectWidget(context, Keys.MT_LSBE_SUBJECTS, LinearLayout.VERTICAL, "Subject Master Trainer is facilitating", getDefinitions(Keys.MT_LSBE_SUBJECTS), true); /*, context.getResources().getStringArray(R.array.facilities_lsbe)*/
        widgets.add(lsbeSkipper.addWidgetToToggle(lsbeSubjects).hideView());
        MultiSwitcher lsbeSwitcher = new MultiSwitcher(lsbeSubjects, programType);

        final Widget masterTrainerCrossLine = new RateWidget(context, Keys.MASTER_TRAINER_CROSSLINE, "Master Trainer correctly conducts the Cross the Line activity", true).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerCrossLine);

        final Widget masterTrainerValues = new RateWidget(context, Keys.MASTER_TRAINER_VALUES, "Master Trainer clearly defines values", true).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerValues);

        final Widget participantUnderstand = new RateWidget(context, Keys.PARTICIPANTS_UNDERSTAND, "Participants clearly understand the factors that regulate values", true).setScoreListener(lsbeScore).hideView();
        widgets.add(participantUnderstand);

        final Widget masterTrainerRights = new RateWidget(context, Keys.MASTER_TRAINER_RIGHTS, "Master trainer clearly describes human rights", true).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerRights);

        final Widget participantRights = new RateWidget(context, Keys.PARTICIPANTS_RIGHTS, "Participants demonstrate clear understanding of the impact of human rights violations", true).setScoreListener(lsbeScore).hideView();
        widgets.add(participantRights);

        final Widget masterTrainerSexGender = new RateWidget(context, Keys.MASTER_TRAINER_SEX_GENDER, "Master Trainer correctly differentiates between sex and gender", true).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerSexGender);

        final Widget participatingNormLSBE = new RateWidget(context, Keys.PARTICIPATING_GENDER_NORM, "Participants show clear understanding of gender norms and stereotypes", true).setScoreListener(lsbeScore).hideView();
        widgets.add(participatingNormLSBE);

        final Widget masterTrainerSexualHealthLSBE = new RateWidget(context, Keys.MASTER_TRAINER_SEXUAL_HEALTH, "Master Trainer is able to accurately define sexual health", true).setScoreListener(scoreCalculator).hideView();
        widgets.add(masterTrainerSexualHealthLSBE);

        final Widget participatingUnderstandHealth = new RateWidget(context, Keys.PARTICIPATING_UNDERSTAND_HEALTH, "Participants demonstrate an understanding of the three aspects of health and how they are interlinked", true).setScoreListener(lsbeScore).hideView();
        widgets.add(participatingUnderstandHealth);

        final Widget masterTrainerViolence = new RateWidget(context, Keys.MASTER_TRAINER_VIOLENCE, "Master Trainer has correctly described the different types of violence", true).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerViolence);

        final Widget masterTrainerViolenceImpact = new RateWidget(context, Keys.MASTER_TRAINER_VIOLENCE_IMPACT, "Master Trainer has effectively described the impact of violence on an individual’s life", true).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerViolenceImpact);

        final Widget masterTrainerPuberty = new RateWidget(context, Keys.MASTER_TRAINER_PUBERTY, "Master Trainer was able to clearly explain changes that occur during puberty for boys and girls", true).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerPuberty);

        final Widget masterTrainerPubertyMyth = new RateWidget(context, Keys.MASTER_TRAINER_PUBERTY_MYTH, "Master Trainer has clearly explained and dispelled myths related to puberty in both boys and girls", true).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerPubertyMyth);

        final Widget masterTrainerBurgerMethodLSBE = new RateWidget(context, Keys.MASTER_TRAINER_BURGER, "Master Trainer provides constructive feedback to participants after implementation of flashcards using the ‘Burger Method’", true).setScoreListener(lsbeScore).hideView();
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

        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_LSBE_PROMPTS, "Master Trainer is actively using the training guide to aid in facilitation of content", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_GOOD_LSBE_UNDERSTANDING, "Master Trainer demonstrates good understanding of the training content", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_LSBE_MATERIAL, "Master Trainer had all materials prepared in advance for the session", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_LBSE_WELL_PREPARED, "Master Trainer was well prepared in their facilitation of the content", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_LBSE_ALLOTED_TIME, "An appropriate amount of time is allotted to each activity and topic", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_LSBE_COMFORTABLE_SPEAKING, "Master Trainer is comfortable speaking about this subject", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_LSBE_JUDGEMENTAL_TONE, "Master Trainer uses a non-judgmental tone while facilitating the session", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_LSBE_OWN_OPINIONS, "Master Trainer does not impose their own values or opinion on the participants", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_LSBE_PROBES, "Master Trainer is engaging participants in discussion throughout session by providing probes", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.PARTICIPANTS_LSBE_DISCUSSION, "Participants are actively participating in discussion", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.PARTICIPANTS_LSBE_ATTENTION, "Participants are actively paying attention to the session while the Master Trainer is instructing", true).setScoreListener(lsbeScore)).hideView());
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

        UserWidget monitored = new UserWidget(context, Keys.MONITORED_BY, Keys.USER_ID, "Monitored By").enableStringJson();
        widgets.add(monitored);
        dataRepository.getUsersByRole(monitored, getRoleByName(Keys.ROLE_LSE_MONITOR));

        UserWidget participant = new UserWidget(context, Keys.PARTICIPANT_ID, "Name of Teacher", new ArrayList<BaseItem>()).enableSingleSelect().enableStringJson();
        widgets.add(participant);
        dataRepository.getParticipant(participant, FormSection.LSE);
        dataRepository.getParticipant(participant, FormSection.LSE);

        RadioWidget programLevel = new RadioWidget(context, Keys.LEVEL_OF_PROGRAM, "Level of Program", true, getDefinitions(Keys.LEVEL_OF_PROGRAM));
        widgets.add(programLevel);

        final RadioWidget programType = new RadioWidget(context, Keys.TYPE_OF_PROGRAM, "Type of program being evaluated", true, getDefinitionsByName(Arrays.asList(new String[]{"csa", "lsbe"})));

        RadioSwitcher programSwitcher = new RadioSwitcher(programType);
        programSwitcher.add("Secondary", "LSBE");
        programLevel.setWidgetSwitchListener(programSwitcher);
        widgets.add(programType);


        ToggleWidgetData programToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData csaSkipper = programToggler.addOption("CSA");
        ScoreWidget scoreWidget = new ScoreWidget(context, Keys.MT_MOCK_SCORE, Keys.MT_MOCK_SCORE_PCT).setLabel("MT Mock Session Score:", "% Score");
        ScoreCalculator scoreCalculator = new ScoreCalculator(scoreWidget);

        widgets.add(csaSkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.CSA_FLASHCARD, LinearLayout.VERTICAL, "CSA Flashcard being run", getDefinitions(Keys.CSA_FLASHCARD), true).addHeader("CSA Program").hideView()));/*, context.getResources().getStringArray(R.array.csa_flashcard)*/
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
        final RadioWidget lsbeLevel = new RadioWidget(context, Keys.LSBE_LEVEL, "Level Master Trainer is facilitating", true, getDefinitions(Keys.LSBE_LEVEL));
        final MultiSwitcher multiSwitcher = new MultiSwitcher(programType, lsbeLevel);

        widgets.add(lsbeSkipper.addWidgetToToggle(lsbeLevel.addHeader("LSBE Program")).hideView());

        final SpinnerWidget levelOneSubject = new SpinnerWidget(context, Keys.LEVEL_ONE_COURSE, "Subject Master Trainer is facilitating", true, getDefinitions(Keys.LEVEL_ONE_COURSE));/*Arrays.asList(context.getResources().getStringArray(R.array.lsbe_level_1_subject)*/
        final SpinnerWidget levelTwoSubject = new SpinnerWidget(context, Keys.LEVEL_TWO_COURSE, "Subject Master Trainer is facilitating", true, getDefinitions(Keys.LEVEL_TWO_COURSE)); /*Arrays.asList(context.getResources().getStringArray(R.array.lsbe_level_2_subject))*/
        multiSwitcher.addNewOption().addKeys("LSBE", "Level 1").addWidget(levelOneSubject).build();
        multiSwitcher.addNewOption().addKeys("LSBE", "Level 2").addWidget(levelTwoSubject).build();
        widgets.add(levelOneSubject.hideView());
        widgets.add(levelTwoSubject.hideView());
        lsbeLevel.setMultiSwitchListenerList(multiSwitcher);
        programType.setMultiSwitchListenerList(multiSwitcher);


        final MultiSwitcher lsbeSwitcher = new MultiSwitcher(programType, lsbeLevel, levelOneSubject);
        final ScoreWidget lsbeScoreWidget = new ScoreWidget(context, Keys.MT_MOCK_SCORE, Keys.MT_MOCK_SCORE_PCT);
        final ScoreCalculator lsbeScore = new ScoreCalculator(lsbeScoreWidget);

        final Widget masterTrainerCommunication = new RateWidget(context, Keys.MASTER_TRAINER_COMMUNICATION, "Master Trainer was able to effectively relay the importance of communication", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerCommunication);

        final Widget masterTrainerValues = new RateWidget(context, Keys.TRAINER_VALUES, "Master Trainer was able to effectively define values", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerValues);

        final Widget masterTrainerGender = new RateWidget(context, Keys.MASTER_TRAINER_GENDER, "Master Trainer was able to correctly differentiate between sex and gender", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerGender);

        final Widget masterTrainerSelfProtection = new RateWidget(context, Keys.MASTER_TRAINER_SELF_PROTECTION, "Master Trainer was able to correctly explain methods of self-protection", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerSelfProtection);

        final Widget masterTrainerPeerPressure = new RateWidget(context, Keys.MASTER_TRAINER_PEER_PRESSURE, "Master Trainer was able to correctly explain peer pressure and its impacts", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerPeerPressure);

        final Widget masterTrainerPuberty = new RateWidget(context, Keys.TRAINER_PUBERTY, "Master Trainer was able to clearly explain changes that occur during puberty for boys and girls", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerPuberty);

        final Widget masterTrainerSexDiff = new RateWidget(context, Keys.TRAINER_SEX_DIFF, "Master Trainer was able to correctly differentiate between sex and gender", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerSexDiff);


        final Widget masterTrainerDescribeComm = new RateWidget(context, Keys.MASTER_TRAINER_DESCRIBE_COMM, "Master Trainer has effectively described the different components of communication and their importance", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerDescribeComm);

        final Widget masterTrainerGenderNorms = new RateWidget(context, Keys.MASTER_TRAINER_GENDER_NORMS, "Master Trainer has clearly explained gender norms and stereotypes and their impact", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerGenderNorms);

        final Widget masterTrainerGenderDiscrimination = new RateWidget(context, Keys.MASTER_TRAINER_GENDER_DISC, "Master Trainer has accurately described gender discrimination and its impact", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerGenderDiscrimination);

        final Widget masterTrainerPubertyLevelTwo = new RateWidget(context, Keys.TRAINER_PUBERTY_TWO, "Master Trainer was able to clearly explain changes that occur during puberty for boys and girls", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerPubertyLevelTwo);


        final Widget masterTrainerPubertyMyth = new RateWidget(context, Keys.MASTER_TRAINER_PUBERTY_MYTH_TWO, "Master Trainer has clearly explained and dispelled myths related to puberty in both boys and girls", false).setScoreListener(lsbeScore).hideView();
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

        final Widget masterTrainerViolence = new RateWidget(context, Keys.MASTER_TRAINER_VIOLENCE_TWO, "Master Trainer has correctly described the different types of violence", false).setScoreListener(lsbeScore).hideView();
        widgets.add(masterTrainerViolence);

        final Widget masterTrainerViolenceImpact = new RateWidget(context, Keys.MASTER_TRAINER_VIOLENCE_IMPACT_TWO, "Master Trainer has effectively described the impact of violence on an individual’s life", false).setScoreListener(lsbeScore).hideView();
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
        levelTwoSwitcher.addNewOption().addKeys("LSBE", "Level 2", "Gender").addWidgets(masterTrainerSexDiff, masterTrainerGenderNorms, masterTrainerGenderDiscrimination).build();
        levelTwoSwitcher.addNewOption().addKeys("LSBE", "Level 2", "Puberty").addWidgets(masterTrainerPubertyLevelTwo, masterTrainerPubertyMyth).build();
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
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_LSBE_ALLOTED_TIME, "An appropriate amount of time is allotted to each activity and topic", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_LSBE_COMFORTABLE_SPEAKING, "Master Trainer is comfortable speaking about this subject", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_LSBE_JUDGEMENTAL_TONE, "Master Trainer uses a non-judgmental tone while facilitating the session", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_LSBE_OWN_OPINIONS, "Master Trainer does not impose their own values or opinion on the participants", true).setScoreListener(lsbeScore)).hideView());
        widgets.add(lsbeSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_LSBE_PROMPTS, "Master Trainer is engaging participants in discussion throughout session by providing probes", true).setScoreListener(lsbeScore)).hideView());

        widgets.add(lsbeSkipper.addWidgetToToggle(lsbeScoreWidget.hideView()));
        lsbeSkipper.build();
        programType.addDependentWidgets(programToggler.getToggleMap());
        return widgets;
    }

    private List<Widget> getSRHRPolicyWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        UserWidget userWidget = new UserWidget(context, Keys.MONITOR, "Monitored By", new ArrayList<BaseItem>()).enableStringJson();
        widgets.add(userWidget);
        dataRepository.getUsersByRole(userWidget, getRoleByName(Keys.ROLE_LSE_MONITOR));

        DataUpdater dataUpdater = new DataUpdater(context, database.getMetadataDao());
        FormUpdateListener updateListener = new FormUpdateListener(dataUpdater, IDType.SCHOOL_ID);


        widgets.add(dataUpdater.add(new TextWidget(context, getLocationAttribute(Keys.school_level), "Level of Program").enabledViewOnly()));
        widgets.add(dataUpdater.add(new TextWidget(context, getLocationAttribute(Keys.program_implemented), "Type of program(s) implemented in school").enabledViewOnly()));
        widgets.add(dataUpdater.add(new TextWidget(context, getLocationAttribute(Keys.school_tier), "School Tier").enabledViewOnly()));
        TextWidget schoolClassification = new TextWidget(context, getLocationAttribute(Keys.school_sex), "Classification of School by Sex").enabledViewOnly();
        widgets.add(dataUpdater.add(schoolClassification));

        updateListener.onItemAdded(GlobalConstants.selectedSchool.getShortName());

        ToggleWidgetData policyToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData policySkipper = policyToggler.addOption("Yes");

        ScoreWidget scoreWidget = new ScoreWidget(context, Keys.MONITORING_SCORE, Keys.MONITORING_SCORE_PCT);
        ScoreCalculator scoreCalculator = new ScoreCalculator(scoreWidget);

        RadioWidget policy = new RadioWidget(context, Keys.POLICY, "Has this school implemented the SRHR Policy Guildelines?", true, "Yes", "No");
        widgets.add(policy.setScoreListener(scoreCalculator).addHeader("SRHR Policy"));

        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.EDU_RESOURCE_AWARENESS, "Student are aware of which teachers are trained on SRHR and are available for support", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.student_awareness))).setScoreListener(scoreCalculator).addHeader("1. Promotion of SRH Education in Schools").hideView()));
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.EDU_TEACHING_SAFE_SPACE, "School Management has created a safe and secure space where teachers trained on SRHR are able to teach and counsel students on SRHR issues", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.TRAINING_INITIATIVE_MGMT, "School Management takes the initiative to organize capacity building training sessions for teachers on a need basis", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.IEC_MATERIAL_ACCESS, "Students have access to SRHR IEC materials within the school vicinity", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_NEUTRAL, "School encourages all students of all genders to be involved in extracurricular activities, such as sports and arts", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.PARENT_INVOLVEMENT, "School Management involves parents in the SRHR programs through various activities throughout the school year", true).setScoreListener(scoreCalculator).addHeader("2. Parental Involvement to Strengthen SRH Education Programs in Schools")).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.PARENT_SENSITIZATION, "Parents are sensitized on the SRHR curriculum and implementation of SRHR policies on an annual basis", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.PARENT_CHILD_UPDATE, "Parents are updated on their child's progress regarding the SRHR classes during parent teacher meetings", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.PARENT_GROUP_ENCOURAGEMENT, "School Management and teachers encourage the formation and role of parent groups in school and support them in their initiatives", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.COUNSELLING_SERVICES, "Safe and secure spaces are available in the school where counseling can take palce", true, "Yes", "No").setScoreListener(scoreCalculator).addHeader("3. Provision of Psychosocial Services to Address Student's SRHR and Other Issues")).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.CERTIFIED_COUNSELLOR, "Counselors at this school are trained and certified by a reputable organization", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.STUDENT_COUNSELLING_SERVICES_AWARENESS, "Students are aware of the counseling services offered", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.GUIDE_USAGE, "School Management and counselors use the Referral Guide provided by Aahung when needed", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator).hideView()));
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.COUNSELLING_URGENT_CASE_REPORTED, "Counselors inform management about any cases that require urgent attention", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator).hideView()));
        widgets.add(policySkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.FIRST_AID_KIT, LinearLayout.VERTICAL, "This school has a proper First Aid Kit that includes the following", getDefinitions(Keys.FIRST_AID_KIT), true).setScoreListener(scoreCalculator)).addHeader("4. Provision of First Aid Management").hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.FIRST_AID_FOCAL_PERSON, "There is a focal person for medical care who has First Aid training and is responsible for the First Aid kit", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.FIRST_AID_KIT_REFILL, "The First Aid kit is checked on a monthly basis and refilled regularly", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.FIRST_AID_URGENT_CASE_REPORTED, "The focal person for medical care informs management about any cases that require urgent attention", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator)).hideView());

        Widget mhmKitAvailable = new RadioWidget(context, Keys.MHM_KIT, "The school has a menstrual hygiene management(MHM) kit readily available for students and teachers that include necessary items such as soap, pads and underwear", true, "Yes", "No").setScoreListener(scoreCalculator);
        Widget personForKit = new RadioWidget(context, Keys.MHM_FOCAL_PERSON, "There is a focal person who oversees the maintenance of the MHM kit", true, "Yes", "No").setScoreListener(scoreCalculator);
        Widget kitChecked = new RadioWidget(context, Keys.MHM_KIT_REFILL, "The MHM kit is checked on a monthly basis and is regularly refilled", true, "Yes", "No").setScoreListener(scoreCalculator);

        MultiSwitcher multiSwitcher = new MultiSwitcher(schoolClassification, policy);
        multiSwitcher.addNewOption().addKeys("Yes", "Girls").addWidgets(mhmKitAvailable, personForKit, kitChecked).build();
        multiSwitcher.addNewOption().addKeys("Yes", "Co-ed").addWidgets(mhmKitAvailable, personForKit, kitChecked).build();
        widgets.add(mhmKitAvailable.addHeader("5. Improving Menstrual Hygiene Management in Schools").hideView());
        widgets.add(personForKit.hideView());
        widgets.add(kitChecked.hideView());

        schoolClassification.setMultiSwitchListenerList(multiSwitcher);
        policy.setMultiSwitchListenerList(multiSwitcher);

        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.CLEAN_DRINKING_WATER_ACCESS, "Teachers and students have access to clean drinking water", true, "Yes", "No").setScoreListener(scoreCalculator)).addHeader("6. Provision of Safe, Clean and Hygiene Food and Water Sanitation").hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.CLEAN_FOOD_SPACE_ACCESS, "Teacher and students have access to a hygienic space where food can be consumed", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.SANITATION_FACILITIES_ACCESS, "Teachers and students have easy access to safe, clean and hygienic sanitation facilities", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.TOILET_ASSIST_STAFF_TRAINED, "Support staff hired to assist primary school children with going to the toilet are trained on appropriate use of language and cleaning techniques", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.SEPARATE_TOILETS, "Toilets for boys and girls are separate", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.CLOSE_PROXIMITY_TOILETS, "Toilets are within close proximity to the classrooms", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.TOILET_PERMISSION_GIVEN, "Teachers allow students to go to the toilet when they request permission", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.WELL_EQUIPPED_TOILETS, "Toilets are well equipped with clean water, soap, tissue paper, toilet rolls and dust-bins", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.TOILET_ETIQUETTE_AWARENESS, "Students are well aware of proper toilet etiquette to improve hygienic practices, i.e. importance of hand washing, flushing, cleaning the toilet seat and not wasting water", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.TOILET_CLEANINESS, "Support staff cleans the toilets at least 2-3 times a day with antibacterial products", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.ZERO_TOLERANCE_POLICY_MAINTAINED, "School management maintains a zero tolerance policy for any teachers, students and staff that commit any of the following: discrimination; sexual harassment; verbal or physical abuse; use of alcohol or drugs on school premises; sharing confidential information of students; teachers or staff; using school premises for illegal activity; criminal activities, theft or fraud", true, "Yes", "No").setScoreListener(scoreCalculator)).addHeader("7. Zero Tolerance Policy").hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.APPROPRIATE_SECURITY_MEASURES, "The school management takes appropriate security measures (such as collecting their ID document) with all visitors entering the school premises", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator)).addHeader("8. Safety and Security").hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.PARENTS_GIVEN_SECURITY_UPDATE, "School management updates parents on security related policies and concerns that impact students", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RadioWidget(context, Keys.DEFINED_STUDENT_PICKUP, "School management is informed about the adult responsible for the pick/drop of student", true, "Yes", "No").setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.CORRECT_STUDENT_PICKUP_RELEASE, "Staff release students only to the aforementioned individuals", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.PARENTS_GUIDED_SECURITY_PRECAUTION, "Management guides parents on security precautions they should take to ensure the safety of their children when coming to/leaving school, i.e. have the van drivers' CNIC number and references, tell their child not to leave school premises alone or with someone they were not previously informed would be picking them up", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.STAFF_STUDENT_INTERACTION_CODE, "School management enforces stringent codes of conduct around staff and student interactions", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.OPEN_DOOR_POLICY, "An open door policy is implemented to ensure transparency and clear glass windows are installed in all classrooms and offices where possible", true).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.STUDENT_TEACHER_LOITERING_CHECK, "Management checks for teachers, staff and students roaming around the premises in and out of school hours", true).updateRatingMessage(Arrays.asList(context.getResources().getStringArray(R.array.rate_frequency))).setScoreListener(scoreCalculator)).hideView());
        widgets.add(policySkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_STAFF_STUDENT_BOUBDARIES, "Clear boundaries are enforced between teachers, staff and students - inappropriate body language, touch, or conversation are not acceptable", true).setScoreListener(scoreCalculator)).hideView());


        widgets.add(policySkipper.addWidgetToToggle(scoreWidget).hideView());

        policySkipper.build();
        policy.addDependentWidgets(policyToggler.getToggleMap());


        return widgets;
    }

    private List<Widget> getParentOrganizationWidgets() {
        List<Widget> widgets = new ArrayList<>();

        widgets.add(new DefinitionWidget(context, Keys.CATEGORY, getDefinitionByShortName(Keys.PARENT_OGRAGNIZATION).getDefinitionId().toString()));
        widgets.add(new DefinitionWidget(context, Keys.COUNTRY, PAKISTAN).disableChildObject());

        EditTextWidget parentOrganizationName = new EditTextWidget.Builder(context, Keys.LOCATION_NAME, "Parent Organization Name", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build();
        TextWidget parentOrganizationId = new TextWidget(context, Keys.SHORT_NAME, "Parent Organization ID");
        IDListener idListener = new IDListener(parentOrganizationId, IDType.PARENT_LOCATION_ID);
        parentOrganizationName.setWidgetIDListener(idListener);
        widgets.add(parentOrganizationName);
        widgets.add(parentOrganizationId);

        RadioWidget partnerType = new RadioWidget(context, getLocationAttribute(Keys.partner_components), "Partner with", true, getDefinitions(Keys.partner_components));
        widgets.add(partnerType.hideOptions(Keys.hr_finance, Keys.comms, Keys.RME));
        partnerType.setWidgetSwitchListener(idListener);

        ToggleWidgetData partnerToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData lseSkipper = partnerToggler.addOption("LSE");
        widgets.add(lseSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, getLocationAttribute(Keys.organization_schools), "No. of school under the organization", InputType.TYPE_CLASS_NUMBER, FOUR, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        lseSkipper.build();

        ToggleWidgetData.SkipData srhmSkipper = partnerToggler.addOption("SRHM");
        widgets.add(srhmSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, getLocationAttribute(Keys.organization_institutions), "No. of institutions under the organization", InputType.TYPE_CLASS_NUMBER, FOUR, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        srhmSkipper.build();

        partnerType.addDependentWidgets(partnerToggler.getToggleMap());

        widgets.add(new EditTextWidget.Builder(context, Keys.PARENT_ORGANIZATION_ADDRESS, "Office Address", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_ADDRESS_CHARACTER_SET)).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.PRIMARY_CONTACT_PERSON, "Name of Point of Contact", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new PhoneWidget(context, Keys.PRIMARY_CONTACT, "Phone Number of point of contact", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.EMAIL, "Email of Point of Contact", InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_EMAIL_CHARACTER_SET)).build());

        return widgets;
    }

    private List<Widget> getSecondaryMonitoringExitWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));


        UserWidget userWidget = new UserWidget(context, Keys.MONITOR, "Monitored By", new ArrayList<BaseItem>()).enableStringJson();
        widgets.add(userWidget);
        dataRepository.getUsersByRole(userWidget, getRoleByName(Keys.ROLE_LSE_MONITOR));

        DataUpdater dataUpdater = new DataUpdater(context, database.getMetadataDao());
        FormUpdateListener updateListener = new FormUpdateListener(dataUpdater, IDType.SCHOOL_ID);


        TextWidget schoolClassification = new TextWidget(context, getLocationAttribute(Keys.school_sex), "Classification of School by Sex").enabledViewOnly();
        widgets.add(dataUpdater.add(schoolClassification));

        updateListener.onItemAdded(GlobalConstants.selectedSchool.getShortName());

        RadioWidget classClassification = new RadioWidget(context, Keys.CLASS_CLASSIFICATION, "Students in Class by Sex", true, getDefinitions(Keys.CLASS_CLASSIFICATION));
        widgets.add(classClassification);
        schoolClassification.setListeners(new ClassificationListener(classClassification));

        UserWidget participantID = new UserWidget(context, PARTICIPANT_ID, "Name of Teacher", new ArrayList<BaseItem>()).enableSingleSelect().enableStringJson();
        widgets.add(participantID);
        dataRepository.getParticipant(participantID, FormSection.LSE);

        widgets.add(new RadioWidget(context, Keys.SECONDARY_CLASS_GRADE, "Class", true, getDefinitions(Keys.SECONDARY_CLASS_GRADE)));
        widgets.add(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENTS, "Number of Students in Class", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).setInputRange(1, 999999).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.DURATION_OF_CLASS, "Time duration of class in minutes", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build());

        ToggleWidgetData levelToggler = new ToggleWidgetData();
        RadioWidget level = new RadioWidget(context, Keys.LSBE_LEVEL_MONITORED, "LSBE Level", true, getDefinitions(Keys.LSBE_LEVEL_MONITORED));
        widgets.add(level.addHeader("LSBE Program"));

        ToggleWidgetData.SkipData levelOneSkipper = levelToggler.addOption("Level 1");
        widgets.add(levelOneSkipper.addWidgetToToggle(new SpinnerWidget(context, Keys.LSBE_LEVEL_MONITORED_LEVEL_1, "LSBE Chapter - Level 1", true, getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.level_one_chapters))))).hideView());
        levelOneSkipper.build();


        ToggleWidgetData.SkipData levelTwoSkipper = levelToggler.addOption("Level 2");
        widgets.add(levelTwoSkipper.addWidgetToToggle(new SpinnerWidget(context, Keys.LSBE_LEVEL_MONITORED_LEVEL_2, "LSBE Chapter - Level 2", true, getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.level_two_chapters))))).hideView());
        levelTwoSkipper.build();

        widgets.add(new RadioWidget(context, Keys.LSBE_CHAPTER_REVISION, "Revision or First time chapter is being taught", true, getDefinitions(Keys.LSBE_CHAPTER_REVISION)));

        ScoreWidget scoreWidget = new ScoreWidget(context, Keys.MONITORING_SCORE, Keys.MONITORING_SCORE_PCT);
        ScoreCalculator scoreCalculator = new ScoreCalculator(scoreWidget);
        widgets.add(new RateWidget(context, Keys.LSBE_PROMPTS, "The teacher is actively using the teacher's guide to aid in facilitation of content", true).setScoreListener(scoreCalculator).addHeader("Facilitation"));
        widgets.add(new RateWidget(context, Keys.LSBE_CHAPTER_OBJECTIVE, "The teacher is clearly relaying the main messages of the chapter, even if they are not actively using the teacher's guide", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_TEACHER_UNDERSTANDING, "The teacher demonstrate good understanding of the LSBE content", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_MATERIAL_PREPARATION, "The teacher had all materials prepared in advance for the class", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_TEACHER_PREPARATION, "The teacher was well prepared to facilitate the session", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_ACTIVITY_TIME_ALLOTED, "An appropriate amount of time is allotted for each activity and topic", true).setScoreListener(scoreCalculator));


        RadioWidget newActivities = new RadioWidget(context, Keys.
                LSBE_BEYOND_GUIDE, "Teacher has gone beyond the teacher’s guide to build on and/or develop new activities", true, "Yes", "No");
        widgets.add(newActivities.setScoreListener(scoreCalculator));

        MultiSelectWidget activities = new MultiSelectWidget(context, Keys.LSBE_BEYOND_GUIDE_NEW, LinearLayout.VERTICAL, "What has the teacher done that is new?", getDefinitions(Keys.LSBE_BEYOND_GUIDE_NEW), true);
        widgets.add(activities.hideView());

        ToggleWidgetData activitiesToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData activitiesSkipper = activitiesToggler.addOption("Yes");
        activitiesSkipper.addWidgetToToggle(activities);
        activitiesSkipper.build();
        newActivities.addDependentWidgets(activitiesToggler.getToggleMap());

        widgets.add(new RateWidget(context, Keys.LSBE_SUBJECT_COMFORT, "The teacher is comfortable speaking about this subject", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_NONJUDMENTAL_TONE, "The teacher uses a non-judgmental tone while facilitating the session", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_IMPARTIAL_OPINIONS, "The teacher does not impose their own values or opinion on the participants", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_DISCUSSION_PROBES, "The teacher is engaging participants in discussion throughout session by providing probes", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_STUDENT_UNDERSTANDING, "Students demonstrate clear understanding of the main messages of the chapter", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_STUDENT_ENGAGEMENT, "Students are actively participating in discussion on the chapter", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_STUDENT_ATTENTION, "Students are actively paying attention to the class while the teacher is instructing", true).setScoreListener(scoreCalculator));

        RadioWidget timetable = new RadioWidget(context, Keys.LSBE_TIMETABLE_INTEGRATION, "Management has integrated the LSBE program into the school timetable", true, "Yes", "No");
        widgets.add(timetable.setScoreListener(scoreCalculator).addHeader("Management"));

        RadioWidget frequency = new RadioWidget(context, Keys.LSBE_CLASS_FREQUENCY, "Frequency of class in time table", true, getDefinitions(Keys.LSBE_CLASS_FREQUENCY));
        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build();
        ToggleWidgetData togglerFrequency = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = togglerFrequency.addOption("Yes");
        skipData.addWidgetToToggle(frequency);
        skipData.build();
        widgets.add(frequency.hideView());
        timetable.addDependentWidgets(togglerFrequency.getToggleMap());

        MultiSwitcher timeTableMultiSwitcher = new MultiSwitcher(timetable, frequency);
        timeTableMultiSwitcher.addNewOption().addKeys("Yes", "Other").addWidgets(other).build();
        frequency.setMultiSwitchListenerList(timeTableMultiSwitcher);
        timetable.setMultiSwitchListenerList(timeTableMultiSwitcher);
        widgets.add(other.hideView());


        widgets.add(new RadioWidget(context, Keys.LSBE_TWO_TEACHER_ASSIGNED, "There are at least 2 teachers assigned to teach the LSBE program", true, "Yes", "No").setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_TEACHER_MGMT_COORDINATION, "There is excellent coordination between management and teachers regarding the LSBE program", true).setScoreListener(scoreCalculator));

        widgets.add(new EditTextWidget.Builder(context, Keys.LSBE_MT_COUNT, "Number of Master Trainer leading LSBE program", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).setInputRange(1, 999999).build());
        widgets.add(new RateWidget(context, Keys.LSBE_MT_TEACHER_COORDINATION, "There is excellent coordination between Master Trainers and teachers regarding the LSBE program", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_MT_CONDUCT_MONITORING, "Master Trainer conduct regular monitoring sessions to maintain quality of LSBE program", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_MT_CONDUCT_TRAINING, "Master Trainer arrange and conduct refresher trainings as needed for LSBE teachers", true).setScoreListener(scoreCalculator));
        widgets.add(scoreWidget);


        RadioWidget scheduleClass = new RadioWidget(context, Keys.LSBE_CHALLENGE_1, "The school is facing challenges scheduling the LSBE class", true, getDefinitions(Keys.LSBE_CHALLENGE_1));
        widgets.add(scheduleClass.addHeader("Challenges"));
        ToggleWidgetData challengeToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.LSBE_CHALLENGE_1_STATUS, "Status of Challenge", true, getDefinitions(Keys.LSBE_CHALLENGE_1_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        scheduleClass.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget enoughResource = new RadioWidget(context, Keys.LSBE_CHALLENGE_2, "There are not enough resources", true, getDefinitions(Keys.LSBE_CHALLENGE_2));
        widgets.add(enoughResource);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.LSBE_CHALLENGE_2_STATUS, "Status of Challenge", true, getDefinitions(Keys.LSBE_CHALLENGE_2_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        enoughResource.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noRoom = new RadioWidget(context, Keys.LSBE_CHALLENGE_3, "There is no room for the class", true, getDefinitions(Keys.LSBE_CHALLENGE_3));
        widgets.add(noRoom);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.LSBE_CHALLENGE_3_STATUS, "Status of Challenge", true, getDefinitions(Keys.LSBE_CHALLENGE_3_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        noRoom.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noTeacher = new RadioWidget(context, Keys.LSBE_CHALLENGE_4, "There are not enough teachers to teach the CSA class", true, getDefinitions(Keys.LSBE_CHALLENGE_4));
        widgets.add(noTeacher);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.LSBE_CHALLENGE_4_STATUS, "Status of Challenge", true, getDefinitions(Keys.LSBE_CHALLENGE_4_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        noTeacher.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget irreleventContent = new RadioWidget(context, Keys.LSBE_CHALLENGE_5, "The content is irrelevent for the context of the students", true, getDefinitions(Keys.LSBE_CHALLENGE_5));
        widgets.add(irreleventContent);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.LSBE_CHALLENGE_5_STATUS, "Status of Challenge", true, getDefinitions(Keys.LSBE_CHALLENGE_5_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        irreleventContent.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget studentNotInterested = new RadioWidget(context, Keys.LSBE_CHALLENGE_6, "Student are not interested in the content", true, getDefinitions(Keys.LSBE_CHALLENGE_6));
        widgets.add(studentNotInterested);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.LSBE_CHALLENGE_6_STATUS, "Status of Challenge", true, getDefinitions(Keys.LSBE_CHALLENGE_6_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        studentNotInterested.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget resourceRequire = new RadioWidget(context, Keys.LSBE_RESOURCES_REQUIRED, "Does this school require any resources?", true, getDefinitions(Keys.LSBE_RESOURCES_REQUIRED));
        widgets.add(resourceRequire.addHeader("Resources"));

        final Widget workbookGirlOne = new EditTextWidget.Builder(context, Keys.WB1_GIRLS_REQUIRED_COUNT, "Workbook level 1 - Girls", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999).build().hideView();
        final Widget workbookBoyOne = new EditTextWidget.Builder(context, Keys.WB1_BOYS_REQUIRED_COUNT, "Workbook level 1 - Boys", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999).build().hideView();
        final Widget workbookBoyTwo = new EditTextWidget.Builder(context, Keys.WB2_BOYS_REQUIRED_COUNT, "Workbook level 2 - Boys", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999).build().hideView();
        final Widget workbookGirlTwo = new EditTextWidget.Builder(context, Keys.WB2_GIRLS_REQUIRED_COUNT, "Workbook level 2 - Girls", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999).build().hideView();
        final EditTextWidget requireOther = new EditTextWidget.Builder(context, Keys.OTHER_RESOURCE_REQUIRED_COUNT, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999).build();
        final Widget resourceRequireOther = new EditTextWidget.Builder(context, Keys.OTHER_RESOURCE_REQUIRED_TYPE, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
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

        RadioWidget resourceDistributed = new RadioWidget(context, Keys.LSBE_RESOURCES_DELIVERED, "Were any resources distributed to this school in this visit?", true, getDefinitions(Keys.LSBE_RESOURCES_DELIVERED));
        final Widget resourceworkbookGirlOne = new EditTextWidget.Builder(context, Keys.WB1_GIRLS_DELIVERED_COUNT, "Workbook level 1 - Girls", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999).build().hideView();
        final Widget resourceworkbookBoyOne = new EditTextWidget.Builder(context, Keys.WB1_BOYS_DELIVERED_COUNT, "Workbook level 1 - Boys", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999).build().hideView();
        final Widget resourceworkbookBoyTwo = new EditTextWidget.Builder(context, Keys.WB2_BOYS_DELIVERED_COUNT, "Workbook level 2 - Boys", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999).build().hideView();
        final Widget resourceworkbookGirlTwo = new EditTextWidget.Builder(context, Keys.WB2_GIRLS_DELIVERED_COUNT, "Workbook level 2 - Girls", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999).build().hideView();
        final EditTextWidget resourceDistributedOtherQuantity = new EditTextWidget.Builder(context, Keys.OTHER_RESOURCE_DELIVERED_COUNT, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        final Widget resourceDistributedOther = new EditTextWidget.Builder(context, Keys.OTHER_RESOURCE_DELIVERED_TYPE, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
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

        level.addDependentWidgets(levelToggler.getToggleMap());


        return widgets;
    }

    private List<Widget> getSecondaryMonitoringRunningWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        UserWidget userWidget = new UserWidget(context, Keys.MONITOR, "Monitored By", new ArrayList<BaseItem>()).enableStringJson();
        widgets.add(userWidget);
        dataRepository.getUsersByRole(userWidget, getRoleByName(Keys.ROLE_LSE_MONITOR));


        DataUpdater dataUpdater = new DataUpdater(context, database.getMetadataDao());
        FormUpdateListener updateListener = new FormUpdateListener(dataUpdater, IDType.SCHOOL_ID);


        TextWidget schoolClassification = new TextWidget(context, getLocationAttribute(Keys.school_sex), "Classification of School by Sex").enabledViewOnly();
        widgets.add(dataUpdater.add(schoolClassification).hideView());

        updateListener.onItemAdded(GlobalConstants.selectedSchool.getShortName());

        RadioWidget classClassification = new RadioWidget(context, Keys.CLASS_CLASSIFICATION, "Students in Class by Sex", true, getDefinitions(Keys.CLASS_CLASSIFICATION));
        widgets.add(classClassification);
        schoolClassification.setListeners(new ClassificationListener(classClassification));

        UserWidget participantID = new UserWidget(context, PARTICIPANT_ID, "Name of Teacher", new ArrayList<BaseItem>()).enableSingleSelect().enableStringJson();
        widgets.add(participantID);
        dataRepository.getParticipant(participantID, FormSection.LSE);

        widgets.add(new RadioWidget(context, Keys.SECONDARY_CLASS_GRADE, "Class", true, getDefinitions(Keys.SECONDARY_CLASS_GRADE)));
        widgets.add(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENTS, "Number of Students in Class", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).setInputRange(1, 999999).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.DURATION_OF_CLASS, "Time duration of class in minutes", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build());

        ToggleWidgetData levelToggler = new ToggleWidgetData();
        RadioWidget level = new RadioWidget(context, Keys.LSBE_LEVEL_MONITORED, "LSBE Level", true, getDefinitions(Keys.LSBE_LEVEL_MONITORED));
        widgets.add(level.addHeader("LSBE Program"));

        ToggleWidgetData.SkipData levelOneSkipper = levelToggler.addOption("Level 1");
        widgets.add(levelOneSkipper.addWidgetToToggle(new SpinnerWidget(context, Keys.LSBE_LEVEL_MONITORED_LEVEL_1, "LSBE Chapter - Level 1", true, getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.level_one_chapters))))).hideView());
        levelOneSkipper.build();

        ToggleWidgetData.SkipData levelTwoSkipper = levelToggler.addOption("Level 2");
        widgets.add(levelTwoSkipper.addWidgetToToggle(new SpinnerWidget(context, Keys.LSBE_LEVEL_MONITORED_LEVEL_2, "LSBE Chapter - Level 2", true, getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.level_two_chapters))))).hideView());
        levelTwoSkipper.build();

        widgets.add(new RadioWidget(context, Keys.LSBE_CHAPTER_REVISION, "Revision or first time flashcard is being taught", true, getDefinitions(Keys.LSBE_CHAPTER_REVISION)));

        ScoreWidget scoreWidget = new ScoreWidget(context, Keys.MONITORING_SCORE, Keys.MONITORING_SCORE_PCT);
        ScoreCalculator scoreCalculator = new ScoreCalculator(scoreWidget);
        widgets.add(new RateWidget(context, Keys.LSBE_PROMPTS, "The teacher is actively using the teacher's guide to aid in facilitation of content", true).setScoreListener(scoreCalculator).addHeader("Facilitation"));
        widgets.add(new RateWidget(context, Keys.LSBE_CHAPTER_OBJECTIVE, "The teacher is clearly relaying the main messages of the chapter, even if they are not actively using the teacher's guide", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_TEACHER_UNDERSTANDING, "The teacher demonstrate good understanding of the LSBE content", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_MATERIAL_PREPARATION, "The teacher had all materials prepared in advance for the class", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_TEACHER_PREPARATION, "The teacher was well prepared to facilitate the session", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_ACTIVITY_TIME_ALLOTMENT, "An appropriate amount of time is allotted for each activity and topic", true).setScoreListener(scoreCalculator));

        RadioWidget newActivities = new RadioWidget(context, Keys.
                LSBE_BEYOND_GUIDE, "Teacher has gone beyond the teacher’s guide to build on and/or develop new activities", true, "Yes", "No");
        widgets.add(newActivities.setScoreListener(scoreCalculator));

        MultiSelectWidget activities = new MultiSelectWidget(context, Keys.LSBE_BEYOND_GUIDE_NEW, LinearLayout.VERTICAL, "What has the teacher done that is new?", getDefinitions(Keys.LSBE_BEYOND_GUIDE_NEW), true);
        widgets.add(activities.hideView());

        ToggleWidgetData activitiesToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData activitiesSkipper = activitiesToggler.addOption("Yes");
        activitiesSkipper.addWidgetToToggle(activities);
        activitiesSkipper.build();
        newActivities.addDependentWidgets(activitiesToggler.getToggleMap());

        widgets.add(new RateWidget(context, Keys.LSBE_SUBJECT_COMFORT, "The teacher is comfortable speaking about this subject", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_NONJUDMENTAL_TONE, "The teacher uses a non-judgmental tone while facilitating the session", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_IMPARTIAL_OPINIONS, "The teacher does not impose their own values or opinion on the participants", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_DISCUSSION_PROBES, "The teacher is engaging participants in discussion throughout session by providing probes", true).setScoreListener(scoreCalculator));

        widgets.add(new RateWidget(context, Keys.LSBE_STUDENT_UNDERSTANDING, "Students demonstrate clear understanding of the main messages of the chapter", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_STUDENT_ENGAGEMENT, "Students are actively participating in discussion on the chapter", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_STUDENT_ATTENTION, "Students are actively paying attention to the class while the teacher is instructing", true).setScoreListener(scoreCalculator));


        RadioWidget timetable = new RadioWidget(context, Keys.LSBE_TIMETABLE_INTEGRATION, "Management has integrated the LSBE program into the school timetable", true, "Yes", "No");
        widgets.add(timetable.setScoreListener(scoreCalculator).addHeader("Management"));

        RadioWidget frequency = new RadioWidget(context, Keys.LSBE_CLASS_FREQUENCY, "Frequency of class in time table", true, getDefinitions(Keys.LSBE_CLASS_FREQUENCY));
        EditTextWidget other = new EditTextWidget.Builder(context, Keys.LSBE_CLASS_FREQUENCY_OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build();
        ToggleWidgetData togglerFrequency = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = togglerFrequency.addOption("Yes");
        skipData.addWidgetToToggle(frequency);
        skipData.build();
        widgets.add(frequency.hideView());
        timetable.addDependentWidgets(togglerFrequency.getToggleMap());

        MultiSwitcher timeTableMultiSwitcher = new MultiSwitcher(timetable, frequency);
        timeTableMultiSwitcher.addNewOption().addKeys("Yes", "Other").addWidgets(other).build();
        frequency.setMultiSwitchListenerList(timeTableMultiSwitcher);
        timetable.setMultiSwitchListenerList(timeTableMultiSwitcher);
        widgets.add(other.hideView());


        widgets.add(new RadioWidget(context, Keys.LSBE_TWO_TEACHER_ASSIGNED, "There are at least 2 teachers assigned to teach the LSBE program", true, "Yes", "No").setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_TEACHER_MGMT_COORDINATION, "There is excellent coordination between management and teachers regarding the LSBE program", true).setScoreListener(scoreCalculator));
        widgets.add(scoreWidget);


        RadioWidget scheduleClass = new RadioWidget(context, Keys.LSBE_CHALLENGE_1, "The school is facing challenges scheduling the LSBE class", true, getDefinitions(Keys.LSBE_CHALLENGE_1));
        widgets.add(scheduleClass.addHeader("Challenges"));
        ToggleWidgetData challengeToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.LSBE_CHALLENGE_1_STATUS, "Status of Challenge", true, getDefinitions(Keys.LSBE_CHALLENGE_1_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        scheduleClass.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget enoughResource = new RadioWidget(context, Keys.LSBE_CHALLENGE_2, "There are not enough resources", true, getDefinitions(Keys.LSBE_CHALLENGE_2));
        widgets.add(enoughResource);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.LSBE_CHALLENGE_2_STATUS, "Status of Challenge", true, getDefinitions(Keys.LSBE_CHALLENGE_2_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        enoughResource.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noRoom = new RadioWidget(context, Keys.LSBE_CHALLENGE_3, "There is no room for the class", true, getDefinitions(Keys.LSBE_CHALLENGE_3));
        widgets.add(noRoom);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.LSBE_CHALLENGE_3_STATUS, "Status of Challenge", true, getDefinitions(Keys.LSBE_CHALLENGE_3_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        noRoom.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noTeacher = new RadioWidget(context, Keys.LSBE_CHALLENGE_4, "There are not enough teachers to teach the CSA class", true, getDefinitions(Keys.LSBE_CHALLENGE_4));
        widgets.add(noTeacher);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.LSBE_CHALLENGE_4_STATUS, "Status of Challenge", true, getDefinitions(Keys.LSBE_CHALLENGE_4_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        noTeacher.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget irreleventContent = new RadioWidget(context, Keys.LSBE_CHALLENGE_5, "The content is irrelevent for the context of the students", true, getDefinitions(Keys.LSBE_CHALLENGE_5));
        widgets.add(irreleventContent);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.LSBE_CHALLENGE_5_STATUS, "Status of Challenge", true, getDefinitions(LSBE_CHALLENGE_5_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        irreleventContent.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget studentNotInterested = new RadioWidget(context, Keys.LSBE_CHALLENGE_6, "Student are not interested in the content", true, getDefinitions(Keys.LSBE_CHALLENGE_6));
        widgets.add(studentNotInterested);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.LSBE_CHALLENGE_6_STATUS, "Status of Challenge", true, getDefinitions(Keys.LSBE_CHALLENGE_6_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        studentNotInterested.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget resourceRequire = new RadioWidget(context, Keys.LSBE_RESOURCES_REQUIRED, "Does this school require any resources?", true, getDefinitions(Keys.LSBE_RESOURCES_REQUIRED));
        widgets.add(resourceRequire.addHeader("Resources"));

        final Widget workbookGirlOne = new EditTextWidget.Builder(context, Keys.WB1_GIRLS_REQUIRED_COUNT, "Workbook level 1 - Girls", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView();
        final Widget workbookBoyOne = new EditTextWidget.Builder(context, Keys.WB1_BOYS_REQUIRED_COUNT, "Workbook level 1 - Boys", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView();
        final Widget workbookBoyTwo = new EditTextWidget.Builder(context, Keys.WB2_BOYS_REQUIRED_COUNT, "Workbook level 2 - Boys", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView();
        final Widget workbookGirlTwo = new EditTextWidget.Builder(context, Keys.WB2_GIRLS_REQUIRED_COUNT, "Workbook level 2 - Girls", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView();
        final EditTextWidget requireOther = new EditTextWidget.Builder(context, Keys.OTHER_RESOURCE_REQUIRED_COUNT, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        final Widget resourceRequireOther = new EditTextWidget.Builder(context, Keys.OTHER_RESOURCE_REQUIRED_TYPE, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
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


        RadioWidget resourceDistributed = new RadioWidget(context, Keys.LSBE_RESOURCES_DELIVERED, "Were any resources distributed to this school in this visit?", true, getDefinitions(Keys.LSBE_RESOURCES_DELIVERED));
        final Widget resourceworkbookGirlOne = new EditTextWidget.Builder(context, Keys.WB1_GIRLS_DELIVERED_COUNT, "Workbook level 1 - Girls", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView();
        final Widget resourceworkbookBoyOne = new EditTextWidget.Builder(context, Keys.WB1_BOYS_DELIVERED_COUNT, "Workbook level 1 - Boys", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView();
        final Widget resourceworkbookBoyTwo = new EditTextWidget.Builder(context, Keys.WB2_BOYS_DELIVERED_COUNT, "Workbook level 2 - Boys", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView();
        final Widget resourceworkbookGirlTwo = new EditTextWidget.Builder(context, Keys.WB2_GIRLS_DELIVERED_COUNT, "Workbook level 2 - Girls", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView();
        final EditTextWidget resourceDistributedOtherQuantity = new EditTextWidget.Builder(context, Keys.OTHER_RESOURCE_DELIVERED_COUNT, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        final Widget resourceDistributedOther = new EditTextWidget.Builder(context, Keys.OTHER_RESOURCE_DELIVERED_TYPE, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
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


        level.addDependentWidgets(levelToggler.getToggleMap());


        return widgets;
    }

    private List<Widget> getSecondaryMonitoringNewWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        UserWidget userWidget = new UserWidget(context, Keys.MONITOR, "Monitored By", new ArrayList<BaseItem>()).enableStringJson();
        widgets.add(userWidget);
        dataRepository.getUsersByRole(userWidget, getRoleByName(Keys.ROLE_LSE_MONITOR));

        DataUpdater dataUpdater = new DataUpdater(context, database.getMetadataDao());
        FormUpdateListener updateListener = new FormUpdateListener(dataUpdater, IDType.SCHOOL_ID);


        TextWidget schoolClassification = new TextWidget(context, getLocationAttribute(Keys.school_sex), "Classification of School by Sex").enabledViewOnly();
        widgets.add(dataUpdater.add(schoolClassification).hideView());

        updateListener.onItemAdded(GlobalConstants.selectedSchool.getShortName());

        RadioWidget classClassification = new RadioWidget(context, Keys.CLASS_CLASSIFICATION, "Students in Class by Sex", true, getDefinitions(Keys.CLASS_CLASSIFICATION));
        widgets.add(classClassification);
        schoolClassification.setListeners(new ClassificationListener(classClassification));

        UserWidget participantID = new UserWidget(context, PARTICIPANT_ID, "Name of Teacher", new ArrayList<BaseItem>()).enableSingleSelect().enableStringJson();
        widgets.add(participantID);
        dataRepository.getParticipant(participantID, FormSection.LSE);

        widgets.add(new RadioWidget(context, Keys.SECONDARY_CLASS_GRADE, "Class", true, getDefinitions(Keys.SECONDARY_CLASS_GRADE)));
        widgets.add(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENTS, "Number of Students in Class", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).setInputRange(1, 999999).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.DURATION_OF_CLASS, "Time duration of class in minutes", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build());

        ToggleWidgetData levelToggler = new ToggleWidgetData();
        RadioWidget level = new RadioWidget(context, Keys.LSBE_LEVEL_MONITORED, "LSBE Level", true, getDefinitions(Keys.LSBE_LEVEL_MONITORED));
        widgets.add(level.addHeader("LSBE Program"));

        ToggleWidgetData.SkipData levelOneSkipper = levelToggler.addOption("Level 1");
        widgets.add(levelOneSkipper.addWidgetToToggle(new SpinnerWidget(context, Keys.LSBE_LEVEL_MONITORED_LEVEL_1, "LSBE Chapter - Level 1", true, getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.level_one_chapters))))).hideView());
        levelOneSkipper.build();


        ToggleWidgetData.SkipData levelTwoSkipper = levelToggler.addOption("Level 2");
        widgets.add(levelTwoSkipper.addWidgetToToggle(new SpinnerWidget(context, Keys.LSBE_LEVEL_MONITORED_LEVEL_2, "LSBE Chapter - Level 2", true, getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.level_two_chapters))))).hideView());
        levelTwoSkipper.build();

        widgets.add(new RadioWidget(context, Keys.LSBE_CHAPTER_REVISION, "Revision or First time chapter is being taught", true, getDefinitions(Keys.LSBE_CHAPTER_REVISION)));

        ScoreWidget scoreWidget = new ScoreWidget(context, Keys.MONITORING_SCORE, Keys.MONITORING_SCORE_PCT);
        ScoreCalculator scoreCalculator = new ScoreCalculator(scoreWidget);
        widgets.add(new RateWidget(context, Keys.LSBE_PROMPTS, "The teacher is actively using the teacher's guide to aid in facilitation of content", true).setScoreListener(scoreCalculator).addHeader("Facilitation"));
        widgets.add(new RateWidget(context, Keys.LSBE_CHAPTER_OBJECTIVE, "The teacher is clearly relaying the main messages of the chapter, even if they are not actively using the teacher's guide", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_TEACHER_UNDERSTANDING, "The teacher demonstrate good understanding of the LSBE content", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_MATERIAL_PREPARATION, "The teacher had all materials prepared in advance for the class", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_TEACHER_PREPARATION, "The teacher was well prepared to facilitate the session", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_ACTIVITY_TIME_ALLOTED, "An appropriate amount of time is allotted for each activity and topic", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_SUBJECT_COMFORT, "The teacher is comfortable speaking about this subject", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_NONJUDMENTAL_TONE, "The teacher uses a non-judgmental tone while facilitating the session", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_IMPARTIAL_OPINIONS, "The teacher does not impose their own values or opinion on the participants", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_DISCUSSION_PROBES, "The teacher is engaging participants in discussion throughout session by providing probes", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_STUDENT_UNDERSTANDING, "Students demonstrate clear understanding of the main messages of the chapter", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_STUDENT_ENGAGEMENT, "Students are actively participating in discussion on the chapter", true).setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_STUDENT_ATTENTION, "Students are actively paying attention to the class while the teacher is instructing", true).setScoreListener(scoreCalculator));

        RadioWidget timetable = new RadioWidget(context, Keys.LSBE_TIMETABLE_INTEGRATION, "Management has integrated the LSBE program into the school timetable", true, "Yes", "No");
        widgets.add(timetable.setScoreListener(scoreCalculator).addHeader("Management"));

        RadioWidget frequency = new RadioWidget(context, Keys.LSBE_CLASS_FREQUENCY, "Frequency of class in time table", true, getDefinitions(Keys.LSBE_CLASS_FREQUENCY));
        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build();
        ToggleWidgetData togglerFrequency = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = togglerFrequency.addOption("Yes");
        skipData.addWidgetToToggle(frequency);
        skipData.build();
        widgets.add(frequency.hideView());
        timetable.addDependentWidgets(togglerFrequency.getToggleMap());

        MultiSwitcher timeTableMultiSwitcher = new MultiSwitcher(timetable, frequency);
        timeTableMultiSwitcher.addNewOption().addKeys("Yes", "Other").addWidgets(other).build();
        frequency.setMultiSwitchListenerList(timeTableMultiSwitcher);
        timetable.setMultiSwitchListenerList(timeTableMultiSwitcher);
        widgets.add(other.hideView());


        widgets.add(new RadioWidget(context, Keys.LSBE_TWO_TEACHER_ASSIGNED, "There are at least 2 teachers assigned to teach the LSBE program", true, "Yes", "No").setScoreListener(scoreCalculator));
        widgets.add(new RateWidget(context, Keys.LSBE_TEACHER_MGMT_COORDINATION, "There is excellent coordination between management and teachers regarding the LSBE program", true).setScoreListener(scoreCalculator));
        widgets.add(scoreWidget);

        RadioWidget scheduleClass = new RadioWidget(context, Keys.LSBE_CHALLENGE_1, "The school is facing challenges scheduling the LSBE class", true, getDefinitions(Keys.LSBE_CHALLENGE_1));
        widgets.add(scheduleClass.addHeader("Challenges"));
        ToggleWidgetData challengeToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.LSBE_CHALLENGE_1_STATUS, "Status of Challenge", true, getDefinitions(Keys.LSBE_CHALLENGE_1_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        scheduleClass.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget enoughResource = new RadioWidget(context, Keys.LSBE_CHALLENGE_2, "There are not enough resources", true, getDefinitions(Keys.LSBE_CHALLENGE_2));
        widgets.add(enoughResource);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.LSBE_CHALLENGE_2_STATUS, "Status of Challenge", true, getDefinitions(Keys.LSBE_CHALLENGE_2_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        enoughResource.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noRoom = new RadioWidget(context, Keys.LSBE_CHALLENGE_3, "There is no room for the class", true, getDefinitions(Keys.LSBE_CHALLENGE_3));
        widgets.add(noRoom);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.LSBE_CHALLENGE_3_STATUS, "Status of Challenge", true, getDefinitions(Keys.LSBE_CHALLENGE_3_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        noRoom.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noTeacher = new RadioWidget(context, Keys.LSBE_CHALLENGE_4, "There are not enough teachers to teach the CSA class", true, getDefinitions(Keys.LSBE_CHALLENGE_4));
        widgets.add(noTeacher);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.LSBE_CHALLENGE_4_STATUS, "Status of Challenge", true, getDefinitions(Keys.LSBE_CHALLENGE_4_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        noTeacher.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget irreleventContent = new RadioWidget(context, Keys.LSBE_CHALLENGE_5, "The content is irrelevent for the context of the students", true, getDefinitions(Keys.LSBE_CHALLENGE_5));
        widgets.add(irreleventContent);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.LSBE_CHALLENGE_5_STATUS, "Status of Challenge", true, getDefinitions(Keys.LSBE_CHALLENGE_5_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        irreleventContent.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget studentNotInterested = new RadioWidget(context, Keys.LSBE_CHALLENGE_6, "Student are not interested in the content", true, getDefinitions(Keys.LSBE_CHALLENGE_6));
        widgets.add(studentNotInterested);
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.LSBE_CHALLENGE_6_STATUS, "Status of Challenge", true, getDefinitions(Keys.LSBE_CHALLENGE_6_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        studentNotInterested.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget resourceRequire = new RadioWidget(context, Keys.LSBE_RESOURCES_REQUIRED, "Does this school require any resources?", true, getDefinitions(Keys.LSBE_RESOURCES_REQUIRED));
        widgets.add(resourceRequire.addHeader("Resources"));

        final Widget workbookGirlOne = new EditTextWidget.Builder(context, Keys.WB1_GIRLS_REQUIRED_COUNT, "Workbook level 1 - Girls", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView();
        final Widget workbookBoyOne = new EditTextWidget.Builder(context, Keys.WB1_BOYS_REQUIRED_COUNT, "Workbook level 1 - Boys", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView();
        final Widget workbookBoyTwo = new EditTextWidget.Builder(context, Keys.WB2_BOYS_REQUIRED_COUNT, "Workbook level 2 - Boys", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView();
        final Widget workbookGirlTwo = new EditTextWidget.Builder(context, Keys.WB2_GIRLS_REQUIRED_COUNT, "Workbook level 2 - Girls", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView();
        final EditTextWidget requireOther = new EditTextWidget.Builder(context, Keys.OTHER_RESOURCE_REQUIRED_COUNT, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build();
        final Widget resourceRequireOther = new EditTextWidget.Builder(context, Keys.OTHER_RESOURCE_REQUIRED_TYPE, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
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

        RadioWidget resourceDistributed = new RadioWidget(context, Keys.LSBE_RESOURCES_DELIVERED, "Were any resources distributed to this school in this visit?", true, getDefinitions(Keys.LSBE_RESOURCES_DELIVERED));
        final Widget resourceworkbookGirlOne = new EditTextWidget.Builder(context, Keys.WB1_GIRLS_DELIVERED_COUNT, "Workbook level 1 - Girls", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView();
        final Widget resourceworkbookBoyOne = new EditTextWidget.Builder(context, Keys.WB1_BOYS_DELIVERED_COUNT, "Workbook level 1 - Boys", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView();
        final Widget resourceworkbookBoyTwo = new EditTextWidget.Builder(context, Keys.WB2_BOYS_DELIVERED_COUNT, "Workbook level 2 - Boys", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView();
        final Widget resourceworkbookGirlTwo = new EditTextWidget.Builder(context, Keys.WB2_GIRLS_DELIVERED_COUNT, "Workbook level 2 - Girls", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build().hideView();
        final EditTextWidget resourceDistributedOtherQuantity = new EditTextWidget.Builder(context, Keys.OTHER_RESOURCE_DELIVERED_COUNT, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        final Widget resourceDistributedOther = new EditTextWidget.Builder(context, Keys.OTHER_RESOURCE_DELIVERED_TYPE, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
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

        level.addDependentWidgets(levelToggler.getToggleMap());

        return widgets;
    }

    private List<Widget> getPrimaryMonitoringExitWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        UserWidget userWidget = new UserWidget(context, Keys.MONITOR, Keys.USER_ID, "Monitored By").enableStringJson();
        widgets.add(userWidget);
        dataRepository.getUsersByRole(userWidget, getRoleByName(Keys.ROLE_LSE_MONITOR));

        DataUpdater dataUpdater = new DataUpdater(context, database.getMetadataDao());
        FormUpdateListener updateListener = new FormUpdateListener(dataUpdater, IDType.SCHOOL_ID);


        TextWidget schoolClassification = new TextWidget(context, getLocationAttribute(Keys.school_sex), "Classification of School by Sex").enabledViewOnly();
        widgets.add(dataUpdater.add(schoolClassification));

        updateListener.onItemAdded(GlobalConstants.selectedSchool.getShortName());

        RadioWidget classClassification = new RadioWidget(context, Keys.CLASS_CLASSIFICATION, "Students in Class by Sex", true, getDefinitions(Keys.CLASS_CLASSIFICATION));
        widgets.add(classClassification);
        schoolClassification.setListeners(new ClassificationListener(classClassification));

        UserWidget teacher = new UserWidget(context, Keys.PARTICIPANT_ID, "Teacher", new ArrayList<BaseItem>()).enableSingleSelect().enableStringJson();
        widgets.add(teacher);
        dataRepository.getParticipant(teacher, FormSection.LSE);

        widgets.add(new RadioWidget(context, Keys.CLASS, "Class", true, getDefinitions(Keys.CLASS)));
        widgets.add(new EditTextWidget.Builder(context, Keys.STUDENT_QUANTITY, "Number of Students in Class", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).setInputRange(1, 999999).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.DURATION_OF_CLASS, "Time duration of class in minutes", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build());

        RadioWidget program = new RadioWidget(context, Keys.PRIMARY_PROGRAM, "Primary Program", true, getDefinitionsByName(Arrays.asList(new String[]{"csa", "gender"})));
        widgets.add(program);

        ToggleWidgetData programToggle = new ToggleWidgetData();
        ToggleWidgetData.SkipData csaSkipper = programToggle.addOption("CSA");

        widgets.add(csaSkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.CSA_FLASHCARD, LinearLayout.HORIZONTAL, "CSA Flashcard being run", getDefinitions(Keys.CSA_FLASHCARD), true).addHeader("CSA Program").hideView()));
        widgets.add(csaSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CSA_REVISION_OR_FIRSTTIME, "Revision or first time flashcard is being taught", true, "Revision", "First time").hideView()));

        ScoreWidget csaScoreWidget = new ScoreWidget(context, Keys.CSA_PROGRAM_SCORE, Keys.CSA_PROGRAM_SCORE_PCT);
        ScoreCalculator csaScoreCalculator = new ScoreCalculator(csaScoreWidget);

        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_USING_FLASHCARD, "The teacher is using the prompts provided in the CSA flashcard guide", true).setScoreListener(csaScoreCalculator).addHeader("Facilitation")).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_MEETING_OBJECTIVE, "The teacher is meeting the objective of each flashcard even if they are not using all prompts provided in the CSA flashcard guide ", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_HAD_MATERIAL, "The teacher had all materials prepared in advance for the class", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_WELL_PREPARED, "The teacher was well prepared to facilitate the session", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TIME_ALLOTED_FOR_ACTIVITY, "An appropriate amount of time is allotted for each activity and topic", true).setScoreListener(csaScoreCalculator)).hideView());

        RadioWidget newActivity = new RadioWidget(context, Keys.NEW_ACTIVITIES, "Teacher has gone beyond the teacher's guide to build on and/or develop new activities", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(newActivity.setScoreListener(csaScoreCalculator)).hideView());
        ToggleWidgetData toggleActivities = new ToggleWidgetData();
        ToggleWidgetData.SkipData activitySkipper = toggleActivities.addOption("Yes");
        widgets.add(activitySkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.TEACHERS_NEW, LinearLayout.VERTICAL, "What has the teacher done that is new?", getDefinitions(Keys.TEACHERS_NEW), true).hideView()).hideView());
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

        RadioWidget frequency = new RadioWidget(context, Keys.CLASS_FREQUENCY, "Frequency of class in time table", true, getDefinitions(Keys.CLASS_FREQUENCY));
        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER_CLASS_FREQUENCY, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build();
        ToggleWidgetData togglerFrequency = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = togglerFrequency.addOption("Yes");
        skipData.addWidgetToToggle(frequency);
        skipData.build();
        widgets.add(frequency.hideView());
        timetable.addDependentWidgets(togglerFrequency.getToggleMap());

        MultiSwitcher multiSwitcher = new MultiSwitcher(timetable, frequency);
        multiSwitcher.addNewOption().addKeys("Yes", "Other").addWidgets(other).build();
        frequency.setMultiSwitchListenerList(multiSwitcher);
        timetable.setMultiSwitchListenerList(multiSwitcher);
        widgets.add(other.hideView());

        widgets.add(csaSkipper.addWidgetToToggle(new RadioWidget(context, Keys.TWO_TEACHER_CSA, "There are at least 2 teachers assigned to teach the CSA program", true, "Yes", "No").setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.EXCELLENT_COORDINATION, "There is excellent coordination between management and teachers regarding the CSA program", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.MASTER_TRAINERS, "Number of Master Training leading CSA program", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.COORDINATION_WITH_MASTER_TRAINERS, "There is excellent coordination between Master Trainers and teachers regarding the CSA program", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_CONDUCT_SESSION, "Master Trainer conduct regular monitoring sessions to maintain quality of CSA program", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.MASTER_TRAINER_REFRESHER_TRAINING, "Master Trainer arrange and conduct refresher trainings as needed for CSA teachers", true).setScoreListener(csaScoreCalculator)).hideView());

        widgets.add(csaSkipper.addWidgetToToggle(csaScoreWidget).hideView());

        RadioWidget scheduleCSA = new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_CSA, "The school is facing challenges scheduling the CSA class", true, getDefinitions(Keys.CHALLENGE_SCHEDULING_CSA));
        widgets.add(csaSkipper.addWidgetToToggle(scheduleCSA.addHeader("Challenges")).hideView());
        ToggleWidgetData challengeToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_CSA_STATUS, "Status of Challenge", true, getDefinitions(Keys.CHALLENGE_SCHEDULING_CSA_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        scheduleCSA.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget enoughResource = new RadioWidget(context, Keys.ENOUGH_RESOURCES, "There are not enough resources", true, getDefinitions(Keys.ENOUGH_RESOURCES));
        widgets.add(csaSkipper.addWidgetToToggle(enoughResource).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.ENOUGH_RESOURCES_STATUS, "Status of Challenge", true, getDefinitions(Keys.ENOUGH_RESOURCES_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        enoughResource.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noRoom = new RadioWidget(context, Keys.NO_ROOM_FOR_CLASS, "There is no room for the class", true, getDefinitions(Keys.NO_ROOM_FOR_CLASS));
        widgets.add(csaSkipper.addWidgetToToggle(noRoom).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_ROOM_STATUS, "Status of Challenge", true, getDefinitions(Keys.NO_ROOM_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        noRoom.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noTeacher = new RadioWidget(context, Keys.NO_TEACHER_FOR_CLASS, "There are not enough teachers to teach the CSA class", true, getDefinitions(Keys.NO_TEACHER_FOR_CLASS));
        widgets.add(csaSkipper.addWidgetToToggle(noTeacher).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_TEACHER_STATUS, "Status of Challenge", true, getDefinitions(Keys.NO_TEACHER_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        noTeacher.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget irreleventContent = new RadioWidget(context, Keys.IRRELEVENT_CONTENT, "The content is irrelevent for the context of the students", true, getDefinitions(Keys.IRRELEVENT_CONTENT));
        widgets.add(csaSkipper.addWidgetToToggle(irreleventContent).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.IRRELEVENT_CONTENT_STATUS, "Status of Challenge", true, getDefinitions(Keys.IRRELEVENT_CONTENT_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        irreleventContent.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget studentNotInterested = new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED, "Student are not interested in the content", true, getDefinitions(Keys.STUDENT_NOT_INTERESTED));
        widgets.add(csaSkipper.addWidgetToToggle(studentNotInterested).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED_STATUS, "Status of Challenge", true, getDefinitions(Keys.STUDENT_NOT_INTERESTED_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        studentNotInterested.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget resourceRequire = new RadioWidget(context, Keys.SCHOOL_REQUIRE_RESOURCES, "Does this school require any resources?", true, getDefinitions(Keys.SCHOOL_REQUIRE_RESOURCES));
        widgets.add(csaSkipper.addWidgetToToggle(resourceRequire.addHeader("Resources")).hideView());
        ToggleWidgetData resourceToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData resourceSkipper = resourceToggler.addOption("Yes");
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_FLASHCARD_GUIDES, "CSA Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        final EditTextWidget resourceRequireQuantity = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build();
        final Widget resourceRequireOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_REQUIRE_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        resourceRequireQuantity.setWidgetListener(new QuantityChangeListener(resourceRequireOther));
        widgets.add(resourceSkipper.addWidgetToToggle(resourceRequireQuantity.hideView()));
        widgets.add(resourceRequireOther);


        resourceSkipper.build();
        resourceRequire.addDependentWidgets(resourceToggler.getToggleMap());

        RadioWidget resourceDistributed = new RadioWidget(context, Keys.CSA_SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, getDefinitions(Keys.CSA_SCHOOL_RESOURCES_DISTRIBUTED));
        widgets.add(csaSkipper.addWidgetToToggle(resourceDistributed).hideView());
        resourceToggler = new ToggleWidgetData();
        resourceSkipper = resourceToggler.addOption("Yes");
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_FLASHCARD_GUIDES, "CSA Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        widgets.add(resourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        final EditTextWidget resourceDistributedQuantity = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).build();
        final Widget resourceDistributedOther = new EditTextWidget.Builder(context, Keys.CSA_RESOURCES_DISTRIBUTED_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        resourceDistributedQuantity.setWidgetListener(new QuantityChangeListener(resourceDistributedOther));
        widgets.add(resourceSkipper.addWidgetToToggle(resourceDistributedQuantity.hideView()));
        widgets.add(resourceDistributedOther);


        resourceSkipper.build();
        resourceDistributed.addDependentWidgets(resourceToggler.getToggleMap());
        csaSkipper.build();

        ToggleWidgetData.SkipData genderSkipper = programToggle.addOption("Gender");
        widgets.add(genderSkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.GENDER_FLASHCARD_RUN, LinearLayout.VERTICAL, "Gender Flashcard being run", getDefinitions(Keys.GENDER_FLASHCARD_RUN), true).addHeader("Gender Program").hideView()));
        widgets.add(genderSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_REVISION_OR_FIRSTTIME, "Revision or first time flashcard is being taught", true, getDefinitions(Keys.GENDER_REVISION_OR_FIRSTTIME))).hideView());

        ScoreWidget genderScoreWidget = new ScoreWidget(context, Keys.GENDER_PROGRAM_SCORE, Keys.GENDER_PROGRAM_SCORE_PCT);
        ScoreCalculator genderScoreCalculator = new ScoreCalculator(genderScoreWidget);

        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_USING_FLASHCARD, "The teacher is using the prompts provided in the Gender flashcard guide", true).setScoreListener(genderScoreCalculator).addHeader("Facilitation")).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_MEETING_OBJECTIVE, "The teacher is meeting the objective of each flashcard even if they are not using all prompts provided in the Gender flashcard guide ", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_HAD_MATERIAL, "The teacher had all materials prepared in advance for the class", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_WELL_PREPARED, "The teacher was well prepared to facilitate the session", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TIME_ALLOTED_FOR_ACTIVITY, "An appropriate amount of time is allotted for each activity and topic", true).setScoreListener(genderScoreCalculator)).hideView());

        newActivity = new RadioWidget(context, Keys.GENDER_NEW_ACTIVITIES, "Teacher has gone beyond the teacher's guide to build on and/or develop new activities", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(newActivity.setScoreListener(genderScoreCalculator)).hideView());
        toggleActivities = new ToggleWidgetData();
        activitySkipper = toggleActivities.addOption("Yes");
        widgets.add(activitySkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.GENDER_TEACHERS_NEW, LinearLayout.VERTICAL, "What has the teacher done that is new?", getDefinitions(Keys.TEACHERS_NEW), true, context.getResources().getStringArray(R.array.activities)).hideView()).hideView());
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

        RadioWidget genderFrequency = new RadioWidget(context, Keys.GENDER_CLASS_FREQUENCY, "Frequency of class in time table", true, getDefinitions(Keys.GENDER_CLASS_FREQUENCY));
        EditTextWidget genderOther = new EditTextWidget.Builder(context, Keys.GENDER_OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build();
        ToggleWidgetData genderTogglerFrequency = new ToggleWidgetData();
        ToggleWidgetData.SkipData genderSkipData = genderTogglerFrequency.addOption("Yes");
        genderSkipData.addWidgetToToggle(genderFrequency);
        genderSkipData.build();
        widgets.add(genderFrequency.hideView());
        genderManagement.addDependentWidgets(genderTogglerFrequency.getToggleMap());

        MultiSwitcher genderMultiSwitcher = new MultiSwitcher(genderManagement, genderFrequency);
        genderMultiSwitcher.addNewOption().addKeys("Yes", "Other").addWidgets(genderOther).build();
        genderFrequency.setMultiSwitchListenerList(genderMultiSwitcher);
        genderManagement.setMultiSwitchListenerList(genderMultiSwitcher);
        widgets.add(genderOther.hideView());


        widgets.add(genderSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_TWO_TEACHER_CSA, "There are at least 2 teachers assigned to teach the Gender program", true, "Yes", "No").setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_EXCELLENT_COORDINATION, "There is excellent coordination between management and teachers regarding the Gender program", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(genderScoreWidget).hideView());


        RadioWidget scheduleGender = new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_GENDER, "The school is facing challenges scheduling the Gender class", true, getDefinitions(Keys.CHALLENGE_SCHEDULING_GENDER));
        widgets.add(genderSkipper.addWidgetToToggle(scheduleGender.addHeader("Challenges")).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_GENDER_STATUS, "Status of Challenge", true, getDefinitions(Keys.CHALLENGE_SCHEDULING_GENDER_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        scheduleGender.addDependentWidgets(challengeToggler.getToggleMap());

        enoughResource = new RadioWidget(context, Keys.GENDER_ENOUGH_RESOURCES, "There are not enough resources", true, getDefinitions(Keys.GENDER_ENOUGH_RESOURCES));
        widgets.add(genderSkipper.addWidgetToToggle(enoughResource).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_ENOUGH_RESOURCES_STATUS, "Status of Challenge", true, getDefinitions(Keys.GENDER_ENOUGH_RESOURCES_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        enoughResource.addDependentWidgets(challengeToggler.getToggleMap());

        noRoom = new RadioWidget(context, Keys.GENDER_NO_ROOM_FOR_CLASS, "There is no room for the class", true, getDefinitions(Keys.GENDER_NO_ROOM_FOR_CLASS));
        widgets.add(genderSkipper.addWidgetToToggle(noRoom).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_NO_ROOM_FOR_CLASS_STATUS, "Status of Challenge", true, getDefinitions(Keys.GENDER_NO_ROOM_FOR_CLASS_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        noRoom.addDependentWidgets(challengeToggler.getToggleMap());

        noTeacher = new RadioWidget(context, Keys.GENDER_NO_TEACHER_FOR_CLASS, "There are not enough teachers to teach the Gender class", true, getDefinitions(Keys.GENDER_NO_TEACHER_FOR_CLASS));
        widgets.add(genderSkipper.addWidgetToToggle(noTeacher).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_NO_TEACHER_FOR_CLASS_STATUS, "Status of Challenge", true, getDefinitions(Keys.GENDER_NO_TEACHER_FOR_CLASS_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        noTeacher.addDependentWidgets(challengeToggler.getToggleMap());

        irreleventContent = new RadioWidget(context, Keys.GENDER_IRRELEVENT_CONTENT, "The content is irrelevent for the context of the students", true, getDefinitions(Keys.GENDER_IRRELEVENT_CONTENT));
        widgets.add(genderSkipper.addWidgetToToggle(irreleventContent).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_IRRELEVENT_CONTENT_STATUS, "Status of Challenge", true, getDefinitions(Keys.GENDER_IRRELEVENT_CONTENT_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        irreleventContent.addDependentWidgets(challengeToggler.getToggleMap());

        studentNotInterested = new RadioWidget(context, Keys.GENDER_STUDENT_NOT_INTERESTED, "Student are not interested in the content", true, getDefinitions(Keys.GENDER_STUDENT_NOT_INTERESTED));
        widgets.add(genderSkipper.addWidgetToToggle(studentNotInterested).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_STUDENT_NOT_INTERESTED_STATUS, "Status of Challenge", true, getDefinitions(Keys.GENDER_STUDENT_NOT_INTERESTED_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        studentNotInterested.addDependentWidgets(challengeToggler.getToggleMap());


        RadioWidget genderResourceRequire = new RadioWidget(context, Keys.GENDER_SCHOOL_REQUIRE_RESOURCES, "Does this school require any resources?", true, getDefinitions(Keys.GENDER_SCHOOL_REQUIRE_RESOURCES));
        widgets.add(genderSkipper.addWidgetToToggle(genderResourceRequire.addHeader("Resources")).hideView());
        ToggleWidgetData genderResourceToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData genderResourceSkipper = genderResourceToggler.addOption("Yes");
        widgets.add(genderResourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_FLASHCARD_GUIDES, "Gender Flashcard Guides", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        widgets.add(genderResourceSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_DRAWING_BOOKS, "Drawing Books", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        EditTextWidget otherResourceQuantity = new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_OTHER_QUANTITY, "Other Resource", InputType.TYPE_CLASS_NUMBER, THREE, false).setMinimumValue(ONE).setInputRange(1, 999999).build();
        Widget otherResource = new EditTextWidget.Builder(context, Keys.GENDER_RESOURCES_REQUIRE_OTHER, "Specify other type of resource", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).build().hideView();
        otherResourceQuantity.setWidgetListener(new QuantityChangeListener(otherResource));
        widgets.add(genderResourceSkipper.addWidgetToToggle(otherResourceQuantity).hideView());
        widgets.add(otherResource);
        genderResourceSkipper.build();
        genderResourceRequire.addDependentWidgets(genderResourceToggler.getToggleMap());

        RadioWidget genderResourceDistributed = new RadioWidget(context, Keys.GENDER_SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, getDefinitions(Keys.GENDER_SCHOOL_RESOURCES_DISTRIBUTED));
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
        UserWidget userWidget = new UserWidget(context, Keys.MONITOR, Keys.USER_ID, "Monitored By").enableStringJson();
        widgets.add(userWidget);
        dataRepository.getUsersByRole(userWidget, getRoleByName(Keys.ROLE_LSE_MONITOR));

        DataUpdater dataUpdater = new DataUpdater(context, database.getMetadataDao());
        FormUpdateListener updateListener = new FormUpdateListener(dataUpdater, IDType.SCHOOL_ID);

        TextWidget schoolClassification = new TextWidget(context, getLocationAttribute(Keys.school_sex), "Classification of School by Sex").enabledViewOnly();
        widgets.add(dataUpdater.add(schoolClassification));

        updateListener.onItemAdded(GlobalConstants.selectedSchool.getShortName());

        RadioWidget classClassification = new RadioWidget(context, Keys.CLASS_CLASSIFICATION, "Students in Class by Sex", true, getDefinitions(Keys.CLASS_CLASSIFICATION));
        widgets.add(classClassification);
        schoolClassification.setListeners(new ClassificationListener(classClassification));


        UserWidget teacher = new UserWidget(context, Keys.PARTICIPANT_ID, "Teacher", new ArrayList<BaseItem>()).enableSingleSelect().enableStringJson();
        widgets.add(teacher);
        dataRepository.getParticipant(teacher, FormSection.LSE);

        widgets.add(new RadioWidget(context, Keys.CLASS, "Class", true, getDefinitions(Keys.CLASS)));
        widgets.add(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENTS, "Number of Students in Class", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).setInputRange(1, 999999).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.DURATION_OF_CLASS, "Time duration of class in minutes", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build());

        RadioWidget program = new RadioWidget(context, Keys.PRIMARY_PROGRAM, "Primary Program", true, getDefinitionsByName(Arrays.asList(new String[]{"csa", "gender"})));
        widgets.add(program);

        ToggleWidgetData programToggle = new ToggleWidgetData();
        ToggleWidgetData.SkipData csaSkipper = programToggle.addOption("CSA");

        widgets.add(csaSkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.CSA_FLASHCARD, LinearLayout.VERTICAL, "CSA Flashcard being run", getDefinitions(Keys.CSA_FLASHCARD), true).addHeader("CSA Program").hideView()));
        widgets.add(csaSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CSA_REVISION_OR_FIRSTTIME, "Revision or first time flashcard is being taught", true, getDefinitions(Keys.CSA_REVISION_OR_FIRSTTIME))).hideView());

        ScoreWidget csaScoreWidget = new ScoreWidget(context, Keys.CSA_PROGRAM_SCORE, Keys.CSA_PROGRAM_SCORE_PCT);
        ScoreCalculator csaScoreCalculator = new ScoreCalculator(csaScoreWidget);

        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_USING_FLASHCARD, "The teacher is using the prompts provided in the CSA flashcard guide", true).setScoreListener(csaScoreCalculator).addHeader("Facilitation")).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_MEETING_OBJECTIVE, "The teacher is meeting the objective of each flashcard even if they are not using all prompts provided in the CSA flashcard guide ", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_HAD_MATERIAL, "The teacher had all materials prepared in advance for the class", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TEACHER_WELL_PREPARED, "The teacher was well prepared to facilitate the session", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.TIME_ALLOTED_FOR_ACTIVITY, "An appropriate amount of time is allotted for each activity and topic", true).setScoreListener(csaScoreCalculator)).hideView());

        RadioWidget newActivity = new RadioWidget(context, Keys.NEW_ACTIVITIES, "Teacher has gone beyond the teacher's guide to build on and/or develop new activities", true, "Yes", "No");
        widgets.add(csaSkipper.addWidgetToToggle(newActivity.setScoreListener(csaScoreCalculator)).hideView());
        ToggleWidgetData toggleActivities = new ToggleWidgetData();
        ToggleWidgetData.SkipData activitySkipper = toggleActivities.addOption("Yes");
        widgets.add(activitySkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.TEACHERS_NEW, LinearLayout.VERTICAL, "What has the teacher done that is new?", getDefinitions(Keys.TEACHERS_NEW), true)).hideView());
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

        RadioWidget frequency = new RadioWidget(context, Keys.CLASS_FREQUENCY, "Frequency of class in time table", true, getDefinitions(Keys.CLASS_FREQUENCY));
        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER_CLASS_FREQUENCY, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build();
        ToggleWidgetData togglerFrequency = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = togglerFrequency.addOption("Yes");
        skipData.addWidgetToToggle(frequency);
        skipData.build();
        widgets.add(frequency.hideView());
        timetable.addDependentWidgets(togglerFrequency.getToggleMap());

        MultiSwitcher multiSwitcher = new MultiSwitcher(timetable, frequency);
        multiSwitcher.addNewOption().addKeys("Yes", "Other").addWidgets(other).build();
        frequency.setMultiSwitchListenerList(multiSwitcher);
        timetable.setMultiSwitchListenerList(multiSwitcher);
        widgets.add(other.hideView());


        widgets.add(csaSkipper.addWidgetToToggle(new RadioWidget(context, Keys.TWO_TEACHER_CSA, "There are at least 2 teachers assigned to teach the CSA program", true, "Yes", "No").setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.EXCELLENT_COORDINATION, "There is excellent coordination between management and teachers regarding the CSA program", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(csaScoreWidget).hideView());

        RadioWidget scheduleCSA = new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_CSA, "The school is facing challenges scheduling the CSA class", true, getDefinitions(Keys.CHALLENGE_SCHEDULING_CSA));
        widgets.add(csaSkipper.addWidgetToToggle(scheduleCSA.addHeader("Challenges")).hideView());
        ToggleWidgetData challengeToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_CSA_STATUS, "Status of Challenge", true, getDefinitions(Keys.CHALLENGE_SCHEDULING_CSA_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        scheduleCSA.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget enoughResource = new RadioWidget(context, Keys.ENOUGH_RESOURCES, "There are not enough resources", true, getDefinitions(Keys.ENOUGH_RESOURCES));
        widgets.add(csaSkipper.addWidgetToToggle(enoughResource).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.ENOUGH_RESOURCES_STATUS, "Status of Challenge", true, getDefinitions(Keys.ENOUGH_RESOURCES_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        enoughResource.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noRoom = new RadioWidget(context, Keys.NO_ROOM_FOR_CLASS, "There is no room for the class", true, getDefinitions(Keys.NO_ROOM_FOR_CLASS));
        widgets.add(csaSkipper.addWidgetToToggle(noRoom).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_ROOM_STATUS, "Status of Challenge", true, getDefinitions(Keys.NO_ROOM_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        noRoom.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noTeacher = new RadioWidget(context, Keys.NO_TEACHER_FOR_CLASS, "There are not enough teachers to teach the CSA class", true, getDefinitions(Keys.NO_TEACHER_FOR_CLASS));
        widgets.add(csaSkipper.addWidgetToToggle(noTeacher).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_TEACHER_STATUS, "Status of Challenge", true, getDefinitions(Keys.NO_TEACHER_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        noTeacher.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget irreleventContent = new RadioWidget(context, Keys.IRRELEVENT_CONTENT, "The content is irrelevent for the context of the students", true, getDefinitions(Keys.IRRELEVENT_CONTENT));
        widgets.add(csaSkipper.addWidgetToToggle(irreleventContent).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.IRRELEVENT_CONTENT_STATUS, "Status of Challenge", true, getDefinitions(Keys.IRRELEVENT_CONTENT_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        irreleventContent.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget studentNotInterested = new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED, "Student are not interested in the content", true, getDefinitions(Keys.STUDENT_NOT_INTERESTED));
        widgets.add(csaSkipper.addWidgetToToggle(studentNotInterested).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED_STATUS, "Status of Challenge", true, getDefinitions(Keys.STUDENT_NOT_INTERESTED_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        studentNotInterested.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget resourceRequire = new RadioWidget(context, Keys.SCHOOL_REQUIRE_RESOURCES, "Does this school require any resources?", true, getDefinitions(Keys.SCHOOL_REQUIRE_RESOURCES));
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

        RadioWidget resourceDistributed = new RadioWidget(context, Keys.CSA_SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, getDefinitions(Keys.CSA_SCHOOL_RESOURCES_DISTRIBUTED));
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
        widgets.add(genderSkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.GENDER_FLASHCARD_RUN, LinearLayout.VERTICAL, "Gender Flashcard being run", getDefinitions(Keys.GENDER_FLASHCARD_RUN), true, context.getResources().getStringArray(R.array.gender_flashcard)).addHeader("Gender Program").hideView()));
        widgets.add(genderSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_REVISION_OR_FIRSTTIME, "Revision or first time flashcard is being taught", true, getDefinitions(Keys.GENDER_REVISION_OR_FIRSTTIME))));

        ScoreWidget genderScoreWidget = new ScoreWidget(context, Keys.GENDER_PROGRAM_SCORE, Keys.GENDER_PROGRAM_SCORE_PCT);
        ScoreCalculator genderScoreCalculator = new ScoreCalculator(genderScoreWidget);

        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_USING_FLASHCARD, "The teacher is using the prompts provided in the Gender flashcard guide", true).setScoreListener(genderScoreCalculator).addHeader("Facilitation")).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_MEETING_OBJECTIVE, "The teacher is meeting the objective of each flashcard even if they are not using all prompts provided in the Gender flashcard guide ", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_HAD_MATERIAL, "The teacher had all materials prepared in advance for the class", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TEACHER_WELL_PREPARED, "The teacher was well prepared to facilitate the session", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_TIME_ALLOTED_FOR_ACTIVITY, "An appropriate amount of time is allotted for each activity and topic", true).setScoreListener(genderScoreCalculator)).hideView());

        newActivity = new RadioWidget(context, Keys.GENDER_NEW_ACTIVITIES, "Teacher has gone beyond the teacher's guide to build on and/or develop new activities", true, "Yes", "No");
        widgets.add(genderSkipper.addWidgetToToggle(newActivity.setScoreListener(genderScoreCalculator)).hideView());
        toggleActivities = new ToggleWidgetData();
        activitySkipper = toggleActivities.addOption("Yes");
        widgets.add(activitySkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.GENDER_TEACHERS_NEW, LinearLayout.VERTICAL, "What has the teacher done that is new?", getDefinitions(Keys.GENDER_TEACHERS_NEW), true).hideView()).hideView());
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

        RadioWidget genderFrequency = new RadioWidget(context, Keys.GENDER_CLASS_FREQUENCY, "Frequency of class in time table", true, getDefinitions(Keys.GENDER_CLASS_FREQUENCY));
        EditTextWidget genderOther = new EditTextWidget.Builder(context, Keys.GENDER_OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build();
        ToggleWidgetData genderTogglerFrequency = new ToggleWidgetData();
        ToggleWidgetData.SkipData genderSkipData = genderTogglerFrequency.addOption("Yes");
        genderSkipData.addWidgetToToggle(genderFrequency);
        genderSkipData.build();
        widgets.add(genderFrequency.hideView());
        genderManagement.addDependentWidgets(genderTogglerFrequency.getToggleMap());

        MultiSwitcher genderMultiSwitcher = new MultiSwitcher(genderManagement, genderFrequency);
        genderMultiSwitcher.addNewOption().addKeys("Yes", "Other").addWidgets(genderOther).build();
        genderFrequency.setMultiSwitchListenerList(genderMultiSwitcher);
        genderManagement.setMultiSwitchListenerList(genderMultiSwitcher);
        widgets.add(genderOther.hideView());


        widgets.add(genderSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_TWO_TEACHER_CSA, "There are at least 2 teachers assigned to teach the Gender program", true, "Yes", "No").setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_EXCELLENT_COORDINATION, "There is excellent coordination between management and teachers regarding the Gender program", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(genderScoreWidget).hideView());


        RadioWidget scheduleGender = new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_GENDER, "The school is facing challenges scheduling the Gender class", true, getDefinitions(Keys.CHALLENGE_SCHEDULING_GENDER));
        widgets.add(genderSkipper.addWidgetToToggle(scheduleGender.addHeader("Challenges")).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_GENDER_STATUS, "Status of Challenge", true, getDefinitions(Keys.CHALLENGE_SCHEDULING_GENDER_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        scheduleGender.addDependentWidgets(challengeToggler.getToggleMap());

        enoughResource = new RadioWidget(context, Keys.GENDER_ENOUGH_RESOURCES, "There are not enough resources", true, getDefinitions(Keys.GENDER_ENOUGH_RESOURCES));
        widgets.add(genderSkipper.addWidgetToToggle(enoughResource).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_ENOUGH_RESOURCES_STATUS, "Status of Challenge", true, getDefinitions(Keys.GENDER_ENOUGH_RESOURCES_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        enoughResource.addDependentWidgets(challengeToggler.getToggleMap());

        noRoom = new RadioWidget(context, Keys.GENDER_NO_ROOM_FOR_CLASS, "There is no room for the class", true, getDefinitions(Keys.GENDER_NO_ROOM_FOR_CLASS));
        widgets.add(genderSkipper.addWidgetToToggle(noRoom).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_NO_ROOM_FOR_CLASS_STATUS, "Status of Challenge", true, getDefinitions(Keys.GENDER_NO_ROOM_FOR_CLASS_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        noRoom.addDependentWidgets(challengeToggler.getToggleMap());

        noTeacher = new RadioWidget(context, Keys.GENDER_NO_TEACHER_FOR_CLASS, "There are not enough teachers to teach the Gender class", true, getDefinitions(Keys.GENDER_NO_TEACHER_FOR_CLASS));
        widgets.add(genderSkipper.addWidgetToToggle(noTeacher).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_NO_TEACHER_FOR_CLASS_STATUS, "Status of Challenge", true, getDefinitions(Keys.GENDER_NO_TEACHER_FOR_CLASS_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        noTeacher.addDependentWidgets(challengeToggler.getToggleMap());

        irreleventContent = new RadioWidget(context, Keys.GENDER_IRRELEVENT_CONTENT, "The content is irrelevent for the context of the students", true, getDefinitions(Keys.GENDER_IRRELEVENT_CONTENT));
        widgets.add(genderSkipper.addWidgetToToggle(irreleventContent).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_IRRELEVENT_CONTENT_STATUS, "Status of Challenge", true, getDefinitions(Keys.GENDER_IRRELEVENT_CONTENT_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        irreleventContent.addDependentWidgets(challengeToggler.getToggleMap());

        studentNotInterested = new RadioWidget(context, Keys.GENDER_STUDENT_NOT_INTERESTED, "Student are not interested in the content", true, getDefinitions(Keys.GENDER_STUDENT_NOT_INTERESTED));
        widgets.add(genderSkipper.addWidgetToToggle(studentNotInterested).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_STUDENT_NOT_INTERESTED_STATUS, "Status of Challenge", true, getDefinitions(Keys.GENDER_STUDENT_NOT_INTERESTED_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        studentNotInterested.addDependentWidgets(challengeToggler.getToggleMap());


        RadioWidget genderResourceRequire = new RadioWidget(context, Keys.GENDER_SCHOOL_REQUIRE_RESOURCES, "Does this school require any resources?", true, getDefinitions(Keys.GENDER_SCHOOL_REQUIRE_RESOURCES));
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

        RadioWidget genderResourceDistributed = new RadioWidget(context, Keys.GENDER_SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, getDefinitions(Keys.GENDER_SCHOOL_RESOURCES_DISTRIBUTED));
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

        UserWidget userWidget = new UserWidget(context, Keys.MONITOR, Keys.USER_ID, "Monitored By").enableStringJson();
        widgets.add(userWidget);
        dataRepository.getUsersByRole(userWidget, getRoleByName(Keys.ROLE_LSE_MONITOR));

        DataUpdater dataUpdater = new DataUpdater(context, database.getMetadataDao());
        FormUpdateListener updateListener = new FormUpdateListener(dataUpdater, IDType.SCHOOL_ID);

        TextWidget schoolClassification = new TextWidget(context, getLocationAttribute(Keys.school_sex), "Classification of School by Sex").enabledViewOnly();
        widgets.add(dataUpdater.add(schoolClassification).hideView());

        updateListener.onItemAdded(GlobalConstants.selectedSchool.getShortName());

        RadioWidget classClassification = new RadioWidget(context, Keys.CLASS_CLASSIFICATION, "Students in Class by Sex", true, getDefinitions(Keys.CLASS_CLASSIFICATION));
        widgets.add(classClassification);
        schoolClassification.setListeners(new ClassificationListener(classClassification));

        UserWidget teacher = new UserWidget(context, PARTICIPANT_ID, "Name of Teacher", new ArrayList<BaseItem>()).enableSingleSelect().enableStringJson();
        widgets.add(teacher);
        dataRepository.getParticipant(teacher, FormSection.LSE);

        widgets.add(new RadioWidget(context, Keys.CLASS, "Class", true, getDefinitions(Keys.CLASS)));

        widgets.add(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENTS, "Number of Students in Class", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).setInputRange(1, 999999).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.DURATION_OF_CLASS, "Time duration of class in minutes", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build());
        RadioWidget program = new RadioWidget(context, Keys.PRIMARY_PROGRAM, "Primary Program", true, getDefinitionsByName(Arrays.asList(new String[]{"csa", "gender"})));
        widgets.add(program);
        ToggleWidgetData programToggle = new ToggleWidgetData();
        ToggleWidgetData.SkipData csaSkipper = programToggle.addOption("CSA");

        widgets.add(csaSkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.CSA_FLASHCARD, LinearLayout.VERTICAL, "CSA Flashcard being run", getDefinitions(Keys.CSA_FLASHCARD), true).addHeader("CSA Program").hideView()));
        widgets.add(csaSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CSA_REVISION_OR_FIRSTTIME, "Revision or first time flashcard is being taught", true, getDefinitions(Keys.CSA_REVISION_OR_FIRSTTIME)/*"Revision", "First time"*/)).hideView());

        ScoreWidget csaScoreWidget = new ScoreWidget(context, Keys.CSA_PROGRAM_SCORE, Keys.CSA_PROGRAM_SCORE_PCT);
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

        RadioWidget frequency = new RadioWidget(context, Keys.CLASS_FREQUENCY, "Frequency of class in time table", true, getDefinitions(Keys.CLASS_FREQUENCY));
        EditTextWidget other = new EditTextWidget.Builder(context, Keys.OTHER_CLASS_FREQUENCY, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build();
        ToggleWidgetData togglerFrequency = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = togglerFrequency.addOption("Yes");
        skipData.addWidgetToToggle(frequency);
        skipData.build();
        widgets.add(frequency.hideView());
        timetable.addDependentWidgets(togglerFrequency.getToggleMap());

        MultiSwitcher multiSwitcher = new MultiSwitcher(timetable, frequency);
        multiSwitcher.addNewOption().addKeys("Yes", "Other").addWidgets(other).build();
        frequency.setMultiSwitchListenerList(multiSwitcher);
        timetable.setMultiSwitchListenerList(multiSwitcher);
        widgets.add(other.hideView());


        widgets.add(csaSkipper.addWidgetToToggle(new RadioWidget(context, Keys.TWO_TEACHER_CSA, "There are at least 2 teachers assigned to teach the CSA program", true, "Yes", "No").setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(new RateWidget(context, Keys.EXCELLENT_COORDINATION, "There is excellent coordination between management and teachers regarding the CSA program", true).setScoreListener(csaScoreCalculator)).hideView());
        widgets.add(csaSkipper.addWidgetToToggle(csaScoreWidget).hideView());

        RadioWidget scheduleCSA = new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_CSA, "The school is facing challenges scheduling the CSA class", true, getDefinitions(Keys.CHALLENGE_SCHEDULING_CSA));
        widgets.add(csaSkipper.addWidgetToToggle(scheduleCSA.addHeader("Challenges")).hideView());
        ToggleWidgetData challengeToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_CSA_STATUS, "Status of Challenge", true, getDefinitions(Keys.CHALLENGE_SCHEDULING_CSA_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        scheduleCSA.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget enoughResource = new RadioWidget(context, Keys.ENOUGH_RESOURCES, "There are not enough resources", true, getDefinitions(Keys.ENOUGH_RESOURCES));
        widgets.add(csaSkipper.addWidgetToToggle(enoughResource).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.ENOUGH_RESOURCES_STATUS, "Status of Challenge", true, getDefinitions(Keys.ENOUGH_RESOURCES_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        enoughResource.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noRoom = new RadioWidget(context, Keys.NO_ROOM_FOR_CLASS, "There is no room for the class", true, getDefinitions(Keys.NO_ROOM_FOR_CLASS));
        widgets.add(csaSkipper.addWidgetToToggle(noRoom).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_ROOM_STATUS, "Status of Challenge", true, getDefinitions(Keys.NO_ROOM_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        noRoom.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget noTeacher = new RadioWidget(context, Keys.NO_TEACHER_FOR_CLASS, "There are not enough teachers to teach the CSA class", true, getDefinitions(Keys.NO_TEACHER_FOR_CLASS));
        widgets.add(csaSkipper.addWidgetToToggle(noTeacher).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.NO_TEACHER_STATUS, "Status of Challenge", true, getDefinitions(Keys.NO_TEACHER_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        noTeacher.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget irreleventContent = new RadioWidget(context, Keys.IRRELEVENT_CONTENT, "The content is irrelevent for the context of the students", true, getDefinitions(Keys.IRRELEVENT_CONTENT));
        widgets.add(csaSkipper.addWidgetToToggle(irreleventContent).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.IRRELEVENT_CONTENT_STATUS, "Status of Challenge", true, getDefinitions(Keys.IRRELEVENT_CONTENT_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        irreleventContent.addDependentWidgets(challengeToggler.getToggleMap());

        RadioWidget studentNotInterested = new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED, "Student are not interested in the content", true, getDefinitions(Keys.STUDENT_NOT_INTERESTED));
        widgets.add(csaSkipper.addWidgetToToggle(studentNotInterested).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.STUDENT_NOT_INTERESTED_STATUS, "Status of Challenge", true, getDefinitions(Keys.STUDENT_NOT_INTERESTED_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        studentNotInterested.addDependentWidgets(challengeToggler.getToggleMap());


        RadioWidget resourceRequire = new RadioWidget(context, Keys.SCHOOL_REQUIRE_RESOURCES, "Does this school require any resources?", true, getDefinitions(Keys.SCHOOL_REQUIRE_RESOURCES));
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

        RadioWidget resourceDistributed = new RadioWidget(context, Keys.CSA_SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, getDefinitions(Keys.CSA_SCHOOL_RESOURCES_DISTRIBUTED));
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
        widgets.add(genderSkipper.addWidgetToToggle(new MultiSelectWidget(context, Keys.GENDER_FLASHCARD_RUN, LinearLayout.VERTICAL, "Gender Flashcard being run", getDefinitions(Keys.GENDER_FLASHCARD_RUN), true).addHeader("Gender Program").hideView()));
        widgets.add(genderSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_REVISION_OR_FIRSTTIME, "Revision or first time flashcard is being taught", true, getDefinitions(Keys.GENDER_REVISION_OR_FIRSTTIME))));

        ScoreWidget genderScoreWidget = new ScoreWidget(context, Keys.GENDER_PROGRAM_SCORE, Keys.GENDER_PROGRAM_SCORE_PCT);
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

        RadioWidget genderFrequency = new RadioWidget(context, Keys.GENDER_CLASS_FREQUENCY, "Frequency of class in time table", true, getDefinitions(Keys.GENDER_CLASS_FREQUENCY));
        EditTextWidget genderOther = new EditTextWidget.Builder(context, Keys.GENDER_OTHER, "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build();
        ToggleWidgetData genderTogglerFrequency = new ToggleWidgetData();
        ToggleWidgetData.SkipData genderSkipData = genderTogglerFrequency.addOption("Yes");
        genderSkipData.addWidgetToToggle(genderFrequency);
        genderSkipData.build();
        widgets.add(genderFrequency.hideView());
        genderManagement.addDependentWidgets(genderTogglerFrequency.getToggleMap());

        MultiSwitcher genderMultiSwitcher = new MultiSwitcher(genderManagement, genderFrequency);
        genderMultiSwitcher.addNewOption().addKeys("Yes", "Other").addWidgets(genderOther).build();
        genderFrequency.setMultiSwitchListenerList(genderMultiSwitcher);
        genderManagement.setMultiSwitchListenerList(genderMultiSwitcher);
        widgets.add(genderOther.hideView());


        widgets.add(genderSkipper.addWidgetToToggle(new RateWidget(context, Keys.GENDER_EXCELLENT_COORDINATION, "There is excellent coordination between management and teachers regarding the Gender program", true).setScoreListener(genderScoreCalculator)).hideView());
        widgets.add(genderSkipper.addWidgetToToggle(genderScoreWidget).hideView());


        RadioWidget scheduleGender = new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_GENDER, "The school is facing challenges scheduling the Gender class", true, getDefinitions(Keys.CHALLENGE_SCHEDULING_GENDER));
        widgets.add(genderSkipper.addWidgetToToggle(scheduleGender.addHeader("Challenges")).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.CHALLENGE_SCHEDULING_GENDER_STATUS, "Status of Challenge", true, getDefinitions(Keys.CHALLENGE_SCHEDULING_GENDER_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        scheduleGender.addDependentWidgets(challengeToggler.getToggleMap());

        enoughResource = new RadioWidget(context, Keys.GENDER_ENOUGH_RESOURCES, "There are not enough resources", true, getDefinitions(Keys.GENDER_ENOUGH_RESOURCES));
        widgets.add(genderSkipper.addWidgetToToggle(enoughResource).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_ENOUGH_RESOURCES_STATUS, "Status of Challenge", true, getDefinitions(Keys.GENDER_ENOUGH_RESOURCES_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        enoughResource.addDependentWidgets(challengeToggler.getToggleMap());

        noRoom = new RadioWidget(context, Keys.GENDER_NO_ROOM_FOR_CLASS, "There is no room for the class", true, getDefinitions(Keys.GENDER_NO_ROOM_FOR_CLASS));
        widgets.add(genderSkipper.addWidgetToToggle(noRoom).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_NO_ROOM_FOR_CLASS_STATUS, "Status of Challenge", true, getDefinitions(Keys.GENDER_NO_ROOM_FOR_CLASS_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        noRoom.addDependentWidgets(challengeToggler.getToggleMap());

        noTeacher = new RadioWidget(context, Keys.GENDER_NO_TEACHER_FOR_CLASS, "There are not enough teachers to teach the Gender class", true, getDefinitions(Keys.GENDER_NO_TEACHER_FOR_CLASS));
        widgets.add(genderSkipper.addWidgetToToggle(noTeacher).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_NO_TEACHER_FOR_CLASS_STATUS, "Status of Challenge", true, getDefinitions(Keys.GENDER_NO_TEACHER_FOR_CLASS_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        noTeacher.addDependentWidgets(challengeToggler.getToggleMap());

        irreleventContent = new RadioWidget(context, Keys.GENDER_IRRELEVENT_CONTENT, "The content is irrelevent for the context of the students", true, getDefinitions(Keys.GENDER_IRRELEVENT_CONTENT));
        widgets.add(genderSkipper.addWidgetToToggle(irreleventContent).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_IRRELEVENT_CONTENT_STATUS, "Status of Challenge", true, getDefinitions(Keys.GENDER_IRRELEVENT_CONTENT_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        irreleventContent.addDependentWidgets(challengeToggler.getToggleMap());

        studentNotInterested = new RadioWidget(context, Keys.GENDER_STUDENT_NOT_INTERESTED, "Student are not interested in the content", true, getDefinitions(Keys.GENDER_STUDENT_NOT_INTERESTED));
        widgets.add(genderSkipper.addWidgetToToggle(studentNotInterested).hideView());
        challengeToggler = new ToggleWidgetData();
        challengeSkipper = challengeToggler.addOption("Yes");
        widgets.add(challengeSkipper.addWidgetToToggle(new RadioWidget(context, Keys.GENDER_STUDENT_NOT_INTERESTED_STATUS, "Status of Challenge", true, getDefinitions(Keys.GENDER_STUDENT_NOT_INTERESTED_STATUS)).hideView()).hideView());
        challengeSkipper.build();
        studentNotInterested.addDependentWidgets(challengeToggler.getToggleMap());


        resourceRequire = new RadioWidget(context, Keys.GENDER_SCHOOL_REQUIRE_RESOURCES, "Does this school require any resources?", true, getDefinitions(Keys.GENDER_SCHOOL_REQUIRE_RESOURCES));
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

        resourceDistributed = new RadioWidget(context, Keys.GENDER_SCHOOL_RESOURCES_DISTRIBUTED, "Were any resources distributed to this school in this visit?", true, getDefinitions(Keys.GENDER_SCHOOL_RESOURCES_DISTRIBUTED));
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

        DataUpdater dataUpdater = new DataUpdater(context, database.getMetadataDao());
        FormUpdateListener formUpdateListener = new FormUpdateListener(dataUpdater, IDType.SCHOOL_ID);

        TextWidget startDate = new TextWidget(context, getLocationAttribute(partnership_start_date), "Date partnership with Aahung was formed").enabledViewOnly();
        widgets.add(dataUpdater.add(startDate));
        DateWidget partnershipEnds = new DateWidget(context, getLocationAttribute(partnership_end_date), "Date partnership with Aahung ended", true);
        TextWidget partnershipYears = new TextWidget(context, getLocationAttribute(Keys.partnership_years), "Number of years of partnership");

        DateWatcher dateWatcher = new DateWatcher(partnershipEnds);
        startDate.setDateChangeListener(dateWatcher, DateType.START);
        partnershipEnds.setDateChangeListener(dateWatcher, DateType.END);

        partnershipEnds.setWidgetChangeListener(new YearsCalculator(partnershipYears).setCalculateBetweenDates(startDate));
        widgets.add(partnershipEnds);
        widgets.add(partnershipYears);

        widgets.add(dataUpdater.add(new TextWidget(context, getLocationAttribute(Keys.school_type), "Type of School").enabledViewOnly()).hideView());

        widgets.add(dataUpdater.add(new TextWidget(context, getLocationAttribute(Keys.school_level), "Level of Program").enabledViewOnly()).hideView());

        widgets.add(dataUpdater.add(new TextWidget(context, getLocationAttribute(Keys.program_implemented), "Type of program(s) implemented in school").enabledViewOnly()).hideView());

        formUpdateListener.onItemAdded(GlobalConstants.selectedSchool.getShortName());

        widgets.add(new RadioWidget(context, getLocationAttribute(Keys.school_tier), "School Tier", true, getDefinitions(Keys.school_tier)));
        widgets.add(new EditTextWidget.Builder(context, getLocationAttribute(Keys.end_partnership_reason), "Reason for end of partnership", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build());


        return widgets;
    }

    private List<Widget> getParticipantDetailsWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DefinitionWidget(context, Keys.COUNTRY, PAKISTAN).disableChildObject());
        widgets.add(new DefinitionWidget(context, getParticipantAttribute(Keys.LSE_TEACHER_PARTICIPANT), true));

        widgets.add(new TextWidget(context, Keys.IDENTIFIER, "Teacher ID").setText(IDGenerator.getEncodedID()));
        widgets.add(new EditTextWidget.Builder(context, Keys.FIRST_NAME, "Teacher Name", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new DateWidget(context, Keys.DATE_OF_BIRTH, "Date of Birth", true));

        widgets.add(new RadioWidget(context, Keys.GENDER, "Sex", true, "Male", "Female", "Other"));
        MultiSelectWidget subjects = new MultiSelectWidget(context, getParticipantAttribute(Keys.subject_taught), LinearLayout.VERTICAL, "Subject(s) taught", getDefinitions(Keys.subject_taught), true, context.getResources().getStringArray(R.array.subjects));

        EditTextWidget other = new EditTextWidget.Builder(context, getParticipantAttribute(Keys.subject_taught_other), "Other (Please Specify)", InputType.TYPE_CLASS_TEXT, 100, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build();
        ToggleWidgetData toggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData skipData = toggler.addOption("Other");
        skipData.addWidgetToToggle(other);
        skipData.build();

        subjects.addDependentWidgets(toggler.getToggleMap());
        widgets.add(subjects);
        widgets.add(other.hideView());
        widgets.add(new EditTextWidget.Builder(context, getParticipantAttribute(Keys.teaching_years), "Number of years teaching", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).setInputRange(1, 999999).build());
        widgets.add(new SpinnerWidget(context, getParticipantAttribute(Keys.education_level), "Level of Education", getDefinitions(Keys.education_level), true));

        return widgets;
    }

    private List<Widget> getSchoolDetailWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DefinitionWidget(context, Keys.CATEGORY, getDefinitionByShortName(Keys.SCHOOL_CATEGORY).getDefinitionId().toString()));
        widgets.add(new DefinitionWidget(context, Keys.COUNTRY, PAKISTAN).disableChildObject());

        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));

        UserWidget parentOrganization = new UserWidget(context, Keys.PARENT_ORGANISATION_ID, Keys.LOCATION_ID, "Parent Organization").enableSingleSelect();
        dataRepository.getParentLocations(parentOrganization);
        widgets.add(parentOrganization);

        final TextWidget schoolId = new TextWidget(context, Keys.SHORT_NAME, "School ID");
        EditTextWidget nameOfSchool = new EditTextWidget.Builder(context, Keys.LOCATION_NAME, "Name of School", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build();
        widgets.add(schoolId);
        widgets.add(nameOfSchool);
        IDListener idListener = new IDListener(schoolId, IDType.SCHOOL_ID);
        district.setItemChangeListener(idListener);
        nameOfSchool.setWidgetIDListener(idListener);

        DateWidget partnershipStarted = new DateWidget(context, getLocationAttribute(partnership_start_date), "Date partnership with Aahung was formed", true);
        TextWidget partnershipYears = new TextWidget(context, getLocationAttribute(Keys.partnership_years), "Number of years of partnership");
        partnershipStarted.setWidgetChangeListener(new YearsCalculator(partnershipYears));
        widgets.add(partnershipStarted);
        widgets.add(partnershipYears);

        widgets.add(new SpinnerWidget(context, getLocationAttribute(Keys.school_type), "Type of School", getDefinitions(Keys.school_type), true));
        widgets.add(new RadioWidget(context, getLocationAttribute(Keys.school_sex), "Classification of School by Sex", true, getDefinitions(Keys.school_sex)));

        RadioWidget programLevel = new RadioWidget(context, getLocationAttribute(Keys.school_level), "Level of Program", true, getDefinitions(Keys.school_level));
        widgets.add(programLevel);
        programLevel.setWidgetSwitchListener(idListener);

        MultiSelectWidget program = new MultiSelectWidget(context, getLocationAttribute(Keys.program_implemented), LinearLayout.HORIZONTAL, "Type of program(s) implement in school", getDefinitions(Keys.program_implemented), true, "CSA", "Gender", "LSBE");
        RadioSwitcher switcher = new RadioSwitcher(program);
        switcher.add("Secondary", "LSBE");
        programLevel.setWidgetSwitchListener(switcher);
        widgets.add(program);

        UserWidget projects = new UserWidget(context, getLocationAttribute(Keys.PROJECT), "Associated Projects", false);
        widgets.add(projects);
        dataRepository.getProject(projects);


        RadioWidget tier = new RadioWidget(context, getLocationAttribute(Keys.school_tier), "School Tier", true, getDefinitions(Keys.school_tier));
        widgets.add(tier);

        RadioWidget newSchoolType = new RadioWidget(context, getLocationAttribute(Keys.school_category_new), "New School Category", true, getDefinitions(Keys.school_category_new));
        RadioWidget runningSchoolType = new RadioWidget(context, getLocationAttribute(Keys.school_category_running), "Running School Category", true, getDefinitions(Keys.school_category_running));
        RadioWidget exitSchoolType = new RadioWidget(context, getLocationAttribute(Keys.school_category_exit), "Exit School Category", true, getDefinitions(Keys.school_category_exit));

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


        widgets.add(new EditTextWidget.Builder(context, Keys.PRIMARY_CONTACT_PERSON, "Name of point of contact for school", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new PhoneWidget(context, Keys.PRIMARY_CONTACT, "Phone number for point of contact at school", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.EMAIL, "Email Address for point of contact at school", InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_EMAIL_CHARACTER_SET)).build());
        widgets.add(new EditTextWidget.Builder(context, getLocationAttribute(Keys.student_count), "Approximate number of students", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).setInputRange(1, 99999).build());

        return widgets;
    }

    private Definition getDefinitionByShortName(String shortName) {
        return database.getMetadataDao().getDefinitionByShortName(shortName);
    }

    private List<Widget> getProjectWidgets() {
        List<Widget> widgets = new ArrayList<>();

        UserWidget donors = new UserWidget(context, Keys.DONOR, Keys.DONOR_ID, "Donor").enableSingleSelect();
        widgets.add(donors);
        dataRepository.getDonors(donors);

        TextWidget projectId = new TextWidget(context, Keys.SHORT_NAME, "Program ID");
        widgets.add(projectId);


        EditTextWidget projectName = new EditTextWidget.Builder(context, Keys.PROJECT_NAME, "Name of Project", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build();
        widgets.add(projectName);

        DateWidget dateGrantBegins = new DateWidget(context, Keys.DATE_GRANT_BEGINS, "Date grant begins", true).enablePickerWithoutDay();
        widgets.add(dateGrantBegins);

        IDListener idListener = new IDListener(projectId, IDType.PROJECT_ID);
        projectName.setWidgetIDListener(idListener);
        donors.setWidgetIDListener(idListener);
        dateGrantBegins.setWidgetIDListener(idListener);

        DateWidget endDate = new DateWidget(context, Keys.DATE_GRANT_ENDS, "Date grant ends", true).enablePickerWithoutDay().enableFutureDates();
        widgets.add(endDate);

        DateWatcher dateWatcher = new DateWatcher(dateGrantBegins, endDate);
        dateGrantBegins.setDateChangeListener(dateWatcher, DateType.START);
        endDate.setDateChangeListener(dateWatcher, DateType.END);

        return widgets;
    }

    private List<Widget> getDonorDetailWidgets() {
        List<Widget> widgets = new ArrayList<>();

        TextWidget donorId = new TextWidget(context, Keys.SHORT_NAME, "Donor ID");
        EditTextWidget donorName = new EditTextWidget.Builder(context, Keys.DONOR_NAME, "Name of Donor", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build();

        widgets.add(donorId);
        widgets.add(donorName);

        IDListener idListener = new IDListener(donorId, IDType.DONOR_ID);
        donorName.setWidgetIDListener(idListener);

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

        widgets.add(new EditTextWidget.Builder(context, Keys.FACILITATOR_NAME, "Facilitator Name", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new RadioWidget(context, Keys.DESIGNATION_OF_FACILITATOR, "Designation Of Facilitator", true, getDefinitions(Keys.DESIGNATION_OF_FACILITATOR)));
        MultiSelectWidget topicCovered = new MultiSelectWidget(context, Keys.TOPICS_COVERED, LinearLayout.VERTICAL, "Topics Covered", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.naya_qadam_topics))), true);
        widgets.add(topicCovered);
        ToggleWidgetData otherTopicToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData otherTopicSkipper = otherTopicToggler.addOption("Other");
        widgets.add(otherTopicSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.TOPICS_COVERED_OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        otherTopicSkipper.build();

        topicCovered.addDependentWidgets(otherTopicToggler.getToggleMap());

        widgets.add(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY, "Number of Participants", InputType.TYPE_CLASS_NUMBER, TWO, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).setInputRange(0, 99).build());

        return widgets;
    }

    private List<Widget> getInstitutionDetailsFormWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        widgets.add(new DefinitionWidget(context, Keys.CATEGORY, getDefinitionByShortName(Keys.INSTITUTION_CATEGORY).getDefinitionId().toString()));
        widgets.add(new DefinitionWidget(context, Keys.COUNTRY, PAKISTAN).disableChildObject());

        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));

        final EditTextWidget nameOfInstitution = new EditTextWidget.Builder(context, Keys.LOCATION_NAME, "Name of Institution", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build();
        final TextWidget instituteID = new TextWidget(context, Keys.SHORT_NAME, "Institution ID");
        widgets.add(nameOfInstitution);
        widgets.add(instituteID);
        IDListener idListener = new IDListener(instituteID, IDType.INSTITUTE_ID);
        district.setItemChangeListener(idListener);
        nameOfInstitution.setWidgetIDListener(idListener);

        widgets.add(new DateWidget(context, getLocationAttribute(partnership_start_date), "Date partnership with Aahung was formed", true));

        MultiSelectWidget typeOfInstitution = new MultiSelectWidget(context, getLocationAttribute(Keys.institution_type), LinearLayout.VERTICAL, "Type Of Institution", getDefinitions(Keys.institution_type), true, "Medical", "Nursing", "Midwifery", "Other");

        widgets.add(typeOfInstitution);

        ToggleWidgetData tyeOfInstitutionToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherSkipper = tyeOfInstitutionToggler.addOption("Other");
        widgets.add(OtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, getLocationAttribute(Keys.institution_type_other), "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        OtherSkipper.build();

        typeOfInstitution.addDependentWidgets(tyeOfInstitutionToggler.getToggleMap());


        UserWidget projects = new UserWidget(context, getLocationAttribute(Keys.PROJECT), "Associated Projects", false);
        widgets.add(projects);
        dataRepository.getProject(projects);

        widgets.add(new EditTextWidget.Builder(context, Keys.PRIMARY_CONTACT_PERSON, "Name of point of contact for institution", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new PhoneWidget(context, Keys.PRIMARY_CONTACT, "Phone number for point of contact at institution", true));
        widgets.add(new EditTextWidget.Builder(context, Keys.EMAIL, "Email Address for point of contact at institution", InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_EMAIL_CHARACTER_SET)).build());
        widgets.add(new EditTextWidget.Builder(context, getLocationAttribute(Keys.student_count), "Approximate number of students", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).setInputRange(1, 999999).build());


        return widgets;
    }

    private List<Widget> getAmplifyChangeParticipantDetailsFormWidgets() {

        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        widgets.add(new DefinitionWidget(context, getParticipantAttribute(Keys.SRHM_AC_PARTICIPANT), true));

        widgets.add(new TextWidget(context, Keys.IDENTIFIER, "Participant ID").setText(IDGenerator.getEncodedID()));
        widgets.add(new EditTextWidget.Builder(context, Keys.FIRST_NAME, "Participant Name", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new DateWidget(context, Keys.DATE_OF_BIRTH, "Date of Birth", true));
        widgets.add(new RadioWidget(context, Keys.GENDER, "Sex", true, "Male", "Female", "Other"));

        RadioWidget participant = new RadioWidget(context, getParticipantAttribute(Keys.PARTICIPANT_TYPE), "Type Of Participant", true, getDefinitionsByName(Arrays.asList(new String[]{"student", "teacher"})));
        widgets.add(participant);

        ToggleWidgetData participantToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData teacherSkipper = participantToggler.addOption("Teacher");
        widgets.add(teacherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, getParticipantAttribute(Keys.TEACHER_SUBJECT), "Teacher Subject", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        widgets.add(teacherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, getParticipantAttribute(Keys.TEACHING_YEARS), "Number of years teaching", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        widgets.add(teacherSkipper.addWidgetToToggle(new SpinnerWidget(context, getParticipantAttribute(Keys.EDUCATION_LEVEL), "Level of Education", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.education_level_srhm))), true)).hideView());
        teacherSkipper.build();

        ToggleWidgetData.SkipData studentSkipper = participantToggler.addOption("Student");
        widgets.add(studentSkipper.addWidgetToToggle(new RadioWidget(context, getParticipantAttribute(Keys.PROGRAM_OF_STUDENT), "Program of Student", true, getDefinitions(Keys.PROGRAM_OF_STUDENT))).hideView());
        widgets.add(studentSkipper.addWidgetToToggle(new RadioWidget(context, getParticipantAttribute(Keys.PROGRAM_YEAR_OF_STUDENT), "Program Year of Student", true, getDefinitions(Keys.PROGRAM_YEAR_OF_STUDENT))).hideView());
        studentSkipper.build();

        participant.addDependentWidgets(participantToggler.getToggleMap());


        return widgets;
    }

    private List<Widget> getAmplifyChangeTrainingDetailsFormWidgets() {

        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

/*
        UserWidget institutes = new UserWidget(context, Keys.INSTITUTION_SESSION_NAME, "Institution Name", new ArrayList<BaseItem>()).enableStringJson();
        widgets.add(institutes);
        dataRepository.getInstitutions(institutes);
*/

        UserWidget trainers = new UserWidget(context, Keys.TRAINER, "Trainer", new ArrayList<BaseItem>()).enableStringJson();
        widgets.add(trainers);
        dataRepository.getUsersByRole(trainers, getRoleByName(Keys.ROLE_SRHM_TRAINER));

        MultiSelectWidget participant = new MultiSelectWidget(context, Keys.PARTICIPANT_TYPE, LinearLayout.HORIZONTAL, "Type Of Participant", getDefinitionsByName(Arrays.asList(new String[]{"students", "teachers"})), true);
        widgets.add(participant);

        ToggleWidgetData participantToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData teacherSkipper = participantToggler.addOption("Teachers");
        widgets.add(teacherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_TEACHERS, "Number of Teachers", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).build()).hideView());
        teacherSkipper.build();

        ToggleWidgetData.SkipData studentSkipper = participantToggler.addOption("Students");
        widgets.add(studentSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENTS_COUNT, "Number of Students", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).build()).hideView());
        studentSkipper.build();

        participant.addDependentWidgets(participantToggler.getToggleMap());


        MultiSelectWidget topics_covered = new MultiSelectWidget(context, Keys.TOPICS_COVERED, LinearLayout.VERTICAL, "Topics covered", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.topics_covered_ac_training_form))), true);
        widgets.add(topics_covered);

        ToggleWidgetData topicsCoveredToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherSkipper = topicsCoveredToggler.addOption("Other");
        widgets.add(OtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.TOPICS_COVERED_OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        OtherSkipper.build();

        topics_covered.addDependentWidgets(topicsCoveredToggler.getToggleMap());

        widgets.add(new EditTextWidget.Builder(context, Keys.TRAINING_DAYS, "Number of Days", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).build());

        UserWidget participants = new UserWidget(context, Keys.PARTICPANTS, "Participant(s)", new ArrayList<BaseItem>()).enableParticipants(FormSection.SRHM).enableStringJson();
        widgets.add(participants);
        dataRepository.getParticipant(participants, FormSection.SRHM);

        return widgets;

    }

    private List<Widget> getAmplifyChangeStepDownTrainingDetailsFormWidgets() {

        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE_FORM, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT_FORM, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));

        UserWidget participants = new UserWidget(context, PARTICIPANT_ID, "Participant Name", new ArrayList<BaseItem>()).enableStringJson().enableSingleSelect();
        widgets.add(participants);
        dataRepository.getParticipant(participants, FormSection.SRHM);


        widgets.add(new RadioWidget(context, Keys.TYPE_OF_FACILITATOR, "Type Of Facilitator", false, getDefinitionsByName(Arrays.asList(new String[]{"student", "teacher"}))));

        MultiSelectWidget typeOfParticipants = new MultiSelectWidget(context, Keys.EVENT_ATTENDANT, LinearLayout.VERTICAL, "Type Of Participants attending", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.event_attendant_ac))), true);
        widgets.add(typeOfParticipants);

        ToggleWidgetData typeOfParticipantsToggler = new ToggleWidgetData();


        ToggleWidgetData.SkipData uniStudentsParticipantsSkipper = typeOfParticipantsToggler.addOption("University Students");
        widgets.add(uniStudentsParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.UNIVERSITY_COUNT, "Number of University Students", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        uniStudentsParticipantsSkipper.build();

        ToggleWidgetData.SkipData parentsParticipantsSkipper = typeOfParticipantsToggler.addOption("Parents");
        widgets.add(parentsParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_PARENTS, "Number of Parents", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        parentsParticipantsSkipper.build();

        ToggleWidgetData.SkipData communityLeadersParticipantsSkipper = typeOfParticipantsToggler.addOption("Community leaders");
        widgets.add(communityLeadersParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_COMMUNITY_LEARDER, "Number of Community Leaders", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        communityLeadersParticipantsSkipper.build();

        ToggleWidgetData.SkipData youthParticipantsSkipper = typeOfParticipantsToggler.addOption("Adolescents and Youth (Age 15-29)");
        widgets.add(youthParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_YOUTH, "Number of Adolescents and Youth (Age 15-29)", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        youthParticipantsSkipper.build();

        ToggleWidgetData.SkipData childrenParticipantsSkipper = typeOfParticipantsToggler.addOption("Children (Age 0-14)");
        widgets.add(childrenParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_CHILDREN, "Number of Children (Age 0-14)", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        childrenParticipantsSkipper.build();


        ToggleWidgetData.SkipData OtherParticipantsSkipper = typeOfParticipantsToggler.addOption("Other");
        widgets.add(OtherParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.EVENT_ATTENDANT_OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        widgets.add(OtherParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_ATTENDANT_COUNT, "Number of Other", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        OtherParticipantsSkipper.build();

        typeOfParticipants.addDependentWidgets(typeOfParticipantsToggler.getToggleMap());
        MultiSelectWidget sexOfParticipants = new MultiSelectWidget(context, Keys.PARTICIPANTS_SEX, LinearLayout.HORIZONTAL, "Sex of Participants", getDefinitions(Keys.PARTICIPANTS_SEX), true);
        widgets.add(sexOfParticipants);

        ToggleWidgetData sexToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData maleSkipper = sexToggler.addOption("Male");
        widgets.add(maleSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_MALE, "Number of Male", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        maleSkipper.build();

        ToggleWidgetData.SkipData femaleSkipper = sexToggler.addOption("Female");
        widgets.add(femaleSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_FEMALE, "Number of Female", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        femaleSkipper.build();

        ToggleWidgetData.SkipData otherSkipper = sexToggler.addOption("Other");
        widgets.add(otherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_OTHER_SEX, "Number of Other", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        otherSkipper.build();

        sexOfParticipants.addDependentWidgets(sexToggler.getToggleMap());

        widgets.add(new MultiSelectWidget(context, Keys.PARTICIPANTS_AGE_GROUP, LinearLayout.VERTICAL, "Age of Participants", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.age_group_step_down))), true));

        MultiSelectWidget topics_covered = new MultiSelectWidget(context, Keys.TOPICS_COVERED, LinearLayout.VERTICAL, "Topics covered", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.topics_covered_ACStepDownTraining_form))), true);
        widgets.add(topics_covered);

        ToggleWidgetData topicsCoveredToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherSkipper = topicsCoveredToggler.addOption("Other");
        widgets.add(OtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.TOPICS_COVERED_OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        OtherSkipper.build();

        topics_covered.addDependentWidgets(topicsCoveredToggler.getToggleMap());


        return widgets;
    }

    private List<Widget> getParticipantsDetailsSRHMFormWidgets() {

        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        widgets.add(new DefinitionWidget(context, getParticipantAttribute(Keys.SRHM_GENERAL_PARTICIPANT), true));

        widgets.add(new TextWidget(context, Keys.IDENTIFIER, "Participant ID").setText(IDGenerator.getEncodedID()));
        widgets.add(new EditTextWidget.Builder(context, Keys.FIRST_NAME, "Participant Name", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());
        widgets.add(new DateWidget(context, Keys.DATE_OF_BIRTH, "Date of Birth", true));
        widgets.add(new RadioWidget(context, Keys.GENDER, "Sex", true, "Male", "Female", "Other"));


        MultiSelectWidget participantAffliation = new MultiSelectWidget(context, getParticipantAttribute(Keys.PARTICIPANT_AFFLIATION), LinearLayout.VERTICAL, "Participant Affliation", getDefinitions(Keys.PARTICIPANT_AFFLIATION), true, context.getResources().getStringArray(R.array.participants_affliation));
        widgets.add(participantAffliation);

        ToggleWidgetData participantAffliationToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherSkipper = participantAffliationToggler.addOption("Other");
        widgets.add(OtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, getParticipantAttribute(Keys.PARTICIPANT_AFFLIATION_OTHER), "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        OtherSkipper.build();

        participantAffliation.addDependentWidgets(participantAffliationToggler.getToggleMap());


        SpinnerWidget typeOfParticipants = new SpinnerWidget(context, getParticipantAttribute(Keys.TYPE_OF_PARTICIPANTS), "Type Of Participants", getDefinitions(Keys.TYPE_OF_PARTICIPANTS), true);
        widgets.add(typeOfParticipants.hideOptions("teacher"));

        ToggleWidgetData typeOfParticipantsToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherParticipantsSkipper = typeOfParticipantsToggler.addOption("Other");
        widgets.add(OtherParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_2, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        OtherParticipantsSkipper.build();

        typeOfParticipants.addDependentWidgets(typeOfParticipantsToggler.getToggleMap());


        widgets.add(new SpinnerWidget(context, getParticipantAttribute(Keys.EDUCATION_LEVEL), "Level of Education", getDefinitions(Keys.EDUCATION_LEVEL), true));


        SpinnerWidget roleInInstitution = new SpinnerWidget(context, getParticipantAttribute(Keys.ROLE_IN_INSTITUTION), "Role In Institution", getDefinitions(Keys.ROLE_IN_INSTITUTION), true);
        widgets.add(roleInInstitution);

        ToggleWidgetData roleInInstitutionToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherRoleInInstitutionSkipper = roleInInstitutionToggler.addOption("Other");
        widgets.add(OtherRoleInInstitutionSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_3, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        OtherRoleInInstitutionSkipper.build();

        roleInInstitution.addDependentWidgets(roleInInstitutionToggler.getToggleMap());


        return widgets;
    }

    private List<Widget> getGeneralTrainingDetailsFormWidgets() {

        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));


      /*  UserWidget institutes = new UserWidget(context, Keys.INSTITUTION_SESSION_NAME, "Institution Name", new ArrayList<BaseItem>()).enableStringJson();
        widgets.add(institutes);
        dataRepository.getInstitutions(institutes);
*/

        UserWidget trainers = new UserWidget(context, Keys.TRAINER, "Trainer(s)", new ArrayList<BaseItem>()).enableStringJson();
        widgets.add(trainers);
        dataRepository.getUsersByRole(trainers, getRoleByName(Keys.ROLE_SRHM_TRAINER));


        widgets.add(new RadioWidget(context, Keys.TRAINING_TYPE, "Type Of Training", true, getDefinitionsByName(Arrays.asList(new String[]{"first_training", "refresher"}))));

        MultiSelectWidget topics_covered = new MultiSelectWidget(context, Keys.TOPICS_COVERED, LinearLayout.VERTICAL, "Topics covered", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.topics_covered_general_training_detail_form))), true);
        widgets.add(topics_covered);

        ToggleWidgetData topicsCoveredToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherSkipper = topicsCoveredToggler.addOption("Other");
        widgets.add(OtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        OtherSkipper.build();

        topics_covered.addDependentWidgets(topicsCoveredToggler.getToggleMap());

        widgets.add(new EditTextWidget.Builder(context, Keys.TRAINING_DAYS, "Number of Days", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).build());

        UserWidget participant = new UserWidget(context, Keys.PARTICPANTS, "Participant(s)", new ArrayList<BaseItem>()).enableStringJson().enableParticipants(FormSection.SRHM);
        widgets.add(participant);
        dataRepository.getParticipant(participant, FormSection.SRHM);

        return widgets;

    }

    private List<Widget> getGeneralStepDownTrainingDetailsFormWidgets() {

        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));

       /* UserWidget institutes = new UserWidget(context, Keys.INSTITUTION_SESSION_NAME, "Institution Name", new ArrayList<BaseItem>()).enableStringJson().enableSingleSelect();
        widgets.add(institutes);
        dataRepository.getInstitutions(institutes);*/


        UserWidget participant = new UserWidget(context, PARTICIPANT_ID, "Participant Name", new ArrayList<BaseItem>()).enableSingleSelect().enableStringJson();
        widgets.add(participant);
        dataRepository.getParticipant(participant, FormSection.SRHM);

        MultiSelectWidget typeOfParticipants = new MultiSelectWidget(context, Keys.EVENT_ATTENDANT, LinearLayout.VERTICAL, "Type Of Participants attending", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.step_down_training))), true);
        widgets.add(typeOfParticipants);

        ToggleWidgetData typeOfParticipantsToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherParticipantsSkipper = typeOfParticipantsToggler.addOption("Other");
        widgets.add(OtherParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.EVENT_ATTENDANT_OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        widgets.add(OtherParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_ATTENDANT_COUNT, "Number of Other", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        OtherParticipantsSkipper.build();

        ToggleWidgetData.SkipData uniStudentsParticipantsSkipper = typeOfParticipantsToggler.addOption("University Students");
        widgets.add(uniStudentsParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_STUDENTS_COUNT, "Number of University Students", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        uniStudentsParticipantsSkipper.build();

        ToggleWidgetData.SkipData parentsParticipantsSkipper = typeOfParticipantsToggler.addOption("Parents");
        widgets.add(parentsParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_PARENTS, "Number of Parents", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        parentsParticipantsSkipper.build();

        ToggleWidgetData.SkipData communityLeadersParticipantsSkipper = typeOfParticipantsToggler.addOption("Community leaders");
        widgets.add(communityLeadersParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_COMMUNITY_LEARDER, "Number of Community Leaders", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        communityLeadersParticipantsSkipper.build();

        ToggleWidgetData.SkipData youthParticipantsSkipper = typeOfParticipantsToggler.addOption("Adolescents and Youth (Age 15-29");
        widgets.add(youthParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_YOUTH, "Number of Adolescents and Youth (Age 15-29)", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        youthParticipantsSkipper.build();

        ToggleWidgetData.SkipData childrenParticipantsSkipper = typeOfParticipantsToggler.addOption("Children");
        widgets.add(childrenParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_CHILDREN, "Number of Children (Age 0-14)", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        childrenParticipantsSkipper.build();

        typeOfParticipants.addDependentWidgets(typeOfParticipantsToggler.getToggleMap());

        MultiSelectWidget sexOfParticipants = new MultiSelectWidget(context, Keys.PARTICIPANTS_SEX, LinearLayout.HORIZONTAL, "Sex of Participants", getDefinitions(Keys.PARTICIPANTS_SEX), true);
        widgets.add(sexOfParticipants);

        ToggleWidgetData sexToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData maleSkipper = sexToggler.addOption("Male");
        widgets.add(maleSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_MALE, "Number of Male", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        maleSkipper.build();

        ToggleWidgetData.SkipData femaleSkipper = sexToggler.addOption("Female");
        widgets.add(femaleSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_FEMALE, "Number of Female", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        femaleSkipper.build();

        ToggleWidgetData.SkipData otherSkipper = sexToggler.addOption("Other");
        widgets.add(otherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_OTHER, "Number of Other", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        otherSkipper.build();

        sexOfParticipants.addDependentWidgets(sexToggler.getToggleMap());


        widgets.add(new MultiSelectWidget(context, Keys.PARTICIPANTS_AGE_GROUP, LinearLayout.VERTICAL, "Age of Participants", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.age_group_step_down))), true));

        MultiSelectWidget topics_covered = new MultiSelectWidget(context, Keys.TOPICS_COVERED, LinearLayout.VERTICAL, "Topics covered", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.topics_covered_general_stepdown_form))), true);
        widgets.add(topics_covered);

        ToggleWidgetData topicsCoveredToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherSkipper = topicsCoveredToggler.addOption("Other");
        widgets.add(OtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.TOPICS_COVERED_OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET)).build()).hideView());
        OtherSkipper.build();

        topics_covered.addDependentWidgets(topicsCoveredToggler.getToggleMap());


        return widgets;
    }

    private List<Widget> getHealthCareProviderReachFormWidgets() {
        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        UserWidget participant = new UserWidget(context, PARTICIPANT_ID, "Participant Name", new ArrayList<BaseItem>()).enableSingleSelect().enableStringJson();
        widgets.add(participant);
        dataRepository.getParticipant(participant, FormSection.SRHM);


        DataUpdater dataUpdater = new DataUpdater(context, database.getMetadataDao());
        participant.setSingleItemListener(new FormUpdateListener(dataUpdater, IDType.PARTICIPANT_ID));

        widgets.add(dataUpdater.add(new TextWidget(context, Keys.GENDER, "Sex").enabledViewOnly()).hideView());
        widgets.add(dataUpdater.add(new TextWidget(context, getParticipantAttribute(Keys.PARTICIPANT_AFFLIATION), "Participant Affliation").enabledViewOnly()).hideView());
        widgets.add(dataUpdater.add(new TextWidget(context, getParticipantAttribute(Keys.PARTICIPANT_AFFLIATION_OTHER), "Specify Other").enabledViewOnly()).hideView());

        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE_FORM, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT_FORM, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);


        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));

        RadioWidget firstFollowup = new RadioWidget(context, Keys.FIRST_FOLLOW_UP, "Is this the first followup", true, getDefinitions(Keys.FIRST_FOLLOW_UP));
        widgets.add(firstFollowup);
        ToggleWidgetData firstFollowUpToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData followUpSkipper = firstFollowUpToggler.addOption("No");
        widgets.add(followUpSkipper.addWidgetToToggle(new DateWidget(context, Keys.DATE_OF_LAST_FOLLOWUP, "Date of Last Followup", true)).hideView());
        followUpSkipper.build();
        firstFollowup.addDependentWidgets(firstFollowUpToggler.getToggleMap());

        MultiSelectWidget sexReached = new MultiSelectWidget(context, Keys.PARTICIPANTS_SEX, LinearLayout.VERTICAL, "Sex of People Reached", getDefinitions(Keys.PARTICIPANTS_SEX), true);
        widgets.add(sexReached.addHeader("Secondary Beneficiary Demographics"));

        ToggleWidgetData sexOfPeopleReachedToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData sexOfMaleReachedSkipper = sexOfPeopleReachedToggler.addOption("Male");
        widgets.add(sexOfMaleReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_MALE, "Number of Male", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        sexOfMaleReachedSkipper.build();

        ToggleWidgetData.SkipData sexOfFemaleReachedSkipper = sexOfPeopleReachedToggler.addOption("Female");
        widgets.add(sexOfFemaleReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_FEMALE, "Number of Female", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        sexOfFemaleReachedSkipper.build();

        ToggleWidgetData.SkipData sexOfOtherGenderReachedSkipper = sexOfPeopleReachedToggler.addOption("Other");
        widgets.add(sexOfOtherGenderReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_OTHER_SEX, "Number of Other", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        sexOfOtherGenderReachedSkipper.build();

        sexReached.addDependentWidgets(sexOfPeopleReachedToggler.getToggleMap());

        MultiSelectWidget ageOfPeopleReached = new MultiSelectWidget(context, Keys.PARTICIPANTS_AGE_GROUP, LinearLayout.VERTICAL, "Age of People Reached", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.hcp_age_group))), true);
        widgets.add(ageOfPeopleReached);

        ToggleWidgetData ageOfPeopleReachedToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData ageOfGroupOneReachedSkipper = ageOfPeopleReachedToggler.addOption("0-5");
        widgets.add(ageOfGroupOneReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_1_HC, "Number of People Aged 0-5", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        ageOfGroupOneReachedSkipper.build();

        ToggleWidgetData.SkipData ageOfGroupTwoReachedSkipper = ageOfPeopleReachedToggler.addOption("6-10");
        widgets.add(ageOfGroupTwoReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_2_HC, "Number of People Aged 6-10", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        ageOfGroupTwoReachedSkipper.build();

        ToggleWidgetData.SkipData ageOfGroupThreeReachedSkipper = ageOfPeopleReachedToggler.addOption("11-15");
        widgets.add(ageOfGroupThreeReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_3_HC, "Number of People Aged 11-15", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        ageOfGroupThreeReachedSkipper.build();

        ToggleWidgetData.SkipData ageOfGroupFourReachedSkipper = ageOfPeopleReachedToggler.addOption("16-20");
        widgets.add(ageOfGroupFourReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_4_HC, "Number of People Aged 16-20", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        ageOfGroupFourReachedSkipper.build();

        ToggleWidgetData.SkipData ageOfGroupFiveReachedSkipper = ageOfPeopleReachedToggler.addOption("21-49");
        widgets.add(ageOfGroupFiveReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_5_HC, "Number of People Aged 21-49", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        ageOfGroupFiveReachedSkipper.build();

        ToggleWidgetData.SkipData ageOfGroupSixReachedSkipper = ageOfPeopleReachedToggler.addOption("50+");
        widgets.add(ageOfGroupSixReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_6_HC, "Number of People Aged 50+", InputType.TYPE_CLASS_NUMBER, FIVE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        ageOfGroupSixReachedSkipper.build();

        ageOfPeopleReached.addDependentWidgets(ageOfPeopleReachedToggler.getToggleMap());

        MultiSelectWidget services = new MultiSelectWidget(context, Keys.SERVICES_TYPE, LinearLayout.VERTICAL, "Type Of Services Provided", getDefinitions(Keys.SERVICES_TYPE), true);
        widgets.add(services);

        ToggleWidgetData otherServicesToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData otherServicesSkipper = otherServicesToggler.addOption("Other");
        widgets.add(otherServicesSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_SERVICE_TYPE, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        otherServicesSkipper.build();

        services.addDependentWidgets(otherServicesToggler.getToggleMap());

        return widgets;
    }

    private List<Widget> getOneTouchSensitizationSessionDetailsFormWidgets() {

        List<Widget> widgets = new ArrayList<>();
        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));
        widgets.add(new EditTextWidget.Builder(context, Keys.INSTITUTION_VENUE, "Name of Institution / Venue", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());

        UserWidget donors = new UserWidget(context, Keys.DONORS, "Donor Name", new ArrayList<BaseItem>(), false).enableStringJson();
        widgets.add(donors);
        dataRepository.getDonors(donors);

        UserWidget trainers = new UserWidget(context, Keys.TRAINER, Keys.TRAINER_ID, "Name(s) of Trainer(s)").enableStringJson();
        widgets.add(trainers);
        dataRepository.getUsersByRole(trainers, getRoleByName(Keys.ROLE_SRHM_TRAINER));


        MultiSelectWidget topics_covered = new MultiSelectWidget(context, Keys.TOPICS_COVERED, LinearLayout.VERTICAL, "Topics covered", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.topics_covered_oneTouchSensitization_form))), true);
        widgets.add(topics_covered);

        ToggleWidgetData topicsCoveredToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherSkipper = topicsCoveredToggler.addOption("Other");
        widgets.add(OtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.TOPICS_COVERED_OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        OtherSkipper.build();
        topics_covered.addDependentWidgets(topicsCoveredToggler.getToggleMap());

        widgets.add(new EditTextWidget.Builder(context, Keys.DAYS_QUANTITY, "Number of Days", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).setInputRange(1, 999999).build());

        MultiSelectWidget sexOfParticipant = new MultiSelectWidget(context, Keys.PARTICIPANTS_SEX, LinearLayout.HORIZONTAL, "Sex of Participants", getDefinitions(Keys.PARTICIPANTS_SEX), true);
        widgets.add(sexOfParticipant);
        ToggleWidgetData sexOfParticipantToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData participantsOtherSkipper = sexOfParticipantToggler.addOption("Other");
        widgets.add(participantsOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_SEX_QUANTITY_OTHER, "Number of Other", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        participantsOtherSkipper.build();

        ToggleWidgetData.SkipData participantsMaleSkipper = sexOfParticipantToggler.addOption("Male");
        widgets.add(participantsMaleSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_MALE, "Number of Males", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        participantsMaleSkipper.build();

        ToggleWidgetData.SkipData participantsFemaleSkipper = sexOfParticipantToggler.addOption("Female");
        widgets.add(participantsFemaleSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_FEMALE, "Number of Females", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        participantsFemaleSkipper.build();

        sexOfParticipant.addDependentWidgets(sexOfParticipantToggler.getToggleMap());

        widgets.add(new MultiSelectWidget(context, Keys.PARTICIPANTS_AGE_GROUP, LinearLayout.VERTICAL, "Participant Age Group", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.age_group))), true));

        MultiSelectWidget participantType = new MultiSelectWidget(context, Keys.EVENT_ATTENDANT, LinearLayout.VERTICAL, "Type of Participants", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.one_touch_sensitization_participants))), true);
        widgets.add(participantType);

        ToggleWidgetData participantToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData participantSkipper = participantToggler.addOption("Other");
        widgets.add(participantSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.EVENT_ATTENDANT_OTHER, "Specify Other", InputType.TYPE_CLASS_TEXT, TWO_HUNDRED, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build().hideView()));
        participantSkipper.build();

        participantType.addDependentWidgets(participantToggler.getToggleMap());


        return widgets;

    }

    private List<Widget> getInstitutionClosingFormWidgets() {

        List<Widget> widgets = new ArrayList<>();

        DataUpdater dataUpdater = new DataUpdater(context, database.getMetadataDao());
        FormUpdateListener formUpdateListener = new FormUpdateListener(dataUpdater, IDType.INSTITUTE_ID);

        TextWidget startDate = new TextWidget(context, getLocationAttribute(partnership_start_date), "Date partnership with Aahung was formed").enabledViewOnly();
        widgets.add(dataUpdater.add(startDate).hideView());

        DateWidget partnershipEnds = new DateWidget(context, getLocationAttribute(partnership_end_date), "Date partnership with Aahung ended", true);
        widgets.add(partnershipEnds);

        DateWatcher dateWatcher = new DateWatcher(partnershipEnds);
        startDate.setDateChangeListener(dateWatcher, DateType.START);
        partnershipEnds.setDateChangeListener(dateWatcher, DateType.END);


        TextWidget partnershipYears = new TextWidget(context, getLocationAttribute(Keys.partnership_years), "Number of years of partnership");
        widgets.add(partnershipYears);

        partnershipEnds.setWidgetChangeListener(new YearsCalculator(partnershipYears).setCalculateBetweenDates(startDate));
        widgets.add(dataUpdater.add(new TextWidget(context, getLocationAttribute(Keys.institution_type), "Type of Institution").enabledViewOnly()).hideView());
        widgets.add(dataUpdater.add(new TextWidget(context, getLocationAttribute(Keys.institution_type_other), "Specify Other").enabledViewOnly()).hideView());

        formUpdateListener.onItemAdded(GlobalConstants.selectedInstitute.getShortName());

        widgets.add(new EditTextWidget.Builder(context, getLocationAttribute(Keys.REASON_PARTNERSHIP_END), "Reason for end of partnership", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build());

        return widgets;
    }

    //COMMS

    private List<Widget> getRadioAppearanceFormWidgets() {

        List<Widget> widgets = new ArrayList<>();

        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));
        widgets.add(new TimeWidget(context, Keys.TIME, "Time of Radio Show Start", true));

        widgets.add(new EditTextWidget.Builder(context, Keys.RADIO_NAME, "Name of Radio", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_RADIO)).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.RADIO_FREQ, "Radio Frequency", (InputType.TYPE_CLASS_NUMBER + InputType.TYPE_NUMBER_FLAG_DECIMAL), SIX, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS_DECIMALS)).setMinimumValue(ONE).enableDecimal().build());

        SpinnerWidget city = new SpinnerWidget(context, Keys.CITY, "City", Arrays.asList(context.getResources().getStringArray(R.array.city)), true);
        widgets.add(city);

        ToggleWidgetData cityToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData cityOtherSkipper = cityToggler.addOption("Other");
        widgets.add(cityOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.CITY_OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        cityOtherSkipper.build();
        city.addDependentWidgets(cityToggler.getToggleMap());


        MultiSelectWidget topicsCovered = new MultiSelectWidget(context, Keys.TOPICS_COVERED, LinearLayout.VERTICAL, "Topics Covered", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.topics_rado_appearance_form))), true);
        widgets.add(topicsCovered);

        ToggleWidgetData otherToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData otherSkipper = otherToggler.addOption("Other");
        widgets.add(otherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_TOPICS, "Other", InputType.TYPE_CLASS_TEXT, TWO_HUNDRED, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build().hideView()));
        otherSkipper.build();
        topicsCovered.addDependentWidgets(otherToggler.getToggleMap());

        UserWidget users = new UserWidget(context, Keys.STAFF_ON_RADIO, Keys.USER_ID, "Aahung Staff on Radio").enableStringJson();
        widgets.add(users);
        dataRepository.getUsers(users);


        widgets.add(new EditTextWidget.Builder(context, Keys.NO_OF_LIVE_CALLS, "Number of Live Calls During Show", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).build());
        widgets.add(new EditTextWidget.Builder(context, Keys.NO_OF_LISTENERS, "Number of Listeners", InputType.TYPE_CLASS_NUMBER, EIGHT, false).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 99999999).build());


        return widgets;
    }

    private List<Definition> getDefinitionsByName(List<String> shortNames) {
        List<Definition> definitions = new ArrayList<>();
        for (String shortName : shortNames) {
            Definition definition = getDefinitionByShortName(shortName.trim());
            if (definition != null)
                definitions.add(definition);
        }
        return definitions;
    }

    private List<Widget> getMobileCinemaTheatreDetailsFormWidgets() {
        List<Widget> widgets = new ArrayList<>();

        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        SpinnerWidget province = new SpinnerWidget(context, Keys.PROVINCE, "Province", Arrays.asList(context.getResources().getStringArray(R.array.province)), true);
        SpinnerWidget district = new SpinnerWidget(context, Keys.DISTRICT, "District", Arrays.asList(context.getResources().getStringArray(R.array.district_sindh)), true);
        widgets.add(province);
        widgets.add(district);
        province.setItemChangeListener(new ProvinceListener(district));

        widgets.add(new SpinnerWidget(context, Keys.TYPE_OF_SCREENING, "Type Of Screening", true, getDefinitions(Keys.TYPE_OF_SCREENING)));


        MultiSelectWidget topicCovered = new MultiSelectWidget(context, Keys.SESSION_TOPICS, LinearLayout.VERTICAL, "Topic Screened", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.topics_screened))), true);
        widgets.add(topicCovered);

        ToggleWidgetData topicsCoveredToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData topicCoveredOtherSkipper = topicsCoveredToggler.addOption("Other");
        widgets.add(topicCoveredOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.TOPICS_COVERED_OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        topicCoveredOtherSkipper.build();
        topicCovered.addDependentWidgets(topicsCoveredToggler.getToggleMap());

        widgets.add(new EditTextWidget.Builder(context, Keys.NAME_OF_PERF, "Name of Video or Performance", InputType.TYPE_CLASS_TEXT, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());


        MultiSelectWidget sexOfAudience = new MultiSelectWidget(context, Keys.SEX_OF_AUDIENCE, LinearLayout.VERTICAL, "Sex of Audience", getDefinitions(Keys.SEX_OF_AUDIENCE), true);
        widgets.add(sexOfAudience);

        ToggleWidgetData sexOfAudienceToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData participantsOtherSkipper = sexOfAudienceToggler.addOption("Other");
        widgets.add(participantsOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_OTHER_SEX, "Number of Other", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        participantsOtherSkipper.build();

        ToggleWidgetData.SkipData participantsMaleSkipper = sexOfAudienceToggler.addOption("Male");
        widgets.add(participantsMaleSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_MALE, "Number of Males", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        participantsMaleSkipper.build();

        ToggleWidgetData.SkipData participantsFemaleSkipper = sexOfAudienceToggler.addOption("Female");
        widgets.add(participantsFemaleSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PARTICIPANTS_QUANTITY_FEMALE, "Number of Females", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        participantsFemaleSkipper.build();

        sexOfAudience.addDependentWidgets(sexOfAudienceToggler.getToggleMap());


        MultiSelectWidget ageOfPeopleReached = new MultiSelectWidget(context, Keys.AGE_OF_AUDIENCE, LinearLayout.VERTICAL, "Age of Audience", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.age_group_cinema_form))), true);
        widgets.add(ageOfPeopleReached);

        ToggleWidgetData ageOfPeopleReachedToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData ageOfGroupOneReachedSkipper = ageOfPeopleReachedToggler.addOption("5-10");
        widgets.add(ageOfGroupOneReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_1, "Number of Audience Aged 5-10", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        ageOfGroupOneReachedSkipper.build();

        ToggleWidgetData.SkipData ageOfGroupTwoReachedSkipper = ageOfPeopleReachedToggler.addOption("11-15");
        widgets.add(ageOfGroupTwoReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_2, "Number of Audience Aged 11-15", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        ageOfGroupTwoReachedSkipper.build();

        ToggleWidgetData.SkipData ageOfGroupThreeReachedSkipper = ageOfPeopleReachedToggler.addOption("16-20");
        widgets.add(ageOfGroupThreeReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_3, "Number of Audience Aged 16-20", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        ageOfGroupThreeReachedSkipper.build();

        ToggleWidgetData.SkipData ageOfGroupFiveReachedSkipper = ageOfPeopleReachedToggler.addOption("21-49");
        widgets.add(ageOfGroupFiveReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_4, "Number of Audience Aged 21-49", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        ageOfGroupFiveReachedSkipper.build();

        ToggleWidgetData.SkipData ageOfGroupSixReachedSkipper = ageOfPeopleReachedToggler.addOption("50+");
        widgets.add(ageOfGroupSixReachedSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.GROUP_5, "Number of Audience Aged 50+", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        ageOfGroupSixReachedSkipper.build();

        ageOfPeopleReached.addDependentWidgets(ageOfPeopleReachedToggler.getToggleMap());


        return widgets;
    }

    private List<Widget> getTrainingDetailsFormCommunicationsWidgets() {
        List<Widget> widgets = new ArrayList<>();

        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        SpinnerWidget city = new SpinnerWidget(context, Keys.CITY, "City", Arrays.asList(context.getResources().getStringArray(R.array.city)), true);
        widgets.add(city);

        ToggleWidgetData cityToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData cityOtherSkipper = cityToggler.addOption("Other");
        widgets.add(cityOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        cityOtherSkipper.build();
        city.addDependentWidgets(cityToggler.getToggleMap());

        UserWidget trainer = new UserWidget(context, Keys.TRAINER, Keys.TRAINER_ID, "Aahung Trainer(s)");
        widgets.add(trainer);
        dataRepository.getUsersByRole(trainer, getRoleByName(Keys.ROLE_COMMUNICATION_TRAINER));


        SpinnerWidget training_venue = new SpinnerWidget(context, Keys.VENUE, "Training Venue", true, getDefinitionsByName(Arrays.asList("aahung_office", "other")));
        widgets.add(training_venue);

        ToggleWidgetData trainingVenueToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData trainingVenueOtherSkipper = trainingVenueToggler.addOption("Other");
        widgets.add(trainingVenueOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.TRAINING_VENUE_OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        trainingVenueOtherSkipper.build();
        training_venue.addDependentWidgets(trainingVenueToggler.getToggleMap());

        widgets.add(new EditTextWidget.Builder(context, Keys.DAYS_QUANTITY, "Number of Days", InputType.TYPE_CLASS_NUMBER, TWO, true).setMinimumValue(ONE).setInputRange(1, 999999).build());

        MultiSelectWidget topicCovered = new MultiSelectWidget(context, Keys.TOPICS_COVERED, LinearLayout.VERTICAL, "Topics Covered", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.topics_covered_training_detail_comms))), true);
        widgets.add(topicCovered);
        ToggleWidgetData otherTopicToggler = new ToggleWidgetData();
        ToggleWidgetData.SkipData otherTopicSkipper = otherTopicToggler.addOption("Other");
        widgets.add(otherTopicSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_TOPICS, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        otherTopicSkipper.build();

        topicCovered.addDependentWidgets(otherTopicToggler.getToggleMap());


        MultiSelectWidget typeOfParticipants = new MultiSelectWidget(context, Keys.EVENT_ATTENDANT, LinearLayout.VERTICAL, "Type Of Participants", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.type_of_participants_training_detail_comms))), true);
        widgets.add(typeOfParticipants);

        ToggleWidgetData typeOfParticipantsToggler = new ToggleWidgetData();


        ToggleWidgetData.SkipData journalistsParticipantsSkipper = typeOfParticipantsToggler.addOption("Journalists");
        widgets.add(journalistsParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_JOURNALISTS, "Number of Journalists", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        journalistsParticipantsSkipper.build();

        ToggleWidgetData.SkipData bloggersParticipantsSkipper = typeOfParticipantsToggler.addOption("Bloggers");
        widgets.add(bloggersParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_BLOGGERS, "Number of Bloggers", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        bloggersParticipantsSkipper.build();

        ToggleWidgetData.SkipData screenwritersParticipantsSkipper = typeOfParticipantsToggler.addOption("Screenwriters");
        widgets.add(screenwritersParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_SCREENWRITERS, "Number of Screenwriters", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        screenwritersParticipantsSkipper.build();

        ToggleWidgetData.SkipData mediaPersonnelParticipantsSkipper = typeOfParticipantsToggler.addOption("Other Media Personnel");
        widgets.add(mediaPersonnelParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NUMBER_OF_MEDIA_PERSONNEL, "Number of Other Media Personnel", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        mediaPersonnelParticipantsSkipper.build();

        ToggleWidgetData.SkipData OtherParticipantsSkipper = typeOfParticipantsToggler.addOption("Other");
        widgets.add(OtherParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.EVENT_ATTENDANT_OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        widgets.add(OtherParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_ATTENDANT_COUNT, "Number of Other", InputType.TYPE_CLASS_NUMBER, THREE, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NUMBERS)).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        OtherParticipantsSkipper.build();

        typeOfParticipants.addDependentWidgets(typeOfParticipantsToggler.getToggleMap());


        return widgets;
    }

    private List<Widget> getSocialMediaDetailsWidgets() {

        List<Widget> widgets = new ArrayList<>();

        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        widgets.add(new MultiSelectWidget(context, Keys.POST_RELEVANT_FOR, LinearLayout.VERTICAL, "Post Relevant For", getDefinitions(Keys.POST_RELEVANT_FOR), true).enableOption("Comms"));
        widgets.add(new DateWidget(context, Keys.POST_DATE, "Date/Time of Post", true).enableTime());

        SpinnerWidget typeOfPost = new SpinnerWidget(context, Keys.TYPE_OF_POST, "Type of Post", true, getDefinitions(Keys.TYPE_OF_POST));
        widgets.add(typeOfPost);

        ToggleWidgetData typeOfPostToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData typeOfPostOtherSkipper = typeOfPostToggler.addOption("Other");
        widgets.add(typeOfPostOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.POST_TYPE_OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        typeOfPostOtherSkipper.build();
        typeOfPost.addDependentWidgets(typeOfPostToggler.getToggleMap());

        MultiSelectWidget topicsCoveredByPost = new MultiSelectWidget(context, Keys.TOPICS_COVERED, LinearLayout.VERTICAL, "Topics Covered by Post", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.topics_covered_by_post))), true);
        widgets.add(topicsCoveredByPost);

        ToggleWidgetData topicsCoveredByPostToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData topicsCoveredByPostOtherSkipper = topicsCoveredByPostToggler.addOption("Other");
        widgets.add(topicsCoveredByPostOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.TOPICS_COVERED_OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        topicsCoveredByPostOtherSkipper.build();
        topicsCoveredByPost.addDependentWidgets(topicsCoveredByPostToggler.getToggleMap());

        MultiSelectWidget platformsUsed = new MultiSelectWidget(context, Keys.PLATFORM_USED, LinearLayout.VERTICAL, "Platforms Used", getDefinitions(Keys.PLATFORM_USED), true).enableSocialMediaStats();
        widgets.add(platformsUsed);

        ToggleWidgetData platformsUsedToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData platformsUsedOtherSkipper = platformsUsedToggler.addOption("Other");
        widgets.add(platformsUsedOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.POST_PLATFORM_OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        platformsUsedOtherSkipper.build();
        platformsUsed.addDependentWidgets(platformsUsedToggler.getToggleMap());

        return widgets;
    }

    private List<Widget> getDistributionofCommunicationMaterialWidgets() {

        List<Widget> widgets = new ArrayList<>();

        widgets.add(new DateWidget(context, Keys.DATE, "Date", true));

        widgets.add(new SpinnerWidget(context, Keys.COMPONENT, "Component", true, getDefinitions(Keys.COMPONENT)));

        SpinnerWidget city = new SpinnerWidget(context, Keys.CITY, "City", Arrays.asList(context.getResources().getStringArray(R.array.city)), true);
        widgets.add(city);

        ToggleWidgetData cityToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData cityOtherSkipper = cityToggler.addOption("Other");
        widgets.add(cityOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        cityOtherSkipper.build();
        city.addDependentWidgets(cityToggler.getToggleMap());


        SpinnerWidget location = new SpinnerWidget(context, Keys.LOCATION, "Location", true, getDefinitions(Keys.LOCATION));
        widgets.add(location);

        ToggleWidgetData locationToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData locationOtherSkipper = locationToggler.addOption("Other");
        widgets.add(locationOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_DISTRIBUTION_LOCATION, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build()).hideView());
        locationOtherSkipper.build();
        location.addDependentWidgets(locationToggler.getToggleMap());

        widgets.add(new EditTextWidget.Builder(context, Keys.DISTRIBUTION_LOCATION_NAME, "Name of location", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_NAME)).build());

        MultiSelectWidget typeOfMaterial = new MultiSelectWidget(context, Keys.TYPE_OF_MATERIAL, LinearLayout.VERTICAL, "Type of Material", getDefinitions(Keys.TYPE_OF_MATERIAL), true);
        widgets.add(typeOfMaterial);

        ToggleWidgetData typeOfMaterialtToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData typeOfMaterialOtherSkipper = typeOfMaterialtToggler.addOption("Other");
        widgets.add(typeOfMaterialOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_DISTRIBUTION_MATERIAL_TYPE_OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        widgets.add(typeOfMaterialOtherSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.OTHER_MATERIAL_COUNT, "Number of Other", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        typeOfMaterialOtherSkipper.build();


        ToggleWidgetData.SkipData annualReportSkipper = typeOfMaterialtToggler.addOption("Annual Report");
        widgets.add(annualReportSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.ANNUAL_REPORT, "Number of Annual Report", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        annualReportSkipper.build();

        ToggleWidgetData.SkipData aahungProfileSkipper = typeOfMaterialtToggler.addOption("Aahung Profile");
        widgets.add(aahungProfileSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.AAHUNG_PROFILE, "Number of Aahung Profile", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        aahungProfileSkipper.build();

        ToggleWidgetData.SkipData PamphletSkipper = typeOfMaterialtToggler.addOption("Pamphlet");
        widgets.add(PamphletSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PAMPHLET, "Number of Pamphlet", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        PamphletSkipper.build();

        ToggleWidgetData.SkipData bookletSkipper = typeOfMaterialtToggler.addOption("Booklet");
        widgets.add(bookletSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.BOOKLET, "Number of Booklet", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        bookletSkipper.build();

        ToggleWidgetData.SkipData reportSkipper = typeOfMaterialtToggler.addOption("Report");
        widgets.add(reportSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.REPORT, "Number of Report", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        reportSkipper.build();

        ToggleWidgetData.SkipData brandingSkipper = typeOfMaterialtToggler.addOption("Aahung Branding Material");
        widgets.add(brandingSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.BRANDING_MATERIAL, "Number of Aahung Branding Material", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        brandingSkipper.build();

        ToggleWidgetData.SkipData mugs = typeOfMaterialtToggler.addOption("Aahung Mugs");
        widgets.add(mugs.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.AAHUNG_MUGS, "Number of Aahung Mugs", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        mugs.build();

        ToggleWidgetData.SkipData folder = typeOfMaterialtToggler.addOption("Aahung Folders");
        widgets.add(folder.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.AAHUNG_FOLDERS, "Number of Aahung Folders", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        folder.build();

        ToggleWidgetData.SkipData notebooks = typeOfMaterialtToggler.addOption("Aahung Notebooks");
        widgets.add(notebooks.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.AAHUNG_NOTEBOOk, "Number of Aahung Notebooks", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        notebooks.build();

        typeOfMaterial.addDependentWidgets(typeOfMaterialtToggler.getToggleMap());

        MultiSelectWidget topics = new MultiSelectWidget(context, Keys.TOPIC, LinearLayout.VERTICAL, "Topic", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.topic_communication_material_comms_categoryA))), true);
        widgets.add(topics);

        ToggleWidgetData topicToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData aahungInfo = topicToggler.addOption("Aahung Information");
        widgets.add(aahungInfo.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.AAHUNG_INFO, "Number of Aahung Information", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        aahungInfo.build();


        ToggleWidgetData.SkipData aahungBrandingMaterial = topicToggler.addOption("Aahung Branding Material");
        widgets.add(aahungBrandingMaterial.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.AAHUNG_BRANDING_MATERIAL, "Number of Aahung Branding Material", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        aahungBrandingMaterial.build();

        ToggleWidgetData.SkipData nikahNama = topicToggler.addOption("Nikah Nama");
        widgets.add(nikahNama.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.NIKAH_NAMA, "Number of Nikah Nama", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        nikahNama.build();

        ToggleWidgetData.SkipData puberty = topicToggler.addOption("Puberty");
        widgets.add(puberty.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PUBERTY, "Number of Puberty", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        puberty.build();

        ToggleWidgetData.SkipData rtis = topicToggler.addOption("RTIs");
        widgets.add(rtis.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.RTIs, "Number of RTIs", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        rtis.build();

        ToggleWidgetData.SkipData ungei = topicToggler.addOption("UNGEI");
        widgets.add(ungei.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.UNGEI, "Number of UNGEI", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        ungei.build();

        ToggleWidgetData.SkipData sti = topicToggler.addOption("STIs");
        widgets.add(sti.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.STIs, "Number of STIs", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        sti.build();

        ToggleWidgetData.SkipData sexualHealth = topicToggler.addOption("Sexual Health");
        widgets.add(sexualHealth.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.SEXUAL_HEALTH, "Number of Sexual Health", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        sexualHealth.build();

        ToggleWidgetData.SkipData preMaritalInfo = topicToggler.addOption("Pre-marital Information");
        widgets.add(preMaritalInfo.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PRE_MARITAL_INFO, "Number of Pre-marital Information", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        preMaritalInfo.build();

        ToggleWidgetData.SkipData pac = topicToggler.addOption("PAC");
        widgets.add(pac.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.PAC, "Number of PAC", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        pac.build();

        ToggleWidgetData.SkipData maternalHealth = topicToggler.addOption("Maternal Health");
        widgets.add(maternalHealth.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.MATERNAL_HEALTH, "Number of Maternal Health", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        maternalHealth.build();

        ToggleWidgetData.SkipData other = topicToggler.addOption("Other");
        widgets.add(other.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.DISTRIBUTION_OTHER, "Number of Other", InputType.TYPE_CLASS_NUMBER, THREE, true).setMinimumValue(ONE).setInputRange(1, 999999).build()).hideView());
        widgets.add(other.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.TOPICS_COVERED_OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        other.build();

        topics.addDependentWidgets(topicToggler.getToggleMap());

        typeOfMaterial.setCheckChangeListener(new AnnualInfoListener(topics));

        MultiSelectWidget typeOfParticipants = new MultiSelectWidget(context, Keys.EVENT_ATTENDANT, LinearLayout.VERTICAL, "Type Of Participants", getDefinitionsByName(Arrays.asList(context.getResources().getStringArray(R.array.participants_type))), true);
        widgets.add(typeOfParticipants);

        ToggleWidgetData typeOfParticipantsToggler = new ToggleWidgetData();

        ToggleWidgetData.SkipData OtherParticipantsSkipper = typeOfParticipantsToggler.addOption("Other");
        widgets.add(OtherParticipantsSkipper.addWidgetToToggle(new EditTextWidget.Builder(context, Keys.EVENT_ATTENDANT_OTHER, "Specify Other", InputType.TYPE_TEXT_VARIATION_PERSON_NAME, NORMAL_LENGTH, true).setInputFilter(DigitsKeyListener.getInstance(ALLOWED_CHARACTER_SET_SPECIFYOTHERS_OPTION)).build()).hideView());
        OtherParticipantsSkipper.build();

        typeOfParticipants.addDependentWidgets(typeOfParticipantsToggler.getToggleMap());


        return widgets;

    }

    public BaseAttribute getLocationAttribute(String shortName) {
        return database.getMetadataDao().getLocationAttributeTypeByShortName(shortName.trim());
    }

    public BaseAttribute getParticipantAttribute(String shortName) {
        return database.getMetadataDao().getPersonAttributeTypeByShortName(shortName.trim());
    }

    public List<Definition> getDefinitions(String shortName) {
        return database.getMetadataDao().getDefinitionsByShortName(shortName.trim());
    }

    private Role getRoleByName(String shortName) {
        return database.getMetadataDao().getRoleByName(shortName.trim());
    }

    private class ParticipantUpdateListener implements ItemAddListener.ListItemListener {
        private UserWidget participants;

        public ParticipantUpdateListener(UserWidget participants) {
            this.participants = participants;
        }


        @Override
        public void onListAdded(List<BaseItem> baseItemList) {
            dataRepository.getParticipantByLocation(baseItemList, participants);
        }
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

    private class QuantityChangeListener implements WidgetContract.TextChangeListener {
        private Widget widget;

        public QuantityChangeListener(Widget widget) {
            this.widget = widget;
        }


        @Override
        public void onTextChanged(String data) {
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
                    distributionType.setItemStatus("Aahung Information", true);
                    break;
                } else {
                    distributionType.setItemStatus("Aahung Information", false);
                }
            }
        }
    }

    private class YearsCalculator implements WidgetContract.ChangeNotifier, WidgetContract.OnDataFetchedListener {
        private TextWidget partnershipYears;
        private TextWidget startDateWidget;
        private String startDate;

        public YearsCalculator(TextWidget partnershipYears) {
            this.partnershipYears = partnershipYears;
        }

        public YearsCalculator setCalculateBetweenDates(TextWidget startDate) {
            this.startDateWidget = startDate;
            startDateWidget.setListeners(this);
            return this;
        }

        @Override
        public void notifyChanged(String item) {
            DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
            if (startDateWidget == null) {

                try {
                    Date parsedDate = dateFormat.parse(item);
                    Calendar calendar = Calendar.getInstance();
                    calendar.setTime(parsedDate);
                    int selectedYear = calendar.get(Calendar.YEAR);
                    int currentYear = Calendar.getInstance().get(Calendar.YEAR);
                    int years = currentYear - selectedYear;
                    partnershipYears.setText("" + years);

                } catch (ParseException e) {
                    e.printStackTrace();
                }
            } else {
                DateFormat dbDateFormat = new SimpleDateFormat("yyyy-MM-dd");//dd/MM/yyyy
                try {

                    Date dbdate = dbDateFormat.parse(startDate);
                    Date parsedDate = dateFormat.parse(item);

                    Calendar endDate = Calendar.getInstance();
                    endDate.setTime(parsedDate);

                    Calendar startDate = Calendar.getInstance();
                    startDate.setTime(dbdate);

                    int endYear = endDate.get(Calendar.YEAR);
                    int startYear = startDate.get(Calendar.YEAR);
                    int years = endYear - startYear;

                    partnershipYears.setText("" + years);

                } catch (ParseException e) {
                    e.printStackTrace();
                }

            }
        }

        @Override
        public void onDataReceived(String item) {
            startDate = item;
        }
    }

    private class FormUpdateListener implements ItemAddListener.SingleItemListener {
        private DataUpdater dataUpdater;
        private IDType formType;

        public FormUpdateListener(DataUpdater dataUpdater, IDType idType) {
            this.dataUpdater = dataUpdater;
            formType = idType;
        }

        @Override
        public void onItemAdded(String shortName) {
            switch (formType) {
                case SCHOOL_ID:
                case INSTITUTE_ID:
                    dataRepository.getLocationByShortName(shortName, dataUpdater);
                    break;
                case PARTICIPANT_ID:
                    dataRepository.getParticipantByShortName(shortName, dataUpdater);
                    break;
            }
        }
    }

    private class ClassificationListener implements WidgetContract.OnDataFetchedListener {
        private RadioWidget classClassification;

        public ClassificationListener(RadioWidget classClassification) {
            this.classClassification = classClassification;
        }

        @Override
        public void onDataReceived(String item) {
            if (item.equals("Girls") || item.equals("Boys")) {
                classClassification.onItemChange(item);
                classClassification.disableSwitching();
            }
        }
    }
}