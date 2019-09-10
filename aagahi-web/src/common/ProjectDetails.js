/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-09-08 16:14:21
 * @modify date 2019-09-08 16:14:21
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

class ProjectDetails extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
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
        this.requiredFields = ["donor_id"];

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
            let donorArray = await getAllDonors();

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

        if(name === "donor_id") {
            
            this.setState({
                donor_name : e.name 
            })
        }
    };

    callModal = () => {
        this.setState({ modal : !this.state.modal });
    }

    handleClearClick = () => {
        alert("resetting");
        this.messageForm.reset();
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
            donorObject['donorId'] = this.state.donor_id.id;
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
                        submitMsg = "Unable to submit donor. \
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

        // autogenerate project id
        var donorId = ( this.state.donor_id != undefined || this.state.donor_id != null ) ? this.state.donor_id.shortName : '';
        var name = (this.state.project_name).toUpperCase();
        this.projectId = name.match(/\b(\w)/g);
        this.projectId = this.projectId.join('').toUpperCase();
        this.projectId = donorId + '-' + this.projectId; 

        var check = (this.state.grant_start_date != undefined || this.state.grant_start_date != null) ?  moment(this.state.grant_start_date, 'YYYY/MM/DD') : moment(moment(), 'YYYY/MM/DD');
        var year = check.format('YYYY');
        this.projectId = this.projectId + '-' + year; 

        console.log(this.projectId);
        this.setState({
            project_id : this.projectId
        })
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
                                                <b>Project Details</b>
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
                                                                        <Label for="donor_id" >Donor ID</Label> <span class="errorMessage">{this.state.errors["donor_id"]}</span>
                                                                        <Select id="donor_id" name="donor_id" value={this.state.donor_id} onChange={(e) => this.handleChange(e, "donor_id")} options={this.state.donors} required/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="donor_name" >Donor Name</Label>
                                                                        <Input name="donor_name" id="donor_name" value={this.state.donor_name} onChange={(e) => {this.inputChange(e, "donor_name")}} maxLength="200" placeholder="Enter name"  required/>
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
                                <CustomModal
                                    modal={this.modal}
                                    // message="Some unsaved changes will be lost. Do you want to leave this page?"
                                    ModalHeader="Leave Page Confrimation!"
                                ></CustomModal>

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

export default ProjectDetails;