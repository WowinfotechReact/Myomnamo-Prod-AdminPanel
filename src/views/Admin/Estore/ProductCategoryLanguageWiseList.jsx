import { Tooltip } from '@mui/material';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import { React, useCallback, useContext, useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import Android12Switch from 'component/Android12Switch';
import 'react-calendar/dist/Calendar.css';
import { ConfigContext } from 'context/ConfigContext';
import { debounce } from 'Middleware/Utils';
import { ChangeStatus, GetProductCatList } from 'services/Admin/EStoreAPI/ProductCatAPI';
import AddUpdateProductCatModal from './AddUpdateProductCat';
import StatusChangeModal from 'component/StatusChangeModal';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import { ChangeStatusMassage } from 'component/GlobalMassage';


const ProductCategoryLanguageWiseList = () => {
  const location = useLocation();
  const [modelAction, setModelAction] = useState();
  const { setLoader, truncateText } = useContext(ConfigContext);
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
  const [sortingType, setSortingType] = useState(null);
  const [sortValueName, setSortValueName] = useState(null);
  const [modalTitle, setModalTitle] = useState(false);
  const [pujaCategoryList, setPujaCategoryList] = useState([]);
  const [modelRequestData, setModelRequestData] = useState({ Action: null, shopID: null, moduleName: 'LanguageWiseList' });
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [isAddUpdateDone, setIsAddUpdateDone] = useState(false);
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [languageWiseList, setLanguageWiseList] = useState([]);
  const [productCatList, setProductCatList] = useState([]);

  useEffect(() => {
    GetProductCatBookingListData();
  }, []);

  useEffect(() => {
    if (isAddUpdateDone) {
      GetProductCatBookingListData();
      setIsAddUpdateDone(false);
    }
  }, [isAddUpdateDone]);

  const GetProductCatBookingListData = async () => {
    setLoader(true);
    try {
      const response = await GetProductCatList(
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
          pageSize: 10,
          pageNo: 0,
          sortingDirection: null,
          sortingColumnName: null,
          searchKeyword: null,
          fromDate: null,
          toDate: null
        },
        location?.state?.data.productCatKeyID
      );

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const List = response.data.responseData.data;
            const totalCount = response.data.totalCount;

            setTotalCount(totalCount);
            setTotalPages(Math.ceil(totalCount / pageSize));
            setProductCatList(List);
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

  const confirmStatusChange = async (item, user) => {

    try {
      const { productCatKeyID, appLangID } = item; // Destructure to access only what's needed
      const response = await ChangeStatus(productCatKeyID, appLangID);

      if (response?.data?.statusCode === 200) {
        setShowStatusChangeModal(false);
        setStateChangeStatus(null);
        setIsAddUpdateDone(true);

        setShowSuccessModal(true);
        setModelAction('Puja Category status changed successfully.');
        setShowStatusChangeModal(false);
      } else {
        console.error(response?.response?.data?.errorMessage);
        setShowErrorModal(true);
        setShowStatusChangeModal(false);
        setModelAction(response?.response?.data?.errorMessage);
      }
    } catch (error) {
      console.error(response?.data?.errorMessage);
      setShowErrorModal(true);
      setShowStatusChangeModal(false);
      setModelAction('An error occurred while changing the employee status.');
    }
  };



  const fetchSearchResults = (searchValue) => {
    GetProductCatBookingListData(1, searchValue);
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
    GetProductCatBookingListData(pageNumber, null);
  };

  const handleImageClick = (imgUrl, deityName) => {
    setModalTitle(deityName); // set the modal title dynamically
    setSelectedImage(imgUrl);
    setShowModal(true);
  };
  const HandleCloseAll = () => {
    setShowSuccessModal(false);
    setShowStatusChangeModal(false);
  };

  const AddBtnClicked = () => {
    setModelRequestData((prev) => ({
      ...prev,
      Action: null,
      appLangID: null,
      productCatKeyID: location?.state?.data?.productCatKeyID,
      prodCatByLangKeyID: null,
      moduleName: 'LanguageWiseList'
    }));
    setShowAddUpdateModal(true);
  };
  const updateBtnClickPujaCat = (value) => {
    setModelRequestData((prev) => ({
      ...prev,
      Action: 'update',
      productCatKeyID: location?.state?.data?.productCatKeyID,
      prodCatByLangKeyID: value?.prodCatByLangKeyID,
      appLangID: value?.appLangID,
      moduleName: 'LanguageWiseList'
    }));
    setShowAddUpdateModal(true);
  };


  const handleStatusChange = (item) => {
    setModelRequestData((prev) => ({ ...prev, changeStatusData: item })); // You can set only relevant data if needed
    setShowStatusChangeModal(true);
  };

  console.log("location ==>", location.state.data.productCategoryName)
  return (
    <>
      <div className="card">
        <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
          <div className="d-flex justify-content-between align-items-center mb-1">
            {/* Back Button – always visible */}
            <button onClick={() => window.history.back()} className="btn btn-outline-secondary btn-sm">
              <i className="fa-solid fa-arrow-left me-1" style={{ fontSize: '11px' }}></i>
              <span className="d-none d-sm-inline">Back</span>
            </button>

            {/* Title – centered */}
            <h5 className="m-0 text-center flex-grow-1">{truncateText(location.state.data.productCategoryName, 30)}</h5>

            {/* Add Button – visible only on mobile (<576px) */}
            <button onClick={AddBtnClicked} className="btn btn-primary btn-sm d-inline d-sm-none">
              <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
              <span className="ms-1">Add</span>
            </button>
          </div>
          <hr />

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
              <Tooltip title="Add Language">
                <button onClick={() => AddBtnClicked()} className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
                  {/* <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i> */}
                  <span className="d-none d-sm-inline">Add Language</span>
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
                      Product Category Name
                    </th>

                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Language Name
                    </th>
                    {/* <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Product Service Name
                    </th>
                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Product Sub Service Name
                    </th> */}

                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                      Status
                    </th>
                    <th className="text-center actionSticky" style={{ whiteSpace: 'nowrap' }}>
                      Action
                    </th>
                  </tr>
                </thead>
            <tbody>
  {productCatList?.map((item, idx) => (
    <tr key={item.idx} className="text-center align-middle">
      <td >
        {(currentPage - 1) * pageSize + idx + 1}
      </td>

      <td className="align-middle">
        {item.productCategoryName || "-"}
      </td>

      <td className="align-middle">
        {item.languageName || "-"}
      </td>

      <td
        className="align-middle text-center"
        onClick={() => handleStatusChange(item)}
        style={{ cursor: "pointer" }}
      >
        <div className="d-flex justify-content-center align-items-center gap-2">
          <Tooltip title={item.status ? "Enable" : "Disable"}>
            <span className="text-sm">{item.status ? "Enable" : "Disable"}</span>
          </Tooltip>
          <Android12Switch
            onClick={() => handleStatusChange(item)}
            checked={item.status === true}
          />
        </div>
      </td>

      <td className="align-middle text-center actionColSticky" style={{ zIndex: 4 }}>
        <div className="d-flex justify-content-center align-items-center gap-2">
          <Tooltip title="Update Language">
            <Button
              size="sm"
              className="btn-sm"
              onClick={() => updateBtnClickPujaCat(item)}
            >
              <i className="fas fa-edit"></i>
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

      <AddUpdateProductCatModal
        show={showAddUpdateModal}
        onHide={() => setShowAddUpdateModal(false)}
        modelRequestData={modelRequestData}
        setIsAddUpdateDone={setIsAddUpdateDone}
      />
      <StatusChangeModal
        open={showStatusChangeModal}
        onClose={() => setShowStatusChangeModal(false)}
        onConfirm={() => confirmStatusChange(modelRequestData?.changeStatusData)} // Pass the required arguments
      />
      <SuccessPopupModal show={showSuccessModal} onHide={() => HandleCloseAll()} successMassage={ChangeStatusMassage} />
      <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={modelAction} />
      {/* <ImagePreviewModal
        show={showModal}
        onHide={() => setShowModal(false)}
        imgSrc={selectedImage}
        title={modalTitle} // pass deity name as title
      />

     
      */}
    </>
  );
};

export default ProductCategoryLanguageWiseList;



// import { Tooltip } from '@mui/material';
// import NoResultFoundModel from 'component/NoResultFoundModal';
// import PaginationComponent from 'component/Pagination';
// import { React, useCallback, useContext, useEffect, useState } from 'react';
// import { Button, Table } from 'react-bootstrap';
// import { Link, useLocation } from 'react-router-dom';
// import Android12Switch from 'component/Android12Switch';
// import 'react-calendar/dist/Calendar.css';
// import { ConfigContext } from 'context/ConfigContext';
// import { debounce } from 'Middleware/Utils';
// import { GetProductCatList } from 'services/Admin/EStoreAPI/ProductCatAPI';
// import AddUpdateProductCatModal from './AddUpdateProductCat';
// import StatusChangeModal from 'component/StatusChangeModal';
// import SuccessPopupModal from 'component/SuccessPopupModal';
// import ErrorModal from 'component/ErrorModal';
// import { ChangeStatusMassage } from 'component/GlobalMassage';
// import { ChangeStatus } from 'services/Admin/EStoreAPI/ProductAPI';

// const ProductCategoryLanguageWiseList = () => {
//   const location = useLocation();
//   const [modelAction, setModelAction] = useState();
//   const { setLoader, truncateText } = useContext(ConfigContext);
//   const [showModal, setShowModal] = useState(false);
//   const [stateChangeStatus, setStateChangeStatus] = useState('');
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [toDate, setToDate] = useState(null);
//   const [fromDate, setFromDate] = useState(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchKeyword, setSearchKeyword] = useState(null);
//   const [totalCount, setTotalCount] = useState(null);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(-1);
//   const [pageSize, setPageSize] = useState(30);
//   const [sortingType, setSortingType] = useState(null);
//   const [sortValueName, setSortValueName] = useState(null);
//   const [modalTitle, setModalTitle] = useState(false);
//   const [pujaCategoryList, setPujaCategoryList] = useState([]);
//   const [modelRequestData, setModelRequestData] = useState({ Action: null, shopID: null, moduleName: 'LanguageWiseList' });
//   const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
//   const [isAddUpdateDone, setIsAddUpdateDone] = useState(false);
//   const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [showErrorModal, setShowErrorModal] = useState(false);

//   const [languageWiseList, setLanguageWiseList] = useState([]);
//   const [productCatList, setProductCatList] = useState([]);

//   useEffect(() => {
//     GetProductCatBookingListData();
//   }, []);

//   useEffect(() => {
//     if (isAddUpdateDone) {
//       GetProductCatBookingListData();
//       setIsAddUpdateDone(false);
//     }
//   }, [isAddUpdateDone]);

//   const GetProductCatBookingListData = async () => {
//     setLoader(true);
//     try {
//       const response = await GetProductCatList(
//         {
//           // pageSize: pageSize,
//           // pageNo: pageNumber - 1,
//           // sortingDirection: sortingType ? sortingType : null,
//           // sortingColumnName: sortValueName ? sortValueName : null,
//           // searchKeyword: searchKeywordValue === undefined || searchKeywordValue === null ? searchKeyword : searchKeywordValue,
//           // fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
//           // toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
//           // pujaServiceID: pujaServiceID,
//           // pujaSubServiceID: pujaSubServiceID
//           pageSize: 10,
//           pageNo: 0,
//           sortingDirection: null,
//           sortingColumnName: null,
//           searchKeyword: null,
//           fromDate: null,
//           toDate: null
//         },
//         location?.state?.data.productCatKeyID
//       );

//       if (response) {
//         if (response?.data?.statusCode === 200) {
//           setLoader(false);
//           if (response?.data?.responseData?.data) {
//             const List = response.data.responseData.data;
//             const totalCount = response.data.totalCount;

//             setTotalCount(totalCount);
//             setTotalPages(Math.ceil(totalCount / pageSize));
//             setProductCatList(List);
//             setTotalRecords(List?.length);
//           }
//         } else {
//           console.error(response?.data?.errorMessage);
//           setLoader(false);
//         }
//       }
//     } catch (error) {
//       setLoader(false);
//       console.log(error);
//     }
//   };

//   const confirmStatusChange = async (item, user) => {

//     try {
//       const { productCatKeyID, appLangID } = item; // Destructure to access only what's needed
//       const response = await ChangeStatus(productCatKeyID, appLangID);

//       if (response?.data?.statusCode === 200) {
//         setShowStatusChangeModal(false);
//         setStateChangeStatus(null);
//         setIsAddUpdateDone(true);

//         setShowSuccessModal(true);
//         setModelAction('Puja Category status changed successfully.');
//         setShowStatusChangeModal(false);
//       } else {
//         console.error(response?.response?.data?.errorMessage);
//         setShowErrorModal(true);
//         setShowStatusChangeModal(false);
//         setModelAction(response?.response?.data?.errorMessage);
//       }
//     } catch (error) {
//       console.error(response?.data?.errorMessage);
//       setShowErrorModal(true);
//       setShowStatusChangeModal(false);
//       setModelAction('An error occurred while changing the employee status.');
//     }
//   };



//   const fetchSearchResults = (searchValue) => {
//     GetProductCatBookingListData(1, searchValue);
//   };
//   const debouncedSearch = useCallback(debounce(fetchSearchResults, 500), []);

//   const handleSearchChange = (e) => {
//     setCurrentPage(1);
//     const value = e.target.value;
//     setSearchKeyword(value);
//     debouncedSearch(value);
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//     GetProductCatBookingListData(pageNumber, null);
//   };

//   const handleImageClick = (imgUrl, deityName) => {
//     setModalTitle(deityName); // set the modal title dynamically
//     setSelectedImage(imgUrl);
//     setShowModal(true);
//   };
//   const HandleCloseAll = () => {
//     setShowSuccessModal(false);
//     setShowStatusChangeModal(false);
//   };

//   const AddBtnClicked = () => {
//     setModelRequestData((prev) => ({
//       ...prev,
//       Action: null,
//       appLangID: null,
//       productCatKeyID: location?.state?.data?.productCatKeyID,
//       prodCatByLangKeyID: null,
//       moduleName: 'LanguageWiseList'
//     }));
//     setShowAddUpdateModal(true);
//   };
//   const updateBtnClickPujaCat = (value) => {
//     setModelRequestData((prev) => ({
//       ...prev,
//       Action: 'update',
//       productCatKeyID: location?.state?.data?.productCatKeyID,
//       prodCatByLangKeyID: value?.prodCatByLangKeyID,
//       appLangID: value?.appLangID,
//       moduleName: 'LanguageWiseList'
//     }));
//     setShowAddUpdateModal(true);
//   };


//   const handleStatusChange = (item) => {
//     setModelRequestData((prev) => ({ ...prev, changeStatusData: item })); // You can set only relevant data if needed
//     setShowStatusChangeModal(true);
//   };

//   console.log("location ==>", location.state.data.productCategoryName)
//   return (
//     <>
//       <div className="card">
//         <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
//           <div className="d-flex justify-content-between align-items-center mb-1">
//             {/* Back Button – always visible */}
//             <button onClick={() => window.history.back()} className="btn btn-outline-secondary btn-sm">
//               <i className="fa-solid fa-arrow-left me-1" style={{ fontSize: '11px' }}></i>
//               <span className="d-none d-sm-inline">Back</span>
//             </button>

//             {/* Title – centered */}
//             <h5 className="m-0 text-center flex-grow-1">{truncateText(location.state.data.productCategoryName, 30)}</h5>

//             {/* Add Button – visible only on mobile (<576px) */}
//             <button onClick={AddBtnClicked} className="btn btn-primary btn-sm d-inline d-sm-none">
//               <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
//               <span className="ms-1">Add</span>
//             </button>
//           </div>
//           <hr />

//           <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
//             {/* Search Box */}
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search..."
//               style={{ maxWidth: '200px' }}
//               onChange={handleSearchChange}
//             />

//             {/* Action Buttons */}
//             <div className="d-flex gap-2 align-items-center">
//               <Tooltip title="Add Language">
//                 <button onClick={() => AddBtnClicked()} className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
//                   {/* <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i> */}
//                   <span className="d-none d-sm-inline">Add Language</span>
//                 </button>
//               </Tooltip>
//             </div>
//           </div>
//           <div>
//             <div className="table-responsive" style={{ maxHeight: '65vh' }}>
//               <Table striped bordered hover>
//                 <thead className="table-light  ">
//                   <tr
//                     style={{
//                       position: 'sticky',
//                       top: -1,
//                       backgroundColor: '#fff',
//                       zIndex: 10,
//                       boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
//                     }}
//                     className="text-nowrap"
//                   >
//                     <th className="text-center">Sr No.</th>
//                     <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
//                       Product Category Name
//                     </th>

//                     <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
//                       Language Name
//                     </th>
//                     {/* <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
//                       Product Service Name
//                     </th>
//                     <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
//                       Product Sub Service Name
//                     </th> */}

//                     <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
//                       Status
//                     </th>
//                     <th className="text-center actionSticky" style={{ whiteSpace: 'nowrap' }}>
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {productCatList?.map((item, idx) => (
//                     <tr className="text-nowrap text-center" key={item.idx}>
//                       <td style={{ whiteSpace: 'nowrap',   }} className="text-center">
//                         {(currentPage - 1) * pageSize + idx + 1}
//                       </td>
//                       <td style={{ whiteSpace: 'nowrap' }}>{item.productCategoryName === null ? '-' : item.productCategoryName}</td>
//                       <td style={{ whiteSpace: 'nowrap' }}>{item.languageName === null ? '-' : item.languageName}</td>
//                       {/* <td style={{ whiteSpace: 'nowrap' }}>{item.pujaServiceName === null ? '-' : item.pujaSubServiceName}</td> */}
//                       {/* <td style={{ whiteSpace: 'nowrap' }}>{item.pujaSubServiceName === null ? '-' : item.pujaSubServiceName}</td> */}

//                       <td className="text-center text-nowrap" onClick={() => handleStatusChange(item)}>
//                         <Tooltip title={item.status === true ? 'Enable' : 'Disable'}>
//                           {item.status === true ? 'Enable' : 'Disable'}
//                           <Android12Switch
//                             style={{ padding: '8px' }}
//                             onClick={() => handleStatusChange(item)}
//                             checked={item.status === true}
//                           />
//                         </Tooltip>
//                       </td>

//                       <td className="text-center actionColSticky" style={{ zIndex: 4 }}>
//                         <div className="d-flex gap-2 justify-content-center">
//                           <Tooltip title="Update  Language">
//                             <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => updateBtnClickPujaCat(item)}>
//                               <i class="fas fa-edit"></i>
//                             </Button>
//                           </Tooltip>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//               {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />}
//             </div>
//             {totalCount > pageSize && (
//               <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
//             )}
//           </div>
//         </div>
//       </div>

//       <AddUpdateProductCatModal
//         show={showAddUpdateModal}
//         onHide={() => setShowAddUpdateModal(false)}
//         modelRequestData={modelRequestData}
//         setIsAddUpdateDone={setIsAddUpdateDone}
//       />
//       <StatusChangeModal
//         open={showStatusChangeModal}
//         onClose={() => setShowStatusChangeModal(false)}
//         onConfirm={() => confirmStatusChange(modelRequestData?.changeStatusData)} // Pass the required arguments
//       />
//       <SuccessPopupModal show={showSuccessModal} onHide={() => HandleCloseAll()} successMassage={ChangeStatusMassage} />
//       <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={modelAction} />
//       {/* <ImagePreviewModal
//         show={showModal}
//         onHide={() => setShowModal(false)}
//         imgSrc={selectedImage}
//         title={modalTitle} // pass deity name as title
//       />

     
//       */}
//     </>
//   );
// };

// export default ProductCategoryLanguageWiseList;
