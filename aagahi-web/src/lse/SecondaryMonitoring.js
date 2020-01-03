/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-16 16:22:35
 * @modify date 2019-08-16 16:22:35
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
import { getDefinitionByDefinitionId, getFormDataById, getFormTypeByUuid, getLocationAttributesByLocation, getLocationsByCategory, getParticipantsByLocation, getRoleByName, getUsersByRole } from "../service/GetService";
import { saveFormData, updateFormData } from "../service/PostService";
import { clearCheckedFields, getIndicatorCode, loadFormState } from "../util/AahungUtil.js";
import * as Constants from "../util/Constants";
import FormNavBar from "../widget/FormNavBar";
import LoadingIndicator from "../widget/LoadingIndicator";

const new_activities_options = [
    { value: 'new_activities', label: 'New activities' },
    { value: 'additional_probes', label: 'Additional Probes' },
    { value: 'additional_info', label: 'Additional Information' },
    { value: 'additional_videos', label: 'Additional videos' },
];

class SecondaryMonitoring extends React.Component {

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
            school_sex: 'girls',
            class_sex: 'girls',
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
            activeTab: '1',
            page2Show: true,
            viewMode: false,
            editMode: false,
            hasError: false,
            errors: {},
            loading: false,
            modal: false,
            modalText: '',
            modalHeading: ''
        };

        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.scoreChange = this.scoreChange.bind(this);
        this.inputChange = this.inputChange.bind(this);

        this.isClassSexCoed = false;
        this.isLevel1 = true;
        this.isLevel2 = false;
        this.isClassFrequencyOther = false;
        this.isBeyondGuide = false;
        this.isIntegrated = false;
        this.isChallenge1 = false;
        this.isChallenge2 = false;
        this.isChallenge3 = false;
        this.isChallenge4 = false;
        this.isChallenge5 = false;
        this.isChallenge6 = false;
        this.isSchoolSexGirls = true;
        this.isSchoolSexBoys = false;
        this.isWorkbookGirls = false;
        this.isWorkbookGirls = false;
        this.isOtherResources = false;
        this.isResourcesRequired = false;

        this.isResourcesRequiredDistribute = false;
        this.isWorkbookGirlsDistribute = false;
        this.isWorkbookBoysDistribute = false;
        this.isOtherResourcesDistribute = false;

        this.fctScore = 0;
        this.fctTotalScore = 0;
        this.fctScoreArray = [];
        this.mgmtScore = 0;
        this.mgmtTotalScore = 0;
        this.mgmtScoreArray = [];
        this.newTier = false;
        this.runningTier = false;
        this.exitTier = false;

        this.formTypeId = 0;
        this.lsbeRequiredFields = ["date_start", "school_id", "monitor", "school_sex", "class_sex", "participant_name",
            "participant_id", "secondary_grade", "class_students", "class_duration", "lsbe_level_monitored", "lsbe_chapter_revision",
            "lsbe_prompts", "lsbe_chapter_objective", "lsbe_teacher_understanding", "lsbe_material_preparation", "lsbe_teacher_preparation",
            "lsbe_activity_time_allotment", "lsbe_subject_comfort", "lsbe_nonjudmental_tone", "lsbe_impartial_opinions", "lsbe_discussion_probes",
            "lsbe_student_understanding", "lsbe_student_engagement", "lsbe_student_attention", "lsbe_timetable_integration",
            "lsbe_two_teacher_assigned", "lsbe_teacher_mgmt_coordination",
            "monitoring_score", "monitoring_score_pct", "facilitation_score", "facilitation_score_pct", "management_score",
            "management_score_pct", "lsbe_challenge_1", "lsbe_challenge_2", "lsbe_challenge_3", "lsbe_challenge_4", "lsbe_challenge_5",
            "lsbe_challenge_6", "lsbe_resources_required", "lsbe_resources_delivered"];

        this.lsbeDependantFields = ["lsbe_level_1", "lsbe_level_2", "lsbe_class_frequency", "lsbe_class_frequency_other",
            "lsbe_challenge_1_status", "lsbe_challenge_2_status", "lsbe_challenge_3_status", "lsbe_challenge_4_status", "lsbe_challenge_5_status",
            "lsbe_challenge_6_status"];

        this.nonRequiredFields = ["wb1_girls_required_count", "wb1_boys_required_count", "wb2_girls_required_count",
            "wb2_boys_required_count", "other_resource_required_count", "other_resource_required_type",
            "wb1_girls_delivered_count", "wb1_boys_delivered_count", "wb2_girls_delivered_count", "wb2_boys_delivered_count",
            "other_resource_delivered_count", "other_resource_delivered_type", "lsbe_beyond_guide", "lsbe_mt_count", "lsbe_mt_teacher_coordination",
            "lsbe_mt_conduct_monitoring", "lsbe_mt_conduct_training"];

        // facilitation fields; created a separate array for facilitation fields w.r.t scoring purpose
        this.fctFields = ["lsbe_prompts", "lsbe_chapter_objective", "lsbe_teacher_understanding", "lsbe_material_preparation",
            "lsbe_teacher_preparation", "lsbe_activity_time_allotment", "lsbe_beyond_guide", "lsbe_beyond_guide_new", "lsbe_subject_comfort",
            "lsbe_nonjudmental_tone", "lsbe_impartial_opinions", "lsbe_discussion_probes", "lsbe_student_understanding",
            "lsbe_student_engagement", "lsbe_student_attention"];

        // management fields; created a separate array for management fields w.r.t scoring purpose
        this.mgmtFields = ["lsbe_timetable_integration", "lsbe_two_teacher_assigned", "lsbe_teacher_mgmt_coordination",
            "lsbe_mt_teacher_coordination", "lsbe_mt_conduct_monitoring", "lsbe_mt_conduct_training"];

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

            let formTypeObj = await getFormTypeByUuid(Constants.SECONDARY_MONITORING_FORM_UUID);
            this.formTypeId = formTypeObj.formTypeId;

            let role = await getRoleByName(Constants.LSE_MONITOR_ROLE_NAME);
            console.log("Role ID:" + role.roleId);
            console.log(role.roleName);
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

                    if(this.state.school_tier !== "") {
                        this.state.school_tier = this.state.school_tier === "school_tier_new" ? "New" 
                        : (this.state.school_tier === "school_tier_running" ? "Running" 
                        : (this.state.school_tier === "school_tier_exit" ? "Exit" 
                        : ""));
                    }

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

            this.exitTier ? this.lsbeDependantFields.push("lsbe_mt_count") : this.lsbeRequiredFields = this.lsbeRequiredFields.filter(e => e !== "lsbe_mt_count");
            this.exitTier ? this.lsbeDependantFields.push("lsbe_mt_teacher_coordination") : this.lsbeRequiredFields = this.lsbeRequiredFields.filter(e => e !== "lsbe_mt_teacher_coordination");
            this.exitTier ? this.lsbeDependantFields.push("lsbe_mt_conduct_monitoring") : this.lsbeRequiredFields = this.lsbeRequiredFields.filter(e => e !== "lsbe_mt_conduct_monitoring");
            this.exitTier ? this.lsbeDependantFields.push("lsbe_mt_conduct_training") : this.lsbeRequiredFields = this.lsbeRequiredFields.filter(e => e !== "lsbe_mt_conduct_training");
            this.runningTier || this.exitTier ? this.lsbeDependantFields.push("lsbe_beyond_guide") : this.lsbeRequiredFields = this.lsbeRequiredFields.filter(e => e !== "lsbe_beyond_guide");
        }
        catch (error) {
            console.log(error);
        }
    }

    updateDisplay() {

        this.setState({
            school_sex: 'girls',
            class_sex: 'girls',
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

        this.isClassSexCoed = false;
        this.isLevel1 = true;
        this.isLevel2 = false;
        this.isClassFrequencyOther = false;
        this.isBeyondGuide = false;
        this.isIntegrated = false;
        this.isChallenge1 = false;
        this.isChallenge2 = false;
        this.isChallenge3 = false;
        this.isChallenge4 = false;
        this.isChallenge5 = false;
        this.isChallenge6 = false;
        this.isSchoolSexGirls = true;
        this.isSchoolSexBoys = false;
        this.isWorkbookGirls = false;
        this.isWorkbookGirls = false;
        this.isOtherResources = false;
        this.isResourcesRequired = false;

        this.isResourcesRequiredDistribute = false;
        this.isWorkbookGirlsDistribute = false;
        this.isWorkbookBoysDistribute = false;
        this.isOtherResourcesDistribute = false;

        this.fctScore = 0;
        this.fctTotalScore = 0;
        this.fctScoreArray = [];
        this.mgmtScore = 0;
        this.mgmtTotalScore = 0;
        this.mgmtScoreArray = [];
    }

    editUpdateDisplay() {

        if (this.state.lsbe_level_monitored !== '' && this.state.lsbe_level_monitored !== undefined) {
            this.isLevel1 = this.state.lsbe_level_monitored === "level_1" ? true : false;
            this.isLevel2 = this.state.lsbe_level_monitored === "level_2" ? true : false;
        }

        if (this.state.lsbe_class_frequency !== '' && this.state.lsbe_class_frequency !== undefined) {
            this.isClassFrequencyOther = this.state.lsbe_class_frequency === "other" ? true : false;
        }

        if (this.state.school_sex !== '' && this.state.school_sex !== undefined) {
            this.isSchoolSexGirls = this.state.school_sex === "girls" ? true : false;
            this.isSchoolSexBoys = this.state.school_sex === "boys" ? true : false;
            this.isWorkbookGirls = this.isSchoolSexGirls && this.isResourcesRequired;
            this.isWorkbookBoys = this.isSchoolSexBoys && this.isResourcesRequired;
            this.isWorkbookGirlsDistribute = this.isSchoolSexGirls && this.isResourcesRequiredDistribute;
            this.isWorkbookBoysDistribute = this.isSchoolSexBoys && this.isResourcesRequiredDistribute;
            this.setState({ class_sex: this.state.school_sex === "girls" ? 'girls' : 'boys' });
        }

        if (this.state.lsbe_challenge_1 !== '' && this.state.lsbe_challenge_1 !== undefined)
            this.isChallenge1 = this.state.lsbe_challenge_1 === "yes" ? true : false;
        if (this.state.lsbe_challenge_2 !== '' && this.state.lsbe_challenge_2 !== undefined)
            this.isChallenge2 = this.state.lsbe_challenge_2 === "yes" ? true : false;
        if (this.state.lsbe_challenge_3 !== '' && this.state.lsbe_challenge_3 !== undefined)
            this.isChallenge3 = this.state.lsbe_challenge_3 === "yes" ? true : false;
        if (this.state.lsbe_challenge_4 !== '' && this.state.lsbe_challenge_4 !== undefined)
            this.isChallenge4 = this.state.lsbe_challenge_4 === "yes" ? true : false;
        if (this.state.lsbe_challenge_5 !== '' && this.state.lsbe_challenge_5 !== undefined)
            this.isChallenge5 = this.state.lsbe_challenge_5 === "yes" ? true : false;
        if (this.state.lsbe_challenge_6 !== '' && this.state.lsbe_challenge_6 !== undefined)
            this.isChallenge6 = this.state.lsbe_challenge_6 === "yes" ? true : false;

        // for required
        if (this.state.lsbe_resources_required !== '' && this.state.lsbe_resources_required !== undefined) {
            this.isResourcesRequired = this.state.lsbe_resources_required === "yes" ? true : false;

            this.isWorkbookGirls = this.isSchoolSexGirls && this.isResourcesRequired;
            this.isWorkbookBoys = this.isSchoolSexBoys && this.isResourcesRequired;

            if (!this.isResourcesRequired) {
                this.isWorkbookGirls = false;
                this.isWorkbookBoys = false;
                this.isOtherResources = false;
            }
        }

        if (this.state.other_resource_required_count !== '' && this.state.other_resource_required_count !== undefined) {
            this.isOtherResources = this.state.other_resource_required_count > 0 ? true : false;
            this.isOtherResources ? this.lsbeDependantFields.push("other_resource_required_type") : this.lsbeRequiredFields = this.lsbeRequiredFields.filter(e => e !== "other_resource_required_type");
        }

        // for disrtibuted
        if (this.state.lsbe_resources_delivered !== '' && this.state.lsbe_resources_delivered !== undefined) {
            this.isResourcesRequiredDistribute = this.state.lsbe_resources_delivered === "yes" ? true : false;

            this.isWorkbookGirlsDistribute = this.isSchoolSexGirls && this.isResourcesRequiredDistribute;
            this.isWorkbookBoysDistribute = this.isSchoolSexBoys && this.isResourcesRequiredDistribute;

            if (!this.isResourcesRequiredDistribute) {
                this.isWorkbookGirlsDistribute = false;
                this.isWorkbookBoysDistribute = false;
                this.isOtherResourcesDistribute = false;
            }
        }

        if (this.state.other_resource_delivered_count !== '' && this.state.other_resource_delivered_count !== undefined) {
            this.isOtherResourcesDistribute = this.state.other_resource_delivered_count > 0 ? true : false;
            // other_resource_delivered_type
            this.isOtherResourcesDistribute ? this.lsbeDependantFields.push("other_resource_delivered_type") : this.lsbeRequiredFields = this.lsbeRequiredFields.filter(e => e !== "other_resource_delivered_type");
        }

        if (this.state.lsbe_beyond_guide !== '' && this.state.lsbe_beyond_guide !== undefined) {
            this.isBeyondGuide = this.state.lsbe_beyond_guide === "1" ? true : false;
            this.isBeyondGuide ? this.lsbeDependantFields.push("lsbe_beyond_guide_new") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "lsbe_beyond_guide_new");
        }

        if (this.state.lsbe_timetable_integration !== '' && this.state.lsbe_timetable_integration !== undefined) {
            this.isIntegrated = this.state.lsbe_timetable_integration === "1" ? true : false;
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

        console.log(" ============================================================= ")
        this.resetForm(this.lsbeRequiredFields);
        this.resetForm(this.lsbeDependantFields);
        this.resetForm(this.nonRequiredFields);
    }

    inputChange(e, name) {

        this.setState({
            [name]: e.target.value
        });

        if (name === "date_start") {
            this.setState({ date_start: e.target.value });
        }

        if (name === "lsbe_challenge_1")
            this.isChallenge1 = e.target.id === "yes" ? true : false;
        if (name === "lsbe_challenge_2")
            this.isChallenge2 = e.target.id === "yes" ? true : false;
        if (name === "lsbe_challenge_3")
            this.isChallenge3 = e.target.id === "yes" ? true : false;
        if (name === "lsbe_challenge_4")
            this.isChallenge4 = e.target.id === "yes" ? true : false;
        if (name === "lsbe_challenge_5")
            this.isChallenge5 = e.target.id === "yes" ? true : false;
        if (name === "lsbe_challenge_6")
            this.isChallenge6 = e.target.id === "yes" ? true : false;

        // for required
        if (name === "lsbe_resources_required") {
            this.isResourcesRequired = e.target.id === "yes" ? true : false;
            this.isOtherResources = false;

            this.isWorkbookGirls = this.isSchoolSexGirls && this.isResourcesRequired;
            this.isWorkbookBoys = this.isSchoolSexBoys && this.isResourcesRequired;

            if (!this.isResourcesRequired) {

                this.isWorkbookGirls = false;
                this.isWorkbookBoys = false;
                this.isOtherResources = false;

            }
        }

        if (name === "other_resource_required_count") {
            this.isOtherResources = e.target.value > 0 ? true : false;
            this.isOtherResources ? this.lsbeDependantFields.push("other_resource_required_type") : this.lsbeRequiredFields = this.lsbeRequiredFields.filter(e => e !== "other_resource_required_type");
        }

        // for disrtibuted
        if (name === "lsbe_resources_delivered") {
            this.isResourcesRequiredDistribute = e.target.id === "yes" ? true : false;
            this.isOtherResourcesDistribute = false;

            this.isWorkbookGirlsDistribute = this.isSchoolSexGirls && this.isResourcesRequiredDistribute;
            this.isWorkbookBoysDistribute = this.isSchoolSexBoys && this.isResourcesRequiredDistribute;

            if (!this.isResourcesRequiredDistribute) {

                this.isWorkbookGirlsDistribute = false;
                this.isWorkbookBoysDistribute = false;
                this.isOtherResourcesDistribute = false;
            }
        }

        if (name === "other_resource_delivered_count") {
            this.isOtherResourcesDistribute = e.target.value > 0 ? true : false;
            // other_resource_delivered_type
            this.isOtherResourcesDistribute ? this.lsbeDependantFields.push("other_resource_delivered_type") : this.lsbeRequiredFields = this.lsbeRequiredFields.filter(e => e !== "other_resource_delivered_type");
        }
    }

    // for single select
    valueChange = (e, name) => {
        this.setState({
            [name]: e.target.value
        });

        if (name === "lsbe_level_monitored") {

            this.isLevel1 = e.target.value === "level_1" ? true : false;
            this.isLevel2 = e.target.value === "level_2" ? true : false;
        }

        if (name == "lsbe_class_frequency") {
            this.isClassFrequencyOther = e.target.value === "other" ? true : false;
        }

        if (name === "school_sex") {
            this.isSchoolSexGirls = e.target.value === "girls" ? true : false;
            this.isSchoolSexBoys = e.target.value === "boys" ? true : false;

            this.isWorkbookGirls = this.isSchoolSexGirls && this.isResourcesRequired;
            this.isWorkbookBoys = this.isSchoolSexBoys && this.isResourcesRequired;

            this.isWorkbookGirlsDistribute = this.isSchoolSexGirls && this.isResourcesRequiredDistribute;
            this.isWorkbookBoysDistribute = this.isSchoolSexBoys && this.isResourcesRequiredDistribute;

            this.setState({ class_sex: e.target.value === "girls" ? 'girls' : 'boys' });
        }
    }

    // calculate score from scoring questions (radiobuttons)
    scoreChange = (e, name) => {
        this.setState({
            [name]: e.target.value
        });

        if (name === "lsbe_beyond_guide") {
            this.isBeyondGuide = e.target.id === "yes" ? true : false;
        }

        if (name === "lsbe_timetable_integration") {
            this.isIntegrated = e.target.id === "yes" ? true : false;
        }

        this.isBeyondGuide ? this.lsbeDependantFields.push("lsbe_beyond_guide_new") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "lsbe_beyond_guide_new");

        let indicator = e.target.id;
        let fieldName = e.target.name;
        let value = e.target.value;
        var indicatorCode = getIndicatorCode(indicator);
        this.calculate(indicator, fieldName, value, indicatorCode);
    }

    calculate(indicator, fieldName, value, indicatorValue) {

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

                this.setState({
                    school_name: e.locationName
                })

                let participants = await getParticipantsByLocation(e.uuid);
                if (participants != null && participants.length > 0) {
                    
                    this.setState({
                        participants: participants ,
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

                this.exitTier ? this.lsbeDependantFields.push("lsbe_mt_count") : this.lsbeRequiredFields = this.lsbeRequiredFields.filter(e => e !== "lsbe_mt_count");
                this.exitTier ? this.lsbeDependantFields.push("lsbe_mt_teacher_coordination") : this.lsbeRequiredFields = this.lsbeRequiredFields.filter(e => e !== "lsbe_mt_teacher_coordination");
                this.exitTier ? this.lsbeDependantFields.push("lsbe_mt_conduct_monitoring") : this.lsbeRequiredFields = this.lsbeRequiredFields.filter(e => e !== "lsbe_mt_conduct_monitoring");
                this.exitTier ? this.lsbeDependantFields.push("lsbe_mt_conduct_training") : this.lsbeRequiredFields = this.lsbeRequiredFields.filter(e => e !== "lsbe_mt_conduct_training");
                this.runningTier || this.exitTier ? this.lsbeDependantFields.push("lsbe_beyond_guide") : this.lsbeRequiredFields = this.lsbeRequiredFields.filter(e => e !== "lsbe_beyond_guide");
            }

            if (name === "participant_name") {
                this.setState({ participant_id: e.identifier });
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
            if (obj.attributeType.dataType.toUpperCase() == "DEFINITION" && attrTypeName === "school_tier") {
                // fetch definition shortname
                let definitionId = obj.attributeValue;
                let definition = await getDefinitionByDefinitionId(definitionId);
                attributeValue = definition.definitionName;
                if(self.editMode && (self.state.school_tier !== '' && self.state.school_tier !== undefined) && self.state.school_tier !== attributeValue) {
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
                
                self.setState({ [attrTypeName]: attributeValue });
                self.newTier = attributeValue === "New" ? true : false;
                self.runningTier = attributeValue === "Running" ? true : false;
                self.exitTier = attributeValue === "Exit" ? true : false;
            }
        })
    }

    handleSubmit = async event => {
        event.preventDefault();
        if (this.handleValidation()) {

            console.log("in submission");

            this.setState({
                // form_disabled: true,
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
            // alert(this.state.school_tier);
            if(this.state.school_tier !== "") {
                dataObj.school_tier = this.state.school_tier === "New" ? "school_tier_new" 
                : (this.state.school_tier === "Running" ? "school_tier_running" 
                : (this.state.school_tier === "Exit" ? "school_tier_exit" 
                : ""));
            }

            // for lsbe
            var fields = this.lsbeRequiredFields.concat(this.lsbeDependantFields);
            fields = fields.concat(this.nonRequiredFields);
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

                if (fields[i] === "lsbe_beyond_guide_new") {
                    dataObj.lsbe_beyond_guide_new = {};
                    dataObj.lsbe_beyond_guide_new.values = [];
                    // generating multiselect for lsbe_beyond_guide_new
                    if ((this.state.lsbe_beyond_guide_new != null && this.state.lsbe_beyond_guide_new != undefined)) {
                        for (let i = 0; i < this.state.lsbe_beyond_guide_new.length; i++) {
                            dataObj.lsbe_beyond_guide_new.values.push(String(this.state.lsbe_beyond_guide_new[i].value));
                        }
                    }

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
                    else if (this.lsbeDependantFields.filter(f => f == fields[i]).length == 0) {
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
                                this.resetForm(this.lsbeRequiredFields);
                                this.resetForm(this.lsbeDependantFields);
                                this.resetForm(this.nonRequiredFields);
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
                                    modalText: 'Data saved successfully.',
                                    modal: !this.state.modal
                                });

                                this.resetForm(this.lsbeRequiredFields);
                                this.resetForm(this.lsbeDependantFields);
                                this.resetForm(this.nonRequiredFields);
                            }
                            else if (String(responseData).includes("Error")) {

                                var submitMsg = '';
                                submitMsg = "Unable to submit Form. \
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

        }
    }

    handleValidation() {
        // check each required state

        let formIsValid = true;
        this.setState({ hasError: this.checkValid(this.lsbeRequiredFields, this.lsbeDependantFields) ? false : true });
        formIsValid = this.checkValid(this.lsbeRequiredFields, this.lsbeDependantFields);

        // alert("final output");
        // alert(formIsValid);
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
            if (typeof this.state[stateName] === 'object' && (this.state[stateName].length === 0 || (Object.entries(this.state[stateName]).length === 0 && this.state[stateName].constructor === Object))) {
                isOk = false;
                this.errors[requireds[j]] = errorText;
            }

            // for text and others
            if (typeof this.state[stateName] != 'object') {
                if (this.state[stateName] === "" || this.state[stateName] == undefined) {
                    // alert(stateName + ": value is epmpty");
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
                    if (typeof this.state[stateName] === 'object' && (this.state[stateName].length === 0 || (Object.entries(this.state[stateName]).length === 0 && this.state[stateName].constructor === Object))) {
                        // alert(stateName + ": object is empty");
                        isOk = false;
                        this.errors[dependants[j]] = errorText;
                    }

                    // for text and others
                    if (typeof this.state[stateName] != 'object') {
                        if (this.state[stateName] === "" || this.state[stateName] == undefined) {
                            // alert(stateName + ": value is empty");
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
                    // alert(stateName + ": object is empty");
                    isOk = false;
                    this.errors[dependants[j]] = errorText;
                }

                // for text and others
                if (typeof this.state[stateName] != 'object') {
                    if (this.state[stateName] === "" || this.state[stateName] == undefined) {
                        // alert(stateName + ": value is empty");
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

        this.setState({
            school_tier: ''
        })

        clearCheckedFields();
        this.updateDisplay();
        // this.isOtherResources = false;
        // this.isOtherResourcesDistribute = false;
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
        // const classSexStyle = this.isClassSexCoed ? {} : { display: 'none' };
        const level1Style = this.isLevel1 ? {} : { display: 'none' };
        const level2Style = this.isLevel2 ? {} : { display: 'none' };
        const frequencyOtherStyle = this.isClassFrequencyOther ? {} : { display: 'none' };
        const beyondGuideStyle = this.isBeyondGuide ? {} : { display: 'none' };
        const integratedStyle = this.isIntegrated ? {} : { display: 'none' };
        const challenge1Style = this.isChallenge1 ? {} : { display: 'none' };
        const challenge2Style = this.isChallenge2 ? {} : { display: 'none' };
        const challenge3Style = this.isChallenge3 ? {} : { display: 'none' };
        const challenge4Style = this.isChallenge4 ? {} : { display: 'none' };
        const challenge5Style = this.isChallenge5 ? {} : { display: 'none' };
        const challenge6Style = this.isChallenge6 ? {} : { display: 'none' };
        const workbookGirlsStyle = this.isWorkbookGirls ? {} : { display: 'none' };
        const workbookBoysStyle = this.isWorkbookBoys ? {} : { display: 'none' };
        const otherResourcesRequiredStyle = this.isResourcesRequired ? {} : { display: 'none' };
        const specifyOtherResourcesRequiredStyle = this.isOtherResources ? {} : { display: 'none' };
        const workbookGirlsDistributeStyle = this.isWorkbookGirlsDistribute ? {} : { display: 'none' };
        const workbookBoysDistributeStyle = this.isWorkbookBoysDistribute ? {} : { display: 'none' };
        const otherResourcesDistributeStyle = this.isResourcesRequiredDistribute ? {} : { display: 'none' };
        const specifyOtherResourcesDistributeStyle = this.isOtherResourcesDistribute ? {} : { display: 'none' };
        const exitRunningStyle = this.runningTier || this.exitTier ? {} : { display: 'none' };
        const exitStyle = this.exitTier ? {} : { display: 'none' };
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
                                <Form id="secondaryExit" onSubmit={this.handleSubmit}>
                                    <Row>
                                        <Col md="6">
                                            <Card className="main-card mb-6">
                                                <CardHeader>
                                                    <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                    <b>Secondary Monitoring Form</b>
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
                                                                            <Label for="date_start" >Monitoring Date</Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                            <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => { this.inputChange(e, "date_start") }} max={moment().format("YYYY-MM-DD")} />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_id" >School ID</Label> <span class="errorMessage">{this.state.errors["school_id"]}</span>
                                                                            <Select id="school_id" name="school_id" value={this.state.school_id} onChange={(e) => this.handleChange(e, "school_id")} options={this.state.schools} />
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
                                                                            <Label for="monitor" >Monitored By</Label> <span class="errorMessage">{this.state.errors["monitor"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "monitor")} value={this.state.monitor} id="monitor" options={this.state.monitors} isMulti />
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_sex" >Classification of School by Sex</Label> <span class="errorMessage">{this.state.errors["school_sex"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "school_sex")} value={this.state.school_sex} name="school_sex" id="school_sex">
                                                                                <option value="girls">Girls</option>
                                                                                <option value="boys">Boys</option>
                                                                                <option value="coed">Co-ed</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="6" >
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
                                                                            <Label for="participant_name" >Name of Teacher</Label> <span class="errorMessage">{this.state.errors["participant_name"]}</span>
                                                                            <Select id="participant_name" name="participant_name" value={this.state.participant_name} onChange={(e) => this.handleChange(e, "participant_name")} options={this.state.participants} />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="participant_id" >Teacher ID</Label>  <span class="errorMessage">{this.state.errors["participant_id"]}</span>
                                                                            <Input name="participant_id" id="participant_id" value={this.state.participant_id} disabled />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="secondary_grade" >Class</Label> <span class="errorMessage">{this.state.errors["secondary_grade"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "secondary_grade")} value={this.state.secondary_grade} name="secondary_grade" id="secondary_grade">
                                                                                <option value="six">6</option>
                                                                                <option value="seven">7</option>
                                                                                <option value="eight">8</option>
                                                                                <option value="nine">9</option>
                                                                                <option value="ten">10</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="class_students" >Number of Students in Class</Label> <span class="errorMessage">{this.state.errors["class_students"]}</span>
                                                                            <Input type="number" name="class_students" id="class_students" value={this.state.class_students} onChange={(e) => { this.inputChange(e, "class_students") }} onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2) }} max="99" min="1" />
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="class_duration" >Time duration of class in minutes</Label>  <span class="errorMessage">{this.state.errors["class_duration"]}</span>
                                                                            <Input type="number" name="class_duration" id="class_duration" value={this.state.class_duration} onChange={(e) => { this.inputChange(e, "class_duration") }} onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} max="999" min="1" />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                            </TabPane>
                                                            <TabPane tabId="2" id="lsbe">
                                                                <Row>
                                                                    <Col md="6">
                                                                        <Label><h6><u><b>LSBE Program</b></u></h6></Label>
                                                                    </Col>

                                                                </Row>
                                                                <Row></Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_level_monitored" >LSBE Level</Label> <span class="errorMessage">{this.state.errors["lsbe_level_monitored"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_level_monitored")} value={this.state.lsbe_level_monitored} name="lsbe_level_monitored" id="lsbe_level_monitored" disabled={this.editMode}>

                                                                                <option value="level_1">Level 1</option>
                                                                                <option value="level_2">Level 2</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="6" style={level1Style}>
                                                                        <FormGroup >
                                                                            <Label for="lsbe_level_1" >LSBE Chapter - Level 1</Label> <span class="errorMessage">{this.state.errors["lsbe_level_1"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_level_1")} value={this.state.lsbe_level_1} name="lsbe_level_1" id="lsbe_level_1" >
                                                                                <option value="self_awareness">Self-Awareness</option>
                                                                                <option value="communication">Communication</option>
                                                                                <option value="feelings">Feelings</option>
                                                                                <option value="values">Values</option>
                                                                                <option value="human_rights">Human Rights</option>
                                                                                <option value="gender">Gender</option>
                                                                                <option value="self_protection">Self-Protection</option>
                                                                                <option value="health">Health</option>
                                                                                <option value="peer_pressure">Peer Pressure</option>
                                                                                <option value="healthy_diet">Healthy Diet</option>
                                                                                <option value="puberty">Puberty</option>
                                                                                <option value="going_to_doctor">Going to the Doctor</option>
                                                                                <option value="decision_making">Decision Making</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={level2Style}>
                                                                        <FormGroup >
                                                                            <Label for="lsbe_level_2" >LSBE Chapter - Level 2</Label> <span class="errorMessage">{this.state.errors["lsbe_level_2"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_level_2")} value={this.state.lsbe_level_2} name="lsbe_level_2" id="lsbe_level_2" >

                                                                                <option value="human_rights">Human Rights</option>
                                                                                <option value="effective_communication">Effective Communication</option>
                                                                                <option value="gender_equality">Gender Equality</option>
                                                                                <option value="puberty">Puberty</option>
                                                                                <option value="decision_making">Decision Making</option>
                                                                                <option value="substance_abuse">Substance Abuse</option>
                                                                                <option value="youth_family">Youth and Family (Marriage)</option>
                                                                                <option value="maternal_child_health">Maternal and Child Health</option>
                                                                                <option value="hepatitis">Hepatitis</option>
                                                                                <option value="hiv">HIV</option>
                                                                                <option value="violence">Violence</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_chapter_revision" >Revision or First time chapter is being taught</Label> <span class="errorMessage">{this.state.errors["lsbe_chapter_revision"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_chapter_revision")} value={this.state.lsbe_chapter_revision} name="lsbe_chapter_revision" id="lsbe_chapter_revision" >
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
                                                                            <Label for="lsbe_prompts" >The teacher is actively using the teacher’s guide to aid in facilitation of content</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_prompts" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_prompts")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_prompts" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_prompts")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_prompts" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_prompts")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_prompts" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_prompts")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_prompts" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_prompts")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_prompts"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_chapter_objective" >The teacher is clearly relaying the main messages of the chapter, even if they are not actively using the teacher’s guide</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_chapter_objective" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_chapter_objective")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_chapter_objective" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_chapter_objective")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_chapter_objective" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_chapter_objective")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_chapter_objective" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_chapter_objective")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_chapter_objective" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_chapter_objective")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_chapter_objective"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_teacher_understanding" >The teacher demonstrates good understanding of the LSBE content</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_teacher_understanding" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_teacher_understanding")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_teacher_understanding" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_teacher_understanding")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_teacher_understanding" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_teacher_understanding")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_teacher_understanding" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_teacher_understanding")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_teacher_understanding" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_teacher_understanding")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_teacher_understanding"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_material_preparation" >The teacher had all materials prepared in advance for the class</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_material_preparation" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_material_preparation")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_material_preparation" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_material_preparation")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_material_preparation" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_material_preparation")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_material_preparation" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_material_preparation")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_material_preparation" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_material_preparation")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_material_preparation"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_teacher_preparation" >The teacher was well prepared to facilitate the session</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_teacher_preparation" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_teacher_preparation")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_teacher_preparation" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_teacher_preparation")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_teacher_preparation" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_teacher_preparation")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_teacher_preparation" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_teacher_preparation")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_teacher_preparation" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_teacher_preparation")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_teacher_preparation"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>



                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_activity_time_allotment" >An appropriate amount of time is allotted to each activity and topic</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_activity_time_allotment" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_activity_time_allotment")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_activity_time_allotment" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_activity_time_allotment")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_activity_time_allotment" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_activity_time_allotment")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_activity_time_allotment" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_activity_time_allotment")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_activity_time_allotment" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_activity_time_allotment")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_activity_time_allotment"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={exitRunningStyle}>
                                                                        <FormGroup >
                                                                            <Label for="lsbe_beyond_guide" >Teacher has gone beyond the teacher’s guide to build on and/or develop new activities</Label>
                                                                            <FormGroup tag="fieldset" row>

                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_beyond_guide" id="yes" value="1" onChange={(e) => this.scoreChange(e, "lsbe_beyond_guide")} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_beyond_guide" id="no" value="0" onChange={(e) => this.scoreChange(e, "lsbe_beyond_guide")} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_beyond_guide"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="8" style={beyondGuideStyle}>
                                                                        <FormGroup >
                                                                            <Label for="lsbe_beyond_guide_new" >What has the teacher done that is new?</Label> <span class="errorMessage">{this.state.errors["lsbe_beyond_guide_new"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "lsbe_beyond_guide_new")} value={this.state.lsbe_beyond_guide_new} id="lsbe_beyond_guide_new" options={new_activities_options} isMulti />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_subject_comfort" >The teacher is comfortable speaking about this subject</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_subject_comfort" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_subject_comfort")} />{' '}
                                                                                            Strongly Disagree
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_subject_comfort" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_subject_comfort")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_subject_comfort" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_subject_comfort")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_subject_comfort" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_subject_comfort")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_subject_comfort" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_subject_comfort")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_subject_comfort"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_nonjudmental_tone" >The teacher uses a non-judgmental tone while facilitating the session</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_nonjudmental_tone" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_nonjudmental_tone")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_nonjudmental_tone" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_nonjudmental_tone")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_nonjudmental_tone" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_nonjudmental_tone")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_nonjudmental_tone" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_nonjudmental_tone")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_nonjudmental_tone" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_nonjudmental_tone")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_nonjudmental_tone"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_impartial_opinions" >The teacher is not imposing their own values or opinions on the participants</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_impartial_opinions" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_impartial_opinions")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_impartial_opinions" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_impartial_opinions")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_impartial_opinions" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_impartial_opinions")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_impartial_opinions" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_impartial_opinions")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_impartial_opinions" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_impartial_opinions")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_impartial_opinions"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_discussion_probes" >The teacher is engaging participants in discussion throughout session by providing probes</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_discussion_probes" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_discussion_probes")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_discussion_probes" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_discussion_probes")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_discussion_probes" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_discussion_probes")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_discussion_probes" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_discussion_probes")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_discussion_probes" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_discussion_probes")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_discussion_probes"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_student_understanding" >Students demonstrate clear understanding of the main messages of the chapter</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_student_understanding" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_student_understanding")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_student_understanding" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_student_understanding")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_student_understanding" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_student_understanding")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_student_understanding" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_student_understanding")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_student_understanding" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_student_understanding")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_student_understanding"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_student_engagement" >Students are actively participating in discussion on the chapter</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_student_engagement" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_student_engagement")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_student_engagement" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_student_engagement")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_student_engagement" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_student_engagement")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_student_engagement" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_student_engagement")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_student_engagement" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_student_engagement")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_student_engagement"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_student_attention" >Students are actively paying attention to the class while the teacher is instructing</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_student_attention" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_student_attention")} />{' '}
                                                                                            Strongly Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_student_attention" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_student_attention")} />{' '}
                                                                                            Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_student_attention" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_student_attention")} />{' '}
                                                                                            Neither Agree nor Disagree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_student_attention" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_student_attention")} />{' '}
                                                                                            Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_student_attention" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_student_attention")} />{' '}
                                                                                            Strongly Agree
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_student_attention"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="facilitation_score" style={{ color: "green" }}><b>Facilitation Score</b></Label>
                                                                            <Input value={this.state.facilitation_score} name="facilitation_score" id="facilitation_score" onChange={(e) => { this.inputChange(e, "facilitation_score") }} ></Input>
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
                                                                            <Label for="lsbe_timetable_integration" >Management has integrated the LSBE program into the school timetable</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_timetable_integration" id="yes" value="1" onChange={(e) => this.scoreChange(e, "lsbe_timetable_integration")} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_timetable_integration" id="no" value="0" onChange={(e) => this.scoreChange(e, "lsbe_timetable_integration")} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_timetable_integration"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={integratedStyle}>
                                                                        <FormGroup >
                                                                            <Label for="lsbe_class_frequency" >Frequency of class in time table</Label> <span class="errorMessage">{this.state.errors["lsbe_class_frequency"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_class_frequency")} value={this.state.lsbe_class_frequency} name="lsbe_class_frequency" id="lsbe_class_frequency">
                                                                                <option value="weekly">Weekly</option>
                                                                                <option value="biweekly">Biweekly</option>
                                                                                <option value="monthly">Monthly</option>
                                                                                <option value="other">Other</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={frequencyOtherStyle}>
                                                                        <FormGroup >
                                                                            <Label for="lsbe_class_frequency_other" >If other, please specify</Label>  <span class="errorMessage">{this.state.errors["lsbe_class_frequency_other"]}</span>
                                                                            <Input value={this.state.lsbe_class_frequency_other} name="lsbe_class_frequency_other" id="lsbe_class_frequency_other" onChange={(e) => { this.inputChange(e, "lsbe_class_frequency_other") }} ></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_two_teacher_assigned" >There are at least 2 teachers assigned to teach the LSBE program</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_two_teacher_assigned" id="yes" value="1" onChange={(e) => this.scoreChange(e, "lsbe_two_teacher_assigned")} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_two_teacher_assigned" id="no" value="0" onChange={(e) => this.scoreChange(e, "lsbe_two_teacher_assigned")} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_two_teacher_assigned"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_teacher_mgmt_coordination" >There is excellent coordination between management and teachers regarding the LSBE program</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_teacher_mgmt_coordination" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_teacher_mgmt_coordination")} />{' '}
                                                                                            {stronglyDisagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_teacher_mgmt_coordination" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_teacher_mgmt_coordination")} />{' '}
                                                                                            {disagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_teacher_mgmt_coordination" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_teacher_mgmt_coordination")} />{' '}
                                                                                            {neither}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_teacher_mgmt_coordination" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_teacher_mgmt_coordination")} />{' '}
                                                                                            {agree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_teacher_mgmt_coordination" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_teacher_mgmt_coordination")} />{' '}
                                                                                            {stronglyAgree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_teacher_mgmt_coordination"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="8" style={exitStyle}>
                                                                        <FormGroup>
                                                                            <Label for="lsbe_mt_count">Number of Master Trainers leading LSBE program</Label> <span class="errorMessage">{this.state.errors["lsbe_mt_count"]}</span>
                                                                            <Input type="number" value={this.state.lsbe_mt_count} name="lsbe_mt_count" id="lsbe_mt_count" onChange={(e) => { this.inputChange(e, "lsbe_mt_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2) }} placeholder="Enter in number"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={exitStyle}>
                                                                        <FormGroup >
                                                                            <Label for="lsbe_mt_teacher_coordination" >There is excellent coordination between Master Trainers and teachers regarding the LSBE program</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_mt_teacher_coordination" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_mt_teacher_coordination")} />{' '}
                                                                                            {stronglyDisagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_mt_teacher_coordination" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_mt_teacher_coordination")} />{' '}
                                                                                            {disagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_mt_teacher_coordination" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_mt_teacher_coordination")} />{' '}
                                                                                            {neither}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_mt_teacher_coordination" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_mt_teacher_coordination")} />{' '}
                                                                                            {agree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_mt_teacher_coordination" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_mt_teacher_coordination")} />{' '}
                                                                                            {stronglyAgree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_mt_teacher_coordination"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={exitStyle}>
                                                                        <FormGroup >
                                                                            <Label for="lsbe_mt_conduct_monitoring" >Master Trainers conduct regular monitoring sessions to maintain quality of LSBE program</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_mt_conduct_monitoring" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_mt_conduct_monitoring")} />{' '}
                                                                                            {stronglyDisagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_mt_conduct_monitoring" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_mt_conduct_monitoring")} />{' '}
                                                                                            {disagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_mt_conduct_monitoring" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_mt_conduct_monitoring")} />{' '}
                                                                                            {neither}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_mt_conduct_monitoring" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_mt_conduct_monitoring")} />{' '}
                                                                                            {agree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_mt_conduct_monitoring" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_mt_conduct_monitoring")} />{' '}
                                                                                            {stronglyAgree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_mt_conduct_monitoring"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12" style={exitStyle}>
                                                                        <FormGroup >
                                                                            <Label for="lsbe_mt_conduct_training" >Master Trainers arrange and conduct refresher trainings as needed for LSBE teachers</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_mt_conduct_training" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_mt_conduct_training")} />{' '}
                                                                                            {stronglyDisagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_mt_conduct_training" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_mt_conduct_training")} />{' '}
                                                                                            {disagree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_mt_conduct_training" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_mt_conduct_training")} />{' '}
                                                                                            {neither}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_mt_conduct_training" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_mt_conduct_training")} />{' '}
                                                                                            {agree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_mt_conduct_training" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_mt_conduct_training")} />{' '}
                                                                                            {stronglyAgree}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_mt_conduct_training"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup className="monitoringScoreBox">
                                                                            <Label for="management_score" style={{ color: "green" }}><b>Management Score</b></Label>
                                                                            <Input value={this.state.management_score} name="management_score" id="management_score" onChange={(e) => { this.inputChange(e, "management_score") }} ></Input>
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
                                                                            <Input value={this.state.monitoring_score} name="monitoring_score" id="monitoring_score" onChange={(e) => { this.inputChange(e, "monitoring_score") }} ></Input>
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
                                                                    <Col md="6" >
                                                                        <FormGroup >
                                                                            <Label for="lsbe_challenge_1" >The school is facing challenges scheduling the LSBE class</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_challenge_1" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "lsbe_challenge_1") }} />{' '}
                                                                                            {yes}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_challenge_1" id="no" value="no" onChange={(e) => { this.inputChange(e, "lsbe_challenge_1") }} />{' '}
                                                                                            {no}
                                                                                        </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_challenge_1"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    {/* </Row> */}

                                                                    {/* <Row> */}
                                                                    <Col md="6" style={challenge1Style}>
                                                                        <FormGroup >
                                                                            <Label for="lsbe_challenge_1_status" >Status of Challenge</Label>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_challenge_1_status")} value={this.state.lsbe_challenge_1_status} name="lsbe_challenge_1_status" id="lsbe_challenge_1_status">
                                                                                <option value="resolved">Resolved</option>
                                                                                <option value="unresolved">Unresolved</option>
                                                                            </Input><span class="errorMessage">{this.state.errors["lsbe_challenge_1_status"]}</span>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_challenge_2" >There are not enough resources</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_challenge_2" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "lsbe_challenge_2") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_challenge_2" id="no" value="no" onChange={(e) => { this.inputChange(e, "lsbe_challenge_2") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_challenge_2"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={challenge2Style}>
                                                                        <FormGroup >
                                                                            <Label for="lsbe_challenge_2_status" >Status of Challenge</Label>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_challenge_2_status")} value={this.state.lsbe_challenge_2_status} name="lsbe_challenge_2_status" id="lsbe_challenge_2_status">
                                                                                <option value="resolved">Resolved</option>
                                                                                <option value="unresolved">Unresolved</option>
                                                                            </Input><span class="errorMessage">{this.state.errors["lsbe_challenge_2_status"]}</span>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>


                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_challenge_3" >There is no room for the class</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_challenge_3" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "lsbe_challenge_3") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_challenge_3" id="no" value="no" onChange={(e) => { this.inputChange(e, "lsbe_challenge_3") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_challenge_3"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={challenge3Style}>
                                                                        <FormGroup >
                                                                            <Label for="lsbe_challenge_3_status" >Status of Challenge</Label>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_challenge_3_status")} value={this.state.lsbe_challenge_3_status} name="lsbe_challenge_3_status" id="lsbe_challenge_3_status">
                                                                                <option value="resolved">Resolved</option>
                                                                                <option value="unresolved">Unresolved</option>
                                                                            </Input><span class="errorMessage">{this.state.errors["lsbe_challenge_3_status"]}</span>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_challenge_4" >There are not enough teachers to teach the LSBE class</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_challenge_4" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "lsbe_challenge_4") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_challenge_4" id="no" value="no" onChange={(e) => { this.inputChange(e, "lsbe_challenge_4") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_challenge_4"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={challenge4Style}>
                                                                        <FormGroup >
                                                                            <Label for="lsbe_challenge_4_status" >Status of Challenge</Label>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_challenge_4_status")} value={this.state.lsbe_challenge_4_status} name="lsbe_challenge_4_status" id="lsbe_challenge_4_status">
                                                                                <option value="resolved">Resolved</option>
                                                                                <option value="unresolved">Unresolved</option>
                                                                            </Input> <span class="errorMessage">{this.state.errors["lsbe_challenge_4_status"]}</span>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_challenge_5" >The content is irrelevant for the context of the students</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_challenge_5" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "lsbe_challenge_5") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_challenge_5" id="no" value="no" onChange={(e) => { this.inputChange(e, "lsbe_challenge_5") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_challenge_5"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={challenge5Style}>
                                                                        <FormGroup >
                                                                            <Label for="lsbe_challenge_5_status" >Status of Challenge</Label>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_challenge_5_status")} value={this.state.lsbe_challenge_5_status} name="lsbe_challenge_5_status" id="lsbe_challenge_5_status">
                                                                                <option value="resolved">Resolved</option>
                                                                                <option value="unresolved">Unresolved</option>
                                                                            </Input> <span class="errorMessage">{this.state.errors["lsbe_challenge_5_status"]}</span>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" >
                                                                        <FormGroup >
                                                                            <Label for="lsbe_challenge_6" >Students are not interested in the content</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_challenge_6" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "lsbe_challenge_6") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_challenge_6" id="no" value="no" onChange={(e) => { this.inputChange(e, "lsbe_challenge_6") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_challenge_6"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6" style={challenge6Style}>
                                                                        <FormGroup >
                                                                            <Label for="lsbe_challenge_6_status" >Status of Challenge</Label>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_challenge_6_status")} value={this.state.lsbe_challenge_6_status} name="lsbe_challenge_6_status" id="lsbe_challenge_6_status">
                                                                                <option value="resolved">Resolved</option>
                                                                                <option value="unresolved">Unresolved</option>
                                                                            </Input> <span class="errorMessage">{this.state.errors["lsbe_challenge_6_status"]}</span>
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
                                                                            <Label for="lsbe_resources_required">Does this school require any resources?</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_resources_required" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "lsbe_resources_required") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_resources_required" id="no" value="no" onChange={(e) => { this.inputChange(e, "lsbe_resources_required") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_resources_required"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={workbookGirlsStyle}>
                                                                        <FormGroup >
                                                                            <Label for="wb1_girls_required_count" >Workbook Level 1 – Girls</Label>  <span class="errorMessage">{this.state.errors["wb1_girls_required_count"]}</span>
                                                                            <Input type="number" value={this.state.wb1_girls_required_count} name="wb1_girls_required_count" id="wb1_girls_required_count" onChange={(e) => { this.inputChange(e, "wb1_girls_required_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup style={workbookBoysStyle}>
                                                                            <Label for="wb1_boys_required_count" >Workbook Level 1 – Boys</Label>  <span class="errorMessage">{this.state.errors["wb1_boys_required_count"]}</span>
                                                                            <Input type="number" value={this.state.wb1_boys_required_count} name="wb1_boys_required_count" id="wb1_boys_required_count" onChange={(e) => { this.inputChange(e, "wb1_boys_required_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>

                                                                    <Col md="6" style={workbookGirlsStyle}>
                                                                        <FormGroup >
                                                                            <Label for="wb2_girls_required_count" >Workbook Level 2 – Girls</Label> <span class="errorMessage">{this.state.errors["wb2_girls_required_count"]}</span>
                                                                            <Input type="number" value={this.state.wb2_girls_required_count} name="wb2_girls_required_count" id="wb2_girls_required_count" onChange={(e) => { this.inputChange(e, "wb2_girls_required_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={workbookBoysStyle}>
                                                                        <FormGroup >
                                                                            <Label for="wb2_boys_required_count" >Workbook Level 2 – Boys</Label> <span class="errorMessage">{this.state.errors["wb2_boys_required_count"]}</span>
                                                                            <Input type="number" value={this.state.wb2_boys_required_count} name="wb2_boys_required_count" id="wb2_boys_required_count" onChange={(e) => { this.inputChange(e, "wb2_boys_required_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>


                                                                <Row>
                                                                    <Col md="6" style={otherResourcesRequiredStyle}>
                                                                        <FormGroup >
                                                                            <Label for="other_resource_required_count" >Other Resource</Label>  <span class="errorMessage">{this.state.errors["other_resource_required_count"]}</span>
                                                                            <Input type="number" value={this.state.other_resource_required_count} name="other_resource_required_count" id="other_resource_required_count" onChange={(e) => { this.inputChange(e, "other_resource_required_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>
                                                                <Row>

                                                                    <Col md="12" style={specifyOtherResourcesRequiredStyle}>
                                                                        <FormGroup >
                                                                            <Label for="other_resource_required_type" >Specify other type of resource</Label> <span class="errorMessage">{this.state.errors["other_resource_required_type"]}</span>
                                                                            <Input value={this.state.other_resource_required_type} name="other_resource_required_type" id="other_resource_required_type" onChange={(e) => { this.inputChange(e, "other_resource_required_type") }} max="999" min="1" placeholder="Enter other type of resource"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>


                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="lsbe_resources_delivered">Were any resources distributed to this school in this visit?</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_resources_delivered" id="yes" value="yes" onChange={(e) => { this.inputChange(e, "lsbe_resources_delivered") }} />{' '}
                                                                                            Yes
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                        <Label check>
                                                                                            <Input type="radio" name="lsbe_resources_delivered" id="no" value="no" onChange={(e) => { this.inputChange(e, "lsbe_resources_delivered") }} />{' '}
                                                                                            No
                                                                                </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["lsbe_resources_delivered"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={workbookGirlsDistributeStyle}>
                                                                        <FormGroup >
                                                                            <Label for="wb1_girls_delivered_count" >Workbook Level 1 – Girls</Label>  <span class="errorMessage">{this.state.errors["wb1_girls_delivered_count"]}</span>
                                                                            <Input type="number" value={this.state.wb1_girls_delivered_count} name="wb1_girls_delivered_count" id="wb1_girls_delivered_count" onChange={(e) => { this.inputChange(e, "wb1_girls_delivered_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={workbookBoysDistributeStyle}>
                                                                        <FormGroup >
                                                                            <Label for="wb1_boys_delivered_count" >Workbook Level 1 – Boys</Label>  <span class="errorMessage">{this.state.errors["wb1_boys_delivered_count"]}</span>
                                                                            <Input type="number" value={this.state.wb1_boys_delivered_count} name="wb1_boys_delivered_count" id="wb1_boys_delivered_count" onChange={(e) => { this.inputChange(e, "wb1_boys_delivered_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={workbookGirlsDistributeStyle}>
                                                                        <FormGroup >
                                                                            <Label for="wb2_girls_delivered_count" >Workbook Level 2 – Girls</Label> <span class="errorMessage">{this.state.errors["wb2_girls_delivered_count"]}</span>
                                                                            <Input type="number" value={this.state.wb2_girls_delivered_count} name="wb2_girls_delivered_count" id="wb2_girls_delivered_count" onChange={(e) => { this.inputChange(e, "wb2_girls_delivered_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={workbookBoysDistributeStyle}>
                                                                        <FormGroup >
                                                                            <Label for="wb2_boys_delivered_count" >Workbook Level 2 – Boys</Label> <span class="errorMessage">{this.state.errors["wb2_boys_delivered_count"]}</span>
                                                                            <Input type="number" value={this.state.wb2_boys_delivered_count} name="wb2_boys_delivered_count" id="wb2_boys_delivered_count" onChange={(e) => { this.inputChange(e, "wb2_boys_delivered_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6" style={otherResourcesDistributeStyle}>
                                                                        <FormGroup >
                                                                            <Label for="other_resource_delivered_count" >Other Resource</Label>  <span class="errorMessage">{this.state.errors["other_resource_delivered_count"]}</span>
                                                                            <Input type="number" value={this.state.other_resource_delivered_count} name="other_resource_delivered_count" id="other_resource_delivered_count" onChange={(e) => { this.inputChange(e, "other_resource_delivered_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="12" style={specifyOtherResourcesDistributeStyle}>
                                                                        <FormGroup >
                                                                            <Label for="other_resource_delivered_type" >Specify other type of resource</Label> <span class="errorMessage">{this.state.errors["other_resource_delivered_type"]}</span>
                                                                            <Input value={this.state.other_resource_delivered_type} name="other_resource_delivered_type" id="other_resource_delivered_type" onChange={(e) => { this.inputChange(e, "other_resource_delivered_type") }} placeholder="Enter other type of resource"></Input>
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
                                                                <Button color="secondary" id="page_csa_a"
                                                                    className={"btn-shadow " + classnames({ active: this.state.activeTab === '2' })}
                                                                    onClick={() => {
                                                                        this.toggleTab('2');
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
                                                            <Button className="mb-2 mr-2" color="success" size="sm" type="submit">Submit<MDBIcon icon="smile" className="ml-2" size="lg" /></Button>
                                                            <Button className="mb-2 mr-2" color="danger" size="sm" onClick={this.cancelCheck} >Clear<MDBIcon icon="window-close" className="ml-2" size="lg" /></Button>
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

export default SecondaryMonitoring;