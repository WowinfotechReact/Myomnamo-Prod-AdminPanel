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
import AddMaterialModal from 'views/PurchaseManagement/AddMaterialModal'
import { GetMaterialList } from 'services/Material/MaterialApi'
import { ConfigContext } from 'context/ConfigContext'
import { GetProductStockListByPurchaseID } from 'services/ProductStock/ProductStockApi'


const MaterialPage = () => {
    const location = useLocation()
    const { setLoader } = useContext(ConfigContext);
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

    const [materialList, setMaterialList] = useState([])
    const [modelRequestData, setModelRequestData] = useState({ Action: null, })

    const [showAddUpdateModal, setShowAddUpdateModal] = useState(false)
    const [isAddUpdateDone, setIsAddUpdateDone] = useState(false)

    useEffect(() => {
        GetProductStockListByPurchaseIDData(1, null)
    }, [])
    useEffect(() => {
        if (isAddUpdateDone) {
            GetProductStockListByPurchaseIDData(1, null)
            setIsAddUpdateDone(false)
        }
    }, [isAddUpdateDone])

    const GetProductStockListByPurchaseIDData = async (pageNumber, searchKeywordValue) => {

        setLoader(true);
        try {
            const response = await GetProductStockListByPurchaseID({
                pageSize: pageSize,
                pageNo: pageNumber - 1,
                sortingDirection: sortingType ? sortingType : null,
                sortingColumnName: sortValueName ? sortValueName : null,
                searchKeyword: searchKeywordValue === undefined || searchKeywordValue === null ? searchKeyword : searchKeywordValue,
                fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,

            }, location?.state?.value?.purchaseID);
            if (response?.data?.statusCode === 200) {
                setLoader(false);
                if (response?.data?.responseData?.data) {
                    const List = response.data.responseData.data;
                    const totalCount = response.data.totalCount;

                    setTotalCount(totalCount);
                    setTotalPages(Math.ceil(totalCount / pageSize));
                    setMaterialList(List);
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
        setMaterialList([]);
        setTotalRecords(-1);
    };

    const AddBtnClicked = () => {
        setModelRequestData((prev) => ({ ...prev, Action: null, materialID: null, productStockID: null, purchaseID: location?.state?.value?.purchaseID, moduleName: 'Material' }))
        setShowAddUpdateModal(true)
    }
    const UpdateBtnClicked = (value) => {
        setModelRequestData((prev) => ({ ...prev, Action: UpdateBtnClickMassage, materialID: value?.materialID, productStockID: value?.productStockID, purchaseID: location?.state?.value?.purchaseID, moduleName: 'Material' }))
        setShowAddUpdateModal(true)
    }

    return (
        <>
            <div className="card">
                <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h5 className="m-0">Material</h5>
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
                        <span>
                            [{location?.state?.value?.purchaseID}]
                        </span>
                        {/* Action Buttons */}
                        <div className="d-flex gap-2 align-items-center">
                            <Tooltip title="Create PO">
                                <button
                                    onClick={() => AddBtnClicked()}
                                    className="btn btn-primary btn-sm"
                                    style={{ cursor: 'pointer' }}
                                >
                                    {/* <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i> */}
                                    <span className="d-none d-sm-inline">Add New Material</span>
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
                                            Warehouse Name
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Raw Material Items
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Quantity
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Unit
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Total Amount
                                        </th>


                                        <th className="text-center actionSticky" style={{ whiteSpace: 'nowrap' }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {materialList?.map((item, idx) => (
                                        <tr className='text-nowrap text-center' key={item.idx}>

                                            <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                                {(currentPage - 1) * pageSize + idx + 1}
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }} >
                                                {item.warehouseName}

                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }} >
                                                {item.rawMaterialName}

                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }} >
                                                {item.quantity}

                                            </td>
                                            {item.unitPrice === undefined || item.unitPrice === null ? (
                                                '-'
                                            ) : (
                                                <td >{item.unitPrice}</td>
                                            )}
                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.totalAmount}</td>

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
            <AddMaterialModal show={showAddUpdateModal} onHide={() => setShowAddUpdateModal(false)} modelRequestData={modelRequestData} setIsAddUpdateDone={setIsAddUpdateDone} />
        </>
    )
}

export default MaterialPage
