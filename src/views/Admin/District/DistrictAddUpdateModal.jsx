import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { ConfigContext } from 'context/ConfigContext';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import React, { useContext, useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import { GetBlogCategoryModel } from 'services/Blog/BlogCategoryApi';
import { GetStateLookupList } from 'services/State/StateApi';
import { AddUpdateDistrict, GetDistrictModel } from 'services/District/DistrictApi';
import { GetAppLanguageLookupList } from 'services/Admin/AppLangauge/AppLanguageApi';

const DistrictAddUpdateModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
      const { setLoader, user } = useContext(ConfigContext);
      const [modelAction, setModelAction] = useState(false)
      const [error, setError] = useState(false)
      const [customError, setCustomError] = useState(null)
      const [errorMessage, setErrorMessage] = useState(null)
      const [showSuccessModal, setShowSuccessModal] = useState(false)
      const [showErrorModal, setShowErrorModal] = useState(false)
      const [statesList, setStatesList] = useState([])
      const [languageList, setLanguageList] = useState([])
      const [blogCatObj, setBlogCatObj] = useState({
            adminID: user.admiN_ID,
            districtKeyID: null,
            districtByLangKeyID: null,
            stateID: null,
            // stateName, "",
            districtName: "",
            appLangID: null,
      })

      useEffect(() => {
            if (modelRequestData?.districtKeyID !== null && modelRequestData?.Action === "Update") {
                  GetDistrictModelData(modelRequestData.districtKeyID)
            }
      }, [show])


      useEffect(() => {
            GetStateLookupListData()
            // GetAppLanguageLookupListData()
      }, [])


      //language lookup list
      // const GetAppLanguageLookupListData = async () => {

      //       try {
      //             const response = await GetAppLanguageLookupList(); // Ensure it's correctly imported

      //             if (response?.data?.statusCode === 200) {
      //                   const list = response?.data?.responseData?.data || [];
      //                   const formattedLangList = list.map((Lang) => ({
      //                         value: Lang.appLangID,
      //                         label: Lang.languageName,
      //                   }));
      //                   const filteredList = formattedLangList?.filter(((prev) => prev.value !== 1))
      //                   setLanguageList(filteredList);
      //             } else {
      //                   console.error(
      //                         "Failed to fetch sim Type lookup list:",
      //                         response?.data?.statusMessage || "Unknown error"
      //                   );
      //             }
      //       } catch (error) {
      //             console.error("Error fetching sim Type lookup list:", error);
      //       }
      // }; //in case if need to update language dynamically

      const GetStateLookupListData = async () => {
            // debugger;
            try {
                  const response = await GetStateLookupList();

                  if (response?.data?.statusCode === 200) {
                        const list = response?.data?.responseData?.data || [];

                        const formattedLangList = list
                              .map((Lang) => ({
                                    value: Lang.stateID,
                                    label: Lang.stateName,
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

                        setStatesList(formattedLangList);
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


      const SubmitBtnClicked = () => {
            let isValid = true
            if (
                  blogCatObj?.districtName === null || blogCatObj?.districtName === undefined || blogCatObj?.districtName === ""
            ) {
                  setError(true)
                  isValid = false
            }
            const apiParam = {
                  // adminID: user?.adminID,
                  //  templePujaID: modelRequestData?.templePujaID,
                  // districtName: blogCatObj?.districtName,
                  // districtKeyID: blogCatObj?.districtKeyID,

            }

            if (isValid) {
                  AddUpdateDistrictData({ ...blogCatObj })
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

      const closeAll = () => {
            setError(false);
            setCustomError(null);
            setShowSuccessModal(false)
            onHide()
      }


      const GetDistrictModelData = async (id) => {
            if (!id) {
                  return
            }
            setLoader(true);
            try {
                  const response = await GetDistrictModel(id);

                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false);
                              if (response?.data?.responseData?.data) {
                                    const List = response.data.responseData.data;
                                    console.log("list records ==>>", List)
                                    setBlogCatObj((prev) => ({
                                          ...prev,
                                          districtKeyID: List.districtKeyID, // Provide Key ID For Update
                                          districtName: List.districtName,
                                          // stateName: statesList.find((x) => x.value === List.stateId)?.value,
                                          stateID: List.stateID
                                          // stateName: statesList.find((x) => x.value === List.stateID)?.label
                                    }))
                                    console.log(("state name value ==>>", statesList.find((x) => x.value === List.stateId)?.value))
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

      const languageList1 = [
            { value: 'en', label: 'English' },
            { value: 'hi', label: 'Hindi' },
            { value: 'fr', label: 'French' },
      ];

      return (
            <>
                  <Modal style={{ zIndex: 1300 }} size='md' show={show} backdrop="static" keyboard={false} centered>
                        <Modal.Header>
                              <h4 className="text-center">{modelRequestData?.Action === null ? 'Add District' : 'Update District'}</h4>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
                              <div className="container-fluid ">

                                    <div className="row">

                                          <div className="col-md-12 mb-3">
                                                <label htmlFor="stateID" className="form-label">
                                                      Select Language <span className="text-danger">*</span>
                                                </label>
                                                <Select
                                                      options={languageList1}
                                                      value={languageList1.find(lang => lang.value === 'en')} // select English by default
                                                      isDisabled
                                                      menuPlacement="auto"
                                                      menuPosition="fixed"
                                                />

                                          </div>


                                          {/* Blog Title */}
                                          <div className="col-md-12 mb-3">
                                                <label htmlFor="stateTitle" className="form-label">
                                                      Select State
                                                </label>
                                                <Select
                                                      options={statesList || []} //pass state array
                                                      value={statesList.filter((item) => item.value === blogCatObj.stateID)}
                                                      onChange={(value) => {

                                                            setBlogCatObj({ ...blogCatObj, stateID: value.value })
                                                      }}
                                                      // isDisabled
                                                      menuPlacement="auto"
                                                      menuPosition="fixed"
                                                />
                                          </div>

                                          <div className="col-md-12 mb-3">
                                                <label htmlFor="districtTitle" className="form-label">
                                                      District Name<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                      maxLength={50}
                                                      type="text"
                                                      className="form-control"
                                                      id="DistrictName"
                                                      placeholder="Enter District Name"
                                                      aria-describedby="Employee"
                                                      value={blogCatObj.districtName}
                                                      onChange={(e) => {
                                                            setErrorMessage(false);
                                                            let inputValue = e.target.value;

                                                            // Prevent input if empty or only a leading space
                                                            if (inputValue.length === 0 || (inputValue.length === 1 && inputValue === ' ')) {
                                                                  inputValue = '';
                                                            }

                                                            // Remove unwanted characters (allow letters, numbers, spaces)
                                                            const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                                                            // Trim only leading spaces
                                                            const trimmedValue = cleanedValue.trimStart();

                                                            // Capitalize first letter of every word
                                                            const updatedValue = trimmedValue
                                                                  .split(' ')
                                                                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
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

export default DistrictAddUpdateModal

