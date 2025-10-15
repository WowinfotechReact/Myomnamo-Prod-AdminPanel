import { Tooltip } from '@mui/material'
import Android12Switch from 'component/Android12Switch'
import { ChangeStatusMassage } from 'component/GlobalMassage'
import NoResultFoundModel from 'component/NoResultFoundModal'
import PaginationComponent from 'component/Pagination'
import SuccessPopupModal from 'component/SuccessPopupModal'
import { ConfigContext } from 'context/ConfigContext'
import dayjs from 'dayjs'
import { pujaServiceID, pujaSubServiceID } from 'Middleware/Enum'
import { debounce } from 'Middleware/Utils'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router'
import { ChangePujaStatus, GetPujaList } from 'services/Admin/Puja/PujaApi'
import AddUpdatePujaModal from './AddUpdatePujaModal'

const LanguageWisePujaList = () => {
    const { setLoader } = useContext(ConfigContext);
    const navigate = useNavigate()
    const location = useLocation()
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState(null);
    const [totalCount, setTotalCount] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(-1);
    const [pageSize, setPageSize] = useState(20);
    const [sortingType, setSortingType] = useState(null)
    const [sortValueName, setSortValueName] = useState(null)

    const [modelRequestData, setModelRequestData] = useState({ Action: null, vendorID: null, moduleName: 'LanguageWiseList' })
    const [showAddTempleModal, setShowAddTempleModal] = useState(false)
    const [showVendorDetailsModal, setShowVendorDetailsModal] = useState(false)
    const [isAddUpdateDone, setIsAddUpdateDone] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const [pujaList, setPujaList] = useState([])
    const [toDate, setToDate] = useState(null);
    const [fromDate, setFromDate] = useState(null);


    useEffect(() => {

        GetPujaListData(1, null, location?.state?.pujaServiceID, location?.state?.pujaSubServiceID)
        setModelRequestData((prev) => ({ ...prev, pujaServiceID: location?.state?.pujaServiceID, pujaSubServiceID: location?.state?.pujaSubServiceID }))
    }, [])

    useEffect(() => {
        if (isAddUpdateDone) {
            GetPujaListData(currentPage, null, modelRequestData?.pujaServiceID, modelRequestData?.pujaSubServiceID)
            setIsAddUpdateDone(false)
        }

    }, [isAddUpdateDone])

    // ------------API Callings--------------------
    const GetPujaListData = async (pageNumber, searchKeywordValue, pujaServiceID, pujaSubServiceID) => {
        setLoader(true);
        try {
            const response = await GetPujaList({
                pageSize: pageSize,
                pageNo: pageNumber - 1,
                sortingDirection: sortingType ? sortingType : null,
                sortingColumnName: sortValueName ? sortValueName : null,
                searchKeyword: searchKeywordValue === undefined || searchKeywordValue === null ? searchKeyword : searchKeywordValue,
                fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
                pujaServiceID: pujaServiceID,
                pujaSubServiceID: pujaSubServiceID,


            }, location?.state?.data?.pujakeyID);

            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        const totalCount = response.data.totalCount;

                        setTotalCount(totalCount);
                        setTotalPages(Math.ceil(totalCount / pageSize));
                        setPujaList(List);
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

    const ChangeStatusData = async (value) => {

        setLoader(true);
        try {
            const response = await ChangePujaStatus(value?.pujakeyID, value?.appLangID);

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

    // ----------Other Functions------------------
    const AddBtnClicked = () => {
        setModelRequestData((prev) => ({ ...prev, Action: null, pujaKeyID: location?.state?.data?.pujakeyID, pujaBylangKeyID: null }))
        setShowAddTempleModal(true)
    }

    const updateBtnClicked = (value) => {

        setModelRequestData((prev) => ({
            ...prev, Action: 'update',
            pujaKeyID: location?.state?.data?.pujakeyID,
            pujaBylangKeyID: value?.pujaBylangKeyID,
            appLangID: value?.appLangID
        }))
        setShowAddTempleModal(true)
    }
    const fetchSearchResults = (searchValue) => {
        GetPujaListData(currentPage, searchValue, modelRequestData?.pujaServiceID, modelRequestData?.pujaSubServiceID);
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
        setPujaList([])
        GetPujaListData(pageNumber, null, modelRequestData?.pujaServiceID, modelRequestData?.pujaSubServiceID)
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

                        {/* Back Button – always visible */}
                        <button
                            onClick={() => window.history.back()}
                            className="btn btn-outline-secondary btn-sm"
                        >
                            <i className="fa-solid fa-arrow-left me-1" style={{ fontSize: '11px' }}></i>
                            <span className="d-none d-sm-inline">Back</span>
                        </button>

                        {/* Title – centered */}
                        <h5 className="m-0 text-center flex-grow-1">  {location?.state?.data?.pujaName}</h5>

                        {/* Add Button – visible only on mobile (<576px) */}
                        <button
                            onClick={AddBtnClicked}
                            className="btn btn-primary btn-sm d-inline d-sm-none"
                        >
                            <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                            <span className="ms-1">Add</span>
                        </button>
                    </div>
                    <hr />

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
                            <Tooltip title="Add Language">
                                <button
                                    onClick={() => AddBtnClicked()}
                                    className="btn btn-primary btn-sm"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i>
                                    <span className="d-none d-sm-inline">Add Language</span>
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
                                            Puja Name
                                        </th>

                                        {location?.state?.data?.pujaType === "Both" ? (
                                            <>
                                                <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                    Online Puja Price (₹)
                                                </th>
                                                <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                    Offline Puja Price (₹)
                                                </th>
                                            </>
                                        ) : (
                                            <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                Puja Price (₹)
                                            </th>
                                        )}

                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Language Name
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
                                    {pujaList?.map((item, idx) => (
                                        <tr className='text-nowrap  text-center' key={item.idx}>

                                            <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                                {(currentPage - 1) * pageSize + idx + 1}
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {item.pujaName === null ? '-' : item?.pujaName}

                                            </td>


                                            {item?.pujaType === "Both" ? (
                                                <>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{item?.onlinePujaPrice === null ? '-' : item?.onlinePujaPrice}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{item?.offlinePujaPrice === null ? '-' : item?.offlinePujaPrice}</td>
                                                </>

                                            ) : item?.pujaType === "Offline" ? (
                                                <td style={{ whiteSpace: 'nowrap' }}>{item?.offlinePujaPrice === null ? '-' : item?.offlinePujaPrice}</td>
                                            ) : item?.pujaType === "Online" ? (
                                                <td style={{ whiteSpace: 'nowrap' }}>{item?.onlinePujaPrice === null ? '-' : item?.onlinePujaPrice}</td>
                                            ) : <td style={{ whiteSpace: 'nowrap' }}>{item?.offlinePujaPrice === null ? '-' : item?.offlinePujaPrice}</td>}

                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {item.languageName === null ? '-' : item?.languageName}

                                            </td>

                                            <td className="text-center text-nowrap"
                                                onClick={() => ChangeStatusData(item)}
                                            >
                                                <Tooltip title={item.status === true ? 'Enable' : 'Disable'}>
                                                    {item.status === true ? 'Enable' : 'Disable'}
                                                    <Android12Switch
                                                        style={{ padding: '8px' }} checked={item.status === true} />
                                                </Tooltip>
                                            </td>

                                            <td className="text-center actionColSticky" style={{ zIndex: 4 }}>
                                                <div className="d-flex gap-2 justify-content-center">
                                                    <Tooltip title="Update Language">
                                                        <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => updateBtnClicked(item)}>
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
            <AddUpdatePujaModal show={showAddTempleModal} onHide={() => setShowAddTempleModal(false)} modelRequestData={modelRequestData} setIsAddUpdateDone={setIsAddUpdateDone} />
            <SuccessPopupModal show={showSuccessModal} onHide={(() => onSuccessClose())} successMassage={ChangeStatusMassage} />
        </>
    )
}

export default LanguageWisePujaList
