import axios from 'axios';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import Text_Editor from 'component/Text_Editor';
import { ConfigContext } from 'context/ConfigContext';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import CustomUploadImg from '../../../assets/images/upload_img.jpg'
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import { UploadImage } from 'services/Upload Cloud-flare Image/UploadCloudflareImageApi';
import { AddUpdateTempleImage, GetTempleImageModel } from 'services/Admin/TempleApi/TemplesApi';

const AddUpdateImageModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
    const { setLoader, user } = useContext(ConfigContext);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

    const [error, setError] = useState(false)
    const [customError, setCustomError] = useState(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)

    const [selectedFile, setSelectedFile] = useState("")
    const [sizeError, setSizeError] = useState(null)
    const [filePreview, setFilePreview] = useState("")
    const [imageFormObj, setImageFormData] = useState(
        { templeImageURL: null }
    )

    useEffect(() => {
        if (show) {
            if (modelRequestData?.tempImgID !== null && modelRequestData?.tempImgID !== "") {
                GetTempleImageModelData()
            }
        }
    }, [show])


    const SubmitBtnClicked = () => {

        let isValid = true
        if (
            imageFormObj?.templeImageURL === null || imageFormObj?.templeImageURL === undefined || imageFormObj?.templeImageURL === "" ||
            selectedFile === null || selectedFile === undefined || selectedFile === ""
        ) {
            setError(true)
            isValid = false
        }

        const apiParam = {
            adminID: user?.admiN_ID,
            templeKeyID: modelRequestData?.templeKeyID,
            tempImgID: modelRequestData?.tempImgID,

            templeImageURL: uploadedImageUrl,
        }
        if (isValid) {

            AddUpdateDeityData(apiParam)
        }
    }

    const AddUpdateDeityData = async (ApiParam) => {

        setLoader(true);
        try {
            const response = await AddUpdateTempleImage(ApiParam);
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

    const GetTempleImageModelData = async () => {
        setLoader(true);
        try {
            const response = await GetTempleImageModel(modelRequestData?.tempImgID);

            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;

                        // ✅ if image exists from DB, set preview
                        if (List?.templeImageURL) {
                            setImageFormData(prev => ({ ...prev, templeImageURL: List.templeImageURL }));
                            setFilePreview(List.templeImageURL);  // show preview
                            setUploadedImageUrl(List.templeImageURL); // keep in upload state
                            setSelectedFile(List.templeImageURL)
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

            } else if (file.size > 10 * 1024 * 1024) {
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
        setFilePreview(null);
        setSelectedFile(null);
        setUploadedImageUrl(null)
    };

    const SetDataInitial = () => {
        setImageFormData((prev) => ({
            ...prev, templeImageURL: null,
        }))
        setFilePreview(null);
        setUploadedImageUrl(null)
        setSelectedFile(null);

    }

    const closeAll = () => {
        SetDataInitial()
        handleRemoveImage()
        setError(false);
        setCustomError(null);

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
                setImageFormData(prev => ({ ...prev, templeImageURL: uploadedUrl }));
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
            <Modal style={{ zIndex: 1300 }} size='md' show={show} backdrop="static" keyboard={false} centered>
                <Modal.Header>
                    <h4 className="text-center">{modelRequestData?.Action === null ? 'Add Temple Image' : 'Update Temple Image'}</h4>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
                    <div className="container-fluid ">

                        <div className='col-md-12 mb-3'>
                            <div className="mb-3 position-relative">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <label
                                        htmlFor="imageUpload"
                                        className="form-label "
                                    >
                                        Temple Image
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
            <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={modelRequestData?.Action === null ? "Temple image has been uploaded successfully !" : "Temple image has been updated successfully !"} />
            <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
        </>
    )
}

export default AddUpdateImageModal
