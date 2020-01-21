/*
 * @Author: tahira.niazi@ihsinformatics.com 
 * @Date: 2019-07-30 12:53:25 
 * @Last Modified by: tahira.niazi@ihsinformatics.com
 * @Last Modified time: 2020-01-21 13:34:39
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
import { getAllProjects, getDefinitionByDefinitionId, getDefinitionId, getDefinitionsByDefinitionType, getLocationAttributeTypeByShortName, getLocationByRegexValue, getLocationsByCategory, getProjectByRegexValue } from '../service/GetService';
import { saveLocation, updateLocation } from "../service/PostService";
import { parentLocationDefinitionUuid } from "../util/AahungUtil.js";
import { getDistrictByValue, getDistrictsByProvince, getProvinceByValue, location } from "../util/LocationUtil.js";
import FormNavBar from "../widget/FormNavBar";
import LoadingIndicator from "../widget/LoadingIndicator";

const programsImplemented = [  /* value represents short names */
    { label: 'CSA', value: 'csa' },
    { label: 'Gender', value: 'gender' },
    { label: 'LSBE', value: 'lsbe' }
];

const formatOptionLabel = ({ label, donorName }) => (
    <div style={{ display: "flex" }}>
        <div>{label} |</div>
        <div style={{ marginLeft: "10px", color: "#0d47a1" }}>
            {donorName}
        </div>
    </div>
);

class SchoolDetails extends React.Component {

    modal = false;
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            organizations: [],
            projectsList: [],
            projects: [],
            school_id: '',
            program_implemented: [],
            school_tier: 'school_tier_new',
            school_type: 'school_public',
            school_sex: 'girls',
            school_category_new: 'school_new_inducted',
            school_category_exit: 'school_exit_initial_phase',
            school_category_running: 'school_running_low',
            school_level_shortname: '',
            activeTab: '1',
            partnership_years: '',
            point_person_contact: '',
            selectedOption: null,
            page2Show: true,
            isView: false,
            errors: {},
            loading: false,
            modal: false,
            modalText: '',
            okButtonStyle: {},
            modalHeading: '',
        };

        // fields for loading data in components
        // this.organizations = [];

        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.inputChange = this.inputChange.bind(this);

        this.viewMode = false;
        this.editMode = false;
        this.isTierNew = true;
        this.isTierRunning = false;
        this.isTierExit = false;
        this.schoolId = '';
        this.formatOptionLabel = '';
        this.errors = {};
        this.partnership_years = '';
        this.isSecondary = false;
        this.isPrimary = false;
        this.isExtension = false;
        this.isCoed = false;
        this.fetchedLocation = {};
        this.selectedProjects = [];
        this.requiredFields = ["province", "district", "parent_organization_id", "school_name", "partnership_start_date", "program_implemented", "school_level", "point_person_name", "point_person_contact", "student_count"];
    }

    componentDidMount() {
        // this.cancelCheck = this.cancelCheck.bind(this);
        window.addEventListener('beforeunload', this.beforeunload.bind(this));

        this.loadData();
    }

    componentWillUnmount() {

        window.removeEventListener('beforeunload', this.beforeunload.bind(this));
    }

    beforeunload(e) {
        // if (this.props.dataUnsaved) {
        e.preventDefault();
        e.returnValue = true;
        // }
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
            let organizations = await getLocationsByCategory(parentLocationDefinitionUuid);
            if (organizations != null && organizations.length > 0) {
                this.setState({
                    organizations: organizations
                })
            }

            // projects
            let projects = await getAllProjects();
            if (projects != null && projects.length > 0) {
                this.setState({
                    projectsList: projects
                })
            }

            if (this.editMode) {

                this.fetchedLocation = await getLocationByRegexValue(String(this.props.location.state.locationId));
                if(this.fetchedLocation !== null) {
                    console.log("fetched location id is .................................");
                    console.log(this.fetchedLocation.locationId);
                    this.schoolId = this.fetchedLocation.shortName;
                    var province = this.fetchedLocation.stateProvince !== null ? getProvinceByValue(this.fetchedLocation.stateProvince) : {};
                    var district = this.fetchedLocation.cityVillage !== null ? getDistrictByValue(this.fetchedLocation.cityVillage) : {};
                    this.setState({
                        school_name: this.fetchedLocation.locationName,
                        province: { "value": province.value, "label": province.label },
                        district: { "value": district.value, "label": district.label }

                    })
                    var fetchedParent = this.fetchedLocation.parentLocation;
                    var parent = {};
                    if (fetchedParent != undefined || fetchedParent != null) {
                        parent = { "id": fetchedParent.locationId, "value": fetchedParent.locationName, "uuid": fetchedParent.uuid, "shortName": fetchedParent.shortName, "label": fetchedParent.shortName }
                        this.setState({
                            parent_organization_id: parent,
                            parent_organization_name: fetchedParent.locationName
                        })
                    }

                    this.setState({
                        point_person_name: this.fetchedLocation.primaryContactPerson,
                        point_person_contact: this.fetchedLocation.primaryContact
                    })

                    if (this.fetchedLocation.email !== undefined && this.fetchedLocation.email !== '') {
                        this.setState({
                            point_person_email: this.fetchedLocation.email
                        })
                    }
                    if (this.fetchedLocation.extension !== undefined && this.fetchedLocation.extension !== '') {
                        this.isExtension = true;
                        this.setState({
                            extension: this.fetchedLocation.extension
                        })
                    }
                    this.autopopulateFields(this.fetchedLocation.attributes);
                }
                else {
                    throw new Error("Unable to get school details. Please see error logs for more details.");
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
            if (attrTypeName === "partnership_years") {
                attributeValue = obj.attributeValue;
            }

            if (obj.attributeType.dataType.toUpperCase() != "JSON" || obj.attributeType.dataType.toUpperCase() != "DEFINITION") {
                attributeValue = obj.attributeValue;
            }

            if (obj.attributeType.dataType.toUpperCase() == "DEFINITION") {
                // fetch definition shortname
                let definitionId = obj.attributeValue;
                let definition = await getDefinitionByDefinitionId(definitionId);
                let attrValue = definition.shortName;
                attributeValue = attrValue;
                if (attrTypeName === "school_tier") {
                    document.getElementById(attrTypeName).value = attributeValue;
                    self.setState({
                        school_tier: attributeValue
                    })
                    if (attributeValue === "school_tier_new") {
                        self.isTierNew = true;
                        self.isTierRunning = false;
                        self.isTierExit = false;
                    }
                    else if (attributeValue === "school_tier_running") {
                        self.isTierNew = false;
                        self.isTierRunning = true;
                        self.isTierExit = false;
                    }
                    else if (attributeValue === "school_tier_exit") {
                        self.isTierNew = false;
                        self.isTierRunning = false;
                        self.isTierExit = true;
                    }
                }
                if (attrTypeName === "school_level") {
                    self.state.school_level_shortname = attributeValue; // will be used for saving school_level later
                    document.getElementById('school_level_secondary').checked = attributeValue === "school_level_secondary";
                    document.getElementById('school_level_primary').checked = attributeValue === "school_level_primary";
                }

                if (attrTypeName === "school_sex") {
                    self.setState({
                        school_sex: attributeValue,
                    })
                    self.isCoed = attributeValue === "coed" ? true : false;
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
                            arr.push({ label: definitionArr[0].definitionName, value: definitionArr[0].shortName })
                        })
                    }

                    if ('projectId' in attrValueObj[0]) {

                        attrValueObj.forEach(async function (obj) {
                            // definitionArr contains only one item because filter will return only one definition)
                            let projectObj = await getProjectByRegexValue(String(obj.projectId), false);
                            arr.push({ id: projectObj.projectId, label: projectObj.shortName, value: projectObj.shortName, donorName: projectObj.donor === undefined ? "" : projectObj.donor.donorName });
                        })
                    }

                    if (attrTypeName === "program_implemented") {
                        self.setState({
                            [attrTypeName]: arr
                        })
                    }
                    if (attrTypeName === "projects") {

                        console.log(arr);
                        // self.setState({
                        //     [attrTypeName]: arr
                        // })

                        console.log("============= in projects =================");
                        console.log(arr);
                        self.setState({
                            projects: arr
                        })

                        self.selectedProjects = arr;

                        console.log("project state changed");
                        console.log(self.state.projects);

                        self.setState({
                            hasError: false
                        })

                    }
                }
                // attributeValue = multiSelectString;
                self.setState({
                    [attrTypeName]: arr
                })
                return;
            }

            if (attrTypeName != "program_implemented" && attrTypeName != "school_tier" && attrTypeName != "projects")
                self.setState({ [attrTypeName]: attributeValue });

        })

    }

    cancelCheck = async () => {
        // clearing form
        this.resetForm(this.requiredFields);
    }

    // for single select
    valueChange = (e, name) => {
        console.log(e);
        console.log(e.target.value);

        this.setState({
            [name]: e.target.value
        });

        if (name === "school_level") {

            this.state.school_level_shortname = e.target.id;

            e.target.id === "school_level_secondary" ? this.setState({
                // Autoselect program_implemented = LSBE
                program_implemented: [{ value: 'lsbe', label: 'LSBE' }]
            }) : this.setState({
                program_implemented: []
            });
        }

        if (name === "school_tier") {
            if (e.target.value === "school_tier_new") {
                this.isTierNew = true;
                this.isTierRunning = false;
                this.isTierExit = false;
            }
            else if (e.target.value === "school_tier_running") {
                this.isTierNew = false;
                this.isTierRunning = true;
                this.isTierExit = false;
            }
            else if (e.target.value === "school_tier_exit") {
                this.isTierNew = false;
                this.isTierRunning = false;
                this.isTierExit = true;
            }
        }

        if (name === "school_sex") {
            this.isCoed = e.target.value === "coed" ? true : false;
            this.setState({
                girl_count: '',
                boy_count: ''
            })
        }

    }

    inputChange(e, name) {
        let errorText = '';

        if (name != "point_person_email" && (e.target.pattern != "" && e.target.pattern != undefined)) {

            errorText = e.target.value.match(e.target.pattern) != e.target.value ? "invalid!" : '';
            this.errors[name] = errorText;
        }

        if (name === "point_person_email") {
            let regexPattern = new RegExp(e.target.pattern);
            if (regexPattern.test(e.target.value)) {
                errorText = '';
                this.errors[name] = errorText;
            }
            else {
                errorText = "invalid!";
                this.errors[name] = errorText;
            }
        }

        if(name === "girl_count" && this.isCoed) {
            if(this.state.boy_count !== undefined && this.state.boy_count !== '') {
                this.state.student_count = String(parseInt(e.target.value) + parseInt(this.state.boy_count));
            }
        }

        if(name === "boy_count" && this.isCoed) {
            if(this.state.girl_count !== undefined && this.state.girl_count !== '') {
                this.state.student_count = String(parseInt(e.target.value) + parseInt(this.state.girl_count));
            }
        }

        this.setState({
            [name]: e.target.value
        });

        this.setState({ errors: this.errors });

        // enable/disable extension based on landline number
        if (name === "point_person_contact") {

            if (this.state.point_person_contact.length >= 2 && !this.state.point_person_contact.startsWith("0")) {
                errorText = "invalid!";
                this.errors[name] = errorText;
            }
            else {
                errorText = '';
                this.errors[name] = errorText;
                if (this.state.point_person_contact.length >= 1 && !this.state.point_person_contact.startsWith("03")) {
                    this.isExtension = true;
                }
                else {
                    this.isExtension = false;
                }
            }
        }
        if (name === "partnership_start_date") {
            this.setState({
                partnership_years: moment().diff(this.state.partnership_start_date, 'years')
            })
        }
    }

    valueChangeMulti(e, name) {

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

        if (name === "parent_organization_id") {

            this.setState({
                parent_organization_name: e.locationName
            })
        }

        if (name === "province") {
            let districts = getDistrictsByProvince(e.id); // sending province integer id
            this.setState({
                districtArray: districts
            })
        }
    };

    handleSubmit = async event => {

        event.preventDefault();
        if (this.handleValidation()) {

            this.setState({
                // form_disabled: true,
                loading: true,
                loadingMsg: "Saving trees..."
            })

            if (this.editMode) {

                let self = this;
                this.fetchedLocation.stateProvince = this.state.province.value;
                this.fetchedLocation.cityVillage = this.state.district.label;
                // jsonData.parentLocation = {};
                if (this.fetchedLocation.parentLocation !== null) {
                    this.fetchedLocation.parentLocation.locationId = this.state.parent_organization_id.id;
                }
                this.fetchedLocation.locationName = this.state.school_name.trim();
                this.fetchedLocation.primaryContactPerson = this.state.point_person_name;
                if (this.state.point_person_email !== undefined) {
                    this.fetchedLocation.email = this.state.point_person_email;
                }

                if (this.state.extension !== undefined) {
                    this.fetchedLocation.extension = this.state.extension;
                }
                this.fetchedLocation.primaryContact = this.state.point_person_contact;

                var isProjects = false;
                var isPartnershipYears = false;
                var isNewCategory = false;
                var isRunningCategory = false;
                var isExitCategory = false;
                var isGirlCount = false;
                var isBoyCount = false;

                var fetchedAttributes = this.fetchedLocation.attributes;
                // CAUTION: async/await does not work in forEach therefore used Javascript For()
                // fetchedAttributes.forEach(async function (obj) { 
                for (var obj of fetchedAttributes) {

                    delete obj.createdBy;
                    delete obj.updatedBy;
                    // partnership_start_date
                    if (obj.attributeType.shortName === "partnership_start_date") {
                        obj.attributeValue = self.state.partnership_start_date;
                    }

                    // Number of years of partnership - partnership_years
                    if (obj.attributeType.shortName === "partnership_years") {
                        var years = moment().diff(this.state.partnership_start_date, 'years');
                        obj.attributeValue = String(years);
                        isPartnershipYears = true;
                    }

                    // school_type
                    if (obj.attributeType.shortName === "school_type") {
                        obj.attributeValue = await getDefinitionId("school_type", self.state.school_type);
                    }

                    // school_type
                    if (obj.attributeType.shortName === "school_sex") {
                        obj.attributeValue = await getDefinitionId("school_sex", self.state.school_sex);
                    }

                    // school_level
                    if (obj.attributeType.shortName === "school_level") {
                        obj.attributeValue = await getDefinitionId("school_level", self.state.school_level_shortname);
                    }

                    // Type of program(s) implemented in school - program_implemented
                    if (obj.attributeType.shortName === "program_implemented") {
                        let attrValueObject = [];
                        for (let i = 0; i < self.state.program_implemented.length; i++) {
                            let definitionObj = {};
                            definitionObj.definitionId = await getDefinitionId("program_implemented", self.state.program_implemented[i].value);
                            attrValueObject.push(definitionObj);
                        }

                        obj.attributeValue = JSON.stringify(attrValueObject);
                    }

                    // Associated Projects - projects
                    if (obj.attributeType.shortName === "projects") {
                        isProjects = true;
                        let multiAttrValueObject = [];

                        if (self.state.projects.length > 0) {
                            for (let i = 0; i < self.state.projects.length; i++) {
                                let projectObj = {};
                                projectObj.projectId = self.state.projects[i].id;
                                multiAttrValueObject.push(projectObj);
                            }
                        }
                        obj.attributeValue = JSON.stringify(multiAttrValueObject);
                    }

                    // School Tier - school_tier
                    if (obj.attributeType.shortName === "school_tier") {
                        obj.attributeValue = await getDefinitionId("school_tier", self.state.school_tier);
                        delete obj.createdBy;
                    }

                    // New Schools Category - school_category_new
                    if (obj.attributeType.shortName === "school_category_new" && !this.isTierNew) {
                        obj.isVoided = true;
                        isNewCategory = true;
                    }
                    else if (obj.attributeType.shortName === "school_category_new") {
                        isNewCategory = true;
                        obj.isVoided = false;
                        obj.attributeValue = await getDefinitionId("school_category_new", self.state.school_category_new);
                    }

                    // Running Schools Category - school_category_running
                    if (obj.attributeType.shortName === "school_category_running" && !this.isTierRunning) {
                        obj.isVoided = true;
                        isRunningCategory = true;
                    }
                    else if (obj.attributeType.shortName === "school_category_running") {
                        isRunningCategory = true;
                        obj.isVoided = false;
                        obj.attributeValue = await getDefinitionId("school_category_running", self.state.school_category_running);
                    }

                    // Exit Schools Category - school_category_exit
                    if (obj.attributeType.shortName === "school_category_exit" && !this.isTierExit) {
                        obj.isVoided = true;
                        isExitCategory = true;
                    }
                    else if (obj.attributeType.shortName === "school_category_exit") {
                        isExitCategory = true;
                        obj.isVoided = false;
                        obj.attributeValue = await getDefinitionId("school_category_exit", self.state.school_category_exit);
                    }

                    // Approximate number of students - student_count
                    if (obj.attributeType.shortName === "student_count") {
                        obj.attributeValue = self.state.student_count;
                    }

                    if (obj.attributeType.shortName === "girl_count" && !this.isCoed) {
                        obj.isVoided = true;
                        isGirlCount = true;
                    }
                    else if (obj.attributeType.shortName === "girl_count") {
                        isGirlCount = true;
                        obj.isVoided = false;
                        obj.attributeValue = self.state.girl_count;
                    }

                    if (obj.attributeType.shortName === "boy_count" && !this.isCoed) {
                        obj.isVoided = true;
                        isBoyCount = true;
                    }
                    else if (obj.attributeType.shortName === "boy_count") {
                        isBoyCount = true;
                        obj.isVoided = false;
                        obj.attributeValue = self.state.boy_count;
                    }
                }

                if (!isProjects) {
                    var attrType = await getLocationAttributeTypeByShortName("projects");
                    var attrTypeId = attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                    let multiAttrValueObject = [];

                    if (this.state.projects.length > 0) {
                        for (let i = 0; i < this.state.projects.length; i++) {
                            let projectObj = {};
                            projectObj.projectId = this.state.projects[i].id;
                            multiAttrValueObject.push(projectObj);
                        }
                    }
                    attributeObject.attributeValue = JSON.stringify(multiAttrValueObject); // attributeValue array of definitionIds
                    fetchedAttributes.push(attributeObject);
                }

                if (!isPartnershipYears && (self.state.partnership_years != undefined || self.state.partnership_years !== '')) {
                    var attrType = await getLocationAttributeTypeByShortName("partnership_years");
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = attrType;

                    var years = self.state.partnership_years;
                    attributeObject.attributeValue = String(years);
                    fetchedAttributes.push(attributeObject);
                }

                if (!isNewCategory && self.state.school_tier === "school_tier_new") {
                    var attrType = await getLocationAttributeTypeByShortName("school_category_new");
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = attrType;

                    attributeObject.attributeValue = await getDefinitionId("school_category_new", this.state.school_category_new); // attributeValue obj
                    fetchedAttributes.push(attributeObject);
                }

                if (!isRunningCategory && self.state.school_tier === "school_tier_running") {
                    var attrType = await getLocationAttributeTypeByShortName("school_category_running");
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = attrType;

                    attributeObject.attributeValue = await getDefinitionId("school_category_running", this.state.school_category_running); // attributeValue obj
                    fetchedAttributes.push(attributeObject);
                }

                if (!isExitCategory && self.state.school_tier === "school_tier_exit") {
                    var attrType = await getLocationAttributeTypeByShortName("school_category_exit");
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = attrType;

                    attributeObject.attributeValue = await getDefinitionId("school_category_exit", this.state.school_category_exit); // attributeValue obj
                    fetchedAttributes.push(attributeObject);
                }

                if (!isGirlCount && this.isCoed) {
                    var attrType = await getLocationAttributeTypeByShortName("girl_count");
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = attrType;

                    attributeObject.attributeValue = this.state.girl_count; // attributeValue obj
                    fetchedAttributes.push(attributeObject);
                }

                if (!isBoyCount && this.isCoed) {
                    var attrType = await getLocationAttributeTypeByShortName("boy_count");
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = attrType;

                    attributeObject.attributeValue = this.state.boy_count; // attributeValue obj
                    fetchedAttributes.push(attributeObject);
                }

                this.fetchedLocation.attributes = fetchedAttributes;
                delete this.fetchedLocation.createdBy;
                delete this.fetchedLocation.updatedBy;

                updateLocation(this.fetchedLocation, this.fetchedLocation.uuid)
                    .then(
                        responseData => {
                            console.log(responseData);
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
                                submitMsg = "Unable to update School Details form. \
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
                jsonData.category = {};
                var categoryId = await getDefinitionId("location_category", "school");
                jsonData.category.definitionId = categoryId;
                jsonData.country = "Pakistan";

                jsonData.stateProvince = this.state.province.name;
                jsonData.cityVillage = this.state.district.label;
                jsonData.parentLocation = {};
                jsonData.parentLocation.locationId = this.state.parent_organization_id.id;
                jsonData.shortName = this.schoolId;
                jsonData.locationName = this.state.school_name.trim();
                jsonData.primaryContactPerson = this.state.point_person_name;
                if (this.state.point_person_email !== undefined || this.state.point_person_email !== '') {
                    jsonData.email = this.state.point_person_email;
                }
                jsonData.primaryContact = this.state.point_person_contact;
                if (this.isExtension && this.state.extension !== '') {
                    jsonData.extension = this.state.extension;
                }
                jsonData.attributes = [];

                var attrType = await getLocationAttributeTypeByShortName("partnership_years");
                var attrTypeId = attrType.attributeTypeId;
                var attributeObject = new Object(); // top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value 
                var years = moment().diff(this.state.partnership_start_date, 'years');
                attributeObject.attributeValue = years; // attributeValue obj
                jsonData.attributes.push(attributeObject);

                var attrType = await getLocationAttributeTypeByShortName("partnership_start_date");
                var attrTypeId = attrType.attributeTypeId;
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value 
                attributeObject.attributeValue = this.state.partnership_start_date; // attributeValue obj
                jsonData.attributes.push(attributeObject);

                // school_type has a deinition datatype so attr value will be integer definitionid
                var attrType = await getLocationAttributeTypeByShortName("school_type");
                var attrTypeId = attrType.attributeTypeId;
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                attributeObject.attributeValue = await getDefinitionId("school_type", this.state.school_type); // attributeValue obj
                jsonData.attributes.push(attributeObject);

                // school_sex has a deinition datatype so attr value will be integer definitionid
                var attrType = await getLocationAttributeTypeByShortName("school_sex");
                var attrTypeId = attrType.attributeTypeId;
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                attributeObject.attributeValue = await getDefinitionId("school_sex", this.state.school_sex); // attributeValue obj
                jsonData.attributes.push(attributeObject);

                // school_level has a deinition datatype so attr value will be integer definitionid
                var attrType = await getLocationAttributeTypeByShortName("school_level");
                var attrTypeId = attrType.attributeTypeId;
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                attributeObject.attributeValue = await getDefinitionId("school_level", this.state.school_level_shortname); // attributeValue obj
                jsonData.attributes.push(attributeObject);

                // school_tier has a deinition datatype so attr value will be integer definitionid
                var attrType = await getLocationAttributeTypeByShortName("school_tier");
                var attrTypeId = attrType.attributeTypeId;
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                attributeObject.attributeValue = await getDefinitionId("school_tier", this.state.school_tier); // attributeValue obj
                jsonData.attributes.push(attributeObject);

                if (this.isTierNew) {
                    // school_tier has a deinition datatype so attr value will be integer definitionid
                    var attrType = await getLocationAttributeTypeByShortName("school_category_new");
                    var attrTypeId = attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value

                    attributeObject.attributeValue = await getDefinitionId("school_category_new", this.state.school_category_new); // attributeValue obj
                    jsonData.attributes.push(attributeObject);
                }

                if (this.isTierRunning) {
                    // school_category_running has a deinition datatype so attr value will be integer definitionid
                    var attrType = await getLocationAttributeTypeByShortName("school_category_running");
                    var attrTypeId = attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value

                    attributeObject.attributeValue = await getDefinitionId("school_category_running", this.state.school_category_running); // attributeValue obj
                    jsonData.attributes.push(attributeObject);
                }

                if (this.isTierExit) {
                    // school_category_exit has a deinition datatype so attr value will be integer definitionid
                    var attrType = await getLocationAttributeTypeByShortName("school_category_exit");
                    var attrTypeId = attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value

                    attributeObject.attributeValue = await getDefinitionId("school_category_exit", this.state.school_category_exit); // attributeValue obj
                    jsonData.attributes.push(attributeObject);
                }

                // student_count > loca attr type
                var attrType = await getLocationAttributeTypeByShortName("student_count");
                var attrTypeId = attrType.attributeTypeId;
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                attributeObject.attributeValue = this.state.student_count; // attributeValue obj
                jsonData.attributes.push(attributeObject);

                if (this.isCoed) {
                    // girl_count > loca attr type
                    var attrType = await getLocationAttributeTypeByShortName("girl_count");
                    var attrTypeId = attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                    attributeObject.attributeValue = this.state.girl_count; // attributeValue obj
                    jsonData.attributes.push(attributeObject);

                    // boy_count > loca attr type
                    var attrType = await getLocationAttributeTypeByShortName("boy_count");
                    var attrTypeId = attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                    attributeObject.attributeValue = this.state.boy_count; // attributeValue obj
                    jsonData.attributes.push(attributeObject);
                }

                // ==== MULTISELECT location_attribute_types ===

                // program_implemented > loca attr type
                var attrType = await getLocationAttributeTypeByShortName("program_implemented");
                var attrTypeId = attrType.attributeTypeId;
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                let attrValueObject = [];
                for (let i = 0; i < this.state.program_implemented.length; i++) {
                    let definitionObj = {};
                    definitionObj.definitionId = await getDefinitionId("program_implemented", this.state.program_implemented[i].value);
                    attrValueObject.push(definitionObj);
                }

                attributeObject.attributeValue = JSON.stringify(attrValueObject); // attributeValue array of definitionIds
                jsonData.attributes.push(attributeObject);


                // projects > loca attr type
                var attrType = await getLocationAttributeTypeByShortName("projects");
                var attrTypeId = attrType.attributeTypeId;
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                let multiAttrValueObject = [];

                if (this.state.projects.length > 0) {
                    for (let i = 0; i < this.state.projects.length; i++) {
                        let projectObj = {};
                        projectObj.projectId = this.state.projects[i].id;
                        multiAttrValueObject.push(projectObj);
                    }
                }
                attributeObject.attributeValue = JSON.stringify(multiAttrValueObject); // attributeValue array of definitionIds
                jsonData.attributes.push(attributeObject);

                console.log(jsonData);
                saveLocation(jsonData)
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

    }

    handleValidation() {
        // check each required state
        this.isCoed ? this.requiredFields.push("girl_count") : this.requiredFields = this.requiredFields.filter(e => e !== "girl_count");
        this.isCoed ? this.requiredFields.push("boy_count") : this.requiredFields = this.requiredFields.filter(e => e !== "boy_count");
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
                if (this.state[stateName] == undefined) {
                    isOk = false;
                    this.errors[fields[j]] = errorText;
                }
                else {
                    var stateData = this.state[stateName];
                    if (stateData.trim() === "") {
                        isOk = false;
                        this.errors[fields[j]] = errorText;
                    }
                }
            }
        }

        if (this.state.school_level == '' || this.state.school_level == undefined || this.state.school_level == null) {
            isOk = false;
            this.errors['school_level'] = errorText;
        }

        var mobileRegex = /^[0][3][0-9]{2}[0-9]{7}$/;
        if (this.state.point_person_contact.startsWith('03') && !this.state.point_person_contact.match(mobileRegex)) {
            isOk = false;
            this.errors["point_person_contact"] = "Invalid mobile number";
        }
        return isOk;
    }


    beforeSubmit = async () => {

        // autogenerate school id
        try {
            var district = this.state.district.value;
            var name = (this.state.school_name).toUpperCase();
            var schoolInitials = name.match(/\b(\w)/g);
            schoolInitials = schoolInitials.join('').toUpperCase();
            this.schoolId = district + schoolInitials;
            var levelInitials = (this.state.school_level).toUpperCase().substring(0, 3);

            this.schoolId = this.schoolId + levelInitials;
            var randomDigits = String(Math.floor(100000 + Math.random() * 900000));
            this.schoolId = this.schoolId + "-" + randomDigits.substring(0, 4);


        }
        catch (error) {
            console.log(error);
        }

    }

    /**
     * clear fields
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
            parent_organization_name: '',
            school_name: '',
            partnership_years: '0',
            partnership_start_date: '',
            point_person_name: '',
            point_person_contact: '',
            point_person_email: '',
            student_count: '',
            projects: [],
            extension: ''
        })

        this.schoolId = '';
        document.getElementById('school_level_secondary').checked = false;
        document.getElementById('school_level_primary').checked = false;
        this.isExtension = false;
        this.isCoed = false;
    }

    // for modal
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {

        const page2style = this.state.page2Show ? {} : { display: 'none' };
        const newSchoolStyle = this.isTierNew ? {} : { display: 'none' };
        const runningSchoolStyle = this.isTierRunning ? {} : { display: 'none' };
        const exitSchoolStyle = this.isTierExit ? {} : { display: 'none' };
        const extensionStyle = this.isExtension ? {} : { display: 'none' };
        const studentCoedCountStyle = this.isCoed ? {} : { display: 'none' };
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
                                <Form id="schoolDetail" onSubmit={this.handleSubmit}>
                                    <Row>
                                        <Col md="6">
                                            <Card className="main-card mb-6">


                                                <CardHeader>
                                                    <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                    <b>School Details Form</b>
                                                </CardHeader>

                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="12">
                                            <Card className="main-card mb-6 center-col">
                                                <CardBody>
                                                    <TabContent activeTab={this.state.activeTab}>
                                                        <TabPane tabId="1">

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="province" >Province<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["province"]}</span>
                                                                        <Select id="province" name="province" value={this.state.province} onChange={(e) => this.handleChange(e, "province")} options={location.provinces} required />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="district" >District<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["district"]}</span>
                                                                        <Select id="district" name="district" value={this.state.district} onChange={(e) => this.handleChange(e, "district")} options={this.state.districtArray} required />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="parent_organization_id" >Parent Organization ID<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["parent_organization_id"]}</span>
                                                                        <Select id="parent_organization_id" name="parent_organization_id" value={this.state.parent_organization_id} onChange={(e) => this.handleChange(e, "parent_organization_id")} options={this.state.organizations} />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="parent_organization_name" >Parent Organization Name</Label>
                                                                        <Input name="parent_organization_name" id="parent_organization_name" value={this.state.parent_organization_name} disabled />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_name" >School Name<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["school_name"]}</span>
                                                                        <Input name="school_name" id="school_name" value={this.state.school_name} onChange={(e) => { this.inputChange(e, "school_name") }} maxLength='100' placeholder="Enter school name" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_id" >School ID</Label> <span class="errorMessage">{this.state.errors["school_id"]}</span>
                                                                        <Input name="school_id" id="school_id" value={this.schoolId} onChange={(e) => { this.inputChange(e, "school_id") }} maxLength='100' disabled />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="partnership_start_date" >Date partnership with Aahung was formed<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["partnership_start_date"]}</span>
                                                                        <Input type="date" name="partnership_start_date" id="partnership_start_date" value={this.state.partnership_start_date} onChange={(e) => { this.inputChange(e, "partnership_start_date") }} locale={moment().format("DD-MM-YYYY")} max={moment().format("YYYY-MM-DD")} onInput={(e) => { this.partnership_years = moment(e.target.value, "YYYYMMDD").fromNow(); }} />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="partnership_years" >Number of years of partnership</Label> <span class="errorMessage">{this.state.errors["partnership_years"]}</span>
                                                                        <Input name="partnership_years" id="partnership_years" onChange={(e) => { this.inputChange(e, "partnership_years") }} value={moment().diff(this.state.partnership_start_date, 'years')} disabled />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_type" >Type of School<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["school_type"]}</span>
                                                                        <Input type="select" name="school_type" id="school_type" onChange={(e) => this.valueChange(e, "school_type")} value={this.state.school_type}>
                                                                            <option value="school_public">Public</option>
                                                                            <option value="school_private">Private</option>
                                                                            <option value="school_govt_adopted_private">Government Adopted by Private</option>
                                                                            <option value="school_local_govt">Local Government Schools</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_sex" >Classification of School by Sex<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["school_sex"]}</span>
                                                                        <Input type="select" name="school_sex" id="school_sex" onChange={(e) => this.valueChange(e, "school_sex")} value={this.state.school_sex}>
                                                                            <option value="girls">Girls</option>
                                                                            <option value="boys">Boys</option>
                                                                            <option value="coed">Co-ed</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>


                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <Label for="school_level" >Level of Program<span className="required">*</span></Label>
                                                                    <FormGroup tag="fieldset" row>

                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="school_level" id="school_level_primary" value="Primary" onChange={(e) => this.valueChange(e, "school_level")} disabled={this.editMode}/>{' '}
                                                                                    Primary
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="school_level" id="school_level_secondary" value="Secondary" onChange={(e) => this.valueChange(e, "school_level")} disabled={this.editMode}/>{' '}
                                                                                    Secondary
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["school_level"]}</span>
                                                                        </Col>
                                                                    </FormGroup>

                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="program_implemented" >Type of program(s) implemented in school<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["program_implemented"]}</span>
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "program_implemented")} value={this.state.program_implemented} id="program_implemented" options={programsImplemented} isMulti required />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            {/* please don't remove this div unless you are adding another form question here*/}
                                                            {/* <div style={{height: '160px'}}><span>   </span></div> */}

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="projects" >Associated Projects</Label> <span class="errorMessage">{this.state.errors["projects"]}</span>
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "projects")} value={this.state.projects} id="projects" options={this.state.projectsList} formatOptionLabel={formatOptionLabel} isMulti required />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_tier" >School Tier<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["school_tier"]}</span>
                                                                        <Input type="select" name="school_tier" id="school_tier" onChange={(e) => this.valueChange(e, "school_tier")} value={this.state.school_tier}>
                                                                            <option value="school_tier_new">New</option>
                                                                            <option value="school_tier_running">Running</option>
                                                                            <option value="school_tier_exit">Exit</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={newSchoolStyle}>
                                                                    <FormGroup >
                                                                        <Label for="school_category_new" >New Schools Category<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["school_category_new"]}</span>
                                                                        <Input type="select" name="school_category_new" id="school_category_new" onChange={(e) => this.valueChange(e, "school_category_new")} value={this.state.school_category_new}>
                                                                            <option value="school_new_inducted">Newly Inducted</option>
                                                                            <option value="school_new_implementation">Implementation > 1 Cycle</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>


                                                                <Col md="6" style={runningSchoolStyle}>
                                                                    <FormGroup >
                                                                        <Label for="school_category_running" >Running Schools Category<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["school_category_running"]}</span>
                                                                        <Input type="select" name="school_category_running" id="school_category_running" onChange={(e) => this.valueChange(e, "school_category_running")} value={this.state.school_category_running}>
                                                                            <option value="school_running_low">Low Performing</option>
                                                                            <option value="school_running_average">Average Performing</option>
                                                                            <option value="school_running_high">High Performing</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={exitSchoolStyle}>
                                                                    <FormGroup >
                                                                        <Label for="school_category_exit" >Exit Schools Category<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["school_category_exit"]}</span>
                                                                        <Input type="select" name="school_category_exit" id="school_category_exit" onChange={(e) => this.valueChange(e, "school_category_exit")} value={this.state.school_category_exit}>
                                                                            <option value="school_exit_initial_phase">Initial Phase</option>
                                                                            <option value="school_exit_mid_phase">Mid Phase</option>
                                                                            <option value="school_exit_exit_phase">Exit Phase</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_name" >Name of point of contact for school<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["point_person_name"]}</span>
                                                                        <Input type="text" name="point_person_name" id="point_person_name" value={this.state.point_person_name} onChange={(e) => { this.inputChange(e, "point_person_name") }} pattern="^[A-Za-z. ]+" maxLength="200" placeholder="Enter name" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_contact" >Phone number for point of contact at school<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["point_person_contact"]}</span>
                                                                        <div id="phone_extension_div">
                                                                            <Input type="text" name="point_person_contact" id="point_person_contact" onChange={(e) => { this.inputChange(e, "point_person_contact") }} value={this.state.point_person_contact} maxLength="12" placeholder="Contact Number" />
                                                                            <Input type="text" style={extensionStyle} name="extension" id="extension" onChange={(e) => { this.inputChange(e, "extension") }} value={this.state.extension} maxLength="4" placeholder="Extension" />
                                                                        </div>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_email" >Email address for point of contact at school</Label> <span class="errorMessage">{this.state.errors["point_person_email"]}</span>
                                                                        <Input type="text" name="point_person_email" id="point_person_email" value={this.state.point_person_email} onChange={(e) => { this.inputChange(e, "point_person_email") }} placeholder="Enter email" maxLength="50" pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$" />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={studentCoedCountStyle}>
                                                                    <FormGroup >
                                                                        <Label for="girl_count" >Approximate number of girls</Label> <span class="errorMessage">{this.state.errors["girl_count"]}</span>
                                                                        <Input type="number" value={this.state.girl_count} name="girl_count" id="girl_count" onChange={(e) => { this.inputChange(e, "girl_count") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter count"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={studentCoedCountStyle}>
                                                                    <FormGroup >
                                                                        <Label for="boy_count" >Approximate number of boys</Label> <span class="errorMessage">{this.state.errors["boy_count"]}</span>
                                                                        <Input type="number" value={this.state.boy_count} name="boy_count" id="boy_count" onChange={(e) => { this.inputChange(e, "boy_count") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter count"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="student_count" >Approximate number of students<span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["student_count"]}</span>
                                                                        <Input type="number" value={this.state.student_count} name="student_count" id="student_count" onChange={(e) => { this.inputChange(e, "student_count") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} disabled={this.isCoed} placeholder="Enter count"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
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

export default SchoolDetails;