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
import { AddUpdatePuja, GetPujaLookupList, GetPujaModel } from 'services/Admin/Puja/PujaApi';
import CustomUploadImg from '../../../assets/images/upload_img.jpg';
import { UploadImage } from 'services/Upload Cloud-flare Image/UploadCloudflareImageApi';
import { AddUpdateProductCatAPI, GetProductCatModalAPI } from 'services/Admin/EStoreAPI/ProductCatAPI';
import { AddUpdateBannerAPI, GetBannerModalAPI } from 'services/Admin/BannerAPI/BannerAPI';
import { GetServiceTypeLookupList, GetSubServiceTypeLookupList } from 'services/Admin/FAQAPI/FAQAPI';
import { GetPujaServiceTypeLookupList, GetPujaSubServiceTypeLookupList, GetPujaTypeLookupList } from 'services/Admin/MasterAPI/MasterAPI';

const AddUpdateBannerModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
  const { setLoader, user } = useContext(ConfigContext);

  const [error, setError] = useState(false);
  const [customError, setCustomError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [languageList, setLanguageList] = useState([]);
  const [serviceTypeList, setServiceTypeList] = useState([]);
  const [subServiceTypeList, setSubServiceTypeList] = useState([]);
  const [pujaLookupList, setPujaLookupList] = useState([]);

  const [filePreview, setFilePreview] = useState(null);
  const [webFilePreview, setWebFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [webSelectedFile, setWebSelectedFile] = useState(null);
  const [sizeError, setSizeError] = useState('');
  const [webSizeError, setWebSizeError] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [webUploadedImageUrl, setWebUploadedImageUrl] = useState(null);
  const [actionMassage, setActionMassage] = useState(null);

  const [formObj, setFormObj] = useState({
    bannerName: null,
    heading: null,
    subHeading: null,
    // CTAUrl: null,
    CTAName: null,
    serviceID: null,
    subServiceID: null,
    pujaModuleID: null
  });

  useEffect(() => {
    if (show) {
      //   isPageRender();
      GetPujaServiceLookupListData();
      GetAppLanguageLookupListData();
      //   GetTempleLookupListData();
      if (modelRequestData?.Action === 'update' && modelRequestData?.bannerKeyID !== null && modelRequestData?.bannerKeyID !== '') {
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

  const GetModelData = async () => {
    setLoader(true);
    try {
      const response = await GetBannerModalAPI(modelRequestData?.bannerKeyID);

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const List = response.data.responseData.data;
            setFormObj((prev) => ({
              ...prev,
              bannerName: List.bannerName,
              heading: List.header1,
              subHeading: List.header2,
              CTAName: List.ctaName,
              serviceID: List.pujaServiceID,
              subServiceID: List.pujaSubServiceID,
              pujaModuleID: List.moduleID
            }));
            setFilePreview(List.bannerImage);
            setUploadedImageUrl(List.bannerImage);
            setWebFilePreview(List.webImage);
            setWebUploadedImageUrl(List.webImage);
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

  const GetPujaServiceLookupListData = async () => {
    try {
      const response = await GetPujaServiceTypeLookupList(); // Ensure it's correctly imported

      if (response?.data?.statusCode === 200) {
        const list = response?.data?.responseData?.data || [];

        const formattedLangList = list.map((Lang) => ({
          value: Lang.pujaServiceID,
          label: Lang.pujaServiceName
        }));

        setServiceTypeList(formattedLangList);
      } else {
        console.error('Failed to fetch sim Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching sim Type lookup list:', error);
    }
  };
  const GetPujaSubServiceLookupListData = async (serviceID) => {
    try {
      const response = await GetPujaSubServiceTypeLookupList(serviceID); // Ensure it's correctly imported

      if (response?.data?.statusCode === 200) {
        const list = response?.data?.responseData?.data || [];

        const formattedLangList = list.map((Lang) => ({
          value: Lang.pujaSubServiceID,
          label: Lang.pujaSubServiceName
        }));

        setSubServiceTypeList(formattedLangList);
      } else {
        console.error('Failed to fetch sim Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching sim Type lookup list:', error);
    }
  };
  const GetPujaLookupListData = async (serviceID, subServiceID) => {
    // debugger;
    try {
      const response = await GetPujaTypeLookupList({
        pujaCatKeyID: null,
        applangID: null,
        pujaServiceID: serviceID,
        pujaSubServiceID: subServiceID,
        templeID: null
      });

      if (response?.data?.statusCode === 200) {
        const list = response?.data?.responseData?.data || [];

        const formattedLangList = list.map((Lang) => ({
          value: Lang.pujaID,
          label: Lang.pujaName
        }));

        setPujaLookupList(formattedLangList);
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
    setSelectedFile(null);
    setFilePreview(null);
    setWebSelectedFile(null);
    setWebFilePreview(null);
    setFormObj((prev) => ({
      ...prev,
      bannerName: null,
      heading: null,
      subHeading: null,
      // CTAUrl: null,
      CTAName: null,
      serviceID: null,
      subServiceID: null,
      pujaModuleID: null
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
    let isValid = true;
    if (
      uploadedImageUrl === null ||
      uploadedImageUrl === undefined ||
      uploadedImageUrl === '' ||
      webUploadedImageUrl === null ||
      webUploadedImageUrl === undefined ||
      webUploadedImageUrl === '' ||
      formObj.bannerName === null ||
      formObj.bannerName === undefined ||
      formObj.bannerName === '' ||
      formObj.heading === null ||
      formObj.heading === undefined ||
      formObj.heading === '' ||
      formObj.subHeading === null ||
      formObj.subHeading === undefined ||
      formObj.subHeading === '' ||
      formObj.CTAName === null ||
      formObj.CTAName === undefined ||
      formObj.CTAName === ''
      // formObj.CTAUrl === null ||
      // formObj.CTAUrl === undefined ||
      // formObj.CTAUrl === ''
    ) {
      setError(true);
      isValid = false;
    } else if (formObj.CTAUrl && !isValidURL(formObj.CTAUrl)) {
      setError(true);
      isValid = false;
    }

    const apiParam = {
      adminID: user?.admiN_ID,
      bannerKeyID: modelRequestData.bannerKeyID ? modelRequestData.bannerKeyID : null,
      appLangID: null,
      bannerName: formObj.bannerName,
      bannerImage: uploadedImageUrl,
      bannerLink: 'Test banner Link',
      webImage: webUploadedImageUrl,
      header1: formObj.heading,
      header2: formObj.subHeading,
      ctaUrl: formObj.CTAUrl,
      ctaName: formObj.CTAName,
      pujaServiceID: formObj.serviceID,
      pujaSubServiceID: formObj.subServiceID,
      moduleID: formObj.pujaModuleID
    };

    if (isValid) {
      AddUpdateBannerData(apiParam);
    }
  };

  const AddUpdateBannerData = async (ApiParam) => {
    setLoader(true);
    try {
      const response = await AddUpdateBannerAPI(ApiParam);
      if (response?.data?.statusCode === 200) {
        setLoader(false);
        setActionMassage(modelRequestData.Action === null ? `Banner added successfully.` : `Banner updated successfully.`);
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

  const handleWebImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Allowed types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setWebSizeError('Only JPG, JPEG, PNG files are allowed.');
      return;
    }

    // Size check (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      setWebSizeError('File size must be less than 10 MB.');
      return;
    }

    setWebSizeError('');
    setWebSelectedFile(file);

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setWebFilePreview(reader.result);
    reader.readAsDataURL(file);

    // Automatically upload after selecting
    handleWebApiCall(file);
  };

  const handleRemoveImage = () => {
    setFilePreview(null);
    setSelectedFile(null);
    setUploadedImageUrl('');
  };

  const handleWebRemoveImage = () => {
    setWebFilePreview(null);
    setWebSelectedFile(null);
    setWebUploadedImageUrl('');
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

  const handleWebApiCall = async (file) => {
    setLoader(true);
    const formData = new FormData();
    formData.append('File', file);

    try {
      const response = await UploadImage(formData);
      const webUploadedImageUrl = response?.data?.url ?? response?.data?.data?.url ?? null;

      if (response?.status === 200 && webUploadedImageUrl) {
        setWebUploadedImageUrl(webUploadedImageUrl);
        console.log('Uploaded Image URL:', webUploadedImageUrl);
      } else {
        console.warn('Upload succeeded but no URL found:', response?.data);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoader(false);
    }
  };

  const isValidURL = (url) => {
    if (!url) return false;

    const pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/i;

    return pattern.test(url.trim());
  };

  return (
    <>
      <Modal style={{ zIndex: 1300 }} size="lg" show={show} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <h4 className="text-center">{modelRequestData?.Action === null ? `Add Banner` : `Update Banner`}</h4>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
          <div className="container-fluid ">
            <div className="row">
              {/* Banner Name */}
              <div className="col-md-6 mb-3">
                <label htmlFor="pujaName" className="form-label">
                  Banner Name <span className="text-danger">*</span>
                </label>
                <input
                  maxLength={90}
                  type="text"
                  className="form-control"
                  id="catName"
                  placeholder="Enter Banner Name"
                  aria-describedby="Employee"
                  value={formObj.bannerName}
                  onChange={(e) => {
                    let input = e.target.value;
                    if (input.startsWith(' ')) {
                      input = input.trimStart();
                    }

                    setFormObj((prev) => ({
                      ...prev,
                      bannerName: input
                    }));
                  }}
                />
                {error && (formObj.bannerName === null || formObj.bannerName === undefined || formObj.bannerName === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

              {/* Heading */}
              <div className="col-md-6 mb-3">
                <label htmlFor="pujaName" className="form-label">
                  Heading <span className="text-danger">*</span>
                </label>
                <input
                  maxLength={90}
                  type="text"
                  className="form-control"
                  id="catName"
                  placeholder="Enter Heading"
                  aria-describedby="Employee"
                  value={formObj.heading}
                  onChange={(e) => {
                    let input = e.target.value;
                    if (input.startsWith(' ')) {
                      input = input.trimStart();
                    }

                    setFormObj((prev) => ({
                      ...prev,
                      heading: input
                    }));
                  }}
                />
                {error && (formObj.heading === null || formObj.heading === undefined || formObj.heading === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

              {/* Sub Heading */}
              <div className="col-md-6 mb-3">
                <label htmlFor="pujaName" className="form-label">
                  Sub Heading <span className="text-danger">*</span>
                </label>
                <input
                  maxLength={90}
                  type="text"
                  className="form-control"
                  id="catName"
                  placeholder="Enter Sub Heading"
                  aria-describedby="Employee"
                  value={formObj.subHeading}
                  onChange={(e) => {
                    let input = e.target.value;
                    if (input.startsWith(' ')) {
                      input = input.trimStart();
                    }

                    setFormObj((prev) => ({
                      ...prev,
                      subHeading: input
                    }));
                  }}
                />
                {error && (formObj.subHeading === null || formObj.subHeading === undefined || formObj.subHeading === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

              {/* CTA Name */}
              <div className="col-md-6 mb-3">
                <label htmlFor="pujaName" className="form-label">
                  CTA Name <span className="text-danger">*</span>
                </label>
                <input
                  maxLength={90}
                  type="text"
                  className="form-control"
                  id="catName"
                  placeholder="Enter CTA Name"
                  aria-describedby="Employee"
                  value={formObj.CTAName}
                  onChange={(e) => {
                    let input = e.target.value;
                    if (input.startsWith(' ')) {
                      input = input.trimStart();
                    }

                    setFormObj((prev) => ({
                      ...prev,
                      CTAName: input
                    }));
                  }}
                />
                {error && (formObj.CTAName === null || formObj.CTAName === undefined || formObj.CTAName === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

              {/* CTA URL */}
              {/* <div className="col-md-6 mb-3">
                <label htmlFor="pujaName" className="form-label">
                  CTA URL <span className="text-danger">*</span>
                </label>
                <input
                  maxLength={90}
                  type="text"
                  className="form-control"
                  id="catName"
                  placeholder="Enter CTA URL"
                  aria-describedby="Employee"
                  value={formObj.CTAUrl}
                  onChange={(e) => {
                    let input = e.target.value.trimStart();

                    // Update state only if the URL is valid or empty (to allow user typing)

                    setFormObj((prev) => ({
                      ...prev,
                      CTAUrl: input
                    }));
                  }}
                />
                {error && (
                  <>
                    {!formObj.CTAUrl || formObj.CTAUrl.trim() === '' ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      !isValidURL(formObj.CTAUrl) && <span style={{ color: 'red' }}>Please enter a valid URL</span>
                    )}
                  </>
                )}
              </div> */}

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
                    setSubServiceTypeList([]);
                    setPujaLookupList([]);
                    GetPujaSubServiceLookupListData(selectedOption.value);
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
                    setPujaLookupList([]);
                    GetPujaLookupListData(formObj.serviceID, selectedOption.value);
                  }}
                  menuPlacement="auto"
                  menuPosition="fixed"
                />
                {error && !formObj?.subServiceID && <span className="text-danger">{ERROR_MESSAGES}</span>}
              </div>

              {/* Select Module */}
              <div className="col-md-6 mb-3">
                <label htmlFor="stateID" className="form-label">
                  Select Module <span className="text-danger">*</span>
                </label>
                <Select
                  options={pujaLookupList}
                  value={pujaLookupList?.filter((v) => v?.value === formObj?.pujaModuleID)}
                  onChange={(selectedOption) => {
                    setFormObj((prev) => ({
                      ...prev,
                      pujaModuleID: selectedOption ? selectedOption.value : null
                    }));
                  }}
                  menuPlacement="auto"
                  menuPosition="fixed"
                />
                {error && !formObj?.pujaModuleID && <span className="text-danger">{ERROR_MESSAGES}</span>}
              </div>

              {/* Banner Image */}
              <div className="col-md-12 mb-3">
                <div className="mb-3 position-relative">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label htmlFor="imageUpload" className="form-label ">
                      App Banner Image
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
                      <label htmlFor="custom-AppImg" className="cursor-pointer text-center">
                        <img src={CustomUploadImg} alt="upload_img" className="d-block mx-auto" style={{ height: '5rem' }} />
                        <span>Upload image</span>
                      </label>
                    )}

                    <input type="file" id="custom-AppImg" accept="image/jpeg, image/png" className="d-none" onChange={handleImageChange} />
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

              {/* Web Image */}
              <div className="col-md-12 mb-3">
                <div className="mb-3 position-relative">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label htmlFor="imageUpload" className="form-label ">
                      Website Banner Image
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <div
                    className="position-relative d-flex align-items-center justify-content-center w-100 border rounded"
                    style={{ height: '12rem' }}
                  >
                    {webFilePreview ? (
                      <>
                        <button
                          onClick={handleWebRemoveImage}
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
                          src={webFilePreview}
                          alt="Preview"
                          className="position-absolute top-0 start-0 w-100 h-100 border border-secondary rounded"
                        />
                      </>
                    ) : (
                      <label htmlFor="custom-WebImage" className="cursor-pointer text-center">
                        <img src={CustomUploadImg} alt="upload_img" className="d-block mx-auto" style={{ height: '5rem' }} />
                        <span>Upload image</span>
                      </label>
                    )}

                    <input
                      type="file"
                      id="custom-WebImage"
                      accept="image/jpeg, image/png"
                      className="d-none"
                      onChange={handleWebImageChange}
                    />
                  </div>

                  {webSizeError ? (
                    <span className="text-danger small mx-3">{webSizeError}</span>
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

                  {error && (webSelectedFile === null || webSelectedFile === '' || webSelectedFile === undefined) && (
                    <span className="text-danger small mx-3">{ERROR_MESSAGES}</span>
                  )}
                </div>
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
      </Modal>
      <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={actionMassage} />
      <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
    </>
  );
};

export default AddUpdateBannerModal;
