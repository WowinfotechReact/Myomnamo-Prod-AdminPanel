


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

import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import { GetDeityLookupList } from 'services/Admin/Deity/DeityApi';
import { GetBenefitLookupList } from 'services/Admin/TempleApi/Benefit/BenefitApi';
import { GetTemplePujaCategoryLookupList } from 'services/Temples Puja Category/TemplesPujaCategoryApi';
import { GetStateLookupList } from 'services/Master Api/MasterStateApi';
import { GetDistrictLookupList } from 'services/Master Api/MasterDistrictApi';
import { PujaTypeIDOption } from 'Middleware/Utils';
import dayjs from 'dayjs';
import { GetTemplePujaSubCategoryLookupList } from 'services/Temple Puja Sub Category/TemplesPujaSubCategoryApi';
import { AddUpdateTemplePuja, GetTemplePujaModel } from 'services/Temple Puja/TemplePujaApi';


const TemplePujaAddUpdateModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
      const debounceTimer = useRef(null);
      console.log(modelRequestData, 'dsadasda');

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


      const [districtList, setDistrictList] = useState([])
      const [benefitList, setBenefitList] = useState([])
      const [deityList, setDeityList] = useState([])

      const [templePujaObj, setTemplePujaObj] = useState({
            adminID: null,
            templePujaID: null,
            pujaName: null,
            pujaFor: null,
            tempPujaCatID: null,
            pujaTypeID: null,
            tempPujaSubCatID: null,
            stateID: null,
            districtID: null,
            talukaID: null,
            pujaOnlineOfflineTypeID: null,      //1-Online 2-Offline
            upcomingPujaDate: null,
            isTrendingPuja: null,
            onlinePrice: null,
            offlinePrice: null,
            convenienceFee: null,
            wetSamagriPrice: null,
            drySamagriPrice: null,
            discount: null,
            aboutPuja: null,
            benefitsofPuja: null,
            aboutTemple: null,
            samagri: null,
            slug: null,
            metaTitle: null,
            metaDescription: null,
            openGraphTag: null,
            extraMetaTag: null,
            canonicalTag: null,
            benefitID: []
      })

      useEffect(() => {
            if (modelRequestData?.templePujaID !== null && modelRequestData?.Action === "Update") {
                  GetTemplePujaModelData(modelRequestData?.templePujaID)
            }

            GetBenefitLookupListData()
            GetDeityLookupListData()

      }, [modelRequestData.Action])

      useEffect(() => {
            if (isAddressChanged) {
                  handleSearch()
                  setIsAddressChanged(false)
            }
      }, [isAddressChanged])

      useEffect(() => {
            if (templePujaObj?.stateID !== null && templePujaObj?.stateID !== "") {
                  GetCityLookupListData(templePujaObj?.stateID)
            }
      }, [templePujaObj])


      const GetTemplePujaModelData = async (id) => {
            if (!id) {
                  return
            }
            setLoader(true);
            try {
                  const response = await GetTemplePujaModel(id);

                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false);
                              if (response?.data?.responseData?.data) {
                                    const List = response.data.responseData.data;
                                    setTemplePujaObj((prev) => ({
                                          ...prev,
                                          templePujaID: List?.templePujaID,
                                          templeID: List?.templeID,
                                          pujaName: List?.pujaName,
                                          pujaFor:
                                                List?.pujaFor,
                                          stateID: List?.stateID,
                                          districtID: List?.districtID,
                                          tempPujaCatID: List?.tempPujaCatID,
                                          tempPujaSubCatID: List?.tempPujaSubCatID,
                                          pujaTypeID: List?.pujaTypeID,
                                          upcomingPujaDate: List?.upcomingPujaDate,
                                          isTrendingPuja: List?.isTrendingPuja,
                                          onlinePrice: List?.onlinePrice,
                                          offlinePrice: List?.offlinePrice,
                                          convenienceFee: List?.convenienceFee,
                                          wetSamagriPrice: List?.wetSamagriPrice,
                                          drySamagriPrice: List?.drySamagriPrice,
                                          discount: List?.discount,
                                          aboutPuja: List?.aboutPuja,
                                          benefitsofPuja: List?.benefitsofPuja,
                                          aboutTemple: List?.aboutTemple,
                                          metaDescription: List?.metaDescription,
                                          samagri: List?.samagri,
                                          slug: List?.slug,
                                          openGraphTag: List?.openGraphTag,
                                          extraMetaTag: List?.extraMetaTag,
                                          canonicalTag: List?.canonicalTag,
                                          metaTitle: List?.metaTitle,
                                          benefitID: List?.benefitID
                                    }))
                                    if (List?.dayID?.length == 7) {
                                          setAllDaySelected(true)
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

      useEffect(() => {
            GetStateLookupListData()
      }, [])


      const GetStateLookupListData = async () => {


            try {
                  let response = await GetStateLookupList();
                  if (response?.data?.statusCode === 200) {
                        const cityList = response?.data?.responseData?.data || [];
                        const formattedCityList = cityList.map((city) => ({
                              value: city.stateID,
                              label: city.stateName
                        }));

                        setStateOption(formattedCityList); // Ensure this is called with correct data
                  } else {
                        console.error('Bad request');
                  }
            } catch (error) {
                  console.log(error);
            }
      };

      const GetTemplePujaSubCategoryLookupListData = async (id) => {


            try {
                  let response = await GetTemplePujaSubCategoryLookupList(id);
                  if (response?.data?.statusCode === 200) {
                        const cityList = response?.data?.responseData?.data || [];
                        const formattedCityList = cityList.map((city) => ({
                              value: city.tempPujaSubCatID,
                              label: city.tempPujaSubCatName
                        }));

                        setTemplePujaSubCatOption(formattedCityList); // Ensure this is called with correct data
                  } else {
                        console.error('Bad request');
                        setTemplePujaSubCatOption([]);
                  }
            } catch (error) {
                  console.log(error);
                  setTemplePujaSubCatOption([]);
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
      useEffect(() => {
            if (templePujaObj?.stateID) {
                  GetDistrictLookupListData(templePujaObj.stateID);
            }
      }, [templePujaObj?.stateID]);

      const GetDistrictLookupListData = async (id) => {
            try {
                  const response = await GetDistrictLookupList(id); // Ensure it's correctly imported

                  if (response?.data?.statusCode === 200) {
                        const list = response?.data?.responseData?.data || [];

                        const formattedLangList = list.map((Lang) => ({
                              value: Lang.districtID,
                              label: Lang.districtName,
                        }));

                        setDistrictOption(formattedLangList);
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
                  const response = await CityLookupList(ID); // Ensure it's correctly imported

                  if (response?.ResponseCode === "0") {
                        const languageLookupList = response?.DATA || [];

                        const formattedLangList = languageLookupList.map((Lang) => ({
                              value: Lang.DistrictID,
                              label: Lang.DistrictName,
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


      const handleChange = (e) => {
            let { id, value } = e.target;

            if (id === "templeName") {
                  value = value.replace(/[^a-zA-Z\s]/g, ""); // only letters + spaces
                  value = value.charAt(0).toUpperCase() + value.slice(1); // capitalize first letter
            }

            if (id === "seatingCapacity") {
                  // allow only digits, max 6
                  value = value.replace(/\D/g, "").slice(0, 6);
            }

            if (id === "isTrendingPuja") {
                  value = Number(value); // keep as number (1 or 2)
            }

            if (id === "slug") {
                  value = value
                        .toLowerCase()
                        .trim()
                        .replace(/\s+/g, "-") // replace spaces with "-"
                        .replace(/[^a-z0-9-]/g, ""); // remove special chars
            }

            setTemplePujaObj((prev) => ({
                  ...prev,
                  [id]: value,
            }));
      };





      const handleCheckboxChange = (value) => {
            setTemplePujaObj((prev) => {
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


      const handleAboutPujaChange = (htmlContent) => {

            // Strip HTML tags and check if anything meaningful remains
            const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

            setTemplePujaObj((obj) => ({
                  ...obj,
                  aboutPuja: strippedContent === '' ? null : htmlContent,
            }));
      };
      const handleBenifitsOfPujaChange = (htmlContent) => {

            // Strip HTML tags and check if anything meaningful remains
            const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

            setTemplePujaObj((obj) => ({
                  ...obj,
                  benefitsofPuja: strippedContent === '' ? null : htmlContent,
            }));
      };

      const handleAboutTempleChange = (htmlContent) => {

            // Strip HTML tags and check if anything meaningful remains
            const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

            setTemplePujaObj((obj) => ({
                  ...obj,
                  aboutTemple: strippedContent === '' ? null : htmlContent,
            }));
      };
      const handleSamagriChange = (htmlContent) => {

            // Strip HTML tags and check if anything meaningful remains
            const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

            setTemplePujaObj((obj) => ({
                  ...obj,
                  samagri: strippedContent === '' ? null : htmlContent,
            }));
      };
      const handleArchitectureDescriptionChange = (htmlContent) => {

            // Strip HTML tags and check if anything meaningful remains
            const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

            setTemplePujaObj((obj) => ({
                  ...obj,
                  architectureOfTheTemple: strippedContent === '' ? null : htmlContent,
            }));
      };


      const SubmitBtnClicked = () => {
            // debugger
            let isValid = true
            if (

                  templePujaObj?.templeID === null || templePujaObj?.templeID === undefined || templePujaObj?.templeID === "" ||
                  templePujaObj?.pujaName === null || templePujaObj?.pujaName === undefined || templePujaObj?.pujaName === "" ||
                  templePujaObj?.pujaFor === null || templePujaObj?.pujaFor === undefined || templePujaObj?.pujaFor === "" ||
                  templePujaObj?.tempPujaCatID === null || templePujaObj?.tempPujaCatID === undefined || templePujaObj?.tempPujaCatID === "" ||
                  templePujaObj?.tempPujaSubCatID === null || templePujaObj?.tempPujaSubCatID === undefined || templePujaObj?.tempPujaSubCatID === "" ||
                  templePujaObj?.pujaTypeID === null || templePujaObj?.pujaTypeID === undefined || templePujaObj?.pujaTypeID === "" ||
                  templePujaObj?.upcomingPujaDate === null || templePujaObj?.upcomingPujaDate === undefined || templePujaObj?.upcomingPujaDate === "" ||
                  templePujaObj?.isTrendingPuja === null || templePujaObj?.isTrendingPuja === undefined || templePujaObj?.isTrendingPuja === "" ||
                  templePujaObj?.onlinePrice === null || templePujaObj?.onlinePrice === undefined || templePujaObj?.onlinePrice === "" ||
                  templePujaObj?.offlinePrice === null || templePujaObj?.offlinePrice === undefined || templePujaObj?.offlinePrice === "" ||
                  templePujaObj?.convenienceFee === null || templePujaObj?.convenienceFee === undefined || templePujaObj?.convenienceFee === "" ||
                  templePujaObj?.wetSamagriPrice === null || templePujaObj?.wetSamagriPrice === undefined || templePujaObj?.wetSamagriPrice === "" ||
                  templePujaObj?.drySamagriPrice === null || templePujaObj?.drySamagriPrice === undefined || templePujaObj?.drySamagriPrice === "" ||
                  templePujaObj?.discount === null || templePujaObj?.discount === undefined || templePujaObj?.discount === "" ||
                  templePujaObj?.aboutPuja === null || templePujaObj?.aboutPuja === undefined || templePujaObj?.aboutPuja === "" ||
                  templePujaObj?.benefitsofPuja === null || templePujaObj?.benefitsofPuja === undefined || templePujaObj?.benefitsofPuja === "" ||
                  templePujaObj?.aboutTemple === null || templePujaObj?.aboutTemple === undefined || templePujaObj?.aboutTemple === "" || templePujaObj?.dayID?.length === 0 ||
                  templePujaObj?.samagri === null || templePujaObj?.samagri === undefined || templePujaObj?.samagri === "" ||
                  templePujaObj?.slug === null || templePujaObj?.slug === undefined || templePujaObj?.slug === "" ||
                  templePujaObj?.metaDescription === null || templePujaObj?.metaDescription === undefined || templePujaObj?.metaDescription === "" ||
                  templePujaObj?.openGraphTag === null || templePujaObj?.openGraphTag === undefined || templePujaObj?.openGraphTag === "" ||
                  templePujaObj?.extraMetaTag === null || templePujaObj?.extraMetaTag === undefined || templePujaObj?.extraMetaTag === "" ||
                  templePujaObj?.canonicalTag === null || templePujaObj?.canonicalTag === undefined || templePujaObj?.canonicalTag === "" ||
                  templePujaObj?.benefitID === null || templePujaObj?.benefitID === undefined || templePujaObj?.benefitID === "" ||
                  templePujaObj?.metaTitle === null || templePujaObj?.metaTitle === undefined || templePujaObj?.metaTitle === ""
            ) {
                  setError(true)
                  isValid = false
            }

            const apiParam = {
                  adminID: user?.admiN_ID, templePujaID: modelRequestData?.templePujaID,
                  templeID: templePujaObj?.templeID,
                  templePujaID: templePujaObj?.templePujaID,
                  pujaName: templePujaObj?.pujaName,
                  pujaFor:
                        templePujaObj?.pujaFor,
                  stateID: templePujaObj?.stateID,
                  districtID: templePujaObj?.districtID,
                  tempPujaCatID: templePujaObj?.tempPujaCatID,
                  tempPujaSubCatID: templePujaObj?.tempPujaSubCatID,
                  pujaTypeID: templePujaObj?.pujaTypeID,
                  upcomingPujaDate: templePujaObj?.upcomingPujaDate,
                  isTrendingPuja: templePujaObj?.isTrendingPuja,
                  onlinePrice: templePujaObj?.onlinePrice,
                  offlinePrice: templePujaObj?.offlinePrice,
                  convenienceFee: templePujaObj?.convenienceFee,
                  wetSamagriPrice: templePujaObj?.wetSamagriPrice,
                  drySamagriPrice: templePujaObj?.drySamagriPrice,
                  discount: templePujaObj?.discount,
                  aboutPuja: templePujaObj?.aboutPuja,
                  benefitsofPuja: templePujaObj?.benefitsofPuja,
                  aboutTemple: templePujaObj?.aboutTemple,
                  metaDescription: templePujaObj?.metaDescription,
                  samagri: templePujaObj?.samagri,
                  slug: templePujaObj?.slug,
                  openGraphTag: templePujaObj?.openGraphTag,
                  extraMetaTag: templePujaObj?.extraMetaTag,
                  canonicalTag: templePujaObj?.canonicalTag,
                  metaTitle: templePujaObj?.metaTitle,
                  benefitID: templePujaObj?.benefitID
            }

            if (isValid) {
                  AddUpdateTemplePujaData(apiParam)
            }
      }

      const AddUpdateTemplePujaData = async (ApiParam) => {

            setLoader(true);
            try {
                  const response = await AddUpdateTemplePuja(ApiParam);
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
      useEffect(() => {
            GetTemplePujaCategoryLookupListData()
      }, [])
      const GetTemplePujaCategoryLookupListData = async () => {


            try {
                  let response = await GetTemplePujaCategoryLookupList();
                  if (response?.data?.statusCode === 200) {
                        const cityList = response?.data?.responseData?.data || [];
                        const formattedCityList = cityList.map((city) => ({
                              value: city.tempPujaCatID,
                              label: city.tempPujaCatName
                        }));

                        setPujaCategoryOption(formattedCityList); // Ensure this is called with correct data
                  } else {
                        console.error('Bad request');
                  }
            } catch (error) {
                  console.log(error);
            }
      };
      useEffect(() => {
            GetTempleLookupListData()
      }, [])
      const GetTempleLookupListData = async () => {


            try {
                  let response = await GetTempleLookupList();
                  if (response?.data?.statusCode === 200) {
                        const cityList = response?.data?.responseData?.data || [];
                        const formattedCityList = cityList.map((city) => ({
                              value: city.templeID,
                              label: city.templeName
                        }));

                        setTempleOption(formattedCityList); // Ensure this is called with correct data
                  } else {
                        console.error('Bad request');
                  }
            } catch (error) {
                  console.log(error);
            }
      };


      const handleSearch = async () => {
            try {
                  const apiKey = "AIzaSyA5rVW7DkyryqQM-cDhsSrHb4soE2iXIJ8"; // Replace with your key
                  const response = await axios.get(
                        `https://maps.googleapis.com/maps/api/geocode/json`,
                        {
                              params: {
                                    address: templePujaObj?.templeAddress,
                                    key: apiKey,
                              },
                        }
                  );

                  if (response.data.status === "OK") {
                        const location = response.data.results[0].geometry.location;
                        // setCoords(location); // { lat: ..., lng: ... }
                        setTemplePujaObj((prev) => ({
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


      const handleTempleChange = (selectedOption) => {
            setTemplePujaObj((prev) => ({
                  ...prev,
                  templeID: selectedOption ? selectedOption.value : null,
            }));
      };
      const handleTemplePujaChange = (selectedOption) => {
            const catId = selectedOption ? selectedOption.value : null;

            setTemplePujaObj((prev) => ({
                  ...prev,
                  tempPujaCatID: catId,
                  tempPujaSubCatID: null // reset sub-cat when cat changes
            }));

            if (catId) {
                  GetTemplePujaSubCategoryLookupListData(catId);
            } else {
                  setTemplePujaSubCatOption([]); // clear sub-categories if no cat selected
            }
      };
      // when sub-category is selected
      const handleTemplePujaSubCatChange = (selectedOption) => {
            setTemplePujaObj((prev) => ({
                  ...prev,
                  tempPujaSubCatID: selectedOption ? selectedOption.value : null,
            }));
      };
      const handleDistrictChange = (selectedOption) => {
            setTemplePujaObj((prev) => ({
                  ...prev,
                  districtID: selectedOption ? selectedOption.value : null,


            }));
      };
      const handlePujaTypeChange = (selectedOption) => {
            setTemplePujaObj((prev) => ({
                  ...prev,
                  pujaTypeID: selectedOption ? selectedOption.value : null,


            }));
      };
      const handleStateChange = (selectedOption) => {
            setTemplePujaObj((prev) => ({
                  ...prev,
                  stateID: selectedOption ? selectedOption.value : null,


            }));
      };

      const SetDataInitial = () => {
            setTemplePujaObj((prev) => ({
                  ...prev, templeName: null, templeRules: null, stateID: null, districtID: null, templeAddress: null, seatingCapacity: null, latitude: null, longitude: null, bestSeason: null, templeTimings: null, trend: null, dayID: [],
                  liveOnlineURL: null, isWhitePageLabel: null, templeDetails: null, byAir: null, byTrain: null, byRoad: null, significanceOfTheTemple: null,
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

      const handleUpcomingPujaDateChange = (date) => {
            setTemplePujaObj((prevState) => ({
                  ...prevState,
                  upcomingPujaDate: dayjs(date).format('YYYY-MM-DD')  // Store as string
            }));
      };

      return (
            <>
                  <Modal style={{ zIndex: 1300 }} size='lg' show={show} backdrop="static" keyboard={false} centered>
                        <Modal.Header>
                              <h4 className="text-center">{modelRequestData?.Action === null ? 'Add Temple Puja' : 'Update Temple Puja'}</h4>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
                              <div className="container-fluid ">

                                    <div className="row">
                                          {/* Puja Name */}
                                          <div className="col-md-6 mb-3">
                                                <label htmlFor="templeName" className="form-label">
                                                      Puja Name <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                      maxLength={50}
                                                      type="text"
                                                      className="form-control"
                                                      id="StateName"
                                                      placeholder="Enter Temple Puja Name"
                                                      aria-describedby="Employee"
                                                      value={templePujaObj.pujaName}
                                                      onChange={(e) => {
                                                            setErrorMessage(false);
                                                            let inputValue = e.target.value;

                                                            // Prevent input if empty or only a leading space
                                                            if (inputValue.length === 0 || (inputValue.length === 1 && inputValue === ' ')) {
                                                                  inputValue = '';
                                                            }

                                                            // Remove unwanted characters (allow letters, numbers, spaces)
                                                            const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                                                            // Trim only leading spaces
                                                            const trimmedValue = cleanedValue.trimStart();

                                                            // Capitalize first letter of every word
                                                            const updatedValue = trimmedValue
                                                                  .split(' ')
                                                                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                                  .join(' ');

                                                            setTemplePujaObj(prev => ({
                                                                  ...prev,
                                                                  pujaName: updatedValue
                                                            }));
                                                      }}
                                                />
                                                {error && (templePujaObj.pujaName === null || templePujaObj.pujaName === undefined || templePujaObj.pujaName === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </div>

                                          {/* Seating Capacity */}
                                          <div className="col-md-6 mb-3">
                                                <label htmlFor="seatingCapacity" className="form-label">
                                                      Puja For <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                      maxLength={50}
                                                      type="text"
                                                      className="form-control"
                                                      id="StateName"
                                                      placeholder="Enter Temple Puja Name"
                                                      aria-describedby="Employee"
                                                      value={templePujaObj.pujaFor}
                                                      onChange={(e) => {
                                                            setErrorMessage(false);
                                                            let inputValue = e.target.value;

                                                            // Prevent input if empty or only a leading space
                                                            if (inputValue.length === 0 || (inputValue.length === 1 && inputValue === ' ')) {
                                                                  inputValue = '';
                                                            }

                                                            // Remove unwanted characters (allow letters, numbers, spaces)
                                                            const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                                                            // Trim only leading spaces
                                                            const trimmedValue = cleanedValue.trimStart();

                                                            // Capitalize first letter of every word
                                                            const updatedValue = trimmedValue
                                                                  .split(' ')
                                                                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                                  .join(' ');

                                                            setTemplePujaObj(prev => ({
                                                                  ...prev,
                                                                  pujaFor: updatedValue
                                                            }));
                                                      }}
                                                />
                                                {error && (!templePujaObj?.pujaFor) && (
                                                      <span className="text-danger">{ERROR_MESSAGES}</span>
                                                )}
                                          </div>
                                          {/* temple id */}
                                          <div className="col-md-6 mb-3">
                                                <label htmlFor="bestSeason" className="form-label">
                                                      Select Temple <span className="text-danger">*</span>
                                                </label>
                                                <Select
                                                      options={templeOption}
                                                      value={templeOption.filter((item) => item.value === templePujaObj.templeID)}
                                                      onChange={handleTempleChange}
                                                      menuPosition="fixed"
                                                />
                                                {error && (templePujaObj.templeID === null || templePujaObj.templeID === undefined || templePujaObj.templeID === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </div>

                                          {/* Best Season */}
                                          <div className="col-md-6 mb-3">
                                                <label htmlFor="bestSeason" className="form-label">
                                                      Select Puja Category <span className="text-danger">*</span>
                                                </label>
                                                <Select
                                                      options={pujaCategoryOption}
                                                      value={pujaCategoryOption.filter((item) => item.value === templePujaObj.tempPujaCatID)}
                                                      onChange={handleTemplePujaChange}
                                                      menuPosition="fixed"
                                                />
                                                {error && (templePujaObj.tempPujaCatID === null || templePujaObj.tempPujaCatID === undefined || templePujaObj.tempPujaCatID === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </div>

                                          {/* Temple Timings */}
                                          <div className="col-md-6 mb-3">
                                                <label htmlFor="bestSeason" className="form-label">
                                                      Select Puja Sub Category <span className="text-danger">*</span>
                                                </label>
                                                <Select
                                                      options={templePujaSubCatOption}
                                                      value={templePujaSubCatOption.filter((item) => item.value === templePujaObj.tempPujaSubCatID)}
                                                      onChange={handleTemplePujaSubCatChange}
                                                      menuPosition="fixed"
                                                      isDisabled={!templePujaObj.tempPujaCatID}  // 🔑 disabled if no category selected

                                                />
                                                {error && (templePujaObj.tempPujaSubCatID === null || templePujaObj.tempPujaSubCatID === undefined || templePujaObj.tempPujaSubCatID === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </div>


                                          <div className="col-md-6 mb-3">
                                                <label htmlFor="bestSeason" className="form-label">
                                                      Select State
                                                      {/* <span className="text-danger">*</span> */}
                                                </label>
                                                <Select
                                                      options={stateOption}
                                                      value={stateOption.filter((item) => item.value === templePujaObj.stateID)}
                                                      onChange={handleStateChange}
                                                      menuPosition="fixed"
                                                />
                                                {/* {error && (!templePujaObj?.stateID) && (
                                                      <span className="text-danger">{ERROR_MESSAGES}</span>
                                                )} */}
                                          </div>
                                          <div className="col-md-6 mb-3">
                                                <label htmlFor="bestSeason" className="form-label">
                                                      Select District
                                                      {/* <span className="text-danger">*</span> */}
                                                </label>
                                                <Select
                                                      options={districtOption}
                                                      value={districtOption.filter((item) => item.value === templePujaObj.districtID)}
                                                      onChange={handleDistrictChange}
                                                      menuPosition="fixed"
                                                />
                                                {/* {error && (!templePujaObj?.bestSeason) && (
                                                      <span className="text-danger">{ERROR_MESSAGES}</span>
                                                )} */}
                                          </div>


                                          {/* Rules */}
                                          <div className="col-md-6 mb-3">
                                                <label htmlFor="bestSeason" className="form-label">
                                                      Select Puja Type<span className="text-danger">*</span>
                                                </label>
                                                <Select
                                                      options={PujaTypeIDOption}
                                                      value={PujaTypeIDOption.filter((item) => item.value === templePujaObj.pujaTypeID)}
                                                      onChange={handlePujaTypeChange}
                                                      menuPosition="fixed"
                                                />
                                                {error && (!templePujaObj?.pujaTypeID) && (
                                                      <span className="text-danger">{ERROR_MESSAGES}</span>
                                                )}
                                          </div>

                                          {/* Address */}
                                          <div className="col-md-6 mb-3">
                                                <label htmlFor="templeAddress" className="form-label">
                                                      Upcoming Puja Date <span className="text-danger">*</span>
                                                </label>
                                                <DatePicker
                                                      value={templePujaObj?.upcomingPujaDate ? new Date(templePujaObj?.upcomingPujaDate) : null}
                                                      onChange={handleUpcomingPujaDateChange}
                                                      format="dd/MM/yyyy"
                                                      clearIcon={null}



                                                />
                                                {error && (templePujaObj.upcomingPujaDate === null || templePujaObj.upcomingPujaDate === undefined || templePujaObj.upcomingPujaDate === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </div>





                                          {/* Is White Page */}
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
                                                                  value="true"
                                                                  checked={templePujaObj.isTrendingPuja === true}
                                                                  onChange={(e) =>
                                                                        setTemplePujaObj((prev) => ({
                                                                              ...prev,
                                                                              isTrendingPuja: e.target.value === "true",
                                                                        }))
                                                                  }
                                                                  className="form-radio h-4 w-4 text-blue-600"
                                                            />
                                                            <span className="ml-2 mx-2 text-sm text-gray-700">Yes</span>
                                                      </label>

                                                      <label className="inline-flex items-center mx-1">
                                                            <input
                                                                  type="radio"
                                                                  id="isTrendingPujaNo"
                                                                  name="isTrendingPuja"
                                                                  value="false"
                                                                  checked={templePujaObj.isTrendingPuja === false}
                                                                  onChange={(e) =>
                                                                        setTemplePujaObj((prev) => ({
                                                                              ...prev,
                                                                              isTrendingPuja: e.target.value === "true",
                                                                        }))
                                                                  }
                                                                  className="form-radio h-4 w-4 text-blue-600"
                                                            />
                                                            <span className="ml-2 mx-2 text-sm text-gray-700">No</span>
                                                      </label>
                                                </div>


                                                {/* Validation */}
                                                {error && (templePujaObj.isTrendingPuja === null || templePujaObj.isTrendingPuja === undefined || templePujaObj.isTrendingPuja === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </div>

                                          {/* { onlinePrice} */}
                                          <div className="col-md-6 mb-3">
                                                <label htmlFor="trend" className="form-label">
                                                      Online Price <span className="text-danger">*</span>
                                                </label>

                                                <input
                                                      type="text"
                                                      className="form-control"
                                                      id="OnlinePrice"
                                                      placeholder="Enter Online Price"
                                                      value={templePujaObj.onlinePrice}
                                                      onChange={(e) => {
                                                            let val = e.target.value;

                                                            // allow only digits and a single decimal point
                                                            val = val.replace(/[^0-9.]/g, "");

                                                            // prevent more than one decimal point
                                                            const parts = val.split(".");
                                                            if (parts.length > 2) {
                                                                  val = parts[0] + "." + parts[1];
                                                            }

                                                            // limit to 2 decimal places
                                                            if (parts[1]?.length > 2) {
                                                                  val = parts[0] + "." + parts[1].slice(0, 2);
                                                            }

                                                            setTemplePujaObj((prev) => ({
                                                                  ...prev,
                                                                  onlinePrice: val,
                                                            }));
                                                      }}
                                                />
                                                {error && (templePujaObj.onlinePrice === null || templePujaObj.onlinePrice === undefined || templePujaObj.onlinePrice === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}





                                          </div>
                                          {/* Offline puja */}
                                          <div className="col-md-6 mb-3">
                                                <label htmlFor="trend" className="form-label">
                                                      Offline Price <span className="text-danger">*</span>
                                                </label>

                                                <input
                                                      type="text"
                                                      className="form-control"
                                                      id="OnlinePrice"
                                                      placeholder="Enter Offline Price"
                                                      value={templePujaObj.offlinePrice}
                                                      onChange={(e) => {
                                                            let val = e.target.value;

                                                            // allow only digits and a single decimal point
                                                            val = val.replace(/[^0-9.]/g, "");

                                                            // prevent more than one decimal point
                                                            const parts = val.split(".");
                                                            if (parts.length > 2) {
                                                                  val = parts[0] + "." + parts[1];
                                                            }

                                                            // limit to 2 decimal places
                                                            if (parts[1]?.length > 2) {
                                                                  val = parts[0] + "." + parts[1].slice(0, 2);
                                                            }

                                                            setTemplePujaObj((prev) => ({
                                                                  ...prev,
                                                                  offlinePrice: val,
                                                            }));
                                                      }}
                                                />
                                                {error && (templePujaObj.offlinePrice === null || templePujaObj.offlinePrice === undefined || templePujaObj.offlinePrice === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}





                                          </div>
                                          {/* {convenienceFee} */}
                                          <div className="col-md-6 mb-3">
                                                <label htmlFor="trend" className="form-label">
                                                      Convenience Fee <span className="text-danger">*</span>
                                                </label>

                                                <input
                                                      type="text"
                                                      className="form-control"
                                                      id="OnlinePrice"
                                                      placeholder="Enter Convenience Fee "
                                                      value={templePujaObj.convenienceFee}
                                                      onChange={(e) => {
                                                            let val = e.target.value;

                                                            // allow only digits and a single decimal point
                                                            val = val.replace(/[^0-9.]/g, "");

                                                            // prevent more than one decimal point
                                                            const parts = val.split(".");
                                                            if (parts.length > 2) {
                                                                  val = parts[0] + "." + parts[1];
                                                            }

                                                            // limit to 2 decimal places
                                                            if (parts[1]?.length > 2) {
                                                                  val = parts[0] + "." + parts[1].slice(0, 2);
                                                            }

                                                            setTemplePujaObj((prev) => ({
                                                                  ...prev,
                                                                  convenienceFee: val,
                                                            }));
                                                      }}
                                                />
                                                {error && (templePujaObj.convenienceFee === null || templePujaObj.convenienceFee === undefined || templePujaObj.convenienceFee === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}





                                          </div>
                                          {/* {wetSamagriPrice } */}
                                          <div className="col-md-6 mb-3">
                                                <label htmlFor="trend" className="form-label">
                                                      Wet Samagri Price  <span className="text-danger">*</span>
                                                </label>

                                                <input
                                                      type="text"
                                                      className="form-control"
                                                      id="OnlinePrice"
                                                      placeholder="Enter Wet Samagri Price"
                                                      value={templePujaObj.wetSamagriPrice}
                                                      onChange={(e) => {
                                                            let val = e.target.value;

                                                            // allow only digits and a single decimal point
                                                            val = val.replace(/[^0-9.]/g, "");

                                                            // prevent more than one decimal point
                                                            const parts = val.split(".");
                                                            if (parts.length > 2) {
                                                                  val = parts[0] + "." + parts[1];
                                                            }

                                                            // limit to 2 decimal places
                                                            if (parts[1]?.length > 2) {
                                                                  val = parts[0] + "." + parts[1].slice(0, 2);
                                                            }

                                                            setTemplePujaObj((prev) => ({
                                                                  ...prev,
                                                                  wetSamagriPrice: val,
                                                            }));
                                                      }}
                                                />
                                                {error && (templePujaObj.wetSamagriPrice === null || templePujaObj.wetSamagriPrice === undefined || templePujaObj.wetSamagriPrice === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}





                                          </div>
                                          {/* {wetSamagriPrice } */}
                                          <div className="col-md-6 mb-3">
                                                <label htmlFor="trend" className="form-label">
                                                      Dry Samagri Price  <span className="text-danger">*</span>
                                                </label>

                                                <input
                                                      type="text"
                                                      className="form-control"
                                                      id="OnlinePrice"
                                                      placeholder="Enter Dry Samagri Price"
                                                      value={templePujaObj.drySamagriPrice}
                                                      onChange={(e) => {
                                                            let val = e.target.value;

                                                            // allow only digits and a single decimal point
                                                            val = val.replace(/[^0-9.]/g, "");

                                                            // prevent more than one decimal point
                                                            const parts = val.split(".");
                                                            if (parts.length > 2) {
                                                                  val = parts[0] + "." + parts[1];
                                                            }

                                                            // limit to 2 decimal places
                                                            if (parts[1]?.length > 2) {
                                                                  val = parts[0] + "." + parts[1].slice(0, 2);
                                                            }

                                                            setTemplePujaObj((prev) => ({
                                                                  ...prev,
                                                                  drySamagriPrice: val,
                                                            }));
                                                      }}
                                                />
                                                {error && (templePujaObj.drySamagriPrice === null || templePujaObj.drySamagriPrice === undefined || templePujaObj.drySamagriPrice === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}





                                          </div>
                                          {/* {wetSamagriPrice } */}
                                          <div className="col-md-6 mb-3">
                                                <label htmlFor="discount" className="form-label">
                                                      Discount  <span className="text-danger">*</span>
                                                </label>

                                                <input
                                                      type="text"
                                                      className="form-control"
                                                      id="discount"
                                                      placeholder="Enter Discount"
                                                      value={templePujaObj.discount}
                                                      onChange={(e) => {
                                                            let val = e.target.value;

                                                            // allow only digits and a single decimal point
                                                            val = val.replace(/[^0-9.]/g, "");

                                                            // prevent more than one decimal point
                                                            const parts = val.split(".");
                                                            if (parts.length > 2) {
                                                                  val = parts[0] + "." + parts[1];
                                                            }

                                                            // limit to 2 decimal places
                                                            if (parts[1]?.length > 2) {
                                                                  val = parts[0] + "." + parts[1].slice(0, 2);
                                                            }

                                                            setTemplePujaObj((prev) => ({
                                                                  ...prev,
                                                                  discount: val,
                                                            }));
                                                      }}
                                                />
                                                {error && (templePujaObj.discount === null || templePujaObj.discount === undefined || templePujaObj.discount === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}





                                          </div>


                                          {/* {aboutPuja } */}
                                          <div className="col-md-12 mb-3">
                                                <label htmlFor="canonicalTag" className="form-label">
                                                      About Puja <span className="text-danger">*</span>
                                                </label>
                                                <Text_Editor
                                                      editorState={templePujaObj?.aboutPuja}
                                                      handleContentChange={handleAboutPujaChange}
                                                />
                                                {error && (templePujaObj.aboutPuja === null || templePujaObj.aboutPuja === undefined || templePujaObj.aboutPuja === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </div>
                                          {/* benefitsofPuja */}
                                          <div className="col-md-12 mb-3">
                                                <label htmlFor="canonicalTag" className="form-label">
                                                      Benefits Of Puja<span className="text-danger">*</span>
                                                </label>
                                                <Text_Editor
                                                      editorState={templePujaObj?.benefitsofPuja}
                                                      handleContentChange={handleBenifitsOfPujaChange}
                                                />
                                                {error && (templePujaObj.benefitsofPuja === null || templePujaObj.benefitsofPuja === undefined || templePujaObj.benefitsofPuja === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </div>
                                          {/* {samagri } */}
                                          <div className="col-md-12 mb-3">
                                                <label htmlFor="canonicalTag" className="form-label">
                                                      Samagri<span className="text-danger">*</span>
                                                </label>
                                                <Text_Editor
                                                      editorState={templePujaObj?.samagri}
                                                      handleContentChange={handleSamagriChange}
                                                />
                                                {error && (templePujaObj.samagri === null || templePujaObj.samagri === undefined || templePujaObj.samagri === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </div>
                                          {/* {aboutTemple } */}
                                          <div className="col-md-12 mb-3">
                                                <label htmlFor="canonicalTag" className="form-label">
                                                      About Temple<span className="text-danger">*</span>
                                                </label>
                                                <Text_Editor
                                                      editorState={templePujaObj?.aboutTemple}
                                                      handleContentChange={handleAboutTempleChange}
                                                />
                                                {error && (templePujaObj.aboutTemple === null || templePujaObj.aboutTemple === undefined || templePujaObj.aboutTemple === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
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
                                                      value={benefitList?.filter((v) => templePujaObj?.benefitID?.includes(v.value))}
                                                      onChange={(selectedOptions) =>
                                                            setTemplePujaObj((prev) => ({
                                                                  ...prev,
                                                                  benefitID: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
                                                            }))
                                                      }
                                                />
                                                {error && (!templePujaObj?.benefitID || templePujaObj?.benefitID.length === 0) && (
                                                      <span className="text-danger">{ERROR_MESSAGES}</span>
                                                )}
                                          </div>

                                          {/* Slug */}
                                          <div className="col-md-6 mb-3">
                                                <label htmlFor="templeSlug" className="form-label">
                                                      Slug <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                      type="text"
                                                      className="form-control"
                                                      id="slug"               // <- changed
                                                      name="slug"
                                                      placeholder="Enter Temple Slug"
                                                      value={templePujaObj?.slug ?? null} // fallback to avoid uncontrolled input
                                                      onChange={handleChange}
                                                />
                                                {error && (templePujaObj.slug === null || templePujaObj.slug === undefined || templePujaObj.slug === '') ? (
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
                                                      value={templePujaObj?.metaTitle}
                                                      onChange={handleChange}
                                                />
                                                {error && (templePujaObj.metaTitle === null || templePujaObj.metaTitle === undefined || templePujaObj.metaTitle === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
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
                                                      value={templePujaObj?.metaDescription}
                                                      onChange={handleChange}
                                                />
                                                {error && (templePujaObj.metaDescription === null || templePujaObj.metaDescription === undefined || templePujaObj.metaDescription === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
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
                                                      value={templePujaObj?.canonicalTag}
                                                      onChange={handleChange}
                                                />
                                                {error && (templePujaObj.canonicalTag === null || templePujaObj.canonicalTag === undefined || templePujaObj.canonicalTag === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}

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
                                                      value={templePujaObj?.extraMetaTag}
                                                      onChange={handleChange}
                                                />
                                                {error && (templePujaObj.extraMetaTag === null || templePujaObj.extraMetaTag === undefined || templePujaObj.extraMetaTag === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}

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
                                                      value={templePujaObj?.openGraphTag}
                                                      onChange={handleChange}
                                                />
                                                {error && (templePujaObj.openGraphTag === null || templePujaObj.openGraphTag === undefined || templePujaObj.openGraphTag === '') ? (
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
                  </Modal >
                  <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={modelRequestData?.Action === null ? "Temple has been Added Successfully !" : "Temple has been Updated Successfully !"} />
                  <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
            </>
      )
}

export default TemplePujaAddUpdateModal
