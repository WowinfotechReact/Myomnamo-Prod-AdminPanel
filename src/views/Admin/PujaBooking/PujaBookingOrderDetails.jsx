import { ConfigContext } from 'context/ConfigContext';
import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Table } from 'react-bootstrap';
import { GetPujaBookingOrderDetailsAPI } from 'services/Admin/PujaBookingAPI/PujaBookingAPI';

const PujaBookingOrderDetails = ({ show, onHide, modelRequestData }) => {
  const { setLoader } = useContext(ConfigContext);
  const [orderBookingData, setOrderBookingData] = useState([]);

  useEffect(() => {
    if (show) {
      PujaBookingOrderDetailsData();
    }
  }, [show]);

  const PujaBookingOrderDetailsData = async () => {
    // debugger;
    setLoader(true);
    try {
      const response = await GetPujaBookingOrderDetailsAPI(modelRequestData?.pujaBookingKeyID);

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const List = response.data.responseData.data[0];
            setOrderBookingData(List);
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

  console.log(location.pathname);

  return (
    <Modal style={{ zIndex: 1300 }} show={show} backdrop="static" keyboard={false} centered size="lg">
      <Modal.Header>
        {location.pathname === '/pandit-puja-booking' ? (
          <h4 className="text-center">Puja Booking Order Details </h4>
        ) : location.pathname === '/daily-pandit-puja-booking' ? (
          <h4 className="text-center">Daily Pandit Booking Order Details </h4>
        ) : location.pathname === '/remedy-puja-booking' ? (
          <h4 className="text-center">Remedy Puja Booking Order Details </h4>
        ) : location.pathname === '/homam-booking' ? (
          <h4 className="text-center">Homam Booking Order Details </h4>
        ) : location.pathname === '/subscription-puja-booking' ? (
          <h4 className="text-center">Subscription Puja Booking Order Details </h4>
        ) : location.pathname === '/subscription-homam-booking' ? (
          <h4 className="text-center">Subscription Homam Booking Order Details </h4>
        ) : location.pathname === '/puja-at-temple-booking' ? (
          <h4 className="text-center">Puja At Temple Booking Order Details </h4>
        ) : (
          ''
        )}
      </Modal.Header>
      <Modal.Body>
        {/* Customer + Payment details in two columns */}
        <Row>
          <Col md={6}>
            <h5 className="mb-3">Customer Details</h5>
            <Table bordered>
              <tbody>
                <tr>
                  <th>Booking ID</th>
                  <td>{orderBookingData.bookingID}</td>
                </tr>
                <tr>
                  <th>Booking Date</th>
                  <td>{orderBookingData.bookingDate}</td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>{orderBookingData.userName}</td>
                </tr>
                <tr>
                  <th>Gotra</th>
                  <td>{orderBookingData.gotra}</td>
                </tr>
                <tr>
                  <th>Date of Birth</th>
                  <td>{orderBookingData.dateOfBirth}</td>
                </tr>
                <tr>
                  <th>Birth Time</th>
                  <td>{orderBookingData.dateOfTime}</td>
                </tr>
                <tr>
                  <th>Birth Place</th>
                  <td>{orderBookingData.birthPlace}</td>
                </tr>
                <tr>
                  <th>Mobile No</th>
                  <td>{orderBookingData.mobileNo}</td>
                </tr>
              </tbody>
            </Table>
          </Col>

          <Col md={6}>
            <h5 className="mb-3">Payment Details</h5>
            <Table bordered>
              <tbody>
                <tr>
                  <th>Payment Type</th>
                  <td>{orderBookingData.paymentType}</td>
                </tr>
                <tr>
                  <th>Payment Status</th>
                  <td>{orderBookingData.paymentStatus}</td>
                </tr>
                <tr>
                  <th>Transaction Amount</th>
                  <td>₹{orderBookingData.transactionAmount}</td>
                </tr>
                <tr>
                  <th>Total Amount</th>
                  <td>₹{orderBookingData.totalAmount}</td>
                </tr>
                <tr>
                  <th>Pandit Status</th>
                  <td>{orderBookingData.panditStatus}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* Puja details full width */}
        <h5 className="mt-4 mb-3">Puja Details</h5>
        <Table bordered>
          <tbody>
            <tr>
              <th>Puja Name</th>
              <td>{orderBookingData.pujaName}</td>
            </tr>
            <tr>
              <th>Puja Type</th>
              <td>{orderBookingData.pujaType}</td>
            </tr>
            <tr>
              <th>Puja Image</th>
              <td>
                <img
                  src={orderBookingData.pujaImageUrl}
                  alt="Puja"
                  style={{ width: '300px', height: '100px', borderRadius: '5px', objectFit: 'cover' }}
                />
              </td>
            </tr>
            <tr>
              <th>Puja Samagri</th>
              <td dangerouslySetInnerHTML={{ __html: orderBookingData.pujaSamagri }} />
            </tr>
            <tr>
              <th>Puja Details</th>
              <td dangerouslySetInnerHTML={{ __html: orderBookingData.pujaDetails }} />
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PujaBookingOrderDetails;
