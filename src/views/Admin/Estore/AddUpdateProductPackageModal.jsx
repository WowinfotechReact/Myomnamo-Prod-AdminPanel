
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
import { AddUpdateProductSubscriptionPlan, GetProductSubscriptionPlanModel } from 'services/ProductSubscriptionPlan/ProductSubscriptionPlanApi';

const AddUpdateProductPackageModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
    const { setLoader, isValidEmail, isValidGST, isValidPAN, user, formatToIndianCurrency } = useContext(ConfigContext);

    const [error, setError] = useState(false)
    const [customError, setCustomError] = useState(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)

    const [languageList, setLanguageList] = useState([])
    const [packageForm, setPackageForm] = useState({
        appLangID: null,
        title: null,
        validityInMonths: null,
        price: null,
        discount: null,
        discountTypeID: null,
        description: null,


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
            const response = await GetProductSubscriptionPlanModel(modelRequestData?.pSubPlanKeyID, modelRequestData?.appLangID);

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
                            validityInMonths: List?.validityInMonths,

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
            packageForm?.price === null || packageForm?.price === undefined || packageForm?.price === "" ||
            packageForm?.description === null || packageForm?.description === undefined || packageForm?.description === "" ||
            packageForm?.validityInMonths === null || packageForm?.validityInMonths === undefined || packageForm?.validityInMonths === ""
        )

        ) {
            setError(true)
            isValid = false
        } else if (modelRequestData?.moduleName === "LanguageWiseList" && (packageForm?.title === null || packageForm?.title === undefined || packageForm?.title === "" ||
            packageForm?.appLangID === null || packageForm?.appLangID === undefined || packageForm?.appLangID === "" ||
            packageForm?.description === null || packageForm?.description === undefined || packageForm?.description === "")

        ) {
            setError(true)
            isValid = false
        }

        const apiParam = {
            adminID: user?.adminID,
            pSubPlanKeyID: modelRequestData?.pSubPlanKeyID,
            pSubPlanByLangKeyID: modelRequestData?.pSubPlanByLangKeyID === undefined || modelRequestData?.pSubPlanByLangKeyID === null ? null : modelRequestData?.pSubPlanByLangKeyID,
            appLangID: packageForm?.appLangID,
            productID: modelRequestData?.productID,
            productKeyID: modelRequestData?.productKeyID,
            title: packageForm?.title,
            price: packageForm?.price,
            discount: packageForm?.discount,
            description: packageForm?.description,
            validityInMonths: packageForm?.validityInMonths
        }
        if (isValid) {

            AddUpdatePujaSubscriptionPackageData(apiParam)
        }
    }


    const AddUpdatePujaSubscriptionPackageData = async (ApiParam) => {
        setLoader(true);
        try {
            const response = await AddUpdateProductSubscriptionPlan(ApiParam);
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
            validityInMonths: null,
            price: null,
            discount: "0",
            discountTypeID: null,
            description: null,
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
        if (id === "price" || id === "validityInMonths") {
            value = value.charAt(0) > '0' ? value.replace(/\D/g, '').slice(0, 6) : ''; // Only keep digits and slice to 10 digits

        }

        // if (id === "discount") {
        //     value = value.replace(/\D/g, '');
        //     let numericValue = Number(value);
        //     if (numericValue > 100) numericValue = 100;
        //     if (value.length > 1 && value.startsWith('0')) {
        //         numericValue = Number(value.replace(/^0+/, ''));
        //     }
        //     value = value === '' ? '' : numericValue.toString();
        // }

        if (id === "discount") {
            // Remove everything except digits
            value = value.replace(/\D/g, '');

            // Allow empty input (so user can delete)
            if (value === '') {
                setPackageForm(prev => ({ ...prev, [id]: null }));
                return;
            }

            const numericValue = Number(value);

            // Allow only numbers between 0–100
            if (numericValue < 0 || numericValue > 100) {
                return; // simply exit without changing state
            }
            value = numericValue.toString();

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
            <Modal size='lg' style={{ zIndex: 1300 }} show={show} backdrop="static" keyboard={false} centered>
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
                                    placeholder="Enter Package Title"
                                    maxLength={150}
                                />
                                {error && (!packageForm?.title) && (
                                    <span className="text-danger">{ERROR_MESSAGES}</span>
                                )}
                            </div>



                            {modelRequestData?.moduleName !== 'LanguageWiseList' && (
                                <>
                                    {/* Price  */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="price" className="form-label">
                                            Price (₹)<span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control my-box"
                                            id="price"
                                            value={formatToIndianCurrency(packageForm?.price) || ''}
                                            onChange={handleChange}
                                            placeholder="Enter Package Price (₹)"
                                            maxLength={150}
                                        />
                                        {error && (!packageForm?.price) && (
                                            <span className="text-danger">{ERROR_MESSAGES}</span>
                                        )}
                                    </div>

                                    {/* Discount  */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="discount" className="form-label">
                                            Discount (%)
                                            {/* <span className="text-danger">*</span> */}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control my-box"
                                            id="discount"
                                            value={packageForm?.discount}
                                            onChange={handleChange}
                                            placeholder="Enter Discount %"
                                            maxLength={150}
                                        />
                                        {/* {error && (!packageForm?.discount) && (
                                            <span className="text-danger">{ERROR_MESSAGES}</span>
                                        )} */}
                                    </div>





                                    {/* Validity In Months */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="validityInMonths" className="form-label">
                                            Validity In Months <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control my-box"
                                            id="validityInMonths"
                                            value={packageForm?.validityInMonths || ''}
                                            onChange={handleChange}
                                            placeholder="Enter Validity In Months"
                                            maxLength={2}
                                        />
                                        {error && (!packageForm?.validityInMonths) && (
                                            <span className="text-danger">{ERROR_MESSAGES}</span>
                                        )}
                                    </div>


                                </>
                            )}



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

export default AddUpdateProductPackageModal
