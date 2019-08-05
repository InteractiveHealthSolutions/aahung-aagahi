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


const options = [
    { value: 'Sindh', label: 'Sindh' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Balochistan', label: 'Balochistan' },
    { value: 'Khyber Pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
];

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
    { value: 'Sindh', label: 'Sindh' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Balochistan', label: 'Balochistan' },
    { value: 'Khyber Pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
];

class SchoolDetails extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            // TODO: all form element values listed below
            // program_implemented : [{value: 'csa'},
            // {value: 'gender'}],
            elements: ['program_implemented', 'school_level','donor_name'],
            program_implemented : [], // all the form elements states are in underscore notation i.e variable names in codebook
            school_level : 'Primary',
            sex : '',
            subject_taught: '',
            activeTab: '1',
            selectedOption: null,
            page2Show: true,
            // modal: false,
        };


        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
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

        alert(this.state.program_implemented + " ----- " + this.state.school_level + "-----" + this.state.sex);
    }

    // for single select
    valueChange = (e, name) => {
        this.setState ({sex : e.target.value });
        alert(e.target.id + " value changed called!");
        alert(e.target.value + " is the value.");
        this.setState ({sex : e.target.value });
        

        this.setState({
            [name]: e.target.value
        });

        alert("Sex state value" + this.state.sex); // for some reason not displaying selectedSex value that should be either Male, Female or Other

        if(e.target.id === "school_level") {
            // do skip logics based on school_level
        }

    }

    // for multi select
    valueChangeMulti(e) {
        alert(e);
        console.log(e);
        alert(e.length);
        // alert(value[0].label + "  ----  " + value[0].value);
        
        this.setState({
            program_implemented: e
        });
    }

    callModal = () => {
        this.setState({ modal : !this.state.modal });
    }

    handleChange = selectedOption => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
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
                                                                        <Input type="date" name="date_start" id="date_start" required/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="participant_id" >Teacher ID</Label>
                                                                        <Input type="text" name="participant_id" id="participant_id" maxLength='10' required/>
                                                                        
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="participant_name" >Teacher Name</Label>
                                                                        <Input id="participant_name" name="participant_name" maxLength='30' required/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="dob" >Date of Birth</Label>
                                                                        <Input type="date" name="dob" id="dob" required/>
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
                                                                        <Input name="school_id" id="school_id" />
                                                                        <Select id="school_id"
                                                                            name="school_id"
                                                                            value={selectedOption}
                                                                            onChange={this.handleChange}
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
                                                                        <Label for="partnership_years" >Number of years of partnership</Label>
                                                                        <Input name="partnership_years" id="partnership_years" disabled />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_type" >Type of School</Label>
                                                                        <Input type="select" name="school_type" id="school_type">
                                                                            <option>Public</option>
                                                                            <option>Private</option>
                                                                            <option>Government Adopted by Private</option>
                                                                            <option>local Government Schools</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_sex" >Classification of School by Sex</Label>
                                                                        <Input type="select" name="school_sex" id="school_sex">
                                                                            <option>Girls</option>
                                                                            <option>Boys</option>
                                                                            <option>Co-ed</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>


                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_level" >Level of Program</Label>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "school_level")} value={this.state.school_level} name="school_level" id="school_level">
                                                                            <option value="primary">Primary</option>
                                                                            <option value="secondary">Secondary</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                <FormGroup >
                                                                        <Label for="program_implemented" >Type of program(s) implemented in school</Label>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e)} value={this.state.program_implemented} id="program_implemented" options={programsImplemented} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            {/* please don't remove this div unless you are adding another form question here*/}
                                                            <div style={{height: '160px'}}><span>   </span></div>

                                                        </TabPane>
                                                        <TabPane tabId="2" id="testTab">
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="donor_id" >Donor ID</Label>
                                                                        <Select id="donor_id"
                                                                            name="donor_id"
                                                                            value={selectedOption}
                                                                            onChange={this.handleChange}
                                                                            options={options}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="donor_name" >Donor Name</Label>
                                                                        <Input name="donor_name" id="donor_name" disabled />
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


