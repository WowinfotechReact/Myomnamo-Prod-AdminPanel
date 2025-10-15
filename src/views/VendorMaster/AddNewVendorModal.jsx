import ErrorModal from 'component/ErrorModal';
import { ERROR_MESSAGES, InValidEmailMassage, InValidGstNumberMassage, InValidMobileNumberMassage, InValidPanNumberMassage, vendorAddMassage, vendorUpdateMassage } from 'component/GlobalMassage';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import { isValid } from 'date-fns';
import React, { useContext, useDebugValue, useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { AddUpdateVendor, GetVendorModel } from 'services/Vendor/VendorApi';
const AddNewVendorModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
    const { setLoader, isValidEmail, isValidGST, isValidPAN, user } = useContext(ConfigContext);
    const [error, setError] = useState(false)
    const [customError, setCustomError] = useState(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)

    const [vendorForm, setVendorForm] = useState({
        vendorName: null,
        contactPerson: null,
        contactNumber: null,
        emailID: null,
        panNumber: null,
        GSTNumber: null,
        address: null
    })

    useEffect(() => {

        if (show) {
            if (modelRequestData?.Action === 'update' && (modelRequestData?.vendorID !== null && modelRequestData?.vendorID !== undefined && modelRequestData?.vendorID !== '')) {
                GetVendorModelData()
            }
        }
    }, [show])

    const GetVendorModelData = async () => {
        setLoader(true);
        try {
            const response = await GetVendorModel(modelRequestData?.vendorID);

            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        setVendorForm((prev) => ({
                            ...prev, vendorName: List?.vendorName,
                            contactPerson: List?.contactPersonName,
                            contactNumber: List?.contactNumber,
                            emailID: List?.emailID,
                            panNumber: List?.panNumber,
                            GSTNumber: List?.gstNumber,
                            address: List?.address
                        }))
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

    const SubmitBtnClicked = () => {

        let isValid = true
        if (vendorForm?.vendorName === null || vendorForm?.vendorName === undefined || vendorForm?.vendorName === '' ||
            vendorForm?.panNumber === null || vendorForm?.panNumber === undefined || vendorForm?.panNumber === '' ||
            vendorForm?.GSTNumber === null || vendorForm?.GSTNumber === undefined || vendorForm?.GSTNumber === '' ||
            vendorForm?.address === null || vendorForm?.address === undefined || vendorForm?.address === '' ||
            vendorForm?.contactNumber === null || vendorForm?.contactNumber === undefined || vendorForm?.contactNumber === '' ||
            vendorForm?.contactPerson === null || vendorForm?.contactPerson === undefined || vendorForm?.contactPerson === '' ||
            vendorForm?.emailID === null || vendorForm?.emailID === undefined || vendorForm?.emailID === ''
        ) {
            setError(true);
            isValid = false
        } else if ((vendorForm?.emailID !== null && vendorForm?.emailID !== undefined && vendorForm?.emailID !== '') && !isValidEmail(vendorForm?.emailID)) {
            setError(true);
            isValid = false
        } else if ((vendorForm?.contactNumber !== null && vendorForm?.contactNumber !== undefined && vendorForm?.contactNumber !== '') && vendorForm?.contactNumber?.length < 10) {
            setError(true);
            isValid = false
        } else if ((vendorForm?.GSTNumber !== null && vendorForm?.GSTNumber !== undefined && vendorForm?.GSTNumber !== '') && !isValidGST(vendorForm?.GSTNumber)) {
            setError(true);
            isValid = false
        } else if ((vendorForm?.panNumber !== null && vendorForm?.panNumber !== undefined && vendorForm?.panNumber !== '') && !isValidPAN(vendorForm?.panNumber)) {
            setError(true);
            isValid = false
        }
        const ApiParam = {
            adminID: user?.admiN_ID,
            vendorID: modelRequestData?.vendorID,
            vendorName: vendorForm?.vendorName,
            contactPersonName: vendorForm?.contactPerson,
            emailID: vendorForm?.emailID,
            contactNumber: vendorForm?.contactNumber,
            panNumber: vendorForm?.panNumber,
            gstNumber: vendorForm?.GSTNumber,
            address: vendorForm?.address
        }
        if (isValid) {
            AddUpdateVendorFormData(ApiParam)
        }
    }
    const AddUpdateVendorFormData = async (ApiParam) => {

        setLoader(true);
        try {
            const response = await AddUpdateVendor(ApiParam);
            if (response?.data?.statusCode === 200) {
                setLoader(false);
                setShowSuccessModal(true)
                setIsAddUpdateDone(true)
                onHide()
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

    const isValidIndianMobile = (number) => {
        const mobileRegex = /^[6-9]\d{9}$/;
        return mobileRegex.test(number);
    };

    const SetDataInitial = () => {
        setVendorForm((prev) => ({
            ...prev, vendorName: null,
            contactPerson: null,
            contactNumber: null,
            emailID: null,
            panNumber: null,
            GSTNumber: null,
            address: null
        }))
    }

    const closeAll = () => {
        SetDataInitial()
        setError(false);
        setCustomError(null);
        setShowSuccessModal(false)
        onHide()

    }

    return (
        <>
            <Modal style={{ zIndex: 1300 }} show={show} backdrop="static" keyboard={false} centered>
                <Modal.Header>
                    <h4 className="text-center">{modelRequestData?.Action === null ? 'Add Vendor' : 'Update Vendor'}</h4>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <div>
                            {customError}
                        </div>
                        <div className="row mb-1 ">
                            {/* Vendor Name */}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="vendorName" className="form-label">
                                    Vendor Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="vendorName"
                                    value={vendorForm?.vendorName || ''}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/^\s+/, ""); // remove leading spaces only
                                        setVendorForm((prev) => ({ ...prev, vendorName: value }));
                                    }}


                                    placeholder="Enter Vendor Name"
                                    maxLength={150}
                                />
                                {error && (vendorForm?.vendorName === null || vendorForm?.vendorName === undefined || vendorForm?.vendorName === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}
                            </div>

                            {/* Contact Person */}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="contactPerson" className="form-label">
                                    Contact Person <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="contactPerson"
                                    placeholder="Enter Contact Person"
                                    value={vendorForm?.contactPerson || ''}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/^\s+/, ""); // remove leading spaces only
                                        setVendorForm((prev) => ({ ...prev, contactPerson: value }));
                                    }}

                                />
                                {error && (vendorForm?.contactPerson === null || vendorForm?.contactPerson === undefined || vendorForm?.contactPerson === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}
                            </div>
                        </div>

                        <div className="row mb-1 ">
                            {/* Email ID*/}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="emailID" className="form-label">Email ID<span className='text-danger'>*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="emailID"
                                    placeholder="Enter Valid Email ID"
                                    maxLength={150}
                                    value={vendorForm?.emailID || ''}
                                    onChange={(e) => {
                                        const noSpaceValue = e.target.value.replace(/\s/g, ""); // removes all spaces
                                        setVendorForm((prev) => ({ ...prev, emailID: noSpaceValue }));
                                    }}

                                />
                                {error && (vendorForm?.emailID === null || vendorForm?.emailID === undefined || vendorForm?.emailID === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> :
                                    error && (!isValidEmail(vendorForm?.emailID)) ? <span className='text-danger'>{InValidEmailMassage}</span> : ''
                                }
                            </div>

                            {/* Contact Number */}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="contactNumber" className="form-label">
                                    Contact Number <span className="text-danger">*</span>
                                </label>
                                <input
                                    type='text'
                                    className="form-control " // reserve space for icon
                                    id="contactNumber"
                                    maxLength={10}
                                    placeholder="Enter Contact Number"
                                    value={vendorForm?.contactNumber || ''}
                                    onChange={(e) => {
                                        const numericOnly = e.target.value.replace(/\D/g, ""); // removes all non-digit characters
                                        setVendorForm((prev) => ({ ...prev, contactNumber: numericOnly }));
                                    }}

                                />
                                {error && (vendorForm?.contactNumber === null || vendorForm?.contactNumber === undefined || vendorForm?.contactNumber === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> :
                                    error && (vendorForm?.contactNumber?.length < 10) ? <span className='text-danger'>{InValidMobileNumberMassage}</span> : ''
                                }
                            </div>
                        </div>

                        <div className="row mb-1 ">
                            {/* PAN Number */}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="PAN" className="form-label">
                                    PAN Number <span className="text-danger">*</span>
                                </label>
                                <input
                                    type='text'
                                    className="form-control " // reserve space for icon
                                    id="PAN"
                                    maxLength={10}
                                    placeholder="Enter PAN Number"
                                    value={vendorForm?.panNumber}
                                    onChange={(e) => {
                                        const noSpaceValue = e.target.value.replace(/\s/g, ""); // removes all spaces
                                        setVendorForm((prev) => ({ ...prev, panNumber: noSpaceValue.toUpperCase() }))
                                    }}
                                />
                                {error && (vendorForm?.panNumber === null || vendorForm?.panNumber === undefined || vendorForm?.panNumber === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> :
                                    error && (!isValidPAN(vendorForm?.panNumber)) ? <span className='text-danger'>{InValidPanNumberMassage}</span> : ''
                                }
                            </div>


                            {/* GST Number */}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="GST" className="form-label">
                                    GST Number <span className="text-danger">*</span>
                                </label>
                                <input
                                    type='text'
                                    className="form-control " // reserve space for icon
                                    id="GST"
                                    placeholder="Enter GST Number"
                                    value={vendorForm?.GSTNumber || ''}
                                    maxLength={15}
                                    onChange={(e) => {
                                        const noSpaceValue = e.target.value.replace(/\s/g, ""); // removes all spaces
                                        setVendorForm((prev) => ({ ...prev, GSTNumber: noSpaceValue.toUpperCase() }))
                                    }}
                                />
                                {error && (vendorForm?.GSTNumber === null || vendorForm?.GSTNumber === undefined || vendorForm?.GSTNumber === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> :
                                    error && (!isValidGST(vendorForm?.GSTNumber)) ? <span className='text-danger'>{InValidGstNumberMassage}</span> : ''
                                }
                            </div>
                        </div>

                        <div className="row mb-1 ">
                            {/* Address*/}
                            <div className="col-md-12 mb-1">
                                <label htmlFor="address" className="form-label">Address<span className='text-danger'>*</span></label>
                                <textarea
                                    className="form-control"
                                    id="address"
                                    placeholder="Enter Address"
                                    maxLength={150}
                                    value={vendorForm?.address}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/^\s+/, ""); // remove leading spaces only
                                        setVendorForm((prev) => ({ ...prev, address: value }));
                                    }}
                                />

                                {error && (vendorForm?.address === null || vendorForm?.address === undefined || vendorForm?.address === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''
                                }
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
            </Modal>
            <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={modelRequestData?.Action === null ? vendorAddMassage : vendorUpdateMassage} />
            <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
        </>

    )
}

export default AddNewVendorModal
