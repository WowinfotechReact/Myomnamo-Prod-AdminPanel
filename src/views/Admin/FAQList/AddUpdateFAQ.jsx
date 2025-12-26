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
import { AddUpdateFAQAPI, GetFAQModalAPI, GetServiceTypeLookupList, GetSubServiceTypeLookupList } from 'services/Admin/FAQAPI/FAQAPI';
import { GetModuleTypeLookupList, GetPujaServiceTypeLookupList, GetPujaSubServiceTypeLookupList } from 'services/Admin/MasterAPI/MasterAPI';

const AddUpdateFAQModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
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

  const [districtList, setDistrictList] = useState([]);
  const [benefitList, setBenefitList] = useState([]);
  const [deityList, setDeityList] = useState([]);
  const [heading, setHeading] = useState('Puja');


  const [pujaLookupList, setPujaLookupList] = useState([]);

  const [formObj, setFormObj] = useState({
    question: null,
    answer: null,
    serviceID: null,
    subServiceID: null,
    appLangID: null,
    pujaModuleID: null
  });

  useEffect(() => {
    if (show) {
      //   isPageRender();
      //   GetPujaCategoryLookupListData();
      GetAppLanguageLookupListData();
      GetServiceLookupListData();
      //   GetSubServiceLookupListData();
      if (modelRequestData?.Action === 'update' && modelRequestData?.faqKeyID !== null && modelRequestData?.faqKeyID !== '') {
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
    // debugger;
    setLoader(true);
    try {
      const response = await GetFAQModalAPI(modelRequestData?.faqKeyID, modelRequestData?.appLangID);

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const List = response.data.responseData.data;
            setFormObj((prev) => ({
              ...prev,
              question: List.question,
              answer: List.answer,
              serviceID: List.pujaServiceID,
              subServiceID: List.pujaSubServiceID,
              pujaModuleID: List.moduleID,
              appLangID: List.appLangID
            }));

            GetPujaSubServiceLookupListData(List.pujaServiceID)
            GetModuleTypeLookupListData(List.pujaServiceID, List.pujaSubServiceID)
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
  const GetModuleTypeLookupListData = async (serviceID, subServiceID) => {
    try {
      const response = await GetModuleTypeLookupList(serviceID, subServiceID);

      if (response?.data?.statusCode === 200) {
        const list = response?.data?.responseData?.data || [];

        const formattedLangList = list.map((Lang) => ({
          value: Lang.moduleID,
          label: Lang.moduleName
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
  const GetServiceLookupListData = async () => {
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


  const setDataInitial = () => {
    setFormObj((prev) => ({
      ...prev,
      question: null,
      answer: null,
      serviceID: null,
      subServiceID: null,
      appLangID: null,
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
    if ((modelRequestData?.moduleName !== 'LanguageWiseList') &&
      (formObj.question === null ||
        formObj.question === undefined ||
        formObj.question === '' ||
        formObj.answer === null ||
        formObj.answer === undefined ||
        formObj.answer === '')
    ) {
      setError(true);
      isValid = false;
    }

    if (modelRequestData.moduleName === 'LanguageWiseList') {
      if (formObj.appLangID === null || formObj.appLangID === undefined || formObj.appLangID === '') {
        setError(true);
        isValid = false;
      }
    }

    const apiParam = {
      adminID: user?.adminID,
      faqKeyID: modelRequestData.faqKeyID ? modelRequestData.faqKeyID : null,
      faqByLanKeyID: modelRequestData.faqByLanKeyID ? modelRequestData.faqByLanKeyID : null,
      appLangID: formObj.appLangID,
      question: formObj.question,
      answer: formObj.answer,
      pujaServiceID: formObj.serviceID,
      pujaSubServiceID: formObj.subServiceID,
      moduleID: formObj?.pujaModuleID
    };

    if (isValid) {
      AddUpdateFAQData(apiParam);
    }
  };

  const AddUpdateFAQData = async (ApiParam) => {
    setLoader(true);
    try {
      const response = await AddUpdateFAQAPI(ApiParam);
      if (response?.data?.statusCode === 200) {
        setLoader(false);
        setActionMassage(modelRequestData.Action === null ? `FAQ added successfully.` : `FAQ updated successfully.`);
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

  return (
    <>
      <Modal style={{ zIndex: 1300 }} size="lg" show={show} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <h4 className="text-center">
            {modelRequestData?.moduleName === "LanguageWiseList"
              ? modelRequestData?.Action === null
                ? "Add Language Wise"
                : "Update Language Wise"
              : modelRequestData?.Action === null
                ? "Add FAQ"
                : "Update FAQ"}
          </h4>

        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
          <div className="container-fluid ">
            <div className="row">
              {/* Question */}
              <div className="col-md-6 mb-3">
                <label htmlFor="pujaName" className="form-label">
                  Question <span className="text-danger">*</span>
                </label>
                <input
                  // maxLength={90}
                  type="text"
                  className="form-control"
                  id="catName"
                  placeholder="Enter Question"
                  aria-describedby="Employee"
                  value={formObj.question}
                  onChange={(e) => {
                    let input = e.target.value;
                    if (input.startsWith(' ')) {
                      input = input.trimStart();
                    }

                    setFormObj((prev) => ({
                      ...prev,
                      question: input
                    }));
                  }}
                />
                {error && (formObj.question === null || formObj.question === undefined || formObj.question === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>

              {/* Answer */}
              <div className="col-md-6 mb-3">
                <label htmlFor="pujaName" className="form-label">
                  Answer <span className="text-danger">*</span>
                </label>
                <input
                  // maxLength={90}
                  type="text"
                  className="form-control"
                  id="catName"
                  placeholder="Enter Answer"
                  aria-describedby="Employee"
                  value={formObj.answer}
                  onChange={(e) => {
                    let input = e.target.value;
                    if (input.startsWith(' ')) {
                      input = input.trimStart();
                    }

                    setFormObj((prev) => ({
                      ...prev,
                      answer: input
                    }));
                  }}
                />
                {error && (formObj.answer === null || formObj.answer === undefined || formObj.answer === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>





              {/* Language Selection */}
              {modelRequestData?.moduleName === 'LanguageWiseList' ? (
                <>
                  <div className="col-md-6 mb-3">
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
              ) : (
                <>
                  {/* Select Service */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="stateID" className="form-label">
                      Select Service
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
                    {/* {error && !formObj?.serviceID && <span className="text-danger">{ERROR_MESSAGES}</span>} */}
                  </div>

                  {/* Select Sub Service */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="stateID" className="form-label">
                      Select Sub Service
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
                        GetModuleTypeLookupListData(formObj.serviceID, selectedOption.value);
                      }}
                      menuPlacement="auto"
                      menuPosition="fixed"
                    />
                    {/* {error && !formObj?.subServiceID && <span className="text-danger">{ERROR_MESSAGES}</span>} */}
                  </div>

                  {/* Select Module */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="stateID" className="form-label">
                      Select Module
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
                    {/* {error && !formObj?.pujaModuleID && <span className="text-danger">{ERROR_MESSAGES}</span>} */}
                  </div>

                </>
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

export default AddUpdateFAQModal;
