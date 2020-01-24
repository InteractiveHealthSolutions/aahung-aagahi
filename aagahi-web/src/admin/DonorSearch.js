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
import { getEntityUrlByName, showAlert, apiUrl } from "../util/AahungUtil.js";
import CustomRadioButton from "../widget/CustomRadioButton";
import { voidData } from '../service/PostService';
import UnvoidModal from "../alerts/UnvoidModal";
import VoidModal from "../alerts/VoidModal";
import CustomCheckBox from "../widget/CustomCheckBox";

class DonorSearch extends React.Component {

    // widget IDs (and their states) are with underscore notation
    constructor(props) {
        super(props);
        this.state = {
            donor: {
                columnDefs: [{ headerName: "ID", field: "donorId", sortable: true },
                { headerName: "Name", field: "name", sortable: true },
                { headerName: "Short Name", field: "shortName", sortable: true },
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
                rowData: [],
                rowClassRules: {
                    "voided": function(params) {
                      var voided = params.data.voided;
                      return voided === "True";
                    }
                }
            },
            donor_shortname: '',  // widget IDs (and their states) are with underscore notation
            donor_name: '',
            disableShortname: true,
            disableName: true,
            hasData: false,
            openModal: false,
            modal: false,
            includeVoided: false,
            searchValue: ""

        };
        this.errors = {};
        this.selectedDonorId = '';
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

            let roles = await getAllRoles();
            if (roles != null && roles.length > 0) {
                let array = [];
                roles.forEach(function (obj) {
                    array.push({ "id": obj.id, "value": obj.roleName, "uuid": obj.uuid, "isRetired": obj.isRetired, "label": obj.roleName });
                })
                this.setState({
                    allRoles: array
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

        if (name === "shortname") {
            this.setState({
                disableShortname: false,
                disableName: true,
                donor_name: '' // widgetId and state name
            })
        }
        else if (name === "name") {
            this.setState({
                disableShortname: true,
                disableName: false,
                donor_shortname: '' // widgetId and state name
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
                self.selectedDonorId = selectedRow.donorId;
            });
            this.setState({
                openModal: true
            });
        }
        else if (event.colDef.headerName === "Unvoid") {
            selectedRows.forEach(function (selectedRow) {
                self.selectedDonorId = selectedRow.donorId;
            });
            this.setState({
                modal: true
            })
        }
        else {
            selectedRows.forEach(function (selectedRow) {
                var urlEntity = getEntityUrlByName("donor")[0];
                self.props.history.push({
                    pathname: urlEntity.url,
                    state: { edit: true, donorId: selectedRow.donorId }
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
            var fetchedDonors = [];
            var isValid = true;
            if (this.state.donor_shortname === '' && this.state.donor_name === '') {
                alertify.set('notifier', 'delay', 5);
                alertify.set('notifier', 'position', 'top-center');
                alertify.error('<p><b>Please input data to search donors.</b></p>', 'userError');
                isValid = false;
            }

            if (isValid) {
                this.setState({
                    hasData: false
                })

                if (!this.state.disableName) {
                    fetchedDonors = await getDonorByName(this.state.donor_name, this.state.includeVoided);
                    this.constructDonorList(fetchedDonors);
                }
                else if (!this.state.disableShortname) {
                    var donor = await getDonorByRegexValue(this.state.donor_shortname, this.state.includeVoided);
                    if (donor != null) {
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
        catch (error) {
            console.log(error);
        }
    }

    constructDonorList(fetchedDonors) {
        let array = [];
        if (fetchedDonors != null && fetchedDonors.length > 0) {
            fetchedDonors.forEach(function (obj) {
                array.push({ "donorId": obj.donorId, "name": obj.donorName, "shortName": obj.shortName, "dateCreated": moment(obj.dateCreated).format('ll'), "createdBy": obj.createdBy === null || obj.createdBy === undefined ? '' : obj.createdBy.fullName, "voided": obj.isVoided === true ? "True" : "False", "updatedBy": obj.updatedBy === null || obj.updatedBy === undefined ? '' : obj.updatedBy.fullName });
            })
        }

        var donor = { ...this.state.donor }
        donor.rowData = array;
        this.setState({ donor });
        this.setState({
            hasData: true
        })
    }

    voidObject = reasonVoided => {
        console.log("in void");
        voidData("donor", this.selectedDonorId, reasonVoided)
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
        var requestUrl = apiUrl + "/donor/" + this.selectedDonorId;
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

        const donorTableDisplay = this.state.hasData ? "block" : "none";
        return (
            <div>
                <MDBCardHeader style={{ backgroundColor: "#025277", color: "white" }}><h5><b>Donor Search</b></h5></MDBCardHeader>
                <MDBCardBody>
                    <div id="filters" className="searchParams">
                        <MDBRow>
                            <MDBCol md="3">
                                <h7>Search By (Donor ID, Name)</h7>
                            </MDBCol>
                            <MDBCol md="8">
                                <div className="searchFilterDiv">
                                    <CustomRadioButton id="donor_shortname" name="filter" value="1" handleCheckboxChange={(e) => this.handleCheckboxChange(e, "shortname")} />
                                    <Input className="searchFilter" id="donor_shortname" placeholder="Short Name" value={this.state.donor_shortname} onChange={(e) => { this.inputChange(e, "donor_shortname") }} disabled={this.state.disableShortname} />
                                    <CustomRadioButton id="donor_name" name="filter" value="1" handleCheckboxChange={(e) => this.handleCheckboxChange(e, "name")} />
                                    <Input className="searchFilter" id="donor_name" placeholder="Donor Name" value={this.state.donor_name} onChange={(e) => { this.inputChange(e, "donor_name") }} disabled={this.state.disableName} />
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
                        <div style={{ marginBottom: "1em", display: donorTableDisplay }}>
                            <h4 style={{ display: "inline-block", float: "left" }}>Donors </h4>
                            <Input type="text" id="seachValue" value={this.state.value} placeholder="Search..." onChange={this.onChange} style={{ maxWidth: "15em", marginLeft: "83%" }} />
                        </div>
                        <div className="ag-theme-balham" style={{ height: '400px', width: '1250px', display: donorTableDisplay }}>

                            <AgGridReact style={{ width: '1150px' }}
                                onGridReady={params => this.gridApi = params.api}
                                columnDefs={this.state.donor.columnDefs}
                                rowData={this.state.donor.rowData}
                                modules={AllCommunityModules}
                                rowSelection='single'
                                onCellClicked={this.onSelectionChanged.bind(this)}
                                pagination={true}
                                paginationPageSize="10"
                                enableColResize={true}
                                suppressCellSelection={true}
                                rowClassRules={this.state.donor.rowClassRules}
                                >
                            </AgGridReact>
                        </div>
                    </Animated>
                </MDBCardBody>

                <VoidModal openModal={this.state.openModal} modalHeading="Void Donor" handleSubmit={this.voidObject} closeModal={this.closeModal} {...this.props} />
                <UnvoidModal modal={this.state.modal} modalHeading="Unvoid Donor" handleSubmit={this.unvoidObject} objectType="donor" closeModal={this.closeUnvoidModal} {...this.props} />
            </div>
        );
    }
}

export default DonorSearch;