import axios from 'axios';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import Text_Editor from 'component/Text_Editor';
import { ConfigContext } from 'context/ConfigContext';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import { AddUpdateTemple, GetTempleLookupList, GetTempleModel } from 'services/Admin/TempleApi/TemplesApi';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import { GetDeityLookupList } from 'services/Admin/Deity/DeityApi';
import { GetBenefitLookupList } from 'services/Admin/TempleApi/Benefit/BenefitApi';
import { GetAppLanguageLookupList } from 'services/Admin/AppLangauge/AppLanguageApi';
import { GetStateLookupList } from 'services/Master Api/MasterStateApi';
import { GetDistrictLookupList } from 'services/Master Api/MasterDistrictApi';
import { GetTempleByLanguageModel } from 'services/Admin/LanguageWiseTemple/LanguageWiseListApi';
import { googleMapKey } from 'component/Base-Url/BaseUrl';


const AddUpdateTempleModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
    const debounceTimer = useRef(null);
    const { setLoader, isValidEmail, isValidGST, isValidPAN, user, generateSlug, formatSlugOnChange, cleanSlugOnBlur } = useContext(ConfigContext);

    const [isAllDaySelected, setAllDaySelected] = useState(false)
    const [error, setError] = useState(false)
    const [customError, setCustomError] = useState(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [isAddressChanged, setIsAddressChanged] = useState(false)

    const [stateList, setStateList] = useState([])
    const [languageList, setLanguageList] = useState([])
    const [templeList, setTempleList] = useState([])
    const [districtList, setDistrictList] = useState([])
    const [benefitList, setBenefitList] = useState([])
    const [deityList, setDeityList] = useState([])

    const [templeData, setTempleData] = useState({
        templeName: null, templeRules: null, stateID: null, districtID: null, templeAddress: null, seatingCapacity: null, latitude: null, longitude: null, bestSeason: null, templeTimings: null, trend: 2, dayID: [],
        liveDarshanURL: null, isWhitePageLabel: 2, templeDetails: null, byAir: null, byTrain: null, byRoad: null, significanceOfTheTemple: null,
        architectureOfTheTemple: null, templeSlug: null, metaTitle: null, metaDescription: null, openGraphTag: null, canonicalTag: null, extraMetaTag: null, benefitID: [], deityID: [], templeID: null, appLangID: 1
    })

    useEffect(() => {
        if (show) {
            if (modelRequestData?.Action === 'update' && modelRequestData?.templeKeyID !== null && modelRequestData?.templeKeyID !== "" && modelRequestData?.templeKeyID !== undefined) {
                GetTempleModelData()
            }
            if (modelRequestData?.moduleName === "LanguageWiseList") {
                GetTempleLookupListData()
                setTempleData((prev) => ({
                    ...prev,
                    appLangID: null,
                }))
                GetAppLanguageLookupListData()
                if (modelRequestData?.Action === 'update' && modelRequestData?.templeLanID !== null) {
                    GetTempleByLanguageModelData()
                }
            }
            GetStateLookupListData()
            GetBenefitLookupListData()
            GetDeityLookupListData()
        }
    }, [show])

    useEffect(() => {
        if (isAddressChanged) {
            handleSearch()
            setIsAddressChanged(false)
        }
    }, [isAddressChanged])




    const GetTempleModelData = async () => {
        setLoader(true);
        try {
            const response = await GetTempleModel(modelRequestData?.templeKeyID, modelRequestData?.appLangID);

            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        setTempleData((prev) => ({
                            ...prev,
                            templeName: List?.templeName, templeRules: List?.templeRules, stateID: List?.stateID, districtID: List?.districtID,
                            templeAddress: List?.templeAddress, seatingCapacity: List?.seatingCapacity, latitude: List?.latitude, longitude: List?.longitude,
                            bestSeason: List?.bestSeason, templeTimings: List?.templeTimings, trend: List?.trend === true ? 1 : 2, dayID: List?.dayID,
                            liveDarshanURL: List?.liveDarshanURL, isWhitePageLabel: List?.isWhitePageLable === true ? 1 : 2, templeDetails: List?.templeDetails,
                            byAir: List?.byAir, byTrain: List?.byTrain, byRoad: List?.byRoad, significanceOfTheTemple: List?.significanceOfTheTemple,
                            architectureOfTheTemple: List?.architectureOfTheTemple, templeSlug: List?.templeSlug, metaTitle: List?.metaTitle,
                            metaDescription: List?.metaDescription, openGraphTag: List?.openGraphTag, canonicalTag: List?.canonicalTag, extraMetaTag: List?.extraMetaTag, deityID: List?.deityID, benefitID: List?.benefitID, appLangID: List?.appLangID
                        }))
                        if (List?.dayID?.length == 7) {
                            setAllDaySelected(true)
                        }
                        GetCityLookupListData(List?.stateID)
                        // setIsAddressChanged(true)
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
    const GetTempleByLanguageModelData = async () => {
        setLoader(true);
        try {
            const response = await GetTempleByLanguageModel(modelRequestData?.templeLanID);

            if (response) {
                if (response?.data?.statusCode === 200) {
                    setLoader(false);
                    if (response?.data?.responseData?.data) {
                        const List = response.data.responseData.data;
                        setTempleData((prev) => ({
                            ...prev,
                            templeName: List?.templeName, templeRules: List?.templeRules, stateID: List?.stateID, districtID: List?.districtID,
                            templeAddress: List?.templeAddress, seatingCapacity: List?.seatingCapacity, latitude: List?.latitude, longitude: List?.longitude,
                            bestSeason: List?.bestSeason, templeTimings: List?.templeTimings, trend: List?.trend === true ? 1 : 2, dayID: List?.dayID,
                            liveDarshanURL: List?.liveDarshanURL, isWhitePageLabel: List?.isWhitePageLable === "Yes" ? 1 : 2, templeDetails: List?.templeDetails,
                            byAir: List?.byAir, byTrain: List?.byTrain, byRoad: List?.byRoad, significanceOfTheTemple: List?.significanceOfTheTemple,
                            architectureOfTheTemple: List?.architectureOfTheTemple, templeSlug: List?.templeSlug, metaTitle: List?.metaTitle,
                            metaDescription: List?.metaDescription, openGraphTag: List?.openGraphTag, canonicalTag: List?.canonicalTag, extraMetaTag: List?.extraMetaTag, deityID: List?.deityID, benefitID: List?.benefitID, appLangID: List?.appLangID, templeID: List?.templeID, appLangID: List?.appLangID
                        }))
                        if (List?.dayID?.length == 7) {
                            setAllDaySelected(true)
                        }
                        GetCityLookupListData(List?.stateID)
                        // setIsAddressChanged(true)
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

    // Lookup List Functions
    const GetStateLookupListData = async () => {
        try {
            const response = await GetStateLookupList(1); // Ensure it's correctly imported

            if (response?.data?.statusCode === 200) {
                const languageLookupList = response.data.responseData.data || [];

                const formattedLangList = languageLookupList.map((Lang) => ({
                    value: Lang.stateID,
                    label: Lang.stateName,
                }));

                setStateList(formattedLangList);
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

    const GetDeityLookupListData = async () => {

        try {
            const response = await GetDeityLookupList(); // Ensure it's correctly imported

            if (response?.data?.statusCode === 200) {
                const list = response?.data?.responseData?.data || [];

                const formattedLangList = list.map((Lang) => ({
                    value: Lang.deityID,
                    label: Lang.deityName,
                }));

                setDeityList(formattedLangList);
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
            const response = await GetTempleLookupList(); // Ensure it's correctly imported

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

    const GetBenefitLookupListData = async () => {
        try {
            const response = await GetBenefitLookupList(); // Ensure it's correctly imported

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

    const GetCityLookupListData = async (ID) => {
        try {
            const response = await GetDistrictLookupList(ID); // Ensure it's correctly imported

            if (response?.data?.statusCode === 200) {
                const languageLookupList = response.data.responseData.data || [];

                const formattedLangList = languageLookupList.map((Lang) => ({
                    value: Lang.districtID,
                    label: Lang.districtName,
                }));

                setDistrictList(formattedLangList);
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

    const formatSlug = (value) => {
        const slug = value.toLowerCase().replace(/\s+/g, '-');
        setTempleData((prev) => ({ ...prev, templeSlug: slug }))
    }

    const handleChange = (e) => {

        let { id, value } = e.target;
        if (id === "templeName") {
            // value = value.replace(/[^a-zA-Z\s]/g, '');
            value = value.charAt(0).toUpperCase() + value.slice(1);
            formatSlug(value)
        }
        if (id === "seatingCapacity") {
            value = value.charAt(0) > '0' ? value.replace(/\D/g, '').slice(0, 6) : ''; // Only keep digits and slice to 10 digits

        }
        if (id === "isWhitePageLabel" || id === "trend") {
            value = Number(value)

        }


        setTempleData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleAddressChange = (e) => {
        const value = e.target.value.replace(/^\s+/, '');
        if (value === "" || value === null) {
            setTempleData((prev) => ({ ...prev, templeAddress: value, latitude: "", longitude: "" }));
        } else {

            setTempleData((prev) => ({ ...prev, templeAddress: value }));
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


    const handleCheckboxChange = (value) => {
        setTempleData((prev) => {
            let currentSelected = prev.dayID || [];
            let newSelected = [];

            if (value === 0) {
                // ✅ If "All Days" clicked
                if (currentSelected.includes(1)) {
                    // If already selected → unselect all
                    newSelected = [];
                    setAllDaySelected(false)
                } else {
                    // If not selected → select all days (1–8)
                    newSelected = [1, 2, 3, 4, 5, 6, 7];
                    setAllDaySelected(true)
                }
            } else {
                // ✅ Normal day checkbox clicked
                if (currentSelected.includes(value)) {
                    // Remove it
                    newSelected = currentSelected.filter((item) => item !== value);
                    setAllDaySelected(false)
                } else {
                    // Add it
                    newSelected = [...currentSelected, value];
                    setAllDaySelected(false)
                }

                // 🔄 Auto-update "All Days" checkbox
                const allDays = [1, 2, 3, 4, 5, 6, 7];
                if (allDays.every((d) => newSelected.includes(d))) {
                    // If all individual days selected → also add "All Days"
                    newSelected = [...allDays];
                    setAllDaySelected(true)
                } else {
                    // If not all selected → remove "All Days"
                    newSelected = newSelected.filter((item) => item !== 0);
                    setAllDaySelected(false)
                }
            }

            return { ...prev, dayID: newSelected };
        });
    };

    const handleDescriptionChange = (htmlContent) => {

        // Strip HTML tags and check if anything meaningful remains
        const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

        setTempleData((obj) => ({
            ...obj,
            significanceOfTheTemple: strippedContent === '' ? null : htmlContent,
        }));
    };
    const handleTempleDetailsDescriptionChange = (htmlContent) => {

        // Strip HTML tags and check if anything meaningful remains
        const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

        setTempleData((obj) => ({
            ...obj,
            templeDetails: strippedContent === '' ? null : htmlContent,
        }));
    };
    const handleArchitectureDescriptionChange = (htmlContent) => {

        // Strip HTML tags and check if anything meaningful remains
        const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

        setTempleData((obj) => ({
            ...obj,
            architectureOfTheTemple: strippedContent === '' ? null : htmlContent,
        }));
    };
    const handleTempleTimingsDescriptionChange = (htmlContent) => {

        // Strip HTML tags and check if anything meaningful remains
        const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

        setTempleData((obj) => ({
            ...obj,
            templeTimings: strippedContent === '' ? null : htmlContent,
        }));
    };
    const handleByAirDescriptionChange = (htmlContent) => {

        // Strip HTML tags and check if anything meaningful remains
        const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

        setTempleData((obj) => ({
            ...obj,
            byAir: strippedContent === '' ? null : htmlContent,
        }));
    };
    const handleByRoadDescriptionChange = (htmlContent) => {

        // Strip HTML tags and check if anything meaningful remains
        const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

        setTempleData((obj) => ({
            ...obj,
            byRoad: strippedContent === '' ? null : htmlContent,
        }));
    };

    const handleByTrainDescriptionChange = (htmlContent) => {

        // Strip HTML tags and check if anything meaningful remains
        const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

        setTempleData((obj) => ({
            ...obj,
            byTrain: strippedContent === '' ? null : htmlContent,
        }));
    };

    const SubmitBtnClicked = () => {
        debugger
        let isValid = true
        if (modelRequestData?.moduleName === "TempleList" && (templeData?.templeName === null || templeData?.templeName === undefined || templeData?.templeName === "" ||
            templeData?.templeAddress === null || templeData?.templeAddress === undefined || templeData?.templeAddress === "" ||
            // templeData?.seatingCapacity === null || templeData?.seatingCapacity === undefined || templeData?.seatingCapacity === "" ||
            templeData?.bestSeason === null || templeData?.bestSeason === undefined || templeData?.bestSeason === "" ||
            templeData?.templeTimings === null || templeData?.templeTimings === undefined || templeData?.templeTimings === "" ||
            templeData?.templeRules === null || templeData?.templeRules === undefined || templeData?.templeRules === "" ||
            templeData?.stateID === null || templeData?.stateID === undefined || templeData?.stateID === "" ||
            templeData?.districtID === null || templeData?.districtID === undefined || templeData?.districtID === "" ||
            templeData?.latitude === null || templeData?.latitude === undefined || templeData?.latitude === "" ||
            templeData?.longitude === null || templeData?.longitude === undefined || templeData?.longitude === "" ||
            templeData?.isWhitePageLabel === null || templeData?.isWhitePageLabel === undefined || templeData?.isWhitePageLabel === "" ||
            templeData?.trend === null || templeData?.trend === undefined || templeData?.trend === "" ||
            templeData?.templeSlug === null || templeData?.templeSlug === undefined || templeData?.templeSlug === "" ||
            templeData?.byAir === null || templeData?.byAir === undefined || templeData?.byAir === "" ||
            templeData?.byTrain === null || templeData?.byTrain === undefined || templeData?.byTrain === "" ||
            templeData?.byRoad === null || templeData?.byRoad === undefined || templeData?.byRoad === "" ||
            templeData?.dayID === null || templeData?.dayID === undefined || templeData?.dayID === "" || templeData?.dayID?.length === 0 ||
            templeData?.templeDetails === null || templeData?.templeDetails === undefined || templeData?.templeDetails === "" ||
            templeData?.architectureOfTheTemple === null || templeData?.architectureOfTheTemple === undefined || templeData?.architectureOfTheTemple === "" ||
            templeData?.significanceOfTheTemple === null || templeData?.significanceOfTheTemple === undefined || templeData?.significanceOfTheTemple === "")
        ) {
            setError(true)
            isValid = false
        } else if (modelRequestData?.moduleName === "LanguageWiseList" &&
            (
                templeData?.appLangID === null || templeData?.appLangID === undefined || templeData?.appLangID === "" ||
                templeData?.templeName === null || templeData?.templeName === undefined || templeData?.templeName === "" ||
                // templeData?.seatingCapacity === null || templeData?.seatingCapacity === undefined || templeData?.seatingCapacity === "" ||
                templeData?.bestSeason === null || templeData?.bestSeason === undefined || templeData?.bestSeason === "" ||
                templeData?.templeTimings === null || templeData?.templeTimings === undefined || templeData?.templeTimings === "" ||
                templeData?.templeRules === null || templeData?.templeRules === undefined || templeData?.templeRules === "" ||
                // templeData?.templeAddress === null || templeData?.templeAddress === undefined || templeData?.templeAddress === "" ||
                templeData?.byAir === null || templeData?.byAir === undefined || templeData?.byAir === "" ||
                templeData?.byTrain === null || templeData?.byTrain === undefined || templeData?.byTrain === "" ||
                templeData?.byRoad === null || templeData?.byRoad === undefined || templeData?.byRoad === "" ||
                templeData?.templeDetails === null || templeData?.templeDetails === undefined || templeData?.templeDetails === "" ||
                templeData?.architectureOfTheTemple === null || templeData?.architectureOfTheTemple === undefined || templeData?.architectureOfTheTemple === "" ||
                templeData?.significanceOfTheTemple === null || templeData?.significanceOfTheTemple === undefined || templeData?.significanceOfTheTemple === ""
            )) {
            setError(true)
            isValid = false
        }

        let apiParam = {}
        if (modelRequestData?.moduleName === "TempleList") {
            apiParam = {
                adminID: user?.adminID, templeKeyID: modelRequestData?.templeKeyID, appLangID: null, templeName: templeData?.templeName, templeRules: templeData?.templeRules, stateID: templeData?.stateID, districtID: templeData?.districtID,
                templeAddress: templeData?.templeAddress, seatingCapacity: (templeData?.seatingCapacity === "" || templeData?.seatingCapacity === undefined || templeData?.seatingCapacity === null) ? null : templeData?.seatingCapacity, latitude: templeData?.latitude, longitude: templeData?.longitude,
                bestSeason: templeData?.bestSeason, templeTimings: templeData?.templeTimings, trend: templeData?.trend === 1 ? true : false, dayID: templeData?.dayID,
                liveDarshanURL: templeData?.liveDarshanURL, isWhitePageLable: templeData?.isWhitePageLabel === 1 ? true : false, templeDetails: templeData?.templeDetails,
                byAir: templeData?.byAir, byTrain: templeData?.byTrain, byRoad: templeData?.byRoad, significanceOfTheTemple: templeData?.significanceOfTheTemple,
                architectureOfTheTemple: templeData?.architectureOfTheTemple, templeSlug: templeData?.templeSlug, metaTitle: templeData?.metaTitle,
                metaDescription: templeData?.metaDescription, openGraphTag: templeData?.openGraphTag, canonicalTag: templeData?.canonicalTag, extraMetaTag: templeData?.extraMetaTag, deityID: templeData?.deityID, benefitID: templeData?.benefitID
            }
        } else {
            apiParam = {
                adminID: user?.adminID,
                templeKeyID: modelRequestData?.templeKeyID,
                appLangID: templeData?.appLangID,
                templeLanKeyID: modelRequestData?.templeLanKeyID,
                templeLanID: modelRequestData?.templeLanID,
                templeName: templeData?.templeName,
                templeRules: templeData?.templeRules,
                templeAddress: templeData?.templeAddress,
                seatingCapacity: (templeData?.seatingCapacity === "" || templeData?.seatingCapacity === undefined || templeData?.seatingCapacity === null) ? null : templeData?.seatingCapacity,
                bestSeason: templeData?.bestSeason,
                templeTimings: templeData?.templeTimings,
                templeDetails: templeData?.templeDetails,
                byAir: templeData?.byAir, byTrain: templeData?.byTrain, byRoad: templeData?.byRoad,
                significanceOfTheTemple: templeData?.significanceOfTheTemple,
                architectureOfTheTemple: templeData?.architectureOfTheTemple,

            }
        }


        if (isValid) {
            console.log('ApiParam', apiParam)
            AddUpdateTempleData(apiParam)
        }
    }

    const AddUpdateTempleData = async (ApiParam) => {

        setLoader(true);
        try {
            const response = await AddUpdateTemple(ApiParam);
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

    const handleSearch = async () => {
        try {
            
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json`,
                {
                    params: {
                        address: templeData?.templeAddress,
                        key: googleMapKey,
                    },
                }
            );

            if (response.data.status === "OK") {
                const location = response.data.results[0].geometry.location;
                // setCoords(location); // { lat: ..., lng: ... }
                setTempleData((prev) => ({
                    ...prev, latitude: location?.lat, longitude: location?.lng
                }))
                console.log("Location", location)
            } else {
                alert("Address not found!");
            }
        } catch (error) {
            console.error(error);
        }
    };


    const SetDataInitial = () => {
        setTempleData((prev) => ({
            ...prev, templeName: null, templeRules: null, stateID: null, districtID: null, templeAddress: null, seatingCapacity: null, latitude: null, longitude: null, bestSeason: null, templeTimings: null, trend: null, dayID: [],
            liveDarshanURL: null, isWhitePageLabel: null, templeDetails: null, byAir: null, byTrain: null, byRoad: null, significanceOfTheTemple: null,
            architectureOfTheTemple: null, templeSlug: null, metaTitle: null, metaDescription: null, openGraphTag: null, canonicalTag: null, extraMetaTag: null, benefitID: [], deityID: []
        }))
        setAllDaySelected(false)
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
            <Modal style={{ zIndex: 1300 }} size='lg' show={show} backdrop="static" keyboard={false} centered>
                <Modal.Header>
                    <h4 className="text-center">{modelRequestData?.Action === null ? 'Add Temple' : 'Update Temple'}</h4>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
                    <div className="container-fluid ">

                        {/* Temple Details */}
                        <fieldset className="border rounded p-3">
                            <legend className="float-none w-auto px-2 fw-bold" style={{ fontSize: "14px" }}>
                                Temple Details
                            </legend>
                            <div className='row'>


                                {modelRequestData?.moduleName === "LanguageWiseList" ? (
                                    <>
                                        {/* Language */}
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="stateID" className="form-label">
                                                Select Language <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                options={languageList}
                                                value={languageList?.filter((v) => v?.value === templeData?.appLangID)}
                                                onChange={(selectedOption) =>
                                                    setTempleData((prev) => ({
                                                        ...prev,
                                                        appLangID: selectedOption ? selectedOption.value : null,
                                                    }))
                                                }
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                            />
                                            {error && (!templeData?.appLangID) && (
                                                <span className="text-danger">{ERROR_MESSAGES}</span>
                                            )}
                                        </div>
                                        {/* Temple Name */}
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="templeName" className="form-label">
                                                Temple Name <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control my-box"
                                                id="templeName"
                                                value={templeData?.templeName || ''}
                                                onChange={handleChange}
                                                placeholder="Enter Temple Name"
                                                maxLength={150}
                                            />
                                            {error && (!templeData?.templeName) && (
                                                <span className="text-danger">{ERROR_MESSAGES}</span>
                                            )}
                                        </div>
                                    </>

                                ) :
                                    <>
                                        {/* Temple Name */}
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="templeName" className="form-label">
                                                Temple Name <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control my-box"
                                                id="templeName"
                                                value={templeData?.templeName || ''}
                                                placeholder="Enter Temple Name"
                                                maxLength={150}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    // Prevent leading space
                                                    if (value.startsWith(" ")) return;
                                                    setTempleData({
                                                        ...templeData,
                                                        templeName: value,
                                                    });
                                                }}

                                                onBlur={(e) => {
                                                    const slugValue = generateSlug(e.target.value);
                                                    setTempleData({
                                                        ...templeData,
                                                        templeSlug: slugValue,
                                                    });
                                                }}
                                            />
                                            {error && (!templeData?.templeName) && (
                                                <span className="text-danger">{ERROR_MESSAGES}</span>
                                            )
                                            }
                                        </div>

                                        {/* Seating Capacity */}
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="seatingCapacity" className="form-label">
                                                Seating Capacity
                                                {/* <span className="text-danger">*</span> */}
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="seatingCapacity"
                                                placeholder="Enter Seating Capacity"
                                                value={templeData?.seatingCapacity}
                                                onChange={handleChange}
                                            />
                                            {/* {error && (!templeData?.seatingCapacity) && (
                                                <span className="text-danger">{ERROR_MESSAGES}</span>
                                            )} */}
                                        </div>
                                    </>
                                }

                                {/* Darshan URL */}
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="liveDarshanURL" className="form-label">
                                        Live Darshan URL
                                        {/* <span className="text-danger">*</span> */}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="liveDarshanURL"
                                        placeholder="Enter Live Darshan URL"
                                        value={templeData?.liveDarshanURL}
                                        onChange={handleChange}
                                    />
                                    {/* {error && (!templeData?.liveDarshanURL) && (
                                    <span className="text-danger">{ERROR_MESSAGES}</span>
                                )} */}

                                </div>



                                {/* Best Season */}
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="bestSeason" className="form-label">
                                        Best Season <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="bestSeason"
                                        placeholder="Enter Best Season"
                                        value={templeData?.bestSeason}
                                        onChange={handleChange}
                                    />
                                    {error && (!templeData?.bestSeason) && (
                                        <span className="text-danger">{ERROR_MESSAGES}</span>
                                    )}
                                </div>



                                {modelRequestData?.moduleName === "TempleList" && (
                                    <>

                                        {(templeData?.templeAddress !== null && templeData?.templeAddress !== undefined && templeData?.templeAddress !== "") && (
                                            <>
                                                {/* Latitude */}
                                                {/* <div className="col-md-6 mb-3">
                                                    <label htmlFor="latitude" className="form-label">
                                                        Latitude <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="latitude"
                                                        placeholder="Enter Latitude"
                                                        value={templeData?.latitude}
                                                        disabled
                                                    />
                                                    {error && (!templeData?.latitude) && (
                                                        <span className="text-danger">{ERROR_MESSAGES}</span>
                                                    )}
                                                </div> */}

                                                {/* Longitude */}
                                                {/* <div className="col-md-6 mb-3">
                                                    <label htmlFor="longitude" className="form-label">
                                                        Longitude <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="longitude"
                                                        placeholder="Enter Longitude"
                                                        value={templeData?.longitude}
                                                        disabled
                                                    />
                                                    {error && (!templeData?.longitude) && (
                                                        <span className="text-danger">{ERROR_MESSAGES}</span>
                                                    )}
                                                </div> */}
                                            </>
                                        )}

                                        {/* State */}
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="stateID" className="form-label">
                                                State <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                options={stateList}
                                                value={stateList?.filter((v) => v?.value === templeData?.stateID)}
                                                onChange={(selectedOption) => {
                                                    setTempleData((prev) => ({
                                                        ...prev,
                                                        stateID: selectedOption ? selectedOption.value : null,
                                                    }))
                                                    if (selectedOption !== null && selectedOption !== undefined && selectedOption !== undefined) {
                                                        GetCityLookupListData(selectedOption.value)
                                                    }

                                                }
                                                }
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                            />
                                            {error && (!templeData?.stateID) && (
                                                <span className="text-danger">{ERROR_MESSAGES}</span>
                                            )}
                                        </div>


                                        {/* District */}
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="districtID" className="form-label">
                                                Select District <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                options={districtList}
                                                value={districtList?.filter((v) => v?.value === templeData?.districtID)}
                                                onChange={(selectedOption) =>
                                                    setTempleData((prev) => ({
                                                        ...prev,
                                                        districtID: selectedOption ? selectedOption.value : null,
                                                    }))
                                                } menuPlacement="auto"
                                                menuPosition="fixed"
                                            />
                                            {error && (!templeData?.districtID) && (
                                                <span className="text-danger">{ERROR_MESSAGES}</span>
                                            )}
                                        </div>



                                        {/* Address */}
                                        {/* <div className="col-md-6 mb-3">
                                            <label htmlFor="templeAddress" className="form-label">
                                                Address <span className="text-danger">*</span>
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="templeAddress"
                                                placeholder="Enter Address"
                                                maxLength={150}
                                                value={templeData?.templeAddress}
                                                onChange={handleAddressChange}
                                            />
                                            {error && (!templeData?.templeAddress) && (
                                                <span className="text-danger">{ERROR_MESSAGES}</span>
                                            )}
                                        </div> */}




                                        {/* Is White Page */}
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="canonicalTag" className="form-label">
                                                Is White Page <span className="text-danger">*</span>
                                            </label>
                                            <div classNsame="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
                                                <label className="inline-flex items-center mx-1">
                                                    <input
                                                        type="radio"
                                                        id='isWhitePageLabel'
                                                        name="isWhitePageLabel"
                                                        value={1}
                                                        checked={templeData.isWhitePageLabel === 1}
                                                        onChange={handleChange}
                                                        className="form-radio h-4 w-4 text-blue-600"
                                                    />
                                                    <span className="ml-2 mx-2 text-sm text-gray-700">Yes</span>
                                                </label>

                                                <label className="inline-flex items-center mx-1">
                                                    <input
                                                        type="radio"
                                                        name="isWhitePageLabel"
                                                        id='isWhitePageLabel'
                                                        value={2}
                                                        checked={templeData.isWhitePageLabel === 2}
                                                        onChange={handleChange}
                                                        className="form-radio h-4 w-4 text-blue-600"
                                                    />
                                                    <span className="ml-2 mx-2 text-sm text-gray-700">No</span>
                                                </label>


                                            </div>

                                            {/* Validation */}
                                            {error && (!templeData.isWhitePageLabel || templeData.isWhitePageLabel === "") && (
                                                <span className="text-danger">{ERROR_MESSAGES}</span>
                                            )}
                                        </div>

                                        {/* Temple Trend */}
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="trend" className="form-label">
                                                Temple Trend <span className="text-danger">*</span>
                                            </label>
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
                                                <label className="inline-flex items-center mx-1">
                                                    <input
                                                        type="radio"
                                                        id='trend'
                                                        name="trend"
                                                        value={1}
                                                        checked={templeData.trend === 1}
                                                        onChange={handleChange}
                                                        className="form-radio h-4 w-4 text-blue-600"
                                                    />
                                                    <span className="ml-2 mx-2 text-sm text-gray-700">Yes</span>
                                                </label>

                                                <label className="inline-flex items-center mx-1">
                                                    <input
                                                        type="radio"
                                                        name="trend"
                                                        id='trend'
                                                        value={2}
                                                        checked={templeData.trend === 2}
                                                        onChange={handleChange}
                                                        className="form-radio h-4 w-4 text-blue-600"
                                                    />
                                                    <span className="ml-2 mx-2 text-sm text-gray-700">No</span>
                                                </label>


                                            </div>

                                            {/* Validation */}
                                            {error && (!templeData.trend || templeData.trend === "") && (
                                                <span className="text-danger">{ERROR_MESSAGES}</span>
                                            )}
                                        </div>

                                        {/* Select Deity */}
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="districtID" className="form-label">
                                                Select Deity <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                isMulti
                                                options={deityList}
                                                value={deityList?.filter((v) => templeData?.deityID?.includes(v.value))}
                                                onChange={(selectedOptions) =>
                                                    setTempleData((prev) => ({
                                                        ...prev,
                                                        deityID: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
                                                    }))
                                                }
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 }),  // 👈 big z-index
                                                }}
                                            />
                                            {error && (!templeData?.deityID || templeData?.deityID.length === 0) && (
                                                <span className="text-danger">{ERROR_MESSAGES}</span>
                                            )}
                                        </div>


                                        {/* Select benefitID */}
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="districtID" className="form-label">
                                                Select Benefits <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                isMulti
                                                options={benefitList}
                                                value={benefitList?.filter((v) => templeData?.benefitID?.includes(v.value))}
                                                onChange={(selectedOptions) =>
                                                    setTempleData((prev) => ({
                                                        ...prev,
                                                        benefitID: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
                                                    }))
                                                }
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 }),  // 👈 big z-index
                                                }}
                                            />
                                            {error && (!templeData?.benefitID || templeData?.benefitID.length === 0) && (
                                                <span className="text-danger">{ERROR_MESSAGES}</span>
                                            )}
                                        </div>






                                    </>
                                )}
                                {/* Address */}
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="templeAddress" className="form-label">
                                        Address <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="templeAddress"
                                        placeholder="Enter Address"
                                        maxLength={150}
                                        value={templeData?.templeAddress}
                                        onChange={handleAddressChange}
                                    />
                                    {error && (!templeData?.templeAddress) && (
                                        <span className="text-danger">{ERROR_MESSAGES}</span>
                                    )}
                                </div>
                                {/* Temple Timings */}
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="templeTimings" className="form-label">
                                        Temple Timings <span className="text-danger">*</span>
                                    </label>
                                    <Text_Editor
                                        editorState={templeData?.templeTimings}
                                        handleContentChange={handleTempleTimingsDescriptionChange}
                                    />
                                    {error && (!templeData?.templeTimings) && (
                                        <span className="text-danger">{ERROR_MESSAGES}</span>
                                    )}
                                </div>

                                {/* By Air */}
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="byAir" className="form-label">
                                        By Air <span className="text-danger">*</span>
                                    </label>
                                    <Text_Editor
                                        editorState={templeData?.byAir}
                                        handleContentChange={handleByAirDescriptionChange}
                                    />
                                    {error && (!templeData?.byAir) && (
                                        <span className="text-danger">{ERROR_MESSAGES}</span>
                                    )}
                                </div>

                                {/* By Train */}
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="byTrain" className="form-label">
                                        By Train <span className="text-danger">*</span>
                                    </label>
                                    <Text_Editor
                                        editorState={templeData?.byTrain}
                                        handleContentChange={handleByTrainDescriptionChange}
                                    />
                                    {error && (!templeData?.byTrain) && (
                                        <span className="text-danger">{ERROR_MESSAGES}</span>
                                    )}
                                </div>

                                {/* By Road */}
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="byRoad" className="form-label">
                                        By Road <span className="text-danger">*</span>
                                    </label>
                                    <Text_Editor
                                        editorState={templeData?.byRoad}
                                        handleContentChange={handleByRoadDescriptionChange}
                                    />
                                    {error && (!templeData?.byRoad) && (
                                        <span className="text-danger">{ERROR_MESSAGES}</span>
                                    )}
                                </div>

                                {/* Rules */}
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="templeRules" className="form-label">
                                        Rules <span className="text-danger">*</span>
                                    </label>

                                    <Text_Editor
                                        editorState={templeData?.templeRules}
                                        handleContentChange={(htmlContent) => {
                                            // handleByRoadDescriptionChange
                                            // Strip HTML tags and check if anything meaningful remains
                                            const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

                                            setTempleData((obj) => ({
                                                ...obj,
                                                templeRules: strippedContent === '' ? null : htmlContent,
                                            }));

                                        }}
                                    />
                                    {/* <textarea
                                        type="text"
                                        className="form-control"
                                        id="templeRules"
                                        placeholder="Enter Temple Rules"
                                        value={templeData?.templeRules || ''}
                                        onChange={handleChange}
                                    /> */}
                                    {error && (!templeData?.templeRules) && (
                                        <span className="text-danger">{ERROR_MESSAGES}</span>
                                    )}
                                </div>

                                {modelRequestData?.moduleName !== "LanguageWiseList" && (
                                    <>
                                        {/* Select Temple Open Days */}
                                        <div div className="col-md-12 mb-3">
                                            <label htmlFor="daysInterested" className="form-label">
                                                Select Temple Open Days <span className="text-danger">*</span>
                                            </label>

                                            <div className="row border border-grey rounded p-1 ">
                                                {[
                                                    { value: 0, label: "All Days" },
                                                    { value: 1, label: "Monday" },
                                                    { value: 2, label: "Tuesday" },
                                                    { value: 3, label: "Wednesday" },
                                                    { value: 4, label: "Thursday" },
                                                    { value: 5, label: "Friday" },
                                                    { value: 6, label: "Saturday" },
                                                    { value: 7, label: "Sunday" }
                                                ].map((day) => (
                                                    <div key={day.value} className="col-12 col-md-3 mb-2">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                value={day.value}
                                                                id={`day-${day.value}`}
                                                                checked={(templeData.dayID || []).includes(day.value) || (day.value === 0 && isAllDaySelected)}
                                                                onChange={() => handleCheckboxChange(day.value)}
                                                            />
                                                            <label className="form-check-label" htmlFor={`day-${day.value}`}>
                                                                {day.label}
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                                {error && (templeData?.dayID?.length === 0) ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}
                                            </div>
                                        </div>

                                    </>
                                )}

                            </div>
                        </fieldset>

                        {/*  SEO Details */}
                        {modelRequestData?.moduleName !== 'LanguageWiseList' && (
                            <fieldset className="border rounded p-3">
                                <legend className="float-none w-auto px-2 fw-bold" style={{ fontSize: "14px" }}>
                                    SEO Details
                                </legend>
                                <div className='row'>

                                    {/* Slug */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="templeSlug" className="form-label">
                                            Slug <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="templeSlug"
                                            placeholder="Enter Temple Slug"
                                            value={templeData?.templeSlug || ''}
                                            onChange={(e) => {
                                                const formattedSlug = formatSlugOnChange(e.target.value);
                                                setTempleData({
                                                    ...templeData,
                                                    templeSlug: formattedSlug,
                                                });
                                            }}
                                            onBlur={(e) => {

                                                const cleanedSlug = cleanSlugOnBlur(e.target.value);
                                                setTempleData((prev) => ({
                                                    ...prev,
                                                    templeSlug: cleanedSlug,
                                                }));
                                            }}
                                        />

                                        {error && (!templeData?.templeSlug) && (
                                            <span className="text-danger">{ERROR_MESSAGES}</span>
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
                                            value={templeData?.metaTitle}
                                            onChange={handleChange}
                                        />
                                        {/* {error && (!templeData?.metaTitle) && (
                                    <span className="text-danger">{ERROR_MESSAGES}</span>
                                )} */}
                                    </div>

                                    {/* Meta Description */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="metaDescription" className="form-label">
                                            Meta Description
                                            {/* <span className="text-danger">*</span> */}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="metaDescription"
                                            placeholder="Enter Meta Description"
                                            value={templeData?.metaDescription}
                                            onChange={handleChange}
                                        />
                                        {/* {error && (!templeData?.metaDescription) && (
                                    <span className="text-danger">{ERROR_MESSAGES}</span>
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
                                            value={templeData?.canonicalTag}
                                            onChange={handleChange}
                                        />
                                        {/* {error && (!templeData?.canonicalTag) && (
                                    <span className="text-danger">{ERROR_MESSAGES}</span>
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
                                            value={templeData?.extraMetaTag}
                                            onChange={handleChange}
                                        />
                                        {/* {error && (!templeData?.extraMetaTag) && (
                                    <span className="text-danger">{ERROR_MESSAGES}</span>
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
                                            value={templeData?.openGraphTag}
                                            onChange={handleChange}
                                        />
                                        {/* {error && (!templeData?.openGraphTag) && (
                                    <span className="text-danger">{ERROR_MESSAGES}</span>
                                )} */}

                                    </div>
                                </div>
                            </fieldset>
                        )}


                        {/*  Content Descriptions */}
                        <fieldset className="border rounded p-3">
                            <legend className="float-none w-auto px-2 fw-bold" style={{ fontSize: "14px" }}>
                                Content Descriptions
                            </legend>
                            <div className='row'>




                                {/* Temple Details */}
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="canonicalTag" className="form-label">
                                        Temple Details <span className="text-danger">*</span>
                                    </label>
                                    <Text_Editor
                                        editorState={templeData?.templeDetails}
                                        handleContentChange={handleTempleDetailsDescriptionChange}
                                    />
                                    {error && (!templeData?.templeDetails) && (
                                        <span className="text-danger">{ERROR_MESSAGES}</span>
                                    )}
                                </div>

                                {/* Significance Of The Temple */}
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="canonicalTag" className="form-label">
                                        Significance Of The Temple <span className="text-danger">*</span>
                                    </label>
                                    <Text_Editor
                                        editorState={templeData?.significanceOfTheTemple}
                                        handleContentChange={handleDescriptionChange}

                                    />
                                    {error && (!templeData?.significanceOfTheTemple) && (
                                        <span className="text-danger">{ERROR_MESSAGES}</span>
                                    )}
                                </div>

                                {/* Architecture Of The Temple */}
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="canonicalTag" className="form-label">
                                        Architecture Of The Temple <span className="text-danger">*</span>
                                    </label>
                                    <Text_Editor
                                        editorState={templeData?.architectureOfTheTemple}
                                        handleContentChange={handleArchitectureDescriptionChange}
                                    />
                                    {error && (!templeData?.architectureOfTheTemple) && (
                                        <span className="text-danger">{ERROR_MESSAGES}</span>
                                    )}
                                </div>


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
            <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={modelRequestData?.Action === null ? "Temple has been added successfully !" : "Temple has been updated successfully !"} />
            <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
        </>
    )
}

export default AddUpdateTempleModal
