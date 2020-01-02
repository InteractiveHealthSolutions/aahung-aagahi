/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-18 17:03:50
 * @modify date 2019-08-18 17:03:50
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
import { MDBBtn, MDBContainer, MDBIcon, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from 'mdbreact';
import moment from 'moment';
import React, { Fragment } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Select from 'react-select';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Button, ButtonGroup, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, TabContent, TabPane } from 'reactstrap';
import CustomModal from "../alerts/CustomModal";
import "../index.css";
import { getDefinitionByDefinitionId, getDefinitionsByDefinitionType, getFormDataById, getFormTypeByUuid, getLocationAttributesByLocation, getLocationByRegexValue, getLocationsByCategory, getRoleByName, getUsersByRole } from "../service/GetService";
import { saveFormData, updateFormData } from "../service/PostService";
import { clearCheckedFields, loadFormState, resetFormState, getIndicatorCode } from "../util/AahungUtil.js";
import * as Constants from "../util/Constants";
import FormNavBar from "../widget/FormNavBar";
import LoadingIndicator from "../widget/LoadingIndicator";

const first_aid_kit_options = [
    { value: 'band_aids', label: 'Band-aids' },
    { value: 'sterile_gauze_dressings', label: 'Sterile Gauze Dressings' },
    { value: 'sticky_tape', label: 'Sticky Tape' },
    { value: 'disposable_sterile_gloves', label: 'Disposable Sterile Gloves' },
    { value: 'thermometer', label: 'Thermometer' },
    { value: 'antiseptic_wipes_or_cream', label: 'Antiseptic Wipes or Cream' },
    { value: 'pain_killers', label: 'Pain Killers' },
    { value: 'antihistamine_cream_or_tablets', label: 'Antihistamine Cream or Tablets' },];

class SrhrPolicy extends React.Component {

    modal = false;


    constructor(props) {
        super(props);
        this.state = {
            school_sex: '',
            date_start: '',
            locationObj: {},
            schools: [],
            monitors: [],
            participants: [],
            activeTab: '1',
            page2Show: true,
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

        this.locationObj = {};
        // checks if Srhr Policy implemented
        this.isPolicyImplemented = false;
        this.score = 0;
        this.totalScore = 0;
        this.scoreArray = [];

        this.srhrRequiredFields = ["date_start", "monitor", "school_id", "srhr_policy_implemented", "srhr_score", "srhr_score_pct"];
        this.srhrDependantFields = ["edu_resource_awareness", "edu_teaching_safe_space", "training_initiative_mgmt", "iec_material_access",
            "gender_neutral", "parent_involvement", "parent_sensitization", "parent_child_update", "parent_group_encouragement",
            "counselling_services", "certified_counsellor", "student_counselling_services_awareness", "guide_usage",
            "counselling_urgent_case_reported", "first_aid_focal_person", "first_aid_kit", "first_aid_kit_refill", "first_aid_urgent_case_reported", "clean_drinking_water_access",
            "clean_food_space_access", "sanitation_facilities_access", "toilet_assist_staff_trained", "separate_toilets",
            "close_proximity_toilets", "toilet_permission_given", "well_equipped_toilets", "toilet_etiquette_awareness",
            "toilet_cleaniness", "zero_tolerance_policy_maintained", "appropriate_security_measures", "parents_given_security_update",
            "defined_student_pickup", "correct_student_pickup_release", "parents_guided_security_precaution", "staff_student_interaction_code",
            "open_door_policy", "student_teacher_loitering_check", "teacher_staff_student_boubdaries"];
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

            let formTypeObj = await getFormTypeByUuid(Constants.SRHR_POLICY_FORM_UUID);
            this.formTypeId = formTypeObj.formTypeId;

            let role = await getRoleByName(Constants.LSE_MONITOR_ROLE_NAME);
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

                    if (this.state.first_aid_kit != undefined && this.state.first_aid_kit.length > 0) {
                        this.score += this.state.first_aid_kit.length;
                        this.totalScore += 8; // 8 for total options
                        var score = parseInt(this.score);
                        var totalScore = parseInt(this.totalScore);
                        var percent = (score / totalScore) * 100;
                        percent = percent.toFixed(2);
                        this.setState({
                            srhr_score: this.score,
                            srhr_score_pct: percent
                        })
                    }

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
        })

        this.isPolicyImplemented = false;
    }

    editUpdateDisplay() {
        if (this.state.srhr_policy_implemented != undefined && this.state.srhr_policy_implemented !== '') {
            this.isPolicyImplemented = String(this.state.srhr_policy_implemented) === "1" ? true : false;
        }
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
        this.resetForm(this.srhrRequiredFields);
        if (this.state.isPolicyImplemented) {
            this.resetForm(this.srhrDependantFields);
        }
    }

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

    // calculate score from scoring questions (radiobuttons)
    scoreChange = (e, name) => {
        this.setState({
            [name]: e.target.value
        });

        if (name === "srhr_policy_implemented") {
            this.isPolicyImplemented = e.target.id === "yes" ? true : false;
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
            srhr_score: this.score,
            srhr_score_pct: percent
        })
        console.log(this.scoreArray);
    }

    // for multi select
    valueChangeMulti(e, name) {
        console.log(e);
        this.setState({
            [name]: e
        });

        if (name == "first_aid_kit" && e !== null) {
            this.score += e.length;
            this.totalScore += 8; // 8 for total options
            var score = parseInt(this.score);
            var totalScore = parseInt(this.totalScore);
            var percent = (score / totalScore) * 100;
            percent = percent.toFixed(2);
            this.setState({
                srhr_score: this.score,
                srhr_score_pct: percent
            })
            console.log(this.scoreArray);

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

                // this.locationObj = await getLocationByRegexValue(e.shortName);
                // console.log(this.locationObj);
                // if (this.locationObj != null && this.locationObj != undefined) {
                //     this.setState({
                //         school_name: this.locationObj.locationName
                //     })
                // }

                this.setState({
                    school_name: e.locationName
                })
                let attributes = await getLocationAttributesByLocation(e.uuid);
                this.autopopulateFields(attributes);
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
                // form_disabled: true,
                loading: true
            })

            const data = new FormData(event.target);
            var jsonData = new Object();
            jsonData.formDate = this.state.date_start;
            jsonData.formType = {};
            jsonData.formType.formTypeId = this.formTypeId;
            jsonData.location = {};
            jsonData.location.locationId = this.state.school_id.id;
            jsonData.referenceId = "";
            jsonData.data = {};
            var dataObj = {};

            for (let i = 0; i < this.srhrRequiredFields.length; i++) {

                if (this.srhrRequiredFields[i] === "monitor") {
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

                var element = document.getElementById(this.srhrRequiredFields[i]);
                if (element != null) {
                    if (element.offsetParent != null) { // this line is for checking if the element is visible on page
                        // alert("it's visible:   >>> value: " + element.value);
                        if (element.value != '')
                            dataObj[this.srhrRequiredFields[i]] = element.value;
                    }
                }
                else {
                    if (this.state[this.srhrRequiredFields[i]] != undefined && this.state[this.srhrRequiredFields[i]] != '') {
                        dataObj[this.srhrRequiredFields[i]] = this.state[this.srhrRequiredFields[i]];
                    }
                }
            }

            if (this.isPolicyImplemented) {
                // for policy
                var fields = this.srhrDependantFields;
                for (let i = 0; i < fields.length; i++) {
                    if (fields[i] === "first_aid_kit") {
                        dataObj.first_aid_kit = {};
                        dataObj.first_aid_kit.values = [];
                        // generating multiselect for first_aid_kit
                        if ((this.state.first_aid_kit != null && this.state.first_aid_kit != undefined)) {
                            for (let i = 0; i < this.state.first_aid_kit.length; i++) {
                                dataObj.first_aid_kit.values.push(String(this.state.first_aid_kit[i].value));
                            }
                        }
                        continue;
                    }

                    var element = document.getElementById(fields[i]);
                    // alert(element);
                    if (element != null) {

                        // if(fields[i] === "parent_child_update" || fields[i] === "certified_counsellor" || fields[i] === "first_aid_kit_refill" || fields[i] === "mhm_kit" || fields[i] === "clean_food_space_access" || fields[i] === "defined_student_pickup") {
                        //     alert(fields[i]);
                        // }
                        if (element.offsetParent != null) { // this line is for checking if the element is visible on page

                            // if(fields[i] === "parent_child_update" || fields[i] === "certified_counsellor" || fields[i] === "first_aid_kit_refill" || fields[i] === "mhm_kit" || fields[i] === "clean_food_space_access" || fields[i] === "defined_student_pickup") {
                            //     alert("it is visible = " + fields[i]);
                            // }
                            if (element.value != '')
                                dataObj[fields[i]] = element.value;
                        }
                        else if (this.srhrDependantFields.filter(f => f == fields[i]).length == 0) {

                            // if(fields[i] === "parent_child_update" || fields[i] === "certified_counsellor" || fields[i] === "first_aid_kit_refill" || fields[i] === "mhm_kit" || fields[i] === "clean_food_space_access" || fields[i] === "defined_student_pickup") {
                            //     alert("it is not a Dependent question = " + fields[i]);
                            // }
                            if (element.value != '')
                                dataObj[fields[i]] = element.value;
                        }
                    }
                    else {

                        if (this.state[fields[i]] != undefined && this.state[fields[i]] != '') {
                            // if(fields[i] === "parent_child_update" || fields[i] === "certified_counsellor" || fields[i] === "first_aid_kit_refill" || fields[i] === "mhm_kit" || fields[i] === "clean_food_space_access" || fields[i] === "defined_student_pickup") {
                            //     alert("filling in states = " + fields[i]);
                            //     alert(this.state[fields[i]]);
                            // }
                            dataObj[fields[i]] = this.state[fields[i]];
                        }
                    }
                }
            }

            console.log(dataObj);
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

                                this.resetForm(this.srhrRequiredFields);
                                if (this.isPolicyImplemented) {
                                    this.resetForm(this.srhrDependantFields);
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

                                this.resetForm(this.srhrRequiredFields);
                                if (this.isPolicyImplemented) {
                                    this.resetForm(this.srhrDependantFields);
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

    handleValidation() {
        // check each required state
        let formIsValid = true;
        this.setState({ hasError: this.checkValid(this.srhrRequiredFields, []) ? false : true });
        formIsValid = this.checkValid(this.srhrRequiredFields, []);
        if (this.isPolicyImplemented) {
            // for GIRLS and COED
            if ((this.state.school_sex).toUpperCase() != "BOYS") {

                var mhm = ["mhm_kit", "mhm_focal_person", "mhm_kit_refill"];
                this.srhrDependantFields = this.srhrDependantFields.concat(mhm);

            }

            this.setState({ hasError: this.checkValid(this.srhrRequiredFields, this.srhrDependantFields) ? false : true });
            formIsValid = this.checkValid(this.srhrRequiredFields, this.srhrDependantFields);
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

            // alert(requireds[j]);

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
                    // alert("value is epmpty");
                    isOk = false;
                    this.errors[requireds[j]] = errorText;
                }
            }
        }

        for (let j = 0; j < dependants.length; j++) {
            var element = document.getElementById(dependants[j]);

            // alert(dependants[j]);
            if (element != null) {
                // alert(element);
                if (element.offsetParent != null) {

                    let stateName = dependants[j];
                    // for array object
                    if (typeof this.state[stateName] === 'object' && this.state[stateName] === null) {
                        isOk = false;
                        this.errors[dependants[j]] = errorText;
                    }
                    else if (typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                        isOk = false;
                        this.errors[dependants[j]] = errorText;
                    }

                    // for text and others
                    if (typeof this.state[stateName] != 'object') {
                        if (this.state[stateName] === "" || this.state[stateName] == undefined) {
                            // alert("value is empty");
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
                    this.errors[dependants[j]] = errorText;
                }
                else if (typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
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

        this.state = resetFormState(fields, this.state);
        this.setState({
            school_name: '',
            school_level: '',
            program_implemented: '',
            school_tier: '',
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

        const page2style = this.state.page2Show ? {} : { display: 'none' };
        const policyImplementedStyle = this.isPolicyImplemented ? {} : { display: 'none' };
        const mhmStyle = (this.state.school_sex).toUpperCase() != "BOYS" ? {} : { display: 'none' };

        // for view mode
        const setDisable = this.state.viewMode ? "disabled" : "";
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
                                <Form id="srhrForm" onSubmit={this.handleSubmit}>
                                    <Row>
                                        <Col md="6">
                                            <Card className="main-card mb-6">
                                                <CardHeader>
                                                    <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                    <b>SRHR Policy</b>
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
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="monitor" >Monitored By <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["monitor"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "monitor")} value={this.state.monitor} id="monitor" options={this.state.monitors} isMulti />
                                                                        </FormGroup>

                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_id" >School ID <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["school_id"]}</span>
                                                                            <Select id="school_id" name="school_id" value={this.state.school_id} onChange={(e) => this.handleChange(e, "school_id")} options={this.state.schools}
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
                                                                            <Label for="school_level" >Level of Program</Label>
                                                                            <Input name="school_level" id="school_level" value={this.state.school_level} disabled />
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="program_implemented" >Type of program(s) implemented in school</Label>
                                                                            <Input name="program_implemented" id="program_implemented" value={this.state.program_implemented} disabled />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_tier" >School Tier</Label>
                                                                            <Input name="school_tier" id="school_tier" value={this.state.school_tier} disabled />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_sex" >Classification of School by Sex</Label>
                                                                            <Input name="school_sex" id="school_sex" value={this.state.school_sex} disabled />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>


                                                            </TabPane>
                                                            <TabPane tabId="2" id="lsbe">
                                                                <Row>
                                                                    <Col md="6">
                                                                        <Label><h6><u><b>SRHR Policy</b></u></h6></Label>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="srhr_policy_implemented" >Has this school implemented the SRHR Policy Guidelines? <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="srhr_policy_implemented" id="yes" value="1" onChange={(e) => this.scoreChange(e, "srhr_policy_implemented")} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="srhr_policy_implemented" id="no" value="0" onChange={(e) => this.scoreChange(e, "srhr_policy_implemented")} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["srhr_policy_implemented"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <div style={policyImplementedStyle}>
                                                                    <Row>
                                                                        <Col md="6">
                                                                            <Label><h6><u><b>1. Promotion of SRH Education in Schools</b></u></h6></Label>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="edu_resource_awareness">Students are aware of which teachers are trained on SRHR and are available for support</Label>
                                                                                <FormGroup tag="fieldset" row>
                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="edu_resource_awareness" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "edu_resource_awareness")} />{' '}
                                                                                                No student is aware
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="edu_resource_awareness" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "edu_resource_awareness")} />{' '}
                                                                                                Very few students are aware
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="edu_resource_awareness" id="neither" value="3" onChange={(e) => this.scoreChange(e, "edu_resource_awareness")} />{' '}
                                                                                                Some students are aware
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="edu_resource_awareness" id="agree" value="4" onChange={(e) => this.scoreChange(e, "edu_resource_awareness")} />{' '}
                                                                                                Most students are aware
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="edu_resource_awareness" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "edu_resource_awareness")} />{' '}
                                                                                                All students are aware
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["edu_resource_awareness"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="edu_teaching_safe_space" >School Management has created a safe and secure space where teachers trained on SRHR are able to teach and counsel students on SRHR issues</Label>
                                                                                <FormGroup tag="fieldset" row>
                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="edu_teaching_safe_space" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "edu_teaching_safe_space")} />{' '}
                                                                                                Strongly Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="edu_teaching_safe_space" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "edu_teaching_safe_space")} />{' '}
                                                                                                Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="edu_teaching_safe_space" id="neither" value="3" onChange={(e) => this.scoreChange(e, "edu_teaching_safe_space")} />{' '}
                                                                                                Neither Agree nor Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="edu_teaching_safe_space" id="agree" value="4" onChange={(e) => this.scoreChange(e, "edu_teaching_safe_space")} />{' '}
                                                                                                Agree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="edu_teaching_safe_space" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "edu_teaching_safe_space")} />{' '}
                                                                                                Strongly Agree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["edu_teaching_safe_space"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="training_initiative_mgmt" >School Management takes the initiative to organize capacity building training sessions for teachers on a needs basis</Label>
                                                                                <FormGroup tag="fieldset" row>
                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="training_initiative_mgmt" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "training_initiative_mgmt")} />{' '}
                                                                                                Strongly Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="training_initiative_mgmt" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "training_initiative_mgmt")} />{' '}
                                                                                                Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="training_initiative_mgmt" id="neither" value="3" onChange={(e) => this.scoreChange(e, "training_initiative_mgmt")} />{' '}
                                                                                                Neither Agree nor Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="training_initiative_mgmt" id="agree" value="4" onChange={(e) => this.scoreChange(e, "training_initiative_mgmt")} />{' '}
                                                                                                Agree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="training_initiative_mgmt" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "training_initiative_mgmt")} />{' '}
                                                                                                Strongly Agree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["training_initiative_mgmt"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="" >Students have access to SRHR IEC materials within the school vicinity</Label>
                                                                                <FormGroup tag="fieldset" row>

                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="iec_material_access" id="yes" value="1" onChange={(e) => this.scoreChange(e, "iec_material_access")} />{' '}
                                                                                                Yes
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="iec_material_access" id="no" value="0" onChange={(e) => this.scoreChange(e, "iec_material_access")} />{' '}
                                                                                                No
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["iec_material_access"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="gender_neutral" >School encourages all students of all genders to be involved in extracurricular activities, such as sports and art</Label>
                                                                                <FormGroup tag="fieldset" row>
                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="gender_neutral" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_neutral")} />{' '}
                                                                                                Strongly Disagree
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="gender_neutral" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_neutral")} />{' '}
                                                                                                Disagree
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="gender_neutral" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_neutral")} />{' '}
                                                                                                Neither Agree nor Disagree
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="gender_neutral" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_neutral")} />{' '}
                                                                                                Agree
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="gender_neutral" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_neutral")} />{' '}
                                                                                                Strongly Agree
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["gender_neutral"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="6">
                                                                            <Label><h6><u><b>2. Parental Involvement to Strengthen SRH Education Programs in Schools</b></u></h6></Label>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="parent_involvement" >School Management involves parents in the SRHR programs through various activities throughout the school year</Label>
                                                                                <FormGroup tag="fieldset" row>
                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parent_involvement" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "parent_involvement")} />{' '}
                                                                                                Strongly Disagree
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parent_involvement" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "parent_involvement")} />{' '}
                                                                                                Disagree
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parent_involvement" id="neither" value="3" onChange={(e) => this.scoreChange(e, "parent_involvement")} />{' '}
                                                                                                Neither Agree nor Disagree
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parent_involvement" id="agree" value="4" onChange={(e) => this.scoreChange(e, "parent_involvement")} />{' '}
                                                                                                Agree
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parent_involvement" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "parent_involvement")} />{' '}
                                                                                                Strongly Agree
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["parent_involvement"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="parent_sensitization" >Parents are sensitized on the SRHR curriculum and implementation of SRHR policies on an annual basis</Label>
                                                                                <FormGroup tag="fieldset" row>

                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parent_sensitization" id="yes" value="1" onChange={(e) => this.scoreChange(e, "parent_sensitization")} />{' '}
                                                                                                Yes
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parent_sensitization" id="no" value="0" onChange={(e) => this.scoreChange(e, "parent_sensitization")} />{' '}
                                                                                                No
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["parent_sensitization"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="parent_child_update" >Parents are updated on their child’s progress regarding the SRHR classes during parent teacher meetings</Label>
                                                                                <FormGroup tag="fieldset" row>

                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parent_child_update" id="yes" value="1" onChange={(e) => this.scoreChange(e, "parent_child_update")} />{' '}
                                                                                                Yes
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parent_child_update" id="no" value="0" onChange={(e) => this.scoreChange(e, "parent_child_update")} />{' '}
                                                                                                No
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["parent_child_update"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="parent_group_encouragement" >School Management and teachers encourage the formation and role of parent groups in school and support them in their initiatives</Label>
                                                                                <FormGroup tag="fieldset" row>
                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parent_group_encouragement" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "parent_group_encouragement")} />{' '}
                                                                                                Strongly Disagree
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parent_group_encouragement" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "parent_group_encouragement")} />{' '}
                                                                                                Disagree
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parent_group_encouragement" id="neither" value="3" onChange={(e) => this.scoreChange(e, "parent_group_encouragement")} />{' '}
                                                                                                Neither Agree nor Disagree
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parent_group_encouragement" id="agree" value="4" onChange={(e) => this.scoreChange(e, "parent_group_encouragement")} />{' '}
                                                                                                Agree
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parent_group_encouragement" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "parent_group_encouragement")} />{' '}
                                                                                                Strongly Agree
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["parent_group_encouragement"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="6">
                                                                            <Label><h6><u><b>3. Provision of Psychosocial Services to Address Students’ SRHR and Other Issues</b></u></h6></Label>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="counselling_services" >Safe and secure spaces are available in the school where counselling can take place</Label>
                                                                                <FormGroup tag="fieldset" row>

                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="counselling_services" id="yes" value="1" onChange={(e) => this.scoreChange(e, "counselling_services")} />{' '}
                                                                                                Yes
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="counselling_services" id="no" value="0" onChange={(e) => this.scoreChange(e, "counselling_services")} />{' '}
                                                                                                No
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["counselling_services"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="certified_counsellor" >Counselors at this school are trained and certified by a reputable organization</Label>
                                                                                <FormGroup tag="fieldset" row>

                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="certified_counsellor" id="yes" value="1" onChange={(e) => this.scoreChange(e, "certified_counsellor")} />{' '}
                                                                                                Yes
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="certified_counsellor" id="no" value="0" onChange={(e) => this.scoreChange(e, "certified_counsellor")} />{' '}
                                                                                                No
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["certified_counsellor"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="student_counselling_services_awareness" >Students are aware of the counselling services offered</Label>
                                                                                <FormGroup tag="fieldset" row>

                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="student_counselling_services_awareness" id="yes" value="1" onChange={(e) => this.scoreChange(e, "student_counselling_services_awareness")} />{' '}
                                                                                                Yes
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="student_counselling_services_awareness" id="no" value="0" onChange={(e) => this.scoreChange(e, "student_counselling_services_awareness")} />{' '}
                                                                                                No
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["student_counselling_services_awareness"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="guide_usage" >School Management and counselors use the Referral Guide provided by Aahung when needed</Label>
                                                                                <FormGroup tag="fieldset" row>
                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="guide_usage" id="never" value="1" onChange={(e) => this.scoreChange(e, "guide_usage")} />{' '}
                                                                                                Never
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="guide_usage" id="rarely" value="2" onChange={(e) => this.scoreChange(e, "guide_usage")} />{' '}
                                                                                                Rarely
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="guide_usage" id="occasionally" value="3" onChange={(e) => this.scoreChange(e, "guide_usage")} />{' '}
                                                                                                Occasionally
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="guide_usage" id="frequently" value="4" onChange={(e) => this.scoreChange(e, "guide_usage")} />{' '}
                                                                                                Frequently
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="guide_usage" id="always" value="5" onChange={(e) => this.scoreChange(e, "guide_usage")} />{' '}
                                                                                                Always
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["guide_usage"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="counselling_urgent_case_reported" >Counselors inform management about any cases that require urgent attention</Label>
                                                                                <FormGroup tag="fieldset" row>
                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="counselling_urgent_case_reported" id="never" value="1" onChange={(e) => this.scoreChange(e, "counselling_urgent_case_reported")} />{' '}
                                                                                                Never
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="counselling_urgent_case_reported" id="rarely" value="2" onChange={(e) => this.scoreChange(e, "counselling_urgent_case_reported")} />{' '}
                                                                                                Rarely
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="counselling_urgent_case_reported" id="occasionally" value="3" onChange={(e) => this.scoreChange(e, "counselling_urgent_case_reported")} />{' '}
                                                                                                Occasionally
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="counselling_urgent_case_reported" id="frequently" value="4" onChange={(e) => this.scoreChange(e, "counselling_urgent_case_reported")} />{' '}
                                                                                                Frequently
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="counselling_urgent_case_reported" id="always" value="5" onChange={(e) => this.scoreChange(e, "counselling_urgent_case_reported")} />{' '}
                                                                                                Always
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["counselling_urgent_case_reported"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="6">
                                                                            <Label><h6><u><b>4. Provision of First Aid Management</b></u></h6></Label>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                {/* Coding: number of items selected */}
                                                                                <Label for="first_aid_kit" >This school has a proper First Aid kit that includes the following:</Label> <span class="errorMessage">{this.state.errors["first_aid_kit"]}</span>
                                                                                <Select onChange={(e) => this.valueChangeMulti(e, "first_aid_kit")} value={this.state.first_aid_kit} id="first_aid_kit" options={first_aid_kit_options} isMulti />
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="first_aid_focal_person" >There is a focal person for medical care who has First Aid training and is responsible for the First Aid kit</Label>
                                                                                <FormGroup tag="fieldset" row>

                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="first_aid_focal_person" id="yes" value="1" onChange={(e) => this.scoreChange(e, "first_aid_focal_person")} />{' '}
                                                                                                Yes
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="first_aid_focal_person" id="no" value="0" onChange={(e) => this.scoreChange(e, "first_aid_focal_person")} />{' '}
                                                                                                No
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["first_aid_focal_person"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="first_aid_kit_refill" >The First Aid kit is checked on a monthly basis and refilled regularly</Label>
                                                                                <FormGroup tag="fieldset" row>

                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="first_aid_kit_refill" id="yes" value="1" onChange={(e) => this.scoreChange(e, "first_aid_kit_refill")} />{' '}
                                                                                                Yes
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="first_aid_kit_refill" id="no" value="0" onChange={(e) => this.scoreChange(e, "first_aid_kit_refill")} />{' '}
                                                                                                No
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["first_aid_kit_refill"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="guide_usage" >The focal person for medical care informs management about any cases that require urgent attention</Label>
                                                                                <FormGroup tag="fieldset" row>
                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="first_aid_urgent_case_reported" id="never" value="1" onChange={(e) => this.scoreChange(e, "first_aid_urgent_case_reported")} />{' '}
                                                                                                Never
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="first_aid_urgent_case_reported" id="rarely" value="2" onChange={(e) => this.scoreChange(e, "first_aid_urgent_case_reported")} />{' '}
                                                                                                Rarely
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="first_aid_urgent_case_reported" id="occasionally" value="3" onChange={(e) => this.scoreChange(e, "first_aid_urgent_case_reported")} />{' '}
                                                                                                Occasionally
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="first_aid_urgent_case_reported" id="frequently" value="4" onChange={(e) => this.scoreChange(e, "first_aid_urgent_case_reported")} />{' '}
                                                                                                Frequently
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="first_aid_urgent_case_reported" id="always" value="5" onChange={(e) => this.scoreChange(e, "first_aid_urgent_case_reported")} />{' '}
                                                                                                Always
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["first_aid_urgent_case_reported"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="6" style={mhmStyle}>
                                                                            <Label><h6><u><b>5. Improving Menstrual Hygiene Management in Schools</b></u></h6></Label>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12" style={mhmStyle}>
                                                                            <FormGroup >
                                                                                <Label for="mhm_kit" >The school has a menstrual hygiene management (MHM) kit readily available for students and teachers that includes necessary items such as soap, pads and underwear</Label>
                                                                                <FormGroup tag="fieldset" row>

                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="mhm_kit" id="yes" value="1" onChange={(e) => this.scoreChange(e, "mhm_kit")} />{' '}
                                                                                                Yes
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="mhm_kit" id="no" value="0" onChange={(e) => this.scoreChange(e, "mhm_kit")} />{' '}
                                                                                                No
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["mhm_kit"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12" style={mhmStyle}>
                                                                            <FormGroup >
                                                                                <Label for="mhm_focal_person" >There is a focal person who oversees the maintenance of the MHM kit</Label>
                                                                                <FormGroup tag="fieldset" row>

                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="mhm_focal_person" id="yes" value="1" onChange={(e) => this.scoreChange(e, "mhm_focal_person")} />{' '}
                                                                                                Yes
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="mhm_focal_person" id="no" value="0" onChange={(e) => this.scoreChange(e, "mhm_focal_person")} />{' '}
                                                                                                No
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["mhm_focal_person"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12" style={mhmStyle}>
                                                                            <FormGroup >
                                                                                <Label for="mhm_kit_refill" >The MHM kit is checked on a monthly basis and is regularly refilled</Label>
                                                                                <FormGroup tag="fieldset" row>

                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="mhm_kit_refill" id="yes" value="1" onChange={(e) => this.scoreChange(e, "mhm_kit_refill")} />{' '}
                                                                                                Yes
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="mhm_kit_refill" id="no" value="0" onChange={(e) => this.scoreChange(e, "mhm_kit_refill")} />{' '}
                                                                                                No
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["mhm_kit_refill"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="6">
                                                                            <Label><h6><u><b>6. Provision of Safe, Clean and Hygienic Food and Water Sanitation</b></u></h6></Label>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="clean_drinking_water_access" >Teachers and students have access to clean drinking water</Label>
                                                                                <FormGroup tag="fieldset" row>

                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="clean_drinking_water_access" id="yes" value="1" onChange={(e) => this.scoreChange(e, "clean_drinking_water_access")} />{' '}
                                                                                                Yes
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="clean_drinking_water_access" id="no" value="0" onChange={(e) => this.scoreChange(e, "clean_drinking_water_access")} />{' '}
                                                                                                No
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["clean_drinking_water_access"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="clean_food_space_access" >Teachers and students have access to a hygienic space where food can be consumed</Label>
                                                                                <FormGroup tag="fieldset" row>

                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="clean_food_space_access" id="yes" value="1" onChange={(e) => this.scoreChange(e, "clean_food_space_access")} />{' '}
                                                                                                Yes
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="clean_food_space_access" id="no" value="0" onChange={(e) => this.scoreChange(e, "clean_food_space_access")} />{' '}
                                                                                                No
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["clean_food_space_access"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="sanitation_facilities_access" >Teachers and students have easy access to safe, clean and hygienic sanitation facilities</Label>
                                                                                <FormGroup tag="fieldset" row>

                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="sanitation_facilities_access" id="yes" value="1" onChange={(e) => this.scoreChange(e, "sanitation_facilities_access")} />{' '}
                                                                                                Yes
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="sanitation_facilities_access" id="no" value="0" onChange={(e) => this.scoreChange(e, "sanitation_facilities_access")} />{' '}
                                                                                                No
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["sanitation_facilities_access"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="toilet_assist_staff_trained" >Support staff hired to assist primary school children with going to the toilet are trained on appropriate use of language and cleaning techniques</Label>
                                                                                <FormGroup tag="fieldset" row>
                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="toilet_assist_staff_trained" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "toilet_assist_staff_trained")} />{' '}
                                                                                                Strongly Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="toilet_assist_staff_trained" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "toilet_assist_staff_trained")} />{' '}
                                                                                                Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="toilet_assist_staff_trained" id="neither" value="3" onChange={(e) => this.scoreChange(e, "toilet_assist_staff_trained")} />{' '}
                                                                                                Neither Agree nor Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="toilet_assist_staff_trained" id="agree" value="4" onChange={(e) => this.scoreChange(e, "toilet_assist_staff_trained")} />{' '}
                                                                                                Agree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="toilet_assist_staff_trained" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "toilet_assist_staff_trained")} />{' '}
                                                                                                Strongly Agree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["toilet_assist_staff_trained"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="separate_toilets" >Toilets for boys and girls are separate</Label>
                                                                                <FormGroup tag="fieldset" row>

                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="separate_toilets" id="yes" value="1" onChange={(e) => this.scoreChange(e, "separate_toilets")} />{' '}
                                                                                                Yes
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="separate_toilets" id="no" value="0" onChange={(e) => this.scoreChange(e, "separate_toilets")} />{' '}
                                                                                                No
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["separate_toilets"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="close_proximity_toilets" >Toilets are within close proximity to the classrooms</Label>
                                                                                <FormGroup tag="fieldset" row>

                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="close_proximity_toilets" id="yes" value="1" onChange={(e) => this.scoreChange(e, "close_proximity_toilets")} />{' '}
                                                                                                Yes
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="close_proximity_toilets" id="no" value="0" onChange={(e) => this.scoreChange(e, "close_proximity_toilets")} />{' '}
                                                                                                No
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["close_proximity_toilets"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="toilet_permission_given" >Teachers allow students to go to the toilet when they request permission</Label>
                                                                                <FormGroup tag="fieldset" row>
                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="toilet_permission_given" id="never" value="1" onChange={(e) => this.scoreChange(e, "toilet_permission_given")} />{' '}
                                                                                                Never
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="toilet_permission_given" id="rarely" value="2" onChange={(e) => this.scoreChange(e, "toilet_permission_given")} />{' '}
                                                                                                Rarely
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="toilet_permission_given" id="occasionally" value="3" onChange={(e) => this.scoreChange(e, "toilet_permission_given")} />{' '}
                                                                                                Occasionally
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="toilet_permission_given" id="frequently" value="4" onChange={(e) => this.scoreChange(e, "toilet_permission_given")} />{' '}
                                                                                                Frequently
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="toilet_permission_given" id="always" value="5" onChange={(e) => this.scoreChange(e, "toilet_permission_given")} />{' '}
                                                                                                Always
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["toilet_permission_given"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="well_equipped_toilets">Toilets are well equipped with clean water, soap, tissue paper, toilet rolls and dust-bins</Label>
                                                                                <FormGroup tag="fieldset" row>
                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="well_equipped_toilets" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "well_equipped_toilets")} />{' '}
                                                                                                Strongly Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="well_equipped_toilets" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "well_equipped_toilets")} />{' '}
                                                                                                Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="well_equipped_toilets" id="neither" value="3" onChange={(e) => this.scoreChange(e, "well_equipped_toilets")} />{' '}
                                                                                                Neither Agree nor Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="well_equipped_toilets" id="agree" value="4" onChange={(e) => this.scoreChange(e, "well_equipped_toilets")} />{' '}
                                                                                                Agree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="well_equipped_toilets" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "well_equipped_toilets")} />{' '}
                                                                                                Strongly Agree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["well_equipped_toilets"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="toilet_etiquette_awareness" >Students are well aware of proper toilet etiquette to improve hygienic practices, i.e. importance of hand washing, flushing, cleaning the toilet seat and not wasting water</Label>
                                                                                <FormGroup tag="fieldset" row>
                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="toilet_etiquette_awareness" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "toilet_etiquette_awareness")} />{' '}
                                                                                                Strongly Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="toilet_etiquette_awareness" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "toilet_etiquette_awareness")} />{' '}
                                                                                                Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="toilet_etiquette_awareness" id="neither" value="3" onChange={(e) => this.scoreChange(e, "toilet_etiquette_awareness")} />{' '}
                                                                                                Neither Agree nor Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="toilet_etiquette_awareness" id="agree" value="4" onChange={(e) => this.scoreChange(e, "toilet_etiquette_awareness")} />{' '}
                                                                                                Agree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="toilet_etiquette_awareness" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "toilet_etiquette_awareness")} />{' '}
                                                                                                Strongly Agree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["toilet_etiquette_awareness"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="toilet_cleaniness" >Support staff cleans the toilets at least 2-3 times a day with antibacterial products</Label>
                                                                                <FormGroup tag="fieldset" row>
                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="toilet_cleaniness" id="never" value="1" onChange={(e) => this.scoreChange(e, "toilet_cleaniness")} />{' '}
                                                                                                Never
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="toilet_cleaniness" id="rarely" value="2" onChange={(e) => this.scoreChange(e, "toilet_cleaniness")} />{' '}
                                                                                                Rarely
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="toilet_cleaniness" id="occasionally" value="3" onChange={(e) => this.scoreChange(e, "toilet_cleaniness")} />{' '}
                                                                                                Occasionally
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="toilet_cleaniness" id="frequently" value="4" onChange={(e) => this.scoreChange(e, "toilet_cleaniness")} />{' '}
                                                                                                Frequently
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="toilet_cleaniness" id="always" value="5" onChange={(e) => this.scoreChange(e, "toilet_cleaniness")} />{' '}
                                                                                                Always
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["toilet_cleaniness"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="6">
                                                                            <Label><h6><u><b>7. Zero Tolerance Policy</b></u></h6></Label>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="zero_tolerance_policy_maintained" >School management maintains a zero tolerance policy for any teachers, students and staff that commit any of the following: discrimination; sexual harassment; verbal or physical abuse; use of alcohol or drugs on school premises; sharing confidential information of students; teachers or staff; using school premises for illegal activity; criminal activities, theft or fraud.</Label>
                                                                                <FormGroup tag="fieldset" row>

                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="zero_tolerance_policy_maintained" id="yes" value="1" onChange={(e) => this.scoreChange(e, "zero_tolerance_policy_maintained")} />{' '}
                                                                                                Yes
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="zero_tolerance_policy_maintained" id="no" value="0" onChange={(e) => this.scoreChange(e, "zero_tolerance_policy_maintained")} />{' '}
                                                                                                No
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["zero_tolerance_policy_maintained"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="6">
                                                                            <Label><h6><u><b>8. Safety and Security</b></u></h6></Label>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="appropriate_security_measures" >The school management takes appropriate security measures (such as collecting their ID document) with all visitors entering the school premises</Label>
                                                                                <FormGroup tag="fieldset" row>
                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="appropriate_security_measures" id="never" value="1" onChange={(e) => this.scoreChange(e, "appropriate_security_measures")} />{' '}
                                                                                                Never
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="appropriate_security_measures" id="rarely" value="2" onChange={(e) => this.scoreChange(e, "appropriate_security_measures")} />{' '}
                                                                                                Rarely
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="appropriate_security_measures" id="occasionally" value="3" onChange={(e) => this.scoreChange(e, "appropriate_security_measures")} />{' '}
                                                                                                Occasionally
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="appropriate_security_measures" id="frequently" value="4" onChange={(e) => this.scoreChange(e, "appropriate_security_measures")} />{' '}
                                                                                                Frequently
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="appropriate_security_measures" id="always" value="5" onChange={(e) => this.scoreChange(e, "appropriate_security_measures")} />{' '}
                                                                                                Always
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["appropriate_security_measures"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="parents_given_security_update" >School management updates parents on security related policies and concerns that impact students</Label>
                                                                                <FormGroup tag="fieldset" row>
                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parents_given_security_update" id="never" value="1" onChange={(e) => this.scoreChange(e, "parents_given_security_update")} />{' '}
                                                                                                Never
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parents_given_security_update" id="rarely" value="2" onChange={(e) => this.scoreChange(e, "parents_given_security_update")} />{' '}
                                                                                                Rarely
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parents_given_security_update" id="occasionally" value="3" onChange={(e) => this.scoreChange(e, "parents_given_security_update")} />{' '}
                                                                                                Occasionally
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parents_given_security_update" id="frequently" value="4" onChange={(e) => this.scoreChange(e, "parents_given_security_update")} />{' '}
                                                                                                Frequently
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parents_given_security_update" id="always" value="5" onChange={(e) => this.scoreChange(e, "parents_given_security_update")} />{' '}
                                                                                                Always
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["parents_given_security_update"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    {/* onChange={(e) => {this.inputChange(e, "csa_resources_required")}} 
                                                                                                            */}

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="defined_student_pickup" >School management is informed about the adult responsible for the pick/drop of students</Label>
                                                                                <FormGroup tag="fieldset" row>
                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="defined_student_pickup" id="yes" value="1" onChange={(e) => this.scoreChange(e, "defined_student_pickup")} />{' '}
                                                                                                Yes
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="defined_student_pickup" id="no" value="0" onChange={(e) => this.scoreChange(e, "defined_student_pickup")} />{' '}
                                                                                                No
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["defined_student_pickup"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="correct_student_pickup_release" >Staff release students only to the aforementioned individuals</Label>
                                                                                <FormGroup tag="fieldset" row>
                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="correct_student_pickup_release" id="never" value="1" onChange={(e) => this.scoreChange(e, "correct_student_pickup_release")} />{' '}
                                                                                                Never
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="correct_student_pickup_release" id="rarely" value="2" onChange={(e) => this.scoreChange(e, "correct_student_pickup_release")} />{' '}
                                                                                                Rarely
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="correct_student_pickup_release" id="occasionally" value="3" onChange={(e) => this.scoreChange(e, "correct_student_pickup_release")} />{' '}
                                                                                                Occasionally
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="correct_student_pickup_release" id="frequently" value="4" onChange={(e) => this.scoreChange(e, "correct_student_pickup_release")} />{' '}
                                                                                                Frequently
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="correct_student_pickup_release" id="always" value="5" onChange={(e) => this.scoreChange(e, "correct_student_pickup_release")} />{' '}
                                                                                                Always
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["correct_student_pickup_release"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="parents_guided_security_precaution" >Management guides parents on security precautions they should take to ensure the safety of their children when coming to/leaving school, i.e. have the van drivers' CNIC number and references, tell their child not to leave school premises alone or with someone they were not previously informed would be picking them up</Label>
                                                                                <FormGroup tag="fieldset" row>
                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parents_guided_security_precaution" id="never" value="1" onChange={(e) => this.scoreChange(e, "parents_guided_security_precaution")} />{' '}
                                                                                                Never
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parents_guided_security_precaution" id="rarely" value="2" onChange={(e) => this.scoreChange(e, "parents_guided_security_precaution")} />{' '}
                                                                                                Rarely
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parents_guided_security_precaution" id="occasionally" value="3" onChange={(e) => this.scoreChange(e, "parents_guided_security_precaution")} />{' '}
                                                                                                Occasionally
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parents_guided_security_precaution" id="frequently" value="4" onChange={(e) => this.scoreChange(e, "parents_guided_security_precaution")} />{' '}
                                                                                                Frequently
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="parents_guided_security_precaution" id="always" value="5" onChange={(e) => this.scoreChange(e, "parents_guided_security_precaution")} />{' '}
                                                                                                Always
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["parents_guided_security_precaution"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="staff_student_interaction_code" >School management enforces stringent codes of conduct around staff and student interactions</Label>
                                                                                <FormGroup tag="fieldset" row>

                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="staff_student_interaction_code" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "staff_student_interaction_code")} />{' '}
                                                                                                Strongly Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="staff_student_interaction_code" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "staff_student_interaction_code")} />{' '}
                                                                                                Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="staff_student_interaction_code" id="neither" value="3" onChange={(e) => this.scoreChange(e, "staff_student_interaction_code")} />{' '}
                                                                                                Neither Agree nor Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="staff_student_interaction_code" id="agree" value="4" onChange={(e) => this.scoreChange(e, "staff_student_interaction_code")} />{' '}
                                                                                                Agree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="staff_student_interaction_code" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "staff_student_interaction_code")} />{' '}
                                                                                                Strongly Agree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["staff_student_interaction_code"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="open_door_policy" >An open door policy is implemented to ensure transparency and clear glass windows are installed in all classrooms and offices where possible</Label>
                                                                                <FormGroup tag="fieldset" row>

                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="open_door_policy" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "open_door_policy")} />{' '}
                                                                                                Strongly Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="open_door_policy" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "open_door_policy")} />{' '}
                                                                                                Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="open_door_policy" id="neither" value="3" onChange={(e) => this.scoreChange(e, "open_door_policy")} />{' '}
                                                                                                Neither Agree nor Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="open_door_policy" id="agree" value="4" onChange={(e) => this.scoreChange(e, "open_door_policy")} />{' '}
                                                                                                Agree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="open_door_policy" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "open_door_policy")} />{' '}
                                                                                                Strongly Agree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["open_door_policy"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="student_teacher_loitering_check" >Management checks for teachers, staff and students roaming around the premises in and out of school hours</Label>
                                                                                <FormGroup tag="fieldset" row>
                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="student_teacher_loitering_check" id="never" value="1" onChange={(e) => this.scoreChange(e, "student_teacher_loitering_check")} />{' '}
                                                                                                Never
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="student_teacher_loitering_check" id="rarely" value="2" onChange={(e) => this.scoreChange(e, "student_teacher_loitering_check")} />{' '}
                                                                                                Rarely
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="student_teacher_loitering_check" id="occasionally" value="3" onChange={(e) => this.scoreChange(e, "student_teacher_loitering_check")} />{' '}
                                                                                                Occasionally
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="student_teacher_loitering_check" id="frequently" value="4" onChange={(e) => this.scoreChange(e, "student_teacher_loitering_check")} />{' '}
                                                                                                Frequently
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="student_teacher_loitering_check" id="always" value="5" onChange={(e) => this.scoreChange(e, "student_teacher_loitering_check")} />{' '}
                                                                                                Always
                                                                            </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["student_teacher_loitering_check"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="12">
                                                                            <FormGroup >
                                                                                <Label for="teacher_staff_student_boubdaries" >Clear boundaries are enforced between teachers, staff and students - inappropriate body language, touch, or conversation are not acceptable</Label>
                                                                                <FormGroup tag="fieldset" row>

                                                                                    <Col >
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="teacher_staff_student_boubdaries" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "teacher_staff_student_boubdaries")} />{' '}
                                                                                                Strongly Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="teacher_staff_student_boubdaries" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "teacher_staff_student_boubdaries")} />{' '}
                                                                                                Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="teacher_staff_student_boubdaries" id="neither" value="3" onChange={(e) => this.scoreChange(e, "teacher_staff_student_boubdaries")} />{' '}
                                                                                                Neither Agree nor Disagree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="teacher_staff_student_boubdaries" id="agree" value="4" onChange={(e) => this.scoreChange(e, "teacher_staff_student_boubdaries")} />{' '}
                                                                                                Agree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <FormGroup check inline>
                                                                                            <Label check>
                                                                                                <Input type="radio" name="teacher_staff_student_boubdaries" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "teacher_staff_student_boubdaries")} />{' '}
                                                                                                Strongly Agree
                                                                                </Label>
                                                                                        </FormGroup>
                                                                                        <span class="errorMessage">{this.state.errors["teacher_staff_student_boubdaries"]}</span>
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                </div>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="srhr_score" style={{ color: "green" }}><b>Cumulative SRHR Policy Score <span className="required">*</span></b></Label>
                                                                            <Input value={this.state.srhr_score} name="srhr_score" id="srhr_score" onChange={(e) => { this.inputChange(e, "srhr_score") }} readOnly></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="srhr_score_pct" style={{ color: "green" }}><b>% Score <span className="required">*</span></b></Label>
                                                                            <Input name="srhr_score_pct" id="srhr_score_pct" value={this.state.srhr_score_pct} onChange={(e) => { this.inputChange(e, "srhr_score_pct") }} readOnly></Input>
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
                                                                <Button color="secondary" id="page_policy_a"
                                                                    className={"btn-shadow " + classnames({ active: this.state.activeTab === '2' })}
                                                                    onClick={() => {
                                                                        this.toggleTab('2');
                                                                    }}
                                                                >Policy</Button>

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

export default SrhrPolicy;