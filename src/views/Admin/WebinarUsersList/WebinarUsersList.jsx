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
import { GetContactUsList } from 'services/Admin/ContactUsAPI/ContactUsAPI';
import { GetNewsLetterList } from 'services/Admin/NewsLetterAPI/NewsLetterAPI';
import { GetWebinarUserList } from 'services/Admin/WebinarUsersList/WebinarUsersListAPI';
// import AddUpdatePujaModal from './AddUpdatePujaModal';

const WebinarUsersList = () => {
  const { setLoader } = useContext(ConfigContext);
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

  const [webinarUsersList, setWebinarUsersList] = useState([]);
  const [toDate, setToDate] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);

  // ✅ Check if all rows are selected
  const selectableRows = webinarUsersList.filter((item) => item.panditName === null);
  // const allSelected = webinarUsersList?.length > 0 && selectedBookings.length === webinarUsersList.length;
  const allSelected = selectableRows.length > 0 && selectableRows.every((item) => selectedBookings.includes(item.pujaBookingID));

  //   console.log('selectedBookings', selectedBookings);

  useEffect(() => {
    if (location?.pathname === '/webinar-users') {
      setPageHeading('Webinar Users List');
      GetWebinarUsersListData(1, null, pujaServiceID?.PanditPuja, pujaSubServiceID?.PanditPuja);
      setModelRequestData((prev) => ({
        ...prev,
        pujaServiceID: pujaServiceID?.PanditPuja,
        pujaSubServiceID: pujaSubServiceID?.PanditPuja
      }));
    } else {
      console.log("Everything is fine just didn't matched the route");
    }
  }, [location]);

  useEffect(() => {
    if (isAddUpdateDone) {
      setShowAssignPanditModal(false);
      setShowAssignPanditSuccessModal(true);
      setSelectedBookings([]);
      GetWebinarUsersListData(currentPage, null);
      setIsAddUpdateDone(false);
    }
  }, [isAddUpdateDone]);

  // ------------API Callings--------------------
  const GetWebinarUsersListData = async (pageNo, searchValue) => {
    setLoader(true);
    try {
      const response = await GetWebinarUserList({
        pageSize: pageSize,
        pageNo: pageNo - 1,
        sortingDirection: null,
        sortingColumnName: null,
        searchKeyword: searchValue ? searchValue : null,
        fromDate: null,
        toDate: null
      });

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const List = response.data.responseData.data;
            const totalCount = response.data.totalCount;

            setTotalCount(totalCount);
            setTotalPages(Math.ceil(totalCount / pageSize));
            setWebinarUsersList(List);
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
      const response = await ChangeStatus(value?.productCatKeyID, value?.appLangID);

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

  const handleAddModal = () => {
    setModelRequestData((prev) => ({
      ...prev,
      Action: null,
      appLangID: null,
      productCatKeyID: null
    }));

    setShowAddModal(true);
  };

  const updateBtnClicked = (value) => {
    setModelRequestData((prev) => ({
      ...prev,
      Action: 'update',
      productCatKeyID: value?.productCatKeyID,
      appLangID: value.appLangID,
      modelRequestData: value.modelRequestData
    }));
    setShowAddModal(true);
  };
  const fetchSearchResults = (searchValue) => {
    GetWebinarUsersListData(currentPage, searchValue);
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
    setWebinarUsersList([]);
    GetWebinarUsersListData();
  };

  const onSuccessClose = () => {
    setShowSuccessModal(false);
    setIsAddUpdateDone(true);
  };

  const AddLangBtnClicked = (value) => {
    navigate('/product-category-language-wise', {
      state: {
        data: value
      }
    });
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
              style={{ maxWidth: '350px' }}
              onChange={handleSearchChange}
            />

            {/* Action Buttons */}
            {/* <div className="d-flex gap-2 align-items-center">
              <Tooltip title="Assign Pandit">
                <button onClick={handleAddModal} className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
                  <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i>
                  <span className="d-none d-sm-inline">Add Product Cat</span>
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
                    <th className="text-center">Sr No.</th>
                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Name
                    </th>
                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      WhatsApp Number
                    </th>
                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Email
                    </th>
                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Webinar Fee
                    </th>

                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Webinar Topic
                    </th>

                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Webinar Date Time
                    </th>

                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Payment Status
                    </th>

                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Mail sent status
                    </th>
                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Registration Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {webinarUsersList?.map((item, idx) => (
                    <tr className="text-nowrap text-center" key={item.pujaBookingID}>
                      {/* ✅ Row checkbox */}
                      {/* <td className="text-center">
                        <input
                          type="checkbox"
                          checked={selectedBookings.includes(item.pujaBookingID)}
                          onChange={() => handleSelectRow(item.pujaBookingID)}
                          disabled={item.panditName !== null}
                        />
                      </td> */}

                      <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {item?.name ? (
                          item.name.length > 25 ? (
                            <Tooltip title={item.name}>{item.name.substring(0, 25) + '...'}</Tooltip>
                          ) : (
                            item.name
                          )
                        ) : (
                          '-'
                        )}
                      </td>

                      {/* <td style={{ whiteSpace: 'nowrap' }}>{item.userName === null ? '-' : item?.userName}</td> */}
                      <td style={{ whteSpace: 'nowrap' }}>{item.whatsappNumber}</td>

                      <td style={{ whiteSpace: 'nowrap' }}>
                        {item?.emailID ? (
                          item.emailID.length > 25 ? (
                            <Tooltip title={item.emailID}>{item.emailID.substring(0, 25) + '...'}</Tooltip>
                          ) : (
                            item.emailID
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
                        }).format(item.webinarFee)}
                      </td>

                      <td style={{ whiteSpace: 'nowrap' }}>
                        {item?.webinarTopic ? (
                          item.webinarTopic.length > 25 ? (
                            <Tooltip title={item.webinarTopic}>{item.webinarTopic.substring(0, 25) + '...'}</Tooltip>
                          ) : (
                            item.webinarTopic
                          )
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        {item.date} {item.time}
                      </td>
                      <td>{item.paymentStatus === true ? 'Completed' : 'Pending'}</td>
                      <td>{item.isMailSent === true ? 'Sent' : 'Not Sent'}</td>
                      <td style={{ whteSpace: 'nowrap' }}>{item.createdOnDate}</td>

                      {/* <td className="text-center text-nowrap" onClick={() => ChangeStatusData(item)}>
                        <Tooltip title={item.status === true ? 'Enable' : 'Disable'}>
                          {item.status === true ? 'Enable' : 'Disable'}
                          <Android12Switch style={{ padding: '8px' }} checked={item.status === true} />
                        </Tooltip>
                      </td>

                      <td className="text-center actionColSticky" style={{ zIndex: 4 }}>
                        <div className="d-flex justify-content-center gap-2">
                          <Tooltip title={`Update ${pageHeading}`}>
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

      <SuccessPopupModal show={showSuccessModal} onHide={() => onSuccessClose()} successMassage={ChangeStatusMassage} />

      {/* <SuccessPopupModal
        show={showAssignPanditSuccessModal}
        onHide={() => setShowAssignPanditSuccessModal(false)}
        successMassage="Pandit assigned successfully "
      /> */}
    </>
  );
};

export default WebinarUsersList;
