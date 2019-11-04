export const reports = [
      { id: 1, name: 'School Detail Report', filters: ["school_level", "school_tier"] },
      { id: 2, name: 'Institution Detail Report', filters: ["participant_affiliation", "participant_type"] }      
    ];

/**
 * returns report by name; this is needed to get the mapped filters for that report
 */
export const getReportByName = function(reportName) {
    return reports.filter(report =>  report.name === reportName )
};

