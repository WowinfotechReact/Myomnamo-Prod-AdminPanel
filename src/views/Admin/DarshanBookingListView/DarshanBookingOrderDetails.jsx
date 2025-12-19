import { ConfigContext } from 'context/ConfigContext';
import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { GetPujaBookingOrderDetailsAPI } from 'services/Admin/PujaBookingAPI/PujaBookingAPI';

const DarshanBookingOrderDetails = ({ show, onHide, modelRequestData }) => {
  const { setLoader } = useContext(ConfigContext);
  const [orderBookingData, setOrderBookingData] = useState([]);
  const [expandSamagri, setExpandSamagri] = useState(false);
  const [expandDetails, setExpandDetails] = useState(false);

  useEffect(() => {
    if (show) PujaBookingOrderDetailsData();
  }, [show]);

  const PujaBookingOrderDetailsData = async () => {
    setLoader(true);
    try {
      const response = await GetPujaBookingOrderDetailsAPI(modelRequestData?.pujaBookingKeyID);

      if (response?.data?.statusCode === 200) {
        const List = response.data.responseData.data[0];
        setOrderBookingData(List);
      } else {
        console.error(response?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <Modal style={{ zIndex: 1300 }} show={show} backdrop="static" keyboard={false} centered size="lg">
      <Modal.Header>
        {location.pathname === '/pandit-puja-booking' ? (
          <h4 className="text-center">Puja Booking Order Details</h4>
        ) : location.pathname === '/daily-pandit-puja-booking' ? (
          <h4 className="text-center">Daily Pandit Booking Details</h4>
        ) : location.pathname === '/remedy-puja-booking' ? (
          <h4 className="text-center">Remedy Puja Booking Order Details</h4>
        ) : location.pathname === '/homam-booking' ? (
          <h4 className="text-center">Homam Booking Order Details</h4>
        ) : location.pathname === '/subscription-puja-booking' ? (
          <h4 className="text-center">Subscription Puja Booking Order Details</h4>
        ) : location.pathname === '/subscription-homam-booking' ? (
          <h4 className="text-center">Subscription Homam Booking Order Details</h4>
        ) : location.pathname === '/puja-at-temple-booking' ? (
          <h4 className="text-center">Puja At Temple Booking Order Details</h4>
        ) : (
          ''
        )}
      </Modal.Header>

      <Modal.Body className="bg-light p-3" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
        {/* HEADER SECTION */}
        <h5 className="border-bottom pb-2 fw-semibold mb-3">Booking Summary</h5>

        {/* UNIFIED DETAILS CARD */}
        <div className="bg-white border rounded p-3 small shadow-sm">
          <Row className="g-3">
            {/* Customer */}
            {/* <Col md={4}>
              <div className="fw-semibold border-bottom pb-1 mb-2">Customer</div>
              <div className="d-flex flex-column gap-1">
                {orderBookingData.bookingID && <div><span className="fw-semibold">Booking ID :</span> {orderBookingData.bookingID}</div>}
                {orderBookingData.bookingDate && <div><span className="fw-semibold">Booking Date :</span> {orderBookingData.bookingDate}</div>}
                {orderBookingData.userName && <div><span className="fw-semibold">Name :</span> {orderBookingData.userName}</div>}
                {orderBookingData.gotra && <div><span className="fw-semibold">Gotra :</span> {orderBookingData.gotra}</div>}
                {orderBookingData.dateOfBirth && <div><span className="fw-semibold">DOB :</span> {orderBookingData.dateOfBirth}</div>}
                {orderBookingData.birthPlace && <div><span className="fw-semibold">Birth Place :</span> {orderBookingData.birthPlace}</div>}
                {orderBookingData.mobileNo && <div><span className="fw-semibold">Mobile :</span> {orderBookingData.mobileNo}</div>}
              </div>
            </Col> */}

            {/* Payment */}
            {/* <Col md={4}>
              <div className="fw-semibold border-bottom pb-1 mb-2">Payment</div>
              <div className="d-flex flex-column gap-1">
                {orderBookingData.paymentType && <div><span className="fw-semibold">Type :</span> {orderBookingData.paymentType}</div>}
                {orderBookingData.paymentStatus && <div><span className="fw-semibold">Status :</span> {orderBookingData.paymentStatus}</div>}
                {orderBookingData.transactionAmount && <div><span className="fw-semibold">Transaction :</span> ₹{orderBookingData.transactionAmount}</div>}
                {orderBookingData.totalAmount && <div><span className="fw-semibold">Total :</span> ₹{orderBookingData.totalAmount}</div>}
                {orderBookingData.panditStatus && <div><span className="fw-semibold">Pandit Status :</span> {orderBookingData.panditStatus}</div>}
              </div>
            </Col> */}

            {/* Pandit */}
            {/* <Col md={4}>
              <div className="fw-semibold border-bottom pb-1 mb-2">Pandit</div>
              <div className="d-flex flex-column gap-1">
                {orderBookingData.panditName && <div><span className="fw-semibold">Name :</span> {orderBookingData.panditName}</div>}
                {orderBookingData.panditContactNumber && <div><span className="fw-semibold">Contact :</span> {orderBookingData.panditContactNumber}</div>}
                {orderBookingData.pujaStartTime && orderBookingData.pujaEndTime && (
                  <div><span className="fw-semibold">Timing :</span> {`${orderBookingData.pujaStartTime} - ${orderBookingData.pujaEndTime}`}</div>
                )}
                {orderBookingData.pujaStatus && <div><span className="fw-semibold">Puja Status :</span> {orderBookingData.pujaStatus}</div>}
              </div>
            </Col> */}
          </Row>
        </div>

        {/* PUJA DETAILS */}
        <h5 className="border-bottom pb-2 fw-semibold mt-4 mb-2">Temple Details</h5>
        <div className="bg-white border rounded p-3 small shadow-sm">
          <Row className="g-2">
            <Col md={6}>
              {orderBookingData.pujaName && <div><span className="fw-semibold">Puja Name :</span> {orderBookingData.pujaName}</div>}
            </Col>
            <Col md={6}>
              {orderBookingData.pujaType && <div><span className="fw-semibold">Type :</span> {orderBookingData.pujaType}</div>}
            </Col>

            {orderBookingData.pujaImageUrl && (
              <Col md={6}>
                <img
                  src={orderBookingData.pujaImageUrl}
                  alt="Puja"
                  className="rounded shadow-sm my-2"
                  style={{ width: '200px', height: '90px', objectFit: 'cover' }}
                />
              </Col>
            )}

            {/* PUJA SAMAGRI
            <Col md={12} className="mb-2">
              <div className="fw-semibold mb-1">Puja Samagri</div>
              <div className="border rounded p-2 bg-light-subtle small">
                <div
                  dangerouslySetInnerHTML={{
                    __html: orderBookingData.pujaSamagri || '<i>No details available</i>',
                  }}
                  style={{
                    maxHeight: expandSamagri ? 'none' : '120px',
                    overflow: expandSamagri ? 'visible' : 'hidden',
                    transition: 'max-height 0.3s ease',
                  }}
                />
                <div className="text-end mt-1">
                  <button
                    className="btn btn-link p-0 text-decoration-none small"
                    onClick={() => setExpandSamagri((prev) => !prev)}
                    style={{ color: '#a52444' }}
                  >
                    {expandSamagri ? 'View Less ▲' : 'View More ▼'}
                  </button>
                </div>
              </div>
            </Col>

            {/* PUJA DETAILS */}
            {/* <Col md={12}>
              <div className="fw-semibold mb-1">Puja Details</div>
              <div className="border rounded p-2 bg-light-subtle small">
                <div
                  dangerouslySetInnerHTML={{
                    __html: orderBookingData.pujaDetails || '<i>No details available</i>',
                  }}
                  style={{
                    maxHeight: expandDetails ? 'none' : '120px',
                    overflow: expandDetails ? 'visible' : 'hidden',
                    transition: 'max-height 0.3s ease',
                  }}
                />
                <div className="text-end mt-1">
                  <button
                    className="btn btn-link p-0 text-decoration-none small"
                    onClick={() => setExpandDetails((prev) => !prev)}
                    style={{ color: '#a52444' }}
                  >
                    {expandDetails ? 'View Less ▲' : 'View More ▼'}
                  </button>
                </div>
              </div>
            </Col> */} 
          </Row>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DarshanBookingOrderDetails;
