/*
 * @Author: tahira.niazi@ihsinformatics.com 
 * @Date: 2019-08-19 09:31:05 
 * @Last Modified by: tahira.niazi@ihsinformatics.com
 * @Last Modified time: 2020-02-13 13:01:56
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
import "react-datepicker/dist/react-datepicker.css";
import { BrowserRouter as Router } from 'react-router-dom';
import Select from 'react-select';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, TabContent, TabPane } from 'reactstrap';
import CustomModal from "../alerts/CustomModal";
import "../index.css";
import { getAllUsers, getFormDataById, getFormTypeByUuid } from "../service/GetService";
import { saveFormData, updateFormData } from "../service/PostService";
import { getObject, loadFormState, resetFormState } from "../util/AahungUtil.js";
import * as Constants from "../util/Constants";
import { getDistrictsByProvince, location } from "../util/LocationUtil.js";
import FormNavBar from "../widget/FormNavBar";
import LoadingIndicator from "../widget/LoadingIndicator";
import { UserService } from '../service/UserService';

const participantTypeOptions = [
    { value: 'government', label: 'Government' },
    { value: 'policy_makers', label: 'Policy Makers' },
    { value: 'tac', label: 'TAC' },
    { value: 'ngo', label: 'NGOs' },
    { value: 'school_partners', label: 'School Partners' },
    { value: 'other', label: 'Other' },
];

class StakeholderMeeting extends React.Component {

    modal = false;

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            session_topic: 'advocacy',
            activeTab: '1',
            page2Show: true,
            isParticipantTypeOther: false,
            isParticipantTypeGovernment: false,
            isParticipantTypePolicy: false,
            isParticipantTypeTac: false,
            isParticipantTypeNgo: false,
            isParticipantTypePartner: false,
            isTopicOther: false,
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
        this.calculateScore = this.calculateScore.bind(this);
        this.inputChange = this.inputChange.bind(this);

        this.formTypeId = 0;
        this.requiredFields = ["date_start", "province", "district", "meeting_venue", "aahung_staff", "event_attendant", "meeting_purpose", "session_topic"];
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

            let formTypeObj = await getFormTypeByUuid(Constants.STAKEHOLDER_MEETING_FORM_UUID);
            this.formTypeId = formTypeObj.formTypeId;

            let userArray = await getAllUsers();

            if (userArray != null && userArray.length > 0) {
                this.setState({
                    users: userArray
                })
            }

            if (this.editMode) {
                this.fetchedForm = await getFormDataById(String(this.props.location.state.formId));
                this.state = loadFormState(this.fetchedForm, this.state); // autopopulates the whole form
                this.setState({
                    date_start: moment(this.fetchedForm.formDate).format('YYYY-MM-DD')
                })
                this.editUpdateDisplay();
            }

            this.setState({
                loading: false
            })
        }
        catch (error) {
            console.log(error);
        }
    }

    updateDisplay() {

        this.setState({
            session_topic: 'advocacy',
            isParticipantTypeOther: false,
            isParticipantTypeGovernment: false,
            isParticipantTypePolicy: false,
            isParticipantTypeTac: false,
            isParticipantTypeNgo: false,
            isParticipantTypePartner: false,
            isTopicOther: false
        })
    }

    editUpdateDisplay() {
        if (this.state.session_topic === "other") {
            this.setState({ isTopicOther: true });
        }
        else {
            this.setState({ isTopicOther: false });
        }

        if (this.state.event_attendant != undefined && this.state.event_attendant != '') {
            var eventAttendentValues = this.state.event_attendant;
            if (getObject('other', eventAttendentValues, 'value') != -1) {
                this.setState({ isParticipantTypeOther: true });
            }
            if (getObject('other', eventAttendentValues, 'value') == -1) {
                this.setState({ isParticipantTypeOther: false });
            }

            if (getObject('government', eventAttendentValues, 'value') != -1) {
                this.setState({ isParticipantTypeGovernment: true });
            }
            if (getObject('government', eventAttendentValues, 'value') == -1) {
                this.setState({ isParticipantTypeGovernment: false });
            }

            if (getObject('policy_makers', eventAttendentValues, 'value') != -1) {
                this.setState({ isParticipantTypePolicy: true });
            }
            if (getObject('policy_makers', eventAttendentValues, 'value') == -1) {
                this.setState({ isParticipantTypePolicy: false });
            }

            if (getObject('tac', eventAttendentValues, 'value') != -1) {
                this.setState({ isParticipantTypeTac: true });
            }
            if (getObject('tac', eventAttendentValues, 'value') == -1) {
                this.setState({ isParticipantTypeTac: false });
            }

            if (getObject('ngo', eventAttendentValues, 'value') != -1) {
                this.setState({ isParticipantTypeNgo: true });
            }
            if (getObject('ngo', eventAttendentValues, 'value') == -1) {
                this.setState({ isParticipantTypeNgo: false });
            }

            if (getObject('school_partners', eventAttendentValues, 'value') != -1) {
                this.setState({ isParticipantTypePartner: true });
            }
            if (getObject('school_partners', eventAttendentValues, 'value') == -1) {
                this.setState({ isParticipantTypePartner: false });
            }
        }
    }

    beforeunload(e) {
        e.preventDefault();
        e.returnValue = true;
    }

    cancelCheck = () => {
        this.resetForm(this.requiredFields);
        // receiving value directly from widget but it still requires widget to have on change methods to set it's value
    }

    inputChange(e, name) {
        this.setState({
            [name]: e.target.value
        });

        if (name === "date_start") {
            this.setState({ date_start: e.target.value });
        }
    }

    handleDate(date, name) {
        this.setState({
            [name]: date
        });
    };

    // for single select
    valueChange = (e, name) => {
        this.setState({ sex: e.target.value });
        this.setState({ sex: e.target.value });
        this.setState({
            [name]: e.target.value
        });

        if (name === "session_topic") {
            if (e.target.value === "other") {
                this.setState({ isTopicOther: true });
            }
            else {
                this.setState({ isTopicOther: false });
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

            if (getObject('government', e, 'value') != -1) {
                this.setState({ isParticipantTypeGovernment: true });
            }
            if (getObject('government', e, 'value') == -1) {
                this.setState({ isParticipantTypeGovernment: false });
            }

            if (getObject('policy_makers', e, 'value') != -1) {
                this.setState({ isParticipantTypePolicy: true });
            }
            if (getObject('policy_makers', e, 'value') == -1) {
                this.setState({ isParticipantTypePolicy: false });
            }

            if (getObject('tac', e, 'value') != -1) {
                this.setState({ isParticipantTypeTac: true });
            }
            if (getObject('tac', e, 'value') == -1) {
                this.setState({ isParticipantTypeTac: false });
            }

            if (getObject('ngo', e, 'value') != -1) {
                this.setState({ isParticipantTypeNgo: true });
            }
            if (getObject('ngo', e, 'value') == -1) {
                this.setState({ isParticipantTypeNgo: false });
            }

            if (getObject('school_partners', e, 'value') != -1) {
                this.setState({ isParticipantTypePartner: true });
            }
            if (getObject('school_partners', e, 'value') == -1) {
                this.setState({ isParticipantTypePartner: false });
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
            jsonData.data.aahung_staff = [];
            jsonData.data.event_attendant = {};
            jsonData.data.event_attendant.values = [];

            // adding required properties in data property
            jsonData.data.date_start = this.state.date_start;
            jsonData.data.province = data.get('province');
            jsonData.data.district = this.state.district.label;
            jsonData.data.meeting_venue = data.get('meeting_venue');

            if ((this.state.aahung_staff != null && this.state.aahung_staff != undefined)) {
                for (let i = 0; i < this.state.aahung_staff.length; i++) {
                    jsonData.data.aahung_staff.push({
                        "userId": this.state.aahung_staff[i].id
                    });
                }
            }

            // generating multiselect for event_attendant
            if ((this.state.event_attendant != null && this.state.event_attendant != undefined)) {
                for (let i = 0; i < this.state.event_attendant.length; i++) {
                    jsonData.data.event_attendant.values.push(String(this.state.event_attendant[i].value));
                }
            }

            if (this.state.isParticipantTypeOther) {
                jsonData.data.event_attendant_other = data.get('event_attendant_other');
                jsonData.data.other_attendant_count = parseInt(data.get('other_attendant_count'));
            }

            if (this.state.isParticipantTypeGovernment)
                jsonData.data.government_count = parseInt(data.get('government_count'));

            if (this.state.isParticipantTypePolicy)
                jsonData.data.policy_maker_count = parseInt(data.get('policy_maker_count'));

            if (this.state.isParticipantTypeTac)
                jsonData.data.tac_count = parseInt(data.get('tac_count'));

            if (this.state.isParticipantTypeNgo)
                jsonData.data.ngo_count = parseInt(data.get('ngo_count'));

            if (this.state.isParticipantTypePartner) {
                jsonData.data.school_partner_count = parseInt(data.get('school_partner_count'));
            }

            // jsonData.data.meeting_purpose =  data.get('meeting_purpose'); // because this was not working
            jsonData.data.meeting_purpose = this.state.meeting_purpose;

            jsonData.data.session_topic = data.get('session_topic');

            if (this.state.isTopicOther)
                jsonData.data.session_topic_other = data.get('session_topic_other');

            console.log(jsonData);

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

        this.state.isParticipantTypeOther ? fields.push("other_attendant_count") : fields = fields.filter(e => e !== "other_attendant_count");
        this.state.isParticipantTypeOther ? fields.push("event_attendant_other") : fields = fields.filter(e => e !== "event_attendant_other");
        this.state.isParticipantTypeGovernment ? fields.push("government_count") : fields = fields.filter(e => e !== "government_count");
        this.state.isParticipantTypePolicy ? fields.push("policy_maker_count") : fields = fields.filter(e => e !== "policy_maker_count");
        this.state.isParticipantTypeTac ? fields.push("tac_count") : fields = fields.filter(e => e !== "tac_count");
        this.state.isParticipantTypeNgo ? fields.push("ngo_count") : fields = fields.filter(e => e !== "ngo_count");
        this.state.isParticipantTypePartner ? fields.push("school_partner_count") : fields = fields.filter(e => e !== "school_partner_count");
        this.state.isTopicOther ? fields.push("session_topic_other") : fields = fields.filter(e => e !== "session_topic_other");

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
        // const setDisable = this.editMode ? true : false;
        const setDisable = false;
        const participantTypeOtherStyle = this.state.isParticipantTypeOther ? {} : { display: 'none' };
        const participantTypeGovernmentStyle = this.state.isParticipantTypeGovernment ? {} : { display: 'none' };
        const participantTypePolicyStyle = this.state.isParticipantTypePolicy ? {} : { display: 'none' };
        const participantTypeTacStyle = this.state.isParticipantTypeTac ? {} : { display: 'none' };
        const participantTypeNgoStyle = this.state.isParticipantTypeNgo ? {} : { display: 'none' };
        const participantTypePartnerStyle = this.state.isParticipantTypePartner ? {} : { display: 'none' };
        const topicOtherStyle = this.state.isTopicOther ? {} : { display: 'none' };
        var formNavVisible = false;
        if (this.props.location.state !== undefined) {
            formNavVisible = this.props.location.state.edit ? true : false;
        }
        else {
            formNavVisible = false;
        }
        // if the user does not have edit rights
        var buttonDisabled = false; 
        if(this.editMode) {
            buttonDisabled = UserService.hasAccess('Edit FormData') ? false : true;
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
                                                    <b>Stakeholder Meetings</b>
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
                                                                        <FormGroup>
                                                                            <Label for="province" >Province <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["province"]}</span>
                                                                            <Select id="province" name="province" value={this.state.province} onChange={(e) => this.handleChange(e, "province")} options={location.provinces} />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup>
                                                                            <Label for="district" >District <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["district"]}</span>
                                                                            <Select id="district" name="district" value={this.state.district} onChange={(e) => this.handleChange(e, "district")} options={this.state.districtArray} />
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="meeting_venue" >Meeting Venue <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["meeting_venue"]}</span>
                                                                            <Input name="meeting_venue" id="meeting_venue" value={this.state.meeting_venue} onChange={(e) => { this.inputChange(e, "meeting_venue") }} maxLength="200" placeholder="Enter text" />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="aahung_staff" >Aahung Staff Members <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["aahung_staff"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "aahung_staff")} value={this.state.aahung_staff} id="aahung_staff" options={this.state.users} isMulti />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="event_attendant" >Type of Participants <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["event_attendant"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "event_attendant")} value={this.state.event_attendant} id="aahung_staff" options={participantTypeOptions} isMulti />
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
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={participantTypeGovernmentStyle}>
                                                                        <FormGroup >
                                                                            <Label for="government_count" >Number of Goverment </Label>  <span class="errorMessage">{this.state.errors["government_count"]}</span>
                                                                            <Input type="number" value={this.state.government_count} name="government_count" id="government_count" onChange={(e) => { this.inputChange(e, "government_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={participantTypePolicyStyle}>
                                                                        <FormGroup >
                                                                            <Label for="policy_maker_count" >Number of Policy Makers</Label>  <span class="errorMessage">{this.state.errors["policy_maker_count"]}</span>
                                                                            <Input type="number" value={this.state.policy_maker_count} name="policy_maker_count" id="policy_maker_count" onChange={(e) => { this.inputChange(e, "policy_maker_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={participantTypeTacStyle}>
                                                                        <FormGroup >
                                                                            <Label for="tac_count" >Number of TAC</Label>  <span class="errorMessage">{this.state.errors["tac_count"]}</span>
                                                                            <Input type="number" value={this.state.tac_count} name="tac_count" id="tac_count" onChange={(e) => { this.inputChange(e, "tac_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={participantTypeNgoStyle}>
                                                                        <FormGroup >
                                                                            <Label for="ngo_count" >Number of NGOs</Label>  <span class="errorMessage">{this.state.errors["ngo_count"]}</span>
                                                                            <Input type="number" value={this.state.ngo_count} name="ngo_count" id="ngo_count" onChange={(e) => { this.inputChange(e, "ngo_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={participantTypePartnerStyle}>
                                                                        <FormGroup >
                                                                            <Label for="school_partner_count" >Number of School Partners</Label>  <span class="errorMessage">{this.state.errors["tac_count"]}</span>
                                                                            <Input type="number" value={this.state.school_partner_count} name="school_partner_count" id="school_partner_count" onChange={(e) => { this.inputChange(e, "school_partner_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={participantTypeOtherStyle}>
                                                                        <FormGroup >
                                                                            <Label for="other_attendant_count" >Number of Other</Label>  <span class="errorMessage">{this.state.errors["other_attendant_count"]}</span>
                                                                            <Input type="number" value={this.state.other_attendant_count} name="other_attendant_count" id="other_attendant_count" onChange={(e) => { this.inputChange(e, "other_attendant_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="meeting_purpose">Purpose of Meeting <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["meeting_purpose"]}</span>
                                                                            <Input type="textarea" name="text" value={this.state.meeting_purpose} id="meeting_purpose" onChange={(e) => { this.inputChange(e, "meeting_purpose") }} maxLength="400" placeholder="Enter text" />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" >
                                                                        <FormGroup >
                                                                            <Label for="session_topic">Topics Covered</Label> <span class="errorMessage">{this.state.errors["session_topic"]}</span>
                                                                            {/* id for definition_Type */}
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "session_topic")} value={this.state.session_topic} name="session_topic" id="topic_covered">
                                                                                <option value="advocacy">Advocacy</option>
                                                                                <option value="school_partnership">School Partnership</option>
                                                                                <option value="trainings">Trainings</option>
                                                                                <option value="other">Other</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={topicOtherStyle}>
                                                                        <FormGroup >
                                                                            <Label for="session_topic_other" >Specify Other</Label> <span class="errorMessage">{this.state.errors["session_topic_other"]}</span>
                                                                            <Input name="session_topic_other" id="session_topic_other" value={this.state.session_topic_other} onChange={(e) => { this.inputChange(e, "session_topic_other") }} maxLength="200" placeholder="Enter text" />
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
                                                            <LoadingIndicator loading={this.state.loading} msg={this.state.loadingMsg} />
                                                        </Col>
                                                        <Col md="3">
                                                            <Button className="mb-2 mr-2" color="success" size="sm" type="submit" disabled={buttonDisabled}>Submit<MDBIcon icon="smile" className="ml-2" size="lg" /></Button>
                                                            <Button className="mb-2 mr-2" color="danger" size="sm" onClick={this.cancelCheck}  disabled={buttonDisabled}>Clear<MDBIcon icon="window-close" className="ml-2" size="lg" /></Button>
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

export default StakeholderMeeting;