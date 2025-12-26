import axios from 'axios';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import Text_Editor from 'component/Text_Editor';
import { ConfigContext } from 'context/ConfigContext';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import { GetAppLanguageLookupList } from 'services/Admin/AppLangauge/AppLanguageApi';
import { GetNotificationTemplateLookupList } from 'services/Admin/NotificationAPI/NotificationTemplateAPI';
import { AddUpdateFestivalPackage, GetFestivalPackageModel } from 'services/Admin/FestivalIdolServices/FestivalIdolServicesApi';


const AddUpdateFestivalServiceModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
    const { setLoader, user, formatToIndianCurrency } = useContext(ConfigContext);
    const [error, setError] = useState(false);
    const [customError, setCustomError] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [languageList, setLanguageList] = useState([]);
    const [notificationTemplateList, setNotificationTemplateList] = useState([]);

    const [filePreview, setFilePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [actionMassage, setActionMassage] = useState(null);

    const [formObj, setFormObj] = useState({
        serviceName: null,
        price: null,
        isDefaultService: false,
        appLangID: null
    });

    useEffect(() => {
        
        if (show) {
            //   isPageRender();
            //   GetPujaCategoryLookupListData();
            GetAppLanguageLookupListData();
            GetNotificationTemplateLookupListData();
            if (
                modelRequestData?.Action === 'Update' &&
                modelRequestData?.fiB_ServiceKeyID !== null &&
                modelRequestData?.fiB_ServiceKeyID !== ''
            ) {
                GetFestivalPackageModelData();
            }
        }
    }, [show]);

    const GetFestivalPackageModelData = async () => {
        setLoader(true);
        try {
            const response = await GetFestivalPackageModel(modelRequestData?.fiB_ServiceKeyID, modelRequestData?.appLangID);

            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        setFormObj((prev) => ({
                            ...prev,
                            serviceName: List?.serviceName,
                            price: List?.price,
                            isDefaultService: List?.isDefaultService,
                            appLangID: List?.appLangID

                        }))
                        // ✅ if image exists from DB, set preview
                        if (List?.deityImageUrl) {
                            setFilePreview(List.deityImageUrl);  // show preview
                            setUploadedImageUrl(List.deityImageUrl); // keep in upload state
                            setSelectedFile(List.deityImageUrl)
                        }
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

    const GetAppLanguageLookupListData = async () => {
        try {
            const response = await GetAppLanguageLookupList(); // Ensure it's correctly imported

            if (response?.data?.statusCode === 200) {
                const list = response?.data?.responseData?.data || [];

                const formattedLangList = list.map((Lang) => ({
                    value: Lang.appLangID,
                    label: Lang.languageName
                }));

                const filteredList = formattedLangList?.filter((prev) => prev.value !== 1);
                setLanguageList(filteredList);
            } else {
                console.error('Failed to fetch sim Type lookup list:', response?.data?.statusMessage || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching sim Type lookup list:', error);
        }
    };
    const GetNotificationTemplateLookupListData = async () => {
        try {
            const response = await GetNotificationTemplateLookupList();

            if (response?.data?.statusCode === 200) {
                const list = response?.data?.responseData?.data || [];

                const formattedLangList = list.map((Lang) => ({
                    value: Lang.notiTemplateID,
                    label: Lang.serviceName
                }));

                setNotificationTemplateList(formattedLangList);
            } else {
                console.error('Failed to fetch sim Type lookup list:', response?.data?.statusMessage || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching sim Type lookup list:', error);
        }
    };

    const setDataInitial = () => {
        setSelectedFile(null);
        setFilePreview(null);
        setUploadedImageUrl(null);
        setFormObj((prev) => ({
            ...prev,
            serviceName: null,
            price: null,
            isDefaultService: false,
            appLangID: null
        }));
    };

    const closeAll = () => {
        setError(false);
        setShowErrorModal(false);
        setShowSuccessModal(false);
        setDataInitial();
        onHide();
    };

    const SubmitBtnClicked = () => {
        // debugger;
        let isValid = true;
        if (
            formObj.serviceName === null ||
            formObj.serviceName === undefined ||
            formObj.serviceName === '' ||
            formObj.price === null ||
            formObj.price === undefined ||
            formObj.price === '' ||
            formObj.isDefaultService === null ||
            formObj.isDefaultService === undefined ||
            formObj.isDefaultService === ''

        ) {
            setError(true);
            isValid = false;
        }

        const apiParam = {
            adminID: user?.adminID,
            fiB_ServiceKeyID: modelRequestData?.fiB_ServiceKeyID,
            fiB_ServiceByLangKeyID: modelRequestData?.fiB_ServiceByLangKeyID,
            serviceName: formObj.serviceName,
            price: formObj.price,
            isDefaultService: formObj.isDefaultService,
            festIdolBookTypeID: 2,
            appLangID: formObj.appLangID
        };

        if (isValid) {
            AddUpdateFestivalPackageData(apiParam);
        }
    };

    const handleChange = (e) => {
        let { id, value } = e.target;
        if (id === "price" || id === "convenienceFee" || id === "offlinePujaPrice" || id === "drySamagriPrice" || id === "wetSamagriPrice") {
            const sanitizedInput = value
                .replace(/[^0-9.]/g, "") // Allow only numeric and dot characters
                .slice(0, 16); // Limit to 6 characters (5 digits + 1 dot or 4 digits + 2 decimals)

            // Split the input into integer and decimal parts
            const [integerPart, decimalPart] =
                sanitizedInput.split(".");

            // Format the integer part with commas as thousand separators
            const formattedIntegerPart = integerPart;

            // Combine integer and decimal parts with appropriate precision
            value =
                decimalPart !== undefined
                    ? `${formattedIntegerPart.slice(
                        0,
                        12
                    )}.${decimalPart.slice(0, 2)}`
                    : formattedIntegerPart.slice(0, 12);
        }



        setFormObj((prev) => ({
            ...prev,
            price: value
        }));

    };

    const AddUpdateFestivalPackageData = async (ApiParam) => {

        setLoader(true);
        try {
            const response = await AddUpdateFestivalPackage(ApiParam);
            if (response?.data?.statusCode === 200) {
                setLoader(false);
                
                if (modelRequestData?.Action === null && modelRequestData?.moduleName === "List") {
                    setActionMassage(`Idol Service has been added successfully.`)
                } else if (modelRequestData?.Action === 'Update' && modelRequestData?.moduleName === "List") {
                    setActionMassage(`Idol Service has been updated successfully.`)
                }
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

    return (
        <>
            <Modal style={{ zIndex: 1300 }} size="md" show={show} backdrop="static" keyboard={false} centered>
                <Modal.Header>
                    <h4 className="text-center">
                        {modelRequestData?.Action === null ? `Add Festival Service` : `Update Festival Service`}
                    </h4>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
                    <div className="container-fluid ">
                        <div className="row">
                            {/* Service Name */}
                            <div className="col-md-12 mb-3">
                                <label htmlFor="pujaName" className="form-label">
                                    Service Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    maxLength={90}
                                    type="text"
                                    className="form-control"
                                    id="catName"
                                    placeholder="Enter Service Name"
                                    aria-describedby="Employee"
                                    value={formObj.serviceName}
                                    onChange={(e) => {
                                        let input = e.target.value;
                                        if (input.startsWith(' ')) {
                                            input = input.trimStart();
                                        }

                                        setFormObj((prev) => ({
                                            ...prev,
                                            serviceName: input
                                        }));
                                    }}
                                />
                                {error && (formObj.serviceName === null || formObj.serviceName === undefined || formObj.serviceName === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )}
                            </div>

                            <div className="col-md-12 mb-3">
                                <label htmlFor="price" className="form-label">
                                    Price <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="price"
                                    placeholder="Enter Price"
                                    value={formatToIndianCurrency(formObj.price)}
                                    onChange={handleChange}
                                />

                                {error && (formObj.price === null || formObj.price === undefined || formObj.price === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )}

                            </div>
                            <div className="col-md-12 mb-3">
                                <label className="form-label">
                                    Is Default Service? <span className="text-danger">*</span>
                                </label>

                                <div className="d-flex gap-4 mt-1">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="isDefaultService"
                                            id="defaultYes"
                                            value="true"
                                            checked={formObj.isDefaultService === true}
                                            onChange={() =>
                                                setFormObj((prev) => ({
                                                    ...prev,
                                                    isDefaultService: true,
                                                }))
                                            }
                                        />
                                        <label className="form-check-label" htmlFor="defaultYes">
                                            Yes
                                        </label>
                                    </div>

                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="isDefaultService"
                                            id="defaultNo"
                                            value="false"
                                            checked={formObj.isDefaultService === false}
                                            onChange={() =>
                                                setFormObj((prev) => ({
                                                    ...prev,
                                                    isDefaultService: false,
                                                }))
                                            }
                                        />
                                        <label className="form-check-label" htmlFor="defaultNo">
                                            No
                                        </label>
                                    </div>
                                </div>
                                {error &&
                                    (formObj.isDefaultService === null ||
                                        formObj.isDefaultService === undefined || formObj.isDefaultService === "") ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ""}
                            </div>






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
            </Modal>
            <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={actionMassage} />
            <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
        </>
    );
};

export default AddUpdateFestivalServiceModal;
