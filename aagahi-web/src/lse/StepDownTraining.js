/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-16 17:32:02
 * @modify date 2019-08-16 17:32:05
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
import { getDefinitionByDefinitionId, getDefinitionsByDefinitionType, getFormDataById, getFormTypeByUuid, getLocationAttributesByLocation, getLocationsByCategory, getParticipantsByLocation, getRoleByName, getUsersByRole } from "../service/GetService";
import { saveFormData, updateFormData } from "../service/PostService";
import { clearCheckedFields, getIndicatorCode, getObject, loadFormState } from "../util/AahungUtil.js";
import * as Constants from "../util/Constants";
import { getDistrictsByProvince, location } from "../util/LocationUtil.js";
import FormNavBar from "../widget/FormNavBar";
import LoadingIndicator from "../widget/LoadingIndicator";
import { UserService } from '../service/UserService';

const csaSubjectOptions = [
    { value: 'health', label: 'Health' },
    { value: 'gender', label: 'Gender' },
    { value: 'csa', label: 'CSA' },
    { value: 'implementation_feedback', label: 'Implementation Feedback' },
];

const lsbeSubjectOptions = [
    { value: 'vcat', label: 'VCAT' },
    { value: 'human_rights', label: 'Human Rights' },
    { value: 'gender_equality', label: 'Gender Equality' },
    { value: 'sexual_health_rights', label: 'Sexual Health and Rights' },
    { value: 'violence', label: 'Violence' },
    { value: 'puberty', label: 'Puberty' },
    { value: 'implementation_feedback', label: 'Implementation Feedback' },
];

class StepDownTraining extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            schools: [],
            monitors: [],
            participants: [],
            participant_id: '',
            participant_name: '',
            csa_prompts: '',
            subject_taught: [], // all the form elements states are in underscore notation i.e variable names in codebook
            subject_taught_other: '',
            teaching_years: '',
            education_level: 'no_edu',
            program_type: '',
            school_level: '',
            donor_name: '',
            activeTab: '1',
            isCsaSubjectHealth: false,
            isCsaSubjectGender: false,
            isCsaSubjectCsa: false,
            isCsaSubjectImpl: false,
            isLsbeSubjectVcat: false,
            isLsbeSubjectHuman: false,
            isLsbeSubjectGender: false,
            isLsbeSubjectSexual: false,
            isLsbeSubjectViolence: false,
            isLsbeSubjectPuberty: false,
            isLsbeSubjectImpl: false,
            page2Show: true,
            viewMode: false,
            isCsa: true,
            isGender: false,
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
        this.scoreChange = this.scoreChange.bind(this);
        this.inputChange = this.inputChange.bind(this);

        this.programType = '';
        this.score = 0;
        this.totalScore = 0;
        this.scoreArray = [];

        this.formTypeId = 0;
        this.csaRequiredFields = ["date_start", "district", "program_type", "province", "school_id", "school_name", "monitor", "csa_mt_count",
            "participant_name", "mt_csa_subject", "mt_csa_prompts", "mt_csa_understanding",
            "mt_csa_material_prep", "mt_csa_content_prep", "mt_csa_activity_time_allotment", "mt_csa_subject_comfort", "mt_csa_nonjudmental_tone",
            "mt_csa_impartial_opinions", "mt_csa_probing_style", "mt_csa_pts_engagement", "mt_csa_pts_attention", "mt_sd_training_score", "mt_sd_training_score_pct"]
        this.csaDependantFields = [];

        this.lsbeRequiredFields = ["date_start", "district", "program_type", "province", "school_id", "school_name", "monitor", "lsbe_mt_count", "participant_name",
            "mt_lsbe_subject", "mt_lsbe_prompts", "mt_lsbe_understanding", "mt_lsbe_material_prep", "mt_lsbe_content_prep",
            "mt_lsbe_activity_time_allotment", "mt_lsbe_subject_comfort", "mt_lsbe_nonjudmental_tone", "mt_lsbe_impartial_opinions",
            "mt_lsbe_probing_style", "mt_lsbe_pts_engagement", "mt_lsbe_pts_attention", "mt_sd_training_score", "mt_sd_training_score_pct"];
        this.lsbeDependantFields = [];
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
            let formTypeObj = await getFormTypeByUuid(Constants.STEP_DOWN_FORM_UUID);
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
                    this.fetchedForm.data.map(function (element) {
                        var dataType = (element.dataType).toLowerCase();
                        if (dataType === 'int') {
                            
                            var radios = document.getElementsByName(element.key.shortName);
                            for (let i = 0; i < radios.length; i++) { 
                                // Edits are painful!!
                                // check type should be "radio", otherwise there will many fields with datatype 'int' but widget would be numeric input box 
                                if (radios[i].type === "radio" && parseInt(radios[i].value) === parseInt(String(element.value))) {
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
            else {
                this.setState({ program_type: "csa" });
                this.programType = "csa";
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

    editUpdateDisplay() {
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

        if (this.state.mt_csa_subject !== undefined && this.state.mt_csa_subject.length > 0) {
            // checking twice because when another value is selected and other is unchecked, it still does not change the state
            if (getObject('health', this.state.mt_csa_subject, 'value') != -1) {
                this.setState({ isCsaSubjectHealth: true });
            }
            if (getObject('health', this.state.mt_csa_subject, 'value') === -1) {
                this.setState({ isCsaSubjectHealth: false });
            }

            if (getObject('gender', this.state.mt_csa_subject, 'value') != -1) {
                this.setState({ isCsaSubjectGender: true });
            }
            if (getObject('gender', this.state.mt_csa_subject, 'value') === -1) {
                this.setState({ isCsaSubjectGender: false });
            }

            if (getObject('csa', this.state.mt_csa_subject, 'value') != -1) {
                this.setState({ isCsaSubjectCsa: true });
            }
            if (getObject('csa', this.state.mt_csa_subject, 'value') === -1) {
                this.setState({ isCsaSubjectCsa: false });
            }

            if (getObject('implementation_feedback', this.state.mt_csa_subject, 'value') != -1) {
                this.setState({ isCsaSubjectImpl: true });
            }
            if (getObject('implementation_feedback', this.state.mt_csa_subject, 'value') === -1) {
                this.setState({ isCsaSubjectImpl: false });
            }

        }

        if (this.state.mt_lsbe_subject !== undefined && this.state.mt_lsbe_subject.length > 0) {
            // checking twice because when another value is selected and other is unchecked, it still does not change the state
            if (getObject('vcat', this.state.mt_lsbe_subject, 'value') != -1) {
                this.setState({ isLsbeSubjectVcat: true });
            }
            if (getObject('vcat', this.state.mt_lsbe_subject, 'value') === -1) {
                this.setState({ isLsbeSubjectVcat: false });
            }

            if (getObject('human_rights', this.state.mt_lsbe_subject, 'value') != -1) {
                this.setState({ isLsbeSubjectHuman: true });
            }
            if (getObject('human_rights', this.state.mt_lsbe_subject, 'value') === -1) {
                this.setState({ isLsbeSubjectHuman: false });
            }

            if (getObject('gender_equality', this.state.mt_lsbe_subject, 'value') != -1) {
                this.setState({ isLsbeSubjectGender: true });
            }
            if (getObject('gender_equality', this.state.mt_lsbe_subject, 'value') === -1) {
                this.setState({ isLsbeSubjectGender: false });
            }

            if (getObject('sexual_health_rights', this.state.mt_lsbe_subject, 'value') != -1) {
                this.setState({ isLsbeSubjectSexual: true });
            }
            if (getObject('sexual_health_rights', this.state.mt_lsbe_subject, 'value') === -1) {
                this.setState({ isLsbeSubjectSexual: false });
            }

            if (getObject('violence', this.state.mt_lsbe_subject, 'value') != -1) {
                this.setState({ isLsbeSubjectViolence: true });
            }
            if (getObject('violence', this.state.mt_lsbe_subject, 'value') === -1) {
                this.setState({ isLsbeSubjectViolence: false });
            }

            if (getObject('puberty', this.state.mt_lsbe_subject, 'value') != -1) {
                this.setState({ isLsbeSubjectPuberty: true });
            }
            if (getObject('puberty', this.state.mt_lsbe_subject, 'value') === -1) {
                this.setState({ isLsbeSubjectPuberty: false });
            }

            if (getObject('implementation_feedback', this.state.mt_lsbe_subject, 'value') != -1) {
                this.setState({ isLsbeSubjectImpl: true });
            }
            if (getObject('implementation_feedback', this.state.mt_lsbe_subject, 'value') === -1) {
                this.setState({ isLsbeSubjectImpl: false });
            }
        }
    }

    updateDisplay() {

        this.setState({
            // school_sex:'girls',
            // class_sex:'girls',
            secondary_grade: '6',
            lsbe_level_monitored: 'level_1',
            lsbe_level_1: 'self_awareness',
            lsbe_level_2: 'human_rights',
            lsbe_challenge_1_status: 'resolved',
            lsbe_challenge_2_status: 'resolved',
            lsbe_challenge_3_status: 'resolved',
            lsbe_challenge_4_status: 'resolved',
            lsbe_challenge_5_status: 'resolved',
            lsbe_challenge_6_status: 'resolved',
            lsbe_chapter_revision: 'revision',
            lsbe_class_frequency: 'weekly',
            isCsaSubjectHealth: false, // updating values for form reset (hiding all skip logic based questions)
            isCsaSubjectGender: false,
            isCsaSubjectCsa: false,
            isCsaSubjectImpl: false,
            isLsbeSubjectVcat: false,
            isLsbeSubjectHuman: false,
            isLsbeSubjectGender: false,
            isLsbeSubjectSexual: false,
            isLsbeSubjectViolence: false,
            isLsbeSubjectPuberty: false,
            isLsbeSubjectImpl: false
        })

    }

    beforeunload(e) {
        e.preventDefault();
        e.returnValue = true;
    }

    cancelCheck = () => {

        console.log(" ============================================================= ");
        if (this.programType === "csa") {
            this.resetForm(this.csaRequiredFields);
            this.resetForm(this.csaDependantFields);
        }
        else if (this.programType === "lsbe") {
            this.resetForm(this.lsbeRequiredFields);
            this.resetForm(this.lsbeDependantFields);
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

        if (name === "program_type") {
            this.errors = {};
            this.setState({ errors: this.errors });
            this.state.hasError = false;

            if (e.target.value === "csa") {
                this.programType = "csa";
            }
            else if (e.target.value === "lsbe") {
                this.programType = "lsbe";
            }
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
            mt_sd_training_score: this.score,
            mt_sd_training_score_pct: percent
        })
    }

    // for multi select
    valueChangeMulti(e, name) {

        console.log(e);
        this.setState({
            [name]: e
        });

        if (name === "mt_csa_subject") {
            // checking twice because when another value is selected and other is unchecked, it still does not change the state
            if (getObject('health', e, 'value') != -1) {
                this.setState({ isCsaSubjectHealth: true });
            }
            if (getObject('health', e, 'value') == -1) {
                this.setState({ isCsaSubjectHealth: false });
            }


            if (getObject('gender', e, 'value') != -1) {
                this.setState({ isCsaSubjectGender: true });
            }
            if (getObject('gender', e, 'value') == -1) {
                this.setState({ isCsaSubjectGender: false });
            }

            if (getObject('csa', e, 'value') != -1) {
                this.setState({ isCsaSubjectCsa: true });
            }
            if (getObject('csa', e, 'value') == -1) {
                this.setState({ isCsaSubjectCsa: false });
            }

            if (getObject('implementation_feedback', e, 'value') != -1) {
                this.setState({ isCsaSubjectImpl: true });
            }
            if (getObject('implementation_feedback', e, 'value') == -1) {
                this.setState({ isCsaSubjectImpl: false });
            }

        }

        if (name === "mt_lsbe_subject") {
            // checking twice because when another value is selected and other is unchecked, it still does not change the state
            if (getObject('vcat', e, 'value') != -1) {
                this.setState({ isLsbeSubjectVcat: true });
            }
            if (getObject('vcat', e, 'value') == -1) {
                this.setState({ isLsbeSubjectVcat: false });
            }

            if (getObject('human_rights', e, 'value') != -1) {
                this.setState({ isLsbeSubjectHuman: true });
            }
            if (getObject('human_rights', e, 'value') == -1) {
                this.setState({ isLsbeSubjectHuman: false });
            }

            if (getObject('gender_equality', e, 'value') != -1) {
                this.setState({ isLsbeSubjectGender: true });
            }
            if (getObject('gender_equality', e, 'value') == -1) {
                this.setState({ isLsbeSubjectGender: false });
            }

            if (getObject('sexual_health_rights', e, 'value') != -1) {
                this.setState({ isLsbeSubjectSexual: true });
            }
            if (getObject('sexual_health_rights', e, 'value') == -1) {
                this.setState({ isLsbeSubjectSexual: false });
            }

            if (getObject('violence', e, 'value') != -1) {
                this.setState({ isLsbeSubjectViolence: true });
            }
            if (getObject('violence', e, 'value') == -1) {
                this.setState({ isLsbeSubjectViolence: false });
            }

            if (getObject('puberty', e, 'value') != -1) {
                this.setState({ isLsbeSubjectPuberty: true });
            }
            if (getObject('puberty', e, 'value') == -1) {
                this.setState({ isLsbeSubjectPuberty: false });
            }

            if (getObject('implementation_feedback', e, 'value') != -1) {
                this.setState({ isLsbeSubjectImpl: true });
            }
            if (getObject('implementation_feedback', e, 'value') == -1) {
                this.setState({ isLsbeSubjectImpl: false });
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

        if (name === "province") {
            let districts = getDistrictsByProvince(e.id); // sending province integer id
            console.log(districts);
            this.setState({
                districtArray: districts
            })
        }

        try {
            if (name === "school_id") {
                // if (this.locationObj != null && this.locationObj != undefined) {
                this.setState({
                    school_name: e.locationName
                })
                // }
                let attributes = await getLocationAttributesByLocation(e.uuid);
                this.autopopulateFields(attributes);

                let participants = await getParticipantsByLocation(e.uuid, false);
                if (participants != null && participants.length > 0) {
                    this.setState({
                        participants: participants,
                        school_name: e.locationName,
                        participant_id: '',
                        participant_name: []
                    })
                }
                else {
                    this.setState({
                        participants: [],
                        participant_id: '',
                        participant_name: []
                    })
                }

            }
            if (name === "participant_name") {
                this.setState({
                    participant_id: e.identifier
                })
            }
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
                        if ('definitionId' in obj) {

                            // definitionArr contains only one item because filter will return only one definition
                            let definitionArr = definitionArray.filter(df => df.id == parseInt(obj.definitionId));
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

            this.setState({
                loading: true,
                loadingMsg: "Saving trees..."
            })

            var jsonData = new Object();
            jsonData.formParticipants = [];
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
                    // alert(fields[i]);

                    if (fields[i] === "monitor") {
                        dataObj.monitor = [];
                        // monitor
                        if ((this.state.monitor != null && this.state.monitor != undefined)) {
                            for (let i = 0; i < this.state.monitor.length; i++) {
                                dataObj.monitor.push({
                                    "userId": this.state.monitor[i].id
                                });
                            }
                        }
                        continue;
                    }

                    if (fields[i] === "mt_csa_subject") {
                        dataObj.mt_csa_subject = {};
                        dataObj.mt_csa_subject.values = [];
                        // generating multiselect for mt_csa_subject
                        if ((this.state.mt_csa_subject != null && this.state.mt_csa_subject != undefined)) {
                            for (let i = 0; i < this.state.mt_csa_subject.length; i++) {
                                dataObj.mt_csa_subject.values.push(String(this.state.mt_csa_subject[i].value));
                            }
                        }
                        continue;
                    }

                    if (fields[i] === "district") {
                        dataObj.district = this.state.district.label;
                        continue;
                    }

                    if (fields[i] === "province") {
                        dataObj.province = this.state.province.name;
                        continue;
                    }

                    var element = document.getElementById(fields[i]);
                    // alert(element);
                    if (element != null) {
                        if (element.offsetParent != null) { // this line is for checking if the element is visible on page
                            // alert("it's visible:   >>> value: " + element.value);
                            if (element.value != '')
                                dataObj[fields[i]] = element.value;
                        }
                        else if (this.csaDependantFields.filter(f => f == fields[i]).length == 0) {
                            if (element.value != '')
                                dataObj[fields[i]] = element.value;
                        }
                    }
                    else {
                        if (this.state[fields[i]] != undefined && this.state[fields[i]] != '') {
                            dataObj[fields[i]] = this.state[fields[i]];
                        }
                    }
                }
                console.log(dataObj);
            }

            // for lsbe
            if (this.programType === "lsbe") {
                var fields = this.lsbeRequiredFields.concat(this.lsbeDependantFields);
                for (let i = 0; i < fields.length; i++) {
                    // alert(fields[i]);
                    if (fields[i] === "monitor") {
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

                    if (fields[i] == "district") {
                        dataObj.district = this.state.district.label;
                        continue;
                    }

                    if (fields[i] == "province") {
                        dataObj.province = this.state.province.name;
                        continue;
                    }

                    if (fields[i] === "mt_lsbe_subject") {
                        dataObj.mt_lsbe_subject = {};
                        dataObj.mt_lsbe_subject.values = [];
                        // generating multiselect for mt_lsbe_subject
                        if ((this.state.mt_lsbe_subject != null && this.state.mt_lsbe_subject != undefined)) {
                            for (let i = 0; i < this.state.mt_lsbe_subject.length; i++) {
                                dataObj.mt_lsbe_subject.values.push(String(this.state.mt_lsbe_subject[i].value));
                            }
                        }
                        continue;
                    }

                    var element = document.getElementById(fields[i]);
                    // alert(element);
                    if (element != null) {
                        if (element.offsetParent != null) {
                            if (element.value != '')
                                dataObj[fields[i]] = element.value;
                        }
                        else if (this.lsbeDependantFields.filter(f => f == fields[i]).length === 0) {
                            if (element.value != '')
                                dataObj[fields[i]] = element.value;
                        }
                    }
                    else {
                        if (this.state[fields[i]] != undefined && this.state[fields[i]] != '') {
                            dataObj[fields[i]] = this.state[fields[i]];
                        }
                    }
                }
                console.log(dataObj);
            }

            // adding participant id
            dataObj.participant_id = this.state.participant_id;
            jsonData.formParticipants.push({
                "participantId": this.state.participant_name.id
            });
            jsonData.data = dataObj;
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

        this.state.isCsaSubjectHealth ? this.csaDependantFields.push("mt_def_sexual_health") : this.csaDependantFields = this.csaDependantFields.filter(e => e !== "mt_def_sexual_health");
        this.state.isCsaSubjectHealth ? this.csaDependantFields.push("pts_link_health_aspects") : this.csaDependantFields = this.csaDependantFields.filter(e => e !== "pts_link_health_aspects");
        this.state.isCsaSubjectGender ? this.csaDependantFields.push("pts_dif_sex_gender") : this.csaDependantFields = this.csaDependantFields.filter(e => e !== "pts_dif_sex_gender");
        this.state.isCsaSubjectGender ? this.csaDependantFields.push("pts_gender_norm_sterotype") : this.csaDependantFields = this.csaDependantFields.filter(e => e !== "pts_gender_norm_sterotype");
        this.state.isCsaSubjectCsa ? this.csaDependantFields.push("pts_def_csa") : this.csaDependantFields = this.csaDependantFields.filter(e => e !== "pts_def_csa");
        this.state.isCsaSubjectCsa ? this.csaDependantFields.push("pts_identify_csa") : this.csaDependantFields = this.csaDependantFields.filter(e => e !== "pts_identify_csa");
        this.state.isCsaSubjectCsa ? this.csaDependantFields.push("pts_prevention_csa") : this.csaDependantFields = this.csaDependantFields.filter(e => e !== "pts_prevention_csa");
        this.state.isCsaSubjectCsa ? this.csaDependantFields.push("mt_explain_csa_myth") : this.csaDependantFields = this.csaDependantFields.filter(e => e !== "mt_explain_csa_myth");
        this.state.isCsaSubjectCsa ? this.csaDependantFields.push("mt_csa_video_aid") : this.csaDependantFields = this.csaDependantFields.filter(e => e !== "mt_csa_video_aid");
        this.state.isCsaSubjectImpl ? this.csaDependantFields.push("mt_csa_constructive_feedback") : this.csaDependantFields = this.csaDependantFields.filter(e => e !== "mt_csa_constructive_feedback");

        this.state.isLsbeSubjectVcat ? this.lsbeDependantFields.push("mt_crossline_activity") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "mt_crossline_activity");
        this.state.isLsbeSubjectVcat ? this.lsbeDependantFields.push("mt_def_values") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "mt_def_values");
        this.state.isLsbeSubjectVcat ? this.lsbeDependantFields.push("pts_understand_values") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "pts_understand_values");
        this.state.isLsbeSubjectHuman ? this.lsbeDependantFields.push("mt_describe_human_rights") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "mt_describe_human_rights");
        this.state.isLsbeSubjectHuman ? this.lsbeDependantFields.push("pts_understand_human_rights") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "pts_understand_human_rights");
        this.state.isLsbeSubjectGender ? this.lsbeDependantFields.push("mt_diff_sex_gender") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "mt_diff_sex_gender");
        this.state.isLsbeSubjectGender ? this.lsbeDependantFields.push("pts_understand_gender_norm") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "pts_understand_gender_norm");
        this.state.isLsbeSubjectSexual ? this.lsbeDependantFields.push("mt_def_sexual_health_lsbe") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "mt_def_sexual_health_lsbe");
        this.state.isLsbeSubjectSexual ? this.lsbeDependantFields.push("pts_understand_health_links") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "pts_understand_health_links");
        this.state.isLsbeSubjectViolence ? this.lsbeDependantFields.push("mt_describe_violence_types") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "mt_describe_violence_types");
        this.state.isLsbeSubjectViolence ? this.lsbeDependantFields.push("mt_describe_violence_impact") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "mt_describe_violence_impact");
        this.state.isLsbeSubjectPuberty ? this.lsbeDependantFields.push("mt_explain_puberty") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "mt_explain_puberty");
        this.state.isLsbeSubjectPuberty ? this.lsbeDependantFields.push("mt_dispell_puberty_myths") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "mt_dispell_puberty_myths");
        this.state.isLsbeSubjectImpl ? this.lsbeDependantFields.push("mt_lsbe_constructive_feedback") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "mt_lsbe_constructive_feedback");
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
        this.errors = {};
        const errorText = "Required";
        for (let j = 0; j < requireds.length; j++) {

            let stateName = requireds[j];
            // for array object
            if (typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
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
                    if (typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                        isOk = false;
                        this.errors[dependants[j]] = errorText;
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
                if (typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                    isOk = false;
                    this.errors[dependants[j]] = errorText;
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

        fields.push("school_name", "participant_id");

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

        // in order to update the state of previous values (above), explicitly changing state of another variables. Yes, it Strange!
        this.setState({
            program_type: "csa",
            school_level: ""
        })
        this.programType = "csa";
        this.toggleTab('1');

        clearCheckedFields();
        this.updateDisplay();
    }

    // for modal
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }


    render() {

        const lsbeStyle = this.programType === "lsbe" ? {} : { display: 'none' };
        const csaStyle = this.programType === "csa" ? {} : { display: 'none' };

        // skip logic style for CSA 
        const csaHealthStyle = this.state.isCsaSubjectHealth ? {} : { display: 'none' };
        const csaGenderStyle = this.state.isCsaSubjectGender ? {} : { display: 'none' };
        const csaCsaStyle = this.state.isCsaSubjectCsa ? {} : { display: 'none' };
        const csaImplStyle = this.state.isCsaSubjectImpl ? {} : { display: 'none' };

        // skip logic style for LSBE 
        const lsbeVcatStyle = this.state.isLsbeSubjectVcat ? {} : { display: 'none' };
        const lsbeHumanStyle = this.state.isLsbeSubjectHuman ? {} : { display: 'none' };
        const lsbeGenderStyle = this.state.isLsbeSubjectGender ? {} : { display: 'none' };
        const lsbeSexualStyle = this.state.isLsbeSubjectSexual ? {} : { display: 'none' };
        const lsbeViolenceStyle = this.state.isLsbeSubjectViolence ? {} : { display: 'none' };
        const lsbePubertyStyle = this.state.isLsbeSubjectPuberty ? {} : { display: 'none' };
        const lsbeImplStyle = this.state.isLsbeSubjectImpl ? {} : { display: 'none' };

        // for view mode
        const setDisable = this.state.viewMode ? "disabled" : "";
        const { selectedOption } = this.state;
        // scoring labels
        const stronglyAgree = "Strongly Agree";
        const agree = "Agree";
        const neither = "Neither Agree nor Disagree";
        const stronglyDisagree = "Strongly Disagree";
        const disagree = "Disagree";

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
                                                    <b>Step Down Training Monitoring Form</b>
                                                    {/* <p style={{fontSize: "10px"}}>This is the form in the LSE component to be filled by LSE Monitors.</p> */}
                                                </CardHeader>
                                            </Card>
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
                                                    <fieldset >
                                                        <TabContent activeTab={this.state.activeTab}>
                                                            <TabPane tabId="1">
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup inline>
                                                                            <Label for="date_start" >Form Date<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                            <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => { this.inputChange(e, "date_start") }} max={moment().format("YYYY-MM-DD")} />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup>
                                                                            <Label for="province" >Province<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["province"]}</span>
                                                                            <Select id="province" name="province" value={this.state.province} onChange={(e) => this.handleChange(e, "province")} options={location.provinces} />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup>
                                                                            <Label for="district" >District<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["district"]}</span>
                                                                            <Select id="district" name="district" value={this.state.district} onChange={(e) => this.handleChange(e, "district")} options={this.state.districtArray} />
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_id" >School ID<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["school_id"]}</span>
                                                                            <Select id="school_id" name="school_id" value={this.state.school_id} onChange={(e) => this.handleChange(e, "school_id")} options={this.state.schools} />
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_name" >School Name<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["school_name"]}</span>
                                                                            <Input name="school_name" id="school_name" value={this.state.school_name} disabled />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="monitor" >Monitored By<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["monitor"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "monitor")} value={this.state.monitor} id="monitor" options={this.state.monitors} isMulti />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_level" >Level of Program</Label>
                                                                            <Input name="school_level" id="school_level" value={this.state.school_level} disabled />

                                                                        </FormGroup>

                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="program_type" >Type of Program</Label>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "program_type")} value={this.state.program_type} name="program_type" id="program_type" disabled={this.editMode}>
                                                                                <option value="csa">CSA</option>
                                                                                <option value="lsbe">LSBE</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>



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
                                                                            <Label for="csa_mt_count">Total Number of Master Trainers <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["csa_mt_count"]}</span>
                                                                            <Input type="number" value={this.state.csa_mt_count} name="csa_mt_count" id="csa_mt_count" onChange={(e) => { this.inputChange(e, "csa_mt_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2) }} placeholder="Enter in number"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup>
                                                                            <Label for="participant_name" >Name of Master Trainer <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["participant_name"]}</span>
                                                                            <Select id="participant_name"
                                                                                name="participant_name"
                                                                                value={this.state.participant_name}
                                                                                onChange={(e) => this.handleChange(e, "participant_name")}
                                                                                options={this.state.participants}
                                                                            />
                                                                        </FormGroup>
                                                                    </Col>


                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="participant_id" >Teacher ID</Label> <span class="errorMessage">{this.state.errors["participant_id"]}</span>
                                                                            <Input name="participant_id" id="participant_id" value={this.state.participant_id} disabled />
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="mt_csa_subject" >Subject Master Trainer is facilitating <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["mt_csa_subject"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "mt_csa_subject")} value={this.state.mt_csa_subject} id="mt_csa_subject" options={csaSubjectOptions} isMulti />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={csaHealthStyle}>
                                                                        <FormGroup >
                                                                            <Label for="mt_def_sexual_health" >Master Trainer is able to accurately define sexual health</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_def_sexual_health" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_def_sexual_health")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_def_sexual_health" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_def_sexual_health")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_def_sexual_health" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_def_sexual_health")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_def_sexual_health" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_def_sexual_health")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_def_sexual_health" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_def_sexual_health")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_def_sexual_health"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={csaHealthStyle}>
                                                                        <FormGroup >
                                                                            <Label for="pts_link_health_aspects" >Participants demonstrate an understanding of the three aspects of health and how they are interlinked</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_link_health_aspects" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "pts_link_health_aspects")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_link_health_aspects" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "pts_link_health_aspects")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_link_health_aspects" id="neither" value="3" onChange={(e) => this.scoreChange(e, "pts_link_health_aspects")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_link_health_aspects" id="agree" value="4" onChange={(e) => this.scoreChange(e, "pts_link_health_aspects")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_link_health_aspects" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "pts_link_health_aspects")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["pts_link_health_aspects"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={csaGenderStyle}>
                                                                        <FormGroup >
                                                                            <Label for="pts_dif_sex_gender" >Participants demonstrate understanding of the difference between sex and gender</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_dif_sex_gender" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "pts_dif_sex_gender")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_dif_sex_gender" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "pts_dif_sex_gender")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_dif_sex_gender" id="neither" value="3" onChange={(e) => this.scoreChange(e, "pts_dif_sex_gender")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_dif_sex_gender" id="agree" value="4" onChange={(e) => this.scoreChange(e, "pts_dif_sex_gender")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_dif_sex_gender" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "pts_dif_sex_gender")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["pts_dif_sex_gender"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={csaGenderStyle}>
                                                                        <FormGroup >
                                                                            <Label for="pts_gender_norm_sterotype" >Participants demonstrate understanding of gender norms and stereotypes and factors that regulate them</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_gender_norm_sterotype" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "pts_gender_norm_sterotype")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_gender_norm_sterotype" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "pts_gender_norm_sterotype")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_gender_norm_sterotype" id="neither" value="3" onChange={(e) => this.scoreChange(e, "pts_gender_norm_sterotype")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_gender_norm_sterotype" id="agree" value="4" onChange={(e) => this.scoreChange(e, "pts_gender_norm_sterotype")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_gender_norm_sterotype" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "pts_gender_norm_sterotype")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["pts_gender_norm_sterotype"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={csaCsaStyle}>
                                                                        <FormGroup >
                                                                            <Label for="pts_def_csa" >Participants demonstrate understanding of the definition of CSA</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_def_csa" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "pts_def_csa")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_def_csa" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "pts_def_csa")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_def_csa" id="neither" value="3" onChange={(e) => this.scoreChange(e, "pts_def_csa")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_def_csa" id="agree" value="4" onChange={(e) => this.scoreChange(e, "pts_def_csa")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_def_csa" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "pts_def_csa")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["pts_def_csa"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={csaCsaStyle}>
                                                                        <FormGroup >
                                                                            <Label for="pts_identify_csa" >Participants are able to accurately identify signs of CSA</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_identify_csa" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "pts_identify_csa")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_identify_csa" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "pts_identify_csa")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_identify_csa" id="neither" value="3" onChange={(e) => this.scoreChange(e, "pts_identify_csa")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_identify_csa" id="agree" value="4" onChange={(e) => this.scoreChange(e, "pts_identify_csa")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_identify_csa" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "pts_identify_csa")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["pts_identify_csa"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={csaCsaStyle}>
                                                                        <FormGroup >
                                                                            <Label for="pts_prevention_csa" >Participants are able to identify CSA prevention strategies</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_prevention_csa" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "pts_prevention_csa")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_prevention_csa" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "pts_prevention_csa")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_prevention_csa" id="neither" value="3" onChange={(e) => this.scoreChange(e, "pts_prevention_csa")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_prevention_csa" id="agree" value="4" onChange={(e) => this.scoreChange(e, "pts_prevention_csa")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_prevention_csa" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "pts_prevention_csa")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["pts_prevention_csa"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={csaCsaStyle}>
                                                                        <FormGroup >
                                                                            <Label for="mt_explain_csa_myth" >Master Trainer accurately explains and dispels all myths associated with CSA</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_explain_csa_myth" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_explain_csa_myth")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_explain_csa_myth" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_explain_csa_myth")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_explain_csa_myth" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_explain_csa_myth")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_explain_csa_myth" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_explain_csa_myth")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_explain_csa_myth" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_explain_csa_myth")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_explain_csa_myth"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={csaCsaStyle}>
                                                                        <FormGroup >
                                                                            <Label for="mt_csa_video_aid" >Master Trainer uses videos on CSA as aids in facilitation</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_video_aid" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_video_aid")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_video_aid" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_csa_video_aid")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_video_aid" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_video_aid")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_video_aid" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_video_aid")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_video_aid" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_video_aid")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_csa_video_aid"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={csaImplStyle}>
                                                                        <FormGroup >
                                                                            <Label for="mt_csa_constructive_feedback" >Master Trainer provides constructive feedback to participants after implementation of flashcards using the ‘Burger Method’</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_constructive_feedback" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_constructive_feedback")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_constructive_feedback" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_csa_constructive_feedback")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_constructive_feedback" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_constructive_feedback")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_constructive_feedback" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_constructive_feedback")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_constructive_feedback" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_constructive_feedback")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_csa_constructive_feedback"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_csa_prompts" >Master Trainer is actively using the training guide to aid in facilitation of content <span className="required">*</span></Label>
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
                                                                            <Label for="mt_csa_understanding" >Master Trainer demonstrates good understanding of the training content <span className="required">*</span></Label>
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
                                                                            <Label for="mt_csa_material_prep" >Master Trainer had all materials prepared in advance for the session <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_material_prep" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_material_prep")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_material_prep" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_csa_material_prep")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_material_prep" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_material_prep")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_material_prep" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_material_prep")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_material_prep" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_material_prep")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_csa_material_prep"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_csa_content_prep" >Master Trainer was well prepared in their facilitation of the content <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_content_prep" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_content_prep")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_content_prep" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_csa_content_prep")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_content_prep" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_content_prep")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_content_prep" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_content_prep")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_content_prep" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_content_prep")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_csa_content_prep"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_csa_activity_time_allotment" >An appropriate amount of time is allotted to each activity and topic <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_activity_time_allotment" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_activity_time_allotment")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_activity_time_allotment" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_csa_activity_time_allotment")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_activity_time_allotment" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_activity_time_allotment")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_activity_time_allotment" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_activity_time_allotment")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_activity_time_allotment" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_activity_time_allotment")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_csa_activity_time_allotment"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_csa_subject_comfort" >Master Trainer is comfortable speaking about this subject <span className="required">*</span></Label>
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
                                                                            <Label for="mt_csa_nonjudmental_tone" >Master Trainer uses a non-judgmental tone while facilitating the session <span className="required">*</span></Label>
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
                                                                            <Label for="mt_csa_impartial_opinions" >Master Trainer is not imposing their own values or opinions on the participants <span className="required">*</span></Label>
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
                                                                            <Label for="mt_csa_probing_style" >Master Trainer is engaging participants in discussion throughout session by providing probes <span className="required">*</span></Label>
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

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_csa_pts_engagement" >Participants are actively participating in discussion <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_pts_engagement" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_pts_engagement")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_pts_engagement" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_csa_pts_engagement")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_pts_engagement" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_pts_engagement")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_pts_engagement" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_pts_engagement")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_pts_engagement" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_pts_engagement")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_csa_pts_engagement"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_csa_pts_attention" >Participants are actively paying attention to the session while the Master Trainer is instructing <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_pts_attention" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_pts_attention")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_pts_attention" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_csa_pts_attention")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_pts_attention" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_pts_attention")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_pts_attention" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_pts_attention")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_csa_pts_attention" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_pts_attention")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_csa_pts_attention"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row >
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="mt_sd_training_score" style={{ color: "green" }}><b>Cumulative MT Stepdown Training Score</b></Label>
                                                                            <Input value={this.state.mt_sd_training_score} name="mt_sd_training_score" id="mt_sd_training_score" onChange={(e) => { this.inputChange(e, "mt_sd_training_score") }} readOnly></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            {/* TODO: apply style to hide this based on csa/primary question */}
                                                                            <Label for="mt_sd_training_score_pct" style={{ color: "green" }}><b>% Score</b></Label>
                                                                            <Input name="mt_sd_training_score_pct" id="mt_sd_training_score_pct" value={this.state.mt_sd_training_score_pct} onChange={(e) => { this.inputChange(e, "mt_sd_training_score_pct") }} readOnly></Input>
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
                                                                        <FormGroup>
                                                                            <Label for="lsbe_mt_count">Total Number of Master Trainers <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["lsbe_mt_count"]}</span>
                                                                            <Input type="number" value={this.state.lsbe_mt_count} name="lsbe_mt_count" id="lsbe_mt_count" onChange={(e) => { this.inputChange(e, "lsbe_mt_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2) }} placeholder="Enter in number"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup>
                                                                            <Label for="participant_name" >Name of Master Trainer <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["participant_name"]}</span>
                                                                            <Select id="participant_name"
                                                                                name="participant_name"
                                                                                value={this.state.participant_name}
                                                                                onChange={(e) => this.handleChange(e, "participant_name")}
                                                                                options={this.state.participants}
                                                                            />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="participant_id" >Teacher ID</Label>
                                                                            <Input name="participant_id" id="participant_id" value={this.state.participant_id} disabled />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="mt_lsbe_subject" >Subject Master Trainer is facilitating <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["mt_lsbe_subject"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "mt_lsbe_subject")} value={this.state.mt_lsbe_subject} id="mt_lsbe_subject" options={lsbeSubjectOptions} isMulti />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={lsbeVcatStyle}>
                                                                        <FormGroup >
                                                                            <Label for="mt_crossline_activity" >Master Trainer correctly conducts the Cross the Line activity</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_crossline_activity" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_crossline_activity")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_crossline_activity" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_crossline_activity")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_crossline_activity" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_crossline_activity")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_crossline_activity" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_crossline_activity")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_crossline_activity" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_crossline_activity")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_crossline_activity"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={lsbeVcatStyle}>
                                                                        <FormGroup >
                                                                            <Label for="mt_def_values" >Master Trainer clearly defines values</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_def_values" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_def_values")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_def_values" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_def_values")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_def_values" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_def_values")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_def_values" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_def_values")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_def_values" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_def_values")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_def_values"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={lsbeVcatStyle}>
                                                                        <FormGroup >
                                                                            <Label for="pts_understand_values" >Participants clearly understand the factors that regulate values</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_understand_values" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "pts_understand_values")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_understand_values" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "pts_understand_values")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_understand_values" id="neither" value="3" onChange={(e) => this.scoreChange(e, "pts_understand_values")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_understand_values" id="agree" value="4" onChange={(e) => this.scoreChange(e, "pts_understand_values")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_understand_values" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "pts_understand_values")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["pts_understand_values"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={lsbeHumanStyle}>
                                                                        <FormGroup >
                                                                            <Label for="mt_describe_human_rights" >Master trainer clearly describes human rights</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_describe_human_rights" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_describe_human_rights")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_describe_human_rights" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_describe_human_rights")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_describe_human_rights" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_describe_human_rights")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_describe_human_rights" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_describe_human_rights")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_describe_human_rights" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_describe_human_rights")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_describe_human_rights"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={lsbeHumanStyle}>
                                                                        <FormGroup >
                                                                            <Label for="pts_understand_human_rights" >Participants demonstrate clear understanding of the impact of human rights violations</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_understand_human_rights" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "pts_understand_human_rights")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_understand_human_rights" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "pts_understand_human_rights")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_understand_human_rights" id="neither" value="3" onChange={(e) => this.scoreChange(e, "pts_understand_human_rights")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_understand_human_rights" id="agree" value="4" onChange={(e) => this.scoreChange(e, "pts_understand_human_rights")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_understand_human_rights" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "pts_understand_human_rights")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["pts_understand_human_rights"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={lsbeGenderStyle}>
                                                                        <FormGroup >
                                                                            <Label for="mt_diff_sex_gender" >Master Trainer correctly differentiates between sex and gender</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_diff_sex_gender" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_diff_sex_gender")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_diff_sex_gender" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_diff_sex_gender")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_diff_sex_gender" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_diff_sex_gender")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_diff_sex_gender" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_diff_sex_gender")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_diff_sex_gender" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_diff_sex_gender")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_diff_sex_gender"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={lsbeGenderStyle}>
                                                                        <FormGroup >
                                                                            <Label for="pts_understand_gender_norm" >Participants show clear understanding of gender norms and stereotypes</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_understand_gender_norm" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "pts_understand_gender_norm")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_understand_gender_norm" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "pts_understand_gender_norm")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_understand_gender_norm" id="neither" value="3" onChange={(e) => this.scoreChange(e, "pts_understand_gender_norm")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_understand_gender_norm" id="agree" value="4" onChange={(e) => this.scoreChange(e, "pts_understand_gender_norm")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_understand_gender_norm" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "pts_understand_gender_norm")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["pts_understand_gender_norm"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={lsbeSexualStyle}>
                                                                        <FormGroup >
                                                                            <Label for="mt_def_sexual_health_lsbe" >Master Trainer accurately defines sexual health</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_def_sexual_health_lsbe" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_def_sexual_health_lsbe")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_def_sexual_health_lsbe" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_def_sexual_health_lsbe")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_def_sexual_health_lsbe" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_def_sexual_health_lsbe")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_def_sexual_health_lsbe" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_def_sexual_health_lsbe")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_def_sexual_health_lsbe" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_def_sexual_health_lsbe")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_def_sexual_health_lsbe"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={lsbeSexualStyle}>
                                                                        <FormGroup >
                                                                            <Label for="pts_understand_health_links" >Participants demonstrate an understanding of the three aspects of health and how they are interlinked</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_understand_health_links" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "pts_understand_health_links")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_understand_health_links" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "pts_understand_health_links")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_understand_health_links" id="neither" value="3" onChange={(e) => this.scoreChange(e, "pts_understand_health_links")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_understand_health_links" id="agree" value="4" onChange={(e) => this.scoreChange(e, "pts_understand_health_links")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="pts_understand_health_links" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "pts_understand_health_links")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["pts_understand_health_links"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={lsbeViolenceStyle}>
                                                                        <FormGroup >
                                                                            <Label for="mt_describe_violence_types" >Master Trainer has correctly described the different types of violence</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_describe_violence_types" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_describe_violence_types")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_describe_violence_types" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_describe_violence_types")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_describe_violence_types" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_describe_violence_types")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_describe_violence_types" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_describe_violence_types")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_describe_violence_types" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_describe_violence_types")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_describe_violence_types"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={lsbeViolenceStyle}>
                                                                        <FormGroup >
                                                                            <Label for="mt_describe_violence_impact" >Master Trainer has effectively described the impact of violence on an individual’s life</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_describe_violence_impact" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_describe_violence_impact")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_describe_violence_impact" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_describe_violence_impact")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_describe_violence_impact" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_describe_violence_impact")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_describe_violence_impact" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_describe_violence_impact")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_describe_violence_impact" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_describe_violence_impact")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_describe_violence_impact"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={lsbePubertyStyle}>
                                                                        <FormGroup >
                                                                            <Label for="mt_explain_puberty" >Master Trainer was able to clearly explain changes that occur during puberty for boys and girls</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_explain_puberty" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_explain_puberty")} />{' '}
                                                                                            {stronglyDisagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_explain_puberty" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_explain_puberty")} />{' '}
                                                                                            {disagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_explain_puberty" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_explain_puberty")} />{' '}
                                                                                            {neither}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_explain_puberty" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_explain_puberty")} />{' '}
                                                                                            {agree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_explain_puberty" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_explain_puberty")} />{' '}
                                                                                            {stronglyAgree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_explain_puberty"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>


                                                                <Row>
                                                                    <Col md="12" style={lsbePubertyStyle}>
                                                                        <FormGroup >
                                                                            <Label for="mt_dispell_puberty_myths" >Master Trainer has clearly explained and dispelled myths related to puberty in both boys and girls</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_dispell_puberty_myths" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_dispell_puberty_myths")} />{' '}
                                                                                            {stronglyDisagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_dispell_puberty_myths" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_dispell_puberty_myths")} />{' '}
                                                                                            {disagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_dispell_puberty_myths" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_dispell_puberty_myths")} />{' '}
                                                                                            {neither}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_dispell_puberty_myths" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_dispell_puberty_myths")} />{' '}
                                                                                            {agree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_dispell_puberty_myths" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_dispell_puberty_myths")} />{' '}
                                                                                            {stronglyAgree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_dispell_puberty_myths"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup style={lsbeImplStyle}>
                                                                            <Label for="mt_lsbe_constructive_feedback" >Master Trainer provides constructive feedback to participants after implementation of flashcards using the ‘Burger Method’</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_constructive_feedback" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_constructive_feedback")} />{' '}
                                                                                            {stronglyDisagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_constructive_feedback" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_lsbe_constructive_feedback")} />{' '}
                                                                                            {disagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_constructive_feedback" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_constructive_feedback")} />{' '}
                                                                                            {neither}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_constructive_feedback" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_constructive_feedback")} />{' '}
                                                                                            {agree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_constructive_feedback" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_constructive_feedback")} />{' '}
                                                                                            {stronglyAgree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_lsbe_constructive_feedback"]}</span>
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
                                                                                            {stronglyDisagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_prompts" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_lsbe_prompts")} />{' '}
                                                                                            {disagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_prompts" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_prompts")} />{' '}
                                                                                            {neither}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_prompts" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_prompts")} />{' '}
                                                                                            {agree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_prompts" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_prompts")} />{' '}
                                                                                            {stronglyAgree}
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
                                                                                            {stronglyDisagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_understanding" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_lsbe_understanding")} />{' '}
                                                                                            {disagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_understanding" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_understanding")} />{' '}
                                                                                            {neither}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_understanding" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_understanding")} />{' '}
                                                                                            {agree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_understanding" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_understanding")} />{' '}
                                                                                            {stronglyAgree}
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
                                                                            <Label for="mt_lsbe_material_prep" >Master Trainer had all materials prepared in advance for the session <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_material_prep" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_material_prep")} />{' '}
                                                                                            {stronglyDisagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_material_prep" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_lsbe_material_prep")} />{' '}
                                                                                            {disagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_material_prep" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_material_prep")} />{' '}
                                                                                            {neither}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_material_prep" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_material_prep")} />{' '}
                                                                                            {agree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_material_prep" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_material_prep")} />{' '}
                                                                                            {stronglyAgree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_lsbe_material_prep"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_lsbe_content_prep" >Master Trainer was well prepared in their facilitation of the content <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_content_prep" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_content_prep")} />{' '}
                                                                                            {stronglyDisagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_content_prep" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_lsbe_content_prep")} />{' '}
                                                                                            {disagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_content_prep" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_content_prep")} />{' '}
                                                                                            {neither}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_content_prep" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_content_prep")} />{' '}
                                                                                            {agree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_content_prep" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_content_prep")} />{' '}
                                                                                            {stronglyAgree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_lsbe_content_prep"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_lsbe_activity_time_allotment" >An appropriate amount of time is allotted to each activity and topic <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_activity_time_allotment" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_activity_time_allotment")} />{' '}
                                                                                            {stronglyDisagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_activity_time_allotment" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_lsbe_activity_time_allotment")} />{' '}
                                                                                            {disagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_activity_time_allotment" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_activity_time_allotment")} />{' '}
                                                                                            {neither}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_activity_time_allotment" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_activity_time_allotment")} />{' '}
                                                                                            {agree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_activity_time_allotment" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_activity_time_allotment")} />{' '}
                                                                                            {stronglyAgree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_lsbe_activity_time_allotment"]}</span>
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
                                                                                            {stronglyDisagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_subject_comfort" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                            {disagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_subject_comfort" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                            {neither}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_subject_comfort" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                            {agree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_subject_comfort" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                            {stronglyAgree}
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
                                                                                            {stronglyDisagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                            {disagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                            {neither}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                            {agree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                            {stronglyAgree}
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
                                                                                            {stronglyDisagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_impartial_opinions" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                            {disagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_impartial_opinions" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                            {neither}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_impartial_opinions" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                            {agree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_impartial_opinions" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                            {stronglyAgree}
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

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_lsbe_pts_engagement" >Participants are actively participating in discussion <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_pts_engagement" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_pts_engagement")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_pts_engagement" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_lsbe_pts_engagement")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_pts_engagement" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_pts_engagement")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_pts_engagement" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_pts_engagement")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_pts_engagement" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_pts_engagement")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_lsbe_pts_engagement"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="mt_lsbe_pts_attention" >Participants are actively paying attention to the session while the Master Trainer is instructing <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_pts_attention" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_pts_attention")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_pts_attention" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_lsbe_pts_attention")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_pts_attention" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_pts_attention")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_pts_attention" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_pts_attention")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="mt_lsbe_pts_attention" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_pts_attention")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["mt_lsbe_pts_attention"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row >
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="mt_sd_training_score" style={{ color: "green" }}><b>Cumulative MT Stepdown Training Score</b></Label>
                                                                            <Input value={this.state.mt_sd_training_score} name="mt_sd_training_score" id="mt_sd_training_score" onChange={(e) => { this.inputChange(e, "mt_sd_training_score") }} readOnly></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="mt_sd_training_score_pct" style={{ color: "green" }}><b>% Score</b></Label>
                                                                            <Input name="mt_sd_training_score_pct" id="mt_sd_training_score_pct" value={this.state.mt_sd_training_score_pct} onChange={(e) => { this.inputChange(e, "mt_sd_training_score_pct") }} readOnly></Input>
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
                                                                <Button color="secondary" id="page_csa" style={csaStyle}
                                                                    className={"btn-shadow " + classnames({ active: this.state.activeTab === '2' })}
                                                                    onClick={() => {
                                                                        this.toggleTab('2');
                                                                    }}
                                                                >CSA</Button>
                                                                <Button color="secondary" id="page_lsbe" style={lsbeStyle}
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

export default StepDownTraining;