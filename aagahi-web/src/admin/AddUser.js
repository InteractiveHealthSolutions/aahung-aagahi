/*
 * @Author: tahira.niazi@ihsinformatics.com 
 * @Date: 2019-09-13 02:03:59 
 * @Last Modified by: tahira.niazi@ihsinformatics.com
 * @Last Modified time: 2019-09-18 16:45:03
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

import React, { Fragment } from "react";
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Input, Label, CustomInput, Form, FormGroup, Container, Card, CardBody, TabContent, TabPane, CardTitle, Row, Col } from 'reactstrap';
import { Button, CardHeader, ButtonGroup } from 'reactstrap';
import 'pretty-checkbox/dist/pretty-checkbox.min.css';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCardBody,
    MDBModalFooter,
    MDBBtn,
    MDBInput,
    MDBModal, MDBModalBody, MDBModalHeader,
  } from "mdbreact";
import "../index.css"
import classnames from 'classnames';
import Select from 'react-select';
import CustomModal from "../alerts/CustomModal";
import LoadingIndicator from "../widget/LoadingIndicator";
import { getObject} from "../util/AahungUtil.js";
import moment from 'moment';
import { saveUser } from "../service/PostService";
import { getAllRoles, getAllUsers } from "../service/GetService";

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
            viewMode: false,
            editMode: false,
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
        
        this.requiredFields = ["full_name"];
        this.roleCount = 0;
        this.rolesArray = [];
        this.errors = {};

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
        }
        catch(error) {
            console.log(error);
        }
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    beforeunload(e) {
          e.preventDefault();
          e.returnValue = true;
      }


    cancelCheck = () => {
        let errors = {};
        console.log(this.state.grant_start_date);
        document.getElementById("projectForm").reset();
        
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
        
        this.setState({errors: this.errors});
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

    handleClearClick = () => {
        
        // this.messageForm.reset();


        // this.checkValid([]);
      }
    
    handleSubmit = event => {
        
        event.preventDefault();
        if(this.handleValidation()) {

            console.log("in submission");

            this.setState({ 
                // form_disabled: true,
                loading : true
            })
            this.beforeSubmit();
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
                        this.messageForm.reset();
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
            
        if(userArray.filter(user => user.username === username) != null && userArray.filter(user => user.username === username).length > 0 )
        {
            isOk = false;
            this.errors["username"] = "Please enter unique username!";
        }

        if(this.roleCount == 0) {
            isOk = false;
            this.errors["roles"] = "Please select roles!";
        }

        var pswRegex =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        if(!this.state.password.match(pswRegex)) 
        { 
            isOk = false;
            incorrectPassword = true;
            this.errors["password"] = "Invalid password. Please see hint!";
        }

        if(incorrectPassword && this.state.password != this.state.password_confirm) {
            isOk = false;
            this.errors["password"] = "Passwords do not match!";
            this.errors["password_confirm"] = "Passwords do not match!";
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
        // alert(e.target.checked);

        this.setState({
            [name]: e.target.value
        });

        if(e.target.checked)
            this.roleCount++;

    }

    createUI(roles){
        
        var array = this.state.participantForm;
        array = [];

        if(roles != null ) {
            for (let i = 0; i < roles.length; i++) {

                var roleName = roles[i].roleName.replace(/\s/g, '');

                array.push(
                
                
                <Container >
                    

                    {/* <Row> */}
                        <div class="pretty p-default p-thick p-pulse">
                            <input type="checkbox" id={ `${ roleName }` } value={ `${ roles[i].roleName }` } defaultChecked= { false} onChange={(e) => this.valueChange(e, "1")}/>
                            <div class="state p-warning-o">
                                <label>{roles[i].roleName}</label>
                            </div>
                        </div>
                    {/* </Row> */}

                
                    <br/>
                </Container>
            
            )   
            }
        }

        this.setState({
            rolesForm: array
        });

     }
    
    render() {

        // for view mode
        const setDisable = this.state.viewMode ? "disabled" : "";

        return (
            
            <div >
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
                                                                        <Input name="username" id="username" value={this.state.username} onChange={(e) => {this.inputChange(e, "username")}} maxLength="200" pattern="^[a-z]+[.]{1}[a-z]+$" placeholder="firstname.lastname"  required/>
                                                                    </FormGroup>
                                                                </Col>
                                                          
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="password" >Password</Label> <span class="errorMessage">{this.state.errors["password"]}</span>
                                                                        <Input name="password" type="password" id="password" value={this.state.password} onChange={(e) => {this.inputChange(e, "password")}} maxLength="15" placeholder="Enter password"  required/>
                                                                        <div><span style={{fontSize: "12px", color: "green"}}>At least one numeric digit, one capital letter and a special character, length between 7 to 15 characters</span></div>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="password_confirm" >Confirm Password</Label>
                                                                        <Input name="password_confirm" type="password" id="password_confirm" value={this.state.password_confirm} onChange={(e) => {this.inputChange(e, "password_confirm")}} maxLength="200" placeholder="Enter name"  required/>
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
                                                    <LoadingIndicator loading={this.state.loading}/>
                                                    </Col>
                                                    <Col md="3">
                                                        {/* <div className="btn-actions-pane-left"> */}
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit">Submit</Button>
                                                        <Button className="mb-2 mr-2" color="danger" size="sm" onClick={this.handleClearClick} >Clear</Button>
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
                                        <MDBBtn color="secondary" onClick={this.toggle}>Cancel</MDBBtn>
                                        <MDBBtn color="primary" style={this.state.okButtonStyle} onClick={this.confirm}>OK!</MDBBtn>
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