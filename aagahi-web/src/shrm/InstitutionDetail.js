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
            date_start: '',
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
            donor_name: '',
            activeTab: '1',
            page2Show: true,
            isOtherSubject : false,
            errors: {},
        };


        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.inputChange = this.inputChange.bind(this);
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
        console.log(this.state.date_start);
    }

    inputChange(e, name) {

        // appending dash to contact number after 4th digit
        if(name === "donor_name") {
            this.setState({ donor_name: e.target.value});
            let hasDash = false;
            if(e.target.value.length == 4 && !hasDash) {
                this.setState({ donor_name: ''});
            }
            if(this.state.donor_name.length == 3 && !hasDash) {
                this.setState({ donor_name: ''});
                this.setState({ donor_name: e.target.value});
                this.setState({ donor_name: `${e.target.value}-` });
                this.hasDash = true;
            }
        }

        if(name === "date_start") {
            this.setState({ date_start: e.target.value});
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
        // alert(e.length);
        // alert(value[0].label + "  ----  " + value[0].value);
        
        this.setState({
            [name]: e
        });

        if(name === "subject_taught") {
            // alert(getObject('other', e, 'value'));
            
            // checking with two of because when another value is selected and other is unchecked, it still does not change the state
            if(getObject('other', e, 'value') != -1) {
                this.setState( {isOtherSubject: true});
            }
            if(getObject('other', e, 'value') == -1) {
                this.setState( {isOtherSubject: false});
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

        console.log(this.state.selectedOption)
        console.log("=============")
        // console.log(`Option selected:`, school_id);
        console.log(this.state.school_id);
        // console.log(this.state.school_id.value);
    };
    

    // handleOnSubmit = e => {
    //     e.preventDefault();
    //     // pass form data
    //     // get it from state
    //     const formData = {};
    //     this.finallySubmit(formData);
    //   };

    finallySubmit = formData => {
    };

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        console.log(data.get('participantScore'));

        fetch('/api/form-submit-url', {
            method: 'POST',
            body: data,
        });

    }



    render() {
        const { selectedOption } = this.state;
        const otherSubjectStyle = this.state.isOtherSubject ? {} : { display: 'none' };

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
                                                <span class="errorMessage"><u>Errors: <br/></u> Form has some errors. Please check for reqired and invalid fields.<br/></span>
                                                </div>

                                                <br/>

                                                {/* <CardTitle>Form Details</CardTitle> */}
                                                <Form id="testForm" >
                                                    <TabContent activeTab={this.state.activeTab}>
                                                        <TabPane tabId="1">
                                                            
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="province">Province</Label> <span class="errorMessage">{this.state.errors["province"]}</span>
                                                                        <Select id="province"
                                                                            name="province"
                                                                            value={this.state.province}
                                                                            onChange={(e) => this.handleChange(e, "province")}
                                                                            options={options}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="district" >District</Label> <span class="errorMessage">{this.state.errors["district"]}</span>
                                                                        <Select id="district"
                                                                            name="district"
                                                                            value={this.state.district}
                                                                            onChange={(e) => this.handleChange(e, "district")}
                                                                            options={options}
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="institution_name" >Teacher Name</Label>
                                                                        <Input id="institution_name" name="institution_name" value={this.state.institution_name} onChange={(e) => {this.inputChange(e, "institution_name")}} maxLength='100' required/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="institution_id" >Institution ID</Label>
                                                                        <Input type="text" name="institution_id" id="institution_id" value={this.state.institution_id} onChange={(e) => {this.inputChange(e, "institution_id")}} maxLength='15' required/>
                                                                        
                                                                    </FormGroup>
                                                                </Col>
                                                                
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="partnership_start_date" >Date of Partnership with Aahung</Label> <span class="errorMessage">{this.state.errors["partnership_date"]}</span>
                                                                        <Input type="date" name="partnership_start_date" id="partnership_start_date" value={this.state.partnership_start_date} onChange={(e) => {this.inputChange(e, "partnership_start_date")}} required />
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
                                                                    <FormGroup >
                                                                        {/* TODO: hide this field based on above question */}
                                                                        <Label for="institution_type_other" >Specify other type of institution</Label>
                                                                        <Input name="institution_type_other" id="institution_type_other" value={this.state.institution_type_other} onChange={(e) => {this.inputChange(e, "institution_type_other")}} placeholder="Specify other" />
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
                                                                        <Label for="project_name" >Project Name</Label>
                                                                        <Input name="project_name" id="project_name" value={this.state.project_name} onChange={(e) => {this.inputChange(e, "project_name")}} placeholder="Project name" />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_name" >Name of point of contact for institution</Label> <span class="errorMessage">{this.state.errors["point_person_name"]}</span>
                                                                        <Input name="point_person_name" id="point_person_name" value={this.state.point_person_name} onChange={(e) => {this.inputChange(e, "point_person_name")}} placeholder="Enter name" required/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_contact" >Phone number for point of contact at institution</Label> <span class="errorMessage">{this.state.errors["point_person_contact"]}</span>
                                                                        <Input name="point_person_contact" id="point_person_contact" value={this.state.point_person_contact} onChange={(e) => {this.inputChange(e, "point_person_contact")}} placeholder="Project number" required/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_email" >Email address for point of contact at institution</Label> <span class="errorMessage">{this.state.errors["point_person_email"]}</span>
                                                                        <Input name="point_person_email" id="point_person_email" value={this.state.point_person_email} onChange={(e) => {this.inputChange(e, "point_person_email")}} placeholder="Enter email" maxLength="50" required/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="student_count" >Approximate number of students</Label> <span class="errorMessage">{this.state.errors["student_count"]}</span>
                                                                        <Input name="student_count" id="student_count" value={this.state.student_count} onChange={(e) => {this.inputChange(e, "student_count")}} placeholder="Enter number" maxLength="50" required/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            {/* please don't remove this div unless you are adding another form question here*/}
                                                            <div style={{height: '250px'}}><span>   </span></div>

                                                        </TabPane>
                                                        
                                                    </TabContent>
                                                </Form>

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
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit" onClick={this.handleSubmit} >Submit</Button>
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
                            </Container>

                        </div>
                    </ReactCSSTransitionGroup>
                </Fragment>

            </div>
        );
    }

}

export default InstitutionDetails;


