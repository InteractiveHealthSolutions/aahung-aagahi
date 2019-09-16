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
import { Input, Label, Form, FormGroup, Container, Card, CardBody, TabContent, TabPane, CardTitle, Row, Col } from 'reactstrap';
import { Button, CardHeader } from 'reactstrap';
import "../index.css";
import Select from 'react-select';
import CustomModal from "../alerts/CustomModal";
import { getObject } from "../util/AahungUtil.js";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import { location, getDistrictsByProvince} from "../util/LocationUtil.js";
import moment from 'moment';

// const options = [
//     { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Sindh' },
//     { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Punjab' },
//     { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Balochistan' },
//     { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Khyber Pakhtunkhwa' },
// ];

const programsImplemented = [
    { label: 'CSA', value: 'csa' },
    { label: 'Gender', value: 'gender' },
    { label: 'LSBE', value: 'lsbe' },
];

const options = [
    { label: 'Math', value: 'math' },
    { label: 'Science', value: 'science' },
    { label: 'English', value: 'def' },
    { label: 'Urdu', value: 'urdu', },
    { label: 'Social Studies', value: 'social_studies' },
    { label: 'Islamiat', value: 'islamiat' },
    { label: 'Art', value: 'art', },
    { label: 'Music', value: 'music' },
    { label: 'Other', value: 'other', },
];

const schools = [
    { value: 'sindh', label: 'Sindh' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'balochistan', label: 'Balochistan' },
    { value: 'khyber_pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
];

const evaluators = [
    { value: 'harry123', label: 'Harry' },
    { value: 'hermione456', label: 'Hermione' },
];

const participantGenderOptions = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'other', label: 'Other' },
];


const participantAgeOptions = [
    { value: '6_to_10', label: '6-10' },
    { value: '11_to_15', label: '11-15' },
    { value: '16_to_20', label: '16-20' },
    { value: '21_to_25', label: '21-25' },
    { value: '26_to_30', label: '26-30' },
    { value: '31_to_35', label: '31-35' },
    { value: '36_to_40', label: '36-40' },
    { value: '41_to_45', label: '41-45' },
    { value: '46_to_50', label: '46-50' },
    { value: 'geq_51', label: '51+' },
];

const participantTypeOptions = [
    { value: 'students', label: 'Students' },
    { value: 'parents', label: 'Parents' },
    { value: 'teachers', label: 'Teachers' },
    { value: 'school_staff', label: 'School Staff' },
    { value: 'call_agents', label: 'Call Agents' },
    { value: 'other_professionals', label: 'Other Professionals' },
    { value: 'other', label: 'Other' },
];


const staffUsers = [
    { value: 'uuid1', label: 'Harry Potter' },
    { value: 'uuid2', label: 'Ron Weasley' },
    { value: 'uuid3', label: 'Hermione Granger' },
    { value: 'uuid4', label: 'Albus Dumbledore' },
];

class OneTouchSessionDetail extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            // TODO: fill UUIDs everywhere where required
            // options : [{value: 'math'},
            // {value: 'science'}],
            elements: ['program_implemented', 'school_level', 'donor_name'],
            date_start: '',
            participant_id: '',
            participant_name: '',
            dob: '',
            sex: '',
            school_id: [],
            csa_prompts: '',
            subject_taught: [], // all the form elements states are in underscore notation i.e variable names in codebook
            subject_taught_other: '',
            teaching_years: '',
            education_level: 'no_edu',
            donor_name: '',
            activeTab: '1',
            page2Show: true,
            viewMode: false,
            editMode: false,
            errors: {},
            isCsa: true,
            isGender: false,
            isSessionTypeOther: false,
            isParticipantTypeOther: false,
            isParticipantTypeStudent: false,
            isParticipantTypeParent: false,
            isParticipantTypeTeacher: false,
            isParticipantTypeSchool: false,
            isParticipantTypeCall: false,
            isParticipantTypeProfessional: false,
            hasError: false,
        };


        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.calculateScore = this.calculateScore.bind(this);
        this.getObject = this.getObject.bind(this);
        this.inputChange = this.inputChange.bind(this);
    }

    componentDidMount() {

        // TODO: checking view mode, view mode will become active after the form is populated
        // this.setState({
        // school_id : this.getObject('khyber_pakhtunkhwa', schools, 'value'), // autopopulate in view: for single select autocomplete
        // monitor: [{value: 'sindh'}, {value: 'punjab'}], // // autopopulate in view: for multi-select autocomplete
        // viewMode : true,    
        // })

        // alert("School Details: Component did mount called!");
        window.addEventListener('beforeunload', this.beforeunload.bind(this));



    }

    componentWillUnmount() {

        // alert("School Details: ComponentWillUnMount called!");
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

        let errors = {};

        console.log(" ============================================================= ")
        // alert(this.state.program_implemented + " ----- " + this.state.school_level + "-----" + this.state.sex);
        console.log("program_implemented below:");
        console.log(this.state.program_implemented);
        console.log("school_level below:");
        console.log(this.state.school_level);
        console.log("school_id below:");
        console.log(this.state.school_id);
        console.log(this.getObject('khyber_pakhtunkhwa', schools, 'value'));
        console.log(this.state.donor_name);
        console.log(this.state.date_start);
        this.handleValidation();

        this.setState({
            hasError: true
        })


        // receiving value directly from widget but it still requires widget to have on change methods to set it's value
        // alert(document.getElementById("date_start").value);
    }

    inputChange(e, name) {
        // appending dash to contact number after 4th digit
        if (name === "donor_name") {
            this.setState({ donor_name: e.target.value });
            let hasDash = false;
            if (e.target.value.length == 4 && !hasDash) {
                this.setState({ donor_name: '' });
            }
            if (this.state.donor_name.length == 3 && !hasDash) {
                this.setState({ donor_name: '' });
                this.setState({ donor_name: e.target.value });
                this.setState({ donor_name: `${e.target.value}-` });
                this.hasDash = true;
            }
        }

        if (name === "date_start") {
            this.setState({ date_start: e.target.value });
        }
    }


    // setting autocomplete single select tag when receiving value from server
    // value is the uuid, arr is the options array, prop either label/value, mostly value because it is uuid
    getObject(value, arr, prop) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][prop] === value) {
                return arr[i];

            }
        }
        return -1; //to handle the case where the value doesn't exist
    }

    // for single select
    valueChange = (e, name) => {
        this.setState({ sex: e.target.value });
        this.setState({ sex: e.target.value });
        this.setState({
            [name]: e.target.value
        });

        if (e.target.id === "primary_program_monitored")
            if (e.target.value === "csa") {
                this.setState({ isCsa: true });
                this.setState({ isGender: false });

            }
            else if (e.target.value === "gender") {
                this.setState({ isCsa: false });
                this.setState({ isGender: true });
            }

        if (name === "session_topic") {
            if (e.target.value === "other") {
                this.setState({ isSessionTypeOther: true });
            }
            else {
                this.setState({ isSessionTypeOther: false });
            }
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

        if (name === "event_attendant") {
            // checking twice because when another value is selected and other is unchecked, it still does not change the state
            if (getObject('other', e, 'value') != -1) {
                this.setState({ isParticipantTypeOther: true });
            }
            if (getObject('other', e, 'value') == -1) {
                this.setState({ isParticipantTypeOther: false });
            }

            if (getObject('students', e, 'value') != -1) {
                this.setState({ isParticipantTypeStudent: true });
            }
            if (getObject('students', e, 'value') == -1) {
                this.setState({ isParticipantTypeStudent: false });
            }

            if (getObject('parents', e, 'value') != -1) {
                this.setState({ isParticipantTypeParent: true }); 
            }
            if (getObject('parents', e, 'value') == -1) {
                this.setState({ isParticipantTypeParent: false });
            }
            
            if (getObject('teachers', e, 'value') != -1) {
                this.setState({ isParticipantTypeTeacher: true });
            }
            if (getObject('teachers', e, 'value') == -1) {
                this.setState({ isParticipantTypeTeacher: false });
            }

            if (getObject('school_staff', e, 'value') != -1) {
                this.setState({ isParticipantTypeSchool: true });
            }
            if (getObject('school_staff', e, 'value') == -1) {
                this.setState({ isParticipantTypeSchool: false });
            }

            if (getObject('call_agents', e, 'value') != -1) {
                this.setState({ isParticipantTypeCall: true });
            }
            if (getObject('call_agents', e, 'value') == -1) {
                this.setState({ isParticipantTypeCall: false });
            }

            if (getObject('other_professionals', e, 'value') != -1) {
                this.setState({ isParticipantTypeProfessional: true });
            }
            if (getObject('other_professionals', e, 'value') == -1) {
                this.setState({ isParticipantTypeProfessional: false });
            }
        }
    }

    callModal = () => {
        this.setState({ modal: !this.state.modal });
    }

    // for autocomplete single select
    handleChange(e, name) {

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


    // handleOnSubmit = e => {
    //     e.preventDefault();
    //     // pass form data
    //     // get it from state
    //     const formData = {};
    //     this.finallySubmit(formData);
    //   };

    finallySubmit = formData => {
    };


    handleValidation() {
        // check each required state
        let errors = {};
        let formIsValid = true;
        console.log("showing csa_prompts")
        console.log(this.state.csa_prompts);
        if (this.state.csa_prompts === '') {
            formIsValid = false;
            errors["csa_prompts"] = "Cannot be empty";
        }

        // //Name
        // if(!fields["name"]){
        //   formIsValid = false;
        //   errors["name"] = "Cannot be empty";
        // }

        this.setState({ errors: errors });
        return formIsValid;
    }

    handleSubmit(event) {
        // event.preventDefault();
        // const data = new FormData(event.target);
        // console.log(data.get('participantScore'));

        fetch('/api/form-submit-url', {
            method: 'POST',
            // body: data,
        });
    }


    render() {

        const page2style = this.state.page2Show ? {} : { display: 'none' };

        // for view mode
        const setDisable = this.state.viewMode ? "disabled" : "";

        const monitoredCsaStyle = this.state.isCsa ? {} : { display: 'none' };
        const monitoredGenderStyle = this.state.isGender ? {} : { display: 'none' };
        const sessionTypeOtherStyle = this.state.isSessionTypeOther ? {} : { display: 'none' };
        const participantTypeOtherStyle = this.state.isParticipantTypeOther ? {} : { display: 'none' };
        const participantTypeStudentStyle = this.state.isParticipantTypeStudent ? {} : { display: 'none' };
        const participantTypeParentStyle = this.state.isParticipantTypeParent ? {} : { display: 'none' };
        const participantTypeTeacherStyle = this.state.isParticipantTypeTeacher ? {} : { display: 'none' };
        const participantTypeSchoolStyle = this.state.isParticipantTypeSchool ? {} : { display: 'none' };
        const participantTypeCallStyle = this.state.isParticipantTypeCall ? {} : { display: 'none' };
        const participantTypeProfessionalStyle = this.state.isParticipantTypeProfessional ? {} : { display: 'none' };
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
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>One-Touch Session Details</b>
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
                                                    <span class="errorMessage"><u>Errors: <br /></u> Form has some errors. Please check for required or invalid fields.<br /></span>
                                                </div>

                                                <br />
                                                <Form id="testForm">
                                                    <fieldset >
                                                        <TabContent activeTab={this.state.activeTab}>
                                                            <TabPane tabId="1">
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup inline>
                                                                            {/* TODO: autopopulate current date */}
                                                                            <Label for="date_start" >Form Date</Label>
                                                                            <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => { this.inputChange(e, "date_start") }} max={moment().format("YYYY-MM-DD")} required />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup>
                                                                            <Label for="province" >Province</Label> <span class="errorMessage">{this.state.errors["province"]}</span>
                                                                            <Select id="province" name="province" value={this.state.province} onChange={(e) => this.handleChange(e, "province")} options={location.provinces} required/>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup> 
                                                                            <Label for="district" >District</Label> <span class="errorMessage">{this.state.errors["district"]}</span>
                                                                            <Select id="district" name="district" value={this.state.district} onChange={(e) => this.handleChange(e, "district")} options={this.state.districtArray} required/>
                                                                        </FormGroup>
                                                                    </Col>  

                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="institution_session_conducted" >Name of Institution</Label> <span class="errorMessage">{this.state.errors["institution_session_conducted"]}</span>
                                                                            <Input name="institution_session_conducted" id="institution_session_conducted" value={this.state.institution_session_conducted} maxLength="100" placeholder="Enter text" />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="trainer" >Name(s) of Trainer(s)</Label> <span class="errorMessage">{this.state.errors["trainer"]}</span>
                                                                            <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "trainer")} value={this.state.trainer} id="trainer" options={evaluators} />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="session_topic">Type of session</Label> <span class="errorMessage">{this.state.errors["session_topic"]}</span>
                                                                            {/* id for definition_type */}
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "session_topic")} value={this.state.session_topic} name="session_topic" id="topic_covered">
                                                                                <option value="puberty">Puberty</option>
                                                                                <option value="csa">CSA</option>
                                                                                <option value="lsbe">LSBE</option>
                                                                                <option value="other">Other</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup style={sessionTypeOtherStyle}>
                                                                            <Label for="session_topic_other" >Specify Other</Label> <span class="errorMessage">{this.state.errors["session_topic_other"]}</span>
                                                                            <Input name="session_topic_other" id="session_topic_other" value={this.state.session_topic_other} onChange={(e) => { this.inputChange(e, "session_topic_other") }} maxLength="200" placeholder="Enter text" />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="participants_sex" >Sex of Participants</Label> <span class="errorMessage">{this.state.errors["participants_sex"]}</span>
                                                                            <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "participants_sex")} value={this.state.participants_sex} id="participants_sex" options={participantGenderOptions} />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="participants_age_group" >Participant Age Group</Label> <span class="errorMessage">{this.state.errors["participants_age_group"]}</span>
                                                                            <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "participants_age_group")} value={this.state.participants_age_group} id="participants_age_group" options={participantAgeOptions} />
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="event_attendant" >Type of Participants</Label> <span class="errorMessage">{this.state.errors["event_attendant"]}</span>
                                                                            <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "event_attendant")} value={this.state.event_attendant} id="event_attendant" options={participantTypeOptions} />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={participantTypeOtherStyle}>
                                                                        <FormGroup >
                                                                            <Label for="event_attendant_other" >Specify Other</Label> <span class="errorMessage">{this.state.errors["event_attendant_other"]}</span>
                                                                            <Input name="event_attendant_other" id="event_attendant_other" value={this.state.event_attendant_other} onChange={(e) => { this.inputChange(e, "event_attendant_other") }} maxLength="200" placeholder="Enter text" />
                                                                        </FormGroup>
                                                                    </Col>
                                                                
                                                                    <Col md="6" style={participantTypeStudentStyle}>
                                                                        <FormGroup >
                                                                            <Label for="student_count" >Number of Students</Label>  <span class="errorMessage">{this.state.errors["student_count"]}</span>
                                                                            <Input type="number" value={this.state.student_count} name="student_count" id="student_count" onChange={(e) => { this.inputChange(e, "student_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={participantTypeParentStyle}>
                                                                        <FormGroup >
                                                                            <Label for="parent_count" >Number of Parents</Label>  <span class="errorMessage">{this.state.errors["parent_count"]}</span>
                                                                            <Input type="number" value={this.state.parent_count} name="parent_count" id="parent_count" onChange={(e) => { this.inputChange(e, "parent_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                
                                                                    <Col md="6" style={participantTypeTeacherStyle}>
                                                                        <FormGroup >
                                                                            <Label for="teacher_count" >Number of Teachers</Label>  <span class="errorMessage">{this.state.errors["teacher_count"]}</span>
                                                                            <Input type="number" value={this.state.teacher_count} name="teacher_count" id="teacher_count" onChange={(e) => { this.inputChange(e, "teacher_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={participantTypeSchoolStyle}>
                                                                        <FormGroup >
                                                                            <Label for="school_staff_count" >Number of School Staff</Label>  <span class="errorMessage">{this.state.errors["school_staff_count"]}</span>
                                                                            <Input type="number" value={this.state.school_staff_count} name="school_staff_count" id="school_staff_count" onChange={(e) => { this.inputChange(e, "school_staff_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                
                                                                    <Col md="6" style={participantTypeCallStyle}>
                                                                        <FormGroup >
                                                                            <Label for="call_agents_count" >Number of Call Agents</Label>  <span class="errorMessage">{this.state.errors["call_agents_count"]}</span>
                                                                            <Input type="number" value={this.state.call_agents_count} name="call_agents_count" id="call_agents_count" onChange={(e) => { this.inputChange(e, "call_agents_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={participantTypeProfessionalStyle}>
                                                                        <FormGroup >
                                                                            <Label for="other_professional_count" >Number of Other Professionals</Label>  <span class="errorMessage">{this.state.errors["other_professional_count"]}</span>
                                                                            <Input type="number" value={this.state.other_professional_count} name="other_professional_count" id="other_professional_count" onChange={(e) => { this.inputChange(e, "other_professional_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                
                                                                    <Col md="6" style={participantTypeOtherStyle}>
                                                                        <FormGroup >
                                                                            <Label for="other_attendant_count" >Number of Other </Label>  <span class="errorMessage">{this.state.errors["other_attendant_count"]}</span>
                                                                            <Input type="number" value={this.state.other_attendant_count} name="other_attendant_count" id="other_attendant_count" onChange={(e) => { this.inputChange(e, "other_attendant_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="training_days" >Number of Days</Label>  <span class="errorMessage">{this.state.errors["training_days"]}</span>
                                                                            <Input type="number" value={this.state.training_days} name="training_days" id="training_days" onChange={(e) => { this.inputChange(e, "training_days") }} max="99" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2) }} placeholder="Enter days count"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                {/* please don't remove this div unless you are adding multiple questions here*/}
                                                                <div style={{height: '250px'}}><span>   </span></div>
                                                            </TabPane>
                                                        </TabContent>
                                                    </fieldset>
                                                </Form>

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
                                                        {/* <ButtonGroup size="sm">
                                                            <Button color="secondary" id="page1"
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '1' })}
                                                                onClick={() => {
                                                                    this.toggle('1');
                                                                }}
                                                            >Form</Button>  

                                                        </ButtonGroup> */}
                                                    </Col>
                                                    <Col md="3">
                                                    </Col>
                                                    <Col md="3">
                                                    </Col>
                                                    <Col md="3">
                                                        {/* <div className="btn-actions-pane-left"> */}
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit" onClick={this.handleSubmit} disabled={setDisable}>Submit</Button>
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
                            </Container>

                        </div>
                    </ReactCSSTransitionGroup>
                </Fragment>

            </div>
        );
    }
}

export default OneTouchSessionDetail;