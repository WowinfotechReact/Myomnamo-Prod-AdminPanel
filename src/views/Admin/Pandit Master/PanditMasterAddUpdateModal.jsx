import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { ConfigContext } from 'context/ConfigContext';
import Select from 'react-select';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import React, { useContext, useEffect, useState,useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import { GetTempleLookupList } from 'services/Admin/TempleApi/TemplesApi';
import CustomUploadImg from "../../../assets/images/upload_img.jpg"
import { UploadImage } from 'services/Upload Cloud-flare Image/UploadCloudflareImageApi';
import { AddUpdatePandit, GetPanditModel, PanditLookupList } from 'services/Admin/Pandit Master/PanditMasterApi'
import { GetAppLanguageLookupList } from 'services/Admin/AppLangauge/AppLanguageApi';
import { PanditTypeLookupList } from 'Middleware/Enum';
import { googleMapKey } from 'component/Base-Url/BaseUrl';


const PanditMasterAddUpdateModal = ({ show, onHide, modelRequestData,setModelRequestData, setIsAddUpdateDone,setShowSuccessModal }) => {
    const { setLoader, user } = useContext(ConfigContext);
    const debounceTimer = useRef(null);
    const [modelAction, setModelAction] = useState(false);
    const [error, setError] = useState(false);
    const [ errorPsw, seterrorPsw ] = useState(false);
    const [customError, setCustomError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
 
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [templeList, setTempleList] = useState([])
    const [panditType, setPanditType] = useState([])
    const [languageList, setLanguageList] = useState([])
    const [isAddressChanged, setIsAddressChanged] = useState(false)
    const [state, setState] = useState({
        adminID: user.adminID,
        panditKeyID: null,
        panditTypeID: null,
        panditName: null,
        mobileNo: null,
        address: null,
        panditPhotoUrl: null,
        experience: null,
        latitude: null,
        longitude: null,
        dob: null,
        email: null,
        password: null,
        token: null,
        noOfPooja: null,
        isPartner: null,
        addedFrom: null,
        isWilingToTravel: null,
        specialisedArea: null,
        appLangID: []   
    }) 
    
    //Upload image state
    const [filePreview, setFilePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [sizeError, setSizeError] = useState("");
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [actionMassage, setActionMassage] = useState(null)


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const InValidMobileNumberMassage = 'Please enter a valid 10-digit mobile number.';
    // Calculate the max date allowed (today - 18 years)
    const getMaxDate = () => {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 18);
        return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    };

    useEffect(() => {

        if (modelRequestData?.panditKeyID !== null && modelRequestData?.Action === 'Update') {
            GetPanditModelData(modelRequestData.panditKeyID);
        }
    }, [show]);

        useEffect(() => {
            if (isAddressChanged) {
                handleSearch()
                setIsAddressChanged(false)
            }
        }, [isAddressChanged])

    useEffect(() => {
        GetTempleLookupListData()
        GetPanditTypeLookupListData()
        GetAppLanguageLookupListData()
    }, [])

    const GetTempleLookupListData = async () => {

        try {
            const response = await GetTempleLookupList(modelRequestData?.appLangID); // Ensure it's correctly imported

            if (response?.data?.statusCode === 200) {
                const list = response?.data?.responseData?.data || [];

                const formattedLangList = list.map((Lang) => ({
                    value: Lang.templeID,
                    label: Lang.templeName,
                }));

                setTempleList(formattedLangList);
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

    const handleAddressChange = (e) => {
        
        const value = e.target.value.replace(/^\s+/, '');
        if (value === "" || value === null) {
            setState((prev) => ({ ...prev, address: value, latitude: "", longitude: "" }));
        } else {

            setState((prev) => ({ ...prev, address: value }));
        }
        

        // Clear previous timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Start new timer (e.g., 1 second delay)
        debounceTimer.current = setTimeout(() => {
            setIsAddressChanged(true);
        }, 2000);
    };

    const handleSearch = async () => {
            try {
                const apiKey = "AIzaSyA5rVW7DkyryqQM-cDhsSrHb4soE2iXIJ8"; // Replace with your key
                const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/geocode/json`,
                    {
                        params: {
                            address: state?.address,
                            key: googleMapKey,
                        },
                    }
                );
              
                if (response.data.status === "OK") {
                    const location = response.data.results[0].geometry.location;
                    // setCoords(location); // { lat: ..., lng: ... }
                    setState((prev) => ({
                        ...prev, latitude: location?.lat, longitude: location?.lng
                    }))
                    
                } else {
                    alert("Address not found!");
                }
            } catch (error) {
                console.error(error);
            }
        };

    const handleCheckboxChange = (value) => {
        setState((prev) => {
            const currentLanguages = prev.appLangID || [];

            let updatedLanguages;

            
            if (currentLanguages.includes(value)) {
                updatedLanguages = currentLanguages.filter((item) => item !== value);
            }
            
            else {
                updatedLanguages = [...currentLanguages, value];
            }

            return {
                ...prev,
                appLangID: updatedLanguages
            };
        });
    };

    const GetAppLanguageLookupListData = async () => {
    
            try {
                const response = await GetAppLanguageLookupList(); 
    
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



    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Allowed types
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            setSizeError("Only JPG, JPEG, PNG files are allowed.");
            return;
        }

        // Size check (10 MB)
        if (file.size > 10 * 1024 * 1024) {
            setSizeError("File size must be less than 10 MB.");
            return;
        }

        setSizeError("");
        setSelectedFile(file);

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result);
        reader.readAsDataURL(file);

        // Automatically upload after selecting
        handleApiCall(file);
    };


    const handleRemoveImage = () => {
        setFilePreview(null);
        setSelectedFile(null);
        setUploadedImageUrl("");
        setState({
            ...state,
            panditPhotoUrl:null
        })
    };

    const handleApiCall = async (file) => {
        setLoader(true);
        const formData = new FormData();
        formData.append("File", file);

        try {
            const response = await UploadImage(formData);
            const uploadedUrl =
                response?.data?.url ?? response?.data?.data?.url ?? null;

            if (response?.status === 200 && uploadedUrl) {
                setUploadedImageUrl(uploadedUrl);
                setState({
                    ...state,
                    panditPhotoUrl: uploadedUrl
                })
                console.log("Uploaded Image URL:", uploadedUrl);
            } else {
                console.warn("Upload succeeded but no URL found:", response?.data);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setLoader(false);
        }
    };

    const GetPanditTypeLookupListData = async () => {
            try {
                const response = await GetPanditTypeLookupList(); // Ensure it's correctly imported
    
                if (response?.data?.statusCode === 200) {
                    const panditTypeLookupList = response.data.responseData.data || [];
    
                    const formattedPanditList = panditTypeLookupList.map((pandit) => ({
                        value: pandit.panditTypeID,
                        label: pandit.panditType,
                    }));
    
                    setPanditType(formattedPanditList);
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
       
        if (id === "isDailyPandit") {
            value = Number(value)

        }
        setState((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const SubmitBtnClicked = () => {

        let isValid = true;
        setError(true);

        if (!state.panditName || state.panditName.trim() === '') {
            isValid = false;
        }

        if (!state.mobileNo || state.mobileNo.trim() === '') {
            isValid = false;
        } else if (state.mobileNo.length < 10) {
            isValid = false;
        }

        if (!state.password  || state.password.trim() === '') {
            isValid = false;
        }
        if(state.password.length !== 8)
        {
            isValid = false;
            seterrorPsw(true)
        }else { 
            seterrorPsw(false) 
        }

        if (!state.email || state.email.trim() === '' || !emailRegex.test(state.email)) {
            isValid = false;
        }
        if (!state.noOfPooja || state.noOfPooja.trim() === '' ) {
            isValid = false;
        }
        if (!state.experience || state.experience.trim() === '' ) {
            isValid = false;
        }
        if (!state.dob || state.dob.trim() === '' ) {
            isValid = false;
        }
        if (!state.address || state.address.trim() === '' ) {
            isValid = false;
        }
        if (!state.address || state.address.trim() === '' ) {
            isValid = false;
        }

        if (!isValid) {
            // Just show validation errors, don’t submit
            return;
        }

        // console.log('  Payload:', state);
        // Proceed to API call if valid
        AddUpdatePanditData({ ...state });
    };

    const AddUpdatePanditData = async (ApiParam) => {
        setLoader(true);
        try {
            const response = await AddUpdatePandit(ApiParam);
            if (response?.data?.statusCode === 200) {
                setLoader(false);
                setModelRequestData({
                    actionMessage:modelRequestData.Action === 'Add'
                        ? 'Pandit has been added successfully!'
                        : 'Pandit has been updated successfully!'

                })
                    
                
                onHide();
                setShowSuccessModal(true);
                setIsAddUpdateDone(true);
            } else {
                setCustomError(response?.response?.data?.errorMessage);
                setShowErrorModal(true);
                setLoader(false);
            }
        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    };

    const closeAll = () => {
        setError(false);
        setCustomError(null);
        setShowSuccessModal(false);
        onHide();
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0]; 
    };

    const GetPanditModelData = async (id) => {
        if (!id) return;
        setLoader(true);
        try {

            const response = await GetPanditModel(id);
            if (response?.data?.statusCode === 200) {
                const List = response.data.responseData.data;
                setState({
                    ...List,
                });
                setSelectedFile(List?.panditPhotoUrl)
                setFilePreview(List?.panditPhotoUrl)
                setUploadedImageUrl(List?.panditPhotoUrl)
            }
            setLoader(false);

        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    };

    return (
        <>
            <Modal
                style={{ zIndex: 1300 }}
                size="lg"
                show={show}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header>
                    <h4 className="text-center">
                        {modelRequestData?.Action === "Add" ? 'Add Pandit' : 'Update Pandit'}
                    </h4>
                </Modal.Header>

                <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
                    <div className="container-fluid">
                        <div className="row">
                            {/* Pandit Name */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Pandit Name<span className="text-danger">*</span>
                                </label>
                                <input
                                    maxLength={50}
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Pandit Name"
                                    value={state.panditName}
                                    onChange={(e) => {
                                        setErrorMessage(false);
                                        let inputValue = e.target.value;
                                        const cleanedValue = inputValue
                                            .replace(/[^a-zA-Z0-9\s]/g, '')
                                            .trimStart();
                                        const updatedValue = cleanedValue
                                            .split(' ')
                                            .map(
                                                (word) => word.charAt(0).toUpperCase() + word.slice(1)
                                            )
                                            .join(' ');
                                        setState((prev) => ({
                                            ...prev,
                                            panditName: updatedValue,
                                        }));
                                    }}
                                />
                                {error && (!state.panditName || state.panditName.trim() === '') && (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                )}
                            </div>

                            {/* Temple */}
                            {/* <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Select Temple <span className="text-danger">*</span>
                                </label>
                                <Select
                                    id="templeID"
                                    options={templeList}
                                    value={templeList.filter((item) => item.value === state.templeID)}
                                    onChange={(selectedOption) =>
                                        setState({
                                            ...state,
                                            templeID: selectedOption ? selectedOption.value : null,
                                        })
                                    }
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                />
                                {error &&
                                    (state.templeID === null ||
                                        state.templeID === undefined ||
                                        state.templeID === '') && (
                                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                    )}
                            </div> */}

                            {/* Mobile No */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Mobile No.<span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={state.mobileNo}
                                    maxLength={10}
                                    className="form-control"
                                    placeholder="Enter Mobile Number"
                                    onKeyDown={(e) => {
                                        if (
                                            !/[0-9]/.test(e.key) &&
                                            !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const updatedValue = inputValue.replace(/[^0-9]/g, '');
                                        setErrorMessage(null);
                                        setState({ ...state, mobileNo: updatedValue });
                                    }}
                                />
                                {error && !state.mobileNo && (
                                    <div className="text-danger">{ERROR_MESSAGES}</div>
                                )}
                                {error && state.mobileNo && state.mobileNo.length < 10 && (
                                    <div className="text-danger">{InValidMobileNumberMassage}</div>
                                )}
                            </div>

                            {/* No of Pooja */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Number Of Pooja<span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={state.noOfPooja}
                                    maxLength={10}
                                    className="form-control"
                                    placeholder="Enter Number Of Pooja"
                                    onKeyDown={(e) => {
                                        if (
                                            !/[0-9]/.test(e.key) &&
                                            !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const updatedValue = inputValue.replace(/[^0-9]/g, '');
                                        setErrorMessage(null);
                                        setState({ ...state, noOfPooja: updatedValue });
                                    }}
                                />
                                {error && !state.noOfPooja && (
                                    <div className="text-danger">{ERROR_MESSAGES}</div>
                                )}

                            </div>

                            {/* Daily Pandit */}
                            {/* <div className="col-md-6 mb-3">
                                <label htmlFor="canonicalTag" className="form-label">
                                    Daily Pandit <span className="text-danger">*</span>
                                </label>
                                <div classNsame="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
                                    <label className="inline-flex items-center mx-1">
                                        <input
                                            type="radio"
                                            id='isDailyPandit'
                                            name="isDailyPandit"
                                            value={1}
                                            checked={state.isDailyPandit === 1}
                                            onChange={handleChange}
                                            className="form-radio h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2 mx-2 text-sm text-gray-700">Yes</span>
                                    </label>

                                    <label className="inline-flex items-center mx-1">
                                        <input
                                            type="radio"
                                            name="isDailyPandit"
                                            id='isDailyPandit'
                                            value={2}
                                            checked={state.isDailyPandit === 2}
                                            onChange={handleChange}
                                            className="form-radio h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2 mx-2 text-sm text-gray-700">No</span>
                                    </label>


                                </div>

                                {/* Validation */}
                                 {/* {error && (!state.isDailyPandit || state.isDailyPandit === "") && (
                                    <span className="text-danger">{ERROR_MESSAGES}</span>
                                )}
                            </div>  */}

                            {/* Pandit Type */}
                            <div className="col-md-6 mb-3">
                                <label htmlFor="stateID" className="form-label">
                                    Pandit Type <span className="text-danger"></span>
                                </label>
                                <Select
                                    options={PanditTypeLookupList}
                                    value={PanditTypeLookupList?.filter((v) => v?.value === state?.panditTypeID)}
                                    onChange={(selectedOption) => {
                                        setState((prev) => ({
                                            ...prev,
                                            panditTypeID: selectedOption ? selectedOption.value : null,
                                        }))
                                        

                                    }
                                    }
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                />
                                {/* {   error && (!state?.panditTypeID) && (
                                    <span className="text-danger">{ERROR_MESSAGES}</span>
                                )} */}
                            </div>

                            

                            {/* Password */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Password<span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={state.password}
                                    maxLength={8}
                                    className="form-control"
                                    placeholder="Enter Password"
                                    onChange={(e) =>{
                                        const value = e.target.value
                                        setState({ ...state, password: e.target.value })
                                        if(value.length !== 8)
                                        {
                                            seterrorPsw(true)

                                        }else
                                        {
                                            seterrorPsw(false)
                                        }
                                         }}
                                />
                                {error && (!state.password || state.password.trim() === '') && (
                                    <div className="text-danger">{ERROR_MESSAGES}</div>
                                )}
                                {errorPsw && state.password.length !== 8 && (
                                    <div className="text-danger">Password must be 8 characters</div>
                                )}
                            </div>

                            {/* Email */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Email<span className="text-danger">*</span>
                                </label>
                                <input
                                    maxLength={50}
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Email"
                                    value={state.email}
                                    onChange={(e) =>
                                        setState((prev) => ({
                                            ...prev,
                                            email: e.target.value,
                                        }))
                                    }
                                />
                                {error && (
                                    <>
                                        {(!state.email || state.email.trim() === '') && (
                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                        )}
                                        {!(!state.email || state.email.trim() === '') &&
                                            !emailRegex.test(state.email) && (
                                                <label className="validation" style={{ color: 'red' }}>
                                                    Enter a valid email.
                                                </label>
                                            )}
                                    </>
                                )}
                            </div>

                            {/* Experience */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Experience<span className="text-danger">*</span>
                                </label>
                                <input
                                    maxLength={50}
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Experience"
                                    value={state.experience}
                                    onChange={(e) => {
                                        setErrorMessage(false);
                                        setState({
                                            ...state,
                                            experience: e.target.value,
                                        });
                                    }}
                                />
                                {error && (!state.experience || state.experience.trim() === '') && (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                )}
                            </div>

                            {/* DOB */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Date Of Birth<span className="text-danger">*</span>
                                </label>
                                <input
                                    type="date"
                                    max={getMaxDate()}
                                    className="form-control"
                                    placeholder="Enter Date Of Birth"
                                    value={formatDate(state.dob)}
                                    onChange={(e) => {
                                        setErrorMessage(false);
                                        setState({
                                            ...state,
                                            dob: e.target.value,
                                        });
                                    }}
                                />
                                {error && (!state.dob || state.dob.trim() === '') && (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                )}
                            </div>

                            {/* Address - full width */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Address<span className="text-danger">*</span>
                                </label>
                                <textarea
                                    type="text"
                                    className="form-control"
                                    id="address"
                                    placeholder="Enter Address"
                                    value={state?.address}
                                    onChange={handleAddressChange}
                                />
                                {error &&
                                    (state.address === null ||
                                        state.address === undefined ||
                                        state.address === '') && (
                                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                    )}
                            </div>
                            
                            <div div className="col-md-6 mb-3">

                                <label htmlFor="daysInterested" className="form-label">
                                    Select Languages <span className="text-danger"></span>
                                </label>

                                <div className="row border border-grey rounded p-1 "
                                    style={{ maxHeight: "70px", overflowY: "auto" }}
                                >
                                    {languageList.map((lang) => (
                                        <div key={lang.value} className="col-10 col-md-4 mb-1">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={lang.value}
                                                    id={`lang-${lang.value}`}
                                                    checked={(state.appLangID || []).includes(lang.value)}
                                                    onChange={() => handleCheckboxChange(lang.value)}
                                                />
                                                <label className="form-check-label" htmlFor={`lang-${lang.value}`}>
                                                    {lang.label}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                    {/* {error && (state?.appLangID?.length === 0) ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''} */}
                                </div>

                            </div>
                            {/* Latitude */}
                            <div className="col-md-6 mb-3">
                                <label htmlFor="latitude" className="form-label">
                                    Latitude <span className="text-danger"></span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="latitude"
                                    // placeholder="Enter Latitude"
                                    value={state?.latitude}
                                    disabled
                                />
                                {/* {error && (!state?.latitude) && (
                                    <span className="text-danger">{ERROR_MESSAGES}</span>
                                )} */}
                            </div>

                            {/* Longitude */}
                            <div className="col-md-6 mb-3">
                                <label htmlFor="longitude" className="form-label">
                                    Longitude <span className="text-danger"></span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="longitude"
                                    // placeholder="Enter Longitude"
                                    value={state?.longitude}
                                    disabled
                                />
                                {/* {error && (!state?.longitude) && (
                                    <span className="text-danger">{ERROR_MESSAGES}</span>
                                )} */}
                            </div>


                            {/* upload image  start*/}
                            <div className="col-md-6 mb-3">
                                <div className="mb-3 position-relative">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <label
                                            htmlFor="imageUpload"
                                            className="form-label "
                                            style={{ cursor: "pointer" }}
                                        >
                                            Select Pandit Image
                                            <span className="text-danger"></span>
                                        </label>
                                    </div>
                                    <div
                                        className="position-relative d-flex align-items-center justify-content-center w-100 border rounded"
                                        style={{ minHeight: "12rem" }}
                                    >
                                        {filePreview ? (
                                            <>
                                                {/* Remove Button */}
                                                <tooltip title="Remove Image">
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
                                                  </tooltip>      

                                                {/* Preview Image */}
                                                <img
                                                    style={{ objectFit: "contain" }}
                                                    src={filePreview}
                                                    alt="Preview"
                                                    
                                                    className="position-absolute top-0 start-0 w-100 h-100 border border-secondary rounded"
                                                />
                                            </>
                                        ) : (
                                            <label
                                                htmlFor="custom-pujaCategoryImage"
                                                className="cursor-pointer text-center"
                                                style={{ cursor: "pointer" }}
                                            >
                                                <img
                                                    src={CustomUploadImg} // replace with your CustomUploadImg path
                                                    alt="upload_img"
                                                    className="d-block mx-auto"
                                                    style={{ height: "5rem", cursor: "pointer" }}
                                                />
                                                <span>Upload image</span>
                                            </label>
                                        )}

                                        {/* Hidden Input */}
                                        <input
                                            type="file"
                                            id="custom-pujaCategoryImage"
                                            accept="image/jpeg, image/png"
                                            className="d-none"
                                            style={{ cursor: "pointer" }}
                                            onChange={handleImageChange}
                                        />
                                    </div>

                                    {/* Error Messages */}
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

                                    {/* {error &&
                                        (selectedFile === null ||
                                            selectedFile === "" ||
                                            selectedFile === undefined) && (
                                            <span className="text-danger small mx-3">{ERROR_MESSAGES}</span>
                                        )} */}
                                </div>
                            </div>

                            
                            {/* upload image end  */}

                            {/* Upload Image - full width */}
                            <div className="col-md-12 mb-3">
                                {/* (Your existing upload image block here – unchanged) */}
                                {/* Just make sure this block remains within col-md-12 */}
                                {/* Upload section from your original code goes here */}
                            </div>
                        </div>
                    </div>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => closeAll()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => SubmitBtnClicked()}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>

            
            <ErrorModal
                show={showErrorModal}
                onHide={() => setShowErrorModal(false)}
                Massage={customError}
            />
        </>
    );
};

export default PanditMasterAddUpdateModal;



// import { ERROR_MESSAGES } from 'component/GlobalMassage';
// import { ConfigContext } from 'context/ConfigContext';
// import Select from 'react-select';
// import 'react-calendar/dist/Calendar.css';
// import 'react-date-picker/dist/DatePicker.css';
// import React, { useContext, useEffect, useState } from 'react';
// import { Modal, Button } from 'react-bootstrap';
// import SuccessPopupModal from 'component/SuccessPopupModal';
// import ErrorModal from 'component/ErrorModal';
// import { GetTempleLookupList } from 'services/Admin/TempleApi/TemplesApi';
// import CustomUploadImg from "../../../assets/images/upload_img.jpg"
// import { UploadImage } from 'services/Upload Cloud-flare Image/UploadCloudflareImageApi';
// import { EmployeeMasterAddUpdate, GetEmployeeMasterModel } from 'services/Admin/Employee Master/EmployeeMasterApi';


// const PanditMasterAddUpdateModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
//     const { setLoader, user } = useContext(ConfigContext);
//     const [modelAction, setModelAction] = useState(false);
//     const [error, setError] = useState(false);
//     const [customError, setCustomError] = useState(null);
//     const [errorMessage, setErrorMessage] = useState(null);
//     const [showSuccessModal, setShowSuccessModal] = useState(false);
//     const [showErrorModal, setShowErrorModal] = useState(false);
//     const [templeList, setTempleList] = useState([])
//     const [state, setState] = useState({
//         adminID: user.adminID,
//         employeeKeyID: '',
//         employeeName: "",
//         employeePhoto: null,
//         dob: "",
//         experience: "",
//         mobileNo: '',
//         password: '',
//         email: '',

//         templeID: null,
//         address: "",
//     });
//     //Upload image state
//     const [filePreview, setFilePreview] = useState(null);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [sizeError, setSizeError] = useState("");
//     const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
//     const [actionMassage, setActionMassage] = useState(null)


//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const InValidMobileNumberMassage = 'Please enter a valid 10-digit mobile number.';
//     // Calculate the max date allowed (today - 18 years)
//     const getMaxDate = () => {
//         const today = new Date();
//         today.setFullYear(today.getFullYear() - 18);
//         return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
//     };

//     useEffect(() => {

//         if (modelRequestData?.employeeKeyID !== null && modelRequestData?.Action === 'Update') {
//             GetAdminModelData(modelRequestData.employeeKeyID);
//         }
//     }, [show]);

//     useEffect(() => {
//         GetTempleLookupListData()
//     }, [])

//     const GetTempleLookupListData = async () => {

//         try {
//             const response = await GetTempleLookupList(modelRequestData?.appLangID); // Ensure it's correctly imported

//             if (response?.data?.statusCode === 200) {
//                 const list = response?.data?.responseData?.data || [];

//                 const formattedLangList = list.map((Lang) => ({
//                     value: Lang.templeID,
//                     label: Lang.templeName,
//                 }));

//                 setTempleList(formattedLangList);
//             } else {
//                 console.error(
//                     "Failed to fetch sim Type lookup list:",
//                     response?.data?.statusMessage || "Unknown error"
//                 );
//             }
//         } catch (error) {
//             console.error("Error fetching sim Type lookup list:", error);
//         }
//     };


//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         // Allowed types
//         const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
//         if (!allowedTypes.includes(file.type)) {
//             setSizeError("Only JPG, JPEG, PNG files are allowed.");
//             return;
//         }

//         // Size check (10 MB)
//         if (file.size > 10 * 1024 * 1024) {
//             setSizeError("File size must be less than 10 MB.");
//             return;
//         }

//         setSizeError("");
//         setSelectedFile(file);

//         // Preview
//         const reader = new FileReader();
//         reader.onloadend = () => setFilePreview(reader.result);
//         reader.readAsDataURL(file);

//         // Automatically upload after selecting
//         handleApiCall(file);
//     };


//     const handleRemoveImage = () => {
//         setFilePreview(null);
//         setSelectedFile(null);
//         setUploadedImageUrl("");
//     };

//     const handleApiCall = async (file) => {
//         setLoader(true);
//         const formData = new FormData();
//         formData.append("File", file);

//         try {
//             const response = await UploadImage(formData);
//             const uploadedUrl =
//                 response?.data?.url ?? response?.data?.data?.url ?? null;

//             if (response?.status === 200 && uploadedUrl) {
//                 setUploadedImageUrl(uploadedUrl);
//                 setState({
//                     ...state,
//                     employeePhoto: uploadedUrl
//                 })
//                 console.log("Uploaded Image URL:", uploadedUrl);
//             } else {
//                 console.warn("Upload succeeded but no URL found:", response?.data);
//             }
//         } catch (error) {
//             console.error("Error uploading image:", error);
//         } finally {
//             setLoader(false);
//         }
//     };


//     const SubmitBtnClicked = () => {
//         debugger
//         let isValid = true;
//         setError(true);

//         if (!state.employeeName || state.employeeName.trim() === '') {
//             isValid = false;
//         }

//         if (!state.mobileNo || state.mobileNo.trim() === '') {
//             isValid = false;
//         } else if (state.mobileNo.length < 10) {
//             isValid = false;
//         }

//         if (!state.password || state.password.trim() === '') {
//             isValid = false;
//         }

//         if (!state.email || state.email.trim() === '' || !emailRegex.test(state.email)) {
//             isValid = false;
//         }

//         if (!isValid) {
//             // Just show validation errors, don’t submit
//             return;
//         }

//         // console.log('  Payload:', state);
//         // Proceed to API call if valid
//         AddUpdateAdminData({ ...state });
//     };

//     const AddUpdateAdminData = async (ApiParam) => {
//         setLoader(true);
//         try {
//             const response = await EmployeeMasterAddUpdate(ApiParam);
//             if (response?.data?.statusCode === 200) {
//                 setLoader(false);
//                 setModelAction(
//                     modelRequestData.Action === null
//                         ? 'Employee has been added successfully!'
//                         : 'Employee has been updated successfully!'
//                 );
//                 setShowSuccessModal(true);
//                 setIsAddUpdateDone(true);
//             } else {
//                 setCustomError(response?.response?.data?.errorMessage);
//                 setShowErrorModal(true);
//                 setLoader(false);
//             }
//         } catch (error) {
//             setLoader(false);
//             console.log(error);
//         }
//     };

//     const closeAll = () => {
//         setError(false);
//         setCustomError(null);
//         setShowSuccessModal(false);
//         onHide();
//     };

//     const GetAdminModelData = async (id) => {
//         if (!id) return;
//         setLoader(true);
//         try {

//             const response = await GetEmployeeMasterModel(id);
//             if (response?.data?.statusCode === 200) {
//                 const List = response.data.responseData.data;
//                 setState({
//                     ...List,
//                 });
//                 setSelectedFile(List?.employeePhoto)
//                 setFilePreview(List?.employeePhoto)
//                 setUploadedImageUrl(List?.employeePhoto)
//             }
//             setLoader(false);

//         } catch (error) {
//             setLoader(false);
//             console.log(error);
//         }
//     };

//     return (
//         <>
//             <Modal
//                 style={{ zIndex: 1300 }}
//                 size="md"
//                 show={show}
//                 backdrop="static"
//                 keyboard={false}
//                 centered
//             >
//                 <Modal.Header>
//                     <h4 className="text-center">
//                         {modelRequestData?.Action === null ? 'Add Pandit' : 'Update Pandit'}
//                     </h4>
//                 </Modal.Header>

//                 <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
//                     <div className="container-fluid ">
//                         <div className="row">
//                             {/* Admin Name */}
//                             <div className="col-md-12 mb-3">
//                                 <label htmlFor="districtTitle" className="form-label">
//                                     Pandit Name<span className="text-danger">*</span>
//                                 </label>
//                                 <input
//                                     maxLength={50}
//                                     type="text"
//                                     className="form-control"
//                                     placeholder="Enter Pandit Name"
//                                     value={state.employeeName}
//                                     onChange={(e) => {
//                                         setErrorMessage(false);
//                                         let inputValue = e.target.value;
//                                         const cleanedValue = inputValue
//                                             .replace(/[^a-zA-Z0-9\s]/g, '')
//                                             .trimStart();
//                                         const updatedValue = cleanedValue
//                                             .split(' ')
//                                             .map(
//                                                 (word) =>
//                                                     word.charAt(0).toUpperCase() + word.slice(1)
//                                             )
//                                             .join(' ');
//                                         setState((prev) => ({
//                                             ...prev,
//                                             employeeName: updatedValue,
//                                         }));
//                                     }}
//                                 />
//                                 {error &&
//                                     (!state.employeeName ||
//                                         state.employeeName.trim() === '') && (
//                                         <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
//                                     )}
//                             </div>

//                             <div className="mb-3">
//                                 <label htmlFor="templeID" className="form-label">
//                                     Select Temple <span className="text-danger">*</span>
//                                 </label>
//                                 <Select
//                                     id='templeID'
//                                     options={templeList}
//                                     value={templeList.filter((item) => item.value === state.templeID)}
//                                     onChange={(selectedOption) =>
//                                         setState({
//                                             ...state,
//                                             templeID: selectedOption ? selectedOption.value : null,
//                                         })
//                                     }
//                                     menuPlacement="auto"
//                                     menuPosition="fixed"
//                                 />
//                                 {error && (state.templeID === null || state.templeID === undefined || state.templeID === '') ? (
//                                     <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
//                                 ) : (
//                                     ''
//                                 )}
//                             </div>

//                             {/* Mobile No */}
//                             <div className="mb-3">
//                                 <label className="form-label">
//                                     Mobile No.<span className="text-danger">*</span>
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={state.mobileNo}
//                                     maxLength={10}
//                                     className="form-control"
//                                     placeholder="Enter Mobile Number"
//                                     onKeyDown={(e) => {
//                                         if (
//                                             !/[0-9]/.test(e.key) &&
//                                             ![
//                                                 'Backspace',
//                                                 'Delete',
//                                                 'Tab',
//                                                 'ArrowLeft',
//                                                 'ArrowRight',
//                                             ].includes(e.key)
//                                         ) {
//                                             e.preventDefault();
//                                         }
//                                     }}
//                                     onChange={(e) => {
//                                         const inputValue = e.target.value;
//                                         const updatedValue = inputValue.replace(/[^0-9]/g, '');
//                                         setErrorMessage(null);
//                                         setState({ ...state, mobileNo: updatedValue });
//                                     }}
//                                 />
//                                 {error && !state.mobileNo && (
//                                     <div className="text-danger">{ERROR_MESSAGES}</div>
//                                 )}
//                                 {error &&
//                                     state.mobileNo &&
//                                     state.mobileNo.length < 10 && (
//                                         <div className="text-danger">
//                                             {InValidMobileNumberMassage}
//                                         </div>
//                                     )}
//                             </div>

//                             {/* Password */}
//                             <div className="mb-3">
//                                 <label className="form-label">
//                                     Password<span className="text-danger">*</span>
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={state.password}
//                                     maxLength={10}
//                                     className="form-control"
//                                     placeholder="Enter Password"
//                                     onChange={(e) =>
//                                         setState({ ...state, password: e.target.value })
//                                     }
//                                 />
//                                 {error &&
//                                     (!state.password ||
//                                         state.password.trim() === '') && (
//                                         <div className="text-danger">{ERROR_MESSAGES}</div>
//                                     )}
//                             </div>

//                             {/* Email */}
//                             <div>
//                                 <label className="form-label">
//                                     Email<span className="text-danger">*</span>
//                                 </label>
//                                 <input
//                                     maxLength={50}
//                                     type="text"
//                                     className="form-control"
//                                     placeholder="Enter Email"
//                                     value={state.email}
//                                     onChange={(e) =>
//                                         setState((prev) => ({
//                                             ...prev,
//                                             email: e.target.value,
//                                         }))
//                                     }
//                                 />
//                                 {error && (
//                                     <>
//                                         {(!state.email || state.email.trim() === '') && (
//                                             <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
//                                         )}
//                                         {!(!state.email || state.email.trim() === '') &&
//                                             !emailRegex.test(state.email) && (
//                                                 <label
//                                                     className="validation"
//                                                     style={{ color: 'red' }}
//                                                 >
//                                                     Enter a valid email.
//                                                 </label>
//                                             )}
//                                     </>
//                                 )}
//                             </div>

//                             <div className="col-md-12 mb-3">
//                                 <label htmlFor="districtTitle" className="form-label">
//                                     Experience<span className="text-danger">*</span>
//                                 </label>
//                                 <input
//                                     maxLength={50}
//                                     type="text"
//                                     className="form-control"
//                                     placeholder="Enter Experience"
//                                     value={state.experience}
//                                     onChange={(e) => {
//                                         setErrorMessage(false);

//                                         setState({
//                                             ...state,
//                                             experience: e.target.value,
//                                         });
//                                     }}
//                                 />
//                                 {error &&
//                                     (!state.experience ||
//                                         state.experience.trim() === '') && (
//                                         <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
//                                     )}
//                             </div>


//                             <div className="col-md-12 mb-3">
//                                 <label htmlFor="districtTitle" className="form-label">
//                                     Date Of Birth<span className="text-danger">*</span>
//                                 </label>
//                                 <input
//                                     maxLength={50}
//                                     type="date"
//                                     max={getMaxDate()} // Restrict to 18 years ago or earlier
//                                     className="form-control"
//                                     placeholder="Enter Date Of Birth"
//                                     value={state.dob}
//                                     onChange={(e) => {
//                                         setErrorMessage(false);
//                                         setState({
//                                             ...state,
//                                             dob: e.target.value,
//                                         });
//                                     }}
//                                 />
//                                 {error &&
//                                     (!state.dob ||
//                                         state.dob.trim() === '') && (
//                                         <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
//                                     )}
//                             </div>



//                             <div>
//                                 <label htmlFor="canonicalTag" className="form-label">
//                                     Address
//                                     <span className="text-danger">*</span>
//                                 </label>
//                                 <textarea
//                                     type="text"
//                                     className="form-control"
//                                     id="address"
//                                     placeholder="Enter Meta Title"
//                                     value={state?.address}
//                                     onChange={(e) => setState({ ...state, address: e.target.value })}
//                                 />
//                                 {error && (state.address === null || state.address === undefined || state.address === '') ? (
//                                     <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
//                                 ) : (
//                                     ''
//                                 )}

//                             </div>

//                             {/* upload image  start*/}
//                             <div className="col-md-12 mb-3">
//                                 <div className="mb-3 position-relative">
//                                     <div className="d-flex justify-content-between align-items-center mb-1">
//                                         <label
//                                             htmlFor="imageUpload"
//                                             className="form-label "
//                                         >
//                                             Employee Image
//                                             <span className="text-danger">*</span>
//                                         </label>
//                                     </div>
//                                     <div
//                                         className="position-relative d-flex align-items-center justify-content-center w-100 border rounded"
//                                         style={{ height: "12rem" }}
//                                     >
//                                         {filePreview ? (
//                                             <>
//                                                 {/* Remove Button */}
//                                                 <button
//                                                     onClick={handleRemoveImage}
//                                                     style={{
//                                                         padding: "3px 10px",
//                                                         position: "absolute",
//                                                         top: "5px",
//                                                         right: "5px",
//                                                         border: "none",
//                                                         outline: "none",
//                                                         zIndex: "20",
//                                                         background: "transparent",
//                                                         fontSize: "20px",
//                                                         cursor: "pointer",
//                                                         color: "black",
//                                                     }}
//                                                 >
//                                                     <i className="fas fa-times"></i>
//                                                 </button>

//                                                 {/* Preview Image */}
//                                                 <img
//                                                     style={{ objectFit: "contain" }}
//                                                     src={filePreview}
//                                                     alt="Preview"
//                                                     className="position-absolute top-0 start-0 w-100 h-100 border border-secondary rounded"
//                                                 />
//                                             </>
//                                         ) : (
//                                             <label
//                                                 htmlFor="custom-pujaCategoryImage"
//                                                 className="cursor-pointer text-center"
//                                             >
//                                                 <img
//                                                     src={CustomUploadImg} // replace with your CustomUploadImg path
//                                                     alt="upload_img"
//                                                     className="d-block mx-auto"
//                                                     style={{ height: "5rem" }}
//                                                 />
//                                                 <span>Upload image</span>
//                                             </label>
//                                         )}

//                                         {/* Hidden Input */}
//                                         <input
//                                             type="file"
//                                             id="custom-pujaCategoryImage"
//                                             accept="image/jpeg, image/png"
//                                             className="d-none"
//                                             onChange={handleImageChange}
//                                         />
//                                     </div>

//                                     {/* Error Messages */}
//                                     {sizeError ? (
//                                         <span className="text-danger small mx-3">{sizeError}</span>
//                                     ) : !selectedFile ? (
//                                         <span
//                                             className="text-muted mx-3"
//                                             style={{
//                                                 display: "block",
//                                                 fontWeight: "500",
//                                                 fontSize: "0.8rem",
//                                             }}
//                                         >
//                                             Supported file types are .jpg, .jpeg, .png up to a file size of 2MB.
//                                         </span>
//                                     ) : (
//                                         ""
//                                     )}

//                                     {error &&
//                                         (selectedFile === null ||
//                                             selectedFile === "" ||
//                                             selectedFile === undefined) && (
//                                             <span className="text-danger small mx-3">{ERROR_MESSAGES}</span>
//                                         )}
//                                 </div>
//                             </div>
//                             {/* upload image end  */}

//                         </div>
//                     </div>
//                 </Modal.Body>

//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => closeAll()}>
//                         Close
//                     </Button>
//                     <Button variant="primary" onClick={() => SubmitBtnClicked()}>
//                         Submit
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//             <SuccessPopupModal
//                 show={showSuccessModal}
//                 onHide={closeAll}
//                 successMassage={modelAction}
//             />
//             <ErrorModal
//                 show={showErrorModal}
//                 onHide={() => setShowErrorModal(false)}
//                 Massage={customError}
//             />
//         </>
//     );
// };

// export default PanditMasterAddUpdateModal;

