/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-07-30 12:53:25
 * @modify date 2019-07-30 12:53:25
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
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';


// const options = [
//     { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Sindh' },
//     { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Punjab' },
//     { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Balochistan' },
//     { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Khyber Pakhtunkhwa' },
// ];

const programsImplemented = [
    { label: 'CSA', value: 'csa'},
    { label: 'Gender', value: 'gender'},
    { label: 'LSBE', value: 'lsbe'},
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

class SchoolDetails extends React.Component {

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
            // school_id: null,
            page2Show: true,
            // modal: false,
        };


        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.getObject = this.getObject.bind(this);
        this.inputChange = this.inputChange.bind(this);
    }

    componentDidMount() {
        // alert("School Details: Component did mount called!");
        // this.cancelCheck = this.cancelCheck.bind(this);
        window.addEventListener('beforeunload', this.beforeunload.bind(this));
    }

    componentWillUnmount() {

        // alert("School Details: ComponentWillUnMount called!");
        window.removeEventListener('beforeunload', this.beforeunload.bind(this));
        // alert(this.modal);
        // this.modal = !this.modal;
        // alert(this.modal);
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    beforeunload(e) {
        // if (this.props.dataUnsaved) {
          e.preventDefault();
          e.returnValue = true;
        // }
      }


    cancelCheck = () => {
        // alert("trying to hide tab");
        // this.setState({ page2Show: false });

        console.log(" ============================================================= ")
        // alert(this.state.program_implemented + " ----- " + this.state.school_level + "-----" + this.state.sex);
        console.log("program_implemented below:");
        console.log(this.state.program_implemented);
        console.log("school_level below:");
        console.log(this.state.school_level);
        console.log("school_id below:");
        console.log(this.state.school_id);
        console.log(this.getObject('khyber_pakhtunkhwa', schools, 'value'));
        console.log(this.state.donor_name);
        // this.setState({ school_id : this.getObject('khyber_pakhtunkhwa', schools, 'value')});
    }

    // appending dash to contact number after 4th digit
    inputChange(e) {
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


    // setting autocomplete single select tag when receiving value from server
    // value is the uuid, arr is the options array, prop either label/value, mostly value because it is uuid
    getObject(value, arr, prop) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i][prop] === value) {
                alert(arr[i]);
                return arr[i];

            }
        }
        return -1; //to handle the case where the value doesn't exist
    }

    // for single select
    valueChange = (e, name) => {
        this.setState ({sex : e.target.value });
        // alert(e.target.id + " value changed called!");
        // alert(e.target.value + " is the value.");
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
        alert("Form submitted!");
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

        const page2style = this.state.page2Show ? {} : { display: 'none' };
        const { selectedOption } = this.state;

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
                                                <b>Partcipant Details Form</b>
                                            </CardHeader>

                                        </Card>
                                    </Col>

                                </Row>

                                {/* <br/> */}

                                <Row>
                                    <Col md="12">
                                        <Card className="main-card mb-6 center-col">
                                            <CardBody>

                                                {/* <CardTitle>Form Details</CardTitle> */}
                                                <Form id="testForm" >
                                                    <TabContent activeTab={this.state.activeTab}>
                                                        <TabPane tabId="1">
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup inline>
                                                                        <Label for="date_start" >Form Date</Label>
                                                                        <Input type="date" name="date_start" id="date_start" value={this.state.date_start} required/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="participant_id" >Teacher ID</Label>
                                                                        <Input type="text" name="participant_id" id="participant_id" value={this.state.participant_id} maxLength='10' required/>
                                                                        
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="participant_name" >Teacher Name</Label>
                                                                        <Input id="participant_name" name="participant_name" value={this.state.participant_name} maxLength='30' required/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="dob" >Date of Birth</Label>
                                                                        <Input type="date" name="dob" id="dob" value={this.state.dob} required/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                <FormGroup tag="fieldset" row>
                                                                <legend className="col-form-label col-sm-2">Sex</legend>
                                                                <Col sm={10}>
                                                                    <FormGroup check inline>
                                                                    <Label check>
                                                                        <Input type="radio" name="sex" id="sex" value="Male" /* checked= {this.state.sex === 'Male'} */ onChange={(e) => this.valueChange(e, "sex")} />{' '}
                                                                        Male
                                                                    </Label>
                                                                    </FormGroup>
                                                                    <FormGroup check inline>
                                                                    <Label check>
                                                                        <Input type="radio" name="sex" id="sex" value="Female" /* checked= {this.state.sex === 'Female'} */  onChange={(e) => this.valueChange(e, "sex")} />{' '}
                                                                        Female
                                                                    </Label>
                                                                    </FormGroup>
                                                                    <FormGroup check inline>
                                                                    <Label check>
                                                                        <Input type="radio" name="sex" id="sex" value="Other" /* checked= {this.state.sex === 'Other'} */ onChange={(e) => this.valueChange(e, "sex")} />{' '}
                                                                        Other
                                                                    </Label>
                                                                    </FormGroup>
                                                                </Col>
                                                                </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                <FormGroup >
                                                                        <Label for="school_id" >School ID</Label>
                                                                        <Select id="school_id"
                                                                            name="school_id"
                                                                            value={this.state.school_id}
                                                                            onChange={(e) => this.handleChange(e, "school_id")}
                                                                            options={schools}
                                                                        />
                                                                    </FormGroup>                                                                    
                                                                </Col>
                                                                <Col md="6">

                                                                    <FormGroup >
                                                                        <Label for="school_name" >School Name</Label>
                                                                        <Input name="school_name" id="school_name" placeholder="Enter school name" />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="subject_taught" >Subject(s) taught</Label>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e)} value={this.state.subject_taught} id="subject_taught" options={subjectsTaught} required/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="subject_taught_other" >Specify Other</Label>
                                                                        {/* TODO: hide this field based on above question */}
                                                                        <Input name="subject_taught_other" id="subject_taught_other" value={this.subject_taught_other} placeholder="Other subjects" />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="teaching_years" >Number of years teaching</Label>
                                                                        <Input type="number" name="teaching_years" id="teaching_years" value={this.teaching_years} />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="education_level" >Level of Education</Label>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "education_level")} value={this.state.education_level} name="education_level" id="education_level">
                                                                            {/* TODO: fill UUIDs */}
                                                                            <option value="no_edu">No Education</option>
                                                                            <option value="some_pri">Some Primary</option>
                                                                            <option value="pri">Primary</option>
                                                                            <option value="sec">Secondary</option>
                                                                            <option value="col">College</option>
                                                                            <option value="under">Undergraduate</option>
                                                                            <option value="post">Post-graduate</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                        </TabPane>
                                                        <TabPane tabId="2" id="testTab">
                                                            <Row>
                                                                <Col md="6">
                                                                    {/* <FormGroup >
                                                                        <Label for="donor_id" >Donor ID</Label>
                                                                        <Select id="donor_id"
                                                                            name="donor_id"
                                                                            value={selectedOption}
                                                                            onChange={this.handleChange}
                                                                            options={options}
                                                                        />
                                                                    </FormGroup> */}
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="donor_name" >Donor Name</Label>
                                                                        <Input name="donor_name" id="donor_name" onChange={(e) => {this.inputChange(e)}}  value={this.state.donor_name} maxLength="12" placeholder="03XX-XXXXXXX" />  
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_tier" >School Tier</Label>
                                                                        <Input type="select" name="school_tier" id="school_tier">
                                                                            <option>New</option>
                                                                            <option>Running</option>
                                                                            <option>Exit</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_category_new" >New Schools Category</Label>
                                                                        <Input type="select" name="school_category_new" id="school_category_new">
                                                                            <option>Newly Inducted</option>
                                                                            <option>Implementation > 1 Cycle</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_category_running" >Running Schools Category</Label>
                                                                        <Input type="select" name="school_category_running" id="school_category_running">
                                                                            <option>Low Performing</option>
                                                                            <option>Average Performing</option>
                                                                            <option>High Performing</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_category_exit" >Exit Schools Category</Label>
                                                                        <Input type="select" name="school_category_exit" id="school_category_exit">
                                                                            <option>Initial Phase</option>
                                                                            <option>Mid Phase</option>
                                                                            <option>Exit Phase</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>


                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_name" >Name of point of contact for school</Label>
                                                                        <Input name="point_person_name" id="point_person_name" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_contact" >Phone number for point of contact at school</Label>
                                                                        <Input name="point_person_contact" id="point_person_contact" maxLength="12" />
                                                                    </FormGroup>
                                                                </Col>


                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_email" >Email address for point of contact at school</Label>
                                                                        <Input type="email" name="point_person_email" id="point_person_email" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_students" >Approximate number of students </Label>
                                                                        <Input type="number" name="school_students" id="school_students" maxLength="5" />
                                                                    </FormGroup>
                                                                </Col>


                                                            </Row>
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
                                                        {/* <div className="btn-actions-pane-left"> */}
                                                        <ButtonGroup size="sm">
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

                                                        </ButtonGroup>
                                                        {/* </div> */}
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

export default SchoolDetails;


