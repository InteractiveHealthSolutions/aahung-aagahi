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

// Contributors: Owais Hussain

/**
 * @author Owais Hussain
 * @email owais.hussain@ihsinformatics.com
 * @create date 2019-12-18
 * @desc [description]
 */


import { Button } from '@progress/kendo-react-buttons';
import React from "react";
import DatePicker from "react-datepicker";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';


const provinces = [
    { label: 'Unknown', value: 1 },
    { label: 'Sindh', value: 2 },
    { label: 'Punjab', value: 3 },
    { label: 'KP', value: 4 },
    { label: 'Balochistan', value: 5 },
    { label: 'Gilgit-Baltistan', value: 6 },
]

class DashboardFilterContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    handleRefresh() {
        // TODO
    }

    handleDate(date, name) {
        this.setState({
          [name]: date
        });
      };
    

    render() {
        return (
            <div class="card">
                <h5 class="card-header h5" style={{color:'black'}}>Filter Data</h5>
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-2" style={{color:'black'}}>Province</div>
                        <div class="col-sm-2" style={{color:'black'}}>From date</div>
                        <div class="col-sm-2" style={{color:'black'}}>To date</div>
                        <div class="col-sm-2"></div>
                    </div>
                    <div class="row">
                        <div class="col-md-2">
                            <ReactMultiSelectCheckboxes multiple="true" options={provinces} />
                        </div>
                        <div class="col-md-2">
                        <DatePicker className="dateBox"
                                //   selected={this.state.start_date}
                                //   onChange={(date) => this.handleDate(date, "start_date")}
                                //   selectsStart
                                //   startDate={this.state.start_date}
                                //   endDate={this.state.end_date}
                                  placeholderText="Start Date"
                                  id="startingDate"
                                />
                        </div>
                        <div class="col-md-2">
                        <DatePicker className="dateBox"
                                //   selected={this.state.start_date}
                                //   onChange={(date) => this.handleDate(date, "end_date")}
                                //   selectsStart
                                //   startDate={this.state.start_date}
                                //   endDate={this.state.end_date}
                                  placeholderText="End Date"
                                  id="endingDate"
                                />
                        </div>
                        <div class="col-md-2">
                            <Button onClick={this.handleRefresh}>Refresh</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DashboardFilterContainer;
