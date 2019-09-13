/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-27 14:34:23
 * @modify date 2019-08-27 14:34:23
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
import { getObject} from "../util/AahungUtil.js";
import moment from 'moment';
import * as Constants from "../util/Constants";
import { getFormTypeByUuid, getDefinitionId, getRoleByName, getUsersByRole } from "../service/GetService";
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

const participantTypes = [
    { value: 'journalists', label: 'Journalists' },
    { value: 'bloggers', label: 'Bloggers' },
    { value: 'screenwriters', label: 'Screenwriters' },
    { value: 'other_media_personnel', label: 'Other Media Personnel' },
    { value: 'other', label: 'Other' }
];

const materialTypes = [
    { value: 'annual_report', label: 'Annual Report' },
    { value: 'aahung_profile', label: 'Aahung Profile' },
    { value: 'pamphlet', label: 'Pamphlet' },
    { value: 'booklet', label: 'Booklet' },
    { value: 'report', label: 'Report' },
    { value: 'aahung_branding_material', label: 'Aahung Branding Material' },
    { value: 'other', label: 'Other' }

];


const postPlatformOptions = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'web_portal', label: 'Web Portal' },
    { value: 'other', label: 'Other' }
];

const coveredTopics = [
    { value: 'srhr', label: 'SRHR' },
    { value: 'agency_choice', label: 'Agency and Choice' },
    { value: 'gender_sensitization', label: 'Gender sensitization' },
    { value: 'other', label: 'Other' }
];


const trainers = [
    { value: 'uuid1', label: 'Harry Potter' },
    { value: 'uuid2', label: 'Ron Weasley' },
    { value: 'uuid3', label: 'Hermione Granger' },
    { value: 'uuid4', label: 'Albus Dumbledore' },
];

class CommsTrainingDetails extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            // TODO: fill UUIDs everywhere where required
            // options : [{value: 'math'},
            // {value: 'science'}],
            date_start: '',
            trainers: [],
            city: 'karachi',
            training_venue: 'aahung_office',
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
        this.inputChange = this.inputChange.bind(this);

        this.isCityOther = false;
        this.isVenueOther = false;
        this.isTopicOther = false;
        this.isParticipantJournalist = false;
        this.isParticipantBlogger = false;
        this.isParticipantScreenwriter = false;
        this.isParticipantMedia = false;
        this.isParticipantOther = false;

        this.formTypeId = 0;
        this.requiredFields = ["date_start", "city", "trainer", "training_venue", "training_days", "topic_covered", "event_attendant"];
        this.errors = {}
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

            let formTypeObj = await getFormTypeByUuid(Constants.COMMUNICATIONS_TRAINING_DETAILS_FORM);
            this.formTypeId = formTypeObj.formTypeId;

            let role = await getRoleByName(Constants.COMMUNICATIONS_TRAINER_ROLE_NAME);
            console.log( "Role ID:" + role.roleId);
            console.log(role.roleName);
            let trainersArray = await getUsersByRole(role.uuid);
            
            if(trainersArray != null && trainersArray.length > 0) {
                this.setState({
                    trainers : trainersArray
                })
            }

            this.formTypeId = formTypeObj.formTypeId;

        }
        catch(error) {
            console.log(error);
        }
    }

    updateDisplay() {

        this.setState({
            city: 'karachi',
            training_venue : 'aahung_office',
            distribution_location: 'conference'
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

        console.log(" ============================================================= ")
        this.resetForm(this.requiredFields);

        // receiving value directly from widget but it still requires widget to have on change methods to set it's value
        // alert(document.getElementById("date_start").value);
    }

    // for text and numeric questions
    inputChange(e, name) {

        this.setState({
            [name]: e.target.value
        });
        
        if(name === "date_start") {
            this.setState({ date_start: e.target.value});
        }   
    }

    // for single select
    valueChange = (e, name) => {

        this.setState({
            [name]: e.target.value
        });

        if(e.target.id === "city") {
            this.isCityOther = e.target.value === "other" ? true : false;
            this.isCityOther ? this.requiredFields.push("city_other") : this.requiredFields = this.requiredFields.filter(e => e !== "city_other");
        }
        
        if(e.target.id === "training_venue") {
            this.isVenueOther = e.target.value === "other" ? true : false;
            this.isVenueOther ? this.requiredFields.push("training_venue_other") : this.requiredFields = this.requiredFields.filter(e => e !== "training_venue_other");
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

        if (name === "topic_covered") {
            // checking twice because when another value is selected and other is unchecked, it still does not change the state
            if (getObject('other', e, 'value') != -1) {
                this.isTopicOther =  true ;
            }
            if (getObject('other', e, 'value') == -1) {
                this.isTopicOther =  false ;
            }
                       
        }

        if (name === "event_attendant") {

            if (getObject('journalists', e, 'value') != -1) {
                this.isParticipantJournalist = true;
                
            }
            if (getObject('journalists', e, 'value') == -1) {
                this.isParticipantJournalist = false;
            }

            if (getObject('bloggers', e, 'value') != -1) {
                this.isParticipantBlogger = true;
                
            }
            if (getObject('bloggers', e, 'value') == -1) {
                this.isParticipantBlogger = false;
            }

            if (getObject('screenwriters', e, 'value') != -1) {
                this.isParticipantScreenwriter = true;
                
            }
            if (getObject('screenwriters', e, 'value') == -1) {
                this.isParticipantScreenwriter = false;
            }

            if (getObject('other_media_personnel', e, 'value') != -1) {
                this.isParticipantMedia = true;
                
            }
            if (getObject('other_media_personnel', e, 'value') == -1) {
                this.isParticipantMedia = false;
            }
            if (getObject('other', e, 'value') != -1) {
                this.isParticipantOther = true;
                
            }
            if (getObject('other', e, 'value') == -1) {
                this.isParticipantOther = false;
            }
        }

        this.isTopicOther ? this.requiredFields.push("topic_covered_other") : this.requiredFields = this.requiredFields.filter(e => e !== "topic_covered_other");
        this.isParticipantOther ? this.requiredFields.push("event_attendant_other") : this.requiredFields = this.requiredFields.filter(e => e !== "event_attendant_other");
        this.isParticipantOther ? this.requiredFields.push("other_attendant_count") : this.requiredFields = this.requiredFields.filter(e => e !== "other_attendant_count");
        this.isParticipantJournalist ? this.requiredFields.push("journalist_count") : this.requiredFields = this.requiredFields.filter(e => e !== "journalist_count");
        this.isParticipantBlogger ? this.requiredFields.push("blogger_count") : this.requiredFields = this.requiredFields.filter(e => e !== "blogger_count");
        this.isParticipantScreenwriter ? this.requiredFields.push("screenwriter_count") : this.requiredFields = this.requiredFields.filter(e => e !== "screenwriter_count");
        this.isParticipantMedia ? this.requiredFields.push("other_media_count") : this.requiredFields = this.requiredFields.filter(e => e !== "other_media_count");
    }

    callModal = () => {
        this.setState({ modal : !this.state.modal });
    }

    // for autocomplete single select
    handleChange(e, name) {

        this.setState({
            [name]: e
        });

        console.log(this.state.selectedOption)
        console.log("=============")
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
            
            const data = new FormData(event.target);
            var jsonData = new Object();
            jsonData.formDate =  this.state.date_start;
            jsonData.formType = {};
            jsonData.formType.formTypeId = this.formTypeId;
            jsonData.referenceId = "";
            
            jsonData.data = {};
            jsonData.data.trainer = [];
            jsonData.data.topic_covered = {};
            jsonData.data.topic_covered.values = [];
            jsonData.data.event_attendant = {};
            jsonData.data.event_attendant.values = [];
            
            
            // adding required properties in data property
            jsonData.data.date_start = this.state.date_start;
            jsonData.data.city = data.get('city');
            if(this.isCityOther)
                jsonData.data.city_other = data.get('city_other');
            
            // trainer
            if((this.state.trainer != null && this.state.trainer != undefined)) {
                for(let i=0; i< this.state.trainer.length; i++) {
                    jsonData.data.trainer.push({ 
                        "userId" : this.state.trainer[i].id
                    });
                }
            }

            jsonData.data.training_venue = await getDefinitionId("training_venue", this.state.training_venue);
            if(this.isVenueOther)
                jsonData.data.training_venue_other = data.get('training_venue_other');

            // training_days
            jsonData.data.training_days = parseInt(data.get('training_days'));

            // generating multiselect for topic covered
            if((this.state.topic_covered != null && this.state.topic_covered != undefined)) {
                for(let i=0; i< this.state.topic_covered.length; i++) {
                    jsonData.data.topic_covered.values.push(String(this.state.topic_covered[i].value));
                }
            }
            
            if(this.isOtherTopic)
                jsonData.data.topic_covered_other = data.get('topic_covered_other');

            // generating multiselect for topic covered
            if((this.state.event_attendant != null && this.state.event_attendant != undefined)) {
                for(let i=0; i< this.state.event_attendant.length; i++) {
                    jsonData.data.event_attendant.values.push(String(this.state.event_attendant[i].value));
                }
            }
            

            if(this.isParticipantJournalist) 
                jsonData.data.journalist_count = parseInt(data.get('journalist_count'));

            if(this.isParticipantBlogger) 
                jsonData.data.blogger_count = parseInt(data.get('blogger_count'));

            if(this.isParticipantScreenwriter) 
                jsonData.data.screenwriter_count = parseInt(data.get('screenwriter_count'));

            if(this.isParticipantMedia) 
                jsonData.data.other_media_count = parseInt(data.get('other_media_count'));
            
            if(this.isParticipantOther) {
                jsonData.data.other_attendant_count = parseInt(data.get('other_attendant_count'));
                jsonData.data.event_attendant_other = data.get('event_attendant_other');
            }

            
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

        // skip logics
        const cityOtherStyle = this.isCityOther ? {} : { display: 'none' };
        const venueOtherStyle = this.isVenueOther ? {} : { display: 'none' };
        const topicOtherStyle = this.isTopicOther ? {} : { display: 'none' };
        const journalistStyle = this.isParticipantJournalist ? {} : { display: 'none' };
        const bloggerStyle = this.isParticipantBlogger ? {} : { display: 'none' };
        const screenwriterStyle = this.isParticipantScreenwriter ? {} : { display: 'none' };
        const mediaStyle = this.isParticipantMedia ? {} : { display: 'none' };
        const participantOtherStyle = this.isParticipantOther ? {} : { display: 'none' };

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
                            <Form id="commsTraining" onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>Training Details Form - Communications</b>
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


                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                            <Label for="city" >City</Label> <span class="errorMessage">{this.state.errors["city"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "city")} value={this.state.city} name="city" id="city">
                                                                                <option value="karachi">Karachi</option>
                                                                                <option value="islamabad">Islamabad</option>
                                                                                <option value="lahore">Lahore</option>
                                                                                <option value="quetta">Quetta</option>
                                                                                <option value="peshawar">Peshawar</option>
                                                                                <option value="hyderabad">Hyderabad</option>
                                                                                <option value="sba">SBA</option>
                                                                                <option value="other">Other</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                        
                                                                </Col>

                                                                <Col md="6" style={cityOtherStyle}>
                                                                    <FormGroup >
                                                                        <Label for="city_other" >Specify Other City</Label> <span class="errorMessage">{this.state.errors["v"]}</span>
                                                                        <Input name="city_other" id="city_other" value={this.state.city_other} onChange={(e) => {this.inputChange(e, "city_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="trainer" >Aahung Trainer(s)</Label> <span class="errorMessage">{this.state.errors["trainer"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "trainer")} value={this.state.trainer} id="trainer" options={this.state.trainers} />
                                                                        
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                            <Label for="training_venue" >Training Venue</Label> <span class="errorMessage">{this.state.errors["training_venue"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "training_venue")} value={this.state.training_venue} name="training_venue" id="training_venue">
                                                                                <option value="aahung_office">Aahung Office</option>
                                                                                <option value="other">Other</option>
                                                                            </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={venueOtherStyle} >
                                                                    <FormGroup >
                                                                        <Label for="training_venue_other" >Specify Other Venue</Label> <span class="errorMessage">{this.state.errors["training_venue_other"]}</span>
                                                                        <Input name="training_venue_other" id="training_venue_other" value={this.state.training_venue_other} onChange={(e) => {this.inputChange(e, "training_venue_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>
                                                               
                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="training_days" >Number of Days</Label> <span class="errorMessage">{this.state.errors["training_days"]}</span>
                                                                        <Input type="number" value={this.state.training_days} name="training_days" id="training_days" onChange={(e) => { this.inputChange(e, "training_days") }} max="15" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="topic_covered" >Topics Covered</Label> <span class="errorMessage">{this.state.errors["topic_covered"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "topic_covered")} value={this.state.topic_covered} id="topic_covered" options={coveredTopics} />  
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={topicOtherStyle}>
                                                                    <FormGroup >
                                                                        <Label for="topic_covered_other" >Specify Other Topic</Label> <span class="errorMessage">{this.state.errors["topic_covered_other"]}</span>
                                                                        <Input name="topic_covered_other" id="topic_covered_other" value={this.state.topic_covered_other} onChange={(e) => {this.inputChange(e, "topic_covered_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="event_attendant" >Type of Participants</Label> <span class="errorMessage">{this.state.errors["event_attendant"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "event_attendant")} value={this.state.event_attendant} id="event_attendant" options={participantTypes} />  
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={participantOtherStyle}>
                                                                    <FormGroup >
                                                                        <Label for="event_attendant_other" >Specify Other Type of Participants</Label> <span class="errorMessage">{this.state.errors["event_attendant_other"]}</span>
                                                                        <Input name="event_attendant_other" id="event_attendant_other" value={this.state.event_attendant_other} onChange={(e) => {this.inputChange(e, "event_attendant_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>
                                                           
                                                                <Col md="6" style={journalistStyle}>
                                                                    <FormGroup >
                                                                        <Label for="journalist_count" >Number of Journalists</Label> <span class="errorMessage">{this.state.errors["journalist_count"]}</span>
                                                                        <Input type="number" value={this.state.journalist_count} name="journalist_count" id="journalist_count" onChange={(e) => { this.inputChange(e, "journalist_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={bloggerStyle}>
                                                                    <FormGroup >
                                                                        <Label for="blogger_count" >Number of Bloggers</Label> <span class="errorMessage">{this.state.errors["blogger_count"]}</span>
                                                                        <Input type="number" value={this.state.blogger_count} name="blogger_count" id="blogger_count" onChange={(e) => { this.inputChange(e, "blogger_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                          
                                                            <Col md="6" style={screenwriterStyle}>
                                                                    <FormGroup >
                                                                        <Label for="screenwriter_count" >Number of Screenwriters</Label> <span class="errorMessage">{this.state.errors["screenwriter_count"]}</span>
                                                                        <Input type="number" value={this.state.screenwriter_count} name="screenwriter_count" id="screenwriter_count" onChange={(e) => { this.inputChange(e, "screenwriter_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={mediaStyle}>
                                                                    <FormGroup >
                                                                        <Label for="other_media_count" >Number of Other Media personnel</Label> <span class="errorMessage">{this.state.errors["other_media_count"]}</span>
                                                                        <Input type="number" value={this.state.other_media_count} name="other_media_count" id="other_media_count" onChange={(e) => { this.inputChange(e, "other_media_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6" style={participantOtherStyle}>
                                                                    <FormGroup >
                                                                        <Label for="other_attendant_count" >Number of Other Participants</Label> <span class="errorMessage">{this.state.errors["other_attendant_count"]}</span>
                                                                        <Input type="number" value={this.state.other_attendant_count} name="other_attendant_count" id="other_attendant_count" onChange={(e) => { this.inputChange(e, "other_attendant_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            
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

export default CommsTrainingDetails;