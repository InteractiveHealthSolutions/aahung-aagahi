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

import { withRouter } from 'react-router-dom';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import { AgGridReact } from '@ag-grid-community/react';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import { MDBBadge, MDBCardBody, MDBCardHeader, MDBCol, MDBIcon, MDBRow, MDBBtn } from "mdbreact";
import 'pretty-checkbox/dist/pretty-checkbox.min.css';
import React from "react";
import { Animated } from "react-animated-css";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { Input } from 'reactstrap';
import "../index.css";
import { getAllRoles, getUserByRegexValue, getUsersByName, getUsersByRole } from '../service/GetService';
import CustomRadioButton from "../widget/CustomRadioButton";

class UserSearch extends React.Component {

    modal = false;

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
                { headerName: "Updated By", field: "updatedBy", sortable: true }],
                rowData: []
            },
            allRoles: [],
            parent_organization: '',  // widget IDs (and their states) are with underscore notation
            username: '',  // widget IDs (and their states) are with underscore notation
            disableUser: true,
            disableRole: true,
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
                roles.forEach(function (obj) {
                    array.push({ "id": obj.id, "value": obj.roleName, "uuid": obj.uuid, "isRetired": obj.isRetired, "label": obj.roleName });
                })
                this.setState({
                    allRoles: array
                })
            }

            // this.gridApi.sizeColumnsToFit();
            // this.gridOptions.api.setColumnDefs();
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
        selectedRows.forEach(function (selectedRow, index) {
            if (index > 5) {
                return;
            }
            if (index !== 0) {
                selectedRowsString += ", ";
            }
            selectedRowsString += selectedRow.position;
            // alert(selectedRow.name);
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
            var fetchedUsers = [];
            var isValid = true;
            if (this.state.username === '' && (this.state.selected_role === undefined || this.state.selected_role === '')) {
                alertify.set('notifier', 'delay', 5);
                alertify.set('notifier', 'position', 'top-center');
                alertify.error('<p><b>Please input data to search users.</b></p>', 'userError');
                isValid = false;
            }

            if(isValid) {
                this.setState({
                    hasData: false
                })

                if (!this.state.disableRole) {
                    fetchedUsers = await getUsersByRole(this.state.selected_role.uuid);
                    this.constructUserList(fetchedUsers);
                }
                else if (!this.state.disableUser) {

                    var regUsername = /^\w+(\.\w+)$/;
                    // by username, returns a single user object
                    if (regUsername.test(this.state.username)) {
                        var user = await getUserByRegexValue(this.state.username);
                        if (user != null) {
                            fetchedUsers.push(user);
                        }
                        this.constructUserList(fetchedUsers);
                    }
                    else {
                        // search user by name, returns a list
                        fetchedUsers = await getUsersByName(this.state.username);
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
                array.push({ "userId": obj.id, "name": obj.fullName, "username": obj.username, "roles": rolesString, "dateCreated": obj.dateCreated, "createdBy": obj.createdBy, "updatedBy": obj.updatedBy });

            })
        }

        var user = { ...this.state.user }
        user.rowData = array;
        this.setState({ user });
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

    onClick = () =>  {
        this.props.history.push('/addUser');
    }

    render() {

        const userTableDisplay = this.state.hasData ? "block" : "none";

        return (
            <div>
                <MDBCardHeader style={{ backgroundColor: "#025277", color: "white" }}><div className="searchFilterDiv"><h5 style={{marginTop: "0.5%"}}><b>User Search</b></h5> <MDBBtn rounded outline size="sm" onClick={this.onClick} id="addUserButton" >Add User<MDBIcon icon="plus-circle" className="ml-2" /></MDBBtn></div></MDBCardHeader>
                <MDBCardBody>
                    <div id="filters" className="searchParams">
                        <MDBRow>
                            <MDBCol md="3">
                                <h7>Search By (Name, Username, Role)</h7>
                            </MDBCol>
                            <MDBCol md="6">
                                <div className="searchFilterDiv">
                                    <CustomRadioButton id="username" name="filter" value="1" handleCheckboxChange={(e) => this.handleCheckboxChange(e, "username")} />
                                    <Input className="searchFilter" id="username" placeholder="Username or Name" value={this.state.username} onChange={(e) => { this.inputChange(e, "username") }} disabled={this.state.disableUser} />
                                    <CustomRadioButton id="role" name="filter" value="1" handleCheckboxChange={(e) => this.handleCheckboxChange(e, "role")} />
                                    <Select id="selected_role" name="selected_role" className="secondSearchFilter" value={this.state.selected_role} onChange={(e) => this.handleChange(e, "selected_role")} options={this.state.allRoles} isDisabled={this.state.disableRole} />
                                </div>
                            </MDBCol>
                            <MDBCol md="3">
                                <MDBBadge pill color="orange" id="searchUserBadge" style={{paddingTop: "2em !important"}}>
                                    <MDBIcon id="searchBtn" icon="search" size="2x" style={{ cursor: "pointer" }} onClick={this.searchData} />
                                </MDBBadge>
                                

                            </MDBCol>
                        </MDBRow>
                    </div>

                    <Animated animationIn="bounceInUp" animationOut="fadeOut" animationInDuration={1000} isVisible={this.state.hasData}>
                        <div style={{ marginBottom: "1em", display: userTableDisplay }}>
                            <h4 style={{ display: "inline-block", float: "left" }}>Users </h4>
                            <Input type="text" id="seachValue" value={this.state.value} placeholder="Search..." onChange={this.onChange} style={{ maxWidth: "15em", marginLeft: "83%" }} />
                        </div>
                        <div className="ag-theme-balham" style={{ height: '400px', width: '1250px', display: userTableDisplay }}>

                            <AgGridReact style={{ width: '1150px' }}
                                onGridReady={params => this.gridApi = params.api}
                                columnDefs={this.state.user.columnDefs}
                                rowData={this.state.user.rowData}
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

export default UserSearch;