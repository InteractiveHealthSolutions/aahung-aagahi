/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-09-11 16:15:31
 * @modify date 2019-09-11 16:15:31
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
import { saveProject } from "../service/PostService";
import { getAllDonors } from "../service/GetService";

class AddUser extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            role : 1, //remove later,
            lseTrainer: "Lse Trainer",
            donors: [],
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
        };
        
        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.inputChange = this.inputChange.bind(this);
        
        this.projectId = '';
        this.requiredFields = ["full_name"];

    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.beforeunload.bind(this));
        this.loadData();

        // working piece of code checkboxes
        var lseTrainer = document.getElementById("LseTrainer");
        alert(lseTrainer);
        if(lseTrainer.value === this.state.lseTrainer) {
            lseTrainer.checked = true; 
        }
        // alert(lseTrainer.checked);
        // alert(lseTrainer.value);
        // lseTrainer.checked =false;
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.beforeunload.bind(this));

        
    }

    /**
     * Loads data when the component is mounted
     */
    loadData = async () => {

        try {
            let donorArray = await getAllRoles();

            if(donorArray != null && donorArray.length > 0) {
                this.setState({
                    donors : donorArray
                })
            }
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

        this.setState({
            [name]: e.target.value
        });
        
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
        
        this.messageForm.reset();

        // working piece of code checkboxes
        var lseTrainer = document.getElementById("LseTrainer");
        // alert(lseTrainer.checked);
        // alert(lseTrainer.value);
        // lseTrainer.checked =false;
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
            var donorObject = {};
            donorObject['donorId'] = this.state.full_name.id;
            jsonData['donor'] =  donorObject;
            jsonData['projectName'] =  data.get('project_name');
            jsonData['shortName'] =  this.projectId;
            jsonData['dateGrantBegin'] =  this.state.grant_start_date;
            jsonData['dateGrantEnd'] =  this.state.grant_end_date;
            
            console.log(jsonData);
            saveProject(jsonData)
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
                        submitMsg = "Unable to submit project. \
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
        this.setState({ hasError: this.checkValid(this.requiredFields) ? false : true });
        formIsValid = this.checkValid(this.requiredFields);
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

        let isOk = true;
        this.errors = {};
        for(let j=0; j < fields.length; j++) {
            let stateName = fields[j];
            
            // for array object
            if(typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                isOk = false;
                this.errors[fields[j]] = "Please fill in this field!";
            }
                
            
            // for text and others
            if(typeof this.state[stateName] != 'object') {
                if(this.state[stateName] === "" || this.state[stateName] == undefined) {
                    isOk = false;
                    this.errors[fields[j]] = "Please fill in this field!";
                }   
            }
        }

        return isOk;
    }

    toggle = () => {
        this.setState({
          modal: !this.state.modal
        });
    }

    checkOrNot = (e) => {
        let id = e.target.id;
        alert('checkOrNot');
        if(id == this.state.role) {
            alert("true");
            return true;
        }
    }

    // for single select
    valueChange = (e, name) => {
        console.log(e); 
        console.log(e.target.value);
        alert(e.target.checked);

        this.setState({
            [name]: e.target.value
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
                                                                        <Select id="full_name" name="full_name" value={this.state.full_name} onChange={(e) => this.handleChange(e, "full_name")} options={this.state.donors} required/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="username" >Donor Name</Label>
                                                                        <Input name="username" id="username" value={this.state.username} onChange={(e) => {this.inputChange(e, "username")}} maxLength="200" placeholder="Enter name"  required/>
                                                                    </FormGroup>
                                                                </Col>
                                                          
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="password" >Password</Label> <span class="errorMessage">{this.state.errors["password"]}</span>
                                                                        <Select id="password" name="password" value={this.state.password} onChange={(e) => this.handleChange(e, "password")} required/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="password_confirm" >Donor Name</Label>
                                                                        <Input name="password_confirm" id="password_confirm" value={this.state.password_confirm} onChange={(e) => {this.inputChange(e, "password_confirm")}} maxLength="200" placeholder="Enter name"  required/>
                                                                    </FormGroup>
                                                                </Col>
                                                          
                                                            </Row>

                                                            <Row>
                                                            <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="project_name" >Project Name</Label> <span class="errorMessage">{this.state.errors["project_name"]}</span>
                                                                        <Input name="project_name" id="project_name" value={this.state.project_name} onChange={(e) => {this.inputChange(e, "project_name")}} maxLength="200" placeholder="Enter name"  required/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="project_id" >Project ID</Label>
                                                                        <Input name="project_id" id="project_id" value={this.projectId} onChange={(e) => {this.inputChange(e, "project_id")}} maxLength="200" placeholder="Enter name" disabled required/>
                                                                    </FormGroup>
                                                                </Col>
                                                          
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="grant_start_date" >Date partnership with Aahung was formed</Label> <span class="errorMessage">{this.state.errors["grant_start_date"]}</span>
                                                                        <Input type="date" name="grant_start_date" id="grant_start_date" value={this.state.grant_start_date} onChange={(e) => {this.inputChange(e, "grant_start_date")}} max={moment().format("YYYY-MM-DD")} required />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="grant_end_date" >Number of years of partnership</Label> <span class="errorMessage">{this.state.errors["grant_end_date"]}</span>
                                                                        <Input type="date" name="grant_end_date" id="grant_end_date" value={this.state.grant_end_date} onChange={(e) => {this.inputChange(e, "grant_end_date")}} required />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <div class="pretty p-default p-thick p-pulse">
                                                             
                                                                <input type="checkbox" id="LseTrainer" value="Lse Trainer" defaultChecked= { false} onChange={(e) => this.valueChange(e, "1")}/>
                                                                <div class="state p-warning-o">
                                                                    <label>Trainer</label>
                                                                </div>
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