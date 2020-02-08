// Copyright 2019 Interactive Health Solutions
//
// This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA.
// You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html
//
// Interactive Health Solutions, hereby disclaims all copyright interest in the program `Aahung-Aagahi' written by the contributors.

// Contributors: Tahira Niazi

/**
 * @author Irtiza Hammad, Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2020-01-28 12:57:44
 * @modify date 2020-01-28 12:57:44
 * @desc [description]
 */

import 'hammerjs';
import React from 'react';
import { getGraphData } from "../service/GetService";
import { apiUrl } from "../util/AahungUtil.js";
var serverAddress = apiUrl;

class PrimaryStatsContainer extends React.Component {

    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this);
    }

    async componentDidMount() {
        await this.getData();
    }

    state = {
        donorCount: 0,
        userCount: 0,
        schoolCount: 0,
        institutionCount: 0,
        parentOrganizationCount: 0
    }

    async getData() {
        // donorCount
        var donorUrl = serverAddress + "/report/donorcount";
        var donorCount = await getGraphData(donorUrl);

        // userCount
        var userUrl = serverAddress + "/report/usercount";
        var userCount = await getGraphData(userUrl);

        // locationCount by category (School, Insitution, Parent Organization)
        var locationUrl = serverAddress + "/report/locationcount/category";
        var locationsCountArray = await getGraphData(locationUrl);
        var schoolCount = locationsCountArray.filter(obj => obj.category === 'School')[0];
        var institutionCount = locationsCountArray.filter(obj => obj.category === 'Institution')[0];
        var parentOrgCount = locationsCountArray.filter(obj => obj.category === 'Parent Organization')[0];
        
        this.setState({
            donorCount: String(donorCount),
            userCount: String(userCount),
            schoolCount: schoolCount.total,
            institutionCount: institutionCount.total,
            parentOrganizationCount: parentOrgCount.total
        })
    }

    render() {
        return (
            <div class="container my-2 py-2">
                <div class="row">
                    <div class="col-lg-2 mb-8">
                        <div class="media white z-depth-1 rounded">
                            <i class="far fa-money-bill-alt fa-lg blue z-depth-1 p-4 rounded-left text-white mr-3"></i>
                            <div class="media-body p-1">
                                <p class="text-uppercase text-muted mb-1"><small>donors</small></p>
                                <h5 class="font-weight-bold mb-0">{this.state.donorCount}</h5>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-2 col-md-8 mb-6">
                        <div class="media white z-depth-1 rounded">
                            <i class="fas fa-users fa-lg teal z-depth-1 p-4 rounded-left text-white mr-3"></i>
                            <div class="media-body p-1">
                                <p class="text-uppercase text-muted mb-1"><small>users</small></p>
                                <h5 class="font-weight-bold mb-0">{this.state.userCount}</h5>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-2 col-md-8 mb-6" >
                        <div class="media white z-depth-1 rounded">
                            <i class="fas fa-school fa-lg purple z-depth-1 p-4 rounded-left text-white mr-3"></i>
                            <div class="media-body p-1">
                                <p class="text-uppercase text-muted mb-1"><small>School</small></p>
                                <h5 class="font-weight-bold mb-0">{this.state.schoolCount}</h5>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-8 mb-6">
                        <div class="media white z-depth-1 rounded">
                            <i class="fas fa-university fa-lg green z-depth-1 p-4 rounded-left text-white mr-3"></i>
                            <div class="media-body p-1">
                                <p class="text-uppercase text-muted mb-1"><small>Institution</small></p>
                                <h5 class="font-weight-bold mb-0">{this.state.institutionCount}</h5>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-8s mb-6">
                        <div class="media white z-depth-1 rounded">
                            <i class="fas fa-sitemap fa-lg orange z-depth-1 p-4 rounded-left text-white mr-3"></i>
                            <div class="media-body p-1">
                                <p class="text-uppercase text-muted mb-1"><small>Parent Organization</small></p>
                                <h5 class="font-weight-bold mb-0">{this.state.parentOrganizationCount}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default PrimaryStatsContainer;