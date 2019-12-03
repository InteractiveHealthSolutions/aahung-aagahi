/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-11-14 14:13:08
 * @modify date 2019-11-14 14:13:08
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
import 'alertifyjs/build/css/alertify.css';
import { MDBBadge, MDBCardBody, MDBCardHeader, MDBCol, MDBIcon, MDBRow } from "mdbreact";
import 'pretty-checkbox/dist/pretty-checkbox.min.css';
import React from "react";
import { Animated } from "react-animated-css";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { Input } from 'reactstrap';
import "../index.css";
import { getLocationByRegexValue, getLocationsByCategory, getLocationsByParent } from '../service/GetService';
import { matchPattern } from "../util/AahungUtil.js";
import * as Constants from "../util/Constants";
import CustomRadioButton from "../widget/CustomRadioButton";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import { Label } from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class FormSearch extends React.Component {

    modal = false;

    // widget IDs (and their states) are with underscore notation
    constructor(props) {
        super(props);
        this.state = {
            location: {
                columnDefs: [{ headerName: "ID", field: "locationId", sortable: true},
                { headerName: "Name", field: "name", sortable: true },
                { headerName: "Short Name", field: "shortName", sortable: true },
                { headerName: "Province", field: "province", sortable: true },
                { headerName: "City", field: "city", sortable: true },
                { headerName: "Category", field: "category", sortable: true },
                { headerName: "Created Date", field: "dateCreated", sortable: true },
                { headerName: "Created By", field: "createdBy", sortable: true },
                { headerName: "Updated By", field: "updatedBy", sortable: true }],
                rowData: []
                
            },
            parentOrganizations: [],
            parent_organization: '',  // widget IDs (and their states) are with underscore notation
            location_name: '',  // widget IDs (and their states) are with underscore notation
            disableLocation: true,
            disableParent: true,
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

            let parentLocations = await getLocationsByCategory(Constants.PARENT_ORG_DEFINITION_UUID);
            if (parentLocations != null && parentLocations.length > 0) {
                let array = [];
                parentLocations.forEach(function(obj) {
                    if(!obj.isVoided) {
                        array.push({ "id" : obj.locationId, "value" : obj.locationName, "uuid" : obj.uuid, "shortName" : obj.shortName, "label" : obj.locationName, "locationName" : obj.locationName });
                    }
                })
                this.setState({
                    parentOrganizations: array
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

        if(name === "location") {
            this.setState({
                disableLocation : false,
                disableParent : true,
                parent_organization: '' // widgetId and state name
            })
            
        }
        else if(name === "parent") {

            this.setState({
                disableLocation : true,
                disableParent : false,
                location_name: '' // widgetId and state name
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
        var selectedRowsString = "";
        selectedRows.forEach(function(selectedRow, index) {
          if (index > 5) {
            return;
          }
          if (index !== 0) {
            selectedRowsString += ", ";
          }
          selectedRowsString += selectedRow.position;
        //   alert(selectedRow.name);
        });
        if (selectedRows.length >= 5) {
          selectedRowsString += " - and " + (selectedRows.length - 5) + " others";
        }
        
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
            var fetchedLocations = [];
            var isValid = true;
            if (this.state.parent_organization === '' && (this.state.location_name === undefined || this.state.location_name === '')) {
                alertify.set('notifier', 'delay', 5);
                alertify.set('notifier', 'position', 'top-center');
                alertify.error('<p><b>Please input data to search locations.</b></p>', 'userError');
                isValid = false;
            }

            if(isValid) {
                this.setState({
                    hasData: false
                })

                if(!this.state.disableParent) {
                    fetchedLocations = await getLocationsByParent(this.state.parent_organization.uuid);
                    this.constructLocationList(fetchedLocations);
                }
                else if(!this.state.disableLocation) {
                    // by location ID, returns a single location object
                    if(matchPattern(Constants.LOCATION_ID_REGEX, this.state.location_name)) {
                        var location = await getLocationByRegexValue(this.state.location_name);
                        if( location!== null) {
                            fetchedLocations.push(location);
                        }
                        this.constructLocationList(fetchedLocations);
                    }
                    else{
                        // by location name, returns a list
                        fetchedLocations = await getLocationByRegexValue(this.state.location_name);
                        this.constructLocationList(fetchedLocations);
                    }
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

    constructLocationList(fetchedLocations) {
        let array = [];
        if (fetchedLocations != null && fetchedLocations.length > 0) {
            fetchedLocations.forEach(function(obj) {
                array.push({ "locationId" : obj.locationId, "name": obj.locationName, "shortName" : obj.shortName, "province" : obj.stateProvince, "city" : obj.cityVillage, "category": obj.category.definitionName, "dateCreated" : obj.dateCreated, "createdBy": obj.createdBy === undefined ? '' : obj.createdBy.username, "updatedBy": obj.updatedBy === undefined ? '' : obj.updatedBy.username  });
            })
        }

        var location = {...this.state.location}
        location.rowData = array;
        this.setState({location});
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

        const locationTableDisplay = this.state.hasData ? "block" : "none";

        return (
            <div>
            <MDBCardHeader style={{backgroundColor: "#025277", color: "white"}}><h5><b>Form Search</b></h5></MDBCardHeader>
                <MDBCardBody>
                        <div id="filters" className="searchParams">
                            <MDBRow>
                                <MDBCol md="3">
                                    <h6>Search By (Date Range, Component, Form Type)</h6>
                                </MDBCol>
                                <MDBCol md="7">
                                <div className="searchFilterDiv">

                                    <div>
                                        {/* <Label>Start Date:    </Label> */}
                                        <DatePicker className="dateBox"
                                            selected={this.state.start_date}
                                            onChange={(date) => this.handleDate(date, "start_date")}
                                            selectsStart
                                            startDate={this.state.start_date}
                                            endDate={this.state.end_date}
                                            placeholderText="Start Date"
                                        />
                                        {/* <i class="far fa-calendar-alt"></i> */}
                                        </div><span className="required">*</span>
                                        <br/>
                                        <div>
                                        {/* <Label>End Date:   </Label> */}
                                        <DatePicker className="dateBox"
                                            selected={this.state.end_date}
                                            onChange={(date) => this.handleDate(date, "end_date")}
                                            selectsEnd
                                            endDate={this.state.end_date}
                                            minDate={this.state.start_date}
                                            placeholderText="End Date"
                                            maxDate={new Date()}
                                        />
                                        {/* <i color="secondary" class="far fa-calendar-alt"></i> */}
                                    </div><span className="required">*</span>
                                    <br/>
                                </div>
                                <br/>
                                
                                    
                                <div className="searchFilterDiv">
                                    {/* <CustomRadioButton id="location" name="filter" value="1" handleCheckboxChange={(e) => this.handleCheckboxChange(e, "location")}/> */}
                                    {/* <Input className="searchFilter" placeholder="Location Name or ID" value={this.state.location_name} onChange={(e) => {this.inputChange(e, "location_name")}} disabled={this.state.disableLocation}/> */}
                                    {/* <CustomRadioButton id="parent" name="filter" value="1" handleCheckboxChange={(e) => this.handleCheckboxChange(e, "parent")}/> */}
                                    {/* <Input className="searchFilter" placeholder="Location Name or ID" value={this.state.location_name} onChange={(e) => {this.inputChange(e, "location_name")}} disabled={this.state.disableLocation}/> */}
                                    <Label>Component: </Label>
                                    <Select id="parent_organization" name="parent_organization" style={{marginLeft: "10% !important"}} className="secondSearchFilter" value={this.state.parent_organization} onChange={(e) => this.handleChange(e, "parent_organization")} options={this.state.parentOrganizations} />
                                </div>

                                <div className="searchFilterDiv">
                                    <Label>Form Type: </Label>
                                    <Select id="parent_organization" name="parent_organization" className="secondSearchFilter" value={this.state.parent_organization} onChange={(e) => this.handleChange(e, "parent_organization")} options={this.state.parentOrganizations} />
                                </div>

                                </MDBCol>
                                <MDBCol md="1">
                                    <MDBBadge pill color="orange">
                                        <MDBIcon id="searchBtn" icon="search" size="2x" style={{cursor: "pointer"}} onClick= {this.searchData}/>
                                    </MDBBadge>
                                </MDBCol>
                            </MDBRow>
                        </div>
                        
                        <Animated animationIn="bounceInUp" animationOut="fadeOut" animationInDuration={1500} isVisible={this.state.hasData}>
                        <div style={{marginBottom: "1em", display: locationTableDisplay}}>
                            <h4 style={{display:"inline-block", float:"left"}}>Locations </h4>
                            <Input type="text" id="seachValue" value={this.state.value} placeholder="Search..." onChange={this.onChange} style={{maxWidth: "15em",marginLeft: "83%"}}/>
                        </div>
                        <div className="ag-theme-balham" style={ {height: '400px', width: '1250px', display: locationTableDisplay} }>
                            
                            <AgGridReact style={{width: '1150px'}}
                                onGridReady={ params => this.gridApi = params.api }
                                columnDefs={this.state.location.columnDefs}
                                rowData={this.state.location.rowData}
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

export default FormSearch;