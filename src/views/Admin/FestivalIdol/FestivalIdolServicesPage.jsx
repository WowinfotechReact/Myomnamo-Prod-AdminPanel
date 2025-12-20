import { Tooltip } from '@mui/material';
import NoResultFoundModel from 'component/NoResultFoundModal';
import PaginationComponent from 'component/Pagination';
import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import AddUpdateFestivalServiceModal from './AddUpdateFestivalServiceModal';

export default function FestivalIdolServicesPage() {
    const [serviceIdolList, setServiceIdolList] = useState([  {name:"Service A", price:100, status:"Active", regDate:"01/12/2025", id:1},
        {name:"Service B", price:200, status:"Inactive", regDate:"02/12/2025", id:2},]);
    const pageHeading = "Festival Idol Services";
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const totalPages = Math.ceil(totalCount / pageSize);
    const [totalRecords, setTotalRecords] = useState(1);
    
 const [modelRequestData, setModelRequestData] = useState({ Action: null })
 const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);   
   

    useEffect(() => {
  
    }, []);

 const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setNewsletterList([]);
    GetNewsLetterListData();
  };

  const AddBtnClicked = () => {
    setModelRequestData({ Action: null});
    setShowAddUpdateModal(true);
  }
  const UpdateBtnClicked = () => {
    setModelRequestData({ Action: "Update"});
    setShowAddUpdateModal(true);
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
                     <button onClick={AddBtnClicked}  className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
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
                          Status
                         </th>
                         <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                          Registration Date
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
                             {item?.name ? (
                               item.name.length > 25 ? (
                                 <Tooltip title={item.name}>{item.name.substring(0, 25) + '...'}</Tooltip>
                               ) : (
                                 item.name
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
                           <td style={{ whiteSpace: 'nowrap' }}>
                                {item?.status ? (
                               item.status
                             ) : (
                               '-'
                             )}
                           </td>
                           <td style={{ whteSpace: 'nowrap' }}>{item.regDate}</td>
     
                           {/* <td className="text-center text-nowrap" onClick={() => ChangeStatusData(item)}>
                             <Tooltip title={item.status === true ? 'Enable' : 'Disable'}>
                               {item.status === true ? 'Enable' : 'Disable'}
                               <Android12Switch style={{ padding: '8px' }} checked={item.status === true} />
                             </Tooltip>
                           </td>
     */}
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
           <AddUpdateFestivalServiceModal show={showAddUpdateModal} onHide={()=>setShowAddUpdateModal(false)} modelRequestData={modelRequestData}/>
           </>
    );
}