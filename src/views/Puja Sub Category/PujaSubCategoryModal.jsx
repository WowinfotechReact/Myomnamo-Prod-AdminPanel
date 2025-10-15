

import React, { useContext, useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css';
import Select from 'react-select';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES, poojaCatAddMsg, poojaCatUpdateMsg } from 'component/GlobalMassage';
import { AddUpdateShop, GetShopModel } from 'services/Shop/ShopApi';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';

import CustomUploadImg from '../../assets/images/upload_img.jpg'

const PujaSubCategoryModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
      const { setLoader, user } = useContext(ConfigContext);
      const [error, setError] = useState(false)
      const [customError, setCustomError] = useState(null)
      const [showSuccessModal, setShowSuccessModal] = useState(false)
      const [showErrorModal, setShowErrorModal] = useState(false)
      const [pujaSubCatObj, setSubPujaSubCatObj] = useState({
            pujaCatId: null,
            subPujaCatName: null,


      })



      const [filePreview, setFilePreview] = useState(null);
      const [sizeError, setSizeError] = useState("");

      useEffect(() => {
            if (show) {
                  if (modelRequestData?.Action === 'update' && (modelRequestData?.shopID !== null && modelRequestData?.shopID !== undefined && modelRequestData?.shopID !== '')) {
                        GetShopModelData()
                  }
            }
      }, [show])

      const GetShopModelData = async () => {
            setLoader(true);
            try {
                  const response = await GetShopModel(modelRequestData?.shopID);

                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false);
                              if (response?.data?.responseData?.data) {
                                    const List = response.data.responseData.data;
                                    setSubPujaSubCatObj((prev) => ({
                                          ...prev,
                                          shopName: List?.shopName,
                                          shopCode: List?.shopCode,
                                          ownerName: List?.ownerName,
                                          contactNumber: List?.contactNumber,
                                          emailID: List?.emailID,
                                          address: List?.address
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
            if (pujaSubCatObj?.pujaCatId === null || pujaSubCatObj?.pujaCatId === undefined || pujaSubCatObj?.pujaCatId === '' ||
                  pujaSubCatObj?.poojaImg === null || pujaSubCatObj?.poojaImg === undefined || pujaSubCatObj?.poojaImg === '' ||
                  pujaSubCatObj?.subPujaCatName === null || pujaSubCatObj?.subPujaCatName === undefined || pujaSubCatObj?.subPujaCatName === ''


            ) {
                  setError(true);
                  isValid = false
            }
            const ApiParam = {
                  adminID: user?.admiN_ID,
                  // shopID: modelRequestData?.shopID,
                  poojaImg: pujaSubCatObj?.poojaImg,
                  subPujaCatName: pujaSubCatObj?.subPujaCatName,
                  pujaCatId: pujaSubCatObj?.pujaCatId,

            }
            if (isValid) {
                  AddUpdateShopData(ApiParam)
            }
      }
      const AddUpdateShopData = async (ApiParam) => {
            setLoader(true);
            try {
                  const response = await AddUpdateShop(ApiParam);
                  if (response?.data?.statusCode === 200) {
                        setLoader(false);
                        setShowSuccessModal(true)
                        setIsAddUpdateDone(true)
                        onHide()
                  } else {
                        console.error(response?.data?.errorMessage);
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



      const handleImageChange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Allowed types
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            if (!allowedTypes.includes(file.type)) {
                  setSizeError("Only JPG, JPEG, PNG files are allowed.");
                  return;
            }

            // Size check (10 MB)
            if (file.size > 10 * 1024 * 1024) {
                  setSizeError("File size must be less than 10 MB.");
                  return;
            }

            setSizeError("");
            setSubPujaSubCatObj((prev) => ({ ...prev, poojaImg: file }));

            // Preview
            const reader = new FileReader();
            reader.onloadend = () => setFilePreview(reader.result);
            reader.readAsDataURL(file);
      };

      const handleRemoveImage = () => {
            setSubPujaSubCatObj((prev) => ({ ...prev, poojaImg: null }));
            setFilePreview(null);
      };
      const handleDistrictChange = (selectedOption) => {
            // setCustomerObj((prev) => ({
            //       ...prev,
            //       districtID: selectedOption ? selectedOption.value : ''
            // }));
      };
      return (
            <>
                  <Modal style={{ zIndex: 1300 }} show={show} backdrop="static" keyboard={false} centered>
                        <Modal.Header>
                              <h4 className="text-center">{modelRequestData?.Action === null ? 'Add Puja Sub Category' : 'Update Puja Sub Category'}</h4>
                        </Modal.Header>
                        <Modal.Body>
                              <div className="container">
                                    <div className="row">
                                          {/* Vendor Name */}
                                          <div >
                                                <label htmlFor="shopName" className="form-label">
                                                      Select Puja Category <span className="text-danger">*</span>
                                                </label>
                                                <Select
                                                      // options={districtOption}
                                                      // value={districtOption.filter((item) => item.value === customerObj.districtID)}
                                                      onChange={handleDistrictChange}
                                                      menuPosition="fixed"
                                                />
                                                {error && (pujaSubCatObj?.shopName === null || pujaSubCatObj?.shopName === undefined || pujaSubCatObj?.shopName === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}

                                          </div>
                                          <div >
                                                <label htmlFor="shopName" className="form-label">
                                                      Enter Sub Puja Category <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                      type="text"
                                                      className="form-control"
                                                      id="shopName"
                                                      value={pujaSubCatObj?.shopName || ''}
                                                      placeholder="Enter Puja Sub Category Name"
                                                      maxLength={150}
                                                      onChange={(e) => {
                                                            const value = e.target.value.replace(/^\s+/, ""); // remove leading spaces only
                                                            setSubPujaSubCatObj((prev) => ({ ...prev, shopName: value }));
                                                      }}
                                                />
                                                {error && (pujaSubCatObj?.shopName === null || pujaSubCatObj?.shopName === undefined || pujaSubCatObj?.shopName === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}

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

export default PujaSubCategoryModal
