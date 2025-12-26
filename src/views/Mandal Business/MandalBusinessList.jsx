import { Tooltip } from '@mui/material'
import NoResultFoundModel from 'component/NoResultFoundModal'
import PaginationComponent from 'component/Pagination'
import { React, useCallback, useContext, useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Android12Switch from 'component/Android12Switch'
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs'
import { ConfigContext } from 'context/ConfigContext'
import { debounce } from 'Middleware/Utils'
import { ChangeBlogStatus, GetBlogList } from 'services/Blog/BlogApi'
import ViewStallDetails from './ViewMandalDetails'
import { GetBusinessMasterList } from 'services/Admin/BusinessMaster/BusinessMasterApi'

const MandalBusinessList = () => {
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
    const [totalRecords, setTotalRecords] = useState(0);
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
    const [detailsData, setDetailsData] = useState(null)
    const [openDetails, setOpenDetails] = useState(false)


    useEffect(() => {
        GetBusinessMasterListData(1, null)
    }, [])

    useEffect(() => {
        if (isAddUpdateDone) {
            setSearchKeyword("")
            GetBusinessMasterListData(currentPage, null)
            setIsAddUpdateDone(false)
        }

    }, [isAddUpdateDone])

  const GetBusinessMasterListData = async (pageNumber, searchKeywordValue) => {
         setLoader(true);
         try {
             
             const response = await GetBusinessMasterList({
                 pageSize: pageSize,
                 pageNo: pageNumber - 1,
                 sortingDirection: sortingType ? sortingType : null,
                 sortingColumnName: sortValueName ? sortValueName : null,
                 searchKeyword: searchKeywordValue,
                 fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                 toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
 
             },2);
 
             if (response) {
                 if (response?.data?.statusCode === 200) {
                     setLoader(false);
                     if (response?.data?.responseData?.data) {
                         const List = response.data.responseData.data;
                         const totalCount = response.data.totalCount;
 
                         setTotalCount(totalCount);
                         setTotalPages(Math.ceil(totalCount / pageSize));
                         setStallList(List);
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
    const updateBtnClickPujaCat = (item) => {
        setModelRequestData((prev) => ({
            ...prev, Action: 'Update',
            blogKeyID: item?.blogKeyID
        }))
        setShowAddUpdateModal(true)
    }



    const handleStatusChange = (item) => {
        setStateChangeStatus(item); // You can set only relevant data if needed
        setShowStatusChangeModal(true);
    };

    const confirmStatusChange = async (item, user) => {
        try {
            const { blogKeyID } = item; // Destructure to access only what's needed
            const response = await ChangeBlogStatus(blogKeyID);

            if (response && response.data.statusCode === 200) {
                setShowStatusChangeModal(false);
                setStateChangeStatus(null);
                GetBusinessMasterListData(currentPage, null)
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
        GetBusinessMasterListData(1, searchValue);
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
        GetBusinessMasterListData(pageNumber, null);
    };


    const handleImageClick = (imgUrl, deityName) => {

        setModalTitle(deityName); // set the modal title dynamically
        setSelectedImage(imgUrl);
        setShowModal(true);
    };

    const navigate = useNavigate()
    const AddLangBtnClicked = (item) => {
        console.log("AddLangBtnClicked", item);
        setShowAddUpdateModal(false); // ensure modal is closed
        navigate('/language-wise-blog', {
            state: { blogCategoryData: item }
        });
    };


    return (
        <>
            <div className="card">
                <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h5 className="m-0">Mandal Business</h5>

                    </div>

                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                        {/* Search Box */}
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search..."
                            value={searchKeyword}
                            style={{ maxWidth: '200px' }}
                            onChange={handleSearchChange}
                        />
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
                                            Owner Name
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Business Name
                                        </th>

                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Mobile No
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Email
                                        </th>

                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Contact Person Name
                                        </th>

                                        <th className="text-center " style={{ whiteSpace: 'nowrap' }}>
                                            Status
                                        </th>   <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Reg Date
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

                                            <td className="text-center">
                                                {item.blogTitle?.length > 30 ? (
                                                    <Tooltip title={item.blogTitle}>{`${item.blogTitle?.substring(0, 30)}...`}</Tooltip>
                                                ) : (
                                                    <>{item.blogTitle}</>
                                                )}
                                            </td>
                                            <td style={{ whiteSpace: "nowrap", cursor: "pointer" }}>
                                                {item.blogImage ? (
                                                    <img
                                                        src={item.blogImage}
                                                        alt={item.blogTitle}
                                                        style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" }}
                                                        onClick={() => handleImageClick(item.blogImage, item.blogTitle)}
                                                    />
                                                ) : (
                                                    "No Image"
                                                )}
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }} >
                                                mobile
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }} >
                                                {item.blogDate.split(" ")[0]}
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }} >
                                                {item.autherName}
                                            </td>
                                            <td className="text-center text-nowrap" onClick={() => ChangeStatusData(item)}>
                                                <Tooltip title={item.status === true ? 'Enable' : 'Disable'}>
                                                    {item.status === true ? 'Enable' : 'Disable'}
                                                    <Android12Switch style={{ padding: '8px' }} onClick={() => handleStatusChange(item)} checked={item.status === true} />
                                                </Tooltip>
                                            </td>
                                            <td className="text-center text-nowrap" onClick={() => ChangeStatusData(item)}>
                                                30/10/2000
                                            </td>
                                            <td className="text-center actionColSticky " style={{ zIndex: 4 }}>
                                                <div className="d-flex gap-2">
                                                    <Tooltip title="View Details">
                                                        <Button style={{ marginRight: '5px' }} className="btn-sm"
                                                            onClick={() => {
                                                                setDetailsData(item)
                                                                setOpenDetails(true)
                                                            }}>
                                                            <i class="fas fa-eye"></i>
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
            {/* <StatusChangeModal
                open={showStatusChangeModal}
                onClose={() => setShowStatusChangeModal(false)}
                onConfirm={() => confirmStatusChange(stateChangeStatus)} // Pass the required arguments
            />
            <SuccessPopupModal show={showSuccessModal} onHide={(() => setShowSuccessModal(false))} successMassage={ChangeStatusMassage} /> */}
            <ViewStallDetails show={openDetails} onHide={() => setOpenDetails(false)} data={detailsData} />
        </>
    )
}

export default MandalBusinessList
