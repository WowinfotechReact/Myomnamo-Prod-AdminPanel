// ModalComponent.js
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import Lottie from 'lottie-react';


import { ConfigContext } from 'context/ConfigContext';
import { MultipleLeadAssignToSalesman } from 'services/LeadAPI/LeadApi';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import SuccessPopupModal from 'component/SuccessPopupModal';
const TransferLeadModal = ({ show, handleClose, selectedComplaintIDs, selectedLeadIDs, setIsAddUpdateActionDone }) => {
  const [roleTypeOption, setRoleTypeOption] = useState([]);
  const [error, setErrors] = useState(null);
  const [errorMessage, setErrorMessage] = useState();
  const { setLoader, user, companyID } = useContext(ConfigContext);
  const [employeeOption, setEmployeeOption] = useState([]);
  const [modelAction, setModelAction] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transferLeadObj, setTransferLeadObj] = useState({
    userKeyID: null,
    leadID: null,
    employeeKeyID: null,
    roleTypeID: null
  });



  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        style={{ zIndex: 1300 }}
        backdrop="static"
        keyboard={false}
        centered // Adjust the z-index as needed
      >
        <Modal.Header closeButton>
          <Modal.Title> Lead Transfer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container text-center">
            {/* Animated Icon */}
            <div className="d-flex justify-content-center">
              <Lottie animationData={transferComplaint} style={{ width: 150, height: 100 }} />;
            </div>
            Are you sure you want to transfer the following lead? <br />
            {/* <strong>{selectedComplaintIDs.join(', ')}</strong> */}
            {/* Action Buttons */}
            <div className="mt-4 d-flex justify-content-center gap-3">
              {/* <button className="btn btn-danger" onClick={handleClose}>Cancel</button>
       <button className="btn btn-success" onClick={handleConfirm}>Confirm</button> */}
            </div>
          </div>
          <div className=" mt-1">
            <label htmlFor="">Select Role Type</label>
            <Select
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999 // Ensures dropdown appears above everything
                })
              }}
              options={roleTypeOption}
              value={roleTypeOption.filter((item) => item.value === transferLeadObj.roleTypeID)}
              onChange={handleRoleTypeChange}
              menuPosition="fixed"
            />
            {error &&
              (transferLeadObj.roleTypeID === null || transferLeadObj.roleTypeID === undefined || transferLeadObj.roleTypeID === '') ? (
              <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
            ) : (
              ''
            )}
          </div>
          <div>
            <label htmlFor=""> Select Employee</label>
            <Select
              options={employeeOption}
              placeholder="Select an Employee"
              value={employeeOption?.find((option) => option.value === transferLeadObj.employeeKeyID) || null}
              onChange={handleTransferDeviceEmployeeChange}
              className="w-100"
              isDisabled={!transferLeadObj.roleTypeID}
            />
            {error && !transferLeadObj.employeeKeyID && <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={AddLeadBtnClick}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <SuccessPopupModal
        show={showSuccessModal}
        onHide={() => closeAllModal()}
        setShowSuccessModal={setShowSuccessModal}
        modelAction={modelAction}// ✅ send it here
      />
    </>
  );
};

export default TransferLeadModal;
