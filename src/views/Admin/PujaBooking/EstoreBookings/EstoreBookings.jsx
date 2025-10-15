import { Tooltip } from '@mui/material';
import Android12Switch from 'component/Android12Switch';
import { ChangeStatusMassage } from 'component/GlobalMassage';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import dayjs from 'dayjs';
import { OrderStatus, OrderStatusEstore, pujaServiceID, pujaSubServiceID } from 'Middleware/Enum';
import { debounce } from 'Middleware/Utils';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router';
import { ChangePujaStatus, GetPujaList } from 'services/Admin/Puja/PujaApi';
import { ChangeOrderStatus, GetPujaBookingList } from 'services/Admin/PujaBookingAPI/PujaBookingAPI';
import PujaBookingOrderDetails from '../PujaBookingOrderDetails';
// import AssignPanditModal from './AssignPanditModal';
import Select from 'react-select';
import AssignPanditModal from '../AssignPanditModal';
import { ChangeEstoreOrderStatus, GetEstoreBookingList } from 'services/Admin/PujaBookingAPI/EstoreBookingAPI';
import EstoreBookingOrderDetails from './EstoreOrderDetailsModal';
// import AddUpdatePujaModal from './AddUpdatePujaModal';

const EstoreBookingList = () => {
  const { setLoader } = useContext(ConfigContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState(null);
  const [totalCount, setTotalCount] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(-1);
  const [pageSize, setPageSize] = useState(20);
  const [sortingType, setSortingType] = useState(null);
  const [sortValueName, setSortValueName] = useState(null);
  const [pageHeading, setPageHeading] = useState('Puja List');
  const [selectedPuja, setSelectedPuja] = useState([]);
  const [modelRequestData, setModelRequestData] = useState({
    Action: null,
    vendorID: null,
    moduleName: '',
    pujaBookingKeyID: null,
    selectedPujas: null
  });
  const [showAddTempleModal, setShowAddTempleModal] = useState(false);
  const [showVendorDetailsModal, setShowVendorDetailsModal] = useState(false);
  const [isAddUpdateDone, setIsAddUpdateDone] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAssignPanditSuccessModal, setShowAssignPanditSuccessModal] = useState(false);
  const [showAssignPanditModal, setShowAssignPanditModal] = useState(false);
  const [showBookingOrderDetailsModal, setShowBookingOrderDetailsModal] = useState(false);

  const [estoreBookingList, setEstoreBookingList] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [pujaOrderStatusMap, setPujaOrderStatusMap] = useState({});
  const [toDate, setToDate] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [pujaOrderStatusID, setPujaOrderStatusID] = useState(null);

  // ✅ Check if all rows are selected
  const selectableRows = estoreBookingList.filter((item) => item.panditName === null);
  // const allSelected = estoreBookingList?.length > 0 && selectedBookings.length === estoreBookingList.length;
  const allSelected = selectableRows.length > 0 && selectableRows.every((item) => selectedBookings.includes(item.pujaBookingID));

  console.log('selectedBookings', selectedBookings);

  useEffect(() => {
    if (location?.pathname === '/estore-bookings') {
      setPageHeading('Estore Booking List');
      GetEstoreBookingListData(1, null, pujaServiceID?.PanditPuja, pujaSubServiceID?.PanditPuja);
      setModelRequestData((prev) => ({
        ...prev,
        pujaServiceID: pujaServiceID?.PanditPuja,
        pujaSubServiceID: pujaSubServiceID?.PanditPuja
      }));
    }
  }, [location]);
  useEffect(() => {
    if (isAddUpdateDone) {
      setShowAssignPanditModal(false);
      setShowAssignPanditSuccessModal(true);
      setSelectedBookings([]);
      GetEstoreBookingListData(currentPage, null, modelRequestData?.pujaServiceID, modelRequestData?.pujaSubServiceID);
      setIsAddUpdateDone(false);
    }
  }, [isAddUpdateDone]);

  // ------------API Callings--------------------
  const GetEstoreBookingListData = async (pageNumber, searchKeywordValue, pujaServiceID, pujaSubServiceID) => {
    setLoader(true);
    try {
      const response = await GetEstoreBookingList(
        {
          pageSize: pageSize,
          pageNo: pageNumber - 1,
          sortingDirection: sortingType ? sortingType : null,
          sortingColumnName: sortValueName ? sortValueName : null,
          searchKeyword: searchKeywordValue === undefined || searchKeywordValue === null ? searchKeyword : searchKeywordValue,
          fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
          toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
          pujaServiceID: pujaServiceID,
          pujaSubServiceID: pujaSubServiceID
        },
        location.pathname === '/estore-bookings' ? 'Product' : 'Prasad'
      );

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const List = response.data.responseData.data;
            const totalCount = response.data.totalCount;

            setTotalCount(totalCount);
            setTotalPages(Math.ceil(totalCount / pageSize));
            setEstoreBookingList(List);
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

  const ChangeStatusData = async (value) => {
    setLoader(true);
    try {
      const response = await ChangePujaStatus(value?.pujakeyID);

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            // setIsAddUpdateDone(true)
            setSuccessMessage('Pandit assigned successfully ');
            setShowSuccessModal(true);
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

  const updateBtnClicked = (value) => {
    setModelRequestData((prev) => ({
      ...prev,
      Action: 'update',
      pujaKeyID: value?.pujakeyID
    }));
    setShowAddTempleModal(true);
  };
  const fetchSearchResults = (searchValue) => {
    GetPujaListData(currentPage, searchValue, modelRequestData?.pujaServiceID, modelRequestData?.pujaSubServiceID);
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
    setEstoreBookingList([]);
    GetEstoreBookingListData(pageNumber, null, modelRequestData?.pujaServiceID, modelRequestData?.pujaSubServiceID);
  };

  // // ✅ Toggle select all
  // const handleSelectAll = () => {
  //   if (allSelected) {
  //     setSelectedBookings([]);
  //   } else {
  //     setSelectedBookings(estoreBookingList.map((item) => item.bookingID));
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
      estoreBookingKeyID: value.estoreBookingKeyID
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

  console.log('modelRequestData.selectedPujas', modelRequestData.selectedPujas);

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
      await GetEstoreBookingListData(currentPage, searchKeyword);
      setLoader(false);
    }
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
              onChange={handleSearchChange}
            />

            {/* Action Buttons */}
            {/* <div className="d-flex gap-2 align-items-center">
                <Tooltip title="Assign Pandit">
                    <button onClick={handleMultiAssignPandit} className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
                    <span className="d-none d-sm-inline">Assign Pandit</span>
                    </button>
                </Tooltip>
                </div> */}
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
                    {/* <th className="text-center">
                      <input type="checkbox" checked={allSelected} onChange={handleSelectAll} />
                    </th> */}
                    <th className="text-center">Sr No.</th>
                    <th className="text-center">Booking ID</th>
                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Product Name
                    </th>
                    {/* <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Customer Name
                    </th> */}

                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Total Price (₹)
                    </th>

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
                  {estoreBookingList?.map((item, idx) => (
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

      <EstoreBookingOrderDetails
        show={showBookingOrderDetailsModal}
        onHide={() => setShowBookingOrderDetailsModal(false)}
        modelRequestData={modelRequestData}
      />
    </>
  );
};

export default EstoreBookingList;
