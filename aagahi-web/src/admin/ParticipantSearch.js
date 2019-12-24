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
import 'pretty-checkbox/dist/pretty-checkbox.min.css';
import React from "react";
import { Animated } from "react-animated-css";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { Input } from 'reactstrap';
import "../index.css";
import { getAllLightWeightLocations, getParticipantByRegexValue, getParticipantsByLocation, getParticipantsByName } from '../service/GetService';
import { getEntityUrlByName } from "../util/AahungUtil.js";
import CustomRadioButton from "../widget/CustomRadioButton";

class ParticipantSearch extends React.Component {

    modal = false;

    // widget IDs (and their states) are with underscore notation
    constructor(props) {
        super(props);
        this.state = {
            participant: {
                columnDefs: [{ headerName: "ID", field: "participantId", sortable: true },
                { headerName: "Name", field: "name", sortable: true },
                { headerName: "Identifier", field: "identifier", sortable: true },
                { headerName: "Gender", field: "gender", sortable: true },
                { headerName: "DOB", field: "dob", sortable: true },
                { headerName: "Participant Type", field: "participantType", sortable: true },
                { headerName: "School/Institution", field: "location", sortable: true },
                { headerName: "Created Date", field: "dateCreated", sortable: true },
                { headerName: "Created By", field: "createdBy", sortable: true },
                { headerName: "Updated By", field: "updatedBy", sortable: true }],
                rowData: []
            },
            allLocations: [],
            participant_name: '',  // widget IDs (and their states) are with underscore notation
            disableParticipant: true,
            disableLocation: true,
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

            let locations = await getAllLightWeightLocations();
            if (locations != null && locations.length > 0) {
                let array = [];
                locations.forEach(function (obj) {
                    array.push({ "id": obj.locationId, "value": obj.locationName, "uuid": obj.uuid, "shortName": obj.shortName, "label": obj.locationName, "locationName": obj.locationName });
                })
                this.setState({
                    allLocations: array
                })
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // Note: widget IDs (and their states) are with underscore notation
    handleCheckboxChange(e, name) {
        this.setState({
            hasData: false
        })

        if (name === "participant") {
            this.setState({
                disableParticipant: false,
                disableLocation: true,
                selected_location: '' // widgetId and state name
            })
        }
        else if (name === "location") {

            this.setState({
                disableParticipant: true,
                disableLocation: false,
                participant_name: '' // widgetId and state name
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
        selectedRows.forEach(function (selectedRow) {
            var urlEntity = getEntityUrlByName(selectedRow.participantType.toLowerCase())[0];
            self.props.history.push({
                pathname: urlEntity.url,
                state: { edit: true, participantId: selectedRow.participantId }
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
            var fetchedParticipants = [];
            var isValid = true;
            if (this.state.participant_name === '' && (this.state.selected_location === undefined || this.state.selected_location === '')) {
                alertify.set('notifier', 'delay', 5);
                alertify.set('notifier', 'position', 'top-center');
                alertify.error('<p><b>Please input data to search participants.</b></p>', 'userError');
                isValid = false;
            }

            if (isValid) {
                this.setState({
                    hasData: false
                })
                if (!this.state.disableLocation) {
                    fetchedParticipants = await getParticipantsByLocation(this.state.selected_location.uuid);
                    this.constructParticipantList(fetchedParticipants);
                }
                else if (!this.state.disableParticipant) {
                    // by participant ID, returns a single participant object (if contains spaces, it is a case of searching by name )
                    if (this.state.participant_name.length >= 8 && this.state.participant_name.length <= 10 && !(/\s/.test(this.state.participant_name))) {
                        fetchedParticipants = await getParticipantByRegexValue(this.state.participant_name);
                        this.constructParticipantList(fetchedParticipants);
                    }
                    else {
                        // by participant name, returns a list
                        fetchedParticipants = await getParticipantsByName(this.state.participant_name);
                        this.constructParticipantList(fetchedParticipants);
                    }
                }
                this.setState({
                    hasData: true
                })

                this.gridApi.sizeColumnsToFit();
                this.gridOptions.api.setColumnDefs();
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    constructParticipantList(fetchedParticipants) {
        let array = [];
        if (fetchedParticipants != null && fetchedParticipants.length > 0) {
            fetchedParticipants.forEach(function (obj) {
                array.push({ "participantId": obj.id, "name": obj.fullName, "identifier": obj.identifier, "gender": obj.gender, "dob": obj.dob, "participantType": obj.participantType, "location": obj.locationName, "dateCreated": obj.dateCreated, "createdBy": obj.createdBy, "updatedBy": obj.updatedBy });

            })
        }

        console.log("printing constructed array >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log(array);
        var participant = { ...this.state.participant }
        participant.rowData = array;
        this.setState({ participant });
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

        const participantTableDisplay = this.state.hasData ? "block" : "none";

        return (
            <div>
                <MDBCardHeader style={{ backgroundColor: "#025277", color: "white" }}><h5><b>Participant Search</b></h5></MDBCardHeader>
                <MDBCardBody>
                    <div id="filters" className="searchParams">
                        <MDBRow>
                            <MDBCol md="3">
                                <h6>Search By (Participant ID, Name, Location)</h6>
                            </MDBCol>
                            <MDBCol md="7">
                                <div className="searchFilterDiv">
                                    <CustomRadioButton id="participant" name="filter" value={this.state.participant} handleCheckboxChange={(e) => this.handleCheckboxChange(e, "participant")} />
                                    <Input className="searchFilter" id="participant_name" placeholder="Participant Name or ID" value={this.state.participant_name} onChange={(e) => { this.inputChange(e, "participant_name") }} disabled={this.state.disableParticipant} />
                                    <CustomRadioButton id="location" name="filter" value={this.state.location} handleCheckboxChange={(e) => this.handleCheckboxChange(e, "location")} />
                                    <Select id="selected_location" name="selected_location" className="secondSearchFilter" value={this.state.selected_location} onChange={(e) => this.handleChange(e, "selected_location")} options={this.state.allLocations} isDisabled={this.state.disableLocation} />
                                </div>
                            </MDBCol>
                            <MDBCol md="1">
                                <MDBBadge pill color="orange">
                                    <MDBIcon id="searchBtn" icon="search" size="2x" style={{ cursor: "pointer" }} onClick={this.searchData} />
                                </MDBBadge>
                            </MDBCol>
                        </MDBRow>
                    </div>

                    <Animated animationIn="bounceInUp" animationOut="fadeOut" animationInDuration={1500} isVisible={this.state.hasData}>
                        <div style={{ marginBottom: "1em", display: participantTableDisplay }}>
                            <h4 style={{ display: "inline-block", float: "left" }}>Participants </h4>
                            <Input type="text" id="seachValue" value={this.state.value} placeholder="Search..." onChange={this.onChange} style={{ maxWidth: "15em", marginLeft: "83%" }} />
                        </div>
                        <div className="ag-theme-balham" style={{ height: '400px', width: '1250px', display: participantTableDisplay }}>

                            <AgGridReact style={{ width: '1150px' }}
                                onGridReady={params => this.gridApi = params.api}
                                columnDefs={this.state.participant.columnDefs}
                                rowData={this.state.participant.rowData}
                                modules={AllCommunityModules}
                                rowSelection='single'
                                onSelectionChanged={this.onSelectionChanged.bind(this)}
                                pagination={true}
                                paginationPageSize="10"
                                enableColResize={true}>
                            </AgGridReact>
                        </div>
                    </Animated>
                </MDBCardBody>
            </div>
        );
    }
}

export default ParticipantSearch;