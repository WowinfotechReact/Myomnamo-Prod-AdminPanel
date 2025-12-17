//validatin for producttype id
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import Text_Editor from 'component/Text_Editor';
import { ConfigContext } from 'context/ConfigContext';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import { GetTempleLookupList } from 'services/Admin/TempleApi/TemplesApi';
import dayjs from 'dayjs';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import { GetAppLanguageLookupList } from 'services/Admin/AppLangauge/AppLanguageApi';
import { UploadImage } from 'services/Upload Cloud-flare Image/UploadCloudflareImageApi';
import { AddUpdateDataAPI, GetProductModel } from 'services/Admin/EStoreAPI/ProductAPI';
import { GetProductCategoryLookupList } from 'services/Admin/EStoreAPI/ProductCatAPI';
import { GetUnitLookupList } from '../Unit/UnitAPI';
import { ProductType } from 'Middleware/Enum';

const AddUpdateProductModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
  const { setLoader, user, generateSlug, formatSlugOnChange, cleanSlugOnBlur } = useContext(ConfigContext);
  const [error, setError] = useState(false);
  const [customError, setCustomError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [languageList, setLanguageList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [productCatLookupList, setProductCatLookupList] = useState([]);
  const [templeList, setTempleList] = useState([]);
  const [sizeError, setSizeError] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [actionMassage, setActionMassage] = useState(null);
  const [heading, setHeading] = useState('Product');
  const [productFormObj, setProductFormObj] = useState({
    productCategoryID: null,
    templeID: null,
    unitID: null,
    productName: null,
    productTypeID: null,
    countryID: null,
    productPrice: null,
    productTrend: "no",
    productDiscount: null,
    productSlug: null,
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
    appLangID: null,
    rating: null,
    tagName: null
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
              productSlug: List.productSlug,
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
              productKeyFeature: List.keyFeature,
              rating: List.rating,
              tagName: List.tagName
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
      productTrend: "no",
      productDiscount: null,
      productSlug: null,
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
      rating: null, tagName: null
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

    // Helper function to check empty, null, or undefined
    const isEmpty = (val) => val === '' || val === undefined || val === null; //TODO: use this helper function to check null, undefined values
    //example:   isEmpty(productFormObj.productCategoryID) || isEmpty(productFormObj.unitID) ||

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
        // productFormObj.productDiscount === '' ||
        // productFormObj.productDiscount === undefined ||
        // productFormObj.productDiscount === null ||

        productFormObj.productDescription === '' ||
        productFormObj.productDescription === undefined ||
        productFormObj.productDescription === null ||
        productFormObj.productSpecification === '' ||
        productFormObj.productSpecification === undefined ||
        productFormObj.productSpecification === null ||
        //check here productSlug null, undefined and empty string only if productTypeID ==
        // productFormObj.productSlug === '' ||
        // productFormObj.productSlug === undefined ||
        // productFormObj.productSlug === null ||
        (productFormObj.productTypeID !== 1 && isEmpty(productFormObj.productSlug))
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
        // productFormObj.productDiscount === '' ||
        // productFormObj.productDiscount === undefined ||
        // productFormObj.productDiscount === null ||
        productFormObj.productSlug === '' ||
        productFormObj.productSlug === undefined ||
        productFormObj.productSlug === null ||
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
      adminID: user?.adminID,
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
      productSlug: productFormObj.productSlug,
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
      keyFeature: stripHtml(productFormObj.productKeyFeature),
      tagName: productFormObj?.tagName,
      rating: Number(productFormObj?.rating)
    };

    if (!isValid) {
      console.log("payload ==>>", apiParam)
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
          setActionMassage(`Product added successfully`);
        } else if (modelRequestData?.Action !== null && modelRequestData?.moduleName === 'ProductModal') {
          setActionMassage(`Product updated successfully.`);
        } else if (modelRequestData?.Action === null && modelRequestData?.moduleName === 'PrasadModal') {
          setActionMassage(`Prasad added successfully.`);
        } else if (modelRequestData?.Action !== null && modelRequestData?.moduleName === 'PrasadModal') {
          setActionMassage(`Prasad updated successfully.`);
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
    setProductFormObj((prev) => ({ ...prev, productSlug: slug }));
  };

  const handleChange = (e) => {
    let { id, value } = e.target;
    if (id === 'pujaName' || id === "tagName") {
      // Remove leading spaces
      // value = value.replace(/[^a-zA-Z\s]/g, '');
      value = value.replace(/^\s+/, '');

      // Capitalize first letter (if any)
      if (value.length > 0) {
        value = value.charAt(0).toUpperCase() + value.slice(1);
      }
      if (id === 'pujaName') {

        formatSlug(value);
      }
    }
    if (id === 'rating') {
      if (Number(value) <= 5) {
        const sanitizedInput = value
          .replace(/[^0-9.]/g, '') // Allow only numeric and dot characters
          .slice(0, 5); // Limit to 6 characters (5 digits + 1 dot or 4 digits + 2 decimals)

        // Split the input into integer and decimal parts
        const [integerPart, decimalPart] = sanitizedInput.split('.');

        // Format the integer part with commas as thousand separators
        const formattedIntegerPart = integerPart;

        // Combine integer and decimal parts with appropriate precision
        value =
          decimalPart !== undefined ? `${formattedIntegerPart.slice(0, 5)}.${decimalPart.slice(0, 2)}` : formattedIntegerPart.slice(0, 5);
      } else {
        // value = value
        //   .replace(/[^0-9.]/g, '') // Allow only numeric and dot characters
        //   .slice(0, 2); // Limit to 6 characters (5 digits + 1 dot or 4 digits + 2 decimals)
        value = ""
      }


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

            <fieldset className="border rounded p-3">
              <legend className="float-none w-auto px-2 fw-bold" style={{ fontSize: "14px" }}>
                {modelRequestData.moduleName === 'ProductModal' ? 'Product Details' : 'Prasad Details'}
              </legend>
              <div className="row">
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
                      onChange={(selectedOption) => {
                        // debugger
                        // console.log("selectedOption===>>", selectedOption)
                        if (selectedOption.value === 1) {

                          setProductFormObj({
                            ...productFormObj,
                            productTypeID: selectedOption ? selectedOption.value : null,
                            productSlug: null
                          })

                        } else {
                          setProductFormObj((prev) => ({
                            ...prev,
                            productTypeID: selectedOption ? selectedOption.value : null
                          }))
                        }
                      }
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
                      setProductFormObj({
                        ...productFormObj,
                        productName: e.target.value,

                      });
                    }}
                    onBlur={(e) => {
                      const slugValue = generateSlug(e.target.value);
                      if (productFormObj?.productTypeID === 1) {
                        setProductFormObj({
                          ...productFormObj,
                          // productSlug: slugValue,
                          productSlug: productFormObj?.productTypeID === 1 ? null : slugValue,
                        });
                      } else {
                        setProductFormObj({
                          ...productFormObj,
                          productSlug: slugValue,
                        });
                      }
                    }}
                  />
                  {error &&
                    (productFormObj.productName === null || productFormObj.productName === undefined || productFormObj.productName === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )}
                </div>

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





                {/* Product Discount */}

                {modelRequestData.langModule !== 'LanguageWiseList' && (
                  <div className="col-md-6 mb-3">
                    <label htmlFor="openGraphTag" className="form-label">
                      Discount (Rs.)
                      {/* <span className="text-danger">*</span> */}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="discount"
                      placeholder="Enter Discount"
                      value={productFormObj?.productDiscount}
                      onChange={(e) => handleIntegerInputChange('productDiscount', e.target.value)}
                    />
                    {/* {error &&
                    (productFormObj.productDiscount === null ||
                      productFormObj.productDiscount === undefined ||
                      productFormObj.productDiscount === '') ? (
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                  ) : (
                    ''
                  )} */}
                  </div>
                )}

                {/* Product Trend */}
                {modelRequestData.moduleName === 'ProductModal' && modelRequestData.langModule !== 'LanguageWiseList' && (
                  <>

                    {/* Rating */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="rating" className="form-label">
                        Rating
                        {/* <span className="text-danger">*</span> */}
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        id="rating"
                        placeholder="Enter Rating Upto 5"
                        value={productFormObj.rating}
                        onChange={handleChange}
                      />
                      {/* {error && (productFormObj.rating === null || productFormObj.rating === undefined || productFormObj.rating === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )} */}

                    </div>

                    {/* Rating */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="tagName" className="form-label">
                        Tag Name
                        {/* <span className="text-danger">*</span> */}
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        id="tagName"
                        placeholder="Enter Tag Name"
                        value={productFormObj.tagName}
                        onChange={handleChange}
                        maxLength={15}
                      />
                      {/* {error && (productFormObj.tagName === null || productFormObj.tagName === undefined || productFormObj.tagName === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )} */}

                    </div>

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
                  </>


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

              </div>


            </fieldset>

            <fieldset className="border rounded p-3">
              <legend className="float-none w-auto px-2 fw-bold" style={{ fontSize: "14px" }}>
                SEO Details
              </legend>
              <div className='row'>
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
                      value={productFormObj?.productSlug || ""}
                      readOnly={productFormObj?.productTypeID === 1}
                      onChange={(e) => {
                        const formattedSlug = formatSlugOnChange(e.target.value);
                        setProductFormObj({
                          ...productFormObj,
                          productSlug: formattedSlug,
                        });
                      }}
                      onBlur={(e) => {
                        const cleanedSlug = cleanSlugOnBlur(e.target.value);
                        setProductFormObj({
                          ...productFormObj,
                          productSlug: cleanedSlug,
                        });
                      }}

                    />
                    {productFormObj.productTypeID === 2 && error && (productFormObj.productSlug === null || productFormObj.productSlug === undefined || productFormObj.productSlug === '') ? (
                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                    ) : (
                      ''
                    )}
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
              </div>
            </fieldset>

            <fieldset className="border rounded p-3">
              <legend className="float-none w-auto px-2 fw-bold" style={{ fontSize: "14px" }}>
                Content Details
              </legend>
              <div className="row">








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

export default AddUpdateProductModal;
