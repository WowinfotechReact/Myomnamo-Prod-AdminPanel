import { Tooltip } from '@mui/material'
import NoResultFoundModel from 'component/NoResultFoundModal'
import PaginationComponent from 'component/Pagination'
import { React, useCallback, useContext, useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Android12Switch from 'component/Android12Switch'
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs'
import { ConfigContext } from 'context/ConfigContext'
import { debounce } from 'Middleware/Utils'
import SuccessPopupModal from 'component/SuccessPopupModal'
import { ChangeStatusMassage } from 'component/GlobalMassage'
import ImagePreviewModal from 'Image Preview Modal/ImagePreviewModal'
import StatusChangeModal from 'component/StatusChangeModal'
import { ChangeDistrictStatus } from 'services/District/DistrictApi'
import {GetPanditMasterList, ChangePanditStatus, GetTempPanditList} from 'services/Admin/Pandit Master/PanditMasterApi'
import PanditMasterAddUpdateModal from './PanditMasterAddUpdateModal'
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { PanditTypeLookupList } from 'Middleware/Enum'

const PanditMasterList = () => {
    const [modelAction, setModelAction] = useState();
    const { setLoader } = useContext(ConfigContext);
    const [showModal, setShowModal] = useState(false);
    const [stateChangeStatus, setStateChangeStatus] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState(null);
    const [totalCount, setTotalCount] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [visible, setVisible] = useState(false);
    const [pageSize, setPageSize] = useState(20);
    const [sortingType, setSortingType] = useState(null)
    const [sortValueName, setSortValueName] = useState(null)
    const [modalTitle, setModalTitle] = useState(false)
    const [ShopList, setShopList] = useState([]);
    const [modelRequestData, setModelRequestData] = useState({ Action: null, actionMessage:null})
    const [showAddUpdateModal, setShowAddUpdateModal] = useState(false)
    const [isAddUpdateDone, setIsAddUpdateDone] = useState(false)
    const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false)



    useEffect(() => {
        setCurrentPage(1)
            setIsAddUpdateDone(false)
            GetTempPanditListData(1,searchKeyword)
            // GetPanditMasterListData(searchKeyword)
        

    }, [isAddUpdateDone,searchKeyword])

    const GetTempPanditListData = async (pageNumber,searchKeywordValue) => {
        
        setLoader(true);
        try {
            const response = await GetTempPanditList({
                pageSize: pageSize,
                pageNo: pageNumber-1,
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
                        setShopList(List);
                        setTotalRecords(List?.length);
                    }
                } else {
                    
                    setLoader(false);
                    setTotalRecords(0);
                }
            }
        } catch (error) {
            setTotalRecords(0);
            setLoader(false);
            
        }
    }

    const GetPanditMasterListData = async (searchKeywordValue) => {
        
        setLoader(true);
        try {
            const response = await GetPanditMasterList({
                pageSize: pageSize,
                pageNo: 0,
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
                        setShopList(List);
                        setTotalRecords(List?.length);
                    }
                } else {
                    
                    setLoader(false);
                    setTotalRecords(0);
                }
            }
        } catch (error) {
            setTotalRecords(0);
            setLoader(false);
            
        }
    }

  

    // const AddShopBtnClick   ed = () => {
    //     setModelRequestData((prev) => ({ ...prev, Action: null, }))
    //     setShowAddUpdateModal(true)
    // }

    const handleUpdate = (value) => {

        setModelRequestData((prev) => ({
            ...prev,
            Action: 'Update',
            panditKeyID: value.panditKeyID
        }))
        setShowAddUpdateModal(true)
    }

    const handleStatusChange = (item) => {
        setStateChangeStatus(item); // You can set only relevant data if needed
        setShowStatusChangeModal(true);
    };

    const confirmStatusChange = async (item, user) => {
        try {
            const { panditKeyID } = item; // Destructure to access only what's needed
            const response = await ChangePanditStatus(panditKeyID);

            if (response && response.data.statusCode === 200) {
                setShowStatusChangeModal(false);
                setStateChangeStatus(null);
                setIsAddUpdateDone(true);
                setModelRequestData({
                    actionMessage:'Pandit status changed successfully.'
                })
                setShowSuccessModal(true);
                
            } else {
                console.error(response?.data?.errorMessage);
                setShowSuccessModal(true);
                setModelAction('Failed to change Pandit status.');
            }
        } catch (error) {
            console.error('Error changing Pandit status:', error);
            setShowSuccessModal(true);
            setModelAction('An error occurred while changing the Pandit status.');
        }
    };

    const fetchSearchResults = (searchValue) => {
        GetDistrictListData(1, searchValue);
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
        GetTempPanditListData(pageNumber,searchKeyword)
      
    };

    const AddLangBtnClicked = (item) => {
        setShowAddUpdateModal(false); // ensure modal is closed
        navigate('/language-wise-district', {
            state: { districtData: item }
        });
    };

    return (
        <>
            <div className="card">
                <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h5 className="m-0">Pandit Management</h5>

                    </div>

                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                        {/* Search Box */}
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search..."
                            style={{ maxWidth: '200px' }}
                            onChange={handleSearchChange}
                        />

                        {/* Action Buttons */}
                        {/* <div className="d-flex gap-2 align-items-center">
                            <Tooltip title="Add Pandit">
                                <button
                                    onClick={() => {
                                        setModelRequestData({
                                            Action:'Add'
                                        })
                                        setShowAddUpdateModal(true)}}
                                    className="btn btn-primary btn-sm"
                                    style={{ cursor: 'pointer' }}
                                >
                                    {/* <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i> */}
                                    {/* <span className="d-none d-sm-inline">Add Pandit</span>
                                </button>
                            </Tooltip>
                        </div>  */}

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
                                            Pandit Name
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Address
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Email
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Mobile No
                                        </th>
                                        {/* <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Pandit Type
                                        </th> */}
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Experience
                                        </th>
                                        {/* <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Languages
                                        </th> */}
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Password
                                        </th>
                                        {/* <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Status
                                        </th> */}
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Registration  Date
                                        </th>

                                        {/* <th className="text-center actionSticky" style={{ whiteSpace: 'nowrap' }}>
                                            Action
                                        </th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {ShopList?.map((item, idx) => (
                                        <tr className='text-nowrap text-center' key={item.idx}>

                                            <td style={{ whiteSpace: 'nowrap' }} className="text-center py-2">
                                                {(currentPage - 1) * pageSize + idx + 1}
                                            </td>

                                            <td className="text-center py-2">
                                                {item.employeeName?.length > 30 ? (
                                                    <Tooltip title={item.panditName}>{`${item.panditName?.substring(0, 30)}...`}</Tooltip>
                                                ) : (
                                                    <>{item.panditName || '-'}</>
                                                )}
                                            </td>

                                            <td className="text-center py-2">
                                                {item.address?.length > 30 ? (
                                                    <Tooltip title={item.address}>{`${item.address?.substring(0, 30)}...`}</Tooltip>
                                                ) : (
                                                    <>{item.address || "-"}</>
                                                )}
                                            </td>

                                            <td className="text-center py-2">
                                                {item.email?.length > 30 ? (
                                                    <Tooltip title={item.email}>{`${item.email?.substring(0, 30)}...`}</Tooltip>
                                                ) : (
                                                    <>{item.email}</>
                                                )}
                                            </td>

                                            <td className="text-center py-2">
                                                {item.mobileNo?.length > 30 ? (
                                                    <Tooltip title={item.mobileNo}>{`${item.mobileNo?.substring(0, 30)}...`}</Tooltip>
                                                ) : (
                                                    <>{item.mobileNo}</>
                                                )}
                                            </td>
                                            {/* <td className="text-center py-2">
                                                {item?.dailyPandit? (
                                                    <Tooltip title={PanditTypeLookupList?.filter((v) => v?.value === item?.panditTypeID)}>{`${PanditTypeLookupList?.filter((v) => v?.value === item?.panditTypeID)}`}</Tooltip>
                                                ) : (
                                                    <>{PanditTypeLookupList?.filter((v) => v?.value === item?.panditTypeID) || '-'}</>
                                                )}
                                            </td> */}
                                            <td className="text-center py-2">
                                                {item.experience?.length > 30 ? (
                                                    <Tooltip title={item.experience}>{`${item.experience?.substring(0, 30)}...`}</Tooltip>
                                                ) : (
                                                    <>{item.experience || '-'}</>
                                                )}
                                            </td>
                                            {/* <td className="text-center py-2">
                                                {item.languages?.length > 30 ? (
                                                    <Tooltip title={item.languages}>{`${item.languages?.substring(0, 30)}...`}</Tooltip>
                                                ) : (
                                                    <>{item.languages || '-'}</>
                                                )}
                                            </td> */}
                                            <td className="text-center py-2">
                                                {(() => {
                                                    const pwd = item.password;
                                                    

                                                    if (!pwd) return "-";

                                                    const isLong = pwd.length > 30;
                                                    const masked = "•".repeat(Math.min(pwd.length, 12));
                                                    const displayText = visible ? pwd : masked;

                                                    return (
                                                        <div className="flex items-center justify-center gap-2">
                                                            {isLong ? (
                                                                <Tooltip title={pwd}>
                                                                    <span>{displayText}</span>
                                                                </Tooltip>
                                                            ) : (
                                                                <span>{displayText}</span>
                                                            )}

                                                            <span
                                                                className="cursor-pointer text-gray-600 hover:text-black"
                                                                onClick={() => setVisible(!visible)}
                                                            >
                                                                {visible ? <VisibilityOff /> : <Visibility />}
                                                            </span>
                                                        </div>
                                                    );
                                                })()}
                                            </td>
                                            {/* <td className="text-center py-2">

                                                {

                                                    item.password?.length > 30 ? (
                                                        <Tooltip title={item.password}>{`${item.password?.substring(0, 30)}...`}</Tooltip>
                                                    ) : (
                                                        <>{item.password || '-'}</>
                                                    )}
                                                
                                            </td> */}
                                            {/* <td className="text-center text-nowrap" onClick={() => handleStatusChange(item)}>
                                                <Tooltip title={item.status === true ? 'Enable' : 'Disable'}>
                                                    {item.status === true ? 'Enable' : 'Disable'}
                                                    <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(item)} checked={item.status === true} />
                                                </Tooltip>
                                            </td> */}
                                            <td className="text-center py-2">
                                                {item.createdOnDate?.length > 30 ? (
                                                    <Tooltip title={item.createdOnDate}>{`${item.createdOnDate?.substring(0, 30)}...`}</Tooltip>
                                                ) : (
                                                    <>{item.createdOnDate}</>
                                                )}
                                            </td>

                                            {/* <td className="text-center" style={{ zIndex: 4 }}>
                                                <div className="d-flex justify-content-center gap-2">
                                                    <Tooltip title="Update Pandit">
                                                        <Button className="btn-sm" onClick={() => handleUpdate(item)}>
                                                            <i class="fas fa-edit"></i>
                                                        </Button>
                                                    </Tooltip>
                                                </div>
                                            </td> */}
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
                <PanditMasterAddUpdateModal show={showAddUpdateModal} onHide={(() => 
                    setShowAddUpdateModal(false))} 
                    modelRequestData={modelRequestData} 
                    setModelRequestData={setModelRequestData}
                    setIsAddUpdateDone={setIsAddUpdateDone}
                    setShowSuccessModal={setShowSuccessModal}
                    />
            }
            <ImagePreviewModal
                show={showModal}
                onHide={() => setShowModal(false)}
                imgSrc={selectedImage}
                title={modalTitle} // pass deity name as title
            />

            

            <StatusChangeModal
                open={showStatusChangeModal}
                onClose={() => setShowStatusChangeModal(false)}
                onConfirm={() => confirmStatusChange(stateChangeStatus)} // Pass the required arguments
            />
            <SuccessPopupModal show={showSuccessModal} onHide={(() => setShowSuccessModal(false))} successMassage={modelRequestData.actionMessage} />
        </>
    )
}

export default PanditMasterList;

