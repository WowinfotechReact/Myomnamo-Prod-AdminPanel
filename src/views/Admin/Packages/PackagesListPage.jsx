
import { Tooltip } from '@mui/material'
import Android12Switch from 'component/Android12Switch'
import { ChangeStatusMassage } from 'component/GlobalMassage'
import NoResultFoundModel from 'component/NoResultFoundModal'
import PaginationComponent from 'component/Pagination'
import SuccessPopupModal from 'component/SuccessPopupModal'
import { ConfigContext } from 'context/ConfigContext'
import dayjs from 'dayjs'
import { pujaServiceID, pujaSubServiceID } from 'Middleware/Enum'
import { debounce } from 'Middleware/Utils'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router'
import AddUpdatePackageModal from './AddUpdatePackageModal'
import StatusChangeModal from 'component/StatusChangeModal'
import { GetPujaSubscriptionPackageList } from 'services/Admin/SubscriptionPackage/SubscriptionPackageApi'

const PackagesListPage = () => {
    const { setLoader, user } = useContext(ConfigContext);
    const navigate = useNavigate()
    const location = useLocation()

    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState(null);
    const [totalCount, setTotalCount] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(-1);
    const [pageSize, setPageSize] = useState(20);
    const [sortingType, setSortingType] = useState(null)
    const [sortValueName, setSortValueName] = useState(null)
    const [pageHeading, setPageHeading] = useState("Package")
    const [modelRequestData, setModelRequestData] = useState({ Action: null, tempPujaSubPackageKeyID: null, moduleName: 'PackageList' })
    const [showAddPackageModal, setShowAddPackageModal] = useState(false)

    const [isAddUpdateDone, setIsAddUpdateDone] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);

    const [toDate, setToDate] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [packageList, setPackageList] = useState([])

    useEffect(() => {
        GetPujaSubscriptionPackageListData(1, null)
    }, [])

    useEffect(() => {
        if (isAddUpdateDone) {
            setSearchKeyword("")
            GetPujaSubscriptionPackageListData(1, null)
            setIsAddUpdateDone(false)
        }
    }, [isAddUpdateDone])



    const GetPujaSubscriptionPackageListData = async (pageNumber, searchKeywordValue) => {
        setLoader(true);
        try {
            const response = await GetPujaSubscriptionPackageList({
                adminID: user?.admiN_ID,
                pageSize: pageSize,
                pageNo: pageNumber - 1,
                sortingDirection: sortingType ? sortingType : null,
                sortingColumnName: sortValueName ? sortValueName : null,
                searchKeyword: searchKeywordValue,
                fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,

            }, location?.state?.data?.pujaKeyID);

            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        const totalCount = response.data.totalCount;

                        setTotalCount(totalCount);
                        setTotalPages(Math.ceil(totalCount / pageSize));
                        setPackageList(List);
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

    const AddBtnClicked = () => {
        setModelRequestData((prev) => ({ ...prev, Action: null, tempPujaSubPackageKeyID: null, tempPujaSubPackLangKeyID: null, pujaKeyID: location?.state?.data?.pujaKeyID }))
        setShowAddPackageModal(true)
    }

    const updateBtnClicked = (value) => {

        setModelRequestData((prev) => ({
            ...prev, Action: 'update',
            tempPujaSubPackageKeyID: value?.tempPujaSubPackageKeyID,
            tempPujaSubPackLangKeyID: null,
            pujaKeyID: location?.state?.data?.pujaKeyID
        }))
        setShowAddPackageModal(true)
    }
    const fetchSearchResults = (searchValue) => {
        GetPujaSubscriptionPackageListData(currentPage, searchValue);
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
        setPackageList([])
        // GetPujaListData(pageNumber, null, modelRequestData?.pujaServiceID, modelRequestData?.pujaSubServiceID)
    }

    const onSuccessClose = () => {
        setShowSuccessModal(false)
        setIsAddUpdateDone(true)
    }
    const AddLangBtnClicked = (value) => {

        navigate('/language-wise-package', {
            state: {
                data: value,
                pujaKeyID: location?.state?.data?.pujaKeyID,
                pujaServiceID: modelRequestData?.pujaServiceID,
                pujaSubServiceID: modelRequestData?.pujaSubServiceID
            },
        })
    }


    return (
        <>
            <div className="card">
                <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">

                        {/* Back Button – always visible */}
                        <button
                            onClick={() => window.history.back()}
                            className="btn btn-outline-secondary btn-sm"
                        >
                            <i className="fa-solid fa-arrow-left me-1" style={{ fontSize: '11px' }}></i>
                            <span className="d-none d-sm-inline">Back</span>
                        </button>

                        {/* Title – centered */}
                        <h5 className="m-0 text-center flex-grow-1">{pageHeading} List</h5>

                        {/* Add Button – visible only on mobile (<576px) */}
                        <button
                            onClick={AddBtnClicked}
                            className="btn btn-primary btn-sm d-inline d-sm-none"
                        >
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
                            style={{ maxWidth: '350px' }}
                            value={searchKeyword}
                            onChange={handleSearchChange}
                        />

                        {/* Action Buttons */}
                        <div className="d-flex gap-2 align-items-center">
                            <Tooltip title={`Add ${pageHeading}`}>
                                <button
                                    onClick={() => AddBtnClicked()}
                                    className="btn btn-primary btn-sm"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="fa-solid fa-plus me-1" style={{ fontSize: '11px' }}></i>
                                    <span className="d-none d-sm-inline">Add {pageHeading}</span>
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
                                            Title
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Sub Title
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Price
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            TimeLine
                                        </th>


                                        {/* <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Status
                                        </th> */}

                                        <th className="text-center actionSticky" style={{ whiteSpace: 'nowrap' }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {packageList?.map((item, idx) => (
                                        <tr className='text-nowrap  text-center' key={item.idx}>

                                            <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                                {(currentPage - 1) * pageSize + idx + 1}
                                            </td>

                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {item.title === null ? '-' : item?.title}

                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {item.subTitle === null ? '-' : item?.subTitle}

                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {item.price === null ? '-' : item?.price}

                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {item.timeLine === null ? '-' : item?.timeLine}

                                            </td>

                                            {/* <td className="text-center text-nowrap"
                                                onClick={() => ChangeStatusData(item)}
                                            >
                                                <Tooltip title={item.status === true ? 'Enable' : 'Disable'}>
                                                    {item.status === true ? 'Enable' : 'Disable'}
                                                    <Android12Switch
                                                        style={{ padding: '8px' }} checked={item.status === true} />
                                                </Tooltip>
                                            </td> */}

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
            <AddUpdatePackageModal show={showAddPackageModal} onHide={() => setShowAddPackageModal(false)} modelRequestData={modelRequestData} setIsAddUpdateDone={setIsAddUpdateDone} />
            <SuccessPopupModal show={showSuccessModal} onHide={(() => onSuccessClose())} successMassage={ChangeStatusMassage} />
            <StatusChangeModal
                open={showStatusChangeModal}
                onClose={() => setShowStatusChangeModal(false)}
                onConfirm={() => ChangeStatusData(modelRequestData?.changeStatusData)} // Pass the required arguments
            />
        </>
    )
}

export default PackagesListPage
