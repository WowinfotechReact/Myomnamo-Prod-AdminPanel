
import React, { useContext, useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css';
import { ConfigContext } from 'context/ConfigContext';
import { ERROR_MESSAGES, poojaCatAddMsg, poojaCatUpdateMsg } from 'component/GlobalMassage';
import { GetShopModel } from 'services/Shop/ShopApi';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import Select from 'react-select';
import CustomUploadImg from '../../assets/images/upload_img.jpg'
import { UploadImage } from 'services/Upload Cloud-flare Image/UploadCloudflareImageApi';
import { AddUpdatePujaCategory, GetPujaCategoryModel } from 'services/Pooja Category/PoojaCategoryApi';
import { GetAppLanguageLookupList } from 'services/Admin/AppLangauge/AppLanguageApi';
import { GetPujaServiceLookupList, GetPujaSubServiceLookupList } from 'services/Admin/PujaService/PujaServiceApi';

const PoojaCategoryAddUpdateModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
      const { setLoader, user } = useContext(ConfigContext);
      const [error, setError] = useState(false)
      const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
      const [customError, setCustomError] = useState(null)
      const [showSuccessModal, setShowSuccessModal] = useState(false)
      const [showErrorModal, setShowErrorModal] = useState(false)
      const [errorMessage, setErrorMessage] = useState();
      const [languageList, setLanguageList] = useState([])
      const [pujaServiceList, setPujaServiceList] = useState([])
      const [pujaSubServiceList, setPujaSubServiceList] = useState([])

      const [poojaCatObj, setPoojaCatObj] = useState({
            adminID: null,
            pujaCategoryID: null,
            pujaCategoryName: null,
            pujaCategoryImage: null,
            pujaCategoryTrend: null,
            appLangID: null, pujaSubServiceID: null, pujaServiceID: null
      })



      const [filePreview, setFilePreview] = useState(null);
      const [selectedFile, setSelectedFile] = useState(null);
      const [sizeError, setSizeError] = useState("");


      useEffect(() => {

            if (modelRequestData?.Action === 'Update') {
                  if (modelRequestData?.pujaCatKeyID !== null && modelRequestData?.pujaCatKeyID !== undefined && modelRequestData?.pujaCatKeyID !== "") {
                        GetPujaCategoryModelData(modelRequestData?.pujaCatKeyID)

                  }
            }
      }, [modelRequestData?.Action]);

      useEffect(() => {
            if (show) {
                  GetAppLanguageLookupListData()
                  if (modelRequestData?.moduleName === 'CategoryList') {
                        GetPujaServiceLookupListData()
                  }
            }
      }, [show])

      const GetAppLanguageLookupListData = async () => {

            try {
                  const response = await GetAppLanguageLookupList(); // Ensure it's correctly imported

                  if (response?.data?.statusCode === 200) {
                        const list = response?.data?.responseData?.data || [];

                        const formattedLangList = list.map((Lang) => ({
                              value: Lang.appLangID,
                              label: Lang.languageName,
                        }));
                        const filteredList = formattedLangList?.filter(((prev) => prev.value !== 1))
                        setLanguageList(filteredList);
                  } else {
                        console.error(
                              "Failed to fetch sim Type lookup list:",
                              response?.data?.statusMessage || "Unknown error"
                        );
                  }
            } catch (error) {
                  console.error("Error fetching sim Type lookup list:", error);
            }
      };
      const GetPujaServiceLookupListData = async () => {

            try {
                  const response = await GetPujaServiceLookupList(); // Ensure it's correctly imported

                  if (response?.data?.statusCode === 200) {
                        const list = response?.data?.responseData?.data || [];

                        const formattedLangList = list.map((Lang) => ({
                              value: Lang.pujaServiceID,
                              label: Lang.pujaServiceName,
                        }));

                        setPujaServiceList(formattedLangList);
                  } else {
                        console.error(
                              "Failed to fetch sim Type lookup list:",
                              response?.data?.statusMessage || "Unknown error"
                        );
                  }
            } catch (error) {
                  console.error("Error fetching sim Type lookup list:", error);
            }
      };
      const GetPujaSubServiceLookupListData = async (ID) => {

            try {
                  const response = await GetPujaSubServiceLookupList(ID); // Ensure it's correctly imported

                  if (response?.data?.statusCode === 200) {
                        const list = response?.data?.responseData?.data || [];

                        const formattedLangList = list.map((Lang) => ({
                              value: Lang.pujaSubServiceID,
                              label: Lang.pujaSubServiceName,
                        }));

                        setPujaSubServiceList(formattedLangList);
                  } else {
                        console.error(
                              "Failed to fetch sim Type lookup list:",
                              response?.data?.statusMessage || "Unknown error"
                        );
                  }
            } catch (error) {
                  console.error("Error fetching sim Type lookup list:", error);
            }
      };

      const GetPujaCategoryModelData = async (id) => {

            if (id === undefined) {
                  return;
            }
            setLoader(true);
            try {
                  const response = await GetPujaCategoryModel(id, modelRequestData?.appLangID);

                  if (response) {

                        if (response?.data?.statusCode === 200) {
                              console.log(response.data.responseData.data, 'dsadasd3242');

                              setLoader(false);
                              const ModelData = response.data.responseData.data; // Assuming data is an array

                              setPoojaCatObj({
                                    ...poojaCatObj,
                                    pujaCategoryTrend: ModelData.pujaCategoryTrend,
                                    pujaCategoryImage: ModelData.pujaCategoryImage,
                                    pujaCategoryName: ModelData.pujaCategoryName,
                                    pujaCategoryID: ModelData.pujaCategoryID,
                                    pujaServiceID: ModelData?.pujaServiceID,
                                    pujaSubServiceID: ModelData?.pujaSubServiceID,
                                    appLangID: ModelData?.appLangID
                              });

                              if (ModelData?.imageUrl) {
                                    setFilePreview(ModelData.imageUrl);  // show preview
                                    setUploadedImageUrl(ModelData.imageUrl); // keep in upload state
                                    setSelectedFile(ModelData.imageUrl); // keep in upload state
                              }
                              GetPujaSubServiceLookupListData(ModelData?.pujaServiceID)
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
            if (modelRequestData?.moduleName === "CategoryList" && (poojaCatObj?.pujaCategoryName === null || poojaCatObj?.pujaCategoryName === undefined || poojaCatObj?.pujaCategoryName === '' ||
                  (!uploadedImageUrl))

            ) {
                  setError(true);
                  isValid = false
            } else if (modelRequestData?.moduleName === "LanguageWiseList" && (poojaCatObj?.pujaCategoryName === null || poojaCatObj?.pujaCategoryName === undefined || poojaCatObj?.pujaCategoryName === '' ||
                  poojaCatObj?.appLangID === null || poojaCatObj?.appLangID === undefined || poojaCatObj?.appLangID === ''

            )
            ) {
                  setError(true);
                  isValid = false
            }
            let ApiParam = {}
            if (modelRequestData?.moduleName === "CategoryList") {
                  ApiParam = {
                        adminID: user?.admiN_ID,
                        pujaCatKeyID: modelRequestData?.pujaCatKeyID,
                        pujaCatByLangKeyID: modelRequestData?.pujaCatByLangKeyID,
                        appLangID: poojaCatObj?.appLangID,
                        pujaServiceID: modelRequestData?.moduleName === "CategoryList" ? poojaCatObj?.pujaServiceID : modelRequestData?.pujaServiceID,
                        pujaSubServiceID: modelRequestData?.moduleName === "CategoryList" ? poojaCatObj?.pujaSubServiceID : modelRequestData?.pujaSubServiceID,
                        pujaCategoryName: poojaCatObj?.pujaCategoryName,
                        imageUrl: uploadedImageUrl,
                  }
            } else {
                  ApiParam = {
                        adminID: user?.admiN_ID,
                        pujaCatKeyID: modelRequestData?.pujaCatKeyID,
                        pujaCatByLangKeyID: modelRequestData?.pujaCatByLangKeyID,
                        appLangID: poojaCatObj?.appLangID,
                        pujaCategoryName: poojaCatObj?.pujaCategoryName,
                  }
            }


            if (isValid) {
                  AddUpdateShopData(ApiParam)
            }
      }
      const AddUpdateShopData = async (ApiParam) => {
            setLoader(true);
            try {
                  const response = await AddUpdatePujaCategory(ApiParam);
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
            setUploadedImageUrl("");
      };
      const handleApiCall = async (file) => {
            setLoader(true);
            const formData = new FormData();
            formData.append("File", file);

            try {
                  const response = await UploadImage(formData);
                  const uploadedUrl =
                        response?.data?.url ?? response?.data?.data?.url ?? null;

                  if (response?.status === 200 && uploadedUrl) {
                        setUploadedImageUrl(uploadedUrl);
                        console.log("Uploaded Image URL:", uploadedUrl);
                  } else {
                        console.warn("Upload succeeded but no URL found:", response?.data);
                  }
            } catch (error) {
                  console.error("Error uploading image:", error);
            } finally {
                  setLoader(false);
            }
      };
      return (
            <>
                  <Modal style={{ zIndex: 1300 }} show={show} backdrop="static" keyboard={false} centered>
                        <Modal.Header>
                              <h4 className="text-center">{modelRequestData?.Action === null ? 'Add Puja Category' : 'Update Puja Category'}</h4>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
                              <div className="container ">
                                    <div className="row">
                                          {/* Puja Category Name */}
                                          <div className="col-md-12 mb-3">
                                                <label htmlFor="shopName" className="form-label">
                                                      Puja Category Name <span className="text-danger">*</span>
                                                </label>


                                                <input
                                                      maxLength={50}
                                                      type="text"
                                                      className="form-control"
                                                      id="StateName"
                                                      placeholder="Enter Puja Category Name"
                                                      aria-describedby="Employee"
                                                      value={poojaCatObj.pujaCategoryName}
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
                                                            const updatedValue = inputValue
                                                                  .split(' ')
                                                                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                                  .join(' ');

                                                            setPoojaCatObj(prev => ({
                                                                  ...prev,
                                                                  pujaCategoryName: updatedValue
                                                            }));
                                                      }}
                                                />
                                                {error && (poojaCatObj?.pujaCategoryName === null || poojaCatObj?.pujaCategoryName === undefined || poojaCatObj?.pujaCategoryName === '') ? <span className='text-danger'>{ERROR_MESSAGES}</span> : ''}

                                          </div>

                                          {/* Language Selection */}
                                          {modelRequestData?.moduleName === "LanguageWiseList" && (
                                                <>
                                                      <div className="col-md-12 mb-3">
                                                            <label htmlFor="stateID" className="form-label">
                                                                  Select Language <span className="text-danger">*</span>
                                                            </label>
                                                            <Select
                                                                  options={languageList}
                                                                  value={languageList?.filter((v) => v?.value === poojaCatObj?.appLangID)}
                                                                  onChange={(selectedOption) => {

                                                                        setPoojaCatObj((prev) => ({
                                                                              ...prev,
                                                                              appLangID: selectedOption ? selectedOption.value : null,
                                                                        }))
                                                                  }
                                                                  }
                                                                  menuPlacement="auto"
                                                                  menuPosition="fixed"
                                                            />
                                                            {error && (!poojaCatObj?.appLangID) && (
                                                                  <span className="text-danger">{ERROR_MESSAGES}</span>
                                                            )}
                                                      </div>


                                                </>

                                          )}

                                          {modelRequestData?.moduleName == "CategoryList" && (
                                                <>
                                                      {/* Select Puja Service */}
                                                      <div className="col-md-12 mb-3">
                                                            <label htmlFor="stateID" className="form-label">
                                                                  Select Puja Service <span className="text-danger">*</span>
                                                            </label>
                                                            <Select
                                                                  options={pujaServiceList}
                                                                  value={pujaServiceList?.filter((v) => v?.value === poojaCatObj?.pujaServiceID)}
                                                                  onChange={(selectedOption) => {

                                                                        setPoojaCatObj((prev) => ({
                                                                              ...prev,
                                                                              pujaServiceID: selectedOption ? selectedOption.value : null,
                                                                        }))
                                                                        GetPujaSubServiceLookupListData(selectedOption.value)
                                                                  }
                                                                  }
                                                                  menuPlacement="auto"
                                                                  menuPosition="fixed"
                                                            />
                                                            {error && (!poojaCatObj?.pujaServiceID) && (
                                                                  <span className="text-danger">{ERROR_MESSAGES}</span>
                                                            )}
                                                      </div>

                                                      {/* Select Puja Sub Service */}
                                                      <div className="col-md-12 mb-3">
                                                            <label htmlFor="stateID" className="form-label">
                                                                  Select Puja Sub Service <span className="text-danger">*</span>
                                                            </label>
                                                            <Select
                                                                  options={pujaSubServiceList}
                                                                  value={pujaSubServiceList?.filter((v) => v?.value === poojaCatObj?.pujaSubServiceID)}
                                                                  onChange={(selectedOption) => {

                                                                        setPoojaCatObj((prev) => ({
                                                                              ...prev,
                                                                              pujaSubServiceID: selectedOption ? selectedOption.value : null,
                                                                        }))
                                                                  }
                                                                  }
                                                                  menuPlacement="auto"
                                                                  menuPosition="fixed"
                                                            />
                                                            {error && (!poojaCatObj?.pujaSubServiceID) && (
                                                                  <span className="text-danger">{ERROR_MESSAGES}</span>
                                                            )}
                                                      </div>

                                                      {/* Category Image */}
                                                      <div className="col-md-12 mb-3">
                                                            <div className="mb-3 position-relative">
                                                                  <div className="d-flex justify-content-between align-items-center mb-1">
                                                                        <label
                                                                              htmlFor="imageUpload"
                                                                              className="form-label "
                                                                        >
                                                                              Puja Category Image
                                                                              <span className="text-danger">*</span>
                                                                        </label>
                                                                  </div>
                                                                  <div
                                                                        className="position-relative d-flex align-items-center justify-content-center w-100 border rounded"
                                                                        style={{ height: "12rem" }}
                                                                  >
                                                                        {filePreview ? (
                                                                              <>
                                                                                    {/* Remove Button */}
                                                                                    <button
                                                                                          onClick={handleRemoveImage}
                                                                                          style={{
                                                                                                padding: "3px 10px",
                                                                                                position: "absolute",
                                                                                                top: "5px",
                                                                                                right: "5px",
                                                                                                border: "none",
                                                                                                outline: "none",
                                                                                                zIndex: "20",
                                                                                                background: "transparent",
                                                                                                fontSize: "20px",
                                                                                                cursor: "pointer",
                                                                                                color: "black",
                                                                                          }}
                                                                                    >
                                                                                          <i className="fas fa-times"></i>
                                                                                    </button>

                                                                                    {/* Preview Image */}
                                                                                    <img
                                                                                          style={{ objectFit: "contain" }}
                                                                                          src={filePreview}
                                                                                          alt="Preview"
                                                                                          className="position-absolute top-0 start-0 w-100 h-100 border border-secondary rounded"
                                                                                    />
                                                                              </>
                                                                        ) : (
                                                                              <label
                                                                                    htmlFor="custom-pujaCategoryImage"
                                                                                    className="cursor-pointer text-center"
                                                                              >
                                                                                    <img
                                                                                          src={CustomUploadImg} // replace with your CustomUploadImg path
                                                                                          alt="upload_img"
                                                                                          className="d-block mx-auto"
                                                                                          style={{ height: "5rem" }}
                                                                                    />
                                                                                    <span>Upload image</span>
                                                                              </label>
                                                                        )}

                                                                        {/* Hidden Input */}
                                                                        <input
                                                                              type="file"
                                                                              id="custom-pujaCategoryImage"
                                                                              accept="image/jpeg, image/png"
                                                                              className="d-none"
                                                                              onChange={handleImageChange}
                                                                        />
                                                                  </div>

                                                                  {/* Error Messages */}
                                                                  {sizeError ? (
                                                                        <span className="text-danger small mx-3">{sizeError}</span>
                                                                  ) : !selectedFile ? (
                                                                        <span
                                                                              className="text-muted mx-3"
                                                                              style={{
                                                                                    display: "block",
                                                                                    fontWeight: "500",
                                                                                    fontSize: "0.8rem",
                                                                              }}
                                                                        >
                                                                              Supported file types are .jpg, .jpeg, .png up to a file size of 2MB.
                                                                        </span>
                                                                  ) : (
                                                                        ""
                                                                  )}

                                                                  {error &&
                                                                        (selectedFile === null ||
                                                                              selectedFile === "" ||
                                                                              selectedFile === undefined) && (
                                                                              <span className="text-danger small mx-3">{ERROR_MESSAGES}</span>
                                                                        )}
                                                            </div>
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
                  <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={modelRequestData?.Action === null ? poojaCatAddMsg : poojaCatUpdateMsg} />
                  <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
            </>
      )
}

export default PoojaCategoryAddUpdateModal
