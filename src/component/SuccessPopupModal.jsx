import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const SuccessPopupModal = ({ show, onHide, successMassage }) => {
  return (
    <>
      <Modal style={{ zIndex: 1300 }} show={show} backdrop="static" keyboard={false} centered>
        <Modal.Body>
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#28a745" class="bi bi-check2-circle" viewBox="0 0 16 16">
              <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
              <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
            </svg>
          </div>

          <h4 className="text-center m-3" style={{ fontSize: '20px' }}>{`${successMassage} `}</h4>
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
      </Modal>
    </>
  );
};

export default SuccessPopupModal;
