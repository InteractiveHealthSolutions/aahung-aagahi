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

import { MDBIcon } from 'mdbreact';
import moment from 'moment';
import React, { Fragment } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Select from 'react-select';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, TabContent, TabPane } from 'reactstrap';
import CustomModal from "../alerts/CustomModal";
import "../index.css";
import { getFormTypeByUuid, getLocationsByCategory, getParticipantsByLocation, getRoleByName, getUsersByRole } from "../service/GetService";
import { saveFormData } from "../service/PostService";
import { getObject } from "../util/AahungUtil.js";
import * as Constants from "../util/Constants";
import { getDistrictsByProvince } from "../util/LocationUtil.js";
import FormNavBar from "../widget/FormNavBar";
import LoadingIndicator from "../widget/LoadingIndicator";

const eventAttendantOptions = [
    { label: 'Teachers', value: 'teachers' },
    { label: 'Students', value: 'students' }
];

const topicCoveredOptions = [
    { value: 'gender_equality', label: 'Gender Equality' },
    { value: 'violence', label: 'Violence' },
    { value: 'client_centred_care', label: 'Client Centred Care' },
    { value: 'vcat_on_fp', label: 'VCAT on FP' },
    { value: 'vcat_of_pac', label: 'VCAT of PAC' },
    { value: 'prevention_pregnancy', label: 'Prevention of unwanted pregnancy' },
    { value: 'rti', label: 'RTIs' },
    { value: 'implementation_feedback', label: 'Provision of AYSRH services' },
    { value: 'provision_aysrh_services', label: 'Provision of AYSRH services' },
    { value: 'other', label: 'Other' },

];

const formatOptionLabel = ({ value, label, locationName }) => (
    <div style={{ display: "flex" }}>
        <div>{label} |</div>
        <div style={{ marginLeft: "10px", color: "#0d47a1" }}>
            {locationName}
        </div>
    </div>
);

class AmplifyChangeTrainingDetails extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.state = {
            institutions: [],
            trainers: [],
            participants: [],
            users: [],
            participantForm: [],
            training_venue: 'aahung_office',
            training_type: 'initial_training',
            school_level: 'school_level_primary',
            program_type: 'csa',
            date_start: '',
            participant_id: '',
            dob: '',
            sex: '',
            trained_school: [],
            csa_prompts: '',
            subject_taught: [], // all the form elements states are in underscore notation i.e variable names in codebook
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
        this.inputChange = this.inputChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createUI = this.createUI.bind(this);

        this.myRef = React.createRef();
        this.isTeacher = false;
        this.isStudent = false;
        this.isTopicOther = false;
        this.formTypeId = 0;
        this.requiredFields = ["date_start", "institution_id", "trainer", "event_attendant", "teacher_count", "topic_covered", "training_days", "participant_name"];
        this.errors = {};
        this.participantList = [];
        this.editMode = false;
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
            
            let formTypeObj = await getFormTypeByUuid(Constants.AMPLIFY_CHANGE_TRAINING_DETAIL_FORM_UUID);
            this.formTypeId = formTypeObj.formTypeId;
            this.formTypeId = formTypeObj.formTypeId;

            let role = await getRoleByName(Constants.LSE_TRAINER_ROLE_NAME);
            console.log("Role ID:" + role.roleId);
            console.log(role.roleName);
            let trainersArray = await getUsersByRole(role.uuid, false);
            if (trainersArray != null && trainersArray.length > 0) {
                this.setState({
                    trainers: trainersArray
                })
            }

            let institutions = await getLocationsByCategory(Constants.INSTITUTION_DEFINITION_UUID);
            if (institutions != null && institutions.length > 0) {
                this.setState({
                    institutions: institutions
                })
            }

        }
        catch (error) {
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

        this.isTeacher = false;
        this.isStudent = false;
        this.isTopicOther = false;
    }

    beforeunload(e) {
        e.preventDefault();
        e.returnValue = true;
    }


    cancelCheck = () => {

        this.resetForm(this.requiredFields);
        this.setState({ participants: [] });
    }

    // for text and numeric questions
    inputChange(e, name) {
        this.setState({
            [name]: e.target.value
        });

        if (name === "date_start") {
            this.setState({ date_start: e.target.value });
        }


    }

    // for single select
    valueChange = (e, name) => {

        this.setState({
            [name]: e.target.value
        });


    }

    // for multi select and for React-Select isMulti
    async valueChangeMulti(e, name) {

        this.setState({
            [name]: e
        });

        if (name === "topic_covered") {
            // checking twice because when another value is selected and other is unchecked, it still does not change the state
            if (getObject('other', e, 'value') != -1) {
                this.isTopicOther = true;
            }
            if (getObject('other', e, 'value') == -1) {
                this.isTopicOther = false;
            }

        }

        if (name === "event_attendant") {

            // checking twice because when another value is selected and other is unchecked, it still does not change the state
            if (getObject('teachers', e, 'value') != -1) {
                this.isTeacher = true;
            }
            if (getObject('teachers', e, 'value') == -1) {
                this.isTeacher = false;
            }

            // checking twice because when another value is selected and other is unchecked, it still does not change the state
            if (getObject('students', e, 'value') != -1) {
                this.isStudent = true;
            }
            if (getObject('students', e, 'value') == -1) {
                this.isStudent = false;
            }

            this.isTeacher ? this.requiredFields.push("teacher_count") : this.requiredFields = this.requiredFields.filter(e => e !== "teacher_count");
            this.isStudent ? this.requiredFields.push("student_count") : this.requiredFields = this.requiredFields.filter(e => e !== "student_count");

        }


        try {

            if (name === "participant_name") {


                // handling delete button of multiselect
                if (e != null && e.length == 0) {
                    // alert("e is null");
                    this.setState({
                        participantForm: [],
                        users: []
                    });

                    this.createUI([]);

                    return;
                }

                let difference = [];

                if (this.state.participant_name != null && e != null) {

                    difference = this.state.participant_name.filter(x => !e.includes(x));
                    console.log('Printing differnece ==============');
                }

                if (difference.length > 0) {
                    // alert("difference greater than 0");
                    // alert(difference[0].label);
                    for (var i = this.state.users.length - 1; i >= 0; --i) {
                        if (this.state.users[i].label == difference[0].label) {
                            // alert("parcipant name matched");
                            this.state.users.splice(i, 1);
                        }
                    }
                }
                console.log('Removed: ', difference);

                if (e != null) {
                    if (e.length > 0) {
                        // alert("e is not null");
                        this.createUI(e);
                        // alert(this.state.users.length);

                    }
                }
                else if (e == null) {
                    // alert("e is null");
                    this.setState({
                        participantForm: [],
                        users: []
                    });

                    this.createUI(e);
                }
            }


        }
        catch (error) {
            console.log(error);
        }

        this.isTopicOther ? this.requiredFields.push("topic_covered_other") : this.requiredFields = this.requiredFields.filter(e => e !== "topic_covered_other");
    }

    callModal = () => {
        this.setState({ modal: !this.state.modal });
    }

    // for autocomplete single select
    async handleChange(e, name) {

        this.setState({
            [name]: e
        });

        if (name === "province") {
            let districts = getDistrictsByProvince(e.id); // sending province integer id
            console.log(districts);
            this.setState({
                districtArray: districts
            })
        }

        if (name === "institution_id") {



            this.setState({
                institution_name: e.locationName
            })

            if (e != null) {

                var institutionUuid = e.uuid;
                let self = this;
                let participants = await getParticipantsByLocation(institutionUuid, false);

                if (participants.length > 0) {
                    participants.forEach(function (obj) {
                        self.participantList.push({ "id": obj.id, "value": obj.uuid, "uuid": obj.uuid, "fullName": obj.fullName, "label": obj.fullName, "personId": obj.personId, "gender": obj.gender, "identifier": obj.identifier, "locationName": obj.locationName, "locationId": obj.locationId });

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

    createUI(e) {
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

        if (e != null) {
            for (let i = 0; i < e.length; i++) {

                this.setState(prevState => ({
                    users: [...prevState.users, { name: e[i].label, location: e[i].location }]
                }))

                array.push(
                    <div><div key={i} class="monitoringScoreBox">
                        <Container >
                            <Row>
                                <Col md="6">
                                    <Label><h6><b>{e[i].label} </b></h6></Label><Label style={{ color: "#9e9e9e" }}><h7><b> ({e[i].locationName})</b></h7></Label>
                                    <span class="errorMessage" id={`participant_scores_error_${i}`}>{this.state.errors[`participant_scores_error_${i}`]}</span>


                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <Label >Pre-Test Score</Label>
                                    <Input placeholder="Enter Pre-Test Score" type="number" ref={el => this[`pre_pre_score_${i}`] = el} id={`pre_pre_score_${i}`} name="pre_test_score" onChange={this.handleParticipant.bind(this, i)} onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} max="999" min="1" />
                                </Col>
                                <Col md="6">
                                    <Label >Pre-Test Score %</Label>
                                    <Input placeholder="Enter Score %" ref={this[`pre_score_${i}`]} id={`pre_score_${i}`} name="pre_score_percentage" onChange={this.handleParticipant.bind(this, i)} maxLength="5" />
                                </Col>
                            </Row>

                            <Row>
                                <Col md="6">
                                    <Label >Post-Test Score</Label>
                                    <Input placeholder="Enter Post-Test Score" type="number" ref={this[`post_post_score_${i}`]} id={`post_post_score_${i}`} name="post_test_score" onChange={this.handleParticipant.bind(this, i)} onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} max="999" min="1" />
                                </Col>
                                <Col md="6">
                                    <Label >Post-Test Score %</Label>
                                    <Input placeholder="Enter Score %" ref={this[`post_score_${i}`]} id={`post_score_${i}`} name="post_score_percentage" onChange={this.handleParticipant.bind(this, i)} maxLength="5" />
                                </Col>
                            </Row>


                            <br />
                        </Container>


                    </div>
                        <div style={{ height: '20px' }}><span>   </span></div>
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
        users[i] = { ...users[i], [name]: value };
        this.setState({ users });
        console.log(this.state.users)
    }


    handleSubmit = async event => {
        event.preventDefault();
        if (this.handleValidation()) {

            this.setState({
                loading: true,
                loadingMsg: "Saving trees..."
            })

            const data = new FormData(event.target);
            var jsonData = new Object();
            jsonData.formDate = this.state.date_start;
            jsonData.formType = {};
            jsonData.formType.formTypeId = this.formTypeId;
            jsonData.referenceId = "";

            jsonData.data = {};
            jsonData.formParticipants = [];
            jsonData.location = {};
            jsonData.location.locationId = this.state.institution_id.id;
            jsonData.data.trainer = [];
            jsonData.data.participant_scores = [];
            jsonData.data.trainer = [];
            jsonData.data.event_attendant = {};
            jsonData.data.event_attendant.values = [];
            jsonData.data.topic_covered = {};
            jsonData.data.topic_covered.values = [];

            // adding required properties in data property
            jsonData.data.date_start = this.state.date_start;
            jsonData.data.institution_id = this.state.institution_id.id;
            jsonData.data.training_days = this.state.training_days;

            if ((jsonData.data.trainer != null && jsonData.data.trainer != undefined)) {
                for (let i = 0; i < this.state.trainer.length; i++) {
                    jsonData.data.trainer.push({
                        "userId": this.state.trainer[i].id
                    });
                }
            }

            if ((this.state.event_attendant != null && this.state.event_attendant != undefined)) {
                for (let i = 0; i < this.state.event_attendant.length; i++) {
                    jsonData.data.event_attendant.values.push(String(this.state.event_attendant[i].value));
                }
            }

            if (this.isTeacher) {
                jsonData.data.teacher_count = parseInt(data.get('teacher_count'));
            }
            if (this.isStudent) {
                jsonData.data.student_count = parseInt(data.get('student_count'));
            }


            // generating multiselect for topic_covered
            if ((this.state.topic_covered != null && this.state.topic_covered != undefined)) {
                for (let i = 0; i < this.state.topic_covered.length; i++) {
                    jsonData.data.topic_covered.values.push(String(this.state.topic_covered[i].value));
                }
            }
            if (this.isTopicOther)
                jsonData.data.topic_covered_other = this.state.topic_covered_other;

            for (let j = 0; j < this.state.participant_name.length; j++) {

                var preScore = document.getElementById('pre_pre_score_' + j);
                var preScorePct = document.getElementById('pre_score_' + j);
                var postScore = document.getElementById('post_post_score_' + j);
                var postScorePct = document.getElementById('post_score_' + j);

                jsonData.data.participant_scores.push({
                    "participant_id": this.state.participant_name[j].identifier,
                    "location_id": this.state.participant_name[j].locationId,
                    "pre_test_score": preScore != null && preScore.value != '' ? parseInt(preScore.value) : 0,
                    "pre_test_score_pct": preScorePct != null && preScorePct != '' ? parseFloat(preScorePct.value) : 0.0,
                    "post_test_score": postScore != null && postScore.value != '' ? parseInt(postScore.value) : 0,
                    "post_test_score_pct": postScorePct != null && postScorePct.value != '' ? parseFloat(postScorePct.value) : 0.0
                })

                jsonData.formParticipants.push({
                    "participantId": this.state.participant_name[j].id
                });
            }


            console.log(jsonData.data);
            console.log(jsonData);
            // JSON.parse(JSON.stringify(dataObject));

            saveFormData(jsonData)
                .then(
                    responseData => {
                        console.log(responseData);
                        if (!(String(responseData).includes("Error"))) {

                            this.setState({
                                loading: false,
                                modalHeading: 'Success!',
                                okButtonStyle: { display: 'none' },
                                modalText: 'Data saved successfully.',
                                modal: !this.state.modal
                            });

                            this.resetForm(this.requiredFields);

                            this.setState({
                                participantForm: [],
                                users: []
                            });

                            this.createUI([]);

                            // document.getElementById("projectForm").reset();
                            // this.messageForm.reset();
                        }
                        else if (String(responseData).includes("Error")) {

                            var submitMsg = '';
                            submitMsg = "Unable to submit Form. \
                        " + String(responseData);

                            this.setState({
                                loading: false,
                                modalHeading: 'Fail!',
                                okButtonStyle: { display: 'none' },
                                modalText: submitMsg,
                                modal: !this.state.modal
                            });
                        }
                    }
                );

        }
    }

    handleValidation() {
        // check each required state

        let formIsValid = true;
        console.log(this.requiredFields);
        this.setState({ hasError: true });
        this.setState({ hasError: this.checkValid(this.requiredFields) ? false : true });
        formIsValid = this.checkValid(this.requiredFields);
        this.setState({ errors: this.errors });
        return formIsValid;
    }

    /**
     * verifies and notifies for the empty form fields
     */
    checkValid = (fields) => {

        let isOk = true;
        this.errors = {};
        const errorText = "Required";
        for (let j = 0; j < fields.length; j++) {

            let stateName = fields[j];
            // for array object
            if (typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                isOk = false;
                this.errors[fields[j]] = errorText;

            }

            // for text and others
            if (typeof this.state[stateName] != 'object') {
                if (this.state[stateName] === "" || this.state[stateName] == undefined) {
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

        for (let j = 0; j < fields.length; j++) {
            let stateName = fields[j];

            // for array object
            if (typeof this.state[stateName] === 'object') {
                this.state[stateName] = [];
            }

            // for text and others
            if (typeof this.state[stateName] != 'object') {
                this.state[stateName] = '';
            }
        }

        this.setState({
            institution_name: '',
            participant_id: ''
        });

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
        const setDisable = this.state.viewMode ? "disabled" : "";
        const teacherStyle = this.isTeacher ? {} : { display: 'none' };
        const studentStyle = this.isStudent ? {} : { display: 'none' };
        const otherTopicStyle = this.isTopicOther ? {} : { display: 'none' };
        var formNavVisible = false;
        if (this.props.location.state !== undefined) {
            formNavVisible = this.props.location.state.edit ? true : false;
        }
        else {
            formNavVisible = false;
        }

        const { selectedOption } = this.state;

        return (
            <div id="formDiv">
                <Router>
                    <header>
                        <FormNavBar isVisible={formNavVisible} {...this.props} componentName="SRHM" />
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
                                                    <b>Amplify Change Training Details Form</b>
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

                                                    <fieldset >
                                                        <TabContent activeTab={this.state.activeTab}>
                                                            <TabPane tabId="1">
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup inline>
                                                                            <Label for="date_start" >Form Date <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                            <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => { this.inputChange(e, "date_start") }} max={moment().format("YYYY-MM-DD")} />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>


                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="institution_id" >Institution ID <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["institution_id"]}</span>
                                                                            <Select id="institution_id" name="institution_id" onChange={(e) => this.handleChange(e, "institution_id")} value={this.state.institution_id} id="institution_id" options={this.state.institutions} />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup>
                                                                            <Label for="institution_name" >Institution Name</Label>  <span class="errorMessage">{this.state.errors["institution_name"]}</span>
                                                                            <Input name="institution_name" id="institution_name" value={this.state.institution_name} onChange={(e) => { this.inputChange(e, "institution_name") }} maxLength='50' pattern="^[A-Za-z ]+" placeholder="Enter name" disabled />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="trainer" >Name(s) of Trainer(s) <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["trainer"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "trainer")} value={this.state.trainer} id="trainer" options={this.state.trainers} isMulti />
                                                                        </FormGroup>
                                                                    </Col>


                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="event_attendant" >Type of Participants <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["event_attendant"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "event_attendant")} value={this.state.event_attendant} id="event_attendant" options={eventAttendantOptions} isMulti />

                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={teacherStyle}>
                                                                        <FormGroup >
                                                                            <Label for="teacher_count" >Number of Teachers</Label> <span class="errorMessage">{this.state.errors["teacher_count"]}</span>
                                                                            <Input type="number" value={this.state.teacher_count} name="teacher_count" id="teacher_count" onChange={(e) => { this.inputChange(e, "teacher_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number" ></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={studentStyle} >
                                                                        <FormGroup >
                                                                            <Label for="student_count" >Number of Students</Label> <span class="errorMessage">{this.state.errors["student_count"]}</span>
                                                                            <Input type="number" value={this.state.student_count} name="student_count" id="student_count" onChange={(e) => { this.inputChange(e, "student_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" >
                                                                        <FormGroup >
                                                                            <Label for="topic_covered" >Topics covered in previous sessions <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["topic_covered"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "topic_covered")} value={this.state.topic_covered} id="topic_covered" options={topicCoveredOptions} isMulti />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={otherTopicStyle}>
                                                                        <FormGroup >
                                                                            <Label for="topic_covered_other" >Specify Other</Label> <span class="errorMessage">{this.state.errors["topic_covered_other"]}</span>
                                                                            <Input name="topic_covered_other" id="topic_covered_other" onChange={(e) => { this.inputChange(e, "topic_covered_other") }} value={this.state.topic_covered_other} placeholder="Enter text" />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="training_days" >Number of Days <span className="required">*</span></Label>  <span class="errorMessage">{this.state.errors["training_days"]}</span>
                                                                            <Input type="number" value={this.state.training_days} name="training_days" id="training_days" onChange={(e) => { this.inputChange(e, "training_days") }} max="99" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2) }} placeholder="Enter days count"></Input>
                                                                        </FormGroup>
                                                                    </Col>


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

                                                                {/* please don't remove this div unless you are adding multiple questions here*/}
                                                                <div style={{ height: '250px' }}><span>   </span></div>
                                                            </TabPane>
                                                        </TabContent>
                                                    </fieldset>

                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md="12">
                                            <Card className="main-card mb-6">
                                                <CardHeader>
                                                    <Row>
                                                        <Col md="6">
                                                            <FormGroup className="warningBox">
                                                                <Label for="facilitation_score" style={{ color: "#f57c00"}}><b>WARNING! This form is not editable. Please re-check data before submission.</b></Label>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="1">
                                                        </Col>
                                                        <Col md="2">
                                                            <LoadingIndicator loading={this.state.loading} />
                                                        </Col>
                                                        <Col md="3">
                                                            <Button className="mb-2 mr-2" color="success" size="sm" type="submit" disabled={this.editMode}>Submit<MDBIcon icon="smile" className="ml-2" size="lg" /></Button>
                                                            <Button className="mb-2 mr-2" color="danger" size="sm" onClick={this.cancelCheck} disabled={this.editMode}>Clear<MDBIcon icon="window-close" className="ml-2" size="lg" /></Button>
                                                        </Col>
                                                    </Row>
                                                </CardHeader>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <CustomModal modal = {this.state.modal} modalHeading= {this.state.modalHeading} modalText= {this.state.modalText} toggle = {this.toggle} />
                                </Form>
                            </Container>
                        </div>
                    </ReactCSSTransitionGroup>
                </Fragment>
            </div>
        );
    }
}

export default AmplifyChangeTrainingDetails;