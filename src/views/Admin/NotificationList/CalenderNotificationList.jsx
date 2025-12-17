import { Tooltip } from '@mui/material';
import Android12Switch from 'component/Android12Switch';
import { ChangeStatusMassage } from 'component/GlobalMassage';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import dayjs from 'dayjs';
import { NotificationTimeSlot, pujaServiceID, pujaSubServiceID } from 'Middleware/Enum';
import { debounce, MonthWiseUtilList } from 'Middleware/Utils';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router';
import { ChangeStatus, GetProductCatList } from 'services/Admin/EStoreAPI/ProductCatAPI';
import AddUpdateBannerModal from './AddUpdateNotificationModal';
import AddUpdateNotificationModal from './AddUpdateNotificationModal';
import { GetNotificationList, NotificationTemplateChangeStatus } from 'services/Admin/NotificationAPI/NotificationTemplateAPI';
import AddUpdateCalenderNotifiModal from './AddUpdateCaldenderNotifiModal';
import { CalenderNotifiChangeStatus, GetCalenderNotifiList } from 'services/Admin/NotificationAPI/CalenderNotificationAPI';
// import AddUpdateBannerModal from './AddUpdateBannerModal';
import Select from 'react-select';
import ImagePreviewModal from 'Image Preview Modal/ImagePreviewModal';

const CalenderNotificationList = () => {
  const { setLoader } = useContext(ConfigContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationTimeSlotID, setNotificationTimeSlotID] = useState(null);
  const [selectedMonthFilterID, setSelectedMonthFilterID] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(null);
  const [totalCount, setTotalCount] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(-1);
  const [pageSize, setPageSize] = useState(30);
  const [sortingType, setSortingType] = useState(null);
  const [sortValueName, setSortValueName] = useState(null);
  const [pageHeading, setPageHeading] = useState('Puja List');
  const [selectedPuja, setSelectedPuja] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modelRequestData, setModelRequestData] = useState({
    Action: null,
    productCatKeyID: null,
    appLangID: null,
    prodCatByLangKeyID: null
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVendorDetailsModal, setShowVendorDetailsModal] = useState(false);
  const [isAddUpdateDone, setIsAddUpdateDone] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAssignPanditSuccessModal, setShowAssignPanditSuccessModal] = useState(false);
  const [showAssignPanditModal, setShowAssignPanditModal] = useState(false);
  const [showBookingOrderDetailsModal, setShowBookingOrderDetailsModal] = useState(false);

  const [calenderNotifiList, setCalenderNotifiList] = useState([]);
  const [toDate, setToDate] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);
  // const [modalTitle, setModalTitle] = useState(false);
  // const [selectedImage, setSelectedImage] = useState(null);
  // const [showModal, setShowModal] = useState(false);

  // ✅ Check if all rows are selected
  const selectableRows = calenderNotifiList.filter((item) => item.panditName === null);
  // const allSelected = calenderNotifiList?.length > 0 && selectedBookings.length === calenderNotifiList.length;
  const allSelected = selectableRows.length > 0 && selectableRows.every((item) => selectedBookings.includes(item.pujaBookingID));

  //   console.log('selectedBookings', selectedBookings);

  useEffect(() => {
    if (location?.pathname === '/calender-notification') {
      setPageHeading('Calender Notification');
      GetCalenderNotifiListData(1, null, null, null);
      // setModelRequestData((prev) => ({
      //   ...prev,
      //   pujaServiceID: pujaServiceID?.PanditPuja,
      //   pujaSubServiceID: pujaSubServiceID?.PanditPuja
      // }));
    } else {
      console.log("Everything is fine just didn't matched the route");
    }
  }, [location]);

  useEffect(() => {
    if (isAddUpdateDone) {
      setShowAssignPanditModal(false);
      setShowAssignPanditSuccessModal(true);
      setSelectedBookings([]);
      GetCalenderNotifiListData(currentPage, null, null, null);
      setIsAddUpdateDone(false);
    }
  }, [isAddUpdateDone]);

  // ------------API Callings--------------------
  const GetCalenderNotifiListData = async (pageNo, searchValue, notificationTimeSlotID, selectedMonthFilterID) => {

    setLoader(true);
    try {
      const response = await GetCalenderNotifiList({

        pageSize: pageSize,
        pageNo: pageNo - 1,
        sortingDirection: null,
        sortingColumnName: null,
        searchKeyword: searchValue ? searchValue : null,
        fromDate: null,
        toDate: null,
        time: notificationTimeSlotID ? notificationTimeSlotID : null,
        monthID: selectedMonthFilterID ? selectedMonthFilterID : null
      });

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const List = response.data.responseData.data;
            const totalCount = response.data.totalCount;

            setTotalCount(totalCount);
            setTotalPages(Math.ceil(totalCount / pageSize));
            setCalenderNotifiList(List);
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
    // debugger;
    setLoader(true);
    try {
      const response = await CalenderNotifiChangeStatus(value?.festNotiTemplateKeyID);

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            // setIsAddUpdateDone(true)
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
  //   const AddBtnClicked = () => {
  //     setModelRequestData((prev) => ({ ...prev, Action: null, pujaKeyID: null }));
  //     setShowAddTempleModal(true);
  //   };

  const handleAddModal = () => {
    setModelRequestData((prev) => ({
      ...prev,
      Action: null,
      festNotiTemplateKeyID: null
    }));

    setShowAddModal(true);
  };

  const updateBtnClicked = (value) => {
    setModelRequestData((prev) => ({
      ...prev,
      Action: 'update',
      festNotiTemplateKeyID: value?.festNotiTemplateKeyID,
      appLangID: value.appLangID
    }));
    setShowAddModal(true);
  };
  const fetchSearchResults = (searchValue) => {
    GetCalenderNotifiListData(currentPage, searchValue, notificationTimeSlotID, selectedMonthFilterID);
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
    setCalenderNotifiList([]);
    GetCalenderNotifiListData(pageNumber, searchKeyword, notificationTimeSlotID, selectedMonthFilterID);
  };

  // // ✅ Toggle select all
  // const handleSelectAll = () => {
  //   if (allSelected) {
  //     setSelectedBookings([]);
  //   } else {
  //     setSelectedBookings(calenderNotifiList.map((item) => item.bookingID));
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

  //   const handleSelectAll = () => {
  //     if (allSelected) {
  //       setSelectedBookings(selectedBookings.filter((id) => !selectableRows.some((row) => row.pujaBookingID === id)));
  //     } else {
  //       const newSelected = [
  //         ...selectedBookings,
  //         ...selectableRows.map((item) => item.pujaBookingID).filter((id) => !selectedBookings.includes(id))
  //       ];
  //       setSelectedBookings(newSelected);
  //     }
  //   };

  // ✅ Toggle single row
  //   const handleSelectRow = (bookingID) => {
  //     if (selectedBookings.includes(bookingID)) {
  //       setSelectedBookings(selectedBookings.filter((id) => id !== bookingID));
  //     } else {
  //       setSelectedBookings([...selectedBookings, bookingID]);
  //     }
  //   };

  const onSuccessClose = () => {
    setShowSuccessModal(false);
    setIsAddUpdateDone(true);
  };
  //   const ViewOrderDetails = (value) => {
  //     setModelRequestData((prev) => ({
  //       ...prev,
  //       Action: null,
  //       vendorID: null,
  //       moduleName: 'PujaList',
  //       pujaBookingKeyID: value.pujaBookingKeyID
  //     }));
  //     setShowBookingOrderDetailsModal(true);
  //   };
  //   console.log('data', modelRequestData);

  //   const handleAssignPandit = (value) => {
  //     setModelRequestData((prev) => ({
  //       ...prev,
  //       selectedPujas: [value.pujaBookingID]
  //     }));
  //     setShowAssignPanditModal(true);
  //   };

  //   console.log('modelRequestData.selectedPujas', modelRequestData.selectedPujas);

  //   const handleMultiAssignPandit = () => {
  //     if (selectedBookings.length === 0) {
  //       alert('Please select atleast one puja');
  //       return;
  //     }
  //     setModelRequestData((prev) => ({
  //       ...prev,
  //       selectedPujas: selectedBookings
  //     }));
  //     setShowAssignPanditModal(true);
  //   };

  const AddLangBtnClicked = (value) => {
    navigate('/product-category-language-wise', {
      state: {
        data: value
      }
    });
  };

  const handleImageClick = (imgUrl) => {
    // setModalTitle(deityName); // set the modal title dynamically
    setSelectedImage(imgUrl);
    setShowModal(true);
  };

  return (
    <>
      <div className="card">
        <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <h5 className="m-0">{pageHeading}</h5>
            {/* <button onClick={() => AddBtnClicked()} className="btn btn-primary btn-sm d-inline d-sm-none">
              <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
              <span className="d-inline d-sm-none"> Add</span>
            </button> */}
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            {/* Search Box */}
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              style={{ maxWidth: "350px" }}
              onChange={handleSearchChange}
            />



            {/* Action Buttons */}
            <div className="d-flex gap-2 align-items-center">

              {/* Time + Month dropdowns grouped */}
              <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                <Select
                  id="unitID"
                  options={NotificationTimeSlot}
                  value={NotificationTimeSlot.filter(
                    (item) => item.value === notificationTimeSlotID
                  )}
                  placeholder="Select Time"
                  onChange={(selectedOption) => {
                    setNotificationTimeSlotID(selectedOption ? selectedOption.value : null);
                    GetCalenderNotifiListData(
                      currentPage,
                      null,
                      selectedOption?.value || null,
                      selectedMonthFilterID || null
                    );
                  }}
                  menuPlacement="auto"
                  menuPosition="fixed"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    container: (base) => ({
                      ...base,
                      width: "150px",
                    }),
                    control: (base) => ({
                      ...base,
                      minWidth: "150px",
                    }),
                  }}
                />

                <Select
                  id="unitID"
                  options={MonthWiseUtilList}
                  value={MonthWiseUtilList.filter(
                    (item) => item.value === selectedMonthFilterID
                  )}
                  placeholder="Select Month"
                  onChange={(selectedOption) => {
                    setSelectedMonthFilterID(selectedOption ? selectedOption.value : null);
                    GetCalenderNotifiListData(
                      currentPage,
                      null,
                      notificationTimeSlotID || null,
                      selectedOption?.value
                    );
                  }}
                  menuPlacement="auto"
                  menuPosition="fixed"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    container: (base) => ({
                      ...base,
                      width: "180px",
                    }),
                    control: (base) => ({
                      ...base,
                      minWidth: "180px",
                    }),
                  }}
                />
              </div>

              <Tooltip title="Add Notification">
                <button
                  onClick={handleAddModal}
                  className="btn btn-primary btn-sm"
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa-solid fa-plus me-1" style={{ fontSize: "11px" }}></i>
                  <span className="d-none d-sm-inline">Add Notification</span>
                </button>
              </Tooltip>
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
                    {/* ✅ Master checkbox */}
                    {/* <th className="text-center">
                      <input type="checkbox" checked={allSelected} onChange={handleSelectAll} />
                    </th> */}
                    <th className="text-center">Sr No.</th>
                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Notification Title
                    </th>
                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Template Title
                    </th>
                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Template
                    </th>
                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Time
                    </th>
                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Image
                    </th>
                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Scheduling Date
                    </th>

                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Registration Date
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
                  {calenderNotifiList?.map((item, idx) => (
                    <tr className="text-nowrap text-center" key={item.pujaBookingID}>
                      <td style={{ whiteSpace: 'nowrap' }} className="text-center py-2">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {item?.title ? (
                          item.title.length > 25 ? (
                            <Tooltip title={item.title}>{item.title.substring(0, 25) + '...'}</Tooltip>
                          ) : (
                            item.title
                          )
                        ) : (
                          '-'
                        )}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }} className="text-center py-2">
                        {item?.templateTitle ? (
                          item.templateTitle.length > 25 ? (
                            <Tooltip title={item.templateTitle}>{item.templateTitle.substring(0, 25) + '...'}</Tooltip>
                          ) : (
                            item.templateTitle
                          )
                        ) : (
                          '-'
                        )}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }} className="text-center py-2">
                        {item?.template ? (
                          item.template.length > 25 ? (
                            <Tooltip title={item.template}>{item.template.substring(0, 25) + '...'}</Tooltip>
                          ) : (
                            item.template
                          )
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="text-center py-2">{item.notificationTime}</td>

                      <td style={{ whiteSpace: 'nowrap', cursor: 'pointer' }} >
                        {item.image ? (
                          <img
                            src={item.image}
                            onClick={() => handleImageClick(item.image)}
                            alt={item.blogTitle}
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }}
                          />
                        ) : (
                          'No Image'
                        )}
                      </td>
                      <td className="text-center py-2">{dayjs(item.date).format("DD/MM/YYYY")}</td>
                      <td className="text-center py-2">{dayjs(item.createdOnDate).format("DD/MM/YYYY")}</td>

                      <td className="text-center text-nowrap" onClick={() => ChangeStatusData(item)}>
                        <Tooltip title={item.status === 'Active' ? 'Enable' : 'Disable'}>
                          {item.status === 'Active' ? 'Enable' : 'Disable'}
                          <Android12Switch style={{ padding: '8px' }} checked={item.status === 'Active'} />
                        </Tooltip>
                      </td>

                      <td className="text-center actionColSticky" style={{ zIndex: 4 }}>
                        <div className="d-flex justify-content-center gap-2">
                          <Tooltip title={`Update ${pageHeading}`}>
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
      <AddUpdateCalenderNotifiModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        modelRequestData={modelRequestData}
        setIsAddUpdateDone={setIsAddUpdateDone}
      />
      <SuccessPopupModal show={showSuccessModal} onHide={() => onSuccessClose()} successMassage={ChangeStatusMassage} />

      {/* <SuccessPopupModal
        show={showAssignPanditSuccessModal}
        onHide={() => setShowAssignPanditSuccessModal(false)}
        successMassage="Pandit assigned successfully "
      /> */}

      <ImagePreviewModal
        show={showModal}
        onHide={() => setShowModal(false)}
        imgSrc={selectedImage}
        title="Image Preview" // pass deity name as title
      />
    </>
  );
};

export default CalenderNotificationList;
