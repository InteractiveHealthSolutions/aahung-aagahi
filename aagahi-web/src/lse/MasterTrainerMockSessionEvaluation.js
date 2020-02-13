/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-16 17:32:02
 * @modify date 2019-08-16 17:32:05
 * @desc [description]
 */

// Copyright 2019 Interactive Health Solutions
//
// This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License 
// as published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
// without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with this program;
// if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA.
// You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html
//
// Interactive Health Solutions, hereby disclaims all copyright interest in the program `Aahung-Aagahi' written by the contributors.

// Contributors: Tahira Niazi

import classnames from 'classnames';
import { MDBIcon } from 'mdbreact';
import moment from 'moment';
import React, { Fragment } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Select from 'react-select';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Button, ButtonGroup, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, TabContent, TabPane } from 'reactstrap';
import CustomModal from "../alerts/CustomModal";
import "../index.css";
import { getFormDataById, getFormTypeByUuid, getLocationsByCategory, getParticipantsByLocation, getRoleByName, getUsersByRole } from "../service/GetService";
import { saveFormData, updateFormData } from "../service/PostService";
import { clearCheckedFields, getIndicatorCode, loadFormState } from "../util/AahungUtil.js";
import * as Constants from "../util/Constants";
import FormNavBar from "../widget/FormNavBar";
import LoadingIndicator from "../widget/LoadingIndicator";
import { UserService } from '../service/UserService';

class MasterTrainerMockSessionEvaluation extends React.Component {

    modal = false;
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            date_start: '',
            schools: [],
            monitors: [],
            participants: [],
            participant_id: '',
            participant_name: '',
            program_type: 'csa',
            csa_flashcard: '1',
            school_level: 'school_level_primary',
            mt_lsbe_level: 'level_1',
            mt_lsbe_level_1: 'communication',
            mt_lsbe_level_2: 'effective_communication',
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

        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.scoreChange = this.scoreChange.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.programType = '';
        this.isLevel1 = true;
        this.isLevel2 = false;
        this.isLevel1Communication = true;
        this.isLevel1Values = false;
        this.isLevel1Gender = false;
        this.isLevel1Self = false;
        this.isLevel1Peer = false;
        this.isLevel1Puberty = false;
        this.isLevel2Effective = false;
        this.isLevel2Gender = false;
        this.isLevel2Puberty = false;
        this.isLevel2Youth = false;
        this.isLevel2Maternal = false;
        this.isLevel2Hiv = false;
        this.isLevel2Violence = false;
        this.score = 0;
        this.totalScore = 0;
        this.scoreArray = [];

        this.formTypeId = 0;
        this.csaRequiredFields = ["date_start", "school_id", "monitor", "participant_name",
            "participant_id", "school_level", "program_type", "csa_flashcard", "mt_csa_prompts", "mt_csa_flashcard_objective",
            "mt_csa_understanding", "mt_csa_subject_comfort", "mt_csa_nonjudmental_tone", "mt_csa_impartial_opinions",
            "mt_csa_probing_style", "mt_mock_score", "mt_mock_score_pct"];

        this.csaDependantFields = [];
        this.lsbeRequiredFields = ["date_start", "school_id", "monitor", "participant_name",
            "participant_id", "school_level", "program_type", "mt_lsbe_level", "mt_lsbe_prompts", "mt_lsbe_understanding",
            "mt_material_prep", "mt_content_prep", "mt_activity_time_allotment", "mt_lsbe_subject_comfort", "mt_lsbe_nonjudmental_tone",
            "mt_lsbe_impartial_opinions", "mt_lsbe_probing_style", "mt_mock_score", "mt_mock_score_pct"];

        this.lsbeDependantFields = [];
        this.errors = {};
        this.editMode = false;
        this.fetchedForm = {};
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.beforeunload.bind(this));
        this.loadData();
        // this will be fetched from school
        this.setState({ program_type: "csa" });
        this.programType = "csa";
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
            let formTypeObj = await getFormTypeByUuid(Constants.MASTER_TRAINER_MOCK_SESSION_FORM_UUID);
            this.formTypeId = formTypeObj.formTypeId;
            this.formTypeId = formTypeObj.formTypeId;

            let role = await getRoleByName(Constants.LSE_MONITOR_ROLE_NAME);
            console.log("Role ID:" + role.roleId);
            console.log(role.roleName);
            let trainersArray = await getUsersByRole(role.uuid, false);
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
                        else if (dataType === 'definition') { //for final decision mt_eligible
                            var radios = document.getElementsByName(element.key.shortName);
                            for (let i = 0; i < radios.length; i++) {
                                if (radios[i].value === element.value.shortName) {
                                    radios[i].checked = true;
                                }
                            }
                        }
                    })

                    this.setState({
                        school_id: { id: this.fetchedForm.location.locationId, label: this.fetchedForm.location.shortName, value: this.fetchedForm.location.locationName },
                        school_name: this.fetchedForm.location.locationName
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
            program_type: 'csa',
            school_level: 'school_level_primary',
            mt_lsbe_level: 'level_1',
            mt_lsbe_level_1: 'communication',
            mt_lsbe_level_2: 'effective_communication',
        })
    }

    editUpdateDisplay() {

        this.isLevel1 = false;
        this.isLevel2 = false;
        this.isLevel1Communication = false;

        if (this.state.program_type !== undefined && this.state.program_type !== '') {
            if (this.state.program_type === "csa") {
                this.errors = {};
                this.programType = "csa";
            }
            else if (this.state.program_type === "lsbe") {
                this.errors = {};
                this.programType = "lsbe";
            }
        }

        if (this.state.mt_lsbe_level !== undefined && this.state.mt_lsbe_level !== '') {
            this.isLevel1 = this.state.mt_lsbe_level === "level_1" ? true : false;
            this.isLevel2 = this.state.mt_lsbe_level === "level_2" ? true : false;

            // this.isLevel1Communication = this.state.mt_lsbe_level === "level_1" ? true : false;
            // this.isLevel2Effective = this.state.mt_lsbe_level === "level_2" ? true : false;
        }

        if ((this.state.mt_lsbe_level_1 !== undefined && this.state.mt_lsbe_level_1 !== '') && this.state.mt_lsbe_level === "level_1") {

            this.isLevel1Communication = this.state.mt_lsbe_level_1 === "communication" ? true : false;
            this.isLevel1Values = this.state.mt_lsbe_level_1 === "values" ? true : false;
            this.isLevel1Gender = this.state.mt_lsbe_level_1 === "gender" ? true : false;
            this.isLevel1Self = this.state.mt_lsbe_level_1 === "self_protection" ? true : false;
            this.isLevel1Peer = this.state.mt_lsbe_level_1 === "peer_pressure" ? true : false;
            this.isLevel1Puberty = this.state.mt_lsbe_level_1 === "puberty" ? true : false;

            // level 2 field should be hidden
            this.isLevel2Effective = false;
            this.isLevel2Youth = false;
            this.isLevel2Gender = false;
            this.isLevel2Maternal = false;
            this.isLevel2Hiv = false;
            this.isLevel2Violence = false;
            this.isLevel2Puberty = false;

        }

        if ((this.state.mt_lsbe_level_2 !== undefined && this.state.mt_lsbe_level_2 !== '') && this.state.mt_lsbe_level === "level_2") {

            this.isLevel2Effective = this.state.mt_lsbe_level_2 === "effective_communication" ? true : false;
            this.isLevel2Youth = this.state.mt_lsbe_level_2 === "youth_family" ? true : false;
            this.isLevel2Gender = this.state.mt_lsbe_level_2 === "gender" ? true : false;
            this.isLevel2Maternal = this.state.mt_lsbe_level_2 === "maternal_child_health" ? true : false;
            this.isLevel2Hiv = this.state.mt_lsbe_level_2 === "hiv_aids" ? true : false;
            this.isLevel2Violence = this.state.mt_lsbe_level_2 === "violence" ? true : false;
            this.isLevel2Puberty = this.state.mt_lsbe_level_2 === "puberty" ? true : false;

            // level 1 fields should be hidden
            this.isLevel1Communication = false;
            this.isLevel1Values = false;
            this.isLevel1Gender = false;
            this.isLevel1Self = false;
            this.isLevel1Peer = false;
            this.isLevel1Puberty = false;
        }
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.beforeunload.bind(this));
    }

    toggleTab(tab) {
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

        if (this.programType === "csa") {
            this.updateRequiredFields();
            this.resetForm(this.csaRequiredFields);
            this.resetForm(this.csaDependantFields);
        }
        if (this.programType === "lsbe") {
            this.updateRequiredFields();
            this.resetForm(this.csaRequiredFields);
            this.resetForm(this.csaDependantFields);
        }
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

        if (name === "school_level") {
            if (e.target.value === "school_level_secondary") {
                this.errors = {};
                this.setState({
                    program_type: "lsbe"
                });
                this.programType = "lsbe";
            }
            else {
                this.errors = {};
                this.setState({
                    program_type: "csa"
                });
                this.programType = "csa";
            }
        }

        if (name === "program_type") {
            if (e.target.value === "csa") {
                this.errors = {};
                this.programType = "csa";
            }
            else if (e.target.value === "lsbe") {
                this.errors = {};
                this.programType = "lsbe";
            }
        }

        if (name === "mt_lsbe_level") {
            this.isLevel1 = e.target.value === "level_1" ? true : false;
            this.isLevel2 = e.target.value === "level_2" ? true : false;

            this.isLevel1Communication = e.target.value === "level_1" ? true : false;
            this.isLevel2Effective = e.target.value === "level_2" ? true : false;
        }

        if (name === "mt_lsbe_level_1") {

            this.isLevel1Communication = e.target.value === "communication" ? true : false;
            this.isLevel1Values = e.target.value === "values" ? true : false;
            this.isLevel1Gender = e.target.value === "gender" ? true : false;
            this.isLevel1Self = e.target.value === "self_protection" ? true : false;
            this.isLevel1Peer = e.target.value === "peer_pressure" ? true : false;
            this.isLevel1Puberty = e.target.value === "puberty" ? true : false;

            // level 2 field should be hidden
            this.isLevel2Effective = false;
            this.isLevel2Youth = false;
            this.isLevel2Gender = false;
            this.isLevel2Maternal = false;
            this.isLevel2Hiv = false;
            this.isLevel2Violence = false;
            this.isLevel2Puberty = false;
        }

        if (name === "mt_lsbe_level_2") {
            this.isLevel2Effective = e.target.value === "effective_communication" ? true : false;
            this.isLevel2Youth = e.target.value === "youth_family" ? true : false;
            this.isLevel2Gender = e.target.value === "gender" ? true : false;
            this.isLevel2Maternal = e.target.value === "maternal_child_health" ? true : false;
            this.isLevel2Hiv = e.target.value === "hiv_aids" ? true : false;
            this.isLevel2Violence = e.target.value === "violence" ? true : false;
            this.isLevel2Puberty = e.target.value === "puberty" ? true : false;

            // level 1 fields should be hidden
            this.isLevel1Communication = false;
            this.isLevel1Values = false;
            this.isLevel1Gender = false;
            this.isLevel1Self = false;
            this.isLevel1Peer = false;
            this.isLevel1Puberty = false;
        }
    }

    // calculate score from scoring questions (radiobuttons)
    scoreChange = (e, name) => {
        this.setState({
            [name]: e.target.value
        });

        let indicator = e.target.id;
        let fieldName = e.target.name;
        let value = e.target.value;
        var indicatorCode = getIndicatorCode(indicator);
        this.calculate(indicator, fieldName, value, indicatorCode);
    }

    calculate(indicator, fieldName, value, indicatorValue) {
        let answered = [];
        if (this.scoreArray !== undefined || this.scoreArray != null) {
            answered = this.scoreArray.filter(question => question.elementName === fieldName);
        }
        if (answered[0] != null) {
            answered[0].id = indicator;
            answered[0].elementName = fieldName;
            this.score = this.score - parseInt(answered[0].value); //becase previous answer is not applicable any more
            this.score += parseInt(value);

            for (var i in this.scoreArray) {
                if (this.scoreArray[i].elementName === fieldName) {

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
            mt_mock_score: this.score,
            mt_mock_score_pct: percent
        });
    }

    // for multi select
    valueChangeMulti(e, name) {

        this.setState({
            [name]: e
        });
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

                let participants = await getParticipantsByLocation(e.uuid, false);
                if (participants != null && participants.length > 0) {
                    this.setState({
                        participants: participants,
                        school_name: e.locationName,
                        participant_name: [],
                        participant_id: ''
                    })
                }
                else {
                    this.setState({
                        participants: [],
                        participant_name: [],
                        participant_id: ''
                    })
                }
            }

            if (name === "participant_name") {
                this.setState({ participant_id: e.identifier });
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    handleSubmit = async event => {
        event.preventDefault();
        if (this.handleValidation()) {

            this.setState({
                loading: true,
                loadingMsg: "Saving trees..."
            })

            var jsonData = new Object();
            jsonData.formDate = this.state.date_start;
            jsonData.formType = {};
            jsonData.formType.formTypeId = this.formTypeId;
            jsonData.referenceId = "";
            jsonData.location = {};
            jsonData.location.locationId = this.state.school_id.id;
            jsonData.data = {};

            var dataObj = {};

            // for csa
            if (this.programType === "csa") {

                var fields = this.csaRequiredFields.concat(this.csaDependantFields);
                for (let i = 0; i < fields.length; i++) {

                    if (fields[i] === "monitor") {
                        dataObj.monitor = [];
                        // monitor
                        if ((this.state.monitor != null && this.state.monitor !== undefined)) {
                            for (let i = 0; i < this.state.monitor.length; i++) {
                                dataObj.monitor.push({
                                    "userId": this.state.monitor[i].id
                                });
                            }
                        }
                        continue;

                    }

                    var element = document.getElementById(fields[i]);
                    if (element != null) {
                        if (element.offsetParent != null) { // this line is for checking if the element is visible on page
                            if (element.value !== '')
                                dataObj[fields[i]] = element.value;
                        }
                        else if (this.csaDependantFields.filter(f => f === fields[i]).length === 0) {
                            if (element.value !== '')
                                dataObj[fields[i]] = element.value;
                        }
                    }
                    else {
                        if (this.state[fields[i]] !== undefined && this.state[fields[i]] !== '') {
                            dataObj[fields[i]] = this.state[fields[i]];
                        }
                    }
                }
            }

            // for lsbe
            if (this.programType === "lsbe") {
                var lsbeFields = this.lsbeRequiredFields.concat(this.lsbeDependantFields);
                for (let i = 0; i < lsbeFields.length; i++) {

                    if (lsbeFields[i] === "monitor") {
                        dataObj.monitor = [];
                        // trainer
                        if ((this.state.monitor != null && this.state.monitor != undefined)) {
                            for (let i = 0; i < this.state.monitor.length; i++) {
                                dataObj.monitor.push({
                                    "userId": this.state.monitor[i].id
                                });
                            }
                        }
                        continue;
                    }

                    var element = document.getElementById(lsbeFields[i]);
                    if (element != null) {
                        if (element.offsetParent != null) {
                            if (element.value !== '')
                                dataObj[lsbeFields[i]] = element.value;
                        }
                        else if (this.lsbeDependantFields.filter(f => f === lsbeFields[i]).length === 0) {
                            if (element.value !== '')
                                dataObj[lsbeFields[i]] = element.value;
                        }
                    }
                    else {
                        if (this.state[lsbeFields[i]] !== undefined && this.state[lsbeFields[i]] !== '') {
                            dataObj[lsbeFields[i]] = this.state[lsbeFields[i]];
                        }
                    }
                }
                console.log(dataObj);
            }

            jsonData.data = dataObj;
            jsonData.formParticipants = [];
            // "formParticipants": [{"participantId" : 1}, {"participantId" : 4}]
            jsonData.formParticipants.push({
                "participantId": this.state.participant_name.id
            });

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
                                if (this.programType === "csa") {
                                    this.updateRequiredFields();
                                    this.resetForm(this.csaRequiredFields);
                                    this.resetForm(this.csaDependantFields);
                                }
                                if (this.programType === "lsbe") {
                                    this.updateRequiredFields();
                                    this.resetForm(this.lsbeRequiredFields);
                                    this.resetForm(this.lsbeDependantFields);
                                }
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

                                if (this.programType === "csa") {
                                    this.updateRequiredFields();
                                    this.resetForm(this.csaRequiredFields);
                                    this.resetForm(this.csaDependantFields);
                                }
                                if (this.programType === "lsbe") {
                                    this.updateRequiredFields();
                                    this.resetForm(this.lsbeRequiredFields);
                                    this.resetForm(this.lsbeDependantFields);
                                }
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

    updateRequiredFields() {

        // mt_lsbe_level_2
        this.isLevel1 ? this.lsbeDependantFields.push("mt_lsbe_level_1") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "mt_lsbe_level_1");
        this.isLevel2 ? this.lsbeDependantFields.push("mt_lsbe_level_2") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "mt_lsbe_level_2");

        this.isLevel2Effective ? this.lsbeDependantFields.push("imp_communicaton_l2") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "imp_communicaton_l2");
        this.isLevel2Effective ? this.lsbeDependantFields.push("describe_communication_comp") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "describe_communication_comp");
        this.isLevel2Gender ? this.lsbeDependantFields.push("diff_sex_gender_l2") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "diff_sex_gender_l2");
        this.isLevel2Gender ? this.lsbeDependantFields.push("explain_gender_norm_sterotypes") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "explain_gender_norm_sterotypes");
        this.isLevel2Gender ? this.lsbeDependantFields.push("gender_discrimination_impact") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "gender_discrimination_impact");
        this.isLevel2Puberty ? this.lsbeDependantFields.push("explain_puberty_l2") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "explain_puberty_l2");
        this.isLevel2Puberty ? this.lsbeDependantFields.push("myths_puberty") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "myths_puberty");
        this.isLevel2Youth ? this.lsbeDependantFields.push("describe_nikah_nama") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "describe_nikah_nama");
        this.isLevel2Maternal ? this.lsbeDependantFields.push("descibe_maternal_mortality") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "descibe_maternal_mortality");
        this.isLevel2Maternal ? this.lsbeDependantFields.push("link_age_maternal_health") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "link_age_maternal_health");
        this.isLevel2Hiv ? this.lsbeDependantFields.push("describe_hiv") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "describe_hiv");
        this.isLevel2Hiv ? this.lsbeDependantFields.push("describe_hiv_transmission") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "describe_hiv_transmission");
        this.isLevel2Hiv ? this.lsbeDependantFields.push("describe_hiv_prevention") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "describe_hiv_prevention");
        this.isLevel2Violence ? this.lsbeDependantFields.push("describe_violence_types") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "describe_violence_types");
        this.isLevel2Violence ? this.lsbeDependantFields.push("describe_violence_imapct") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "describe_violence_imapct");

        this.isLevel1Communication ? this.lsbeDependantFields.push("imp_communication") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "imp_communication");
        this.isLevel1Values ? this.lsbeDependantFields.push("def_values") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "def_values");
        this.isLevel1Gender ? this.lsbeDependantFields.push("diff_sex_gender") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "diff_sex_gender");
        this.isLevel1Self ? this.lsbeDependantFields.push("explain_self_protection") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "explain_self_protection");
        this.isLevel1Peer ? this.lsbeDependantFields.push("explain_peer_pressure") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "explain_peer_pressure");
        this.isLevel1Puberty ? this.lsbeDependantFields.push("explain_puberty") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "explain_puberty");
    }

    handleValidation() {
        // check each required state
        this.updateRequiredFields();
        let formIsValid = true;
        if (this.programType === "csa") {
            this.setState({ hasError: this.checkValid(this.csaRequiredFields, this.csaDependantFields) ? false : true });
            formIsValid = this.checkValid(this.csaRequiredFields, this.csaDependantFields);
        }
        if (this.programType === "lsbe") {
            this.setState({ hasError: this.checkValid(this.lsbeRequiredFields, this.lsbeDependantFields) ? false : true });
            formIsValid = this.checkValid(this.lsbeRequiredFields, this.lsbeDependantFields);
        }
        this.setState({ errors: this.errors });
        return formIsValid;
    }

    /**
     * verifies and notifies for the empty form fields
     */
    checkValid = (requireds, dependants) => {

        let isOk = true;
        var errorText = "Required!";
        this.errors = {};
        for (let j = 0; j < requireds.length; j++) {

            let stateName = requireds[j];
            // for array object
            if (typeof this.state[stateName] === 'object' && this.state[stateName] === null) {
                isOk = false;
                this.errors[requireds[j]] = errorText;
            }
            else if (typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                isOk = false;
                this.errors[requireds[j]] = errorText;
            }

            // for text and others
            if (typeof this.state[stateName] != 'object') {
                if (this.state[stateName] === "" || this.state[stateName] == undefined) {
                    isOk = false;
                    this.errors[requireds[j]] = errorText;
                }
            }
        }

        for (let j = 0; j < dependants.length; j++) {
            var element = document.getElementById(dependants[j]);
            if (element != null) {
                if (element.offsetParent != null) {

                    let stateName = dependants[j];
                    // for array object
                    if (typeof this.state[stateName] === 'object' && this.state[stateName] === null) {
                        isOk = false;
                        this.errors[requireds[j]] = errorText;
                    }
                    else if (typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                        isOk = false;
                        this.errors[requireds[j]] = errorText;
                    }
                    // for text and others
                    if (typeof this.state[stateName] != 'object') {
                        if (this.state[stateName] === "" || this.state[stateName] == undefined) {
                            isOk = false;
                            this.errors[dependants[j]] = errorText;
                        }
                    }
                }
            }
            else {
                let stateName = dependants[j];
                // for array object
                if (typeof this.state[stateName] === 'object' && this.state[stateName] === null) {
                    isOk = false;
                    this.errors[requireds[j]] = errorText;
                }
                else if (typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                    isOk = false;
                    this.errors[requireds[j]] = errorText;
                }

                // for text and others
                if (typeof this.state[stateName] != 'object') {
                    if (this.state[stateName] === "" || this.state[stateName] == undefined) {
                        isOk = false;
                        this.errors[dependants[j]] = errorText;
                    }
                }
            }
        }
        return isOk;
    }

    /**
     * verifies and notifies for the empty form fields
     */
    resetForm = (fields) => {

        fields.push("school_name");
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
        const lsbeStyle = this.programType === "lsbe" ? {} : { display: 'none' };
        const csaStyle = this.programType === "csa" ? {} : { display: 'none' };
        const level1Style = this.isLevel1 ? {} : { display: 'none' };
        const level2Style = this.isLevel2 ? {} : { display: 'none' };
        // styles for level 1
        const level1CommunicationStyle = this.isLevel1Communication ? {} : { display: 'none' };
        const level1ValuesStyle = this.isLevel1Values ? {} : { display: 'none' };
        const level1GenderStyle = this.isLevel1Gender ? {} : { display: 'none' };
        const level1SelfStyle = this.isLevel1Self ? {} : { display: 'none' };
        const level1PeerStyle = this.isLevel1Peer ? {} : { display: 'none' };
        const level1PubertyStyle = this.isLevel1Puberty ? {} : { display: 'none' };
        // styles for level 2
        const level2EffectiveStyle = this.isLevel2Effective ? {} : { display: 'none' };
        const level2YouthStyle = this.isLevel2Youth ? {} : { display: 'none' };
        const level2GenderStyle = this.isLevel2Gender ? {} : { display: 'none' };
        const level2MaternalStyle = this.isLevel2Maternal ? {} : { display: 'none' };
        const level2HivStyle = this.isLevel2Hiv ? {} : { display: 'none' };
        const level2ViolenceStyle = this.isLevel2Violence ? {} : { display: 'none' };
        const level2PubertyStyle = this.isLevel2Puberty ? {} : { display: 'none' };
        var formNavVisible = false;
        if (this.props.location.state !== undefined) {
            formNavVisible = this.props.location.state.edit ? true : false;
        }
        else {
            formNavVisible = false;
        }
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
                                                    <b>Master Trainer Mock Session Evaluation</b>
                                                    {/* <p style={{fontSize: "10px"}}>This is the form in the LSE component to be filled by LSE Monitors.</p> */}
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
                                                                            <Label for="school_id" >School ID <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["school_id"]}</span>
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
                                                                            <Label for="school_name" >School Name</Label> <span class="errorMessage">{this.state.errors["school_name"]}</span>
                                                                            <Input name="school_name" id="school_name" value={this.state.school_name} disabled />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="monitor">Monitored By <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["monitor"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "monitor")} value={this.state.monitor} id="monitor" options={this.state.monitors} required isMulti />
                                                                        </FormGroup>

                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup>
                                                                            <Label for="participant_name">Name of Teacher <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["participant_name"]}</span>
                                                                            <Select id="participant_name"
                                                                                name="participant_name"
                                                                                value={this.state.participant_name}
                                                                                onChange={(e) => this.handleChange(e, "participant_name")}
                                                                                options={this.state.participants}
                                                                            />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="participant_id" >Teacher ID <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["participant_id"]}</span>
                                                                            <Input name="participant_id" id="participant_id" value={this.state.participant_id} disabled />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_level" >Level of Program</Label> <span class="errorMessage">{this.state.errors["school_level"]}</span>
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
                                                                            <Label for="program_type" >Type of program being evaluated</Label> <span class="errorMessage">{this.state.errors["program_type"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "program_type")} value={this.state.program_type} name="program_type" id="program_type" disabled={this.editMode}>
                                                                                <option value="csa">CSA</option>
                                                                                <option value="lsbe">LSBE</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                {/* please don't remove this div unless you are adding multiple questions here*/}
                                                                <div style={{ height: 'auto !important', minHeight: '120px' }}><span>   </span></div>

                                                            </TabPane>

                                                            <TabPane tabId="2" id="csa">
                                                                <Row>
                                                                    <Col md="6">
                                                                        <Label><h6><u><b>CSA Program</b></u></h6></Label>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup>
                                                                            <Label for="csa_mt_num">CSA Flashcard being run</Label> <span class="errorMessage">{this.state.errors["csa_flashcard"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "csa_flashcard")} value={this.state.csa_flashcard} name="csa_flashcard" id="csa_flashcard">
                                                                                <option value="one">1</option>
                                                                                <option value="two">2</option>
                                                                                <option value="three">3</option>
                                                                                <option value="four">4</option>
                                                                                <option value="five">5</option>
                                                                                <option value="six">6</option>
                                                                                <option value="seven">7</option>
                                                                                <option value="eight">8</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_csa_prompts" >Master Trainer is using the prompts provided in the CSA flashcard guide<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_prompts" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_prompts")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_prompts" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_csa_prompts")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_prompts" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_prompts")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_prompts" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_prompts")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_prompts" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_prompts")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_csa_prompts"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_csa_flashcard_objective" >Master Trainer is meeting the objective of their flashcard even if they are not using all prompts provided in the CSA flashcard guide<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_flashcard_objective" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_flashcard_objective")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_flashcard_objective" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_csa_flashcard_objective")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_flashcard_objective" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_flashcard_objective")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_flashcard_objective" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_flashcard_objective")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_flashcard_objective" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_flashcard_objective")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_csa_flashcard_objective"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_csa_understanding" >Master Trainer shows good understanding of the message of the flashcard<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_understanding" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_understanding")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_understanding" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_csa_understanding")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_understanding" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_understanding")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_understanding" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_understanding")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_understanding" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_understanding")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_csa_understanding"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_csa_subject_comfort" >Master Trainer is comfortable speaking about this subject<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_subject_comfort" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_subject_comfort")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_subject_comfort" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_csa_subject_comfort")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_subject_comfort" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_subject_comfort")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_subject_comfort" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_subject_comfort")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_subject_comfort" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_subject_comfort")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_csa_subject_comfort"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_csa_nonjudmental_tone" >Master Trainer uses a non-judgmental tone while facilitating the session<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_nonjudmental_tone" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_nonjudmental_tone")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_nonjudmental_tone" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_csa_nonjudmental_tone")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_nonjudmental_tone" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_nonjudmental_tone")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_nonjudmental_tone" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_nonjudmental_tone")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_nonjudmental_tone" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_nonjudmental_tone")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_csa_nonjudmental_tone"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_csa_impartial_opinions" >Master Trainer is not imposing their own values or opinions on the participants<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_impartial_opinions" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_impartial_opinions")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_impartial_opinions" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_csa_impartial_opinions")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_impartial_opinions" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_impartial_opinions")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_impartial_opinions" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_impartial_opinions")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_impartial_opinions" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_impartial_opinions")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_csa_impartial_opinions"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_csa_probing_style" >Master Trainer is leading participants to the main message of the flashcard through probes and not providing the message to participants in a lecture style presentation<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_probing_style" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_probing_style")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_probing_style" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_csa_probing_style")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_probing_style" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_probing_style")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_probing_style" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_probing_style")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_probing_style" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_probing_style")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_csa_probing_style"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row >
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="mt_mock_score" style={{ color: "green" }}><b>Cumulative MT Mock Session Score</b></Label>
                                                                            <Input value={this.state.mt_mock_score} name="mt_mock_score" id="mt_mock_score" onChange={(e) => { this.inputChange(e, "mt_mock_score") }} readOnly></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="mt_mock_score_pct" style={{ color: "green" }}><b>% Score</b></Label>
                                                                            <Input name="mt_mock_score_pct" id="mt_mock_score_pct" value={this.state.mt_mock_score_pct} onChange={(e) => { this.inputChange(e, "mt_mock_score_pct") }} readOnly></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                            </TabPane>

                                                            <TabPane tabId="3" id="lsbe">
                                                                <Row>
                                                                    <Col md="6">

                                                                        <Label><h6><u><b>LSBE Program</b></u></h6></Label>

                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="mt_lsbe_level" >Level Master Trainer is facilitating</Label> <span class="errorMessage">{this.state.errors["mt_lsbe_level"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "mt_lsbe_level")} value={this.state.mt_lsbe_level} name="mt_lsbe_level" id="mt_lsbe_level" >
                                                                                <option value="level_1">Level 1</option>
                                                                                <option value="level_2">Level 2</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={level1Style}>
                                                                        <FormGroup >
                                                                            <Label for="mt_lsbe_level_1" >Subject Master Trainer is facilitating</Label> <span class="errorMessage">{this.state.errors["mt_lsbe_level_1"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "mt_lsbe_level_1")} value={this.state.mt_lsbe_level_1} name="mt_lsbe_level_1" id="mt_lsbe_level_1" >

                                                                                <option value="communication">Communication</option>
                                                                                <option value="values">Values</option>
                                                                                <option value="gender">Gender</option>
                                                                                <option value="self_protection">Self-Protection</option>
                                                                                <option value="peer_pressure">Peer Pressure</option>
                                                                                <option value="puberty">Puberty</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={level2Style}>
                                                                        <FormGroup >
                                                                            <Label for="mt_lsbe_level_2" >Subject Master Trainer is facilitating</Label> <span class="errorMessage">{this.state.errors["mt_lsbe_level_2"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "mt_lsbe_level_2")} value={this.state.mt_lsbe_level_2} name="mt_lsbe_level_2" id="mt_lsbe_level_2" >

                                                                                <option value="effective_communication">Effective Communication</option>
                                                                                <option value="gender">Gender</option>
                                                                                <option value="puberty">Puberty</option>
                                                                                <option value="youth_family">Youth and Family</option>
                                                                                <option value="maternal_child_health">Maternal and Child Health</option>
                                                                                <option value="hiv_aids">HIV/AIDS</option>
                                                                                <option value="violence">Violence</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>


                                                                <Row>
                                                                    <Col md="12" style={level1CommunicationStyle}>
                                                                        <FormGroup >
                                                                            <Label for="imp_communication" >Master Trainer was able to effectively relay the importance of communication <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="imp_communication" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "imp_communication")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="imp_communication" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "imp_communication")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="imp_communication" id="neither" value="3" onChange={(e) => this.scoreChange(e, "imp_communication")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="imp_communication" id="agree" value="4" onChange={(e) => this.scoreChange(e, "imp_communication")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="imp_communication" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "imp_communication")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["imp_communication"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={level1ValuesStyle}>
                                                                        <FormGroup >
                                                                            <Label for="def_values" >Master Trainer was able to effectively define values</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="def_values" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "def_values")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="def_values" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "def_values")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="def_values" id="neither" value="3" onChange={(e) => this.scoreChange(e, "def_values")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="def_values" id="agree" value="4" onChange={(e) => this.scoreChange(e, "def_values")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="def_values" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "def_values")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["def_values"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={level1GenderStyle}>
                                                                        <FormGroup >
                                                                            <Label for="diff_sex_gender" >Master Trainer was able to correctly differentiate between sex and gender</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="diff_sex_gender" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "diff_sex_gender")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="diff_sex_gender" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "diff_sex_gender")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="diff_sex_gender" id="neither" value="3" onChange={(e) => this.scoreChange(e, "diff_sex_gender")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="diff_sex_gender" id="agree" value="4" onChange={(e) => this.scoreChange(e, "diff_sex_gender")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="diff_sex_gender" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "diff_sex_gender")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["diff_sex_gender"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={level1SelfStyle}>
                                                                        <FormGroup >
                                                                            <Label for="explain_self_protection" >Master Trainer was able to correctly explain methods of self-protection</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_self_protection" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "explain_self_protection")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_self_protection" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "explain_self_protection")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_self_protection" id="neither" value="3" onChange={(e) => this.scoreChange(e, "explain_self_protection")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_self_protection" id="agree" value="4" onChange={(e) => this.scoreChange(e, "explain_self_protection")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_self_protection" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "explain_self_protection")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["explain_self_protection"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={level1PeerStyle}>
                                                                        <FormGroup >
                                                                            <Label for="explain_peer_pressure" >Master Trainer was able to correctly explain peer pressure and its impacts</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_peer_pressure" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "explain_peer_pressure")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_peer_pressure" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "explain_peer_pressure")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_peer_pressure" id="neither" value="3" onChange={(e) => this.scoreChange(e, "explain_peer_pressure")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_peer_pressure" id="agree" value="4" onChange={(e) => this.scoreChange(e, "explain_peer_pressure")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_peer_pressure" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "explain_peer_pressure")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["explain_peer_pressure"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={level1PubertyStyle}>
                                                                        <FormGroup >
                                                                            <Label for="explain_puberty" >Master Trainer was able to clearly explain changes that occur during puberty for boys and girls</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_puberty" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "explain_puberty")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_puberty" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "explain_puberty")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_puberty" id="neither" value="3" onChange={(e) => this.scoreChange(e, "explain_puberty")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_puberty" id="agree" value="4" onChange={(e) => this.scoreChange(e, "explain_puberty")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_puberty" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "explain_puberty")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["explain_puberty"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup style={level2EffectiveStyle}>
                                                                            <Label for="imp_communicaton_l2" >Master Trainer was able to effectively relay the importance of communication</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="imp_communicaton_l2" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "imp_communicaton_l2")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="imp_communicaton_l2" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "imp_communicaton_l2")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="imp_communicaton_l2" id="neither" value="3" onChange={(e) => this.scoreChange(e, "imp_communicaton_l2")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="imp_communicaton_l2" id="agree" value="4" onChange={(e) => this.scoreChange(e, "imp_communicaton_l2")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="imp_communicaton_l2" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "imp_communicaton_l2")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["imp_communicaton_l2"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={level2EffectiveStyle}>
                                                                        <FormGroup >
                                                                            <Label for="describe_communication_comp" >Master Trainer has effectively described the different components of communication and their importance</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_communication_comp" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "describe_communication_comp")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_communication_comp" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "describe_communication_comp")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_communication_comp" id="neither" value="3" onChange={(e) => this.scoreChange(e, "describe_communication_comp")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_communication_comp" id="agree" value="4" onChange={(e) => this.scoreChange(e, "describe_communication_comp")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_communication_comp" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "describe_communication_comp")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["describe_communication_comp"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={level2GenderStyle}>
                                                                        <FormGroup >
                                                                            <Label for="diff_sex_gender_l2" >Master Trainer was able to correctly differentiate between sex and gender</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="diff_sex_gender_l2" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "diff_sex_gender_l2")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="diff_sex_gender_l2" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "diff_sex_gender_l2")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="diff_sex_gender_l2" id="neither" value="3" onChange={(e) => this.scoreChange(e, "diff_sex_gender_l2")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="diff_sex_gender_l2" id="agree" value="4" onChange={(e) => this.scoreChange(e, "diff_sex_gender_l2")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="diff_sex_gender_l2" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "diff_sex_gender_l2")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["diff_sex_gender_l2"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={level2GenderStyle}>
                                                                        <FormGroup >
                                                                            <Label for="explain_gender_norm_sterotypes" >Master Trainer has clearly explained gender norms and stereotypes and their impact</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_gender_norm_sterotypes" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "explain_gender_norm_sterotypes")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_gender_norm_sterotypes" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "explain_gender_norm_sterotypes")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_gender_norm_sterotypes" id="neither" value="3" onChange={(e) => this.scoreChange(e, "explain_gender_norm_sterotypes")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_gender_norm_sterotypes" id="agree" value="4" onChange={(e) => this.scoreChange(e, "explain_gender_norm_sterotypes")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_gender_norm_sterotypes" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "explain_gender_norm_sterotypes")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["explain_gender_norm_sterotypes"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={level2GenderStyle}>
                                                                        <FormGroup >
                                                                            <Label for="gender_discrimination_impact" >Master Trainer has accurately described gender discrimination and its impact</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_discrimination_impact" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_discrimination_impact")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_discrimination_impact" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_discrimination_impact")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_discrimination_impact" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_discrimination_impact")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_discrimination_impact" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_discrimination_impact")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_discrimination_impact" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_discrimination_impact")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_discrimination_impact"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={level2PubertyStyle}>
                                                                        <FormGroup >
                                                                            <Label for="explain_puberty_l2" >Master Trainer was able to clearly explain changes that occur during puberty for boys and girls</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_puberty_l2" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "explain_puberty_l2")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_puberty_l2" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "explain_puberty_l2")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_puberty_l2" id="neither" value="3" onChange={(e) => this.scoreChange(e, "explain_puberty_l2")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_puberty_l2" id="agree" value="4" onChange={(e) => this.scoreChange(e, "explain_puberty_l2")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="explain_puberty_l2" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "explain_puberty_l2")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["explain_puberty_l2"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={level2PubertyStyle}>
                                                                        <FormGroup >
                                                                            <Label for="myths_puberty" >Master Trainer has clearly explained and dispelled myths related to puberty in both boys and girls</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="myths_puberty" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "myths_puberty")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="myths_puberty" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "myths_puberty")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="myths_puberty" id="neither" value="3" onChange={(e) => this.scoreChange(e, "myths_puberty")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="myths_puberty" id="agree" value="4" onChange={(e) => this.scoreChange(e, "myths_puberty")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="myths_puberty" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "myths_puberty")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["myths_puberty"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={level2YouthStyle}>
                                                                        <FormGroup >
                                                                            <Label for="describe_nikah_nama" >Master Trainer has effectively described the nikah nama and its clauses</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_nikah_nama" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "describe_nikah_nama")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_nikah_nama" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "describe_nikah_nama")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_nikah_nama" id="neither" value="3" onChange={(e) => this.scoreChange(e, "describe_nikah_nama")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_nikah_nama" id="agree" value="4" onChange={(e) => this.scoreChange(e, "describe_nikah_nama")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_nikah_nama" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "describe_nikah_nama")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["describe_nikah_nama"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={level2MaternalStyle}>
                                                                        <FormGroup >
                                                                            <Label for="descibe_maternal_mortality" >Master Trainer has accurately described the causes of maternal mortality</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="descibe_maternal_mortality" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "descibe_maternal_mortality")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="descibe_maternal_mortality" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "descibe_maternal_mortality")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="descibe_maternal_mortality" id="neither" value="3" onChange={(e) => this.scoreChange(e, "descibe_maternal_mortality")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="descibe_maternal_mortality" id="agree" value="4" onChange={(e) => this.scoreChange(e, "descibe_maternal_mortality")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="descibe_maternal_mortality" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "descibe_maternal_mortality")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["descibe_maternal_mortality"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={level2MaternalStyle}>
                                                                        <FormGroup >
                                                                            <Label for="link_age_maternal_health" >Master Trainer has clearly linked early age marriage with negative consequences in maternal health</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="link_age_maternal_health" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "link_age_maternal_health")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="link_age_maternal_health" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "link_age_maternal_health")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="link_age_maternal_health" id="neither" value="3" onChange={(e) => this.scoreChange(e, "link_age_maternal_health")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="link_age_maternal_health" id="agree" value="4" onChange={(e) => this.scoreChange(e, "link_age_maternal_health")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="link_age_maternal_health" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "link_age_maternal_health")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["link_age_maternal_health"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={level2HivStyle}>
                                                                        <FormGroup >
                                                                            <Label for="describe_hiv" >Master Trainer has correctly described HIV</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_hiv" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "describe_hiv")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_hiv" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "describe_hiv")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_hiv" id="neither" value="3" onChange={(e) => this.scoreChange(e, "describe_hiv")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_hiv" id="agree" value="4" onChange={(e) => this.scoreChange(e, "describe_hiv")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_hiv" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "describe_hiv")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["describe_hiv"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={level2HivStyle}>
                                                                        <FormGroup >
                                                                            <Label for="describe_hiv_transmission" >Master Trainer has correctly described the modes of transmission of HIV</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_hiv_transmission" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "describe_hiv_transmission")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_hiv_transmission" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "describe_hiv_transmission")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_hiv_transmission" id="neither" value="3" onChange={(e) => this.scoreChange(e, "describe_hiv_transmission")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_hiv_transmission" id="agree" value="4" onChange={(e) => this.scoreChange(e, "describe_hiv_transmission")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_hiv_transmission" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "describe_hiv_transmission")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["describe_hiv_transmission"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={level2HivStyle}>
                                                                        <FormGroup >
                                                                            <Label for="describe_hiv_prevention" >Master Trainer has correctly described HIV prevention strategies</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_hiv_prevention" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "describe_hiv_prevention")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_hiv_prevention" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "describe_hiv_prevention")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_hiv_prevention" id="neither" value="3" onChange={(e) => this.scoreChange(e, "describe_hiv_prevention")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_hiv_prevention" id="agree" value="4" onChange={(e) => this.scoreChange(e, "describe_hiv_prevention")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_hiv_prevention" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "describe_hiv_prevention")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["describe_hiv_prevention"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={level2ViolenceStyle}>
                                                                        <FormGroup >
                                                                            <Label for="describe_violence_types" >Master Trainer has correctly described the different types of violence</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_violence_types" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "describe_violence_types")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_violence_types" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "describe_violence_types")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_violence_types" id="neither" value="3" onChange={(e) => this.scoreChange(e, "describe_violence_types")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_violence_types" id="agree" value="4" onChange={(e) => this.scoreChange(e, "describe_violence_types")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_violence_types" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "describe_violence_types")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["describe_violence_types"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={level2ViolenceStyle}>
                                                                        <FormGroup >
                                                                            <Label for="describe_violence_imapct" >Master Trainer has effectively described the impact of violence on an individual’s life</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_violence_imapct" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "describe_violence_imapct")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_violence_imapct" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "describe_violence_imapct")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_violence_imapct" id="neither" value="3" onChange={(e) => this.scoreChange(e, "describe_violence_imapct")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_violence_imapct" id="agree" value="4" onChange={(e) => this.scoreChange(e, "describe_violence_imapct")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="describe_violence_imapct" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "describe_violence_imapct")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["describe_violence_imapct"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_lsbe_prompts" >Master Trainer is actively using the training guide to aid in facilitation of content <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_prompts" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_prompts")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_prompts" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_lsbe_prompts")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_prompts" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_prompts")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_prompts" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_prompts")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_prompts" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_prompts")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_lsbe_prompts"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_lsbe_understanding" >Master Trainer demonstrates good understanding of the training content <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_understanding" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_understanding")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_understanding" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_lsbe_understanding")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_understanding" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_understanding")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_understanding" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_understanding")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_understanding" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_understanding")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_lsbe_understanding"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_material_prep" >Master Trainer had all materials prepared in advance for the session <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_material_prep" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_material_prep")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_material_prep" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_material_prep")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_material_prep" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_material_prep")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_material_prep" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_material_prep")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_material_prep" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_material_prep")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_material_prep"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_content_prep" >Master Trainer was well prepared in their facilitation of the content <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_content_prep" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_content_prep")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_content_prep" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_content_prep")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_content_prep" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_content_prep")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_content_prep" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_content_prep")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_content_prep" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_content_prep")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_content_prep"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_activity_time_allotment" >An appropriate amount of time is allotted to each activity and topic <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_activity_time_allotment" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_activity_time_allotment")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_activity_time_allotment" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_activity_time_allotment")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_activity_time_allotment" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_activity_time_allotment")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_activity_time_allotment" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_activity_time_allotment")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_activity_time_allotment" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_activity_time_allotment")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_activity_time_allotment"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_lsbe_subject_comfort" >Master Trainer is comfortable speaking about this subject <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_subject_comfort" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_subject_comfort" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_subject_comfort" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_subject_comfort" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_subject_comfort" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_lsbe_subject_comfort"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_lsbe_nonjudmental_tone" >Master Trainer uses a non-judgmental tone while facilitating the session <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_lsbe_nonjudmental_tone"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_lsbe_impartial_opinions" >Master Trainer is not imposing their own values or opinions on the participants <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_impartial_opinions" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_impartial_opinions" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_impartial_opinions" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_impartial_opinions" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_impartial_opinions" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_lsbe_impartial_opinions"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_lsbe_probing_style" >Master Trainer is engaging participants in discussion throughout session by providing probes <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_probing_style" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_probing_style")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_probing_style" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_lsbe_probing_style")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_probing_style" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_probing_style")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_probing_style" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_probing_style")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_probing_style" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_probing_style")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_lsbe_probing_style"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>


                                                                <Row >
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="mt_mock_score" style={{ color: "green" }}><b>Cumulative MT Mock Session Score</b></Label>
                                                                            <Input value={this.state.mt_mock_score} name="mt_mock_score" id="mt_mock_score" onChange={(e) => { this.inputChange(e, "mt_mock_score") }} readOnly></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">

                                                                            <Label for="mt_mock_score_pct" style={{ color: "green" }}><b>% Score</b></Label>
                                                                            <Input name="mt_mock_score_pct" id="mt_mock_score_pct" value={this.state.mt_mock_score_pct} onChange={(e) => { this.inputChange(e, "mt_mock_score_pct") }} readOnly></Input>
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
                                                            {/* <div className="btn-actions-pane-left"> */}
                                                            <ButtonGroup size="sm">
                                                                <Button color="secondary" id="page1"
                                                                    className={"btn-shadow " + classnames({ active: this.state.activeTab === '1' })}
                                                                    onClick={() => {
                                                                        this.toggleTab('1');
                                                                    }}
                                                                >Form</Button>
                                                                <Button color="secondary" id="page_csa_a" style={csaStyle}
                                                                    className={"btn-shadow " + classnames({ active: this.state.activeTab === '2' })}
                                                                    onClick={() => {
                                                                        this.toggleTab('2');
                                                                    }}
                                                                >CSA</Button>
                                                                <Button color="secondary" id="page_csa_b" style={lsbeStyle}
                                                                    className={"btn-shadow " + classnames({ active: this.state.activeTab === '3' })}
                                                                    onClick={() => {
                                                                        this.toggleTab('3');
                                                                    }}
                                                                >LSBE</Button>
                                                            </ButtonGroup>
                                                            {/* </div> */}
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

export default MasterTrainerMockSessionEvaluation;