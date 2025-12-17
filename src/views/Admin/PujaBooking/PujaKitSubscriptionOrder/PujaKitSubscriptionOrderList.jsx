import { Tooltip } from '@mui/material';

import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import dayjs from 'dayjs';
import { OrderStatus, OrderStatusEstore } from 'Middleware/Enum';
import { debounce } from 'Middleware/Utils';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router';

import Select from 'react-select';
import AssignPanditModal from '../AssignPanditModal';
import { ChangeEstoreOrderStatus, GetEstoreBookingList, GetProductSubPackageMontlyStatusList, GetProductSubPackageOrderListByUserID } from 'services/Admin/PujaBookingAPI/EstoreBookingAPI';
import PujaKitSubscriptionOrderDetails from './PujaKitSubscriptionOrderDetails';
import PujaKitRefillDetails from './PujaKitRefillDetails';



const PujaKitSubscriptionOrderList = () => {
    const { setLoader } = useContext(ConfigContext);

    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState(null);
    const [totalCount, setTotalCount] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(-1);
    const [pageSize, setPageSize] = useState(20);

    const [pageHeading, setPageHeading] = useState('Puja Kit Subscription List');

    const [modelRequestData, setModelRequestData] = useState({
        Action: null,
        vendorID: null,
        moduleName: '',
        pujaBookingKeyID: null,
        selectedPujas: null
    });

    const [showRefillDetailsModal, setShowRefillDetailsModal] = useState(false);
    const [isAddUpdateDone, setIsAddUpdateDone] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showAssignPanditSuccessModal, setShowAssignPanditSuccessModal] = useState(false);
    const [showAssignPanditModal, setShowAssignPanditModal] = useState(false);
    const [showBookingOrderDetailsModal, setShowBookingOrderDetailsModal] = useState(false);

    const [pujaKitOrderList, setPujaKitOrderList] = useState([]);
    const [pujaKitRefillDetails, setPujaKitRefillDetails] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [pujaOrderStatusMap, setPujaOrderStatusMap] = useState({});
    const [toDate, setToDate] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [selectedBookings, setSelectedBookings] = useState([]);
    const [pujaOrderStatusID, setPujaOrderStatusID] = useState(null);

    // ✅ Check if all rows are selected
    const selectableRows = pujaKitOrderList.filter((item) => item.panditName === null);
    // const allSelected = pujaKitOrderList?.length > 0 && selectedBookings.length === pujaKitOrderList.length;
    const allSelected = selectableRows.length > 0 && selectableRows.every((item) => selectedBookings.includes(item.pujaBookingID));

    useEffect(() => {
        GetProductSubPackageOrderListByUserIDData(1)
    }, [location]);

    useEffect(() => {
        if (isAddUpdateDone) {
            GetProductSubPackageMontlyStatusListData(pujaKitRefillDetails)
        }
    }, [isAddUpdateDone])

    // ------------API Callings--------------------
    const GetProductSubPackageOrderListByUserIDData = async (pageNumber, searchKeyword) => {
        setLoader(true);
        try {
            const response = await GetProductSubPackageOrderListByUserID(
                {
                    pageSize: pageSize,
                    pageNo: pageNumber - 1,

                }
            );


            if (response?.data?.statusCode === 200) {
                setLoader(false);
                if (response?.data?.responseData?.data) {
                    const List = response.data.responseData.data;
                    const totalCount = response.data.totalCount;

                    setTotalCount(totalCount);
                    setTotalPages(Math.ceil(totalCount / pageSize));
                    setPujaKitOrderList(List);
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
    };

    const GetProductSubPackageMontlyStatusListData = async (value) => {
        setLoader(true);
        try {
            const response = await GetProductSubPackageMontlyStatusList(value?.estoreBookingKeyID);


            if (response?.data?.statusCode === 200) {
                setLoader(false);
                if (response?.data?.responseData?.data) {
                    const List = response.data.responseData.data;
                    const totalCount = response.data.totalCount;
                    setPujaKitRefillDetails(List);
                    setShowRefillDetailsModal(true)
                }
            } else {
                console.error(response?.data?.errorMessage);
                setLoader(false);
            }

        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    };

    // ----------Other Functions------------------
    const fetchSearchResults = (searchValue) => {
        GetProductSubPackageOrderListByUserIDData(currentPage, searchValue);
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
        setPujaKitOrderList([]);
        GetProductSubPackageOrderListByUserIDData(pageNumber, searchKeyword);
    };

    const onSuccessClose = () => {
        setShowSuccessModal(false);
        setIsAddUpdateDone(true);
    };
    const ViewOrderDetails = (value) => {
        setModelRequestData((prev) => ({
            ...prev,
            Action: null,
            estoreBookingKeyID: value.estoreBookingKeyID
        }));
        setShowBookingOrderDetailsModal(true);
    };

    const handleStatusChange = async (BookingKeyID, newStatus) => {
        setPujaOrderStatusMap((prev) => ({
            ...prev,
            [BookingKeyID]: newStatus
        }));

        setLoader(true);
        try {
            // API call to update status
            await ChangeEstoreOrderStatus(BookingKeyID, newStatus);
            setLoader(false);
            setSuccessMessage(`Order status updated to "${newStatus}" successfully!`);
            setShowSuccessPopUp(true);
        } catch (error) {
            setLoader(false);
            console.error('Error updating status:', error);
        } finally {
            // ✅ Always refresh the data, no matter what
            await GetProductSubPackageOrderListByUserIDData(currentPage, searchKeyword);
            setLoader(false);
        }
    };

    return (
        <>
            <div className="card">
                <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h5 className="m-0">{pageHeading}</h5>

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
                                        <th className="text-center">Booking ID</th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Product Name
                                        </th>


                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Total Price (₹)
                                        </th>

                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Order Status
                                        </th>


                                        <th className="text-center actionSticky" style={{ whiteSpace: 'nowrap' }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {pujaKitOrderList?.map((item, idx) => (
                                        <tr className="text-nowrap text-center" key={item.pujaBookingID}>
                                            <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                                {(currentPage - 1) * pageSize + idx + 1}
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                                {item.bookingID}
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {item?.productName ? (
                                                    item.productName.length > 25 ? (
                                                        <Tooltip title={item.productName}>{item.productName.substring(0, 25) + '...'}</Tooltip>
                                                    ) : (
                                                        item.productName
                                                    )
                                                ) : (
                                                    '-'
                                                )}
                                            </td>

                                            <td>
                                                {new Intl.NumberFormat('en-IN', {
                                                    style: 'currency',
                                                    currency: 'INR',
                                                    minimumFractionDigits: 2
                                                }).format(item.grandTotal)}
                                            </td>

                                            <td style={{ width: '150px' }}>
                                                <Select
                                                    options={OrderStatusEstore.filter((option) => !(item.orderStatus === 'Confirmed' && option.label === 'Pending'))}
                                                    value={OrderStatusEstore?.filter(
                                                        (v) => v?.value === (pujaOrderStatusMap[item.estoreBookingKeyID] ?? item.productOrderStatusID)
                                                    )}
                                                    onChange={(selectedOption) => handleStatusChange(item.estoreBookingKeyID, selectedOption.value)}
                                                    menuPlacement="auto"
                                                    menuPosition="fixed"
                                                    isDisabled={['Delivered', 'Rejected'].includes(item.orderStatus)}
                                                    styles={{
                                                        container: (base) => ({
                                                            ...base,
                                                            width: '150px' // ensures Select fills the td
                                                        })
                                                    }}
                                                />
                                            </td>



                                            <td className="text-center actionColSticky" style={{ zIndex: 4, width: "10px" }}>
                                                <div className="d-flex justify-content-left gap-2">
                                                    <Tooltip title="Order Details">
                                                        <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => ViewOrderDetails(item)}>
                                                            <i className="fas fa-file-invoice"></i>
                                                        </Button>
                                                    </Tooltip>


                                                    {item?.productOrderStatusID === 4 && (

                                                        <Tooltip title="Refill Kit">
                                                            <Button className="btn-sm" onClick={() => GetProductSubPackageMontlyStatusListData(item)}>
                                                                Refill Kit
                                                            </Button>
                                                        </Tooltip>
                                                    )}

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

            <SuccessPopupModal show={showSuccessModal} onHide={() => onSuccessClose()} successMassage={successMessage} />

            <SuccessPopupModal
                show={showAssignPanditSuccessModal}
                onHide={() => setShowAssignPanditSuccessModal(false)}
                successMassage="Pandit assigned successfully "
            />

            <AssignPanditModal
                show={showAssignPanditModal}
                onHide={() => setShowAssignPanditModal(false)}
                modelRequestData={modelRequestData}
                setIsAddUpdateDone={setIsAddUpdateDone}
            />
            <PujaKitSubscriptionOrderDetails
                show={showBookingOrderDetailsModal}
                onHide={() => setShowBookingOrderDetailsModal(false)}
                modelRequestData={modelRequestData}
                setIsAddUpdateDone={setIsAddUpdateDone}
            />
            <PujaKitRefillDetails
                show={showRefillDetailsModal}
                onHide={() => setShowRefillDetailsModal(false)}
                dialogData={pujaKitRefillDetails}
                moduleName={"PujaSubscriptionKit"}
                setIsAddUpdateDone={setIsAddUpdateDone}
            />


        </>
    );
};

export default PujaKitSubscriptionOrderList;
