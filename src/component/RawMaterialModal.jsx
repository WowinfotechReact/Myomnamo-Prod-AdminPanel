import React from 'react'
import { Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import Select from 'react-select';
import 'react-calendar/dist/Calendar.css';
const RawMaterialModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
    return (
        <>
            <Modal style={{ zIndex: 1300 }} show={show} backdrop="static" keyboard={false} centered>
                <Modal.Header>
                    <h4 className="text-center">Update Raw material</h4>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <div className="row mb-1 ">
                            {/* Vendor Name */}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="materialName" className="form-label">
                                    Material  Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    type='text'
                                    className="form-control " // reserve space for icon
                                    id="materialName"
                                    placeholder="Enter Material Name"
                                    value={modelRequestData?.data?.itemName || ''}
                                />
                            </div>

                            {/* PO Date */}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="category" className="form-label">
                                    Category <span className="text-danger">*</span>
                                </label>
                                <input
                                    type='text'
                                    className="form-control " // reserve space for icon
                                    id="category"
                                    placeholder="Enter Category"
                                    value={modelRequestData?.data?.itemType || ''}
                                />
                            </div>
                        </div>

                        <div className="row mb-1 ">
                            {/* Raw Material Items*/}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="stockBefore" className="form-label">Stock Before Purchase<span className='text-danger'>*</span></label>
                                <input
                                    type='text'
                                    className="form-control " // reserve space for icon
                                    id="stockBefore"
                                    placeholder="Enter Stock Before"
                                    value={modelRequestData?.data?.currentStock || ''}
                                />
                            </div>

                            {/* Quantity */}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="contactNumber" className="form-label">
                                    Purchased   Quantity <span className="text-danger">*</span>
                                </label>
                                <input
                                    type='text'
                                    className="form-control " // reserve space for icon
                                    id="contactNumber"
                                    placeholder="Enter Quantity"
                                    value={modelRequestData?.data?.openingStock || ''}
                                />
                            </div>
                        </div>

                        <div className="row mb-1 ">
                            {/* Unit Price  */}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="PAN" className="form-label">
                                    Updated Stock<span className="text-danger">*</span>
                                </label>
                                <input
                                    type='text'
                                    className="form-control " // reserve space for icon
                                    id="PAN"
                                    placeholder="Enter Unit Price"
                                    value={modelRequestData?.data?.currentStock - modelRequestData?.data?.openingStock || ''}
                                />
                            </div>


                            {/* Total Amount */}
                            <div className="col-md-6 mb-1">
                                <label htmlFor="GST" className="form-label">
                                    Last Updated <span className="text-danger">*</span>
                                </label>
                                <input
                                    type='text'
                                    className="form-control " // reserve space for icon
                                    id="GST"
                                    placeholder="Enter Total Amount"
                                    value={modelRequestData?.data?.lastUpdate || ''}
                                />
                            </div>
                        </div>


                    </div>
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
                        Submit
                    </Button>
                </Modal.Footer>

            </Modal>
        </>
    )
}

export default RawMaterialModal
