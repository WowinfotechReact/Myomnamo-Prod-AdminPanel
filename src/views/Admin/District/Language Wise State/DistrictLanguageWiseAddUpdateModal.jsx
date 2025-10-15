import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { ConfigContext } from 'context/ConfigContext';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import React, { useContext, useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import { AddUpdateBlogCategory, GetBlogCategoryModel } from 'services/Blog/BlogCategoryApi';
import { GetAppLanguageLookupList } from 'services/Admin/AppLangauge/AppLanguageApi';
import { AddUpdateDistrict, GetDistrictModel } from 'services/District/DistrictApi';


const DistrictLanguageWiseAddUpdateModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
      const { setLoader, user } = useContext(ConfigContext);
      const [modelAction, setModelAction] = useState(false)
      const [error, setError] = useState(false)
      const [customError, setCustomError] = useState(null)
      const [errorMessage, setErrorMessage] = useState(null)
      const [showSuccessModal, setShowSuccessModal] = useState(false)
      const [showErrorModal, setShowErrorModal] = useState(false)
      const [languageList, setLanguageList] = useState([])
      const [blogCatObj, setBlogCatObj] = useState({
            adminID: null,
            districtKeyID: null, // Provide Key ID For Update
            districtName: null,
            districtByLangKeyID: null,
            appLangID: null,
            stateName: null,
            // stateId: null,
      })

      useEffect(() => {
            GetAppLanguageLookupListData()
      }, [])

      useEffect(() => {

            if (modelRequestData?.districtKeyID !== null && modelRequestData?.Action === "Update") {
                  GetDistrictModelData(modelRequestData.districtKeyID)
            }


      }, [modelRequestData.Action])




      const SubmitBtnClicked = () => {
            // debugger
            let isValid = true
            if (

                  blogCatObj?.districtName === null || blogCatObj?.districtName === undefined || blogCatObj?.districtName === "" ||
                  blogCatObj?.appLangID === null || blogCatObj?.appLangID === undefined || blogCatObj?.appLangID === ""
            ) {
                  setError(true)
                  isValid = false
            }

            const apiParam = {
                  adminID: user?.admiN_ID,
                  districtName: blogCatObj?.districtName,
                  appLangID: blogCatObj?.appLangID,
                  districtKeyID: modelRequestData?.districtKeyID,
                  districtByLangKeyID: blogCatObj?.districtByLangKeyID,

            }

            if (isValid) {
                  AddUpdateDistrictData(apiParam)
            }
      }



      const AddUpdateDistrictData = async (ApiParam) => {

            setLoader(true);
            try {
                  const response = await AddUpdateDistrict(ApiParam);
                  if (response?.data?.statusCode === 200) {
                        setLoader(false);
                        setLoader(false);
                        setModelAction(modelRequestData.Action === null ? "District has been added successfully !" : "District has been updated successfully !")
                        setShowSuccessModal(true)
                        setIsAddUpdateDone(true)
                  } else {
                        console.error(response?.response?.data?.errorMessage);
                        setCustomError(response?.response?.data?.errorMessage)
                        setShowErrorModal(true)
                        setLoader(false);
                  }
            } catch (error) {
                  setLoader(false);
                  console.log(error);
            }
      }



      const GetAppLanguageLookupListData = async () => {
            try {
                  const response = await GetAppLanguageLookupList();
                  if (response?.data?.statusCode === 200) {
                        const list = response?.data?.responseData?.data || [];
                        const formattedLangList = list
                              .map((Lang) => ({
                                    value: Lang.appLangID,
                                    label: Lang.languageName,
                              }))
                              .filter((Lang) => {
                                    // Always allow the currently selected language in Update
                                    if (
                                          modelRequestData.Action === 'Update' &&
                                          modelRequestData.appLangID === Lang.value
                                    ) {
                                          return true;
                                    }
                                    // Otherwise, hide English and already used languages
                                    return (
                                          Lang.value !== 1 &&
                                          !modelRequestData.availableLangID?.includes(Lang.value)
                                    );
                              });

                        setLanguageList(formattedLangList);
                  } else {
                        console.error(
                              "Failed to fetch language list:",
                              response?.data?.statusMessage || "Unknown error"
                        );
                  }
            } catch (error) {
                  console.error("Error fetching language list:", error);
            }
      };

      const GetDistrictModelData = async (id) => {
            if (!id) {
                  return
            }
            setLoader(true);
            try {
                  const response = await GetDistrictModel(id, modelRequestData?.appLangID);

                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false);
                              if (response?.data?.responseData?.data) {
                                    const List = response.data.responseData.data;
                                    setBlogCatObj((prev) => ({
                                          ...prev,
                                          districtKeyID: List.districtKeyID, // Provide Key ID For Update
                                          districtName: List.districtName,
                                          appLangID: List.appLangID,
                                          districtByLangKeyID: List.districtByLangKeyID
                                    }))

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
      }

      const closeAll = () => {
            setError(false);
            setCustomError(null);
            setShowSuccessModal(false)
            onHide()

      }


      const GetBlogCategoryModelData = async (id) => {
            if (!id) {
                  return
            }
            setLoader(true);
            try {
                  const response = await GetBlogCategoryModel(id, modelRequestData?.appLangID);

                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false);
                              if (response?.data?.responseData?.data) {
                                    const List = response.data.responseData.data;
                                    setBlogCatObj((prev) => ({
                                          ...prev,

                                          districtKeyID: List.districtKeyID, // Provide Key ID For Update
                                          districtName: List.districtName,
                                          appLangID: List.appLangID,
                                          districtByLangKeyID: List.districtByLangKeyID



                                    }))
                                    if (List?.dayID?.length == 7) {
                                          setAllDaySelected(true)
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
      }


      return (
            <>
                  <Modal style={{ zIndex: 1300 }} size='md' show={show} backdrop="static" keyboard={false} centered>
                        <Modal.Header>
                              <h4 className="text-center">{modelRequestData?.Action === null ? 'Add District' : 'Update District'}</h4>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
                              <div className="container-fluid ">

                                    <div className="row">
                                          {/* <div className="col-md-12 mb-3">
                                                <label htmlFor="stateTitle" className="form-label">
                                                      Select State
                                                </label>
                                                <Select
                                                      // options={languageList || []} //pass state array
                                                      value={blogCatObj.stateName} // select English by default
                                                      // onChange={(value) => {

                                                      //       setBlogCatObj({ ...blogCatObj, stateID: value.value })
                                                      // }}
                                                      isDisabled
                                                      menuPlacement="auto"
                                                      menuPosition="fixed"
                                                />
                                          </div> */}

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
                                                                  appLangID: selectedOption ? selectedOption.value : null,
                                                            }))
                                                      }
                                                      }
                                                      menuPlacement="auto"
                                                      menuPosition="fixed"
                                                />
                                                {error && (!blogCatObj?.appLangID) && (
                                                      <span className="text-danger">{ERROR_MESSAGES}</span>
                                                )}
                                          </div>
                                          {/* Blog Title */}
                                          <div className="col-md-12 mb-3">
                                                <label htmlFor="districtName" className="form-label">
                                                      District Name<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                      maxLength={50}
                                                      type="text"
                                                      className="form-control"
                                                      id="DistrictName"
                                                      placeholder="Enter District Name"
                                                      aria-describedby="District"
                                                      value={blogCatObj.districtName}
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
                                                                  .map(word => {
                                                                        if (/^[a-zA-Z]/.test(word)) {
                                                                              return word.charAt(0).toUpperCase() + word.slice(1);
                                                                        }
                                                                        return word; // keep Hindi/Marathi/Gujarati/etc. as is
                                                                  })
                                                                  .join(' ');

                                                            setBlogCatObj(prev => ({
                                                                  ...prev,
                                                                  districtName: updatedValue
                                                            }));
                                                      }}
                                                />
                                                {error && (blogCatObj.districtName === null || blogCatObj.districtName === undefined || blogCatObj.districtName === '') ? (
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
                  </Modal >
                  <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={modelAction} />
                  <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
            </>
      )
}

export default DistrictLanguageWiseAddUpdateModal
