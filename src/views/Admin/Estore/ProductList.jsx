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
import { ChangeStatus, GetProductListAPI } from 'services/Admin/EStoreAPI/ProductAPI';
import { ChangePujaStatus, GetPujaList } from 'services/Admin/Puja/PujaApi';
import { GetPujaBookingList } from 'services/Admin/PujaBookingAPI/PujaBookingAPI';
import AddUpdateProductModal from './AddUpdateProduct';
// import AddUpdatePujaModal from './AddUpdatePujaModal';

const ProductList = () => {
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
    moduleName: 'PujaList',
    productKeyID: null,
    appLangID: null
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVendorDetailsModal, setShowVendorDetailsModal] = useState(false);
  const [isAddUpdateDone, setIsAddUpdateDone] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAssignPanditSuccessModal, setShowAssignPanditSuccessModal] = useState(false);
  const [showAssignPanditModal, setShowAssignPanditModal] = useState(false);
  const [showBookingOrderDetailsModal, setShowBookingOrderDetailsModal] = useState(false);

  const [productList, setProductList] = useState([]);
  const [toDate, setToDate] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);
  // Example commit

  // ✅ Check if all rows are selected
  const selectableRows = productList.filter((item) => item.panditName === null);
  // const allSelected = productList?.length > 0 && selectedBookings.length === productList.length;
  const allSelected = selectableRows.length > 0 && selectableRows.every((item) => selectedBookings.includes(item.pujaBookingID));

  console.log('selectedBookings', selectedBookings);

  useEffect(() => {
    if (location?.pathname === '/estore-product') {
      setPageHeading('Product');
      GetProductListData();
    } else if (location?.pathname === '/prasad-master') {
      setPageHeading('Prasad');
      GetProductListData();
    }
  }, [location]);
  useEffect(() => {
    if (isAddUpdateDone) {
      setShowAssignPanditModal(false);
      setShowAssignPanditSuccessModal(true);
      setSelectedBookings([]);
      GetProductListData();
      setIsAddUpdateDone(false);
    }
  }, [isAddUpdateDone]);

  // ------------API Callings--------------------
  const GetProductListData = async (pageNo, searchValue) => {
    setLoader(true);
    try {
      const response = await GetProductListAPI(
        {
          // pageSize: pageSize,
          // pageNo: pageNumber - 1,
          // sortingDirection: sortingType ? sortingType : null,
          // sortingColumnName: sortValueName ? sortValueName : null,
          // searchKeyword: searchKeywordValue === undefined || searchKeywordValue === null ? searchKeyword : searchKeywordValue,
          // fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
          // toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
          // pujaServiceID: pujaServiceID,
          // pujaSubServiceID: pujaSubServiceID
          pageSize: pageSize,
          pageNo: pageNo - 1,
          sortingDirection: null,
          sortingColumnName: null,
          searchKeyword: searchValue ? searchValue : null,
          fromDate: null,
          toDate: null
        },
        location.pathname === '/estore-product' ? 'Product' : 'Prasad'
      );

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const List = response.data.responseData.data;
            const totalCount = response.data.totalCount;

            setTotalCount(totalCount);
            setTotalPages(Math.ceil(totalCount / pageSize));
            setProductList(List);
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
      const response = await ChangeStatus(value?.productKeyID, value?.appLangID);

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
  const AddBtnClicked = () => {
    setModelRequestData((prev) => ({
      ...prev,
      Action: null,
      moduleName: location.pathname === '/estore-product' ? 'ProductModal' : 'PrasadModal',
      keyID: null
    }));
    setShowAddModal(true);
  };

  const updateBtnClicked = (value) => {
    setModelRequestData((prev) => ({
      ...prev,
      Action: 'update',
      productKeyID: value?.productKeyID,
      appLangID: null
    }));
    setShowAddModal(true);
  };
  const fetchSearchResults = (searchValue) => {
    GetProductListData(currentPage, searchValue);
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
    setProductList([]);
    GetProductListData();
  };

  // // ✅ Toggle select all
  // const handleSelectAll = () => {
  //   if (allSelected) {
  //     setSelectedBookings([]);
  //   } else {
  //     setSelectedBookings(productList.map((item) => item.bookingID));
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
      vendorID: null,
      moduleName: 'PujaList',
      pujaBookingKeyID: value.pujaBookingKeyID
    }));
    setShowBookingOrderDetailsModal(true);
  };
  console.log('data', modelRequestData);

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

  const AddLangBtnClicked = (value) => {
    if (location.pathname === '/prasad-master') {
      navigate('/prasad-language-wise', {
        state: {
          data: value
        }
      });
    } else {
      navigate('/product-language-wise', {
        state: {
          data: value
        }
      });
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
          {/* <div className="d-flex justify-content-between align-items-center mb-1">
            <h5 className="m-0">{pageHeading}</h5>
            <button onClick={() => AddBtnClicked()} className="btn btn-primary btn-sm d-inline d-sm-none">
              <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
              <span className="d-inline d-sm-none"> Add</span>
            </button>
          </div> */}

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
              <Tooltip
                title={location.pathname === '/estore-product' ? 'Add Product' : location.pathname === '/prasad-master' ? 'Add Prasad' : ''}
              >
                <button onClick={AddBtnClicked} className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
                  <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i>
                  <span className="d-none d-sm-inline">
                    {location.pathname === '/estore-product' ? 'Add Product' : location.pathname === '/prasad-master' ? 'Add Prasad' : ''}
                  </span>
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
                      {location.pathname === '/estore-product'
                        ? 'Product Name'
                        : location.pathname === '/prasad-master'
                          ? 'Prasad Name'
                          : ''}
                    </th>

                    {location.pathname === '/estore-product' ? <th className="text-center">Category</th> : ''}

                    {location.pathname === '/prasad-master' ? <th className="text-center">Temple Name</th> : ''}

                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      {location.pathname === '/estore-product'
                        ? 'Product Price'
                        : location.pathname === '/prasad-master'
                          ? 'Prasad Price'
                          : ''}
                    </th>

                    {location.pathname === '/estore-product' ? <th className="text-center">Product Trend</th> : ''}

                    {location.pathname === '/prasad-master' ? <th className="text-center">Discount (%)</th> : ''}

                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Status
                    </th>
                    <th className="text-center actionSticky" style={{ whiteSpace: 'nowrap' }}>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {productList?.map((item, idx) => (
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

                      {location.pathname === '/prasad-master' ? (
                        <td style={{ whiteSpace: 'nowrap' }}>{item.templeName === null ? '-' : item?.templeName}</td>
                      ) : (
                        ''
                      )}

                      {location.pathname === '/estore-product' ? (
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {item?.productCategoryName ? (
                            item.productCategoryName.length > 25 ? (
                              <Tooltip title={item.productCategoryName}>{item.productCategoryName.substring(0, 25) + '...'}</Tooltip>
                            ) : (
                              item.productCategoryName
                            )
                          ) : (
                            '-'
                          )}
                        </td>
                      ) : (
                        ''
                      )}

                      {/* price */}
                      <td>
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          minimumFractionDigits: 2
                        }).format(item.productPrice)}
                      </td>

                      {/* trend/discount */}
                      {location.pathname === '/estore-product' ? (
                        <td style={{ whiteSpace: 'nowrap' }}>{item.trend}</td>
                      ) : (
                        <td>
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            minimumFractionDigits: 2
                          }).format(item.discount)}
                        </td>
                      )}

                      <td className="text-center text-nowrap" onClick={() => ChangeStatusData(item)}>
                        <Tooltip title={item.status === '1' ? 'Enable' : 'Disable'}>
                          {item.status === '1' ? 'Enable' : 'Disable'}
                          <Android12Switch style={{ padding: '8px' }} checked={item.status === '1'} />
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
      <AddUpdateProductModal
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

export default ProductList;
