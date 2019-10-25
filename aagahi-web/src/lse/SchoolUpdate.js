/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-19 15:26:53
 * @modify date 2019-08-19 15:26:53
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
import { Button, ButtonGroup, Input, Label, CustomInput, Form, FormGroup, Container, Card, CardHeader, CardBody, TabContent, TabPane, CardTitle, Row, Col } from 'reactstrap';
import "../index.css"
import Select from 'react-select';
import CustomModal from "../alerts/CustomModal";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import moment from 'moment';
import { schoolDefinitionUuid } from "../util/AahungUtil.js";
import { getLocationsByCategory, getAllProjects, getProjectByProjectId, getLocationAttributesByLocation, getDefinitionByDefinitionShortName, getDefinitionByDefinitionId, getDefinitionsByDefinitionType, getLocationAttributeTypeByShortName, getDefinitionId } from '../service/GetService';
import { saveLocationAttributes } from "../service/PostService";
import LoadingIndicator from "../widget/LoadingIndicator";
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBBtn } from 'mdbreact';

const programsImplemented = [  /* value represents short names */
    { label: 'CSA', value: 'csa'},
    { label: 'Gender', value: 'gender'},
    { label: 'LSBE', value: 'lsbe'},
];

const formatOptionLabel = ({ label, donorName }) => (
    <div style={{ display: "flex" }}>
      <div>{label} |</div>
      <div style={{ marginLeft: "10px", color: "#9e9e9e" }}>
        {donorName}
      </div>
    </div>
  );

class SchoolUpdate extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            locationObj: {},
            schools: [],
            projectsList: [],
            projects: [],
            participant_id: '',
            participant_name: '',
            school_tier: 'school_tier_new',
            school_id: [],
            partnership_years: '',
            subject_taught: [], // all the form elements states are in underscore notation i.e variable names in codebook
            subject_taught_other: '',
            teaching_years: '',
            education_level: 'no_edu',
            donor_name: '',
            activeTab: '1',
            page2Show: true,
            viewMode: false,
            editMode: false,
            errors: {},
            loading: false,
            hasError: false,
        };

        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.calculateScore = this.calculateScore.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.isTierNew = true;
        this.isTierRunning= false;
        this.isTierExit= false;
        this.locationObj = {};
        this.requiredFields = ["school_id", "end_partnership_reason", "partnership_years"]; //rest of the required fields are checked automatically by 'required' tag
        this.errors = {};

        this.selectedProjects = [];
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
            
            let schools = await getLocationsByCategory(schoolDefinitionUuid);
            console.log(schools);

            if (schools != null && schools.length > 0) {
                this.setState({
                    schools: schools
                })
            }

            // projects
            let projectList = await getAllProjects();
            
            if(projectList != null && projectList.length > 0) {
                this.setState({
                    projectsList : projectList
                })
            }

        }
        catch (error) {
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

    // for modal
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    beforeunload(e) {
        e.preventDefault();
        e.returnValue = true;
    }


    cancelCheck = () => {

        this.resetForm();
        // receiving value directly from widget but it still requires widget to have on change methods to set it's value
        // this.setState({school_tier: 'school_tier_new'})
        // document.getElementById("school_tier").value = "school_tier_running";
        console.log("======================= printing selected projects ================================");
        // console.log(this.state.projects);
        // this.setState({
        //     projects: [{
        //         "id": 13,
        //         "label": "QT-Y-2019",
        //         "donorName": "QA tester"
        //       }]
        // })        
    }

    // for text and numeric questions
    inputChange(e, name) {
        
        this.setState({
            [name]: e.target.value
        });

        if (name === "partnership_end_date") {
            if (this.state.partnership_start_date != undefined || this.state.partnership_start_date != null) {
                var startDate = this.state.partnership_start_date;
                var momentDate = moment(startDate);
                var endDataMoment = moment(e.target.value);
                this.setState({ partnership_years: endDataMoment.diff(momentDate, 'years') });
            }
        }
    }

    // for single select
    valueChange = (e, name) => {
        this.setState({
            [name]: e.target.value
        });

        if (name === "school_tier") {
            if(e.target.value === "school_tier_new") {
                this.isTierNew = true;
                this.isTierRunning = false;
                this.isTierExit = false;
            }
            else if(e.target.value === "school_tier_running") {
                this.isTierNew = false ;
                this.isTierRunning = true;
                this.isTierExit = false;
            }
            else if(e.target.value === "school_tier_exit") {
                this.isTierNew = false;
                this.isTierRunning = false;
                this.isTierExit = true;
            }
        }
    }

    // calculate score from scoring questions (radiobuttons)
    calculateScore = (e, name) => {
        this.setState({
            [name]: e.target.value
        });
    }

    // for multi select
    valueChangeMulti(e, name) {
        console.log(" =========== printing e =========== ")
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
                
                let attributes = await getLocationAttributesByLocation(e.uuid);
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
    autopopulateFields(locationAttributes) {
        let self = this;
        let attributeValue = '';
        locationAttributes.forEach(async function (obj) {
            let attrTypeName = obj.attributeType.shortName;
            if (attrTypeName === "partnership_years")
                return;
            
            if (obj.attributeType.dataType.toUpperCase() != "JSON" || obj.attributeType.dataType.toUpperCase() != "DEFINITION") {
                attributeValue = obj.attributeValue;
            }

            if (obj.attributeType.dataType.toUpperCase() == "DEFINITION") {
                // fetch definition shortname
                let definitionId = obj.attributeValue;
                let definition = await getDefinitionByDefinitionId(definitionId);
                let attrValue = definition.shortName;
                attributeValue = attrValue;
                if(attrTypeName === "school_tier")
                    document.getElementById(attrTypeName).value = attributeValue;
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
                            arr.push({label: definitionArr[0].definitionName, value: definitionArr[0].shortName})
                        })
                    }

                    if ('projectId' in attrValueObj[0]) {
                        
                        attrValueObj.forEach(async function (obj) {
                            
                            // definitionArr contains only one item because filter will return only one definition
                            let projectObj = await getProjectByProjectId(obj.projectId);
                            // array.push({ "id" : obj.projectId, "uuid" : obj.uuid, "shortName" : obj.shortName, "name" : obj.projectName, "label" : obj.shortName, "value" : obj.shortName, "donorName" : obj.donor.donorName, "donorId" : obj.donor.donorId});
                            arr.push({ id : projectObj.projectId, label: projectObj.shortName, value: projectObj.shortName, donorName : projectObj.donor.donorName})
                        })
                    }
                    
                    if (attrTypeName === "program_implemented") {
                        self.setState({
                            [attrTypeName]: arr
                        })
                    }
                    if(attrTypeName === "projects") {
                        
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
            }

            if (attrTypeName != "program_implemented" && attrTypeName != "school_tier" && attrTypeName != "projects")
                self.setState({ [attrTypeName]: attributeValue });

        })

        
    }

    handleSubmit = async event => {
        event.preventDefault();
        if(this.handleValidation()) {
            this.setState({ 
                loading : true
            })
            
            const data = new FormData(event.target);
            console.log(data);
            var jsonData = new Object();
            
            jsonData.attributes = [];
            
            var attrType = await getLocationAttributeTypeByShortName("partnership_years");
            var fetchedAttrTypeId= attrType.attributeTypeId;
            var atrObj = new Object(); // top level obj
            atrObj.attributeTypeId = fetchedAttrTypeId; // attributeType obj with attributeTypeId key value
            atrObj.locationId =  this.state.school_id.id; 
            var years = this.state.partnership_years;
            atrObj.attributeValue = String(years); // attributeValue obj
            jsonData.attributes.push(atrObj);

            // school_tier has a deinition datatype so attr value will be integer definitionid
            var attrType = await getLocationAttributeTypeByShortName("school_tier");
            var fetchedAttrTypeId= attrType.attributeTypeId;
            var atrObj = new Object(); // top level obj
            atrObj.attributeTypeId = fetchedAttrTypeId; // attributeType obj with attributeTypeId key value
            atrObj.locationId =  this.state.school_id.id;
            var def = await getDefinitionByDefinitionShortName(this.state.school_tier);
            atrObj.attributeValue = String(def.definitionId);
            console.log(" >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ");
            console.log(atrObj.attributeValue);
            jsonData.attributes.push(atrObj);

            var attrType = await getLocationAttributeTypeByShortName("partnership_end_date");
            var fetchedAttrTypeId= attrType.attributeTypeId;
            var atrObj = new Object(); // top level obj
            atrObj.attributeTypeId = fetchedAttrTypeId; // attributeType obj with attributeTypeId key value
            atrObj.locationId =  this.state.school_id.id; 
            atrObj.attributeValue = this.state.partnership_end_date; // attributeValue obj
            jsonData.attributes.push(atrObj);

            // school_type has a deinition datatype so attr value will be integer definitionid
            var attrType = await getLocationAttributeTypeByShortName("end_partnership_reason");
            var fetchedAttrTypeId= attrType.attributeTypeId;
            var atrObj = new Object(); // top level obj
            atrObj.attributeTypeId = fetchedAttrTypeId; // attributeType obj with attributeTypeId key value
            atrObj.locationId =  this.state.school_id.id; 
            atrObj.attributeValue = this.state.end_partnership_reason; // attributeValue obj
            jsonData.attributes.push(atrObj);
 
            console.log(jsonData);
            saveLocationAttributes(jsonData)
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
                        
                        this.resetForm();
                    }
                    else if(String(responseData).includes("Error")) {
                        
                        var submitMsg = '';
                        submitMsg = "Unable to submit school details form. \
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
        let formIsValid = true;
        console.log(this.requiredFields);
        this.setState({ hasError: true });
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
            if(typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
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
     * clear fields
     */
    resetForm = () => {

        var fields = ["school_id", "school_name", "partnership_start_date", "partnership_end_date", "partnership_years", "school_level", "program_implemented", "school_tier", "end_partnership_reason"];

        for(let j=0; j < fields.length; j++) {
            let stateName = fields[j];

            // var el = document.getElementById(stateName).value = '';
            
            // for array object
            if(typeof this.state[stateName] === 'object') {
                this.state[stateName] = [];
            }

            // for text and others
            if(typeof this.state[stateName] != 'object') {
                this.state[stateName] = ''; 
            }
        }

        this.setState({
            program_implemented: ''

        })
    }

    render() {

        const page2style = this.state.page2Show ? {} : { display: 'none' };
        const newSchoolStyle = this.isTierNew ? {} : { display: 'none' };
        const runningSchoolStyle = this.isTierRunning ? {} : { display: 'none' };
        const exitSchoolStyle = this.isTierExit ? {} : { display: 'none' };

        // for view mode
        const setDisable = this.state.viewMode ? "disabled" : "";
        const { selectedOption } = this.state;
        // scoring labels
        const stronglyAgree = "Strongly Agree";
        const agree = "Agree";
        const neither = "Neither Agree nor Disagree";
        const stronglyDisagree = "Strongly Disagree";
        const disagree = "Disagree";
        const yes = "Yes";
        const no = "No";


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
                            <Form id="schoolDetail" onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>School Update Form</b>
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
                                                                        <FormGroup >
                                                                            <Label for="school_id" >Select School ID</Label> <span class="errorMessage">{this.state.errors["school_id"]}</span>
                                                                            <Select id="school_id" name="school_id" value={this.state.school_id} onChange={(e) => this.handleChange(e, "school_id")} options={this.state.schools} required/>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_name" >School Name</Label>
                                                                            <Input name="school_name" id="school_name" value={this.state.school_name} disabled />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup inline>
                                                                            <Label for="partnership_start_date" >Date partnership with Aahung was formed</Label>
                                                                            <Input type="date" name="partnership_start_date" id="partnership_start_date" value={this.state.partnership_start_date} onChange={(e) => { this.inputChange(e, "partnership_start_date") }} max={moment().format("YYYY-MM-DD")} required disabled />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="partnership_years">Number of years of partnership</Label> <span class="errorMessage">{this.state.errors["partnership_years"]}</span>
                                                                            <Input type="number" value={this.state.partnership_years} name="partnership_years" id="partnership_years" onChange={(e) => { this.inputChange(e, "partnership_years") }} max="99" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2) }} placeholder="Enter count in numbers" disabled required></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_sex" >Classification of School by Sex</Label> <span class="errorMessage">{this.state.errors["school_sex"]}</span>
                                                                            <Input type="select" name="school_sex" id="school_sex" onChange={(e) => this.valueChange(e, "school_sex")} value={this.state.school_sex}>
                                                                                <option value="girls">Girls</option>
                                                                                <option value="boys">Boys</option>
                                                                                <option value="coed">Co-ed</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_level" >Level of Program</Label>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "school_level")} value={this.state.school_level} name="school_level" id="school_level" disabled>
                                                                                <option value="school_level_primary">Primary</option>
                                                                                <option value="school_level_secondary">Secondary</option>
                                                                            </Input>
                                                                        </FormGroup>

                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="program_implemented" >Type of program(s) implemented in school</Label> <span class="errorMessage">{this.state.errors["program_implemented"]}</span>
                                                                            <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "program_implemented")} value={this.state.program_implemented} id="program_implemented" options={programsImplemented} />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="projects" >Associated Projects</Label> <span class="errorMessage">{this.state.errors["projects"]}</span>
                                                                            <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "projects")} value={this.state.projects} id="projects" options={this.state.projectsList} formatOptionLabel={formatOptionLabel} isMulti required/>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_tier" >School Tier</Label> <span class="errorMessage">{this.state.errors["school_tier"]}</span>
                                                                            <Input type="select" name="school_tier" id="school_tier" onChange={(e) => this.valueChange(e, "school_tier")}>
                                                                                <option value="school_tier_new">New</option>
                                                                                <option value="school_tier_running">Running</option>
                                                                                <option value="school_tier_exit">Exit</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={newSchoolStyle}>
                                                                        <FormGroup >
                                                                            <Label for="school_category_new" >New Schools Category</Label> <span class="errorMessage">{this.state.errors["school_category_new"]}</span>
                                                                            <Input type="select" name="school_category_new" id="school_category_new" onChange={(e) => this.valueChange(e, "school_category_new")} value={this.state.school_category_new}>
                                                                                <option value="school_new_inducted">Newly Inducted</option>
                                                                                <option value="school_new_implementation">Implementation > 1 Cycle</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={runningSchoolStyle}>
                                                                        <FormGroup >
                                                                            <Label for="school_category_running" >Running Schools Category</Label> <span class="errorMessage">{this.state.errors["school_category_running"]}</span>
                                                                            <Input type="select" name="school_category_running" id="school_category_running" onChange={(e) => this.valueChange(e, "school_category_running")} value={this.state.school_category_running}>
                                                                                <option value="school_running_low">Low Performing</option>
                                                                                <option value="school_running_average">Average Performing</option>
                                                                                <option value="school_running_high">High Performing</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" style={exitSchoolStyle}>
                                                                        <FormGroup >
                                                                            <Label for="school_category_exit" >Exit Schools Category</Label> <span class="errorMessage">{this.state.errors["school_category_exit"]}</span>
                                                                            <Input type="select" name="school_category_exit" id="school_category_exit" onChange={(e) => this.valueChange(e, "school_category_exit")} value={this.state.school_category_exit}>
                                                                                <option value="school_exit_initial_phase">Initial Phase</option>
                                                                                <option value="school_exit_mid_phase">Mid Phase</option>
                                                                                <option value="school_exit_exit_phase">Exit Phase</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="point_person_name" >Name of point of contact for school</Label> <span class="errorMessage">{this.state.errors["point_person_name"]}</span>
                                                                            <Input type="text" name="point_person_name" id="point_person_name" value={this.state.point_person_name} onChange={(e) => {this.inputChange(e, "point_person_name")}} pattern="^[A-Za-z. ]+" maxLength="200" placeholder="Enter name" />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="point_person_contact" >Phone number for point of contact at school</Label> <span class="errorMessage">{this.state.errors["point_person_contact"]}</span>
                                                                            <Input type="text" name="point_person_contact" id="point_person_contact" onChange={(e) => {this.inputChange(e, "point_person_contact")}} value={this.state.point_person_contact} maxLength="12" pattern="[0][3][0-9]{2}-[0-9]{7}" placeholder="Mobile Number: xxxx-xxxxxxx" />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="point_person_email" >Email address for point of contact at school</Label> <span class="errorMessage">{this.state.errors["point_person_email"]}</span>
                                                                            <Input type="text" name="point_person_email" id="point_person_email" value={this.state.point_person_email} onChange={(e) => {this.inputChange(e, "point_person_email")}} placeholder="Enter email" maxLength="50" pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$" />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="student_count" >Approximate number of students </Label> <span class="errorMessage">{this.state.errors["student_count"]}</span>
                                                                            <Input type="number" value={this.state.student_count} name="student_count" id="student_count" onChange={(e) => {this.inputChange(e, "student_count")}} max="99999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,5)}} placeholder="Enter count in numbers"></Input>
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
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit" disabled={setDisable}>Submit</Button>
                                                        <Button className="mb-2 mr-2" color="danger" size="sm" onClick={this.cancelCheck} disabled={setDisable}>Clear</Button>
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

export default SchoolUpdate;