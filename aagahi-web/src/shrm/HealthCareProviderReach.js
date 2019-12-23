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

import { MDBBtn, MDBContainer, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBIcon } from 'mdbreact';
import moment from 'moment';
import React, { Fragment } from "react";
import Select from 'react-select';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, TabContent, TabPane } from 'reactstrap';
import CustomModal from "../alerts/CustomModal";
import "../index.css";
import { getDefinitionByDefinitionId, getDefinitionsByDefinitionType, getFormTypeByUuid, getFormDataById, getLocationsByCategory, getParticipantsByLocation, getPersonAttributesByPerson } from "../service/GetService";
import * as Constants from "../util/Constants";
import { getDistrictsByProvince, location } from "../util/LocationUtil.js";
import LoadingIndicator from "../widget/LoadingIndicator";
import { getObject, loadFormState, resetFormState } from "../util/AahungUtil.js";
import { BrowserRouter as Router } from 'react-router-dom';
import { saveFormData, updateFormData } from "../service/PostService";
import FormNavBar from "../widget/FormNavBar";

const participantSex = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
];

const servicesTypes = [
    { value: 'family_planning', label: 'Family Planning' },
    { value: 'post_abortion_care', label: 'Post Abortion Care' },
    { value: 'rti', label: 'RTIs' },
    { value: 'sti', label: 'STIs' },
    { value: 'other', label: 'Other' }
];

const participantAge = [
    { value: 'age_0_to_5', label: '0-5' },
    { value: 'age_6_to_10', label: '6-10' },
    { value: 'age_11_to_15', label: '11-15' },
    { value: 'age_16_to_20', label: '16-20' },
    { value: 'age_21_to_49', label: '21-49' },
    { value: 'geq_50', label: '50+' }
];

class HealthCareProviderReach extends React.Component {
    
    modal = false;
    constructor(props) {
        super(props);
        this.state = {
            date_start: '',
            institutions: [],
            users: [],
            participants: [],
            participant_id : '',
            participant_name: '',
            trainers: [],
            donorList : [],
            sex : '',
            activeTab: '1',
            viewMode: false,
            errors: {},
            isCsa: true,
            isGender: false,
            hasError: false,
            loading: false,
            form_disabled : false
        };

        this.toggle = this.toggle.bind(this);
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
        this.isFirstFollowup = false;
        this.isFemale = false;
        this.isMale = false;
        this.isOtherSex = false; 
        this.isServiceTypeOther = false;
        this.isZero = false;
        this.isSix = false;
        this.isEleven = false;
        this.isSixteen = false;
        this.isTwentyOne = false;
        this.isFiftyPlus = false;

        this.loading = false;
        this.form_disabled = false;
        this.formTypeId = 0;
        this.requiredFields = ["date_start", "instituition_id", "participant_name", "participant_id", "province", "district", "first_fup", "participants_sex", "participants_age_group", "services_provided_type" ];
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
            let formTypeObj = await getFormTypeByUuid(Constants.HEALTH_CARE_PROVIDER_REACH_FORM_UUID);
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
                        sex: this.state.participant_name.gender,
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

    editUpdateDisplay() {
        this.isFirstFollowup  = this.state.first_fup === "no" ? true : false;

        if (this.state.services_provided_type !== undefined && this.state.services_provided_type.length > 0) {
            var services = this.state.services_provided_type
            if (getObject('other', services, 'value') != -1) {
                this.isServiceTypeOther = true;   
            }
            if (getObject('other', services, 'value') == -1) {
                this.isServiceTypeOther = false;
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
        
        if (this.state.participants_age_group !== undefined && this.state.participants_age_group.length > 0 ) {
            var ageGroups = this.state.participants_age_group;
            if (getObject('age_0_to_5', ageGroups, 'value') != -1) {
                this.isZero = true;
            }
            if (getObject('age_0_to_5', ageGroups, 'value') == -1) {
                this.isZero = false;
            }
            
            if (getObject('age_6_to_10', ageGroups, 'value') != -1) {
                this.isSix = true;
            }
            if (getObject('age_6_to_10', ageGroups, 'value') == -1) {
                this.isSix = false;
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

    updateDisplay() {
        this.isUniversityStudent = false;
        this.isParents = false;
        this.isChildren = false;
        this.isCommunityLeader = false;
        this.isYouth = false;
        this.isChildren = false;        
        this.isFirstFollowup = false;
        this.isFemale = false;
        this.isMale = false;
        this.isOtherSex = false; 
        this.isServiceTypeOther = false;
        this.isZero = false;
        this.isSix = false;
        this.isEleven = false;
        this.isSixteen = false;
        this.isTwentyOne = false;
        this.isFiftyPlus = false;
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

        if(name === "first_fup") {
            this.isFirstFollowup  = e.target.value === "no" ? true : false;
        }
    }

    // only for time widget <TimeField>
    getTime = (e, name) => {
        this.setState({
            [name]: e
        });
    }

    // for multi select
    valueChangeMulti(e, name) {
        console.log(e);
        
        this.setState({
            [name]: e
        });
        
        if (name === "services_provided_type") {
            if (getObject('other', e, 'value') != -1) {
                this.isServiceTypeOther = true;   
            }
            if (getObject('other', e, 'value') == -1) {
                this.isServiceTypeOther = false;
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
            if (getObject('age_0_to_5', e, 'value') != -1) {
                this.isZero = true;
            }
            if (getObject('age_0_to_5', e, 'value') == -1) {
                this.isZero = false;
            }
            
            if (getObject('age_6_to_10', e, 'value') != -1) {
                this.isSix = true;
            }
            if (getObject('age_6_to_10', e, 'value') == -1) {
                this.isSix = false;
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
                
                // alert(e.uuid);
                let participants =  await getParticipantsByLocation(e.uuid);
                if (participants != null && participants.length > 0) {
                    this.setState({
                        participant_id: '',
                        participant_name: [],
                        sex: '',
                        participant_affiliation: '', 
                        participant_affiliation_other: '',
                        participants: participants
                    })
                }
                else { 
                    this.setState({
                        participants: [],
                        participant_id: '',
                        participant_name: [],
                        sex: '',
                        participant_affiliation: '', 
                        participant_affiliation_other: '',
                    })
                }       
            }

            if (name === "participant_name") {
                this.setState({
                    participant_id: e.identifier,
                    sex: e.gender,
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
        this.setState({
            participant_affiliation: 'None',
            participant_affiliation_other: 'None'

        })
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
                            }
                        })
                    }
                    attributeValue = multiSelectString;
                }

                self.setState({ [attrTypeName]: attributeValue });
            })

            this.setState({ 
                loading: false
            })

        }
        catch(error) {
            console.log(error);
            var errMsg = '';
            errMsg = "Unable to fetch participant details. Please see error logs for more details. ";
            
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
                // form_disabled: true,
                loading : true
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
            jsonData.formParticipants = [];
            // jsonData.data.aahung_staff = [];
            jsonData.data.services_provided_type = {};
            jsonData.data.services_provided_type.values = [];
            jsonData.data.participants_sex = {};
            jsonData.data.participants_sex.values = [];
            jsonData.data.participants_age_group = {};
            jsonData.data.participants_age_group.values = [];
            
            // adding required properties in data property
            jsonData.data.date_start = this.state.date_start;
            jsonData.data.instituition_id = this.state.instituition_id.id;
            jsonData.data.participant_id = this.state.participant_id;
            jsonData.formParticipants.push({
                "participantId" : this.state.participant_name.id
            });
            jsonData.data.province = data.get('province');
            jsonData.data.district = this.state.district.label;
            jsonData.data.first_fup = data.get('first_fup');
            
            if(this.isFirstFollowup) {
                jsonData.data.date_last_fup = data.get('date_last_fup');
            }
            
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

            if(this.isZero) 
                jsonData.data.age_0_to_5_count = parseInt(data.get('age_0_to_5_count'));
            
            if(this.isSix) 
                jsonData.data.age_6_to_10_count = parseInt(data.get('age_6_to_10_count'));
            
            if(this.isEleven) 
                jsonData.data.age_11_to_15_count = parseInt(data.get('age_11_to_15_count'));

            if(this.isSixteen) 
                jsonData.data.age_16_to_20_count = parseInt(data.get('age_16_to_20_count'));
            
            if(this.isTwentyOne) 
                jsonData.data.age_21_to_49_count = parseInt(data.get('age_21_to_49_count'));
            
            if(this.isFiftyPlus) 
                jsonData.data.age_50_plus_count = parseInt(data.get('age_50_plus_count'));
                
            // generating multiselect for services_provided_type
            if((this.state.services_provided_type != null && this.state.services_provided_type != undefined)) {
                for(let i=0; i< this.state.services_provided_type.length; i++) {
                    jsonData.data.services_provided_type.values.push(String(this.state.services_provided_type[i].value));
                }
            }
        
            if(this.isServiceTypeOther) {
                jsonData.data.services_provided_type_other =  data.get('services_provided_type_other');
            }
            
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
                            
                            this.updateRequiredFieldsArray();
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
                            
                            this.updateRequiredFieldsArray();
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

        this.isFirstFollowup ? this.requiredFields.push("date_last_fup") : this.requiredFields = this.requiredFields.filter(e => e !== "date_last_fup");
        this.isServiceTypeOther ? this.requiredFields.push("services_provided_type_other") : this.requiredFields = this.requiredFields.filter(e => e !== "services_provided_type_other");
        
        this.isFemale ? this.requiredFields.push("female_count") : this.requiredFields = this.requiredFields.filter(e => e !== "female_count");
        this.isMale ? this.requiredFields.push("male_count") : this.requiredFields = this.requiredFields.filter(e => e !== "male_count");
        this.isOtherSex ? this.requiredFields.push("other_sex_count") : this.requiredFields = this.requiredFields.filter(e => e !== "other_sex_count");
        
        this.isZero ? this.requiredFields.push("age_0_to_5_count") : this.requiredFields = this.requiredFields.filter(e => e !== "age_0_to_5_count");
        this.isSix ? this.requiredFields.push("age_6_to_10_count") : this.requiredFields = this.requiredFields.filter(e => e !== "age_6_to_10_count");
        this.isEleven ? this.requiredFields.push("age_11_to_15_count") : this.requiredFields = this.requiredFields.filter(e => e !== "age_11_to_15_count");
        this.isSixteen ? this.requiredFields.push("age_16_to_20_count") : this.requiredFields = this.requiredFields.filter(e => e !== "age_16_to_20_count");
        this.isTwentyOne ? this.requiredFields.push("age_21_to_49_count") : this.requiredFields = this.requiredFields.filter(e => e !== "age_21_to_49_count");
        this.isFiftyPlus ? this.requiredFields.push("age_50_plus_count") : this.requiredFields = this.requiredFields.filter(e => e !== "age_50_plus_count");
    }

    handleValidation(){
        // check each required state
        this.updateRequiredFieldsArray();
        let formIsValid = true;
        console.log(this.requiredFields);
        this.setState({ hasError: this.checkValid(this.requiredFields) ? false : true });
        formIsValid = this.checkValid(this.requiredFields);
        
        this.setState({errors: this.errors});
        // alert(formIsValid);
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
            participant_affiliation: '',
            participant_affiliation_other: '',
            sex: '',
            institution_name: '',
            participant_id : ''
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

        const page2style = this.state.page2Show ? {} : { display: 'none' };
        // for view mode
        const setDisable = this.state.viewMode ? "disabled" : "";
        const otherServiceTypeStyle = this.isServiceTypeOther ? {} : { display: 'none' };
        const followupDateStyle = this.isFirstFollowup ? {} : { display: 'none' };
        const otherSexStyle = this.isOtherSex ? {} : { display: 'none' };
        const femaleStyle = this.isFemale ? {} : { display: 'none' };
        const maleStyle = this.isMale ? {} : { display: 'none' };

        const zeroFiveStyle = this.isZero ? {} : { display: 'none' };
        const sixTenStyle = this.isSix ? {} : { display: 'none' };
        const elevenStyle = this.isEleven ? {} : { display: 'none' };
        const sixteenStyle = this.isSixteen ? {} : { display: 'none' };
        const twentyOneStyle = this.isTwentyOne ? {} : { display: 'none' };
        const fiftyPlusStyle = this.isFiftyPlus ? {} : { display: 'none' };

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
                                                <b>Health Care Provider Reach</b>
                                            </CardHeader>
                                        </Card>
                                    </Col>
                                    <Col md="3">
                                    </Col>
                                    <Col md="3">
                                    
                                    </Col>
                                </Row>
                                
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
                                                                        <Label for="participant_id" >Participant ID</Label> <span class="errorMessage">{this.state.errors["participant_id"]}</span>
                                                                        <Input name="participant_id" id="participant_id" value={this.state.participant_id} disabled/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                        <Label for="sex" >Participant Sex</Label> <span class="errorMessage">{this.state.errors["sex"]}</span>
                                                                        <Input name="sex" id="sex" value={this.state.sex} onChange={(e) => { this.inputChange(e, "sex") }} disabled/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                        <Label for="participant_affiliation" >Participant Affliation</Label> <span class="errorMessage">{this.state.errors["participant_affiliation"]}</span>
                                                                        <Input name="participant_affiliation" id="participant_affiliation" value={this.state.participant_affiliation} onChange={(e) => { this.inputChange(e, "participant_affiliation") }}  disabled/>
                                                                    </FormGroup>
                                                                </Col>

                                                            

                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                        <Label for="participant_affiliation_other" >Other Participant Affliation</Label> <span class="errorMessage">{this.state.errors["participant_affiliation_other"]}</span>
                                                                        <Input name="participant_affiliation_other" id="participant_affiliation_other" value={this.state.participant_affiliation_other} onChange={(e) => { this.inputChange(e, "participant_affiliation_other") }}  disabled/>
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
                                                                    <FormGroup>
                                                                        <Label for="first_fup" >Is this the first follow up?</Label> <span class="errorMessage">{this.state.errors["first_fup"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "first_fup")} value={this.state.first_fup} name="first_fup" id="first_fup">
                                                                            <option value="">Select...</option>
                                                                            <option value="yes">Yes</option>
                                                                            <option value="no">No</option>
                                                                            </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={followupDateStyle}>
                                                                    <FormGroup> 
                                                                        <Label for="date_last_fup" >Date of last follow up</Label> <span class="errorMessage">{this.state.errors["date_last_fup"]}</span>
                                                                        <Input type="date" name="date_last_fup" id="date_last_fup" value={this.state.date_last_fup} onChange={(e) => {this.inputChange(e, "date_last_fup")}} max={moment().format("YYYY-MM-DD")}/>
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <Label><h7><u><b>Secondary Beneficiary Demographics</b></u></h7></Label>
                                                                </Col>
                                                            </Row>

                                                            <Row>

                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="participants_sex" >Sex of people reached</Label> <span class="errorMessage">{this.state.errors["participants_sex"]}</span>
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
                                                                        <Label for="participants_age_group" >Age of people reached</Label> <span class="errorMessage">{this.state.errors["participants_age_group"]}</span>
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "participants_age_group")} value={this.state.participants_age_group} id="participants_age_group" options={participantAge} isMulti/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={zeroFiveStyle}>
                                                                    <FormGroup >
                                                                        <Label for="age_0_to_5_count">Number of Audience Aged 0-5</Label> <span class="errorMessage">{this.state.errors["age_0_to_5_count"]}</span>
                                                                        <Input type="number" value={this.state.age_0_to_5_count} name="age_0_to_5_count" id="age_0_to_5_count" onChange={(e) => { this.inputChange(e, "age_0_to_5_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={sixTenStyle}>
                                                                    <FormGroup >
                                                                        <Label for="age_6_to_10_count">Number of Audience Aged 6-10</Label> <span class="errorMessage">{this.state.errors["age_6_to_10_count"]}</span>
                                                                        <Input type="number" value={this.state.age_6_to_10_count} name="age_6_to_10_count" id="age_6_to_10_count" onChange={(e) => { this.inputChange(e, "age_6_to_10_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
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

                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="services_provided_type" >Type of services provided</Label> <span class="errorMessage">{this.state.errors["services_provided_type"]}</span>
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "services_provided_type")} value={this.state.services_provided_type} id="services_provided_type" options={servicesTypes} isMulti/>  
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={otherServiceTypeStyle}>
                                                                    <FormGroup >
                                                                        <Label for="services_provided_type_other" >Specify Other Type of Service</Label> <span class="errorMessage">{this.state.errors["services_provided_type_other"]}</span>
                                                                        <Input name="services_provided_type_other" id="services_provided_type_other" value={this.state.services_provided_type_other} onChange={(e) => {this.inputChange(e, "services_provided_type_other")}} maxLength="200" placeholder="Enter other"/>
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

export default HealthCareProviderReach;