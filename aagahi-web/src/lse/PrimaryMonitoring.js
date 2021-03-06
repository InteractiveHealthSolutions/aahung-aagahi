/*
 * @Author: tahira.niazi@ihsinformatics.com 
 * @Date: 2019-08-08 13:20:44 
 * @Last Modified by: tahira.niazi@ihsinformatics.com
 * @Last Modified time: 2020-02-13 12:53:58
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
import Select from 'react-select';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Button, ButtonGroup, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, TabContent, TabPane } from 'reactstrap';
import CustomModal from "../alerts/CustomModal";
import "../index.css";
import { getDefinitionByDefinitionId, getFormTypeByUuid, getFormDataById, getLocationsByCategory, getLocationAttributesByLocation, getParticipantsByLocation, getRoleByName, getUsersByRole } from "../service/GetService";
import { updateFormData, saveFormData } from "../service/PostService";
import { clearCheckedFields, loadFormState, getIndicatorCode } from "../util/AahungUtil.js";
import * as Constants from "../util/Constants";
import LoadingIndicator from "../widget/LoadingIndicator";
import { BrowserRouter as Router } from 'react-router-dom';
import FormNavBar from "../widget/FormNavBar";
import { UserService } from '../service/UserService';

const csaFlashcards = [
    { value: 'one', label: '1' },
    { value: 'two', label: '2' },
    { value: 'three', label: '3' },
    { value: 'four', label: '4' },
    { value: 'five', label: '5' },
    { value: 'six', label: '6' },
    { value: 'seven', label: '7' },
    { value: 'eight', label: '8' },
];

const genderFlashcards = [
    { value: 'one', label: '1' },
    { value: 'two', label: '2' },
    { value: 'three', label: '3' },
    { value: 'four', label: '4' },
    { value: 'five', label: '5' },
    { value: 'six', label: '6' },
    { value: 'seven', label: '7' },
    { value: 'eight', label: '8' },
    { value: 'nine', label: '9' },
    { value: 'ten', label: '10' },
];

const new_activities_options = [
    { value: 'new_activities', label: 'New activities' },
    { value: 'additional_probes', label: 'Additional Probes' },
    { value: 'additional_info', label: 'Additional Information' },
    { value: 'additional_videos', label: 'Additional videos' },
];

class PrimaryMonitoring extends React.Component {

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
            class_sex: 'girls',
            program_type: 'csa',
            primary_grade: '1',
            csa_challenge_1_status: 'resolved',
            csa_challenge_2_status: 'resolved',
            csa_challenge_3_status: 'resolved',
            csa_challenge_4_status: 'resolved',
            csa_challenge_5_status: 'resolved',
            csa_challenge_6_status: 'resolved',
            csa_flashcard_revision: 'revision',
            csa_class_frequency: 'weekly',
            gender_challenge_1_status: 'resolved',
            gender_challenge_2_status: 'resolved',
            gender_challenge_3_status: 'resolved',
            gender_challenge_4_status: 'resolved',
            gender_challenge_5_status: 'resolved',
            gender_challenge_6_status: 'resolved',
            gender_flashcard_revision: 'revision',
            gender_class_frequency: 'weekly',
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


        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.scoreChange = this.scoreChange.bind(this);
        this.inputChange = this.inputChange.bind(this);

        this.isCsa = true;
        this.isGender = false;
        this.isCsaBeyondGuide = false;
        this.isGenderBeyondGuide = false;
        this.isCsaIntegrated = false;
        this.isGenderIntegrated = false;
        this.isCsaFrequencyOther = false;
        this.isGenderFrequencyOther = false;
        this.isCsaChallenge1 = false;
        this.isCsaChallenge2 = false;
        this.isCsaChallenge3 = false;
        this.isCsaChallenge4 = false;
        this.isCsaChallenge5 = false;
        this.isCsaChallenge6 = false;
        this.isGenderChallenge1 = false;
        this.isGenderChallenge2 = false;
        this.isGenderChallenge3 = false;
        this.isGenderChallenge4 = false;
        this.isGenderChallenge5 = false;
        this.isGenderChallenge6 = false;
        this.isCsaResourcesRequired = false;
        this.isGenderResourcesRequired = false;

        this.score = 0;
        this.totalScore = 0;
        this.scoreArray = [];

        this.fctScore = 0;
        this.fctTotalScore = 0;
        this.fctScoreArray = [];
        this.mgmtScore = 0;
        this.mgmtTotalScore = 0;
        this.mgmtScoreArray = [];

        this.genderFctScore = 0;
        this.genderFctTotalScore = 0;
        this.genderFctScoreArray = [];
        this.genderMgmtScore = 0;
        this.genderMgmtTotalScore = 0;
        this.genderMgmtScoreArray = [];

        this.newTier = false;
        this.runningTier = false;
        this.exitTier = false;

        this.formTypeId = 0;
        this.csaRequiredFields = ["date_start", "school_id", "monitor", "class_sex", "participant_name", "participant_id", "primary_grade",
            "class_students", "class_duration", "program_type", "csa_flashcard", "csa_flashcard_revision", "csa_prompts", "csa_flashcard_objective",
            "csa_material_preparation", "csa_teacher_preparation", "csa_activity_time_allotment", "csa_subject_comfort", "csa_nonjudmental_tone",
            "csa_impartial_opinions", "csa_student_engagement", "csa_student_understanding", "csa_student_attention", "csa_timetable_integration",
            "csa_two_teacher_assigned", "csa_teacher_mgmt_coordination", "monitoring_score", "monitoring_score_pct", "facilitation_score",
            "facilitation_score_pct", "management_score", "management_score_pct", "csa_challenge_1", "csa_challenge_2", "csa_challenge_3",
            "csa_challenge_4", "csa_challenge_5", "csa_challenge_6", "csa_resources_required", "csa_resources_delivered"];

        this.genderRequiredFields = ["date_start", "school_id", "monitor", "class_sex", "participant_name",
            "participant_id", "primary_grade", "class_students", "class_duration", "program_type", "gender_flashcard",
            "gender_flashcard_revision", "gender_prompts", "gender_flashcard_objective", "gender_material_preparation",
            "gender_teacher_preparation", "gender_activity_time_allotment", "gender_beyond_guide", "gender_subject_comfort",
            "gender_nonjudmental_tone", "gender_impartial_opinions", "gender_student_engagement", "gender_student_understanding",
            "gender_student_attention", "gender_timetable_integration", "gender_class_frequency", "gender_two_teacher_assigned",
            "gender_teacher_mgmt_coordination", "monitoring_score", "monitoring_score_pct", "facilitation_score", "facilitation_score_pct",
            "management_score", "management_score_pct", "gender_challenge_1", "gender_challenge_2", "gender_challenge_3",
            "gender_challenge_4", "gender_challenge_5", "gender_challenge_6", "gender_resources_required", "gender_resources_delivered"];

        this.csaDependantFields = ["csa_class_frequency", "csa_class_frequency_other", "csa_challenge_1_status", "csa_challenge_2_status",
            "csa_challenge_3_status", "csa_challenge_4_status", "csa_challenge_5_status", "csa_challenge_6_status"];

        this.csaNonRequiredFields = ["csa_beyond_guide", "csa_guide_required_count", "csa_book_required_count", "csa_other_required_count", "csa_other_required_type",
            "csa_guide_delivered_count", "csa_book_delivered_count", "csa_other_delivered_count", "csa_other_delivered_type"];

        this.genderDependantFields = ["gender_class_frequency", "gender_class_frequency_other", "gender_challenge_1_status",
            "gender_challenge_2_status", "gender_challenge_3_status", "gender_challenge_4_status", "gender_challenge_5_status",
            "gender_challenge_6_status"];

        this.genderNonRequiredFields = ["gender_guide_required_count", "gender_book_required_count", "gender_other_required_count",
            "gender_other_required_type", "gender_guide_delivered_count", "gender_book_delivered_count", "gender_other_delivered_count",
            "gender_other_delivered_type"];

        // CSA: Scoring arrays
        // facilitation fields; created a separate array for facilitation fields w.r.t scoring purpose
        this.fctFields = ["csa_prompts", "csa_flashcard_objective", "csa_material_preparation", "csa_teacher_preparation",
            "csa_activity_time_allotment", "csa_beyond_guide", "csa_subject_comfort", "csa_nonjudmental_tone", "csa_impartial_opinions",
            "csa_student_engagement", "csa_student_understanding", "csa_student_attention"];

        // management fields; created a separate array for management fields w.r.t scoring purpose
        this.mgmtFields = ["csa_timetable_integration", "csa_two_teacher_assigned", "csa_teacher_mgmt_coordination",
            "csa_mt_teacher_coordination", "csa_mt_conduct_monitoring", "csa_mt_conduct_training"];

        // Gender: Scoring arrays
        // facilitation fields; created a separate array for facilitation fields w.r.t scoring purpose
        this.genderFctFields = ["gender_prompts", "gender_flashcard_objective", "gender_material_preparation", "gender_teacher_preparation",
            "gender_activity_time_allotment", "gender_beyond_guide", "gender_subject_comfort", "gender_nonjudmental_tone", "gender_impartial_opinions",
            "gender_student_engagement", "gender_student_understanding", "gender_student_attention"];

        // management fields; created a separate array for management fields w.r.t scoring purpose
        this.genderMgmtFields = ["gender_timetable_integration", "gender_two_teacher_assigned", "gender_teacher_mgmt_coordination",
            "csa_mt_teacher_coordination", "csa_mt_conduct_monitoring", "csa_mt_conduct_training"];

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
            this.editMode = (this.props.location.state !== undefined && this.props.location.state.edit) ? true : false;
            this.setState({
                loading: true,
                loadingMsg: 'Fetching Data...'
            })
            let formTypeObj = await getFormTypeByUuid(Constants.PRIMARY_MONITORING_FORM_UUID);
            this.formTypeId = formTypeObj.formTypeId;
            this.formTypeId = formTypeObj.formTypeId;

            let role = await getRoleByName(Constants.LSE_MONITOR_ROLE_NAME);
            let trainersArray = await getUsersByRole(role.uuid, false);
            if (trainersArray != null && trainersArray.length > 0) {
                this.setState({
                    monitors: trainersArray
                })
            }

            let schools = await getLocationsByCategory(Constants.SCHOOL_DEFINITION_UUID);
            let schoolsArray = [];
            if (schools != null && schools.length > 0) {
                schools.forEach(async function (obj) {
                    if(obj.shortName.includes("PRI"))
                        schoolsArray.push(obj);
                })
                this.setState({
                    schools: schoolsArray
                })
            }

            if (this.editMode) {
                this.fetchedForm = await getFormDataById(String(this.props.location.state.formId));
                if (this.fetchedForm !== null) {
                    this.state = loadFormState(this.fetchedForm, this.state); // autopopulates the whole form
                    this.setState({
                        date_start: moment(this.fetchedForm.formDate).format('YYYY-MM-DD')
                    })

                    if (this.state.school_tier !== "") {
                        this.state.school_tier = this.state.school_tier === "school_tier_new" ? "New"
                            : (this.state.school_tier === "school_tier_running" ? "Running"
                                : (this.state.school_tier === "school_tier_exit" ? "Exit"
                                    : ""));
                    }

                    this.isCsa = this.state.program_type === "csa" ? true : false;
                    this.isGender = this.state.program_type === "gender" ? true : false;

                    let self = this;
                    this.fetchedForm.data.map(function (element, i) {
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

    /**
     * created separate method because async handle was not updating the local variables (location attrs)
     */
    autopopulateFields(locationAttributes) {
        let self = this;
        let attributeValue = '';
        locationAttributes.forEach(async function (obj) {
            let attrTypeName = obj.attributeType.shortName;
            if (obj.attributeType.dataType.toUpperCase() == "DEFINITION") {
                // fetch definition shortname
                let definitionId = obj.attributeValue;
                let definition = await getDefinitionByDefinitionId(definitionId);
                attributeValue = definition.definitionName;

                if (attrTypeName === "school_tier") {
                    if (self.editMode && (self.state.school_tier !== '' && self.state.school_tier !== undefined) && self.state.school_tier !== attributeValue) {
                        // Edits are painful!! 
                        // Handling the case where change of tier will have an impact on scoring questions and everntually the cumulative score
                        self.setState({
                            modalHeading: 'Tier mismatch error!',
                            modalText: 'You can not select a school which has a different tier from the school which was saved earlier.',
                            modal: !self.state.modal,
                            school_id: {},
                            school_name: ''
                        });
                        return;
                    }

                    self.newTier = attributeValue === "New" ? true : false;
                    self.runningTier = attributeValue === "Running" ? true : false;
                    self.exitTier = attributeValue === "Exit" ? true : false;
                }

                if (attrTypeName === "school_sex" && !self.editMode) {
                    self.setState({ class_sex: attributeValue === "Girls" ? 'girls' : attributeValue === "Boys" ? 'boys' : "girls" });
                }
                self.setState({ [attrTypeName]: attributeValue });
            }
        })

        this.isCsa && (this.runningTier || this.exitTier) ? this.csaDependantFields.push("csa_beyond_guide") : this.csaRequiredFields = this.csaRequiredFields.filter(e => e !== "csa_beyond_guide");
        this.isGender && (this.runningTier || this.exitTier) ? this.genderDependantFields.push("gender_beyond_guide") : this.genderRequiredFields = this.genderRequiredFields.filter(e => e !== "gender_beyond_guide");
        this.exitTier && this.isCsa ? this.csaDependantFields.push("csa_mt_count") : this.csaRequiredFields = this.csaRequiredFields.filter(e => e !== "csa_mt_count");
        this.exitTier && this.isCsa ? this.csaDependantFields.push("csa_mt_teacher_coordination") : this.csaRequiredFields = this.csaRequiredFields.filter(e => e !== "csa_mt_teacher_coordination");
        this.exitTier && this.isCsa ? this.csaDependantFields.push("csa_mt_conduct_monitoring") : this.csaRequiredFields = this.csaRequiredFields.filter(e => e !== "csa_mt_conduct_monitoring");
        this.exitTier && this.isCsa ? this.csaDependantFields.push("csa_mt_conduct_training") : this.csaRequiredFields = this.csaRequiredFields.filter(e => e !== "csa_mt_conduct_training");
    }

    editUpdateDisplay() {

        if (this.isCsa) {
            if (this.state.csa_challenge_1 !== '' && this.state.csa_challenge_1 !== undefined) {
                this.isCsaChallenge1 = this.state.csa_challenge_1 === "yes" ? true : false;
            }
            if (this.state.csa_challenge_2 !== '' && this.state.csa_challenge_2 !== undefined) {
                this.isCsaChallenge2 = this.state.csa_challenge_2 === "yes" ? true : false;
            }
            if (this.state.csa_challenge_3 !== '' && this.state.csa_challenge_3 !== undefined) {
                this.isCsaChallenge3 = this.state.csa_challenge_3 === "yes" ? true : false;
            }
            if (this.state.csa_challenge_4 !== '' && this.state.csa_challenge_4 !== undefined) {
                this.isCsaChallenge4 = this.state.csa_challenge_4 === "yes" ? true : false;
            }
            if (this.state.csa_challenge_5 !== '' && this.state.csa_challenge_5 !== undefined) {
                this.isCsaChallenge5 = this.state.csa_challenge_5 === "yes" ? true : false;
            }
            if (this.state.csa_challenge_6 !== '' && this.state.csa_challenge_6 !== undefined) {
                this.isCsaChallenge6 = this.state.csa_challenge_6 === "yes" ? true : false;
            }

            // for csa  - required
            if (this.state.csa_resources_required !== '' && this.state.csa_resources_required !== undefined)
                this.isCsaResourcesRequired = this.state.csa_resources_required === "yes" ? true : false;
            if (this.state.csa_other_required_count !== '' && this.state.csa_other_required_count !== undefined && this.isCsaResourcesRequired)
                this.isCsaOtherResourcesRequired = this.state.csa_other_required_count > 0 ? true : false;

            // for csa - delivered
            if (this.state.csa_resources_delivered !== '' && this.state.csa_resources_delivered !== undefined)
                this.isCsaResourcesDelivered = this.state.csa_resources_delivered === "yes" ? true : false;
            if (this.state.csa_other_delivered_count !== '' && this.state.csa_other_delivered_count !== undefined && this.isCsaResourcesDelivered)
                this.isCsaOtherResourcesDelivered = this.state.csa_other_delivered_count > 0 ? true : false;

            if (this.state.csa_class_frequency !== '' && this.state.csa_class_frequency !== undefined)
                this.isCsaFrequencyOther = this.state.csa_class_frequency === "other" ? true : false;

            if (this.state.csa_beyond_guide !== '' && this.state.csa_beyond_guide !== undefined)
                this.isCsaBeyondGuide = String(this.state.csa_beyond_guide) === "1" ? true : false;
            if (this.state.csa_timetable_integration !== '' && this.state.csa_timetable_integration !== undefined)
                this.isCsaIntegrated = String(this.state.csa_timetable_integration) === "1" ? true : false;

            this.isCsaBeyondGuide ? this.csaDependantFields.push("csa_beyond_guide_new") : this.csaDependantFields = this.csaDependantFields.filter(e => e !== "csa_beyond_guide_new");
        }

        if (this.isGender) {
            if (this.state.gender_challenge_1 !== '' && this.state.gender_challenge_1 !== undefined) {
                this.isCsaChallenge1 = this.state.gender_challenge_1 === "yes" ? true : false;
            }
            if (this.state.gender_challenge_2 !== '' && this.state.gender_challenge_2 !== undefined) {
                this.isCsaChallenge2 = this.state.gender_challenge_2 === "yes" ? true : false;
            }
            if (this.state.gender_challenge_3 !== '' && this.state.gender_challenge_3 !== undefined) {
                this.isCsaChallenge3 = this.state.csa_challenge_3 === "yes" ? true : false;
            }
            if (this.state.gender_challenge_4 !== '' && this.state.gender_challenge_4 !== undefined) {
                this.isCsaChallenge4 = this.state.gender_challenge_4 === "yes" ? true : false;
            }
            if (this.state.gender_challenge_5 !== '' && this.state.gender_challenge_5 !== undefined) {
                this.isCsaChallenge5 = this.state.gender_challenge_5 === "yes" ? true : false;
            }
            if (this.state.gender_challenge_6 !== '' && this.state.gender_challenge_6 !== undefined) {
                this.isCsaChallenge6 = this.state.gender_challenge_6 === "yes" ? true : false;
            }

            // for gender - required
            if (this.state.gender_resources_required !== '' && this.state.gender_resources_required !== undefined)
                this.isGenderResourcesRequired = this.state.gender_resources_required === "yes" ? true : false;
            if (this.state.gender_other_required_count !== '' && this.state.gender_other_required_count !== undefined && this.isGenderResourcesRequired)
                this.isGenderOtherResourcesRequired = this.state.gender_other_required_count > 0 ? true : false;

            // for gender - delivered
            if (this.state.gender_resources_delivered !== '' && this.state.gender_resources_delivered !== undefined)
                this.isGenderResourcesDelivered = this.state.gender_resources_delivered === "yes" ? true : false;
            if (this.state.gender_other_delivered_count !== '' && this.state.gender_other_delivered_count !== undefined && this.isGenderResourcesDelivered)
                this.isGenderOtherResourcesDelivered = this.state.gender_other_delivered_count > 0 ? true : false;

            if (this.state.gender_class_frequency !== '' && this.state.gender_class_frequency !== undefined)
                this.isGenderFrequencyOther = this.state.gender_class_frequency === "other" ? true : false;

            if (this.state.gender_beyond_guide !== '' && this.state.gender_beyond_guide !== undefined)
                this.isGenderBeyondGuide = String(this.state.gender_beyond_guide) === "1" ? true : false;
            if (this.state.gender_timetable_integration !== '' && this.state.gender_timetable_integration !== undefined)
                this.isGenderIntegrated = String(this.state.gender_timetable_integration) === "1" ? true : false;

            this.isGenderBeyondGuide ? this.genderDependantFields.push("gender_beyond_guide_new") : this.genderDependantFields = this.genderDependantFields.filter(e => e !== "gender_beyond_guide_new");
        }
    }

    updateDisplay() {
        this.setState({
            primary_grade: '1',
            class_sex: 'girls',
            program_type: 'csa',
            csa_challenge_1_status: 'resolved',
            csa_challenge_2_status: 'resolved',
            csa_challenge_3_status: 'resolved',
            csa_challenge_4_status: 'resolved',
            csa_challenge_5_status: 'resolved',
            csa_challenge_6_status: 'resolved',
            csa_flashcard_revision: 'revision',
            csa_class_frequency: 'weekly',
            gender_challenge_1_status: 'resolved',
            gender_challenge_2_status: 'resolved',
            gender_challenge_3_status: 'resolved',
            gender_challenge_4_status: 'resolved',
            gender_challenge_5_status: 'resolved',
            gender_challenge_6_status: 'resolved',
            gender_flashcard_revision: 'revision',
            gender_class_frequency: 'weekly',
            school_sex: '',
            school_tier: ''
        })

        this.isCsa = true;
        this.isGender = false;
        this.isCsaBeyondGuide = false;
        this.isGenderBeyondGuide = false;
        this.isCsaIntegrated = false;
        this.isGenderIntegrated = false;
        this.isCsaFrequencyOther = false;
        this.isGenderFrequencyOther = false;
        this.isCsaChallenge1 = false;
        this.isCsaChallenge2 = false;
        this.isCsaChallenge3 = false;
        this.isCsaChallenge4 = false;
        this.isCsaChallenge5 = false;
        this.isCsaChallenge6 = false;
        this.isGenderChallenge1 = false;
        this.isGenderChallenge2 = false;
        this.isGenderChallenge3 = false;
        this.isGenderChallenge4 = false;
        this.isGenderChallenge5 = false;
        this.isGenderChallenge6 = false;
        this.isCsaResourcesRequired = false;
        this.isGenderResourcesRequired = false;

        this.score = 0;
        this.totalScore = 0;
        this.scoreArray = [];

        this.fctScore = 0;
        this.fctTotalScore = 0;
        this.fctScoreArray = [];
        this.mgmtScore = 0;
        this.mgmtTotalScore = 0;
        this.mgmtScoreArray = [];

        this.genderFctScore = 0;
        this.genderFctTotalScore = 0;
        this.genderFctScoreArray = [];
        this.genderMgmtScore = 0;
        this.genderMgmtTotalScore = 0;
        this.genderMgmtScoreArray = [];
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

        console.log(" ============================================================= ");
        if (this.isCsa) {
            this.resetForm(this.csaRequiredFields);
            this.resetForm(this.csaDependantFields);
            this.resetForm(this.csaNonRequiredFields);
        }
        if (this.isGender) {
            this.resetForm(this.genderRequiredFields);
            this.resetForm(this.genderDependantFields);
            this.resetForm(this.genderNonRequiredFields);
        }
    }

    inputChange(e, name) {

        this.setState({
            [name]: e.target.value
        });

        // for csa
        if (name === "csa_challenge_1") {
            this.isCsaChallenge1 = e.target.id === "yes" ? true : false;
        }
        if (name === "csa_challenge_2") {
            this.isCsaChallenge2 = e.target.id === "yes" ? true : false;
        }
        if (name === "csa_challenge_3") {
            this.isCsaChallenge3 = e.target.id === "yes" ? true : false;
        }
        if (name === "csa_challenge_4") {
            this.isCsaChallenge4 = e.target.id === "yes" ? true : false;
        }
        if (name === "csa_challenge_5") {
            this.isCsaChallenge5 = e.target.id === "yes" ? true : false;
        }
        if (name === "csa_challenge_6") {
            this.isCsaChallenge6 = e.target.id === "yes" ? true : false;
        }

        // for gender
        if (name === "gender_challenge_1") {
            this.isGenderChallenge1 = e.target.id === "yes" ? true : false;
            if (this.isGenderChallenge1)
                this.setState({ gender_challenge_1_status: 'resolved' });
        }
        if (name === "gender_challenge_2") {
            this.isGenderChallenge2 = e.target.id === "yes" ? true : false;
            if (this.isGenderChallenge2)
                this.setState({ gender_challenge_2_status: 'resolved' });
        }
        if (name === "gender_challenge_3") {
            this.isGenderChallenge3 = e.target.id === "yes" ? true : false;
            if (this.isGenderChallenge3)
                this.setState({ gender_challenge_3_status: 'resolved' });
        }
        if (name === "gender_challenge_4") {
            this.isGenderChallenge4 = e.target.id === "yes" ? true : false;
            if (this.isGenderChallenge4)
                this.setState({ gender_challenge_4_status: 'resolved' });
        }
        if (name === "gender_challenge_5") {
            this.isGenderChallenge5 = e.target.id === "yes" ? true : false;
            if (this.isGenderChallenge5)
                this.setState({ gender_challenge_5_status: 'resolved' });
        }
        if (name === "gender_challenge_6") {
            this.isGenderChallenge6 = e.target.id === "yes" ? true : false;
            if (this.isGenderChallenge6)
                this.setState({ gender_challenge_6_status: 'resolved' });
        }

        // for csa  - required
        if (name === "csa_resources_required")
            this.isCsaResourcesRequired = e.target.id === "yes" ? true : false;

        if (name === "csa_other_required_count")
            this.isCsaOtherResourcesRequired = e.target.value > 0 ? true : false;

        // for gender - required
        if (name === "gender_resources_required")
            this.isGenderResourcesRequired = e.target.id === "yes" ? true : false;

        if (name === "gender_other_required_count")
            this.isGenderOtherResourcesRequired = e.target.value > 0 ? true : false;

        // for csa - delivered
        if (name === "csa_resources_delivered")
            this.isCsaResourcesDelivered = e.target.id === "yes" ? true : false;

        if (name === "csa_other_delivered_count")
            this.isCsaOtherResourcesDelivered = e.target.value > 0 ? true : false;

        // for gender - delivered
        if (name === "gender_resources_delivered")
            this.isGenderResourcesDelivered = e.target.id === "yes" ? true : false;

        if (name === "gender_other_delivered_count")
            this.isGenderOtherResourcesDelivered = e.target.value > 0 ? true : false;
    }

    // for single select
    valueChange = (e, name) => {

        this.setState({
            [name]: e.target.value
        });

        if (name === "program_type") {
            if (e.target.value === "csa") {

                this.isCsa = true;
                this.isGender = false;
                // empty error becasue switching whole program
                this.errors = {};
                this.setState({
                    error: this.errors,
                    hasError: false
                });
            }
            else if (e.target.value === "gender") {

                this.isCsa = false;
                this.isGender = true;
                // empty error becasue switching whole program
                this.errors = {};
                this.setState({
                    error: this.errors,
                    hasError: false
                });
            }
        }

        if (name == "csa_class_frequency") {
            this.isCsaFrequencyOther = e.target.value === "other" ? true : false;
        }

        if (name == "gender_class_frequency") {
            this.isGenderFrequencyOther = e.target.value === "other" ? true : false;
        }

    }

    // calculate score from scoring questions (radiobuttons)
    scoreChange = (e, name) => {
        this.setState({
            [name]: e.target.value
        });

        if (name === "csa_beyond_guide") {
            this.isCsaBeyondGuide = e.target.id === "yes" ? true : false;
        }

        if (name === "gender_beyond_guide") {
            this.isGenderBeyondGuide = e.target.id === "yes" ? true : false;
        }

        if (name === "csa_timetable_integration") {
            this.isCsaIntegrated = e.target.id === "yes" ? true : false;
        }

        if (name === "gender_timetable_integration") {
            this.isGenderIntegrated = e.target.id === "yes" ? true : false;
        }

        this.isCsaBeyondGuide ? this.csaDependantFields.push("csa_beyond_guide_new") : this.csaDependantFields = this.csaDependantFields.filter(e => e !== "csa_beyond_guide_new");

        this.isGenderBeyondGuide ? this.genderDependantFields.push("gender_beyond_guide_new") : this.genderDependantFields = this.genderDependantFields.filter(e => e !== "gender_beyond_guide_new");

        let indicator = e.target.id;
        let fieldName = e.target.name;
        let value = e.target.value;
        var indicatorCode = getIndicatorCode(indicator);
        this.calculate(indicator, fieldName, value, indicatorCode);
    }

    calculate(indicator, fieldName, value, indicatorValue) {

        if (this.isCsa) {
            let fctField = [];
            let mgmtField = [];

            fctField = this.fctFields.filter(f => f === fieldName);
            mgmtField = this.mgmtFields.filter(f => f === fieldName);

            if (fctField.length > 0) {

                let answered = [];
                if (this.fctScoreArray != undefined || this.fctScoreArray != null) {
                    answered = this.fctScoreArray.filter(question => question.elementName == fieldName);
                }
                if (answered[0] != null) {
                    answered[0].id = indicator;
                    answered[0].elementName = fieldName;
                    this.fctScore = this.fctScore - parseInt(answered[0].value); //becase previous answer is not applicable any more
                    this.fctScore += parseInt(value);

                    for (var i in this.fctScoreArray) {
                        if (this.fctScoreArray[i].elementName == fieldName) {
                            this.fctScoreArray[i].id = indicator; // they will remain same
                            this.fctScoreArray[i].elementName = fieldName; // they will remain same
                            this.fctScoreArray[i].value = value;
                            this.fctScoreArray[i].score = this.fctScore;
                            break; //Stop this loop, we found it!
                        }
                    }
                }
                else { //push this question along with value and other attributes
                    let newAnswered = {}
                    newAnswered.id = indicator;
                    newAnswered.elementName = fieldName;
                    newAnswered.value = value;
                    this.fctScore += parseInt(value);
                    this.fctTotalScore += indicatorValue;
                    newAnswered.score = this.fctScore;
                    newAnswered.totalScore = this.fctTotalScore;
                    this.fctScoreArray.push(newAnswered);
                }

                var score = parseInt(this.fctScore);
                var totalScore = parseInt(this.fctTotalScore);
                var percent = (score / totalScore) * 100;
                percent = percent.toFixed(2);
                this.setState({
                    facilitation_score: this.fctScore,
                    facilitation_score_pct: percent
                })
            }
            else if (mgmtField.length > 0) {
                let answered = [];
                if (this.mgmtScoreArray != undefined || this.mgmtScoreArray != null) {
                    answered = this.mgmtScoreArray.filter(question => question.elementName == fieldName);
                }
                if (answered[0] != null) {
                    answered[0].id = indicator;
                    answered[0].elementName = fieldName;
                    this.mgmtScore = this.mgmtScore - parseInt(answered[0].value); //becase previous answer is not applicable any more
                    this.mgmtScore += parseInt(value);

                    for (var i in this.mgmtScoreArray) {
                        if (this.mgmtScoreArray[i].elementName == fieldName) {
                            this.mgmtScoreArray[i].id = indicator; // they will remain same
                            this.mgmtScoreArray[i].elementName = fieldName; // they will remain same
                            this.mgmtScoreArray[i].value = value;
                            this.mgmtScoreArray[i].score = this.mgmtScore;
                            break; //Stop this loop, we found it!
                        }
                    }
                }
                else { //push this question along with value and other attributes
                    let newAnswered = {}
                    newAnswered.id = indicator;
                    newAnswered.elementName = fieldName;
                    newAnswered.value = value;
                    this.mgmtScore += parseInt(value);
                    this.mgmtTotalScore += indicatorValue;
                    newAnswered.score = this.mgmtScore;
                    newAnswered.totalScore = this.mgmtTotalScore;
                    this.mgmtScoreArray.push(newAnswered);
                }

                var score = parseInt(this.mgmtScore);
                var totalScore = parseInt(this.mgmtTotalScore);
                var percent = (score / totalScore) * 100;
                percent = percent.toFixed(2);
                this.setState({
                    management_score: this.mgmtScore,
                    management_score_pct: percent
                })
            }

            var cumulativeScore = parseInt(this.fctScore) + parseInt(this.mgmtScore);
            var cumulativeTotalScore = parseInt(this.fctTotalScore) + parseInt(this.mgmtTotalScore);
            var cumulativePercent = (cumulativeScore / cumulativeTotalScore) * 100;
            cumulativePercent = cumulativePercent.toFixed(2);
            this.setState({
                monitoring_score: cumulativeScore,
                monitoring_score_pct: cumulativePercent
            })
        }
        else if (this.isGender) {
            let genderFctField = [];
            let genderMgmtField = [];

            genderFctField = this.genderFctFields.filter(f => f === fieldName);
            genderMgmtField = this.genderMgmtFields.filter(f => f === fieldName);

            if (genderFctField.length > 0) {

                let answered = [];
                if (this.genderFctScoreArray != undefined || this.genderFctScoreArray != null) {
                    answered = this.genderFctScoreArray.filter(question => question.elementName == fieldName);
                }
                if (answered[0] != null) {
                    answered[0].id = indicator;
                    answered[0].elementName = fieldName;
                    this.genderFctScore = this.genderFctScore - parseInt(answered[0].value); //becase previous answer is not applicable any more
                    this.genderFctScore += parseInt(value);

                    for (var i in this.genderFctScoreArray) {
                        if (this.genderFctScoreArray[i].elementName == fieldName) {
                            this.genderFctScoreArray[i].id = indicator; // they will remain same
                            this.genderFctScoreArray[i].elementName = fieldName; // they will remain same
                            this.genderFctScoreArray[i].value = value;
                            this.genderFctScoreArray[i].score = this.genderFctScore;
                            break; //Stop this loop, we found it!
                        }
                    }
                }
                else { //push this question along with value and other attributes
                    let newAnswered = {}
                    newAnswered.id = indicator;
                    newAnswered.elementName = fieldName;
                    newAnswered.value = value;
                    this.genderFctScore += parseInt(value);
                    this.genderFctTotalScore += indicatorValue;
                    newAnswered.score = this.genderFctScore;
                    newAnswered.totalScore = this.genderFctTotalScore;
                    this.genderFctScoreArray.push(newAnswered);
                }

                var score = parseInt(this.genderFctScore);
                var totalScore = parseInt(this.genderFctTotalScore);
                var percent = (score / totalScore) * 100;
                percent = percent.toFixed(2);
                this.setState({
                    facilitation_score: this.genderFctScore,
                    facilitation_score_pct: percent
                })
            }
            else if (genderMgmtField.length > 0) {
                let answered = [];
                if (this.genderMgmtScoreArray != undefined || this.genderMgmtScoreArray != null) {
                    answered = this.genderMgmtScoreArray.filter(question => question.elementName == fieldName);
                }
                if (answered[0] != null) {
                    answered[0].id = indicator;
                    answered[0].elementName = fieldName;
                    this.genderMgmtScore = this.genderMgmtScore - parseInt(answered[0].value); //becase previous answer is not applicable any more
                    this.genderMgmtScore += parseInt(value);

                    for (var i in this.genderMgmtScoreArray) {
                        if (this.genderMgmtScoreArray[i].elementName == fieldName) {
                            this.genderMgmtScoreArray[i].id = indicator; // they will remain same
                            this.genderMgmtScoreArray[i].elementName = fieldName; // they will remain same
                            this.genderMgmtScoreArray[i].value = value;
                            this.genderMgmtScoreArray[i].score = this.genderMgmtScore;
                            break; //Stop this loop, we found it!
                        }
                    }
                }
                else { //push this question along with value and other attributes
                    let newAnswered = {}
                    newAnswered.id = indicator;
                    newAnswered.elementName = fieldName;
                    newAnswered.value = value;
                    this.genderMgmtScore += parseInt(value);
                    this.genderMgmtTotalScore += indicatorValue;
                    newAnswered.score = this.genderMgmtScore;
                    newAnswered.totalScore = this.genderMgmtTotalScore;
                    this.genderMgmtScoreArray.push(newAnswered);
                }

                var score = parseInt(this.genderMgmtScore);
                var totalScore = parseInt(this.genderMgmtTotalScore);
                var percent = (score / totalScore) * 100;
                percent = percent.toFixed(2);
                this.setState({
                    management_score: this.genderMgmtScore,
                    management_score_pct: percent
                })
            }

            var cumulativeScore = parseInt(this.genderFctScore) + parseInt(this.genderMgmtScore);
            var cumulativeTotalScore = parseInt(this.genderFctTotalScore) + parseInt(this.genderMgmtTotalScore);
            var cumulativePercent = (cumulativeScore / cumulativeTotalScore) * 100;
            cumulativePercent = cumulativePercent.toFixed(2);
            this.setState({
                monitoring_score: cumulativeScore,
                monitoring_score_pct: cumulativePercent
            })
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
    async handleChange(e, name) {

        this.setState({
            [name]: e
        });

        try {
            if (name === "school_id") {

                this.setState({ loading: true, loadingMsg: "Fetching data..." });
                let participants = await getParticipantsByLocation(e.uuid, false);
                if (participants != null && participants.length > 0) {
                    this.setState({
                        participants: participants,
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

                let attributes = await getLocationAttributesByLocation(e.uuid);
                this.autopopulateFields(attributes);
                this.setState({ loading: false });
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
            if (this.state.school_tier !== "") {
                dataObj.school_tier = this.state.school_tier === "New" ? "school_tier_new"
                    : (this.state.school_tier === "Running" ? "school_tier_running"
                        : (this.state.school_tier === "Exit" ? "school_tier_exit"
                            : ""));
            }

            // for csa
            if (this.isCsa) {

                var fields = this.csaRequiredFields.concat(this.csaDependantFields);
                fields = fields.concat(this.csaNonRequiredFields);
                for (let i = 0; i < fields.length; i++) {
                    if (fields[i] === "csa_flashcard") {
                        dataObj.csa_flashcard = {};
                        dataObj.csa_flashcard.values = [];
                        // generating multiselect for csa_flashcard
                        if ((this.state.csa_flashcard != null && this.state.csa_flashcard != undefined)) {
                            for (let i = 0; i < this.state.csa_flashcard.length; i++) {
                                dataObj.csa_flashcard.values.push(String(this.state.csa_flashcard[i].value));
                            }
                        }

                        continue;
                    }

                    if (fields[i] === "csa_beyond_guide_new") {
                        dataObj.csa_beyond_guide_new = {};
                        dataObj.csa_beyond_guide_new.values = [];
                        // generating multiselect for csa_beyond_guide_new
                        if ((this.state.csa_beyond_guide_new != null && this.state.csa_beyond_guide_new != undefined)) {
                            for (let i = 0; i < this.state.csa_beyond_guide_new.length; i++) {
                                dataObj.csa_beyond_guide_new.values.push(String(this.state.csa_beyond_guide_new[i].value));
                            }
                        }

                        continue;
                    }

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


                    var element = document.getElementById(fields[i]);
                    if (element != null) {
                        if (element.offsetParent != null) { // this line is for checking if the element is visible on page
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

            // for gender
            if (this.isGender) {
                var fields = this.genderRequiredFields.concat(this.genderDependantFields);
                fields = fields.concat(this.genderNonRequiredFields);
                for (let i = 0; i < fields.length; i++) {

                    if (fields[i] === "gender_flashcard") {
                        dataObj.gender_flashcard = {};
                        dataObj.gender_flashcard.values = [];
                        // generating multiselect for gender_flashcard
                        if ((this.state.gender_flashcard != null && this.state.gender_flashcard != undefined)) {
                            for (let i = 0; i < this.state.gender_flashcard.length; i++) {
                                dataObj.gender_flashcard.values.push(String(this.state.gender_flashcard[i].value));
                            }
                        }
                        continue;
                    }

                    if (fields[i] === "gender_beyond_guide_new") {
                        dataObj.gender_beyond_guide_new = {};
                        dataObj.gender_beyond_guide_new.values = [];
                        // generating multiselect for gender_beyond_guide_new
                        if ((this.state.gender_beyond_guide_new != null && this.state.gender_beyond_guide_new != undefined)) {
                            for (let i = 0; i < this.state.gender_beyond_guide_new.length; i++) {
                                dataObj.gender_beyond_guide_new.values.push(String(this.state.gender_beyond_guide_new[i].value));
                            }
                        }

                        continue;
                    }

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

                    var element = document.getElementById(fields[i]);
                    if (element != null) {
                        if (element.offsetParent != null) {
                            if (element.value != '')
                                dataObj[fields[i]] = element.value;
                        }
                        else if (this.genderDependantFields.filter(f => f == fields[i]).length == 0) {
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
                                    modalText: 'Data updated successfully.',
                                    modal: !this.state.modal
                                });
                                if (this.isCsa) {
                                    this.resetForm(this.csaRequiredFields);
                                    this.resetForm(this.csaDependantFields);
                                    this.resetForm(this.csaNonRequiredFields);
                                }
                                if (this.isGender) {
                                    this.resetForm(this.genderRequiredFields);
                                    this.resetForm(this.genderDependantFields);
                                    this.resetForm(this.genderNonRequiredFields);
                                }
                            }
                            else if (String(responseData).includes("Error")) {
                                var submitMsg = '';
                                submitMsg = "Unable to update data. Please see error logs for details. \
                            " + String(responseData);

                                this.setState({
                                    loading: false,
                                    modalHeading: 'Fail!',
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

                                if (this.isCsa) {
                                    this.resetForm(this.csaRequiredFields);
                                    this.resetForm(this.csaDependantFields);
                                    this.resetForm(this.csaNonRequiredFields);
                                }
                                if (this.isGender) {
                                    this.resetForm(this.genderRequiredFields);
                                    this.resetForm(this.genderDependantFields);
                                    this.resetForm(this.genderNonRequiredFields);
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

        (this.runningTier || this.exitTier) && this.isCsa ? this.csaDependantFields.push("csa_beyond_guide") : this.csaRequiredFields = this.csaRequiredFields.filter(e => e !== "csa_beyond_guide");
        (this.runningTier || this.exitTier) && this.isGender ? this.genderDependantFields.push("gender_beyond_guide") : this.genderRequiredFields = this.genderRequiredFields.filter(e => e !== "gender_beyond_guide");
        this.exitTier && this.isCsa ? this.csaDependantFields.push("csa_mt_count") : this.csaRequiredFields = this.csaRequiredFields.filter(e => e !== "csa_mt_count");
        this.exitTier && this.isCsa ? this.csaDependantFields.push("csa_mt_teacher_coordination") : this.csaRequiredFields = this.csaRequiredFields.filter(e => e !== "csa_mt_teacher_coordination");
        this.exitTier && this.isCsa ? this.csaDependantFields.push("csa_mt_conduct_monitoring") : this.csaRequiredFields = this.csaRequiredFields.filter(e => e !== "csa_mt_conduct_monitoring");
        this.exitTier && this.isCsa ? this.csaDependantFields.push("csa_mt_conduct_training") : this.csaRequiredFields = this.csaRequiredFields.filter(e => e !== "csa_mt_conduct_training");

        let formIsValid = true;
        if (this.isCsa) {
            this.setState({ hasError: this.checkValid(this.csaRequiredFields, this.csaDependantFields) ? false : true });
            formIsValid = this.checkValid(this.csaRequiredFields, this.csaDependantFields);
        }

        if (this.isGender) {
            this.setState({ hasError: this.checkValid(this.genderRequiredFields, this.genderDependantFields) ? false : true });
            formIsValid = this.checkValid(this.genderRequiredFields, this.genderDependantFields);
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

        const page2style = this.state.page2Show ? {} : { display: 'none' };

        // for view mode
        const setDisable = this.state.viewMode ? "disabled" : "";

        const monitoredCsaStyle = this.isCsa ? {} : { display: 'none' };
        const monitoredGenderStyle = this.isGender ? {} : { display: 'none' };
        const csaExitRunningStyle = this.isCsa && (this.runningTier || this.exitTier) ? {} : { display: 'none' };
        const genderExitRunningStyle = this.isGender && (this.runningTier || this.exitTier) ? {} : { display: 'none' };
        const exitTierStyle = this.exitTier ? {} : { display: 'none' };
        const csaBeyondGuideStyle = this.isCsaBeyondGuide && (this.runningTier || this.exitTier) ? {} : { display: 'none' };
        const genderBeyondGuideStyle = this.isGenderBeyondGuide && (this.runningTier || this.exitTier) ? {} : { display: 'none' };
        const csaIntegratedStyle = this.isCsaIntegrated ? {} : { display: 'none' };
        const genderIntegratedStyle = this.isGenderIntegrated ? {} : { display: 'none' };
        const csaFrequencyOtherStyle = this.isCsaFrequencyOther ? {} : { display: 'none' };
        const genderFrequencyOtherStyle = this.isGenderFrequencyOther ? {} : { display: 'none' };

        const csaChallenge1Style = this.isCsaChallenge1 ? {} : { display: 'none' };
        const csaChallenge2Style = this.isCsaChallenge2 ? {} : { display: 'none' };
        const csaChallenge3Style = this.isCsaChallenge3 ? {} : { display: 'none' };
        const csaChallenge4Style = this.isCsaChallenge4 ? {} : { display: 'none' };
        const csaChallenge5Style = this.isCsaChallenge5 ? {} : { display: 'none' };
        const csaChallenge6Style = this.isCsaChallenge6 ? {} : { display: 'none' };

        const genderChallenge1Style = this.isGenderChallenge1 ? {} : { display: 'none' };
        const genderChallenge2Style = this.isGenderChallenge2 ? {} : { display: 'none' };
        const genderChallenge3Style = this.isGenderChallenge3 ? {} : { display: 'none' };
        const genderChallenge4Style = this.isGenderChallenge4 ? {} : { display: 'none' };
        const genderChallenge5Style = this.isGenderChallenge5 ? {} : { display: 'none' };
        const genderChallenge6Style = this.isGenderChallenge6 ? {} : { display: 'none' };

        const csaResourcesRequiredStyle = this.isCsaResourcesRequired ? {} : { display: 'none' };
        const genderResourcesRequiredStyle = this.isGenderResourcesRequired ? {} : { display: 'none' };

        const csaOtherResourcesReqStyle = this.isCsaOtherResourcesRequired && this.isCsaResourcesRequired ? {} : { display: 'none' };
        const genderOtherResourcesReqStyle = this.isGenderOtherResourcesRequired && this.isGenderResourcesRequired ? {} : { display: 'none' };

        const csaResourcesDeliveredStyle = this.isCsaResourcesDelivered ? {} : { display: 'none' };
        const genderResourcesDeliveredStyle = this.isGenderResourcesDelivered ? {} : { display: 'none' };

        const csaOtherResourcesDelStyle = this.isCsaOtherResourcesDelivered && this.isCsaResourcesDelivered ? {} : { display: 'none' };
        const genderOtherResourcesDelStyle = this.isGenderOtherResourcesDelivered && this.isGenderResourcesDelivered ? {} : { display: 'none' };

        const { selectedOption } = this.state;

        // scoring labels
        const stronglyAgree = "Strongly Agree";
        const agree = "Agree";
        const neither = "Neither Agree nor Disagree";
        const stronglyDisagree = "Strongly Disagree";
        const disagree = "Disagree";
        const yes = "Yes";
        const no = "No";

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
                                <Form id="primaryExit" onSubmit={this.handleSubmit} >
                                    <Row>
                                        <Col md="6">
                                            <Card className="main-card mb-6">
                                                <CardHeader>
                                                    <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                    <b>Primary Monitoring Form</b>
                                                </CardHeader>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="12">
                                            <Card className="main-card mb-6 center-col">
                                                <CardBody>
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
                                                                            <Label for="date_start">Monitoring Date<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                            <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => { this.inputChange(e, "date_start") }} max={moment().format("YYYY-MM-DD")} />
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">

                                                                        <FormGroup >
                                                                            <Label for="school_id" >School ID<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["school_id"]}</span>
                                                                            <Select id="school_id" name="school_id" value={this.state.school_id} onChange={(e) => this.handleChange(e, "school_id")} options={this.state.schools} />
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
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_sex" >Classification of School by Sex</Label> <span class="errorMessage">{this.state.errors["school_sex"]}</span>
                                                                            <Input name="school_sex" id="school_sex" value={this.state.school_sex} disabled />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="class_sex" >Students in Class by Sex</Label> <span class="errorMessage">{this.state.errors["class_sex"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "class_sex")} value={this.state.class_sex} name="class_sex" id="class_sex">
                                                                                <option value="girls">Girls</option>
                                                                                <option value="boys">Boys</option>
                                                                                <option value="coed">Co-ed</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_tier" >School Tier</Label>
                                                                            <Input name="school_tier" id="school_tier" value={this.state.school_tier} disabled />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup>
                                                                            <Label for="participant_name" >Name of Teacher<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["participant_name"]}</span>
                                                                            <Select id="participant_name" name="participant_name" value={this.state.participant_name} onChange={(e) => this.handleChange(e, "participant_name")} options={this.state.participants} />
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="participant_id" >Teacher ID<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["participant_id"]}</span>
                                                                            <Input name="participant_id" id="participant_id" value={this.state.participant_id} disabled />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="primary_grade" >Class</Label> <span class="errorMessage">{this.state.errors["primary_grade"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "primary_grade")} value={this.state.primary_grade} name="primary_grade" id="primary_grade">

                                                                                <option value="one">1</option>
                                                                                <option value="two">2</option>
                                                                                <option value="three">3</option>
                                                                                <option value="four">4</option>
                                                                                <option value="five">5</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="class_students" >Number of Students in Class<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["class_students"]}</span>
                                                                            <Input type="number" name="class_students" id="class_students" value={this.state.class_students} onChange={(e) => { this.inputChange(e, "class_students") }} onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2) }} max="99" min="1" />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="class_duration" >Time duration of class in minutes<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["class_duration"]}</span>
                                                                            <Input type="number" name="class_duration" id="class_duration" value={this.state.class_duration} onChange={(e) => { this.inputChange(e, "class_duration") }} onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} max="999" min="1" />
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="program_type" >Primary Program</Label> <span class="errorMessage">{this.state.errors["program_type"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "program_type")} value={this.state.program_type} name="program_type" id="program_type" disabled={this.editMode}>
                                                                                <option value="csa">CSA</option>
                                                                                <option value="gender">Gender</option>
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
                                                                        <FormGroup >
                                                                            <Label for="csa_flashcard" >CSA Flashcard being run<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["csa_flashcard"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "csa_flashcard")} value={this.state.csa_flashcard} id="csa_flashcard" options={csaFlashcards} required isMulti />
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="csa_flashcard_revision" >Revision or first time flashcard is being taught</Label> <span class="errorMessage">{this.state.errors["csa_flashcard_revision"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "csa_flashcard_revision")} value={this.state.csa_flashcard_revision} name="csa_flashcard_revision" id="csa_flashcard_revision" required>
                                                                                <option value="revision">Revision</option>
                                                                                <option value="first_time">First time</option>

                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <Label><h7><u><b>Facilitation</b></u></h7></Label>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="csa_prompts" >The teacher is using the prompts provided in the CSA flashcard guide<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_prompts" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_prompts")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_prompts" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "csa_prompts")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_prompts" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_prompts")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_prompts" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_prompts")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_prompts" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_prompts")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_prompts"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="csa_flashcard_objective" >The teacher is meeting the objective of each flashcard even if they are not using all prompts provided in the CSA flashcard guide<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_flashcard_objective" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_flashcard_objective")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_flashcard_objective" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "csa_flashcard_objective")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_flashcard_objective" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_flashcard_objective")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_flashcard_objective" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_flashcard_objective")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_flashcard_objective" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_flashcard_objective")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_flashcard_objective"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="csa_material_preparation" >The teacher had all materials prepared in advance for the class<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        {/* TODO: fill UUIDs */}
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_material_preparation" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_material_preparation")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_material_preparation" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "csa_material_preparation")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_material_preparation" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_material_preparation")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_material_preparation" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_material_preparation")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_material_preparation" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_material_preparation")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_material_preparation"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="csa_teacher_preparation" >The teacher was well prepared to facilitate the session<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_teacher_preparation" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_teacher_preparation")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_teacher_preparation" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "csa_teacher_preparation")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_teacher_preparation" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_teacher_preparation")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_teacher_preparation" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_teacher_preparation")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_teacher_preparation" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_teacher_preparation")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_teacher_preparation"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="csa_activity_time_allotment" >An appropriate amount of time is allotted for each activity and topic<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_activity_time_allotment" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_activity_time_allotment")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_activity_time_allotment" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "csa_activity_time_allotment")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_activity_time_allotment" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_activity_time_allotment")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_activity_time_allotment" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_activity_time_allotment")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_activity_time_allotment" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_activity_time_allotment")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_activity_time_allotment"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={csaExitRunningStyle}>
                                                                        <FormGroup >
                                                                            <Label for="csa_beyond_guide" >Teacher has gone beyond the teacher???s guide to build on and/or develop new activities</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_beyond_guide" id="yes" value="1" onChange={(e) => this.scoreChange(e, "csa_beyond_guide")} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_beyond_guide" id="no" value="0" onChange={(e) => this.scoreChange(e, "csa_beyond_guide")} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_beyond_guide"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="8" style={csaBeyondGuideStyle}>
                                                                        <FormGroup >
                                                                            <Label for="csa_beyond_guide_new" >What has the teacher done that is new?</Label> <span class="errorMessage">{this.state.errors["csa_beyond_guide_new"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "csa_beyond_guide_new")} value={this.state.csa_beyond_guide_new} id="csa_beyond_guide_new" options={new_activities_options} required isMulti />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="csa_subject_comfort" >The teacher is comfortable speaking about this subject<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_subject_comfort" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_subject_comfort")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_subject_comfort" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "csa_subject_comfort")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_subject_comfort" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_subject_comfort")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_subject_comfort" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_subject_comfort")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_subject_comfort" id="strongly_agree" value="5" /* checked= {this.state.sex === 'Strongly Agree'} */ onChange={(e) => this.scoreChange(e, "csa_subject_comfort")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_subject_comfort"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="csa_nonjudmental_tone" >The teacher uses a non-judgmental tone while facilitating the session<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_nonjudmental_tone" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_nonjudmental_tone")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_nonjudmental_tone" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "csa_nonjudmental_tone")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_nonjudmental_tone" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_nonjudmental_tone")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_nonjudmental_tone" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_nonjudmental_tone")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_nonjudmental_tone" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_nonjudmental_tone")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_nonjudmental_tone"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>


                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="csa_impartial_opinions" >The teacher does not impose their own values or opinions on the participants<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_impartial_opinions" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_impartial_opinions")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_impartial_opinions" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "csa_impartial_opinions")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_impartial_opinions" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_impartial_opinions")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_impartial_opinions" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_impartial_opinions")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_impartial_opinions" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_impartial_opinions")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_impartial_opinions"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="csa_student_engagement" >Students are engaged in discussion on flashcard(s)<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_student_engagement" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_student_engagement")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_student_engagement" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "csa_student_engagement")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_student_engagement" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_student_engagement")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_student_engagement" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_student_engagement")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_student_engagement" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_student_engagement")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_student_engagement"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="csa_student_understanding" >Students understand the main messages of the flashcard(s)<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_student_understanding" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_student_understanding")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_student_understanding" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "csa_student_understanding")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_student_understanding" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_student_understanding")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_student_understanding" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_student_understanding")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_student_understanding" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_student_understanding")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_student_understanding"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="csa_student_attention" >Students are actively paying attention to the class while the teacher is instructing<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_student_attention" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_student_attention")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_student_attention" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "csa_student_attention")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_student_attention" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_student_attention")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_student_attention" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_student_attention")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_student_attention" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_student_attention")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_student_attention"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="facilitation_score" style={{ color: "green" }}><b>Facilitation Score</b></Label>
                                                                            <Input value={this.state.facilitation_score} name="facilitation_score" id="facilitation_score" onChange={(e) => { this.inputChange(e, "facilitation_score") }} readOnly></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="facilitation_score_pct" style={{ color: "green" }}><b>% Facilitation Score</b></Label>
                                                                            <Input name="facilitation_score_pct" id="facilitation_score_pct" value={this.state.facilitation_score_pct} onChange={(e) => { this.inputChange(e, "facilitation_score_pct") }} readOnly></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <Label><h7><u><b>Management</b></u></h7></Label>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="csa_timetable_integration" >Management has integrated the CSA program into the school timetable<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_timetable_integration" id="yes" value="1" onChange={(e) => this.scoreChange(e, "csa_timetable_integration")} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_timetable_integration" id="no" value="0" onChange={(e) => this.scoreChange(e, "csa_timetable_integration")} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_timetable_integration"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={csaIntegratedStyle}>
                                                                        <FormGroup >
                                                                            <Label for="csa_class_frequency" >Frequency of class in time table</Label> <span class="errorMessage">{this.state.errors["csa_class_frequency"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "csa_class_frequency")} value={this.state.csa_class_frequency} name="csa_class_frequency" id="csa_class_frequency">
                                                                                <option value="weekly">Weekly</option>
                                                                                <option value="biweekly">Biweekly</option>
                                                                                <option value="monthly">Monthly</option>
                                                                                <option value="other">Other</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={csaFrequencyOtherStyle}>
                                                                        <FormGroup >
                                                                            <Label for="csa_class_frequency_other" >If other, please specify</Label> <span class="errorMessage">{this.state.errors["csa_class_frequency_other"]}</span>
                                                                            <Input value={this.state.csa_class_frequency_other} name="csa_class_frequency_other" id="csa_class_frequency_other" onChange={(e) => { this.inputChange(e, "csa_class_frequency_other") }} ></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="csa_two_teacher_assigned" >There are at least 2 teachers assigned to teach the CSA program<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_two_teacher_assigned" id="yes" value="1" onChange={(e) => this.scoreChange(e, "csa_two_teacher_assigned")} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_two_teacher_assigned" id="no" value="0" onChange={(e) => this.scoreChange(e, "csa_two_teacher_assigned")} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_two_teacher_assigned"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="csa_teacher_mgmt_coordination" >There is excellent coordination between management and teachers regarding the CSA program<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_teacher_mgmt_coordination" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_teacher_mgmt_coordination")} />{' '}
                                                                                            {stronglyDisagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_teacher_mgmt_coordination" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "csa_teacher_mgmt_coordination")} />{' '}
                                                                                            {disagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_teacher_mgmt_coordination" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_teacher_mgmt_coordination")} />{' '}
                                                                                            {neither}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_teacher_mgmt_coordination" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_teacher_mgmt_coordination")} />{' '}
                                                                                            {agree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_teacher_mgmt_coordination" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_teacher_mgmt_coordination")} />{' '}
                                                                                            {stronglyAgree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_teacher_mgmt_coordination"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="8" style={exitTierStyle}>
                                                                        <FormGroup>
                                                                            <Label for="csa_mt_count">Number of Master Trainers leading CSA program</Label> <span class="errorMessage">{this.state.errors["csa_mt_count"]}</span>
                                                                            <Input type="number" value={this.state.csa_mt_count} name="csa_mt_count" id="csa_mt_count" onChange={(e) => { this.inputChange(e, "csa_mt_count") }} max="99" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2) }} placeholder="Enter in number"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={exitTierStyle}>
                                                                        <FormGroup >
                                                                            <Label for="csa_mt_teacher_coordination" >There is excellent coordination between Master Trainers and teachers regarding the CSA program</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_mt_teacher_coordination" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_mt_teacher_coordination")} />{' '}
                                                                                            {stronglyDisagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_mt_teacher_coordination" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "csa_mt_teacher_coordination")} />{' '}
                                                                                            {disagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_mt_teacher_coordination" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_mt_teacher_coordination")} />{' '}
                                                                                            {neither}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_mt_teacher_coordination" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_mt_teacher_coordination")} />{' '}
                                                                                            {agree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_mt_teacher_coordination" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_mt_teacher_coordination")} />{' '}
                                                                                            {stronglyAgree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_mt_teacher_coordination"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={exitTierStyle}>
                                                                        <FormGroup >
                                                                            <Label for="csa_mt_conduct_monitoring" >Master Trainers conduct regular monitoring sessions to maintain quality of CSA program</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_mt_conduct_monitoring" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_mt_conduct_monitoring")} />{' '}
                                                                                            {stronglyDisagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_mt_conduct_monitoring" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "csa_mt_conduct_monitoring")} />{' '}
                                                                                            {disagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_mt_conduct_monitoring" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_mt_conduct_monitoring")} />{' '}
                                                                                            {neither}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_mt_conduct_monitoring" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_mt_conduct_monitoring")} />{' '}
                                                                                            {agree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_mt_conduct_monitoring" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_mt_conduct_monitoring")} />{' '}
                                                                                            {stronglyAgree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_mt_conduct_monitoring"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={exitTierStyle}>
                                                                        <FormGroup >
                                                                            <Label for="csa_mt_conduct_training" >Master Trainers arrange and conduct refresher trainings as needed for CSA teachers</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_mt_conduct_training" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_mt_conduct_training")} />{' '}
                                                                                            {stronglyDisagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_mt_conduct_training" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "csa_mt_conduct_training")} />{' '}
                                                                                            {disagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_mt_conduct_training" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_mt_conduct_training")} />{' '}
                                                                                            {neither}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_mt_conduct_training" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_mt_conduct_training")} />{' '}
                                                                                            {agree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_mt_conduct_training" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_mt_conduct_training")} />{' '}
                                                                                            {stronglyAgree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_mt_conduct_training"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="management_score" style={{ color: "green" }}><b>Management Score</b></Label>
                                                                            <Input value={this.state.management_score} name="management_score" id="management_score" onChange={(e) => { this.inputChange(e, "management_score") }} readOnly></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="management_score_pct" style={{ color: "green" }}><b>% Management Score</b></Label>
                                                                            <Input name="management_score_pct" id="management_score_pct" value={this.state.management_score_pct} onChange={(e) => { this.inputChange(e, "management_score_pct") }} readOnly></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <Label><h7><u><b>Score</b></u></h7></Label>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup>
                                                                            <Label>The cumulative score for the Facilitation and Management section is as below:</Label>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="monitoring_score" style={{ color: "green" }}><b>Cumulative Monitoring Score</b></Label>
                                                                            <Input value={this.state.monitoring_score} name="monitoring_score" id="monitoring_score" onChange={(e) => { this.inputChange(e, "monitoring_score") }} readOnly></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="monitoring_score_pct" style={{ color: "green" }}><b>% Monitoring Score</b></Label>
                                                                            <Input name="monitoring_score_pct" id="monitoring_score_pct" value={this.state.monitoring_score_pct} onChange={(e) => { this.inputChange(e, "monitoring_score_pct") }} readOnly></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <Label><h7><u><b>Challenges</b></u></h7></Label>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="csa_challenge_1" >The school is facing challenges scheduling the CSA class<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_challenge_1" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "csa_challenge_1") }} />{' '}
                                                                                            {yes}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_challenge_1" id="no" value="no" onChange={(e) => { this.inputChange(e, "csa_challenge_1") }} />{' '}
                                                                                            {no}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_challenge_1"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={csaChallenge1Style}>
                                                                        <FormGroup >
                                                                            <Label for="csa_challenge_1_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["csa_challenge_1_status"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "csa_challenge_1_status")} value={this.state.csa_challenge_1_status} name="csa_challenge_1_status" id="csa_challenge_1_status">
                                                                                <option value="resolved">Resolved</option>
                                                                                <option value="unresolved">Unresolved</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="csa_challenge_2" >There are not enough resources<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_challenge_2" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "csa_challenge_2") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_challenge_2" id="no" value="no" onChange={(e) => { this.inputChange(e, "csa_challenge_2") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_challenge_2"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={csaChallenge2Style}>
                                                                        <FormGroup >
                                                                            <Label for="csa_challenge_2_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["csa_challenge_2_status"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "csa_challenge_2_status")} value={this.state.csa_challenge_2_status} name="csa_challenge_2_status" id="csa_challenge_2_status">
                                                                                <option value="resolved">Resolved</option>
                                                                                <option value="unresolved">Unresolved</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="csa_challenge_3" >There is no room for the class<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_challenge_3" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "csa_challenge_3") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_challenge_3" id="no" value="no" onChange={(e) => { this.inputChange(e, "csa_challenge_3") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_challenge_3"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={csaChallenge3Style}>
                                                                        <FormGroup >
                                                                            <Label for="csa_challenge_3_status">Status of Challenge</Label> <span class="errorMessage">{this.state.errors["csa_challenge_3_status"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "csa_challenge_3_status")} value={this.state.csa_challenge_3_status} name="csa_challenge_3_status" id="csa_challenge_3_status">
                                                                                <option value="resolved">Resolved</option>
                                                                                <option value="unresolved">Unresolved</option>
                                                                            </Input><span class="errorMessage">{this.state.errors[""]}</span>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="csa_challenge_4">There are not enough teachers to teach the CSA class<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_challenge_4" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "csa_challenge_4") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_challenge_4" id="no" value="no" onChange={(e) => { this.inputChange(e, "csa_challenge_4") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_challenge_4"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={csaChallenge4Style}>
                                                                        <FormGroup >
                                                                            <Label for="csa_challenge_4_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["csa_challenge_4_status"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "csa_challenge_4_status")} value={this.state.csa_challenge_4_status} name="csa_challenge_4_status" id="csa_challenge_4_status">
                                                                                <option value="resolved">Resolved</option>
                                                                                <option value="unresolved">Unresolved</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup style={monitoredCsaStyle}>
                                                                            <Label for="csa_challenge_5" >The content is irrelevant for the context of the students<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_challenge_5" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "csa_challenge_5") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_challenge_5" id="no" value="no" onChange={(e) => { this.inputChange(e, "csa_challenge_5") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_challenge_5"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={csaChallenge5Style}>
                                                                        <FormGroup >
                                                                            <Label for="csa_challenge_5_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["csa_challenge_5_status"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "csa_challenge_5_status")} value={this.state.csa_challenge_5_status} name="csa_challenge_5_status" id="csa_challenge_5_status">
                                                                                <option value="resolved">Resolved</option>
                                                                                <option value="unresolved">Unresolved</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="csa_challenge_6">Students are not interested in the content<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_challenge_6" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "csa_challenge_6") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_challenge_6" id="no" value="no" onChange={(e) => { this.inputChange(e, "csa_challenge_6") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_challenge_6"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={csaChallenge6Style}>
                                                                        <FormGroup >
                                                                            <Label for="csa_challenge_6_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["csa_challenge_6_status"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "csa_challenge_6_status")} value={this.state.csa_challenge_6_status} name="csa_challenge_6_status" id="csa_challenge_6_status">
                                                                                <option value="resolved">Resolved</option>
                                                                                <option value="unresolved">Unresolved</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <Label><h7><u><b>Resources</b></u></h7></Label>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="csa_resources_required">Does this school require any resources?<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_resources_required" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "csa_resources_required") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_resources_required" id="no" value="no" onChange={(e) => { this.inputChange(e, "csa_resources_required") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_resources_required"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={csaResourcesRequiredStyle}>
                                                                        <FormGroup >
                                                                            <Label for="csa_guide_required_count" >CSA Flashcard Guides</Label>  <span class="errorMessage">{this.state.errors["csa_guide_required_count"]}</span>
                                                                            <Input type="number" value={this.state.csa_guide_required_count} name="csa_guide_required_count" id="csa_guide_required_count" onChange={(e) => { this.inputChange(e, "csa_guide_required_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={csaResourcesRequiredStyle}>
                                                                        <FormGroup >
                                                                            <Label for="csa_book_required_count" >Drawing Books</Label>  <span class="errorMessage">{this.state.errors["csa_book_required_count"]}</span>
                                                                            <Input type="number" value={this.state.csa_book_required_count} name="csa_book_required_count" id="csa_book_required_count" onChange={(e) => { this.inputChange(e, "csa_book_required_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={csaResourcesRequiredStyle}>
                                                                        <FormGroup >
                                                                            <Label for="csa_other_required_count" >Other Resource</Label> <span class="errorMessage">{this.state.errors["csa_other_required_count"]}</span>
                                                                            <Input type="number" value={this.state.csa_other_required_count} name="csa_other_required_count" id="csa_other_required_count" onChange={(e) => { this.inputChange(e, "csa_other_required_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={csaOtherResourcesReqStyle}>
                                                                        <FormGroup >
                                                                            <Label for="csa_other_required_type" >Specify other type of resource</Label> <span class="errorMessage">{this.state.errors["csa_other_required_type"]}</span>
                                                                            <Input value={this.state.csa_other_required_type} name="csa_other_required_type" id="csa_other_required_type" onChange={(e) => { this.inputChange(e, "csa_other_required_type") }} placeholder="Enter other type of resource"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>


                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="csa_resources_delivered">Were any resources distributed to this school in this visit?<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_resources_delivered" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "csa_resources_delivered") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="csa_resources_delivered" id="no" value="no" onChange={(e) => { this.inputChange(e, "csa_resources_delivered") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["csa_resources_delivered"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={csaResourcesDeliveredStyle}>
                                                                        <FormGroup >
                                                                            <Label for="csa_guide_delivered_count" >CSA Flashcard Guides</Label>  <span class="errorMessage">{this.state.errors["csa_guide_delivered_count"]}</span>
                                                                            <Input type="number" value={this.state.csa_guide_delivered_count} name="csa_guide_delivered_count" id="csa_guide_delivered_count" onChange={(e) => { this.inputChange(e, "csa_guide_delivered_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={csaResourcesDeliveredStyle}>
                                                                        <FormGroup >
                                                                            <Label for="csa_book_delivered_count" >Drawing Books</Label>  <span class="errorMessage">{this.state.errors["csa_book_delivered_count"]}</span>
                                                                            <Input type="number" value={this.state.csa_book_delivered_count} name="csa_book_delivered_count" id="csa_book_delivered_count" onChange={(e) => { this.inputChange(e, "csa_book_delivered_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={csaResourcesDeliveredStyle}>
                                                                        <FormGroup >
                                                                            <Label for="csa_other_delivered_count" >Other Resource</Label> <span class="errorMessage">{this.state.errors["csa_other_delivered_count"]}</span>
                                                                            <Input type="number" value={this.state.csa_other_delivered_count} name="csa_other_delivered_count" id="csa_other_delivered_count" onChange={(e) => { this.inputChange(e, "csa_other_delivered_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={csaOtherResourcesDelStyle}>
                                                                        <FormGroup >
                                                                            <Label for="csa_other_delivered_type" >Specify other type of resource</Label> <span class="errorMessage">{this.state.errors["csa_other_delivered_type"]}</span>
                                                                            <Input value={this.state.csa_other_delivered_type} name="csa_other_delivered_type" id="csa_other_delivered_type" onChange={(e) => { this.inputChange(e, "csa_other_delivered_type") }} placeholder="Enter other type of resource"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                            </TabPane>
                                                            <TabPane tabId="3" id="gender">
                                                                <Row>
                                                                    <Col md="6">
                                                                        <Label><h6><u><b>Gender Program</b></u></h6></Label>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup>
                                                                            <Label for="gender_flashcard" >Gender Flashcard being run<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["gender_flashcard"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "gender_flashcard")} value={this.state.gender_flashcard} id="gender_flashcard" options={genderFlashcards} required isMulti />
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="gender_flashcard_revision">Revision or first time flashcard is being taught</Label> <span class="errorMessage">{this.state.errors["gender_flashcard_revision"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "gender_flashcard_revision")} value={this.state.gender_flashcard_revision} name="gender_flashcard_revision" id="gender_flashcard_revision" required>
                                                                                <option value="revision">Revision</option>
                                                                                <option value="first_time">First time</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <Label><h7><u><b>Facilitation</b></u></h7></Label>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="gender_prompts" >The teacher is using the prompts provided in the Gender flashcard guide<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_prompts" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_prompts")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_prompts" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_prompts")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_prompts" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_prompts")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_prompts" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_prompts")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_prompts" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_prompts")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_prompts"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="gender_flashcard_objective" >The teacher is meeting the objective of each flashcard even if they are not using all prompts provided in the Gender flashcard guide<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_flashcard_objective" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_flashcard_objective")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_flashcard_objective" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_flashcard_objective")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_flashcard_objective" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_flashcard_objective")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_flashcard_objective" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_flashcard_objective")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_flashcard_objective" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_flashcard_objective")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_flashcard_objective"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="gender_material_preparation" >The teacher had all materials prepared in advance for the class<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_material_preparation" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_material_preparation")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_material_preparation" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_material_preparation")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_material_preparation" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_material_preparation")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_material_preparation" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_material_preparation")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_material_preparation" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_material_preparation")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_material_preparation"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="gender_teacher_preparation" >The teacher was well prepared to facilitate the session<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_teacher_preparation" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_teacher_preparation")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_teacher_preparation" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_teacher_preparation")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_teacher_preparation" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_teacher_preparation")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_teacher_preparation" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_teacher_preparation")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_teacher_preparation" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_teacher_preparation")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_teacher_preparation"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="gender_activity_time_allotment" >An appropriate amount of time is allotted for each activity and topic<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_activity_time_allotment" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_activity_time_allotment")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_activity_time_allotment" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_activity_time_allotment")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_activity_time_allotment" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_activity_time_allotment")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_activity_time_allotment" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_activity_time_allotment")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_activity_time_allotment" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_activity_time_allotment")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_activity_time_allotment"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={genderExitRunningStyle}>
                                                                        <FormGroup >
                                                                            <Label for="gender_beyond_guide" >Teacher has gone beyond the teacher???s guide to build on and/or develop new activities</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_beyond_guide" id="yes" value="1" onChange={(e) => this.scoreChange(e, "gender_beyond_guide")} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_beyond_guide" id="no" value="0" onChange={(e) => this.scoreChange(e, "gender_beyond_guide")} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_beyond_guide"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="8" style={genderBeyondGuideStyle}>
                                                                        <FormGroup >
                                                                            <Label for="gender_beyond_guide_new" >What has the teacher done that is new?</Label> <span class="errorMessage">{this.state.errors["gender_beyond_guide_new"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "gender_beyond_guide_new")} value={this.state.gender_beyond_guide_new} id="gender_beyond_guide_new" options={new_activities_options} isMulti />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="gender_subject_comfort" >The teacher is comfortable speaking about this subject <span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_subject_comfort" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_subject_comfort")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_subject_comfort" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_subject_comfort")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_subject_comfort" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_subject_comfort")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_subject_comfort" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_subject_comfort")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_subject_comfort" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_subject_comfort")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_subject_comfort"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="gender_nonjudmental_tone" >The teacher uses a non-judgmental tone while facilitating the session<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_nonjudmental_tone" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_nonjudmental_tone")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_nonjudmental_tone" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_nonjudmental_tone")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_nonjudmental_tone" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_nonjudmental_tone")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_nonjudmental_tone" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_nonjudmental_tone")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_nonjudmental_tone" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_nonjudmental_tone")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_nonjudmental_tone"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="gender_impartial_opinions" >The teacher does not impose their own values or opinions on the participants<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_impartial_opinions" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_impartial_opinions")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_impartial_opinions" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_impartial_opinions")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_impartial_opinions" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_impartial_opinions")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_impartial_opinions" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_impartial_opinions")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_impartial_opinions" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_impartial_opinions")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_impartial_opinions"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="gender_student_engagement" >Students are engaged in discussion on flashcard(s)<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_student_engagement" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_student_engagement")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_student_engagement" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_student_engagement")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_student_engagement" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_student_engagement")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_student_engagement" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_student_engagement")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_student_engagement" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_student_engagement")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_student_engagement"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="gender_student_understanding" >Students understand the main messages of the flashcard(s)<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_student_understanding" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_student_understanding")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_student_understanding" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_student_understanding")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_student_understanding" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_student_understanding")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_student_understanding" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_student_understanding")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_student_understanding" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_student_understanding")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_student_understanding"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="gender_student_attention" >Students are actively paying attention to the class while the teacher is instructing<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_student_attention" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_student_attention")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_student_attention" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_student_attention")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_student_attention" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_student_attention")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_student_attention" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_student_attention")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_student_attention" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_student_attention")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_student_attention"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="facilitation_score" style={{ color: "green" }}><b>Facilitation Score</b></Label>
                                                                            <Input value={this.state.facilitation_score} name="facilitation_score" id="facilitation_score" onChange={(e) => { this.inputChange(e, "facilitation_score") }} readOnly></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="facilitation_score_pct" style={{ color: "green" }}><b>% Facilitation Score</b></Label>
                                                                            <Input name="facilitation_score_pct" id="facilitation_score_pct" value={this.state.facilitation_score_pct} onChange={(e) => { this.inputChange(e, "facilitation_score_pct") }} readOnly></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <Label><h7><u><b>Management</b></u></h7></Label>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="gender_timetable_integration" >Management has integrated the Gender program into the school timetable<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_timetable_integration" id="yes" value="1" onChange={(e) => this.scoreChange(e, "gender_timetable_integration")} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_timetable_integration" id="no" value="0" onChange={(e) => this.scoreChange(e, "gender_timetable_integration")} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_timetable_integration"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={genderIntegratedStyle}>
                                                                        <FormGroup >
                                                                            <Label for="gender_class_frequency" >Frequency of class in time table</Label> <span class="errorMessage">{this.state.errors["gender_class_frequency"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "gender_class_frequency")} value={this.state.gender_class_frequency} name="gender_class_frequency" id="gender_class_frequency">
                                                                                <option value="weekly">Weekly</option>
                                                                                <option value="biweekly">Biweekly</option>
                                                                                <option value="monthly">Monthly</option>
                                                                                <option value="other">Other</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={genderFrequencyOtherStyle}>
                                                                        <FormGroup >
                                                                            <Label for="gender_class_frequency_other" >If other, please specify</Label> <span class="errorMessage">{this.state.errors["gender_class_frequency_other"]}</span>
                                                                            <Input value={this.state.gender_class_frequency_other} name="gender_class_frequency_other" id="gender_class_frequency_other" onChange={(e) => { this.inputChange(e, "gender_class_frequency_other") }} ></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="gender_two_teacher_assigned" >There are at least 2 teachers assigned to teach the Gender program<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_two_teacher_assigned" id="yes" value="1" onChange={(e) => this.scoreChange(e, "gender_two_teacher_assigned")} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_two_teacher_assigned" id="no" value="0" onChange={(e) => this.scoreChange(e, "gender_two_teacher_assigned")} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_two_teacher_assigned"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="gender_teacher_mgmt_coordination" >There is excellent coordination between management and teachers regarding the Gender program<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_teacher_mgmt_coordination" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_teacher_mgmt_coordination")} />{' '}
                                                                                            {stronglyDisagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_teacher_mgmt_coordination" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_teacher_mgmt_coordination")} />{' '}
                                                                                            {disagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_teacher_mgmt_coordination" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_teacher_mgmt_coordination")} />{' '}
                                                                                            {neither}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_teacher_mgmt_coordination" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_teacher_mgmt_coordination")} />{' '}
                                                                                            {agree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_teacher_mgmt_coordination" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_teacher_mgmt_coordination")} />{' '}
                                                                                            {stronglyAgree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_teacher_mgmt_coordination"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="management_score" style={{ color: "green" }}><b>Management Score</b></Label>
                                                                            <Input value={this.state.management_score} name="management_score" id="management_score" onChange={(e) => { this.inputChange(e, "management_score") }} readOnly></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="management_score_pct" style={{ color: "green" }}><b>% Management Score</b></Label>
                                                                            <Input name="management_score_pct" id="management_score_pct" value={this.state.management_score_pct} onChange={(e) => { this.inputChange(e, "management_score_pct") }} readOnly></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <Label><h7><u><b>Score</b></u></h7></Label>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup>
                                                                            <Label>The cumulative score for the Facilitation and Management section is as below:</Label>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="monitoring_score" style={{ color: "green" }}><b>Cumulative Monitoring Score</b></Label>
                                                                            <Input value={this.state.monitoring_score} name="monitoring_score" id="monitoring_score" onChange={(e) => { this.inputChange(e, "monitoring_score") }} readOnly></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="monitoring_score_pct" style={{ color: "green" }}><b>% Monitoring Score</b></Label>
                                                                            <Input name="monitoring_score_pct" id="monitoring_score_pct" value={this.state.monitoring_score_pct} onChange={(e) => { this.inputChange(e, "monitoring_score_pct") }} readOnly></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <Label><h7><u><b>Challenges</b></u></h7></Label>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="gender_challenge_1" >The school is facing challenges scheduling the Gender class<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_challenge_1" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "gender_challenge_1") }} />{' '}
                                                                                            {yes}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_challenge_1" id="no" value="no" onChange={(e) => { this.inputChange(e, "gender_challenge_1") }} />{' '}
                                                                                            {no}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_challenge_1"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    {/* </Row> */}

                                                                    {/* <Row> */}
                                                                    <Col md="6" style={genderChallenge1Style}>
                                                                        <FormGroup >
                                                                            <Label for="gender_challenge_1_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["gender_challenge_1_status"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "gender_challenge_1_status")} value={this.state.gender_challenge_1_status} name="gender_challenge_1_status" id="gender_challenge_1_status">
                                                                                <option value="resolved">Resolved</option>
                                                                                <option value="unresolved">Unresolved</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="gender_challenge_2" >There are not enough resources<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_challenge_2" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "gender_challenge_2") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_challenge_2" id="no" value="no" onChange={(e) => { this.inputChange(e, "gender_challenge_2") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_challenge_2"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={genderChallenge2Style}>
                                                                        <FormGroup >
                                                                            <Label for="gender_challenge_2_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["gender_challenge_2_status"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "gender_challenge_2_status")} value={this.state.gender_challenge_2_status} name="gender_challenge_2_status" id="gender_challenge_2_status">
                                                                                <option value="resolved">Resolved</option>
                                                                                <option value="unresolved">Unresolved</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="gender_challenge_3" >There is no room for the class<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_challenge_3" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "gender_challenge_3") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_challenge_3" id="no" value="no" onChange={(e) => { this.inputChange(e, "gender_challenge_3") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_challenge_3"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={genderChallenge3Style}>
                                                                        <FormGroup >
                                                                            <Label for="gender_challenge_3_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["gender_challenge_3_status"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "gender_challenge_3_status")} value={this.state.gender_challenge_3_status} name="gender_challenge_3_status" id="gender_challenge_3_status">
                                                                                <option value="resolved">Resolved</option>
                                                                                <option value="unresolved">Unresolved</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="gender_challenge_4" >There are not enough teachers to teach the Gender class<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_challenge_4" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "gender_challenge_4") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_challenge_4" id="no" value="no" onChange={(e) => { this.inputChange(e, "gender_challenge_4") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_challenge_4"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={genderChallenge4Style}>
                                                                        <FormGroup >
                                                                            <Label for="gender_challenge_4_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["gender_challenge_4_status"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "gender_challenge_4_status")} value={this.state.gender_challenge_4_status} name="gender_challenge_4_status" id="gender_challenge_4_status">
                                                                                <option value="resolved">Resolved</option>
                                                                                <option value="unresolved">Unresolved</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" >
                                                                        <FormGroup >
                                                                            <Label for="gender_challenge_5" >The content is irrelevant for the context of the students<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_challenge_5" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "gender_challenge_5") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_challenge_5" id="no" value="no" onChange={(e) => { this.inputChange(e, "gender_challenge_5") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_challenge_5"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={genderChallenge5Style}>
                                                                        <FormGroup >
                                                                            <Label for="gender_challenge_5_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["gender_challenge_5_status"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "gender_challenge_5_status")} value={this.state.gender_challenge_5_status} name="gender_challenge_5_status" id="gender_challenge_5_status">
                                                                                <option value="resolved">Resolved</option>
                                                                                <option value="unresolved">Unresolved</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" >
                                                                        <FormGroup>
                                                                            <Label for="gender_challenge_6" >Students are not interested in the content<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_challenge_6" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "gender_challenge_6") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_challenge_6" id="no" value="no" onChange={(e) => { this.inputChange(e, "gender_challenge_6") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_challenge_6"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={genderChallenge6Style}>
                                                                        <FormGroup >
                                                                            <Label for="gender_challenge_6_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["gender_challenge_6_status"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "gender_challenge_6_status")} value={this.state.gender_challenge_6_status} name="gender_challenge_6_status" id="gender_challenge_6_status">
                                                                                <option value="resolved">Resolved</option>
                                                                                <option value="unresolved">Unresolved</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <Label><h7><u><b>Resources</b></u></h7></Label>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup style={monitoredGenderStyle}>
                                                                            <Label for="gender_resources_required">Does this school require any resources?<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_resources_required" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "gender_resources_required") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_resources_required" id="no" value="no" onChange={(e) => { this.inputChange(e, "gender_resources_required") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_resources_required"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={genderResourcesRequiredStyle}>
                                                                        <FormGroup >
                                                                            <Label for="gender_guide_required_count" >Gender Flashcard Guides</Label> <span class="errorMessage">{this.state.errors["gender_guide_required_count"]}</span>
                                                                            <Input type="number" value={this.state.gender_guide_required_count} name="gender_guide_required_count" id="gender_guide_required_count" onChange={(e) => { this.inputChange(e, "gender_guide_required_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={genderResourcesRequiredStyle}>
                                                                        <FormGroup >
                                                                            <Label for="gender_book_required_count" >Drawing Books</Label> <span class="errorMessage">{this.state.errors["gender_book_required_count"]}</span>
                                                                            <Input type="number" value={this.state.gender_book_required_count} name="gender_book_required_count" id="gender_book_required_count" onChange={(e) => { this.inputChange(e, "gender_book_required_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={genderResourcesRequiredStyle}>
                                                                        <FormGroup >
                                                                            <Label for="gender_other_required_count" >Other Resource</Label>  <span class="errorMessage">{this.state.errors["gender_other_required_count"]}</span>
                                                                            <Input type="number" value={this.state.gender_other_required_count} name="gender_other_required_count" id="gender_other_required_count" onChange={(e) => { this.inputChange(e, "gender_other_required_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={genderOtherResourcesReqStyle}>
                                                                        <FormGroup >
                                                                            <Label for="gender_other_required_type" >Specify other type of resource</Label> <span class="errorMessage">{this.state.errors["gender_other_required_type"]}</span>
                                                                            <Input value={this.state.gender_other_required_type} name="gender_other_required_type" id="gender_other_required_type" onChange={(e) => { this.inputChange(e, "gender_other_required_type") }} placeholder="Enter other type of resource"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>


                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="gender_resources_delivered">Were any resources distributed to this school in this visit?<span className="required">*</span></Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_resources_delivered" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "gender_resources_delivered") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="gender_resources_delivered" id="no" value="no" onChange={(e) => { this.inputChange(e, "gender_resources_delivered") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["gender_resources_delivered"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={genderResourcesDeliveredStyle}>
                                                                        <FormGroup >
                                                                            <Label for="gender_guide_delivered_count" >Gender Flashcard Guides</Label> <span class="errorMessage">{this.state.errors["gender_guide_delivered_count"]}</span>
                                                                            <Input type="number" value={this.state.gender_guide_delivered_count} name="gender_guide_delivered_count" id="gender_guide_delivered_count" onChange={(e) => { this.inputChange(e, "gender_guide_delivered_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={genderResourcesDeliveredStyle}>
                                                                        <FormGroup >
                                                                            <Label for="gender_book_delivered_count" >Drawing Books</Label> <span class="errorMessage">{this.state.errors["gender_book_delivered_count"]}</span>
                                                                            <Input type="number" value={this.state.gender_book_delivered_count} name="gender_book_delivered_count" id="gender_book_delivered_count" onChange={(e) => { this.inputChange(e, "gender_book_delivered_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={genderResourcesDeliveredStyle}>
                                                                        <FormGroup >
                                                                            <Label for="gender_other_delivered_count" >Other Resource</Label>  <span class="errorMessage">{this.state.errors["gender_other_delivered_count"]}</span>
                                                                            <Input type="number" value={this.state.gender_other_delivered_count} name="gender_other_delivered_count" id="gender_other_delivered_count" onChange={(e) => { this.inputChange(e, "gender_other_delivered_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={genderOtherResourcesDelStyle}>
                                                                        <FormGroup >
                                                                            <Label for="gender_other_delivered_type" >Specify other type of resource</Label> <span class="errorMessage">{this.state.errors["gender_other_delivered_type"]}</span>
                                                                            <Input value={this.state.gender_other_delivered_type} name="gender_other_delivered_type" id="gender_other_delivered_type" onChange={(e) => { this.inputChange(e, "gender_other_delivered_type") }} placeholder="Enter other type of resource"></Input>
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
                                                                <Button color="secondary" id="page_csa_a" style={monitoredCsaStyle}
                                                                    className={"btn-shadow " + classnames({ active: this.state.activeTab === '2' })}
                                                                    onClick={() => {
                                                                        this.toggleTab('2');
                                                                    }}
                                                                >CSA</Button>
                                                                <Button color="secondary" id="page_csa_b" style={monitoredGenderStyle}
                                                                    className={"btn-shadow " + classnames({ active: this.state.activeTab === '3' })}
                                                                    onClick={() => {
                                                                        this.toggleTab('3');
                                                                    }}
                                                                >Gender</Button>

                                                            </ButtonGroup>
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

export default PrimaryMonitoring;