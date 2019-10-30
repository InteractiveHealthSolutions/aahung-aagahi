/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-07-30 12:53:25
 * @modify date 2019-07-30 12:53:25
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

import { MDBBtn, MDBContainer, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from 'mdbreact';
import moment from 'moment';
import React, { Fragment } from "react";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import Select from 'react-select';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, TabContent, TabPane } from 'reactstrap';
import CustomModal from "../alerts/CustomModal";
import "../index.css";
import { getDefinitionId, getLocationsByCategory, getPersonAttributeTypeByShortName } from '../service/GetService';
import { saveParticipant } from "../service/PostService";
import { getObject } from "../util/AahungUtil.js";
import * as Constants from "../util/Constants";
import LoadingIndicator from "../widget/LoadingIndicator";

const participantAffiliations = [
    { label: 'Hospital', value: 'hospital'},
    { label: 'NGO', value: 'ngo'},
    { label: 'Government', value: 'government'},
    { label: 'Education Institute', value: 'education_institute'},
    { label: 'No affiliation', value: 'none', },
    { label: 'Private', value: 'private'},
    { label: 'Public', value: 'public'},
    { label: 'Other', value: 'other', },
    
];

class GeneralParticipantDetail extends React.Component {

    modal = false;
    constructor(props) {
        super(props);
                
        this.state = {
            institutions: [],
            participant_id : '',
            participant_name: '',
            dob: '',
            sex : '',
            participant_type: 'preservice',
            education_level: 'no_education',
            instituition_role: 'faculty',
            activeTab: '1',
            page2Show: true,
            hasError: false,
            errors: {},
            loading: false,
            modal: false,
            modalText: '',
            okButtonStyle: {},
            modalHeading: ''
            
        };
        
        this.toggle = this.toggle.bind(this);
        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.requiredFields = [ "participant_name", "dob", "sex", "participant_affiliation", "education_level", "institution_id", "instituition_role"];
        this.participantId = '';
        this.errors = {};
        this.isInstitutionRoleOther = false;
        this.isOtherParticipant = false;
        this.isAffiliationOther = false;
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

            let institutions = await getLocationsByCategory(Constants.INSTITUTION_DEFINITION_UUID);
            if (institutions != null && institutions.length > 0) {
                this.setState({
                    institutions: institutions
                })
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    updateDisplay(){
        this.setState({

            participant_type: 'preservice',
            education_level: 'no_education',
            instituition_role: 'faculty'
        })
    }

    beforeunload(e) {
          e.preventDefault();
          e.returnValue = true;
    }
    
    cancelCheck = () => {
        this.resetForm(this.requiredFields);   
    }

    inputChange(e, name) {

        this.setState({
            [name]: e.target.value
        });

        // appending dash to contact number after 4th digit
        if(name === "donor_name") {
            this.setState({ donor_name: e.target.value});
            let hasDash = false;
            if(e.target.value.length == 4 && !hasDash) {
                this.setState({ donor_name: ''});
            }
            if(this.state.donor_name.length == 3 && !hasDash) {
                this.setState({ donor_name: ''});
                this.setState({ donor_name: e.target.value});
                this.setState({ donor_name: `${e.target.value}-` });
                this.hasDash = true;
            }
        }        
    }

    // for single select
    valueChange = (e, name) => {
        
        this.setState({
            [name]: e.target.value
        });

        if(name === "participant_type") {

            this.isOtherParticipant = e.target.value === "other" ? true : false;
            this.isOtherParticipant ? this.requiredFields.push("participant_type_other") : this.requiredFields = this.requiredFields.filter(e => e !== "participant_type_other");
        }

        if(name === "instituition_role") {

            this.isInstitutionRoleOther = e.target.value === "other" ? true : false;
            this.isInstitutionRoleOther ? this.requiredFields.push("instituition_role_other") : this.requiredFields = this.requiredFields.filter(e => e !== "instituition_role_other");
        }
    }

    // for multi select
    valueChangeMulti(e, name) {
        console.log(e);
        // alert(e.length);
        // alert(value[0].label + "  ----  " + value[0].value);
        
        this.setState({
            [name]: e
        });

        if(name === "participant_affiliation") {
            // alert(getObject('other', e, 'value'));
            
            // checking with two of because when another value is selected and other is unchecked, it still does not change the state
            if(getObject('other', e, 'value') != -1) {
                
                this.isAffiliationOther = true;
            }
            if(getObject('other', e, 'value') == -1) {
                
                this.isAffiliationOther = false;
            }

            this.isAffiliationOther ? this.requiredFields.push("participant_affiliation_other") : this.requiredFields = this.requiredFields.filter(e => e !== "participant_affiliation_other");
        }
    }

    callModal = () => {
        this.setState({ modal : !this.state.modal });
    }

    // for autocomplete single select
    handleChange(e, name) {

        this.setState({
            [name]: e
        });

        try {
            if (name === "institution_id") {

                this.setState({ institution_name : e.locationName});
                document.getElementById("institution_name").value= e.locationName;
            }

            if (name === "participant_name") {
                // alert(e.identifier);
                this.setState({ participant_id: e.identifier });
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    
    beforeSubmit() {

        // autogenerate parent organization id
        try {
            var user = JSON.parse( sessionStorage.getItem('user'));
            var userId = user.userId;
            var timestamp = moment().format('YYMMDDhhmmss');
            this.participantId = String(userId) + timestamp;

            var id = parseInt(this.participantId);
            this.participantId = id.toString(36);
            this.participantId = this.participantId.toUpperCase();
            do {
                this.participantId = this.participantId.concat('0');
            }
            while(this.participantId.length != 10)

        }
        catch(error) {
            console.log(error);
        }
    
    }

    handleSubmit = async event => {

        
        event.preventDefault();
        if(this.handleValidation()) {

            console.log("in submission");

            this.setState({ 
                loading : true
            })

            try{
                this.beforeSubmit();
                
                const data = new FormData(event.target);
                console.log(data);
                var jsonData = new Object();
                
                // jsonData.category = {};
                // var categoryId = await getDefinitionId("location_category", "school");
                // jsonData.category.definitionId = categoryId;
                jsonData.identifier = this.participantId;
                jsonData.location = {};
                jsonData.location.locationId = this.state.institution_id.id;
                
                jsonData.person = {};
                jsonData.person.country = "Pakistan";
                // jsonData.person.date_start = this.state.date_start;
                jsonData.person.firstName = this.state.participant_name;
                jsonData.person.dob = this.state.dob; 
                jsonData.person.gender = this.state.sex; 

                jsonData.person.attributes = [];
                
                // type of participant
                var attrType = await getPersonAttributeTypeByShortName("srhm_general_participant");
                var attrTypeId= attrType.attributeTypeId;
                var attributeObject = new Object(); // top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value 
                attributeObject.attributeValue = true; // attributeValue obj
                jsonData.person.attributes.push(attributeObject);

                
                // ==== MULTISELECT location_attribute_types ===
                
                // participant_affiliation > person attr type
                var attrType = await getPersonAttributeTypeByShortName("participant_affiliation");
                var attrTypeId= attrType.attributeTypeId;
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                let attrValueObject = [];
                for(let i=0; i< this.state.participant_affiliation.length; i++ ) {
                    let definitionObj = {};
                    // send first: def type and second: definition shortname below
                    definitionObj.definitionId = await getDefinitionId("participant_affiliation", this.state.participant_affiliation[i].value);
                    attrValueObject.push(definitionObj);
                }
                
                attributeObject.attributeValue = JSON.stringify(attrValueObject); // attributeValue array of definitionIds
                jsonData.person.attributes.push(attributeObject);
                
                // participant_affiliation_other
                if(this.isAffiliationOther) {
                    
                    var attrType = await getPersonAttributeTypeByShortName("participant_affiliation_other");
                    var attrTypeId= attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                    
                    attributeObject.attributeValue = this.state.participant_affiliation_other;
                    jsonData.person.attributes.push(attributeObject);
                }



                //participant_type
                var attrType = await getPersonAttributeTypeByShortName("participant_type");
                var attrTypeId= attrType.attributeTypeId;
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                
                // var years = moment().diff(this.state.partnership_start_date, 'years');
                attributeObject.attributeValue = await getDefinitionId("participant_type", this.state.participant_type); // attributeValue obj
                jsonData.person.attributes.push(attributeObject);

                if(this.isOtherParticipant) {
                    //participant_type
                    var attrType = await getPersonAttributeTypeByShortName("participant_type_other");
                    var attrTypeId= attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                    
                    attributeObject.attributeValue = this.state.participant_type_other; // attributeValue obj
                    jsonData.person.attributes.push(attributeObject);
                }
                
                // education_level has a deinition datatype so attr value will be integer definitionid
                var attrType = await getPersonAttributeTypeByShortName("education_level");
                var attrTypeId= attrType.attributeTypeId;
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                attributeObject.attributeValue = await getDefinitionId("education_level", this.state.education_level); // attributeValue obj
                jsonData.person.attributes.push(attributeObject);

                //instituition_role
                var attrType = await getPersonAttributeTypeByShortName("instituition_role");
                var attrTypeId= attrType.attributeTypeId;
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                
                // var years = moment().diff(this.state.partnership_start_date, 'years');
                attributeObject.attributeValue = await getDefinitionId("instituition_role", this.state.instituition_role); // attributeValue obj
                jsonData.person.attributes.push(attributeObject);

                if(this.isInstitutionRoleOther) {
                    //instituition_role
                    var attrType = await getPersonAttributeTypeByShortName("instituition_role_other");
                    var attrTypeId= attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                    
                    // var years = moment().diff(this.state.partnership_start_date, 'years');
                    attributeObject.attributeValue = this.state.instituition_role_other; // attributeValue obj
                    jsonData.person.attributes.push(attributeObject);
                }

    
                console.log(jsonData);
                saveParticipant(jsonData)
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
            catch(error){

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
                if(this.state[stateName] === "" || this.state[stateName] == undefined) {
                    isOk = false;
                    this.errors[fields[j]] = errorText;   
                } 
            }
        }

        return isOk;
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

        this.participantId = '';
        this.setState({ institution_name: ''});
        
        var radList = document.getElementsByName('sex');
        for (var i = 0; i < radList.length; i++) {
            if(radList[i].checked) 
                radList[i].checked = false;
        }

        this.updateDisplay();
    }

    // for modal
    toggle = () => {
        this.setState({
          modal: !this.state.modal
        });
    }



    render() {
        const { selectedOption } = this.state;
        const otherAffiliationStyle = this.isAffiliationOther ? {} : { display: 'none' };
        const otherRoleStyle = this.isInstitutionRoleOther ? {} : { display: 'none' };
        const otherParticipantStyle = this.isOtherParticipant ? {} : { display: 'none' };
        


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
                            <Form id="testForm" onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>General Participant Details Form</b>
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
                                                {/* <CardTitle>Form Details</CardTitle> */}
                                                    <TabContent activeTab={this.state.activeTab}>
                                                        <TabPane tabId="1">
                                                            {/* <Row>
                                                                 <Col md="6">
                                                                    <FormGroup inline>
                                                                        <Label for="date_start" >Form Date</Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                        <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} max={moment().format("YYYY-MM-DD")} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row> */}
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup> 
                                                                        <Label for="participant_id" >Participant ID</Label> <span class="errorMessage">{this.state.errors["participant_id"]}</span> 
                                                                        <Input type="text" name="participant_id" id="participant_id" value={this.participantId} placeholder="Autogenerated" maxLength='10' disabled/>
                                                                        
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="participant_name" >Participant Name</Label>  <span class="errorMessage">{this.state.errors["participant_name"]}</span>
                                                                        <Input name="participant_name" id="participant_name" value={this.state.participant_name} onChange={(e) => {this.inputChange(e, "participant_name")}} maxLength='50' pattern="^[A-Za-z ]+" placeholder="Enter name" />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="dob" >Date of Birth</Label> <span class="errorMessage">{this.state.errors["dob"]}</span>
                                                                        <Input type="date" name="dob" id="dob" value={this.state.dob} onChange={(e) => {this.inputChange(e, "dob")}} max={moment().format("YYYY-MM-DD")}/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup tag="fieldset" row>
                                                                        <legend className="col-form-label col-sm-2">Sex</legend>
                                                                        <Col sm={10}>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="sex" id="male" value="Male" /* checked= {this.state.sex === 'Male'} */ onChange={(e) => this.valueChange(e, "sex")} />{' '}
                                                                                Male
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="sex" id="female" value="Female" /* checked= {this.state.sex === 'Female'} */  onChange={(e) => this.valueChange(e, "sex")} />{' '}
                                                                                Female
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="sex" id="other" value="Other" /* checked= {this.state.sex === 'Other'} */ onChange={(e) => this.valueChange(e, "sex")} />{' '}
                                                                                Other
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["sex"]}</span>
                                                                        </Col>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                <FormGroup >
                                                                        <Label for="participant_affiliation" >Participant Affiliation</Label> <span class="errorMessage">{this.state.errors["participant_affiliation"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "participant_affiliation")} value={this.state.participant_affiliation} id="participant_affiliation" options={participantAffiliations} />
                                                                        
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={otherAffiliationStyle}>

                                                                    <FormGroup >
                                                                        <Label for="participant_affiliation_other" >Specify Other Affiliation</Label> <span class="errorMessage">{this.state.errors["participant_affiliation_other"]}</span>
                                                                        <Input name="participant_affiliation_other" id="participant_affiliation_other" onChange={(e) => this.inputChange(e, "participant_affiliation_other")} placeholder="Specify other" value={this.state.participant_affiliation_other} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                <FormGroup >
                                                                        <Label for="participant_type" >Type of Participant</Label> <span class="errorMessage">{this.state.errors["participant_type"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "participant_type")} value={this.state.participant_type} name="participant_type" id="participant_type">
                                                                            <option value="preservice">Pre-service providers</option>
                                                                            <option value="inservice">In-service providers</option>
                                                                            <option value="lhs">LHS</option>
                                                                            <option value="youth">Youth</option>
                                                                            <option value="project_staff">Project Staff</option>
                                                                            <option value="student">Student</option>
                                                                            <option value="other">Other</option>
                                                                        </Input>
                                                                        
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={otherParticipantStyle}>

                                                                    <FormGroup >
                                                                        <Label for="participant_type_other" >Specify Other Type</Label> <span class="errorMessage">{this.state.errors["participant_type_other"]}</span>
                                                                        <Input name="participant_type_other" id="participant_type_other" onChange={(e) => this.inputChange(e, "participant_type_other")} placeholder="Specify other" value={this.state.participant_type_other} />
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="education_level" >Level of Education</Label> <span class="errorMessage">{this.state.errors["education_level"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "education_level")} value={this.state.education_level} name="education_level" id="education_level">
                                                                            <option value="no_education">No Education</option>
                                                                            <option value="some_primary">Some Primary</option>
                                                                            <option value="primary">Primary</option>
                                                                            <option value="secondary">Secondary</option>
                                                                            <option value="college">College</option>
                                                                            <option value="undergraduate">Undergraduate</option>
                                                                            <option value="postgraduate">Post-graduate</option>
                                                                        </Input>
                                                                        
                                                                    </FormGroup>

                                                                </Col>

                                                                <Col md="6">
                                                                <FormGroup >
                                                                        <Label for="institution_id" >Institution ID</Label> <span class="errorMessage">{this.state.errors["institution_id"]}</span>
                                                                        <Select id="institution_id"
                                                                            name="institution_id"
                                                                            value={this.state.institution_id}
                                                                            onChange={(e) => this.handleChange(e, "institution_id")}
                                                                            options={this.state.institutions}
                                                                        />
                                                                    </FormGroup>                                                                    
                                                                </Col>
                                                                <Col md="6">

                                                                    <FormGroup >
                                                                        <Label for="institution_name" >Institution Name</Label>
                                                                        <Input name="institution_name" id="institution_name" placeholder="Autopopulated Institution Name" value={this.state.institution_name} disabled/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="instituition_role" >Role in Institution</Label> <span class="errorMessage">{this.state.errors["instituition_role"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "instituition_role")} value={this.state.instituition_role} name="instituition_role" id="instituition_role">
                                                                            <option value="faculty">Faculty</option>
                                                                            <option value="student">Student</option>
                                                                            <option value="doctor">Doctor</option>
                                                                            <option value="nurse">Nurse</option>
                                                                            <option value="other">Other</option>
                                                                            
                                                                        </Input>
                                                                        
                                                                    </FormGroup>    

                                                                </Col>

                                                                <Col md="6" style={otherRoleStyle}>

                                                                    <FormGroup >
                                                                        <Label for="instituition_role_other" >Specify Other Role</Label> <span class="errorMessage">{this.state.errors["instituition_role_other"]}</span>
                                                                        <Input name="instituition_role_other" id="instituition_role_other" onChange={(e) => this.inputChange(e, "instituition_role_other")} placeholder="Specify other" value={this.state.instituition_role_other} />
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                            </Row>


                                                            

                                                            

                                                            {/* please don't remove this div unless you are adding another form question here*/}
                                                            <div style={{height: '250px'}}><span>   </span></div>

                                                        </TabPane>
                                                        
                                                    </TabContent>

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
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit" >Submit</Button>
                                                        <Button className="mb-2 mr-2" color="danger" size="sm" onClick={this.cancelCheck} >Clear</Button>
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

export default GeneralParticipantDetail;


