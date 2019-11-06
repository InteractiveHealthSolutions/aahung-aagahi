export const reports = [
      { id: 1, name: 'Schools Eligible For Running Tier', component: "lse", filters: ["school_level"] },
      { id: 2, name: 'Schools Eligible For Exit Tier', component: "lse", filters: ["participant_affiliation", "participant_type"] },
      { id: 3, name: 'Distribution of IEC Material', component: "comms", filters: ["partner_components"] },
      { id: 4, name: 'Communications Training Summary', component: "comms", filters: [] }

    ];

/**
 * returns report by name; this is needed to get the mapped filters for that report
 */
export const getReportByName = function(reportName) {
    return reports.filter(report =>  report.name === reportName )
};

