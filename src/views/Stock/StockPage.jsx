import { Tooltip } from '@mui/material'
import NoResultFoundModel from 'component/NoResultFoundModal'
import PaginationComponent from 'component/Pagination'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import Android12Switch from 'component/Android12Switch'
import DatePicker from 'react-date-picker'
import 'react-calendar/dist/Calendar.css';
import Select from 'react-select';
import { UpdateBtnClickMassage } from 'component/GlobalMassage'
import AddStockModal from 'views/WareHouse Stock/AddStockModal'
import { GetProductStockListByWareHouseID } from 'services/ProductStock/ProductStockApi'
import { ConfigContext } from 'context/ConfigContext'
import AddMaterialModal from 'views/PurchaseManagement/AddMaterialModal'


const StockPage = () => {
    const { setLoader, formatToIndianCurrency } = useContext(ConfigContext);
    const location = useLocation()
    const [toDate, setToDate] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState(null);
    const [totalCount, setTotalCount] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(30);

    const [sortingType, setSortingType] = useState(null)
    const [sortValueName, setSortValueName] = useState(null)

    const [totalQuantity, setTotalQuantity] = useState(0)
    const [stockList, setStockList] = useState([])
    const [modelRequestData, setModelRequestData] = useState({ Action: null, })

    const [showAddUpdateModal, setShowAddUpdateModal] = useState(false)
    const [isAddUpdateDone, setIsAddUpdateDone] = useState(false)


    useEffect(() => {
        GetProductStockListByWareHouseIData(1, null)
    }, [])
    useEffect(() => {
        if (isAddUpdateDone) {
            GetProductStockListByWareHouseIData(1, null)
            setIsAddUpdateDone(false)
        }
    }, [isAddUpdateDone])

    useEffect(() => {
        if (stockList?.length > 0) {
            CalculateTotalQty()
        }
    }, [stockList])
    const GetProductStockListByWareHouseIData = async (pageNumber, searchKeywordValue) => {

        setLoader(true);
        try {
            const response = await GetProductStockListByWareHouseID({
                pageSize: pageSize,
                pageNo: pageNumber - 1,
                sortingDirection: sortingType ? sortingType : null,
                sortingColumnName: sortValueName ? sortValueName : null,
                searchKeyword: searchKeywordValue === undefined || searchKeywordValue === null ? searchKeyword : searchKeywordValue,
                fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,

            }, location?.state?.value?.warehouseID, location?.state?.value?.producT_ID);
            if (response?.data?.statusCode === 200) {
                setLoader(false);
                if (response?.data?.responseData?.data) {
                    const List = response.data.responseData.data;
                    const totalCount = response.data.totalCount;

                    setTotalCount(totalCount);
                    setTotalPages(Math.ceil(totalCount / pageSize));
                    setStockList(List);
                    setTotalRecords(List?.length);
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

    const handlePageChange = (pageNumber) => {
        setStockList([]);
        setTotalRecords(-1);
    };

    const AddBtnClicked = () => {
        setModelRequestData((prev) => ({
            ...prev, Action: null, moduleName: 'Stock',
            productStockID: location?.state?.value?.producT_ID,
            warehouseID: location?.state?.value?.warehouseID,
        }))
        setShowAddUpdateModal(true)
    }
    const UpdateBtnClicked = (value) => {
        setModelRequestData((prev) => ({
            ...prev, Action: UpdateBtnClickMassage,
            materialID: null,
            productStockID: value?.productStockID,
            warehouseID: location?.state?.value?.warehouseID,
            moduleName: 'Stock'
        }))
        setShowAddUpdateModal(true)
    }
    const CalculateTotalQty = () => {
        const totalQty = stockList?.reduce((total, value) => total + (value?.quantity || 0), 0);
        setTotalQuantity(totalQty)
    }
    return (
        <>
            <div className="card">
                <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h5 className="m-0">Stock</h5>
                        <button className="btn btn-primary btn-sm d-inline d-sm-none">
                            <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                            <span className="d-inline d-sm-none"> Add</span>
                        </button>
                    </div>

                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                        {/* Search Box */}
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search..."
                            style={{ maxWidth: '200px' }}

                        />

                        {/* Action Buttons */}
                        <div className="d-flex gap-2 align-items-center">
                            <Tooltip title="Create PO">
                                <button
                                    onClick={() => AddBtnClicked()}
                                    className="btn btn-primary btn-sm"
                                    style={{ cursor: 'pointer' }}
                                >
                                    {/* <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i> */}
                                    <span className="d-none d-sm-inline">Add New Stock</span>
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                    <h6 > <span className='fw-semibold '>Warehouse Name:</span> {location?.state?.value?.warehouseName}</h6>
                    <h6 > <span className='fw-semibold '>Product Name:</span> {location?.state?.value?.itemName}</h6>
                    <h5>Total Stock : {totalQuantity}</h5>
                    <div>
                        <div className="table-responsive" style={{ maxHeight: '65vh' }}>
                            <Table striped bordered hover>
                                <thead className="table-light  ">
                                    <tr
                                        style={{
                                            position: 'sticky',
                                            top: -1,
                                            backgroundColor: '#fff',
                                            zIndex: 10,
                                            boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
                                        }}
                                        className="text-nowrap"
                                    >

                                        <th className="text-center">Sr No.</th>
                                        {/* <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Warehouse Name
                                        </th> */}
                                        {/* <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Raw Material Items
                                        </th> */}
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Quantity
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Unit
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Total Amount
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Received Date
                                        </th>


                                        <th className="text-center actionSticky" style={{ whiteSpace: 'nowrap' }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stockList?.map((item, idx) => (
                                        <tr className='text-nowrap text-center' key={item.idx}>

                                            <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                                {(currentPage - 1) * pageSize + idx + 1}
                                            </td>
                                            {/* <td style={{ whiteSpace: 'nowrap' }} >
                                                {item.warehouseName}

                                            </td> */}
                                            {/* <td style={{ whiteSpace: 'nowrap' }} >
                                                {item.rawMaterialName}

                                            </td> */}
                                            <td style={{ whiteSpace: 'nowrap' }} >
                                                {item.quantity}

                                            </td>
                                            {item.unitPrice === undefined || item.unitPrice === null ? (
                                                '-'
                                            ) : (
                                                <td >{formatToIndianCurrency(item.unitPrice)}</td>
                                            )}
                                            <td style={{ whiteSpace: 'nowrap' }}>{formatToIndianCurrency(item?.totalAmount)}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{(item?.receivedDate)}</td>

                                            <td className="text-center actionColSticky" style={{ zIndex: 4 }}>
                                                <div className="d-flex gap-2">
                                                    <Tooltip title="Update Raw Material">
                                                        <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => UpdateBtnClicked(item)}>
                                                            <i class="fas fa-edit"></i>
                                                        </Button>
                                                    </Tooltip>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
                        </div>
                        {totalCount > pageSize && (
                            <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
                        )}
                    </div>
                </div>

            </div>
            <AddMaterialModal show={showAddUpdateModal} onHide={(() => setShowAddUpdateModal(false))} modelRequestData={modelRequestData} setIsAddUpdateDone={setIsAddUpdateDone} />
        </>
    )
}

export default StockPage
