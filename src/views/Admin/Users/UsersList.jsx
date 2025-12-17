import { Tooltip } from '@mui/material';
import Android12Switch from 'component/Android12Switch';
import { ChangeStatusMassage } from 'component/GlobalMassage';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import dayjs from 'dayjs';
import { pujaServiceID, pujaSubServiceID } from 'Middleware/Enum';
import { debounce } from 'Middleware/Utils';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router';
import { ChangeStatus, GetProductCatList } from 'services/Admin/EStoreAPI/ProductCatAPI';
import { GetUserList, UserReferencedList, ViewTransactionHistoryByUser, ViewUserDetails } from 'services/Admin/UsersApi/UsersApi';
import WalletTransactionModal from './WalletTrasactionHistoryModal';
import UserDetailsModal from "./UserDetailsModal";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';

const UsersList = () => {
    const { setLoader, user, login, UserKeyID } = useContext(ConfigContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState(null);
    const [totalCount, setTotalCount] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(-1);
    const [pageSize, setPageSize] = useState(30);
    const [sortingType, setSortingType] = useState(null);
    const [sortValueName, setSortValueName] = useState(null);
    const [pageHeading, setPageHeading] = useState('Users');
    const [selectedPuja, setSelectedPuja] = useState([]);
    const [modelRequestData, setModelRequestData] = useState({
        Action: null,
        userWalletID: null,
        walletAmount: null
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [showVendorDetailsModal, setShowVendorDetailsModal] = useState(false);
    const [isAddUpdateDone, setIsAddUpdateDone] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showAssignPanditSuccessModal, setShowAssignPanditSuccessModal] = useState(false);
    const [showAssignPanditModal, setShowAssignPanditModal] = useState(false);
    const [showBookingOrderDetailsModal, setShowBookingOrderDetailsModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [moduleName, setModuleName] = useState(null)
    const [userWalletList, setUserWalletList] = useState([]);
    const [toDate, setToDate] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [selectedBookings, setSelectedBookings] = useState([]);
    const [dialogData, setDialogData] = useState([])
    const [userData, setUserData] = useState([]);
    const [showUserModal, setShowUserModal] = useState(false)
    const [error, setError] = useState(false)
    useEffect(() => {
        // GetUserListData()
        GetUserListData(1, searchKeyword, fromDate, toDate);

    }, [])


    //fetch data on date range 
    // =================== Date Validation Effect ===================
    useEffect(() => {

        if (fromDate && toDate) {
            if (toDate < fromDate) {
                setError(true);
            } else {
                setError(false);
                setCurrentPage(1)
                // ✅ Call API directly when both dates are valid
                GetUserListData(1, searchKeyword, fromDate, toDate);
            }
        }

    }, [fromDate, toDate]);


    // ------------API Callings--------------------
    // const GetUserListData = async (pageNo, searchValue) => {
    //     setLoader(true);
    //     try {
    //         const response = await GetUserList({
    //             adminID: user?.adminID,
    //             pageSize: pageSize,
    //             pageNo: pageNo - 1,
    //             sortingDirection: null,
    //             sortingColumnName: null,
    //             searchKeyword: searchValue ? searchValue : null,
    //             fromDate: null,
    //             toDate: null
    //         });

    //         if (response) {
    //             if (response?.data?.statusCode === 200) {
    //                 setLoader(false);
    //                 if (response?.data?.responseData?.data) {
    //                     const List = response.data.responseData.data;
    //                     const totalCount = response.data.totalCount;

    //                     setTotalCount(totalCount);
    //                     setTotalPages(Math.ceil(totalCount / pageSize));
    //                     setUserWalletList(List);
    //                     setTotalRecords(List?.length);
    //                 }
    //             } else {
    //                 console.error(response?.data?.errorMessage);
    //                 setLoader(false);
    //             }
    //         }
    //     } catch (error) {
    //         setLoader(false);
    //         console.log(error);
    //     }
    // };


    const GetUserListData = async (pageNo = 1, searchValue = "", fromDateParam = null, toDateParam = null) => {

        setLoader(true);
        try {
            const response = await GetUserList({
                adminID: user?.adminID,
                pageSize,
                pageNo: pageNo - 1,
                sortingDirection: null,
                sortingColumnName: null,
                searchKeyword: searchValue || null,
                fromDate: fromDateParam === null ? null : dayjs(fromDateParam).format('YYYY-MM-DD'),
                toDate: toDateParam === null ? null : dayjs(toDateParam).format('YYYY-MM-DD'),
            });

            if (response?.data?.statusCode === 200) {
                const List = response.data.responseData.data;
                const totalCount = response.data.totalCount;
                setUserWalletList(List);
                setTotalCount(totalCount);
                setTotalPages(Math.ceil(totalCount / pageSize));
                setTotalRecords(List?.length);
            } else {
                console.error(response?.data?.errorMessage);
            }
        } catch (error) {
            console.log(error);
        }
        setLoader(false);
    };



    // ----------Other Functions------------------

    const fetchSearchResults = (searchValue) => {
        GetUserListData(currentPage, searchValue);
    };
    const debouncedSearch = useCallback(debounce(fetchSearchResults, 500), []);

    const handleSearchChange = (e) => {
        setCurrentPage(1);
        const value = e.target.value;
        setSearchKeyword(value);
        debouncedSearch(value);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setUserWalletList([]);
        GetUserListData(pageNumber, null);
    };

    const ViewTrasactionHistory = async (userKeyID) => {

        setLoader(true);
        try {
            const response = await ViewTransactionHistoryByUser(userKeyID.userKeyID);

            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        setDialogData(List);
                    }
                } else {
                    console.error(response?.data?.errorMessage);
                    setLoader(false);
                }
            }
            setModuleName("Transaction History")
            setShowTransactionModal(true);
        } catch (error) {
            console.log("error ==>>", error)
        }
        setLoader(false);
    }

    const ViewReferenceHistory = async (userKeyID) => {
        setLoader(true);
        try {
            const response = await UserReferencedList(userKeyID.userKeyID);

            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        setDialogData(List);
                    }
                } else {
                    console.error(response?.data?.errorMessage);
                    setLoader(false);
                }
            }
            setModuleName("Referenced History")
            setShowTransactionModal(true);
        } catch (error) {
            console.log("error ==>>", error)
        }
        setLoader(false);
    }

    const ViewUserDetailsFunction = async (userKeyID) => {
        setLoader(true);
        try {
            const response = await ViewUserDetails(userKeyID.userKeyID);

            if (response) {
                if (response?.data?.statusCode === 200) {
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        setUserData(List);
                    }
                } else {
                    console.error(response?.data?.errorMessage);
                }
            }

            setShowUserModal(true)
        } catch (error) {
            console.log("error ==>>", error)
        }
        setLoader(false);
    }

    const handleClearDates = () => {
        setFromDate(null);
        setToDate(null);
        GetUserListData(1, searchKeyword, null, null);
    };

    const handleToDateChange = (newValue) => {
        if (newValue && dayjs(newValue).isValid()) {
            const newToDate = dayjs(newValue);
            setToDate(newToDate);

            if (fromDate && newToDate.isBefore(fromDate)) {
                setFromDate(newToDate.subtract(1, 'day'));
            }

        } else {
            setToDate(null);

        }
    };

    const handleFromDateChange = (newValue) => {
        if (newValue && dayjs(newValue).isValid()) {
            const newFromDate = dayjs(newValue);
            setFromDate(newFromDate);

            if (toDate && newFromDate.isAfter(toDate)) {
                setToDate(newFromDate.add(1, 'day'));
            } // Fixed: Pass fromDate first, then toDate to DashboardCountData

        } else {
            setFromDate(null);

        }
    };
    return (
        <>
            <div className="card">
                <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h5 className="m-0">{pageHeading}</h5>
                    </div>


                    {/* Filters Row */}
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-3">
                        {/* Search Box - Left Side */}
                        <div className="flex-grow-1" style={{ maxWidth: "350px" }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search..."
                                onChange={handleSearchChange}
                            />
                        </div>

                        {/* Right Section — Date Pickers */}
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center flex-nowrap gap-4">
                                {/* From Date */}
                                <div className="d-flex align-items-center flex-nowrap">
                                    {/* <label className="form-label mb-0 me-2 text-nowrap">
                                        From Date <span className="text-danger">*</span>
                                    </label> */}
                                    <div className="border-0 bg-transparent">
                                        <DatePicker
                                            format="dd/MM/yyyy"
                                            clearIcon={null}
                                            popperPlacement="bottom-start"
                                            className="border-0 bg-transparent"
                                            calendarClassName="shadow-sm"
                                            value={fromDate}
                                            onChange={handleFromDateChange}
                                        />
                                    </div>
                                </div>

                                {/* To Date */}
                                <div className="d-flex align-items-center flex-nowrap">
                                    {/* <label className="form-label mb-0 me-2 text-nowrap">
                                        To Date <span className="text-danger">*</span>
                                    </label> */}
                                    <div className="border-0 bg-transparent">
                                        <DatePicker
                                            format="dd/MM/yyyy"
                                            clearIcon={null}
                                            popperPlacement="bottom-start"
                                            className="border-0 bg-transparent"
                                            calendarClassName="shadow-sm"
                                            value={toDate}
                                            onChange={handleToDateChange}
                                        />
                                    </div>
                                </div>

                                {(toDate || fromDate) && (
                                    <button className="btn btn-primary customBtn" onClick={handleClearDates}>
                                        Clear
                                    </button>
                                )}
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="text-danger mt-1 small text-end">
                                    Please enter valid date range
                                </div>
                            )}
                        </div>


                    </div>




                    <div>
                        <div className="table-responsive" style={{ maxHeight: '65vh' }}>
                            <Table striped bordered hover>
                                <thead className="table-light">
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
                                            User Name
                                        </th>

                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Mobile Number
                                        </th>

                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Email
                                        </th>

                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Registration Date
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Login Type
                                        </th>
                                        <th className="text-center actionColSticky" style={{ whiteSpace: 'nowrap' }}>
                                            Action
                                        </th>


                                    </tr>
                                </thead>

                                <tbody>
                                    {userWalletList?.map((item, idx) => (
                                        <tr className="text-nowrap text-center" key={item.userKeyID}>
                                            <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                                {(currentPage - 1) * pageSize + idx + 1}
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {item?.fullName ? (
                                                    item.fullName.length > 25 ? (
                                                        <Tooltip title={item.fullName}>{item.fullName.substring(0, 25) + '...'}</Tooltip>
                                                    ) : (
                                                        item.fullName
                                                    )
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {item?.mobileNo ? (
                                                    item.mobileNo
                                                ) : (
                                                    "-"
                                                )
                                                }
                                            </td>
                                            <td>
                                                {item?.email ? (item.email) : ("-")}
                                            </td>

                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {item.createdOnDate}
                                            </td>
                                            <td>
                                                {item.applicationType}
                                            </td>
                                            <td className="text-center actionColSticky" style={{ zIndex: 4 }}>
                                                <div className="d-flex justify-content-center gap-2">
                                                    <Tooltip title={`View Transaction History`}>
                                                        <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => ViewTrasactionHistory(item)}>
                                                            <i class="fas fa-receipt"></i>
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title={`View Referenced History`}>
                                                        <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => ViewReferenceHistory(item)}>
                                                            <i class="fas fa-gg"></i>
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title={`View User Details`}>
                                                        <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => ViewUserDetailsFunction(item)}>
                                                            <i class="fas fa-user"></i>
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

            <SuccessPopupModal show={showSuccessModal} onHide={() => onSuccessClose()} successMassage={ChangeStatusMassage} />
            <WalletTransactionModal show={showTransactionModal} onHide={() => setShowTransactionModal(false)} dialogData={dialogData} moduleName={moduleName} />
            <UserDetailsModal show={showUserModal} onHide={() => setShowUserModal(false)} userData={userData} />

        </>
    );
};

export default UsersList;

