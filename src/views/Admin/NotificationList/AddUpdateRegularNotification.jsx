import { ERROR_MESSAGES } from 'component/GlobalMassage';
import Text_Editor from 'component/Text_Editor';
import { ConfigContext } from 'context/ConfigContext';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import dayjs from 'dayjs';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import { GetAppLanguageLookupList } from 'services/Admin/AppLangauge/AppLanguageApi';
import CustomUploadImg from '../../../assets/images/upload_img.jpg';
import { UploadImage } from 'services/Upload Cloud-flare Image/UploadCloudflareImageApi';
import { AddUpdateNotificationAPI, GetNotificationModalAPI } from 'services/Admin/NotificationAPI/RegularNotificationAPI';

const AddUpdateRegularNotification = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
  const { setLoader, user } = useContext(ConfigContext);
  const [customError, setCustomError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState(false)
  const [languageList, setLanguageList] = useState([]);
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sizeError, setSizeError] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [actionMassage, setActionMassage] = useState(null);


  const [formObj, setFormObj] = useState({
    title: null,
    message: null
  });

  useEffect(() => {
    if (show) {

      GetAppLanguageLookupListData();
      if (modelRequestData?.Action === 'update' && modelRequestData?.notificationKeyID !== null && modelRequestData?.notificationKeyID !== '') {
        GetModelData();
      }
    }
  }, [show]);



  const GetModelData = async () => {
    setLoader(true);
    try {
      const response = await GetNotificationModalAPI(modelRequestData?.notificationKeyID);

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const List = response.data.responseData.data;
            setFormObj((prev) => ({
              ...prev,
              title: List.title,
              message: List.message
            }));
            setFilePreview(List.notificationImageUrl);
            setUploadedImageUrl(List.notificationImageUrl);
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


  const setDataInitial = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFormObj((prev) => ({
      ...prev,
      title: null,
      message: null
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
      formObj.title === null ||
      formObj.title === undefined ||
      formObj.title === '' ||
      formObj.message === null ||
      formObj.message === undefined ||
      formObj.message === ''
    ) {
      setError(true);
      isValid = false;
    }

    const apiParam = {
      adminID: user?.adminID,
      notificationKeyID: modelRequestData.notificationKeyID,
      title: formObj.title,
      message: formObj.message,
      notificationImageUrl: uploadedImageUrl
    };

    if (isValid) {
      AddUpdateNotificationData(apiParam);
    }
  };

  const AddUpdateNotificationData = async (ApiParam) => {
    setLoader(true);
    try {
      const response = await AddUpdateNotificationAPI(ApiParam);
      if (response?.data?.statusCode === 200) {
        setLoader(false);
        setActionMassage(modelRequestData.Action === null ? `Notification added successfully.` : `Notification updated successfully.`);
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
      <Modal style={{ zIndex: 1300 }} size="lg" show={show} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <h4 className="text-center">{modelRequestData?.Action === null ? `Add Notification` : `Update Notification`}</h4>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
          <div className="container-fluid ">
            <div className="row">
              <div className="col-md-12 mb-3">
                <label htmlFor="pujaName" className="form-label">
                  Notification Title <span className="text-danger">*</span>
                </label>
                <input
                  maxLength={90}
                  type="text"
                  className="form-control"
                  id="catName"
                  placeholder="Enter Notification Title"
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

              <div className="col-md-12 mb-3">
                <label htmlFor="canonicalTag" className="form-label">
                  Notification Message <span className="text-danger">*</span>
                </label>
                <Text_Editor
                  editorState={formObj?.message}
                  handleContentChange={(htmlContent) => {
                    // Strip HTML tags and check if anything meaningful remains
                    const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

                    setFormObj((obj) => ({
                      ...obj,
                      message: strippedContent === '' ? null : htmlContent,
                    }));
                  }}
                />
                {error && (formObj?.message === null || formObj?.message === undefined || formObj?.message === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

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
                    <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
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

export default AddUpdateRegularNotification;
