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

import React, { Fragment } from "react";
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Input, Label, CustomInput, Form, FormGroup, Container, Card, CardBody, TabContent, TabPane, CardTitle, Row, Col } from 'reactstrap';
import { Button, CardHeader, ButtonGroup } from 'reactstrap';
import "../index.css"
import classnames from 'classnames';
import Select from 'react-select';
import CustomModal from "../alerts/CustomModal";
import { useBeforeunload } from 'react-beforeunload';
import { getObject} from "../util/AahungUtil.js";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import { location, getDistrictsByProvince} from "../util/LocationUtil.js";
import moment from 'moment';


const options = [
    { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Sindh' },
    { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Punjab' },
    { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Balochistan' },
    { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Khyber Pakhtunkhwa' },
];

const institutionTypes = [
    { label: 'Medical', value: 'institution_medical'},
    { label: 'Nursing', value: 'institution_nursing'},
    { label: 'Midwifery', value: 'institution_midwifery'},
    { label: 'Other', value: 'institution_other'}
];

const subjectsTaught = [
    { label: 'Math', value: 'math'},
    { label: 'Science', value: 'science'},
    { label: 'English', value: 'english'},
    { label: 'Urdu', value: 'urdu', },
    { label: 'Social Studies', value: 'social_studies'},
    { label: 'Islamiat', value: 'islamiat'},
    { label: 'Art', value: 'art', },
    { label: 'Music', value: 'music'},
    { label: 'Other', value: 'other', },
];

const schools = [
    { value: 'sindh', label: 'Sindh' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'balochistan', label: 'Balochistan' },
    { value: 'khyber_pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
];

class InstitutionDetails extends React.Component {

    modal = false;
    

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            // TODO: fill UUIDs everywhere where required
            // subject_taught : [{value: 'math'},
            // {value: 'science'}],
            elements: ['program_implemented', 'school_level','donor_name'],
            participant_id : '',
            participant_name: '',
            dob: '',
            sex : '',
            school_id: [],
            school_name: '',
            subject_taught : [], // all the form elements states are in underscore notation i.e variable names in codebook
            subject_taught_other: '',
            teaching_years: '',
            education_level: 'no_edu',
            point_person_contact: '',
            activeTab: '1',
            page2Show: true,
            errors: {},
        };


        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.inputChange = this.inputChange.bind(this);

        this.isOtherInstitution = false;
        this.errors = {};
    }

    componentDidMount() {
        // alert("School Details: Component did mount called!");
        window.addEventListener('beforeunload', this.beforeunload.bind(this));
    }

    componentWillUnmount() {

        // alert("School Details: ComponentWillUnMount called!");
        window.removeEventListener('beforeunload', this.beforeunload.bind(this));
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
        // alert(this.state.program_implemented + " ----- " + this.state.school_level + "-----" + this.state.sex);
        console.log("program_implemented below:");
        console.log(this.state.program_implemented);
        console.log("school_level below:");
        console.log(this.state.school_level);
        console.log("school_id below:");
        console.log(this.state.school_id);
        console.log(getObject('khyber_pakhtunkhwa', schools, 'value'));
        console.log(this.state.donor_name);
    }

    inputChange(e, name) {

        console.log(e);
        console.log(e.target.id);
        console.log(e.target.type);
        console.log(e.target.pattern);
        let errorText = '';
        if(name != "point_person_email" && e.target.pattern != "" ) {
            
            console.log(e.target.value.match(e.target.pattern));
             errorText = e.target.value.match(e.target.pattern) != e.target.value ? "invalid!" : '';
            console.log(errorText);
            this.errors[name] = errorText;
        }

        if(name === "point_person_email") {
            let regexPattern = new RegExp(e.target.pattern);
            console.log(regexPattern);
            if (regexPattern.test(e.target.value))
            {
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

        this.setState({errors: this.errors});

        console.log(this.errors);
        console.log(this.state.errors);

        // appending dash to contact number after 4th digit
        if(name === "point_person_contact") {
            this.setState({ point_person_contact: e.target.value});
            let hasDash = false;
            if(e.target.value.length == 4 && !hasDash) {
                this.setState({ point_person_contact: ''});
            }
            if(this.state.point_person_contact.length == 3 && !hasDash) {
                this.setState({ point_person_contact: ''});
                this.setState({ point_person_contact: e.target.value});
                this.setState({ point_person_contact: `${e.target.value}-` });
                this.hasDash = true;
            }
        }
    }

    // for single select
    valueChange = (e, name) => {
        this.setState ({sex : e.target.value });
        
        this.setState({
            [name]: e.target.value
        });

        if(e.target.id === "school_level") {
            // do skip logics based on school_level
        }

    }

    // for multi select
    valueChangeMulti(e, name) {
        console.log(e);
        
        this.setState({
            [name]: e
        });

        if(name === "institution_type") {
            // checking with two of because when another value is selected and other is unchecked, it still does not change the state
            if(getObject('institution_other', e, 'value') != -1) {
                this.isOtherInstitution = true;
            }
            if(getObject('institution_other', e, 'value') == -1) {
                this.isOtherInstitution = false;
            }
        }
    }

    callModal = () => {
        this.setState({ modal : !this.state.modal });
    }

    // for autocomplete single select
    handleChange(e, name) {

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
    };
    
    handleSubmit = event => {
        
        console.log(event.target);
        this.handleValidation();
        const data = new FormData(event.target);
        event.preventDefault();
        console.log(data);

    }

    handleValidation(){
        // check each required state
        
        let formIsValid = true;

        let requiredFields = ["institution_type"];
        let dependentFields = ["institution_type_other"];
        this.setState({ hasError: true });
        this.setState({ hasError: this.checkValid(requiredFields) ? false : true });
        if(this.isOtherInstitution) {
            
            this.setState({ hasError: this.checkValid(dependentFields) ? false : true });
        }

        formIsValid = this.state.hasError;
        this.setState({errors: this.errors});
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


    render() {
        const { selectedOption } = this.state;
        const otherInstitutionStyle = this.isOtherInstitution ? {} : { display: 'none' };

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

                                                {/* <CardTitle>Form Details</CardTitle> */}
                                                
                                                    <TabContent activeTab={this.state.activeTab}>
                                                        <TabPane tabId="1">
                                                            
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="province" >Province</Label> <span class="errorMessage">{this.state.errors["province"]}</span>
                                                                        <Select id="province" name="province" value={this.state.province} onChange={(e) => this.handleChange(e, "province")} options={location.provinces} required/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup> 
                                                                        <Label for="district" >District</Label> <span class="errorMessage">{this.state.errors["district"]}</span>
                                                                        <Select id="district" name="district" value={this.state.district} onChange={(e) => this.handleChange(e, "district")} options={this.state.districtArray} required/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="institution_name" >Institution Name</Label> <span class="errorMessage">{this.state.errors["institution_name"]}</span>
                                                                        <Input id="institution_name" name="institution_name" value={this.state.institution_name} onChange={(e) => {this.inputChange(e, "institution_name")}} maxLength='100' pattern="^[A-Za-z. ]+" placeholder="Enter name" required/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="institution_id" >Institution ID</Label>
                                                                        <Input type="text" name="institution_id" id="institution_id" value={this.state.institution_id} onChange={(e) => {this.inputChange(e, "institution_id")}} maxLength='15' placeholder="ID" required/>
                                                                        
                                                                    </FormGroup>
                                                                </Col>
                                                                
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="partnership_start_date" >Date of Partnership with Aahung</Label> <span class="errorMessage">{this.state.errors["partnership_date"]}</span>
                                                                        <Input type="date" name="partnership_start_date" id="partnership_start_date" value={this.state.partnership_start_date} onChange={(e) => {this.inputChange(e, "partnership_start_date")}} max={moment().format("YYYY-MM-DD")} required />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="institution_type" >Type of Institution</Label> <span class="errorMessage">{this.state.errors["institution_type"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "institution_type")} value={this.state.institution_type} id="institution_type" options={institutionTypes} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="12">
                                                                    <FormGroup style={otherInstitutionStyle}>
                                                                        <Label for="institution_type_other" >Specify other type of institution</Label> <span class="errorMessage">{this.state.errors["institution_type_other"]}</span>
                                                                        <Input name="institution_type_other" id="institution_type_other" value={this.state.institution_type_other} onChange={(e) => {this.inputChange(e, "institution_type_other")}} pattern="^[A-Za-z. ]+" placeholder="Specify other" />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="projects" >Associated Projects</Label> <span class="errorMessage">{this.state.errors["projects"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "projects")} value={this.state.projects} id="projects" options={institutionTypes} />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="project_name" >Project Name</Label> <span class="errorMessage">{this.state.errors["project_name"]}</span>
                                                                        <Input name="project_name" id="project_name" value={this.state.project_name} onChange={(e) => {this.inputChange(e, "project_name")}} pattern="^[A-Za-z. ]+|^$" placeholder="Project name" />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_name" >Name of point of contact for institution</Label> <span class="errorMessage">{this.state.errors["point_person_name"]}</span>
                                                                        <Input name="point_person_name" id="point_person_name" value={this.state.point_person_name} onChange={(e) => {this.inputChange(e, "point_person_name")}} pattern="^[A-Za-z. ]+" placeholder="Enter name" required/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_contact" >Phone number for point of contact at institution</Label> <span class="errorMessage">{this.state.errors["point_person_contact"]}</span>
                                                                        <Input name="point_person_contact" id="point_person_contact" value={this.state.point_person_contact} onChange={(e) => {this.inputChange(e, "point_person_contact")}} maxLength="12" pattern="[0][3][0-9]{2}-[0-9]{7}" placeholder="Mobile Number: xxxx-xxxxxxx" required/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_email" >Email address for point of contact at institution</Label> <span class="errorMessage">{this.state.errors["point_person_email"]}</span>
                                                                        <Input name="point_person_email" id="point_person_email" value={this.state.point_person_email} onChange={(e) => {this.inputChange(e, "point_person_email")}} placeholder="Enter email" maxLength="50" pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$" required/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="student_count" >Approximate number of students</Label> <span class="errorMessage">{this.state.errors["student_count"]}</span>
                                                                        <Input type="number" name="student_count" id="student_count" value={this.state.student_count} onChange={(e) => { this.inputChange(e, "student_count") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }}  placeholder="Enter number" required/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            {/* please don't remove this div unless you are adding another form question here*/}
                                                            <div style={{height: '250px'}}><span>   </span></div>

                                                        </TabPane>
                                                        
                                                    </TabContent>
                                                
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
                                                        {/* <ButtonGroup size="sm">
                                                            <Button color="secondary" id="page1"
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '1' })}
                                                                onClick={() => {
                                                                    this.toggle('1');
                                                                }}
                                                            >Page 1</Button>
                                                            <Button color="secondary" id="page2" style={page2style}
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '2' })}
                                                                onClick={() => {
                                                                    this.toggle('2');
                                                                }}
                                                            >Page 2</Button>

                                                        </ButtonGroup> */}
                                                    </Col>
                                                    <Col md="3">
                                                    </Col>
                                                    <Col md="3">
                                                    </Col>
                                                    <Col md="3">
                                                        {/* <div className="btn-actions-pane-left"> */}
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit" >Submit</Button>
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


