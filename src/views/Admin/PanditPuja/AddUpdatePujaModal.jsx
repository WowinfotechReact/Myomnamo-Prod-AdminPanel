import axios from 'axios';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import Text_Editor from 'component/Text_Editor';
import { ConfigContext } from 'context/ConfigContext';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import { CityLookupList } from 'services/AddressLookupList/AddressLookupListApi';
import { GetTempleLookupList } from 'services/Admin/TempleApi/TemplesApi';
import dayjs from 'dayjs';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import { PujaTypeIDOption } from 'Middleware/Utils';
import { GetPujaCategoryLookupList } from 'services/Pooja Category/PoojaCategoryApi';
import { GetAppLanguageLookupList } from 'services/Admin/AppLangauge/AppLanguageApi';
import { AddUpdatePuja, GetPujaModel } from 'services/Admin/Puja/PujaApi';
import CustomUploadImg from '../../../assets/images/upload_img.jpg';
import { UploadImage } from 'services/Upload Cloud-flare Image/UploadCloudflareImageApi';
import { GetBenefitLookupList } from 'services/Admin/TempleApi/Benefit/BenefitApi';


const AddUpdatePujaModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
    const { setLoader, user } = useContext(ConfigContext);
    const [pujaCategoryOption, setPujaCategoryOption] = useState([])
    const [templeOption, setTempleOption] = useState([])
    const [districtOption, setDistrictOption] = useState([])
    const [stateOption, setStateOption] = useState([])
    const [templePujaSubCatOption, setTemplePujaSubCatOption] = useState([])
    const [isAllDaySelected, setAllDaySelected] = useState(false)
    const [error, setError] = useState(false)
    const [customError, setCustomError] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [isAddressChanged, setIsAddressChanged] = useState(false)
    const [languageList, setLanguageList] = useState([])
    const [templeList, setTempleList] = useState([])

    const [filePreview, setFilePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [sizeError, setSizeError] = useState("");
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [actionMassage, setActionMassage] = useState(null)

    const [districtList, setDistrictList] = useState([])
    const [benefitList, setBenefitList] = useState([])
    const [deityList, setDeityList] = useState([])
    const [heading, setHeading] = useState('Puja')

    const [pujaFormObj, setPujaFormObj] = useState({
        adminID: null,
        appLangID: null,
        templeID: null,
        pujaTime: null,
        pujaDate: null,
        pujaServiceID: null,
        pujaServiceID: null,
        pujaSubServiceID: null,
        pujaCategoryID: null,
        pujaTypeID: 2,
        pujaName: null,
        onlinePujaPrice: null,
        offlinePujaPrice: null,
        convenienceFee: null,
        pujaDiscount: null,
        wetSamagriPrice: null,
        drySamagriPrice: null,
        pujaImageUrl: null,
        pujaSamagri: null,
        pujaDetails: null,
        pujaFor: null,
        benefitsofPuja: null,
        aboutPuja: null,
        aboutTemple: null,
        pujaTrend: true,
        pujaSlug: null,
        shortDescription: null,
        keyFeature: null,
        metaTitle: null,
        metaDescription: null,
        openGraphTag: null,
        canonicalTag: null,
        extraMetaTag: null,
        upcomingPujaDate: null,
        benefitID: [],
        showInSubscriptionOnly: false
    })

    useEffect(() => {
        if (show) {
            isPageRender()
            GetPujaCategoryLookupListData()
            GetAppLanguageLookupListData()
            GetTempleLookupListData()

            if (modelRequestData?.Action === "update" && modelRequestData?.pujaKeyID !== null && modelRequestData?.pujaKeyID !== "") {
                GetPujaModelData()
            }
        }
    }, [show])

    const isPageRender = () => {
        if (modelRequestData?.pujaSubServiceID === 5) {
            setHeading('Pandit Puja')
        } else if (modelRequestData?.pujaSubServiceID === 6) {
            setHeading('Daily Pandit Puja')
        } else if (modelRequestData?.pujaSubServiceID === 1) {
            setHeading('Remedy Puja')
        } else if (modelRequestData?.pujaSubServiceID === 2) {
            setHeading('Homam Puja')
        } else if (modelRequestData?.pujaSubServiceID === 3) {
            setHeading('Subscription Remedy Puja')
        } else if (modelRequestData?.pujaSubServiceID === 4) {
            setHeading('Subscription Homam Puja')
        }

    }

    const GetBenefitLookupListData = async (ID) => {
        try {
            const response = await GetBenefitLookupList(ID); // Ensure it's correctly imported

            if (response?.data?.statusCode === 200) {
                const list = response?.data?.responseData?.data || [];

                const formattedLangList = list.map((Lang) => ({
                    value: Lang.benefitID,
                    label: Lang.benefitName,
                }));

                setBenefitList(formattedLangList);
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

    const GetPujaModelData = async () => {
        setLoader(true);
        try {
            const response = await GetPujaModel(modelRequestData?.pujaKeyID, modelRequestData?.appLangID);

            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        setPujaFormObj((prev) => ({
                            ...prev,
                            appLangID: List?.appLangID,
                            pujaServiceID: List?.pujaServiceID,

                            pujaSubServiceID: List?.pujaSubServiceID,
                            pujaCategoryID: List?.pujaCategoryID,
                            pujaTypeID: List?.pujaTypeID,
                            pujaName: List?.pujaName,
                            onlinePujaPrice: List?.onlinePujaPrice,
                            offlinePujaPrice: List?.offlinePujaPrice,
                            convenienceFee: List?.convenienceFee,
                            pujaDiscount: List?.pujaDiscount,
                            wetSamagriPrice: List?.wetSamagriPrice,
                            drySamagriPrice: List?.drySamagriPrice,
                            pujaImageUrl: List?.pujaImageUrl,
                            pujaSamagri: List?.pujaSamagri,
                            pujaDetails: List?.pujaDetails,
                            pujaFor: List?.pujaFor,
                            benefitsofPuja: List?.benefitsofPuja,
                            aboutPuja: List?.aboutPuja,
                            aboutTemple: List?.aboutTemple,
                            pujaTrend: List?.pujaTrend,
                            pujaSlug: List?.pujaSlug,
                            shortDescription: List?.shortDescription,
                            keyFeature: List?.keyFeature,
                            metaTitle: List?.metaTitle,
                            metaDescription: List?.metaDescription,
                            openGraphTag: List?.openGraphTag,
                            canonicalTag: List?.canonicalTag,
                            extraMetaTag: List?.extraMetaTag,
                            upcomingPujaDate: List?.upcomingPujaDate,
                            templeID: List?.templeID,
                            pujaDate: List?.pujaDate,
                            pujaTime: List?.pujaTime,
                            showInSubscriptionOnly: List?.showInSubscriptionOnly,
                            benefitID: List?.benefitIDs,
                        }))
                        GetBenefitLookupListData(List?.templeID)
                        setSelectedFile(List?.pujaImageUrl)
                        setFilePreview(List?.pujaImageUrl)
                        setUploadedImageUrl(List?.pujaImageUrl)
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

    const GetPujaCategoryLookupListData = async () => {
        try {
            const response = await GetPujaCategoryLookupList(); // Ensure it's correctly imported

            if (response?.data?.statusCode === 200) {
                const languageLookupList = response.data.responseData.data || [];

                const formattedLangList = languageLookupList.map((Lang) => ({
                    value: Lang.pujaCategoryID,
                    label: Lang.pujaCategoryName,
                }));

                setPujaCategoryOption(formattedLangList);
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

    const setDataInitial = () => {
        setPujaFormObj((prev) => ({
            ...prev,
           adminID: null,
        appLangID: null,
        templeID: null,
        pujaTime: null,
        pujaDate: null,
        pujaServiceID: null,
        pujaServiceID: null,
        pujaSubServiceID: null,
        pujaCategoryID: null,
        pujaTypeID: 2,
        pujaName: null,
        onlinePujaPrice: null,
        offlinePujaPrice: null,
        convenienceFee: null,
        pujaDiscount: null,
        wetSamagriPrice: null,
        drySamagriPrice: null,
        pujaImageUrl: null,
        pujaSamagri: null,
        pujaDetails: null,
        pujaFor: null,
        benefitsofPuja: null,
        aboutPuja: null,
        aboutTemple: null,
        pujaTrend: true,
        pujaSlug: null,
        shortDescription: null,
        keyFeature: null,
        metaTitle: null,
        metaDescription: null,
        openGraphTag: null,
        canonicalTag: null,
        extraMetaTag: null,
        upcomingPujaDate: null,
        benefitID: [],
        showInSubscriptionOnly: false
        }))
    }

    const closeAll = () => {
        setError(false)
        setShowErrorModal(false)
        setShowSuccessModal(false)
        handleRemoveImage()
        setDataInitial()
        onHide()
    }

    const SubmitBtnClicked = () => {

        let isValid = true
        if (modelRequestData?.pujaSubServiceID === 5 && modelRequestData?.moduleName === "PujaList" && (pujaFormObj?.pujaName === null || pujaFormObj?.pujaName === undefined || pujaFormObj?.pujaName === "" ||

            pujaFormObj?.pujaTypeID === null || pujaFormObj?.pujaTypeID === undefined || pujaFormObj?.pujaTypeID === "" ||
            pujaFormObj?.pujaCategoryID === null || pujaFormObj?.pujaCategoryID === undefined || pujaFormObj?.pujaCategoryID === "" ||
            pujaFormObj?.convenienceFee === null || pujaFormObj?.convenienceFee === undefined || pujaFormObj?.convenienceFee === "" ||
            pujaFormObj?.wetSamagriPrice === null || pujaFormObj?.wetSamagriPrice === undefined || pujaFormObj?.wetSamagriPrice === "" ||
            pujaFormObj?.drySamagriPrice === null || pujaFormObj?.drySamagriPrice === undefined || pujaFormObj?.drySamagriPrice === "" ||
            // pujaFormObj?.pujaSamagri === null || pujaFormObj?.pujaSamagri === undefined || pujaFormObj?.pujaSamagri === "" ||
            pujaFormObj?.pujaDetails === null || pujaFormObj?.pujaDetails === undefined || pujaFormObj?.pujaDetails === "" ||
            pujaFormObj?.pujaTrend === null || pujaFormObj?.pujaTrend === undefined || pujaFormObj?.pujaTrend === "" ||
            pujaFormObj?.pujaSlug === null || pujaFormObj?.pujaSlug === undefined || pujaFormObj?.pujaSlug === "" ||
            pujaFormObj?.shortDescription === null || pujaFormObj?.shortDescription === undefined || pujaFormObj?.shortDescription === ""
            // pujaFormObj?.metaTitle === null || pujaFormObj?.metaTitle === undefined || pujaFormObj?.metaTitle === "" ||
            // pujaFormObj?.metaDescription === null || pujaFormObj?.metaDescription === undefined || pujaFormObj?.metaDescription === ""

        )
        ) {
            setError(true)
            isValid = false
        } else if ((modelRequestData?.pujaSubServiceID === 5 && modelRequestData?.moduleName === "PujaList") && (((pujaFormObj?.pujaTypeID === 3 && (pujaFormObj?.onlinePujaPrice === null || pujaFormObj?.onlinePujaPrice === undefined || pujaFormObj?.onlinePujaPrice === "" ||
            pujaFormObj?.offlinePujaPrice === null || pujaFormObj?.offlinePujaPrice === undefined || pujaFormObj?.offlinePujaPrice === ""))) ||
            (pujaFormObj?.pujaTypeID === 1 && (pujaFormObj?.onlinePujaPrice === null || pujaFormObj?.onlinePujaPrice === undefined || pujaFormObj?.onlinePujaPrice === "")) ||
            ((pujaFormObj?.pujaTypeID === 2 && (pujaFormObj?.offlinePujaPrice === null || pujaFormObj?.offlinePujaPrice === undefined || pujaFormObj?.offlinePujaPrice === ""))))) {
            setError(true)
            isValid = false
        } else if (modelRequestData?.pujaSubServiceID === 6 && modelRequestData?.moduleName === "PujaList" && (
            pujaFormObj?.pujaTypeID === null || pujaFormObj?.pujaTypeID === undefined || pujaFormObj?.pujaTypeID === "" ||
            // pujaFormObj?.pujaCategoryID === null || pujaFormObj?.pujaCategoryID === undefined || pujaFormObj?.pujaCategoryID === "" ||
            pujaFormObj?.convenienceFee === null || pujaFormObj?.convenienceFee === undefined || pujaFormObj?.convenienceFee === "" ||
            pujaFormObj?.wetSamagriPrice === null || pujaFormObj?.wetSamagriPrice === undefined || pujaFormObj?.wetSamagriPrice === "" ||
            pujaFormObj?.drySamagriPrice === null || pujaFormObj?.drySamagriPrice === undefined || pujaFormObj?.drySamagriPrice === "" ||
            // pujaFormObj?.pujaSamagri === null || pujaFormObj?.pujaSamagri === undefined || pujaFormObj?.pujaSamagri === "" ||
            pujaFormObj?.pujaDetails === null || pujaFormObj?.pujaDetails === undefined || pujaFormObj?.pujaDetails === "" ||
            pujaFormObj?.pujaTrend === null || pujaFormObj?.pujaTrend === undefined || pujaFormObj?.pujaTrend === "" ||
            pujaFormObj?.pujaSlug === null || pujaFormObj?.pujaSlug === undefined || pujaFormObj?.pujaSlug === "" ||
            pujaFormObj?.shortDescription === null || pujaFormObj?.shortDescription === undefined || pujaFormObj?.shortDescription === "" ||
            pujaFormObj?.offlinePujaPrice === null || pujaFormObj?.offlinePujaPrice === undefined || pujaFormObj?.metaTitle === ""

        )) {
            setError(true)
            isValid = false
        }
        else if (modelRequestData?.moduleName === "LanguageWiseList" &&
            (
                pujaFormObj?.appLangID === null || pujaFormObj?.appLangID === undefined || pujaFormObj?.appLangID === "" ||
                pujaFormObj?.pujaName === null || pujaFormObj?.pujaName === undefined || pujaFormObj?.pujaName === "" ||

                // pujaFormObj?.pujaSamagri === null || pujaFormObj?.pujaSamagri === undefined || pujaFormObj?.pujaSamagri === "" ||
                pujaFormObj?.pujaDetails === null || pujaFormObj?.pujaDetails === undefined || pujaFormObj?.pujaDetails === "" ||

                pujaFormObj?.shortDescription === null || pujaFormObj?.shortDescription === undefined || pujaFormObj?.shortDescription === ""
                // pujaFormObj?.keyFeature === null || pujaFormObj?.keyFeature === undefined || pujaFormObj?.keyFeature === ""

            )) {
            setError(true)
            isValid = false
        } else if ((modelRequestData?.pujaSubServiceID !== 6 && modelRequestData?.pujaSubServiceID !== 5) && (pujaFormObj?.templeID === null || pujaFormObj?.templeID === undefined || pujaFormObj?.templeID === "")) {
            setError(true)
            isValid = false
        }

        const apiParam = {
            templeID: pujaFormObj?.templeID,
            adminID: user?.adminID,
            pujaKeyID: modelRequestData?.pujaKeyID,
            appLangID: pujaFormObj?.appLangID === 0 ? null : pujaFormObj?.appLangID,
            pujaServiceID: modelRequestData?.pujaServiceID,
            pujaBylangKeyID: modelRequestData?.pujaBylangKeyID,
            pujaSubServiceID: modelRequestData?.pujaSubServiceID,
            pujaCategoryID: pujaFormObj?.pujaCategoryID,
            pujaTypeID: (pujaFormObj?.pujaTypeID === 0) ? 2 : pujaFormObj?.pujaTypeID,
            pujaName: pujaFormObj?.pujaName,
            pujaDate: null,
            pujaTime: null,
            onlinePujaPrice: pujaFormObj?.onlinePujaPrice,
            offlinePujaPrice: pujaFormObj?.offlinePujaPrice,
            convenienceFee: pujaFormObj?.convenienceFee,
            pujaDiscount: pujaFormObj?.pujaDiscount===""?0:pujaFormObj?.pujaDiscount,
            wetSamagriPrice: pujaFormObj?.wetSamagriPrice,
            drySamagriPrice: pujaFormObj?.drySamagriPrice,
            pujaImageUrl: pujaFormObj?.pujaImageUrl,
            pujaSamagri: pujaFormObj?.pujaSamagri,
            pujaDetails: pujaFormObj?.pujaDetails,
            pujaFor: pujaFormObj?.pujaFor,
            benefitsofPuja: pujaFormObj?.benefitsofPuja,
            aboutPuja: pujaFormObj?.aboutPuja,
            aboutTemple: pujaFormObj?.aboutTemple,
            pujaTrend: pujaFormObj?.pujaTrend,
            pujaSlug: pujaFormObj?.pujaSlug,
            shortDescription: pujaFormObj?.shortDescription,
            keyFeature: pujaFormObj?.keyFeature,
            metaTitle: pujaFormObj?.metaTitle,
            metaDescription: pujaFormObj?.metaDescription,
            openGraphTag: pujaFormObj?.openGraphTag,
            canonicalTag: pujaFormObj?.canonicalTag,
            extraMetaTag: pujaFormObj?.extraMetaTag,
            upcomingPujaDate: pujaFormObj?.upcomingPujaDate,
            pujaImageUrl: uploadedImageUrl,
            showInSubscriptionOnly: pujaFormObj?.showInSubscriptionOnly,
            benefitIDs: pujaFormObj?.benefitID,
        }



        if (isValid) {
            console.log('ApiParam', apiParam)
            AddUpdatePujaData(apiParam)
        }
    }

    const AddUpdatePujaData = async (ApiParam) => {

        setLoader(true);
        try {
            const response = await AddUpdatePuja(ApiParam);
            if (response?.data?.statusCode === 200) {
                setLoader(false);
                if (modelRequestData?.Action === null && modelRequestData?.moduleName === "LanguageWiseList") {
                    setActionMassage(`${heading} language has been added successfully.`)
                } else if (modelRequestData?.Action === null && modelRequestData?.moduleName === "PujaList") {
                    setActionMassage(`${heading} has been added successfully.`)
                } else if (modelRequestData?.Action === 'update' && modelRequestData?.moduleName === "LanguageWiseList") {
                    setActionMassage(`${heading} language has been updated successfully.`)
                } else if (modelRequestData?.Action === 'update' && modelRequestData?.moduleName === "PujaList") {
                    setActionMassage(`${heading} has been updated successfully.`)
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

    const formatSlug = (value) => {
        const slug = value.toLowerCase().replace(/\s+/g, '-');
        setPujaFormObj((prev) => ({ ...prev, pujaSlug: slug }))
    }

    const handleChange = (e) => {

        let { id, value } = e.target;
        if (id === "pujaName") {
            // Remove leading spaces
            // value = value.replace(/[^a-zA-Z\s]/g, '');
            value = value.replace(/^\s+/, '');

            // Capitalize first letter (if any)
            if (value.length > 0) {
                value = value.charAt(0).toUpperCase() + value.slice(1);
            }
            formatSlug(value)
        }
        if (id === "pujaSlug") {
            // Remove leading spaces
            // value = value.replace(/[^a-zA-Z\s]/g, '');
            value = value.replace(/[\s]/g, '');
        }

        if (id === "onlinePujaPrice" || id === "convenienceFee" || id === "offlinePujaPrice" || id === "drySamagriPrice" || id === "wetSamagriPrice") {
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

        if (id === "pujaDiscount") {

            let numericValue = value.replace(/\D/g, '').slice(0, 3); // Only digits, max 3 characters

            // Allow empty value (so user can delete)
            if (numericValue === '' || Number(numericValue) <= 100) {
                value = numericValue;
            } else {
                // Keep previous valid value (fallback)
                value = pujaFormObj?.pujaDiscount || '';
            }


        }
        if (id === "metaTitle" || id === "metaDescription" || id === "canonicalTag" || id === "extraMetaTag" || id === "openGraphTag") {
            value = value.replace(/^\s+/, '');
        }


        setPujaFormObj((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handlePujaDetailsDescriptionChange = (htmlContent) => {

        // Strip HTML tags and check if anything meaningful remains
        const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

        setPujaFormObj((obj) => ({
            ...obj,
            pujaDetails: strippedContent === '' ? null : htmlContent,
        }));
    };
    const handleShortDescriptionChange = (htmlContent) => {

        // Strip HTML tags and check if anything meaningful remains
        const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

        setPujaFormObj((obj) => ({
            ...obj,
            shortDescription: strippedContent === '' ? null : htmlContent,
        }));
    };
    const handlePujaSamagriChange = (htmlContent) => {

        // Strip HTML tags and check if anything meaningful remains
        const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

        setPujaFormObj((obj) => ({
            ...obj,
            pujaSamagri: strippedContent === '' ? null : htmlContent,
        }));
    };
    const handleKeyFeaturesChange = (htmlContent) => {

        // Strip HTML tags and check if anything meaningful remains
        const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

        setPujaFormObj((obj) => ({
            ...obj,
            keyFeature: strippedContent === '' ? null : htmlContent,
        }));
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

    const handleToDateChange = (newValue) => {
        if (dayjs(newValue).isValid()) {
            const newToDate = dayjs(newValue).format("YYYY-MM-DD");
            setPujaFormObj((prev) => ({ ...prev, pujaDate: newToDate }));
        } else {
            setPujaFormObj((prev) => ({ ...prev, pujaDate: null }));
        }
    };
    return (
        <>
            <Modal style={{ zIndex: 1300 }} size='lg' show={show} backdrop="static" keyboard={false} centered>
                <Modal.Header>
                    <h4 className="text-center">{modelRequestData?.Action === null ? `Add ${heading}` : `Update ${heading}`}</h4>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
                    <div className="container-fluid ">
                        <fieldset className="border rounded p-3">
                            <legend className="float-none w-auto px-2 fw-bold" style={{ fontSize: "14px" }}>
                                Puja Descriptions
                            </legend>

                            <div className="row">
                                {/*  Select Temple  */}
                                {(modelRequestData?.pujaSubServiceID !== 6 && modelRequestData?.pujaSubServiceID !== 5) && (
                                    <div div className="col-md-6 mb-3">
                                        <label htmlFor="templeID" className="form-label">
                                            Select Temple <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            id='templeID'
                                            options={templeList}
                                            value={templeList.filter((item) => item.value === pujaFormObj.templeID)}
                                            onChange={(selectedOption) => {
                                                setPujaFormObj((prev) => ({
                                                    ...prev,
                                                    templeID: selectedOption ? selectedOption.value : null,
                                                }))
                                                GetBenefitLookupListData(selectedOption?.value)
                                            }
                                            }
                                            menuPlacement="auto"
                                            menuPosition="fixed"
                                        />
                                        {error && (pujaFormObj.templeID === null || pujaFormObj.templeID === undefined || pujaFormObj.templeID === '') ? (
                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                )}

                                {/* Puja Name */}
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="pujaName" className="form-label">
                                        Puja Name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        maxLength={90}
                                        type="text"
                                        className="form-control"
                                        id="pujaName"
                                        placeholder="Enter Puja Name"
                                        aria-describedby="Employee"
                                        value={pujaFormObj.pujaName}
                                        onChange={handleChange}
                                    />
                                    {error && (pujaFormObj.pujaName === null || pujaFormObj.pujaName === undefined || pujaFormObj.pujaName === '') ? (
                                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                    ) : (
                                        ''
                                    )}
                                </div>

                                {modelRequestData?.pujaSubServiceID !== 5 && modelRequestData?.pujaSubServiceID !== 6 && (
                                    <>
                                        {/* Select benefitID */}
                                        <div className="col-md-6 col-sm-12 mb-2 d-flex flex-column form-font-size">
                                            <label htmlFor="districtID" className="form-label">
                                                Select Benefits
                                                {/* <span className="text-danger">*</span> */}
                                            </label>
                                            <Select
                                                isMulti
                                                options={benefitList}
                                                value={benefitList?.filter((v) => pujaFormObj.benefitID?.includes(v.value))}
                                                onChange={(selectedOptions) => {
                                                    setPujaFormObj((prev) => ({
                                                        ...prev,
                                                        benefitID: selectedOptions ? selectedOptions?.map((opt) => opt.value) : [],
                                                    }))

                                                }
                                                }
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 }),  // 👈 big z-index
                                                }}
                                                isDisabled={pujaFormObj?.templeID === null}
                                            />
                                            {/* {error && (!pujaFormObj?.benefitID === null && pujaFormObj?.benefitID === undefined) && (
                                                <span className="text-danger">{ERROR_MESSAGES}</span>
                                            )} */}
                                        </div>
                                        {/*Booking Data*/}
                                        <div className="col-md-6 col-sm-12 mb-2 d-flex flex-column form-font-size">
                                            <label
                                                htmlFor="bookingDate"
                                                style={{ textAlign: "left" }}
                                            >
                                                Puja Date
                                                {/* <span style={{ color: "red" }}>*</span> */}
                                            </label>
                                            <DatePicker
                                                id="bookingDate"
                                                value={pujaFormObj?.pujaDate || ""}

                                                clearIcon={null}
                                                onChange={handleToDateChange}
                                                format="dd/MM/yyyy"
                                                className="custom-date-picker"
                                            />

                                            {/* {error && !pujaFormObj.pujaDate && (
                                                <span className="error-msg">{ERROR_MESSAGES}</span>
                                            )} */}
                                        </div>

                                        {/* Booking Time */}
                                        <div className="col-md-6 col-sm-12 mb-2 d-flex flex-column form-font-size">
                                            <label

                                                style={{ textAlign: "left" }}
                                            >
                                                Time
                                                {/* <span style={{ color: "red" }}>*</span> */}
                                            </label>
                                            <input
                                                id="bookingTime"
                                                type="time"
                                                className="form-control"
                                                value={pujaFormObj.pujaTime || ""}
                                                onClick={(e) =>
                                                    e.target.showPicker && e.target.showPicker()
                                                }
                                                onChange={(e) => {
                                                    const [hour, minute] = e.target.value.split(":");
                                                    let hr = parseInt(hour, 10);
                                                    const ampm = hr >= 12 ? "PM" : "AM";
                                                    hr = hr % 12 || 12; // convert hoga yaha pr -> 13 ka -> 1
                                                    const formattedTime = `${hr}:${minute} ${ampm}`;

                                                    setPujaFormObj((prev) => ({
                                                        ...prev,
                                                        pujaTime: e.target.value,
                                                        time24: e.target.value,
                                                    }));
                                                }}
                                            />
                                            {/* {error && !pujaFormObj.pujaTime && (
                                                <span className="error-msg">{ERROR_MESSAGES}</span>
                                            )} */}
                                        </div>


                                    </>
                                )}



                                {/* Language */}
                                {modelRequestData?.moduleName === "LanguageWiseList" && (
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="offlinePujaPrice" className="form-label">
                                            Select Language <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            options={languageList}
                                            value={languageList?.filter((v) => v?.value === pujaFormObj?.appLangID)}
                                            onChange={(selectedOption) =>
                                                setPujaFormObj((prev) => ({
                                                    ...prev,
                                                    appLangID: selectedOption ? selectedOption.value : null,
                                                }))
                                            }
                                            menuPlacement="auto"
                                            menuPosition="fixed"
                                        />
                                        {error && (!pujaFormObj?.appLangID) && (
                                            <span className="text-danger">{ERROR_MESSAGES}</span>
                                        )}
                                    </div>
                                )}

                                {/* Select Puja Sub Category */}
                                {/* <div className="col-md-6 mb-3">
                                <label htmlFor="pujaCategoryID" className="form-label">
                                    Select Puja Sub Category <span className="text-danger">*</span>
                                </label>
                                <Select
                                    options={templePujaSubCatOption}
                                    value={templePujaSubCatOption.filter((item) => item.value === pujaFormObj.tempPujaSubCatID)}
                                    // onChange={handleTemplePujaSubCatChange}
                                    menuPosition="fixed"
                                    isDisabled={!pujaFormObj.tempPujaCatID}  // 🔑 disabled if no category selected

                                />
                                {error && (pujaFormObj.tempPujaSubCatID === null || pujaFormObj.tempPujaSubCatID === undefined || pujaFormObj.tempPujaSubCatID === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )}
                            </div> */}


                                {modelRequestData?.moduleName !== "LanguageWiseList" && (
                                    <>
                                        {(modelRequestData?.pujaSubServiceID === 5) && (
                                            <>
                                                {/*  Select Puja Category  */}
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="pujaCategoryID" className="form-label">
                                                        Select Puja Category <span className="text-danger">*</span>
                                                    </label>
                                                    <Select
                                                        id='pujaCategoryID'
                                                        options={pujaCategoryOption}
                                                        value={pujaCategoryOption.filter((item) => item.value === pujaFormObj.pujaCategoryID)}
                                                        onChange={(selectedOption) =>
                                                            setPujaFormObj((prev) => ({
                                                                ...prev,
                                                                pujaCategoryID: selectedOption ? selectedOption.value : null,
                                                            }))
                                                        }
                                                        menuPlacement="auto"
                                                        menuPosition="fixed"
                                                    />
                                                    {error && (pujaFormObj.pujaCategoryID === null || pujaFormObj.pujaCategoryID === undefined || pujaFormObj.pujaCategoryID === '') ? (
                                                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>


                                            </>
                                        )}

                                        {/* Select Puja Type */}
                                        {(modelRequestData?.pujaSubServiceID !== 5 && modelRequestData?.pujaSubServiceID !== 6) && (
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="pujaCategoryID" className="form-label">
                                                    Select Puja Type<span className="text-danger">*</span>
                                                </label>
                                                <Select
                                                    options={PujaTypeIDOption.filter((value) => value?.value !== 1)}
                                                    value={PujaTypeIDOption.filter((item) => item.value === pujaFormObj.pujaTypeID)}
                                                    onChange={(selectedOption) =>
                                                        setPujaFormObj((prev) => ({
                                                            ...prev,
                                                            pujaTypeID: selectedOption ? selectedOption.value : null,
                                                            onlinePujaPrice: selectedOption?.value === 2 ? null : prev?.onlinePujaPrice,
                                                            offlinePujaPrice: selectedOption?.value === 1 ? null : prev?.offlinePujaPrice,
                                                        }))
                                                    }
                                                    menuPlacement="auto"
                                                    menuPosition="fixed"

                                                />
                                                {error && (!pujaFormObj?.pujaTypeID) && (
                                                    <span className="text-danger">{ERROR_MESSAGES}</span>
                                                )}
                                            </div>
                                        )}

                                        {/*  Is Trending Puja */}
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="canonicalTag" className="form-label">
                                                Is Trending Puja <span className="text-danger">*</span>
                                            </label>
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
                                                <label className="inline-flex items-center mx-1">
                                                    <input
                                                        type="radio"
                                                        id="isTrendingPujaYes"
                                                        name="isTrendingPuja"
                                                        value={1}
                                                        checked={pujaFormObj.pujaTrend == true}
                                                        onChange={(e) => {

                                                            setPujaFormObj((prev) => ({
                                                                ...prev,
                                                                pujaTrend: e.target.value == 1 ? true : false,
                                                            }))
                                                        }
                                                        }
                                                        className="form-radio h-4 w-4 text-blue-600"
                                                    />
                                                    <span className="ml-2 mx-2 text-sm text-gray-700">Yes</span>
                                                </label>

                                                <label className="inline-flex items-center mx-1">
                                                    <input
                                                        type="radio"
                                                        id="isTrendingPujaNo"
                                                        name="pujaTrend"
                                                        value={2}
                                                        checked={pujaFormObj.pujaTrend == false}
                                                        onChange={(e) =>
                                                            setPujaFormObj((prev) => ({
                                                                ...prev,
                                                                pujaTrend: e.target.value == 2 ? false : true,
                                                            }))
                                                        }
                                                        className="form-radio h-4 w-4 text-blue-600"
                                                    />
                                                    <span className="ml-2 mx-2 text-sm text-gray-700">No</span>
                                                </label>
                                            </div>


                                            {/* Validation */}
                                            {error && (pujaFormObj.pujaTrend === null || pujaFormObj.pujaTrend === undefined || pujaFormObj.pujaTrend === '') ? (
                                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                        {/*  IS Subscription Puja only  */}
                                        {(modelRequestData?.pujaSubServiceID === 1 || modelRequestData?.pujaSubServiceID === 2) && (

                                            < div className="col-md-6 mb-3">
                                                <label htmlFor="isSubscriptionOnly" className="form-label">
                                                    Is Subscription Puja Only ? <span className="text-danger">*</span>
                                                </label>
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
                                                    <label className="inline-flex items-center mx-1">
                                                        <input
                                                            type="radio"
                                                            id="showInSubscriptionOnly"
                                                            name="isSubscriptionOnly"
                                                            value={1}
                                                            checked={pujaFormObj.showInSubscriptionOnly == true}
                                                            onChange={(e) => {

                                                                setPujaFormObj((prev) => ({
                                                                    ...prev,
                                                                    showInSubscriptionOnly: e.target.value == 1 ? true : false,
                                                                }))
                                                            }
                                                            }
                                                            className="form-radio h-4 w-4 text-blue-600"
                                                        />
                                                        <span className="ml-2 mx-2 text-sm text-gray-700">Yes</span>
                                                    </label>

                                                    <label className="inline-flex items-center mx-1">
                                                        <input
                                                            type="radio"
                                                            id="showInSubscriptionOnly"
                                                            name="pujaTrend"
                                                            value={2}
                                                            checked={pujaFormObj.showInSubscriptionOnly == false}
                                                            onChange={(e) =>
                                                                setPujaFormObj((prev) => ({
                                                                    ...prev,
                                                                    showInSubscriptionOnly: e.target.value == 2 ? false : true,
                                                                }))
                                                            }
                                                            className="form-radio h-4 w-4 text-blue-600"
                                                        />
                                                        <span className="ml-2 mx-2 text-sm text-gray-700">No</span>
                                                    </label>
                                                </div>


                                                {/* Validation */}
                                                {error && (pujaFormObj.pujaTrend === null || pujaFormObj.pujaTrend === undefined || pujaFormObj.pujaTrend === '') ? (
                                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        )}

                                        {/* { onlinePrice} */}
                                        {(pujaFormObj?.pujaTypeID == 1 || pujaFormObj?.pujaTypeID == 3) && (
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="onlinePujaPrice" className="form-label">
                                                    Online Price <span className="text-danger">*</span>
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="onlinePujaPrice"
                                                    placeholder="Enter Online Price"
                                                    value={pujaFormObj.onlinePujaPrice}
                                                    onChange={handleChange}
                                                />
                                                {error && (pujaFormObj.onlinePujaPrice === null || pujaFormObj.onlinePujaPrice === undefined || pujaFormObj.onlinePujaPrice === '') ? (
                                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                    ''
                                                )}

                                            </div>
                                        )}

                                        {/* Offline puja */}
                                        {((pujaFormObj?.pujaTypeID == 2 || pujaFormObj?.pujaTypeID == 3) && modelRequestData?.pujaSubServiceID !== 6) && (
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="offlinePujaPrice" className="form-label">
                                                    Offline Price <span className="text-danger">*</span>
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="offlinePujaPrice"
                                                    placeholder="Enter Offline Price"
                                                    value={pujaFormObj.offlinePujaPrice}
                                                    onChange={handleChange}
                                                />
                                                {error && (pujaFormObj.offlinePujaPrice === null || pujaFormObj.offlinePujaPrice === undefined || pujaFormObj.offlinePujaPrice === '') ? (
                                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                    ''
                                                )}

                                            </div>

                                        )}

                                        {(modelRequestData?.pujaSubServiceID === 6) && (
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="offlinePujaPrice" className="form-label">
                                                    Puja Price <span className="text-danger">*</span>
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="offlinePujaPrice"
                                                    placeholder="Enter Puja Price"
                                                    value={pujaFormObj.offlinePujaPrice}
                                                    onChange={handleChange}
                                                />
                                                {error && (pujaFormObj.offlinePujaPrice === null || pujaFormObj.offlinePujaPrice === undefined || pujaFormObj.offlinePujaPrice === '') ? (
                                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                    ''
                                                )}

                                            </div>
                                        )}



                                        {/* {convenienceFee} */}
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="convenienceFee" className="form-label">
                                                Convenience Fee <span className="text-danger">*</span>
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="convenienceFee"
                                                placeholder="Enter Convenience Fee "
                                                value={pujaFormObj.convenienceFee}
                                                onChange={handleChange}
                                            />
                                            {error && (pujaFormObj.convenienceFee === null || pujaFormObj.convenienceFee === undefined || pujaFormObj.convenienceFee === '') ? (
                                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                            ) : (
                                                ''
                                            )}





                                        </div>
                                        {/* {wetSamagriPrice } */}
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="wetSamagriPrice" className="form-label">
                                                Wet Samagri Price  <span className="text-danger">*</span>
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="wetSamagriPrice"
                                                placeholder="Enter Wet Samagri Price"
                                                value={pujaFormObj.wetSamagriPrice}
                                                onChange={handleChange}
                                            />
                                            {error && (pujaFormObj.wetSamagriPrice === null || pujaFormObj.wetSamagriPrice === undefined || pujaFormObj.wetSamagriPrice === '') ? (
                                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                            ) : (
                                                ''
                                            )}





                                        </div>

                                        {/* {Dry Samagri Price } */}
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="drySamagriPrice" className="form-label">
                                                Dry Samagri Price  <span className="text-danger">*</span>
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="drySamagriPrice"
                                                placeholder="Enter Dry Samagri Price"
                                                value={pujaFormObj.drySamagriPrice}
                                                onChange={handleChange}
                                            />
                                            {error && (pujaFormObj.drySamagriPrice === null || pujaFormObj.drySamagriPrice === undefined || pujaFormObj.drySamagriPrice === '') ? (
                                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                            ) : (
                                                ''
                                            )}





                                        </div>


                                        {/* {Discount } */}
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="pujaDiscount" className="form-label">
                                                Discount %
                                                {/* <span className="text-danger">*</span> */}
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="pujaDiscount"
                                                placeholder="Enter Discount %"
                                                value={pujaFormObj.pujaDiscount}
                                                onChange={handleChange}
                                            />
                                            {/* {error && (pujaFormObj.pujaDiscount === null || pujaFormObj.pujaDiscount === undefined || pujaFormObj.pujaDiscount === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )} */}
                                        </div>

                                        <fieldset className="border rounded p-3">
                                            <legend className="float-none w-auto px-2 fw-bold" style={{ fontSize: "14px" }}>
                                                Seo Details
                                            </legend>

                                            <div className="row">

                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="pujaSlug" className="form-label">
                                                        Slug <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="pujaSlug"               // <- changed
                                                        name="slug"
                                                        placeholder="Enter Temple Slug"
                                                        value={pujaFormObj?.pujaSlug} // fallback to avoid uncontrolled input
                                                        onChange={handleChange}
                                                    />
                                                    {error && (pujaFormObj.pujaSlug === null || pujaFormObj.pujaSlug === undefined || pujaFormObj.pujaSlug === '') ? (
                                                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>

                                                {/* Meta Title */}
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="metaTitle" className="form-label">
                                                        Meta Title
                                                        {/* <span className="text-danger">*</span> */}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="metaTitle"
                                                        placeholder="Enter Meta Title"
                                                        value={pujaFormObj?.metaTitle}
                                                        onChange={handleChange}
                                                    />
                                                    {/* {error && (pujaFormObj.metaTitle === null || pujaFormObj.metaTitle === undefined || pujaFormObj.metaTitle === '') ? (
                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                        ) : (
                                            ''
                                        )} */}
                                                </div>

                                                {/* Meta Description */}
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="metaDescription" className="form-label">
                                                        Meta Description
                                                        {/* <span className="text-danger">*</span> */}
                                                    </label>
                                                    <textarea
                                                        type="text"
                                                        className="form-control"
                                                        id="metaDescription"
                                                        placeholder="Enter Meta Description"
                                                        value={pujaFormObj?.metaDescription}
                                                        onChange={handleChange}
                                                    />
                                                    {/* {error && (pujaFormObj.metaDescription === null || pujaFormObj.metaDescription === undefined || pujaFormObj.metaDescription === '') ? (
                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                        ) : (
                                            ''
                                        )} */}
                                                </div>


                                                {/* Canonical Tag */}
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="canonicalTag" className="form-label">
                                                        Canonical Tag
                                                        {/* <span className="text-danger">*</span> */}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="canonicalTag"
                                                        placeholder="Enter Canonical Tag"
                                                        value={pujaFormObj?.canonicalTag}
                                                        onChange={handleChange}
                                                    />
                                                    {/* {error && (pujaFormObj.canonicalTag === null || pujaFormObj.canonicalTag === undefined || pujaFormObj.canonicalTag === '') ? (
                                            <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                        ) : (
                                            ''
                                        )} */}

                                                </div>

                                                {/* Extra Meta Tag */}
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="extraMetaTag" className="form-label">
                                                        Extra Meta Tag
                                                        {/* <span className="text-danger">*</span> */}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="extraMetaTag"
                                                        placeholder="Enter Extra Meta Tag"
                                                        value={pujaFormObj?.extraMetaTag}
                                                        onChange={handleChange}
                                                    />
                                                    {/* {error && (pujaFormObj.extraMetaTag === null || pujaFormObj.extraMetaTag === undefined || pujaFormObj.extraMetaTag === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )} */}

                                                </div>
                                                {/* Open Graph Tag */}
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="openGraphTag" className="form-label">
                                                        Open Graph Tag
                                                        {/* <span className="text-danger">*</span> */}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="openGraphTag"
                                                        placeholder="Enter Open Graph Tag"
                                                        value={pujaFormObj?.openGraphTag}
                                                        onChange={handleChange}
                                                    />
                                                    {/* {error && (pujaFormObj.openGraphTag === null || pujaFormObj.openGraphTag === undefined || pujaFormObj.openGraphTag === '') ? (
                                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                ) : (
                                    ''
                                )} */}

                                                </div>



                                                {modelRequestData?.moduleName !== "LanguageWiseList" && (
                                                    <div className="col-md-12 mb-3">
                                                        <div className="mb-3 position-relative">
                                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                                <label
                                                                    htmlFor="imageUpload"
                                                                    className="form-label "
                                                                >
                                                                    Puja  Image
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                            </div>
                                                            <div
                                                                className="position-relative d-flex align-items-center justify-content-center w-100 border rounded"
                                                                style={{ height: "12rem" }}
                                                            >
                                                                {filePreview ? (
                                                                    <>
                                                                        {/* Remove Button */}
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
                                                                    >
                                                                        <img
                                                                            src={CustomUploadImg} // replace with your CustomUploadImg path
                                                                            alt="upload_img"
                                                                            className="d-block mx-auto"
                                                                            style={{ height: "5rem" }}
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

                                                            {error &&
                                                                (selectedFile === null ||
                                                                    selectedFile === "" ||
                                                                    selectedFile === undefined) && (
                                                                    <span style={{ color: 'red', margin: '0px 12px' }}>{ERROR_MESSAGES}</span>
                                                                )}
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </fieldset>
                                        {/* Slug */}












                                    </>

                                )}


                                <fieldset className="border rounded p-3">
                                    <legend className="float-none w-auto px-2 fw-bold" style={{ fontSize: "14px" }}>
                                        Content  Descriptions
                                    </legend>

                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="canonicalTag" className="form-label">
                                                Puja Details<span className="text-danger">*</span>
                                            </label>
                                            <Text_Editor
                                                editorState={pujaFormObj?.pujaDetails}
                                                handleContentChange={handlePujaDetailsDescriptionChange}
                                            />
                                            {error && (pujaFormObj.pujaDetails === null || pujaFormObj.pujaDetails === undefined || pujaFormObj.pujaDetails === '') ? (
                                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                            ) : (
                                                ''
                                            )}
                                        </div>

                                        {/*  Short Description */}
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="shortDescription" className="form-label">
                                                Short Description<span className="text-danger">*</span>
                                            </label>
                                            <Text_Editor
                                                editorState={pujaFormObj?.shortDescription}
                                                handleContentChange={handleShortDescriptionChange}
                                            />
                                            {error && (pujaFormObj.shortDescription === null || pujaFormObj.shortDescription === undefined || pujaFormObj.shortDescription === '') ? (
                                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                            ) : (
                                                ''
                                            )}
                                        </div>

                                        {/* Puja Samagri */}
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="pujaSamagri" className="form-label">
                                                Puja Samagri
                                                {/* <span className="text-danger">*</span> */}
                                            </label>
                                            <Text_Editor
                                                editorState={pujaFormObj?.pujaSamagri}
                                                handleContentChange={handlePujaSamagriChange}
                                            />
                                            {/* {error && (pujaFormObj.pujaSamagri === null || pujaFormObj.pujaSamagri === undefined || pujaFormObj.pujaSamagri === '') ? (
                                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                            ) : (
                                                ''
                                            )} */}
                                        </div>


                                        {/* Key Features */}
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="keyFeature" className="form-label">
                                                Key Features
                                                {/* <span className="text-danger">*</span> */}
                                            </label>
                                            <Text_Editor
                                                editorState={pujaFormObj?.keyFeature}
                                                handleContentChange={handleKeyFeaturesChange}
                                            />
                                            {/* {error && (pujaFormObj.keyFeature === null || pujaFormObj.keyFeature === undefined || pujaFormObj.keyFeature === '') ? (
                                                <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                            ) : (
                                                ''
                                            )} */}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </fieldset>
                    </div>



                </Modal.Body >
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
            <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={actionMassage} />
            <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
        </>
    )
}

export default AddUpdatePujaModal
