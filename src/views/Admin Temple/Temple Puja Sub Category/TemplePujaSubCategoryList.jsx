




import { Tooltip } from '@mui/material'
import Android12Switch from 'component/Android12Switch'
import { ChangeStatusMassage } from 'component/GlobalMassage'
import NoResultFoundModel from 'component/NoResultFoundModal'
import PaginationComponent from 'component/Pagination'
import SuccessPopupModal from 'component/SuccessPopupModal'
import { ConfigContext } from 'context/ConfigContext'
import dayjs from 'dayjs'
import { debounce } from 'Middleware/Utils'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import TemplePujaSubCategoryAddUpdateModal from './TemplePujaSubCategoryAddUpdateModal'
import { ChangeTemplePujaCategoryStatus, GetTemplePujaCategoryList } from 'services/Temples Puja Category/TemplesPujaCategoryApi'
import StatusChangeModal from 'component/StatusChangeModal'
import { ChangeTemplePujaSubCategoryStatus, GetTemplePujaSubCategoryList } from 'services/Temple Puja Sub Category/TemplesPujaSubCategoryApi'
const TemplePujaSubCategoryList = () => {
      const { setLoader } = useContext(ConfigContext);
      const [stateChangeStatus, setStateChangeStatus] = useState('');
      const [currentPage, setCurrentPage] = useState(1);
      const [searchKeyword, setSearchKeyword] = useState(null);
      const [totalCount, setTotalCount] = useState(null);
      const [totalPages, setTotalPages] = useState(1);
      const [totalRecords, setTotalRecords] = useState(-1);
      const [pageSize, setPageSize] = useState(20);
      const [sortingType, setSortingType] = useState(null)
      const [sortValueName, setSortValueName] = useState(null)
      const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
      const [modelRequestData, setModelRequestData] = useState({ Action: null, vendorID: null })
      const [showAddTempleModal, setShowAddTempleModal] = useState(false)
      const [isAddUpdateDone, setIsAddUpdateDone] = useState(false)
      const [showSuccessModal, setShowSuccessModal] = useState(false)

      const [templeList, setTempleList] = useState([])
      const [toDate, setToDate] = useState(null);
      const [fromDate, setFromDate] = useState(null);

      useEffect(() => {
            GetTemplePujaSubCategoryListData(1, null)
      }, [])

      useEffect(() => {
            if (isAddUpdateDone) {
                  GetTemplePujaSubCategoryListData(currentPage, null)
                  setIsAddUpdateDone(false)
            }
      }, [isAddUpdateDone])

      // ------------API Callings--------------------
      const GetTemplePujaSubCategoryListData = async (pageNumber, searchKeywordValue) => {
            setLoader(true);
            try {
                  const response = await GetTemplePujaSubCategoryList({
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
                                    setTempleList(List);
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



      // ----------Other Functions------------------
      const AddBtnClicked = () => {
            setModelRequestData((prev) => ({ ...prev, Action: null, tempPujaCatID: null }))
            setShowAddTempleModal(true)
      }

      const updateBtnClicked = (value) => {
            setModelRequestData((prev) => ({
                  ...prev, Action: 'Update',
                  tempPujaSubCatID: value?.tempPujaSubCatID
            }))
            setShowAddTempleModal(true)
      }

      const fetchSearchResults = (searchValue) => {
            GetTemplePujaSubCategoryListData(currentPage, searchValue);
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
            setVendorList([])
            GetVendorListData(pageNumber, null)
      }

      const onSuccessClose = () => {
            setShowSuccessModal(false)
            setIsAddUpdateDone(true)
      }


      const handleStatusChange = (item) => {
            setStateChangeStatus(item); // You can set only relevant data if needed
            setShowStatusChangeModal(true);
      };

      const confirmStatusChange = async (item) => {
            try {
                  const { tempPujaSubCatID } = item; // Destructure to access only what's needed
                  const response = await ChangeTemplePujaSubCategoryStatus(tempPujaSubCatID);

                  if (response && response.data.statusCode === 200) {
                        setShowStatusChangeModal(false);
                        setStateChangeStatus(null);
                        GetTemplePujaSubCategoryListData(currentPage, null);
                        setShowSuccessModal(true);
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
      return (
            <>
                  <div className="card">
                        <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                    <h5 className="m-0">Temples Puja Sub Category</h5>
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
                                    <div className="d-flex gap-2 align-items-center">
                                          <Tooltip title="Add Temples Puja Sub Category">
                                                <button
                                                      onClick={() => AddBtnClicked()}
                                                      className="btn btn-primary btn-sm"
                                                      style={{ cursor: 'pointer' }}
                                                >
                                                      <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i>
                                                      <span className="d-none d-sm-inline">Add Temples Puja Sub Category</span>
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
                                                                  Temple Puja Sub Category Name
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
                                                      {templeList?.map((item, idx) => (
                                                            <tr className='text-nowrap text-center' key={item.idx}>

                                                                  <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                                                        {(currentPage - 1) * pageSize + idx + 1}
                                                                  </td>
                                                                  <td style={{ whiteSpace: 'nowrap' }}>
                                                                        {item.tempPujaSubCatName}

                                                                  </td>



                                                                  <td className="text-center text-nowrap"
                                                                        onClick={() => ChangeStatusData(item)}
                                                                  >
                                                                        <Tooltip title={item.status === true ? 'Enable' : 'Disable'}>
                                                                              {item.status === true ? 'Enable' : 'Disable'}
                                                                              <Android12Switch
                                                                                    onClick={() => handleStatusChange(item)}
                                                                                    style={{ padding: '8px' }} checked={item.status === true} />
                                                                        </Tooltip>
                                                                  </td>

                                                                  <td className="text-center actionColSticky" style={{ zIndex: 4 }}>
                                                                        <div className="d-flex gap-2">
                                                                              <Tooltip title="Update Vendor">
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
                  <StatusChangeModal
                        open={showStatusChangeModal}
                        onClose={() => setShowStatusChangeModal(false)}
                        onConfirm={() => confirmStatusChange(stateChangeStatus)} // Pass the required arguments
                  />

                  {showAddTempleModal &&
                        <TemplePujaSubCategoryAddUpdateModal show={showAddTempleModal} onHide={() => setShowAddTempleModal(false)} modelRequestData={modelRequestData} setIsAddUpdateDone={setIsAddUpdateDone} />
                  }
                  <SuccessPopupModal show={showSuccessModal} onHide={(() => onSuccessClose())} successMassage={ChangeStatusMassage} />
            </>
      )
}

export default TemplePujaSubCategoryList



