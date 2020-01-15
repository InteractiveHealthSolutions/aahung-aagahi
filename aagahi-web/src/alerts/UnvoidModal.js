import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { MDBIcon } from "mdbreact";
import Modal from 'react-bootstrap/Modal';

class UnvoidModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            modalHeading: this.props.modalHeading,
            objectType: this.props.objectType
        }
    }

    closeModal = () => {
        this.setState({
            modal: !this.state.modal
        });
      }

    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.data });

        this.setState({
            modal: nextProps.modal,
            modalHeading: nextProps.modalHeading,
            objectType: nextProps.objectType
        })
    }

    // for text and numeric questions
    inputChange(e, name) {
        this.setState({
            [name]: e.target.value
        });
    }

    render() {
        return (
            <Modal
                show={this.state.modal}
                onHide={this.props.closeModal}
                style={{ marginTop: '100px' }}
            >
                <Modal.Header closeButton style={{ backgroundColor: '#ef6c00', color: 'white', borderBottom: '2px solid #522a71' }}>
                    <Modal.Title>{this.state.modalHeading}</Modal.Title>
                </Modal.Header>
                <form onSubmit={this.props.handleSubmit}>
                    <Modal.Body style={{ height: '309px', overflowY: 'auto' }} >
                        <div className='form-group'>
                            <label  style={{ color: "black" }}>Do you want to restore this {this.state.objectType}?</label>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="mb-2 mr-2" color="danger" size="sm" type="submit">Yes<MDBIcon icon="smile" className="ml-2" size="lg" /></Button>
                        <Button className="mb-2 mr-2" color="purple" size="sm" onClick={this.props.closeModal} >No<MDBIcon icon="frown-open" className="ml-2" size="lg" /></Button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

export default UnvoidModal;