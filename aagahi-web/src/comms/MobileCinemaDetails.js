/*
 * @Author: tahira.niazi@ihsinformatics.com 
 * @Date: 2019-08-28 15:41:38 
 * @Last Modified by: tahira.niazi@ihsinformatics.com
 * @Last Modified time: 2020-02-06 13:09:14
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
import { getFormDataById, getFormTypeByUuid } from "../service/GetService";
import { saveFormData, updateFormData } from "../service/PostService";
import { getObject, loadFormState, resetFormState } from "../util/AahungUtil.js";
import * as Constants from "../util/Constants";
import { getDistrictsByProvince, location } from "../util/LocationUtil.js";
import FormNavBar from "../widget/FormNavBar";
import LoadingIndicator from "../widget/LoadingIndicator";
import { UserService } from '../service/UserService';

const coveredTopics = [
    { value: 'csa', label: 'CSA' },
    { value: 'gender_discrimination', label: 'Gender Discrimination' },
    { value: 'puberty', label: 'Puberty' },
    { value: 'sexual_harassment', label: 'Sexual Harassment' },
    { value: 'early_age_marriage', label: 'Early Age Marriage' },
    { value: 'family_planning', label: 'Family Planning' },
    { value: 'other', label: 'Other' }
];

const audienceSex = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
];

const participantAgeGroup = [
    { value: 'age_5_to_10', label: '5-10' },
    { value: 'age_11_to_15', label: '11-15' },
    { value: 'age_16_to_20', label: '16-20' },
    { value: 'age_21_to_49', label: '21-49' },
    { value: 'geq_50', label: '50+' }
];

class MobileCinemaDetails extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            districtArray: [],
            screening_type: 'cinema',
            date_start: '',
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
        this.inputChange = this.inputChange.bind(this);

        this.isOtherTopic = false;
        this.isMale = false;
        this.isFemale = false;
        this.isOtherSex = false;
        this.isFive = false;
        this.isEleven = false;
        this.isSixteen = false;
        this.isTwentyOne = false;
        this.isFiftyPlus = false;

        this.formTypeId = 0;
        this.requiredFields = ["date_start", "province", "district", "screening_type", "topic_covered", "performance_title", "participants_sex", "participants_age_group"];
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

            let formTypeObj = await getFormTypeByUuid(Constants.MOBILE_CINEMA_DETAILS_FORM_UUID);
            this.formTypeId = formTypeObj.formTypeId;

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

    updateDisplay() {

        this.setState({
            screening_type: 'cinema'
        })

        this.isOtherTopic = false;
        this.isMale = false;
        this.isFemale = false;
        this.isOtherSex = false;
        this.isFive = false;
        this.isEleven = false;
        this.isSixteen = false;
        this.isTwentyOne = false;
        this.isFiftyPlus = false;
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
            var participantsSexValues = this.state.participants_sex;
            if (getObject('other', participantsSexValues, 'value') != -1) {
                this.isOtherSex = true;
            }
            if (getObject('other', participantsSexValues, 'value') == -1) {
                this.isOtherSex = false;
            }

            if (getObject('female', participantsSexValues, 'value') != -1) {
                this.isFemale = true;
            }
            if (getObject('female', participantsSexValues, 'value') == -1) {
                this.isFemale = false;
            }

            if (getObject('male', participantsSexValues, 'value') != -1) {
                this.isMale = true;
            }
            if (getObject('male', participantsSexValues, 'value') == -1) {
                this.isMale = false;
            }

        }

        if (this.state.participants_age_group !== undefined && this.state.participants_age_group.length > 0) {

            var ageGroups = this.state.participants_age_group;

            if (getObject('age_5_to_10', ageGroups, 'value') != -1) {
                this.isFive = true;
            }
            if (getObject('age_5_to_10', ageGroups, 'value') == -1) {
                this.isFive = false;
            }

            if (getObject('age_11_to_15', ageGroups, 'value') != -1) {
                this.isEleven = true;
            }
            if (getObject('age_11_to_15', ageGroups, 'value') == -1) {
                this.isEleven = false;
            }

            if (getObject('age_16_to_20', ageGroups, 'value') != -1) {
                this.isSixteen = true;
            }
            if (getObject('age_16_to_20', ageGroups, 'value') == -1) {
                this.isSixteen = false;
            }

            if (getObject('age_21_to_49', ageGroups, 'value') != -1) {
                this.isTwentyOne = true;
            }
            if (getObject('age_21_to_49', ageGroups, 'value') == -1) {
                this.isTwentyOne = false;
            }

            if (getObject('geq_50', ageGroups, 'value') != -1) {
                this.isFiftyPlus = true;
            }
            if (getObject('geq_50', ageGroups, 'value') == -1) {
                this.isFiftyPlus = false;
            }
        }
    }

    beforeunload(e) {
        e.preventDefault();
        e.returnValue = true;
    }


    cancelCheck = () => {
        console.log(" ============================================================= ")
        this.resetForm(this.requiredFields);
    }

    // for text and numeric questions
    inputChange(e, name) {

        console.log(e);
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

        if (name === "participants_age_group") {
            if (getObject('age_5_to_10', e, 'value') != -1) {
                this.isFive = true;
            }
            if (getObject('age_5_to_10', e, 'value') == -1) {
                this.isFive = false;
            }

            if (getObject('age_11_to_15', e, 'value') != -1) {
                this.isEleven = true;
            }
            if (getObject('age_11_to_15', e, 'value') == -1) {
                this.isEleven = false;
            }

            if (getObject('age_16_to_20', e, 'value') != -1) {
                this.isSixteen = true;
            }
            if (getObject('age_16_to_20', e, 'value') == -1) {
                this.isSixteen = false;
            }

            if (getObject('age_21_to_49', e, 'value') != -1) {
                this.isTwentyOne = true;
            }
            if (getObject('age_21_to_49', e, 'value') == -1) {
                this.isTwentyOne = false;
            }

            if (getObject('geq_50', e, 'value') != -1) {
                this.isFiftyPlus = true;
            }
            if (getObject('geq_50', e, 'value') == -1) {
                this.isFiftyPlus = false;
            }
        }

        this.isOtherTopic ? this.requiredFields.push("topic_covered_other") : this.requiredFields = this.requiredFields.filter(e => e !== "topic_covered_other");

        this.isFemale ? this.requiredFields.push("female_count") : this.requiredFields = this.requiredFields.filter(e => e !== "female_count");
        this.isMale ? this.requiredFields.push("male_count") : this.requiredFields = this.requiredFields.filter(e => e !== "male_count");
        this.isOtherSex ? this.requiredFields.push("other_sex_count") : this.requiredFields = this.requiredFields.filter(e => e !== "other_sex_count");

        this.isFive ? this.requiredFields.push("age_5_to_10_count") : this.requiredFields = this.requiredFields.filter(e => e !== "age_5_to_10_count");
        this.isEleven ? this.requiredFields.push("age_11_to_15_count") : this.requiredFields = this.requiredFields.filter(e => e !== "age_11_to_15_count");
        this.isSixteen ? this.requiredFields.push("age_16_to_20_count") : this.requiredFields = this.requiredFields.filter(e => e !== "age_16_to_20_count");
        this.isTwentyOne ? this.requiredFields.push("age_21_to_49_count") : this.requiredFields = this.requiredFields.filter(e => e !== "age_21_to_49_count");
        this.isFiftyPlus ? this.requiredFields.push("age_50_plus_count") : this.requiredFields = this.requiredFields.filter(e => e !== "age_50_plus_count");
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


    handleSubmit = async event => {
        event.preventDefault();
        if (this.handleValidation()) {

            console.log("in submission");

            this.setState({
                // form_disabled: true,
                loading: true
            })

            const data = new FormData(event.target);
            var jsonData = new Object();
            jsonData.formDate = this.state.date_start;
            jsonData.formType = {};
            jsonData.formType.formTypeId = this.formTypeId;
            jsonData.referenceId = "";

            jsonData.data = {};
            jsonData.data.topic_covered = {};
            jsonData.data.topic_covered.values = [];
            jsonData.data.participants_sex = {};
            jsonData.data.participants_sex.values = [];
            jsonData.data.participants_age_group = {};
            jsonData.data.participants_age_group.values = [];

            // adding required properties in data property
            jsonData.data.date_start = this.state.date_start;
            jsonData.data.province = data.get('province');
            jsonData.data.district = this.state.district.label;
            jsonData.data.screening_type = this.state.screening_type;

            // generating multiselect for topic covered
            if ((this.state.topic_covered != null && this.state.topic_covered != undefined)) {
                for (let i = 0; i < this.state.topic_covered.length; i++) {
                    jsonData.data.topic_covered.values.push(String(this.state.topic_covered[i].value));
                }
            }
            if (this.isOtherTopic)
                jsonData.data.topic_covered_other = data.get('topic_covered_other');


            jsonData.data.performance_title = data.get('performance_title');

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

            // generating multiselect for participants_age_group
            if ((this.state.participants_age_group != null && this.state.participants_age_group != undefined)) {
                for (let i = 0; i < this.state.participants_age_group.length; i++) {
                    jsonData.data.participants_age_group.values.push(String(this.state.participants_age_group[i].value));
                }
            }

            if (this.isFive)
                jsonData.data.age_5_to_10_count = parseInt(data.get('age_5_to_10_count'));

            if (this.isEleven)
                jsonData.data.age_11_to_15_count = parseInt(data.get('age_11_to_15_count'));

            if (this.isSixteen)
                jsonData.data.age_16_to_20_count = parseInt(data.get('age_16_to_20_count'));

            if (this.isTwentyOne)
                jsonData.data.age_21_to_49_count = parseInt(data.get('age_21_to_49_count'));

            if (this.isFiftyPlus)
                jsonData.data.age_50_plus_count = parseInt(data.get('age_50_plus_count'));


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

        // for view mode
        const setDisable = this.state.viewMode ? "disabled" : "";
        const otherTopicStyle = this.isOtherTopic ? {} : { display: 'none' };
        const otherSexStyle = this.isOtherSex ? {} : { display: 'none' };
        const femaleStyle = this.isFemale ? {} : { display: 'none' };
        const maleStyle = this.isMale ? {} : { display: 'none' };
        const fiveTenStyle = this.isFive ? {} : { display: 'none' };
        const elevenStyle = this.isEleven ? {} : { display: 'none' };
        const sixteenStyle = this.isSixteen ? {} : { display: 'none' };
        const twentyOneStyle = this.isTwentyOne ? {} : { display: 'none' };
        const fiftyPlusStyle = this.isFiftyPlus ? {} : { display: 'none' };

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
                                <Form id="mobileForm" onSubmit={this.handleSubmit}>
                                    <Row>
                                        <Col md="6">
                                            <Card className="main-card mb-6">
                                                <CardHeader>
                                                    <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                    <b>Mobile Cinema/Theatre Details Form</b>
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
                                                        <span class="errorMessage"><u>Errors: <br /></u> Form has some errors. Please check for required and invalid fields.<br /></span>
                                                    </div>

                                                    <br />
                                                    <fieldset >
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
                                                                            <Select id="province" name="province" value={this.state.province} onChange={(e) => this.handleChange(e, "province")} options={location.provinces} required />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup>
                                                                            <Label for="district" >District</Label> <span class="errorMessage">{this.state.errors["district"]}</span>
                                                                            <Select id="district" name="district" value={this.state.district} onChange={(e) => this.handleChange(e, "district")} options={this.state.districtArray} required />
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="screening_type" >Type of Screening</Label> <span class="errorMessage">{this.state.errors["screening_type"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "screening_type")} value={this.state.screening_type} name="screening_type" id="screening_type">
                                                                                <option value="cinema">Cinema</option>
                                                                                <option value="live_theatre">Live Theatre</option>
                                                                            </Input>
                                                                        </FormGroup>

                                                                    </Col>

                                                                    <Col md="6" >
                                                                        <FormGroup >
                                                                            <Label for="topic_covered" >Topic Screened</Label> <span class="errorMessage">{this.state.errors["topic_covered"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "topic_covered")} value={this.state.topic_covered} id="topic_covered" options={coveredTopics} isMulti />
                                                                        </FormGroup>
                                                                    </Col>


                                                                    <Col md="6" style={otherTopicStyle}>
                                                                        <FormGroup >
                                                                            <Label for="topic_covered_other" >Specify Other Topic</Label> <span class="errorMessage">{this.state.errors["topic_covered_other"]}</span>
                                                                            <Input name="topic_covered_other" id="topic_covered_other" value={this.state.topic_covered_other} onChange={(e) => { this.inputChange(e, "topic_covered_other") }} maxLength="200" placeholder="Enter other" />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="performance_title">Name of Video or Performance</Label> <span class="errorMessage">{this.state.errors["performance_title"]}</span>
                                                                            <Input name="performance_title" id="performance_title" value={this.state.performance_title} onChange={(e) => { this.inputChange(e, "performance_title") }} maxLength="200" placeholder="Enter name" />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" >
                                                                        <FormGroup >
                                                                            <Label for="participants_sex" >Sex of Audience</Label> <span class="errorMessage">{this.state.errors["participants_sex"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "participants_sex")} value={this.state.participants_sex} id="participants_sex" options={audienceSex} isMulti />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={femaleStyle}>
                                                                        <FormGroup >
                                                                            <Label for="female_count" >Number of Females</Label> <span class="errorMessage">{this.state.errors["female_count"]}</span>
                                                                            <Input type="number" value={this.state.female_count} name="female_count" id="female_count" onChange={(e) => { this.inputChange(e, "female_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={maleStyle}>
                                                                        <FormGroup >
                                                                            <Label for="male_count" >Number of Males</Label> <span class="errorMessage">{this.state.errors["male_count"]}</span>
                                                                            <Input type="number" value={this.state.male_count} name="male_count" id="male_count" onChange={(e) => { this.inputChange(e, "male_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
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
                                                                            <Label for="participants_age_group" >Age of Audience</Label> <span class="errorMessage">{this.state.errors["participants_age_group"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "participants_age_group")} value={this.state.participants_age_group} id="participants_age_group" options={participantAgeGroup} isMulti />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={fiveTenStyle}>
                                                                        <FormGroup >
                                                                            <Label for="age_5_to_10_count" >Number of Audience Aged 5-10</Label> <span class="errorMessage">{this.state.errors["age_5_to_10_count"]}</span>
                                                                            <Input type="number" value={this.state.age_5_to_10_count} name="age_5_to_10_count" id="age_5_to_10_count" onChange={(e) => { this.inputChange(e, "age_5_to_10_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={elevenStyle}>
                                                                        <FormGroup >
                                                                            <Label for="age_11_to_15_count" >Number of Audience Aged 11-15</Label> <span class="errorMessage">{this.state.errors["age_11_to_15_count"]}</span>
                                                                            <Input type="number" value={this.state.age_11_to_15_count} name="age_11_to_15_count" id="age_11_to_15_count" onChange={(e) => { this.inputChange(e, "age_11_to_15_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={sixteenStyle}>
                                                                        <FormGroup >
                                                                            <Label for="age_16_to_20_count" >Number of Audience Aged 16-20</Label> <span class="errorMessage">{this.state.errors["age_16_to_20_count"]}</span>
                                                                            <Input type="number" value={this.state.age_16_to_20_count} name="age_16_to_20_count" id="age_16_to_20_count" onChange={(e) => { this.inputChange(e, "age_16_to_20_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={twentyOneStyle}>
                                                                        <FormGroup >
                                                                            <Label for="age_21_to_49_count" >Number of Audience Aged 21-49</Label> <span class="errorMessage">{this.state.errors["age_21_to_49_count"]}</span>
                                                                            <Input type="number" value={this.state.age_21_to_49_count} name="age_21_to_49_count" id="age_21_to_49_count" onChange={(e) => { this.inputChange(e, "age_21_to_49_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={fiftyPlusStyle}>
                                                                        <FormGroup >
                                                                            <Label for="age_50_plus_count" >Number of Audience Aged 50+</Label> <span class="errorMessage">{this.state.errors["age_50_plus_count"]}</span>
                                                                            <Input type="number" value={this.state.age_50_plus_count} name="age_50_plus_count" id="age_50_plus_count" onChange={(e) => { this.inputChange(e, "age_50_plus_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
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
                                                            <Button className="mb-2 mr-2" color="success" size="sm" type="submit" disabled={buttonDisabled}>Submit<MDBIcon icon="smile" className="ml-2" size="lg" /></Button>
                                                            <Button className="mb-2 mr-2" color="danger" size="sm" onClick={this.cancelCheck} disabled={buttonDisabled}>Clear<MDBIcon icon="window-close" className="ml-2" size="lg" /></Button>
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

export default MobileCinemaDetails;