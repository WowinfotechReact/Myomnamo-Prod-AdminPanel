import { Tooltip } from '@mui/material'
import Android12Switch from 'component/Android12Switch'
import { ChangeStatusMassage } from 'component/GlobalMassage'
import NoResultFoundModel from 'component/NoResultFoundModal'
import PaginationComponent from 'component/Pagination'
import SuccessPopupModal from 'component/SuccessPopupModal'
import { ConfigContext } from 'context/ConfigContext'
import './templePuja.css'

import dayjs from 'dayjs'
import { debounce } from 'Middleware/Utils'

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Table, Collapse, Card } from 'react-bootstrap'
import TemplePujaAddUpdateModal from './TemplePujaAddUpdateModal'
import { ChangeTemplePujaStatus, GetTemplePujaList } from 'services/Temple Puja/TemplePujaApi'
import StatusChangeModal from 'component/StatusChangeModal'
import { ChangeTemplePujaCategoryStatus } from 'services/Temples Puja Category/TemplesPujaCategoryApi'
const TemplePujaList = () => {
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

      const [modelRequestData, setModelRequestData] = useState({ Action: null, vendorID: null })
      const [showAddTempleModal, setShowAddTempleModal] = useState(false)
      const [showVendorDetailsModal, setShowVendorDetailsModal] = useState(false)
      const [isAddUpdateDone, setIsAddUpdateDone] = useState(false)
      const [showSuccessModal, setShowSuccessModal] = useState(false)
      const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
      const [templeList, setTempleList] = useState([])
      const [toDate, setToDate] = useState(null);
      const [fromDate, setFromDate] = useState(null);

      useEffect(() => {
            GetTemplePujaListData(1, null)
      }, [])


      const [expandedRow, setExpandedRow] = useState(null);

      const toggleRow = (id) => {
            setExpandedRow(expandedRow === id ? null : id);
      };

      useEffect(() => {
            if (isAddUpdateDone) {
                  GetTemplePujaListData(currentPage, null)

            }
            setIsAddUpdateDone(false)
      }, [isAddUpdateDone])

      // ------------API Callings--------------------
      const GetTemplePujaListData = async (pageNumber, searchKeywordValue) => {
            setLoader(true);
            try {
                  const response = await GetTemplePujaList({
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
            setModelRequestData((prev) => ({ ...prev, Action: null, templeID: null }))
            setShowAddTempleModal(true)
      }

      const updateBtnClicked = (item) => {
            console.log(item.templePujaID, 'dsibusa');

            setModelRequestData((prev) => ({
                  ...prev, Action: 'Update',
                  templePujaID: item?.templePujaID
            }))
            setShowAddTempleModal(true)
      }

      const fetchSearchResults = (searchValue) => {
            GetTemplePujaListData(currentPage, searchValue);
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




      // Categorize the data for better organization
      const categorizeData = (item) => {
            return {
                  basicInfo: {
                        templeName: item.templeName,
                        pujaName: item.pujaName,
                        pujaFor: item.pujaFor,
                        pujaType: item.pujaType,
                        upcomingPujaDate: item.upcomingPujaDate,
                        isTrendingPuja: item.isTrendingPuja
                  },
                  categoryInfo: {
                        tempPujaCatName: item.tempPujaCatName,
                        tempPujaSubCatName: item.tempPujaSubCatName
                  },
                  locationInfo: {
                        stateName: item.stateName,
                        districtName: item.districtName,
                        talukaName: item.talukaName
                  },
                  pricingInfo: {
                        onlinePrice: item.onlinePrice,
                        offlinePrice: item.offlinePrice,
                        convenienceFee: item.convenienceFee,
                        wetSamagriPrice: item.wetSamagriPrice,
                        drySamagriPrice: item.drySamagriPrice,
                        discount: item.discount
                  },
                  contentInfo: {
                        aboutPuja: item.aboutPuja,
                        benefitsofPuja: item.benefitsofPuja,
                        aboutTemple: item.aboutTemple,
                        samagri: item.samagri
                  },
                  seoInfo: {
                        slug: item.slug,
                        metaTitle: item.metaTitle,
                        metaDescription: item.metaDescription,
                        openGraphTag: item.openGraphTag
                  }
            };
      };




      const toggleRowExpansion = (id) => {
            setExpandedRow(prev => (prev === id ? null : id)); // only single expand
      };




      const handleStatusChange = (item) => {

            setStateChangeStatus(item); // You can set only relevant data if needed
            setShowStatusChangeModal(true);
      };

      const confirmStatusChange = async (item) => {
            try {
                  const { templePujaID } = item; // Destructure to access only what's needed
                  const response = await ChangeTemplePujaStatus(templePujaID);

                  if (response && response.data.statusCode === 200) {
                        setShowStatusChangeModal(false);
                        setStateChangeStatus(null);
                        GetTemplePujaListData(currentPage, null);
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
                                    <h5 className="m-0">Temple Puja</h5>
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
                                          <Tooltip title="Add Temple Puja">
                                                <button
                                                      onClick={() => AddBtnClicked()}
                                                      className="btn btn-primary btn-sm"
                                                      style={{ cursor: 'pointer' }}
                                                >
                                                      <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i>
                                                      <span className="d-none d-sm-inline">Add Temple</span>
                                                </button>
                                          </Tooltip>
                                    </div>
                              </div>
                              <div>
                                    <div className="table-responsive" style={{ maxHeight: '65vh' }}>
                                          <Table striped bordered hover className="custom-temple-table">
                                                <thead className="table-light">
                                                      <tr
                                                            style={{
                                                                  position: "sticky",
                                                                  top: -1,
                                                                  backgroundColor: "#fff",
                                                                  zIndex: 10,
                                                                  boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                                                            }}
                                                      >
                                                            <th className="text-center" style={{ width: "40px" }}></th>
                                                            <th className="text-center" style={{ width: "50px" }}>Sr No.</th>
                                                            <th className="text-center">Temple Name</th>
                                                            <th className="text-center">Puja Name</th>
                                                            <th className="text-center">Puja For</th>
                                                            <th className="text-center">Category</th>
                                                            <th className="text-center">Location</th>
                                                            <th className="text-center">Pricing</th>
                                                            <th className="text-center actionSticky">Status</th>
                                                            <th className="text-center actionSticky">Action</th>
                                                      </tr>
                                                </thead>

                                                <tbody>
                                                      {templeList?.map((item, idx) => {
                                                            const categorizedData = categorizeData(item);
                                                            const isExpanded = expandedRow === item.id;

                                                            return (
                                                                  <React.Fragment key={item.id || idx}>
                                                                        <tr>
                                                                              <td className="text-center">
                                                                                    <Button
                                                                                          variant="link"
                                                                                          size="sm"
                                                                                          onClick={() => toggleRowExpansion(item.id)}
                                                                                          className="p-0"
                                                                                    >
                                                                                          <i
                                                                                                className={`fas ${isExpanded ? "fa-chevron-down" : "fa-chevron-right"
                                                                                                      }`}
                                                                                          ></i>
                                                                                    </Button>
                                                                              </td>
                                                                              <td className="text-center">
                                                                                    {(currentPage - 1) * pageSize + idx + 1}
                                                                              </td>
                                                                              <td>{categorizedData.basicInfo.templeName}</td>
                                                                              <td>{categorizedData.basicInfo.pujaName}</td>
                                                                              <td>{categorizedData.basicInfo.pujaFor}</td>
                                                                              <td>
                                                                                    <div>{categorizedData.categoryInfo.tempPujaCatName}</div>
                                                                                    <div className="small text-muted">
                                                                                          {categorizedData.categoryInfo.tempPujaSubCatName}
                                                                                    </div>
                                                                              </td>
                                                                              <td>
                                                                                    <div>{categorizedData.locationInfo.stateName}</div>
                                                                                    <div className="small text-muted">
                                                                                          {categorizedData.locationInfo.districtName},{" "}
                                                                                          {categorizedData.locationInfo.talukaName}
                                                                                    </div>
                                                                              </td>
                                                                              <td>
                                                                                    <div className="d-flex flex-column small">
                                                                                          <span>Online: ₹{categorizedData.pricingInfo.onlinePrice}</span>
                                                                                          <span>Offline: ₹{categorizedData.pricingInfo.offlinePrice}</span>
                                                                                    </div>
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
                                                                              <td className="text-center">
                                                                                    <Tooltip title="Update Temple Puja">
                                                                                          <Button
                                                                                                size="sm"
                                                                                                onClick={() => updateBtnClicked(item)}
                                                                                                variant="outline-primary"
                                                                                          >
                                                                                                <i className="fas fa-edit"></i>
                                                                                          </Button>
                                                                                    </Tooltip>
                                                                              </td>
                                                                        </tr>

                                                                        <tr>
                                                                              <td colSpan="10" className="p-0 border-0">
                                                                                    <Collapse in={isExpanded}>
                                                                                          <div>
                                                                                                <Card className="expand-card m-3 w-100 shadow-sm rounded-3">
                                                                                                      <Card.Body className="p-3 bg-light">
                                                                                                            <div className="row g-3">
                                                                                                                  {/* Basic Info */}
                                                                                                                  <div className="col-md-6">
                                                                                                                        <h6 className="text-primary mb-2">Basic Information</h6>
                                                                                                                        <div className="row small gy-1">
                                                                                                                              <div className="col-6">
                                                                                                                                    <strong>Puja Type:</strong>{" "}
                                                                                                                                    <span className="badge bg-info expand-badge">
                                                                                                                                          {categorizedData.basicInfo.pujaType}
                                                                                                                                    </span>
                                                                                                                              </div>
                                                                                                                              <div className="col-6">
                                                                                                                                    <strong>Upcoming Date:</strong>{" "}
                                                                                                                                    <span className="badge bg-warning text-dark expand-badge">
                                                                                                                                          {categorizedData.basicInfo.upcomingPujaDate}
                                                                                                                                    </span>
                                                                                                                              </div>
                                                                                                                              <div className="col-6">
                                                                                                                                    <strong>Trending:</strong>{" "}
                                                                                                                                    <span
                                                                                                                                          className={`badge expand-badge ${categorizedData.basicInfo.isTrendingPuja
                                                                                                                                                ? "bg-success"
                                                                                                                                                : "bg-secondary"
                                                                                                                                                }`}
                                                                                                                                    >
                                                                                                                                          {categorizedData.basicInfo.isTrendingPuja ? "Yes" : "No"}
                                                                                                                                    </span>
                                                                                                                              </div>
                                                                                                                        </div>
                                                                                                                  </div>

                                                                                                                  {/* Pricing Info */}
                                                                                                                  <div className="col-md-6">
                                                                                                                        <h6 className="text-primary mb-2">Pricing Details</h6>
                                                                                                                        <div className="row small gy-1">
                                                                                                                              <div className="col-6">
                                                                                                                                    <strong>Convenience Fee:</strong>{" "}
                                                                                                                                    <span className="badge bg-light text-dark expand-badge">
                                                                                                                                          ₹{categorizedData.pricingInfo.convenienceFee}
                                                                                                                                    </span>
                                                                                                                              </div>
                                                                                                                              <div className="col-6">
                                                                                                                                    <strong>Wet Samagri:</strong>{" "}
                                                                                                                                    <span className="badge bg-light text-dark expand-badge">
                                                                                                                                          ₹{categorizedData.pricingInfo.wetSamagriPrice}
                                                                                                                                    </span>
                                                                                                                              </div>
                                                                                                                              <div className="col-6">
                                                                                                                                    <strong>Dry Samagri:</strong>{" "}
                                                                                                                                    <span className="badge bg-light text-dark expand-badge">
                                                                                                                                          ₹{categorizedData.pricingInfo.drySamagriPrice}
                                                                                                                                    </span>
                                                                                                                              </div>
                                                                                                                              <div className="col-6">
                                                                                                                                    <strong>Discount:</strong>{" "}
                                                                                                                                    <span className="badge bg-danger expand-badge">
                                                                                                                                          {categorizedData.pricingInfo.discount}%
                                                                                                                                    </span>
                                                                                                                              </div>
                                                                                                                        </div>
                                                                                                                  </div>

                                                                                                                  {/* Content Info */}
                                                                                                                  <div className="col-md-6">
                                                                                                                        <h6 className="text-primary mb-2">Content Information</h6>
                                                                                                                        <ul className="small list-unstyled mb-0">
                                                                                                                              <li>
                                                                                                                                    <strong>About Puja:</strong>{" "}
                                                                                                                                    <div
                                                                                                                                          dangerouslySetInnerHTML={{
                                                                                                                                                __html: categorizedData.contentInfo.aboutPuja?.substring(0, 300)
                                                                                                                                          }}
                                                                                                                                    />

                                                                                                                              </li>
                                                                                                                              <li className="mt-1">
                                                                                                                                    <strong>Benefits:</strong>{" "}
                                                                                                                                    <div
                                                                                                                                          dangerouslySetInnerHTML={{
                                                                                                                                                __html: categorizedData.contentInfo.benefitsofPuja?.substring(0, 300)
                                                                                                                                          }}
                                                                                                                                    />
                                                                                                                              </li>
                                                                                                                              <li className="mt-1">
                                                                                                                                    <strong>About Temple:</strong>{" "}
                                                                                                                                    <div
                                                                                                                                          dangerouslySetInnerHTML={{
                                                                                                                                                __html: categorizedData.contentInfo.aboutTemple?.substring(0, 300)
                                                                                                                                          }}
                                                                                                                                    />                                                                                                                              </li>
                                                                                                                        </ul>
                                                                                                                  </div>

                                                                                                                  {/* SEO Info */}
                                                                                                                  <div className="col-md-6">
                                                                                                                        <h6 className="text-primary mb-2">SEO Information</h6>
                                                                                                                        <ul className="small list-unstyled mb-0">
                                                                                                                              <li>
                                                                                                                                    <strong>Slug:</strong>{" "}
                                                                                                                                    <span className="badge bg-dark expand-badge">
                                                                                                                                          {categorizedData.seoInfo.slug}
                                                                                                                                    </span>
                                                                                                                              </li>
                                                                                                                              <li className="mt-1">
                                                                                                                                    <strong>Meta Title:</strong>{" "}
                                                                                                                                    {categorizedData.seoInfo.metaTitle}
                                                                                                                              </li>
                                                                                                                              <li className="mt-1">
                                                                                                                                    <strong>Meta Description:</strong>{" "}
                                                                                                                                    {categorizedData.seoInfo.metaDescription?.substring(0, 100)}...
                                                                                                                              </li>
                                                                                                                        </ul>
                                                                                                                  </div>

                                                                                                                  {/* Samagri Info */}
                                                                                                                  {categorizedData.contentInfo.samagri && (
                                                                                                                        <div className="col-12">
                                                                                                                              <h6 className="text-primary mb-2">Samagri Details</h6>
                                                                                                                              <div
                                                                                                                                    className="small"
                                                                                                                                    dangerouslySetInnerHTML={{
                                                                                                                                          __html: categorizedData.contentInfo.samagri?.substring(0, 500)
                                                                                                                                    }}
                                                                                                                              />
                                                                                                                        </div>
                                                                                                                  )}
                                                                                                            </div>
                                                                                                      </Card.Body>
                                                                                                </Card>
                                                                                          </div>
                                                                                    </Collapse>
                                                                              </td>
                                                                        </tr>

                                                                  </React.Fragment>
                                                            );
                                                      })}
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
                  {showAddTempleModal &&
                        <TemplePujaAddUpdateModal show={showAddTempleModal} onHide={() => setShowAddTempleModal(false)} modelRequestData={modelRequestData} setIsAddUpdateDone={setIsAddUpdateDone} />
                  }
                  <StatusChangeModal
                        open={showStatusChangeModal}
                        onClose={() => setShowStatusChangeModal(false)}
                        onConfirm={() => confirmStatusChange(stateChangeStatus)} // Pass the required arguments
                  />
                  <SuccessPopupModal show={showSuccessModal} onHide={(() => onSuccessClose())} successMassage={ChangeStatusMassage} />
            </>
      )
}

export default TemplePujaList
