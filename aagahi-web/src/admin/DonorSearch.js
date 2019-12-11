/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-11-22 10:02:26
 * @modify date 2019-11-22 10:02:26
 * @desc [description]
 */

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

import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import { AgGridReact } from '@ag-grid-community/react';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import { MDBBadge, MDBCardBody, MDBCardHeader, MDBCol, MDBIcon, MDBRow } from "mdbreact";
import moment from 'moment';
import 'pretty-checkbox/dist/pretty-checkbox.min.css';
import React from "react";
import { Animated } from "react-animated-css";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from 'reactstrap';
import "../index.css";
import { getAllRoles, getDonorByName, getDonorByRegexValue } from '../service/GetService';
import { getEntityUrlByName } from "../util/AahungUtil.js";
import CustomRadioButton from "../widget/CustomRadioButton";

class DonorSearch extends React.Component {

    modal = false;

    // widget IDs (and their states) are with underscore notation
    constructor(props) {
        super(props);
        this.state = {
            donor: {
                columnDefs: [{ headerName: "ID", field: "donorId", sortable: true},
                { headerName: "Name", field: "name", sortable: true},
                { headerName: "Short Name", field: "shortName", sortable: true},
                { headerName: "Created Date", field: "dateCreated", sortable: true },
                { headerName: "Created By", field: "createdBy", sortable: true },
                { headerName: "Updated By", field: "updatedBy", sortable: true }],
                rowData: []
            },
            donor_shortname: '',  // widget IDs (and their states) are with underscore notation
            donor_name: '',
            disableShortname: true,
            disableName: true,
            hasData: false,
            searchValue: ""
            
        };
        this.errors = {};
    }

    componentDidMount() {
        this.loadData();
    }

    /**
     * Loads data when the component is mounted
     */
    loadData = async () => {
        try {

            let roles = await getAllRoles();
            if (roles != null && roles.length > 0) {
                let array = [];
                roles.forEach(function(obj) {
                    array.push({ "id" : obj.id, "value" : obj.roleName, "uuid" : obj.uuid, "isRetired" : obj.isRetired, "label" : obj.roleName});
                })
                this.setState({
                    allRoles: array
                })
            }

            // this.gridApi.sizeColumnsToFit();
            // this.gridOptions.api.setColumnDefs();
        }
        catch(error) {
            console.log(error);
        }
    }

    // Note: widget IDs (and their states) are with underscore notation
    handleCheckboxChange(e, name) {
        this.setState({
            hasData: false
        })

        if(name === "shortname") {
            this.setState({
                disableShortname : false,
                disableName : true,
                donor_name: '' // widgetId and state name
            })
            
        }
        else if(name === "name") {

            this.setState({
                disableShortname : true,
                disableName : false,
                donor_shortname: '' // widgetId and state name
            })
        }

    }

    // for text and numeric questions
    inputChange(e, name) {

        this.setState({
            [name]: e.target.value
        });
    }

    onSelectionChanged() {
        var selectedRows = this.gridApi.getSelectedRows();
        let self = this;
        selectedRows.forEach(function(selectedRow) {
            var urlEntity = getEntityUrlByName("donor")[0];
            self.props.history.push({
                pathname: urlEntity.url,
                state: { edit: true, donorId: selectedRow.id }
              });
        });
    }

    onChange = e => {
        this.setState(
          {
            searchValue: e.target.value
          },
          () => {
            this.gridApi.setQuickFilter(this.state.searchValue);
          }
        );
      };

    searchData = async () => {
        try {
            var fetchedDonors = [];
            var isValid = true;
            if (this.state.donor_shortname === '' && this.state.donor_name === '') {
                alertify.set('notifier', 'delay', 5);
                alertify.set('notifier', 'position', 'top-center');
                alertify.error('<p><b>Please input data to search donors.</b></p>', 'userError');
                isValid = false;
            }

            if(isValid) {
                this.setState({
                    hasData: false
                })
                
                if(!this.state.disableName) {
                    fetchedDonors = await getDonorByName(this.state.donor_name);
                    this.constructDonorList(fetchedDonors);
                }
                else if(!this.state.disableShortname) {
                    var donor = await getDonorByRegexValue(this.state.donor_shortname);
                    if(donor != null) {
                        fetchedDonors.push(donor);
                    }
                    this.constructDonorList(fetchedDonors);
                }
                
                this.setState({
                    hasData: true
                })

                this.gridApi.sizeColumnsToFit();
                this.gridOptions.api.setColumnDefs();
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    constructDonorList(fetchedDonors) {
        let array = [];
        if (fetchedDonors != null && fetchedDonors.length > 0) {
            fetchedDonors.forEach(function(obj) {
                array.push({ "donorId" : obj.donorId, "name": obj.donorName,  "shortName" : obj.shortName, "dateCreated" : moment(obj.dateCreated).format('ll'), "createdBy": obj.createdBy === null || obj.createdBy === undefined ? '' : obj.createdBy.fullName, "updatedBy": obj.updatedBy === null || obj.updatedBy === undefined ? '' : obj.updatedBy.fullName});
            })
        }

        console.log(" constructed donor >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log(array);

        var donor = {...this.state.donor}
        donor.rowData = array;
        this.setState({donor});
        this.setState({
            hasData: true
        })
    }

    // for autocomplete single select
    async handleChange(e, name) {

        this.setState({
            [name]: e
        });
    }
    
    render() {

        const donorTableDisplay = this.state.hasData ? "block" : "none";

        return (
            <div>
            <MDBCardHeader style={{backgroundColor: "#025277", color: "white"}}><h5><b>Donor Search</b></h5></MDBCardHeader>
                <MDBCardBody>
                        <div id="filters" className="searchParams">
                            <MDBRow>
                                <MDBCol md="3">
                                    <h7>Search By (Donor ID, Name)</h7>
                                </MDBCol>
                                <MDBCol md="7">
                                <div className="searchFilterDiv">
                                    <CustomRadioButton id="donor_shortname" name="filter" value="1" handleCheckboxChange={(e) => this.handleCheckboxChange(e, "shortname")}/>
                                    <Input className="searchFilter" id="donor_shortname" placeholder="Short Name" value={this.state.donor_shortname} onChange={(e) => {this.inputChange(e, "donor_shortname")}} disabled={this.state.disableShortname}/>
                                    <CustomRadioButton id="donor_name" name="filter" value="1" handleCheckboxChange={(e) => this.handleCheckboxChange(e, "name")}/>
                                    <Input className="searchFilter" id="donor_name" placeholder="Donor Name" value={this.state.donor_name} onChange={(e) => {this.inputChange(e, "donor_name")}} disabled={this.state.disableName}/>
                                </div>
                                </MDBCol>
                                <MDBCol md="1">
                                    <MDBBadge pill color="orange">
                                        <MDBIcon id="searchBtn" icon="search" size="2x" style={{cursor: "pointer"}} onClick= {this.searchData}/>
                                    </MDBBadge>
                                </MDBCol>
                            </MDBRow>
                        </div>
                        
                        <Animated animationIn="bounceInUp" animationOut="fadeOut" animationInDuration={1000} isVisible={this.state.hasData}>
                        <div style={{marginBottom: "1em", display: donorTableDisplay}}>
                            <h4 style={{display:"inline-block", float:"left"}}>Donors </h4>
                            <Input type="text" id="seachValue" value={this.state.value} placeholder="Search..." onChange={this.onChange} style={{maxWidth: "15em",marginLeft: "83%"}}/>
                        </div>
                        <div className="ag-theme-balham" style={ {height: '400px', width: '1250px', display: donorTableDisplay} }>
                            
                            <AgGridReact style={{width: '1150px'}}
                                onGridReady={ params => this.gridApi = params.api }
                                columnDefs={this.state.donor.columnDefs}
                                rowData={this.state.donor.rowData}
                                modules={AllCommunityModules}
                                rowSelection='single'
                                onSelectionChanged={this.onSelectionChanged.bind(this)}
                                pagination={true}
                                paginationPageSize= "10"
                                enableColResize= {true}>
                            </AgGridReact>
                        </div>
                        </Animated>
                </MDBCardBody>
            </div>
        );
    }
}

export default DonorSearch;