import { ConfigContext } from 'context/ConfigContext';
import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { GetProductSubPackageOrderDetails } from 'services/Admin/PujaBookingAPI/EstoreBookingAPI';


const PujaKitSubscriptionOrderDetails = ({ show, onHide, modelRequestData }) => {
    const { setLoader } = useContext(ConfigContext);
    const [orderBookingData, setOrderBookingData] = useState([]);
    const [expandSamagri, setExpandSamagri] = useState(false);
    const [expandDetails, setExpandDetails] = useState(false);

    useEffect(() => {
        if (show) GetProductSubPackageOrderDetailsData();
    }, [show]);

    const GetProductSubPackageOrderDetailsData = async () => {
        setLoader(true);
        try {
            const response = await GetProductSubPackageOrderDetails(modelRequestData?.estoreBookingKeyID);

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
                <h4 className="text-center">Puja Kit Booking Order Details</h4>
            </Modal.Header>

            <Modal.Body className="bg-light p-3" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                {/* HEADER SECTION */}
                <h5 className="border-bottom pb-2 fw-semibold mb-3">Booking Summary</h5>

                {/* UNIFIED DETAILS CARD */}
                <div className="bg-white border rounded p-3 small shadow-sm">
                    <Row className="g-3">
                        {/* Customer */}
                        <Col md={6}>
                            <div className="fw-semibold border-bottom pb-1 mb-2">Customer</div>
                            <div className="d-flex flex-column gap-1">
                                {orderBookingData.bookingID && <div><span className="fw-semibold">Booking ID :</span> {orderBookingData.bookingID}</div>}
                                {orderBookingData.bookingDate && <div><span className="fw-semibold">Booking Date :</span> {orderBookingData.bookingDate}</div>}
                                {orderBookingData.userName && <div><span className="fw-semibold">Name :</span> {orderBookingData.userName}</div>}

                                {orderBookingData.mobileNo && <div><span className="fw-semibold">Mobile :</span> {orderBookingData.mobileNo}</div>}
                            </div>
                        </Col>

                        {/* Payment */}
                        <Col md={6}>
                            <div className="fw-semibold border-bottom pb-1 mb-2">Payment</div>
                            <div className="d-flex flex-column gap-1">
                                {orderBookingData.paymentType && <div><span className="fw-semibold">Type :</span> {orderBookingData.paymentType}</div>}
                                {orderBookingData.paymentStatus && <div><span className="fw-semibold">Status :</span> {orderBookingData.paymentStatus}</div>}
                                {orderBookingData.transactionAmount && <div><span className="fw-semibold">Transaction :</span> ₹{orderBookingData.transactionAmount}</div>}
                                {orderBookingData.totalAmount && <div><span className="fw-semibold">Total :</span> ₹{orderBookingData.totalAmount}</div>}
                                {orderBookingData.panditStatus && <div><span className="fw-semibold">Pandit Status :</span> {orderBookingData.panditStatus}</div>}
                            </div>
                        </Col>


                    </Row>
                </div>

                {/* PUJA DETAILS */}
                <h5 className="border-bottom pb-2 fw-semibold mt-4 mb-2">Puja Kit Details</h5>
                <div className="bg-white border rounded p-3 small shadow-sm">
                    <Row className="g-2">
                        <Col md={6}>
                            {orderBookingData.productName && <div><span className="fw-semibold">Puja Name :</span> {orderBookingData.productName}</div>}
                        </Col>
                        <Col md={6}>
                            {orderBookingData.packageTitle && <div><span className="fw-semibold">Package Title :</span> {orderBookingData.packageTitle}</div>}
                        </Col>

                        {orderBookingData.productImageUrl && (
                            <Col md={6}>
                                <img
                                    src={orderBookingData.productImageUrl}
                                    alt="Puja Kit Susbcription"
                                    className="rounded shadow-sm my-2"
                                    style={{ width: '200px', height: '90px', objectFit: 'cover' }}
                                    loading='lazy'
                                />
                            </Col>
                        )}

                        {/* PUJA SAMAGRI */}
                        <Col md={12} className="mb-2">
                            <div className="fw-semibold mb-1">Product Details</div>
                            <div className="border rounded p-2 bg-light-subtle small">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: orderBookingData.description || '<i>No details available</i>',
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

export default PujaKitSubscriptionOrderDetails;
