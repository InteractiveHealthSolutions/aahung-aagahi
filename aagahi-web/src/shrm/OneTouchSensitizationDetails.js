/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-28 15:41:38
 * @modify date 2019-08-28 15:41:38
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
import { getAllDonors, getFormDataById, getFormTypeByUuid, getRoleByName, getUsersByRole } from "../service/GetService";
import { saveFormData, updateFormData } from "../service/PostService";
import { getObject, loadFormState, resetFormState } from "../util/AahungUtil.js";
import * as Constants from "../util/Constants";
import { getDistrictsByProvince, location } from "../util/LocationUtil.js";
import FormNavBar from "../widget/FormNavBar";
import LoadingIndicator from "../widget/LoadingIndicator";

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
    { value: 'sexuality', label: 'Sexuality' },
    { value: 'other', label: 'Other' }
];

const participantSex = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
];

const participantTypes = [
    { value: 'preservice_providers', label: 'Pre-service providers' },
    { value: 'inservice_providers', label: 'In-service providers' },
    { value: 'lhs', label: 'LHS' },
    { value: 'youth', label: 'Youth' },
    { value: 'project_staff', label: 'Project Staff' },
    { value: 'students', label: 'Students' },
    { value: 'teachers', label: 'Teachers' },
    { value: 'institution_management', label: 'Institution Management' },
    { value: 'other_professionals', label: 'Other Professionals' },
    { value: 'other', label: 'Other' }
];

const participantAge = [
    { value: 'age_6_to_10', label: '6-10' },
    { value: 'age_11_to_15', label: '11-15' },
    { value: 'age_16_to_20', label: '16-20' },
    { value: 'age_21_to_25', label: '21-25' },
    { value: 'age_26_to_30', label: '26-30' },
    { value: 'age_31_to_35', label: '31-35' },
    { value: 'age_36_to_40', label: '36-40' },
    { value: 'age_41_to_45', label: '41-45' },
    { value: 'age_46_to_50', label: '46-50' },
    { value: 'geq_51', label: '51+' }
];

class OneTouchSensitizationDetails extends React.Component {

    modal = false;
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            trainers: [],
            donorList: [],
            elements: ['program_implemented', 'school_level', 'donor_name'],
            date_start: '',
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
            errors: {},
            isCsa: true,
            isGender: false,
            hasError: false,
            loading: false,
            form_disabled: false
        };

        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.calculateScore = this.calculateScore.bind(this);
        this.inputChange = this.inputChange.bind(this);

        this.isTopicOther = false;
        this.isOtherTopic = false;
        this.isOtherSex = false;
        this.isFemale = false;
        this.isMale = false;
        this.isOtherParticipantType = false;
        this.loading = false;
        this.form_disabled = false;

        this.formTypeId = 0;
        this.requiredFields = ["date_start", "province", "district", "institution_sensitization_session_conducted", "trainer", "topic_covered", "participants_sex", "event_attendant", "participants_age_group", "training_days"];
        this.errors = {};
        this.editMode = false;
        this.fetchedForm = {};
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
                loadingMsg: 'Fetching Data...'
            })
            let formTypeObj = await getFormTypeByUuid(Constants.ONE_TOUCH_SENSITIZATION_DETAILS_FORM_UUID);
            this.formTypeId = formTypeObj.formTypeId;
            let role = await getRoleByName(Constants.LSE_TRAINER_ROLE_NAME);
            let trainersArray = await getUsersByRole(role.uuid);
            if (trainersArray != null && trainersArray.length > 0) {
                this.setState({
                    trainers: trainersArray
                })
            }
            // donors
            let donors = await getAllDonors();
            if (donors != null && donors.length > 0) {
                this.setState({
                    donorList: donors
                })
            }

            if (this.editMode) {
                this.fetchedForm = await getFormDataById(String(this.props.location.state.formId));

                if (this.fetchedForm !== null) {
                    this.state = loadFormState(this.fetchedForm, this.state); // autopopulates the whole form
                    this.setState({
                        date_start: moment(this.fetchedForm.formDate).format('YYYY-MM-DD')
                    })
                    this.editUpdateDisplay();
                }
                else {
                    throw new Error("Unable to get form data. Please see error logs for more details.");
                }
            }
            this.setState({
                loading: false
            })
        }
        catch (error) {
            console.log(error);
            var errorMsg = String(error);
            this.setState({
                loading: false,
                modalHeading: 'Fail!',
                okButtonStyle: { display: 'none' },
                modalText: errorMsg,
                modal: !this.state.modal
            });
        }
    }

    beforeunload(e) {
        e.preventDefault();
        e.returnValue = true;
    }

    cancelCheck = () => {
        this.updateRequiredFieldsArray();
        this.resetForm(this.requiredFields);
    }

    editUpdateDisplay() {

        if (this.state.topic_covered !== undefined && this.state.topic_covered.length > 0) {
            var topics = this.state.topic_covered;
            if (getObject('other', topics, 'value') != -1) {
                this.isOtherTopic = true;
            }
            if (getObject('other', topics, 'value') == -1) {
                this.isOtherTopic = false
            }
        }

        if (this.state.participants_sex !== undefined && this.state.participants_sex.length > 0) {
            var participantSexOptions = this.state.participants_sex;

            if (getObject('other', participantSexOptions, 'value') != -1) {
                this.isOtherSex = true;
            }
            if (getObject('other', participantSexOptions, 'value') == -1) {
                this.isOtherSex = false;
            }

            if (getObject('female', participantSexOptions, 'value') != -1) {
                this.isFemale = true;
            }
            if (getObject('female', participantSexOptions, 'value') == -1) {
                this.isFemale = false;
            }

            if (getObject('male', participantSexOptions, 'value') != -1) {
                this.isMale = true;
            }
            if (getObject('male', participantSexOptions, 'value') == -1) {
                this.isMale = false;
            }
        }

        if (this.state.event_attendant !== undefined && this.state.event_attendant.length > 0) {
            var eventAttendantOptions = this.state.event_attendant;
            if (getObject('other', eventAttendantOptions, 'value') != -1) {
                this.isOtherParticipantType = true;
            }
            if (getObject('other', eventAttendantOptions, 'value') == -1) {
                this.isOtherParticipantType = false
            }
        }
    }

    // for text and numeric questions
    inputChange(e, name) {
        console.log(e);
        let errorText = '';
        if (e.target.pattern != "") {
            errorText = e.target.value.match(e.target.pattern) != e.target.value ? "invalid!" : '';
            console.log(errorText);
            this.errors[name] = errorText;
        }

        this.setState({
            [name]: e.target.value
        });

        this.setState({ errors: this.errors });
    }

    // for single select
    valueChange = (e, name) => {

        this.setState({
            [name]: e.target.value
        });
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
            if (getObject('other', e, 'value') != -1) {
                this.isOtherTopic = true;
            }
            if (getObject('other', e, 'value') == -1) {
                this.isOtherTopic = false
            }
        }

        if (name === "participants_sex") {
            if (getObject('other', e, 'value') != -1) {
                this.isOtherSex = true;
            }
            if (getObject('other', e, 'value') == -1) {
                this.isOtherSex = false;
            }

            if (getObject('female', e, 'value') != -1) {
                this.isFemale = true;
            }
            if (getObject('female', e, 'value') == -1) {
                this.isFemale = false;
            }

            if (getObject('male', e, 'value') != -1) {
                this.isMale = true;
            }
            if (getObject('male', e, 'value') == -1) {
                this.isMale = false;
            }
        }

        if (name === "event_attendant") {
            if (getObject('other', e, 'value') != -1) {
                this.isOtherParticipantType = true;
            }
            if (getObject('other', e, 'value') == -1) {
                this.isOtherParticipantType = false
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

        if (name === "province") {
            let districts = getDistrictsByProvince(e.id); // sending province integer id
            console.log(districts);
            this.setState({
                districtArray: districts
            })
        }
    };

    handleSubmit = event => {
        event.preventDefault();
        if (this.handleValidation()) {

            console.log("in submission");

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
            // jsonData.data.aahung_staff = [];
            jsonData.data.trainer = [];
            jsonData.data.donors = [];
            jsonData.data.topic_covered = {};
            jsonData.data.topic_covered.values = [];
            jsonData.data.participants_sex = {};
            jsonData.data.participants_sex.values = [];
            jsonData.data.event_attendant = {};
            jsonData.data.event_attendant.values = [];
            jsonData.data.participants_age_group = {};
            jsonData.data.participants_age_group.values = [];

            // adding required properties in data property
            jsonData.data.date_start = this.state.date_start;
            jsonData.data.province = data.get('province');
            jsonData.data.district = this.state.district.label;
            jsonData.data.institution_sensitization_session_conducted = data.get('institution_sensitization_session_conducted');

            if ((this.state.donors != null && this.state.donors != undefined)) {
                for (let i = 0; i < this.state.donors.length; i++) {
                    jsonData.data.donors.push({
                        "donorId": this.state.donors[i].id
                    });
                }
            }

            if ((jsonData.data.trainer != null && jsonData.data.trainer != undefined)) {
                for (let i = 0; i < this.state.trainer.length; i++) {
                    jsonData.data.trainer.push({
                        "userId": this.state.trainer[i].id
                    });
                }
            }

            // generating multiselect for topic_covered
            if ((this.state.topic_covered != null && this.state.topic_covered != undefined)) {
                for (let i = 0; i < this.state.topic_covered.length; i++) {
                    jsonData.data.topic_covered.values.push(String(this.state.topic_covered[i].value));
                }
            }

            if (this.isOtherTopic)
                jsonData.data.topic_covered_other = data.get('topic_covered_other');

            // generating multiselect for participants_sex
            if ((this.state.participants_sex != null && this.state.participants_sex != undefined)) {
                for (let i = 0; i < this.state.participants_sex.length; i++) {
                    jsonData.data.participants_sex.values.push(String(this.state.participants_sex[i].value));
                }
            }

            if (this.isFemale)
                jsonData.data.female_count = parseInt(data.get('female_count'));

            if (this.isMale)
                jsonData.data.male_count = parseInt(data.get('male_count'));

            if (this.isOtherSex)
                jsonData.data.other_sex_count = parseInt(data.get('other_sex_count'));


            // generating multiselect for participants_sex
            if ((this.state.participants_age_group != null && this.state.participants_age_group != undefined)) {
                for (let i = 0; i < this.state.participants_age_group.length; i++) {
                    jsonData.data.participants_age_group.values.push(String(this.state.participants_age_group[i].value));
                }
            }

            // generating multiselect for event_attendant
            if ((this.state.event_attendant != null && this.state.event_attendant != undefined)) {
                for (let i = 0; i < this.state.event_attendant.length; i++) {
                    jsonData.data.event_attendant.values.push(String(this.state.event_attendant[i].value));
                }
            }

            if (this.isOtherParticipantType) {
                jsonData.data.event_attendant_other = data.get('event_attendant_other');

            }

            jsonData.data.training_days = parseInt(data.get('training_days'));
            console.log(jsonData);
            // JSON.parse(JSON.stringify(dataObject));

            if (this.editMode) {
                jsonData.uuid = this.fetchedForm.uuid;
                jsonData.referenceId = this.fetchedForm.referenceId;

                updateFormData(jsonData)
                    .then(
                        responseData => {
                            if (!(String(responseData).includes("Error"))) {

                                this.setState({
                                    loading: false,
                                    modalHeading: 'Success!',
                                    okButtonStyle: { display: 'none' },
                                    modalText: 'Data updated successfully.',
                                    modal: !this.state.modal
                                });

                                this.resetForm(this.requiredFields);
                            }
                            else if (String(responseData).includes("Error")) {

                                var submitMsg = '';
                                submitMsg = "Unable to update data. Please see error logs for details. \
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
            else {
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
    }

    updateRequiredFieldsArray() {
        this.isOtherTopic ? this.requiredFields.push("topic_covered_other") : this.requiredFields = this.requiredFields.filter(e => e !== "topic_covered_other");
        this.isOtherParticipantType ? this.requiredFields.push("event_attendant_other") : this.requiredFields = this.requiredFields.filter(e => e !== "event_attendant_other");
        this.isFemale ? this.requiredFields.push("female_count") : this.requiredFields = this.requiredFields.filter(e => e !== "female_count");
        this.isMale ? this.requiredFields.push("male_count") : this.requiredFields = this.requiredFields.filter(e => e !== "male_count");
        this.isOtherSex ? this.requiredFields.push("other_sex_count") : this.requiredFields = this.requiredFields.filter(e => e !== "other_sex_count");
    }

    handleValidation() {
        // check each required state
        this.updateRequiredFieldsArray();
        let formIsValid = true;
        console.log(this.requiredFields);
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
            if (typeof this.state[stateName] === 'object' && this.state[stateName] === null) {
                isOk = false;
                this.errors[fields[j]] = errorText;
            }
            else if (typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
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
        this.state = resetFormState(fields, this.state);
        this.updateDisplay();

        // emptying the non-required fields
        this.setState({
            donors: []
        })
    }

    updateDisplay() {
        this.isTopicOther = false;
        this.isOtherTopic = false;
        this.isOtherSex = false;
        this.isFemale = false;
        this.isMale = false;
        this.isOtherParticipantType = false;
    }

    // for modal
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        const otherTopicStyle = this.isOtherTopic ? {} : { display: 'none' };
        const otherParticipantTypeStyle = this.isOtherParticipantType ? {} : { display: 'none' };
        const otherSexStyle = this.isOtherSex ? {} : { display: 'none' };
        const femaleStyle = this.isFemale ? {} : { display: 'none' };
        const maleStyle = this.isMale ? {} : { display: 'none' };
        var formNavVisible = false;
        if (this.props.location.state !== undefined) {
            formNavVisible = this.props.location.state.edit ? true : false;
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
                                <Form id="oneTouch" onSubmit={this.handleSubmit} >
                                    <Row>
                                        <Col md="6">
                                            <Card className="main-card mb-6">
                                                <CardHeader>
                                                    <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                    <b>One-Touch Sensitization Session Details</b>
                                                </CardHeader>
                                            </Card>
                                        </Col>
                                        <Col md="3">
                                        </Col>
                                        <Col md="3">
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="12">
                                            <Card className="main-card mb-6 center-col">
                                                <CardBody>

                                                    {/* error message div */}
                                                    <div class="alert alert-danger" style={this.state.hasError ? {} : { display: 'none' }} >
                                                        <span class="errorMessage"><u>Errors: <br /></u> Form has some errors. Please check for required or invalid fields.<br /></span>
                                                    </div>

                                                    <br />
                                                    <fieldset disabled={this.form_disabled}>
                                                        <TabContent activeTab={this.state.activeTab}>
                                                            <TabPane tabId="1">
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup inline>
                                                                            <Label for="date_start" >Form Date</Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                            <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => { this.inputChange(e, "date_start") }} max={moment().format("YYYY-MM-DD")} />
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
                                                                            <Label for="institution_sensitization_session_conducted" >Name of Institution/Venue</Label> <span class="errorMessage">{this.state.errors["institution_sensitization_session_conducted"]}</span>
                                                                            <Input name="institution_sensitization_session_conducted" id="institution_sensitization_session_conducted" value={this.state.institution_sensitization_session_conducted} onChange={(e) => { this.inputChange(e, "institution_sensitization_session_conducted") }} maxLength="100" placeholder="Enter name of institution" pattern="^[A-Za-z. ]+" />
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="donors" >Donor ID</Label> <span class="errorMessage">{this.state.errors["donors"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "donors")} value={this.state.donors} id="donors" options={this.state.donorList} isMulti />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" >
                                                                        <FormGroup >
                                                                            <Label for="trainer" >Name(s) of Trainer(s)</Label> <span class="errorMessage">{this.state.errors["trainer"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "trainer")} value={this.state.trainer} id="trainer" options={this.state.trainers} isMulti />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" >
                                                                        <FormGroup >
                                                                            <Label for="topic_covered" >Topics Covered</Label> <span class="errorMessage">{this.state.errors["topic_covered"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "topic_covered")} value={this.state.topic_covered} id="topic_covered" options={coveredTopics} isMulti />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={otherTopicStyle}>
                                                                        <FormGroup >
                                                                            <Label for="topic_covered_other" >Specify Other Topic</Label> <span class="errorMessage">{this.state.errors["topic_covered_other"]}</span>
                                                                            <Input name="topic_covered_other" id="topic_covered_other" value={this.state.topic_covered_other} onChange={(e) => { this.inputChange(e, "topic_covered_other") }} maxLength="200" placeholder="Enter other" />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" >
                                                                        <FormGroup >
                                                                            <Label for="training_days" >Number of Days</Label> <span class="errorMessage">{this.state.errors["training_days"]}</span>
                                                                            <Input type="number" value={this.state.training_days} name="training_days" id="training_days" onChange={(e) => { this.inputChange(e, "training_days") }} max="99" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2) }} placeholder="Enter number" ></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" >
                                                                        <FormGroup >
                                                                            <Label for="participants_sex" >Sex of Participants</Label> <span class="errorMessage">{this.state.errors["participants_sex"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "participants_sex")} value={this.state.participants_sex} id="participants_sex" options={participantSex} isMulti />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={maleStyle}>
                                                                        <FormGroup >
                                                                            <Label for="male_count" >Number of Males</Label> <span class="errorMessage">{this.state.errors["male_count"]}</span>
                                                                            <Input type="number" value={this.state.male_count} name="male_count" id="male_count" onChange={(e) => { this.inputChange(e, "male_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={femaleStyle}>
                                                                        <FormGroup >
                                                                            <Label for="female_count" >Number of Females</Label> <span class="errorMessage">{this.state.errors["female_count"]}</span>
                                                                            <Input type="number" value={this.state.female_count} name="female_count" id="female_count" onChange={(e) => { this.inputChange(e, "female_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={otherSexStyle}>
                                                                        <FormGroup >
                                                                            <Label for="other_sex_count" >Number of Other</Label> <span class="errorMessage">{this.state.errors["other_sex_count"]}</span>
                                                                            <Input type="number" value={this.state.other_sex_count} name="other_sex_count" id="other_sex_count" onChange={(e) => { this.inputChange(e, "other_sex_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" >
                                                                        <FormGroup >
                                                                            <Label for="participants_age_group" >Participant Age Group</Label> <span class="errorMessage">{this.state.errors["participants_age_group"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "participants_age_group")} value={this.state.participants_age_group} id="participants_age_group" options={participantAge} isMulti />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" >
                                                                        <FormGroup >
                                                                            <Label for="event_attendant" >Type of Participants</Label> <span class="errorMessage">{this.state.errors["event_attendant"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "event_attendant")} value={this.state.event_attendant} id="event_attendant" options={participantTypes} isMulti />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={otherParticipantTypeStyle}>
                                                                        <FormGroup >
                                                                            <Label for="event_attendant_other" >Specify Other Type of Participants</Label> <span class="errorMessage">{this.state.errors["event_attendant_other"]}</span>
                                                                            <Input name="event_attendant_other" id="event_attendant_other" value={this.state.event_attendant_other} onChange={(e) => { this.inputChange(e, "event_attendant_other") }} maxLength="200" placeholder="Enter other" />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

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
                                                        <Col md="3">
                                                        </Col>
                                                        <Col md="2">
                                                        </Col>
                                                        <Col md="2">
                                                        </Col>
                                                        <Col md="2">
                                                            <LoadingIndicator loading={this.state.loading} msg={this.state.loadingMsg} />
                                                        </Col>
                                                        <Col md="3">
                                                            <Button className="mb-2 mr-2" color="success" size="sm" type="submit">Submit<MDBIcon icon="smile" className="ml-2" size="lg" /></Button>
                                                            <Button className="mb-2 mr-2" color="danger" size="sm" onClick={this.cancelCheck} >Clear<MDBIcon icon="window-close" className="ml-2" size="lg" /></Button>
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

export default OneTouchSensitizationDetails;