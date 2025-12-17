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
import { AddUpdateProductCatAPI, GetProductCatModalAPI } from 'services/Admin/EStoreAPI/ProductCatAPI';
import { GetTimeSlotLookupList } from 'services/Admin/DarshanBookingAPI/DarshanBookingAPI';
import { AddUpdateUserWalletAPI, GetUserLookupList } from 'services/Admin/UserWalletAPI/UserWalletAPI';

const AddUpdateUserWalletModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
  const { setLoader, user } = useContext(ConfigContext);
  const [userList, setUserList] = useState([]);
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
    walletAmount: null,
    userListID: []
  });

  // console.log(modelRequestData.referredByUserID);

  useEffect(() => {
    if (show) {
      //   isPageRender();
      GetUserLookupListData();
      GetAppLanguageLookupListData();
      GetTimeSlotLookupListData();
      //   GetTempleLookupListData();
      if (modelRequestData?.Action === 'update' && modelRequestData?.userWalletID !== null && modelRequestData?.userWalletID !== '') {
        setFormObj((prev) => ({
          ...prev,
          walletAmount: modelRequestData.walletAmount,
          userWalletID: modelRequestData.userWalletID
        }));
      }
      // if (modelRequestData?.Action === 'update' && modelRequestData?.productCatKeyID !== null && modelRequestData?.productCatKeyID !== '') {
      //   GetModelData();
      // }
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
      const response = await GetUserWalletModalAPI(modelRequestData?.productCatKeyID, modelRequestData?.appLangID);

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const List = response.data.responseData.data;
            setFormObj((prev) => ({
              ...prev,
              productCategory: List.productCategoryName,
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

  useEffect(() => {
    if (modelRequestData?.referredByUserID) {
      setFormObj((prev) => ({
        ...prev,
        userListID: modelRequestData.referredByUserID
      }));
    }
  }, [modelRequestData]);

  const setDataInitial = () => {
    setFormObj((prev) => ({
      ...prev,
      walletAmount: null,
      userListID: null
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
      formObj.walletAmount === null ||
      formObj.walletAmount === undefined ||
      formObj.walletAmount === '' ||
      formObj.userListID.length === 0
    ) {
      setError(true);
      isValid = false;
    }
    debugger
    const apiParam = {
      adminID: user?.adminID,
      userWalletID: modelRequestData.userWalletID ? modelRequestData.userWalletID : null,
      userID: formObj.userListID,
      // walletAmount: formObj.walletAmount
      walletAmount: parseFloat(String(formObj.walletAmount)?.replace(/,/g, ''))
    };

    if (isValid) {
      AddUpdateUserWalletData(apiParam);
    }
  };

  const AddUpdateUserWalletData = async (ApiParam) => {
    setLoader(true);
    try {
      const response = await AddUpdateUserWalletAPI(ApiParam);
      if (response?.data?.statusCode === 200) {
        setLoader(false);
        setActionMassage(modelRequestData.Action === null ? `User Wallet added successfully.` : `User Wallet updated successfully.`);
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

    setFormObj((prev) => ({
      ...prev,
      [field]: finalValue
    }));
  };

  const [timeSlotList, setTimeSlotList] = useState([]);

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

  const handleChange = (selectedOptions) => {
    if (!selectedOptions) {
      setFormObj({ userListID: [] });
      return;
    }

    const values = selectedOptions.map((opt) => opt.value);

    // If "All" is selected
    if (values.includes('all')) {
      // Select all (including all regular options)
      setFormObj({ userListID: timeSlotList.map((opt) => opt.value) });
    } else {
      setFormObj({ userListID: values });
    }
  };

  return (
    <>
      <Modal style={{ zIndex: 1300 }} size="md" show={show} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <h4 className="text-center">{modelRequestData?.Action === null ? `Add Wallet` : `Update Wallet`}</h4>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
          <div className="container-fluid ">
            <div className="row">
              <div className="col-md-12 mb-3">
                <label htmlFor="openGraphTag" className="form-label">
                  Wallet Amount <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="OpenGraphTag"
                  placeholder="Enter Wallet Amount"
                  value={formObj?.walletAmount}
                  onChange={(e) => handleIntegerInputChange('walletAmount', e.target.value)}
                />
                {error && (formObj.walletAmount === null || formObj.walletAmount === undefined || formObj.walletAmount === '') && (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                )}
              </div>

              {modelRequestData.Action === null ? (
                <div className="col-md-12 mb-3">
                  <label htmlFor="pujaCategoryID" className="form-label">
                    Select Users <span className="text-danger">*</span>
                  </label>
                  <Select
                    id="templeID"
                    // options={userList}
                    options={
                      (userList || [])
                        .filter(item => item && item.label) // ✅ filter out invalid entries
                        .sort((a, b) => a.label.localeCompare(b.label))
                    } //Todo: useMemo for better memoized sorted array
                    value={userList.filter((item) => formObj.userListID?.includes(item.value))}
                    onChange={(selectedOptions) =>
                      setFormObj((prev) => ({
                        ...prev,
                        userListID: selectedOptions ? selectedOptions.map((opt) => opt.value) : []
                      }))
                    }
                    menuPlacement="auto"
                    menuPosition="fixed"
                    isMulti
                  />
                  {error && formObj.userListID.length === 0 ? <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span> : ''}
                </div>
              ) : (
                <div className="col-md-12 mb-3">
                  <label htmlFor="pujaCategoryID" className="form-label">
                    Select Users <span className="text-danger">*</span>
                  </label>
                  <Select
                    id="templeID"
                    options={userList}
                    value={userList.find((item) => item.value === (formObj.userListID?.[0] ?? null)) || null}
                    onChange={(selectedOption) =>
                      setFormObj((prev) => ({
                        ...prev,
                        userListID: selectedOption ? [selectedOption.value] : []
                      }))
                    }
                    menuPlacement="auto"
                    menuPosition="fixed"
                  />

                  {error && formObj.userListID.length === 0 ? <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span> : ''}
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

export default AddUpdateUserWalletModal;
