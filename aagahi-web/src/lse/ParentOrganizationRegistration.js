/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-19 09:31:05
 * @modify date 2019-08-19 09:31:05
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
import "../index.css"
import classnames from 'classnames';
import Select from 'react-select';
import CustomModal from "../alerts/CustomModal";
import { useBeforeunload } from 'react-beforeunload';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import {RadioGroup, Radio} from 'react-radio-group';
import moment from 'moment';
import { getLocationsByCategory, getAllProjects, getDefinitionId, getLocationAttributeTypeByShortName } from '../service/GetService';
import { saveLocation } from "../service/PostService";
import LoadingIndicator from "../widget/LoadingIndicator";
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBBtn } from 'mdbreact';


const programsImplemented = [
    { label: 'CSA', value: 'csa'},
    { label: 'Gender', value: 'gender'},
    { label: 'LSBE', value: 'lsbe'},
];


const schools = [
    { value: 'sindh', label: 'Sindh' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'balochistan', label: 'Balochistan' },
    { value: 'khyber_pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
];


class ParentOrganizationRegistration extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {

            partner_components: 'lse',
            participant_id : '',
            participant_name: '',
            dob: '',
            sex : '',
            school_id: [],
            csa_prompts: '',
            subject_taught : [], // all the form elements states are in underscore notation i.e variable names in codebook
            subject_taught_other: '',
            teaching_years: '',
            point_person_contact: '',
            donor_name: '',
            activeTab: '1',
            page2Show: true,
            viewMode: false,
            editMode: false,
            errors: {},
            loading: false,
            modal: false,
            modalText: '',
            okButtonStyle: {},
            modalHeading: ''
        };


        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.calculateScore = this.calculateScore.bind(this);
        this.getObject = this.getObject.bind(this);
        this.inputChange = this.inputChange.bind(this);

        this.errors = {};
        this.isLse = true;
        this.isSrhm = false;
        this.requiredFields = [ "parent_organization_name", "organization_address", "point_person_name", "point_person_contact", "point_person_email"];
        this.parentOrganizationId = '';
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.beforeunload.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.beforeunload.bind(this));
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

        this.resetForm(this.requiredFields);
        // receiving value directly from widget but it still requires widget to have on change methods to set it's value
    }

    // for text and numeric questions
    inputChange(e, name) {
        
        let errorText = '';
        if(name != "point_person_email" && (e.target.pattern != "" && e.target.pattern != undefined) ) {
            
            errorText = e.target.value.match(e.target.pattern) != e.target.value ? "invalid!" : '';
            console.log(errorText);
            this.errors[name] = errorText;
        }

        if(name === "point_person_email") {
            let regexPattern = new RegExp(e.target.pattern);
            console.log(regexPattern);
            if (regexPattern.test(e.target.value))
            {
                errorText = '';
                this.errors[name] = errorText;
            }
            else {
                errorText = "invalid!";
                this.errors[name] = errorText;
            }
        }

        this.setState({
            [name]: e.target.value
        });

        this.setState({errors: this.errors});


        // appending dash to contact number after 4th digit
        if(name === "point_person_contact") {
            this.setState({ point_person_contact: e.target.value});
            let hasDash = false;
            if(e.target.value.length == 4 && !hasDash) {
                this.setState({ point_person_contact: ''});
            }
            if(this.state.point_person_contact.length == 3 && !hasDash) {
                this.setState({ point_person_contact: ''});
                this.setState({ point_person_contact: e.target.value});
                this.setState({ point_person_contact: `${e.target.value}-` });
                this.hasDash = true;
            }
        }

    }


    // setting autocomplete single select tag when receiving value from server
    // value is the uuid, arr is the options array, prop either label/value, mostly value because it is uuid
    getObject(value, arr, prop) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i][prop] === value) {
                return arr[i];

            }
        }
        return -1; //to handle the case where the value doesn't exist
    }

    // for single select
    valueChange = (e, name) => {
        
        this.setState({
            [name]: e.target.value
        });

        if(name === "partner_components") {
            this.isLse = e.target.value === "lse" ? true : false;
            this.isSrhm = e.target.value === "srhm" ? true : false;

            this.isLse ? this.requiredFields.push("organization_schools") : this.requiredFields = this.requiredFields.filter(e => e !== "organization_schools");
            this.isSrhm ? this.requiredFields.push("organization_institutions") : this.requiredFields = this.requiredFields.filter(e => e !== "organization_institutions");
        }
    }

    // calculate score from scoring questions (radiobuttons)
    calculateScore = (e, name) => {
        this.setState({
            [name]: e.target.value
        });

    }

    // for multi select
    valueChangeMulti(e, name) {
        console.log(e);
        
        this.setState({
            [name]: e
        });
    }

    callModal = () => {
        this.setState({ modal : !this.state.modal });
    }

    // for autocomplete single select
    handleChange(e, name) {

        this.setState({
            [name]: e
        });

        // console.log(`Option selected:`, school_id);
        console.log(this.state.school_id);
        // console.log(this.state.school_id.value);
    };
    
    handleSubmit = async event => {

        
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
            var jsonData = new Object();
            jsonData.category = {};
            var categoryId = await getDefinitionId("location_category", "parent_organization");
            jsonData.category.definitionId = categoryId;
            jsonData.country = "Pakistan";
            jsonData.partner_components = this.state.partner_components;
            jsonData.shortName = this.parentOrganizationId;

            jsonData.locationName = this.state.parent_organization_name.trim();
            jsonData.primaryContactPerson = this.state.point_person_name; 
            jsonData.email = this.state.point_person_email;
            jsonData.primaryContact = this.state.point_person_contact;

            if(this.isSrhm) {
                jsonData.organization_institutions = this.state.point_person_contact;

            }
            if(this.isLse) {
                jsonData.organization_schools = this.state.point_person_contact;
            }
            
            jsonData.address1 = this.state.organization_address;
            
            console.log(jsonData);
            saveLocation(jsonData)
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
                        this.resetForm(this.requiredFields);

                    }
                    else if(String(responseData).includes("Error")) {
                        
                        var submitMsg = '';
                        submitMsg = "Unable to submit school details form. \
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
        let formIsValid = true;

        this.isLse ? this.requiredFields.push("organization_schools") : this.requiredFields = this.requiredFields.filter(e => e !== "organization_schools");
            this.isSrhm ? this.requiredFields.push("organization_institutions") : this.requiredFields = this.requiredFields.filter(e => e !== "organization_institutions");

        console.log(this.requiredFields);
        this.setState({ hasError: this.checkValid(this.requiredFields) ? false : true });

        formIsValid = this.checkValid(this.requiredFields);
        this.setState({errors: this.errors});
        return formIsValid;
    }

    /**
     * verifies and notifies for the empty form fields
     */
    checkValid = (fields) => {

        let isOk = true;
        this.errors = {};
        const errorText = "Required";
        for(let j=0; j < fields.length; j++) {
            let stateName = fields[j];
            
            // for array object
            if(typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                isOk = false;
                this.errors[fields[j]] = errorText;
            }
                
            
            // for text and others
            if(typeof this.state[stateName] != 'object') {
                if(this.state[stateName] == undefined) {
                    isOk = false;
                    this.errors[fields[j]] = errorText;
                }
                else {
                    var stateData = this.state[stateName];
                    if(stateData.trim() === "" ) {
                        isOk = false;
                        this.errors[fields[j]] = errorText;   
                    }
                }
            }
        }

        return isOk;
    }

    beforeSubmit() {

        // autogenerate parent organization id
        try {

            var name = (this.state.parent_organization_name).toUpperCase();
            var parentInitials = name.match(/\b(\w)/g);
            parentInitials = parentInitials.join('').toUpperCase();
            this.parentOrganizationId = parentInitials + (this.state.partner_components).toUpperCase(); 
            // var levelInitials = (this.state.school_level).toUpperCase().substring(0,3);
            
            var randomDigits = String(Math.floor(100000 + Math.random() * 900000));
            this.parentOrganizationId = this.parentOrganizationId + "-" +  randomDigits.substring(0,2);
            

        }
        catch(error) {
            console.log(error);
        }
    
    }

    /**
     * clear fields
     */
    resetForm = (fields) => {

        for(let j=0; j < fields.length; j++) {
            let stateName = fields[j];
            
            // for array object
            if(typeof this.state[stateName] === 'object') {
                this.state[stateName] = [];
            }

            // for text and others
            if(typeof this.state[stateName] != 'object') {
                this.state[stateName] = ''; 
            }
        }

        this.updateDisplay();
    }

    updateDisplay(){
        this.setState({

            partner_components:'lse'
        })
    }

    // for modal
    toggle = () => {
        this.setState({
          modal: !this.state.modal
        });
    }

    render() {

        const page2style = this.state.page2Show ? {} : { display: 'none' };

        // for view mode
        const setDisable = this.state.viewMode ? "disabled" : "";
        const organizationSchoolStyle = this.isLse ? {} : { display: 'none' };
        const organizationInstitutionStyle = this.isSrhm ? {} : { display: 'none' };

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
                            <Form id="parentOrganization" onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>Parent Organization Registration</b>
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
                                                                        <Label for="parent_organization_name" >Parent Organization Name <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["parent_organization_name"]}</span>
                                                                        <Input name="parent_organization_name" id="parent_organization_name" value={this.state.parent_organization_name} onChange={(e) => {this.inputChange(e, "parent_organization_name")}} maxLength='100' pattern="^[A-Za-z. ]+" placeholder="Enter name" />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="parent_organization_id" >Parent Organization ID</Label> <span class="errorMessage">{this.state.errors["parent_organization_id"]}</span>
                                                                        <Input name="parent_organization_id" id="parent_organization_id" value={this.parentOrganizationId} value={this.state.parent_organization_id} onChange={(e) => {this.inputChange(e, "parent_organization_id")}} maxLength="20" placeholder="Parent Oraganization ID" disabled />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="partner_components">Partner with</Label> <span class="errorMessage">{this.state.errors["partner_components"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "partner_components")} value={this.state.partner_components} name="partner_components" id="partner_components">
                                                                        
                                                                            <option value="lse">LSE</option>
                                                                            <option value="srhm">SRHM</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={organizationSchoolStyle}>
                                                                    <FormGroup >
                                                                        <Label for="organization_schools" >No. of school under the organization <span className="required">*</span></Label>  <span class="errorMessage">{this.state.errors["organization_schools"]}</span>
                                                                        <Input type="number" value={this.state.organization_schools} name="organization_schools" id="organization_schools" onChange={(e) => {this.inputChange(e, "organization_schools")}} max="99" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)}} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={organizationInstitutionStyle}>
                                                                    <FormGroup >
                                                                        <Label for="organization_institutions" >No. of institutions under the organization <span className="required">*</span></Label>  <span class="errorMessage">{this.state.errors["organization_institutions"]}</span>
                                                                        <Input type="number" value={this.state.organization_institutions} name="organization_institutions" id="organization_institutions" onChange={(e) => {this.inputChange(e, "organization_institutions")}} max="99" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)}} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="organization_address" >Office Address <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["organization_address"]}</span>
                                                                        <Input type="textarea" name="organization_address" id="organization_address" onChange={(e) => {this.inputChange(e, "organization_address")}} value={this.state.organization_address} maxLength="300" placeholder="Enter address" />
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_name" >Name of Point of Contact <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["point_person_name"]}</span>
                                                                        <Input type="text" name="point_person_name" id="point_person_name" value={this.state.point_person_name} onChange={(e) => {this.inputChange(e, "point_person_name")}} pattern="^[A-Za-z. ]+" maxLength="200" placeholder="Enter name" />
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_contact" >Phone Number of point of contact <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["point_person_contact"]}</span>
                                                                        <Input type="text" name="point_person_contact" id="point_person_contact" onChange={(e) => {this.inputChange(e, "point_person_contact")}} value={this.state.point_person_contact} maxLength="12" pattern="[0][3][0-9]{2}-[0-9]{7}" placeholder="Mobile Number: xxxx-xxxxxxx" />
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_email" >Email of point of contact <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["point_person_email"]}</span>
                                                                        <Input type="text" name="point_person_email" id="point_person_email" value={this.state.point_person_email} onChange={(e) => {this.inputChange(e, "point_person_email")}} placeholder="Enter email" maxLength="50" pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$" />
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
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit" disabled={setDisable}>Submit</Button>
                                                        <Button className="mb-2 mr-2" color="danger" size="sm" onClick={this.cancelCheck} disabled={setDisable}>Clear</Button>
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

export default ParentOrganizationRegistration;