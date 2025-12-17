import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { ConfigContext } from 'context/ConfigContext';
import Select from 'react-select';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import { AddUpdateDistrict } from 'services/District/DistrictApi';
import { AdminAddUpdate, GetAdminModel } from 'services/Admin/Admin Master/AdminMasterApi';

const AdminMasterAddUpdateModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
    const { setLoader, user } = useContext(ConfigContext);
    const [modelAction, setModelAction] = useState(false);
    const [error, setError] = useState(false);
    const [customError, setCustomError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const [state, setState] = useState({
        adminID: user.adminID,
        adminName: '',
        mobileNo: '',
        password: '',
        email: '',
        roleTypeID: null,
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const InValidMobileNumberMassage = 'Please enter a valid 10-digit mobile number.';

    useEffect(() => {

        if (modelRequestData?.AdminKeyID !== null && modelRequestData?.Action === 'Update') {
            GetAdminModelData(modelRequestData.AdminKeyID);
        }
    }, [show]);


    const SubmitBtnClicked = () => {

        let isValid = true;
        setError(true);

        if (!state.adminName || state.adminName.trim() === '') {
            isValid = false;
        }

        if (!state.mobileNo || state.mobileNo.trim() === '') {
            isValid = false;
        } else if (state.mobileNo.length < 10) {
            isValid = false;
        }

        if (!state.password || state.password.trim() === '') {
            isValid = false;
        }

        if (!state.email || state.email.trim() === '' || !emailRegex.test(state.email)) {
            isValid = false;
        }
        if (!state.roleTypeID) {
            isValid = false;
        }
        if (!isValid) {
            // Just show validation errors, don’t submit
            return;
        }

        console.log('  Payload:', state);
        // Proceed to API call if valid
        AddUpdateAdminData({ ...state });
    };

    const AddUpdateAdminData = async (ApiParam) => {
        setLoader(true);
        try {
            const response = await AdminAddUpdate(ApiParam);
            if (response?.data?.statusCode === 200) {
                setLoader(false);
                setModelAction(
                    modelRequestData.Action === null
                        ? 'Admin has been added successfully!'
                        : 'Admin has been updated successfully!'
                );
                setShowSuccessModal(true);
                setIsAddUpdateDone(true);
            } else {
                setCustomError(response?.response?.data?.errorMessage);
                setShowErrorModal(true);
                setLoader(false);
            }
        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    };

    const closeAll = () => {
        setError(false);
        setCustomError(null);
        setShowSuccessModal(false);
        onHide();
    };

    const GetAdminModelData = async (id) => {
        if (!id) return;
        setLoader(true);
        try {
            const response = await GetAdminModel(id);
            if (response?.data?.statusCode === 200) {
                const List = response.data.responseData.data;
                setState({
                    ...List,
                });
            }
            setLoader(false);

        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    };

    return (
        <>
            <Modal
                style={{ zIndex: 1300 }}
                size="md"
                show={show}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header>
                    <h4 className="text-center">
                        {modelRequestData?.Action === null ? 'Add Admin' : 'Update Admin'}
                    </h4>
                </Modal.Header>

                <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
                    <div className="container-fluid ">
                        <div className="row">
                            {/* Admin Name */}
                            <div className="col-md-12 mb-3">
                                <label htmlFor="districtTitle" className="form-label">
                                    Admin Name<span className="text-danger">*</span>
                                </label>
                                <input
                                    maxLength={50}
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Admin Name"
                                    value={state.adminName}
                                    onChange={(e) => {
                                        setErrorMessage(false);
                                        let inputValue = e.target.value;
                                        const cleanedValue = inputValue
                                            .replace(/[^a-zA-Z0-9\s]/g, '')
                                            .trimStart();
                                        const updatedValue = cleanedValue
                                            .split(' ')
                                            .map(
                                                (word) =>
                                                    word.charAt(0).toUpperCase() + word.slice(1)
                                            )
                                            .join(' ');
                                        setState((prev) => ({
                                            ...prev,
                                            adminName: updatedValue,
                                        }));
                                    }}
                                />
                                {error &&
                                    (!state.adminName ||
                                        state.adminName.trim() === '') && (
                                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                    )}
                            </div>

                            {/* Mobile No */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Mobile No.<span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={state.mobileNo}
                                    maxLength={10}
                                    className="form-control"
                                    placeholder="Enter Mobile Number"
                                    onKeyDown={(e) => {
                                        if (
                                            !/[0-9]/.test(e.key) &&
                                            ![
                                                'Backspace',
                                                'Delete',
                                                'Tab',
                                                'ArrowLeft',
                                                'ArrowRight',
                                            ].includes(e.key)
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const updatedValue = inputValue.replace(/[^0-9]/g, '');
                                        setErrorMessage(null);
                                        setState({ ...state, mobileNo: updatedValue });
                                    }}
                                />
                                {error && !state.mobileNo && (
                                    <div className="text-danger">{ERROR_MESSAGES}</div>
                                )}
                                {error &&
                                    state.mobileNo &&
                                    state.mobileNo.length < 10 && (
                                        <div className="text-danger">
                                            {InValidMobileNumberMassage}
                                        </div>
                                    )}
                            </div>

                            {/* Password */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Password<span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={state.password}
                                    maxLength={10}
                                    className="form-control"
                                    placeholder="Enter Password"
                                    onChange={(e) =>
                                        setState({ ...state, password: e.target.value })
                                    }
                                />
                                {error &&
                                    (!state.password ||
                                        state.password.trim() === '') && (
                                        <div className="text-danger">{ERROR_MESSAGES}</div>
                                    )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="form-label">
                                    Email<span className="text-danger">*</span>
                                </label>
                                <input
                                    maxLength={50}
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Email"
                                    value={state.email}
                                    onChange={(e) =>
                                        setState((prev) => ({
                                            ...prev,
                                            email: e.target.value,
                                        }))
                                    }
                                />
                                {error && (
                                    <>
                                        {(!state.email || state.email.trim() === '') && (
                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                        )}
                                        {!(!state.email || state.email.trim() === '') &&
                                            !emailRegex.test(state.email) && (
                                                <label
                                                    className="validation"
                                                    style={{ color: 'red' }}
                                                >
                                                    Enter a valid email.
                                                </label>
                                            )}
                                    </>
                                )}
                            </div>

                            <div className='mt-3'>
                                <label className="form-label">
                                    Admin Role<span className="text-danger">*</span>
                                </label>
                                <Select
                                    id="roleTypeID"
                                    className="w-100"
                                    placeholder="Select Admin Type"
                                    options={[
                                        { value: 1, label: "Admin" },
                                        { value: 2, label: "Inventory Admin" },
                                    ]}
                                    value={
                                        state.roleTypeID
                                            ? { value: state.roleTypeID, label: state.roleTypeID === 1 ? "Admin" : "Inventory Admin" }
                                            : null
                                    }
                                    onChange={(selected) => {
                                        setState({ ...state, roleTypeID: selected.value });
                                    }}
                                />
                                {error && !state.roleTypeID && (
                                    <span style={{ color: "red" }}>{ERROR_MESSAGES}</span>
                                )}
                            </div>


                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => closeAll()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => SubmitBtnClicked()}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>

            <SuccessPopupModal
                show={showSuccessModal}
                onHide={closeAll}
                successMassage={modelAction}
            />
            <ErrorModal
                show={showErrorModal}
                onHide={() => setShowErrorModal(false)}
                Massage={customError}
            />
        </>
    );
};

export default AdminMasterAddUpdateModal;


