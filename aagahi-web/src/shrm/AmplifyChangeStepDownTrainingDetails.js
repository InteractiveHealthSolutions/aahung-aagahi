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

import { MDBBtn, MDBContainer, MDBIcon, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from 'mdbreact';
import moment from 'moment';
import React, { Fragment } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Select from 'react-select';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, TabContent, TabPane } from 'reactstrap';
import CustomModal from "../alerts/CustomModal";
import "../index.css";
import { getDefinitionByDefinitionId, getDefinitionsByDefinitionType, getFormDataById, getFormTypeByUuid, getLocationsByCategory, getParticipantsByLocation, getPersonAttributesByPerson } from "../service/GetService";
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
    { value: 'provision_aysrh_services', label: 'Provision of AYSRH services' },
    { value: 'other', label: 'Other' }
];

const participantSex = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
];

const participantTypes = [
    { value: 'university_students', label: 'University Students' },
    { value: 'parents', label: 'Parents' },
    { value: 'community_leaders', label: 'Community Leaders' },
    { value: 'adolescents_youth', label: 'Adolescents and Youth (Age 15-29)' },
    { value: 'children', label: 'Children (Age 0-14)' },
    { value: 'other', label: 'Other' }
];

const participantAge = [
    { value: 'age_0_to_5', label: '0-5' },
    { value: 'age_6_to_10', label: '6-10' },
    { value: 'age_11_to_15', label: '11-15' },
    { value: 'age_16_to_20', label: '16-20' },
    { value: 'age_21_to_49', label: '21-49' },
    { value: 'geq_50', label: '50+' },
    
];

class AmplifyChangeStepDownTrainingDetails extends React.Component {
    
    modal = false;
    
    constructor(props) {
        super(props);        
        this.toggle = this.toggle.bind(this);
        this.state = {
            date_start: '',
            institutions: [],
            users: [],
            participants: [],
            trainers: [],
            donorList : [],
            participant_id : '',
            participant_name: '',
            dob: '',
            sex : '',
            school_id: [],
            csa_prompts: '',
            subject_taught : [], // all the form elements states are in underscore notation i.e variable names in codebook
            subject_taught_other: '',
            teaching_years: '',
            education_level: 'no_edu',
            donor_name: '',
            activeTab: '1',
            page2Show: true,
            viewMode: false,
            errors: {},
            hasError: false,
            loading: false,
            form_disabled : false
        };

        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.inputChange = this.inputChange.bind(this);

        this.isUniversityStudent = false;
        this.isParents = false;
        this.isChildren = false;
        this.isCommunityLeader = false;
        this.isYouth = false;
        this.isChildren = false;
        this.isOtherParticipantType = false;
        this.isOtherTopic = false;
        this.isFemale = false;
        this.isMale = false;
        this.isOtherSex = false; 
        this.isParticipantOther = false;
        
        this.isRemoveInfo = false;
        this.loading = false;
        this.form_disabled = false;

        this.formTypeId = 0;
        this.requiredFields = ["date_start", "province", "district", "instituition_id", "participant_id", "participant_name",  "event_attendant", "participants_sex", "participants_age_group", "topic_covered"];
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
            let formTypeObj = await getFormTypeByUuid(Constants.AMPLIFY_CHANGE_STEP_DOWN_TRAINING_FORM_UUID);
            this.formTypeId = formTypeObj.formTypeId;
            
            let institutions = await getLocationsByCategory(Constants.INSTITUTION_DEFINITION_UUID);
            if (institutions != null && institutions.length > 0) {
                this.setState({
                    institutions: institutions
                })
            }

            if(this.editMode) {
                this.fetchedForm = await getFormDataById(String(this.props.location.state.formId));
                
                if(this.fetchedForm !== null) {
                    this.state = loadFormState(this.fetchedForm, this.state); // autopopulates the whole form
                    this.setState({
                        date_start: moment(this.fetchedForm.formDate).format('YYYY-MM-DD')
                    })
                    
                    this.setState({
                        instituition_id: { id: this.fetchedForm.location.locationId, label: this.fetchedForm.location.shortName, value: this.fetchedForm.location.locationName },
                        institution_name: this.fetchedForm.location.locationName
                    })
                    let attributes = await getPersonAttributesByPerson(this.state.participant_name.personUuid);
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
        catch(error) {
            console.log(error);
            var errorMsg = String(error);
            this.setState({ 
                loading: false,
                modalHeading : 'Fail!',
                okButtonStyle : { display: 'none' },
                modalText : errorMsg,
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

    // for text and numeric questions
    inputChange(e, name) {
        let errorText = '';
        if(e.target.pattern != "" ) {
            errorText = e.target.value.match(e.target.pattern) != e.target.value ? "invalid!" : '';
            console.log(errorText);
            this.errors[name] = errorText;
        }

        this.setState({
            [name]: e.target.value
        });
        this.setState({errors: this.errors});
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
        
        if (name === "event_attendant") {
            if (getObject('university_students', e, 'value') != -1) {
                this.isUniversityStudent = true;
            }
            if (getObject('university_students', e, 'value') == -1) { 
                this.isUniversityStudent = false;
            }
            
            if (getObject('parents', e, 'value') != -1) {
                this.isParents = true;
            }
            if (getObject('parents', e, 'value') == -1) {
                this.isParents = false;
            }
            
            if (getObject('community_leaders', e, 'value') != -1) { 
                this.isCommunityLeader = true;
            }
            if (getObject('community_leaders', e, 'value') == -1) {
                this.isCommunityLeader = false;
            }
            
            if (getObject('adolescents_youth', e, 'value') != -1) {
                this.isYouth = true;
            }
            if (getObject('adolescents_youth', e, 'value') == -1) { 
                this.isYouth = false;
            }

            if (getObject('children', e, 'value') != -1) {
                this.isChildren = true;
            }
            if (getObject('children', e, 'value') == -1) {
                this.isChildren = false;
            }
            
            if (getObject('other', e, 'value') != -1) {
                this.isParticipantOther = true;                
            }
            if (getObject('other', e, 'value') == -1) {
                this.isParticipantOther = false;
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
        this.setState({ modal : !this.state.modal });
    }

    // for autocomplete single select
    async handleChange(e, name) {
        // alert(e.label); // label: Punjab
        this.setState({
            [name]: e
        });

        if(name === "province"){
            let districts = getDistrictsByProvince(e.id); // sending province integer id
            console.log(districts);
            this.setState({
                districtArray : districts
            })
        }

        this.setState({
            [name]: e
        });

        try {

            if (name === "instituition_id") {

                this.setState({ institution_name : e.locationName});
                document.getElementById("institution_name").value= e.locationName;
                let participants =  await getParticipantsByLocation(e.uuid);
                if (participants != null && participants.length > 0) {
                    this.setState({
                        participants: participants,
                        participant_name: [],
                        participant_id: '',
                        participant_type: ''
                    })
                }
                else { 
                    this.setState({
                        participants: [],
                        participant_name: [],
                        participant_id: '',
                        participant_type: ''
                    })
                }
            }

            if (name === "participant_name") {

                this.setState({
                    participant_id: e.identifier,
                    loading: true,
                    loadingMsg: 'Fetching Data...'
                })
                let attributes = await getPersonAttributesByPerson(e.personUuid);
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
    autopopulateFields(personAttributes) {
        
        let self = this;
        let attributeValue = '';
        let count = 0; 
        try {
            personAttributes.forEach(async function (obj) {

                let attrTypeName = obj.attributeType.shortName;
                if (obj.attributeType.dataType.toUpperCase() != "JSON" || obj.attributeType.dataType.toUpperCase() != "DEFINITION") {
                    attributeValue = obj.attributeValue;
                }
                if (obj.attributeType.dataType.toUpperCase() == "DEFINITION") {
                    // fetch definition shortname
                    let definitionId = obj.attributeValue;
                    let definition = await getDefinitionByDefinitionId(definitionId);
                    let attrValue = definition.definitionName;
                    attributeValue = attrValue;
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
                                multiSelectString = multiSelectString.concat(definitionArr[0].definitionName);
                                if (count != attrValueObj.length) {
                                    multiSelectString = multiSelectString.concat(", ");
                                }
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

            this.setState({ 
                loading: false
            })
        }
        catch(error) {
            console.log(error);
            var errMsg = '';
            errMsg = "Unable to autopopulate participant details. Please see error logs for more details. ";
            
            this.setState({ 
                loading: false,
                modalHeading : 'Fail!',
                okButtonStyle : { display: 'none' },
                modalText : errMsg,
                modal: !this.state.modal
            });
        }
    }
    

    handleSubmit = event => {
        event.preventDefault();
        if(this.handleValidation()) {

            console.log("in submission");

            this.setState({
                loading : true,
                loadingMsg: "Saving trees..."
            })
            
            const data = new FormData(event.target);
            var jsonData = new Object();
            jsonData.formDate =  this.state.date_start;
            jsonData.formType = {};
            jsonData.formType.formTypeId = this.formTypeId;
            jsonData.referenceId = "";
            jsonData.location = {};
            jsonData.location.locationId = this.state.instituition_id.id;
            
            jsonData.data = {};
            // jsonData.data.aahung_staff = [];
            jsonData.data.event_attendant = {};
            jsonData.data.event_attendant.values = [];
            jsonData.data.participants_sex = {};
            jsonData.data.participants_sex.values = [];
            jsonData.data.participants_age_group = {};
            jsonData.data.participants_age_group.values = [];
            jsonData.data.topic_covered = {};
            jsonData.data.topic_covered.values = [];
            
            // adding required properties in data property
            jsonData.data.date_start = this.state.date_start;
            jsonData.data.province = data.get('province');
            jsonData.data.district = this.state.district.label;
            jsonData.data.participant_id = this.state.participant_id;
            
            // generating multiselect for event_attendant
            if((this.state.event_attendant != null && this.state.event_attendant != undefined)) {
                for(let i=0; i< this.state.event_attendant.length; i++) {
                    jsonData.data.event_attendant.values.push(String(this.state.event_attendant[i].value));
                }
            }
        
            if(this.isParticipantOther) {
                jsonData.data.event_attendant_other =  data.get('event_attendant_other');
                jsonData.data.other_attendant_count =  parseInt(data.get('other_attendant_count'));
                
            }

            if(this.isUniversityStudent) 
                jsonData.data.university_student_count = parseInt(data.get('university_student_count'));
            
            if(this.isParents) 
                jsonData.data.parent_count = parseInt(data.get('parent_count'));
            
            if(this.isCommunityLeader) 
                jsonData.data.community_leader_count = parseInt(data.get('community_leader_count'));

            if(this.isYouth) 
                jsonData.data.adolescent_youth_count = parseInt(data.get('adolescent_youth_count'));

            if(this.isChildren) 
                jsonData.data.children_count = parseInt(data.get('children_count'));
            
            // generating multiselect for participants_sex
            if((this.state.participants_sex != null && this.state.participants_sex != undefined)) {
                for(let i=0; i< this.state.participants_sex.length; i++) {
                    jsonData.data.participants_sex.values.push(String(this.state.participants_sex[i].value));
                }
            }

            if(this.isFemale) 
                jsonData.data.female_count = parseInt(data.get('female_count'));
            
            if(this.isMale) 
                jsonData.data.male_count = parseInt(data.get('male_count'));
            
            if(this.isOtherSex) 
                jsonData.data.other_sex_count = parseInt(data.get('other_sex_count'));
            
            // generating multiselect for participants_sex
            if((this.state.participants_age_group != null && this.state.participants_age_group != undefined)) {
                for(let i=0; i< this.state.participants_age_group.length; i++) {
                    jsonData.data.participants_age_group.values.push(String(this.state.participants_age_group[i].value));
                }
            }

            // generating multiselect for topic_covered
            if((this.state.topic_covered != null && this.state.topic_covered != undefined)) {
                for(let i=0; i< this.state.topic_covered.length; i++) {
                    jsonData.data.topic_covered.values.push(String(this.state.topic_covered[i].value));
                }
            }
            
            if(this.isOtherTopic)
                jsonData.data.topic_covered_other = data.get('topic_covered_other');

            console.log(jsonData);
            // JSON.parse(JSON.stringify(dataObject));
            
            if(this.editMode) {
                jsonData.uuid = this.fetchedForm.uuid;
                jsonData.referenceId =  this.fetchedForm.referenceId;
                updateFormData(jsonData)
                .then(
                    responseData => {
                        if(!(String(responseData).includes("Error"))) {
                            this.setState({ 
                                loading: false,
                                modalHeading : 'Success!',
                                okButtonStyle : { display: 'none' },
                                modalText : 'Data updated successfully.',
                                modal: !this.state.modal
                            });
                            this.resetForm(this.requiredFields);
                        }
                        else if(String(responseData).includes("Error")) {
                            
                            var submitMsg = '';
                            submitMsg = "Unable to update data. Please see error logs for details. \
                            " + String(responseData);
                            
                            this.setState({ 
                                loading: false,
                                modalHeading : 'Fail!',
                                okButtonStyle : { display: 'none' },
                                modalText : submitMsg,
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
                        if(!(String(responseData).includes("Error"))) {
                            this.setState({ 
                                loading: false,
                                modalHeading : 'Success!',
                                okButtonStyle : { display: 'none' },
                                modalText : 'Data saved successfully.',
                                modal: !this.state.modal
                            });
                            
                            this.resetForm(this.requiredFields);
                        }
                        else if(String(responseData).includes("Error")) {
                            
                            var submitMsg = '';
                            submitMsg = "Unable to submit Form. \
                            " + String(responseData);
                            
                            this.setState({ 
                                loading: false,
                                modalHeading : 'Fail!',
                                okButtonStyle : { display: 'none' },
                                modalText : submitMsg,
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
        this.isParticipantOther ? this.requiredFields.push("event_attendant_other") : this.requiredFields = this.requiredFields.filter(e => e !== "event_attendant_other");
        this.isParticipantOther ? this.requiredFields.push("other_attendant_count") : this.requiredFields = this.requiredFields.filter(e => e !== "other_attendant_count");
        this.isFemale ? this.requiredFields.push("female_count") : this.requiredFields = this.requiredFields.filter(e => e !== "female_count");
        this.isMale ? this.requiredFields.push("male_count") : this.requiredFields = this.requiredFields.filter(e => e !== "male_count");
        this.isOtherSex ? this.requiredFields.push("other_sex_count") : this.requiredFields = this.requiredFields.filter(e => e !== "other_sex_count");
        this.isUniversityStudent ? this.requiredFields.push("university_student_count") : this.requiredFields = this.requiredFields.filter(e => e !== "university_student_count");
        this.isParents ? this.requiredFields.push("parent_count") : this.requiredFields = this.requiredFields.filter(e => e !== "parent_count");
        this.isCommunityLeader ? this.requiredFields.push("community_leader_count") : this.requiredFields = this.requiredFields.filter(e => e !== "community_leader_count");
        this.isYouth ? this.requiredFields.push("adolescent_youth_count") : this.requiredFields = this.requiredFields.filter(e => e !== "adolescent_youth_count");
        this.isChildren ? this.requiredFields.push("children_count") : this.requiredFields = this.requiredFields.filter(e => e !== "children_count");
    }

    handleValidation() {
        // check each required state
        this.updateRequiredFieldsArray();
        let formIsValid = true;
        this.setState({ hasError: this.checkValid(this.requiredFields) ? false : true });
        formIsValid = this.checkValid(this.requiredFields);
        this.setState({errors: this.errors});
        return formIsValid;
    }

    /**
     * verifies and notifies for the empty form fields
     */
    checkValid = (fields) => {

        let isOk = true;
        this.errors = {};
        const errorText = "Required";
        for(let j=0; j < fields.length; j++) {
            
            let stateName = fields[j];
            // for array object
            if(typeof this.state[stateName] === 'object' && this.state[stateName] === null) {
                isOk = false;
                this.errors[fields[j]] = errorText;
            }
            else if(typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                isOk = false;
                this.errors[fields[j]] = errorText;
            }
            
            // for text and others
            if(typeof this.state[stateName] != 'object') {   
                if(this.state[stateName] === "" || this.state[stateName] == undefined) {
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
        // emptying non required fields
        this.setState({
            district: '',
            province: '',
            participant_type: '',
            institution_name: '',
            participant_id : ''
        })
        this.updateDisplay();
    }

    updateDisplay() {
        this.isUniversityStudent = false;
        this.isParents = false;
        this.isChildren = false;
        this.isCommunityLeader = false;
        this.isYouth = false;
        this.isChildren = false;
        this.isOtherParticipantType = false;
        this.isOtherTopic = false;
        this.isFemale = false;
        this.isMale = false;
        this.isOtherSex = false; 
        this.isParticipantOther = false;
    }

    editUpdateDisplay() {
        
        if (this.state.topic_covered != undefined && this.state.topic_covered.length > 0) {
            if (getObject('other', this.state.topic_covered, 'value') != -1) {
                this.isOtherTopic = true;
            }
            if (getObject('other', this.state.topic_covered, 'value') == -1) {
                this.isOtherTopic = false
            }
        }
        
        if (this.state.event_attendant != undefined && this.state.event_attendant.length > 0) {
            if (getObject('university_students', this.state.event_attendant, 'value') != -1) {
                this.isUniversityStudent = true;
            }
            if (getObject('university_students', this.state.event_attendant, 'value') == -1) { 
                this.isUniversityStudent = false;
            }
            
            if (getObject('parents', this.state.event_attendant, 'value') != -1) {
                this.isParents = true;
            }
            if (getObject('parents', this.state.event_attendant, 'value') == -1) {
                this.isParents = false;
            }
            
            if (getObject('community_leaders', this.state.event_attendant, 'value') != -1) { 
                this.isCommunityLeader = true;
            }
            if (getObject('community_leaders', this.state.event_attendant, 'value') == -1) {
                this.isCommunityLeader = false;
            }
            
            if (getObject('adolescents_youth', this.state.event_attendant, 'value') != -1) {
                this.isYouth = true;
            }
            if (getObject('adolescents_youth', this.state.event_attendant, 'value') == -1) { 
                this.isYouth = false;
            }

            if (getObject('children', this.state.event_attendant, 'value') != -1) {
                this.isChildren = true;
            }
            if (getObject('children', this.state.event_attendant, 'value') == -1) {
                this.isChildren = false;
            }
            
            if (getObject('other', this.state.event_attendant, 'value') != -1) {
                this.isParticipantOther = true;                
            }
            if (getObject('other', this.state.event_attendant, 'value') == -1) {
                this.isParticipantOther = false;
            }
        }

        if (this.state.participants_sex != undefined && this.state.participants_sex.length > 0) {
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

    // for modal
    toggle = () => {
        this.setState({
          modal: !this.state.modal
        });
    }

    render() {

        const page2style = this.state.page2Show ? {} : { display: 'none' };

        // for view mode
        const setDisable = this.state.viewMode ? "disabled" : "";

        const otherTopicStyle = this.isOtherTopic ? {} : { display: 'none' };
        const otherParticipantTypeStyle = this.isParticipantOther ? {} : { display: 'none' };
        const uniStudentStyle = this.isUniversityStudent ? {} : { display: 'none' }; 
        const parentStyle = this.isParents ? {} : { display: 'none' }; 
        const childrenStyle = this.isChildren ? {} : { display: 'none' }; 
        const communityLeaderStyle = this.isCommunityLeader ? {} : { display: 'none' }; 
        const youthStyle = this.isYouth ? {} : { display: 'none' }; 

        const otherSexStyle = this.isOtherSex ? {} : { display: 'none' };
        const femaleStyle = this.isFemale ? {} : { display: 'none' };
        const maleStyle = this.isMale ? {} : { display: 'none' };
        var formNavVisible = false;
        if(this.props.location.state !== undefined) {
            formNavVisible = this.props.location.state.edit ? true : false ;
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
                                                <b>Amplify Change Step Down Training Details</b>
                                            </CardHeader>
                                        </Card>
                                    </Col>
                                    <Col md="3">
                                    </Col>
                                    <Col md="3">
                                    
                                    </Col>
                                </Row>

                                {/* <br/> */}

                                <Row>
                                    <Col md="12">
                                        <Card className="main-card mb-6 center-col">
                                            <CardBody>

                                                {/* error message div */}
                                                <div class="alert alert-danger" style={this.state.hasError ? {} : { display: 'none' }} >
                                                <span class="errorMessage"><u>Errors: <br/></u> Form has some errors. Please check for required or invalid fields.<br/></span>
                                                </div>

                                                <br/>
                                                <fieldset disabled={this.form_disabled}>
                                                    <TabContent activeTab={this.state.activeTab}>
                                                        <TabPane tabId="1">
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup inline>
                                                                        <Label for="date_start" >Form Date</Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                        <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} max={moment().format("YYYY-MM-DD")}/>
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
                                                                        <Label for="instituition_id" >Institution ID</Label> <span class="errorMessage">{this.state.errors["instituition_id"]}</span>
                                                                        <Select id="instituition_id" name="instituition_id" value={this.state.instituition_id} onChange={(e) => this.handleChange(e, "instituition_id")} options={this.state.institutions} />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="institution_name" >Institution Name</Label> <span class="errorMessage">{this.state.errors["institution_name"]}</span>
                                                                        <Input name="institution_name" id="institution_name" value={this.state.institution_name} onChange={(e) => { this.inputChange(e, "institution_name") }} disabled/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="participant_name" >Participant Name</Label> <span class="errorMessage">{this.state.errors["participant_name"]}</span>
                                                                        <Select onChange={(e) => this.handleChange(e, "participant_name")} value={this.state.participant_name} id="participant_name" options={this.state.participants}  />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="participant_id" >Participant ID</Label> 
                                                                        <Input name="participant_id" id="participant_id" value={this.state.participant_id} disabled/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                        <Label for="participant_type" >Type of Facilitator</Label> <span class="errorMessage">{this.state.errors["participant_type"]}</span>
                                                                        <Input name="participant_type" id="participant_type" value={this.state.participant_type} onChange={(e) => { this.inputChange(e, "participant_type") }} disabled/>
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>


                                                            <Row>
                                                            <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="event_attendant" >Type of participants attending</Label> <span class="errorMessage">{this.state.errors["event_attendant"]}</span>
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "event_attendant")} value={this.state.event_attendant} id="event_attendant" options={participantTypes} isMulti/>  
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={otherParticipantTypeStyle}>
                                                                    <FormGroup >
                                                                        <Label for="event_attendant_other" >Specify Other Type of Participants</Label> <span class="errorMessage">{this.state.errors["event_attendant_other"]}</span>
                                                                        <Input name="event_attendant_other" id="event_attendant_other" value={this.state.event_attendant_other} onChange={(e) => {this.inputChange(e, "event_attendant_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>
                                                           

                                                                <Col md="6" style={uniStudentStyle}>
                                                                    <FormGroup >
                                                                        <Label for="university_student_count">Number of University Students</Label> <span class="errorMessage">{this.state.errors["university_student_count"]}</span>
                                                                        <Input type="number" value={this.state.university_student_count} name="university_student_count" id="university_student_count" onChange={(e) => { this.inputChange(e, "university_student_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={parentStyle}>
                                                                    <FormGroup >
                                                                        <Label for="parent_count">Number of Parents</Label> <span class="errorMessage">{this.state.errors["parent_count"]}</span>
                                                                        <Input type="number" value={this.state.parent_count} name="parent_count" id="parent_count" onChange={(e) => { this.inputChange(e, "parent_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>


                                                                <Col md="6" style={communityLeaderStyle}>
                                                                    <FormGroup >
                                                                        <Label for="community_leader_count" >Number of Community Leaders </Label> <span class="errorMessage">{this.state.errors["community_leader_count"]}</span>
                                                                        <Input type="number" value={this.state.community_leader_count} name="community_leader_count" id="community_leader_count" onChange={(e) => { this.inputChange(e, "community_leader_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={youthStyle}>
                                                                    <FormGroup >
                                                                        <Label for="adolescent_youth_count" >Number of Adolescents and Youth (Age 15-29)</Label> <span class="errorMessage">{this.state.errors["adolescent_youth_count"]}</span>
                                                                        <Input type="number" value={this.state.adolescent_youth_count} name="adolescent_youth_count" id="adolescent_youth_count" onChange={(e) => { this.inputChange(e, "adolescent_youth_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={childrenStyle}>
                                                                    <FormGroup >
                                                                        <Label for="children_count" >Number of Children (Age 0-14)</Label> <span class="errorMessage">{this.state.errors["children_count"]}</span>
                                                                        <Input type="number" value={this.state.children_count} name="children_count" id="children_count" onChange={(e) => { this.inputChange(e, "children_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={otherParticipantTypeStyle}>
                                                                
                                                                    <FormGroup >
                                                                        <Label for="other_attendant_count" >Number of Other</Label> <span class="errorMessage">{this.state.errors["other_attendant_count"]}</span>
                                                                        <Input type="number" value={this.state.other_attendant_count} name="other_attendant_count" id="other_attendant_count" onChange={(e) => { this.inputChange(e, "other_attendant_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="participants_sex" >Sex of Participants</Label> <span class="errorMessage">{this.state.errors["participants_sex"]}</span>
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "participants_sex")} value={this.state.participants_sex} id="participants_sex" options={participantSex} isMulti/>  
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
                                                                        <Label for="participants_age_group" >Age of participants</Label> <span class="errorMessage">{this.state.errors["participants_age_group"]}</span>
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "participants_age_group")} value={this.state.participants_age_group} id="participants_age_group" options={participantAge} isMulti/>
                                                                    </FormGroup>
                                                                </Col>
                                                          
                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="topic_covered" >Topics Covered</Label> <span class="errorMessage">{this.state.errors["topic_covered"]}</span>
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "topic_covered")} value={this.state.topic_covered} id="topic_covered" options={coveredTopics} isMulti/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={otherTopicStyle}>
                                                                    <FormGroup >
                                                                        <Label for="topic_covered_other" >Specify Other Topic</Label> <span class="errorMessage">{this.state.errors["topic_covered_other"]}</span>
                                                                        <Input name="topic_covered_other" id="topic_covered_other" value={this.state.topic_covered_other} onChange={(e) => {this.inputChange(e, "topic_covered_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>


                                                            {/* please don't remove this div unless you are adding multiple questions here*/}
                                                            <div style={{height: '250px'}}><span>   </span></div>

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
                                                        <LoadingIndicator loading={this.state.loading} msg={this.state.loadingMsg}/>
                                                    </Col>
                                                    <Col md="3">
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit">Submit<MDBIcon icon="smile" className="ml-2" size="lg"/></Button>
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

export default AmplifyChangeStepDownTrainingDetails;