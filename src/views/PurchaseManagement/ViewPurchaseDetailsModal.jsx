import React from 'react'
import { Modal, Button } from 'react-bootstrap';
const ViewPurchaseDetailsModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
    return (
        <>
            <Modal style={{ zIndex: 1300 }} show={show} backdrop="static" keyboard={false} centered>
                <Modal.Header>
                    <h4 className="text-center">View Details</h4>
                </Modal.Header>
                <Modal.Body>

                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <th scope="row">PO Number</th>
                                <td>{modelRequestData?.data?.PONumber}</td>
                            </tr>
                            <tr>
                                <th scope="row">Vendor Name	</th>
                                <td>{modelRequestData?.data?.vendorName}</td>
                            </tr>
                            <tr>
                                <th scope="row">PO Date	</th>
                                <td>{modelRequestData?.data?.PODate}</td>
                            </tr>
                            <tr>


                                <th scope="row">Raw Material Items	</th>
                                <td>{modelRequestData?.data?.rawMaterialItems}</td>
                            </tr>
                            <tr>
                                <th scope="row">Quantity</th>
                                <td>{modelRequestData?.data?.qty}</td>
                            </tr>
                            <tr>
                                <th scope="row">Order Status</th>
                                <td>{modelRequestData?.data?.orderStatus}</td>
                            </tr>
                            <tr>
                                <th scope="row">Payment Status	</th>
                                <td>{modelRequestData?.data?.paymentStatus}</td>
                            </tr>
                        </tbody>
                    </table>




                </Modal.Body>
                <Modal.Footer>


                    <Button variant="secondary" onClick={() => onHide()}>

                        Close
                    </Button>

                    <Button
                        variant="primary"
                        onClick={() => {
                            onHide();
                        }}
                    >
                        Done
                    </Button>

                </Modal.Footer>

            </Modal>
        </>
    )
}

export default ViewPurchaseDetailsModal
