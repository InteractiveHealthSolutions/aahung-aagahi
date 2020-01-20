/*
 * @Author: tahira.niazi@ihsinformatics.com 
 * @Date: 2019-09-08 16:14:21 
 * @Last Modified by: tahira.niazi@ihsinformatics.com
 * @Last Modified time: 2020-01-20 12:07:07
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
import { BrowserRouter as Router } from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, TabContent, TabPane } from 'reactstrap';
import CustomModal from "../alerts/CustomModal";
import "../index.css";
import { getDonorByRegexValue } from '../service/GetService';
import { saveDonor, updateDonor } from "../service/PostService";
import FormNavBar from "../widget/FormNavBar";
import LoadingIndicator from "../widget/LoadingIndicator";

class DonorRegistration extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            activeTab: '1',
            page2Show: true,
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
        this.editMode = false;
        this.jsonData = {};
        this.formRef = React.createRef();
        this.editMode = false;
        this.fetchedDonor = {};
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

        this.editMode = (this.props.location.state !== undefined && this.props.location.state.edit) ? true : false;
        this.setState({
            loading: true,
            loadingMsg: 'Fetching Data...'
        })

        try {

            if (this.editMode) {
                this.fetchedDonor = await getDonorByRegexValue(String(this.props.location.state.donorId), true);
                if (this.fetchedDonor !== null) {
                    this.setState({
                        donor_name: this.fetchedDonor.donorName,
                        donor_id: this.fetchedDonor.shortName
                    })
                }
                else {
                    throw new Error("Unable to get donor details (this may be a voided record). Please see error logs for more details.");
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

    beforeunload(e) {
        e.preventDefault();
        e.returnValue = true;
    }

    cancelCheck = () => {
        this.resetForm();
    }

    // for autocomplete single select
    handleChange(e, name) {

        this.setState({
            [name]: e
        });

        if (name === "donor_id") {
            this.setState({
                donor_name: e.shortName
            })
        }
    };

    // for text and numeric questions
    inputChange(e, name) {

        this.setState({
            [name]: e.target.value
        });

        if (!this.editMode) {
            if (name === "donor_name" && (e.target.value != null && e.target.value != '')) {
                var name = e.target.value;
                var shortName = name.match(/\b(\w)/g);
                if (shortName != null) {
                    shortName = shortName.join('').toUpperCase();
                    console.log(shortName);
                    this.setState({
                        donor_id: shortName
                    })
                }
            }
            else {
                this.setState({
                    donor_id: ''
                })
            }
        }
    }

    callModal = () => {
        this.setState({ modal: !this.state.modal });
    }

    handleSubmit = event => {

        event.preventDefault();
        this.setState({
            loading: true,
            loadingMsg: "Saving trees..."
        })
        if (this.editMode) {

            this.fetchedDonor.donorName = this.state.donor_name;
            this.fetchedDonor.shortName = this.state.donor_id;
            delete this.fetchedDonor.createdBy;
            delete this.fetchedDonor.updatedBy;

            updateDonor(this.fetchedDonor, this.fetchedDonor.uuid)
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
                            submitMsg = "Unable to update Donor details. \
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

            const data = new FormData(event.target);
            console.log(data);
            var jsonData = {};
            jsonData['donorName'] = data.get('donor_name');
            jsonData['shortName'] = data.get('donor_id');
            console.log(jsonData);

            saveDonor(jsonData)
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

                            this.resetForm();
                        }
                        else if (String(responseData).includes("406")) {

                            var submitMsg = '';
                            submitMsg = "Data already exists. \
                        " + String(responseData);

                            this.setState({
                                loading: false,
                                modalHeading: 'Fail!',
                                okButtonStyle: { display: 'none' },
                                modalText: submitMsg,
                                modal: !this.state.modal
                            });
                        }
                        else if (String(responseData).includes("Error")) {

                            var submitMsg = '';
                            submitMsg = "Unable to submit donor. \
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

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    /**
     * resets the form
     */
    resetForm = () => {

        this.setState({
            donor_name: '',
            donor_id: ''
        })
    }

    render() {

        // for view mode
        const setDisable = this.state.viewMode ? "disabled" : "";
        // for edit mode
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
                        <FormNavBar isVisible={formNavVisible} {...this.props} componentName="Common" />
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
                                <Form id="donorForm" onSubmit={this.handleSubmit} className='form' innerRef={this.formRef}>
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
                                                        <span class="errorMessage"><u>Errors: <br /></u> Form has some errors. Please check for required or invalid fields.<br /></span>
                                                    </div>

                                                    <br />

                                                    <fieldset >
                                                        <TabContent activeTab={this.state.activeTab}>
                                                            <TabPane tabId="1">
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="donor_name" >Donor Name<span className="required">*</span></Label>
                                                                            <Input name="donor_name" id="donor_name" value={this.state.donor_name} onChange={(e) => { this.inputChange(e, "donor_name") }} maxLength="200" pattern="^[A-Za-z. ]+" placeholder="Enter donor name (no special characters)" required />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" >
                                                                        <FormGroup >
                                                                            <Label for="donor_id" >Donor ID</Label>
                                                                            <Input name="donor_id" id="donor_id" value={this.state.donor_id} onChange={(e) => { this.inputChange(e, "donor_id") }} maxLength="50" placeholder="Donor ID" required disabled={this.editMode} />
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
                                                            <Button className="mb-2 mr-2" color="success" size="sm" type="submit">Submit</Button>
                                                            <Button className="mb-2 mr-2" color="danger" size="sm" type="reset" onClick={this.cancelCheck} >Clear</Button>
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

export default DonorRegistration;