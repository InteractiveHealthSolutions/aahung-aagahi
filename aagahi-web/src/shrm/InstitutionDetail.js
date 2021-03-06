/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-09-01 15:05:54
 * @modify date 2019-09-01 15:05:54
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
import { getAllProjects, getDefinitionByDefinitionId, getDefinitionId, getDefinitionsByDefinitionType, getLocationAttributeTypeByShortName, getLocationByRegexValue, getProjectByRegexValue } from '../service/GetService';
import { saveLocation, updateLocation } from "../service/PostService";
import { UserService } from '../service/UserService';
import { getObject } from "../util/AahungUtil.js";
import { getDistrictByValue, getDistrictsByProvince, getProvinceByValue, location } from "../util/LocationUtil.js";
import FormNavBar from "../widget/FormNavBar";
import LoadingIndicator from "../widget/LoadingIndicator";

const institutionTypes = [
    { label: 'Medical', value: 'medical' },
    { label: 'Nursing', value: 'nursing' },
    { label: 'Midwifery', value: 'midwifery' },
    { label: 'Other', value: 'other' }
];

const formatOptionLabel = ({ label, donorName }) => (
    <div style={{ display: "flex" }}>
        <div>{label} |</div>
        <div style={{ marginLeft: "10px", color: "#0d47a1" }}>
            {donorName}
        </div>
    </div>
);

class InstitutionDetails extends React.Component {

    modal = false;
    constructor(props) {
        super(props);


        this.state = {

            elements: ['institution_type', 'school_level', 'donor_name'],
            organizations: [],
            projectsList: [],
            point_person_contact: '',
            activeTab: '1',
            page2Show: true,
            errors: {},
            loading: false,
            modal: false,
            modalText: '',
            okButtonStyle: {},
            modalHeading: '',
        };

        this.toggle = this.toggle.bind(this);
        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.inputChange = this.inputChange.bind(this);

        this.editMode = false;
        this.isOtherInstitution = false;
        this.isExtension = false;
        this.errors = {};
        this.fetchedLocation = {};
        this.requiredFields = ["province", "district", "institution_name", "partnership_start_date", "institution_type", "point_person_name", "point_person_contact", "student_count"];
        this.institutionId = '';
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
            // projects
            let projects = await getAllProjects();
            if (projects != null && projects.length > 0) {
                this.setState({
                    projectsList: projects
                })
            }

            this.formatOptionLabel = ({ value, label, donorName }) => (
                <div style={{ display: "flex" }}>
                    <div>{label} |</div>
                    <div style={{ marginLeft: "10px", color: "#9e9e9e" }}>
                        {donorName}
                    </div>
                </div>
            );

            if (this.editMode) {

                this.fetchedLocation = await getLocationByRegexValue(String(this.props.location.state.locationId));
                if (this.fetchedLocation !== null) {
                    this.institutionId = this.fetchedLocation.shortName;
                    var province = this.fetchedLocation.stateProvince !== null ? getProvinceByValue(this.fetchedLocation.stateProvince) : {};
                    var district = this.fetchedLocation.cityVillage !== null ? getDistrictByValue(this.fetchedLocation.cityVillage) : {};
                    this.setState({
                        institution_name: this.fetchedLocation.locationName,
                        province: { "value": province.value, "label": province.label },
                        district: { "value": district.value, "label": district.label }
                    })

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
        }
    }

    beforeunload(e) {
        e.preventDefault();
        e.returnValue = true;
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

            if (obj.attributeType.dataType.toUpperCase() != "JSON" && obj.attributeType.dataType.toUpperCase() != "DEFINITION") {
                attributeValue = obj.attributeValue;
            }

            if (obj.attributeType.dataType.toUpperCase() == "DEFINITION") {
                // fetch definition shortname
                let definitionId = obj.attributeValue;
                let definition = await getDefinitionByDefinitionId(definitionId);
                let attrValue = definition.shortName;
                attributeValue = attrValue;
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

                            if (attrTypeName === "institution_type") {
                                if (definitionArr[0].shortName === "other") {
                                    self.isOtherInstitution = true;
                                }
                            }
                        })
                    }

                    if ('projectId' in attrValueObj[0]) {

                        attrValueObj.forEach(async function (obj) {

                            let projectObj = await getProjectByRegexValue(String(obj.projectId), false);
                            arr.push({ id: projectObj.projectId, label: projectObj.shortName, value: projectObj.shortName, donorName: projectObj.donor === undefined ? "" : projectObj.donor.donorName });

                        })
                    }
                    if (attrTypeName === "projects") {
                        // TODO: refactor this code
                        // TODO: project state not updating; clean up this code later
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

            if (attrTypeName != "projects")
                self.setState({ [attrTypeName]: attributeValue });
        })

    }


    cancelCheck = () => {
        console.log(" ============================================================= ")
        this.resetForm(this.requiredFields);

    }

    inputChange(e, name) {

        console.log(e);
        console.log(e.target.id);
        console.log(e.target.type);

        console.log(e.target.pattern);
        let errorText = '';
        if (name != "point_person_email" && e.target.pattern != "") {

            console.log(e.target.value.match(e.target.pattern));
            errorText = e.target.value.match(e.target.pattern) != e.target.value ? "invalid!" : '';
            console.log(errorText);
            this.errors[name] = errorText;
        }

        if (name === "point_person_email") {
            let regexPattern = new RegExp(e.target.pattern);
            console.log(regexPattern);
            if (regexPattern.test(e.target.value)) {
                console.log(true);
                errorText = '';
                this.errors[name] = errorText;
            }
            else {
                console.log(false);
                errorText = "invalid!";
                this.errors[name] = errorText;
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
    }

    // for single select
    valueChange = (e, name) => {
        this.setState({ sex: e.target.value });

        this.setState({
            [name]: e.target.value
        });

        if (e.target.id === "school_level") {
            // do skip logics based on school_level
        }

    }

    // for multi select
    valueChangeMulti(e, name) {
        console.log(e);

        this.setState({
            [name]: e
        });

        if (name === "institution_type") {
            // checking with two of because when another value is selected and other is unchecked, it still does not change the state
            if (getObject('other', e, 'value') != -1) {
                this.isOtherInstitution = true;
            }
            if (getObject('other', e, 'value') == -1) {
                this.isOtherInstitution = false;
            }
            this.isOtherInstitution ? this.requiredFields.push("institution_type_other") : this.requiredFields = this.requiredFields.filter(e => e !== "institution_type_other");
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

    beforeSubmit() {

        // autogenerate school id
        try {

            var district = this.state.district.value;
            var name = (this.state.institution_name).toUpperCase();
            var institutionInitials = name.match(/\b(\w)/g);
            institutionInitials = institutionInitials.join('').toUpperCase();
            this.institutionId = district + institutionInitials;
            var randomDigits = String(Math.floor(100000 + Math.random() * 900000));
            this.institutionId = this.institutionId + "-" + randomDigits.substring(0, 3);
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
                loadingMsg: "Saving data..."
            })
            try {

                if (this.editMode) {
                    let self = this;
                    this.fetchedLocation.stateProvince = this.state.province.value;
                    this.fetchedLocation.cityVillage = this.state.district.label;
                    if (this.fetchedLocation.parentLocation !== null) {
                        this.fetchedLocation.parentLocation.locationId = this.state.parent_organization_id.id;
                    }
                    this.fetchedLocation.locationName = this.state.institution_name.trim();
                    this.fetchedLocation.primaryContactPerson = this.state.point_person_name;
                    this.fetchedLocation.primaryContact = this.state.point_person_contact;
                    if (this.state.point_person_email !== undefined) {
                        this.fetchedLocation.email = this.state.point_person_email;
                    }
                    if (this.state.extension !== undefined) {
                        this.fetchedLocation.extension = this.state.extension;
                    }

                    var isProjects = false;
                    var isInstituteOther = false;

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

                        // Type of institutions - institution_type
                        if (obj.attributeType.shortName === "institution_type") {

                            // alert(self.state.institution_type.length)
                            let attrValueObject = [];
                            for (let i = 0; i < self.state.institution_type.length; i++) {
                                let definitionObj = {};
                                definitionObj.definitionId = await getDefinitionId("institution_type", self.state.institution_type[i].value);
                                attrValueObject.push(definitionObj);
                            }
                            obj.attributeValue = JSON.stringify(attrValueObject);
                        }

                        // institution_type_other
                        if (obj.attributeType.shortName === "institution_type_other" && !this.isOtherInstitution) {

                            obj.isVoided = true;
                            isInstituteOther = true;
                        }
                        if (obj.attributeType.shortName === "institution_type_other") {

                            obj.attributeValue = this.state.institution_type_other;
                            obj.isVoided = false;
                            isInstituteOther = true;
                        }

                        // Associated Projects - projects
                        if (obj.attributeType.shortName === "projects") {
                            isProjects = true;
                            let multiAttrValueObject = [];

                            if ((self.state.projects != undefined && self.state.projects !== null) && self.state.projects.length > 0) {
                                for (let i = 0; i < self.state.projects.length; i++) {
                                    let projectObj = {};
                                    projectObj.projectId = self.state.projects[i].id;
                                    multiAttrValueObject.push(projectObj);
                                }
                            }
                            obj.attributeValue = JSON.stringify(multiAttrValueObject);
                        }

                        // Approximate number of students - student_count
                        if (obj.attributeType.shortName === "student_count") {
                            obj.attributeValue = self.state.student_count;
                        }
                    }

                    if (!isProjects && (this.state.projects !== undefined && this.state.projects !== null)) {
                        var attrType = await getLocationAttributeTypeByShortName("projects");
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = attrType;
                        let multiAttrValueObject = [];

                        if ((this.state.projects != undefined && this.state.projects !== null) && this.state.projects.length > 0) {
                            for (let i = 0; i < this.state.projects.length; i++) {
                                let projectObj = {};
                                projectObj.projectId = this.state.projects[i].id;
                                multiAttrValueObject.push(projectObj);
                            }
                        }
                        attributeObject.attributeValue = JSON.stringify(multiAttrValueObject); // attributeValue array of definitionIds
                        fetchedAttributes.push(attributeObject);
                    }

                    if (!isInstituteOther && (this.state.institution_type_other !== undefined && this.state.institution_type_other !== "")) {
                        // alert(this.state.institution_type_other)
                        var attrType = await getLocationAttributeTypeByShortName("institution_type_other");
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = attrType;

                        attributeObject.attributeValue = this.state.institution_type_other; // attributeValue obj
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
                                    submitMsg = "Unable to update Institution Details form. \
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
                    var categoryId = await getDefinitionId("location_category", "institution");
                    jsonData.category.definitionId = categoryId;
                    jsonData.country = "Pakistan";
                    jsonData.stateProvince = this.state.province.name;
                    jsonData.cityVillage = this.state.district.label;
                    // jsonData.parentLocation = {};
                    // jsonData.parentLocation.locationId = this.state.parent_organization_id.id;
                    jsonData.shortName = this.institutionId;
                    jsonData.locationName = this.state.institution_name.trim();
                    jsonData.primaryContactPerson = this.state.point_person_name;
                    jsonData.email = this.state.point_person_email;
                    jsonData.primaryContact = this.state.point_person_contact;
                    if (this.isExtension && this.state.extension !== '') {
                        jsonData.extension = this.state.extension;
                    }

                    jsonData.attributes = [];

                    // attr_type_id = 7
                    var attrType = await getLocationAttributeTypeByShortName("partnership_start_date");
                    var attrTypeId = attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value 
                    attributeObject.attributeValue = this.state.partnership_start_date; // attributeValue obj
                    jsonData.attributes.push(attributeObject);

                    // ==== MULTISELECT location_attribute_types ===

                    // institution_type > loca attr type
                    // attr_type_id = 8
                    var attrType = await getLocationAttributeTypeByShortName("institution_type");
                    var attrTypeId = attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                    let attrValueObject = [];
                    for (let i = 0; i < this.state.institution_type.length; i++) {
                        let definitionObj = {};
                        definitionObj.definitionId = await getDefinitionId("institution_type", this.state.institution_type[i].value);
                        attrValueObject.push(definitionObj);
                    }

                    attributeObject.attributeValue = JSON.stringify(attrValueObject); // attributeValue array of definitionIds
                    jsonData.attributes.push(attributeObject);

                    if (this.isOtherInstitution) {
                        // school_category_exit has a deinition datatype so attr value will be integer definitionid
                        var attrType = await getLocationAttributeTypeByShortName("institution_type_other");
                        var attrTypeId = attrType.attributeTypeId;
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = {};
                        attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value

                        attributeObject.attributeValue = this.state.institution_type_other; // attributeValue obj
                        jsonData.attributes.push(attributeObject);
                    }

                    // projects > location attr type
                    // attr_type_id = 10
                    if (this.state.projects != null && this.state.projects.length > 0) {
                        var attrType = await getLocationAttributeTypeByShortName("projects");
                        var attrTypeId = attrType.attributeTypeId;
                        var attributeObject = new Object(); //top level obj
                        attributeObject.attributeType = {};
                        attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                        let multiAttrValueObject = [];
                        for (let i = 0; i < this.state.projects.length; i++) {
                            let projectObj = {};
                            projectObj.projectId = this.state.projects[i].id;
                            multiAttrValueObject.push(projectObj);
                        }
                        attributeObject.attributeValue = JSON.stringify(multiAttrValueObject); // attributeValue array of definitionIds
                        jsonData.attributes.push(attributeObject);
                    }

                    // student_count > loca attr type
                    // attr_type_id = 20
                    var attrType = await getLocationAttributeTypeByShortName("student_count");
                    var attrTypeId = attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                    attributeObject.attributeValue = this.state.student_count; // attributeValue obj
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
            } catch (error) {
                console.log(error);
            }

        }

    }

    handleValidation() {
        // check each required state

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

        var mobileRegex = /^[0][3][0-9]{2}[0-9]{7}$/;
        if (this.state.point_person_contact.startsWith('03') && !this.state.point_person_contact.match(mobileRegex)) {
            isOk = false;
            this.errors["point_person_contact"] = "Invalid mobile number";
        }

        return isOk;
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

        this.institutionId = '';
        this.setState({
            province: [],
            point_person_email: '',
            projects: [],
            extension: ''
        })
        this.isExtension = false;
    }

    // for modal
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        const otherInstitutionStyle = this.isOtherInstitution ? {} : { display: 'none' };
        const extensionStyle = this.isExtension ? {} : { display: 'none' };
        var formNavVisible = false;
        if (this.props.location.state !== undefined) {
            formNavVisible = this.props.location.state.edit ? true : false;
        }
        else {
            formNavVisible = false;
        }

        var buttonDisabled = false; 
        if(this.editMode) {
            buttonDisabled = UserService.hasAccess('Edit Location') ? false : true;
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
                                                    <b>Institution Details Form</b>
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
                                                                        <Label for="province" >Province <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["province"]}</span>
                                                                        <Select id="province" name="province" value={this.state.province} onChange={(e) => this.handleChange(e, "province")} options={location.provinces} required />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="district" >District <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["district"]}</span>
                                                                        <Select id="district" name="district" value={this.state.district} onChange={(e) => this.handleChange(e, "district")} options={this.state.districtArray} required />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="institution_name">Institution Name <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["institution_name"]}</span>
                                                                        <Input id="institution_name" name="institution_name" value={this.state.institution_name} onChange={(e) => { this.inputChange(e, "institution_name") }} maxLength='100' pattern="^[A-Za-z. ]+" placeholder="Enter name" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="institution_id" >Institution ID</Label> <span class="errorMessage">{this.state.errors["institution_id"]}</span>
                                                                        <Input type="text" name="institution_id" id="institution_id" value={this.institutionId} onChange={(e) => { this.inputChange(e, "institution_id") }} maxLength='15' placeholder="ID" disabled />

                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="partnership_start_date" >Date of Partnership with Aahung <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["partnership_start_date"]}</span>
                                                                        <Input type="date" name="partnership_start_date" id="partnership_start_date" value={this.state.partnership_start_date} onChange={(e) => { this.inputChange(e, "partnership_start_date") }} max={moment().format("YYYY-MM-DD")} />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="institution_type" >Type of Institution <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["institution_type"]}</span>
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "institution_type")} value={this.state.institution_type} id="institution_type" options={institutionTypes} isMulti />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="12">
                                                                    <FormGroup style={otherInstitutionStyle}>
                                                                        <Label for="institution_type_other" >Specify other type of institution</Label> <span class="errorMessage">{this.state.errors["institution_type_other"]}</span>
                                                                        <Input name="institution_type_other" id="institution_type_other" value={this.state.institution_type_other} onChange={(e) => { this.inputChange(e, "institution_type_other") }} pattern="^[A-Za-z. ]+" placeholder="Specify other" />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="projects" >Associated Projects</Label> <span class="errorMessage">{this.state.errors["projects"]}</span>
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "projects")} value={this.state.projects} id="projects" options={this.state.projectsList} formatOptionLabel={formatOptionLabel} isMulti />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_name" >Name of point of contact for institution <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["point_person_name"]}</span>
                                                                        <Input name="point_person_name" id="point_person_name" value={this.state.point_person_name} onChange={(e) => { this.inputChange(e, "point_person_name") }} pattern="^[A-Za-z. ]+" placeholder="Enter name" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_contact" >Phone number for point of contact at institution <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["point_person_contact"]}</span>
                                                                        <div id="phone_extension_div">
                                                                            <Input type="text" name="point_person_contact" id="point_person_contact" onChange={(e) => { this.inputChange(e, "point_person_contact") }} value={this.state.point_person_contact} maxLength="12" placeholder="Contact Number" />
                                                                            <Input type="text" style={extensionStyle} name="extension" id="extension" onChange={(e) => { this.inputChange(e, "extension") }} value={this.state.extension} maxLength="4" placeholder="Extension" />
                                                                        </div>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_email" >Email address for point of contact at institution</Label> <span class="errorMessage">{this.state.errors["point_person_email"]}</span>
                                                                        <Input name="point_person_email" id="point_person_email" value={this.state.point_person_email} onChange={(e) => { this.inputChange(e, "point_person_email") }} placeholder="Enter email" maxLength="50" pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="student_count" >Approximate number of students <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["student_count"]}</span>
                                                                        <Input type="number" name="student_count" id="student_count" value={this.state.student_count} onChange={(e) => { this.inputChange(e, "student_count") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number" />
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
                                    <CustomModal modal={this.state.modal} modalHeading={this.state.modalHeading} modalText={this.state.modalText} toggle={this.toggle} />
                                </Form>
                            </Container>
                        </div>
                    </ReactCSSTransitionGroup>
                </Fragment>
            </div>
        );
    }
}

export default InstitutionDetails;