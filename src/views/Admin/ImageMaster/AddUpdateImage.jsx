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
import { CouponTypeOptions, PujaTypeIDOption } from 'Middleware/Utils';
import { GetPujaCategoryLookupList } from 'services/Pooja Category/PoojaCategoryApi';
import { GetAppLanguageLookupList } from 'services/Admin/AppLangauge/AppLanguageApi';
import { AddUpdatePuja, GetPujaModel } from 'services/Admin/Puja/PujaApi';
import CustomUploadImg from '../../../assets/images/upload_img.jpg';
import { UploadImage } from 'services/Upload Cloud-flare Image/UploadCloudflareImageApi';
import { AddUpdateProductCatAPI, GetProductCatModalAPI } from 'services/Admin/EStoreAPI/ProductCatAPI';
import { AddUpdateImageAPI, GetImageCategoryLookupList, GetImageModalAPI } from 'services/Admin/ImageMasterAPI/ImageMasterAPI';

const AddUpdateImageModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
  const { setLoader, user } = useContext(ConfigContext);
  const [imageCategoryOption, setImageCategoryOption] = useState([]);
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

  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sizeError, setSizeError] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [actionMassage, setActionMassage] = useState(null);

  const [districtList, setDistrictList] = useState([]);
  const [benefitList, setBenefitList] = useState([]);
  const [deityList, setDeityList] = useState([]);
  const [heading, setHeading] = useState('Puja');

  const [formObj, setFormObj] = useState({
    imageCategoryID: null,
    appLangID: null
  });

  useEffect(() => {
    if (show) {
      //   isPageRender();
      GetImageCategoryLookupListData();
      GetAppLanguageLookupListData();
      //   GetTempleLookupListData();
      if (modelRequestData?.Action === 'update' && modelRequestData?.imageKeyID !== null && modelRequestData?.imageKeyID !== '') {
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
      const response = await GetImageModalAPI(modelRequestData?.imageKeyID);

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const List = response.data.responseData.data;
            setFormObj((prev) => ({
              ...prev,
              imageCategoryID: List.imageCatID
            }));
            setFilePreview(List.imageURL);
            setUploadedImageUrl(List.imageURL);
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

  const GetImageCategoryLookupListData = async () => {
    try {
      const response = await GetImageCategoryLookupList(); // Ensure it's correctly imported

      if (response?.data?.statusCode === 200) {
        const languageLookupList = response.data.responseData.data || [];

        const formattedLangList = languageLookupList.map((Lang) => ({
          value: Lang.imageCatID,
          label: Lang.imageCatName
        }));

        setImageCategoryOption(formattedLangList);
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
  //   const GetTempleLookupListData = async () => {
  //     try {
  //       const response = await GetTempleLookupList(modelRequestData?.appLangID); // Ensure it's correctly imported

  //       if (response?.data?.statusCode === 200) {
  //         const list = response?.data?.responseData?.data || [];

  //         const formattedLangList = list.map((Lang) => ({
  //           value: Lang.templeID,
  //           label: Lang.templeName
  //         }));

  //         setTempleList(formattedLangList);
  //       } else {
  //         console.error('Failed to fetch sim Type lookup list:', response?.data?.statusMessage || 'Unknown error');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching sim Type lookup list:', error);
  //     }
  //   };

  const setDataInitial = () => {
    setFilePreview(null);
    setUploadedImageUrl(null);
    setFormObj((prev) => ({
      ...prev,
      imageCategoryID: null
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
      formObj.imageCategoryID === null ||
      formObj.imageCategoryID === undefined ||
      formObj.imageCategoryID === '' ||
      uploadedImageUrl === null ||
      uploadedImageUrl === undefined ||
      uploadedImageUrl === ''
    ) {
      setError(true);
      isValid = false;
    }

    const apiParam = {
      adminID: user?.adminID,
      imageKeyID: modelRequestData.imageKeyID,
      imageCatID: formObj.imageCategoryID,
      imageURL: uploadedImageUrl
    };

    if (isValid) {
      AddUpdateImageData(apiParam);
    }
  };

  const AddUpdateImageData = async (ApiParam) => {
    setLoader(true);
    try {
      const response = await AddUpdateImageAPI(ApiParam);
      if (response?.data?.statusCode === 200) {
        setLoader(false);
        setActionMassage(modelRequestData.Action === null ? `Image added successfully.` : `Image updated successfully.`);
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

  const handleToDateChange = (newValue) => {
    if (dayjs(newValue).isValid()) {
      const newToDate = dayjs(newValue).format('YYYY-MM-DD');
      setFormObj((prev) => ({ ...prev, pujaDate: newToDate }));
    } else {
      setFormObj((prev) => ({ ...prev, pujaDate: null }));
    }
  };
  return (
    <>
      <Modal style={{ zIndex: 1300 }} size="md" show={show} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <h4 className="text-center">{modelRequestData?.Action === null ? `Add Image` : `Update Image`}</h4>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
          <div className="container-fluid ">
            <div className="row">
              {/* Image Category */}

              <div className="col-md-12 mb-3">
                <label htmlFor="stateID" className="form-label">
                  Select Image Category <span className="text-danger">*</span>
                </label>
                <Select
                  options={imageCategoryOption}
                  value={imageCategoryOption?.filter((v) => v?.value === formObj?.imageCategoryID)}
                  onChange={(selectedOption) => {
                    setFormObj((prev) => ({
                      ...prev,
                      imageCategoryID: selectedOption ? selectedOption.value : null
                    }));
                  }}
                  menuPlacement="auto"
                  menuPosition="fixed"
                />
                {error && !formObj?.imageCategoryID && <span className="text-danger">{ERROR_MESSAGES}</span>}
              </div>

              {/* Image */}
              <div className="col-md-12 mb-3">
                <div className="mb-3 position-relative">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label htmlFor="imageUpload" className="form-label ">
                      Add Image
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

export default AddUpdateImageModal;
