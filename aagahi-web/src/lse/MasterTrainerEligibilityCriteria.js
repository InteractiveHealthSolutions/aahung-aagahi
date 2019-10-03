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
import * as Constants from "../util/Constants";
import { getFormTypeByUuid, getLocationsByCategory, getLocationByShortname, getLocationAttributesByLocation, getDefinitionByDefinitionId, getDefinitionsByDefinitionType, getLocationAttributeTypeByShortName, getAllUsers, getRoleByName, getUsersByRole, getParticipantsByLocation } from "../service/GetService";
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

const candidates = [
    { label: 'Harry Potter', value: 'harry123'},
    { label: 'Hermione Granger', value: 'herione456'},

];

const schools = [
    { value: 'sindh', label: 'Sindh' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'balochistan', label: 'Balochistan' },
    { value: 'khyber_pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
];

const evaluators = [
    { value: 'sindh', label: 'Sindh' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'balochistan', label: 'Balochistan' },
    { value: 'khyber_pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
];

const sessionFacilitatorOptions = [
    { value: 'parents', label: 'Parents' },
    { value: 'teachers', label: 'Teachers' },
    { value: 'school_management', label: 'School Management' },
    { value: 'aahung_trainers', label: 'Aahung Trainers' },
];

const sessionTopicOptions = [
    { value: 'understanding_family', label: 'Understanding Family' },
    { value: 'healthy_relationships', label: 'Healthy Relationships' },
    { value: 'gender_one', label: 'Gender I' },
    { value: 'gender_two', label: 'Gender II' },
    { value: 'violence', label: 'Violence' },
    { value: 'safe_use_icts', label: 'Safe Use of ICTs' },
    { value: 'puberty', label: 'Puberty' },
    { value: 'body_image', label: 'Body Image' },
    { value: 'child_early_forced_marriages', label: 'Child Early and Forced Marriages' },
    { value: 'financial_literacy', label: 'Financial Literacy' },
    { value: 'other', label: 'Other' }, 
    
];

const programTrainingOptions = [
    { value: 'csa', label: 'CSA' },
    { value: 'lsbe', label: 'LSBE' },
];

const programNominationOptions = [
    { value: 'csa', label: 'CSA' },
    { value: 'lsbe', label: 'LSBE' },
];

class MasterTrainerEligibilityCriteria extends React.Component {

    modal = false;
    

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            schools: [],
            monitors: [],
            users: [],
            participants: [],
            participant_id : '',
            participant_name: '',
            candidate_program_nomination: 'csa',
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
        
        this.score = 0;
        this.totalScore = 0; 
        this.scoreArray = [];

        this.formTypeId = 0;
        this.requiredFields = ["date_start", "school_id", "participant_name", "participant_id", "candidate_program_training", 
        "candidate_program_nomination", "evaluated_by", "candidate_willingness", "candidate_work_continuation", 
        "candidate_trained_teaching_2y", "candidate_program_interest", "candidate_leadership", "candidate_training_skill", 
        "candidate_session_conduction_skills", "mt_eligibility_score", "mt_eligibility_score_pct", "mt_eligible"]
        this.errors = {};

    }

    componentDidMount() {

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

            
            let formTypeObj = await getFormTypeByUuid(Constants.MASTER_TRAINER_ELIGIBILITY_CRITERIA_FORM_UUID);
            
            this.formTypeId = formTypeObj.formTypeId;

            // let role = await getRoleByName(Constants.LSE_MONITOR_ROLE_NAME);
            // console.log( "Role ID:" + role.roleId);
            // console.log(role.roleName);
            // let trainersArray = await getUsersByRole(role.uuid);
            // if(trainersArray != null && trainersArray.length > 0) {
            //     this.setState({
            //         monitors : trainersArray
            //     })
            // }

            let userArray = await getAllUsers();

            if(userArray != null && userArray.length > 0) {
                this.setState({
                    monitors : userArray
                })
            }

            // let userArray = await getAllUsers();

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

        this.setState({
            [name]: e.target.value
        });

        console.log(e.target.value);

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

        if(name === "date_start") {
            this.setState({ date_start: e.target.value});
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
        this.setState ({sex : e.target.value });
        this.setState ({sex : e.target.value });
        this.setState({
            [name]: e.target.value
        });

        if(e.target.id === "primary_program_monitored")
        if(e.target.value === "csa") {
            this.setState({isCsa : true });
            this.setState({isGender : false });
            
        }
        else if(e.target.value === "gender") {
            this.setState({isCsa : false });
            this.setState({isGender : true });
        }

    }

    // calculate score from scoring questions (radiobuttons)
    scoreChange = (e, name) => {
        console.log(e.target.value);
        this.setState({
            [name]: e.target.value
        });
        // alert(e.target.name);
        // alert(e.target.id);
        // alert(e.target.value);

        let indicator = e.target.id;
        let fieldName = e.target.name;
        let value = e.target.value;
        this.calcualtingScore(indicator, fieldName, value);

    }

    // calculate total and score {id, fieldName, value, score, totalScore}
    calcualtingScore(indicator, fieldName, value) { 

        switch(indicator) {
            
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
                mt_eligibility_score : this.score,
                mt_eligibility_score_pct : percent
              })
            //   alert(percent);
              console.log(this.scoreArray);
    }

    // for multi select
    valueChangeMulti(e, name) {
        console.log(e);
        // alert(e.length);
        // alert(value[0].label + "  ----  " + value[0].value);
        
        this.setState({
            [name]: e
        });
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
            if (name === "school_id") {

                
                this.setState({ school_name: e.locationName });

                let participants =  await getParticipantsByLocation(e.uuid);
                if (participants != null && participants.length > 0) {
                    this.setState({
                        participants: participants
                    })
                }
                else { 
                    this.setState({
                        participants: []
                    })
                }
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
    

    handleSubmit = async event => {
        event.preventDefault();
        if(this.handleValidation()) {
            
            console.log("in submission");
            
            
            this.setState({ 
                // form_disabled: true,
                loading : true
            })

            try{
            
                const data = new FormData(event.target);
                var jsonData = new Object();
                jsonData.formDate =  this.state.date_start;
                jsonData.formType = {};
                jsonData.formType.formTypeId = this.formTypeId;
                jsonData.referenceId = "";
                
                jsonData.location = {};
                jsonData.location.locationId = this.state.school_id.id;
                jsonData.data = {};    
                jsonData.data.date_start = this.state.date_start;
                jsonData.data.school_id = this.state.school_id.id;
                jsonData.data.participant_id = this.state.participant_id.identifier;

                jsonData.data.candidate_program_training = {};
                jsonData.data.candidate_program_training.values = [];
                // generating multiselect for candidate_program_training
                if((this.state.candidate_program_training != null && this.state.candidate_program_training != undefined)) {
                    for(let i=0; i< this.state.candidate_program_training.length; i++) {
                        jsonData.data.candidate_program_training.values.push(String(this.state.candidate_program_training[i].value));
                    }
                }
                
                jsonData.data.candidate_program_nomination = this.state.candidate_program_nomination;

                jsonData.data.evaluated_by = [];
                if((this.state.evaluated_by != null && this.state.evaluated_by != undefined)) {
                    for(let i=0; i< this.state.evaluated_by.length; i++) {
                        jsonData.data.evaluated_by.push({ 
                            "userId" : this.state.evaluated_by[i].id
                        });
                    }
                }
                
                jsonData.data.candidate_willingness = this.state.candidate_willingness;
                jsonData.data.candidate_work_continuation = this.state.candidate_work_continuation;
                jsonData.data.candidate_trained_teaching_2y = this.state.candidate_trained_teaching_2y;
                jsonData.data.candidate_program_interest = this.state.candidate_program_interest;
                jsonData.data.candidate_leadership = this.state.candidate_leadership;
                jsonData.data.candidate_training_skill = this.state.candidate_training_skill;
                jsonData.data.candidate_session_conduction_skills = this.state.candidate_session_conduction_skills;
                jsonData.data.mt_eligibility_score = parseInt(data.get('mt_eligibility_score'));
                jsonData.data.mt_eligibility_score_pct = parseFloat(data.get('mt_eligibility_score_pct'));
                jsonData.data.mt_eligible = this.state.mt_eligible;
                    

                
                
                
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

        // these fields are not required therefore emptying these manually
        this.setState({
            school_name: '',
            participant_id: ''
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
                                                <b>Master Trainer Eligibility Criteria Assessment</b>
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

                                                            <Row>    
                                                                <Col md="6">
                                                                
                                                                    <FormGroup >
                                                                        <Label for="school_id" >School ID</Label> <span class="errorMessage">{this.state.errors["school_id"]}</span>
                                                                        <Select id="school_id" name="school_id" value={this.state.school_id} onChange={(e) => this.handleChange(e, "school_id")} options={this.state.schools} />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_name" >School Name</Label>
                                                                        <Input name="school_name" id="school_name" value={this.state.school_name} placeholder="School Name" disabled/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            
                                                        <Row>
                                                            <Col md="6">
                                                                <FormGroup>
                                                                    <Label for="participant_name" >Name of Candidate</Label> <span class="errorMessage">{this.state.errors["participant_name"]}</span>
                                                                    <Select id="participant_name" name="participant_name" value={this.state.participant_name} onChange={(e) => this.handleChange(e, "participant_name")} options={this.state.participants} />
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md="6">
                                                                <FormGroup >
                                                                    <Label for="participant_id" >Teacher ID</Label> 
                                                                    <Input name="participant_id" id="participant_id" value={this.state.participant_id} placeholder="Teacher ID" disabled/>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="6">
                                                                <FormGroup >
                                                                    <Label for="candidate_program_training" >Aahung program candidate has been trained on</Label> <span class="errorMessage">{this.state.errors["candidate_program_training"]}</span>
                                                                    <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "candidate_program_training")} value={this.state.candidate_program_training} id="candidate_program_training" options={programTrainingOptions} required/>
                                                                </FormGroup>                                                                    
                                                            </Col>
                                                            
                                                            <Col md="6">
                                                                <FormGroup >
                                                                    <Label for="candidate_program_nomination" >Aahung program candidate is being nominated as Master Trainer for</Label> <span class="errorMessage">{this.state.errors["candidate_program_nomination"]}</span>
                                                                    <Input type="select" onChange={(e) => this.valueChange(e, "candidate_program_nomination")} value={this.state.candidate_program_nomination} name="candidate_program_nomination" id="candidate_program_nomination">
                                                                            <option value="csa">CSA</option>
                                                                            <option value="lsbe">LSBE</option>
                                                                            
                                                                        </Input>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="6">
                                                                <FormGroup >
                                                                    <Label for="evaluated_by" >Evaluated By</Label> <span class="errorMessage">{this.state.errors["evaluated_by"]}</span>
                                                                    <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "evaluated_by")} value={this.state.evaluated_by} id="evaluated_by" options={this.state.monitors} /> 
                                                                </FormGroup>                                                                    
                                                            </Col>
                                                        </Row>
                                                        
                                                        <Row>
                                                            <Col md="6">
                                                                <Label><h6><u><b>Eligibility Criteria</b></u></h6></Label>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="candidate_willingness" >Candidate is willing to become a Master Trainer for this school</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="candidate_willingness" id="yes" value="1" onChange={(e) => this.scoreChange(e, "candidate_willingness")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="candidate_willingness" id="no" value="0" onChange={(e) => this.scoreChange(e, "candidate_willingness")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["candidate_willingness"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="candidate_work_continuation" >Candidate is likely to continue working at this school for the next 2-4 years</Label>
                                                                    <FormGroup tag="fieldset" row>
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_work_continuation" id="yes" value="1" onChange={(e) => this.scoreChange(e, "candidate_work_continuation")} />{' '}
                                                                                Yes
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_work_continuation" id="no" value="0" onChange={(e) => this.scoreChange(e, "candidate_work_continuation")} />{' '}
                                                                                No
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["candidate_work_continuation"]}</span>
                                                                        </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="candidate_trained_teaching_2y" >Candidate is trained in Aahung’s CSA/LSBE program and has been teaching the course for at least 2 years in school</Label>
                                                                    <FormGroup tag="fieldset" row>
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_trained_teaching_2y" id="yes" value="1" onChange={(e) => this.scoreChange(e, "candidate_trained_teaching_2y")} />{' '}
                                                                                Yes
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_trained_teaching_2y" id="no" value="0" onChange={(e) => this.scoreChange(e, "candidate_trained_teaching_2y")} />{' '}
                                                                                No
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["candidate_trained_teaching_2y"]}</span>
                                                                        </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="candidate_program_interest" >Candidate demonstrates a strong interest in leading and sustaining the CSA/LSBE program in this school through their dedication in teaching this program</Label>
                                                                    <FormGroup tag="fieldset" row>
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_program_interest" id="yes" value="1" onChange={(e) => this.scoreChange(e, "candidate_program_interest")} />{' '}
                                                                                Yes
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_program_interest" id="no" value="0" onChange={(e) => this.scoreChange(e, "candidate_program_interest")} />{' '}
                                                                                No
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["candidate_program_interest"]}</span>
                                                                        </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        
                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="candidate_leadership" >Candidate possesses strong leadership skills and has the ability to work in a team</Label>
                                                                    <FormGroup tag="fieldset" row>
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_leadership" id="yes" value="1" onChange={(e) => this.scoreChange(e, "candidate_leadership")} />{' '}
                                                                                Yes
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_leadership" id="no" value="0" onChange={(e) => this.scoreChange(e, "candidate_leadership")} />{' '}
                                                                                No
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["candidate_leadership"]}</span>
                                                                        </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                            
                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="candidate_training_skill" >Candidate is capable of replicating Aahung’s 6 day CSA/LSBE training with other teachers in this school</Label>
                                                                    <FormGroup tag="fieldset" row>
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_training_skill" id="yes" value="1" onChange={(e) => this.scoreChange(e, "candidate_training_skill")} />{' '}
                                                                                Yes
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_training_skill" id="no" value="0" onChange={(e) => this.scoreChange(e, "candidate_training_skill")} />{' '}
                                                                                No
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["candidate_training_skill"]}</span>
                                                                        </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        
                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="candidate_session_conduction_skills" >Candidate is capable of conducting regular parent and teacher sensitization sessions related to Aahung’s CSA/LSBE program</Label>
                                                                    <FormGroup tag="fieldset" row>
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_session_conduction_skills" id="yes" value="1" onChange={(e) => this.scoreChange(e, "candidate_session_conduction_skills")} />{' '}
                                                                                Yes
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_session_conduction_skills" id="no" value="0" onChange={(e) => this.scoreChange(e, "candidate_session_conduction_skills")} />{' '}
                                                                                No
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["candidate_session_conduction_skills"]}</span>
                                                                        </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>


                                                        <Row>
                                                            <Col md="6">
                                                                <FormGroup className="monitoringScoreBox">
                                                                    <Label for="mt_eligibility_score" style={{color: "green"}}><b>Cumulative Eligibility Score</b></Label>
                                                                    <Input value={this.state.mt_eligibility_score} name="mt_eligibility_score" id="mt_eligibility_score"  onChange={(e) => {this.inputChange(e, "mt_eligibility_score")}} disabled></Input>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="6">
                                                                <FormGroup className="monitoringScoreBox">
                                                                    <Label for="mt_eligibility_score_pct" style={{color: "green"}}><b>% Score</b></Label>
                                                                    <Input name="mt_eligibility_score_pct" id="mt_eligibility_score_pct" value={this.state.mt_eligibility_score_pct} onChange={(e) => {this.inputChange(e, "mt_eligibility_score_pct")}} disabled></Input>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        {/* onChange={(e) => {this.inputChange(e, "defined_student_pickup_responsibility")}} */}

                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="mt_eligible" >Final Decision - Selected as Master Trainer?</Label>
                                                                    <FormGroup tag="fieldset" row>
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="mt_eligible" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "mt_eligible")}} />{' '}
                                                                                Yes
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="mt_eligible" id="no" value="no" onChange={(e) => {this.inputChange(e, "mt_eligible")}} />{' '}
                                                                                No
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["mt_eligible"]}</span>
                                                                        </Col>
                                                                    </FormGroup>
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

export default MasterTrainerEligibilityCriteria;