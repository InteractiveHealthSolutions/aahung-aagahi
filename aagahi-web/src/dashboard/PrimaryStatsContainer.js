import React from 'react';
import 'hammerjs';
import { donorCount, projectCount, usersCount, locationCount, schoolCount, institutionCount } from '../service/ReportService';

// const locationsDiv = Object.keys(locationCount).map(function (key) {
//     return <div className="stats-value-small col-md">{key}:{locationCount[key]}</div>
// });

export const PrimaryStatsContainer = () => (
    <div class="container my-2 py-2">
        <div class="row">
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="media white z-depth-1 rounded">
                    <i class="far fa-money-bill-alt fa-lg blue z-depth-1 p-4 rounded-left text-white mr-3"></i>
                    <div class="media-body p-1">
                        <p class="text-uppercase text-muted mb-1"><small>donors</small></p>
                        <h5 class="font-weight-bold mb-0">{donorCount}</h5>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="media white z-depth-1 rounded">
                    <i class="fas fa-chart-bar fa-lg deep-purple z-depth-1 p-4 rounded-left text-white mr-3"></i>
                    <div class="media-body p-1">
                        <p class="text-uppercase text-muted mb-1"><small>projects</small></p>
                        <h5 class="font-weight-bold mb-0">{projectCount}</h5>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-8 mb-6">
                <div class="media white z-depth-1 rounded">
                    <i class="fas fa-users fa-lg teal z-depth-1 p-4 rounded-left text-white mr-3"></i>
                    <div class="media-body p-1">
                        <p class="text-uppercase text-muted mb-1"><small>users</small></p>
                        <h5 class="font-weight-bold mb-0">{usersCount}</h5>
                    </div>
                </div>
            </div>
        </div>
    </div >
);
