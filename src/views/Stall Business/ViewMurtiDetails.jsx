import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { GetMurtiBookingList } from 'services/Admin/MurtiBooking/MurtiBookingApi';
import { ConfigContext } from 'context/ConfigContext';
import dayjs from 'dayjs';

const ViewMurtiDetails = ({ show, onHide, modelRequestData }) => {
    const { setLoader, user } = useContext(ConfigContext);
    const [stallDetails, setStallDetails] = useState([]);

    useEffect(() => {
        if (show) {
            GetBusinessMasterListData();
        }
    }, [show])

    const GetBusinessMasterListData = async () => {
        setLoader(true);
        try {

            const response = await GetMurtiBookingList({
                adminID: user?.adminID,
                pageSize: 40,
                pageNo: 0,
                sortingDirection: null,
                sortingColumnName: null,
                searchKeyword: null,
                fromDate: null,
                toDate: null

            }, modelRequestData.businessKeyID);

            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        setStallDetails(List);
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

    const renderField = (label, value, highlight = false) => (
        <div className="flex flex-wrap items-start py-2 border-b border-gray-200">
            <span className="font-bold text-gray-900 text-[15px] min-w-[180px]" style={{ color: "black", fontWeight: 500 }}>
                {label}:{" "}
            </span>
            <span
                className={`text-[15px] ml-2 break-words ${highlight
                    ? 'font-semibold text-black'
                    : 'text-gray-700'
                    }`}
            >
                {value || '-'}
            </span>
        </div>
    );


    return (
        <Modal
            style={{ zIndex: 1300 }}
            size="lg"
            show={show}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header  >
                <h4 className="w-100 text-center text-gray-900 font-semibold m-0">
                    Stall Murti Details
                </h4>
            </Modal.Header>


            <Modal.Body
  style={{
    maxHeight: "60vh",
    overflowY: "auto",
    backgroundColor: "#fff",
  }}
>
  <div className="table-scroll">
  <table className="table table-bordered table-hover align-middle">
    <thead className="table-light">
      <tr>
        <th className='text-nowrap'>#</th>
        <th className='text-nowrap'>Booking ID</th>
        <th className='text-nowrap'>Murti Code</th>
        <th className='text-nowrap'>Customer Name</th>
        <th className='text-nowrap'>Mobile No</th>
        <th className='text-nowrap'>Total Amount</th>
        <th className='text-nowrap'>Paid Amount</th>
        <th className='text-nowrap'>Delivery Date</th>
        <th className='text-nowrap'>Delivered Status</th>
        <th className='text-nowrap'>Booking Status</th>
      </tr>
    </thead>

    <tbody>
      {stallDetails?.map((item, index) => (
        <tr key={index}>
          <td className='text-nowrap'>{index + 1}</td>
          <td className='text-nowrap'>{item.bookingID}</td>
          <td className='text-nowrap'>{item.murtiCode}</td>
          <td className='text-nowrap'>{item.customerName}</td>
          <td className='text-nowrap'>{item.mobileNo}</td>
          <td className='text-nowrap text-center'>₹ {item.totalAmount}</td>
          <td className='text-nowrap text-center'>₹ {item.paidAmount}</td>
          <td className='text-nowrap'>{dayjs(item.deliveryDate).format('DD-MM-YYYY')}</td>

          <td className='text-nowrap text-center'>
            <span className={`badge ${item.isDelivered ? "bg-success" : "bg-warning text-dark"}`}>
              {item.isDelivered ? "Yes" : "No"}
            </span>
          </td>

          <td className='text-nowrap text-center'>
            <span className={`badge ${item.status ? "bg-success" : "bg-danger"}`}>
              {item.status ? "Active" : "Inactive"}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

</Modal.Body>



            <Modal.Footer className="flex justify-end gap-2">
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>

            </Modal.Footer>
        </Modal>
    );
};

export default ViewMurtiDetails;