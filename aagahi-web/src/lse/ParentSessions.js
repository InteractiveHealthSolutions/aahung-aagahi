/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-18 23:29:42
 * @modify date 2019-08-18 23:29:42
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
import { getObject } from "../util/AahungUtil.js";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import { location, getDistrictsByProvince} from "../util/LocationUtil.js";
import {RadioGroup, Radio} from 'react-radio-group';
import moment from 'moment';
import * as Constants from "../util/Constants";
import { getFormTypeByUuid, getLocationsByCategory, getLocationByShortname, getLocationAttributesByLocation, getDefinitionByDefinitionId, getDefinitionsByDefinitionType, getLocationAttributeTypeByShortName, getDefinitionId, getRoleByName, getUsersByRole, getParticipantsByLocation } from "../service/GetService";
import { saveFormData } from "../service/PostService";
import LoadingIndicator from "../widget/LoadingIndicator";
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBBtn } from 'mdbreact';


// const options = [
//     { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Sindh' },
//     { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Punjab' },
//     { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Balochistan' },
//     { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Khyber Pakhtunkhwa' },
// ];

const programsImplemented = [
    { label: 'CSA', value: 'csa'},
    { label: 'Gender', value: 'gender'},
    { label: 'LSBE', value: 'lsbe'},
];

const options = [
    { label: 'Math', value: 'math'},
    { label: 'Science', value: 'science'},
    { label: 'English', value: 'def'},
    { label: 'Urdu', value: 'urdu', },
    { label: 'Social Studies', value: 'social_studies'},
    { label: 'Islamiat', value: 'islamiat'},
    { label: 'Art', value: 'art', },
    { label: 'Music', value: 'music'},
    { label: 'Other', value: 'other', },
];

const schools = [
    { value: 'sindh', label: 'Sindh' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'balochistan', label: 'Balochistan' },
    { value: 'khyber_pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
];

const monitors = [
    { label: 'Harry Potter', value: 'harry123'},
    { label: 'Hermione Granger', value: 'herione456'},

];
const facilitatorTypeOptions = [
    { value: 'parents', label: 'Parents' },
    { value: 'teachers', label: 'Teachers' },
    { value: 'school_management', label: 'School Management' },
    { value: 'aahung_trainers', label: 'Aahung Trainers' },
];

const previousTopicCoveredOptions = [
    { value: 'understanding_family', label: 'Understanding Family' },
    { value: 'healthy_relationships', label: 'Healthy Relationships' },
    { value: 'gender_1', label: 'Gender I' },
    { value: 'gender_2', label: 'Gender II' },
    { value: 'violence', label: 'Violence' },
    { value: 'safe_use_icts', label: 'Safe Use of ICTs' },
    { value: 'puberty', label: 'Puberty' },
    { value: 'body_image', label: 'Body Image' },
    { value: 'child_early_forced_marriages', label: 'Child Early and Forced Marriages' },
    { value: 'financial_literacy', label: 'Financial Literacy' },
    { value: 'other', label: 'Other' }, 
    
];

class ParentSessions extends React.Component {

    modal = false;
    

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            date_start: '',
            schools: [],
            monitors: [],
            parent_attendant: 'mothers',
            session_organization: 'separate',
            previous_topic_covered: '',
            parent_session_conducted: '',
            next_session_plan: '',
            activeTab: '1',
            page2Show: true,
            viewMode: false,
            editMode: false,
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
        this.scoreChange = this.scoreChange.bind(this);
        this.getObject = this.getObject.bind(this);
        this.inputChange = this.inputChange.bind(this);

        this.isSessionConducted = false;
        this.isGenderBoth = false;
        this.isPreviousTopicOther = false;
        this.isNextPlan = false;
        this.score = 0;
        this.totalScore = 0; 
        this.scoreArray = [];

        this.formTypeId = 0;
        this.requiredFields = ["date_start", "monitor", "parent_session_conducted", "school_id", "parent_session_score" , "parent_session_score_pct"];
        this.errors = {};
    }

    componentDidMount() {

        // alert("School Details: Component did mount called!");
        window.addEventListener('beforeunload', this.beforeunload.bind(this));
        this.loadData();
    }

    componentWillUnmount() {

        // alert("School Details: ComponentWillUnMount called!");
        window.removeEventListener('beforeunload', this.beforeunload.bind(this));
    }

    /**
     * Loads data when the component is mounted
     */
    loadData = async () => {
        try {

            let formTypeObj = await getFormTypeByUuid(Constants.PARENT_SESSION_FORM_UUID);
            this.formTypeId = formTypeObj.formTypeId;
            this.formTypeId = formTypeObj.formTypeId;

            let role = await getRoleByName(Constants.LSE_MONITOR_ROLE_NAME);
            console.log( "Role ID:" + role.roleId);
            console.log(role.roleName);
            let trainersArray = await getUsersByRole(role.uuid);
            if(trainersArray != null && trainersArray.length > 0) {
                this.setState({
                    monitors : trainersArray
                })
            }

            let schools = await getLocationsByCategory(Constants.SCHOOL_DEFINITION_UUID);
            if (schools != null && schools.length > 0) {
                this.setState({
                    schools: schools
                })
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    updateDisplay() {
        this.setState({
            parent_attendant: 'mothers',
            session_organization: 'separate'
        })
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
        // alert(document.getElementById("date_start").value);
    }

    inputChange(e, name) {
        

        if(name === "date_start") {
            this.setState({ date_start: e.target.value});
        }

        this.setState({
            [name]: e.target.value
        });
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

        if(name === "parent_attendant") {
            this.isGenderBoth = e.target.value === "both" ? true : false; 
            this.isGenderBoth ? this.requiredFields.push("session_organization") : this.requiredFields = this.requiredFields.filter(e => e !== "session_organization");

        }

        

    }

    // calculate score from scoring questions (radiobuttons)
    scoreChange = (e, name) => {
        this.setState({
            [name]: e.target.value
        });
        // alert(e.target.name); // field_name
        // alert(e.target.id); // yes or strongly agree
        // alert(e.target.value); // 0 || 1 || 2 || 3 || 4 || 5

        if(name === "parent_session_conducted") {
            this.isSessionConducted = e.target.id === "yes" ? true : false;
            var dependents = ["session_actively_organized", "lastest_session_date", "session_count", "avg_participant_count", "parent_attendant", "facilitator_type", "previous_topic_covered", "next_session_plan"];
            if(this.isSessionConducted) {
                this.requiredFields = this.requiredFields.concat(dependents);
            }
            else {
                this.requiredFields = this.requiredFields.filter(n => !dependents.includes(n));
            }


            this.isGenderBoth = this.state.parent_attendant === "both" && e.target.id === "yes" ? true : false;
            this.isNextPlan = this.state.next_session_plan === "yes" && e.target.id === "yes" ? true : false;

            if(e.target.id === "yes") {
                if (getObject('other', this.state.previous_topic_covered, 'value' ) != -1) { 
                    this.isPreviousTopicOther =  true;
                }
                if (getObject('other', this.state.previous_topic_covered, 'value') == -1) {
                    this.isPreviousTopicOther = false;
                }
            }
            else 
                this.isPreviousTopicOther = false;
            
        }

        if(name === "next_session_plan") {
            this.isNextPlan = e.target.id === "yes" ? true : false; 
            this.isNextPlan ? this.requiredFields.push("next_session_date") : this.requiredFields = this.requiredFields.filter(e => e !== "next_session_date");
        }

        let indicator = e.target.id;
        let fieldName = e.target.name;
        let value = e.target.value;
        this.calcualtingScore(indicator, fieldName, value);
    }

        // calculate total and score {id, fieldName, value, score, totalScore}
        calcualtingScore(indicator, fieldName, value) { 

            switch(indicator) {
                case "strongly_disagree": // coding is 5
                    var indicatorCode = 5;
                    this.calculate(indicator, fieldName, value, indicatorCode);
                    
                    break;
    
                case "disagree":
                    var indicatorCode = 5;
                    this.calculate(indicator, fieldName, value, indicatorCode);
                    
                    break;
    
                case "neither":
                    var indicatorCode = 5;
                    this.calculate(indicator, fieldName, value, indicatorCode);
                
                    break;            
    
                case "agree":
                    var indicatorCode = 5;
                    this.calculate(indicator, fieldName, value, indicatorCode);
    
                    break;
                
                case "strongly_agree":
                    var indicatorCode = 5;
                    this.calculate(indicator, fieldName, value, indicatorCode);
                    
                    break;
                
                case "yes":
                    var indicatorCode = 1;
                    this.calculate(indicator, fieldName, value, indicatorCode);
                
                    break;
                
                case "no":
                    var indicatorCode = 1;
                    this.calculate(indicator, fieldName, value, indicatorCode);
            
                    break;
    
                
              }
    
        }
    
        calculate(indicator, fieldName, value, indicatorValue) {
            let answered = [];
                  if(this.scoreArray != undefined || this.scoreArray != null) {
                    answered = this.scoreArray.filter(question => question.elementName == fieldName);
                  }
                  if(answered[0] !=null) {
                      answered[0].id = indicator;
                      answered[0].elementName = fieldName;
                      this.score = this.score - parseInt(answered[0].value); //becase previous answer is not applicable any more
                      this.score += parseInt(value);  
    
                      for (var i in this.scoreArray) {
                        if (this.scoreArray[i].elementName == fieldName) {
    
                           this.scoreArray[i].id = indicator; // they will remain same
                           this.scoreArray[i].elementName = fieldName; // they will remain same
                           this.scoreArray[i].value = value;
                           this.scoreArray[i].score = this.score;
                           break; //Stop this loop, we found it!
                        }
                      }
                  }
                  else { //push this question along with value and other attributes
    
                    let newAnswered = {}
                    newAnswered.id = indicator;
                    newAnswered.elementName = fieldName;
                    newAnswered.value = value;
                    this.score += parseInt(value);
                    this.totalScore += indicatorValue;
                    newAnswered.score = this.score;
                    newAnswered.totalScore = this.totalScore;
                    this.scoreArray.push(newAnswered);
                  }
    
                //   alert(this.score);
                //   alert(this.totalScore);
                  var score = parseInt(this.score);
                  var totalScore = parseInt(this.totalScore);
                  
                  var percent = (score/totalScore)*100;
                //   alert(percent)
                  percent = percent.toFixed(2);
                  this.setState({
                    parent_session_score : this.score,
                    parent_session_score_pct : percent
                  })
                //   alert(percent);
                  console.log(this.scoreArray);
        }

    // for multi select
    valueChangeMulti(e, name) {
        console.log(e);
        
        this.setState({
            [name]: e
        });

        if (name === "previous_topic_covered") {
            // checking twice because when another value is selected and other is unchecked, it still does not change the state
            if (getObject('other', e, 'value') != -1) { 
                this.isPreviousTopicOther =  true;
            }
            if (getObject('other', e, 'value') == -1) {
                this.isPreviousTopicOther =  false;
            }

            this.isPreviousTopicOther ? this.requiredFields.push("previous_topic_covered_other") : this.requiredFields = this.requiredFields.filter(e => e !== "previous_topic_covered_other");
        }
    }

    callModal = () => {
        this.setState({ modal : !this.state.modal });
    }

    // for autocomplete single select
    async handleChange(e, name) {

        this.setState({
            [name]: e
        });
        
        try {
            if(name === "province"){
                let districts = getDistrictsByProvince(e.id); // sending province integer id
                console.log(districts);
                this.setState({
                    districtArray : districts
                })
            }

            if (name === "school_id") {

                this.setState({ school_name: e.locationName});
                document.getElementById("school_name").value= e.locationName;
            }

            
            let attributes = await getLocationAttributesByLocation(e.uuid);
            this.autopopulateFields(attributes);
        }
        catch (error) {
            console.log(error);
        }
    };
    
    /**
     * created separate method because async handle was not updating the local variables (location attrs)
     */
    autopopulateFields(locationAttributes) {
        let self = this;
        let attributeValue = '';
        let count = 0;
        locationAttributes.forEach(async function (obj) {
            let attrTypeName = obj.attributeType.shortName;
            if (attrTypeName === "partnership_years")
                return;


            if (obj.attributeType.dataType.toUpperCase() != "JSON" || obj.attributeType.dataType.toUpperCase() != "DEFINITION") {
                attributeValue = obj.attributeValue;

            }

            if (obj.attributeType.dataType.toUpperCase() == "DEFINITION") {
                // fetch definition shortname
                let definitionId = obj.attributeValue;
                
                let definition = await getDefinitionByDefinitionId(definitionId);
                
                let attrValue = definition.shortname;
                
                attributeValue = definition.definitionName;

            }

            if (obj.attributeType.dataType.toUpperCase() == "JSON") {

                // attr value is a JSON obj > [{"definitionId":13},{"definitionId":14}]
                let attrValueObj = JSON.parse(obj.attributeValue);
                let multiSelectString = '';
                if (attrValueObj != null && attrValueObj.length > 0) {
                    let definitionArray = [];
                    if ('definitionId' in attrValueObj[0]) {
                        definitionArray = await getDefinitionsByDefinitionType(attrTypeName);
                    }
                    attrValueObj.forEach(async function (obj) {
                        count++;
                        if ('definitionId' in obj) {

                            // definitionArr contains only one item because filter will return only one definition
                            let definitionArr = definitionArray.filter(df => df.id == parseInt(obj.definitionId));
                            // if (count != attrValueObj.length) {
                            //     multiSelectString = multiSelectString.concat(", ");
                            // }
                            multiSelectString = multiSelectString.concat(" ");
                            multiSelectString = multiSelectString.concat(definitionArr[0].definitionName);
                            if (attrTypeName === "program_implemented")
                                self.setState({ program_implemented: multiSelectString })
                        }
                    })
                }
                attributeValue = multiSelectString;

            }

            if (attrTypeName != "program_implemented")
                self.setState({ [attrTypeName]: attributeValue });

        })
    }

    handleSubmit = async event => {
        event.preventDefault();
        if(this.handleValidation()) {
            
            console.log("in submission");
            
            
            this.setState({ 
                // form_disabled: true,
                loading : true
            })
            
            const data = new FormData(event.target);
            var jsonData = new Object();
            jsonData.formDate =  this.state.date_start;
            jsonData.formType = {};
            jsonData.formType.formTypeId = this.formTypeId;
            jsonData.referenceId = "";
            
            jsonData.location = {};
            jsonData.location.locationId = this.state.school_id.id;
            jsonData.data = {};    
            jsonData.data.facilitator_type = {};
            jsonData.data.facilitator_type.values = [];
            jsonData.data.previous_topic_covered = {};
            jsonData.data.previous_topic_covered.values = [];
            jsonData.data.monitor = [];
            
            
            // adding required properties in data property
            jsonData.data.date_start = this.state.date_start;
            jsonData.data.parent_session_conducted = this.state.parent_session_conducted;

            if((this.state.monitor != null && this.state.monitor != undefined)) {
                for(let i=0; i< this.state.monitor.length; i++) {
                    jsonData.data.monitor.push({ 
                        "userId" : this.state.monitor[i].id
                    });
                }
            }
            

            if(this.isSessionConducted) {

                jsonData.data.parent_session_conducted = this.state.parent_session_conducted;
                jsonData.data.lastest_session_date = this.state.lastest_session_date;
                jsonData.data.session_count = this.state.session_count;
                jsonData.data.avg_participant_count = this.state.avg_participant_count;
                jsonData.data.parent_attendant = this.state.parent_attendant;
                
                if(this.isGenderBoth)
                    jsonData.data.session_organization = this.state.session_organization;
                
                // generating multiselect for topic covered
                if((this.state.facilitator_type != null && this.state.facilitator_type != undefined)) {
                    for(let i=0; i< this.state.facilitator_type.length; i++) {
                        jsonData.data.facilitator_type.values.push(String(this.state.facilitator_type[i].value));
                    }
                }
                
                
                // generating multiselect for previous_topic_covered
                if((this.state.previous_topic_covered != null && this.state.previous_topic_covered != undefined)) {
                    for(let i=0; i< this.state.previous_topic_covered.length; i++) {
                        jsonData.data.previous_topic_covered.values.push(String(this.state.previous_topic_covered[i].value));
                    }
                }

                if(this.isPreviousTopicOther)
                    jsonData.data.previous_topic_covered_other = this.state.previous_topic_covered_other;
                
                jsonData.data.next_session_plan = this.state.next_session_plan;
                
                if(this.isNextPlan)
                    jsonData.data.next_session_date = this.state.previous_topic_covered_other;

                jsonData.data.parent_session_score = parseInt(data.get('parent_session_score'));
                jsonData.data.parent_session_score_pct = parseFloat(data.get('parent_session_score_pct'));
                
                
            }
            
            
            
            console.log(jsonData);
            
            saveFormData(jsonData)
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
                        
                        // document.getElementById("projectForm").reset();
                        // this.messageForm.reset();
                    }
                    else if(String(responseData).includes("Error")) {
                        
                        var submitMsg = '';
                        submitMsg = "Unable to submit Form. \
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
        this.setState({ hasError: true });
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

    /**
     * verifies and notifies for the empty form fields
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
            school_sex: ''
        })

        this.updateDisplay();
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
        
        const sessionConductedStyle = this.isSessionConducted ? {} : { display: 'none' };
        const genderBothStyle = this.isGenderBoth ? {} : { display: 'none' };
        const nextPlanStyle = this.isNextPlan ? {} : { display: 'none' };
        const otherTopicStyle = this.isPreviousTopicOther ? {} : { display: 'none' };
        const { selectedOption } = this.state;
        // scoring labels
        const stronglyAgree = "Strongly Agree";
        const agree = "Agree";
        const neither = "Neither Agree nor Disagree";
        const stronglyDisagree = "Strongly Disagree";
        const disagree = "Disagree";
        const yes = "Yes";
        const no = "No";
        
        
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
                                                <b>Parent Sessions</b>
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
                                                                    <FormGroup inline>
                                                                        <Label for="date_start" >Form Date</Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                        <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} max={moment().format("YYYY-MM-DD")} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            {/* <Row>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="province" >Province</Label> <span class="errorMessage">{this.state.errors["province"]}</span>
                                                                        <Select id="province" name="province" value={this.state.province} onChange={(e) => this.handleChange(e, "province")} options={location.provinces} />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup> 
                                                                        <Label for="district" >District</Label> <span class="errorMessage">{this.state.errors["district"]}</span>
                                                                        <Select id="district" name="district" value={this.state.district} onChange={(e) => this.handleChange(e, "district")} options={this.state.districtArray} />
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row> */}

                                                            <Row>    
                                                                <Col md="6">
                                                                
                                                                    <FormGroup >
                                                                        <Label for="school_id" >School ID</Label> <span class="errorMessage">{this.state.errors["school_id"]}</span>
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
                                                                        <Input name="school_name" id="school_name" value={this.state.school_name} placeholder="School Name will be autopulated" disabled/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            
                                                        <Row>
                                                            <Col md="6">
                                                                <FormGroup >
                                                                    <Label for="monitor" >Monitored By</Label> <span class="errorMessage">{this.state.errors["monitor"]}</span>
                                                                    <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "monitor")} value={this.state.monitor} id="monitor" options={this.state.monitors} />
                                                                </FormGroup>                                                                    
                                                            </Col>
                                                            
                                                            <Col md="6">
                                                                <FormGroup >
                                                                    <Label for="school_sex" >Classification of School by Sex</Label>
                                                                    <Input name="school_sex" id="school_sex" value={this.state.school_sex} disabled />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        

                                                        <Row>
                                                            <Col md="6">
                                                                <Label><h6><u><b>Parent Sessions</b></u></h6></Label>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="parent_session_conducted" >Does this school conduct parent sessions?</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="parent_session_conducted" id="yes" value="1" onChange={(e) => this.scoreChange(e, "parent_session_conducted")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="parent_session_conducted" id="no" value="0" onChange={(e) => this.scoreChange(e, "parent_session_conducted")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["parent_session_conducted"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            
                                                            <Row>
                                                                <Col md="12" style={sessionConductedStyle}>
                                                                    <FormGroup >
                                                                        <Label for="session_actively_organized" >School Management is active in organizing parent sessions for parents of primary students</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="session_actively_organized" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "session_actively_organized")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="session_actively_organized" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "session_actively_organized")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="session_actively_organized" id="neither" value="3" onChange={(e) => this.scoreChange(e, "session_actively_organized")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="session_actively_organized" id="agree" value="4" onChange={(e) => this.scoreChange(e, "session_actively_organized")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="session_actively_organized" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "session_actively_organized")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["session_actively_organized"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={sessionConductedStyle}>
                                                                    <FormGroup inline>
                                                                        <Label for="lastest_session_date" >Date of Last Parent Session</Label> <span class="errorMessage">{this.state.errors["lastest_session_date"]}</span>
                                                                        <Input type="date" name="lastest_session_date" id="lastest_session_date" value={this.state.lastest_session_date} onChange={(e) => {this.inputChange(e, "lastest_session_date")}} max={moment().format("YYYY-MM-DD")} />
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6" style={sessionConductedStyle}>
                                                                    <FormGroup >
                                                                        <Label for="session_count" >Number of parent sessions held since beginning of school year</Label>  <span class="errorMessage">{this.state.errors["session_count"]}</span>
                                                                        <Input type="number" value={this.state.session_count} name="session_count" id="session_count" onChange={(e) => {this.inputChange(e, "session_count")}} max="99" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)}} placeholder="Enter count in numbers"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={sessionConductedStyle}>
                                                                    <FormGroup >
                                                                        <Label for="avg_participant_count" >Average number of participants in sessions</Label>  <span class="errorMessage">{this.state.errors["session_count"]}</span>
                                                                        <Input type="number" value={this.state.avg_participant_count} name="avg_participant_count" id="avg_participant_count" onChange={(e) => {this.inputChange(e, "avg_participant_count")}} max="99" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={sessionConductedStyle}>
                                                                    <FormGroup >
                                                                        <Label for="parent_attendant" >Which parent(s) attends the session?</Label> <span class="errorMessage">{this.state.errors["parent_attendant"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "parent_attendant")} value={this.state.parent_attendant} name="parent_attendant" id="parent_attendant">
                                                                            <option value="mothers">Mothers</option>
                                                                            <option value="fathers">Fathers</option>
                                                                            <option value="both">Both</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={genderBothStyle}>
                                                                    <FormGroup >
                                                                        <Label for="session_organization" >How are the sessions organized?</Label> <span class="errorMessage">{this.state.errors["session_organization"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "session_organization")} value={this.state.session_organization} name="session_organization" id="session_organization">
                                                                            <option value="separate">Separate Sessions</option>
                                                                            <option value="joint">Joint Sessions</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6" style={sessionConductedStyle}>
                                                                    <FormGroup >
                                                                            <Label for="facilitator_type" >Facilitator</Label> <span class="errorMessage">{this.state.errors["facilitator_type"]}</span>
                                                                            <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "facilitator_type")} value={this.state.facilitator_type} id="facilitator_type" options={facilitatorTypeOptions} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="6" style={sessionConductedStyle}>
                                                                <FormGroup >
                                                                        <Label for="previous_topic_covered" >Topics covered in previous sessions</Label> <span class="errorMessage">{this.state.errors["previous_topic_covered"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "previous_topic_covered")} value={this.state.previous_topic_covered} id="previous_topic_covered" options={previousTopicCoveredOptions} />
                                                                </FormGroup>
                                                            </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={otherTopicStyle}>
                                                                    <FormGroup >
                                                                        <Label for="previous_topic_covered_other" >Specify Other</Label> <span class="errorMessage">{this.state.errors["previous_topic_covered_other"]}</span>
                                                                        <Input name="previous_topic_covered_other" id="previous_topic_covered_other" value={this.state.previous_topic_covered_other} onChange={(e) => { this.inputChange(e, "previous_topic_covered_other") }} placeholder="Enter text"/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="6" style={sessionConductedStyle}>
                                                                    <FormGroup >
                                                                        <Label for="next_session_plan" >Is the next parent session planned?</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="next_session_plan" id="yes" value="1" onChange={(e) => this.scoreChange(e, "next_session_plan")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="next_session_plan" id="no" value="0" onChange={(e) => this.scoreChange(e, "next_session_plan")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["next_session_plan"]}</span>
                                                                            </Col>
                                                                        </FormGroup> 
                                                                        <span class="errorMessage">{this.state.errors["next_session_plan"]}</span>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={nextPlanStyle}>
                                                                    <FormGroup inline>
                                                                        <Label for="next_session_date" >Date of next session</Label> <span class="errorMessage">{this.state.errors["next_session_date"]}</span>
                                                                        <Input type="date" name="next_session_date" id="next_session_date" value={this.state.next_session_date} onChange={(e) => {this.inputChange(e, "next_session_date")}} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup className="monitoringScoreBox">
                                                                        <Label for="parent_session_score" style={{color: "green"}}><b>Cumulative Parent Session Score</b></Label> <span class="errorMessage">{this.state.errors["parent_session_score"]}</span>
                                                                        <Input value={this.state.parent_session_score} name="parent_session_score" id="parent_session_score"  onChange={(e) => {this.inputChange(e, "parent_session_score")}} disabled></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup className="monitoringScoreBox">
                                                                        {/* TODO: apply style to hide this based on csa/primary question */}
                                                                        <Label for="parent_session_score_pct" style={{color: "green"}}><b>% Score</b></Label> <span class="errorMessage">{this.state.errors["parent_session_score_pct"]}</span>
                                                                        <Input name="parent_session_score_pct" id="parent_session_score_pct" value={this.state.parent_session_score_pct} onChange={(e) => {this.inputChange(e, "parent_session_score_pct")}} disabled></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            {/* please don't remove this div unless you are adding multiple questions here*/}
                                                            <div style={{height: '180px'}}><span>   </span></div>
                                                        
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

export default ParentSessions;