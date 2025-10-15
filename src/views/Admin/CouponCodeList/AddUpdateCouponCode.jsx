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
import { ApplicableForOption, CouponTypeOptions, PujaTypeIDOption } from 'Middleware/Utils';
import { GetPujaCategoryLookupList } from 'services/Pooja Category/PoojaCategoryApi';
import { GetAppLanguageLookupList } from 'services/Admin/AppLangauge/AppLanguageApi';
import { AddUpdatePuja, GetPujaModel } from 'services/Admin/Puja/PujaApi';
import CustomUploadImg from '../../../assets/images/upload_img.jpg';
import { UploadImage } from 'services/Upload Cloud-flare Image/UploadCloudflareImageApi';
import { AddUpdateProductCatAPI, GetProductCatModalAPI } from 'services/Admin/EStoreAPI/ProductCatAPI';
import { AddUpdateFAQAPI, GetFAQModalAPI, GetServiceTypeLookupList, GetSubServiceTypeLookupList } from 'services/Admin/FAQAPI/FAQAPI';
import { GetUserLookupList } from 'services/Admin/UserWalletAPI/UserWalletAPI';
import { AddUpdateCouponCodeAPI, GetCouponCodeModalAPI } from 'services/Admin/CouponCodeAPI/CouponCodeAPI';

const AddUpdateCouponCodeModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
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
  const [serviceTypeList, setServiceTypeList] = useState([]);
  const [subServiceTypeList, setSubServiceTypeList] = useState([]);

  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sizeError, setSizeError] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [actionMassage, setActionMassage] = useState(null);

  const [heading, setHeading] = useState('Puja');
  const [userList, setUserList] = useState([]);

  const [formObj, setFormObj] = useState({
    couponCode: null,
    startDate: null,
    endDate: null,
    countUsage: null,
    couponTypeID: null,
    couponAmount: null,
    description: null,
    applicableForID: null,
    serviceID: null,
    subServiceID: null,
    selectedUserListID: [],
    appLangID: null
  });

  useEffect(() => {
    if (show) {
      //   isPageRender();
      //   GetPujaCategoryLookupListData();
      GetAppLanguageLookupListData();
      GetServiceLookupListData();
      GetUserLookupListData();
      //   GetSubServiceLookupListData();
      if (modelRequestData?.Action === 'update' && modelRequestData?.couponCodeKeyID !== null && modelRequestData?.couponCodeKeyID !== '') {
        GetModelData();
      }
    }
  }, [show]);

  //   const isPageRender = () => {
  //     if (modelRequestData?.pujaSubServiceID === 5) {
  //       setHeading('Pandit Puja');
  //     } else if (modelRequestData?.pujaSubServiceID === 6) {
  //       setHeading('Daily Pandit Puja');
  //     } else if (modelRequestData?.pujaSubServiceID === 1) {
  //       setHeading('Remedy Puja');
  //     } else if (modelRequestData?.pujaSubServiceID === 2) {
  //       setHeading('Homam Puja');
  //     } else if (modelRequestData?.pujaSubServiceID === 3) {
  //       setHeading('Subscription Remedy Puja');
  //     } else if (modelRequestData?.pujaSubServiceID === 4) {
  //       setHeading('Subscription Homam Puja');
  //     }
  //   };

  const convertToDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day); // JS months start from 0
  };

  const GetModelData = async () => {
    // debugger;
    setLoader(true);
    try {
      const response = await GetCouponCodeModalAPI(modelRequestData?.couponCodeKeyID);

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const List = response.data.responseData.data;
            setFormObj((prev) => ({
              ...prev,
              couponCode: List.couponCode,
              startDate: convertToDate(List.startDate),
              endDate: convertToDate(List.endDate),
              countUsage: List.maxUsageCount,
              couponTypeID: List.couponTypeID,
              couponAmount: String(List.coupenAmount),
              description: List.description,
              applicableForID: List.applicableForID,
              serviceID: List.serviceID,
              subServiceID: List.subServiceID,
              selectedUserListID: List.userID,
              appLangID: List.appLangID
            }));
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

  //   const GetPujaCategoryLookupListData = async () => {
  //     try {
  //       const response = await GetPujaCategoryLookupList(); // Ensure it's correctly imported

  //       if (response?.data?.statusCode === 200) {
  //         const languageLookupList = response.data.responseData.data || [];

  //         const formattedLangList = languageLookupList.map((Lang) => ({
  //           value: Lang.pujaCategoryID,
  //           label: Lang.pujaCategoryName
  //         }));

  //         setPujaCategoryOption(formattedLangList);
  //       } else {
  //         console.error('Failed to fetch sim Type lookup list:', response?.data?.statusMessage || 'Unknown error');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching sim Type lookup list:', error);
  //     }
  //   };

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
  const GetServiceLookupListData = async () => {
    try {
      const response = await GetServiceTypeLookupList(); // Ensure it's correctly imported

      if (response?.data?.statusCode === 200) {
        const list = response?.data?.responseData?.data || [];

        const formattedLangList = list.map((Lang) => ({
          value: Lang.serviceTypeID,
          label: Lang.serviceTypeName
        }));

        setServiceTypeList(formattedLangList);
      } else {
        console.error('Failed to fetch sim Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching sim Type lookup list:', error);
    }
  };
  const GetSubServiceLookupListData = async (serviceID) => {
    try {
      const response = await GetSubServiceTypeLookupList(serviceID); // Ensure it's correctly imported

      if (response?.data?.statusCode === 200) {
        const list = response?.data?.responseData?.data || [];

        const formattedLangList = list.map((Lang) => ({
          value: Lang.subServiceID,
          label: Lang.name
        }));

        setSubServiceTypeList(formattedLangList);
      } else {
        console.error('Failed to fetch sim Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching sim Type lookup list:', error);
    }
  };

  const setDataInitial = () => {
    setFormObj((prev) => ({
      ...prev,
      couponCode: null,
      startDate: null,
      endDate: null,
      countUsage: null,
      couponTypeID: null,
      couponAmount: null,
      description: null,
      applicableForID: null,
      serviceID: null,
      subServiceID: null,
      selectedUserListID: [],
      appLangID: null
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
      formObj.couponCode === null ||
      formObj.couponCode === undefined ||
      formObj.couponCode === '' ||
      formObj.startDate === null ||
      formObj.startDate === undefined ||
      formObj.startDate === '' ||
      formObj.endDate === null ||
      formObj.endDate === undefined ||
      formObj.endDate === '' ||
      formObj.countUsage === null ||
      formObj.countUsage === undefined ||
      formObj.countUsage === '' ||
      formObj.couponTypeID === null ||
      formObj.couponTypeID === undefined ||
      formObj.couponTypeID === '' ||
      formObj.couponAmount === null ||
      formObj.couponAmount === undefined ||
      formObj.couponAmount === '' ||
      formObj.description === null ||
      formObj.description === undefined ||
      formObj.description === '' ||
      formObj.applicableForID === null ||
      formObj.applicableForID === undefined ||
      formObj.applicableForID === ''
    ) {
      setError(true);
      isValid = false;
    } else if (formObj.applicableForID === 2 && formObj.selectedUserListID.length === 0) {
      setError(true);
      isValid = false;
    } else if (
      formObj.applicableForID === 3 &&
      (formObj.serviceID === null ||
        formObj.serviceID === undefined ||
        formObj.serviceID === '' ||
        formObj.subServiceID === null ||
        formObj.subServiceID === undefined ||
        formObj.subServiceID === '')
    ) {
      setError(true);
      isValid = false;
    }

    const apiParam = {
      adminID: user?.admiN_ID,
      couponCodeKeyID: modelRequestData.couponCodeKeyID,
      couponCode: formObj.couponCode,
      startDate: formObj.startDate,
      endDate: formObj.endDate,
      maxUsageCount: formObj.countUsage,
      couponTypeID: formObj.couponTypeID,
      coupenAmount: formObj.couponAmount,
      description: formObj.description,
      applicableForID: formObj.applicableForID,
      pujaServiceID: formObj.serviceID,
      pujaSubServiceID: formObj.subServiceID,
      userID: formObj.selectedUserListID
    };

    if (isValid) {
      AddUpdateCouponCodeData(apiParam);
    }
  };

  const AddUpdateCouponCodeData = async (ApiParam) => {
    setLoader(true);
    try {
      const response = await AddUpdateCouponCodeAPI(ApiParam);
      if (response?.data?.statusCode === 200) {
        setLoader(false);
        setActionMassage(modelRequestData.Action === null ? `Coupon Code added successfully.` : `Coupon Code updated successfully.`);
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
    setFormObj((prev) => ({ ...prev, pujaSlug: slug }));
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
        value = formObj?.pujaDiscount || '';
      }
    }
    if (id === 'metaTitle' || id === 'metaDescription' || id === 'canonicalTag' || id === 'extraMetaTag' || id === 'openGraphTag') {
      value = value.replace(/^\s+/, '');
    }

    setFormObj((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handlePujaDetailsDescriptionChange = (htmlContent) => {
    // Strip HTML tags and check if anything meaningful remains
    const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

    setFormObj((obj) => ({
      ...obj,
      pujaDetails: strippedContent === '' ? null : htmlContent
    }));
  };
  const handleShortDescriptionChange = (htmlContent) => {
    // Strip HTML tags and check if anything meaningful remains
    const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

    setFormObj((obj) => ({
      ...obj,
      shortDescription: strippedContent === '' ? null : htmlContent
    }));
  };
  const handlePujaSamagriChange = (htmlContent) => {
    // Strip HTML tags and check if anything meaningful remains
    const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

    setFormObj((obj) => ({
      ...obj,
      pujaSamagri: strippedContent === '' ? null : htmlContent
    }));
  };
  const handleKeyFeaturesChange = (htmlContent) => {
    // Strip HTML tags and check if anything meaningful remains
    const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

    setFormObj((obj) => ({
      ...obj,
      keyFeature: strippedContent === '' ? null : htmlContent
    }));
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

  const handleStartDateChange = (newValue) => {
    if (dayjs(newValue).isValid()) {
      const newToDate = dayjs(newValue).format('YYYY-MM-DD');
      setFormObj((prev) => ({ ...prev, startDate: newToDate }));
    } else {
      setFormObj((prev) => ({ ...prev, startDate: null }));
    }
  };

  const handleEndDateChange = (newValue) => {
    if (dayjs(newValue).isValid()) {
      const newToDate = dayjs(newValue).format('YYYY-MM-DD');
      setFormObj((prev) => ({ ...prev, endDate: newToDate }));
    } else {
      setFormObj((prev) => ({ ...prev, endDate: null }));
    }
  };

  const GetUserLookupListData = async () => {
    try {
      const response = await GetUserLookupList(); // Ensure it's correctly imported

      if (response?.data?.statusCode === 200) {
        const languageLookupList = response.data.responseData.data || [];

        const formattedLangList = languageLookupList.map((Lang) => ({
          value: Lang.userID,
          label: Lang.userName
        }));

        setUserList(formattedLangList);
      } else {
        console.error('Failed to fetch sim Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching sim Type lookup list:', error);
    }
  };
  return (
    <>
      <Modal style={{ zIndex: 1300 }} size="lg" show={show} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <h4 className="text-center">{modelRequestData?.Action === null ? `Add Coupon Code` : `Update Coupon Code`}</h4>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
          <div className="container-fluid ">
            <div className="row">
              {/* Coupon Code */}
              <div className="col-md-6 mb-3">
                <label htmlFor="pujaName" className="form-label">
                  Coupon Code <span className="text-danger">*</span>
                </label>
                <input
                  maxLength={90}
                  type="text"
                  className="form-control"
                  id="catName"
                  placeholder="Enter Coupon Code"
                  aria-describedby="Employee"
                  value={formObj.couponCode}
                  onChange={(e) => {
                    let input = e.target.value;
                    if (input.startsWith(' ')) {
                      input = input.trimStart();
                    }

                    setFormObj((prev) => ({
                      ...prev,
                      couponCode: input
                    }));
                  }}
                />
                {error && (formObj.couponCode === null || formObj.couponCode === undefined || formObj.couponCode === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

              {/* Start Date */}
              <div className="col-md-6 col-sm-12 mb-2 d-flex flex-column form-font-size">
                <label htmlFor="bookingDate" style={{ textAlign: 'left' }}>
                  Start Date<span style={{ color: 'red' }}>*</span>
                </label>
                <DatePicker
                  id="date"
                  value={formObj?.startDate || ''}
                  clearIcon={null}
                  onChange={handleStartDateChange}
                  format="dd/MM/yyyy"
                  className="custom-date-picker"
                />

                {error && !formObj?.startDate && (
                  <span className="error-msg" style={{ color: 'red' }}>
                    {ERROR_MESSAGES}
                  </span>
                )}
              </div>

              {/* End Date */}
              <div className="col-md-6 col-sm-12 mb-2 d-flex flex-column form-font-size">
                <label htmlFor="bookingDate" style={{ textAlign: 'left' }}>
                  End Date<span style={{ color: 'red' }}>*</span>
                </label>
                <DatePicker
                  id="date"
                  value={formObj?.endDate || ''}
                  clearIcon={null}
                  onChange={handleEndDateChange}
                  format="dd/MM/yyyy"
                  className="custom-date-picker"
                />

                {error && !formObj?.endDate && (
                  <span className="error-msg" style={{ color: 'red' }}>
                    {ERROR_MESSAGES}
                  </span>
                )}
              </div>

              {/* Max Usage Count */}
              <div className="col-md-6 mb-3">
                <label htmlFor="pujaName" className="form-label">
                  Max Usage Count <span className="text-danger">*</span>
                </label>
                <input
                  maxLength={90}
                  type="text"
                  className="form-control"
                  id="catName"
                  placeholder="Enter Max Usage Count"
                  aria-describedby="Employee"
                  value={formObj.countUsage}
                  onChange={(e) => {
                    let input = e.target.value;
                    if (input.startsWith(' ')) {
                      input = input.trimStart();
                    }

                    setFormObj((prev) => ({
                      ...prev,
                      countUsage: input
                    }));
                  }}
                />
                {error && (formObj.countUsage === null || formObj.countUsage === undefined || formObj.countUsage === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

              {/* Coupon Type */}
              <div className="col-md-6 mb-3">
                <label htmlFor="stateID" className="form-label">
                  Select Coupon Type <span className="text-danger">*</span>
                </label>
                <Select
                  options={CouponTypeOptions}
                  value={CouponTypeOptions?.filter((v) => v?.value === formObj?.couponTypeID)}
                  onChange={(selectedOption) => {
                    setFormObj((prev) => ({
                      ...prev,
                      couponTypeID: selectedOption ? selectedOption.value : null
                    }));
                  }}
                  menuPlacement="auto"
                  menuPosition="fixed"
                />
                {error && !formObj?.couponTypeID && <span className="text-danger">{ERROR_MESSAGES}</span>}
              </div>

              {/* Coupon Amount */}
              <div className="col-md-6 mb-3">
                <label htmlFor="pujaName" className="form-label">
                  Coupon Amount <span className="text-danger">*</span>
                </label>
                <input
                  maxLength={90}
                  type="text"
                  className="form-control"
                  id="catName"
                  placeholder="Enter Coupon Amount"
                  aria-describedby="Employee"
                  value={formObj.couponAmount}
                  onChange={(e) => {
                    let input = e.target.value;
                    if (input.startsWith(' ')) {
                      input = input.trimStart();
                    }

                    setFormObj((prev) => ({
                      ...prev,
                      couponAmount: input
                    }));
                  }}
                />
                {error && (formObj.couponAmount === null || formObj.couponAmount === undefined || formObj.couponAmount === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

              {/* Description */}
              <div className="col-md-6 mb-3">
                <label htmlFor="pujaName" className="form-label">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  maxLength={90}
                  type="text"
                  className="form-control"
                  id="catName"
                  placeholder="Enter Description"
                  aria-describedby="Employee"
                  value={formObj.description}
                  onChange={(e) => {
                    let input = e.target.value;
                    if (input.startsWith(' ')) {
                      input = input.trimStart();
                    }

                    setFormObj((prev) => ({
                      ...prev,
                      description: input
                    }));
                  }}
                />
                {error && (formObj.description === null || formObj.description === undefined || formObj.description === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

              {/* Applicable For */}
              <div className="col-md-6 mb-3">
                <label htmlFor="stateID" className="form-label">
                  Applicable For <span className="text-danger">*</span>
                </label>
                <Select
                  options={ApplicableForOption}
                  value={ApplicableForOption?.filter((v) => v?.value === formObj?.applicableForID)}
                  onChange={(selectedOption) => {
                    setFormObj((prev) => ({
                      ...prev,
                      applicableForID: selectedOption ? selectedOption.value : null
                    }));
                  }}
                  menuPlacement="auto"
                  menuPosition="fixed"
                />
                {error && !formObj?.applicableForID && <span className="text-danger">{ERROR_MESSAGES}</span>}
              </div>

              {formObj.applicableForID === 3 && (
                <>
                  {/* Select Service */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="stateID" className="form-label">
                      Select Service <span className="text-danger">*</span>
                    </label>
                    <Select
                      options={serviceTypeList}
                      value={serviceTypeList?.filter((v) => v?.value === formObj?.serviceID)}
                      onChange={(selectedOption) => {
                        setFormObj((prev) => ({
                          ...prev,
                          serviceID: selectedOption ? selectedOption.value : null
                        }));
                        GetSubServiceLookupListData(selectedOption.value);
                      }}
                      menuPlacement="auto"
                      menuPosition="fixed"
                    />
                    {error && !formObj?.serviceID && <span className="text-danger">{ERROR_MESSAGES}</span>}
                  </div>

                  {/* Select Sub Service */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="stateID" className="form-label">
                      Select Sub Service <span className="text-danger">*</span>
                    </label>
                    <Select
                      options={subServiceTypeList}
                      value={subServiceTypeList?.filter((v) => v?.value === formObj?.subServiceID)}
                      onChange={(selectedOption) => {
                        setFormObj((prev) => ({
                          ...prev,
                          subServiceID: selectedOption ? selectedOption.value : null
                        }));
                      }}
                      menuPlacement="auto"
                      menuPosition="fixed"
                    />
                    {error && !formObj?.subServiceID && <span className="text-danger">{ERROR_MESSAGES}</span>}
                  </div>
                </>
              )}

              {/* Users */}
              {formObj.applicableForID === 2 && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="pujaCategoryID" className="form-label">
                    Select Users <span className="text-danger">*</span>
                  </label>
                  <Select
                    id="templeID"
                    options={userList}
                    value={userList.filter((item) => formObj.selectedUserListID?.includes(item.value))}
                    onChange={(selectedOptions) =>
                      setFormObj((prev) => ({
                        ...prev,
                        selectedUserListID: selectedOptions ? selectedOptions.map((opt) => opt.value) : []
                      }))
                    }
                    menuPlacement="auto"
                    menuPosition="fixed"
                    isMulti
                  />
                  {error && formObj.selectedUserListID.length === 0 ? <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span> : ''}
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
      </Modal>
      <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={actionMassage} />
      <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
    </>
  );
};

export default AddUpdateCouponCodeModal;
