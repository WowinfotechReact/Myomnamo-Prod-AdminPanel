import React, { useContext, useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import Select from 'react-select';
import 'react-calendar/dist/Calendar.css';
import { ConfigContext } from 'context/ConfigContext';
import { AddUpdateMaterial, GetMaterialModel } from 'services/Material/MaterialApi';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { AddUpdateProductStock, GetProductStockModel, GetRawMaterialProductLookupList } from 'services/ProductStock/ProductStockApi';
import { GetWarehouseLookupList } from 'services/InventoryReport/InventoryReportApi';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import dayjs from 'dayjs';

const AddMaterialModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
    const { setLoader, isValidEmail, formatToIndianCurrency, isValidPAN, user } = useContext(ConfigContext);
    const [error, setError] = useState(false)
    const [customError, setCustomError] = useState(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [titleName, setTitleName] = useState(null)
    const [rawMaterialList, setRawMaterialList] = useState([])
    const [warehouseList, setWarehouseList] = useState([])
    const [materialForm, setMaterialForm] = useState({
        rawMaterialItems: null,
        quantity: null,
        unitPrice: null,
        totalAmount: null,
        warehouseID: null
    })

    useEffect(() => {
        if (show) {

            GetRawMaterialProductLookupListData()
            GetWarehouseLookupListData()
            if (modelRequestData?.Action !== null) {
                GetProductStockModelData()
            }

            if (modelRequestData?.Action === null && modelRequestData?.moduleName === 'Stock') {
                setTitleName('Add Stock')
                setMaterialForm((prev) => ({ ...prev, rawMaterialItems: modelRequestData?.productStockID, warehouseID: modelRequestData?.warehouseID }))
            } else if (modelRequestData?.Action !== null && modelRequestData?.moduleName === 'Stock') {
                setTitleName('Update Stock')
            } else if (modelRequestData?.Action === null && modelRequestData?.moduleName === 'Material') {
                setTitleName('Add Material')
            } else if (modelRequestData?.Action !== null && modelRequestData?.moduleName === 'Material') {
                setTitleName('Update Material')
            }
        }
    }, [show])

    useEffect(() => {

        if (materialForm?.quantity !== null && materialForm?.quantity !== undefined && materialForm?.quantity !== "" && materialForm?.unitPrice !== null && materialForm?.unitPrice !== undefined && materialForm?.unitPrice !== "") {
            calculateTotalAmounts()
        } else {
            setMaterialForm(((prev) => ({ ...prev, totalAmount: null })))
            return
        }
    }, [materialForm?.quantity, materialForm?.unitPrice])

    const calculateTotalAmounts = () => {
        const total = materialForm?.unitPrice * materialForm?.quantity
        setMaterialForm(((prev) => ({ ...prev, totalAmount: total })))
    }

    const GetRawMaterialProductLookupListData = async () => {
        try {
            const response = await GetWarehouseLookupList();
            if (response?.data?.statusCode === 200) {
                const list = response?.data?.responseData?.data || [];
                const formattedOptions = list.map((item) => ({
                    value: item.warehouseID,
                    label: item.warehouseName
                }));
                setWarehouseList(formattedOptions);
            } else {
                console.error('Failed to fetch lookup list:', response?.data?.statusMessage || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching lookup list:', error);
        }
    };
    const GetWarehouseLookupListData = async () => {
        try {
            const response = await GetRawMaterialProductLookupList();
            if (response?.data?.statusCode === 200) {
                const list = response?.data?.responseData?.data || [];
                const formattedOptions = list.map((item) => ({
                    value: item.productID,
                    label: item.productName
                }));
                setRawMaterialList(formattedOptions);
            } else {
                console.error('Failed to fetch lookup list:', response?.data?.statusMessage || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching lookup list:', error);
        }
    };

    const SubmitBtnClicked = () => {
        let isValid = true
        if (materialForm?.quantity === null || materialForm?.quantity === undefined || materialForm?.quantity === '' ||
            materialForm?.unitPrice === null || materialForm?.unitPrice === undefined || materialForm?.unitPrice === '' ||
            materialForm?.totalAmount === null || materialForm?.totalAmount === undefined || materialForm?.totalAmount === '' ||
            materialForm?.rawMaterialItems?.length === 0

        ) {
            setError(true)
            isValid = false
        }

        const apiParam = {
            adminID: user?.adminID,
            materialID: modelRequestData?.materialID,
            purchaseID: modelRequestData?.purchaseID,
            productStockID: modelRequestData?.productStockID,
            producT_ID: materialForm?.rawMaterialItems,
            warehouseID: materialForm?.warehouseID,
            quantity: materialForm?.quantity,
            unitPrice: materialForm?.unitPrice,
            totalAmount: materialForm?.totalAmount,
            receivedDate: modelRequestData?.moduleName === 'Stock' ? materialForm?.receivedDate : null

        }
        if (isValid) {
            AddUpdateMaterialData(apiParam)
        }
    }

    const GetProductStockModelData = async () => {
        setLoader(true);
        try {
            const response = await GetProductStockModel(modelRequestData?.productStockID);
            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        setMaterialForm((prev) => ({
                            ...prev,
                            vendorName: List?.vendorName,
                            rawMaterialItems: List?.producT_ID,
                            quantity: List?.quantity,
                            unitPrice: List?.unitPrice,
                            totalAmount: List?.totalAmount,
                            warehouseID: List?.warehouseID,
                            receivedDate: List?.receivedDate
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

    const AddUpdateMaterialData = async (ApiParam) => {
        setLoader(true);
        try {
            const response = await AddUpdateProductStock(ApiParam);
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

    const SetDataInitial = () => {
        setMaterialForm((prev) => ({
            ...prev,
            rawMaterialItems: null,
            quantity: null,
            unitPrice: null,
            totalAmount: null,
            warehouseID: null
        }))
    }
    const handleDateChange = (newValue) => {
        if (dayjs(newValue).isValid()) {
            const newToDate = dayjs(newValue).format("YYYY-MM-DD");
            setMaterialForm((prev) => ({ ...prev, receivedDate: newToDate }));
        } else {
            setMaterialForm((prev) => ({ ...prev, receivedDate: null }));
        }
    };

    const closeAll = () => {
        SetDataInitial()
        setError(false);
        setCustomError(null);
        setShowSuccessModal(false)
        onHide()

    }
    console.log('modelRequestData', modelRequestData)
    return (
        <>
            <Modal style={{ zIndex: 1300 }} show={show} backdrop="static" keyboard={false} centered>
                <Modal.Header>
                    <h4 className="text-center">{titleName}</h4>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <div className="row mb-1 ">
                            <div className="col-md-6 mb-1">
                                <label htmlFor="rawMaterial" className="form-label">Raw Material Items<span className='text-danger'>*</span></label>
                                <Select

                                    options={rawMaterialList}
                                    value={rawMaterialList?.filter((option) =>
                                        materialForm.rawMaterialItems === option.value)}
                                    onChange={(selectedOption) =>
                                        setMaterialForm((prev) => ({
                                            ...prev,
                                            rawMaterialItems: selectedOption ? selectedOption.value : null,
                                        }))
                                    }
                                    isDisabled={modelRequestData?.moduleName === 'Stock'}
                                    styles={{
                                        container: (provided) => ({
                                            ...provided,
                                            // add custom styles here if needed
                                        }),
                                    }}
                                />
                                {error && (materialForm?.rawMaterialItems === null || materialForm?.rawMaterialItems === undefined || materialForm?.rawMaterialItems === "") ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}
                            </div>
                            <div className="col-md-6 mb-1">
                                <label htmlFor="rawMaterial" className="form-label">Warehouse <span className='text-danger'>*</span></label>
                                <Select

                                    options={warehouseList}
                                    value={warehouseList?.filter((option) =>
                                        materialForm.warehouseID === option.value)}
                                    onChange={(selectedOption) =>
                                        setMaterialForm((prev) => ({
                                            ...prev,
                                            warehouseID: selectedOption ? selectedOption.value : null,
                                        }))
                                    }
                                    isDisabled={modelRequestData?.moduleName === 'Stock'}
                                    styles={{
                                        container: (provided) => ({
                                            ...provided,
                                            // add custom styles here if needed
                                        }),
                                    }}
                                />
                                {error && (materialForm?.warehouseID === null || materialForm?.warehouseID === undefined || materialForm?.warehouseID === "") ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}
                            </div>

                        </div>

                        <div className="row mb-1 ">
                            {/* Unit Price  */}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="qty" className="form-label">
                                    Quantity <span className="text-danger">*</span>
                                </label>
                                <input
                                    type='text'
                                    className="form-control " // reserve space for icon
                                    id="qty"
                                    placeholder="Enter Quantity"
                                    value={materialForm?.quantity}
                                    onChange={(e) => {
                                        const numericOnly = e.target.value.replace(/\D/g, ""); // removes all non-digit characters
                                        setMaterialForm((prev) => ({ ...prev, quantity: parseInt(numericOnly) }));

                                    }}
                                />
                                {error && (materialForm?.quantity === null || materialForm?.quantity === undefined || materialForm?.quantity === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}
                            </div>
                            <div className="col-md-6 mb-1">
                                <label htmlFor="unitPrice" className="form-label">
                                    Unit Price <span className="text-danger">*</span>
                                </label>
                                <input
                                    type='text'
                                    className="form-control " // reserve space for icon
                                    id="unitPrice"
                                    placeholder="Enter Unit Price"
                                    value={formatToIndianCurrency(materialForm?.unitPrice)}
                                    onChange={(e) => {
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
                                        setMaterialForm((prev) => ({ ...prev, unitPrice: formattedInput }));
                                    }}
                                />
                                {error && (materialForm?.unitPrice === null || materialForm?.unitPrice === undefined || materialForm?.unitPrice === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}
                            </div>


                            {/* Total Amount */}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="totalAmount" className="form-label">
                                    Total Amount <span className="text-danger">*</span>
                                </label>
                                <input
                                    type='text'
                                    className="form-control " // reserve space for icon
                                    id="totalAmount"
                                    placeholder="Enter Total Amount"
                                    value={formatToIndianCurrency(materialForm?.totalAmount)}
                                    onChange={(e) => {
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
                                        setMaterialForm((prev) => ({ ...prev, totalAmount: formattedInput }));
                                    }}
                                    disabled
                                />
                                {error && (materialForm?.totalAmount === null || materialForm?.totalAmount === undefined || materialForm?.totalAmount === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}
                            </div>
                            {modelRequestData?.moduleName === 'Stock' && (
                                <div className="col-md-6 mb-1">
                                    <label htmlFor="receivedDate" className="form-label">
                                        Stock Received Date <span className="text-danger">*</span>
                                    </label>
                                    <DatePicker
                                        className="date-picker-input text-nowrap  "
                                        label="From Date"
                                        value={materialForm?.receivedDate ? materialForm?.receivedDate : null}
                                        onChange={handleDateChange}
                                        clearIcon={null}
                                        format='dd/MM/yyyy'
                                    />
                                </div>
                            )}

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
            <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={modelRequestData?.Action === null && modelRequestData?.moduleName === 'Material' ? 'New Material Added Successfully !' : modelRequestData?.Action === 'update' && modelRequestData?.moduleName === 'Material' ? 'Material has been updated successfully!' : modelRequestData?.Action === null && modelRequestData?.moduleName === 'Stock' ? 'New Stock Added Successfully !' : modelRequestData?.Action === 'update' && modelRequestData?.moduleName === 'Stock' ? 'Stock has been updated successfully!' : ''} />
            <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
        </>
    )
}

export default AddMaterialModal
