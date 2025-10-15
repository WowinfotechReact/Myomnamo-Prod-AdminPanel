import { Tooltip } from '@mui/material'
import NoResultFoundModel from 'component/NoResultFoundModal'
import PaginationComponent from 'component/Pagination'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AddNewVendorModal from './AddNewVendorModal'
import Android12Switch from 'component/Android12Switch'
import ViewDetails from './ViewDetails'
import dayjs from 'dayjs'
import { ConfigContext } from 'context/ConfigContext'
import { ChangeVendorStatus, GetVendorList } from 'services/Vendor/VendorApi'
import { debounce } from 'Middleware/Utils'
import SuccessPopupModal from 'component/SuccessPopupModal'
import { ChangeStatusMassage } from 'component/GlobalMassage'

const VendorMaster = () => {
    const { setLoader } = useContext(ConfigContext);

    const [toDate, setToDate] = useState(null);
    const [fromDate, setFromDate] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState(null);
    const [totalCount, setTotalCount] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(-1);
    const [pageSize, setPageSize] = useState(20);
    const [sortingType, setSortingType] = useState(null)
    const [sortValueName, setSortValueName] = useState(null)

    const [vendorList, setVendorList] = useState([]);
    const [modelRequestData, setModelRequestData] = useState({ Action: null, vendorID: null })
    const [showAddVendorModal, setShowAddVendorModal] = useState(false)
    const [showVendorDetailsModal, setShowVendorDetailsModal] = useState(false)
    const [isAddUpdateDone, setIsAddUpdateDone] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    useEffect(() => {
        GetVendorListData(1, null)
    }, [])

    useEffect(() => {
        if (isAddUpdateDone) {
            GetVendorListData(currentPage, null)
            setIsAddUpdateDone(false)
        }

    }, [isAddUpdateDone])

    const GetVendorListData = async (pageNumber, searchKeywordValue) => {
        setLoader(true);
        try {
            const response = await GetVendorList({
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
                        setVendorList(List);
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

    const AddVendorBtnClicked = () => {
        setModelRequestData((prev) => ({ ...prev, Action: null, vendorID: null }))
        setShowAddVendorModal(true)
    }

    const updateVendorBtnClicked = (value) => {
        setModelRequestData((prev) => ({
            ...prev, Action: 'update',
            vendorID: value?.vendorID
        }))
        setShowAddVendorModal(true)
    }
    const vendorDetailsBtnClicked = (value) => {
        setModelRequestData((prev) => ({
            ...prev, Action: 'View',
            vendorID: value?.vendorID
        }))
        setShowVendorDetailsModal(true)
    }

    const ChangeVendorStatusData = async (value) => {
        setLoader(true);
        try {
            const response = await ChangeVendorStatus(value?.vendorID);

            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        // setIsAddUpdateDone(true)
                        setShowSuccessModal(true)
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

    const fetchSearchResults = (searchValue) => {
        GetVendorListData(currentPage, searchValue);
    };
    const debouncedSearch = useCallback(debounce(fetchSearchResults, 500), []);

    const handleSearchChange = (e) => {
        setCurrentPage(1)
        const value = e.target.value;
        setSearchKeyword(value);
        debouncedSearch(value);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setVendorList([])
        GetVendorListData(pageNumber, null)
    }
    const onSuccessClose = () => {
        setShowSuccessModal(false)
        setIsAddUpdateDone(true)
    }
    return (
        <>
            <div className="card">
                <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h5 className="m-0">Vendor Master</h5>
                        <button onClick={() => LeadAddBtnClicked()} className="btn btn-primary btn-sm d-inline d-sm-none">
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
                            style={{ maxWidth: '350px' }}
                            onChange={handleSearchChange}
                        />

                        {/* Action Buttons */}
                        <div className="d-flex gap-2 align-items-center">
                            <Tooltip title="Add Vendor">
                                <button
                                    onClick={() => AddVendorBtnClicked()}
                                    className="btn btn-primary btn-sm"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i>
                                    <span className="d-none d-sm-inline">Add Vendor</span>
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
                                        {/* <th className="text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                            />
                                        </th> */}
                                        <th className="text-center">Sr No.</th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Vendor Name
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Contact Person
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Contact Number
                                        </th>

                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Email ID
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Address
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            GST Number
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            PAN Number
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Status
                                        </th>
                                        <th className="text-center actionSticky" style={{ whiteSpace: 'nowrap' }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vendorList?.map((item, idx) => (
                                        <tr className='text-nowrap' key={item.idx}>
                                            {/* <td style={{ whiteSpace: 'nowrap' }}>{item.id}</td> */}
                                            {/* <td className="text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLeadIDs.includes(item.leadID)}
                                                    onChange={() => handleCheckboxChange(item.leadID)}
                                                />
                                            </td> */}
                                            <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                                {(currentPage - 1) * pageSize + idx + 1}
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {item.vendorName}

                                            </td>

                                            <td>{item.contactPersonName}</td>

                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.contactNumber}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.emailID}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {item.address?.length > 35 ? (
                                                    <Tooltip title={item.address} arrow>
                                                        <span className="cursor-pointer">{item.address.substring(0, 35)}...</span>
                                                    </Tooltip>
                                                ) : (
                                                    item.address
                                                )}
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.gstNumber}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.panNumber}</td>
                                            <td className="text-center text-nowrap" onClick={() =>
                                                ChangeVendorStatusData(item)
                                            }>
                                                <Tooltip title={item.status === true ? 'Enable' : 'Disable'}>
                                                    {item.status === true ? 'Enable' : 'Disable'}
                                                    <Android12Switch
                                                        style={{ padding: '8px' }} checked={item.status === true} />
                                                </Tooltip>
                                            </td>

                                            <td className="text-center actionColSticky" style={{ zIndex: 4 }}>
                                                <div className="d-flex gap-2">
                                                    <Tooltip title="Update Vendor">
                                                        <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => updateVendorBtnClicked(item)}>
                                                            <i class="fas fa-edit"></i>
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="View Details">
                                                        <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => vendorDetailsBtnClicked(item)}>
                                                            <i class="fas fa-eye"></i>
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
            <AddNewVendorModal show={showAddVendorModal} onHide={() => setShowAddVendorModal(false)} modelRequestData={modelRequestData} setIsAddUpdateDone={setIsAddUpdateDone} setVendorList={setVendorList} />
            <ViewDetails show={showVendorDetailsModal} onHide={() => setShowVendorDetailsModal(false)} modelRequestData={modelRequestData} setIsAddUpdateDone={setIsAddUpdateDone} setVendorList={setVendorList} />
            <SuccessPopupModal show={showSuccessModal} onHide={(() => onSuccessClose())} successMassage={ChangeStatusMassage} />
        </>
    )
}

export default VendorMaster
