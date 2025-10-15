import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import { Table } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { ConfigContext } from 'context/ConfigContext';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-date-picker';
import dayjs from 'dayjs';
import PaginationComponent from 'component/Pagination';
import NoResultFoundModel from 'component/NoResultFoundModal';
import AddUpdateLeadModal from './AddUpdateLead';
import { GetLeadDataList } from 'services/LeadAPI/LeadApi';
import AddUpdateTechnicianLeadModal from './AddUpdateTechnicianLeadModal';
import TransferLeadModal from './TransferLeadModal';
import TransferLeadLogsViewModal from './TransferLeadLogsViewModal';
import VehicleDetailsModal from './VehicleDetailsModal';

const LeadList = () => {
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);
  const [showLeadTransferViewModal, setShowLeadTransferViewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showVehicleLeadDetailsModal, setShowVehicleLeadDetailsModal] = useState(false)
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [toDate, setToDate] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState(null);
  const [totalCount, setTotalCount] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [leadListData, setLeadListData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(-1);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [pageSize, setPageSize] = useState(30);
  const [showTransferComplaintModal, setShowTransferComplaintModal] = useState(false);
  const { user, setLoader, companyID } = useContext(ConfigContext);
  const [selectedLeadIDs, setSelectedLeadIDs] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [transferLeadIDs, setTransferLeadIDs] = useState([]); // This will be passed to modal


  const [modelRequestData, setModelRequestData] = useState({
    Action: null,
    leadKeyID: null
  });

  useEffect(() => {
    LeadDataList(1, null, null, null, null, null);
  }, []);

  useEffect(() => {
    if (isAddUpdateActionDone) {
      LeadDataList(currentPage, null, toDate, fromDate, null, null);
      setSearchKeyword('')
      setSelectedLeadIDs([]);
      setSelectAll(false);
    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  const navigate = useNavigate();

  const LeadDataList = async (pageNumber, searchKeywordValue, toDate, fromDate, sortingType, sortValueName) => {
    setLoader(true);
    // debugger;
    try {
      const response = await GetLeadDataList({
        pageNo: pageNumber - 1,
        pageSize: pageSize,
        sortingDirection: sortingType ? sortingType : null, //or null
        sortingColumnName: sortValueName ? sortValueName : null, //or null
        searchKeyword: searchKeywordValue === undefined || searchKeywordValue === null ? searchKeyword : searchKeywordValue,
        fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
        toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
        userKeyID: user.userKeyID,
        companyKeyID: companyID
      });

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const leadList = response.data.responseData.data;
            const totalCount = response.data.totalCount;

            setTotalCount(totalCount);
            setTotalPages(Math.ceil(totalCount / pageSize));
            setLeadListData(leadList);
            setTotalRecords(leadList?.length);
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

  const LeadAddBtnClicked = () => {
    setModelRequestData((prevObj) => ({
      ...prevObj,
      Action: null,
      leadKeyID: null
    }));
    setShowLeadModal(true);
  };

  const EditBtnLead = (item) => {
    setModelRequestData((prevObj) => ({
      ...prevObj,
      Action: 'Update',
      leadKeyID: item.leadKeyID
    }));
    setShowLeadModal(true);
  };

  const closeAllModal = () => {
    setShowTechnicianModal(false)

    setShowSuccessModal(false);
    setData([]);
  };




  const handleSearch = (e) => {
    const inputValue = e.target.value;
    const trimmedValue = inputValue.replace(/^\s+/g, '');
    const capitalizedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();
    setSearchKeyword(capitalizedValue);
    setCurrentPage(1);
    LeadDataList(1, capitalizedValue, toDate, fromDate, null, null);
  };

  const clearDate = () => {
    setToDate(null);
    setFromDate(null);
    setCurrentPage(1);
    LeadDataList(1, null, null, null, null, null);
  };

  const handleLeadPageChange = (pageNumber) => {
    // debugger;
    setLeadListData([]);
    setTotalRecords(-1);
    setCurrentPage(pageNumber); // Update the current page based on the clicked page
    LeadDataList(pageNumber, null, toDate, fromDate, null, null);
  };

  const handleTechnicianBtnClicked = (value) => {
    debugger
    setModelRequestData((prevObj) => ({
      ...prevObj,
      leadKeyID: value.leadKeyID
    }));
    setShowTechnicianModal(true);
  };
  const leadTransferLogsView = (item) => {
    setModelRequestData((prevObj) => ({
      ...prevObj,
      leadKeyID: item.leadKeyID,
      Action: 'TransferView'
    }));
    setShowLeadTransferViewModal(true);
  };

  const amcFollowUp = (item) => {
    navigate('/followup');
  };


  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedLeadIDs([]);
      setSelectAll(false);
    } else {
      const allLeadIDs = leadListData.map(item => item.leadID);
      setSelectedLeadIDs(allLeadIDs);
      setSelectAll(true);
    }
  };

  const handleCheckboxChange = (leadID) => {
    if (selectedLeadIDs.includes(leadID)) {
      const updated = selectedLeadIDs.filter(id => id !== leadID);
      setSelectedLeadIDs(updated);
      setSelectAll(false);
    } else {
      const updated = [...selectedLeadIDs, leadID];
      setSelectedLeadIDs(updated);
      if (updated.length === leadListData.length) setSelectAll(true);
    }
  };


  const handleTransferLeadBtnClick = () => {
    if (selectedLeadIDs.length > 0) {
      setTransferLeadIDs(selectedLeadIDs); // store current selection
      setShowTransferComplaintModal(true); // open modal
    }
  }

  const openVehicleDetails = (item) => {

    setModelRequestData((prevObj) => ({
      ...prevObj,
      Action: 'Update',
      leadKeyID: item.leadKeyID
    }));
    setShowVehicleLeadDetailsModal(true)
  }
  return (
    <div className="card">
      <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <h5 className="m-0">Lead</h5>
          <button onClick={() => LeadAddBtnClicked()} className="btn btn-primary btn-sm d-inline d-sm-none">
            <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
            <span className="d-inline d-sm-none"> Add</span>
          </button>
        </div>

        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          {/* Search Box */}
          <input
            type="text"
            className="form-control"
            placeholder="Search Lead"
            style={{ maxWidth: '350px' }}
            value={searchKeyword}
            onChange={handleSearch}
          />

          {/* Action Buttons */}
          <div className="d-flex gap-2 align-items-center">
            <Tooltip title="Add Lead">
              <button
                onClick={LeadAddBtnClicked}
                className="btn btn-primary btn-sm"
              >
                <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i>
                <span className="d-none d-sm-inline">Add Lead</span>
              </button>
            </Tooltip>

            <Tooltip title="Transfer Lead">
              {selectedLeadIDs?.length > 0 && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleTransferLeadBtnClick}
                >
                  <i className="fa-solid fa-right-left me-1" style={{ fontSize: '11px' }}></i>
                  <span className="d-none d-sm-inline">Transfer Lead</span>
                </button>
              )}
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
                  <th className="text-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-center">Sr No.</th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    Customer Name
                  </th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    Technician Name
                  </th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    Mobile No.
                  </th>

                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    State
                  </th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    District
                  </th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    Taluka
                  </th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    Village
                  </th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    Address
                  </th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    Description
                  </th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    Lead Type
                  </th>
                  <th className="text-center actionSticky" style={{ whiteSpace: 'nowrap' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {leadListData.map((item, idx) => (
                  <tr className='text-nowrap' key={item.idx}>
                    {/* <td style={{ whiteSpace: 'nowrap' }}>{item.id}</td> */}
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedLeadIDs.includes(item.leadID)}
                        onChange={() => handleCheckboxChange(item.leadID)}
                      />
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <Link onClick={() => openVehicleDetails(item)}>

                        {item.customerName}
                      </Link>
                    </td>
                    {item.employeeName === undefined || item.employeeName === null ? (
                      <Tooltip title="Assign Technician">
                        <td className="p-1 whitespace-nowrap">
                          <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => handleTechnicianBtnClicked(item)}>
                            Assign Technician
                          </span>
                        </td>
                      </Tooltip>
                    ) : (
                      <td>{item.employeeName}</td>
                    )}
                    <td style={{ whiteSpace: 'nowrap' }}>{item?.mobileNo}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{item?.stateName}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{item?.districtName}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{item?.talukaName}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{item?.villageName}</td>
                    {/* <td style={{ whiteSpace: 'nowrap' }}>{item?.address}</td> */}
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {item.address?.length > 25 ? (
                        <Tooltip title={item.address} arrow>
                          <span className="cursor-pointer">{item.address.substring(0, 25)}...</span>
                        </Tooltip>
                      ) : (
                        item.address
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {item.detailedDescription?.length > 25 ? (
                        <Tooltip title={item.detailedDescription} arrow>
                          <span className="cursor-pointer">{item.detailedDescription.substring(0, 25)}...</span>
                        </Tooltip>
                      ) : (
                        item.detailedDescription
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{item?.leadTypeName}</td>
                    <td className="text-center actionColSticky" style={{ zIndex: 4 }}>
                      <div className="d-flex gap-2">
                        <Tooltip title="Update Lead">
                          <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => EditBtnLead(item)}>
                            <i class="fas fa-edit"></i>
                          </Button>
                        </Tooltip>
                        {/* <Tooltip title="View Followup">
                          <Button
                            style={{
                              fontSize: '12px',
                              marginRight: '5px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            className="btn-sm d-flex"
                            onClick={() => amcFollowUp(item)}
                          >
                            <i class="fa-solid fa-user"></i>
                          </Button>
                        </Tooltip> */}
                        <Tooltip title="View Lead Transfer Logs">
                          <Button
                            style={{
                              fontSize: '12px',
                              marginRight: '5px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            className="btn-sm d-flex"
                            onClick={() => leadTransferLogsView(item)}
                          >
                            <i className="fa-solid fa-eye"></i>

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
            <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handleLeadPageChange} />
          )}
        </div>
      </div>
      {showLeadModal &&
        <AddUpdateLeadModal
          show={showLeadModal}
          handleClose={() => setShowLeadModal(false)}
          modelRequestData={modelRequestData}
          isAddUpdateActionDone={isAddUpdateActionDone}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        />
      }
      {showTransferComplaintModal &&
        <TransferLeadModal
          show={showTransferComplaintModal}
          handleClose={() => setShowTransferComplaintModal(false)}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
          selectedLeadIDs={transferLeadIDs} // pass selected leads here
        />
      }
      {showLeadTransferViewModal &&
        <TransferLeadLogsViewModal
          show={showLeadTransferViewModal}
          onHide={() => setShowLeadTransferViewModal(false)}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
          modelRequestData={modelRequestData}
        />
      }
      {showVehicleLeadDetailsModal &&
        <VehicleDetailsModal
          show={showVehicleLeadDetailsModal}
          modelRequestData={modelRequestData}
          onHide={() => setShowVehicleLeadDetailsModal(false)}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        />
      }
      {showTechnicianModal &&
        <AddUpdateTechnicianLeadModal
          show={showTechnicianModal}
          modelRequestData={modelRequestData}
          handleClose={() => closeAllModal()}
          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        />
      }
    </div>
  );
};

export default LeadList;
