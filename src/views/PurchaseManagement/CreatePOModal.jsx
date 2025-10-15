import React, { useContext, useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import Select from 'react-select';
import 'react-calendar/dist/Calendar.css';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES, poAddMassage, poUpdateMassage } from 'component/GlobalMassage';
import dayjs from 'dayjs';
import { GetVendorLookupList } from 'services/Vendor/VendorApi';
import { AddUpdatePo, GetPOModel } from 'services/PurchaseManagement/PurchaseManagementApi';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
const CreatePOModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
    const { setLoader, isValidEmail, formatToIndianCurrency, isValidPAN, user } = useContext(ConfigContext);
    const [error, setError] = useState(false)
    const [customError, setCustomError] = useState(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [vendorsList, setVendorsList] = useState([])
    const [poFormData, setPoFormData] = useState({
        vendorNameID: null,
        poDate: null,
        poNumber: null,
        poAmount: null,
        notes: null
    })
    useEffect(() => {
        if (show) {
            GetVendorLookupListData()
            if (modelRequestData?.Action !== null) {
                GetPOModelData()
            }
        }
    }, [show])

    const GetVendorLookupListData = async () => {
        try {
            const response = await GetVendorLookupList();
            if (response?.data?.statusCode === 200) {
                const list = response?.data?.responseData?.data || [];
                const formattedOptions = list.map((item) => ({
                    value: item.vendorID,
                    label: item.vendorName
                }));
                setVendorsList(formattedOptions);
            } else {
                console.error('Failed to fetch lookup list:', response?.data?.statusMessage || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching lookup list:', error);
        }
    };

    const SubmitBtnClicked = () => {
        let isValid = true
        if (poFormData?.vendorNameID === null || poFormData?.vendorNameID === undefined || poFormData?.vendorNameID === '' ||
            poFormData?.poDate === null || poFormData?.poDate === undefined || poFormData?.poDate === '' ||
            poFormData?.poNumber === null || poFormData?.poNumber === undefined || poFormData?.poNumber === '' ||
            poFormData?.poAmount === null || poFormData?.poAmount === undefined || poFormData?.poAmount === '' ||
            poFormData?.notes === null || poFormData?.notes === undefined || poFormData?.notes === ''
        ) {
            setError(true)
            isValid = false
        }

        const apiParam = {
            adminID: user?.admiN_ID,
            purchaseID: modelRequestData?.purchaseID,
            vendorID: poFormData?.vendorNameID,
            poDate: poFormData?.poDate,
            poNumber: poFormData?.poNumber,
            poAmount: poFormData?.poAmount,
            notes: poFormData?.notes
        }
        if (isValid) {
            AddUpdatePoData(apiParam)
        }
    }

    const AddUpdatePoData = async (ApiParam) => {
        setLoader(true);
        try {
            const response = await AddUpdatePo(ApiParam);
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

    const GetPOModelData = async () => {
        setLoader(true);
        try {
            const response = await GetPOModel(modelRequestData?.purchaseID);
            if (response?.data?.statusCode === 200) {
                setLoader(false);
                if (response?.data?.responseData?.data) {
                    const List = response.data.responseData.data;
                    setPoFormData((prev) => ({
                        ...prev, vendorNameID: List?.vendorID,
                        poDate: List?.poDate,
                        poNumber: List?.poNumber,
                        poAmount: List?.poAmount,
                        notes: List?.notes
                    }))
                }
            } else {
                console.error(response?.data?.errorMessage);
                setLoader(false);
            }
        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    }

    const handleDateChange = (newValue) => {
        if (dayjs(newValue).isValid()) {
            const newToDate = dayjs(newValue).format("YYYY-MM-DD");
            setPoFormData((prev) => ({ ...prev, poDate: newToDate }));
        } else {
            setPoFormData((prev) => ({ ...prev, poDate: null }));
        }
    };
    const SetInitialData = () => {
        setPoFormData((prev) => ({
            ...prev,
            vendorNameID: null,
            poDate: null,
            poNumber: null,
            poAmount: null,
            notes: null
        }))
    }
    const closeAll = () => {
        SetInitialData()
        setError(false)
        setShowSuccessModal(false)
        setCustomError(null);
        onHide()
    }
    return (
        <>
            <Modal style={{ zIndex: 1300 }} show={show} backdrop="static" keyboard={false} centered>
                <Modal.Header>
                    <h4 className="text-center">{modelRequestData?.Action === null ? 'Create Purchase Order' : 'Update  Purchase Order'}</h4>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <div className="row mb-1 ">
                            {/* Vendor Name */}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="vendorName" className="form-label">
                                    Vendor Name <span className="text-danger">*</span>
                                </label>
                                <Select
                                    options={vendorsList}
                                    value={vendorsList?.filter((value, index) => value?.value === poFormData?.vendorNameID)}
                                    onChange={(selectedOption) =>
                                        setPoFormData((prev) => ({
                                            ...prev,
                                            vendorNameID: selectedOption ? selectedOption.value : null,

                                        }))
                                    }
                                    styles={{
                                        container: (provided) => ({
                                            ...provided,

                                        })
                                    }}
                                />
                                {error && (poFormData?.vendorNameID === null || poFormData?.vendorNameID === undefined || poFormData?.vendorNameID === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}
                            </div>

                            {/* PO Date */}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="contactPerson" className="form-label">
                                    PO Date <span className="text-danger">*</span>
                                </label>
                                <DatePicker
                                    className="date-picker-input text-nowrap  "
                                    label="PO Date"
                                    value={poFormData?.poDate}
                                    onChange={handleDateChange}
                                    clearIcon={null}
                                    format='dd/MM/yyyy'
                                />
                                {error && (poFormData?.poDate === null || poFormData?.poDate === undefined || poFormData?.poDate === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}
                            </div>
                        </div>
                        <div className="row mb-1 ">
                            {/* Unit Price  */}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="poNumber" className="form-label">
                                    PO Number <span className="text-danger">*</span>
                                </label>
                                <input
                                    type='text'
                                    value={poFormData?.poNumber}
                                    className="form-control " // reserve space for icon
                                    id="poNumber"
                                    placeholder="Enter PO Number"
                                    onChange={(e) => {
                                        const numericOnly = e.target.value.replace(/\D/g, ""); // removes all non-digit characters
                                        setPoFormData((prev) => ({ ...prev, poNumber: e.target.value }));
                                    }}
                                />
                                {error && (poFormData?.poNumber === null || poFormData?.poNumber === undefined || poFormData?.poNumber === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}
                            </div>


                            {/* Total Amount */}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="poAmount" className="form-label">
                                    PO Amount <span className="text-danger">*</span>
                                </label>
                                <input
                                    type='text'
                                    className="form-control " // reserve space for icon
                                    id="poAmount"
                                    placeholder="Enter PO Amount"
                                    value={formatToIndianCurrency(poFormData?.poAmount)}

                                    onChange={(e) => {
                                        setError(false);
                                        const inputValue = e.target.value;
                                        const sanitizedInput = inputValue
                                            .replace(/[^0-9.]/g, "")
                                            .slice(0, 16);
                                        const [integerPart, decimalPart] =
                                            sanitizedInput.split(".");
                                        const formattedIntegerPart = integerPart;
                                        let formattedInput =
                                            decimalPart !== undefined
                                                ? `${formattedIntegerPart.slice(
                                                    0,
                                                    12
                                                )}.${decimalPart.slice(0, 2)}`
                                                : formattedIntegerPart.slice(0, 12);

                                        setPoFormData({
                                            ...poFormData,
                                            poAmount: formattedInput,

                                        });
                                    }}
                                />
                                {error && (poFormData?.poAmount === null || poFormData?.poAmount === undefined || poFormData?.poAmount === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}
                            </div>
                        </div>

                        <div className="row mb-1 ">
                            {/* Notes/Instructions*/}
                            <div className="col-md-12 mb-1">
                                <label htmlFor="notes" className="form-label">Notes/Instructions<span className='text-danger'>*</span></label>
                                <textarea
                                    className="form-control"
                                    id="notes"
                                    placeholder="Enter Notes/Instructions"
                                    maxLength={150}
                                    value={poFormData?.notes || ''}
                                    onChange={(e) => {
                                        const numericOnly = e.target.value.replace(/\D/g, ""); // removes all non-digit characters
                                        setPoFormData((prev) => ({ ...prev, notes: e.target.value }));
                                    }}
                                />

                                {error && (poFormData?.notes === null || poFormData?.notes === undefined || poFormData?.notes === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}
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
            <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={modelRequestData?.Action === null ? poAddMassage : poUpdateMassage} />
            <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
        </>
    )
}

export default CreatePOModal
