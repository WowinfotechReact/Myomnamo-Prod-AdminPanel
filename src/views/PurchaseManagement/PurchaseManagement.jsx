import { Tooltip } from '@mui/material'
import NoResultFoundModel from 'component/NoResultFoundModal'
import PaginationComponent from 'component/Pagination'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Android12Switch from 'component/Android12Switch'
import DatePicker from 'react-date-picker'
import 'react-calendar/dist/Calendar.css';
import Select from 'react-select';
import CreatePOModal from './CreatePOModal'
import ViewPurchaseDetailsModal from './ViewPurchaseDetailsModal'
import AddMaterialModal from './AddMaterialModal'
import { GetPoList } from 'services/PurchaseManagement/PurchaseManagementApi'
import { ConfigContext } from 'context/ConfigContext'
import dayjs from 'dayjs'
const PurchaseManagement = () => {
    const navigate = useNavigate()
    const { setLoader } = useContext(ConfigContext);

    const [toDate, setToDate] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [POList, setPOList] = useState([
        { PONumber: 'PO-1', vendorName: 'Dhoop', PODate: '12/07/2025', rawMaterialItems: 'Items', qty: '100', orderStatus: 'Pending', paymentStatus: 'Paid' },
        { PONumber: 'PO-2', vendorName: 'Puja Kit', PODate: '12/07/2025', rawMaterialItems: 'Items', qty: '100', orderStatus: 'Approved', paymentStatus: 'Paid' },
        { PONumber: 'PO-3', vendorName: 'Wooden Temple', PODate: '02/07/2025', rawMaterialItems: 'Items', qty: '100', orderStatus: 'Delivered', paymentStatus: 'Paid' },
        { PONumber: 'PO-4', vendorName: 'Kapoor', PODate: '12/07/2025', rawMaterialItems: 'Items', qty: '100', orderStatus: 'Cancelled', paymentStatus: 'Unpaid' },
    ]);
    const [totalRecords, setTotalRecords] = useState(10);
    const [pageSize, setPageSize] = useState(30);
    const [modelRequestData, setModelRequestData] = useState({ Action: null, })
    const [showAddUpdateModal, setShowAddUpdateModal] = useState(false)
    const [isAddUpdateDone, setIsAddUpdateDone] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showAddMaterialModal, setShowAddMaterialModal] = useState(false)
    const [sortingType, setSortingType] = useState(null)
    const [sortValueName, setSortValueName] = useState(null)
    useEffect(() => {
        GetPoListData(1, null)
    }, [])
    useEffect(() => {
        if (isAddUpdateDone) {
            setCurrentPage(1)
            GetPoListData(1, null)
            setIsAddUpdateDone(false)
        }
    }, [isAddUpdateDone])

    const GetPoListData = async (pageNumber, searchKeywordValue) => {
        setLoader(true);
        try {
            const response = await GetPoList({
                pageSize: pageSize,
                pageNo: pageNumber - 1,
                sortingDirection: sortingType ? sortingType : null,
                sortingColumnName: sortValueName ? sortValueName : null,
                searchKeyword: searchKeywordValue === undefined || searchKeywordValue === null ? searchKeyword : searchKeywordValue,
                fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,

            });

            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        const totalCount = response.data.totalCount;

                        setTotalCount(totalCount);
                        setTotalPages(Math.ceil(totalCount / pageSize));
                        setPOList(List);
                        setTotalRecords(List?.length);
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
    const AddBtnClicked = () => {
        setModelRequestData((prev) => ({ ...prev, Action: null, }))
        setShowAddUpdateModal(true)
    }
    const updateBtnClicked = (value) => {
        setModelRequestData((prev) => ({
            ...prev, Action: 'update',
            purchaseID: value?.purchaseID
        }))
        setShowAddUpdateModal(true)
    }

    const PurchaseDetailsBtnClicked = (value) => {
        setModelRequestData((prev) => ({
            ...prev, Action: 'View',
            data: { PONumber: value?.PONumber, vendorName: value?.vendorName, PODate: value?.PODate, rawMaterialItems: value?.rawMaterialItems, qty: value?.qty, orderStatus: value?.orderStatus, paymentStatus: value?.paymentStatus }
        }))
        setShowDetailsModal(true)
    }
    const AddMaterialBtnClicked = (value) => {
        navigate('/material', { state: { value } });
    };

    return (
        <>
            <div className="card">
                <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h5 className="m-0">Purchase Orders</h5>
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
                                    <span className="d-none d-sm-inline">Create PO</span>
                                </button>
                            </Tooltip>
                        </div>

                    </div>
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
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            PO Number
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Vendor Name
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            PO Date
                                        </th>

                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Raw Material Items
                                        </th>

                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Quantity
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Order Status
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Payment Status
                                        </th>
                                        <th className="text-center actionSticky" style={{ whiteSpace: 'nowrap' }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {POList?.map((item, idx) => (
                                        <tr className='text-nowrap text-center' key={item.idx}>

                                            <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                                {(currentPage - 1) * pageSize + idx + 1}
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }} >
                                                {item.poNumber}

                                            </td>
                                            {item.vendorName === undefined || item.vendorName === null ? (
                                                '-'
                                            ) : (
                                                <td className='text-start'>{item.vendorName}</td>
                                            )}
                                            <td style={{ whiteSpace: 'nowrap' }}>{dayjs(item?.poDate).format('DD/MM/YYYY')}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.rawMaterialItems}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.quantity}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.orderStatus}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.paymentStatus}</td>

                                            <td className="text-center actionColSticky" style={{ zIndex: 4 }}>
                                                <div className="d-flex gap-2">
                                                    <Tooltip title="Update PO">
                                                        <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => updateBtnClicked(item)}>
                                                            <i class="fas fa-edit"></i>
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="View Details">
                                                        <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => PurchaseDetailsBtnClicked(item)}>
                                                            <i class="fas fa-eye"></i>
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="Add Material">
                                                        <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => AddMaterialBtnClicked(item)}>
                                                            Add Material
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
                            <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handleLeadPageChange} />
                        )}
                    </div>
                </div>

            </div>
            <CreatePOModal show={showAddUpdateModal} onHide={() => setShowAddUpdateModal(false)} modelRequestData={modelRequestData} setIsAddUpdateDone={setIsAddUpdateDone} />
            <ViewPurchaseDetailsModal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} modelRequestData={modelRequestData} setIsAddUpdateDone={setIsAddUpdateDone} />
            {/* <AddMaterialModal show={showAddMaterialModal} onHide={() => setShowAddMaterialModal(false)} modelRequestData={modelRequestData} setIsAddUpdateDone={setIsAddUpdateDone} /> */}
        </>
    )
}

export default PurchaseManagement
