
import Select from 'react-select';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import Text_Editor from 'component/Text_Editor';
import { ConfigContext } from 'context/ConfigContext';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import {
      GetTemplePujaCategoryLookupList,

} from 'services/Temples Puja Category/TemplesPujaCategoryApi';
import { AddUpdateTemplePujaSubCategory, GetTemplePujaSubCategoryModel } from 'services/Temple Puja Sub Category/TemplesPujaSubCategoryApi';


const TemplePujaSubCategoryAddUpdateModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
      const debounceTimer = useRef(null);
      const { setLoader, user } = useContext(ConfigContext);
      const [error, setError] = useState(false)
      const [customError, setCustomError] = useState(null)
      const [showSuccessModal, setShowSuccessModal] = useState(false)
      const [showErrorModal, setShowErrorModal] = useState(false)
      const [errorMessage, setErrorMessage] = useState(false)
      const [modelAction, setModelAction] = useState(false)

      const [pujaCategoryOption, setPujaCategoryOption] = useState([])
      const [templePujaSubCatObj, setTemplePujaSubCatObj] = useState({
            tempPujaSubCatName: null,
            adminID: null,
            tempPujaSubCatID: null,
            tempPujaCatID: null,
      })

      useEffect(() => {

            if (modelRequestData?.tempPujaSubCatID !== null && modelRequestData?.Action === "Update") {
                  GetTemplePujaSubCategoryModelData(modelRequestData.tempPujaSubCatID)
            }


      }, [modelRequestData.Action])



      useEffect(() => {
            GetTemplePujaCategoryLookupListData()
      }, [])
      const GetTemplePujaCategoryLookupListData = async () => {


            try {
                  let response = await GetTemplePujaCategoryLookupList();
                  if (response?.data?.statusCode === 200) {
                        const cityList = response?.data?.responseData?.data || [];
                        const formattedCityList = cityList.map((city) => ({
                              value: city.tempPujaCatID,
                              label: city.tempPujaCatName
                        }));

                        setPujaCategoryOption(formattedCityList); // Ensure this is called with correct data
                  } else {
                        console.error('Bad request');
                  }
            } catch (error) {
                  console.log(error);
            }
      };

      const GetTemplePujaSubCategoryModelData = async (id) => {
            setLoader(true);
            try {
                  const response = await GetTemplePujaSubCategoryModel(id);

                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false);
                              if (response?.data?.responseData?.data) {
                                    const List = response.data.responseData.data;
                                    setTemplePujaSubCatObj((prev) => ({
                                          ...prev,
                                          tempPujaCatID: List.tempPujaCatID,
                                          tempPujaSubCatName: List.tempPujaSubCatName,
                                          tempPujaSubCatID: List.tempPujaSubCatID,


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
            if (
                  templePujaSubCatObj?.tempPujaSubCatName === null || templePujaSubCatObj?.tempPujaSubCatName === undefined || templePujaSubCatObj?.tempPujaSubCatName === "" ||
                  templePujaSubCatObj?.tempPujaCatID === null || templePujaSubCatObj?.tempPujaCatID === undefined || templePujaSubCatObj?.tempPujaCatID === ""
            ) {
                  setError(true)
                  isValid = false
            }

            const apiParam = {
                  adminID: user?.admiN_ID,
                  tempPujaCatID: templePujaSubCatObj?.tempPujaCatID,
                  tempPujaSubCatID: templePujaSubCatObj?.tempPujaSubCatID,
                  tempPujaSubCatName: templePujaSubCatObj?.tempPujaSubCatName,

            }

            if (isValid) {
                  AddUpdateTemplePujaSubCategoryData(apiParam)
            }
      }

      const AddUpdateTemplePujaSubCategoryData = async (ApiParam) => {

            setLoader(true);
            try {
                  const response = await AddUpdateTemplePujaSubCategory(ApiParam);
                  if (response?.data?.statusCode === 200) {
                        setLoader(false);
                        setModelAction(modelRequestData.Action === null ? "Temple puja sub category has been added successfully !" : "Temple puja sub category has been updated successfully !")
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
      const handleStateChange = (selectedOption) => {
            setTemplePujaSubCatObj((prev) => ({
                  ...prev,
                  tempPujaCatID: selectedOption ? selectedOption.value : null,
                  // talukaName:''
            }));
      };

      return (
            <>
                  <Modal style={{ zIndex: 1300 }} size='md' show={show} backdrop="static" keyboard={false} centered>
                        <Modal.Header>
                              <h4 className="text-center">{modelRequestData?.Action === null ? 'Add Temple Puja Category' : 'Update Temple Puja Category'}</h4>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
                              <div className="container">
                                    <div className="row">
                                          {/* Temple Name */}
                                          <div>

                                                <label htmlFor="tempPujaCatName" className="form-label">
                                                      Select Temple Puja Category  <span className="text-danger">*</span>
                                                </label>
                                                <Select
                                                      options={pujaCategoryOption}
                                                      value={pujaCategoryOption.filter((item) => item.value === templePujaSubCatObj.tempPujaCatID)}
                                                      onChange={handleStateChange}
                                                      menuPosition="fixed"
                                                />
                                                {error && (!templePujaSubCatObj?.tempPujaCatID) && (
                                                      <span className="text-danger">{ERROR_MESSAGES}</span>
                                                )}

                                          </div>
                                          <div className='mt-2'>

                                                <label htmlFor="tempPujaCatName" className="form-label">
                                                      Enter Temple Puja Sub Category <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                      maxLength={50}
                                                      type="text"
                                                      className="form-control"
                                                      id="StateName"
                                                      placeholder="Enter Temple Puja Category Name"
                                                      aria-describedby="Employee"
                                                      value={templePujaSubCatObj.tempPujaSubCatName}
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

                                                            setTemplePujaSubCatObj(prev => ({
                                                                  ...prev,
                                                                  tempPujaSubCatName: updatedValue
                                                            }));
                                                      }}
                                                />
                                                {error && (!templePujaSubCatObj?.tempPujaSubCatName) && (
                                                      <span className="text-danger">{ERROR_MESSAGES}</span>
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

export default TemplePujaSubCategoryAddUpdateModal

