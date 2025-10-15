import React, { useContext, useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import Select from 'react-select';
import 'react-calendar/dist/Calendar.css';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES, InValidEmailMassage, InValidMobileNumberMassage, shopAddMassage, shopUpdateMassage } from 'component/GlobalMassage';
import { AddUpdateShop, GetShopModel } from 'services/Shop/ShopApi';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';

const AddShopModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
    const { setLoader, isValidEmail, user } = useContext(ConfigContext);
    const [error, setError] = useState(false)
    const [customError, setCustomError] = useState(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [shopForm, setShopForm] = useState({
        shopName: null,
        shopCode: null,
        ownerName: null,
        contactNumber: null,
        emailID: null,
        address: null
    })
    useEffect(() => {
        if (show) {
            if (modelRequestData?.Action === 'update' && (modelRequestData?.shopID !== null && modelRequestData?.shopID !== undefined && modelRequestData?.shopID !== '')) {
                GetShopModelData()
            }
        }
    }, [show])

    const GetShopModelData = async () => {
        setLoader(true);
        try {
            const response = await GetShopModel(modelRequestData?.shopID);

            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        setShopForm((prev) => ({
                            ...prev,
                            shopName: List?.shopName,
                            shopCode: List?.shopCode,
                            ownerName: List?.ownerName,
                            contactNumber: List?.contactNumber,
                            emailID: List?.emailID,
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
        if (shopForm?.shopName === null || shopForm?.shopName === undefined || shopForm?.shopName === '' ||
            shopForm?.shopCode === null || shopForm?.shopCode === undefined || shopForm?.shopCode === '' ||
            shopForm?.ownerName === null || shopForm?.ownerName === undefined || shopForm?.ownerName === '' ||
            shopForm?.address === null || shopForm?.address === undefined || shopForm?.address === '' ||
            shopForm?.contactNumber === null || shopForm?.contactNumber === undefined || shopForm?.contactNumber === '' ||
            shopForm?.emailID === null || shopForm?.emailID === undefined || shopForm?.emailID === ''
        ) {
            setError(true);
            isValid = false
        } else if ((shopForm?.emailID !== null && shopForm?.emailID !== undefined && shopForm?.emailID !== '') && !isValidEmail(shopForm?.emailID)) {
            setError(true);
            isValid = false
        } else if ((shopForm?.contactNumber !== null && shopForm?.contactNumber !== undefined && shopForm?.contactNumber !== '') && shopForm?.contactNumber?.length < 10) {
            setError(true);
            isValid = false
        }
        const ApiParam = {
            adminID: user?.admiN_ID,
            shopID: modelRequestData?.shopID,
            shopName: shopForm?.shopName,
            shopCode: shopForm?.shopCode,
            emailID: shopForm?.emailID,
            contactNumber: shopForm?.contactNumber,
            panNumber: shopForm?.panNumber,
            ownerName: shopForm?.ownerName,
            address: shopForm?.address
        }
        if (isValid) {
            AddUpdateShopData(ApiParam)
        }
    }
    const AddUpdateShopData = async (ApiParam) => {
        setLoader(true);
        try {
            const response = await AddUpdateShop(ApiParam);
            if (response?.data?.statusCode === 200) {
                setLoader(false);
                setShowSuccessModal(true)
                setIsAddUpdateDone(true)
                onHide()
            } else {
                console.error(response?.data?.errorMessage);
                setCustomError(response?.response?.data?.errorMessage)
                setShowErrorModal(true)
                setLoader(false);
            }
        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    }

    const SetDataInitial = () => {
        setShopForm((prev) => ({
            ...prev,
            shopName: null,
            shopCode: null,
            ownerName: null,
            contactNumber: null,
            emailID: null,
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
                    <h4 className="text-center">{modelRequestData?.Action === null ? 'Add New Shop' : 'Update Shop'}</h4>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <div className="row mb-1 ">
                            {/* Vendor Name */}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="shopName" className="form-label">
                                    Shop Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="shopName"
                                    value={shopForm?.shopName || ''}
                                    placeholder="Enter Shop Name"
                                    maxLength={150}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/^\s+/, ""); // remove leading spaces only
                                        setShopForm((prev) => ({ ...prev, shopName: value }));
                                    }}
                                />
                                {error && (shopForm?.shopName === null || shopForm?.shopName === undefined || shopForm?.shopName === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}
                            </div>

                            {/* Contact Person */}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="contactPerson" className="form-label">
                                    Shop Code <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="contactPerson"
                                    placeholder="Enter Shop Code"
                                    value={shopForm?.shopCode}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/^\s+/, ""); // remove leading spaces only
                                        setShopForm((prev) => ({ ...prev, shopCode: value }));
                                    }}
                                />
                                {error && (shopForm?.shopCode === null || shopForm?.shopCode === undefined || shopForm?.shopCode === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}
                            </div>
                        </div>

                        <div className="row mb-1 ">
                            {/* Email ID*/}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="ownerName" className="form-label">Owner Name<span className='text-danger'>*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="ownerName"
                                    placeholder="Enter Owner Name"
                                    maxLength={150}
                                    value={shopForm?.ownerName}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/^\s+/, ""); // remove leading spaces only
                                        setShopForm((prev) => ({ ...prev, ownerName: value }));
                                    }}
                                />
                                {error && (shopForm?.ownerName === null || shopForm?.ownerName === undefined || shopForm?.ownerName === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}
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
                                    value={shopForm?.contactNumber || ''}
                                    onChange={(e) => {
                                        const numericOnly = e.target.value.replace(/\D/g, ""); // removes all non-digit characters
                                        setShopForm((prev) => ({ ...prev, contactNumber: numericOnly }));
                                    }}
                                />
                                {error && (shopForm?.contactNumber === null || shopForm?.contactNumber === undefined || shopForm?.contactNumber === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> :
                                    error && (shopForm?.contactNumber?.length < 10) ? <span className='text-danger'>{InValidMobileNumberMassage}</span> : ''
                                }
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
                                    value={shopForm?.emailID}
                                    onChange={(e) => {
                                        const noSpaceValue = e.target.value.replace(/\s/g, ""); // removes all spaces
                                        setShopForm((prev) => ({ ...prev, emailID: noSpaceValue }));
                                    }}
                                />
                                {error && (shopForm?.emailID === null || shopForm?.emailID === undefined || shopForm?.emailID === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> :
                                    error && (!isValidEmail(shopForm?.emailID)) ? <span className='text-danger'>{InValidEmailMassage}</span> : ''
                                }
                            </div>
                            {/* Address*/}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="address" className="form-label">Address<span className='text-danger'>*</span></label>
                                <textarea
                                    className="form-control"
                                    id="address"
                                    placeholder="Enter Address"
                                    maxLength={150}
                                    value={shopForm?.address}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/^\s+/, ""); // remove leading spaces only
                                        setShopForm((prev) => ({ ...prev, address: value }));
                                    }}
                                />

                                {error && (shopForm?.address === null || shopForm?.address === undefined || shopForm?.address === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''
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
            <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={modelRequestData?.Action === null ? shopAddMassage : shopUpdateMassage} />
            <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
        </>
    )
}

export default AddShopModal
