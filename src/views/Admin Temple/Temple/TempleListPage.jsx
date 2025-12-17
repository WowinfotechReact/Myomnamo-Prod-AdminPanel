import { Tooltip } from '@mui/material'
import Android12Switch from 'component/Android12Switch'
import { ChangeStatusMassage } from 'component/GlobalMassage'
import NoResultFoundModel from 'component/NoResultFoundModal'
import PaginationComponent from 'component/Pagination'
import SuccessPopupModal from 'component/SuccessPopupModal'
import { ConfigContext } from 'context/ConfigContext'
import dayjs from 'dayjs'
import { debounce } from 'Middleware/Utils'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { ChangeTempleStatus, GetTempleList } from 'services/Admin/TempleApi/TemplesApi'
import AddUpdateTempleModal from './AddUpdateTempleModal'
import { useLocation, useNavigate } from 'react-router'
import StatusChangeModal from 'component/StatusChangeModal'
const TempleListPage = () => {
    const { setLoader } = useContext(ConfigContext);
    const navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState(null);
    const [totalCount, setTotalCount] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(-1);
    const [pageSize, setPageSize] = useState(20);
    const [sortingType, setSortingType] = useState(null)
    const [sortValueName, setSortValueName] = useState(null)

    const [modelRequestData, setModelRequestData] = useState({ Action: null, vendorID: null, moduleName: 'TempleList' })
    const [showAddTempleModal, setShowAddTempleModal] = useState(false)
    const [showVendorDetailsModal, setShowVendorDetailsModal] = useState(false)
    const [isAddUpdateDone, setIsAddUpdateDone] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);

    const [templeList, setTempleList] = useState([])
    const [toDate, setToDate] = useState(null);
    const [fromDate, setFromDate] = useState(null);

    useEffect(() => {
        GetTempleListData(1, null)
    }, [])

    useEffect(() => {

        if (isAddUpdateDone) {
            setSearchKeyword("")
            GetTempleListData(currentPage, null)
            setIsAddUpdateDone(false)
        }
    }, [isAddUpdateDone])

    // ------------API Callings--------------------
    const GetTempleListData = async (pageNumber, searchKeywordValue) => {
        setLoader(true);
        try {
            const response = await GetTempleList({
                pageSize: pageSize,
                pageNo: pageNumber - 1,
                sortingDirection: sortingType ? sortingType : null,
                sortingColumnName: sortValueName ? sortValueName : null,
                searchKeyword: searchKeywordValue === undefined || searchKeywordValue === null ? null : searchKeywordValue,
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
                        setTempleList(List);
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
            const response = await ChangeTempleStatus(value?.templeKeyID);

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
        setSearchKeyword("")
        setModelRequestData((prev) => ({ ...prev, Action: null, templeKeyID: null }))
        setShowAddTempleModal(true)
    }

    const updateBtnClicked = (value) => {
        setSearchKeyword("")
        setModelRequestData((prev) => ({
            ...prev, Action: 'update',
            templeKeyID: value?.templeKeyID
        }))
        setShowAddTempleModal(true)
    }

    const fetchSearchResults = (searchValue) => {
        GetTempleListData(currentPage, searchValue);
    };
    const debouncedSearch = useCallback(debounce(fetchSearchResults, 500), []);

    const handleSearchChange = (e) => {
        setCurrentPage(1);
        // remove only leading spaces
        const trimmed = e.target.value.replace(/^\s+/, '');
        setSearchKeyword(trimmed);
        debouncedSearch(trimmed);
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
    const AddLangBtnClicked = (value) => {

        navigate('/language-wise-temple', {
            state: {
                templeData: value
            },
        })
    }
    const AddImgBtnClicked = (value) => {

        navigate('/temple-images', {
            state: {
                templeData: value
            },
        })
    }

    const handleStatusChange = (item) => {
        setModelRequestData((prev) => ({ ...prev, changeStatusData: item })); // You can set only relevant data if needed
        setShowStatusChangeModal(true);
    };
    return (
        <>
            <div className="card">
                <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h5 className="m-0">Temples List</h5>
                        <button onClick={() => AddBtnClicked()} className="btn btn-primary btn-sm d-inline d-sm-none">
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
                            value={searchKeyword}
                            style={{ maxWidth: '350px' }}
                            onChange={handleSearchChange}
                        />

                        {/* Action Buttons */}
                        <div className="d-flex gap-2 align-items-center">
                            <Tooltip title="Add Temple">
                                <button
                                    onClick={() => AddBtnClicked()}
                                    className="btn btn-primary btn-sm"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i>
                                    <span className="d-none d-sm-inline">Add Temple</span>
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
                                            Temple Name
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Seating Capacity
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Best Season
                                        </th>

                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Is White Page Label
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Address
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
                                    {templeList?.map((item, idx) => (
                                        <tr className='text-nowrap text-center align-middle ' key={item.idx}>

                                            <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                                {(currentPage - 1) * pageSize + idx + 1}
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {item.templeName}

                                            </td>

                                            <td >{item.seatingCapacity}</td>

                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.bestSeason}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.isWhitePageLable === true ? 'Yes' : 'No'}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {item.templeAddress?.length > 35 ? (
                                                    <Tooltip title={item.templeAddress} arrow>
                                                        <span className="cursor-pointer">{item.templeAddress.substring(0, 35)}...</span>
                                                    </Tooltip>
                                                ) : (
                                                    item.templeAddress
                                                )}
                                            </td>

                                            <td className="text-center text-nowrap"

                                            >
                                                <Tooltip title={item.status === true ? 'Enable' : 'Disable'}>
                                                    {item.status === true ? 'Enable' : 'Disable'}
                                                    <Android12Switch onClick={() => handleStatusChange(item)}
                                                        style={{ padding: '8px' }} checked={item.status === true} />
                                                </Tooltip>
                                            </td>

                                            <td className="text-center actionColSticky" style={{ zIndex: 4 }}>
                                                <div className="d-flex gap-2">
                                                    <Tooltip title="Update Temple">
                                                        <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => updateBtnClicked(item)}>
                                                            <i class="fas fa-edit"></i>
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="Add Language">
                                                        <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => AddLangBtnClicked(item)}>
                                                            <i class="fas fa-language"></i>

                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="Add Images">
                                                        <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => AddImgBtnClicked(item)}>
                                                            <i class="fas fa-image"></i>


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
            <AddUpdateTempleModal show={showAddTempleModal} onHide={() => setShowAddTempleModal(false)} modelRequestData={modelRequestData} setIsAddUpdateDone={setIsAddUpdateDone} />
            <SuccessPopupModal show={showSuccessModal} onHide={(() => onSuccessClose())} successMassage={ChangeStatusMassage} />
            <StatusChangeModal
                open={showStatusChangeModal}
                onClose={() => setShowStatusChangeModal(false)}
                onConfirm={() => ChangeStatusData(modelRequestData?.changeStatusData)} // Pass the required arguments
            />
        </>
    )
}

export default TempleListPage
