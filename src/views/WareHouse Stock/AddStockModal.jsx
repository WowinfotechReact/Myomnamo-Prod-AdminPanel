import React, { useContext, useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import Select from 'react-select';
import 'react-calendar/dist/Calendar.css';
import { ConfigContext } from 'context/ConfigContext';
import { GetWarehouseLookupList } from 'services/InventoryReport/InventoryReportApi';
import { AddUpdateProductStock, GetProductStockModel, GetRawMaterialProductLookupList } from 'services/ProductStock/ProductStockApi';
const AddStockModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
    const { setLoader, isValidEmail, formatToIndianCurrency, isValidPAN, user } = useContext(ConfigContext);
    const [error, setError] = useState(false)
    const [customError, setCustomError] = useState(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [rawMaterialList, setRawMaterialList] = useState([])
    const [warehouseList, setWarehouseList] = useState([])
    const [stockFrom, setStockForm] = useState({
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
        }
    }, [show])

    useEffect(() => {

        if (stockFrom?.quantity !== null && stockFrom?.quantity !== undefined && stockFrom?.quantity !== "" && stockFrom?.unitPrice !== null && stockFrom?.unitPrice !== undefined && stockFrom?.unitPrice !== "") {
            calculateTotalAmounts()
        } else {
            return
        }
    }, [stockFrom])

    const calculateTotalAmounts = () => {
        const total = stockFrom?.unitPrice * stockFrom?.quantity
        setStockForm(((prev) => ({ ...prev, totalAmount: total })))
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
        if (stockFrom?.quantity === null || stockFrom?.quantity === undefined || stockFrom?.quantity === '' ||
            stockFrom?.unitPrice === null || stockFrom?.unitPrice === undefined || stockFrom?.unitPrice === '' ||
            stockFrom?.totalAmount === null || stockFrom?.totalAmount === undefined || stockFrom?.totalAmount === '' ||
            stockFrom?.rawMaterialItems?.length === 0

        ) {
            setError(true)
            isValid = false
        }

        const apiParam = {
            adminID: user?.admiN_ID,
            materialID: modelRequestData?.materialID,
            purchaseID: modelRequestData?.purchaseID,
            productStockID: modelRequestData?.productStockID,
            producT_ID: stockFrom?.rawMaterialItems,
            warehouseID: stockFrom?.warehouseID,
            quantity: stockFrom?.quantity,
            unitPrice: stockFrom?.unitPrice,
            totalAmount: stockFrom?.totalAmount
        }
        if (isValid) {
            AddUpdateMaterialData(apiParam)
        }
    }

    const GetProductStockModelData = async () => {
        setLoader(true);
        try {
            const response = await GetProductStockModel(modelRequestData?.purchaseID);
            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        setStockForm((prev) => ({
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
        setStockForm((prev) => ({
            ...prev,
            rawMaterialItems: [],
            quantity: null,
            unitPrice: null,
            totalAmount: null
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
                    <h4 className="text-center">{modelRequestData?.Action === null ? 'Add Stock' : 'Update  Stock '}</h4>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <div className="row mb-1 ">
                            <div className="col-md-6 mb-1">
                                <label htmlFor="qty" className="form-label">
                                    Quantity <span className="text-danger">*</span>
                                </label>
                                <input
                                    type='text'
                                    className="form-control " // reserve space for icon
                                    id="qty"
                                    placeholder="Enter Quantity"
                                    value={modelRequestData?.data?.qty || ''}
                                />
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
                                    value={modelRequestData?.data?.totalAmount || ''}
                                />
                            </div>
                            <div className="col-md-6 mb-1">
                                <label htmlFor="totalAmount" className="form-label">
                                    Total Amount <span className="text-danger">*</span>
                                </label>
                                <input
                                    type='text'
                                    className="form-control " // reserve space for icon
                                    id="totalAmount"
                                    placeholder="Enter Total Amount"
                                    value={modelRequestData?.data?.totalAmount || ''}
                                />
                            </div>
                            <div className="col-md-6 mb-1">
                                <label htmlFor="receivedDate" className="form-label">
                                    Stock Received Date <span className="text-danger">*</span>
                                </label>
                                <DatePicker
                                    className="date-picker-input text-nowrap  "
                                    label="From Date"
                                    // value={fromDate ? fromDate.toDate() : null}
                                    // onChange={handleFromDateChange}
                                    clearIcon={null}
                                // maxDate={toDate ? dayjs(toDate).toDate() : null}
                                />
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
                            onHide();
                        }}
                    >
                        Submit
                    </Button>
                </Modal.Footer>

            </Modal>
        </>
    )
}

export default AddStockModal
