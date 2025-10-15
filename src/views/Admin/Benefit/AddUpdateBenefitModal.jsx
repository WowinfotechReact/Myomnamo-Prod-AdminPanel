import ErrorModal from 'component/ErrorModal';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import React, { useContext, useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { GetAppLanguageLookupList } from 'services/Admin/AppLangauge/AppLanguageApi';
import { AddUpdateBenefit, GetBenefitModel } from 'services/Admin/TempleApi/Benefit/BenefitApi';
import Select from 'react-select';

const AddUpdateBenefitModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
    const { setLoader, isValidEmail, isValidGST, isValidPAN, user } = useContext(ConfigContext);

    const [error, setError] = useState(false)
    const [customError, setCustomError] = useState(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)

    const [languageList, setLanguageList] = useState([])
    const [benefitFormObj, setBenefitFormObj] = useState({
        benefitName: null, appLangID: null
    })

    useEffect(() => {
        if (show) {
            if (modelRequestData?.Action === 'update' && modelRequestData?.benefitKeyID !== null && modelRequestData?.benefitKeyID !== "") {
                GetBenefitModelData()
            }
            GetAppLanguageLookupListData()
        }
    }, [show])


    const GetAppLanguageLookupListData = async () => {

        try {
            const response = await GetAppLanguageLookupList(); // Ensure it's correctly imported

            if (response?.data?.statusCode === 200) {
                const list = response?.data?.responseData?.data || [];

                const formattedLangList = list.map((Lang) => ({
                    value: Lang.appLangID,
                    label: Lang.languageName,
                }));
                const filteredList = formattedLangList?.filter(((prev) => prev.value !== 1))
                setLanguageList(filteredList);
            } else {
                console.error(
                    "Failed to fetch sim Type lookup list:",
                    response?.data?.statusMessage || "Unknown error"
                );
            }
        } catch (error) {
            console.error("Error fetching sim Type lookup list:", error);
        }
    };



    const handleChange = (e) => {
        let { id, value } = e.target;
        if (id === "benefitName") {
            value = value.replace(/^\s+/, '');   // trims only the *leading* spaces

            value = value.replace(/[0-9]/g, '');
            value = value.charAt(0).toUpperCase() + value.slice(1);
        }

        setBenefitFormObj((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const SubmitBtnClicked = () => {

        let isValid = true
        if (benefitFormObj?.benefitName === null || benefitFormObj?.benefitName === undefined || benefitFormObj?.benefitName === "") {
            setError(true)
            isValid = false
        } else if (modelRequestData?.moduleName === 'LanguageWiseList' && (benefitFormObj?.appLangID === null || benefitFormObj?.appLangID === undefined || benefitFormObj?.appLangID === "")) {
            setError(true)
            isValid = false
        }

        const apiParam = {
            adminID: user?.admiN_ID,
            benefitKeyID: modelRequestData?.benefitKeyID,
            benefitName: benefitFormObj?.benefitName,
            appLangID: modelRequestData?.moduleName === "LanguageWiseList" ? benefitFormObj?.appLangID : null,
            benefitByLangKeyID: modelRequestData?.moduleName === "LanguageWiseList" ? modelRequestData?.benefitByLangKeyID : null
        }
        if (isValid) {
            console.log('ApiParam', apiParam)
            AddUpdateBenefitData(apiParam)
        }
    }

    const GetBenefitModelData = async () => {
        setLoader(true);
        try {
            const response = await GetBenefitModel(modelRequestData?.benefitKeyID, modelRequestData?.appLangID);

            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        setBenefitFormObj((prev) => ({
                            ...prev, benefitName: List?.benefitName,
                            appLangID: List?.appLangID
                        }))
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

    const AddUpdateBenefitData = async (ApiParam) => {

        setLoader(true);
        try {
            const response = await AddUpdateBenefit(ApiParam);
            if (response?.data?.statusCode === 200) {
                setLoader(false);
                setShowSuccessModal(true)
                setIsAddUpdateDone(true)
                onHide()
            } else {
                console.error(response?.response?.data?.errorMessage);
                setCustomError(response?.response?.data?.errorMessage)
                setShowErrorModal(true)
                setLoader(false);
            }
        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    }

    const SetDataInitial = () => {
        setBenefitFormObj((prev) => ({
            ...prev, benefitName: null,
            appLangID: null
        }))
    }

    const closeAll = () => {
        SetDataInitial()
        setError(false);
        setCustomError(null);
        setShowSuccessModal(false)
        onHide()

    }


    return (
        <>
            <Modal style={{ zIndex: 1300 }} show={show} backdrop="static" keyboard={false} centered>
                <Modal.Header>
                    <h4 className="text-center">{modelRequestData?.Action === null ? 'Add Benefit' : 'Update Benefit'}</h4>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
                    <div className="container-fluid ">

                        <div className="row">
                            {/* Benefit Name */}
                            <div className="col-md-12 mb-3">
                                <label htmlFor="benefitName" className="form-label">
                                    Benefit Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control my-box"
                                    id="benefitName"
                                    value={benefitFormObj?.benefitName || ''}
                                    onChange={handleChange}
                                    placeholder="Enter Benefit Name"
                                    maxLength={80}
                                />
                                {error && (!benefitFormObj?.benefitName) && (
                                    <span className="text-danger">{ERROR_MESSAGES}</span>
                                )}
                            </div>

                            {/* Language Selection */}
                            {modelRequestData?.moduleName === 'LanguageWiseList' && (
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="stateID" className="form-label">
                                        Select Language <span className="text-danger">*</span>
                                    </label>
                                    <Select
                                        options={languageList}
                                        value={languageList?.filter((v) => v?.value === benefitFormObj?.appLangID)}
                                        onChange={(selectedOption) =>
                                            setBenefitFormObj((prev) => ({
                                                ...prev,
                                                appLangID: selectedOption ? selectedOption.value : null,
                                            }))
                                        }
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                    />
                                    {error && (!benefitFormObj?.appLangID) && (
                                        <span className="text-danger">{ERROR_MESSAGES}</span>
                                    )}
                                </div>
                            )}

                        </div>

                    </div>



                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => closeAll()}>
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
            <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={modelRequestData?.Action === null ? 'New Benefit Added Successfully !' : ' Benefit Updated Successfully !'} />
            <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
        </>
    )
}

export default AddUpdateBenefitModal
