




import axios from 'axios';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import Text_Editor from 'component/Text_Editor';
import { ConfigContext } from 'context/ConfigContext';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import { AddUpdateTemplePujaCategory, GetTemplePujaCategoryModel } from 'services/Temples Puja Category/TemplesPujaCategoryApi';


const TemplePujaCategoryAddUpdateModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
      const debounceTimer = useRef(null);
      const { setLoader, user } = useContext(ConfigContext);
      const [error, setError] = useState(false)
      const [customError, setCustomError] = useState(null)
      const [showSuccessModal, setShowSuccessModal] = useState(false)
      const [showErrorModal, setShowErrorModal] = useState(false)
      const [errorMessage, setErrorMessage] = useState(false)
      const [modelAction, setModelAction] = useState(false)


      const [templePujaCatObj, setTemplePujaCatObj] = useState({
            tempPujaCatName: null,
            adminID: null,
            tempPujaCatID: null,
      })

      useEffect(() => {

            if (modelRequestData?.tempPujaCatID !== null && modelRequestData?.Action === "Update") {
                  GetTemplePujaCategoryModelData(modelRequestData.tempPujaCatID)
            }


      }, [modelRequestData.Action])






      const GetTemplePujaCategoryModelData = async (id) => {
            setLoader(true);
            try {
                  const response = await GetTemplePujaCategoryModel(id);

                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false);
                              if (response?.data?.responseData?.data) {
                                    const List = response.data.responseData.data;
                                    setTemplePujaCatObj((prev) => ({
                                          ...prev,
                                          tempPujaCatID: List.tempPujaCatID,
                                          tempPujaCatName: List.tempPujaCatName,

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













      const SubmitBtnClicked = () => {
            let isValid = true
            if (templePujaCatObj?.tempPujaCatName === null || templePujaCatObj?.tempPujaCatName === undefined || templePujaCatObj?.tempPujaCatName === ""
            ) {
                  setError(true)
                  isValid = false
            }

            const apiParam = {
                  adminID: user?.admiN_ID,
                  tempPujaCatID: templePujaCatObj?.tempPujaCatID,
                  tempPujaCatName: templePujaCatObj?.tempPujaCatName,

            }

            if (isValid) {
                  AddUpdateTemplePujaCategoryData(apiParam)
            }
      }

      const AddUpdateTemplePujaCategoryData = async (ApiParam) => {

            setLoader(true);
            try {
                  const response = await AddUpdateTemplePujaCategory(ApiParam);
                  if (response?.data?.statusCode === 200) {
                        setLoader(false);
                        setModelAction(modelRequestData.Action === null ? "Temple puja category has been added successfully !" : "Temple puja category has been updated successfully !")
                        setShowSuccessModal(true)
                        setIsAddUpdateDone(true)
                        // onHide()
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


      return (
            <>
                  <Modal style={{ zIndex: 1300 }} size='md' show={show} backdrop="static" keyboard={false} centered>
                        <Modal.Header>
                              <h4 className="text-center">{modelRequestData?.Action === null ? 'Add Temple Puja Category' : 'Update Temple Puja Category'}</h4>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
                              <div className="container">

                                    {/* Temple Name */}

                                    <label htmlFor="tempPujaCatName" className="form-label">
                                          Enter Temple Puja Category Name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                          maxLength={50}
                                          type="text"
                                          className="form-control"
                                          id="StateName"
                                          placeholder="Temple Puja Category Name"
                                          aria-describedby="Employee"
                                          value={templePujaCatObj.tempPujaCatName}
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

                                                setTemplePujaCatObj(prev => ({
                                                      ...prev,
                                                      tempPujaCatName: updatedValue
                                                }));
                                          }}
                                    />
                                    {error && (!templePujaCatObj?.tempPujaCatName) && (
                                          <span className="text-danger">{ERROR_MESSAGES}</span>
                                    )}





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

export default TemplePujaCategoryAddUpdateModal
