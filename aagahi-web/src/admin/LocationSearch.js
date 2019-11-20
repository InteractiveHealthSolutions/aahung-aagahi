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

import { Link } from 'react-router-dom';
import React, { Component } from "react";
import 'pretty-checkbox/dist/pretty-checkbox.min.css';
import { BrowserRouter as Router, Route, Switch, MemoryRouter } from 'react-router-dom';
import { Label, Input} from 'reactstrap';
import { MDBInput, MDBBadge, MDBDataTable, MDBMask, MDBView, MDBNavbar, MDBNavbarBrand, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardHeader, MDBBtn } from "mdbreact";
import { MDBListGroup, MDBListGroupItem, MDBTable, MDBTableBody, MDBTableHead, MDBContainer, MDBRow, MDBCol, MDBTabPane, MDBTabContent, MDBNav, MDBNavItem, MDBNavLink, MDBIcon, MDBDatePicker  } from
"mdbreact";
import  "../index.css";
import { getLocationByRegexValue, getLocationsByName} from '../service/GetService';
import Select from 'react-select';
import classnames from 'classnames';
import { matchPattern } from "../util/AahungUtil.js";
import { getDistrictsByProvince, location, getDistrictsByMultipleProvinces } from "../util/LocationUtil.js";
import { getReportByName, getReportByComponent } from "../util/ReportsListUtil.js";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getLocationsByCategory, getLocationsByParent } from '../service/GetService';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import moment from 'moment';
import RequirePrivilege from '../access/RequirePrivilege';
import CustomRadioButton from "../widget/CustomRadioButton";
import { AgGridReact } from '@ag-grid-community/react';
import {AllCommunityModules} from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import * as Constants from "../util/Constants";
import {Animated} from "react-animated-css";

class LocationSearch extends React.Component {

    modal = false;

    // widget IDs (and their states) are with underscore notation
    constructor(props) {
        super(props);
        this.state = {
            location: {
                columnDefs: [{ headerName: "ID", field: "locationId", sortable: true, suppressSizeToFit: true},
                { headerName: "Name", field: "name", sortable: true },
                { headerName: "Short Name", field: "shortName", sortable: true },
                { headerName: "Province", field: "province", sortable: true },
                { headerName: "City", field: "city", sortable: true },
                { headerName: "Category", field: "category", sortable: true },
                { headerName: "Created Date", field: "dateCreated", sortable: true },
                { headerName: "Created By", field: "createdBy", sortable: true }],
                rowData: []
                
            },
            institutions: [],
            parent_organization: '',
            location_name: '',
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

            let institutions = await getLocationsByCategory(Constants.PARENT_ORG_DEFINITION_UUID);
            if (institutions != null && institutions.length > 0) {
                let array = [];
                institutions.forEach(function(obj) {
                    if(!obj.isVoided) {
                        array.push({ "id" : obj.locationId, "value" : obj.locationName, "uuid" : obj.uuid, "shortName" : obj.shortName, "label" : obj.locationName, "locationName" : obj.locationName });
                    }
                })
                this.setState({
                    institutions: array
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
        // alert(selectedRows.length);
        var selectedRowsString = "";
        selectedRows.forEach(function(selectedRow, index) {
          if (index > 5) {
            return;
          }
          if (index !== 0) {
            selectedRowsString += ", ";
          }
          selectedRowsString += selectedRow.position;
          alert(selectedRow.name);
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
            if(!this.state.disableParent) {
                fetchedLocations = await getLocationsByParent(this.state.parent_organization.uuid);
                // if (fetchedLocations != null && fetchedLocations.length > 0) {
                    this.constructLocationList(fetchedLocations);
                // }
            }
            else if(!this.state.disableLocation) {
                // by location ID, returns a single location object
                if(matchPattern(Constants.UUID_LOCAITON_ID_REGEX, this.state.location_name)) {
                    var location = await getLocationByRegexValue(this.state.location_name);
                    fetchedLocations.push(location);
                    // if (fetchedLocations != null && fetchedLocations.length > 0) {
                        this.constructLocationList(fetchedLocations);
                    // }
                    
                }
                else{
                    // by location name, returns a list
                    fetchedLocations = await getLocationsByName(this.state.location_name);
                    // if (fetchedLocations != null && fetchedLocations.length > 0) {
                        this.constructLocationList(fetchedLocations);
                    // }
                }
            }
            this.setState({
                hasData: true
            })

            this.gridApi.sizeColumnsToFit();
            this.gridOptions.api.setColumnDefs();
        }
        catch(error) {
            console.log(error);
        }
    }

    constructLocationList(fetchedLocations) {
        let array = [];
        if (fetchedLocations != null && fetchedLocations.length > 0) {
            fetchedLocations.forEach(function(obj) {
                array.push({ "locationId" : obj.locationId, "name": obj.locationName, "shortName" : obj.shortName, "province" : obj.stateProvince, "city" : obj.cityVillage, "category": obj.category.definitionName, "dateCreated" : obj.dateCreated, "createdBy": obj.createdBy.username });
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
            <MDBCardHeader style={{backgroundColor: "#025277", color: "white"}}><h5><b>Location Search</b></h5></MDBCardHeader>
                <MDBCardBody>
                        <div id="filters" className="searchParams">
                            <MDBRow>
                                <MDBCol md="3">
                                    <h6>Search By ID or Parent Location</h6>
                                </MDBCol>
                                <MDBCol md="7">
                                <div className="searchFilterDiv">
                                    <CustomRadioButton id="location" name="filter" value="1" handleCheckboxChange={(e) => this.handleCheckboxChange(e, "location")}/>
                                    <Input className="searchFilter" placeholder="Location Name or ID" value={this.state.location_name} onChange={(e) => {this.inputChange(e, "location_name")}} disabled={this.state.disableLocation}/>
                                    <CustomRadioButton id="parent" name="filter" value="1" handleCheckboxChange={(e) => this.handleCheckboxChange(e, "parent")}/>
                                    <Select id="parent_organization" name="parent_organization" value={this.state.parent_organization} onChange={(e) => this.handleChange(e, "parent_organization")} options={this.state.institutions} isDisabled={this.state.disableParent}/>
                                </div>
                                </MDBCol>
                                <MDBCol md="1">
                                    <MDBBadge pill color="orange">
                                        <MDBIcon id="searchBtn" icon="search" size="2x" style={{cursor: "pointer"}} onClick= {this.searchData}/>
                                    </MDBBadge>
                                </MDBCol>
                            </MDBRow>
                        </div>
                        
                        <Animated animationIn="bounceInUp" animationOut="fadeOut" animationInDuration={2000} isVisible={this.state.hasData}>
                        <div style={{marginBottom: "1em"}}>
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

export default LocationSearch;