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

import React, { Fragment } from "react";
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Input, Label, CustomInput, Form, FormGroup, Container, Card, CardBody, TabContent, TabPane, CardTitle, Row, Col } from 'reactstrap';
import { Button, CardHeader, ButtonGroup } from 'reactstrap';
import "../index.css"
import classnames from 'classnames';
import Select from 'react-select';
import CustomModal from "../alerts/CustomModal";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import { getObject} from "../util/AahungUtil.js";
import { location, getDistrictsByProvince} from "../util/LocationUtil.js";
import moment from 'moment';
import * as Constants from "../util/Constants";
import { getFormTypeByUuid, getLocationsByCategory, getParticipantsByLocation , getAllUsers, getRoleByName, getUsersByRole, getAllDonors} from "../service/GetService";
import { saveFormData } from "../service/PostService";
import LoadingIndicator from "../widget/LoadingIndicator";
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBBtn } from 'mdbreact';

const options = [
    { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Sindh' },
    { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Punjab' },
    { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Balochistan' },
    { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Khyber Pakhtunkhwa' },
];

const programsImplemented = [
    { label: 'CSA', value: 'csa'},
    { label: 'Gender', value: 'gender'},
    { label: 'LSBE', value: 'lsbe'},
];

// const options = [
//     { label: 'Math', value: 'math'},
//     { label: 'Science', value: 'science'},
//     { label: 'English', value: 'def'},
//     { label: 'Urdu', value: 'urdu', },
//     { label: 'Social Studies', value: 'social_studies'},
//     { label: 'Islamiat', value: 'islamiat'},
//     { label: 'Art', value: 'art', },
//     { label: 'Music', value: 'music'},
//     { label: 'Other', value: 'other', },
// ];

const schools = [
    { value: 'sindh', label: 'Sindh' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'balochistan', label: 'Balochistan' },
    { value: 'khyber_pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
];


const coveredTopics = [
    { value: 'gender_equality', label: 'Gender Equality' },
    { value: 'violence', label: 'Violence' },
    { value: 'client_centred_care', label: 'Client Centred Care' },
    { value: 'vcat_on_fp', label: 'VCAT on FP' },
    { value: 'vcat_of_pac', label: 'VCAT of PAC' },
    { value: 'prevention_pregnancy', label: 'Prevention of unwanted pregnancy' },
    { value: 'rti', label: 'RTIs' },
    { value: 'provision_srh_services', label: 'Provision of SRH Services' },
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
    { value: 'community_leaders', label: 'Community leaders' },
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

const donors = [
    { value: 'uuid1', label: 'Harry Potter' },
    { value: 'uuid2', label: 'Ron Weasley' },
    { value: 'uuid3', label: 'Hermione Granger' },
    { value: 'uuid4', label: 'Albus Dumbledore' },
];
    

class AmplifyChangeStepDownTrainingDetails extends React.Component {
    
    modal = false;
    
    constructor(props) {
        super(props);
        
        this.toggle = this.toggle.bind(this);
        
        this.state = {
            date_start: '',
            institutions: [],
            trainers: [],
            users: [],
            participants: [],
            trainers: [],
            donorList : [],
            elements: ['program_implemented', 'school_level','donor_name'],
            date_start: '',
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
            editMode: false,
            errors: {},
            isCsa: true,
            isGender: false,
            hasError: false,
            loading: false,
            form_disabled : false
        };

        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.calculateScore = this.calculateScore.bind(this);
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
        this.requiredFields = ["date_start", "province", "district", "instituition_id", "participant_name",  "event_attendant", "topic_covered", "participants_sex",  "participants_age_group"];
        this.errors = {};
        
        
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

            
            try {
                let formTypeObj = await getFormTypeByUuid(Constants.ONE_TOUCH_SENSITIZATION_DETAILS);
                this.formTypeId = formTypeObj.formTypeId;
                
                let institutions = await getLocationsByCategory(Constants.INSTITUTION_DEFINITION_UUID);
                if (institutions != null && institutions.length > 0) {
                    this.setState({
                        institutions: institutions
                    })
                }
    
            }
            catch(error) {
                console.log(error);
            }

        }
        catch(error) {
            console.log(error);
        }
    }

    toggle(tab) {
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

        console.log(" ============================================================= ")
        this.resetForm(this.requiredFields);
        // receiving value directly from widget but it still requires widget to have on change methods to set it's value
        // alert(document.getElementById("date_start").value);
    }

    // for text and numeric questions
    inputChange(e, name) {

        console.log(e);
        console.log(e.target.id);
        console.log(e.target.type);
        console.log(e.target.pattern);
        let errorText = '';
        if(e.target.pattern != "" ) {
            
            console.log(e.target.value.match(e.target.pattern));
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
        this.setState ({sex : e.target.value });
        this.setState ({sex : e.target.value });

        this.setState({
            [name]: e.target.value
        });
    }

    // only for time widget <TimeField>
    getTime = (e, name) => {
        this.setState({
            [name]: e
        });
    }

    // calculate score from scoring questions (radiobuttons)
    calculateScore = (e, name) => {
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

            // children
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
            
            this.isOtherTopic ? this.requiredFields.push("topic_covered_other") : this.requiredFields = this.requiredFields.filter(e => e !== "topic_covered_other");
            this.isParticipantOther ? this.requiredFields.push("event_attendant_other") : this.requiredFields = this.requiredFields.filter(e => e !== "event_attendant_other");
            this.isParticipantOther ? this.requiredFields.push("other_attendant_count") : this.requiredFields = this.requiredFields.filter(e => e !== "other_attendant_count");
        this.isUniversityStudent ? this.requiredFields.push("university_student_count") : this.requiredFields = this.requiredFields.filter(e => e !== "university_student_count");
        this.isParents ? this.requiredFields.push("parent_count") : this.requiredFields = this.requiredFields.filter(e => e !== "parent_count");
        this.isCommunityLeader ? this.requiredFields.push("community_leader_count") : this.requiredFields = this.requiredFields.filter(e => e !== "community_leader_count");
        this.isYouth ? this.requiredFields.push("adolescent_youth_count") : this.requiredFields = this.requiredFields.filter(e => e !== "adolescent_youth_count");
        this.isChildren ? this.requiredFields.push("children_count") : this.requiredFields = this.requiredFields.filter(e => e !== "children_count");
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

                
                // alert(e.uuid);
                let participants =  await getParticipantsByLocation(e.uuid);
                if (participants != null && participants.length > 0) {
                    this.setState({
                        participants: participants
                    })
                }
                else { 
                    this.setState({
                        participants: []
                    })
                }
            }

            if (name === "participant_name") {
                // alert(e.identifier);
                this.setState({ participant_id: e.identifier });
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    

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
            jsonData.data.instituition_id = this.state.instituition_id.id;
            jsonData.data.participant_id = this.state.participant_id.id;
            
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
            
            // generating multiselect for topic_covered
            if((this.state.topic_covered != null && this.state.topic_covered != undefined)) {
                for(let i=0; i< this.state.topic_covered.length; i++) {
                    jsonData.data.topic_covered.values.push(String(this.state.topic_covered[i].value));
                }
            }
            
            if(this.isOtherTopic)
            jsonData.data.topic_covered_other = data.get('topic_covered_other');
            
            

            
            // generating multiselect for participants_sex
            if((this.state.participants_age_group != null && this.state.participants_age_group != undefined)) {
                for(let i=0; i< this.state.participants_age_group.length; i++) {
                    jsonData.data.participants_age_group.values.push(String(this.state.participants_age_group[i].value));
                }
            }

            console.log(jsonData);
            // JSON.parse(JSON.stringify(dataObject));
            
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
                        
                        // document.getElementById("projectForm").reset();
                        // this.messageForm.reset();
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

    handleValidation(){
        // check each required state
        
        let formIsValid = true;

        this.isOtherTopic ? this.requiredFields.push("topic_covered_other") : this.requiredFields = this.requiredFields.filter(e => e !== "topic_covered_other");
        this.isParticipantOther ? this.requiredFields.push("event_attendant_other") : this.requiredFields = this.requiredFields.filter(e => e !== "event_attendant_other");
        this.isFemale ? this.requiredFields.push("female_count") : this.requiredFields = this.requiredFields.filter(e => e !== "female_count");
        this.isMale ? this.requiredFields.push("male_count") : this.requiredFields = this.requiredFields.filter(e => e !== "male_count");
        this.isOtherSex ? this.requiredFields.push("other_sex_count") : this.requiredFields = this.requiredFields.filter(e => e !== "other_sex_count");
        

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
        for(let j=0; j < fields.length; j++) {
            let stateName = fields[j];
            
            
            // for array object
            if(typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                isOk = false;
                this.errors[fields[j]] = "Please fill in this field!";
            }
            
            // for text and others
            if(typeof this.state[stateName] != 'object') {
                
                if(this.state[stateName] === "" || this.state[stateName] == undefined) {
                    isOk = false;
                    this.errors[fields[j]] = "Please fill in this field!";
                }
            }
        }

        return isOk;
    }

    /**
     * verifies and notifies for the empty form fields
     */
    resetForm = (fields) => {

        

        for(let j=0; j < fields.length; j++) {
            let stateName = fields[j];
            
            // for array object
            if(typeof this.state[stateName] === 'object') {
                this.state[stateName] = [];
            }

            // for text and others
            if(typeof this.state[stateName] != 'object') {
                this.state[stateName] = ''; 
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
        
        const { selectedOption } = this.state;
        // scoring labels
        
        return (
            
            <div >
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
                                                <b>General Step Down Training Details</b>
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
                                                                    {/* TODO: autopopulate current date */}
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
                                                                        <Label for="participant_name" >Participant(s)</Label> <span class="errorMessage">{this.state.errors["participant_name"]}</span>
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
                                                            <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="event_attendant" >Type of Participants</Label> <span class="errorMessage">{this.state.errors["event_attendant"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "event_attendant")} value={this.state.event_attendant} id="event_attendant" options={participantTypes} />  
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={otherParticipantTypeStyle}>
                                                                    <FormGroup >
                                                                        <Label for="event_attendant_other" >Specify Other Type of Participants</Label> <span class="errorMessage">{this.state.errors["event_attendant_other"]}</span>
                                                                        <Input name="event_attendant_other" id="event_attendant_other" value={this.state.event_attendant_other} onChange={(e) => {this.inputChange(e, "event_attendant_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>
                                                                
                                                            </Row>

                                                            <Row>

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
                                                            </Row>

                                                            <Row>
                                                            
                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="participants_sex" >Sex of Participants</Label> <span class="errorMessage">{this.state.errors["participants_sex"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "participants_sex")} value={this.state.participants_sex} id="participants_sex" options={participantSex} />  
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={maleStyle}>
                                                                    <FormGroup >
                                                                        <Label for="male_count" >Number of Males</Label> <span class="errorMessage">{this.state.errors["male_count"]}</span>
                                                                        <Input type="number" value={this.state.male_count} name="male_count" id="male_count" onChange={(e) => { this.inputChange(e, "male_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={femaleStyle}>
                                                                    <FormGroup >
                                                                        <Label for="female_count" >Number of Females</Label> <span class="errorMessage">{this.state.errors["female_count"]}</span>
                                                                        <Input type="number" value={this.state.female_count} name="female_count" id="female_count" onChange={(e) => { this.inputChange(e, "female_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
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
                                                                        <Label for="participants_age_group" >Participant Age Group</Label> <span class="errorMessage">{this.state.errors["participants_age_group"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "participants_age_group")} value={this.state.participants_age_group} id="participants_age_group" options={participantAge} />
                                                                    </FormGroup>
                                                                </Col>

                                                                
                                                            </Row>

                                                            <Row>    
                                                                
                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="topic_covered" >Topics Covered</Label> <span class="errorMessage">{this.state.errors["topic_covered"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "topic_covered")} value={this.state.topic_covered} id="topic_covered" options={coveredTopics} />  
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
                                                        <LoadingIndicator loading={this.state.loading}/>
                                                    </Col>
                                                    <Col md="3">
                                                        {/* <div className="btn-actions-pane-left"> */}
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit">Submit</Button>
                                                        <Button className="mb-2 mr-2" color="danger" size="sm" onClick={this.cancelCheck} >Clear</Button>
                                                        {/* </div> */}
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
                                        <MDBBtn color="secondary" onClick={this.toggle}>Cancel</MDBBtn>
                                        <MDBBtn color="primary" style={this.state.okButtonStyle} onClick={this.confirm}>OK!</MDBBtn>
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