





import { Tooltip } from '@mui/material'
import NoResultFoundModel from 'component/NoResultFoundModal'
import PaginationComponent from 'component/Pagination'
import { React, useCallback, useContext, useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Android12Switch from 'component/Android12Switch'
import DatePicker from 'react-date-picker'
import 'react-calendar/dist/Calendar.css';
import Select from 'react-select';
import { set } from 'date-fns'

import dayjs from 'dayjs'
import { ConfigContext } from 'context/ConfigContext'
import { debounce } from 'Middleware/Utils'
import SuccessPopupModal from 'component/SuccessPopupModal'
import { ChangeStatusMassage } from 'component/GlobalMassage'
import ImagePreviewModal from 'Image Preview Modal/ImagePreviewModal'
import StatusChangeModal from 'component/StatusChangeModal'
import WareHouseAddUpdateModal from './WareHouseAddUpdateModal'
import { ChangeWareHouseStatus, GetWareHouseList } from 'services/Warehouse/WareHouseApi'

const WareHouseList = () => {
      const [modelAction, setModelAction] = useState();
      const { setLoader } = useContext(ConfigContext);
      const [showModal, setShowModal] = useState(false);
      const [stateChangeStatus, setStateChangeStatus] = useState('');
      const [selectedImage, setSelectedImage] = useState(null);
      const [toDate, setToDate] = useState(null);
      const [fromDate, setFromDate] = useState(null);

      const [currentPage, setCurrentPage] = useState(1);
      const [searchKeyword, setSearchKeyword] = useState(null);
      const [totalCount, setTotalCount] = useState(null);
      const [totalPages, setTotalPages] = useState(1);
      const [totalRecords, setTotalRecords] = useState(-1);
      const [pageSize, setPageSize] = useState(30);
      const [sortingType, setSortingType] = useState(null)
      const [sortValueName, setSortValueName] = useState(null)
      const [modalTitle, setModalTitle] = useState(false)
      const [ShopList, setShopList] = useState([]);
      const [modelRequestData, setModelRequestData] = useState({ Action: null, shopID: null })
      const [showAddUpdateModal, setShowAddUpdateModal] = useState(false)
      const [isAddUpdateDone, setIsAddUpdateDone] = useState(false)
      const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
      const [showDetailsModal, setShowDetailsModal] = useState(false)
      const [showSuccessModal, setShowSuccessModal] = useState(false)

      useEffect(() => {
            GetWareHouseListData(1, null)
      }, [])

      useEffect(() => {
            if (isAddUpdateDone) {
                  GetWareHouseListData(currentPage, null)
                  setIsAddUpdateDone(false)
            }

      }, [isAddUpdateDone])

      const GetWareHouseListData = async (pageNumber, searchKeywordValue) => {
            setLoader(true);
            try {
                  const response = await GetWareHouseList({
                        // const response = await GetShopList({
                        pageSize: pageSize,
                        pageNo: pageNumber - 1,
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
                              console.error(response?.data?.errorMessage);
                              setLoader(false);
                        }
                  }
            } catch (error) {
                  setLoader(false);
                  console.log(error);
            }
      }
      const AddShopBtnClicked = () => {
            setModelRequestData((prev) => ({ ...prev, Action: null, shopID: null }))
            setShowAddUpdateModal(true)
      }
      const updateBtnClickPujaCat = (value) => {
            setModelRequestData((prev) => ({
                  ...prev, Action: 'Update',
                  warehouseKeyID: value?.warehouseKeyID
            }))
            setShowAddUpdateModal(true)
      }



      const handleStatusChange = (item) => {
            setStateChangeStatus(item); // You can set only relevant data if needed
            setShowStatusChangeModal(true);
      };

      const confirmStatusChange = async (item, user) => {
            try {
                  const { warehouseKeyID } = item; // Destructure to access only what's needed
                  const response = await ChangeWareHouseStatus(warehouseKeyID);

                  if (response && response.data.statusCode === 200) {
                        setShowStatusChangeModal(false);
                        setStateChangeStatus(null);
                        GetWareHouseListData(currentPage, null)
                        // GetMasterStateListData(currentPage, null, toDate, fromDate);
                        setShowSuccessModal(true);
                        setModelAction('State status changed successfully.');
                  } else {
                        console.error(response?.data?.errorMessage);
                        setShowSuccessModal(true);
                        setModelAction('Failed to change employee status.');
                  }
            } catch (error) {
                  console.error('Error changing employee status:', error);
                  setShowSuccessModal(true);
                  setModelAction('An error occurred while changing the employee status.');
            }
      };

      const fetchSearchResults = (searchValue) => {
            GetWareHouseListData(1, searchValue);
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
            GetWareHouseListData(pageNumber, null);
      };


      const handleImageClick = (imgUrl, deityName) => {
            debugger
            setModalTitle(deityName); // set the modal title dynamically
            setSelectedImage(imgUrl);
            setShowModal(true);
      };

      return (
            <>
                  <div className="card">
                        <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                    <h5 className="m-0">Warehouse</h5>

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
                                    <div className="d-flex gap-2 align-items-center">
                                          <Tooltip title="Add Warehouse">
                                                <button
                                                      onClick={() => AddShopBtnClicked()}
                                                      className="btn btn-primary btn-sm"
                                                      style={{ cursor: 'pointer' }}
                                                >
                                                      {/* <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i> */}
                                                      <span className="d-none d-sm-inline">Add Warehouse</span>
                                                </button>
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

                                                            <th className="text-center">Sr No.</th>
                                                            <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                                  Warehouse Name
                                                            </th>
                                                            <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                                  Warehouse Address
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
                                                      {ShopList?.map((item, idx) => (
                                                            <tr className='text-nowrap text-center' key={item.idx}>

                                                                  <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                                                        {(currentPage - 1) * pageSize + idx + 1}
                                                                  </td>
                                                                  <td style={{ whiteSpace: 'nowrap' }} >
                                                                        {item.warehouseName}

                                                                  </td>
                                                                  <td style={{ whiteSpace: 'nowrap' }} >
                                                                        {item.address}

                                                                  </td>




                                                                  <td className="text-center text-nowrap" onClick={() => ChangeStatusData(item)}>
                                                                        <Tooltip title={item.status === true ? 'Enable' : 'Disable'}>
                                                                              {item.status === true ? 'Enable' : 'Disable'}
                                                                              <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(item)} checked={item.status === true} />
                                                                        </Tooltip>
                                                                  </td>

                                                                  <td className="text-center " style={{ zIndex: 4 }}>
                                                                        <div className="d-flex gap-2">
                                                                              <Tooltip title="Update Warehouse">
                                                                                    <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => updateBtnClickPujaCat(item)}>
                                                                                          <i class="fas fa-edit"></i>
                                                                                    </Button>
                                                                              </Tooltip>
                                                                              {/* <Tooltip title="View Details">
                                                                                    <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => DetailsBtnClicked(item)}>
                                                                                          <i class="fas fa-eye"></i>
                                                                                    </Button>
                                                                              </Tooltip> */}
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
                  {showAddUpdateModal &&

                        <WareHouseAddUpdateModal show={showAddUpdateModal} onHide={(() => setShowAddUpdateModal(false))} modelRequestData={modelRequestData} setIsAddUpdateDone={setIsAddUpdateDone} />
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
                  <SuccessPopupModal show={showSuccessModal} onHide={(() => setShowSuccessModal(false))} successMassage={ChangeStatusMassage} />
            </>
      )
}

export default WareHouseList
