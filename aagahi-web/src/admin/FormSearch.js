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
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import { MDBBadge, MDBCardBody, MDBCardHeader, MDBCol, MDBIcon, MDBRow } from "mdbreact";
import moment from 'moment';
import 'pretty-checkbox/dist/pretty-checkbox.min.css';
import React from "react";
import { Animated } from "react-animated-css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { Input, Label } from 'reactstrap';
import "../index.css";
import { getAllFormTypes, getDefinitionsByDefinitionType, searchForms } from '../service/GetService';
import { apiUrl, getEntityUrlByName, capitalize } from "../util/AahungUtil.js";
var serverAddress = apiUrl;

class FormSearch extends React.Component {

    modal = false;

    // widget IDs (and their states) are with underscore notation
    constructor(props) {
        super(props);
        this.state = {
            location: {
                columnDefs: [{ headerName: "ID", field: "formId", sortable: true},
                { headerName: "Form Type", field: "formTypeName", sortable: true },
                { headerName: "Form Group", field: "formGroupName", sortable: true },
                { headerName: "Location", field: "location", sortable: true },
                { headerName: "Form Date", field: "formDate", sortable: true },
                { headerName: "Created Date", field: "dateCreated", sortable: true },
                { headerName: "Created By", field: "createdBy", sortable: true },
                { headerName: "Updated By", field: "updatedBy", sortable: true }],
                rowData: []
                
            },
            formGroups: [],
            formTypes: [],
            form_component: '',  // widget IDs (and their states) are with underscore notation
            form_type: '',  // widget IDs (and their states) are with underscore notation
            hasData: false,
            searchValue: ""
            
        };
        this.errors = {};
        this.requestURL = '';
    }

    componentDidMount() {
        this.loadData();
    }

    /**
     * Loads data when the component is mounted
     */
    loadData = async () => {
        try {

            let allFormTypes = await getAllFormTypes();
            if (allFormTypes != null && allFormTypes.length > 0) {
                let array = [];
                allFormTypes.forEach(function(obj) {
                    if(!obj.isRetired) {
                        array.push({ "id" : obj.id, "value" : obj.uuid, "uuid" : obj.uuid, "label" : obj.name });
                    }
                })
                this.setState({
                    formTypes: array
                })
            }

            // 'form_group' is the definition type name that holds all definitions for form groups i.e. lse, srhm and comms
            let allFormGroups = await getDefinitionsByDefinitionType('form_group');
            if (allFormGroups != null && allFormGroups.length > 0) {
                let array = [];
                allFormGroups.forEach(function(obj) {
                    if(!obj.isRetired) {
                        array.push({ "id" : obj.id, "value" : obj.uuid, "uuid" : obj.uuid, "label" : obj.definitionName });
                    }
                })
                this.setState({
                    formGroups: array
                })
            }
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
            var urlEntity = getEntityUrlByName(selectedRow.formTypeName.toLowerCase())[0];
            self.props.history.push({
                pathname: urlEntity.url,
                state: { edit: true, formId: selectedRow.formId }
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

            var fetchedForms = [];
            var isValid = true;
            var isDate = true;
            if((this.state.start_date === null || this.state.start_date === undefined)  || (this.state.end_date === null || this.state.end_date === undefined)) {
                isValid = false;
                isDate = false;
            }

            if (!isDate && ((this.state.form_component === undefined || this.state.form_component === '') || (this.state.form_type === undefined || this.state.form_type === ''))) {
                alertify.set('notifier', 'delay', 5);
                alertify.set('notifier', 'position', 'top-center');
                alertify.error('<p><b>Please select date range with either Form component or Form group.</b></p>', 'userError');
            }
            else if((this.state.form_component === undefined || this.state.form_component === '') && (this.state.form_type === undefined || this.state.form_type === '')) {
                alertify.set('notifier', 'delay', 5);
                alertify.set('notifier', 'position', 'top-center');
                alertify.error('<p><b>Please select either Form component or Form group.</b></p>', 'userError');
                isValid = false;
            }
            else if(!isDate) {
                alertify.set('notifier', 'delay', 5);
                alertify.set('notifier', 'position', 'top-center');
                alertify.error('<p><b>Please select date range.</b></p>', 'userError');
                isValid = false;
            }

            if(isValid) {
                this.setState({
                    hasData: false
                })

                var fromDate = moment(this.state.start_date).format('YYYY-MM-DD');
                var toDate = moment(this.state.end_date).format('YYYY-MM-DD');
                this.requestURL = serverAddress + "/formdata/list/search";
                var urlWithParams = "?from=" + fromDate + "&to=" + toDate;
                if(this.state.form_component !== undefined && this.state.form_component != '') {
                    urlWithParams = urlWithParams.concat("&formGroup=" + this.state.form_component.uuid)
                }
                
                if(this.state.form_type !== undefined && this.state.form_type != '') {
                    urlWithParams = urlWithParams.concat("&formType=" + this.state.form_type.uuid)
                }
                fetchedForms = await searchForms(urlWithParams);
                this.constructFormDataList(fetchedForms);
                
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

    constructFormDataList(fetchedForms) {
        let array = [];
        if (fetchedForms != null && fetchedForms.length > 0) {
            fetchedForms.forEach(function(obj) {
                array.push({ "formId" : obj.formId, "formTypeName": obj.formTypeName, "formGroupName" : obj.formTypeGroup, "location" : obj.locationName === null || obj.locationName === undefined ? '' : capitalize(obj.locationName), "formDate" : moment(obj.formDate).format('ll'), "dateCreated": moment(obj.dateCreated).format('ll'), "createdBy": obj.createdBy === null || obj.createdBy === undefined ? '' : obj.createdBy, "updatedBy": obj.updatedBy === null || obj.updatedBy === undefined ? '' : obj.updatedBy  });
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

    handleDate(date, name) {
        this.setState({
          [name]: date
        });
      };
    
    render() {

        const locationTableDisplay = this.state.hasData ? "block" : "none";

        return (
            <div>
            <MDBCardHeader style={{backgroundColor: "#025277", color: "white"}}><h5><b>Form Search</b></h5></MDBCardHeader>
                <MDBCardBody>
                        <div id="filters" className="searchParams">
                            <MDBRow style={{marginTop: "-1%"}}>
                                <MDBCol md="3">
                                    <h6>Search By (Date Range, Component, Form Type)</h6>
                                </MDBCol>
                                <MDBCol md="8">
                                <div id="dateRangeDiv">

                                    <div id="firstDateDiv">
                                        <Label>Start Date:    </Label><span className="required">*</span>
                                        <DatePicker className="dateBox" id="dateSearch"
                                            selected={this.state.start_date}
                                            onChange={(date) => this.handleDate(date, "start_date")}
                                            selectsStart
                                            startDate={this.state.start_date}
                                            endDate={this.state.end_date}
                                            placeholderText="Select Start Date"
                                        />
                                        {/* <i class="far fa-calendar-alt"></i> */}
                                        </div>
                                        
                                        <div id="secondDateDiv">
                                        <Label>End Date:   </Label><span className="required">*</span>
                                        <DatePicker className="dateBox" id="dateSearch"
                                            selected={this.state.end_date}
                                            onChange={(date) => this.handleDate(date, "end_date")}
                                            selectsEnd
                                            endDate={this.state.end_date}
                                            minDate={this.state.start_date}
                                            placeholderText="Select End Date"
                                            maxDate={new Date()}
                                        />
                                        {/* <i color="secondary" class="far fa-calendar-alt"></i> */}
                                    </div>
                                    <br/>
                                </div>
                                <br/>
                                
                                    
                                <div className="" id="secondaryFilters">
                                    <Label style={{width: "15%", marginTop: "1%"}}>Component: </Label>
                                    <Select id="form_component" name="form_component" value={this.state.form_component} onChange={(e) => this.handleChange(e, "form_component")} options={this.state.formGroups} />
                                {/* </div> */}

                                    {/* <br/> */}
                                {/* <div className=""> */}
                                    <Label style={{width: "20%", marginTop: "1%"}}>Form Type: </Label>
                                    <Select id="form_type" name="form_type" value={this.state.form_type} onChange={(e) => this.handleChange(e, "form_type")} options={this.state.formTypes} />
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