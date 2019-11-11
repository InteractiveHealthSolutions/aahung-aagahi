export const reports = [
      { id: 1, name: 'School Summary', component: "lse", filters: ["school_level"], description: "This report provides information on partner schools" },
      { id: 3, name: 'Schools Eligible For Running Tier', component: "lse", filters: ["school_level"], description: "This report provides information on which schools are eligible to move from the new to the Running tier" },
      { id: 2, name: 'Schools Eligible For Exit Tier', component: "lse", filters: ["school_level"], description: "This report provides information on which schools are eligible to move from the running to the Exit tier" },
      { id: 4, name: 'Teacher Summary', component: "lse", filters: ["school_level"], description: "This report provides a summary of teachers trained by LSE" },
      { id: 5, name: 'Participant Summary', component: "srhm", filters: [], description: "This report provides a summary of participants" },
      { id: 6, name: 'Communication Summary', component: "comms", filters: [], description: "This report provides communication summary" }
    ];

/**
 * returns report by name; this is needed to get the mapped filters for that report
 */
export const getReportByName = function(reportName) {
    return reports.filter(report =>  report.name === reportName )
};

/**
 * returns reports by component (lse, comms, srhm)
 */
export const getReportByComponent = function(componentName) {
    return reports.filter(report =>  report.component === componentName )
};

