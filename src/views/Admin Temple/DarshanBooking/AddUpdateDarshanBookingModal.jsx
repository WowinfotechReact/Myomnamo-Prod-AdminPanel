import axios from 'axios';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import Text_Editor from 'component/Text_Editor';
import { ConfigContext } from 'context/ConfigContext';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { AddUpdateDataAPI } from 'services/Admin/EStoreAPI/ProductAPI';
import {
  AddUpdateDarshanBookingAPI,
  GetDarshanBookingModal,
  GetTimeSlotLookupList
} from 'services/Admin/DarshanBookingAPI/DarshanBookingAPI';

const AddUpdateDarshanbookModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
  const { setLoader, user } = useContext(ConfigContext);
  const [pujaCategoryOption, setPujaCategoryOption] = useState([]);
  const [templeOption, setTempleOption] = useState([]);
  const [districtOption, setDistrictOption] = useState([]);
  const [stateOption, setStateOption] = useState([]);
  const [templePujaSubCatOption, setTemplePujaSubCatOption] = useState([]);
  const [isAllDaySelected, setAllDaySelected] = useState(false);
  const [error, setError] = useState(false);
  const [customError, setCustomError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isAddressChanged, setIsAddressChanged] = useState(false);
  const [languageList, setLanguageList] = useState([]);
  const [templeList, setTempleList] = useState([]);
  const [timeSlotList, setTimeSlotList] = useState([]);

  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sizeError, setSizeError] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [actionMassage, setActionMassage] = useState(null);

  const [districtList, setDistrictList] = useState([]);
  const [benefitList, setBenefitList] = useState([]);
  const [deityList, setDeityList] = useState([]);
  const [heading, setHeading] = useState('Puja');

  const [darshanBookingFormObj, setDarshanBookingFormObj] = useState({
    templeID: null,
    darshanRules: null,
    darshanBookingName: null,
    darshanPrice: null,
    convenienceFee: null,
    slug: null,
    productOGTag: null,
    darshanBookingMetaDescription: null,
    darshanBookingCanonicalTag: null,
    darshanBookingExtraMetaTag: null,
    darshanBookingMetaTitle: null,
    darshanDetails: null,
    darshanShortdetails: null,
    darshanBookingShortDescription: null,
    darshanBookingKeyFeature: null,
    timeSlotID: [],
    appLangID: null
  });

  useEffect(() => {
    if (show) {
      isPageRender();
      GetPujaCategoryLookupListData();
      GetAppLanguageLookupListData();
      GetTempleLookupListData();
      GetTimeSlotLookupListData();
      if (
        modelRequestData?.Action === 'update' &&
        modelRequestData?.templeDarshanKeyID !== null &&
        modelRequestData?.templeDarshanKeyID !== ''
      ) {
        GetDarshanModelData();
      }
    }
  }, [show]);

  const isPageRender = () => {
    if (modelRequestData?.moduleName === 'DarshanBookingModal') {
      setHeading('Darshan');
    } else if (modelRequestData?.moduleName === 'LanguageWiseList') {
      setHeading('Darshan language wise');
    }
  };

  // utility function
  const stripHtml = (htmlString) => {
    if (!htmlString) return '';
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
  };

  const GetDarshanModelData = async () => {
    setLoader(true);
    try {
      const response = await GetDarshanBookingModal(modelRequestData?.templeDarshanKeyID, modelRequestData?.appLangID);

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const List = response.data.responseData.data;
            setDarshanBookingFormObj((prev) => ({
              ...prev,
              appLangID: List?.appLangID,
              adminID: List.adminID,
              templeID: List.templeID,
              darshanRules: List.templeDarshanRules,
              darshanBookingName: List.templeDarshanName,
              darshanPrice: List.darshanPrice,
              convenienceFee: List.convenienceFee,
              slug: List.templeSlug,
              productOGTag: List.openGraphTag,
              darshanBookingMetaDescription: List.metaDescription,
              darshanBookingCanonicalTag: List.canonicalTag,
              darshanBookingExtraMetaTag: List.extraMetaTag,
              darshanBookingMetaTitle: List.metaTitle,
              darshanDetails: List.templeDarshanDetails,
              darshanShortdetails: List.shortDetails,
              darshanBookingShortDescription: List.shortDescription,
              darshanBookingKeyFeature: List.keyFeature,
              timeSlotID: List.timeSlotID
            }));
            setSelectedFile(List?.pujaImageUrl);
            setFilePreview(List?.pujaImageUrl);
            setUploadedImageUrl(List?.pujaImageUrl);
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

  const GetPujaCategoryLookupListData = async () => {
    try {
      const response = await GetPujaCategoryLookupList(); // Ensure it's correctly imported

      if (response?.data?.statusCode === 200) {
        const languageLookupList = response.data.responseData.data || [];

        const formattedLangList = languageLookupList.map((Lang) => ({
          value: Lang.pujaCategoryID,
          label: Lang.pujaCategoryName
        }));

        setPujaCategoryOption(formattedLangList);
      } else {
        console.error('Failed to fetch sim Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching sim Type lookup list:', error);
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

  const setDataInitial = () => {
    setDarshanBookingFormObj((prev) => ({
      ...prev,
      templeID: null,
      darshanRules: null,
      darshanBookingName: null,
      darshanPrice: null,
      convenienceFee: null,
      slug: null,
      productOGTag: null,
      darshanBookingMetaDescription: null,
      darshanBookingCanonicalTag: null,
      darshanBookingExtraMetaTag: null,
      darshanBookingMetaTitle: null,
      darshanDetails: null,
      darshanShortdetails: null,
      darshanBookingShortDescription: null,
      darshanBookingKeyFeature: null
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

    let isValid = false;

    if (modelRequestData.moduleName === 'DarshanBookingModal') {
      if (
        darshanBookingFormObj.templeID === '' ||
        darshanBookingFormObj.templeID === undefined ||
        darshanBookingFormObj.templeID === null ||
        darshanBookingFormObj.darshanRules === '' ||
        darshanBookingFormObj.darshanRules === undefined ||
        darshanBookingFormObj.darshanRules === null ||
        darshanBookingFormObj.darshanBookingName === '' ||
        darshanBookingFormObj.darshanBookingName === undefined ||
        darshanBookingFormObj.darshanBookingName === null ||
        darshanBookingFormObj.darshanPrice === '' ||
        darshanBookingFormObj.darshanPrice === undefined ||
        darshanBookingFormObj.darshanPrice === null ||
        darshanBookingFormObj.convenienceFee === '' ||
        darshanBookingFormObj.convenienceFee === undefined ||
        darshanBookingFormObj.convenienceFee === null ||
        darshanBookingFormObj.slug === '' ||
        darshanBookingFormObj.slug === undefined ||
        darshanBookingFormObj.slug === null ||
        darshanBookingFormObj.darshanDetails === '' ||
        darshanBookingFormObj.darshanDetails === undefined ||
        darshanBookingFormObj.darshanDetails === null ||
        darshanBookingFormObj.darshanShortdetails === '' ||
        darshanBookingFormObj.darshanShortdetails === undefined ||
        darshanBookingFormObj.darshanShortdetails === null
      ) {
        setError(true);
        isValid = true;
      }
    } else if (modelRequestData.moduleName === 'LanguageWiseList') {
      if (
        darshanBookingFormObj.appLangID === '' ||
        darshanBookingFormObj.appLangID === undefined ||
        darshanBookingFormObj.appLangID === null ||
        darshanBookingFormObj.darshanRules === '' ||
        darshanBookingFormObj.darshanRules === undefined ||
        darshanBookingFormObj.darshanRules === null ||
        darshanBookingFormObj.darshanBookingName === '' ||
        darshanBookingFormObj.darshanBookingName === undefined ||
        darshanBookingFormObj.darshanBookingName === null ||
        darshanBookingFormObj.darshanDetails === '' ||
        darshanBookingFormObj.darshanDetails === undefined ||
        darshanBookingFormObj.darshanDetails === null ||
        darshanBookingFormObj.darshanShortdetails === '' ||
        darshanBookingFormObj.darshanShortdetails === undefined ||
        darshanBookingFormObj.darshanShortdetails === null
      ) {
        setError(true);
        isValid = true;
      }
    }

    const apiParam = {
      adminID: user?.adminID,
      templeDarshanKeyID: modelRequestData.templeDarshanKeyID,
      templeDarshanByLangKeyID: null,
      appLangID: darshanBookingFormObj.appLangID,
      // productCategoryID: darshanBookingFormObj.productCategoryID,
      templeID: darshanBookingFormObj.templeID,
      templeDarshanRules: darshanBookingFormObj.darshanRules,
      templeDarshanName: darshanBookingFormObj.darshanBookingName,
      // darshanPrice: darshanBookingFormObj.darshanPrice,
      // convenienceFee: darshanBookingFormObj.convenienceFee,
      darshanPrice: parseFloat(String(darshanBookingFormObj.darshanPrice)?.replace(/,/g, '')),
      convenienceFee: parseFloat(String(darshanBookingFormObj.convenienceFee)?.replace(/,/g, '')),
      templeSlug: darshanBookingFormObj.slug,
      openGraphTag: darshanBookingFormObj.productOGTag,
      metaDescription: darshanBookingFormObj.darshanBookingMetaDescription,
      canonicalTag: darshanBookingFormObj.darshanBookingCanonicalTag,
      extraMetaTag: darshanBookingFormObj.darshanBookingExtraMetaTag,
      metaTitle: darshanBookingFormObj.darshanBookingMetaTitle,
      templeDarshanDetails: stripHtml(darshanBookingFormObj.darshanDetails),
      shortDetails: stripHtml(darshanBookingFormObj.darshanShortdetails),
      shortDescription: stripHtml(darshanBookingFormObj.darshanBookingShortDescription),
      keyFeature: stripHtml(darshanBookingFormObj.darshanBookingKeyFeature),
      timeSlotID: darshanBookingFormObj.timeSlotID,
      trend: true,
      templeDarshanImageUrl: 'test url'
    };

    if (!isValid) {
      AddUpdateData(apiParam);
    }
  };

  const AddUpdateData = async (ApiParam) => {
    setLoader(true);
    try {
      const response = await AddUpdateDarshanBookingAPI(ApiParam);
      if (response?.data?.statusCode === 200) {
        setLoader(false);
        if (modelRequestData?.Action === null && modelRequestData?.moduleName === 'DarshanBookingModal') {
          setActionMassage(`${heading} added successfully`);
        } else if (modelRequestData?.Action !== null && modelRequestData?.moduleName === 'DarshanBookingModal') {
          setActionMassage(`${heading} updated successfully.`);
        } else if (modelRequestData?.Action === null && modelRequestData?.moduleName === 'LanguageWiseList') {
          setActionMassage(`${heading} added successfully.`);
        } else if (modelRequestData?.Action !== null && modelRequestData?.moduleName === 'LanguageWiseList') {
          setActionMassage(`${heading} updated successfully.`);
        }
        setShowSuccessModal(true);
        setIsAddUpdateDone(true);
        onHide();
      } else {
        console.error(response?.response?.data?.errorMessage);
        setCustomError(response?.response?.data?.errorMessage);
        setShowErrorModal(true);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const formatSlug = (value) => {
    const slug = value.toLowerCase().replace(/\s+/g, '-');
    setDarshanBookingFormObj((prev) => ({ ...prev, slug: slug }));
  };

  const handleChange = (e) => {
    let { id, value } = e.target;
    if (id === 'pujaName') {
      // Remove leading spaces
      // value = value.replace(/[^a-zA-Z\s]/g, '');
      value = value.replace(/^\s+/, '');

      // Capitalize first letter (if any)
      if (value.length > 0) {
        value = value.charAt(0).toUpperCase() + value.slice(1);
      }
      formatSlug(value);
    }
    if (id === 'pujaSlug') {
      // Remove leading spaces
      // value = value.replace(/[^a-zA-Z\s]/g, '');
      value = value.replace(/[\s]/g, '');
    }

    if (
      id === 'onlinePujaPrice' ||
      id === 'convenienceFee' ||
      id === 'offlinePujaPrice' ||
      id === 'drySamagriPrice' ||
      id === 'wetSamagriPrice'
    ) {
      const sanitizedInput = value
        .replace(/[^0-9.]/g, '') // Allow only numeric and dot characters
        .slice(0, 16); // Limit to 6 characters (5 digits + 1 dot or 4 digits + 2 decimals)

      // Split the input into integer and decimal parts
      const [integerPart, decimalPart] = sanitizedInput.split('.');

      // Format the integer part with commas as thousand separators
      const formattedIntegerPart = integerPart;

      // Combine integer and decimal parts with appropriate precision
      value =
        decimalPart !== undefined ? `${formattedIntegerPart.slice(0, 12)}.${decimalPart.slice(0, 2)}` : formattedIntegerPart.slice(0, 12);
    }

    if (id === 'pujaDiscount') {
      let numericValue = value.replace(/\D/g, '').slice(0, 3); // Only digits, max 3 characters

      // Allow empty value (so user can delete)
      if (numericValue === '' || Number(numericValue) <= 100) {
        value = numericValue;
      } else {
        // Keep previous valid value (fallback)
        value = darshanBookingFormObj?.pujaDiscount || '';
      }
    }
    if (id === 'metaTitle' || id === 'metaDescription' || id === 'canonicalTag' || id === 'extraMetaTag' || id === 'openGraphTag') {
      value = value.replace(/^\s+/, '');
    }

    setDarshanBookingFormObj((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleEditorChange = (field, htmlContent) => {
    setError(false);
    console.log(field);
    // Strip HTML tags and check if anything meaningful remains
    const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

    setDarshanBookingFormObj((obj) => ({
      ...obj,
      [field]: strippedContent === '' ? null : htmlContent
    }));
  };

  const handleIntegerInputChange = (field, value) => {
    // Keep only digits and at most one decimal
    let sanitizedInput = value.replace(/[^0-9.]/g, '');
    const parts = sanitizedInput.split('.');

    // Ensure only one decimal point
    if (parts.length > 2) {
      sanitizedInput = parts[0] + '.' + parts.slice(1).join('');
    }

    let [integerPart, decimalPart] = sanitizedInput.split('.');

    // Limit integer to 12 digits
    integerPart = integerPart?.slice(0, 12);

    // Add comma formatting
    const formattedIntegerPart = integerPart ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';

    // Limit decimal to 2 digits
    let finalValue = decimalPart !== undefined ? `${formattedIntegerPart}.${decimalPart.slice(0, 2)}` : formattedIntegerPart;

    setDarshanBookingFormObj((prev) => ({
      ...prev,
      [field]: finalValue
    }));
  };

  const GetTempleLookupListData = async () => {
    try {
      const response = await GetTempleLookupList(modelRequestData?.appLangID); // Ensure it's correctly imported

      if (response?.data?.statusCode === 200) {
        const list = response?.data?.responseData?.data || [];

        const formattedLangList = list.map((Lang) => ({
          value: Lang.templeID,
          label: Lang.templeName
        }));

        setTempleList(formattedLangList);
      } else {
        console.error('Failed to fetch sim Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching sim Type lookup list:', error);
    }
  };

  const GetTimeSlotLookupListData = async () => {
    try {
      const response = await GetTimeSlotLookupList(); // Ensure it's correctly imported

      if (response?.data?.statusCode === 200) {
        const list = response?.data?.responseData?.data || [];

        const formattedLangList = list.map((Lang) => ({
          value: Lang.timeSlotID,
          label: Lang.timeSlot
        }));

        setTimeSlotList(formattedLangList);
      } else {
        console.error('Failed to fetch sim Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching sim Type lookup list:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Allowed types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setSizeError('Only JPG, JPEG, PNG files are allowed.');
      return;
    }

    // Size check (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      setSizeError('File size must be less than 10 MB.');
      return;
    }

    setSizeError('');
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
    setUploadedImageUrl('');
  };
  const handleApiCall = async (file) => {
    setLoader(true);
    const formData = new FormData();
    formData.append('File', file);

    try {
      const response = await UploadImage(formData);
      const uploadedUrl = response?.data?.url ?? response?.data?.data?.url ?? null;

      if (response?.status === 200 && uploadedUrl) {
        setUploadedImageUrl(uploadedUrl);
        console.log('Uploaded Image URL:', uploadedUrl);
      } else {
        console.warn('Upload succeeded but no URL found:', response?.data);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoader(false);
    }
  };

  const handleToDateChange = (newValue) => {
    if (dayjs(newValue).isValid()) {
      const newToDate = dayjs(newValue).format('YYYY-MM-DD');
      setDarshanBookingFormObj((prev) => ({ ...prev, pujaDate: newToDate }));
    } else {
      setDarshanBookingFormObj((prev) => ({ ...prev, pujaDate: null }));
    }
  };

  console.log('timeSlotID', darshanBookingFormObj.timeSlotID);
  return (
    <>
      <Modal style={{ zIndex: 1300 }} size="lg" show={show} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <h4 className="text-center">{modelRequestData?.Action === null ? `Add ${heading}` : `Update ${heading}`}</h4>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
          <div className="container-fluid ">


            <fieldset className="border rounded p-3">
              <legend className="float-none w-auto px-2 fw-bold" style={{ fontSize: "14px" }}>
                Darshan Details
              </legend>
              <div className="row">
                {/* Temple Selection */}
                {modelRequestData?.moduleName === 'DarshanBookingModal' && (
                  <div className="col-md-6 mb-3">
                    <label htmlFor="pujaCategoryID" className="form-label">
                      Select Temple <span className="text-danger">*</span>
                    </label>
                    <Select
                      id="templeID"
                      options={templeList}
                      value={templeList.filter((item) => item.value === darshanBookingFormObj.templeID)}
                      onChange={(selectedOption) =>
                        setDarshanBookingFormObj((prev) => ({
                          ...prev,
                          templeID: selectedOption ? selectedOption.value : null
                        }))
                      }
                      menuPlacement="auto"
                      menuPosition="fixed"
                    />
                    {error &&
                      (darshanBookingFormObj.templeID === null ||
                        darshanBookingFormObj.templeID === undefined ||
                        darshanBookingFormObj.templeID === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div>
                )}

                {/* product Category */}

                {/* {modelRequestData.moduleName === 'ProductModal' && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="pujaCategoryID" className="form-label">
                    Select Product Category <span className="text-danger">*</span>
                  </label>
                  <Select
                    id="productCategoryID"
                    options={pujaCategoryOption}
                    value={pujaCategoryOption.filter((item) => item.value === darshanBookingFormObj.productCategoryID)}
                    onChange={(selectedOption) =>
                      setDarshanBookingFormObj((prev) => ({
                        ...prev,
                        productCategoryID: selectedOption ? selectedOption.value : null
                      }))
                    }
                    menuPlacement="auto"
                    menuPosition="fixed"
                  />
                  {error &&
                  (darshanBookingFormObj.productCategoryID === null ||
                    darshanBookingFormObj.productCategoryID === undefined ||
                    darshanBookingFormObj.productCategoryID === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              )} */}

                {/* Darshan Booking Name */}

                <div className="col-md-6 mb-3">
                  <label htmlFor="openGraphTag" className="form-label">
                    Darshan Booking Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="darshanBookingName"
                    placeholder="Enter Darshan Booking Name"
                    value={darshanBookingFormObj?.darshanBookingName}
                    onChange={(e) => {
                      let input = e.target.value;
                      if (input.startsWith(' ')) {
                        input = input.trimStart();
                      }

                      setDarshanBookingFormObj((prev) => ({
                        ...prev,
                        darshanBookingName: input
                      }));
                      formatSlug(input);
                    }}
                  />
                  {error &&
                    (darshanBookingFormObj.darshanBookingName === null ||
                      darshanBookingFormObj.darshanBookingName === undefined ||
                      darshanBookingFormObj.darshanBookingName === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>

                {/* Language Selection */}
                {modelRequestData?.moduleName === 'LanguageWiseList' && (
                  <>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="stateID" className="form-label">
                        Select Language <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={languageList}
                        value={languageList?.filter((v) => v?.value === darshanBookingFormObj?.appLangID)}
                        onChange={(selectedOption) => {
                          setDarshanBookingFormObj((prev) => ({
                            ...prev,
                            appLangID: selectedOption ? selectedOption.value : null
                          }));
                        }}
                        menuPlacement="auto"
                        menuPosition="fixed"
                      />
                      {error &&
                        (darshanBookingFormObj.appLangID === null ||
                          darshanBookingFormObj.appLangID === undefined ||
                          darshanBookingFormObj.appLangID === '') ? (
                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                      ) : (
                        ''
                      )}
                    </div>
                  </>
                )}



                {/* price */}

                {modelRequestData.moduleName !== 'LanguageWiseList' && (
                  <div className="col-md-6 mb-3">
                    <label htmlFor="openGraphTag" className="form-label">
                      Darshan Price (Rs.)
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="darshanPrice"
                      placeholder="Enter Darshan Price"
                      value={darshanBookingFormObj?.darshanPrice}
                      onChange={(e) => handleIntegerInputChange('darshanPrice', e.target.value)}
                    />
                    {error &&
                      (darshanBookingFormObj.darshanPrice === null ||
                        darshanBookingFormObj.darshanPrice === undefined ||
                        darshanBookingFormObj.darshanPrice === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div>
                )}
                {/* Darshan Rules */}

                <div className={`${modelRequestData.moduleName === 'LanguageWiseList' ? "col-md-12" : "col-md-6"} mb-3`}>
                  <label htmlFor="Darshan Rules" className="form-label">
                    Darshan Rules <span className="text-danger">*</span>
                  </label>
                  <Text_Editor
                    editorState={darshanBookingFormObj?.darshanRules}
                    handleContentChange={(html) => handleEditorChange('darshanRules', html)}
                  />
                  {error &&
                    (darshanBookingFormObj.darshanRules === null ||
                      darshanBookingFormObj.darshanRules === undefined ||
                      darshanBookingFormObj.darshanRules === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
                {/* Convenience Fee(Rs.) */}

                {modelRequestData.moduleName !== 'LanguageWiseList' && (
                  <div className="col-md-6 mb-3">
                    <label htmlFor="openGraphTag" className="form-label">
                      Convenience Fee(Rs.)
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="convenienceFee"
                      placeholder="Enter Convenience Fee"
                      value={darshanBookingFormObj?.convenienceFee}
                      onChange={(e) => handleIntegerInputChange('convenienceFee', e.target.value)}
                    />
                    {error &&
                      (darshanBookingFormObj.convenienceFee === null ||
                        darshanBookingFormObj.convenienceFee === undefined ||
                        darshanBookingFormObj.convenienceFee === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div>
                )}

                {/* Slug */}

                {modelRequestData.moduleName !== 'LanguageWiseList' && (
                  <div className="col-md-6 mb-3">
                    <label htmlFor="openGraphTag" className="form-label">
                      Slug <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="slug"
                      placeholder="Enter Slug"
                      value={darshanBookingFormObj?.slug}
                      onChange={(e) => {
                        let input = e.target.value;
                        if (input.startsWith(' ')) {
                          input = input.trimStart();
                        }

                        setDarshanBookingFormObj((prev) => ({
                          ...prev,
                          slug: input
                        }));
                      }}
                    />
                    {error &&
                      (darshanBookingFormObj.slug === null || darshanBookingFormObj.slug === undefined || darshanBookingFormObj.slug === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div>
                )}

                {/* Open Graph Tag */}

                {modelRequestData.moduleName !== 'LanguageWiseList' && (
                  <div className="col-md-6 mb-3">
                    <label htmlFor="openGraphTag" className="form-label">
                      Open Graph Tag
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="OpenGraphTag"
                      placeholder="Enter Open Graph Tag"
                      value={darshanBookingFormObj?.productOGTag}
                      onChange={(e) => {
                        let input = e.target.value;
                        if (input.startsWith(' ')) {
                          input = input.trimStart();
                        }

                        setDarshanBookingFormObj((prev) => ({
                          ...prev,
                          productOGTag: input
                        }));
                      }}
                    />
                  </div>
                )}

                {/* Meta description */}

                {modelRequestData.moduleName !== 'LanguageWiseList' && (
                  <div className="col-md-6 mb-3">
                    <label htmlFor="openGraphTag" className="form-label">
                      Meta description
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="MetaDescription"
                      placeholder="Enter Meta description"
                      value={darshanBookingFormObj?.darshanBookingMetaDescription}
                      onChange={(e) => {
                        let input = e.target.value;
                        if (input.startsWith(' ')) {
                          input = input.trimStart();
                        }

                        setDarshanBookingFormObj((prev) => ({
                          ...prev,
                          darshanBookingMetaDescription: input
                        }));
                      }}
                    />
                  </div>
                )}

                {/* Cannonical Tag */}

                {modelRequestData.moduleName !== 'LanguageWiseList' && (
                  <div className="col-md-6 mb-3">
                    <label htmlFor="openGraphTag" className="form-label">
                      Cannonical Tag
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cannonicalTag"
                      placeholder="Enter Cannonical Tag"
                      value={darshanBookingFormObj?.darshanBookingCanonicalTag}
                      onChange={(e) => {
                        let input = e.target.value;
                        if (input.startsWith(' ')) {
                          input = input.trimStart();
                        }

                        setDarshanBookingFormObj((prev) => ({
                          ...prev,
                          darshanBookingCanonicalTag: input
                        }));
                      }}
                    />
                  </div>
                )}

                {/* Extra Meta Tag */}

                {modelRequestData.moduleName !== 'LanguageWiseList' && (
                  <div className="col-md-6 mb-3">
                    <label htmlFor="openGraphTag" className="form-label">
                      Extra Meta Tag
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="extraMetaTag"
                      placeholder="Enter Extra Meta Tag"
                      value={darshanBookingFormObj?.darshanBookingExtraMetaTag}
                      onChange={(e) => {
                        let input = e.target.value;
                        if (input.startsWith(' ')) {
                          input = input.trimStart();
                        }

                        setDarshanBookingFormObj((prev) => ({
                          ...prev,
                          darshanBookingExtraMetaTag: input
                        }));
                      }}
                    />
                  </div>
                )}

                {/* Meta Title */}
                {modelRequestData.moduleName !== 'LanguageWiseList' && (
                  <div className="col-md-6 mb-3">
                    <label htmlFor="openGraphTag" className="form-label">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="metaTitle"
                      placeholder="Enter Meta Title"
                      value={darshanBookingFormObj?.darshanBookingMetaTitle}
                      onChange={(e) => {
                        let input = e.target.value;
                        if (input.startsWith(' ')) {
                          input = input.trimStart();
                        }

                        setDarshanBookingFormObj((prev) => ({
                          ...prev,
                          darshanBookingMetaTitle: input
                        }));
                      }}
                    />
                  </div>
                )}

                {/* Temple Selection */}

                {modelRequestData.moduleName !== 'LanguageWiseList' && (
                  <div className="col-md-6 mb-3">
                    <label htmlFor="pujaCategoryID" className="form-label">
                      Time Zone <span className="text-danger">*</span>
                    </label>
                    <Select
                      id="templeID"
                      options={timeSlotList}
                      value={timeSlotList.filter((item) => darshanBookingFormObj.timeSlotID?.includes(item.value))}
                      onChange={(selectedOptions) =>
                        setDarshanBookingFormObj((prev) => ({
                          ...prev,
                          timeSlotID: selectedOptions ? selectedOptions.map((opt) => opt.value) : []
                        }))
                      }
                      menuPlacement="auto"
                      menuPosition="fixed"
                      isMulti
                    />
                    {error && darshanBookingFormObj.timeSlotID.length === 0 ? <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span> : ''}
                  </div>
                )}

                {/* Description */}

                <div className="col-md-12 mb-3">
                  <label htmlFor="canonicalTag" className="form-label">
                    Darshan Details
                    <span className="text-danger">*</span>
                  </label>
                  <Text_Editor
                    editorState={darshanBookingFormObj?.darshanDetails}
                    handleContentChange={(html) => handleEditorChange('darshanDetails', html)}
                  />
                  {error && (!darshanBookingFormObj?.darshanDetails || darshanBookingFormObj?.darshanDetails === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>



                {/* Short Description */}

                <div className="col-md-12 mb-3">
                  <label htmlFor="canonicalTag" className="form-label">
                    Short Description
                  </label>
                  <Text_Editor
                    editorState={darshanBookingFormObj?.darshanBookingShortDescription}
                    handleContentChange={(html) => handleEditorChange('darshanBookingShortDescription', html)}
                  />
                </div>

                {/* Key Feature */}

                <div className="col-md-12 mb-3">
                  <label htmlFor="canonicalTag" className="form-label">
                    Key Feature
                  </label>
                  <Text_Editor
                    editorState={darshanBookingFormObj?.darshanBookingKeyFeature}
                    handleContentChange={(html) => handleEditorChange('darshanBookingKeyFeature', html)}
                  />
                </div>

                {/*  Select Temple  */}
                {/* {modelRequestData?.pujaSubServiceID !== 6 && modelRequestData?.pujaSubServiceID !== 5 && (
                <div div className="col-md-6 mb-3">
                  <label htmlFor="templeID" className="form-label">
                    Select Temple <span className="text-danger">*</span>
                  </label>
                  <Select
                    id="templeID"
                    options={templeList}
                    value={templeList.filter((item) => item.value === darshanBookingFormObj.templeID)}
                    onChange={(selectedOption) =>
                      setDarshanBookingFormObj((prev) => ({
                        ...prev,
                        templeID: selectedOption ? selectedOption.value : null
                      }))
                    }
                    menuPlacement="auto"
                    menuPosition="fixed"
                  />
                  {error && (darshanBookingFormObj.templeID === null || darshanBookingFormObj.templeID === undefined || darshanBookingFormObj.templeID === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              )} */}

                {/* Puja Name */}
                {/* <div className="col-md-6 mb-3">
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
                  value={darshanBookingFormObj.pujaName}
                  onChange={handleChange}
                />
                {error && (darshanBookingFormObj.pujaName === null || darshanBookingFormObj.pujaName === undefined || darshanBookingFormObj.pujaName === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div> */}

                {modelRequestData?.pujaSubServiceID !== 5 && modelRequestData?.pujaSubServiceID !== 6 && (
                  <>
                    {/*Booking Data*/}
                    {/* <div className="col-md-6 col-sm-12 mb-2 d-flex flex-column form-font-size">
                    <label htmlFor="bookingDate" style={{ textAlign: 'left' }}>
                      Puja Date<span style={{ color: 'red' }}>*</span>
                    </label>
                    <DatePicker
                      id="bookingDate"
                      value={darshanBookingFormObj?.pujaDate || ''}
                      clearIcon={null}
                      onChange={handleToDateChange}
                      format="dd/MM/yyyy"
                      className="custom-date-picker"
                    />

                    {error && !darshanBookingFormObj.pujaDate && <span className="error-msg">{ERROR_MESSAGES}</span>}
                  </div> */}

                    {/* Booking Time */}
                    {/* <div className="col-md-6 col-sm-12 mb-2 d-flex flex-column form-font-size">
                    <label style={{ textAlign: 'left' }}>
                      Time<span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id="bookingTime"
                      type="time"
                      className="form-control"
                      value={darshanBookingFormObj.pujaTime || ''}
                      onClick={(e) => e.target.showPicker && e.target.showPicker()}
                      onChange={(e) => {
                        const [hour, minute] = e.target.value.split(':');
                        let hr = parseInt(hour, 10);
                        const ampm = hr >= 12 ? 'PM' : 'AM';
                        hr = hr % 12 || 12; // convert hoga yaha pr -> 13 ka -> 1
                        const formattedTime = `${hr}:${minute} ${ampm}`;

                        setDarshanBookingFormObj((prev) => ({
                          ...prev,
                          pujaTime: e.target.value,
                          time24: e.target.value
                        }));
                      }}
                    />
                    {error && !darshanBookingFormObj.pujaTime && <span className="error-msg">{ERROR_MESSAGES}</span>}
                  </div> */}
                  </>
                )}

                {/* Language */}
                {/* {modelRequestData?.moduleName === 'LanguageWiseList' && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="offlinePujaPrice" className="form-label">
                    Select Language <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={languageList}
                    value={languageList?.filter((v) => v?.value === darshanBookingFormObj?.appLangID)}
                    onChange={(selectedOption) =>
                      setDarshanBookingFormObj((prev) => ({
                        ...prev,
                        appLangID: selectedOption ? selectedOption.value : null
                      }))
                    }
                    menuPlacement="auto"
                    menuPosition="fixed"
                  />
                  {error && !darshanBookingFormObj?.appLangID && <span className="text-danger">{ERROR_MESSAGES}</span>}
                </div>
              )} */}

                {modelRequestData?.moduleName !== 'LanguageWiseList' && (
                  <>
                    {/* Select Puja Type */}
                    {/* {modelRequestData?.pujaSubServiceID !== 5 && modelRequestData?.pujaSubServiceID !== 6 && (
                    <div className="col-md-6 mb-3">
                      <label htmlFor="pujaCategoryID" className="form-label">
                        Select Puja Type<span className="text-danger">*</span>
                      </label>
                      <Select
                        options={PujaTypeIDOption.filter((value) => value?.value !== 1)}
                        value={PujaTypeIDOption.filter((item) => item.value === darshanBookingFormObj.pujaTypeID)}
                        onChange={(selectedOption) =>
                          setDarshanBookingFormObj((prev) => ({
                            ...prev,
                            pujaTypeID: selectedOption ? selectedOption.value : null,
                            onlinePujaPrice: selectedOption?.value === 2 ? null : prev?.onlinePujaPrice,
                            offlinePujaPrice: selectedOption?.value === 1 ? null : prev?.offlinePujaPrice
                          }))
                        }
                        menuPlacement="auto"
                        menuPosition="fixed"
                      />
                      {error && !darshanBookingFormObj?.pujaTypeID && <span className="text-danger">{ERROR_MESSAGES}</span>}
                    </div>
                  )} */}

                    {/*  Is Trending Puja */}
                    {/* <div className="col-md-6 mb-3">
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
                          checked={darshanBookingFormObj.pujaTrend == true}
                          onChange={(e) => {
                            setDarshanBookingFormObj((prev) => ({
                              ...prev,
                              pujaTrend: e.target.value == 1 ? true : false
                            }));
                          }}
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
                          checked={darshanBookingFormObj.pujaTrend == false}
                          onChange={(e) =>
                            setDarshanBookingFormObj((prev) => ({
                              ...prev,
                              pujaTrend: e.target.value == 2 ? false : true
                            }))
                          }
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 mx-2 text-sm text-gray-700">No</span>
                      </label>
                    </div>

                    {error && (darshanBookingFormObj.pujaTrend === null || darshanBookingFormObj.pujaTrend === undefined || darshanBookingFormObj.pujaTrend === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div> */}

                    {/* { onlinePrice} */}
                    {/* {(darshanBookingFormObj?.pujaTypeID == 1 || darshanBookingFormObj?.pujaTypeID == 3) && (
                    <div className="col-md-6 mb-3">
                      <label htmlFor="onlinePujaPrice" className="form-label">
                        Online Price <span className="text-danger">*</span>
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        id="onlinePujaPrice"
                        placeholder="Enter Online Price"
                        value={darshanBookingFormObj.onlinePujaPrice}
                        onChange={handleChange}
                      />
                      {error &&
                      (darshanBookingFormObj.onlinePujaPrice === null ||
                        darshanBookingFormObj.onlinePujaPrice === undefined ||
                        darshanBookingFormObj.onlinePujaPrice === '') ? (
                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                      ) : (
                        ''
                      )}
                    </div>
                  )} */}

                    {/* Offline puja */}
                    {/* {(darshanBookingFormObj?.pujaTypeID == 2 || darshanBookingFormObj?.pujaTypeID == 3) && modelRequestData?.pujaSubServiceID !== 6 && (
                    <div className="col-md-6 mb-3">
                      <label htmlFor="offlinePujaPrice" className="form-label">
                        Offline Price <span className="text-danger">*</span>
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        id="offlinePujaPrice"
                        placeholder="Enter Offline Price"
                        value={darshanBookingFormObj.offlinePujaPrice}
                        onChange={handleChange}
                      />
                      {error &&
                      (darshanBookingFormObj.offlinePujaPrice === null ||
                        darshanBookingFormObj.offlinePujaPrice === undefined ||
                        darshanBookingFormObj.offlinePujaPrice === '') ? (
                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                      ) : (
                        ''
                      )}
                    </div>
                  )} */}

                    {/* {modelRequestData?.pujaSubServiceID === 6 && (
                    <div className="col-md-6 mb-3">
                      <label htmlFor="offlinePujaPrice" className="form-label">
                        Puja Price <span className="text-danger">*</span>
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        id="offlinePujaPrice"
                        placeholder="Enter Puja Price"
                        value={darshanBookingFormObj.offlinePujaPrice}
                        onChange={handleChange}
                      />
                      {error &&
                      (darshanBookingFormObj.offlinePujaPrice === null ||
                        darshanBookingFormObj.offlinePujaPrice === undefined ||
                        darshanBookingFormObj.offlinePujaPrice === '') ? (
                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                      ) : (
                        ''
                      )}
                    </div>
                  )} */}

                    {/* {convenienceFee} */}
                    {/* <div className="col-md-6 mb-3">
                    <label htmlFor="convenienceFee" className="form-label">
                      Convenience Fee <span className="text-danger">*</span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      id="convenienceFee"
                      placeholder="Enter Convenience Fee "
                      value={darshanBookingFormObj.convenienceFee}
                      onChange={handleChange}
                    />
                    {error &&
                    (darshanBookingFormObj.convenienceFee === null ||
                      darshanBookingFormObj.convenienceFee === undefined ||
                      darshanBookingFormObj.convenienceFee === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div> */}
                    {/* {wetSamagriPrice } */}
                    {/* <div className="col-md-6 mb-3">
                    <label htmlFor="wetSamagriPrice" className="form-label">
                      Wet Samagri Price <span className="text-danger">*</span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      id="wetSamagriPrice"
                      placeholder="Enter Wet Samagri Price"
                      value={darshanBookingFormObj.wetSamagriPrice}
                      onChange={handleChange}
                    />
                    {error &&
                    (darshanBookingFormObj.wetSamagriPrice === null ||
                      darshanBookingFormObj.wetSamagriPrice === undefined ||
                      darshanBookingFormObj.wetSamagriPrice === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div> */}

                    {/* {Dry Samagri Price } */}
                    {/* <div className="col-md-6 mb-3">
                    <label htmlFor="drySamagriPrice" className="form-label">
                      Dry Samagri Price <span className="text-danger">*</span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      id="drySamagriPrice"
                      placeholder="Enter Dry Samagri Price"
                      value={darshanBookingFormObj.drySamagriPrice}
                      onChange={handleChange}
                    />
                    {error &&
                    (darshanBookingFormObj.drySamagriPrice === null ||
                      darshanBookingFormObj.drySamagriPrice === undefined ||
                      darshanBookingFormObj.drySamagriPrice === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div> */}

                    {/* {Discount } */}
                    {/* <div className="col-md-6 mb-3">
                    <label htmlFor="pujaDiscount" className="form-label">
                      Discount
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      id="pujaDiscount"
                      placeholder="Enter Discount"
                      value={darshanBookingFormObj.pujaDiscount}
                      onChange={handleChange}
                    />
                  </div> */}

                    {/* Slug */}
                    {/* <div className="col-md-6 mb-3">
                    <label htmlFor="pujaSlug" className="form-label">
                      Slug <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="pujaSlug" // <- changed
                      name="slug"
                      placeholder="Enter Temple Slug"
                      value={darshanBookingFormObj?.pujaSlug} // fallback to avoid uncontrolled input
                      onChange={handleChange}
                    />
                    {error && (darshanBookingFormObj.pujaSlug === null || darshanBookingFormObj.pujaSlug === undefined || darshanBookingFormObj.pujaSlug === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div> */}

                    {/* Meta Title */}
                    {/* <div className="col-md-6 mb-3">
                    <label htmlFor="metaTitle" className="form-label">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="metaTitle"
                      placeholder="Enter Meta Title"
                      value={darshanBookingFormObj?.metaTitle}
                      onChange={handleChange}
                    />
                  </div> */}

                    {/* Meta Description */}
                    {/* <div className="col-md-6 mb-3">
                    <label htmlFor="metaDescription" className="form-label">
                      Meta Description
                    </label>
                    <textarea
                      type="text"
                      className="form-control"
                      id="metaDescription"
                      placeholder="Enter Meta Description"
                      value={darshanBookingFormObj?.metaDescription}
                      onChange={handleChange}
                    />
                  </div> */}

                    {/* Canonical Tag */}
                    {/* <div className="col-md-6 mb-3">
                    <label htmlFor="canonicalTag" className="form-label">
                      Canonical Tag
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="canonicalTag"
                      placeholder="Enter Canonical Tag"
                      value={darshanBookingFormObj?.canonicalTag}
                      onChange={handleChange}
                    />
                  </div> */}

                    {/* Extra Meta Tag */}
                    {/* <div className="col-md-6 mb-3">
                    <label htmlFor="extraMetaTag" className="form-label">
                      Extra Meta Tag
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="extraMetaTag"
                      placeholder="Enter Extra Meta Tag"
                      value={darshanBookingFormObj?.extraMetaTag}
                      onChange={handleChange}
                    />
                  </div> */}

                    {/* Open Graph Tag */}
                    {/* <div className="col-md-6 mb-3">
                    <label htmlFor="openGraphTag" className="form-label">
                      Open Graph Tag
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="openGraphTag"
                      placeholder="Enter Open Graph Tag"
                      value={darshanBookingFormObj?.openGraphTag}
                      onChange={handleChange}
                    />
                  </div> */}
                  </>
                )}

                {/* {modelRequestData?.moduleName !== 'LanguageWiseList' && (
                <div className="col-md-12 mb-3">
                  <div className="mb-3 position-relative">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label htmlFor="imageUpload" className="form-label ">
                        Puja Image
                        <span className="text-danger">*</span>
                      </label>
                    </div>
                    <div
                      className="position-relative d-flex align-items-center justify-content-center w-100 border rounded"
                      style={{ height: '12rem' }}
                    >
                      {filePreview ? (
                        <>
                          <button
                            onClick={handleRemoveImage}
                            style={{
                              padding: '3px 10px',
                              position: 'absolute',
                              top: '5px',
                              right: '5px',
                              border: 'none',
                              outline: 'none',
                              zIndex: '20',
                              background: 'transparent',
                              fontSize: '20px',
                              cursor: 'pointer',
                              color: 'black'
                            }}
                          >
                            <i className="fas fa-times"></i>
                          </button>

                          <img
                            style={{ objectFit: 'contain' }}
                            src={filePreview}
                            alt="Preview"
                            className="position-absolute top-0 start-0 w-100 h-100 border border-secondary rounded"
                          />
                        </>
                      ) : (
                        <label htmlFor="custom-pujaCategoryImage" className="cursor-pointer text-center">
                          <img
                            src={CustomUploadImg} 
                            alt="upload_img"
                            className="d-block mx-auto"
                            style={{ height: '5rem' }}
                          />
                          <span>Upload image</span>
                        </label>
                      )}

          
                      <input
                        type="file"
                        id="custom-pujaCategoryImage"
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
                          display: 'block',
                          fontWeight: '500',
                          fontSize: '0.8rem'
                        }}
                      >
                        Supported file types are .jpg, .jpeg, .png up to a file size of 2MB.
                      </span>
                    ) : (
                      ''
                    )}

                    {error && (selectedFile === null || selectedFile === '' || selectedFile === undefined) && (
                      <span className="text-danger small mx-3">{ERROR_MESSAGES}</span>
                    )}
                  </div>
                </div>
              )} */}

                {/* <div className="col-md-12 mb-3">
                <label htmlFor="canonicalTag" className="form-label">
                  Puja Details<span className="text-danger">*</span>
                </label>
                <Text_Editor editorState={darshanBookingFormObj?.pujaDetails} handleContentChange={handlePujaDetailsDescriptionChange} />
                {error && (darshanBookingFormObj.pujaDetails === null || darshanBookingFormObj.pujaDetails === undefined || darshanBookingFormObj.pujaDetails === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div> */}

                {/*  Short Description */}
                {/* <div className="col-md-12 mb-3">
                <label htmlFor="shortDescription" className="form-label">
                  Short Description<span className="text-danger">*</span>
                </label>
                <Text_Editor editorState={darshanBookingFormObj?.shortDescription} handleContentChange={handleShortDescriptionChange} />
                {error &&
                (darshanBookingFormObj.shortDescription === null ||
                  darshanBookingFormObj.shortDescription === undefined ||
                  darshanBookingFormObj.shortDescription === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div> */}

                {/* Puja Samagri */}
                {/* <div className="col-md-12 mb-3">
                <label htmlFor="pujaSamagri" className="form-label">
                  Puja Samagri<span className="text-danger">*</span>
                </label>
                <Text_Editor editorState={darshanBookingFormObj?.pujaSamagri} handleContentChange={handlePujaSamagriChange} />
                {error && (darshanBookingFormObj.pujaSamagri === null || darshanBookingFormObj.pujaSamagri === undefined || darshanBookingFormObj.pujaSamagri === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div> */}

                {/* Key Features */}
                {/* <div className="col-md-12 mb-3">
                <label htmlFor="keyFeature" className="form-label">
                  Key Features<span className="text-danger">*</span>
                </label>
                <Text_Editor editorState={darshanBookingFormObj?.keyFeature} handleContentChange={handleKeyFeaturesChange} />
                {error && (darshanBookingFormObj.keyFeature === null || darshanBookingFormObj.keyFeature === undefined || darshanBookingFormObj.keyFeature === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div> */}
              </div>
            </fieldset>
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

export default AddUpdateDarshanbookModal;
