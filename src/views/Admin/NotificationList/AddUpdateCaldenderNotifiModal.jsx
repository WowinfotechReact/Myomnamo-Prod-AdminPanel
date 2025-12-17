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
import {
  AddUpdateNotificationTemplateAPI,
  GetNotificationTemplateLookupList,
  GetNotificationTemplateModalAPI
} from 'services/Admin/NotificationAPI/NotificationTemplateAPI';
import { AddUpdateCalenderNotifiTemplateAPI, GetCalenderTemplateModalAPI } from 'services/Admin/NotificationAPI/CalenderNotificationAPI';
import { NotificationTimeSlot } from 'Middleware/Enum';

const AddUpdateCalenderNotifiModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
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
  const [notificationTemplateList, setNotificationTemplateList] = useState([]);

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
    title: null,
    date: null,
    timeID: null,
    templateID: null
  });

  useEffect(() => {
    if (show) {
      //   isPageRender();
      //   GetPujaCategoryLookupListData();
      GetAppLanguageLookupListData();
      GetNotificationTemplateLookupListData();
      if (
        modelRequestData?.Action === 'update' &&
        modelRequestData?.festNotiTemplateKeyID !== null &&
        modelRequestData?.festNotiTemplateKeyID !== ''
      ) {
        GetModelData();
      }
    }
  }, [show]);

  const GetModelData = async () => {
    // debugger;
    setLoader(true);
    try {
      const response = await GetCalenderTemplateModalAPI(modelRequestData?.festNotiTemplateKeyID);

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const List = response.data.responseData.data;
            setFormObj((prev) => ({
              ...prev,
              title: List.title,
              templateID: List.notiTemplateID,
              timeID: List.notiTimeID,
              date: List.date
            }));
            setFilePreview(List.image);
            setUploadedImageUrl(List.image);
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
  const GetNotificationTemplateLookupListData = async () => {
    try {
      const response = await GetNotificationTemplateLookupList();

      if (response?.data?.statusCode === 200) {
        const list = response?.data?.responseData?.data || [];

        const formattedLangList = list.map((Lang) => ({
          value: Lang.notiTemplateID,
          label: Lang.title
        }));

        setNotificationTemplateList(formattedLangList);
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
    setUploadedImageUrl(null);
    setFormObj((prev) => ({
      ...prev,
      title: null,
      templateID: null,
      date: null,
      timeID: null
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
      formObj.title === null ||
      formObj.title === undefined ||
      formObj.title === '' ||
      formObj.date === null ||
      formObj.date === undefined ||
      formObj.date === '' ||
      formObj.timeID === null ||
      formObj.timeID === undefined ||
      formObj.timeID === '' ||
      formObj.templateID === null ||
      formObj.templateID === undefined ||
      formObj.templateID === ''
    ) {
      setError(true);
      isValid = false;
    }

    const apiParam = {
      adminID: user?.adminID,
      festNotiTemplateKeyID: modelRequestData.festNotiTemplateKeyID,
      notiTemplateID: formObj.templateID,
      title: formObj.title,
      image: uploadedImageUrl,
      notiTimeID: formObj.timeID,
      date: formObj.date
    };

    if (isValid) {
      AddUpdateCalenderNotifiData(apiParam);
    }
  };

  const AddUpdateCalenderNotifiData = async (ApiParam) => {
    setLoader(true);
    try {
      const response = await AddUpdateCalenderNotifiTemplateAPI(ApiParam);
      if (response?.data?.statusCode === 200) {
        setLoader(false);
        setActionMassage(
          modelRequestData.Action === null ? `Notification Template added successfully.` : `Notification Template updated successfully.`
        );
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

    // Size check (2 MB)
    if (file.size > 2 * 1024 * 1024) {
      setSizeError('File size must be less than 2 MB.');
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
      setFormObj((prev) => ({ ...prev, date: newToDate }));
    } else {
      setFormObj((prev) => ({ ...prev, date: null }));
    }
  };
  return (
    <>
      <Modal style={{ zIndex: 1300 }} size="lg" show={show} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <h4 className="text-center">
            {modelRequestData?.Action === null ? `Add Calender Notification` : `Update Calender Notification`}
          </h4>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
          <div className="container-fluid ">
            <div className="row">
              {/* Title */}
              <div className="col-md-6 mb-3">
                <label htmlFor="pujaName" className="form-label">
                  Title <span className="text-danger">*</span>
                </label>
                <input
                  maxLength={90}
                  type="text"
                  className="form-control"
                  id="catName"
                  placeholder="Enter Title"
                  aria-describedby="Employee"
                  value={formObj.title}
                  onChange={(e) => {
                    let input = e.target.value;
                    if (input.startsWith(' ')) {
                      input = input.trimStart();
                    }

                    setFormObj((prev) => ({
                      ...prev,
                      title: input
                    }));
                  }}
                />
                {error && (formObj.title === null || formObj.title === undefined || formObj.title === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

              {/* Select Template */}

              <div className="col-md-6 mb-3">
                <label htmlFor="countryID" className="form-label">
                  Select Template <span className="text-danger">*</span>
                </label>
                <Select
                  id="unitID"
                  options={notificationTemplateList}
                  value={notificationTemplateList.filter((item) => item.value === formObj.templateID)}
                  onChange={(selectedOption) =>
                    setFormObj((prev) => ({
                      ...prev,
                      templateID: selectedOption ? selectedOption.value : null
                    }))
                  }
                  menuPlacement="auto"
                  menuPosition="fixed"
                />
                {error && (formObj.templateID === null || formObj.templateID === undefined || formObj.templateID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

              {/* Date */}
              <div className="col-md-6 col-sm-12 mb-2 d-flex flex-column form-font-size">
                <label htmlFor="bookingDate" style={{ textAlign: 'left' }}>
                  Scheduling Date<span style={{ color: 'red' }}>*</span>
                </label>
                <DatePicker
                  id="date"
                  value={formObj?.date || ''}
                  clearIcon={null}
                  onChange={handleToDateChange}
                  format="dd/MM/yyyy"
                  className="custom-date-picker"
                />

                {error && !formObj?.date && (
                  <span className="error-msg" style={{ color: 'red' }}>
                    {ERROR_MESSAGES}
                  </span>
                )}
              </div>

              {/* Time */}
              <div className="col-md-6 mb-3">
                <label htmlFor="countryID" className="form-label">
                  Time <span className="text-danger">*</span>
                </label>
                <Select
                  id="unitID"
                  options={NotificationTimeSlot}
                  value={NotificationTimeSlot.filter((item) => item.value === formObj.timeID)}
                  onChange={(selectedOption) =>
                    setFormObj((prev) => ({
                      ...prev,
                      timeID: selectedOption ? selectedOption.value : null
                    }))
                  }
                  menuPlacement="auto"
                  menuPosition="fixed"
                />
                {error && (formObj.timeID === null || formObj.timeID === undefined || formObj.timeID === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

              {/* Image */}
              <div className="col-md-12 mb-3">
                <div className="mb-3 position-relative">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label htmlFor="imageUpload" className="form-label ">
                      Image
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
                    <span className="error-msg" style={{ color: 'red' }}>
                      {ERROR_MESSAGES}
                    </span>
                  )}
                </div>
              </div>

              {/* Language Selection */}
              {/* {modelRequestData?.moduleName === 'LanguageWiseList' && (
                <>
                  <div className="col-md-12 mb-3">
                    <label htmlFor="stateID" className="form-label">
                      Select Language <span className="text-danger">*</span>
                    </label>
                    <Select
                      options={languageList}
                      value={languageList?.filter((v) => v?.value === formObj?.appLangID)}
                      onChange={(selectedOption) => {
                        setFormObj((prev) => ({
                          ...prev,
                          appLangID: selectedOption ? selectedOption.value : null
                        }));
                      }}
                      menuPlacement="auto"
                      menuPosition="fixed"
                    />
                    {error && !formObj?.appLangID && <span className="text-danger">{ERROR_MESSAGES}</span>}
                  </div>
                </>
              )} */}

              {/* Notification Template */}

              {/* <div className="col-md-12 mb-3">
                <label htmlFor="canonicalTag" className="form-label">
                  Notification Template
                  <span className="text-danger">*</span>
                </label>
                <Text_Editor
                  editorState={formObj?.notificationTemplate}
                  handleContentChange={(html) => handleEditorChange('notificationTemplate', html)}
                />
                {error && (!formObj?.notificationTemplate || formObj?.notificationTemplate === '') ? (
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

export default AddUpdateCalenderNotifiModal;
