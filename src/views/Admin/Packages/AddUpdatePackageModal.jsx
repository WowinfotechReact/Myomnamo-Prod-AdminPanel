
import ErrorModal from 'component/ErrorModal';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import { daysList } from 'Middleware/Enum';
import React, { useContext, useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { AddUpdatePujaSubscriptionPackage, GetPujaSubscriptionPackageModel } from 'services/Admin/SubscriptionPackage/SubscriptionPackageApi';
import Select from 'react-select';
import Text_Editor from 'component/Text_Editor';
import { GetAppLanguageLookupList } from 'services/Admin/AppLangauge/AppLanguageApi';

const AddUpdatePackageModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
    const { setLoader, isValidEmail, isValidGST, isValidPAN, user, formatToIndianCurrency } = useContext(ConfigContext);

    const [error, setError] = useState(false)
    const [customError, setCustomError] = useState(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)

    const [languageList, setLanguageList] = useState([])
    const [packageForm, setPackageForm] = useState({
        appLangID: null,
        title: null,
        subTitle: null,
        price: null,
        discount: null,
        timeLine: null,
        description: null,
        timeLineInWeeks: null,
        pujaTime: null,
        dayID: null
    })

    useEffect(() => {
        if (show) {
            if (modelRequestData?.Action === 'update') {
                GetPujaSubscriptionPackageModelData()
            }
            if (modelRequestData?.moduleName === "LanguageWiseList") {
                GetAppLanguageLookupListData()
            }
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

    const GetPujaSubscriptionPackageModelData = async () => {
        setLoader(true);
        try {
            const response = await GetPujaSubscriptionPackageModel(modelRequestData?.tempPujaSubPackageKeyID, modelRequestData?.appLangID);

            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        setPackageForm((prev) => ({
                            ...prev,
                            appLangID: List?.appLangID,
                            title: List?.title,
                            subTitle: List?.subTitle,
                            price: List?.price,
                            discount: List?.discount,
                            timeLine: List?.timeLine,
                            description: List?.description,
                            pujaTime: List?.pujaTime,
                            dayID: List?.dayID,
                            timeLineInWeeks: List?.timeLineInWeeks,

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
    }

    const SubmitBtnClicked = () => {
        let isValid = true
        if (modelRequestData?.moduleName === "PackageList" && (packageForm?.title === null || packageForm?.title === undefined || packageForm?.title === "" ||
            packageForm?.subTitle === null || packageForm?.subTitle === undefined || packageForm?.subTitle === "" ||
            packageForm?.price === null || packageForm?.price === undefined || packageForm?.price === "" ||
            packageForm?.timeLine === null || packageForm?.timeLine === undefined || packageForm?.timeLine === "" ||
            packageForm?.description === null || packageForm?.description === undefined || packageForm?.description === "" ||
            packageForm?.timeLineInWeeks === null || packageForm?.timeLineInWeeks === undefined || packageForm?.timeLineInWeeks === "" ||
            packageForm?.pujaTime === null || packageForm?.pujaTime === undefined || packageForm?.pujaTime === "" ||
            packageForm?.dayID === null || packageForm?.dayID === undefined || packageForm?.dayID === "")

        ) {
            setError(true)
            isValid = false
        } else if (modelRequestData?.moduleName === "LanguageWiseList" && (packageForm?.title === null || packageForm?.title === undefined || packageForm?.title === "" ||
            packageForm?.subTitle === null || packageForm?.subTitle === undefined || packageForm?.subTitle === "" ||
            packageForm?.timeLine === null || packageForm?.timeLine === undefined || packageForm?.timeLine === "" ||
            packageForm?.description === null || packageForm?.description === undefined || packageForm?.description === "")

        ) {
            setError(true)
            isValid = false
        }
        debugger
        const apiParam = {
            adminID: user?.admiN_ID,
            tempPujaSubPackageKeyID: modelRequestData?.tempPujaSubPackageKeyID,
            tempPujaSubPackLangKeyID: modelRequestData?.tempPujaSubPackLangKeyID === undefined || modelRequestData?.tempPujaSubPackLangKeyID === null ? null : modelRequestData?.tempPujaSubPackLangKeyID,
            appLangID: packageForm?.appLangID,
            pujaKeyID: modelRequestData?.pujaKeyID,
            title: packageForm?.title,
            subTitle: packageForm?.subTitle,
            price: packageForm?.price,
            discount: packageForm?.discount,
            timeLine: packageForm?.timeLine,
            description: packageForm?.description,
            dayID: packageForm?.dayID,
            pujaTime: packageForm?.pujaTime,
            timeLineInWeeks: packageForm?.timeLineInWeeks
        }
        if (isValid) {
            AddUpdatePujaSubscriptionPackageData(apiParam)
        }
    }


    const AddUpdatePujaSubscriptionPackageData = async (ApiParam) => {
        setLoader(true);
        try {
            const response = await AddUpdatePujaSubscriptionPackage(ApiParam);
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

    const setInitialData = () => {
        setPackageForm(prev => ({
            ...prev,
            appLangID: null,
            title: null,
            subTitle: null,
            price: null,
            discount: null,
            timeLine: null,
            description: null,
            dayID: null,
            pujaTime: null,
            timeLineInWeeks: null
        }));
    };


    const closeAll = () => {
        setShowSuccessModal(false)
        setShowErrorModal(false)
        setError(false);
        setCustomError(null)
        setInitialData()
        onHide()
    }

    const handleChange = (e) => {

        let { id, value } = e.target;
        if (id === "title" || id === "subTitle") {
            // value = value.replace(/[^a-zA-Z\s]/g, '');
            value = value.charAt(0).toUpperCase() + value.slice(1);
        }
        if (id === "price" || id === "discount") {
            value = value.charAt(0) > '0' ? value.replace(/\D/g, '').slice(0, 6) : ''; // Only keep digits and slice to 10 digits

        }



        setPackageForm((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleDescriptionChange = (htmlContent) => {

        // Strip HTML tags and check if anything meaningful remains
        const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

        setPackageForm((obj) => ({
            ...obj,
            description: strippedContent === '' ? null : htmlContent,
        }));
    };

    return (
        <>
            <Modal style={{ zIndex: 1300 }} show={show} backdrop="static" keyboard={false} centered>
                <Modal.Header>
                    <h4 className="text-center">{modelRequestData?.Action === null ? 'Add Package' : 'Update Package'}</h4>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
                    <div className="container ">
                        <div className="row">

                            {/* Select Language */}
                            {modelRequestData?.moduleName === 'LanguageWiseList' && (
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="appLangID" className="form-label">
                                        Select Language <span className="text-danger">*</span>
                                    </label>
                                    <Select
                                        id='appLangID'
                                        options={languageList}
                                        value={languageList.filter((item) => item.value === packageForm.appLangID)}
                                        onChange={(selectedOption) =>
                                            setPackageForm((prev) => ({
                                                ...prev,
                                                appLangID: selectedOption ? selectedOption.value : null,
                                            }))
                                        }
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                    />
                                    {error && (!packageForm?.appLangID) && (
                                        <span className="text-danger">{ERROR_MESSAGES}</span>
                                    )}
                                </div>
                            )}



                            {/* Title  */}
                            <div className="col-md-6 mb-3">
                                <label htmlFor="title" className="form-label">
                                    Title <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control my-box"
                                    id="title"
                                    value={packageForm?.title || ''}
                                    onChange={handleChange}
                                    placeholder="Enter Temple Name"
                                    maxLength={150}
                                />
                                {error && (!packageForm?.title) && (
                                    <span className="text-danger">{ERROR_MESSAGES}</span>
                                )}
                            </div>

                            {/* Sub Title */}
                            <div className="col-md-6 mb-3">
                                <label htmlFor="subTitle" className="form-label">
                                    Sub Title <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control my-box"
                                    id="subTitle"
                                    value={packageForm?.subTitle || ''}
                                    onChange={handleChange}
                                    placeholder="Enter Temple Name"
                                    maxLength={150}
                                />
                                {error && (!packageForm?.subTitle) && (
                                    <span className="text-danger">{ERROR_MESSAGES}</span>
                                )}
                            </div>

                            {modelRequestData?.moduleName !== 'LanguageWiseList' && (
                                <>
                                    {/* Price  */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="price" className="form-label">
                                            Price <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control my-box"
                                            id="price"
                                            value={formatToIndianCurrency(packageForm?.price) || ''}
                                            onChange={handleChange}
                                            placeholder="Enter Temple Name"
                                            maxLength={150}
                                        />
                                        {error && (!packageForm?.price) && (
                                            <span className="text-danger">{ERROR_MESSAGES}</span>
                                        )}
                                    </div>

                                    {/* Discount  */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="discount" className="form-label">
                                            Discount <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control my-box"
                                            id="discount"
                                            value={packageForm?.discount || ''}
                                            onChange={handleChange}
                                            placeholder="Enter Discount %"
                                            maxLength={150}
                                        />
                                        {error && (!packageForm?.discount) && (
                                            <span className="text-danger">{ERROR_MESSAGES}</span>
                                        )}
                                    </div>



                                    {/* Time */}
                                    <div className="col-md-6 col-sm-12 mb-2 d-flex flex-column form-font-size">
                                        <label

                                            style={{ textAlign: "left" }}
                                        >
                                            Time<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <input
                                            id="bookingTime"
                                            type="time"
                                            className="form-control"
                                            value={packageForm.pujaTime || ""}
                                            onClick={(e) =>
                                                e.target.showPicker && e.target.showPicker()
                                            }
                                            onChange={(e) => {
                                                const [hour, minute] = e.target.value.split(":");
                                                let hr = parseInt(hour, 10);
                                                const ampm = hr >= 12 ? "PM" : "AM";
                                                hr = hr % 12 || 12; // convert hoga yaha pr -> 13 ka -> 1
                                                const formattedTime = `${hr}:${minute} ${ampm}`;

                                                setPackageForm((prev) => ({
                                                    ...prev,
                                                    pujaTime: e.target.value,
                                                    time24: e.target.value,
                                                }));
                                            }}
                                        />
                                        {error && !packageForm.pujaTime && (
                                            <span className="text-danger">{ERROR_MESSAGES}</span>
                                        )}
                                    </div>

                                    {/* TimeLine In Weeks */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="timeLineInWeeks" className="form-label">
                                            TimeLine In Weeks <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control my-box"
                                            id="timeLineInWeeks"
                                            value={packageForm?.timeLineInWeeks || ''}
                                            onChange={handleChange}
                                            placeholder="Enter TimeLine In Weeks"
                                            maxLength={2}
                                        />
                                        {error && (!packageForm?.timeLineInWeeks) && (
                                            <span className="text-danger">{ERROR_MESSAGES}</span>
                                        )}
                                    </div>

                                    {/* Select Day */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="dayID" className="form-label">
                                            Select Day <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            id='dayID'
                                            options={daysList}
                                            value={daysList.filter((item) => item.value === packageForm.dayID)}
                                            onChange={(selectedOption) =>
                                                setPackageForm((prev) => ({
                                                    ...prev,
                                                    dayID: selectedOption ? selectedOption.value : null,
                                                }))
                                            }
                                            menuPlacement="auto"
                                            menuPosition="fixed"
                                        />
                                        {error && (!packageForm?.dayID) && (
                                            <span className="text-danger">{ERROR_MESSAGES}</span>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* TimeLine  */}
                            <div className="col-md-6 mb-3">
                                <label htmlFor="timeLine" className="form-label">
                                    TimeLine <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control my-box"
                                    id="timeLine"
                                    value={packageForm?.timeLine || ''}
                                    onChange={handleChange}
                                    placeholder="Enter timeLine"
                                    maxLength={150}
                                />
                                {error && (!packageForm?.timeLine) && (
                                    <span className="text-danger">{ERROR_MESSAGES}</span>
                                )}
                            </div>

                            {/* Package Details */}
                            <div className="col-md-12 mb-3">
                                <label htmlFor="description" className="form-label">
                                    Package Details <span className="text-danger">*</span>
                                </label>
                                <Text_Editor
                                    editorState={packageForm?.description}
                                    handleContentChange={handleDescriptionChange}
                                />
                                {error && (!packageForm?.description) && (
                                    <span className="text-danger">{ERROR_MESSAGES}</span>
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
            </Modal >
            <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={modelRequestData?.Action === null ? 'New Package Added Successfully !' : ' Package Updated Successfully !'} />
            <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
        </>
    )
}

export default AddUpdatePackageModal
