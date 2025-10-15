import React from 'react'
import { Modal, Button } from 'react-bootstrap';
import Error from '../assets/images/Error.gif'
const ErrorModal = ({ show, onHide, Massage }) => {
    return (
        <>
            <Modal style={{ zIndex: 1300 }} show={show} backdrop="static" keyboard={false} centered>
                <Modal.Body>
                    <div className="text-center">
                        <img src={Error}>
                        </img>
                    </div>



                    <h5 className="text-center m-3 text-danger">{`${Massage} `}</h5>

                </Modal.Body>
                <Modal.Footer>


                    <Button
                        variant="primary"
                        onClick={() => {
                            onHide();
                        }}
                    >
                        Close
                    </Button>

                </Modal.Footer>

            </Modal >
        </>
    )
}

export default ErrorModal
