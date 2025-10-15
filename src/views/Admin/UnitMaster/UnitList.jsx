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
import { ChangeUnitStatus, GetUnitList } from 'services/Admin/UnitAPI/UnitAPI';
import AddUpdateUnitModal from './AddUpdateUnit';
// import AddUpdatePujaModal from './AddUpdatePujaModal';

const UnitList = () => {
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

  const [unitList, setUnitList] = useState([]);
  const [toDate, setToDate] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);

  // ✅ Check if all rows are selected
  const selectableRows = unitList.filter((item) => item.panditName === null);
  // const allSelected = unitList?.length > 0 && selectedBookings.length === unitList.length;
  const allSelected = selectableRows.length > 0 && selectableRows.every((item) => selectedBookings.includes(item.pujaBookingID));

  //   console.log('selectedBookings', selectedBookings);

  useEffect(() => {
    if (location?.pathname === '/unit') {
      setPageHeading('Unit');
      GetUnitListData(1, null);
    } else {
      console.log("Everything is fine just didn't matched the route");
    }
  }, [location]);

  useEffect(() => {
    if (isAddUpdateDone) {
      setShowAssignPanditModal(false);
      setShowAssignPanditSuccessModal(true);
      setSelectedBookings([]);
      GetUnitListData(currentPage, null, modelRequestData?.pujaServiceID, modelRequestData?.pujaSubServiceID);
      setIsAddUpdateDone(false);
    }
  }, [isAddUpdateDone]);

  // ------------API Callings--------------------
  const GetUnitListData = async (pageNo, searchValue) => {
    setLoader(true);
    try {
      const response = await GetUnitList({
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
            setUnitList(List);
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
      const response = await ChangeUnitStatus(value?.unitKeyID);

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            setIsAddUpdateDone(true);
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
      appLangID: null,
      unitKeyID: null
    }));

    setShowAddModal(true);
  };

  const updateBtnClicked = (value) => {
    setModelRequestData((prev) => ({
      ...prev,
      Action: 'update',
      unitKeyID: value?.unitKeyID
    }));
    setShowAddModal(true);
  };
  const fetchSearchResults = (searchValue) => {
    GetUnitListData(currentPage, searchValue);
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
    setUnitList([]);
    GetUnitListData();
  };

  // // ✅ Toggle select all
  // const handleSelectAll = () => {
  //   if (allSelected) {
  //     setSelectedBookings([]);
  //   } else {
  //     setSelectedBookings(unitList.map((item) => item.bookingID));
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
            <div className="d-flex gap-2 align-items-center">
              <Tooltip title="Add Unit">
                <button onClick={handleAddModal} className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
                  <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i>
                  <span className="d-none d-sm-inline">Add Unit</span>
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
                      Unit
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
                  {unitList?.map((item, idx) => (
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
                        {item?.unit ? (
                          item.unit.length > 25 ? (
                            <Tooltip title={item.unit}>{item.unit.substring(0, 25) + '...'}</Tooltip>
                          ) : (
                            item.unit
                          )
                        ) : (
                          '-'
                        )}
                      </td>

                      {/* <td style={{ whiteSpace: 'nowrap' }}>{item.userName === null ? '-' : item?.userName}</td> */}

                      <td style={{ whiteSpace: 'nowrap' }}>{item.createdOnDate}</td>

                      <td className="text-center text-nowrap" onClick={() => ChangeStatusData(item)}>
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
      <AddUpdateUnitModal
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
    </>
  );
};

export default UnitList;
