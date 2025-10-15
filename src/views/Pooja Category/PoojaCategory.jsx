



import { Tooltip } from '@mui/material'
import NoResultFoundModel from 'component/NoResultFoundModal'
import PaginationComponent from 'component/Pagination'
import { React, useCallback, useContext, useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
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
import PoojaCategoryAddUpdateModal from './PoojaCategoryAddUpdateModal'
import { ChangeShopStatus } from 'services/Shop/ShopApi'
import { ChangePujaCategoryStatus, GetPujaCategoryList } from 'services/Pooja Category/PoojaCategoryApi'
import ImagePreviewModal from 'Image Preview Modal/ImagePreviewModal'
import StatusChangeModal from 'component/StatusChangeModal'
import ErrorModal from 'component/ErrorModal'

const PoojaCategoryList = () => {
      const navigate = useNavigate()
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
      const [pujaCategoryList, setPujaCategoryList] = useState([]);
      const [modelRequestData, setModelRequestData] = useState({ Action: null, shopID: null })
      const [showAddUpdateModal, setShowAddUpdateModal] = useState(false)
      const [isAddUpdateDone, setIsAddUpdateDone] = useState(false)
      const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
      const [showDetailsModal, setShowDetailsModal] = useState(false)
      const [showSuccessModal, setShowSuccessModal] = useState(false)
      const [showErrorModal, setShowErrorModal] = useState(false)

      useEffect(() => {
            GetPoojaListData(1, null)
      }, [])

      useEffect(() => {

            if (isAddUpdateDone) {
                  GetPoojaListData(currentPage, null)
                  setIsAddUpdateDone(false)
            }

      }, [isAddUpdateDone])

      const GetPoojaListData = async (pageNumber, searchKeywordValue) => {
            setLoader(true);
            try {
                  const response = await GetPujaCategoryList({
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
                                    setPujaCategoryList(List);
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
            setModelRequestData((prev) => ({ ...prev, Action: null, pujaCatKeyID: null, pujaCatByLangKeyID: null, moduleName: "CategoryList" }))
            setShowAddUpdateModal(true)
      }
      const updateBtnClickPujaCat = (value) => {

            setModelRequestData((prev) => ({
                  ...prev, Action: 'Update',
                  pujaCatKeyID: value?.pujaCatKeyID,
                  moduleName: "CategoryList"
            }))
            setShowAddUpdateModal(true)
      }

      const handleStatusChange = (item) => {
            setStateChangeStatus(item); // You can set only relevant data if needed
            setShowStatusChangeModal(true);
      };

      const confirmStatusChange = async (item, user) => {

            try {
                  const { pujaCatKeyID } = item; // Destructure to access only what's needed
                  const response = await ChangePujaCategoryStatus(pujaCatKeyID);

                  if (response?.data?.statusCode === 200) {
                        setShowStatusChangeModal(false);
                        setStateChangeStatus(null);
                        setIsAddUpdateDone(true)

                        setShowSuccessModal(true);
                        setModelAction('Puja Category status changed successfully.');
                        setShowStatusChangeModal(false)
                  } else {
                        console.error(response?.response?.data?.errorMessage);
                        setShowErrorModal(true);
                        setShowStatusChangeModal(false)
                        setModelAction(response?.response?.data?.errorMessage);
                  }
            } catch (error) {
                  console.error(response?.data?.errorMessage);
                  setShowErrorModal(true);
                  setShowStatusChangeModal(false)
                  setModelAction('An error occurred while changing the employee status.');
            }
      };

      const fetchSearchResults = (searchValue) => {
            GetPoojaListData(1, searchValue);
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
            GetPoojaListData(pageNumber, null);
      };


      const handleImageClick = (imgUrl, deityName) => {

            setModalTitle(deityName); // set the modal title dynamically
            setSelectedImage(imgUrl);
            setShowModal(true);
      };
      const HandleCloseAll = () => {
            setShowSuccessModal(false)
            setShowStatusChangeModal(false)
      }

      const AddLangBtnClicked = (value) => {

            navigate('/language-wise-puja-category', {
                  state: {
                        data: value
                  },
            })
      }
      return (
            <>
                  <div className="card">
                        <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                    <h5 className="m-0">Puja Category List</h5>
                                    <button className="btn btn-primary btn-sm d-inline d-sm-none">
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
                                          style={{ maxWidth: '200px' }}
                                          onChange={handleSearchChange}
                                    />

                                    {/* Action Buttons */}
                                    <div className="d-flex gap-2 align-items-center">
                                          <Tooltip title="Add Puja Category">
                                                <button
                                                      onClick={() => AddShopBtnClicked()}
                                                      className="btn btn-primary btn-sm"
                                                      style={{ cursor: 'pointer' }}
                                                >
                                                      {/* <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i> */}
                                                      <span className="d-none d-sm-inline">Add Puja Category</span>
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
                                                                  Puja Category Name
                                                            </th>

                                                            <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                                  Puja Service Name
                                                            </th>
                                                            <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                                  Puja Sub Service Name
                                                            </th>

                                                            <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                                  Puja Category Images
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
                                                      {pujaCategoryList?.map((item, idx) => (
                                                            <tr className='text-nowrap text-center' key={item.idx}>

                                                                  <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                                                        {(currentPage - 1) * pageSize + idx + 1}
                                                                  </td>
                                                                  <td style={{ whiteSpace: 'nowrap' }} >
                                                                        {item.pujaCategoryName === null ? '-' : item.pujaCategoryName}

                                                                  </td>
                                                                  <td style={{ whiteSpace: 'nowrap' }} >
                                                                        {item.pujaServiceName === null ? '-' : item.pujaSubServiceName}

                                                                  </td>
                                                                  <td style={{ whiteSpace: 'nowrap' }} >
                                                                        {item.pujaSubServiceName === null ? '-' : item.pujaSubServiceName}

                                                                  </td>


                                                                  <td style={{ whiteSpace: "nowrap", cursor: "pointer" }}>
                                                                        {item.imageUrl ? (
                                                                              <img
                                                                                    src={item.imageUrl}
                                                                                    alt={item.deityName}
                                                                                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" }}
                                                                                    onClick={() => handleImageClick(item.imageUrl, item.pujaCategoryName)}
                                                                              />
                                                                        ) : (
                                                                              "No Image"
                                                                        )}
                                                                  </td>


                                                                  <td className="text-center text-nowrap" onClick={() => ChangeStatusData(item)}>
                                                                        <Tooltip title={item.status === true ? 'Enable' : 'Disable'}>
                                                                              {item.status === true ? 'Enable' : 'Disable'}
                                                                              <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(item)} checked={item.status === true} />
                                                                        </Tooltip>
                                                                  </td>

                                                                  <td className="text-center actionColSticky" style={{ zIndex: 4 }}>
                                                                        <div className="d-flex gap-2">
                                                                              <Tooltip title="Update Puja Category">
                                                                                    <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => updateBtnClickPujaCat(item)}>
                                                                                          <i class="fas fa-edit"></i>
                                                                                    </Button>
                                                                              </Tooltip>
                                                                              <Tooltip title="Add Language">
                                                                                    <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => AddLangBtnClicked(item)}>
                                                                                          <i class="fas fa-language"></i>

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
                  {showAddUpdateModal &&

                        <PoojaCategoryAddUpdateModal show={showAddUpdateModal} onHide={(() => setShowAddUpdateModal(false))} modelRequestData={modelRequestData} setIsAddUpdateDone={setIsAddUpdateDone} />
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
                  <SuccessPopupModal show={showSuccessModal} onHide={(() => HandleCloseAll())} successMassage={ChangeStatusMassage} />
                  <ErrorModal show={showErrorModal} onHide={(() => setShowErrorModal(false))} Massage={modelAction} />
            </>
      )
}

export default PoojaCategoryList
