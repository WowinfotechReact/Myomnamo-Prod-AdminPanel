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
import { GetNotificationTemplateLookupList} from 'services/Admin/NotificationAPI/NotificationTemplateAPI';


const AddUpdateFestivalServiceModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
    const { setLoader, user } = useContext(ConfigContext);
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

    });

    useEffect(() => {
        if (show) {
            //   isPageRender();
            //   GetPujaCategoryLookupListData();
            GetAppLanguageLookupListData();
            GetNotificationTemplateLookupListData();
            if (
                modelRequestData?.Action === 'update' &&
                modelRequestData?.festNotiTemplateKeyID !== null &&
                modelRequestData?.festNotiTemplateKeyID !== ''
            ) {
                GetModelData();
            }
        }
    }, [show]);

    const GetModelData = async () => {
        // debugger;
        setLoader(true);
       
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
            templateID: null,
            date: null,
            timeID: null
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
            formObj.price === '' 
            
        ) {
            setError(true);
            isValid = false;
        }

        const apiParam = {
            adminID: user?.adminID,
            festNotiTemplateKeyID: modelRequestData.festNotiTemplateKeyID,
            notiTemplateID: formObj.templateID,
            serviceName: formObj.serviceName,
            image: uploadedImageUrl,
            notiTimeID: formObj.timeID,
            date: formObj.date
        };

        if (isValid) {

        }
    };

  const handleChange = (e) => {
    let { value } = e.target;

    // Regex: numbers with max 2 decimal places
    const regex = /^(\d+(\.\d{0,2})?|\.\d{0,2})$/;

    if (value === '' || regex.test(value)) {
        setFormObj((prev) => ({
            ...prev,
            price: value
        }));
    }
};

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
                                <label htmlFor="onlinePujaPrice" className="form-label">
                                    Price <span className="text-danger">*</span>
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    id="onlinePujaPrice"
                                    placeholder="Enter Price"
                                    value={(formObj.price)}
                                    onChange={handleChange}
                                    MaxLength={13}
                                />
                                {error && (formObj.price === null || formObj.price === undefined || formObj.price === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )}

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
