import { Tooltip } from '@mui/material';
import Android12Switch from 'component/Android12Switch';
import NoResultFoundModel from 'component/NoResultFoundModal'
import PaginationComponent from 'component/Pagination'
import { ConfigContext } from 'context/ConfigContext';
import { debounce } from 'Middleware/Utils';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ChangeDeityStatus, GetDeityList } from 'services/Admin/Deity/DeityApi';
import { Button, Table } from 'react-bootstrap'
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ChangeStatusMassage } from 'component/GlobalMassage';
import AddUpdateDeityModal from './AddUpdateDeityModal';

import StatusChangeModal from 'component/StatusChangeModal';
import { useLocation, useNavigate } from 'react-router';
import dayjs from 'dayjs';


const LanguageWiseDeityList = () => {
    const { setLoader, truncateText } = useContext(ConfigContext);
    const navigate = useNavigate()
    const location = useLocation()

    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState(null);
    const [totalCount, setTotalCount] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(-1);
    const [pageSize, setPageSize] = useState(20);
    const [sortingType, setSortingType] = useState(null)
    const [sortValueName, setSortValueName] = useState(null)

    const [modelRequestData, setModelRequestData] = useState({ Action: null, deityByLangKeyID: null, moduleName: 'LanguageWiseList' })
    const [showAddUpdateModal, setShowAddUpdateModal] = useState(false)

    const [isAddUpdateDone, setIsAddUpdateDone] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);

    const [deityList, setDeityList] = useState([])
    const [toDate, setToDate] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [modalTitle, setModalTitle] = useState(false)

    useEffect(() => {
        GetDeityListData(1, null)
    }, [])
    useEffect(() => {
        if (isAddUpdateDone) {
            GetDeityListData(1, null)
            setIsAddUpdateDone(false)
        }
    }, [isAddUpdateDone])

    // ------------API Callings--------------------
    const GetDeityListData = async (pageNumber, searchKeywordValue) => {
        setLoader(true);
        try {
            const response = await GetDeityList({
                pageSize: pageSize,
                pageNo: pageNumber - 1,
                sortingDirection: sortingType ? sortingType : null,
                sortingColumnName: sortValueName ? sortValueName : null,
                searchKeyword: searchKeywordValue === undefined || searchKeywordValue === null ? searchKeyword : searchKeywordValue,
                fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,

            }, location?.state?.data?.deityKeyID);

            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        const totalCount = response.data.totalCount;

                        setTotalCount(totalCount);
                        setTotalPages(Math.ceil(totalCount / pageSize));
                        setDeityList(List);
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
        setShowStatusChangeModal(false)

        setLoader(true);
        try {
            const response = await ChangeDeityStatus(value?.deityKeyID, value?.appLangID);

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

    const handleStatusChange = (item) => {
        setModelRequestData((prev) => ({ ...prev, changeStatusData: item })); // You can set only relevant data if needed
        setShowStatusChangeModal(true);
    };

    const AddBtnClicked = () => {
        setModelRequestData((prev) => ({ ...prev, Action: null, appLangID: null, deityKeyID: location?.state?.data?.deityKeyID, deityByLangKeyID: null }))
        setShowAddUpdateModal(true)
    }

    const updateBtnClicked = (value) => {
        setModelRequestData((prev) => ({
            ...prev, Action: 'update',
            deityKeyID: location?.state?.data?.deityKeyID,
            deityByLangKeyID: value?.deityByLangKeyID,
            appLangID: value?.appLangID
        }))
        setShowAddUpdateModal(true)
    }

    const fetchSearchResults = (searchValue) => {
        GetDeityListData(currentPage, searchValue);
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
        setDeityList([])
        GetDeityListData(pageNumber, null)
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
                        <h5 className="m-0 text-center flex-grow-1">  {truncateText(location?.state?.data?.deityName, 30)} List</h5>

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
                            <Tooltip title="Add Deity Language">
                                <button
                                    onClick={() => AddBtnClicked()}
                                    className="btn btn-primary btn-sm"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i>
                                    <span className="d-none d-sm-inline">Add Deity Language</span>
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
                                            Deity Name
                                        </th>
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
                                    {deityList?.map((item, idx) => (
                                        <tr className='text-nowrap' key={item.idx}>

                                            <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                                {(currentPage - 1) * pageSize + idx + 1}
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {item.deityName?.length > 35 ? (
                                                    <Tooltip title={item.deityName} arrow>
                                                        <span className="cursor-pointer">{item.deityName.substring(0, 35)}...</span>
                                                    </Tooltip>
                                                ) : (
                                                    item.deityName
                                                )}

                                            </td>
                                            <td style={{ whiteSpace: 'nowrap', textAlign: "center" }}>
                                                {item.languageName?.length > 35 ? (
                                                    <Tooltip title={item.languageName} arrow>
                                                        <span className="cursor-pointer">{item.languageName.substring(0, 35)}...</span>
                                                    </Tooltip>
                                                ) : (
                                                    item.languageName || '-'
                                                )}

                                            </td>



                                            <td className="text-center text-nowrap"
                                                onClick={() => handleStatusChange(item)}
                                            >
                                                <Tooltip title={item.status === true ? 'Enable' : 'Disable'}>
                                                    {item.status === true ? 'Enable' : 'Disable'}
                                                    <Android12Switch
                                                        style={{ padding: '8px' }} checked={item.status === true} />
                                                </Tooltip>
                                            </td>

                                            <td className="text-center actionColSticky " style={{ zIndex: 4 }}>
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
            {showAddUpdateModal &&
                <AddUpdateDeityModal show={showAddUpdateModal} onHide={() => setShowAddUpdateModal(false)} modelRequestData={modelRequestData} setIsAddUpdateDone={setIsAddUpdateDone} />
            }
            <SuccessPopupModal show={showSuccessModal} onHide={(() => onSuccessClose())} successMassage={ChangeStatusMassage} />
            <StatusChangeModal
                open={showStatusChangeModal}
                onClose={() => setShowStatusChangeModal(false)}
                onConfirm={() => ChangeStatusData(modelRequestData?.changeStatusData)} // Pass the required arguments
            />
        </>
    )
}

export default LanguageWiseDeityList
