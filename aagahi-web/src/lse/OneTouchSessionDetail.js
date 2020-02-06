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

import { MDBIcon } from 'mdbreact';
import moment from 'moment';
import React, { Fragment } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Select from 'react-select';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, TabContent, TabPane } from 'reactstrap';
import CustomModal from "../alerts/CustomModal";
import "../index.css";
import { getFormDataById, getFormTypeByUuid, getRoleByName, getUsersByRole } from "../service/GetService";
import { saveFormData, updateFormData } from "../service/PostService";
import { getObject, loadFormState } from "../util/AahungUtil.js";
import * as Constants from "../util/Constants";
import { getDistrictsByProvince, location } from "../util/LocationUtil.js";
import FormNavBar from "../widget/FormNavBar";
import LoadingIndicator from "../widget/LoadingIndicator";
import { UserService } from '../service/UserService';

const participantGenderOptions = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'other', label: 'Other' },
];

const participantAgeOptions = [
    { value: 'age_6_to_10', label: '6-10' },
    { value: 'age_11_to_15', label: '11-15' },
    { value: 'age_16_to_20', label: '16-20' },
    { value: 'age_21_to_25', label: '21-25' },
    { value: 'age_26_to_30', label: '26-30' },
    { value: 'age_31_to_35', label: '31-35' },
    { value: 'age_36_to_40', label: '36-40' },
    { value: 'age_41_to_45', label: '41-45' },
    { value: 'age_46_to_50', label: '46-50' },
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

class OneTouchSessionDetail extends React.Component {

    modal = false;
    constructor(props) {
        super(props);
        this.state = {
            trainers: [],
            session_topic: 'puberty',
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

        this.toggle = this.toggle.bind(this);
        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.inputChange = this.inputChange.bind(this);

        this.isSessionTypeOther = false;
        this.isParticipantTypeOther = false;
        this.isParticipantTypeStudent = false;
        this.isParticipantTypeParent = false;
        this.isParticipantTypeTeacher = false;
        this.isParticipantTypeSchool = false;
        this.isParticipantTypeCall = false;
        this.isParticipantTypeProfessional = false;
        this.isMale = false;
        this.isFemale = false;
        this.isOtherSex = false;
        this.formTypeId = 0;
        this.requiredFields = ["date_start", "province", "district", "institution_session_conducted", "trainer", "session_topic",
            "participants_sex", "event_attendant", "participants_age_group", "training_days"];
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
            let formTypeObj = await getFormTypeByUuid(Constants.ONE_TOUCH_SESSION_DETAIL_FORM_UUID);
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
            session_topic: 'puberty',
        })

        this.isSessionTypeOther = false;
        this.isParticipantTypeOther = false;
        this.isParticipantTypeStudent = false;
        this.isParticipantTypeParent = false;
        this.isParticipantTypeTeacher = false;
        this.isParticipantTypeSchool = false;
        this.isParticipantTypeCall = false;
        this.isParticipantTypeProfessional = false;
        this.isFemale = false;
        this.isMale = false;
        this.isOtherSex = false;
    }

    editUpdateDisplay() {

        if (this.state.session_topic !== undefined && this.state.session_topic !== '') {
            this.isSessionTypeOther = this.state.session_topic === "other" ? true : false;
        }

        if (this.state.event_attendant !== undefined && this.state.event_attendant.length > 0) {
            // checking twice because when another value is selected and other is unchecked, it still does not change the state
            if (getObject('other', this.state.event_attendant, 'value') != -1) {
                this.isParticipantTypeOther = true;
            }
            if (getObject('other', this.state.event_attendant, 'value') == -1) {
                this.isParticipantTypeOther = false;
            }

            if (getObject('students', this.state.event_attendant, 'value') != -1) {
                this.isParticipantTypeStudent = true;
            }
            if (getObject('students', this.state.event_attendant, 'value') == -1) {
                this.isParticipantTypeStudent = false;
            }

            if (getObject('parents', this.state.event_attendant, 'value') != -1) {
                this.isParticipantTypeParent = true;
            }
            if (getObject('parents', this.state.event_attendant, 'value') == -1) {
                this.isParticipantTypeParent = false;
            }

            if (getObject('teachers', this.state.event_attendant, 'value') != -1) {
                this.isParticipantTypeTeacher = true;
            }
            if (getObject('teachers', this.state.event_attendant, 'value') == -1) {
                this.isParticipantTypeTeacher = false;
            }

            if (getObject('school_staff', this.state.event_attendant, 'value') != -1) {
                this.isParticipantTypeSchool = true;
            }
            if (getObject('school_staff', this.state.event_attendant, 'value') == -1) {
                this.isParticipantTypeSchool = false;
            }

            if (getObject('call_agents', this.state.event_attendant, 'value') != -1) {
                this.isParticipantTypeCall = true;
            }
            if (getObject('call_agents', this.state.event_attendant, 'value') == -1) {
                this.isParticipantTypeCall = false;
            }

            if (getObject('other_professionals', this.state.event_attendant, 'value') != -1) {
                this.isParticipantTypeProfessional = true;
            }
            if (getObject('other_professionals', this.state.event_attendant, 'value') == -1) {
                this.isParticipantTypeProfessional = false;
            }
        }
        if (this.state.participants_sex !== undefined && this.state.participants_sex.length > 0) {
            if (getObject('other', this.state.participants_sex, 'value') != -1) {
                this.isOtherSex = true;
            }
            if (getObject('other', this.state.participants_sex, 'value') == -1) {
                this.isOtherSex = false;
            }

            if (getObject('female', this.state.participants_sex, 'value') != -1) {
                this.isFemale = true;
            }
            if (getObject('female', this.state.participants_sex, 'value') == -1) {
                this.isFemale = false;
            }

            if (getObject('male', this.state.participants_sex, 'value') != -1) {
                this.isMale = true;
            }
            if (getObject('male', this.state.participants_sex, 'value') == -1) {
                this.isMale = false;
            }
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

        if (name === "session_topic") {
            if (e.target.value === "other") {
                this.isSessionTypeOther = true;
            }
            else {
                this.isSessionTypeOther = false;
            }
        }
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
                this.isParticipantTypeOther = true;
            }
            if (getObject('other', e, 'value') == -1) {
                this.isParticipantTypeOther = false;
            }

            if (getObject('students', e, 'value') != -1) {
                this.isParticipantTypeStudent = true;
            }
            if (getObject('students', e, 'value') == -1) {
                this.isParticipantTypeStudent = false;
            }

            if (getObject('parents', e, 'value') != -1) {
                this.isParticipantTypeParent = true;
            }
            if (getObject('parents', e, 'value') == -1) {
                this.isParticipantTypeParent = false;
            }

            if (getObject('teachers', e, 'value') != -1) {
                this.isParticipantTypeTeacher = true;
            }
            if (getObject('teachers', e, 'value') == -1) {
                this.isParticipantTypeTeacher = false;
            }

            if (getObject('school_staff', e, 'value') != -1) {
                this.isParticipantTypeSchool = true;
            }
            if (getObject('school_staff', e, 'value') == -1) {
                this.isParticipantTypeSchool = false;
            }

            if (getObject('call_agents', e, 'value') != -1) {
                this.isParticipantTypeCall = true;
            }
            if (getObject('call_agents', e, 'value') == -1) {
                this.isParticipantTypeCall = false;
            }

            if (getObject('other_professionals', e, 'value') != -1) {
                this.isParticipantTypeProfessional = true;
            }
            if (getObject('other_professionals', e, 'value') == -1) {
                this.isParticipantTypeProfessional = false;
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
            jsonData.data.institution_session_conducted = data.get('institution_session_conducted');

            jsonData.data.trainer = [];
            if ((jsonData.data.trainer != null && jsonData.data.trainer != undefined)) {
                for (let i = 0; i < this.state.trainer.length; i++) {
                    jsonData.data.trainer.push({
                        "userId": this.state.trainer[i].id
                    });
                }
            }

            jsonData.data.session_topic = data.get('session_topic');
            if (this.isSessionTypeOther)
                jsonData.data.session_topic_other = data.get('session_topic_other');

            // generating multiselect for participants_sex
            if ((this.state.participants_sex != null && this.state.participants_sex != undefined)) {
                for (let i = 0; i < this.state.participants_sex.length; i++) {
                    jsonData.data.participants_sex.values.push(String(this.state.participants_sex[i].value));
                }
            }

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

            if (this.isParticipantTypeOther) {
                jsonData.data.event_attendant_other = data.get('event_attendant_other');
                jsonData.data.other_attendant_count = parseInt(data.get('other_attendant_count'));

            }

            if (this.isParticipantTypeStudent)
                jsonData.data.student_count = parseInt(data.get('student_count'));

            if (this.isParticipantTypeParent)
                jsonData.data.parent_count = parseInt(data.get('parent_count'));

            if (this.isParticipantTypeTeacher)
                jsonData.data.teacher_count = parseInt(data.get('teacher_count'));

            if (this.isParticipantTypeSchool)
                jsonData.data.school_staff_count = parseInt(data.get('school_staff_count'));

            if (this.isParticipantTypeCall)
                jsonData.data.call_agents_count = parseInt(data.get('call_agents_count'));

            if (this.isParticipantTypeProfessional)
                jsonData.data.other_professional_count = parseInt(data.get('other_professional_count'));

            if (this.isMale)
                jsonData.data.male_count = parseInt(data.get('male_count'));

            if (this.isFemale)
                jsonData.data.female_count = parseInt(data.get('female_count'));

            if (this.isOtherSex)
                jsonData.data.other_sex_count = parseInt(data.get('other_sex_count'));

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
        // adding these here because they are non-state variables
        this.isParticipantTypeOther ? this.requiredFields.push("event_attendant_other") : this.requiredFields = this.requiredFields.filter(e => e !== "event_attendant_other");
        this.isParticipantTypeOther ? this.requiredFields.push("other_attendant_count") : this.requiredFields = this.requiredFields.filter(e => e !== "other_attendant_count");
        this.isParticipantTypeStudent ? this.requiredFields.push("student_count") : this.requiredFields = this.requiredFields.filter(e => e !== "student_count");
        this.isParticipantTypeParent ? this.requiredFields.push("parent_count") : this.requiredFields = this.requiredFields.filter(e => e !== "parent_count");
        this.isParticipantTypeTeacher ? this.requiredFields.push("teacher_count") : this.requiredFields = this.requiredFields.filter(e => e !== "teacher_count");
        this.isParticipantTypeSchool ? this.requiredFields.push("school_staff_count") : this.requiredFields = this.requiredFields.filter(e => e !== "school_staff_count");
        this.isParticipantTypeCall ? this.requiredFields.push("call_agents_count") : this.requiredFields = this.requiredFields.filter(e => e !== "call_agents_count");
        this.isParticipantTypeProfessional ? this.requiredFields.push("other_professional_count") : this.requiredFields = this.requiredFields.filter(e => e !== "other_professional_count");
        this.isSessionTypeOther ? this.requiredFields.push("session_topic_other") : this.requiredFields = this.requiredFields.filter(e => e !== "session_topic_other");
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

        this.isParticipantTypeOther ? this.requiredFields.push("event_attendant_other") : this.requiredFields = this.requiredFields.filter(e => e !== "event_attendant_other");
        this.isParticipantTypeOther ? this.requiredFields.push("other_attendant_count") : this.requiredFields = this.requiredFields.filter(e => e !== "other_attendant_count");
        this.isParticipantTypeStudent ? this.requiredFields.push("student_count") : this.requiredFields = this.requiredFields.filter(e => e !== "student_count");
        this.isParticipantTypeParent ? this.requiredFields.push("parent_count") : this.requiredFields = this.requiredFields.filter(e => e !== "parent_count");
        this.isParticipantTypeTeacher ? this.requiredFields.push("teacher_count") : this.requiredFields = this.requiredFields.filter(e => e !== "teacher_count");
        this.isParticipantTypeSchool ? this.requiredFields.push("school_staff_count") : this.requiredFields = this.requiredFields.filter(e => e !== "school_staff_count");
        this.isParticipantTypeCall ? this.requiredFields.push("call_agents_count") : this.requiredFields = this.requiredFields.filter(e => e !== "call_agents_count");
        this.isParticipantTypeProfessional ? this.requiredFields.push("other_professional_count") : this.requiredFields = this.requiredFields.filter(e => e !== "other_professional_count");
        this.isSessionTypeOther ? this.requiredFields.push("session_topic_other") : this.requiredFields = this.requiredFields.filter(e => e !== "session_topic_other");

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

        this.state.institution_session_conducted = '';
        this.state.session_topic_other = '';
        this.state.event_attendant_other = '';
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
        const maleStyle = this.isMale ? {} : { display: 'none' };
        const femaleStyle = this.isFemale ? {} : { display: 'none' };
        const otherSexStyle = this.isOtherSex ? {} : { display: 'none' };
        const sessionTypeOtherStyle = this.isSessionTypeOther ? {} : { display: 'none' };
        const participantTypeOtherStyle = this.isParticipantTypeOther ? {} : { display: 'none' };
        const participantTypeStudentStyle = this.isParticipantTypeStudent ? {} : { display: 'none' };
        const participantTypeParentStyle = this.isParticipantTypeParent ? {} : { display: 'none' };
        const participantTypeTeacherStyle = this.isParticipantTypeTeacher ? {} : { display: 'none' };
        const participantTypeSchoolStyle = this.isParticipantTypeSchool ? {} : { display: 'none' };
        const participantTypeCallStyle = this.isParticipantTypeCall ? {} : { display: 'none' };
        const participantTypeProfessionalStyle = this.isParticipantTypeProfessional ? {} : { display: 'none' };

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
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="institution_session_conducted" >Name of Institution</Label> <span class="errorMessage">{this.state.errors["institution_session_conducted"]}</span>
                                                                            <Input name="institution_session_conducted" id="institution_session_conducted" value={this.state.institution_session_conducted} onChange={(e) => { this.inputChange(e, "institution_session_conducted") }} maxLength="100" placeholder="Enter text" />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="trainer" >Name(s) of Trainer(s)</Label> <span class="errorMessage">{this.state.errors["trainer"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "trainer")} value={this.state.trainer} id="trainer" options={this.state.trainers} isMulti />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="session_topic">Type of session</Label> <span class="errorMessage">{this.state.errors["session_topic"]}</span>
                                                                            {/* id for definition_type */}
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "session_topic")} value={this.state.session_topic} name="session_topic" id="session_topic">
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
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "participants_sex")} value={this.state.participants_sex} id="participants_sex" options={participantGenderOptions} isMulti />
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

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="participants_age_group" >Participant Age Group</Label> <span class="errorMessage">{this.state.errors["participants_age_group"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "participants_age_group")} value={this.state.participants_age_group} id="participants_age_group" options={participantAgeOptions} isMulti />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="event_attendant" >Type of Participants</Label> <span class="errorMessage">{this.state.errors["event_attendant"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "event_attendant")} value={this.state.event_attendant} id="event_attendant" options={participantTypeOptions} isMulti />
                                                                        </FormGroup>
                                                                    </Col>

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
                                                                <div style={{ height: '250px' }}><span>   </span></div>
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

export default OneTouchSessionDetail;