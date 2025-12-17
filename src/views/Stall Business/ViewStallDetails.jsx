import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ViewStallDetails = ({ show, onHide, modelRequestData }) => {
    const stallDetails = modelRequestData || {
        ownerName: 'Gaurav Nimse',
        businessName: 'महारुद्रा गणेश मूर्ती केंद्र',
        mobileNumber: '8010361951',
        address: 'Nandur Naka',
        email: 'nimsegaurav615@gmail.com',
        contactPerson: 'Omkar Jojare',
        altMobile: '9096566358',
        password: 'gaurav12',
        businessType: 'Stall',
    };


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

    const SubmitBtnClicked = () => {
        alert('Submit clicked!');
    };

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
                    {renderField('Owner Name', stallDetails.ownerName, true)}
                    {renderField('Business Name', stallDetails.businessName, true)}
                    {renderField('Mobile Number', stallDetails.mobileNumber)}
                    {renderField('Alternate Mobile', stallDetails.altMobile)}
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

