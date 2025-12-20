import { Tooltip } from '@mui/material';
import Android12Switch from 'component/Android12Switch';
import { ChangeStatusMassage } from 'component/GlobalMassage';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import dayjs from 'dayjs';
import { OrderStatus, pujaServiceID, pujaSubServiceID } from 'Middleware/Enum';
import { debounce } from 'Middleware/Utils';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router';
import { ChangePujaStatus, GetPujaList } from 'services/Admin/Puja/PujaApi';
import { ChangeOrderStatus, GetPujaBookingList } from 'services/Admin/PujaBookingAPI/PujaBookingAPI';
import AddUpdateTempleModal from 'views/Admin Temple/Temple/AddUpdateTempleModal';
import PujaBookingOrderDetails from './PujaBookingOrderDetails';
import AssignPanditModal from './AssignPanditModal';
import Select from 'react-select';
import 'react-calendar/dist/Calendar.css';
import DatePicker from 'react-date-picker';

const PujaBookingList = () => {
  const { setLoader, setToDate, toDate, fromDate, setFromDate } = useContext(ConfigContext);
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
  const [pageHeading, setPageHeading] = useState('Puja List');
  const [selectedPuja, setSelectedPuja] = useState([]);
  const [modelRequestData, setModelRequestData] = useState({
    Action: null,
    vendorID: null,
    moduleName: 'PujaList',
    pujaBookingKeyID: null,
    selectedPujas: null
  });
  const [showAddTempleModal, setShowAddTempleModal] = useState(false);

  const [isAddUpdateDone, setIsAddUpdateDone] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAssignPanditSuccessModal, setShowAssignPanditSuccessModal] = useState(false);
  const [showAssignPanditModal, setShowAssignPanditModal] = useState(false);
  const [showBookingOrderDetailsModal, setShowBookingOrderDetailsModal] = useState(false);

  const [pujaList, setPujaList] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [pujaOrderStatusMap, setPujaOrderStatusMap] = useState({});

  const [selectedBookings, setSelectedBookings] = useState([]);
  const [pujaOrderStatusID, setPujaOrderStatusID] = useState(null);

  // ✅ Check if all rows are selected
  const selectableRows = pujaList.filter((item) => item.panditName === null);
  // const allSelected = pujaList?.length > 0 && selectedBookings.length === pujaList.length;
  const allSelected = selectableRows.length > 0 && selectableRows.every((item) => selectedBookings.includes(item.pujaBookingID));


  useEffect(() => {
    // debugger;
    setCurrentPage(1);
    if (location?.pathname === '/pandit-puja-booking') {
      setPageHeading('Pandit Puja Booking List');
      GetPujaBookingListData(1, null, pujaServiceID?.PanditPuja, pujaSubServiceID?.PanditPuja);
      setModelRequestData((prev) => ({
        ...prev,
        pujaServiceID: pujaServiceID?.PanditPuja,
        pujaSubServiceID: pujaSubServiceID?.PanditPuja
      }));
    } else if (location?.pathname === '/daily-pandit-puja-booking') {
      setPageHeading('Daily Pandit Booking List (Puja)');
      GetPujaBookingListData(1, null, pujaServiceID?.PanditPuja, pujaSubServiceID?.DailyPanditPuja);
      setModelRequestData((prev) => ({
        ...prev,
        pujaServiceID: pujaServiceID?.PanditPuja,
        pujaSubServiceID: pujaSubServiceID?.DailyPanditPuja
      }));
    } else if (location?.pathname === '/remedy-puja-booking') {
      setPageHeading('Remedy Puja Booking List');
      GetPujaBookingListData(1, null, pujaServiceID?.Puja, pujaSubServiceID?.RemedyPuja);
      setModelRequestData((prev) => ({ ...prev, pujaServiceID: pujaServiceID?.Puja, pujaSubServiceID: pujaSubServiceID?.RemedyPuja }));
    } else if (location?.pathname === '/homam-booking') {
      setPageHeading('Homam Booking List');
      GetPujaBookingListData(1, null, pujaServiceID?.Puja, pujaSubServiceID?.HomamPuja);
      setModelRequestData((prev) => ({ ...prev, pujaServiceID: pujaServiceID?.Puja, pujaSubServiceID: pujaSubServiceID?.HomamPuja }));
    } else if (location?.pathname === '/subscription-puja-booking') {
      setPageHeading('Subscription Puja Booking List');
      GetPujaBookingListData(1, null, pujaServiceID?.SankalpPuja, pujaSubServiceID?.SubscriptionRemedyPuja);
      setModelRequestData((prev) => ({
        ...prev,
        pujaServiceID: pujaServiceID?.SankalpPuja,
        pujaSubServiceID: pujaSubServiceID?.SubscriptionRemedyPuja
      }));
    } else if (location?.pathname === '/subscription-homam-booking') {
      setPageHeading('Subscription Homam Booking List');
      GetPujaBookingListData(1, null, pujaServiceID?.SankalpPuja, pujaSubServiceID?.SubscriptionHomamPuja);
      setModelRequestData((prev) => ({
        ...prev,
        pujaServiceID: pujaServiceID?.SankalpPuja,
        pujaSubServiceID: pujaSubServiceID?.SubscriptionHomamPuja
      }));
    } else if (location?.pathname === '/puja-at-temple-booking') {
      setPageHeading('Puja At Temple Booking List');
      GetPujaBookingListData(1, null, pujaServiceID?.PujaAtTemple, pujaSubServiceID?.PujaAtTemple);
      setModelRequestData((prev) => ({ ...prev, pujaServiceID: pujaServiceID?.PujaAtTemple, pujaSubServiceID: pujaSubServiceID?.PujaAtTemple }));
    }
  }, [location.pathname]);

  useEffect(() => {

    if (isAddUpdateDone) {
      // debugger;
      if (showAssignPanditModal) {
        setShowAssignPanditModal(false);
        setShowAssignPanditSuccessModal(true);

      }
      setSelectedBookings([]);
      GetPujaBookingListData(currentPage, null, modelRequestData?.pujaServiceID, modelRequestData?.pujaSubServiceID);
      setIsAddUpdateDone(false);
    }
  }, [isAddUpdateDone]);

  // ------------API Callings--------------------
  const GetPujaBookingListData = async (pageNumber, searchKeywordValue, pujaServiceID, pujaSubServiceID) => {

    setLoader(true);
    try {
      const response = await GetPujaBookingList({
        pageSize: pageSize,
        pageNo: pageNumber - 1,
        sortingDirection: sortingType ? sortingType : null,
        sortingColumnName: sortValueName ? sortValueName : null,
        searchKeyword: searchKeywordValue === undefined || searchKeywordValue === null ? searchKeyword : searchKeywordValue,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        pujaServiceID: pujaServiceID,
        pujaSubServiceID: pujaSubServiceID
      });

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
  };



  // ----------Other Functions------------------
  const AddBtnClicked = () => {
    setModelRequestData((prev) => ({ ...prev, Action: null, pujaKeyID: null }));
    setShowAddTempleModal(true);
  };


  const fetchSearchResults = (searchValue) => {

    GetPujaBookingListData(currentPage, searchValue, modelRequestData?.pujaServiceID, modelRequestData?.pujaSubServiceID);

  };
  const debouncedSearch = useCallback(debounce(fetchSearchResults, 500), []);

  const handleSearchChange = (e) => {

    setCurrentPage(1);
    const value = e.target.value;
    setSearchKeyword(value);
    // debouncedSearch(value);
    GetPujaBookingListData(1, value, modelRequestData?.pujaServiceID, modelRequestData?.pujaSubServiceID);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setPujaList([]);
    GetPujaBookingListData(pageNumber, null, modelRequestData?.pujaServiceID, modelRequestData?.pujaSubServiceID);
  };

  // // ✅ Toggle select all
  // const handleSelectAll = () => {
  //   if (allSelected) {
  //     setSelectedBookings([]);
  //   } else {
  //     setSelectedBookings(pujaList.map((item) => item.bookingID));
  //   }
  // };

  // // ✅ Toggle single row
  // const handleSelectRow = (bookingID) => {
  //   if (selectedBookings.includes(bookingID)) {
  //     setSelectedBookings(selectedBookings.filter((id) => id !== bookingID));
  //   } else {
  //     setSelectedBookings([...selectedBookings, bookingID]);
  //   }
  // };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedBookings(selectedBookings.filter((id) => !selectableRows.some((row) => row.pujaBookingID === id)));
    } else {
      const newSelected = [
        ...selectedBookings,
        ...selectableRows.map((item) => item.pujaBookingID).filter((id) => !selectedBookings.includes(id))
      ];
      setSelectedBookings(newSelected);
    }
  };

  // ✅ Toggle single row
  const handleSelectRow = (bookingID) => {
    if (selectedBookings.includes(bookingID)) {
      setSelectedBookings(selectedBookings.filter((id) => id !== bookingID));
    } else {
      setSelectedBookings([...selectedBookings, bookingID]);
    }
  };

  const onSuccessClose = () => {
    setShowSuccessModal(false);
    setIsAddUpdateDone(true);
  };
  const ViewOrderDetails = (value) => {
    setModelRequestData((prev) => ({
      ...prev,
      Action: null,
      vendorID: null,
      moduleName: 'PujaList',
      pujaBookingKeyID: value.pujaBookingKeyID
    }));
    setShowBookingOrderDetailsModal(true);
  };


  const handleAssignPandit = (value) => {
    setModelRequestData((prev) => ({
      ...prev,
      selectedPujas: [value.pujaBookingID]
    }));
    setShowAssignPanditModal(true);
  };



  const handleMultiAssignPandit = () => {
    if (selectedBookings.length === 0) {
      alert('Please select atleast one puja');
      return;
    }
    setModelRequestData((prev) => ({
      ...prev,
      selectedPujas: selectedBookings
    }));
    setShowAssignPanditModal(true);
  };

  const handleStatusChange = async (PujaBookingKeyID, newStatus) => {
    setPujaOrderStatusMap((prev) => ({
      ...prev,
      [PujaBookingKeyID]: newStatus
    }));

    setLoader(true);
    try {
      // API call to update status
      await ChangeOrderStatus(PujaBookingKeyID, newStatus);
      setLoader(false);
      setSuccessMessage(`Order status updated to "${newStatus}" successfully!`);
      setShowSuccessPopUp(true);
    } catch (error) {
      setLoader(false);
      console.error('Error updating status:', error);
    } finally {
      // ✅ Always refresh the data, no matter what
      await GetPujaBookingListData(currentPage, searchKeyword, modelRequestData?.pujaServiceID, modelRequestData?.pujaSubServiceID);
      setLoader(false);
    }
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
    setIsAddUpdateDone(true)
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
    setIsAddUpdateDone(true)
  };

  const handleClearDates = () => {
    setFromDate(null);
    setToDate(null);
    setIsAddUpdateDone(true)
  };
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

          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            {/* Search Box */}
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              style={{ maxWidth: '350px' }}
              value={searchKeyword}
              onChange={handleSearchChange}
            />
            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                alignItems: 'center',
                // flexWrap: 'wrap',

              }}
            >
              <DatePicker
                className="date-picker-input text-nowrap  "
                label="From Date"
                value={fromDate ? fromDate.toDate() : null}
                onChange={handleFromDateChange}
                clearIcon={null}
                maxDate={toDate ? dayjs(toDate).toDate() : null}
                format='dd/MM/yyyy'
              />
              {/* DatePicker - To */}
              <DatePicker
                minDate={fromDate ? dayjs(fromDate).toDate() : null}
                className="date-picker-input text-nowrap"
                label="To Date"
                value={toDate ? toDate.toDate() : null}
                onChange={handleToDateChange}
                clearIcon={null}
                format='dd/MM/yyyy'
              />
              <button className="btn btn-primary customBtn" onClick={handleClearDates}>
                Clear
              </button>
            </div>

            {/* Action Buttons */}
            {(location?.pathname === '/pandit-puja-booking' || location?.pathname === '/daily-pandit-puja-booking') && (

            <div className="d-flex gap-2 align-items-center">
              <Tooltip title="Assign Pandit">
                <button onClick={handleMultiAssignPandit} className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
                  {/* <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i> */}
                  <span className="d-none d-sm-inline">Assign Pandit</span>
                </button>
              </Tooltip>
            </div>
            )}
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
                    {/* ✅ Master checkbox */}
                    {(location?.pathname === '/pandit-puja-booking' || location?.pathname === '/daily-pandit-puja-booking') && (

                    <th className="text-center">
                      <input type="checkbox" checked={allSelected} onChange={handleSelectAll} />
                    </th>
                    )}
                    <th className="text-center">Sr No.</th>
                    <th className="text-center">Booking ID</th>
                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Puja Name
                    </th>
                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Customer Name
                    </th>


                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Total Price (₹)
                    </th>
                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Booking Date
                    </th>
                    {(location?.pathname === '/pandit-puja-booking' || location?.pathname === '/daily-pandit-puja-booking') && (
                      <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                        Pandit Name
                      </th>
                    )}
                    {(location?.pathname === '/daily-pandit-puja-booking') && (

                      <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                        Mobile Number
                      </th>
                    )}
                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Order Status
                    </th>

                    {/* <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Status
                    </th> */}
                    <th className="text-center actionSticky" style={{ whiteSpace: 'nowrap' }}>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {pujaList?.map((item, idx) => (
                    <tr className="text-nowrap text-center" key={item.pujaBookingID}>
                      {/* ✅ Row checkbox */}
                      {(location?.pathname === '/pandit-puja-booking' || location?.pathname === '/daily-pandit-puja-booking') && (

                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={selectedBookings.includes(item.pujaBookingID)}
                          onChange={() => handleSelectRow(item.pujaBookingID)}
                          disabled={item.panditName !== null}
                        />
                      </td>
                      )}

                      <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                        {item.bookingID}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {item?.pujaName ? (
                          item.pujaName.length > 25 ? (
                            <Tooltip title={item.pujaName}>{item.pujaName.substring(0, 25) + '...'}</Tooltip>
                          ) : (
                            item.pujaName
                          )
                        ) : (
                          '-'
                        )}
                      </td>

                      {/* <td style={{ whiteSpace: 'nowrap' }}>{item.userName === null ? '-' : item?.userName}</td> */}

                      <td style={{ whiteSpace: 'nowrap' }}>
                        {item?.userName ? (
                          item.userName.length > 25 ? (
                            <Tooltip title={item.userName}>{item.userName.substring(0, 25) + '...'}</Tooltip>
                          ) : (
                            item.userName
                          )
                        ) : (
                          '-'
                        )}
                      </td>

                      <td>
                        {/* {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          minimumFractionDigits: 2
                        }).format(item.totalAmount)} */}
                        {item.totalAmount}
                      </td>


                      {/* booking date */}
                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                        {item.bookingDate ? item.bookingDate : "-"
                        }
                      </td>

                      {(location?.pathname === '/pandit-puja-booking' || location?.pathname === '/daily-pandit-puja-booking') && (
                        <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                          {item.panditName === null ? (
                            <span onClick={() => handleAssignPandit(item)} style={{ color: 'blue', cursor: 'pointer' }}>
                              Assign Pandit
                            </span>
                          ) : (
                            item.panditName
                          )}
                        </td>
                      )}
                      {(location?.pathname === '/daily-pandit-puja-booking') && (
                        <td style={{ width: '150px' }}>
                          {item.mobileNo}
                        </td>
                      )}

                      <td style={{ width: '150px' }}>
                        <Select
                          options={OrderStatus.filter((option) => !(item.orderStatus === 'Confirmed' && option.label === 'Pending'))}
                          value={OrderStatus?.filter(
                            (v) => v?.value === (pujaOrderStatusMap[item.pujaBookingKeyID] ?? item.pujaOrderStatusID)
                          )}
                          onChange={(selectedOption) => handleStatusChange(item.pujaBookingKeyID, selectedOption.value)}
                          menuPlacement="auto"
                          menuPosition="fixed"
                          isDisabled={['Completed', 'Rejected', 'Cancelled'].includes(item.orderStatus)}
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: '150px' // ensures Select fills the td
                            })
                          }}
                        />
                      </td>

                      {/* <td className="text-center text-nowrap" onClick={() => ChangeStatusData(item)}>
                        <Tooltip title={item.status === true ? 'Enable' : 'Disable'}>
                          {item.status === true ? 'Enable' : 'Disable'}
                          <Android12Switch style={{ padding: '8px' }} checked={item.status === true} />
                        </Tooltip>
                      </td> */}

                      <td className="text-center actionColSticky" style={{ zIndex: 4 }}>
                        <div className="d-flex justify-content-center gap-2">
                          <Tooltip title="Order Details">
                            <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => ViewOrderDetails(item)}>
                              <i className="fas fa-file-invoice"></i>
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
      {/* <AddUpdatePujaModal
        show={showAddTempleModal}
        onHide={() => setShowAddTempleModal(false)}
        modelRequestData={modelRequestData}
        setIsAddUpdateDone={setIsAddUpdateDone}
      /> */}
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

      <PujaBookingOrderDetails
        show={showBookingOrderDetailsModal}
        onHide={() => setShowBookingOrderDetailsModal(false)}
        modelRequestData={modelRequestData}
      />
    </>
  );
};

export default PujaBookingList;
