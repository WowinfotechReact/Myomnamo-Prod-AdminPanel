import { Tooltip } from '@mui/material';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import React, { useState, useEffect, useContext } from 'react';
import { Button, Table } from 'react-bootstrap';
import AddUpdateFestivalServiceModal from './AddUpdateFestivalServiceModal';
import { GetPujaList } from 'services/Admin/Puja/PujaApi';
import { ChangeFestivalPackageStatus, GetFestivalPackageList } from 'services/Admin/FestivalIdolServices/FestivalIdolServicesApi';
import { NULL } from 'sass';
import { ConfigContext } from 'context/ConfigContext';
import Android12Switch from 'component/Android12Switch';
import StatusChangeModal from 'component/StatusChangeModal';
import { ChangeStatusMassage } from 'component/GlobalMassage';
import SuccessPopupModal from 'component/SuccessPopupModal';

export default function FestivalIdolServicesPage() {
  const { setLoader, user } = useContext(ConfigContext);

  const [serviceIdolList, setServiceIdolList] = useState([]);
  const pageHeading = "Festival Idol Services";
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(1);

  const [isAddUpdateDone, setIsAddUpdateDone] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [modelRequestData, setModelRequestData] = useState({ Action: null,moduleName:"List" });
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);


  useEffect(() => {
    GetFestivalPackageListData(1, null,)
  }, []);

  useEffect(() => {
    if (isAddUpdateDone) {
      GetFestivalPackageListData(1, null,)
      setIsAddUpdateDone(false)
    }
  }, [isAddUpdateDone]);



  // ------------API Callings--------------------
  const GetFestivalPackageListData = async (pageNumber, searchKeywordValue) => {
    setLoader(true);
    try {
      const response = await GetFestivalPackageList({
        adminID: user?.adminID,
        pageSize: pageSize,
        pageNo: pageNumber - 1,
        sortingDirection: null,
        sortingColumnName: null,
        searchKeyword: searchKeywordValue,
        fromDate: null,
        toDate: null,
        fiB_ServiceKeyID: null


      });

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const List = response.data.responseData.data;
            const totalCount = response.data.totalCount;

            setTotalCount(totalCount);
            setTotalPages(Math.ceil(totalCount / pageSize));
            setServiceIdolList(List);
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
      const response = await ChangeFestivalPackageStatus(value?.fiB_ServiceKeyID);

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


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setNewsletterList([]);
    GetNewsLetterListData();
  };

  const AddBtnClicked = () => {
     setModelRequestData((prev)=>({...prev,Action: null,fiB_ServiceKeyID:null}))
    setShowAddUpdateModal(true);
  }
  const UpdateBtnClicked = (value) => {
    setModelRequestData((prev)=>({...prev,Action: "Update",fiB_ServiceKeyID:value?.fiB_ServiceKeyID}))

    setShowAddUpdateModal(true);
  }

  const handleStatusChange = (item) => {
    setModelRequestData((prev) => ({ ...prev, changeStatusData: item })); // You can set only relevant data if needed
    setShowStatusChangeModal(true);
  };

  const onSuccessClose = () => {
    setShowSuccessModal(false)
    setIsAddUpdateDone(true)
  }

  
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
            //    onChange={handleSearchChange}
            />

            {/* Action Buttons */}
            <div className="d-flex gap-2 align-items-center">
              <Tooltip title="Add Service">
                <button onClick={AddBtnClicked} className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
                  <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i>
                  <span className="d-none d-sm-inline">Add Service</span>
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
                    <th className="text-center">Sr No.</th>

                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Service Name
                    </th>
                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Service Price
                    </th>
                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Registration Date
                    </th>
                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Status
                    </th>

                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {serviceIdolList?.map((item, idx) => (
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
                        {item?.serviceName ? (
                          item.serviceName.length > 25 ? (
                            <Tooltip title={item.serviceName}>{item.serviceName.substring(0, 25) + '...'}</Tooltip>
                          ) : (
                            item.serviceName
                          )
                        ) : (
                          '-'
                        )}
                      </td>

                      {/* <td style={{ whiteSpace: 'nowrap' }}>{item.userName === null ? '-' : item?.userName}</td> */}

                      <td style={{ whiteSpace: 'nowrap' }}>
                        {item?.price ? (
                          item.price
                        ) : (
                          '-'
                        )}
                      </td>



                      <td style={{ whiteSpace: 'nowrap' }}>{item.createdOnDate}</td>
                      <td className="text-center text-nowrap" onClick={() => handleStatusChange(item)}>
                        <Tooltip title={item.status === true ? 'Enable' : 'Disable'}>
                          {item.status === true ? 'Enable' : 'Disable'}
                          <Android12Switch style={{ padding: '8px' }} checked={item.status === true} />
                        </Tooltip>
                      </td>
                      <td className="text-center actionColSticky" style={{ zIndex: 4 }}>
                        <div className="d-flex justify-content-center gap-2">
                          <Tooltip title={`Update ${pageHeading}`}>
                            <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => UpdateBtnClicked(item)}>
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
      <StatusChangeModal
        open={showStatusChangeModal}
        onClose={() => setShowStatusChangeModal(false)}
        onConfirm={() => ChangeStatusData(modelRequestData?.changeStatusData)} // Pass the required arguments
      />
      <SuccessPopupModal show={showSuccessModal} onHide={(() => onSuccessClose())} successMassage={ChangeStatusMassage} />
      <AddUpdateFestivalServiceModal show={showAddUpdateModal} onHide={() => setShowAddUpdateModal(false)} modelRequestData={modelRequestData} />
    </>
  );
}