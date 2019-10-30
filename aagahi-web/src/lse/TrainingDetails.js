/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-21 20:29:08
 * @modify date 2019-08-21 20:29:08
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
import "../index.css";
import { getFormTypeByUuid, getLocationsByCategory, getParticipantsByLocation, getRoleByName, getUsersByRole } from "../service/GetService";
import { saveFormData } from "../service/PostService";
import * as Constants from "../util/Constants";
import { getDistrictsByProvince, location } from "../util/LocationUtil.js";
import LoadingIndicator from "../widget/LoadingIndicator";

const formatOptionLabel = ({ value, label, locationName }) => (
    <div style={{ display: "flex" }}>
        <div>{label} |</div>
        <div style={{ marginLeft: "10px", color: "#9e9e9e" }}>
        {locationName}
        </div>
    </div>
);

class TrainingDetails extends React.Component {
    
    modal = false;
    
    constructor(props) {
        super(props);
        
        this.state = {
            schools: [],
            trainers: [],
            participants : [],
            users: [],
            participantForm: [],
            training_venue: 'aahung_office',
            training_type: 'initial_training',
            school_level: 'school_level_primary',
            program_type: 'csa',
            date_start: '',
            participant_id : '',
            dob: '',
            sex : '',
            trained_school: [],
            csa_prompts: '',
            subject_taught : [], // all the form elements states are in underscore notation i.e variable names in codebook
            subject_taught_other: '',
            teaching_years: '',
            education_level: 'no_edu',
            participant_name: [],
            donor_name: '',
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
        this.calculateScore = this.calculateScore.bind(this);
        this.getObject = this.getObject.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createUI = this.createUI.bind(this);
        this.toggle = this.toggle.bind(this);
        
        this.myRef = React.createRef();
        
        this.formTypeId = 0;
        this.requiredFields = ["date_start", "province", "district", "training_venue", "training_type", "school_level", 
        "program_type", "trainer", "training_days", "trained_school",  "participant_name"];
        this.errors = {};
        this.participantList = [];
        
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
            let formTypeObj = await getFormTypeByUuid(Constants.LSE_TRAINING_DETAILS_FORM_UUID);
            this.formTypeId = formTypeObj.formTypeId;
            this.formTypeId = formTypeObj.formTypeId;

            let role = await getRoleByName(Constants.LSE_TRAINER_ROLE_NAME);
            console.log( "Role ID:" + role.roleId);
            console.log(role.roleName);
            let trainersArray = await getUsersByRole(role.uuid);
            if(trainersArray != null && trainersArray.length > 0) {
                this.setState({
                    trainers : trainersArray
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
            training_venue: 'aahung_office',
            training_type: 'initial_training',
            school_level: 'school_level_primary',
            program_type: 'csa'
        })
    }

    beforeunload(e) {
        e.preventDefault();
        e.returnValue = true;
    }

    cancelCheck = () => {

        this.resetForm(this.requiredFields);
        this.setState({ participants: []});
    }

    // for text and numeric questions
    inputChange(e, name) {
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
        
        // appending dash after 4th position in phone number
        if(name === "point_person_contact") {
            this.setState({ point_person_contact: e.target.value});
            let hasDash = false;
            if(e.target.value.length == 4 && !hasDash) {
                this.setState({ point_person_contact: ''});
            }
            if(this.state.donor_name.length == 3 && !hasDash) {
                this.setState({ point_person_contact: ''});
                this.setState({ point_person_contact: e.target.value});
                this.setState({ point_person_contact: `${e.target.value}-` });
                this.hasDash = true;
            }
        }

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

        if(name === "school_level") {
            if(e.target.value === "school_level_secondary") {
                this.setState({
                    program_type:  "lsbe"
                });
            }
            else {
                this.setState({
                    program_type:  "csa"
                });
            }
        }
    }

    // calculate score from scoring questions (radiobuttons)
    calculateScore = (e, name) => {
        this.setState({
            [name]: e.target.value
        });

    }

    // for multi select and for React-Select isMulti
    async valueChangeMulti(e, name) {
        
        this.setState({
            [name]: e
        });

        try{
            if(name === "participant_name") {

                // handling delete button of multiselect
                if(e != null && e.length == 0) {
                    this.setState({
                        participantForm: [],
                        users : []
                    });
                    this.createUI([]);
                    return;
                }

                let difference = [];

                if(this.state.participant_name != null && e != null) {
                    
                    difference = this.state.participant_name.filter(x => !e.includes(x));
                    console.log('Printing differnece ==============');  
                }

                if(difference.length > 0 ) {
                    for (var i = this.state.users.length - 1; i >= 0; --i) {
                        if (this.state.users[i].label == difference[0].label) {
                            this.state.users.splice(i,1);
                        }
                    }
                }
                console.log('Removed: ', difference);  

                if( e != null) {
                    if(e.length > 0 ) {
                        this.createUI(e);
                    }
                }
                else if(e == null) {
                    this.setState({
                        participantForm: [],
                        users : []
                    });
                    this.createUI(e);
                }
            }

            if (name === "trained_school") {

                console.log(e[0]);
                if(e != null) {

                    var selectedSchools = e;
                    if(selectedSchools != null)
                        this.fillParticipants(selectedSchools);
                }
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    async fillParticipants(schools) {

        let self = this;
        this.setState({ participants: [] });
        this.participantList = [];
        
        if(schools != null && schools.length != 0) {        
            
                for(let j=0; j < schools.length; j++){
                    let participants =  await getParticipantsByLocation(schools[j].uuid);
                    if(participants.length > 0) {
                        participants.forEach(function(obj) {
                            self.participantList.push({ "id" : obj.id, "value" : obj.uuid, "uuid" : obj.uuid, "fullName" : obj.fullName , "label" : obj.fullName, "personId" : obj.personId, "gender" : obj.gender, "identifier" : obj.identifier, "locationName": obj.locationName, "locationId": obj.locationId });
                            
                        })
                    }
                    if (this.participantList != null && this.participantList.length > 0) {
                        this.setState({
                            participants: this.participantList
                        })
                }
                else { 
                    this.setState({
                        participants: []
                    })
                }
            }
        }
        else
        this.setState({ participants: [] });
    }

    callModal = () => {
        this.setState({ modal : !this.state.modal });
    }

    // for autocomplete single select
    async handleChange(e, name) {

        this.setState({
            [name]: e
        });

        if(name === "province"){
            let districts = getDistrictsByProvince(e.id); // sending province integer id
            console.log(districts);
            this.setState({
                districtArray : districts
            })
        }

        
    };

    createUI(e){
        var array = this.state.participantForm;
        array = [];

        this.setState(prevState => ({ 
            users: []
        }))

        if(e != null ) {
            for (let i = 0; i < e.length; i++) {

                this.setState(prevState => ({ 
                    users: [...prevState.users, { name: e[i].label, location: e[i].location }]
                }))

                array.push(
                <div><div key={i} class="monitoringScoreBox">
                <Container >
                    <Row>
                        <Col md="6">
                            <Label><h6><b>{e[i].label} </b></h6></Label><Label style={{color: "#9e9e9e"}}><h7><b> ({e[i].locationName})</b></h7></Label>
                            <span class="errorMessage" id= { `participant_scores_error_${ i }` }>{this.state.errors[`participant_scores_error_${ i }`]}</span>
                            
                            
                        </Col>
                    </Row>
                    <Row>
                    <Col md="6">
                        <Label >Pre-Test Score</Label> 
                        <Input placeholder="Enter Pre-Test Score" type="number" ref={el => this[`pre_pre_score_${ i }`] = el} id={ `pre_pre_score_${ i }` } name="pre_test_score"  onChange={this.handleParticipant.bind(this, i)} onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} max="999" min="1" />
                    </Col>
                    <Col md="6">
                        <Label >Pre-Test Score %</Label> 
                        <Input placeholder="Enter Score %" ref={this[`pre_score_${ i }`] } id={ `pre_score_${ i }` } name="pre_score_percentage" onChange={this.handleParticipant.bind(this, i)}  maxLength="5"/>
                    </Col>
                    </Row>

                    <Row>
                    <Col md="6">
                    <Label >Post-Test Score</Label> 
                        <Input placeholder="Enter Post-Test Score" type="number" ref={this[`post_post_score_${ i }`]} id={`post_post_score_${ i }`} name="post_test_score"  onChange={this.handleParticipant.bind(this, i)} onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} max="999" min="1" />
                    </Col>
                    <Col md="6">
                        <Label >Post-Test Score %</Label> 
                        <Input placeholder="Enter Score %" ref={this[`post_score_${ i }`]} id={ `post_score_${ i }` } name="post_score_percentage" onChange={this.handleParticipant.bind(this, i)} maxLength="5"/>
                    </Col>
                    </Row>

                
                    <br/>
                </Container>
                
                
            </div>
            <div style={{height: '20px'}}><span>   </span></div>
            </div>
            )   
            }
        }

        this.setState({
            participantForm: array
        });

     }

     handleParticipant(i, e) {
         
      const { name, value } = e.target;
      let users = [...this.state.users];
      users[i] = {...users[i], [name]: value};
      this.setState({ users });
      console.log(this.state.users)
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
            
            jsonData.data = {};
            jsonData.data.trainer = [];
            jsonData.data.participant_scores = [];
            
            // adding required properties in data property
            jsonData.data.date_start = this.state.date_start;
            jsonData.data.province = data.get('province');
            jsonData.data.district = this.state.district.label;
            jsonData.data.training_venue = this.state.training_venue;
            jsonData.data.training_type = this.state.training_type;
            jsonData.data.school_level = this.state.school_level;
            jsonData.data.program_type = this.state.program_type;

            if((this.state.trainer != null && this.state.trainer != undefined)) {
                for(let i=0; i< this.state.trainer.length; i++) {
                    jsonData.data.trainer.push({ 
                        "userId" : this.state.trainer[i].id
                    });
                }
            }

            jsonData.data.training_days = this.state.training_days;

            for(let j=0; j < this.state.participant_name.length; j++) {
                
                var preScore = document.getElementById('pre_pre_score_' + j);
                var preScorePct = document.getElementById('pre_score_' + j);
                var postScore = document.getElementById('post_post_score_' + j);
                var postScorePct = document.getElementById('post_score_' + j);
                
                jsonData.data.participant_scores.push({
                    "participant_id" : this.state.participant_name[j].id,
                    "participant_name" : this.state.participant_name[j].fullName,
                    "locationId" : this.state.participant_name[j].locationId,
                    "pre_test_score" : preScore != null && preScore.value != '' ? parseInt(preScore.value) : 0,
                    "pre_test_score_pct" : preScorePct != null && preScorePct != '' ? parseFloat(preScorePct.value) : 0.0,
                    "post_test_score" : postScore != null && postScore.value != '' ? parseInt(postScore.value) : 0,
                    "post_test_score_pct": postScorePct != null &&  postScorePct.value != '' ? parseFloat(postScorePct.value) : 0.0

                })
            }
            




            console.log(jsonData.data);
            console.log(jsonData);
            // JSON.parse(JSON.stringify(dataObject));
            
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
                        
                        this.setState({
                            participantForm: [],
                            users : []
                        });
    
                        this.createUI([]);
                        
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

        this.updateDisplay();
    }

    // for modal
    toggle = () => {
        this.setState({
          modal: !this.state.modal
        });
    }

    render() {

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
                                <Form id="testForm" onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>Training Details</b>
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
                                                                            <Label for="date_start" >Training Date <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                            <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} max={moment().format("YYYY-MM-DD")} />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup>
                                                                            <Label for="province" >Province <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["province"]}</span>
                                                                            <Select id="province" name="province" value={this.state.province} onChange={(e) => this.handleChange(e, "province")} options={location.provinces} />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup> 
                                                                            <Label for="district" >District <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["district"]}</span>
                                                                            <Select id="district" name="district" value={this.state.district} onChange={(e) => this.handleChange(e, "district")} options={this.state.districtArray}/>
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup > 
                                                                                <Label for="training_venue" >Training Venue <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["training_venue"]}</span>
                                                                                <Input type="select" onChange={(e) => this.valueChange(e, "training_venue")} value={this.state.training_venue} name="training_venue" id="training_venue">
                                                                                    
                                                                                    <option value="aahung_office">Aahung Office</option>
                                                                                    <option value="school_campus">School Campus</option>
                                                                                    <option value="other_training_facility">Other Training Facility</option>
                                                                                    <option value="hotel_restaurant">Hotel/Restaurant</option>
                                                                                </Input>
                                                                            </FormGroup>
                                                                            
                                                                    </Col>
                                                                
                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                            <Label for="training_type" >Type of Training <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["training_type"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "training_type")} value={this.state.training_type} name="training_type" id="training_type">
                                                                                
                                                                                <option value="initial_training">Initial Training</option>
                                                                                <option value="refresher_training">Refresher Training</option>
                                                                                <option value="mt_training">MT Training</option>
                                                                                <option value="roll_out_step_down">Roll Out/Step Down</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                        
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                            <Label for="school_level" >Level of school(s) being trained <span className="required">*</span></Label>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "school_level")} value={this.state.school_level} name="school_level" id="school_level">
                                                                                <option value="school_level_primary">Primary</option>
                                                                                <option value="school_level_secondary">Secondary</option>
                                                                            </Input>
                                                                        </FormGroup>                                                                       
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                            <Label for="program_type" >Type of program <span className="required">*</span></Label>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "program_type")} value={this.state.program_type} name="program_type" id="program_type">
                                                                                <option value="csa">CSA</option>
                                                                                <option value="gender">Gender</option>
                                                                                <option value="lsbe">LSBE</option>
                                                                            </Input>
                                                                        </FormGroup>                                                                       
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="trainer" >Name(s) of Trainer(s) <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["trainer"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "trainer")} value={this.state.trainer} id="trainer" options={this.state.trainers} />
                                                                    </FormGroup>                                                                    
                                                                </Col>
                                                            
                                                            </Row>

                                                            <Row>

                                                                <Col>
                                                                    <FormGroup >
                                                                        <Label for="training_days" >Number of Days <span className="required">*</span></Label>  <span class="errorMessage">{this.state.errors["training_days"]}</span>
                                                                        <Input type="number" value={this.state.training_days} name="training_days" id="training_days" onChange={(e) => {this.inputChange(e, "training_days")}} max="99" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)}} placeholder="Enter number of days"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            

                                                                <Col md="6">
                                                                <FormGroup >
                                                                        <Label for="trained_school" >School ID <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["trained_school"]}</span>
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "trained_school")} value={this.state.trained_school} id="trained_school" options={this.state.schools} isMulti />
                                                                    </FormGroup>                                                            
                                                                </Col>

                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="participant_name" >Participant(s) <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["participant_name"]}</span>
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "participant_name")} value={this.state.participant_name} id="participant_name" options={this.state.participants} formatOptionLabel={formatOptionLabel} isMulti />
                                                                    </FormGroup>  
                                                                </Col>
                                                            </Row>  

                                                            <div>
                                                            { 
                                                                this.state.participantForm.map(input => {
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

export default TrainingDetails;