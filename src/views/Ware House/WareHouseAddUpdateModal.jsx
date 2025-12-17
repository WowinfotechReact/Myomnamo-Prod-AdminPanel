




import React, { useContext, useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES, poojaCatAddMsg, poojaCatUpdateMsg } from 'component/GlobalMassage';
import { GetShopModel } from 'services/Shop/ShopApi';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';

import CustomUploadImg from '../../assets/images/upload_img.jpg'
import { UploadImage } from 'services/Upload Cloud-flare Image/UploadCloudflareImageApi';
import { AddUpdatePujaCategory, GetPujaCategoryModel } from 'services/Pooja Category/PoojaCategoryApi';
import { AddUpdateWareHouse, GetWareHouseModel } from 'services/Warehouse/WareHouseApi';

const WareHouseAddUpdateModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
      const { setLoader, user } = useContext(ConfigContext);
      const [error, setError] = useState(false)
      const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
      const [customError, setCustomError] = useState(null)
      const [showSuccessModal, setShowSuccessModal] = useState(false)
      const [showErrorModal, setShowErrorModal] = useState(false)
      const [errorMessage, setErrorMessage] = useState();
      const [wareHouseObj, setWareHouseObj] = useState({
            adminID: null,
            warehouseKeyID: null,
            warehouseName: null,
            address: null
      })





      useEffect(() => {
            if (modelRequestData?.Action === 'Update') {
                  if (modelRequestData?.warehouseKeyID !== null) {
                        GetWareHouseModelData(modelRequestData?.warehouseKeyID)

                  }
            }
      }, [modelRequestData?.Action]);

      const GetWareHouseModelData = async (id) => {
            setLoader(true);
            if (id === undefined) {
                  return;
            }

            try {
                  const response = await GetWareHouseModel(id);

                  if (response) {

                        if (response?.data?.statusCode === 200) {
                              console.log(response.data.responseData.data, 'dsadasd3242');

                              setLoader(false);
                              const ModelData = response.data.responseData.data; // Assuming data is an array

                              setWareHouseObj({
                                    ...wareHouseObj,
                                    warehouseKeyID: ModelData.warehouseKeyID,
                                    address: ModelData.address,
                                    warehouseName: ModelData.warehouseName,
                              });


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
            if (wareHouseObj?.warehouseName === null || wareHouseObj?.warehouseName === undefined || wareHouseObj?.warehouseName === '' ||

                  wareHouseObj?.address === null || wareHouseObj?.address === undefined || wareHouseObj?.address === ''


            ) {
                  setError(true);
                  isValid = false
            }
            const ApiParam = {
                  adminID: user?.adminID,
                  warehouseName: wareHouseObj?.warehouseName,
                  address: wareHouseObj?.address,
                  warehouseKeyID: wareHouseObj?.warehouseKeyID,

            }
            if (isValid) {
                  AddUpdateWareHouseData(ApiParam)
            }
      }
      const AddUpdateWareHouseData = async (ApiParam) => {

            setLoader(true);
            try {
                  const response = await AddUpdateWareHouse(ApiParam);
                  if (response?.data?.statusCode === 200) {
                        setLoader(false);
                        setShowSuccessModal(true)
                        setIsAddUpdateDone(true)
                        onHide()
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
            onHide()
            setError(false);
            setCustomError(null);
            setShowSuccessModal(false)

      }





      return (
            <>
                  <Modal style={{ zIndex: 1300 }} show={show} backdrop="static" keyboard={false} centered>
                        <Modal.Header>
                              <h4 className="text-center">{modelRequestData?.Action === null ? 'Add Warehouse' : 'Update Warehouse'}</h4>
                        </Modal.Header>
                        <Modal.Body>
                              <div className="container">
                                    <div className="row">
                                          {/* Vendor Name */}
                                          <div >
                                                <label htmlFor="shopName" className="form-label">
                                                      Warehouse Name <span className="text-danger">*</span>
                                                </label>


                                                <input
                                                      maxLength={50}
                                                      type="text"
                                                      className="form-control"
                                                      id="StateName"
                                                      placeholder="Enter Warehouse Name"
                                                      aria-describedby="Employee"
                                                      value={wareHouseObj.warehouseName}
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

                                                            setWareHouseObj(prev => ({
                                                                  ...prev,
                                                                  warehouseName: updatedValue
                                                            }));
                                                      }}
                                                />
                                                {error && (wareHouseObj?.warehouseName === null || wareHouseObj?.warehouseName === undefined || wareHouseObj?.warehouseName === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}

                                          </div>
                                          <div className='mt-1' >
                                                <label htmlFor="shopName" className="form-label">
                                                      Warehouse Address <span className="text-danger">*</span>
                                                </label>


                                                <textarea
                                                      maxLength={500}
                                                      type="text"
                                                      className="form-control"
                                                      id="StateName"
                                                      placeholder="Enter Warehouse Address"
                                                      aria-describedby="Employee"
                                                      value={wareHouseObj.address}
                                                      onChange={(e) => {
                                                            debugger
                                                            setErrorMessage(false);
                                                            let inputValue = e.target.value;

                                                            // Prevent input if empty or only a leading space
                                                            if (inputValue.length === 0 || (inputValue.length === 1 && inputValue === ' ')) {
                                                                  inputValue = '';
                                                            }

                                                            // Remove unwanted characters (allow letters, numbers, spaces)
                                                            // const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

                                                            // Trim only leading spaces
                                                            const trimmedValue = inputValue.trimStart();

                                                            // Capitalize first letter of every word
                                                            const updatedValue = trimmedValue
                                                                  .split(' ')
                                                                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                                  .join(' ');

                                                            setWareHouseObj(prev => ({
                                                                  ...prev,
                                                                  address: updatedValue
                                                            }));
                                                      }}
                                                />
                                                {error && (wareHouseObj?.address === null || wareHouseObj?.address === undefined || wareHouseObj?.address === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}

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
                  <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={modelRequestData?.Action === null ? poojaCatAddMsg : poojaCatUpdateMsg} />
                  <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
            </>
      )
}

export default WareHouseAddUpdateModal
