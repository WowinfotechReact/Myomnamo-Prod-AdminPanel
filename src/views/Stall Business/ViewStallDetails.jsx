import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { GetMurtiBookingList } from 'services/Admin/MurtiBooking/MurtiBookingApi';
import { ConfigContext } from 'context/ConfigContext';

const ViewStallDetails = ({ show, onHide, modelRequestData }) => {
    const { setLoader } = useContext(ConfigContext);
    const [stallDetails, setStallDetails] = useState([]);

    useEffect(() => {
        if (show) {
            GetBusinessMasterListData();
        }
    }, [show])

    const GetBusinessMasterListData = async () => {
        setLoader(true);
        try {

            const response = await GetMurtiBookingList(modelRequestData.businessKeyID);

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
                    Stall Business Details
                </h4>
            </Modal.Header>


            <Modal.Body
                style={{
                    maxHeight: '60vh',
                    overflowY: 'auto',
                    backgroundColor: '#fff', // Removed card styling
                }}
            >
                <div className="p-2">
                    {renderField('Customer Name', stallDetails.customerName, true)}
                    {renderField('Business Name', stallDetails.businessName, true)}
                    {renderField('Mobile Number', stallDetails.mobileNo)}
                    {renderField('Total Amount', stallDetails.totalAmount)}
                    {renderField('Paid Amount', stallDetails.paidAmount)}
                    {renderField('Payment Type', stallDetails.paymentType)}
                    {renderField('Is Delivered', stallDetails.isDelivered)}
                    {renderField('Murti Code', stallDetails.murtiCode)}
                    {renderField('Email', stallDetails.email)}
                    {renderField('Address', stallDetails.address)}
                    {renderField('Contact Person', stallDetails.contactPerson)}
                    {renderField('Business Type', stallDetails.businessType)}
                    {renderField('Password', stallDetails.password)}
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

export default ViewStallDetails;