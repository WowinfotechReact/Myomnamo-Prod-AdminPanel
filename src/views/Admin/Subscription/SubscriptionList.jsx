
import { Tooltip } from '@mui/material'
import NoResultFoundModel from 'component/NoResultFoundModal'
import PaginationComponent from 'component/Pagination'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import Android12Switch from 'component/Android12Switch'

import dayjs from 'dayjs'
import { ConfigContext } from 'context/ConfigContext'
import { debounce } from 'Middleware/Utils'
import { GetPujaList, GetTemplePujaSubscriptionLookupList } from 'services/Admin/Puja/PujaApi'
import AddUpdateSubscriptionPujaModal from './AddUpdateSubscriptionPujaModal'
import { pujaServiceID, pujaSubServiceID } from 'Middleware/Enum'

const SubscriptionList = () => {
    const { setLoader } = useContext(ConfigContext);
    const location = useLocation()
    const navigate = useNavigate()

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

    const [subscriptionList, setSubscriptionList] = useState([]);
    const [modelRequestData, setModelRequestData] = useState({ Action: null, vendorID: null })
    const [showAddVendorModal, setShowAddVendorModal] = useState(false)
    const [showVendorDetailsModal, setShowVendorDetailsModal] = useState(false)
    const [isAddUpdateDone, setIsAddUpdateDone] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showAddUpdateModal, setShowAddUpdateModal] = useState(false)
    const [pageHeading, setPageHeading] = useState("Subscription List")


    useEffect(() => {

        if (location?.pathname === "/subscription-homam") {
            setPageHeading("Homam Subscription List")
            setModelRequestData((prev) => ({ ...prev, pujaServiceID: pujaServiceID?.SankalpPuja, pujaSubServiceID: pujaSubServiceID?.SubscriptionHomamPuja }))
            GetTemplePujaSubscriptionLookupListData(1, null, pujaServiceID?.SankalpPuja, pujaSubServiceID?.SubscriptionHomamPuja)
        } else if (location?.pathname === "/subscription-puja") {
            setPageHeading("Remedy Puja Subscription List")
            setModelRequestData((prev) => ({ ...prev, pujaServiceID: pujaServiceID?.SankalpPuja, pujaSubServiceID: pujaSubServiceID?.SubscriptionRemedyPuja }))
            GetTemplePujaSubscriptionLookupListData(1, null, pujaServiceID?.SankalpPuja, pujaSubServiceID?.SubscriptionRemedyPuja)
        } else if (location?.pathname === "/puja-at-temple") {
            setPageHeading("Puja At Temple List")
            setModelRequestData((prev) => ({ ...prev, pujaServiceID: pujaServiceID?.PujaAtTemple, pujaSubServiceID: pujaSubServiceID?.PujaAtTemple }))
            GetTemplePujaSubscriptionLookupListData(1, null, pujaServiceID?.PujaAtTemple, pujaSubServiceID?.PujaAtTemple)

        }

    }, [location])


    useEffect(() => {
        if (isAddUpdateDone) {
            setCurrentPage(1)
            GetTemplePujaSubscriptionLookupListData(1, null, modelRequestData?.pujaServiceID, modelRequestData?.pujaSubServiceID)
            setIsAddUpdateDone(false)
        }
    }, [isAddUpdateDone])


    const GetTemplePujaSubscriptionLookupListData = async (pageNumber, searchKeywordValue, pujaServiceID, pujaSubServiceID) => {
        setLoader(true);
        try {
            const response = await GetTemplePujaSubscriptionLookupList(pujaSubServiceID, pujaServiceID)

            debugger
            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        const totalCount = response.data.totalCount;

                        setTotalCount(totalCount);
                        setTotalPages(Math.ceil(totalCount / pageSize));
                        setTotalRecords(List?.length);

                        if (pujaSubServiceID === 3) {
                            const selectedPuja = List
                                .filter(item => item.isSubscriptionRemedyPuja)   // ✅ filter condition

                            setSubscriptionList(selectedPuja);
                            setTotalRecords(selectedPuja?.length);
                        } else if (pujaSubServiceID === 4) {
                            const selectedPuja = List
                                .filter(item => item.isSubscriptionHomamPuja)   // ✅ filter condition

                            setSubscriptionList(selectedPuja);
                            setTotalRecords(selectedPuja?.length);

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

    const ChangeStatusData = async (value) => {
        setLoader(true);
        try {
            // const response = await ChangeVendorStatus(value?.vendorID);
            const response = null;

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


    const AddBtnClicked = () => {
        setModelRequestData((prev) => ({ ...prev, Action: null, pujaKeyID: null }))
        setShowAddUpdateModal(true)
    }

    const updateBtnClicked = (value) => {

        setModelRequestData((prev) => ({
            ...prev, Action: 'update',
            pujaKeyID: value?.pujakeyID
        }))
        setShowAddUpdateModal(true)
    }


    const fetchSearchResults = (searchValue) => {
        GetTemplePujaSubscriptionLookupListData(1, searchValue, modelRequestData?.pujaServiceID, modelRequestData?.pujaSubServiceID)
    };
    const debouncedSearch = useCallback(debounce(fetchSearchResults, 500), []);

    const handleSearchChange = (e) => {
        setCurrentPage(1)
        const value = e.target.value;
        setSearchKeyword(value);
        // debouncedSearch(value);
        GetTemplePujaSubscriptionLookupListData(1, value, modelRequestData?.pujaServiceID, modelRequestData?.pujaSubServiceID)
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setSubscriptionList([])
        GetTemplePujaSubscriptionLookupListData(pageNumber, searchKeyword, modelRequestData?.pujaServiceID, modelRequestData?.pujaSubServiceID)
    }
    const onSuccessClose = () => {
        setShowSuccessModal(false)
        setIsAddUpdateDone(true)
    }

    const HandleAddPackage = (value) => {
        navigate('/packages-List', {
            state: {
                data: value,
                pujaServiceID: modelRequestData?.pujaServiceID,
                pujaSubServiceID: modelRequestData?.pujaSubServiceID
            },
        })

    }
    return (
        <>
            <div className="card">
                <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h5 className="m-0">{pageHeading}</h5>
                        <button onClick={() => AddBtnClicked()} className="btn btn-primary btn-sm d-inline d-sm-none">
                            <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                            <span className="d-inline d-sm-none"> Add</span>
                        </button>
                    </div>

                    <div className="d-flex flex-wrap justify-content-end align-items-center mb-3 gap-2">
                        {/* Search Box */}
                        {/* <input
                            type="text"
                            className="form-control"
                            placeholder="Search..."
                            style={{ maxWidth: '350px' }}
                            value={searchKeyword}
                            onChange={handleSearchChange}
                        /> */}

                        {/* Action Buttons */}
                        <div className="d-flex gap-2 align-items-center">
                            <Tooltip title="Add Subscription Puja">
                                <button
                                    onClick={() => AddBtnClicked()}
                                    className="btn btn-primary btn-sm"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i>
                                    <span className="d-none d-sm-inline">Add Subscription Puja</span>
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
                                            Puja Name
                                        </th>


                                        <th className="text-center actionSticky" style={{ whiteSpace: 'nowrap' }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscriptionList?.map((item, idx) => (
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
                                                {item.pujaName}

                                            </td>



                                            <td className="text-center actionColSticky" style={{ zIndex: 4 }}>
                                                <div className="d-flex justify-content-center gap-2">
                                                    <Tooltip title="Update Package">
                                                        <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => HandleAddPackage(item)} >
                                                            Add Package
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
            <AddUpdateSubscriptionPujaModal show={showAddUpdateModal} onHide={() => setShowAddUpdateModal(false)} modelRequestData={modelRequestData} setIsAddUpdateDone={setIsAddUpdateDone} />
        </>
    )
}

export default SubscriptionList
