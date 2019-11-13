export const reports = [
      { id: 1, shortName: 'school_summary', name: 'Schools Summary', component: "lse", filters: ["school_level"], description: "This report provides information on partner schools" },
      { id: 3, shortName: 'schools_eligible_for_running_tier', name: 'Schools Eligible For Running Tier', component: "lse", filters: ["school_level"], description: "This report provides information on which schools are eligible to move from the new to the Running tier" },
      { id: 2, shortName: 'schools_eligible_for_exit_tier', name: 'Schools Eligible For Exit Tier', component: "lse", filters: ["school_level"], description: "This report provides information on which schools are eligible to move from the running to the Exit tier" },
      { id: 4, shortName: 'teacher_summary', name: 'Teacher Summary', component: "lse", filters: ["school_level"], description: "This report provides a summary of teachers trained by LSE" },
      { id: 5, shortName: 'participant_summary', name: 'Participant Summary', component: "xyz", filters: [], description: "This report provides a summary of participants" },
      { id: 6, shortName: 'communication_summary', name: 'Communication Summary', component: "abc", filters: [], description: "This report provides communication summary" }
    ];

/**
 * returns report by shortName; this is needed to get the mapped filters for that report
 */
export const getReportByName = function(reportName) {
    return reports.filter(report =>  report.shortName === reportName )
};

/**
 * returns reports by component (lse, comms, srhm)
 */
export const getReportByComponent = function(componentName) {
    return reports.filter(report =>  report.component === componentName )
};

