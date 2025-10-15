import { ConfigContext } from 'context/ConfigContext';
import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Table } from 'react-bootstrap';
import { GetEstoreBookingOrderDetailsAPI } from 'services/Admin/PujaBookingAPI/EstoreBookingAPI';
import { GetPujaBookingOrderDetailsAPI } from 'services/Admin/PujaBookingAPI/PujaBookingAPI';

const EstoreBookingOrderDetails = ({ show, onHide, modelRequestData }) => {
  const { setLoader } = useContext(ConfigContext);
  const [orderBookingData, setOrderBookingData] = useState([]);
  // Static JSON (replace later with API response)

  useEffect(() => {
    if (show) {
      EstoreBookingOrderDetailsData();
    }
  }, [show]);

  const EstoreBookingOrderDetailsData = async () => {
    // debugger;
    setLoader(true);
    try {
      const response = await GetEstoreBookingOrderDetailsAPI(modelRequestData?.estoreBookingKeyID);

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
        <h4 className="text-center">Estore Booking Order Details </h4>
      </Modal.Header>
      <Modal.Body>
        {orderBookingData && (
          <>
            {/* Order Summary Section */}
            <h5 className="mb-3">Order Summary</h5>
            <Table bordered>
              <tbody>
                <tr>
                  <th>Booking ID</th>
                  <td>{orderBookingData.bookingID}</td>
                </tr>
                <tr>
                  <th>Coupon Code ID</th>
                  <td>{orderBookingData.couponCodeID || 'N/A'}</td>
                </tr>
                <tr>
                  <th>Coupon Discount</th>
                  <td>₹{orderBookingData.couponCodeAmount?.toFixed(2)}</td>
                </tr>
                <tr>
                  <th>Wallet Amount Used</th>
                  <td>₹{orderBookingData.walletAmount?.toFixed(2)}</td>
                </tr>
                <tr>
                  <th>Subtotal</th>
                  <td>₹{orderBookingData.totalPrice?.toFixed(2)}</td>
                </tr>
                <tr>
                  <th>Tax ({orderBookingData.taxPercentage}%)</th>
                  <td>₹{orderBookingData.taxAmount?.toFixed(2)}</td>
                </tr>
                <tr>
                  <th>Total After Tax</th>
                  <td>₹{orderBookingData.totalAmountAfterTax?.toFixed(2)}</td>
                </tr>
                <tr>
                  <th>Shipping Charges</th>
                  <td>₹{orderBookingData.shippingCharges?.toFixed(2)}</td>
                </tr>
                <tr>
                  <th>Grand Total</th>
                  <td>
                    <strong>₹{orderBookingData.grandTotal?.toFixed(2)}</strong>
                  </td>
                </tr>
              </tbody>
            </Table>

            {/* Product Items Section */}
            <h5 className="mt-4 mb-3">Product Details</h5>
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Discount</th>
                  <th>Order Date</th>
                  <th>Address</th>
                  <th>Payment Type</th>
                  <th>Transaction Amount</th>
                  <th>Remaining Amount</th>
                </tr>
              </thead>
              <tbody>
                {orderBookingData.adminProductItem?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.productName}</td>
                    <td>₹{item.price?.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.discount?.toFixed(2)}</td>
                    <td>{item.orderDate}</td>
                    <td>{item.orderAddress}</td>
                    <td>{item.paymentType}</td>
                    <td>₹{item.transactionAmount?.toFixed(2)}</td>
                    <td>₹{item.remainingAmount?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EstoreBookingOrderDetails;
