import axios from 'axios';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { ConfigContext } from 'context/ConfigContext';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import React, { useContext, useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import { AddUpdateState, GetStateCategoryModel } from 'services/State/StateApi';
import Select from 'react-select';

const StateAddUpdateModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
      const { setLoader, user } = useContext(ConfigContext);
      const [modelAction, setModelAction] = useState(false)
      const [error, setError] = useState(false)
      const [customError, setCustomError] = useState(null)
      const [errorMessage, setErrorMessage] = useState(null)
      const [showSuccessModal, setShowSuccessModal] = useState(false)
      const [showErrorModal, setShowErrorModal] = useState(false)
      const [state, setState] = useState({
            adminID: null,
            stateKeyID: null, // Provide Key ID For Update
            stateName: null,
            appLangID: null,
      })

      useEffect(() => {
            if (modelRequestData?.stateKeyID !== null && modelRequestData?.Action === "Update") {
                  GetStateModelData(modelRequestData.stateKeyID)
            }
      }, [modelRequestData.Action])

      const languageList = [
            { value: 'en', label: 'English' },
            { value: 'hi', label: 'Hindi' },
            { value: 'fr', label: 'French' },
      ];


      const SubmitBtnClicked = () => {
            let isValid = true
            if (
                  state?.stateName === null || state?.stateName === undefined || state?.stateName === ""
            ) {
                  setError(true)
                  isValid = false
            }
            const apiParam = {
                  adminID: user?.adminID,
                  stateName: state?.stateName,
                  stateKeyID: state?.stateKeyID,

            }
            if (isValid) {
                  // console.log("payload ==>>", apiParam)
                  AddUpdateStateData(apiParam)
            }
      }

      const AddUpdateStateData = async (ApiParam) => {
            setLoader(true);
            try {
                  const response = await AddUpdateState(ApiParam);
                  if (response?.data?.statusCode === 200) {
                        setLoader(false);
                        setLoader(false);
                        setModelAction(modelRequestData.Action === null ? "State has been added successfully !" : "State has been updated successfully !")
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

      const GetStateModelData = async (id) => {
            if (!id) {
                  return
            }
            setLoader(true);
            try {
                  const response = await GetStateCategoryModel(id);
                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false);
                              if (response?.data?.responseData?.data) {
                                    const List = response.data.responseData.data;
                                    setState((prev) => ({
                                          ...prev,
                                          stateKeyID: List.stateKeyID, // Provide Key ID For Update
                                          stateName: List.stateName,
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
                              <h4 className="text-center">{modelRequestData?.Action === null ? 'Add State Details' : 'Update State Details'}</h4>
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
                                                      value={languageList.find(lang => lang.value === 'en')} // select English by default
                                                      isDisabled
                                                      menuPlacement="auto"
                                                      menuPosition="fixed"
                                                />

                                          </div>



                                          <div className="col-md-12 mb-3">
                                                <label htmlFor="stateTitle" className="form-label">
                                                      State Name<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                      maxLength={50}
                                                      type="text"
                                                      className="form-control"
                                                      id="StateName"
                                                      placeholder="Enter State Name"
                                                      aria-describedby="Employee"
                                                      value={state.stateName}
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

                                                            setState(prev => ({
                                                                  ...prev,
                                                                  stateName: updatedValue
                                                            }));
                                                      }}
                                                />
                                                {error && (state.stateName === null || state.stateName === undefined || state.stateName === '') ? (
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

export default StateAddUpdateModal
