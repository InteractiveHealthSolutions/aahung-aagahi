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
import Select from 'react-select';
import { Input } from 'reactstrap';
import "../index.css";
import { getAllDonors, getProjectByRegexValue, getProjectsByDonor, getProjectsByName } from '../service/GetService';
import { getEntityUrlByName, apiUrl, showAlert } from "../util/AahungUtil.js";
import CustomRadioButton from "../widget/CustomRadioButton";
import { voidData } from '../service/PostService';
import UnvoidModal from "../alerts/UnvoidModal";
import VoidModal from "../alerts/VoidModal";
import CustomCheckBox from "../widget/CustomCheckBox";

class ProjectSearch extends React.Component {

    // widget IDs (and their states) are with underscore notation
    constructor(props) {
        super(props);
        this.state = {
            project: {
                columnDefs: [{ headerName: "ID", field: "projectId", sortable: true },
                { headerName: "Name", field: "name", sortable: true },
                { headerName: "Donor", field: "donor", sortable: true },
                { headerName: "Short Name", field: "shortname", sortable: true },
                { headerName: "Created Date", field: "dateCreated", sortable: true },
                { headerName: "Created By", field: "createdBy", sortable: true },
                { headerName: "Voided", field: "voided", sortable: true },
                { headerName: "Updated By", field: "updatedBy", sortable: true },
                {
                    headerName: "Void",
                    template: `<i class="fas fa-ban"></i>`
                },
                {
                    headerName: "Unvoid",
                    template: `<i class="fas fa-redo"></i>`
                }
                ],
                rowData: []
            },
            allDonors: [],
            project_name: '',  // widget IDs (and their states) are with underscore notation
            disableProject: true,
            disableDonor: true,
            hasData: false,
            openModal: false,
            modal: false,
            includeVoided: false,
            searchValue: ""

        };
        this.errors = {};
        this.selectedProjectId = '';
        this.closeModal = this.closeModal.bind(this);
        this.closeUnvoidModal = this.closeUnvoidModal.bind(this);
        this.unvoidObject = this.unvoidObject.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    /**
     * Loads data when the component is mounted
     */
    loadData = async () => {
        try {
            let donors = await getAllDonors();
            let array = [];
            if (donors != null && donors.length > 0) {
                donors.forEach(function (obj) {
                    array.push({ "id": obj.id, "uuid": obj.uuid, "shortName": obj.shortName, "name": obj.name, "label": obj.name, "value": obj.id });
                })
                this.setState({
                    allDonors: array
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

        if (name === "project") {
            this.setState({
                disableProject: false,
                disableDonor: true,
                selected_donor: '' // widgetId and state name
            })
        }
        else if (name === "donor") {
            this.setState({
                disableProject: true,
                disableDonor: false,
                project_name: '' // widgetId and state name
            })
        }
        else {
            this.setState({
                includeVoided: e.target.checked
            });
        }
    }

    // for text and numeric questions
    inputChange(e, name) {
        this.setState({
            [name]: e.target.value
        });
    }

    closeModal() {
        this.setState({
            openModal: false
        })
    }

    closeUnvoidModal() {
        this.setState({
            modal: false
        })
    }

    onSelectionChanged(event) {
        this.setState({
            openModal: false,
            modal: false
        })
        var selectedRows = this.gridApi.getSelectedRows();
        let self = this;
        if (event.colDef.headerName === "Void") {
            selectedRows.forEach(function (selectedRow) {
                self.selectedProjectId = selectedRow.projectId;
            });
            this.setState({
                openModal: true
            });
        }
        else if (event.colDef.headerName === "Unvoid") {
            selectedRows.forEach(function (selectedRow) {
                self.selectedProjectId = selectedRow.projectId;
            });
            this.setState({
                modal: true
            })
        }
        else {
            selectedRows.forEach(function (selectedRow) {
                var urlEntity = getEntityUrlByName("project")[0];
                self.props.history.push({
                    pathname: urlEntity.url,
                    state: { edit: true, projectId: selectedRow.projectId }
                });
            });
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
            var fetchedProjects = [];
            var isValid = true;
            if (this.state.project_name === '' && (this.state.selected_donor === undefined || this.state.selected_donor === '')) {
                alertify.set('notifier', 'delay', 5);
                alertify.set('notifier', 'position', 'top-center');
                alertify.error('<p><b>Please input data to search projects.</b></p>', 'userError');
                isValid = false;
            }

            if (isValid) {
                this.setState({
                    hasData: false
                })

                // search projects by donor
                if (!this.state.disableDonor) {
                    fetchedProjects = await getProjectsByDonor(this.state.selected_donor.uuid, this.state.includeVoided);
                    this.constructProjectList(fetchedProjects);
                }
                else if (!this.state.disableProject) {
                    var regProject = /^\w+(\-\w+\-)[0-9]{4}$/;
                    // by project shortname, returns a single project object
                    if (regProject.test(this.state.project_name)) {
                        var project = await getProjectByRegexValue(this.state.project_name, this.state.includeVoided);
                        if (project != null) {
                            fetchedProjects.push(project);
                        }
                        this.constructProjectList(fetchedProjects);
                    }
                    else {
                        // search project by name, returns a list
                        fetchedProjects = await getProjectsByName(this.state.project_name, this.state.includeVoided);
                        this.constructProjectList(fetchedProjects);
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

    constructProjectList(fetchedProjects) {
        let array = [];
        if (fetchedProjects != null && fetchedProjects.length > 0) {
            fetchedProjects.forEach(function (obj) {
                array.push({ "projectId": obj.projectId, "name": obj.projectName, "donor": obj.donor === undefined ? '' : obj.donor.donorName, "shortname": obj.shortName, "dateCreated": moment(obj.dateCreated).format('ll'), "createdBy": obj.createdBy === null || obj.createdBy === undefined ? '' : obj.createdBy.fullName, "voided": obj.isVoided === true ? "True" : "False", "updatedBy": obj.updatedBy === null || obj.updatedBy === undefined ? '' : obj.updatedBy.fullName });
            })
        }

        var project = { ...this.state.project }
        project.rowData = array;
        this.setState({ project });
        this.setState({
            hasData: true
        })
    }

    voidObject = reasonVoided => {
        console.log("in void");
        voidData("project", this.selectedProjectId, reasonVoided)
            .then(
                responseData => {
                    console.log(responseData);
                    if (!(String(responseData).includes("Error"))) {
                        showAlert("Data voided successfully!", "SUCCESS");
                        this.setState({
                            openModal: false
                        })
                    }
                    else if (String(responseData).includes("Error")) {
                        showAlert("Unable to void data. Please see error logs for details.", "ERROR");
                    }
                }
            );
    }

    // used fetch call directly here for this patch request. Axios was not working for some reason.
    unvoidObject(event) {
        event.preventDefault();
        var requestUrl = apiUrl + "/project/" + this.selectedProjectId;
        fetch(requestUrl, {
            method: 'PATCH',
            headers: {
                'Authorization': sessionStorage.getItem('auth_header'),
            }
        }).then(response => {
            response.json().then(json => {
                if (response.status === 200) { // ok: success
                    showAlert("Data is restored successfully!", "SUCCESS");
                    // let self = this;
                    this.setState({
                        modal: false
                    })
                }
                else
                    showAlert("Error occurred while restoring data. Please see error logs for details.", "ERROR");
            });
        });
    }

    // for autocomplete single select
    async handleChange(e, name) {
        this.setState({
            [name]: e
        });
    }

    render() {

        const projectTableDisplay = this.state.hasData ? "block" : "none";

        return (
            <div>
                <MDBCardHeader style={{ backgroundColor: "#025277", color: "white" }}><h5><b>Project Search</b></h5></MDBCardHeader>
                <MDBCardBody>
                    <div id="filters" className="searchParams">
                        <MDBRow>
                            <MDBCol md="3">
                                <h7>Search By (Project ID, Name, Donor)</h7>
                            </MDBCol>
                            <MDBCol md="8">
                                <div className="searchFilterDiv">
                                    <CustomRadioButton id="project" name="filter" value={this.state.project} handleCheckboxChange={(e) => this.handleCheckboxChange(e, "project")} />
                                    <Input className="searchFilter" id="project_name" placeholder="Project Name or ID" value={this.state.project_name} onChange={(e) => { this.inputChange(e, "project_name") }} disabled={this.state.disableProject} />
                                    <CustomRadioButton id="donor" name="filter" value={this.state.donor} handleCheckboxChange={(e) => this.handleCheckboxChange(e, "donor")} />
                                    <Select id="selected_donor" name="selected_donor" className="secondSearchFilter" value={this.state.selected_donor} onChange={(e) => this.handleChange(e, "selected_donor")} options={this.state.allDonors} isDisabled={this.state.disableDonor} />
                                    <CustomCheckBox id="includeVoided" name="includeVoided" handleCheckboxChange={(e) => this.handleCheckboxChange(e, "includeVoided")} />
                                    <label style={{ width: "50%" }}>Include voided</label>
                                </div>
                            </MDBCol>
                            <MDBCol md="1">
                                <MDBBadge pill color="orange">
                                    <MDBIcon id="searchBtn" icon="search" size="2x" style={{ cursor: "pointer" }} onClick={this.searchData} />
                                </MDBBadge>
                            </MDBCol>
                        </MDBRow>
                    </div>

                    <Animated animationIn="bounceInUp" animationOut="fadeOut" animationInDuration={1000} isVisible={this.state.hasData}>
                        <div style={{ marginBottom: "1em", display: projectTableDisplay }}>
                            <h4 style={{ display: "inline-block", float: "left" }}>Projects </h4>
                            <Input type="text" id="seachValue" value={this.state.value} placeholder="Search..." onChange={this.onChange} style={{ maxWidth: "15em", marginLeft: "83%" }} />
                        </div>
                        <div className="ag-theme-balham" style={{ height: '400px', width: '1250px', display: projectTableDisplay }}>

                            <AgGridReact style={{ width: '1150px' }}
                                onGridReady={params => this.gridApi = params.api}
                                columnDefs={this.state.project.columnDefs}
                                rowData={this.state.project.rowData}
                                modules={AllCommunityModules}
                                rowSelection='single'
                                onCellClicked={this.onSelectionChanged.bind(this)}
                                pagination={true}
                                paginationPageSize="10"
                                enableColResize={true}
                                suppressCellSelection={true}>
                            </AgGridReact>
                        </div>
                    </Animated>
                </MDBCardBody>

                <VoidModal openModal={this.state.openModal} modalHeading="Void Project" handleSubmit={this.voidObject} closeModal={this.closeModal} {...this.props} />
                <UnvoidModal modal={this.state.modal} modalHeading="Unvoid Project" handleSubmit={this.unvoidObject} objectType="project" closeModal={this.closeUnvoidModal} {...this.props} />
            </div>
        );
    }
}

export default ProjectSearch;