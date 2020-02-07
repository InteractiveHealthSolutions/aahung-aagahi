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

import { MDBIcon } from 'mdbreact';
import moment from 'moment';
import React, { Fragment } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Select from 'react-select';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, TabContent, TabPane } from 'reactstrap';
import CustomModal from "../alerts/CustomModal";
import "../index.css";
import { getDefinitionByDefinitionId, getDefinitionId, getDefinitionsByDefinitionType, getLocationsByCategory, getParticipantByRegexValue, getPersonAttributeTypeByShortName } from '../service/GetService';
import { saveParticipant, updateParticipant } from "../service/PostService";
import { UserService } from '../service/UserService';
import { clearCheckedFields, getObject, resetFormState } from "../util/AahungUtil.js";
import * as Constants from "../util/Constants";
import FormNavBar from "../widget/FormNavBar";
import LoadingIndicator from "../widget/LoadingIndicator";

const participantAffiliations = [
    { label: 'Hospital', value: 'hospital' },
    { label: 'NGO', value: 'ngo' },
    { label: 'Government', value: 'government' },
    { label: 'Education Institute', value: 'education_institute' },
    { label: 'No affiliation', value: 'none', },
    { label: 'Private', value: 'private' },
    { label: 'Public', value: 'public' },
    { label: 'Other', value: 'other', }
];

class GeneralParticipantDetail extends React.Component {

    modal = false;
    constructor(props) {
        super(props);
        this.state = {
            institutions: [],
            participant_id: '',
            participant_name: '',
            dob: '',
            sex: '',
            participant_type: 'preservice',
            education_level: 'no_education',
            instituition_role: 'faculty',
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

        this.toggle = this.toggle.bind(this);
        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.requiredFields = ["participant_name", "sex", "participant_affiliation", "education_level", "institution_id", "instituition_role"];
        this.participantId = '';
        this.errors = {};
        this.fetchedParticipant = {};
        this.isInstitutionRoleOther = false;
        this.isOtherParticipant = false;
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
                    self.isOtherParticipant = attributeValue === "other" ? true : false;
                }

                if (attrTypeName === "instituition_role") {
                    self.isInstitutionRoleOther = attributeValue === "other" ? true : false;
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

                            if (attrTypeName === "participant_affiliation") {
                                if (definitionArr[0].shortName === "other") {
                                    self.isAffiliationOther = true;
                                }
                            }
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
            participant_type: 'preservice',
            education_level: 'no_education',
            instituition_role: 'faculty'
        })

        this.isAffiliationOther = false;
        this.isInstitutionRoleOther = false;
        this.isOtherParticipant = false;
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
            this.isOtherParticipant = e.target.value === "other" ? true : false;
            this.isOtherParticipant ? this.requiredFields.push("participant_type_other") : this.requiredFields = this.requiredFields.filter(e => e !== "participant_type_other");
        }
        if (name === "instituition_role") {
            this.isInstitutionRoleOther = e.target.value === "other" ? true : false;
            this.isInstitutionRoleOther ? this.requiredFields.push("instituition_role_other") : this.requiredFields = this.requiredFields.filter(e => e !== "instituition_role_other");
        }
    }

    // for multi select
    valueChangeMulti(e, name) {

        this.setState({
            [name]: e
        });

        if (name === "participant_affiliation") {

            // checking with two of because when another value is selected and other is unchecked, it still does not change the state
            if (getObject('other', e, 'value') != -1) {
                this.isAffiliationOther = true;
            }
            if (getObject('other', e, 'value') == -1) {
                this.isAffiliationOther = false;
            }

            this.isAffiliationOther ? this.requiredFields.push("participant_affiliation_other") : this.requiredFields = this.requiredFields.filter(e => e !== "participant_affiliation_other");
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
            this.participantId = id.toString(36);
            this.participantId = this.participantId.toUpperCase();
            if(this.participantId.length < 10) {
                do {
                    this.participantId = this.participantId.concat('0');
                }
                while (this.participantId.length !== 10)
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
                    var isParticipantAffiliationOther = false;
                    var isParticipantTypeOther = false;
                    var isInstitutionRoleOther = false;

                    for (var obj of fetchedAttributes) {
                        delete obj.createdBy;
                        delete obj.updatedBy;

                        // Multiselect - participant_affiliation
                        if (obj.attributeType.shortName === "participant_affiliation") {
                            let attrValueObject = [];
                            for (let i = 0; i < self.state.participant_affiliation.length; i++) {
                                let definitionObj = {};
                                definitionObj.definitionId = await getDefinitionId("participant_affiliation", self.state.participant_affiliation[i].value);
                                attrValueObject.push(definitionObj);
                            }
                            obj.attributeValue = JSON.stringify(attrValueObject);
                        }

                        if (obj.attributeType.shortName === "participant_affiliation_other" && !this.isAffiliationOther) {
                            obj.isVoided = true;
                            isParticipantAffiliationOther = true;
                        }
                        else if (obj.attributeType.shortName === "participant_affiliation_other") {
                            obj.attributeValue = self.state.participant_affiliation_other;
                            obj.isVoided = false;
                            isParticipantAffiliationOther = true;
                        }

                        if (obj.attributeType.shortName === "participant_type") {
                            obj.attributeValue = await getDefinitionId("participant_type", self.state.participant_type);
                        }

                        if (obj.attributeType.shortName === "participant_type_other" && !this.isOtherParticipant) {
                            obj.isVoided = true;
                            isParticipantTypeOther = true;
                        }
                        else if (obj.attributeType.shortName === "participant_type_other") {
                            obj.attributeValue = self.state.participant_type_other;
                            obj.isVoided = false;
                            isParticipantTypeOther = true;
                        }

                        if (obj.attributeType.shortName === "education_level") {
                            obj.attributeValue = await getDefinitionId("education_level", self.state.education_level);
                        }

                        if (obj.attributeType.shortName === "instituition_role") {
                            obj.attributeValue = await getDefinitionId("instituition_role", self.state.instituition_role);
                        }

                        if (obj.attributeType.shortName === "instituition_role_other" && !this.isInstitutionRoleOther) {
                            obj.isVoided = true;
                            isInstitutionRoleOther = true;
                        }
                        else if (obj.attributeType.shortName === "instituition_role_other") {
                            obj.attributeValue = self.state.instituition_role_other;
                            obj.isVoided = false;
                            isInstitutionRoleOther = true;
                        }
                    }

                    if (!isParticipantAffiliationOther && (this.state.participant_affiliation_other != "" && this.isAffiliationOther)) {
                        var attrType = await getPersonAttributeTypeByShortName("participant_affiliation_other");
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = attrType;
                        attributeObject.attributeValue = this.state.participant_affiliation_other; // attributeValue obj
                        fetchedAttributes.push(attributeObject);
                    }

                    if (!isParticipantTypeOther && (this.state.participant_type_other != "" && this.isOtherParticipant)) {
                        var attrType = await getPersonAttributeTypeByShortName("participant_type_other");
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = attrType;
                        attributeObject.attributeValue = this.state.participant_type_other; // attributeValue obj
                        fetchedAttributes.push(attributeObject);
                    }

                    if (!isInstitutionRoleOther && (this.state.instituition_role_other != "" && this.isInstitutionRoleOther)) {
                        var attrType = await getPersonAttributeTypeByShortName("instituition_role_other");
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = attrType;
                        attributeObject.attributeValue = this.state.instituition_role_other; // attributeValue obj
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
                                    submitMsg = "Unable to update General Participant Details form. \
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
                    jsonData.person.firstName = this.state.participant_name;
                    jsonData.person.gender = this.state.sex;
                    jsonData.person.dob = this.state.dob;
                    if(this.isAgeEstimated) {
                        jsonData.person.dobEstimated = this.isAgeEstimated;
                    }

                    // type of participant
                    var attrType = await getPersonAttributeTypeByShortName("srhm_general_participant");
                    var attrTypeId = attrType.attributeTypeId;
                    var attributeObject = new Object(); // top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value 
                    attributeObject.attributeValue = true; // attributeValue obj
                    jsonData.person.attributes.push(attributeObject);

                    // ==== MULTISELECT location_attribute_types ===

                    // participant_affiliation > person attr type
                    var attrType = await getPersonAttributeTypeByShortName("participant_affiliation");
                    var attrTypeId = attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                    let attrValueObject = [];
                    for (let i = 0; i < this.state.participant_affiliation.length; i++) {
                        let definitionObj = {};
                        // send first: def type and second: definition shortname below
                        definitionObj.definitionId = await getDefinitionId("participant_affiliation", this.state.participant_affiliation[i].value);
                        attrValueObject.push(definitionObj);
                    }

                    attributeObject.attributeValue = JSON.stringify(attrValueObject); // attributeValue array of definitionIds
                    jsonData.person.attributes.push(attributeObject);

                    // participant_affiliation_other
                    if (this.isAffiliationOther) {

                        var attrType = await getPersonAttributeTypeByShortName("participant_affiliation_other");
                        var attrTypeId = attrType.attributeTypeId;
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = {};
                        attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value

                        attributeObject.attributeValue = this.state.participant_affiliation_other;
                        jsonData.person.attributes.push(attributeObject);
                    }

                    //participant_type
                    var attrType = await getPersonAttributeTypeByShortName("participant_type");
                    var attrTypeId = attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value

                    // var years = moment().diff(this.state.partnership_start_date, 'years');
                    attributeObject.attributeValue = await getDefinitionId("participant_type", this.state.participant_type); // attributeValue obj
                    jsonData.person.attributes.push(attributeObject);

                    if (this.isOtherParticipant) {
                        //participant_type
                        var attrType = await getPersonAttributeTypeByShortName("participant_type_other");
                        var attrTypeId = attrType.attributeTypeId;
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = {};
                        attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value

                        attributeObject.attributeValue = this.state.participant_type_other; // attributeValue obj
                        jsonData.person.attributes.push(attributeObject);
                    }

                    // education_level has a deinition datatype so attr value will be integer definitionid
                    var attrType = await getPersonAttributeTypeByShortName("education_level");
                    var attrTypeId = attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                    attributeObject.attributeValue = await getDefinitionId("education_level", this.state.education_level); // attributeValue obj
                    jsonData.person.attributes.push(attributeObject);

                    //instituition_role
                    var attrType = await getPersonAttributeTypeByShortName("instituition_role");
                    var attrTypeId = attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                    attributeObject.attributeValue = await getDefinitionId("instituition_role", this.state.instituition_role); // attributeValue obj
                    jsonData.person.attributes.push(attributeObject);

                    if (this.isInstitutionRoleOther) {
                        //instituition_role
                        var attrType = await getPersonAttributeTypeByShortName("instituition_role_other");
                        var attrTypeId = attrType.attributeTypeId;
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = {};
                        attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                        attributeObject.attributeValue = this.state.instituition_role_other; // attributeValue obj
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

        this.isOtherParticipant ? this.requiredFields.push("participant_type_other") : this.requiredFields = this.requiredFields.filter(e => e !== "participant_type_other");
        this.isInstitutionRoleOther ? this.requiredFields.push("instituition_role_other") : this.requiredFields = this.requiredFields.filter(e => e !== "instituition_role_other");
        this.isAffiliationOther ? this.requiredFields.push("participant_affiliation_other") : this.requiredFields = this.requiredFields.filter(e => e !== "participant_affiliation_other");
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

        console.log('dob and age >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
        console.log(this.state.dob);
        console.log(this.state.age);
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
            participant_type_other: '',
            instituition_role_other: '',
            participant_affiliation_other: '',
            dob: '',
            age: ''
        });

        this.updateDisplay();
    }

    // for modal
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }



    render() {
        const otherAffiliationStyle = this.isAffiliationOther ? {} : { display: 'none' };
        const otherRoleStyle = this.isInstitutionRoleOther ? {} : { display: 'none' };
        const otherParticipantStyle = this.isOtherParticipant ? {} : { display: 'none' };
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
                                                    <b>General Participant Details Form</b>
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
                                                                        <Label for="participant_name" >Participant Name <span className="required">*</span></Label>  <span class="errorMessage">{this.state.errors["participant_name"]}</span>
                                                                        <Input name="participant_name" id="participant_name" value={this.state.participant_name} onChange={(e) => { this.inputChange(e, "participant_name") }} maxLength='50' pattern="^[A-Za-z ]+" placeholder="Enter name" />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="age" >Age <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["age"]}</span>
                                                                        <Input type="number" value={this.state.age} name="age" id="age" onChange={(e) => { this.inputChange(e, "age") }} max="99" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2) }} placeholder="Enter age in years"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="dob" >Date of Birth <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["dob"]}</span>
                                                                        <Input type="date" name="dob" id="dob" value={this.state.dob} onChange={(e) => { this.inputChange(e, "dob") }} max={moment().format("YYYY-MM-DD")} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup tag="fieldset" row>
                                                                        <legend className="col-form-label col-sm-2">Sex <span className="required">*</span></legend>
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
                                                            
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="participant_affiliation" >Participant Affiliation <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["participant_affiliation"]}</span>
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "participant_affiliation")} value={this.state.participant_affiliation} id="participant_affiliation" options={participantAffiliations} isMulti />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={otherAffiliationStyle}>

                                                                    <FormGroup >
                                                                        <Label for="participant_affiliation_other" >Specify Other Affiliation</Label> <span class="errorMessage">{this.state.errors["participant_affiliation_other"]}</span>
                                                                        <Input name="participant_affiliation_other" id="participant_affiliation_other" onChange={(e) => this.inputChange(e, "participant_affiliation_other")} placeholder="Specify other" value={this.state.participant_affiliation_other} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="participant_type" >Type of Participant</Label> <span class="errorMessage">{this.state.errors["participant_type"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "participant_type")} value={this.state.participant_type} name="participant_type" id="participant_type">
                                                                            <option value="preservice">Pre-service providers</option>
                                                                            <option value="inservice">In-service providers</option>
                                                                            <option value="lhs">LHS</option>
                                                                            <option value="youth">Youth</option>
                                                                            <option value="project_staff">Project Staff</option>
                                                                            <option value="student">Student</option>
                                                                            <option value="other">Other</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={otherParticipantStyle}>

                                                                    <FormGroup >
                                                                        <Label for="participant_type_other" >Specify Other Type</Label> <span class="errorMessage">{this.state.errors["participant_type_other"]}</span>
                                                                        <Input name="participant_type_other" id="participant_type_other" onChange={(e) => this.inputChange(e, "participant_type_other")} placeholder="Specify other" value={this.state.participant_type_other} />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="education_level" >Level of Education</Label> <span class="errorMessage">{this.state.errors["education_level"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "education_level")} value={this.state.education_level} name="education_level" id="education_level">
                                                                            <option value="no_education">No Education</option>
                                                                            <option value="some_primary">Some Primary</option>
                                                                            <option value="primary">Primary</option>
                                                                            <option value="secondary">Secondary</option>
                                                                            <option value="college">College</option>
                                                                            <option value="undergraduate">Undergraduate</option>
                                                                            <option value="postgraduate">Post-graduate</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="institution_id" >Institution ID <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["institution_id"]}</span>
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
                                                                        <Label for="instituition_role" >Role in Institution</Label> <span class="errorMessage">{this.state.errors["instituition_role"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "instituition_role")} value={this.state.instituition_role} name="instituition_role" id="instituition_role">
                                                                            <option value="faculty">Faculty</option>
                                                                            <option value="student">Student</option>
                                                                            <option value="doctor">Doctor</option>
                                                                            <option value="nurse">Nurse</option>
                                                                            <option value="other">Other</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={otherRoleStyle}>
                                                                    <FormGroup >
                                                                        <Label for="instituition_role_other" >Specify Other Role</Label> <span class="errorMessage">{this.state.errors["instituition_role_other"]}</span>
                                                                        <Input name="instituition_role_other" id="instituition_role_other" onChange={(e) => this.inputChange(e, "instituition_role_other")} placeholder="Specify other" value={this.state.instituition_role_other} />
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

export default GeneralParticipantDetail;