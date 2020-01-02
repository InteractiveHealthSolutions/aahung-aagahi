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

import { MDBBtn, MDBContainer, MDBIcon, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from 'mdbreact';
import moment from 'moment';
import React, { Fragment } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Select from 'react-select';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, TabContent, TabPane } from 'reactstrap';
import CustomModal from "../alerts/CustomModal";
import "../index.css";
import { getDefinitionByDefinitionId, getDefinitionsByDefinitionType, getFormDataById, getFormTypeByUuid, getLocationAttributesByLocation, getLocationsByCategory, getRoleByName, getUsersByRole } from "../service/GetService";
import { saveFormData, updateFormData } from "../service/PostService";
import { clearCheckedFields, getObject, loadFormState, resetFormState, getIndicatorCode } from "../util/AahungUtil.js";
import * as Constants from "../util/Constants";
import FormNavBar from "../widget/FormNavBar";
import LoadingIndicator from "../widget/LoadingIndicator";

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
    { value: 'other', label: 'Other' }
];

class ParentSessions extends React.Component {

    modal = false;
    constructor(props) {
        super(props);
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
            viewMode: false,
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
        this.scoreChange = this.scoreChange.bind(this);
        this.inputChange = this.inputChange.bind(this);

        this.isSessionConducted = false;
        this.isGenderBoth = false;
        this.isPreviousTopicOther = false;
        this.isNextPlan = false;
        this.score = 0;
        this.totalScore = 0;
        this.scoreArray = [];
        this.formTypeId = 0;
        this.requiredFields = ["date_start", "monitor", "parent_session_conducted", "school_id", "parent_session_score", "parent_session_score_pct"];
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
            let formTypeObj = await getFormTypeByUuid(Constants.PARENT_SESSION_FORM_UUID);
            this.formTypeId = formTypeObj.formTypeId;
            this.formTypeId = formTypeObj.formTypeId;

            let role = await getRoleByName(Constants.LSE_MONITOR_ROLE_NAME);
            console.log("Role ID:" + role.roleId);
            console.log(role.roleName);
            let trainersArray = await getUsersByRole(role.uuid);
            if (trainersArray != null && trainersArray.length > 0) {
                this.setState({
                    monitors: trainersArray
                })
            }

            let schools = await getLocationsByCategory(Constants.SCHOOL_DEFINITION_UUID);
            if (schools != null && schools.length > 0) {
                this.setState({
                    schools: schools
                })
            }
            if (this.editMode) {
                this.fetchedForm = await getFormDataById(String(this.props.location.state.formId));

                if (this.fetchedForm !== null) {
                    this.state = loadFormState(this.fetchedForm, this.state); // autopopulates the whole form
                    this.setState({
                        date_start: moment(this.fetchedForm.formDate).format('YYYY-MM-DD')
                    })

                    let self = this;
                    this.fetchedForm.data.map(function (element, i) {
                        var dataType = (element.dataType).toLowerCase();
                        if (dataType === 'int') {
                            var radios = document.getElementsByName(element.key.shortName);
                            for (let i = 0; i < radios.length; i++) {
                                if (parseInt(radios[i].value) === parseInt(String(element.value))) {
                                    radios[i].checked = true;
                                    var indicator = radios[i].id; // e.g "strongly_agree"
                                    var indicatorCode = getIndicatorCode(indicator);
                                    self.calculate(indicator, element.key.shortName, String(element.value), indicatorCode);
                                }
                            }
                        }
                    })

                    this.setState({
                        school_id: { id: this.fetchedForm.location.locationId, label: this.fetchedForm.location.shortName, value: this.fetchedForm.location.locationName },
                        school_name: this.fetchedForm.location.locationName
                    })
                    let attributes = await getLocationAttributesByLocation(this.fetchedForm.location.uuid);
                    this.autopopulateFields(attributes);
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
            parent_attendant: 'mothers',
            session_organization: 'separate'
        })

        this.isSessionConducted = false;
        this.isGenderBoth = false;
        this.isPreviousTopicOther = false;
        this.isNextPlan = false;
        this.score = 0;
        this.totalScore = 0;
        this.scoreArray = [];
    }

    editUpdateDisplay() {
        if (this.state.parent_attendant !== undefined && this.state.parent_attendant !== '') {
            this.isGenderBoth = this.state.parent_attendant === "both" ? true : false;
        }

        if (this.state.parent_session_conducted !== undefined && this.state.parent_session_conducted) {
            this.isSessionConducted = String(this.state.parent_session_conducted) === "1" ? true : false;

            this.isGenderBoth = this.state.parent_attendant === "both" && this.state.parent_session_conducted === "1" ? true : false;
            this.isNextPlan = this.state.next_session_plan === "1" && this.state.parent_session_conducted === "1" ? true : false;

            if (this.state.parent_session_conducted === "1") {
                if (getObject('other', this.state.previous_topic_covered, 'value') != -1) {
                    this.isPreviousTopicOther = true;
                }
                if (getObject('other', this.state.previous_topic_covered, 'value') == -1) {
                    this.isPreviousTopicOther = false;
                }
            }
            else
                this.isPreviousTopicOther = false;
        }

        if (this.state.next_session_plan !== undefined && this.state.next_session_plan !== '') {
            this.isNextPlan = this.state.next_session_plan === "1" ? true : false;
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

    inputChange(e, name) {

        this.setState({
            [name]: e.target.value
        });
    }

    // for single select
    valueChange = (e, name) => {

        this.setState({
            [name]: e.target.value
        });

        if (name === "parent_attendant") {
            this.isGenderBoth = e.target.value === "both" ? true : false;
        }
    }

    // calculate score from scoring questions (radiobuttons)
    scoreChange = (e, name) => {
        this.setState({
            [name]: e.target.value
        });

        if (name === "parent_session_conducted") {
            this.isSessionConducted = e.target.id === "yes" ? true : false;
            var dependents = ["session_actively_organized", "lastest_session_date", "session_count", "avg_participant_count", "parent_attendant", "facilitator_type", "previous_topic_covered", "next_session_plan"];
            if (this.isSessionConducted) {
                this.requiredFields = this.requiredFields.concat(dependents);
            }
            else {
                this.requiredFields = this.requiredFields.filter(n => !dependents.includes(n));
            }

            this.isGenderBoth = this.state.parent_attendant === "both" && e.target.id === "yes" ? true : false;
            this.isNextPlan = this.state.next_session_plan === "yes" && e.target.id === "yes" ? true : false;

            if (e.target.id === "yes") {
                if (getObject('other', this.state.previous_topic_covered, 'value') != -1) {
                    this.isPreviousTopicOther = true;
                }
                if (getObject('other', this.state.previous_topic_covered, 'value') == -1) {
                    this.isPreviousTopicOther = false;
                }
            }
            else
                this.isPreviousTopicOther = false;

        }

        if (name === "next_session_plan") {
            this.isNextPlan = e.target.id === "yes" ? true : false;
        }

        let indicator = e.target.id;
        let fieldName = e.target.name;
        let value = e.target.value;
        var indicatorCode = getIndicatorCode(indicator);
        this.calculate(indicator, fieldName, value, indicatorCode);
    }

    calculate(indicator, fieldName, value, indicatorValue) {
        let answered = [];
        if (this.scoreArray != undefined || this.scoreArray != null) {
            answered = this.scoreArray.filter(question => question.elementName == fieldName);
        }
        if (answered[0] != null) {
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

        var score = parseInt(this.score);
        var totalScore = parseInt(this.totalScore);
        var percent = (score / totalScore) * 100;
        percent = percent.toFixed(2);
        this.setState({
            parent_session_score: this.score,
            parent_session_score_pct: percent
        })
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
                this.isPreviousTopicOther = true;
            }
            if (getObject('other', e, 'value') == -1) {
                this.isPreviousTopicOther = false;
            }
        }
    }

    callModal = () => {
        this.setState({ modal: !this.state.modal });
    }

    // for autocomplete single select
    async handleChange(e, name) {

        this.setState({
            [name]: e
        });

        try {
            if (name === "school_id") {
                this.setState({ school_name: e.locationName });
                document.getElementById("school_name").value = e.locationName;
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
        if (this.handleValidation()) {

            console.log("in submission");
            this.setState({
                loading: true,
                loadingMsg: "Saving trees..."
            })

            const data = new FormData(event.target);
            console.log(data);
            var jsonData = new Object();
            jsonData.formDate = this.state.date_start;
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
            if ((this.state.monitor != null && this.state.monitor != undefined)) {
                for (let i = 0; i < this.state.monitor.length; i++) {
                    jsonData.data.monitor.push({
                        "userId": this.state.monitor[i].id
                    });
                }
            }

            if (this.isSessionConducted) {
                jsonData.data.parent_session_conducted = this.state.parent_session_conducted;
                jsonData.data.lastest_session_date = this.state.lastest_session_date;
                jsonData.data.session_count = this.state.session_count;
                jsonData.data.avg_participant_count = this.state.avg_participant_count;
                jsonData.data.parent_attendant = this.state.parent_attendant;
                jsonData.data.session_actively_organized = this.state.session_actively_organized;

                if (this.isGenderBoth)
                    jsonData.data.session_organization = this.state.session_organization;

                // generating multiselect for topic covered
                if ((this.state.facilitator_type != null && this.state.facilitator_type != undefined)) {
                    for (let i = 0; i < this.state.facilitator_type.length; i++) {
                        jsonData.data.facilitator_type.values.push(String(this.state.facilitator_type[i].value));
                    }
                }

                // generating multiselect for previous_topic_covered
                if ((this.state.previous_topic_covered != null && this.state.previous_topic_covered != undefined)) {
                    for (let i = 0; i < this.state.previous_topic_covered.length; i++) {
                        jsonData.data.previous_topic_covered.values.push(String(this.state.previous_topic_covered[i].value));
                    }
                }

                if (this.isPreviousTopicOther)
                    jsonData.data.previous_topic_covered_other = this.state.previous_topic_covered_other;

                jsonData.data.next_session_plan = this.state.next_session_plan;

                if (this.isNextPlan) {
                    jsonData.data.next_session_date = this.state.next_session_date;
                }

                jsonData.data.parent_session_score = parseInt(data.get('parent_session_score'));
                jsonData.data.parent_session_score_pct = parseFloat(data.get('parent_session_score_pct'));
            }
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
                                this.updateRequiredFieldsArray();
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

                                this.updateRequiredFieldsArray();
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

        this.isGenderBoth ? this.requiredFields.push("session_organization") : this.requiredFields = this.requiredFields.filter(e => e !== "session_organization");
        this.isNextPlan ? this.requiredFields.push("next_session_date") : this.requiredFields = this.requiredFields.filter(e => e !== "next_session_date");
        this.isPreviousTopicOther ? this.requiredFields.push("previous_topic_covered_other") : this.requiredFields = this.requiredFields.filter(e => e !== "previous_topic_covered_other");
        var dependents = ["session_actively_organized", "lastest_session_date", "session_count", "avg_participant_count", "parent_attendant", "facilitator_type", "previous_topic_covered", "next_session_plan"];
        if (this.isSessionConducted) {
            this.requiredFields = this.requiredFields.concat(dependents);
        }
        else {
            this.requiredFields = this.requiredFields.filter(n => !dependents.includes(n));
        }
    }

    handleValidation() {
        // check each required state
        this.updateRequiredFieldsArray();
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
        this.setState({
            school_name: '',
            school_sex: ''
        })
        clearCheckedFields();
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
        const sessionConductedStyle = this.isSessionConducted ? {} : { display: 'none' };
        const genderBothStyle = this.isGenderBoth ? {} : { display: 'none' };
        const nextPlanStyle = this.isNextPlan ? {} : { display: 'none' };
        const otherTopicStyle = this.isPreviousTopicOther ? {} : { display: 'none' };
        const { selectedOption } = this.state;
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
                                                        <span class="errorMessage"><u>Errors: <br /></u> Form has some errors. Please check for required or invalid fields.<br /></span>
                                                    </div>

                                                    <br />
                                                    <fieldset >
                                                        <TabContent activeTab={this.state.activeTab}>
                                                            <TabPane tabId="1">
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup inline>
                                                                            <Label for="date_start" >Session Date <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                            <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => { this.inputChange(e, "date_start") }} max={moment().format("YYYY-MM-DD")} />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_id" >School ID<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["school_id"]}</span>
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
                                                                            <Input name="school_name" id="school_name" value={this.state.school_name} placeholder="School Name will be autopulated" disabled />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="monitor" >Monitored By <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["monitor"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "monitor")} value={this.state.monitor} id="monitor" options={this.state.monitors} isMulti />
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
                                                                            <Label for="parent_session_conducted" >Does this school conduct parent sessions? <span className="required">*</span></Label>
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
                                                                            <Input type="date" name="lastest_session_date" id="lastest_session_date" value={this.state.lastest_session_date} onChange={(e) => { this.inputChange(e, "lastest_session_date") }} max={moment().format("YYYY-MM-DD")} />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={sessionConductedStyle}>
                                                                        <FormGroup >
                                                                            <Label for="session_count" >Number of parent sessions held since beginning of school year</Label>  <span class="errorMessage">{this.state.errors["session_count"]}</span>
                                                                            <Input type="number" value={this.state.session_count} name="session_count" id="session_count" onChange={(e) => { this.inputChange(e, "session_count") }} max="99" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={sessionConductedStyle}>
                                                                        <FormGroup >
                                                                            <Label for="avg_participant_count" >Average number of participants in sessions</Label>  <span class="errorMessage">{this.state.errors["session_count"]}</span>
                                                                            <Input type="number" value={this.state.avg_participant_count} name="avg_participant_count" id="avg_participant_count" onChange={(e) => { this.inputChange(e, "avg_participant_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
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
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "facilitator_type")} value={this.state.facilitator_type} id="facilitator_type" options={facilitatorTypeOptions} isMulti />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={sessionConductedStyle}>
                                                                        <FormGroup >
                                                                            <Label for="previous_topic_covered" >Topics covered in previous sessions</Label> <span class="errorMessage">{this.state.errors["previous_topic_covered"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "previous_topic_covered")} value={this.state.previous_topic_covered} id="previous_topic_covered" options={previousTopicCoveredOptions} isMulti />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="12" style={otherTopicStyle}>
                                                                        <FormGroup >
                                                                            <Label for="previous_topic_covered_other" >Specify Other</Label> <span class="errorMessage">{this.state.errors["previous_topic_covered_other"]}</span>
                                                                            <Input name="previous_topic_covered_other" id="previous_topic_covered_other" value={this.state.previous_topic_covered_other} onChange={(e) => { this.inputChange(e, "previous_topic_covered_other") }} placeholder="Enter text" />
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
                                                                            <Input type="date" name="next_session_date" id="next_session_date" value={this.state.next_session_date} onChange={(e) => { this.inputChange(e, "next_session_date") }} />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="parent_session_score" style={{ color: "green" }}><b>Cumulative Parent Session Score<span className="required">*</span></b></Label> <span class="errorMessage">{this.state.errors["parent_session_score"]}</span>
                                                                            <Input value={this.state.parent_session_score} name="parent_session_score" id="parent_session_score" onChange={(e) => { this.inputChange(e, "parent_session_score") }} readOnly></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="parent_session_score_pct" style={{ color: "green" }}><b>% Score<span className="required">*</span></b></Label> <span class="errorMessage">{this.state.errors["parent_session_score_pct"]}</span>
                                                                            <Input name="parent_session_score_pct" id="parent_session_score_pct" value={this.state.parent_session_score_pct} onChange={(e) => { this.inputChange(e, "parent_session_score_pct") }} readOnly></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                {/* please don't remove this div unless you are adding multiple questions here*/}
                                                                <div style={{ height: '180px' }}><span>   </span></div>

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
                                                            <Button className="mb-2 mr-2" color="success" size="sm" type="submit">Submit<MDBIcon icon="smile" className="ml-2" size="lg" /></Button>
                                                            <Button className="mb-2 mr-2" color="danger" size="sm" onClick={this.cancelCheck} >Clear<MDBIcon icon="window-close" className="ml-2" size="lg" /></Button>
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