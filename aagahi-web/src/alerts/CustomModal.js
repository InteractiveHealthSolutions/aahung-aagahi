import { MDBBtn, MDBContainer, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from 'mdbreact';
import React, { Component } from 'react';

class CustomModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      modalHeading : this.props.modalHeading,
      modalText : this.props.modalText
    }
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data });

    this.state = {
      modal: nextProps.modal,
      modalHeading: nextProps.modalHeading,
      modalText : nextProps.modalText
    }
  }

  render() {
    return (

      <MDBContainer>
      <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
          <MDBModalHeader toggle={this.props.toggle}>{this.state.modalHeading}</MDBModalHeader>
          <MDBModalBody>
              {this.state.modalText}
          </MDBModalBody>
          <MDBModalFooter>
              <MDBBtn color="secondary" onClick={this.props.toggle}>OK!</MDBBtn>
          </MDBModalFooter>
      </MDBModal>
      </MDBContainer>
    );
  }
}

export default CustomModal;