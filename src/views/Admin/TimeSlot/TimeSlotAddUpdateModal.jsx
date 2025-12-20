import axios from 'axios';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { ConfigContext } from 'context/ConfigContext';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import React, { useContext, useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import Select from 'react-select';
import { AddUpdateTimeSlot, GetTimeSlotCategoryModel } from 'services/TimeSlot/TimeSlot';

const TimeSlotAddUpdateModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
    const { setLoader, user } = useContext(ConfigContext);
    const [modelAction, setModelAction] = useState(false)
    const [error, setError] = useState(false)
    const [customError, setCustomError] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [state, setState] = useState({
        adminID: null,
        timeSlotKeyID: null, // Provide Key ID For Update
        timeSlot: null,
        appLangID: null,
    })

    useEffect(() => {
        if (modelRequestData?.timeSlotKeyID !== null && modelRequestData?.Action === "Update") {
            GetTimeSlotModelData(modelRequestData.timeSlotKeyID)
        }
    }, [modelRequestData.Action])

    const languageList = [
        { value: 'en', label: 'English' },
        { value: 'hi', label: 'Hindi' },
        { value: 'fr', label: 'French' },
    ];


    const SubmitBtnClicked = () => {
        let isValid = true
        if (
            state?.timeSlot === null || state?.timeSlot === undefined || state?.timeSlot === ""
        ) {
            setError(true)
            isValid = false
        }
        const apiParam = {
            adminID: user?.adminID,
            timeSlotKeyID: state?.timeSlotKeyID,
            timeSlot: state?.timeSlot,
            // "appLangID": null,
            // "timeSlotByLangKeyID": null

        }
        if (isValid) {
            // console.log("payload ==>>", apiParam)
            AddUpdatetTimeSlotData(apiParam)
        }
    }

    const AddUpdatetTimeSlotData = async (ApiParam) => {
        setLoader(true);
        try {
            const response = await AddUpdateTimeSlot(ApiParam);
            if (response?.data?.statusCode === 200) {
                setLoader(false);
                setLoader(false);
                setModelAction(modelRequestData.Action === null ? "Time Slot has been added successfully !" : "Time Slot has been updated successfully !")
                setShowSuccessModal(true)
                setIsAddUpdateDone(true)
            } else {
                console.error(response?.response?.data?.errorMessage);
                setCustomError(response?.response?.data?.errorMessage)
                setShowErrorModal(true)
                setLoader(false);
            }
        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    }

    const closeAll = () => {
        setError(false);
        setCustomError(null);
        setShowSuccessModal(false)
        onHide()
    }

    const GetTimeSlotModelData = async (id) => {
        if (!id) {
            return
        }
        setLoader(true);
        try {
            const response = await GetTimeSlotCategoryModel(id);
            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        setState((prev) => ({
                            ...prev,
                            timeSlotKeyID: List.timeSlotKeyID, // Provide Key ID For Update
                            timeSlot: List.timeSlot,
                        }))
                        if (List?.dayID?.length == 7) {
                            setAllDaySelected(true)
                        }
                    }
                } else {
                    console.error(response?.data?.errorMessage);
                    setLoader(false);
                }
            }
        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    }

    return (
        <>
            <Modal style={{ zIndex: 1300 }} size='md' show={show} backdrop="static" keyboard={false} centered>
                <Modal.Header>
                    <h4 className="text-center">{modelRequestData?.Action === null ? 'Add Time Slot Details' : 'Update Time Slot Details'}</h4>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
                    <div className="container-fluid ">
                        <div className="row">

                            <div className="col-md-12 mb-3">
                                <label htmlFor="stateID" className="form-label">
                                    Select Language <span className="text-danger">*</span>
                                </label>
                                <Select
                                    options={languageList}
                                    value={languageList.find(lang => lang.value === 'en')} // select English by default
                                    isDisabled
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                />

                            </div>


                            {/* Blog Title */}
                            <div className="col-md-12 mb-3">
                                <label htmlFor="timeSlot" className="form-label">
                                    Time Slot<span className="text-danger">*</span>
                                </label>
                                <input
                                    maxLength={50}
                                    type="text"
                                    className="form-control"
                                    id="timeSlot"
                                    placeholder="Enter Time Slot"
                                    aria-describedby="Employee"
                                    value={state.timeSlot}
                                    onChange={(e) => {
                                        setErrorMessage(false);
                                        let inputValue = e.target.value;

                                        // Prevent input if empty or only a leading space
                                        if (inputValue.length === 0 || (inputValue.length === 1 && inputValue === ' ')) {
                                            inputValue = '';
                                        }

                                        // Remove unwanted characters (allow letters, numbers, spaces)
                                        // const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');
                                        const cleanedValue = inputValue;

                                        // Trim only leading spaces
                                        const trimmedValue = cleanedValue.trimStart();

                                        // Capitalize first letter of every word
                                        const updatedValue = trimmedValue
                                            .split(' ')
                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ');

                                        setState(prev => ({
                                            ...prev,
                                            timeSlot: updatedValue
                                        }));
                                    }}
                                />
                                {error && (state.timeSlot === null || state.timeSlot === undefined || state.timeSlot === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => closeAll()}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            SubmitBtnClicked();
                        }}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal >
            <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={modelAction} />
            <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
        </>
    )
}

export default TimeSlotAddUpdateModal
