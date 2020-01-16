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
import { MDBBadge, MDBBtn, MDBCardBody, MDBCardHeader, MDBCol, MDBIcon, MDBRow } from "mdbreact";
import 'pretty-checkbox/dist/pretty-checkbox.min.css';
import React from "react";
import { Animated } from "react-animated-css";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { Input } from 'reactstrap';
import UnvoidModal from "../alerts/UnvoidModal";
import VoidModal from "../alerts/VoidModal";
import "../index.css";
import { getAllRoles, getUserByRegexValue, getUsersByName, getUsersByRole } from '../service/GetService';
import { voidData } from '../service/PostService';
import { apiUrl, getEntityUrlByName, showAlert } from "../util/AahungUtil.js";
import CustomCheckBox from "../widget/CustomCheckBox";
import CustomRadioButton from "../widget/CustomRadioButton";

class UserSearch extends React.Component {

    // widget IDs (and their states) are with underscore notation
    constructor(props) {
        super(props);
        this.state = {
            user: {
                columnDefs: [{ headerName: "ID", field: "userId", sortable: true },
                { headerName: "Name", field: "name", sortable: true },
                { headerName: "Username", field: "username", sortable: true },
                { headerName: "Roles", field: "roles", sortable: true },
                { headerName: "Created Date", field: "dateCreated", sortable: true },
                { headerName: "Created By", field: "createdBy", sortable: true },
                { headerName: "Voided", field: "voided", sortable: true },
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
            allRoles: [],
            openModal: false,
            modal: false,
            parent_organization: '',  // widget IDs (and their states) are with underscore notation
            username: '',  // widget IDs (and their states) are with underscore notation
            disableUser: true,
            disableRole: true,
            hasData: false,
            includeVoided: false,
            searchValue: ""
        };

        this.errors = {};
        this.selectedUserId = '';
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

        if (name === "username") {
            this.setState({
                disableUser: false,
                disableRole: true,
                selected_role: '' // widgetId and state name
            })

        }
        else if (name === "role") {

            this.setState({
                disableUser: true,
                disableRole: false,
                username: '' // widgetId and state name
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

    onSelectionChanged(event) {
        this.setState({ 
            openModal : false,
            modal: false
        })
        var selectedRows = this.gridApi.getSelectedRows();
        let self = this;
        if(event.colDef.headerName === "Void") {
            selectedRows.forEach(function (selectedRow) {
                self.selectedUserId = selectedRow.userId;
            });
            this.setState({
                openModal : true
            });
        }
        else if(event.colDef.headerName === "Unvoid") {
            selectedRows.forEach(function (selectedRow) {
                self.selectedUserId = selectedRow.userId;
            });
            this.setState({
                modal : true
            })
        }
        else {
            selectedRows.forEach(function (selectedRow) {
                var urlEntity = getEntityUrlByName("user")[0];
                self.props.history.push({
                    pathname: urlEntity.url,
                    state: { edit: true, userId: selectedRow.userId }
                });
            });
        }
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
            var fetchedUsers = [];
            var isValid = true;
            if (this.state.username === '' && (this.state.selected_role === undefined || this.state.selected_role === '')) {
                alertify.set('notifier', 'delay', 5);
                alertify.set('notifier', 'position', 'top-center');
                alertify.error('<p><b>Please input data to search users.</b></p>', 'userError');
                isValid = false;
            }

            if (isValid) {
                this.setState({
                    hasData: false
                })

                if (!this.state.disableRole) {
                    fetchedUsers = await getUsersByRole(this.state.selected_role.uuid, this.state.includeVoided);
                    this.constructUserList(fetchedUsers);
                }
                else if (!this.state.disableUser) {

                    var regUsername = /^\w+(\.\w+)$/;
                    // by username, returns a single user object
                    if (regUsername.test(this.state.username)) {
                        var user = await getUserByRegexValue(this.state.username, this.state.includeVoided);
                        if (user != null) {
                            fetchedUsers.push(user);
                        }
                        this.constructUserList(fetchedUsers);
                    }
                    else {
                        // search user by name, returns a list
                        fetchedUsers = await getUsersByName(this.state.username, this.state.includeVoided);
                        this.constructUserList(fetchedUsers);
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

    constructUserList(fetchedUsers) {
        let array = [];
        if (fetchedUsers != null && fetchedUsers.length > 0) {
            fetchedUsers.forEach(function (obj) {
                var userRoles = obj.roles;
                var rolesString = userRoles.map(function (role) {
                    return role.roleName;
                }).join(', ');
                array.push({ "userId": obj.id, "name": obj.fullName, "username": obj.username, "roles": rolesString, "dateCreated": obj.dateCreated, "createdBy": obj.createdBy, "voided": obj.voided === true ? "True" : "False" });
            })
        }

        var user = { ...this.state.user }
        user.rowData = array;
        this.setState({ user });
        this.setState({
            hasData: true
        })
    }

    voidObject = reasonVoided => {
        voidData("user", this.selectedUserId, reasonVoided )
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
        var requestUrl = apiUrl + "/user/" + this.selectedUserId;
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

    onClick = () => {
        this.props.history.push('/addUser');
    }

    render() {

        const userTableDisplay = this.state.hasData ? "block" : "none";
        return (
            <div>
                <MDBCardHeader style={{ backgroundColor: "#025277", color: "white" }}><div className="searchFilterDiv"><h5 style={{ marginTop: "0.5%" }}><b>User Search</b></h5> <MDBBtn rounded outline size="sm" onClick={this.onClick} id="addUserButton" >Add User<MDBIcon icon="plus-circle" className="ml-2" /></MDBBtn></div></MDBCardHeader>
                <MDBCardBody>
                    <div id="filters" className="searchParams">
                        <MDBRow>
                            <MDBCol md="3">
                                <h7>Search By (Name, Username, Role)</h7>
                            </MDBCol>
                            <MDBCol md="8">
                                <div className="searchFilterDiv">
                                    <CustomRadioButton id="username" name="filter" value="1" handleCheckboxChange={(e) => this.handleCheckboxChange(e, "username")} />
                                    <Input className="searchFilter" id="username" placeholder="Username or Name" value={this.state.username} onChange={(e) => { this.inputChange(e, "username") }} disabled={this.state.disableUser} />
                                    <CustomRadioButton id="role" name="filter" value="1" handleCheckboxChange={(e) => this.handleCheckboxChange(e, "role")} />
                                    <Select id="selected_role" name="selected_role" className="secondSearchFilter" value={this.state.selected_role} onChange={(e) => this.handleChange(e, "selected_role")} options={this.state.allRoles} isDisabled={this.state.disableRole} />
                                    <CustomCheckBox id="includeVoided" name="includeVoided" handleCheckboxChange={(e) => this.handleCheckboxChange(e, "includeVoided")} />
                                    <label style={{ width: "50%" }}>Include voided</label>
                                </div>
                            </MDBCol>
                            <MDBCol md="1">
                                <MDBBadge pill color="orange" id="searchUserBadge" style={{ paddingTop: "2em !important" }}>
                                    <MDBIcon id="searchBtn" icon="search" size="2x" style={{ cursor: "pointer" }} onClick={this.searchData} />
                                </MDBBadge>
                            </MDBCol>
                        </MDBRow>
                    </div>

                    <Animated animationIn="bounceInUp" animationOut="fadeOut" animationInDuration={1000} isVisible={this.state.hasData}>
                        <div style={{ marginBottom: "1em", display: userTableDisplay }}>
                            <h4 style={{ display: "inline-block", float: "left" }}>Users </h4>
                            <Input type="text" id="seachValue" value={this.state.value} placeholder="Search..." onChange={this.onChange} style={{ maxWidth: "15em", marginLeft: "83%", borderColor: "orange" }} />
                        </div>
                        <div className="ag-theme-balham" style={{ height: '400px', width: '1250px', display: userTableDisplay }}>

                            <AgGridReact style={{ width: '1150px' }}
                                onGridReady={params => this.gridApi = params.api}
                                columnDefs={this.state.user.columnDefs}
                                rowData={this.state.user.rowData}
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

                <VoidModal openModal={this.state.openModal} modalHeading="Void User" handleSubmit={this.voidObject} closeModal={this.closeModal} {...this.props} />
                <UnvoidModal modal={this.state.modal} modalHeading="Unvoid User" handleSubmit={this.unvoidObject} objectType="user" closeModal={this.closeUnvoidModal} {...this.props}/>
            </div>
        );
    }
}

export default UserSearch;