/*
 * @Author: tahira.niazi@ihsinformatics.com 
 * @Date: 2019-09-08 16:14:21 
 * @Last Modified by:   tahira.niazi@ihsinformatics.com 
 * @Last Modified time: 2019-09-13 02:04:19 
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
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCardBody,
    MDBModalFooter,
    MDBBtn,
    MDBInput,
    MDBModal, MDBModalBody, MDBModalHeader,
  } from "mdbreact";
import "../index.css"
import classnames from 'classnames';
import Select from 'react-select';
import CustomModal from "../alerts/CustomModal";
import LoadingIndicator from "../widget/LoadingIndicator";
import { getObject} from "../util/AahungUtil.js";
import moment from 'moment';
import { saveDonor } from "../service/PostService";

class DonorRegistration extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            activeTab: '1',
            page2Show: true,
            viewMode: false,
            editMode: false,
            loading: false,
            errors: {},
            hasError: false,
            modal: false,
            modalText: '',
            okButtonStyle: {},
            modalHeading: '',
        };

        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.inputChange = this.inputChange.bind(this);

        this.jsonData = {};

        this.formRef = React.createRef();

    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.beforeunload.bind(this));
    }

    componentWillUnmount() {
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
        let errors = {};
        //reset
        alert(this.formRef);
        console.log(this.formRef);
        this.formRef.current.reset()
    }

    // for autocomplete single select
    handleChange(e, name) {

        this.setState({
            [name]: e
        });

        if(name === "donor_id") {
            
            this.setState({
                donor_name : e.shortName
            })
        }
    };

    // for text and numeric questions
    inputChange(e, name) {

        this.setState({
            [name]: e.target.value
        });     
        
        if(name === "donor_name" && (e.target.value != null && e.target.value != '')) {

            var name = e.target.value;
            var shortName = name.match(/\b(\w)/g);
            shortName = shortName.join('').toUpperCase();
            console.log(shortName);
            this.setState({
                donor_id : shortName
            })
        }
        else {
            this.setState({
                donor_id : ''
            })
        }
    }

    

    callModal = () => {
        this.setState({ modal : !this.state.modal });
    }



    handleSubmit = event => {

        event.preventDefault();
        this.setState({ 
            // form_disabled: true,
            loading : true
        })

        const data = new FormData(event.target);
        console.log(data);
        var jsonData = {};
        jsonData['donorName'] =  data.get('donor_name');
        jsonData['shortName'] =  data.get('donor_id');
        
        console.log(jsonData);
        saveDonor(jsonData)
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
                }
                else if(String(responseData).includes("Error")) {
                    
                    var submitMsg = '';
                    submitMsg = "Unable to submit donor. \
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

    toggle = () => {
        this.setState({
          modal: !this.state.modal
        });
    }
    
    render() {

        // for view mode
        const setDisable = this.state.viewMode ? "disabled" : "";

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
                            <Form id="donorForm" onSubmit={this.handleSubmit} className='form'  innerRef={this.formRef}>
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>Donor Registration</b>
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
                                                
                                                <fieldset >
                                                    <TabContent activeTab={this.state.activeTab}>
                                                        <TabPane tabId="1">
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="donor_name" >Donor Name</Label>
                                                                        <Input name="donor_name" id="donor_name" value={this.state.donor_name} onChange={(e) => {this.inputChange(e, "donor_name")}} maxLength="200" placeholder="Enter name"  required/>
                                                                    </FormGroup>
                                                                </Col>
                                                          
                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="donor_id" >Donor ID</Label> 
                                                                        <Input name="donor_id" id="donor_id" value={this.state.donor_id} onChange={(e) => {this.inputChange(e, "donor_id")}} maxLength="20" placeholder="Donor ID"  required/>
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
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit">Submit</Button>
                                                        <Button className="mb-2 mr-2" color="danger" size="sm" type="reset" onClick={this.cancelCheck} >Clear</Button>
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
                                        <MDBBtn color="secondary" onClick={this.toggle}>Cancel</MDBBtn>
                                        <MDBBtn color="primary" style={this.state.okButtonStyle} onClick={this.confirm}>OK!</MDBBtn>
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

export default DonorRegistration;