import ErrorModal from 'component/ErrorModal';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { ConfigContext } from 'context/ConfigContext';
import React, { useContext, useEffect, useState } from 'react'
import { AddUpdateDeity, GetDeityModel } from 'services/Admin/Deity/DeityApi';
import { Modal, Button } from 'react-bootstrap';
import CustomUploadImg from '../../../assets/images/upload_img.jpg'
import { UploadImage } from 'services/Upload Cloud-flare Image/UploadCloudflareImageApi';
import { GetAppLanguageLookupList } from 'services/Admin/AppLangauge/AppLanguageApi';
import Select from 'react-select';

const AddUpdateDeityModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
    const { setLoader, user } = useContext(ConfigContext);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

    const [error, setError] = useState(false)
    const [customError, setCustomError] = useState(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)

    const [languageList, setLanguageList] = useState([])
    const [selectedFile, setSelectedFile] = useState("")
    const [sizeError, setSizeError] = useState(null)
    const [filePreview, setFilePreview] = useState("")
    const [deityFormObj, setDeityFormObj] = useState({
        deityName: null, appLangID: null
    })

    useEffect(() => {
        if (show) {

            if (modelRequestData?.Action === "update" && modelRequestData?.deityKeyID !== null && modelRequestData?.deityKeyID !== "") {
                GetDeityModelData()
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
        if (id === "deityName") {
            value = value.replace(/^( )/g, '');
            value = value.charAt(0).toUpperCase() + value.slice(1);
        }

        setDeityFormObj((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const SubmitBtnClicked = () => {

        let isValid = true
        if (
            deityFormObj?.deityName === null || deityFormObj?.deityName === undefined || deityFormObj?.deityName === ""

        ) {
            setError(true)
            isValid = false
        } else if (modelRequestData?.moduleName === "LanguageWiseList" && (deityFormObj?.appLangID === null || deityFormObj?.appLangID === undefined || deityFormObj?.appLangID === "")) {
            setError(true)
            isValid = false
        } else if (modelRequestData?.moduleName !== "LanguageWiseList" && (selectedFile === null || selectedFile === undefined || selectedFile === "")) {
            setError(true)
            isValid = false
        }

        const apiParam = {
            adminID: user?.adminID,
            deityKeyID: modelRequestData?.deityKeyID,
            deityName: deityFormObj?.deityName,
            deityImageUrl: uploadedImageUrl,
            deityByLangKeyID: modelRequestData?.moduleName === 'LanguageWiseList' ? modelRequestData?.deityByLangKeyID : null,
            appLangID: modelRequestData?.moduleName === 'LanguageWiseList' ? deityFormObj?.appLangID : null
        }
        if (isValid) {
            console.log('ApiParam', apiParam)
            AddUpdateDeityData(apiParam)
        }
    }

    const GetDeityModelData = async () => {
        setLoader(true);
        try {
            const response = await GetDeityModel(modelRequestData?.deityKeyID, modelRequestData?.appLangID);

            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        setDeityFormObj((prev) => ({
                            ...prev,
                            deityName: List?.deityName,
                            deityImageUrl: List?.deityImageUrl,
                            deityID: List?.deityID,
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
    }



    const AddUpdateDeityData = async (ApiParam) => {

        setLoader(true);
        try {
            const response = await AddUpdateDeity(ApiParam);
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
        setDeityFormObj((prev) => ({
            ...prev, deityName: null,
        }))

    }

    const handleImageChange = (e) => {

        const file = e.target.files[0];
        if (file) {
            if (
                (file.type === "image/jpeg" ||
                    file.type === "image/png") &&
                file.size <= 2 * 1024 * 1024
            ) {
                setSizeError("");
                setSelectedFile(file);

                // Preview
                const reader = new FileReader();
                reader.onload = (event) => {
                    setFilePreview(event.target.result);
                };
                reader.readAsDataURL(file);

                // 🚀 Call upload immediately
                handleApiCall(file);

            } else if (file.size > 2 * 1024 * 1024) {
                setSizeError("Size of image should not exceed 2MB");

            } else {
                setFilePreview(null);
                setSizeError("");
            }
        } else {
            setFilePreview(null);
            setSelectedFile(null);
        }



    };


    const handleRemoveImage = () => {
        setFilePreview(null);  // show preview
        setUploadedImageUrl(null); // keep in upload state
        setSelectedFile(null)
    };

    const closeAll = () => {
        SetDataInitial()
        handleRemoveImage()
        setError(false);
        setCustomError("");

        setShowSuccessModal(false)
        onHide()

    }

    const handleApiCall = async (file) => {
        setLoader(true);
        const formData = new FormData();
        formData.append("File", file);

        try {
            const response = await UploadImage(formData);
            console.log("Upload raw response:", response);

            // Pull URL from either shape, just in case API changes later
            const uploadedUrl = response?.data?.url ?? response?.data?.data?.url ?? null;

            if (response?.status === 200 && uploadedUrl) {
                setLoader(false);
                setUploadedImageUrl(uploadedUrl);
                console.log("Uploaded Image URL:", uploadedUrl);

                // (optional) keep the form as single source of truth
                setDeityFormObj(prev => ({ ...prev, deityImageUrl: uploadedUrl }));
            } else {
                setLoader(false);
                console.warn("Upload succeeded but no URL found:", {
                    status: response?.status,
                    data: response?.data
                });
                // setErrorMessage("Upload failed: no URL returned.");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            setLoader(false);
            // setErrorMessage("An error occurred while uploading the image.");
        }
    };


    return (
        <>
            <Modal style={{ zIndex: 1300 }} show={show} backdrop="static" keyboard={false} centered>
                <Modal.Header>
                    <h4 className="text-center">{modelRequestData?.Action === null ? 'Add Deity' : 'Update Deity'}</h4>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
                    <div className="container-fluid ">
                        <div className="row">
                            {/* Deity Name */}
                            <div className="col-md-12 mb-3">
                                <label htmlFor="deityName" className="form-label">
                                    Deity Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control my-box"
                                    id="deityName"
                                    value={deityFormObj?.deityName || ''}
                                    onChange={handleChange}
                                    placeholder="Enter Deity Name"
                                    maxLength={50}
                                />
                                {error && (!deityFormObj?.deityName) && (
                                    <span className="text-danger">{ERROR_MESSAGES}</span>
                                )}
                            </div>

                            {/* Language */}
                            {modelRequestData?.moduleName === 'LanguageWiseList' ? (
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="stateID" className="form-label">
                                        Select Language <span className="text-danger">*</span>
                                    </label>
                                    <Select
                                        options={languageList}
                                        value={languageList?.filter((v) => v?.value === deityFormObj?.appLangID)}
                                        onChange={(selectedOption) =>
                                            setDeityFormObj((prev) => ({
                                                ...prev,
                                                appLangID: selectedOption ? selectedOption.value : null,
                                            }))
                                        }
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                    />
                                    {error && (!deityFormObj?.appLangID) && (
                                        <span className="text-danger">{ERROR_MESSAGES}</span>
                                    )}
                                </div>
                            ) : (
                                <div className='col-md-12 mb-3'>
                                    <div className="mb-3 position-relative">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <label
                                                htmlFor="imageUpload"
                                                className="form-label "
                                            >
                                                Deity Image
                                                <span className="text-danger">*</span>
                                            </label>
                                        </div>

                                        <div className="position-relative d-flex align-items-center justify-content-center w-100 border  rounded " style={{ height: "12rem" }}>
                                            {filePreview ? (
                                                <>
                                                    <button
                                                        onClick={handleRemoveImage}
                                                        style={{
                                                            padding: "3px 10px",
                                                            position: "absolute",
                                                            top: "5px",
                                                            right: "5px",
                                                            border: "none",
                                                            outline: "none",
                                                            zIndex: "20",
                                                            background: "transparent",
                                                            fontSize: "20px",
                                                            cursor: "pointer",
                                                            color: "black",
                                                        }}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                    <img
                                                        style={{ objectFit: "contain" }}
                                                        src={filePreview}
                                                        alt="Preview"
                                                        className="position-absolute top-0 start-0 w-100 h-100 border border-secondary rounded"
                                                    />
                                                </>
                                            ) : (
                                                <label
                                                    htmlFor="custom-BankDetailsImg"
                                                    className="cursor-pointer text-center"
                                                >
                                                    <img
                                                        src={CustomUploadImg}
                                                        alt="upload_img"
                                                        className="d-block mx-auto"
                                                        style={{ height: "5rem" }}
                                                    />
                                                    <span>Upload image</span>
                                                </label>
                                            )}
                                            <input
                                                type="file"
                                                id="custom-BankDetailsImg"
                                                accept="image/jpeg, image/png"
                                                className="d-none"
                                                onChange={handleImageChange}
                                            />
                                        </div>

                                        {sizeError ? (
                                            <span className="text-danger small mx-3">{sizeError}</span>
                                        ) : !selectedFile ? (
                                            <span
                                                className="text-muted mx-3"
                                                style={{
                                                    display: "block",
                                                    fontWeight: "500",
                                                    fontSize: "0.8rem",
                                                }}
                                            >
                                                Supported file types are .jpg, .jpeg, .png up to a file size of 2MB.
                                            </span>
                                        ) : (
                                            ""
                                        )}

                                        {error &&
                                            (selectedFile === null ||
                                                selectedFile === "" ||
                                                selectedFile === undefined) && (
                                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                            )}
                                    </div>

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
            <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={modelRequestData?.Action === null ? 'New Deity has been Successfully !' : ' Deity has been Updated Successfully !'} />
            <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
        </>
    )
}

export default AddUpdateDeityModal
