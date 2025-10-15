import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { ConfigContext } from 'context/ConfigContext';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import { GetAppLanguageLookupList } from 'services/Admin/AppLangauge/AppLanguageApi';
import { AddUpdateState, GetStateCategoryModel } from 'services/State/StateApi';
import { AddUpdateTimeSlot, GetTimeSlotCategoryModel } from 'services/TimeSlot/TimeSlot';

const TimeSlotLanguageWiseAddUpdateModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
  const { setLoader, user } = useContext(ConfigContext);
  const [modelAction, setModelAction] = useState(false);
  const [error, setError] = useState(false);
  const [customError, setCustomError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [languageList, setLanguageList] = useState([]);
  const [blogCatObj, setBlogCatObj] = useState({
    adminID: null,
    timeSlotKeyID: null, // Provide Key ID For Update
    timeSlot: null,
    timeSlotByLangKeyID: null,
    appLangID: null
  });

  useEffect(() => {
    if (modelRequestData?.timeSlotKeyID !== null && modelRequestData?.Action === 'Update') {
      GetTimeSlotModelData(modelRequestData.timeSlotKeyID);
    }
  }, [modelRequestData.Action]);

  const SubmitBtnClicked = () => {
    let isValid = true;
    if (
      blogCatObj?.timeSlot === null ||
      blogCatObj?.timeSlot === undefined ||
      blogCatObj?.timeSlot === '' ||
      blogCatObj?.appLangID === null ||
      blogCatObj?.appLangID === undefined ||
      blogCatObj?.appLangID === ''
    ) {
      setError(true);
      isValid = false;
    }
    const apiParam = {
      adminID: user?.admiN_ID,
      timeSlot: blogCatObj?.timeSlot,
      appLangID: blogCatObj?.appLangID,
      timeSlotKeyID: modelRequestData?.timeSlotKeyID,
      timeSlotByLangKeyID: blogCatObj?.timeSlotByLangKeyID
    };

    if (isValid) {
      AddUpdateTimeSlotData(apiParam);
    }
  };

  const AddUpdateTimeSlotData = async (ApiParam) => {
    setLoader(true);
    try {
      const response = await AddUpdateTimeSlot(ApiParam);
      if (response?.data?.statusCode === 200) {
        setLoader(false);
        setLoader(false);
        setModelAction(modelRequestData.Action === null ? 'Time Slot has been added successfully !' : 'Time Slot has been updated successfully !');
        setShowSuccessModal(true);
        setIsAddUpdateDone(true);
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
  useEffect(() => {
    GetAppLanguageLookupListData();
  }, []);

  const GetAppLanguageLookupListData = async () => {
    try {
      const response = await GetAppLanguageLookupList();
      if (response?.data?.statusCode === 200) {
        const list = response?.data?.responseData?.data || [];
        const formattedLangList = list
          .map((Lang) => ({
            value: Lang.appLangID,
            label: Lang.languageName
          }))
          .filter((Lang) => {
            // Always allow the currently selected language in Update
            if (modelRequestData.Action === 'Update' && modelRequestData.appLangID === Lang.value) {
              return true;
            }
            // Otherwise, hide English and already used languages
            return Lang.value !== 1 && !modelRequestData.availableLangID?.includes(Lang.value);
          });

        setLanguageList(formattedLangList);
      } else {
        console.error('Failed to fetch language list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching language list:', error);
    }
  };

  const closeAll = () => {
    setError(false);
    setCustomError(null);
    setShowSuccessModal(false);
    onHide();
  };

  const GetTimeSlotModelData = async (id) => {
    if (!id) {
      return;
    }
    setLoader(true);
    try {
      const response = await GetTimeSlotCategoryModel(id, modelRequestData?.appLangID);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const List = response.data.responseData.data;
            setBlogCatObj((prev) => ({
              ...prev,
              timeSlotKeyID: List.timeSlotKeyID, // Provide Key ID For Update
              timeSlot: List.timeSlot,
              appLangID: List.appLangID,
              timeSlotByLangKeyID: List.timeSlotByLangKeyID
            }));
            if (List?.dayID?.length == 7) {
              setAllDaySelected(true);
            }
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

  return (
    <>
      <Modal style={{ zIndex: 1300 }} size="md" show={show} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <h4 className="text-center">{modelRequestData?.Action === null ? 'Add Time Slot Language' : 'Update Time Slot Language'}</h4>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
          <div className="container-fluid ">
            <div className="row">
              <div className="col-md-12 mb-3">
                <label htmlFor="stateID" className="form-label">
                  Select Language <span className="text-danger">*</span>
                </label>
                <Select
                  options={languageList}
                  value={languageList?.filter((v) => v?.value === blogCatObj?.appLangID)}
                  onChange={(selectedOption) => {
                    setBlogCatObj((prev) => ({
                      ...prev,
                      appLangID: selectedOption ? selectedOption.value : null
                    }));
                  }}
                  menuPlacement="auto"
                  menuPosition="fixed"
                />
                {error && !blogCatObj?.appLangID && <span className="text-danger">{ERROR_MESSAGES}</span>}
              </div>
              {/* Blog Title */}
              <div className="col-md-12 mb-3">
                <label htmlFor="blogTitle" className="form-label">
                  Time Slot<span className="text-danger">*</span>
                </label>
                <input
                  maxLength={50}
                  type="text"
                  className="form-control"
                  id="timeSlot"
                  placeholder="Enter Time Slot"
                  aria-describedby="Employee"
                  value={blogCatObj.timeSlot}
                  onChange={(e) => {
                    setErrorMessage(false);
                    let inputValue = e.target.value;
                    // Prevent input if empty or only a leading space
                    if (inputValue.length === 0 || (inputValue.length === 1 && inputValue === ' ')) {
                      inputValue = '';
                    }
                    // ✅ Allow: letters (any script), numbers, marks (matras), spaces, and punctuation
                    const cleanedValue = inputValue.replace(/[^\p{L}\p{M}\p{N}\s.,!?'"()\-]/gu, '');

                    // Trim only leading spaces
                    const trimmedValue = cleanedValue.trimStart();

                    // ✅ Capitalize only English words, leave Indian scripts untouched
                    const updatedValue = trimmedValue
                      .split(' ')
                      .map((word) => {
                        if (/^[a-zA-Z]/.test(word)) {
                          return word.charAt(0).toUpperCase() + word.slice(1);
                        }
                        return word; // keep Hindi/Marathi/Gujarati/etc. as is
                      })
                      .join(' ');

                    setBlogCatObj((prev) => ({
                      ...prev,
                      timeSlot: updatedValue
                    }));
                  }}
                />
                {error && (blogCatObj.timeSlot === null || blogCatObj.timeSlot === undefined || blogCatObj.timeSlot === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
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
      <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={modelAction} />
      <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
    </>
  );
};

export default TimeSlotLanguageWiseAddUpdateModal;
