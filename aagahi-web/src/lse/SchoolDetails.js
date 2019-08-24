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
import "../index.css";
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse, MDBNavItem, MDBNavLink, MDBContainer, MDBView, MDBMask, MDBBtn, MDBIcon, MDBDropdown, MDBDropdownItem, MDBDropdownToggle, MDBDropdownMenu, MDBRow, MDBCol, MDBFooter } from 'mdbreact';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import aahunglogo from "../img/aahung-logo.svg";
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

const programsImplemented = [  /* value will be replaced with uuids */
    { label: 'CSA', value: 'csa'},
    { label: 'Gender', value: 'gender'},
    { label: 'LSBE', value: 'lsbe'},
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
            program_implemented : [],
            school_level : 'Secondary',
            school_tier: 'New',
            activeTab: '1',
            selectedOption: null,
            page2Show: true,
            isTierNew: true,
            isTierRunning: false,
            isTierExit: false,
            isView: false,
            errors: {},
            // modal: false,
        };


        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
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
        // this.setState({ page2Show: false });
        
    }

    // for single select
    valueChange = (e, name) => {
        console.log(e.target.id);
        console.log(e.target.value);

        this.setState({
            [name]: e.target.value
        });

        if(e.target.id === "school_level") {
            // do skip logics based on school_level
        }
        
        if (name === "school_tier") {
            if(e.target.value === "new") {
                this.setState({isTierNew : true });
                this.setState({isTierRunning : false });
                this.setState({isTierExit : false });
            }
            else if(e.target.value === "running") {
                this.setState({isTierNew : false });
                this.setState({isTierRunning : true });
                this.setState({isTierExit : false });
            }
            else if(e.target.value === "exit") {
                this.setState({isTierNew : false });
                this.setState({isTierRunning : false });
                this.setState({isTierExit : true });
            }
        }

    }

    inputChange(e, name) {
        // appending dash to contact number after 4th digit
        if(name === "point_person_contact") {
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

    // for multi select
    valueChangeMulti(e) {
        console.log(e);
        
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
        const newSchoolStyle = this.state.isTierNew ? {} : { display: 'none' };
        const runningSchoolStyle = this.state.isTierRunning ? {} : { display: 'none' };
        const exitSchoolStyle = this.state.isTierExit ? {} : { display: 'none' };
        var navBarStyle= '';
        var spanDivStyle = '';
        if(this.props.location.state !== undefined) {
            navBarStyle = this.props.location.state.xyz ? {} : { display: 'none' };
            spanDivStyle = this.props.location.state.xyz ? {height: "3.2em"} : { display: 'none' };
        }
        else {
            navBarStyle = { display: 'none' };
            spanDivStyle = { display: 'none' };
        }

        const { selectedOption } = this.state;

        return (
            <div >
                <div id="spanSpaceDiv" style={spanDivStyle}><span>   </span></div>
            <Router>
                    <header >
                        <MDBNavbar color="black" fixed="top" dark expand="md" style={navBarStyle}>
                            <MDBContainer>
                                <img src={aahunglogo} alt="thumbnail" height="60" />
                                <MDBNavbarBrand href="/">
                                    <strong>AAHUNG</strong>
                                </MDBNavbarBrand>
                                <MDBNavbarToggler onClick={this.onClick} />
                                <MDBCollapse isOpen={this.state.collapse} navbar>
                                    <MDBNavbarNav left>
                                        {/* <MDBNavItem active>
                      <MDBNavLink to="#">Home</MDBNavLink>
                    </MDBNavItem> */}
                                        {/* <MDBNavItem>
                      <MDBNavLink to="#">Link</MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                      <MDBNavLink to="#">Profile</MDBNavLink>
                    </MDBNavItem> */}
                                    </MDBNavbarNav>
                                    <MDBNavbarNav right>
                                        <MDBNavItem>
                                            <MDBDropdown>
                                                <MDBDropdownToggle nav caret>
                                                    <MDBIcon icon="user" />
                                                </MDBDropdownToggle>
                                                <MDBDropdownMenu className="dropdown-default">
                                                    <MDBDropdownItem href="/">Logout</MDBDropdownItem>
                                                    <MDBDropdownItem href="/mainMenu">Back</MDBDropdownItem>
                                                    <MDBDropdownItem href="#!">Something else here</MDBDropdownItem>
                                                    <MDBDropdownItem href="#!">Something else here</MDBDropdownItem>
                                                </MDBDropdownMenu>
                                            </MDBDropdown>
                                        </MDBNavItem>
                                    </MDBNavbarNav>
                                </MDBCollapse>
                            </MDBContainer>
                        </MDBNavbar>

                        {/* <MDBContainer> */}
                            {/* <MDBRow> */}
                        
                        {/* </MDBRow> */}
                        {/* </MDBContainer> */}
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
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            {/* <CardBody> */}

                                            {/* <h6><b>Parent Organization Registration</b></h6> */}

                                            {/* </CardBody> */}

                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>School Details Form</b>
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

                                                                        <Input type="date" name="date_start" id="date_start" />


                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="province" >Province</Label> <span class="errorMessage">{this.state.errors["province"]}</span>
                                                                        {/* <Label for="count" >User ID</Label> */}
                                                                        <Select id="province"
                                                                            name="province"
                                                                            value={selectedOption}
                                                                            onChange={this.handleChange}
                                                                            options={options}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="district" >District</Label> <span class="errorMessage">{this.state.errors["district"]}</span>
                                                                        <Select id="district"
                                                                            name="district"
                                                                            value={selectedOption}
                                                                            onChange={this.handleChange}
                                                                            options={options}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="parent_organization_id" >Parent Organization ID</Label> <span class="errorMessage">{this.state.errors["district"]}</span>
                                                                        <Select id="parent_organization_id"
                                                                            name="parent_organization_id"
                                                                            value={selectedOption}
                                                                            onChange={this.handleChange}
                                                                            options={options}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="parent_organization_name" >Parent Organization Name</Label>  
                                                                        <Input name="parent_organization_name" id="parent_organization_name" disabled />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_name" >School Name</Label> <span class="errorMessage">{this.state.errors["school_name"]}</span>
                                                                        <Input name="school_name" id="school_name" value={this.state.school_name} placeholder="Enter school name" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        {/* TODO: autogenerate school ID */} 
                                                                        <Label for="school_id" >School ID</Label> <span class="errorMessage">{this.state.errors["school_id"]}</span>
                                                                        <Input name="school_id" id="school_id" value={this.state.school_id} disabled />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="partnership_date" >Date partnership with Aahung was formed</Label> <span class="errorMessage">{this.state.errors["partnership_date"]}</span>
                                                                        <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} required />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="partnership_years" >Number of years of partnership</Label> <span class="errorMessage">{this.state.errors["partnership_years"]}</span>
                                                                        <Input name="partnership_years" id="partnership_years" disabled />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_type" >Type of School</Label> <span class="errorMessage">{this.state.errors["school_type"]}</span>
                                                                        <Input type="select" name="school_type" id="school_type" onChange={(e) => this.valueChange(e, "school_type")} value={this.state.school_type}>
                                                                            <option>Public</option>
                                                                            <option>Private</option>
                                                                            <option>Government Adopted by Private</option>
                                                                            <option>local Government Schools</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_sex" >Classification of School by Sex</Label> <span class="errorMessage">{this.state.errors["school_sex"]}</span>
                                                                        <Input type="select" name="school_sex" id="school_sex" onChange={(e) => this.valueChange(e, "school_sex")} value={this.state.school_sex}>
                                                                            <option>Girls</option>
                                                                            <option>Boys</option>
                                                                            <option>Co-ed</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>


                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                <Label for="school_level" >Level of Program</Label>
                                                                    <FormGroup tag="fieldset" row>
                                                                        
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="school_level" id="primary" value="Primary" /* checked= {this.state.sex === 'Male'} */ onChange={(e) => this.valueChange(e, "school_level")} />{' '}
                                                                                Primary
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="school_level" id="secondary" value="Secondary" /* checked= {this.state.sex === 'Female'} */  onChange={(e) => this.valueChange(e, "school_level")} />{' '}
                                                                                Secondary
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["school_level"]}</span>
                                                                        </Col>
                                                                    </FormGroup>

                                                                </Col>
                                                                <Col md="6">
                                                                <FormGroup >
                                                                        <Label for="program_implemented" >Type of program(s) implemented in school</Label> <span class="errorMessage">{this.state.errors["program_implemented"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e)} value={this.state.program_implemented} id="program_implemented" options={programsImplemented} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            {/* please don't remove this div unless you are adding another form question here*/}
                                                            {/* <div style={{height: '160px'}}><span>   </span></div> */}

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
                                                                {/* TODO: handle input change */}
                                                                    <FormGroup >
                                                                        <Label for="donor_name" >Donor Name</Label>
                                                                        <Input name="donor_name" id="donor_name" disabled />
                                                                    </FormGroup>
                                                                </Col>


                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_tier" >School Tier</Label> <span class="errorMessage">{this.state.errors["school_tier"]}</span>
                                                                        <Input type="select" name="school_tier" id="school_tier" onChange={(e) => this.valueChange(e, "school_tier")} value={this.state.school_tier}>
                                                                            <option value="new">New</option>
                                                                            <option value="running">Running</option>
                                                                            <option value="exit">Exit</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup style={newSchoolStyle}>
                                                                        <Label for="school_category_new" >New Schools Category</Label> <span class="errorMessage">{this.state.errors["school_category_new"]}</span>
                                                                        <Input type="select" name="school_category_new" id="school_category_new" onChange={(e) => this.valueChange(e, "school_category_new")} value={this.state.school_category_new}>
                                                                            <option>Newly Inducted</option>
                                                                            <option>Implementation > 1 Cycle</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                            
                                                                <Col md="6">
                                                                    <FormGroup style={runningSchoolStyle}>
                                                                        <Label for="school_category_running" >Running Schools Category</Label> <span class="errorMessage">{this.state.errors["school_category_running"]}</span>
                                                                        <Input type="select" name="school_category_running" id="school_category_running" onChange={(e) => this.valueChange(e, "school_category_running")} value={this.state.school_category_running}>
                                                                            <option>Low Performing</option>
                                                                            <option>Average Performing</option>
                                                                            <option>High Performing</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup style={exitSchoolStyle}>
                                                                        <Label for="school_category_exit" >Exit Schools Category</Label> <span class="errorMessage">{this.state.errors["school_category_exit"]}</span>
                                                                        <Input type="select" name="school_category_exit" id="school_category_exit" onChange={(e) => this.valueChange(e, "school_category_exit")} value={this.state.school_category_exit}>
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
                                                                        <Label for="point_person_name" >Name of point of contact for school</Label> <span class="errorMessage">{this.state.errors["point_person_name"]}</span>
                                                                        <Input name="point_person_name" id="point_person_name" value={this.state.point_person_name} onChange={(e) => {this.inputChange(e, "point_person_name")}} placeholder="Enter Name" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_contact" >Phone number for point of contact at school</Label> <span class="errorMessage">{this.state.errors["point_person_contact"]}</span>
                                                                        <Input name="point_person_contact" id="point_person_contact" value={this.state.point_person_contact} onChange={(e) => {this.inputChange(e, "point_person_contact")}} maxLength="12" />
                                                                    </FormGroup>
                                                                </Col>


                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_email" >Email address for point of contact at school</Label> <span class="errorMessage">{this.state.errors["point_person_email"]}</span>
                                                                        <Input type="email" name="point_person_email" id="point_person_email" value={this.state.point_person_email} onChange={(e) => {this.inputChange(e, "point_person_email")}} />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_students" >Approximate number of students </Label> <span class="errorMessage">{this.state.errors["school_students"]}</span>
                                                                        <Input type="number" value={this.state.school_students} name="school_students" id="school_students" onChange={(e) => {this.inputChange(e, "school_students")}} max="99999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,5)}} placeholder="Enter count in numbers"></Input>
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

export default SchoolDetails;


