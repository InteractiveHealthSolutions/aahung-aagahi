/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-07-30 12:53:25
 * @modify date 2019-07-30 12:53:25
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

import moment from 'moment';
import { MDBIcon } from 'mdbreact';
import React, { Fragment } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Select from 'react-select';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, TabContent, TabPane } from 'reactstrap';
import CustomModal from "../alerts/CustomModal";
import "../index.css";
import { getDefinitionByDefinitionId, getDefinitionId, getDefinitionsByDefinitionType, getLocationsByCategory, getParticipantByRegexValue, getPersonAttributeTypeByShortName } from '../service/GetService';
import { saveParticipant, updateParticipant } from "../service/PostService";
import { clearCheckedFields, resetFormState } from "../util/AahungUtil";
import * as Constants from "../util/Constants";
import FormNavBar from "../widget/FormNavBar";
import LoadingIndicator from "../widget/LoadingIndicator";
import { UserService } from '../service/UserService';

class AmplifyChangeParticipantDetail extends React.Component {

    modal = false;
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            institutions: [],
            participant_id: '',
            participant_name: '',
            dob: '',
            sex: '',
            student_program: 'medical',
            participant_type: 'student',
            student_year: 'year_one',
            education_level: 'college',
            activeTab: '1',
            page2Show: true,
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

        this.editMode = false;
        this.requiredFields = ["participant_name", "sex", "institution_id"];
        this.participantId = '';
        this.errors = {};
        this.fetchedParticipant = {};

        this.isStudent = true;
        this.isTeacher = false;
        this.isAffiliationOther = false;
        this.isAgeEstimated = false;
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
                loadingMsg: "Fetching data..."
            })
            let institutions = await getLocationsByCategory(Constants.INSTITUTION_DEFINITION_UUID);
            if (institutions != null && institutions.length > 0) {
                this.setState({
                    institutions: institutions
                })
            }

            if (this.editMode) {
                this.fetchedParticipant = await getParticipantByRegexValue(String(this.props.location.state.participantId));
                console.log("fetched participant id is .................................");
                console.log(this.fetchedParticipant.participantId);
                this.participantId = this.fetchedParticipant.identifier;
                this.setState({
                    participant_name: this.fetchedParticipant.person.firstName,
                    dob: this.fetchedParticipant.person.dob,
                    sex: this.fetchedParticipant.person.gender
                })

                if(this.fetchedParticipant.person.dobEstimated === true) {
                    this.isAgeEstimated = true;
                    var age = moment().diff(this.fetchedParticipant.person.dob, 'years');
                    this.setState({
                        age: age
                    })
                }

                document.getElementById('male').checked = this.fetchedParticipant.person.gender === "Male";
                document.getElementById('female').checked = this.fetchedParticipant.person.gender === "Female";
                document.getElementById('other').checked = this.fetchedParticipant.person.gender === "Other";

                if (this.fetchedParticipant.location != null) {
                    this.setState({
                        institution_id: { "label": this.fetchedParticipant.location.shortName, "value": this.fetchedParticipant.location.locationName, "id": this.fetchedParticipant.location.locationId },
                        institution_name: this.fetchedParticipant.location.locationName
                    })
                }

                this.autopopulateFields(this.fetchedParticipant.person.attributes);
                this.setState({
                    loading: false
                })
            }

            this.setState({
                loading: false
            })
        }
        catch (error) {
            console.log(error);
        }
    }

    /**
     * created separate method because async handle was not updating the local variables (location attrs)
     */
    autopopulateFields(personAttributes) {

        let self = this;
        let attributeValue = '';
        personAttributes.forEach(async function (obj) {
            let attrTypeName = obj.attributeType.shortName;

            if (obj.attributeType.dataType.toUpperCase() != "JSON" && obj.attributeType.dataType.toUpperCase() != "DEFINITION") {
                attributeValue = obj.attributeValue;
            }

            if (obj.attributeType.dataType.toUpperCase() == "DEFINITION") {
                // fetch definition shortname
                let definitionId = obj.attributeValue;
                let definition = await getDefinitionByDefinitionId(definitionId);
                let attrValue = definition.shortName;
                attributeValue = attrValue;

                if (attrTypeName === "participant_type") {

                    self.isStudent = attributeValue === "student" ? true : false;
                    self.isTeacher = attributeValue === "teacher" ? true : false;
                }
            }

            if (obj.attributeType.dataType.toUpperCase() == "JSON") {

                var arr = [];
                // attr value is a JSON obj > [{"definitionId":13},{"definitionId":14}]
                let attrValueObj = JSON.parse(obj.attributeValue);
                if (attrValueObj != null && attrValueObj.length > 0) {
                    let attributeArray = [];
                    if ('definitionId' in attrValueObj[0]) {
                        attributeArray = await getDefinitionsByDefinitionType(attrTypeName);
                        attrValueObj.forEach(async function (obj) {
                            // definitionArr contains only one item because filter will return only one definition
                            let definitionArr = attributeArray.filter(df => df.id == parseInt(obj.definitionId));
                            arr.push({ label: definitionArr[0].definitionName, value: definitionArr[0].shortName });
                        })
                    }
                }
                // attributeValue = multiSelectString;
                self.setState({
                    [attrTypeName]: arr
                })
                return;
            }

            self.setState({ [attrTypeName]: attributeValue });
        })

    }

    updateDisplay() {
        this.setState({

            student_program: 'medical',
            participant_type: 'student',
            student_year: 'year_one',
            education_level: 'college'
        })

        this.isStudent = false;
        this.isTeacher = false;
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

        if(name === "dob") {
            var age = moment().diff(e.target.value, 'years');
            this.setState( {
                age : age
            })
        }

        if(name === "age") {
            this.isAgeEstimated = true;
            var birthDate = moment().subtract(e.target.value, 'years');
            this.setState({
                dob : birthDate.format("YYYY-MM-DD")
            })
        }
    }

    // for single select
    valueChange = (e, name) => {


        this.setState({
            [name]: e.target.value
        });

        if (name === "participant_type") {

            this.isStudent = e.target.value === "student" ? true : false;
            this.isTeacher = e.target.value === "teacher" ? true : false;
            this.isStudent ? this.requiredFields.push("student_year") : this.requiredFields = this.requiredFields.filter(e => e !== "student_year");
            this.isStudent ? this.requiredFields.push("student_program") : this.requiredFields = this.requiredFields.filter(e => e !== "student_program");
            this.isTeacher ? this.requiredFields.push("teacher_subject") : this.requiredFields = this.requiredFields.filter(e => e !== "teacher_subject");
            this.isTeacher ? this.requiredFields.push("teaching_years") : this.requiredFields = this.requiredFields.filter(e => e !== "teaching_years");
            this.isTeacher ? this.requiredFields.push("education_level") : this.requiredFields = this.requiredFields.filter(e => e !== "education_level");
        }
    }

    // for multi select
    valueChangeMulti(e, name) {
        console.log(e);
        this.setState({
            [name]: e
        });
    }

    callModal = () => {
        this.setState({ modal: !this.state.modal });
    }

    // for autocomplete single select
    handleChange(e, name) {

        this.setState({
            [name]: e
        });

        try {
            if (name === "institution_id") {
                this.setState({ institution_name: e.locationName });
                document.getElementById("institution_name").value = e.locationName;
            }

            if (name === "participant_name") {
                this.setState({ participant_id: e.identifier });
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    beforeSubmit() {

        // autogenerate parent organization id
        try {

            var user = JSON.parse(sessionStorage.getItem('user'));
            var userId = user.userId;
            var timestamp = moment().format('YYMMDDhhmmss');
            this.participantId = String(userId) + timestamp;

            var id = parseInt(this.participantId);
            this.participantId = id.toString(36);       // decode like this > parseInt(this.participantId, 36)
            this.participantId = this.participantId.toUpperCase();
            if(this.participantId.length < 10) {
                do {
                    this.participantId = this.participantId.concat('0');
                }
                while (this.participantId.length != 10)
            }

        }
        catch (error) {
            console.log(error);
        }

    }

    handleSubmit = async event => {

        event.preventDefault();
        if (this.handleValidation()) {
            console.log("in submission");
            this.setState({
                loading: true,
                loadingMsg: "Saving trees..."
            })

            try {

                if (this.editMode) {
                    let self = this;
                    if (this.state.institution_id != undefined && this.state.institution_id != null) {
                        this.fetchedParticipant.location.locationId = this.state.institution_id.id;
                    }

                    this.fetchedParticipant.person.country = "Pakistan";
                    this.fetchedParticipant.person.firstName = this.state.participant_name;
                    this.fetchedParticipant.person.gender = this.state.sex;
                    this.fetchedParticipant.person.dob = this.state.dob;
                    if(this.isAgeEstimated) {
                        this.fetchedParticipant.person.dobEstimated = this.isAgeEstimated;
                    }

                    var fetchedAttributes = this.fetchedParticipant.person.attributes;
                    var isStudentProgram = false;
                    var isStudentYear = false;
                    var isTeacherSubject = false;
                    var isTeachingYears = false;
                    var isEducationLevel = false;

                    for (var obj of fetchedAttributes) {

                        delete obj.createdBy;
                        delete obj.updatedBy;
                        // participant_type
                        if (obj.attributeType.shortName === "participant_type") {
                            obj.attributeValue = await getDefinitionId("participant_type", self.state.participant_type);
                        }

                        if (obj.attributeType.shortName === "student_program" && !this.isStudent) {
                            obj.isVoided = true;
                            isStudentProgram = true;
                        }
                        else if (obj.attributeType.shortName === "student_program") {
                            obj.attributeValue = await getDefinitionId("student_program", self.state.student_program);
                            obj.isVoided = false;
                            isStudentProgram = true;
                        }

                        if (obj.attributeType.shortName === "student_year" && !this.isStudent) {
                            obj.isVoided = true;
                            isStudentYear = true;
                        }
                        else if (obj.attributeType.shortName === "student_year") {
                            obj.attributeValue = await getDefinitionId("student_year", self.state.student_year);
                            obj.isVoided = false;
                            isStudentYear = true;
                        }

                        if (obj.attributeType.shortName === "teacher_subject" && !this.isTeacher) {
                            obj.isVoided = true;
                            isTeacherSubject = true;
                        }
                        else if (obj.attributeType.shortName === "teacher_subject") {
                            obj.attributeValue = self.state.teacher_subject;
                            obj.isVoided = false;
                            isTeacherSubject = true;
                        }

                        if (obj.attributeType.shortName === "teaching_years" && !this.isTeacher) {
                            obj.isVoided = true;
                            isTeachingYears = true;
                        }
                        else if (obj.attributeType.shortName === "teaching_years") {
                            obj.attributeValue = self.state.teaching_years;
                            obj.isVoided = false;
                            isTeachingYears = true;
                        }

                        if (obj.attributeType.shortName === "education_level" && !this.isTeacher) {
                            obj.isVoided = true;
                            isEducationLevel = true;
                        }
                        else if (obj.attributeType.shortName === "education_level") {
                            obj.attributeValue = await getDefinitionId("education_level", self.state.education_level);
                            obj.isVoided = false;
                            isEducationLevel = true;
                        }
                    }

                    if (!isStudentProgram && (this.state.student_program != "" && this.isStudent)) {
                        var attrType = await getPersonAttributeTypeByShortName("student_program");
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = attrType;
                        attributeObject.attributeValue = await getDefinitionId("student_program", self.state.student_program); // attributeValue obj
                        fetchedAttributes.push(attributeObject);
                    }

                    if (!isStudentYear && (this.state.student_year != "" && this.isStudent)) {
                        var attrType = await getPersonAttributeTypeByShortName("student_year");
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = attrType;
                        attributeObject.attributeValue = await getDefinitionId("student_year", this.state.student_year); // attributeValue obj
                        fetchedAttributes.push(attributeObject);
                    }

                    if (!isTeacherSubject && (this.state.teacher_subject != "" && this.isTeacher)) {
                        var attrType = await getPersonAttributeTypeByShortName("teacher_subject");
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = attrType;
                        attributeObject.attributeValue = this.state.teacher_subject; // attributeValue obj
                        fetchedAttributes.push(attributeObject);
                    }

                    if (!isTeachingYears && (this.state.teaching_years != "" && this.isTeacher)) {
                        var attrType = await getPersonAttributeTypeByShortName("teaching_years");
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = attrType;
                        attributeObject.attributeValue = this.state.teaching_years; // attributeValue obj
                        fetchedAttributes.push(attributeObject);
                    }

                    if (!isEducationLevel && (this.state.education_level != "" && this.isTeacher)) {
                        var attrType = await getPersonAttributeTypeByShortName("education_level");
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = attrType;
                        attributeObject.attributeValue = await getDefinitionId("education_level", this.state.education_level); // attributeValue obj
                        fetchedAttributes.push(attributeObject);
                    }

                    this.fetchedParticipant.person.attributes = fetchedAttributes;
                    delete this.fetchedParticipant.createdBy;
                    delete this.fetchedParticipant.updatedBy;
                    delete this.fetchedParticipant.person.updatedBy;

                    updateParticipant(this.fetchedParticipant, this.fetchedParticipant.uuid)
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
                                    submitMsg = "Unable to update AC Participant Details form. \
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

                    this.beforeSubmit();

                    const data = new FormData(event.target);
                    console.log(data);
                    var jsonData = new Object();
                    jsonData.identifier = this.participantId;
                    jsonData.location = {};
                    jsonData.location.locationId = this.state.institution_id.id;
                    
                    jsonData.person = {};
                    jsonData.person.attributes = [];
                    jsonData.person.country = "Pakistan";
                    // jsonData.person.date_start = this.state.date_start;
                    jsonData.person.firstName = this.state.participant_name;
                    jsonData.person.dob = this.state.dob;
                    jsonData.person.gender = this.state.sex;
                    if(this.isAgeEstimated) {
                        jsonData.person.dobEstimated = this.isAgeEstimated;
                    }


                    // type of participant = srhm_ac_participant
                    var attrType = await getPersonAttributeTypeByShortName("srhm_ac_participant");
                    var attrTypeId = attrType.attributeTypeId;
                    var attributeObject = new Object(); // top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value 
                    attributeObject.attributeValue = true; // attributeValue obj
                    jsonData.person.attributes.push(attributeObject);


                    //participant_type
                    var attrType = await getPersonAttributeTypeByShortName("participant_type");
                    var attrTypeId = attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                    attributeObject.attributeValue = await getDefinitionId("participant_type", this.state.participant_type); // attributeValue obj
                    jsonData.person.attributes.push(attributeObject);

                    if (this.isStudent) {

                        // student_program
                        var attrType = await getPersonAttributeTypeByShortName("student_program");
                        var attrTypeId = attrType.attributeTypeId;
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = {};
                        attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                        attributeObject.attributeValue = await getDefinitionId("student_program", this.state.student_program); // attributeValue obj
                        jsonData.person.attributes.push(attributeObject);

                        // student_year
                        var attrType = await getPersonAttributeTypeByShortName("student_year");
                        var attrTypeId = attrType.attributeTypeId;
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = {};
                        attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                        attributeObject.attributeValue = await getDefinitionId("student_year", this.state.student_year); // attributeValue obj
                        jsonData.person.attributes.push(attributeObject);

                    }

                    if (this.isTeacher) {

                        //teacher_subject
                        var attrType = await getPersonAttributeTypeByShortName("teacher_subject");
                        var attrTypeId = attrType.attributeTypeId;
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = {};
                        attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value

                        attributeObject.attributeValue = this.state.teacher_subject; // attributeValue obj
                        jsonData.person.attributes.push(attributeObject);


                        //teacher_subject
                        var attrType = await getPersonAttributeTypeByShortName("teaching_years");
                        var attrTypeId = attrType.attributeTypeId;
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = {};
                        attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value

                        attributeObject.attributeValue = parseInt(this.state.teaching_years); // attributeValue obj
                        jsonData.person.attributes.push(attributeObject);

                        // education_level
                        var attrType = await getPersonAttributeTypeByShortName("education_level");
                        var attrTypeId = attrType.attributeTypeId;
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = {};
                        attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value

                        // var years = moment().diff(this.state.partnership_start_date, 'years');
                        attributeObject.attributeValue = await getDefinitionId("education_level", this.state.education_level); // attributeValue obj
                        jsonData.person.attributes.push(attributeObject);
                    }

                    console.log(jsonData);
                    saveParticipant(jsonData)
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
                                    submitMsg = "Unable to submit school details form. \
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
            catch (error) {

                console.log(error);
                var submitMsg = '';
                submitMsg = "An error occured. Please see error logs for details. "


                this.setState({
                    loading: false,
                    modalHeading: 'Fail!',
                    okButtonStyle: { display: 'none' },
                    modalText: submitMsg,
                    modal: !this.state.modal
                });


            }

        }

    }

    handleValidation() {
        // check each required state

        this.isStudent ? this.requiredFields.push("student_year") : this.requiredFields = this.requiredFields.filter(e => e !== "student_year");
        this.isStudent ? this.requiredFields.push("student_program") : this.requiredFields = this.requiredFields.filter(e => e !== "student_program");
        this.isTeacher ? this.requiredFields.push("teacher_subject") : this.requiredFields = this.requiredFields.filter(e => e !== "teacher_subject");
        this.isTeacher ? this.requiredFields.push("teaching_years") : this.requiredFields = this.requiredFields.filter(e => e !== "teaching_years");
        this.isTeacher ? this.requiredFields.push("education_level") : this.requiredFields = this.requiredFields.filter(e => e !== "education_level");

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

        // Check 'teaching_years' to be less than age of participant
        if (this.state.teaching_years != '') {
            var now = moment(new Date()); //todays date
            var dobDate = moment(document.getElementById('dob').value); // another date
            var duration = moment.duration(now.diff(dobDate));
            var ageYears = duration.asYears();
            var teachingYears = parseInt(document.getElementById('teaching_years').value);
            if (teachingYears > ageYears) {
                isOk = false;
                this.errors['teaching_years'] = "Enter valid number of teaching years";
            }
        }

        if((this.state.dob === '' || this.state.dob === undefined) && (this.state.age === '' || this.state.age === undefined)) {
            this.errors['dob'] = "Either enter dob or age";
            this.errors['age'] = "Either enter age or dob";
            isOk = false;
        }
        return isOk;
    }

    /**
    * clear fields
    */
    resetForm = (fields) => {

        this.state = resetFormState(fields, this.state);
        clearCheckedFields();
        this.participantId = '';
        this.setState({
            institution_name: '',
            dob: '',
            age: ''
        })
        this.updateDisplay();
    }

    // for modal
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }



    render() {
        const { selectedOption } = this.state;
        const studentStyle = this.isStudent ? {} : { display: 'none' };
        const teacherStyle = this.isTeacher ? {} : { display: 'none' };
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
            buttonDisabled = UserService.hasAccess('Edit SRHM Participant') ? false : true;
        }

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
                                                    <b>Amplify Change Participant Details Form</b>
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
                                                    <TabContent activeTab={this.state.activeTab}>
                                                        <TabPane tabId="1">
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="participant_id" >Participant ID</Label> <span class="errorMessage">{this.state.errors["participant_id"]}</span>
                                                                        <Input type="text" name="participant_id" id="participant_id" value={this.participantId} placeholder="Autogenerated" maxLength='10' disabled />

                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="participant_name" >Participant Name</Label>  <span class="errorMessage">{this.state.errors["participant_name"]}</span>
                                                                        <Input name="participant_name" id="participant_name" value={this.state.participant_name} onChange={(e) => { this.inputChange(e, "participant_name") }} maxLength='50' pattern="^[A-Za-z ]+" placeholder="Enter name" />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="age" >Age</Label> <span class="errorMessage">{this.state.errors["age"]}</span>
                                                                        <Input type="number" value={this.state.age} name="age" id="age" onChange={(e) => { this.inputChange(e, "age") }} max="99" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2) }} placeholder="Enter age in years"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="dob" >Date of Birth</Label> <span class="errorMessage">{this.state.errors["dob"]}</span>
                                                                        <Input type="date" name="dob" id="dob" value={this.state.dob} onChange={(e) => { this.inputChange(e, "dob") }} max={moment().format("YYYY-MM-DD")} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup tag="fieldset" row>
                                                                        <legend className="col-form-label col-sm-2">Sex</legend>
                                                                        <Col sm={10}>
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="sex" id="male" value="Male" /* checked= {this.state.sex === 'Male'} */ onChange={(e) => this.valueChange(e, "sex")} />{' '}
                                                                                    Male
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="sex" id="female" value="Female" /* checked= {this.state.sex === 'Female'} */ onChange={(e) => this.valueChange(e, "sex")} />{' '}
                                                                                    Female
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="sex" id="other" value="Other" /* checked= {this.state.sex === 'Other'} */ onChange={(e) => this.valueChange(e, "sex")} />{' '}
                                                                                    Other
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["sex"]}</span>
                                                                        </Col>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="institution_id" >Institution ID</Label> <span class="errorMessage">{this.state.errors["institution_id"]}</span>
                                                                        <Select id="institution_id"
                                                                            name="institution_id"
                                                                            value={this.state.institution_id}
                                                                            onChange={(e) => this.handleChange(e, "institution_id")}
                                                                            options={this.state.institutions}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">

                                                                    <FormGroup >
                                                                        <Label for="institution_name" >Institution Name</Label>
                                                                        <Input name="institution_name" id="institution_name" placeholder="Autopopulated Institution Name" value={this.state.institution_name} disabled />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="participant_type" >Type of Participant</Label> <span class="errorMessage">{this.state.errors["participant_type"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "participant_type")} value={this.state.participant_type} name="participant_type" id="participant_type">
                                                                            <option value="student">Student</option>
                                                                            <option value="teacher">Teacher</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6" style={studentStyle}>

                                                                    <FormGroup >
                                                                        <Label for="student_program" >Program of Student</Label> <span class="errorMessage">{this.state.errors["student_program"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "student_program")} value={this.state.student_program} name="student_program" id="student_program">
                                                                            <option value="medical">Medical</option>
                                                                            <option value="nursing">Nursing</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={studentStyle}>
                                                                    <FormGroup >
                                                                        <Label for="student_year" >Program Year of Student</Label> <span class="errorMessage">{this.state.errors["student_year"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "student_year")} value={this.state.student_year} name="student_year" id="student_year">
                                                                            <option value="year_one">1</option>
                                                                            <option value="year_two">2</option>
                                                                            <option value="year_three">3</option>
                                                                            <option value="year_four">4</option>
                                                                            <option value="year_five">5</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={teacherStyle}>

                                                                    <FormGroup >
                                                                        <Label for="teacher_subject" >Teacher Subject</Label> <span class="errorMessage">{this.state.errors["teacher_subject"]}</span>
                                                                        <Input name="teacher_subject" id="teacher_subject" onChange={(e) => this.inputChange(e, "teacher_subject")} placeholder="Enter subject" value={this.state.teacher_subject} />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={teacherStyle}>

                                                                    <FormGroup >
                                                                        <Label for="teaching_years" >Number of years teaching</Label> <span class="errorMessage">{this.state.errors["teaching_years"]}</span>
                                                                        <Input type="number" name="teaching_years" id="teaching_years" onChange={(e) => this.inputChange(e, "teaching_years")} max="99" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2) }} placeholder="Enter years" value={this.state.teaching_years} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row style={teacherStyle}>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="education_level" >Level of Education</Label> <span class="errorMessage">{this.state.errors["education_level"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "education_level")} value={this.state.education_level} name="education_level" id="education_level">
                                                                            <option value="college">College</option>
                                                                            <option value="undergraduate">Undergraduate</option>
                                                                            <option value="postgraduate">Postgraduate</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            {/* please don't remove this div unless you are adding another form question here*/}
                                                            <div style={{ height: '250px' }}><span>   </span></div>
                                                        </TabPane>
                                                    </TabContent>
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

export default AmplifyChangeParticipantDetail;