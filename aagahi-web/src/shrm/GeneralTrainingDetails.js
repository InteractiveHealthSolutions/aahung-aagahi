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
import { getObject } from "../util/AahungUtil.js";
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

const coveredTopics = [
    { value: 'gender_equality', label: 'Gender Equality' },
    { value: 'violence', label: 'Violence' },
    { value: 'client_centred_care', label: 'Client Centred Care' },
    { value: 'vcat_on_fp', label: 'VCAT on FP' },
    { value: 'vcat_of_pac', label: 'VCAT of PAC' },
    { value: 'prevention_pregnancy', label: 'Prevention of unwanted pregnancy' },
    { value: 'rti', label: 'RTIs' },
    { value: 'provision_srh_services', label: 'Provision of SRH Services' },
    { value: 'family_planning', label: 'Family Planning' },
    { value: 'pac', label: 'PAC' },
    { value: 'other', label: 'Other' }
];

class GeneralTrainingDetails extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        
        this.state = {
            
            date_start: '',
            institutions: [],
            trainers: [],
            users: [],
            participants: [],
            participantForm: [],
            training_type: 'first_training',
            participant_id : '',
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
            modalHeading: '',
        };
        
        this.toggle = this.toggle.bind(this);
        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.calculateScore = this.calculateScore.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createUI = this.createUI.bind(this);
        
        this.myRef = React.createRef();
        
        this.isOtherTopic = false;
        
        this.requiredFields = ["date_start", "province", "district", "institution_id", "trainer", "topic_covered", "participant_name", "training_days"];
        this.errors = {};
        this.participantList = [];
        
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

            let formTypeObj = await getFormTypeByUuid(Constants.GENERAL_TRAINING_DETAILS_FORM_UUID);
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

    updateDisplay() {

        this.setState({
            training_type: 'first_training'
        })
    }

    beforeunload(e) {
          e.preventDefault();
          e.returnValue = true;
    }

    cancelCheck = () => {

        this.resetForm(this.requiredFields);
        this.setState({ participants: []});
        
        // receiving value directly from widget but it still requires widget to have on change methods to set it's value
        // alert(document.getElementById("date_start").value);
    }

    // for text and numeric questions
    inputChange(e, name) {
        this.setState({
            [name]: e.target.value
        });
        this.setState({
            [name]: e.target.value
        });

        
        if(name === "date_start") {
            this.setState({ date_start: e.target.value});
        }
    }

    // for single select
    valueChange = (e, name) => {
        this.setState ({sex : e.target.value });
        this.setState ({sex : e.target.value });
        this.setState({
            [name]: e.target.value
        });

    }

    // calculate score from scoring questions (radiobuttons)
    calculateScore = (e, name) => {
        this.setState({
            [name]: e.target.value
        });
        // alert(e.target.name);
        // alert(e.target.id);
        // alert(e.target.value);

    }

    // for multi select and for React-Select isMulti
    valueChangeMulti(e, name) {
        // console.log(e);
        // alert(e.length);
        // alert(value[0].label + "  ----  " + value[0].value);
        
        this.setState({
            [name]: e
        });
    
        if(name === "participant_name") {

            let difference = [];

            if(this.state.participant_name != null && e != null) {

                let difference = this.state.participant_name.filter(x => !e.includes(x));
                console.log('Printing differnece ==============');  

            }

            if(difference.length > 0 ) {
                // alert("difference greater than 0");
                // alert(difference[0].label);
                for (var i = this.state.users.length - 1; i >= 0; --i) {
                    if (this.state.users[i].label == difference[0].label) {
                        // alert("parcipant name matched");
                        this.state.users.splice(i,1);
                    }
                }
            }
            console.log('Removed: ', difference);  


            if( e != null) {
                if(e.length > 0 ) {
                    // alert("e is not null");
                    this.createUI(e);
                    // alert(this.state.users.length);
                    
                }
            }
            else if(e == null) {
                // alert("e is null");
                this.setState({
                    participantForm: [],
                    users : []
                });

                this.createUI(e)
            }
        }

        if(name === "topic_covered") {
            if (getObject('other', e, 'value') != -1) {
                this.isOtherTopic = true;
            }
            if (getObject('other', e, 'value') == -1) {
                this.isOtherTopic = false;
            }
            this.isOtherTopic ? this.requiredFields.push("topic_covered_other") : this.requiredFields = this.requiredFields.filter(e => e !== "topic_covered_other");
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
    
            if(name === "province"){
                let districts = getDistrictsByProvince(e.id); // sending province integer id
                console.log(districts);
                this.setState({
                    districtArray : districts
                })
            }
    
            if (name === "institution_id") {
    
                this.setState({
                    institution_name: e.locationName
                })
                
                if(e != null) {
    
                        // this.fillParticipants(selectedinstitutions);
                        var institutionUuid = e.uuid;
                        let self= this;
    
                        let participants =  await getParticipantsByLocation(institutionUuid);
                        
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
        };

    createUI(e){
        // alert("in create UI method");
        // alert(e[0].label);
        // alert(e[0].location);
        // this.setState(prevState => ({ 
        //     users: [...prevState.users, { firstName: e.label, lastName: e.location }]
        // }))

        
        var array = this.state.participantForm;
        array = [];

        // TODO: check this, figure out when to make it persistent and when to empty
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
                            <Label><h6><b>{e[i].label} </b></h6></Label><Label style={{color: "#9e9e9e"}}><h7><b> ({e[i].location})</b></h7></Label>
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
            jsonData.location = {};
            jsonData.location.locationId = this.state.institution_id.id;
            jsonData.data.trainer = [];
            jsonData.data.participant_scores = [];
            jsonData.data.trainer = [];
            jsonData.data.topic_covered = {};
            jsonData.data.topic_covered.values = [];
            
            // adding required properties in data property
            jsonData.data.date_start = this.state.date_start;
            jsonData.data.institution_id = this.state.institution_id.id;
            jsonData.data.province = data.get('province');
            jsonData.data.district = this.state.district.label;
            jsonData.data.training_days = this.state.training_days;
            jsonData.data.training_type = data.get('training_type');
            
            if((jsonData.data.trainer != null && jsonData.data.trainer != undefined)) {
                for(let i=0; i< this.state.trainer.length; i++) {
                    jsonData.data.trainer.push({ 
                        "userId" : this.state.trainer[i].id
                    });
                }
            }
            
            // generating multiselect for topic_covered
            if((this.state.topic_covered != null && this.state.topic_covered != undefined)) {
                for(let i=0; i< this.state.topic_covered.length; i++) {
                    jsonData.data.topic_covered.values.push(String(this.state.topic_covered[i].value));
                }
            }
            if(this.state.isTopicOther)
                jsonData.data.topic_covered_other = data.get('topic_covered_other');


            

            for(let j=0; j < this.state.participant_name.length; j++) {
                
                var preScore = document.getElementById('pre_pre_score_' + j);
                var preScorePct = document.getElementById('pre_score_' + j);
                var postScore = document.getElementById('post_post_score_' + j);
                var postScorePct = document.getElementById('post_score_' + j);
                
                jsonData.data.participant_scores.push({
                    "participant_id" : this.state.participant_name[j].identifier,
                    "location_id" : this.state.participant_name[j].locationId,
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
     * clears all fields in form
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

        this.setState({ institution_name: '' });
        this.createUI([]); // clear participant section

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
        const otherTopicStyle = this.isOtherTopic ? {} : { display: 'none' };
        const setDisable = this.state.viewMode ? "disabled" : "";
        
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
                            <Form id="institutionClosing" onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>General Training Details</b>
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
                                                                        {/* TODO: autopopulate current date */}
                                                                            <Label for="date_start" >Form Date</Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                            <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} max={moment().format("YYYY-MM-DD")} />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
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

                                                                </Row>

                                                                <Row>
                                                                <Col md="6">
                                                                        <FormGroup > 
                                                                            <Label for="institution_id" >Institution ID</Label> <span class="errorMessage">{this.state.errors["institution_id"]}</span>
                                                                            <Select id="institution_id" name="institution_id" value={this.state.institution_id} onChange={(e) => this.handleChange(e, "institution_id")} options={this.state.institutions} />
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup > 
                                                                            <Label for="institution_name" >Institution Name</Label> <span class="errorMessage">{this.state.errors["institution_name"]}</span>
                                                                            <Input name="institution_name" id="institution_name" value={this.state.institution_name} onChange={(e) => { this.inputChange(e, "institution_name") }} disabled/>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                        <Label for="trainer" >Trainer(s)</Label> <span class="errorMessage">{this.state.errors["trainer"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "trainer")} value={this.state.trainer} id="trainer" options={this.state.trainers} />
                                                                    </FormGroup>                                                                    
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                            <Label for="training_type" >Type of Training</Label> <span class="errorMessage">{this.state.errors["training_type"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "training_type")} value={this.state.training_type} name="training_type" id="training_type" >
                                                                                <option value="first_training">First Training</option>
                                                                                <option value="refresher">Refresher</option> 
                                                                            </Input>
                                                                        </FormGroup>
                                                                </Col>

                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="topic_covered" >Topics Covered</Label> <span class="errorMessage">{this.state.errors["topic_covered"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "topic_covered")} value={this.state.topic_covered} id="topic_covered" options={coveredTopics} />  
                                                                    </FormGroup>
                                                                </Col>
                                                            

                                                                <Col md="6" style={otherTopicStyle}>
                                                                    <FormGroup >
                                                                        <Label for="topic_covered_other" >Specify Other Topic</Label> <span class="errorMessage">{this.state.errors["topic_covered_other"]}</span>
                                                                        <Input name="topic_covered_other" id="topic_covered_other" value={this.state.topic_covered_other} onChange={(e) => {this.inputChange(e, "topic_covered_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="training_days" >Number of Days</Label>  <span class="errorMessage">{this.state.errors["training_days"]}</span>
                                                                        <Input type="number" value={this.state.training_days} name="training_days" id="training_days" onChange={(e) => {this.inputChange(e, "training_days")}} max="99" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)}} placeholder="Enter number of days" ></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="participant_name" >Participant(s)</Label> <span class="errorMessage">{this.state.errors["participant_name"]}</span>
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

                                                            {/* please don't remove this div unless you are adding multiple questions here*/}
                                                            <div style={{height: '250px'}}><span>   </span></div>
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

export default GeneralTrainingDetails;