import { Tooltip } from '@mui/material'
import NoResultFoundModel from 'component/NoResultFoundModal'
import PaginationComponent from 'component/Pagination'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { Link, useAsyncValue, useNavigate } from 'react-router-dom'
import Android12Switch from 'component/Android12Switch'
import DatePicker from 'react-date-picker'
import 'react-calendar/dist/Calendar.css';
import Select from 'react-select';
import RawMaterialModal from 'component/RawMaterialModal'
import AddStockModal from './AddStockModal'
import { GetVendorLookupList } from 'services/Vendor/VendorApi'
import { GetInventoryReport } from 'services/InventoryReport/InventoryReportApi'
import { ConfigContext } from 'context/ConfigContext'
import { itemTypeLookupList } from 'Middleware/Enum'
import { debounce } from 'Middleware/Utils'
import dayjs from 'dayjs'
const Warehouse = () => {
    const { setLoader } = useContext(ConfigContext);
    const navigate = useNavigate()
    const [toDate, setToDate] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState(null);
    const [totalCount, setTotalCount] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [vendorList, setVendorList] = useState(itemTypeLookupList)
    const [warehouseList, setWarehouseList] = useState([]);

    const [sortingType, setSortingType] = useState(null)
    const [sortValueName, setSortValueName] = useState(null)
    const [totalRecords, setTotalRecords] = useState(10);
    const [pageSize, setPageSize] = useState(30);
    const [modelRequestData, setModelRequestData] = useState({ Action: null, })
    const [showAddVendorModal, setShowAddVendorModal] = useState(false)
    const [isAddUpdateDone, setIsAddUpdateDone] = useState(false)
    const [showUpdateRawModal, setShowUpdateRawModal] = useState(false)
    const [showStockModal, setShowStockModal] = useState(false)
    const [selectedItemType, setSelectedItemType] = useState(null)

    useEffect(() => {
        // GetVendorLookupListData()
        GetInventoryReportData(1, null)
    }, [])
    useEffect(() => {
        if (isAddUpdateDone) {
            setCurrentPage(1)
            GetInventoryReportData(1, null)
            setIsAddUpdateDone(false)
        }
    }, [isAddUpdateDone])

    useEffect(() => {

    }, [toDate, fromDate])

    const GetInventoryReportData = async (pageNumber, searchKeywordValue) => {
        setLoader(true);
        try {
            const response = await GetInventoryReport({
                pageSize: pageSize,
                pageNo: pageNumber - 1,
                sortingDirection: sortingType ? sortingType : null,
                sortingColumnName: sortValueName ? sortValueName : null,
                searchKeyword: searchKeywordValue === undefined || searchKeywordValue === null ? searchKeyword : searchKeywordValue,
                fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
                toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,

            }, selectedItemType);
            if (response?.data?.statusCode === 200) {
                setLoader(false);
                if (response?.data?.responseData?.data) {
                    const List = response.data.responseData.data;
                    const totalCount = response.data.totalCount;

                    setTotalCount(totalCount);
                    setTotalPages(Math.ceil(totalCount / pageSize));
                    setWarehouseList(List);
                    setTotalRecords(List?.length);
                }
            } else {
                console.error(response?.data?.errorMessage);
                setLoader(false);
            }

        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    }

    const GetVendorLookupListData = async () => {
        try {
            const response = await GetVendorLookupList();
            if (response?.data?.statusCode === 200) {
                const list = response?.data?.responseData?.data || [];
                const formattedOptions = list.map((item) => ({
                    value: item.vendorID,
                    label: item.vendorName
                }));
                setVendorList(formattedOptions);
            } else {
                console.error('Failed to fetch lookup list:', response?.data?.statusMessage || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching lookup list:', error);
        }
    };

    const AddStockClicked = (value) => {

        navigate('/stock', { state: { value } });
    }

    const fetchSearchResults = (searchValue) => {
        GetInventoryReportData(currentPage, searchValue);
    };
    const debouncedSearch = useCallback(debounce(fetchSearchResults, 500), []);

    const handleSearchChange = (e) => {
        setCurrentPage(1)
        const value = e.target.value;
        setSearchKeyword(value);
        debouncedSearch(value);
        // GetInventoryReportData(currentPage, searchValue);
    };

    const handleFromDateChange = (newValue) => {
        if (dayjs(newValue).isValid()) {
            setFromDate(dayjs(newValue).toDate());  // store Date
        } else {
            setFromDate(null);
        }
    };

    const handleToDateChange = (newValue) => {
        if (dayjs(newValue).isValid()) {
            setToDate(dayjs(newValue).toDate()); // store Date
        } else {
            setToDate(null);
        }
    };

    const ClearDates = () => {
        setFromDate(null)
        setToDate(null)
    }

    console.log('selectedItemType', selectedItemType)
    return (
        <>
            <div className="card">
                <div className="card-body p-2 bg-white shadow-md rounded-lg" style={{ borderRadius: '10px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h5 className="m-0">Inventory Report</h5>
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
                        <div
                            style={{
                                display: 'flex',
                                gap: '10px',
                                justifyContent: 'center',
                                alignItems: 'center',
                                // flexWrap: 'wrap',

                            }}
                        >
                            <DatePicker
                                className="date-picker-input text-nowrap"
                                label="From Date"
                                value={fromDate}
                                onChange={handleFromDateChange}
                                clearIcon={null}
                                maxDate={toDate}
                                format='dd/MM/yyyy'
                            />
                            {/* DatePicker - To */}
                            <DatePicker
                                className="date-picker-input text-nowrap"
                                label="To Date"
                                value={toDate}
                                onChange={handleToDateChange}
                                clearIcon={null}
                                minDate={fromDate}
                                format='dd/MM/yyyy'
                            />
                            <button onClick={ClearDates} className="btn btn-primary customBtn" >
                                Clear
                            </button>
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                            <Select
                                options={vendorList}
                                value={vendorList?.filter((value, index) => value?.value === selectedItemType)}
                                onChange={(selectedOption) => {
                                    setSelectedItemType(selectedOption?.value)
                                    setIsAddUpdateDone(true)
                                }
                                }
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        width: '200px',
                                        zIndex: '1000'
                                    })
                                }}
                            />
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
                                            Item Code
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Item Name
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Item Type
                                        </th>

                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Unit of Measure
                                        </th>
                                        {/* <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Opening Stock
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Inward Quantity
                                        </th>
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Outward Quantity
                                        </th> */}
                                        <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                            Current Stock
                                        </th>
                                        <th className="text-center " style={{ whiteSpace: 'nowrap' }}>
                                            Last Updated
                                        </th>
                                        <th className="text-center actionSticky" style={{ whiteSpace: 'nowrap' }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {warehouseList?.map((item, idx) => (
                                        <tr className='text-nowrap text-center' key={item.idx}>

                                            <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                                {(currentPage - 1) * pageSize + idx + 1}
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }} >
                                                {item.warehouseName}

                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }} >
                                                {item.itemCode}

                                            </td>
                                            {item.itemName === undefined || item.itemName === null ? (
                                                '-'
                                            ) : (
                                                <td className='text-start'>{item.itemName}</td>
                                            )}
                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.productType}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.unit}</td>

                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.currentStock}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item?.lastUpdatedOn}</td>
                                            <td className="text-center actionColSticky" style={{ zIndex: 4 }}>
                                                <div className="d-flex gap-2">
                                                    <Tooltip title="Add Stock">
                                                        <Button style={{ marginRight: '5px' }} className="btn-sm" onClick={() => AddStockClicked(item)}>
                                                            Add Stock
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

            </div>
            <RawMaterialModal show={showUpdateRawModal} onHide={(() => setShowUpdateRawModal(false))} modelRequestData={modelRequestData} />
            <AddStockModal show={showStockModal} onHide={(() => setShowStockModal(false))} modelRequestData={modelRequestData} />
        </>
    )
}

export default Warehouse
