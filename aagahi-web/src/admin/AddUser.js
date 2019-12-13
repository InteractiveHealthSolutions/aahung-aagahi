/*
 * @Author: tahira.niazi@ihsinformatics.com 
 * @Date: 2019-09-13 02:03:59 
 * @Last Modified by: tahira.niazi@ihsinformatics.com
 * @Last Modified time: 2019-12-11 09:57:25
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

import { MDBBtn, MDBContainer, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from "mdbreact";
import 'pretty-checkbox/dist/pretty-checkbox.min.css';
import React, { Fragment } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, TabContent, TabPane } from 'reactstrap';
import openIconic from "../img/open-iconic.svg";
import "../index.css";
import { getAllRoles, getAllUsers, getUserByRegexValue } from "../service/GetService";
import { saveUser, updateUser } from "../service/PostService";
import FormNavBar from "../widget/FormNavBar";
import LoadingIndicator from "../widget/LoadingIndicator";
import { hasPrivilege } from "../util/AahungUtil.js";

class AddUser extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            role : 1, //remove later,
            lseTrainer: "Lse Trainer",
            users: [],
            activeTab: '1',
            page2Show: true,
            loading: false,
            errors: {},
            hasError: false,
            modal: false,
            modalText: '',
            okButtonStyle: {},
            modalHeading: '',
            rolesForm: [],
        };
        
        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.inputChange = this.inputChange.bind(this);
        
        this.editMode = false;
        this.disablePassword = true;
        this.requiredFields = ["full_name"];
        this.roleCount = 0;
        this.rolesArray = [];
        this.fetchedUser = {};
        this.errors = {};
        this.disableSubmitButton = true; 

    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.beforeunload.bind(this));
        this.loadData();

    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.beforeunload.bind(this));
    }

    /**
     * Loads data when the component is mounted
     */
    loadData = async () => {

        try {
            this.editMode = (this.props.location.state !== undefined && this.props.location.state.edit) ? true : false;
            this.setState({
                loading: true,
                loadingMsg: "Fetching data..."
            })
            let roles = await getAllRoles();
            this.rolesArray = roles;

            roles.forEach(function(obj) {
                let roleName = obj.roleName;
            })

            this.createUI(roles);
            let users = await getAllUsers();
            this.setState({
                users : users
            })

            if(this.editMode) {
                this.fetchedUser = await getUserByRegexValue(String(this.props.location.state.userId));
                console.log(this.fetchedUser);
                var assignedRoles = this.fetchedUser.roles;
                this.setState({
                    username : this.fetchedUser.username,
                    full_name : this.fetchedUser.fullName
                })

                for(let i=0; i < assignedRoles.length; i++ ) {
                    var roleName = assignedRoles[i].roleName.replace(/\s/g, '');
                    var roleCheckbox = document.getElementById(roleName);
                    roleCheckbox.checked = true; 
                }

                this.setState({ 
                    loading: false
                })
            }
            this.setState({ 
                loading: false
            })

            if(this.editMode && hasPrivilege('Edit User')) {
                this.disableSubmitButton = false;
            }
            else {
                this.disableSubmitButton = false;
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    beforeunload(e) {
          e.preventDefault();
          e.returnValue = true;
    }

    cancelCheck = () => {
        this.resetForm();
    }

    handleCheckboxChange(e, name) {
        this.setState({
            hasData: false
        })

        if(e.target.checked == true) {
            this.disablePassword = false;
        }
        else {
            this.disablePassword = true;
        }
    }

    // for text and numeric questions
    inputChange(e, name) {

        let errorText = '';
        if((e.target.pattern != "" && e.target.pattern != undefined) ) {
            
            errorText = e.target.value.match(e.target.pattern) != e.target.value ? "Invalid. Please see hint!" : '';
            console.log(errorText);
            this.errors[name] = errorText;
        }
        this.setState({
            [name]: e.target.value
        });
        this.setState({ errors: this.errors });
    }

    // for autocomplete single select
    handleChange(e, name) {
        this.setState({
            [name]: e
        });
    };

    callModal = () => {
        this.setState({ modal : !this.state.modal });
    }
    
    handleSubmit = event => {
        event.preventDefault();
        if(this.handleValidation()) {

            console.log("in submission");
            this.setState({ 
                loading: true,
                loadingMsg: "Saving trees..."
            })

            try {

                if(this.editMode) {
                    // let self = this;
                    this.fetchedUser.fullName = this.state.full_name;
                    if(this.editMode && !this.disablePassword) {
                        this.fetchedUser.password = this.state.password;
                    }

                    let multiRoleObject = [];
                    for(let i=0; i < this.rolesArray.length; i++ ) {
                        var roleName = this.rolesArray[i].roleName.replace(/\s/g, '');
                        var roleCheckbox = document.getElementById(roleName);
                        if(roleCheckbox.checked == true) {
                            
                            let roleObj = {};
                            roleObj.roleId = this.rolesArray[i].id;
                            multiRoleObject.push(roleObj);
                        }
                    }

                    this.fetchedUser.userRoles = multiRoleObject;
                    delete this.fetchedUser.roles;
                    delete this.fetchedUser.createdBy;
                    delete this.fetchedUser.updatedBy;
                    console.log("printing created json object below >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    console.log(this.fetchedUser);
    
                    updateUser(this.fetchedUser, this.fetchedUser.uuid)
                    .then(
                        responseData => {
                            if(!(String(responseData).includes("Error"))) {
                                
                                this.setState({ 
                                    loading: false,
                                    modalHeading : 'Success!',
                                    okButtonStyle : { display: 'none' },
                                    modalText : 'Data updated successfully.',
                                    modal: !this.state.modal
                                });
                                
                                this.resetForm(this.requiredFields);
                            }
                            else if(String(responseData).includes("Error")) {
                                
                                var submitMsg = '';
                                submitMsg = "Unable to update User Details. \
                                " + String(responseData);
                                
                                this.setState({ 
                                    loading: false,
                                    modalHeading : 'Fail!',
                                    okButtonStyle : { display: 'none' },
                                    modalText : submitMsg,
                                    modal: !this.state.modal
                                });
                            }
                        }
                    );
                }
                else {
                    const data = new FormData(event.target);
                    console.log(data);
                    var jsonData = {};
                    jsonData.username = data.get('username');
                    jsonData.fullName = data.get('full_name');
                    jsonData.password = data.get('password'); 
                    jsonData.isVoided = false;
                    let multiRoleObject = [];
                    for(let i=0; i < this.rolesArray.length; i++ ) {
                        var roleName = this.rolesArray[i].roleName.replace(/\s/g, '');
                        var roleCheckbox = document.getElementById(roleName);
                        if(roleCheckbox.checked == true) {
                            
                            let roleObj = {};
                            roleObj.roleId = this.rolesArray[i].id;
                            multiRoleObject.push(roleObj);
                        }
                    }
                    console.log(multiRoleObject);
                    jsonData.userRoles = multiRoleObject; 
                    
                    console.log(jsonData);
                    saveUser(jsonData)
                    .then(
                        responseData => {
                            console.log(responseData);
                            if(!(String(responseData).includes("Error"))) {
                                
                                this.setState({ 
                                    loading: false,
                                    modalHeading : 'Success!',
                                    okButtonStyle : { display: 'none' },
                                    modalText : 'Data saved successfully.',
                                    modal: !this.state.modal
                                });

                                // document.getElementById("projectForm").reset();
                                this.resetForm();
                            }
                            else if(String(responseData).includes("Error")) {
                                
                                var submitMsg = '';
                                submitMsg = "Unable to create User. \
                                " + String(responseData);
                                
                                this.setState({ 
                                    loading: false,
                                    modalHeading : 'Fail!',
                                    okButtonStyle : { display: 'none' },
                                    modalText : submitMsg,
                                    modal: !this.state.modal
                                });
                            }
                        }
                    );
                }
            }
            catch(error) {
                console.log(error);
                var submitMsg = '';
                submitMsg = "An error occured. Please see error logs for details. "
                
                this.setState({ 
                    loading: false,
                    modalHeading : 'Fail!',
                    okButtonStyle : { display: 'none' },
                    modalText : submitMsg,
                    modal: !this.state.modal
                });
            }
        }
    }

    handleValidation(){
        // check each required state
        
        let formIsValid = true;
        console.log(this.requiredFields);
        this.setState({ hasError: this.checkValid([]) ? false : true });
        formIsValid = this.checkValid([]);
        this.setState({errors: this.errors});
        return formIsValid;
    }

    beforeSubmit(){

        // check validity of user

    }

    /**
     * verifies and notifies for the empty form fields
     */
    checkValid = (fields) => {

        let self = this;
        let isOk = true;
        this.errors = {};
        var userArray = this.state.users;
        var username = this.state.username; 
        var incorrectPassword = false;
        // userArray.forEach(function(obj) {
        
        if(!this.editMode) {
            if(userArray.filter(user => user.username === username) != null && userArray.filter(user => user.username === username).length > 0 )
            {
                isOk = false;
                this.errors["username"] = "Please enter unique username!";
            }
        }

        var isAnyRoleChecked = false; 
        for(let i=0; i < this.rolesArray.length; i++ ) {
            var roleName = this.rolesArray[i].roleName.replace(/\s/g, '');
            var roleCheckbox = document.getElementById(roleName);
            if(roleCheckbox.checked == true) {
                isAnyRoleChecked = true;
            }
        }
        
        if(!isAnyRoleChecked) {
            isOk = false;
            this.errors["roles"] = "Please select roles!";
        }

        // if(this.editMode && this.roleCount == 0) {
            
        // }

        if(!this.editMode || (this.editMode && !this.disablePassword)) {
            var pswRegex =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
            if(!this.state.password.match(pswRegex)) 
            { 
                isOk = false;
                incorrectPassword = true;
                this.errors["password"] = "Invalid password. Please see hint!";
            }

            if(!incorrectPassword && this.state.password != this.state.password_confirm) {
                isOk = false;
                this.errors["password"] = "Passwords do not match!";
                this.errors["password_confirm"] = "Passwords do not match!";
            }
        }

        this.setState({errors: this.errors});
        return isOk;
    }


    toggle = () => {
        this.setState({
          modal: !this.state.modal
        });
    }

    // for single select
    valueChange = (e, name) => {
        console.log(e); 
        console.log(e.target.value);

        this.setState({
            [name]: e.target.value
        });

        if(e.target.checked)
            this.roleCount++;
        else if(!e.target.checked)
            this.roleCount--;

    }

    createUI(roles){
        
        var array = this.state.participantForm;
        array = [];

        if(roles != null ) {
            for (let i = 0; i < roles.length; i++) {

                var roleName = roles[i].roleName.replace(/\s/g, '');
                array.push(
                
                    <Container >
                        <div class="pretty p-svg p-toggle p-plain p-bigger p-round" >
                            <input type="checkbox" id={ `${ roleName }` } value={ `${ roles[i].roleName }` } defaultChecked= { false} onChange={(e) => this.valueChange(e, "1")}/>
                            <div class="state p-on" >
                            <svg class="svg" viewBox="0 0 8 8" style={{fill: "rgb(247, 144, 29)"}}><use xlinkHref={`${openIconic}#lock-unlocked`} class="icon-lock-unlocked"></use></svg>
                            
                                <label>{roles[i].roleName}</label>
                            </div>
                            <div class="state p-off" >
                            <svg class="svg" viewBox="0 0 8 8" style={{fill: "grey"}}><use xlinkHref={`${openIconic}#lock-locked`} class="icon-lock-locked"></use></svg>
                            
                            {/* <img class="svg" style={{fill: "#65bbd2"}} src={lock}/> */}
                                <label>{roles[i].roleName}</label>
                            </div>
                        </div>
                        <br/>
                    </Container>
            )   
            }
        }

        this.setState({
            rolesForm: array
        });

     }

    /**
     * resets the form
     */
    resetForm = () => {
        
        this.setState( {
            full_name: '',
            username: '',
            password: '',
            password_confirm: ''
        })

        for(let i=0; i < this.rolesArray.length; i++ ) {
            var roleName = this.rolesArray[i].roleName.replace(/\s/g, '');   
            var roleCheckbox = document.getElementById(roleName);
            roleCheckbox.checked = false;
        }
    }
    
    
    render() {

        // for view mode
        const setDisable = this.state.viewMode ? "disabled" : "";
        const passwordDisable = this.disablePassword && this.editMode ? "disabled" : "";
        const usernameDisable = this.editMode ? "disabled" : "";
        const changePasswordDisplay = this.editMode ? "block" : "none";
        const buttonDisable = false;

        return (
            
            <div id="formDiv">
                <Router>
                    <header>
                    <FormNavBar isVisible={true} {...this.props} componentName="Admin" />
                    </header>        
                </Router>
                <Fragment >
                    <ReactCSSTransitionGroup
                        component="div"
                        transitionName="TabsAnimation"
                        transitionAppear={true}
                        transitionAppearTimeout={0}
                        transitionEnter={false}
                        transitionLeave={false}>
                        <div>
                            <Container >
                            <Form id="projectForm" onSubmit={this.handleSubmit} innerRef={input => this.messageForm = input}>
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>Add User</b>
                                            </CardHeader>

                                        </Card>
                                    </Col>

                                </Row>

                                {/* <br/> */}

                                <Row>
                                    <Col md="12">
                                        <Card className="main-card mb-6 center-col">
                                            <CardBody>

                                                {/* error message div */}
                                                <div class="alert alert-danger" style={this.state.hasError ? {} : { display: 'none' }} >
                                                <span class="errorMessage"><u>Errors: <br/></u> Form has some errors. Please check for required or invalid fields.<br/></span>
                                                </div>

                                                <br/>
                                                
                                                <fieldset >
                                                    <TabContent activeTab={this.state.activeTab}>
                                                        <TabPane tabId="1">
                                                            <Row>
                                                            <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="full_name" >Full Name</Label> <span class="errorMessage">{this.state.errors["full_name"]}</span>
                                                                        <Input name="full_name" id="full_name" value={this.state.full_name} onChange={(e) => {this.inputChange(e, "full_name")}} maxLength="200" pattern="^[A-Za-z ]+" placeholder="Full Name, letters only"  required/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="username" >Username</Label> <span class="errorMessage">{this.state.errors["username"]}</span>
                                                                        <Input name="username" id="username" value={this.state.username} onChange={(e) => {this.inputChange(e, "username")}} maxLength="200" pattern="^[a-z]+[.]{1}[a-z]+$" placeholder="firstname.lastname" required disabled={usernameDisable}/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="password" >Password</Label> 
                                                                        {/* <div > */}
                                                                            <div class="pretty p-icon p-smooth" style={{marginLeft: "50%"}}>
                                                                                <input type="checkbox" onChange={(e) => this.handleCheckboxChange(e, "username")} style={{display: changePasswordDisplay}}/>
                                                                                <div class="state p-warning" style={{display: changePasswordDisplay}}>
                                                                                    <i class="icon fas fa-check-square"></i>
                                                                                    <label><b>Change password</b></label>
                                                                                </div>
                                                                            </div>
                                                                        {/* </div> */}
                                                                        {/* <CustomRadioButton id="username" name="filter" value="1" handleCheckboxChange={(e) => this.handleCheckboxChange(e, "username")} /> Change password */}
                                                                        <Input name="password" type="password" id="password" value={this.state.password} onChange={(e) => {this.inputChange(e, "password")}} maxLength="15" placeholder="Enter password"  required disabled = {passwordDisable}/>
                                                                        <div><span style={{fontSize: "12px", color: "green"}}>At least 1 digit, at least 1 capital letter and length between 6 to 15 characters (Special characters allowed for strong password)</span></div>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="password_confirm" >Confirm Password</Label> <span class="errorMessage">{this.state.errors["password"]}</span>
                                                                        <Input name="password_confirm" type="password" id="password_confirm" value={this.state.password_confirm} onChange={(e) => {this.inputChange(e, "password_confirm")}} maxLength="200" placeholder="Re-type password"  required disabled = {passwordDisable}/>
                                                                    </FormGroup>
                                                                </Col>
                                                          
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <Label><h7><u><b>User Roles</b></u></h7></Label>  <span class="errorMessage">{this.state.errors["roles"]}</span>
                                                                </Col>
                                                            </Row>

                                                            <div>
                                                            { 
                                                                this.state.rolesForm.map(input => {
                                                                    return input
                                                                })

                                                                
                                                            }
                                                                    
                                                            </div>
                                                            

                                                        </TabPane>
                                                    </TabContent>
                                                    </fieldset>
                                                

                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>


                                {/* <div className="app-footer"> */}
                                {/* <div className="app-footer__inner"> */}
                                <Row>
                                    <Col md="12">
                                        <Card className="main-card mb-6">

                                            <CardHeader>

                                                <Row>
                                                    <Col md="3">
                                                    </Col>
                                                    <Col md="2">
                                                    </Col>
                                                    <Col md="2">
                                                    </Col>
                                                    <Col md="2">
                                                    <LoadingIndicator loading={this.state.loading} msg={this.state.loadingMsg}/>
                                                    </Col>
                                                    <Col md="3">
                                                        {/* <div className="btn-actions-pane-left"> */}
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit" disabled={buttonDisable}>Submit</Button>
                                                        <Button className="mb-2 mr-2" color="danger" size="sm" onClick={this.cancelCheck} disabled={buttonDisable}>Clear</Button>
                                                        {/* </div> */}
                                                    </Col>
                                                </Row>


                                            </CardHeader>
                                        </Card>
                                    </Col>
                                </Row>
                                {/* </div> */}
                                {/* </div> */}
                                

                                <MDBContainer>
                                    {/* <MDBBtn onClick={this.toggle}>Modal</MDBBtn> */}
                                    <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                                        <MDBModalHeader toggle={this.toggle}>{this.state.modalHeading}</MDBModalHeader>
                                        <MDBModalBody>
                                            {this.state.modalText}
                                        </MDBModalBody>
                                        <MDBModalFooter>
                                        <MDBBtn color="secondary" onClick={this.toggle}>OK!</MDBBtn>
                                        {/* <MDBBtn color="primary" style={this.state.okButtonStyle} onClick={this.confirm}>OK!</MDBBtn> */}
                                        </MDBModalFooter>
                                        </MDBModal>
                                </MDBContainer>
                            
                                </Form>
                            </Container>

                        </div>
                    </ReactCSSTransitionGroup>
                </Fragment>

            </div>
        );
    }
}

export default AddUser;