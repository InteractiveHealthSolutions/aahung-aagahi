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
import { BrowserRouter as Router } from 'react-router-dom';
import Select from 'react-select';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, TabContent, TabPane } from 'reactstrap';
import CustomModal from "../alerts/CustomModal";
import "../index.css";
import { getDefinitionByDefinitionId, getDefinitionId, getDefinitionsByDefinitionType, getLocationsByCategory, getParticipantByRegexValue, getPersonAttributeTypeByShortName } from '../service/GetService';
import { saveParticipant, updateParticipant } from "../service/PostService";
import { getObject } from "../util/AahungUtil.js";
import * as Constants from "../util/Constants";
import FormNavBar from "../widget/FormNavBar";
import LoadingIndicator from "../widget/LoadingIndicator";

const subjectsTaught = [
    { label: 'Math', value: 'math'},
    { label: 'Science', value: 'science'},
    { label: 'English', value: 'english'},
    { label: 'Urdu', value: 'urdu', },
    { label: 'Social Studies', value: 'social_studies'},
    { label: 'Islamiat', value: 'islamiat'},
    { label: 'Art', value: 'art', },
    { label: 'Music', value: 'music'},
    { label: 'Other', value: 'other_subject', },
];

class ParticipantDetails extends React.Component {

    modal = false;
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            schools: [],
            participant_id : '',
            participant_name: '',
            dob: '',
            sex : '',
            school_id: [],
            school_name: '',
            subject_taught : [], // all the form elements states are in underscore notation i.e variable names in codebook
            subject_taught_other: '',
            teaching_years: '',
            education_level: 'no_education',
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

        
        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.editMode = false;
        this.fetchedParticipant = {};
        this.requiredFields = [ "participant_name", "dob", "sex", "school_id", "subject_taught", "teaching_years"];
        this.participantId = '';
        this.errors = {};
        this.isOtherSubject = false;
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
            let schools = await getLocationsByCategory(Constants.SCHOOL_DEFINITION_UUID);
            if (schools != null && schools.length > 0) {
                this.setState({
                    schools: schools
                })
            }
            
            if(this.editMode) {
                this.fetchedParticipant = await getParticipantByRegexValue(String(this.props.location.state.participantId));
                console.log("fetched participant id is .................................");
                console.log(this.fetchedParticipant.participantId);
                this.participantId = this.fetchedParticipant.identifier;
                this.setState({
                    participant_name: this.fetchedParticipant.person.firstName,
                    dob: this.fetchedParticipant.person.dob,
                    sex: this.fetchedParticipant.person.gender
                })

                document.getElementById('male').checked = this.fetchedParticipant.person.gender ===  "Male";
                document.getElementById('female').checked = this.fetchedParticipant.person.gender ===  "Female";
                document.getElementById('other').checked = this.fetchedParticipant.person.gender ===  "Other";

                if(this.fetchedParticipant.location != null){
                    this.setState({
                        school_id: {"label": this.fetchedParticipant.location.shortName, "value": this.fetchedParticipant.location.locationName, "id": this.fetchedParticipant.location.locationId },
                        school_name: this.fetchedParticipant.location.locationName
                    })
                }
                this.autopopulateFields(this.fetchedParticipant.person.attributes);
            }

            this.setState({ 
                loading: false
            })
        }
        catch(error) {
            console.log(error);
            var errMsg = '';
            errMsg = "Unable to fetch Participant details. Please see error logs for more details.";
            
            this.setState({ 
                loading: false,
                modalHeading : 'Fail!',
                okButtonStyle : { display: 'none' },
                modalText : errMsg,
                modal: !this.state.modal
            });
        }
    }

    /**
     * created separate method because async handle was not updating the local variables (location attrs)
     */
    autopopulateFields(personAttributes) {
        let self = this;
        let attributeValue = '';
        personAttributes.forEach(async function (obj) {
            let attrTypeName = obj.attributeType.shortName;
            
            if (obj.attributeType.dataType.toUpperCase() != "JSON" && obj.attributeType.dataType.toUpperCase() != "DEFINITION") {
                attributeValue = obj.attributeValue;
            }

            if (obj.attributeType.dataType.toUpperCase() == "DEFINITION") {
                // fetch definition shortname
                let definitionId = obj.attributeValue;
                let definition = await getDefinitionByDefinitionId(definitionId);
                let attrValue = definition.shortName;
                attributeValue = attrValue;
            }

            if (obj.attributeType.dataType.toUpperCase() == "JSON") {

                var arr = [];
                // attr value is a JSON obj > [{"definitionId":13},{"definitionId":14}]
                let attrValueObj = JSON.parse(obj.attributeValue);
                if (attrValueObj != null && attrValueObj.length > 0) {
                    let attributeArray = [];
                    if ('definitionId' in attrValueObj[0]) {
                        attributeArray = await getDefinitionsByDefinitionType(attrTypeName);
                        attrValueObj.forEach(async function (obj) {
                            // definitionArr contains only one item because filter will return only one definition
                            let definitionArr = attributeArray.filter(df => df.id == parseInt(obj.definitionId));
                            arr.push({label: definitionArr[0].definitionName, value: definitionArr[0].shortName});

                            if (attrTypeName === "subject_taught") {
                                if(definitionArr[0].shortName === "other_subject") {
                                    self.isOtherSubject = true;
                                }
                            }
                        })
                    }
                }
                // attributeValue = multiSelectString;
                self.setState({
                    [attrTypeName]: arr
                })
                return;
            }

            self.setState({ [attrTypeName]: attributeValue });
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
    }

    // for single select
    valueChange = (e, name) => {
        
        this.setState({
            [name]: e.target.value
        });
    }

    // for multi select
    valueChangeMulti(e, name) {
        this.setState({
            [name]: e
        });

        if(name === "subject_taught") {
            // checking with two of because when another value is selected and other is unchecked, it still does not change the state
            if(getObject('other_subject', e, 'value') != -1) {
                
                this.isOtherSubject = true;
            }
            if(getObject('other_subject', e, 'value') == -1) {
                
                this.isOtherSubject = false;
            }
            this.isOtherSubject ? this.requiredFields.push("subject_taught_other") : this.requiredFields = this.requiredFields.filter(e => e !== "subject_taught_other");
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
            if (name === "school_id") {

                this.setState({ school_name: e.locationName});
                document.getElementById("school_name").value= e.locationName;
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
                loading : true,
                loadingMsg: "Saving trees..."
            })

            try{
                this.beforeSubmit();
                if(this.editMode) {

                    let self = this;
                    if(this.state.school_id != undefined && this.state.school_id != null) {
                        this.fetchedParticipant.location.locationId = this.state.school_id.id;
                    }
                    this.fetchedParticipant.person.country = "Pakistan";
                    this.fetchedParticipant.person.firstName = this.state.participant_name;
                    this.fetchedParticipant.person.dob = this.state.dob; 
                    this.fetchedParticipant.person.gender = this.state.sex; 

                    var fetchedAttributes = this.fetchedParticipant.person.attributes;
                    var isSubjectOther = false;

                    for (var obj of fetchedAttributes) {
    
                        delete obj.createdBy;
                        // lse_teacher_participant - boolean
                        if(obj.attributeType.shortName === "lse_teacher_participant") {
                            obj.attributeValue = true;
                        }
    
                        // Multiselect - subject_taught
                        if(obj.attributeType.shortName === "subject_taught") {
                            let attrValueObject = [];
                            for(let i=0; i< self.state.subject_taught.length; i++ ) {
                                let definitionObj = {};
                                definitionObj.definitionId = await getDefinitionId("subject_taught", self.state.subject_taught[i].value);
                                attrValueObject.push(definitionObj);
                            }
                            obj.attributeValue = JSON.stringify(attrValueObject);
                        }
    
                        // subject_taught_other
                        if(obj.attributeType.shortName === "subject_taught_other" && !this.isOtherSubject){
                            obj.isVoided = true;
                            isSubjectOther = true;
                        }
                        else if (obj.attributeType.shortName === "subject_taught_other") {
                            obj.attributeValue = this.state.subject_taught_other;
                            obj.isVoided = false;
                            isSubjectOther = true;
                        }
    
                        // teaching_years
                        if(obj.attributeType.shortName === "teaching_years") {
                            obj.attributeValue = self.state.teaching_years;
                        }

                        // teaching_years
                        if(obj.attributeType.shortName === "education_level") {
                            obj.attributeValue = await getDefinitionId("education_level", this.state.education_level);
                        }
                    }
    
                    if(!isSubjectOther && this.state.subject_taught_other !== "") {
                        var attrType = await getPersonAttributeTypeByShortName("subject_taught_other");
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = attrType;
                        
                        attributeObject.attributeValue = this.state.subject_taught_other; // attributeValue obj
                        fetchedAttributes.push(attributeObject);
                    }

                    this.fetchedParticipant.person.attributes = fetchedAttributes;
                    delete this.fetchedParticipant.createdBy;
    
                    updateParticipant(this.fetchedParticipant, this.fetchedParticipant.uuid)
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
                                submitMsg = "Unable to update Participant Details form. \
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
                    var jsonData = new Object();
                    jsonData.identifier = this.participantId;
                    jsonData.location = {};
                    jsonData.location.locationId = this.state.school_id.id;
                    
                    jsonData.person = {};
                    jsonData.person.country = "Pakistan";
                    // jsonData.person.date_start = this.state.date_start;
                    jsonData.person.firstName = this.state.participant_name;
                    jsonData.person.dob = this.state.dob; 
                    jsonData.person.gender = this.state.sex; 

                    jsonData.person.attributes = [];
                    
                    // type of participant
                    var attrType = await getPersonAttributeTypeByShortName("lse_teacher_participant");
                    var attrTypeId= attrType.attributeTypeId;
                    var attributeObject = new Object(); // top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value 
                    attributeObject.attributeValue = true; // attributeValue obj
                    jsonData.person.attributes.push(attributeObject);

                    
                    // ==== MULTISELECT location_attribute_types ===
                    
                    // subject_taught > person attr type
                    var attrType = await getPersonAttributeTypeByShortName("subject_taught");
                    var attrTypeId= attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                    let attrValueObject = [];
                    for(let i=0; i< this.state.subject_taught.length; i++ ) {
                        let definitionObj = {};
                        // send first: def type and second: definition shortname below
                        definitionObj.definitionId = await getDefinitionId("subject_taught", this.state.subject_taught[i].value);
                        attrValueObject.push(definitionObj);
                    }
                    
                    attributeObject.attributeValue = JSON.stringify(attrValueObject); // attributeValue array of definitionIds
                    jsonData.person.attributes.push(attributeObject);
                    
                    // subject_taught_other
                    if(this.isOtherSubject) {
                        
                        var attrType = await getPersonAttributeTypeByShortName("subject_taught_other");
                        var attrTypeId= attrType.attributeTypeId;
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = {};
                        attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                        
                        attributeObject.attributeValue = this.state.subject_taught_other;
                        jsonData.person.attributes.push(attributeObject);
                    }

                    //teaching_years
                    var attrType = await getPersonAttributeTypeByShortName("teaching_years");
                    var attrTypeId= attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                    
                    // var years = moment().diff(this.state.partnership_start_date, 'years');
                    attributeObject.attributeValue = this.state.teaching_years; // attributeValue obj
                    jsonData.person.attributes.push(attributeObject);
                    
                    // education_level has a deinition datatype so attr value will be integer definitionid
                    var attrType = await getPersonAttributeTypeByShortName("education_level");
                    var attrTypeId= attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                    
                    attributeObject.attributeValue = await getDefinitionId("education_level", this.state.education_level); // attributeValue obj
                    jsonData.person.attributes.push(attributeObject);

        
                    console.log(jsonData);
                    saveParticipant(jsonData)
                    .then(
                        responseData => {
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
        this.isOtherSubject ? this.requiredFields.push("subject_taught_other") : this.requiredFields = this.requiredFields.filter(e => e !== "subject_taught_other");

        let formIsValid = true;
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
        // Check 'teaching_years' to be less than age of participant
        if(this.state.teaching_years != '') {
            var now = moment(new Date()); //todays date
            var dobDate = moment(document.getElementById('dob').value); // another date
            var duration = moment.duration(now.diff(dobDate));
            var ageYears = duration.asYears();
            var teachingYears = parseInt(document.getElementById('teaching_years').value);
            if(teachingYears > ageYears) {
                isOk = false;
                this.errors['teaching_years'] = "Enter valid number of teaching years";
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

        this.setState({
            school_name: '',
            subject_taught_other: ''
        })
        this.isOtherSubject = false;
        this.participantId = '';
    }

    // for modal
    toggle = () => {
        this.setState({
          modal: !this.state.modal
        });
    }



    render() {
        const { selectedOption } = this.state;
        const otherSubjectStyle = this.isOtherSubject ? {} : { display: 'none' };
        var formNavVisible = false;
        if(this.props.location.state !== undefined) {
            formNavVisible = this.props.location.state.edit ? true : false ;
        }
        else {
            formNavVisible = false;
        }

        return (
            <div id="formDiv">
                <Router>
                    <header>
                    <FormNavBar isVisible={formNavVisible} {...this.props} componentName="LSE" />
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
                            <Form id="testForm" onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>Participant Details Form</b>
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
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup> 
                                                                        <Label for="participant_id" >Teacher ID</Label> <span class="errorMessage">{this.state.errors["participant_id"]}</span>
                                                                        <Input type="text" name="participant_id" id="participant_id" value={this.participantId} placeholder="Autogenerated" maxLength='10' disabled/>
                                                                        
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="participant_name" >Teacher Name <span className="required">*</span></Label>  <span class="errorMessage">{this.state.errors["participant_name"]}</span>
                                                                        <Input name="participant_name" id="participant_name" value={this.state.participant_name} onChange={(e) => {this.inputChange(e, "participant_name")}} maxLength='50' pattern="^[A-Za-z ]+" placeholder="Enter name" />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="dob" >Date of Birth <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["dob"]}</span>
                                                                        <Input type="date" name="dob" id="dob" value={this.state.dob} onChange={(e) => {this.inputChange(e, "dob")}} max={moment().format("YYYY-MM-DD")}/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup tag="fieldset" row>
                                                                        <legend className="col-form-label col-sm-2">Sex <span className="required">*</span></legend>
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
                                                                        <Label for="school_id" >School ID <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["school_id"]}</span>
                                                                        <Select id="school_id"
                                                                            name="school_id"
                                                                            value={this.state.school_id}
                                                                            onChange={(e) => this.handleChange(e, "school_id")}
                                                                            options={this.state.schools}
                                                                        />
                                                                    </FormGroup>                                                                    
                                                                </Col>
                                                                <Col md="6">

                                                                    <FormGroup >
                                                                        <Label for="school_name" >School Name</Label>
                                                                        <Input name="school_name" id="school_name" placeholder="Autopopulate School Name" value={this.state.school_name} disabled/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="subject_taught" >Subject(s) taught <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["subject_taught"]}</span>
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "subject_taught")} value={this.state.subject_taught} id="subject_taught" options={subjectsTaught} isMulti/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="12">
                                                                    <FormGroup style={otherSubjectStyle}>
                                                                        <Label for="subject_taught_other" >Specify Other</Label> <span class="errorMessage">{this.state.errors["subject_taught_other"]}</span>
                                                                        <Input name="subject_taught_other" id="subject_taught_other" value={this.state.subject_taught_other} onChange={(e) => {this.inputChange(e, "subject_taught_other")}} placeholder="Other subjects" />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="teaching_years" >Number of years teaching <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["teaching_years"]}</span>
                                                                        <Input type="number" value={this.state.teaching_years} name="teaching_years" id="teaching_years" onChange={(e) => {this.inputChange(e, "teaching_years")}} max="99" min="0" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)}} placeholder="Enter number of years"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="education_level" >Level of Education <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["education_level"]}</span>
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
                                                        <LoadingIndicator loading={this.state.loading} msg={this.state.loadingMsg}/>
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

export default ParticipantDetails;


