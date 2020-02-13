export const reports = [
    { id: 1, shortName: 'school_summary', name: 'Schools Summary', component: "lse", filters: ["school_level"], description: "This report provides information on partner schools" },
    { id: 2, shortName: 'schools_eligible_for_running_tier', name: 'Schools Eligible For Running Tier', component: "lse", filters: ["school_level"], description: "This report provides information on which schools are eligible to move from the new to the Running tier" },
    { id: 3, shortName: 'schools_eligible_for_exit_tier', name: 'Schools Eligible For Exit Tier', component: "lse", filters: ["school_level"], description: "This report provides information on which schools are eligible to move from the running to the Exit tier" },
    { id: 4, shortName: 'teacher_summary', name: 'Teacher Summary', component: "lse", filters: ["school_level"], description: "This report provides a summary of teachers trained by LSE" },
    { id: 5, shortName: 'one_touch_session_summary', name: 'One Touch Session Summary', component: "lse", filters: [], description: "This report provides information on the participants trained by SRHM" },
    { id: 6, shortName: 'institution_summary', name: 'Institution Summary', component: "srhm", filters: [], description: "This report provides information on SRHM partner institutions" },
    { id: 7, shortName: 'one_touch_sensitization_summary', name: 'One Touch Sensitization Summary', component: "srhm", filters: [], description: "This report provides information on the one touch sensitization sessions conducted by SRHM" },
    { id: 8, shortName: 'mobile_cinema_theatre_summary', name: 'Mobile Cinema Theatre Summary', component: "comms", filters: [], description: "This report provides information on mobile cinemas" },
    { id: 9, shortName: 'radio_appearance_summary', name: 'Radio Appearance Summary', component: "comms", filters: [], description: "This report provides information on radio activity" },
    { id: 10, shortName: 'training_summary', name: 'Training Summary', component: "lse", filters: ["school_level", "training_type"], description: "This report provides information on the trainings conducted by LSE" },
    { id: 11, shortName: 'communication_training_summary', name: 'Communication Training Summary ', component: "comms", filters: [], description: "This report provides information on trainings conducted by Communications" },
    { id: 12, shortName: 'distribution_iec_material', name: 'Distribution of IEC Material', component: "comms", filters: [], description: "This report provides information on the IEC materials distributed" },
    { id: 13, shortName: 'exit_stepdown_training_summary', name: 'Exit Step Down Training Summary', component: "lse", filters: ["school_level"], description: "This report provides information on the roll out trainings done at newly inducted exit schools." },
    { id: 14, shortName: 'mt_eligibility', name: 'MT Eligibility Report', component: "lse", filters: [], description: "This report provides a summary of Master Trainer candidates." },
    { id: 15, shortName: 'participant_summary', name: 'Participant Summary', component: "srhm", filters: [], description: "This report provides information on the participants trained by SRHM." },
    { id: 16, shortName: 'social_media_summary', name: 'Social Media Summary', component: "comms", filters: ["post_platform"], description: "This report provides information on social media activity." },
    { id: 17, shortName: 'SRHM_training_summary', name: 'SRHM Trainings Summary', component: "srhm", filters: [], description: "This report provides information on trainings conducted by SRHM." },
    { id: 18, shortName: 'stakeholder_meeting_summary', name: 'Stakeholder Meeting Summary', component: "lse", filters: [], description: "This report provides information on stakeholder meetings conducted by LSE." },
    { id: 19, shortName: 'step_down_training_summary', name: 'Step Down Training Summary', component: "srhm", filters: [], description: "This report provides information on step down trainings conducted for SRHM activities." },
    { id: 20, shortName: 'resource_summary', name: 'Resource Summary', component: "lse", filters: ["school_level"], description: "This report provides information on LSE resources distributed to partner schools." }
];

/**
 * returns report by shortName; this is needed to get the mapped filters for that report
 */
export const getReportByName = function (reportName) {
    return reports.filter(report => report.shortName === reportName)
};

/**
 * returns reports by component (lse, comms, srhm)
 */
export const getReportByComponent = function (componentName) {
    return reports.filter(report => report.component === componentName)
};

