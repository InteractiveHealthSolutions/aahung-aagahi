
import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';

class CustomModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }

toggle = () => {
  this.setState({
    modal: !this.state.modal
  });
}

render() {
  return (
    <MDBContainer>
      {/* <MDBBtn onClick={this.toggle}>Modal</MDBBtn> */}
      <MDBModal isOpen={this.props.modal} toggle={this.toggle}>
        <MDBModalHeader toggle={this.toggle}>{this.props.ModalHeader}</MDBModalHeader>
        <MDBModalBody>
          (...)
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
          <MDBBtn color="primary">Save changes</MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </MDBContainer>
    );
  }
}

export default CustomModal;