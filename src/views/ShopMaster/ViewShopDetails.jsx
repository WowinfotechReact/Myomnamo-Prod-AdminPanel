import React from 'react'
import { Modal, Button } from 'react-bootstrap';
const ViewShopDetails = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
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
                                <th scope="row">Shop Name</th>
                                <td>{modelRequestData?.data?.shopName}</td>
                            </tr>
                            <tr>
                                <th scope="row">Shop Code	</th>
                                <td>{modelRequestData?.data?.shopCode}</td>
                            </tr>
                            <tr>
                                <th scope="row">Owner Name	</th>
                                <td>{modelRequestData?.data?.ownerName}</td>
                            </tr>
                            <tr>


                                <th scope="row">Contact Number	</th>
                                <td>{modelRequestData?.data?.contactNumber}</td>
                            </tr>
                            <tr>
                                <th scope="row">Email ID</th>
                                <td>{modelRequestData?.data?.emailID}</td>
                            </tr>
                            <tr>
                                <th scope="row">Address</th>
                                <td>{modelRequestData?.data?.address}</td>
                            </tr>
                            <tr>
                                <th scope="row">Status</th>
                                <td>{modelRequestData?.data?.status ? 'Enabled' : 'Disabled'}</td>
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

export default ViewShopDetails
