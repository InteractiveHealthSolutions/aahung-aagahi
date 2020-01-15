import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { MDBIcon } from "mdbreact";
import Modal from 'react-bootstrap/Modal';

class VoidModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            modalHeading: this.props.modalHeading
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.data });

        this.setState({
            openModal: nextProps.openModal,
            modalHeading: nextProps.modalHeading,
            reasonVoided: ''
        })
    }

    // for text and numeric questions
    inputChange(e, name) {

        this.setState({
            [name]: e.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();
        this.props.handleSubmit(this.state.reasonVoided);
    }

    render() {
        
        return (

            <Modal
                show={this.state.openModal}
                onHide={this.props.closeModal}
                style={{ marginTop: '100px' }}
            >
                <Modal.Header closeButton style={{ backgroundColor: '#ef6c00', color: 'white', borderBottom: '2px solid #522a71' }}>
                    <Modal.Title>{this.state.modalHeading}</Modal.Title>
                </Modal.Header>
                <form onSubmit={this.handleSubmit}>
                    <Modal.Body style={{ height: '309px', overflowY: 'auto' }} >
                        <div className='form-group'>
                            <label htmlFor='reasonVoided' style={{ color: "black" }}>Void reason</label>
                            <input
                                type='text'
                                className='form-control'
                                autoComplete='off'
                                value={this.state.reasonVoided}
                                pattern='^[a-zA-Z.\s]*$'
                                name='reasonVoided'
                                onChange={(e) => { this.inputChange(e, "reasonVoided") }}
                                required
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="mb-2 mr-2" color="danger" size="sm" type="submit">Void<MDBIcon icon="frown-open" className="ml-2" size="lg" /></Button>
                        <Button className="mb-2 mr-2" color="purple" size="sm" onClick={this.props.closeModal} >Cancel<MDBIcon icon="smile" className="ml-2" size="lg" /></Button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

export default VoidModal;