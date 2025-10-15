import { ConfigContext } from 'context/ConfigContext';
import React, { useContext, useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { ViewVendorDetails } from 'services/Vendor/VendorApi';
const ViewDetails = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
    const { setLoader } = useContext(ConfigContext);
    const [vendorList, setVendorList] = useState(null)

    useEffect(() => {
        if (show) {
            ViewVendorDetailsData()
        }
    }, [show])

    const ViewVendorDetailsData = async () => {
        setLoader(true);
        try {
            const response = await ViewVendorDetails(modelRequestData?.vendorID);

            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        setVendorList(List);
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
                                <th scope="row" className="text-nowrap">Vendor Name</th>
                                <td>{vendorList?.vendorName}</td>
                            </tr>
                            <tr>
                                <th scope="row" className="text-nowrap">Contact Person</th>
                                <td>{vendorList?.contactPersonName}</td>
                            </tr>
                            <tr>
                                <th scope="row" className="text-nowrap">Contact Number</th>
                                <td>{vendorList?.contactNumber}</td>
                            </tr>
                            <tr>
                                <th scope="row" className="text-nowrap">Email ID</th>
                                <td>{vendorList?.emailID}</td>
                            </tr>
                            <tr>
                                <th scope="row" className="text-nowrap">Address</th>
                                <td>{vendorList?.address}</td>
                            </tr>
                            <tr>
                                <th scope="row">GST Number</th>
                                <td>{vendorList?.gstNumber}</td>
                            </tr>
                            <tr>
                                <th scope="row">    PAN Number</th>
                                <td>{vendorList?.panNumber}</td>
                            </tr>
                            <tr>
                                <th scope="row">Status</th>
                                <td>{vendorList?.status}</td>
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

export default ViewDetails
