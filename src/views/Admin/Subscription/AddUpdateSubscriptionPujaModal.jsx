
import ErrorModal from 'component/ErrorModal';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import SuccessPopupModal from 'component/SuccessPopupModal';

import { ConfigContext } from 'context/ConfigContext';
import { isValid } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { AddUpdateTemplePujaSubscription, GetTemplePujaSubscriptionLookupList } from 'services/Admin/Puja/PujaApi';
const AddUpdateSubscriptionPujaModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
    const { setLoader, user } = useContext(ConfigContext);

    const [customError, setCustomError] = useState(null)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [error, setError] = useState(false)


    const [selectedPuja, setSelectedPuja] = useState([]);
    const [pujaList, setPujaList] = useState([])

    useEffect(() => {
        if (show) {
            GetTemplePujaSubscriptionLookupListData()
        }
    }, [show])

    const GetTemplePujaSubscriptionLookupListData = async () => {
        setLoader(true)
        try {
            const response = await GetTemplePujaSubscriptionLookupList(modelRequestData?.pujaSubServiceID, modelRequestData?.pujaServiceID); // Ensure it's correctly imported

            if (response?.data?.statusCode === 200) {

                const list = response?.data?.responseData?.data || [];
                if (modelRequestData?.pujaSubServiceID === 3) {
                    const selectedPuja = list
                        .filter(item => item.isSubscriptionRemedyPuja)   // ✅ filter condition
                        .map(item => item.pujaID);
                    setSelectedPuja(selectedPuja)
                } else if (modelRequestData?.pujaSubServiceID === 4) {
                    const selectedPuja = list
                        .filter(item => item.isSubscriptionHomamPuja)   // ✅ filter condition
                        .map(item => item.pujaID);
                    setSelectedPuja(selectedPuja)
                }



                setLoader(false)
                setPujaList(list);
            } else {
                setLoader(false)
                console.error(
                    "Failed to fetch sim Type lookup list:",
                    response?.data?.statusMessage || "Unknown error"
                );
            }
        } catch (error) {
            setLoader(false)
            console.error("Error fetching sim Type lookup list:", error);
        }
    };

    const SubmitBtnClicked = () => {

        let isValid = true
        if (selectedPuja?.length === 0) {
            setError(true)
            isValid = false
        }
        const apiParam = {
            pujaServiceID: modelRequestData?.pujaServiceID,
            pujaSubServiceID: modelRequestData?.pujaSubServiceID,
            pujaID: selectedPuja
        }

        if (isValid) {
            AddUpdateTemplePujaSubscriptionData(apiParam)
        }
    }

    const AddUpdateTemplePujaSubscriptionData = async (ApiParam) => {
        setLoader(true);
        try {
            const response = await AddUpdateTemplePujaSubscription(ApiParam);
            if (response?.data?.statusCode === 200) {
                setLoader(false);
                setShowSuccessModal(true)
                setIsAddUpdateDone(true)
                onHide()
            } else {
                console.error(response?.data?.errorMessage);
                setCustomError(response?.response?.data?.errorMessage)
                setShowErrorModal(true)
                setLoader(false);
            }
        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    }
    // Check/uncheck a single puja
    const handlePujaChange = (puja) => {
        if (selectedPuja.includes(puja)) {
            setSelectedPuja(selectedPuja.filter((p) => p !== puja));
        } else {
            setSelectedPuja([...selectedPuja, puja]);
        }
    };

    // Select all
    const handleSelectAll = () => {
        if (selectedPuja.length === pujaList.length) {
            setSelectedPuja([]); // deselect all
        } else {
            setSelectedPuja(pujaList.map((p) => p.pujaID)); // only IDs
        }
    };


    const closeAll = () => {
        onHide()
        setError(false);
        setSelectedPuja([])
        setCustomError(null);
        setShowSuccessModal(false)

    }

    console.log("selectedPuja", selectedPuja)
    return (
        <>
            <Modal style={{ zIndex: 1300 }} show={show} backdrop="static" keyboard={false} centered>
                <Modal.Header>
                    <h4 className="text-center">{modelRequestData?.Action === null ? 'Add Puja ' : 'Update Puja '}</h4>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
                    <div className="container-fluid ">

                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <label htmlFor="daysInterested" className="form-label">
                                    Select Puja  <span className="text-danger">*</span>
                                </label>

                                <div className="row border border-grey rounded p-1 ">
                                    <div className="row mb-2">
                                        <div className="col-12">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="selectAll"
                                                    checked={selectedPuja.length === pujaList.length}
                                                    onChange={handleSelectAll}
                                                />
                                                <label className="form-check-label" htmlFor="selectAll">
                                                    {selectedPuja.length === pujaList.length
                                                        ? "Deselect All"
                                                        : "Select All"}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    {pujaList.map((value) => (
                                        <div key={value.pujaID} className="col-12 col-md-4 mb-2">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={value.pujaID}
                                                    id={`value-${value.pujaID}`}
                                                    checked={selectedPuja.includes(value.pujaID)}

                                                    onChange={() => handlePujaChange(value.pujaID)}
                                                />
                                                <label className="form-check-label" htmlFor={`value-${value.pujaID}`}>
                                                    {value.pujaName}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                    {error && (selectedPuja?.length === 0) ? <span className="text-danger">Select at least one puja</span> : ''}
                                </div>
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
                            SubmitBtnClicked();
                        }}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal >
            <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={modelRequestData?.Action === null ? 'New Subscription Pujas Added Successfully !' : ' Subscription Pujas Updated Successfully !'} />
            <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
        </>
    )
}

export default AddUpdateSubscriptionPujaModal
