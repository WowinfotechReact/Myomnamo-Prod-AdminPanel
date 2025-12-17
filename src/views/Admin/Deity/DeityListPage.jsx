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
import ImagePreviewModal from 'Image Preview Modal/ImagePreviewModal';
import StatusChangeModal from 'component/StatusChangeModal';
import { useNavigate } from 'react-router';

const DeityListPage = () => {
    const { setLoader } = useContext(ConfigContext);
    const navigate = useNavigate()

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

    const [modelRequestData, setModelRequestData] = useState({ Action: null, vendorID: null })
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
            GetDeityListData(currentPage, null)
            setIsAddUpdateDone(false)

        }
    }, [isAddUpdateDone])

    const handleImageClick = (imgUrl, deityName) => {

        setModalTitle(deityName); // set the modal title dynamically
        setSelectedImage(imgUrl);
        setShowModal(true);
    };


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

            }, location?.state?.deityKeyID);

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
            const response = await ChangeDeityStatus(value?.deityKeyID);

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

    const handleStatusChange = (item) => {
        setModelRequestData((prev) => ({ ...prev, changeStatusData: item })); // You can set only relevant data if needed
        setShowStatusChangeModal(true);
    };

    const AddBtnClicked = () => {
        setModelRequestData((prev) => ({ ...prev, Action: null, deityKeyID: null, }))
        setShowAddUpdateModal(true)
    }

    const updateBtnClicked = (value) => {
        setModelRequestData((prev) => ({
            ...prev, Action: 'update',
            deityKeyID: value?.deityKeyID,

        }))
        setShowAddUpdateModal(true)
    }

    const fetchSearchResults = (searchValue) => {
        GetDeityListData(currentPage, searchValue);
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
        setDeityList([])
        GetDeityListData(pageNumber, null)
    }

    const onSuccessClose = () => {
        setShowSuccessModal(false)
        setIsAddUpdateDone(true)
    }
    const AddLangBtnClicked = (value) => {
        navigate('/language-wise-deity', {
            state: {
                data: value
            },
        })
    }
    return (
        <>
            <div className="card">
                <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h5 className="m-0">Deity List</h5>
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
                            style={{ maxWidth: '350px' }}
                            value={searchKeyword}          // 🔑 controlled value
                            onChange={handleSearchChange}
                        />

                        {/* Action Buttons */}
                        <div className="d-flex gap-2 align-items-center">
                            <Tooltip title="Add Deity">
                                <button
                                    onClick={() => AddBtnClicked()}
                                    className="btn btn-primary btn-sm"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i>
                                    <span className="d-none d-sm-inline">Add Deity</span>
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
                                            Deity Image
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
                                                {item.deityName}

                                            </td>
                                            <td className='text-center' style={{ whiteSpace: "nowrap", cursor: "pointer" }}>
                                                {item.deityImageUrl ? (
                                                    <img
                                                        src={item.deityImageUrl}
                                                        alt={item.deityName}
                                                        style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" }}
                                                        onClick={() => handleImageClick(item.deityImageUrl, item.deityName)}
                                                    />
                                                ) : (
                                                    "No Image"
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
                                                    <Tooltip title="Update Deity">
                                                        <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => updateBtnClicked(item)}>
                                                            <i class="fas fa-edit"></i>
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="Add Language">
                                                        <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => AddLangBtnClicked(item)}>
                                                            <i class="fas fa-language"></i>

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

            <AddUpdateDeityModal show={showAddUpdateModal} onHide={() => setShowAddUpdateModal(false)} modelRequestData={modelRequestData} setIsAddUpdateDone={setIsAddUpdateDone} />

            <SuccessPopupModal show={showSuccessModal} onHide={(() => onSuccessClose())} successMassage={ChangeStatusMassage} />
            <ImagePreviewModal
                show={showModal}
                onHide={() => setShowModal(false)}
                imgSrc={selectedImage}
                title={modalTitle} // pass deity name as title
            />
            <StatusChangeModal
                open={showStatusChangeModal}
                onClose={() => setShowStatusChangeModal(false)}
                onConfirm={() => ChangeStatusData(modelRequestData?.changeStatusData)} // Pass the required arguments
            />
        </>
    )
}

export default DeityListPage
