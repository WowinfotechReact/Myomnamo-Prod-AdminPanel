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
import { AddUpdateDataAPI, GetProductModel } from 'services/Admin/EStoreAPI/ProductAPI';
import { GetProductCategoryLookupList } from 'services/Admin/EStoreAPI/ProductCatAPI';
import { GetUnitLookupList } from '../Unit/UnitAPI';
import { ProductType } from 'Middleware/Enum';

const AddUpdateProductModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
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
  const [unitList, setUnitList] = useState([]);
  const [productCatLookupList, setProductCatLookupList] = useState([]);
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

  const [productFormObj, setProductFormObj] = useState({
    productCategoryID: null,
    templeID: null,
    unitID: null,
    productName: null,
    productTypeID: null,
    countryID: null,
    productPrice: null,
    productTrend: null,
    productDiscount: null,
    slug: null,
    productHeight: null,
    productWeight: null,
    productLength: null,
    productWidth: null,
    productOGTag: null,
    productMetaDescription: null,
    productCanonicalTag: null,
    productExtraMetaTag: null,
    productMetaTitle: null,
    productDescription: null,
    productSpecification: null,
    productShortDescription: null,
    productKeyFeature: null,
    appLangID: null
  });

  useEffect(() => {
    if (show) {
      isPageRender();
      GetPoductCategoryLookupListData();
      GetAppLanguageLookupListData();
      GetUnitLookupListData();
      GetTempleLookupListData();
      if (modelRequestData?.Action === 'update' && modelRequestData?.productKeyID !== null && modelRequestData?.productKeyID !== '') {
        GetProductModelData();
      }
    }
  }, [show]);

  const isPageRender = () => {
    if (modelRequestData?.moduleName === 'ProductModal') {
      setHeading('Product');
    } else if (modelRequestData?.moduleName === 'PrasadModal') {
      setHeading('Prasad');
    }
  };

  const GetProductModelData = async () => {
    setLoader(true);
    try {
      const response = await GetProductModel(modelRequestData?.productKeyID, modelRequestData?.appLangID);

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const List = response.data.responseData.data;
            setProductFormObj((prev) => ({
              ...prev,
              productCategoryID: List.productCategoryID,
              appLangID: List?.appLangID,
              templeID: List.templeID,
              unitID: List.unitID,
              productName: List.productName,
              productTypeID: List.productTypeID,
              // countryID: List.,
              productPrice: List.productPrice,
              productTrend: List.trend === 1 ? 'yes' : 'no',
              productDiscount: List.discount,
              slug: List.productSlug,
              productHeight: List.height,
              productWeight: List.weight,
              productLength: List.length,
              productWidth: List.width,
              productOGTag: List.openGraphTag,
              productMetaDescription: List.metaDescription,
              productCanonicalTag: List.canonicalTag,
              productExtraMetaTag: List.extraMetaTag,
              productMetaTitle: List.metaTitle,
              productDescription: List.productDescription,
              productSpecification: List.productSpecification,
              productShortDescription: List.shortDescription,
              productKeyFeature: List.keyFeature
            }));
            // setSelectedFile(List?.pujaImageUrl);
            // setFilePreview(List?.pujaImageUrl);
            // setUploadedImageUrl(List?.pujaImageUrl);
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

  const GetPoductCategoryLookupListData = async () => {
    try {
      const response = await GetProductCategoryLookupList(); // Ensure it's correctly imported

      if (response?.data?.statusCode === 200) {
        const languageLookupList = response.data.responseData.data || [];

        const formattedLangList = languageLookupList.map((prod) => ({
          value: prod.productCategoryID,
          label: prod.productCategoryName
        }));

        setProductCatLookupList(formattedLangList);
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
  const GetUnitLookupListData = async () => {
    // debugger;
    try {
      const response = await GetUnitLookupList(); // Ensure it's correctly imported

      if (response?.data?.statusCode === 200) {
        const list = response?.data?.responseData?.data || [];

        const formattedLangList = list.map((val) => ({
          value: val.unitID,
          label: val.unit
        }));

        // const filteredList = formattedLangList?.filter((prev) => prev.value !== 1);
        setUnitList(formattedLangList);
      } else {
        console.error('Failed to fetch sim Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching sim Type lookup list:', error);
    }
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

  const setDataInitial = () => {
    setProductFormObj((prev) => ({
      ...prev,
      productCategoryID: null,
      appLangID: null,
      templeID: null,
      unitID: null,
      productName: null,
      productTypeID: null,
      countryID: null,
      productPrice: null,
      productTrend: null,
      productDiscount: null,
      slug: null,
      productHeight: null,
      productWeight: null,
      productLength: null,
      productWidth: null,
      productOGTag: null,
      productMetaDescription: null,
      productCanonicalTag: null,
      productExtraMetaTag: null,
      productMetaTitle: null,
      productDescription: null,
      productSpecification: null,
      productShortDescription: null,
      productKeyFeature: null
    }));
  };

  // utility function
  const stripHtml = (htmlString) => {
    if (!htmlString) return '';
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
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

    if (modelRequestData.moduleName === 'ProductModal' && modelRequestData.langModule !== 'LanguageWiseList') {
      if (
        productFormObj.productCategoryID === '' ||
        productFormObj.productCategoryID === undefined ||
        productFormObj.productCategoryID === null ||
        productFormObj.unitID === '' ||
        productFormObj.unitID === undefined ||
        productFormObj.unitID === null ||
        productFormObj.productName === '' ||
        productFormObj.productName === undefined ||
        productFormObj.productName === null ||
        productFormObj.productTypeID === '' ||
        productFormObj.productTypeID === undefined ||
        productFormObj.productTypeID === null ||
        productFormObj.productPrice === '' ||
        productFormObj.productPrice === undefined ||
        productFormObj.productPrice === null ||
        productFormObj.productTrend === '' ||
        productFormObj.productTrend === undefined ||
        productFormObj.productTrend === null ||
        productFormObj.productDiscount === '' ||
        productFormObj.productDiscount === undefined ||
        productFormObj.productDiscount === null ||
        productFormObj.slug === '' ||
        productFormObj.slug === undefined ||
        productFormObj.slug === null ||
        productFormObj.productDescription === '' ||
        productFormObj.productDescription === undefined ||
        productFormObj.productDescription === null ||
        productFormObj.productSpecification === '' ||
        productFormObj.productSpecification === undefined ||
        productFormObj.productSpecification === null
      ) {
        setError(true);
        isValid = true;
      }
    } else if (modelRequestData.moduleName === 'PrasadModal' && modelRequestData.langModule !== 'LanguageWiseList') {
      if (
        productFormObj.unitID === '' ||
        productFormObj.unitID === undefined ||
        productFormObj.unitID === null ||
        productFormObj.templeID === '' ||
        productFormObj.templeID === undefined ||
        productFormObj.templeID === null ||
        productFormObj.productName === '' ||
        productFormObj.productName === undefined ||
        productFormObj.productName === null ||
        productFormObj.productPrice === '' ||
        productFormObj.productPrice === undefined ||
        productFormObj.productPrice === null ||
        productFormObj.productDiscount === '' ||
        productFormObj.productDiscount === undefined ||
        productFormObj.productDiscount === null ||
        productFormObj.slug === '' ||
        productFormObj.slug === undefined ||
        productFormObj.slug === null ||
        productFormObj.productDescription === '' ||
        productFormObj.productDescription === undefined ||
        productFormObj.productDescription === null
      ) {
        setError(true);
        isValid = true;
      }
    } else if (modelRequestData.moduleName === 'ProductModal' && modelRequestData.langModule === 'LanguageWiseList') {
      if (
        productFormObj.appLangID === '' ||
        productFormObj.appLangID === undefined ||
        productFormObj.appLangID === null ||
        productFormObj.productName === '' ||
        productFormObj.productName === undefined ||
        productFormObj.productName === null ||
        productFormObj.productDescription === '' ||
        productFormObj.productDescription === undefined ||
        productFormObj.productDescription === null ||
        productFormObj.productSpecification === '' ||
        productFormObj.productSpecification === undefined ||
        productFormObj.productSpecification === null
      ) {
        setError(true);
        isValid = true;
      }
    }

    const apiParam = {
      adminID: user?.admiN_ID,
      productKeyID: modelRequestData.productKeyID ? modelRequestData.productKeyID : null,
      productByLangKeyID: modelRequestData.productByLangKeyID,
      appLangID: productFormObj.appLangID ? productFormObj.appLangID : null,
      productCategoryID: productFormObj.productCategoryID,
      unitID: productFormObj.unitID,
      productName: productFormObj.productName,
      productTypeID: productFormObj.productTypeID ? productFormObj.productTypeID : null,
      // countryID: productFormObj.countryID,
      templeID: productFormObj.templeID,
      // productPrice: productFormObj.productPrice?.replace(/,/g, ''),
      productPrice: parseFloat(String(productFormObj.productPrice)?.replace(/,/g, '')),
      discount: parseFloat(String(productFormObj.productDiscount)?.replace(/,/g, '')),
      trend: productFormObj.productTrend === 'yes' ? 1 : 2,
      // discount: productFormObj.productDiscount?.replace(/,/g, ''),
      productSlug: productFormObj.slug,
      height: productFormObj.productHeight,
      weight: productFormObj.productWeight,
      length: productFormObj.productLength,
      width: productFormObj.productWidth,
      openGraphTag: productFormObj.productOGTag,
      canonicalTag: productFormObj.productCanonicalTag,
      metaDescription: productFormObj.productMetaDescription,
      metaTitle: productFormObj.productMetaTitle,
      extraMetaTag: productFormObj.productExtraMetaTag,
      productDescription: stripHtml(productFormObj.productDescription),
      productSpecification: stripHtml(productFormObj.productSpecification),
      shortDescription: stripHtml(productFormObj.productShortDescription),
      keyFeature: stripHtml(productFormObj.productKeyFeature)
    };

    if (!isValid) {
      AddUpdateData(apiParam);
    }
  };

  const AddUpdateData = async (ApiParam) => {
    setLoader(true);
    try {
      const response = await AddUpdateDataAPI(ApiParam);
      if (response?.data?.statusCode === 200) {
        setLoader(false);
        if (modelRequestData?.Action === null && modelRequestData?.moduleName === 'ProductModal') {
          setActionMassage(`${heading} added successfully`);
        } else if (modelRequestData?.Action !== null && modelRequestData?.moduleName === 'ProductModal') {
          setActionMassage(`${heading} updated successfully.`);
        } else if (modelRequestData?.Action === null && modelRequestData?.moduleName === 'PrasadModal') {
          setActionMassage(`${heading} added successfully.`);
        } else if (modelRequestData?.Action !== null && modelRequestData?.moduleName === 'PrasadModal') {
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
    setProductFormObj((prev) => ({ ...prev, pujaSlug: slug }));
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
        value = productFormObj?.pujaDiscount || '';
      }
    }
    if (id === 'metaTitle' || id === 'metaDescription' || id === 'canonicalTag' || id === 'extraMetaTag' || id === 'openGraphTag') {
      value = value.replace(/^\s+/, '');
    }

    setProductFormObj((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleEditorChange = (field, htmlContent) => {
    setError(false);
    console.log(field);
    // Strip HTML tags and check if anything meaningful remains
    const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

    setProductFormObj((obj) => ({
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

    setProductFormObj((prev) => ({
      ...prev,
      [field]: finalValue
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
      setProductFormObj((prev) => ({ ...prev, pujaDate: newToDate }));
    } else {
      setProductFormObj((prev) => ({ ...prev, pujaDate: null }));
    }
  };
  return (
    <>
      <Modal style={{ zIndex: 1300 }} size="lg" show={show} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <h4 className="text-center">{modelRequestData?.Action === null ? `Add ${heading}` : `Update ${heading}`}</h4>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
          <div className="container-fluid ">
            <div className="row">
              {/* New Inputs */}

              {/* product Category */}

              {modelRequestData.moduleName === 'ProductModal' && modelRequestData.langModule !== 'LanguageWiseList' && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="pujaCategoryID" className="form-label">
                    Select Product Category <span className="text-danger">*</span>
                  </label>
                  <Select
                    id="productCategoryID"
                    options={productCatLookupList}
                    value={productCatLookupList.filter((item) => item.value === productFormObj.productCategoryID)}
                    onChange={(selectedOption) =>
                      setProductFormObj((prev) => ({
                        ...prev,
                        productCategoryID: selectedOption ? selectedOption.value : null
                      }))
                    }
                    menuPlacement="auto"
                    menuPosition="fixed"
                  />
                  {error &&
                  (productFormObj.productCategoryID === null ||
                    productFormObj.productCategoryID === undefined ||
                    productFormObj.productCategoryID === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              )}

              {/* Product Name */}

              <div className="col-md-6 mb-3">
                <label htmlFor="openGraphTag" className="form-label">
                  {modelRequestData.moduleName === 'ProductModal' ? 'Product Name' : 'Prasad Name'} <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="productName"
                  placeholder={modelRequestData.moduleName === 'ProductModal' ? 'Enter Product Name' : 'Enter Prasad Name'}
                  value={productFormObj?.productName}
                  onChange={(e) => {
                    let input = e.target.value;
                    if (input.startsWith(' ')) {
                      input = input.trimStart();
                    }

                    setProductFormObj((prev) => ({
                      ...prev,
                      productName: input
                    }));
                  }}
                />
                {error &&
                (productFormObj.productName === null || productFormObj.productName === undefined || productFormObj.productName === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

              {/* Language Selection */}
              {modelRequestData?.langModule === 'LanguageWiseList' && (
                <>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="stateID" className="form-label">
                      Select Language <span className="text-danger">*</span>
                    </label>
                    <Select
                      options={languageList}
                      value={languageList?.filter((v) => v?.value === productFormObj?.appLangID)}
                      onChange={(selectedOption) => {
                        setProductFormObj((prev) => ({
                          ...prev,
                          appLangID: selectedOption ? selectedOption.value : null
                        }));
                      }}
                      menuPlacement="auto"
                      menuPosition="fixed"
                    />
                    {error && !productFormObj?.appLangID && <span className="text-danger">{ERROR_MESSAGES}</span>}
                  </div>
                </>
              )}

              {/* Unit */}
              {modelRequestData.langModule !== 'LanguageWiseList' && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="unitID" className="form-label">
                    Select Unit <span className="text-danger">*</span>
                  </label>
                  <Select
                    id="unitID"
                    options={unitList}
                    value={unitList.filter((item) => item.value === productFormObj.unitID)}
                    onChange={(selectedOption) =>
                      setProductFormObj((prev) => ({
                        ...prev,
                        unitID: selectedOption ? selectedOption.value : null
                      }))
                    }
                    menuPlacement="auto"
                    menuPosition="fixed"
                  />
                  {error && (productFormObj.unitID === null || productFormObj.unitID === undefined || productFormObj.unitID === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              )}

              {/* Product Type */}
              {modelRequestData.moduleName === 'ProductModal' && modelRequestData.langModule !== 'LanguageWiseList' && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="ProductType" className="form-label">
                    Select Product Type <span className="text-danger">*</span>
                  </label>
                  <Select
                    id="ProductType"
                    options={ProductType}
                    value={ProductType.filter((item) => item.value === productFormObj.productTypeID)}
                    onChange={(selectedOption) =>
                      setProductFormObj((prev) => ({
                        ...prev,
                        productTypeID: selectedOption ? selectedOption.value : null
                      }))
                    }
                    menuPlacement="auto"
                    menuPosition="fixed"
                  />
                  {error &&
                  (productFormObj.productTypeID === null ||
                    productFormObj.productTypeID === undefined ||
                    productFormObj.productTypeID === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              )}

              {/* Temple Selection */}

              {modelRequestData.moduleName === 'PrasadModal' && modelRequestData.langModule !== 'LanguageWiseList' && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="pujaCategoryID" className="form-label">
                    Select Temple <span className="text-danger">*</span>
                  </label>
                  <Select
                    id="templeID"
                    options={templeList}
                    value={templeList.filter((item) => item.value === productFormObj.templeID)}
                    onChange={(selectedOption) =>
                      setProductFormObj((prev) => ({
                        ...prev,
                        templeID: selectedOption ? selectedOption.value : null
                      }))
                    }
                    menuPlacement="auto"
                    menuPosition="fixed"
                  />
                  {error &&
                  (productFormObj.templeID === null || productFormObj.templeID === undefined || productFormObj.templeID === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              )}

              {/* price */}

              {modelRequestData.langModule !== 'LanguageWiseList' && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="openGraphTag" className="form-label">
                    {modelRequestData.moduleName === 'ProductModal' ? 'Product Price (Rs.)' : 'Prasad Price (Rs.)'}{' '}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="productName"
                    placeholder="Enter Product Price"
                    value={productFormObj?.productPrice}
                    onChange={(e) => handleIntegerInputChange('productPrice', e.target.value)}
                  />
                  {error &&
                  (productFormObj.productPrice === null ||
                    productFormObj.productPrice === undefined ||
                    productFormObj.productPrice === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              )}

              {/* Select Image Prasad */}

              {/* {modelRequestData.moduleName === 'PrasadModal' && (
                <div className="col-md-12 mb-3">
                  <div className="mb-3 position-relative">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label htmlFor="imageUpload" className="form-label ">
                        Select Image
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
                          <img src={CustomUploadImg} alt="upload_img" className="d-block mx-auto" style={{ height: '5rem' }} />
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

              {/* Country */}
              {/* {modelRequestData.moduleName === 'ProductModal' && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="countryID" className="form-label">
                    Select Country <span className="text-danger">*</span>
                  </label>
                  <Select
                    id="unitID"
                    options={pujaCategoryOption}
                    value={pujaCategoryOption.filter((item) => item.value === productFormObj.countryID)}
                    onChange={(selectedOption) =>
                      setProductFormObj((prev) => ({
                        ...prev,
                        countryID: selectedOption ? selectedOption.value : null
                      }))
                    }
                    menuPlacement="auto"
                    menuPosition="fixed"
                  />
                  {error &&
                  (productFormObj.countryID === null || productFormObj.countryID === undefined || productFormObj.countryID === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              )} */}

              {/* Product Trend */}
              {modelRequestData.moduleName === 'ProductModal' && modelRequestData.langModule !== 'LanguageWiseList' && (
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Product Trend <span className="text-danger">*</span>
                  </label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="productTrend"
                        id="productTrendYes"
                        value="yes"
                        checked={productFormObj?.productTrend === 'yes'}
                        onChange={(e) =>
                          setProductFormObj((prev) => ({
                            ...prev,
                            productTrend: e.target.value
                          }))
                        }
                      />
                      <label className="form-check-label" htmlFor="productTrendYes">
                        Yes
                      </label>
                    </div>

                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="productTrend"
                        id="productTrendNo"
                        value="no"
                        checked={productFormObj?.productTrend === 'no'}
                        onChange={(e) =>
                          setProductFormObj((prev) => ({
                            ...prev,
                            productTrend: e.target.value
                          }))
                        }
                      />
                      <label className="form-check-label" htmlFor="productTrendNo">
                        No
                      </label>
                    </div>
                  </div>
                  {error &&
                  (productFormObj.productTrend === null ||
                    productFormObj.productTrend === undefined ||
                    productFormObj.productTrend === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              )}

              {/* Product Discount */}

              {modelRequestData.langModule !== 'LanguageWiseList' && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="openGraphTag" className="form-label">
                    Discount (Rs.) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="discount"
                    placeholder="Enter Discount"
                    value={productFormObj?.productDiscount}
                    onChange={(e) => handleIntegerInputChange('productDiscount', e.target.value)}
                  />
                  {error &&
                  (productFormObj.productDiscount === null ||
                    productFormObj.productDiscount === undefined ||
                    productFormObj.productDiscount === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              )}

              {/* Slug */}

              {modelRequestData.langModule !== 'LanguageWiseList' && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="openGraphTag" className="form-label">
                    Slug <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="slug"
                    placeholder="Enter Slug"
                    value={productFormObj?.slug}
                    onChange={(e) => {
                      let input = e.target.value;
                      if (input.startsWith(' ')) {
                        input = input.trimStart();
                      }

                      setProductFormObj((prev) => ({
                        ...prev,
                        slug: input
                      }));
                    }}
                  />
                  {error && (productFormObj.slug === null || productFormObj.slug === undefined || productFormObj.slug === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              )}

              {/* Product Height */}
              {modelRequestData.moduleName === 'ProductModal' && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="openGraphTag" className="form-label">
                    Product Height
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="slug"
                    placeholder="Enter Product Height"
                    value={productFormObj?.productHeight}
                    onChange={(e) => {
                      let input = e.target.value;
                      if (input.startsWith(' ')) {
                        input = input.trimStart();
                      }

                      setProductFormObj((prev) => ({
                        ...prev,
                        productHeight: input
                      }));
                    }}
                  />
                </div>
              )}

              {/* Product Length */}
              {modelRequestData.moduleName === 'ProductModal' && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="openGraphTag" className="form-label">
                    Product Length
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="ProductLength"
                    placeholder="Enter Product Length"
                    value={productFormObj?.productLength}
                    onChange={(e) => {
                      let input = e.target.value;
                      if (input.startsWith(' ')) {
                        input = input.trimStart();
                      }

                      setProductFormObj((prev) => ({
                        ...prev,
                        productLength: input
                      }));
                    }}
                  />
                </div>
              )}

              {/* Product Width */}
              {modelRequestData.moduleName === 'ProductModal' && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="openGraphTag" className="form-label">
                    Product Width
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="ProductWidth"
                    placeholder="Enter Product Width"
                    value={productFormObj?.productWidth}
                    onChange={(e) => {
                      let input = e.target.value;
                      if (input.startsWith(' ')) {
                        input = input.trimStart();
                      }

                      setProductFormObj((prev) => ({
                        ...prev,
                        productWidth: input
                      }));
                    }}
                  />
                </div>
              )}

              {/* Product Weight */}
              {modelRequestData.moduleName === 'ProductModal' && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="openGraphTag" className="form-label">
                    Product Weight
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="productWeight"
                    placeholder="Enter Product Weight"
                    value={productFormObj?.productWeight}
                    onChange={(e) => {
                      let input = e.target.value;
                      if (input.startsWith(' ')) {
                        input = input.trimStart();
                      }

                      setProductFormObj((prev) => ({
                        ...prev,
                        productWeight: input
                      }));
                    }}
                  />
                </div>
              )}

              {/* Open Graph Tag */}

              {modelRequestData.langModule !== 'LanguageWiseList' && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="openGraphTag" className="form-label">
                    Open Graph Tag
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="OpenGraphTag"
                    placeholder="Enter Open Graph Tag"
                    value={productFormObj?.productOGTag}
                    onChange={(e) => {
                      let input = e.target.value;
                      if (input.startsWith(' ')) {
                        input = input.trimStart();
                      }

                      setProductFormObj((prev) => ({
                        ...prev,
                        productOGTag: input
                      }));
                    }}
                  />
                </div>
              )}

              {/* Meta description */}

              {modelRequestData.langModule !== 'LanguageWiseList' && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="openGraphTag" className="form-label">
                    Meta description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="MetaDescription"
                    placeholder="Enter Meta description"
                    value={productFormObj?.productMetaDescription}
                    onChange={(e) => {
                      let input = e.target.value;
                      if (input.startsWith(' ')) {
                        input = input.trimStart();
                      }

                      setProductFormObj((prev) => ({
                        ...prev,
                        productMetaDescription: input
                      }));
                    }}
                  />
                </div>
              )}

              {/* Cannonical Tag */}

              {modelRequestData.langModule !== 'LanguageWiseList' && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="openGraphTag" className="form-label">
                    Cannonical Tag
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cannonicalTag"
                    placeholder="Enter Cannonical Tag"
                    value={productFormObj?.productCanonicalTag}
                    onChange={(e) => {
                      let input = e.target.value;
                      if (input.startsWith(' ')) {
                        input = input.trimStart();
                      }

                      setProductFormObj((prev) => ({
                        ...prev,
                        productCanonicalTag: input
                      }));
                    }}
                  />
                </div>
              )}

              {/* Extra Meta Tag */}

              {modelRequestData.langModule !== 'LanguageWiseList' && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="openGraphTag" className="form-label">
                    Extra Meta Tag
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="extraMetaTag"
                    placeholder="Enter Extra Meta Tag"
                    value={productFormObj?.productExtraMetaTag}
                    onChange={(e) => {
                      let input = e.target.value;
                      if (input.startsWith(' ')) {
                        input = input.trimStart();
                      }

                      setProductFormObj((prev) => ({
                        ...prev,
                        productExtraMetaTag: input
                      }));
                    }}
                  />
                </div>
              )}

              {/* Meta Title */}

              {modelRequestData.langModule !== 'LanguageWiseList' && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="openGraphTag" className="form-label">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="metaTitle"
                    placeholder="Enter Meta Title"
                    value={productFormObj?.productMetaTitle}
                    onChange={(e) => {
                      let input = e.target.value;
                      if (input.startsWith(' ')) {
                        input = input.trimStart();
                      }

                      setProductFormObj((prev) => ({
                        ...prev,
                        productMetaTitle: input
                      }));
                    }}
                  />
                </div>
              )}

              {/* Description */}

              <div className="col-md-12 mb-3">
                <label htmlFor="canonicalTag" className="form-label">
                  {modelRequestData.moduleName === 'ProductModal' ? 'Description' : 'Prasad Description'}
                  <span className="text-danger">*</span>
                </label>
                <Text_Editor
                  editorState={productFormObj?.productDescription}
                  handleContentChange={(html) => handleEditorChange('productDescription', html)}
                />
                {error && (!productFormObj?.productDescription || productFormObj?.productDescription === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

              {/* Specification */}
              {modelRequestData.moduleName === 'ProductModal' && (
                <div className="col-md-12 mb-3">
                  <label htmlFor="canonicalTag" className="form-label">
                    Specification<span className="text-danger">*</span>
                  </label>
                  <Text_Editor
                    editorState={productFormObj?.productSpecification}
                    handleContentChange={(html) => handleEditorChange('productSpecification', html)}
                  />
                  {error &&
                  (productFormObj?.productSpecification === null ||
                    productFormObj?.productSpecification === undefined ||
                    productFormObj?.productSpecification === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>
              )}

              {/* Short Description */}

              <div className="col-md-12 mb-3">
                <label htmlFor="canonicalTag" className="form-label">
                  Short Description
                </label>
                <Text_Editor
                  editorState={productFormObj?.productShortDescription}
                  handleContentChange={(html) => handleEditorChange('productShortDescription', html)}
                />
              </div>

              {/* Key Feature */}

              <div className="col-md-12 mb-3">
                <label htmlFor="canonicalTag" className="form-label">
                  Key Feature
                </label>
                <Text_Editor
                  editorState={productFormObj?.productKeyFeature}
                  handleContentChange={(html) => handleEditorChange('productKeyFeature', html)}
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
                    value={templeList.filter((item) => item.value === productFormObj.templeID)}
                    onChange={(selectedOption) =>
                      setProductFormObj((prev) => ({
                        ...prev,
                        templeID: selectedOption ? selectedOption.value : null
                      }))
                    }
                    menuPlacement="auto"
                    menuPosition="fixed"
                  />
                  {error && (productFormObj.templeID === null || productFormObj.templeID === undefined || productFormObj.templeID === '') ? (
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
                  value={productFormObj.pujaName}
                  onChange={handleChange}
                />
                {error && (productFormObj.pujaName === null || productFormObj.pujaName === undefined || productFormObj.pujaName === '') ? (
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
                      value={productFormObj?.pujaDate || ''}
                      clearIcon={null}
                      onChange={handleToDateChange}
                      format="dd/MM/yyyy"
                      className="custom-date-picker"
                    />

                    {error && !productFormObj.pujaDate && <span className="error-msg">{ERROR_MESSAGES}</span>}
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
                      value={productFormObj.pujaTime || ''}
                      onClick={(e) => e.target.showPicker && e.target.showPicker()}
                      onChange={(e) => {
                        const [hour, minute] = e.target.value.split(':');
                        let hr = parseInt(hour, 10);
                        const ampm = hr >= 12 ? 'PM' : 'AM';
                        hr = hr % 12 || 12; // convert hoga yaha pr -> 13 ka -> 1
                        const formattedTime = `${hr}:${minute} ${ampm}`;

                        setProductFormObj((prev) => ({
                          ...prev,
                          pujaTime: e.target.value,
                          time24: e.target.value
                        }));
                      }}
                    />
                    {error && !productFormObj.pujaTime && <span className="error-msg">{ERROR_MESSAGES}</span>}
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
                    value={languageList?.filter((v) => v?.value === productFormObj?.appLangID)}
                    onChange={(selectedOption) =>
                      setProductFormObj((prev) => ({
                        ...prev,
                        appLangID: selectedOption ? selectedOption.value : null
                      }))
                    }
                    menuPlacement="auto"
                    menuPosition="fixed"
                  />
                  {error && !productFormObj?.appLangID && <span className="text-danger">{ERROR_MESSAGES}</span>}
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
                        value={PujaTypeIDOption.filter((item) => item.value === productFormObj.pujaTypeID)}
                        onChange={(selectedOption) =>
                          setProductFormObj((prev) => ({
                            ...prev,
                            pujaTypeID: selectedOption ? selectedOption.value : null,
                            onlinePujaPrice: selectedOption?.value === 2 ? null : prev?.onlinePujaPrice,
                            offlinePujaPrice: selectedOption?.value === 1 ? null : prev?.offlinePujaPrice
                          }))
                        }
                        menuPlacement="auto"
                        menuPosition="fixed"
                      />
                      {error && !productFormObj?.pujaTypeID && <span className="text-danger">{ERROR_MESSAGES}</span>}
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
                          checked={productFormObj.pujaTrend == true}
                          onChange={(e) => {
                            setProductFormObj((prev) => ({
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
                          checked={productFormObj.pujaTrend == false}
                          onChange={(e) =>
                            setProductFormObj((prev) => ({
                              ...prev,
                              pujaTrend: e.target.value == 2 ? false : true
                            }))
                          }
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 mx-2 text-sm text-gray-700">No</span>
                      </label>
                    </div>

                    {error && (productFormObj.pujaTrend === null || productFormObj.pujaTrend === undefined || productFormObj.pujaTrend === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
                  </div> */}

                  {/* { onlinePrice} */}
                  {/* {(productFormObj?.pujaTypeID == 1 || productFormObj?.pujaTypeID == 3) && (
                    <div className="col-md-6 mb-3">
                      <label htmlFor="onlinePujaPrice" className="form-label">
                        Online Price <span className="text-danger">*</span>
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        id="onlinePujaPrice"
                        placeholder="Enter Online Price"
                        value={productFormObj.onlinePujaPrice}
                        onChange={handleChange}
                      />
                      {error &&
                      (productFormObj.onlinePujaPrice === null ||
                        productFormObj.onlinePujaPrice === undefined ||
                        productFormObj.onlinePujaPrice === '') ? (
                        <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                      ) : (
                        ''
                      )}
                    </div>
                  )} */}

                  {/* Offline puja */}
                  {/* {(productFormObj?.pujaTypeID == 2 || productFormObj?.pujaTypeID == 3) && modelRequestData?.pujaSubServiceID !== 6 && (
                    <div className="col-md-6 mb-3">
                      <label htmlFor="offlinePujaPrice" className="form-label">
                        Offline Price <span className="text-danger">*</span>
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        id="offlinePujaPrice"
                        placeholder="Enter Offline Price"
                        value={productFormObj.offlinePujaPrice}
                        onChange={handleChange}
                      />
                      {error &&
                      (productFormObj.offlinePujaPrice === null ||
                        productFormObj.offlinePujaPrice === undefined ||
                        productFormObj.offlinePujaPrice === '') ? (
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
                        value={productFormObj.offlinePujaPrice}
                        onChange={handleChange}
                      />
                      {error &&
                      (productFormObj.offlinePujaPrice === null ||
                        productFormObj.offlinePujaPrice === undefined ||
                        productFormObj.offlinePujaPrice === '') ? (
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
                      value={productFormObj.convenienceFee}
                      onChange={handleChange}
                    />
                    {error &&
                    (productFormObj.convenienceFee === null ||
                      productFormObj.convenienceFee === undefined ||
                      productFormObj.convenienceFee === '') ? (
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
                      value={productFormObj.wetSamagriPrice}
                      onChange={handleChange}
                    />
                    {error &&
                    (productFormObj.wetSamagriPrice === null ||
                      productFormObj.wetSamagriPrice === undefined ||
                      productFormObj.wetSamagriPrice === '') ? (
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
                      value={productFormObj.drySamagriPrice}
                      onChange={handleChange}
                    />
                    {error &&
                    (productFormObj.drySamagriPrice === null ||
                      productFormObj.drySamagriPrice === undefined ||
                      productFormObj.drySamagriPrice === '') ? (
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
                      value={productFormObj.pujaDiscount}
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
                      value={productFormObj?.pujaSlug} // fallback to avoid uncontrolled input
                      onChange={handleChange}
                    />
                    {error && (productFormObj.pujaSlug === null || productFormObj.pujaSlug === undefined || productFormObj.pujaSlug === '') ? (
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
                      value={productFormObj?.metaTitle}
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
                      value={productFormObj?.metaDescription}
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
                      value={productFormObj?.canonicalTag}
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
                      value={productFormObj?.extraMetaTag}
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
                      value={productFormObj?.openGraphTag}
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
                <Text_Editor editorState={productFormObj?.pujaDetails} handleContentChange={handlePujaDetailsDescriptionChange} />
                {error && (productFormObj.pujaDetails === null || productFormObj.pujaDetails === undefined || productFormObj.pujaDetails === '') ? (
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
                <Text_Editor editorState={productFormObj?.shortDescription} handleContentChange={handleShortDescriptionChange} />
                {error &&
                (productFormObj.shortDescription === null ||
                  productFormObj.shortDescription === undefined ||
                  productFormObj.shortDescription === '') ? (
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
                <Text_Editor editorState={productFormObj?.pujaSamagri} handleContentChange={handlePujaSamagriChange} />
                {error && (productFormObj.pujaSamagri === null || productFormObj.pujaSamagri === undefined || productFormObj.pujaSamagri === '') ? (
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
                <Text_Editor editorState={productFormObj?.keyFeature} handleContentChange={handleKeyFeaturesChange} />
                {error && (productFormObj.keyFeature === null || productFormObj.keyFeature === undefined || productFormObj.keyFeature === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div> */}
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

export default AddUpdateProductModal;
