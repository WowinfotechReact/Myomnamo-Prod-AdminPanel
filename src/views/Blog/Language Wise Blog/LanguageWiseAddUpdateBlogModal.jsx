import axios from 'axios';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import Text_Editor from 'component/Text_Editor';
import { ConfigContext } from 'context/ConfigContext';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import CustomUploadImg from '../../../assets/images/upload_img.jpg'
import 'react-date-picker/dist/DatePicker.css';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import { GetTemplePujaCategoryLookupList } from 'services/Temples Puja Category/TemplesPujaCategoryApi';
import dayjs from 'dayjs';
import { UploadImage } from 'services/Upload Cloud-flare Image/UploadCloudflareImageApi';
import { GetBlogCategoryLookupList } from 'services/Blog/BlogCategoryApi';
import { AddUpdateBlog, GetBlogModel } from 'services/Blog/BlogApi';
import { GetAppLanguageLookupList } from 'services/Admin/AppLangauge/AppLanguageApi';



const LanguageWiseAddUpdateBlogModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
      const debounceTimer = useRef(null);
      console.log(modelRequestData, 'dsadasda');
      const [filePreview, setFilePreview] = useState(null);
      const [selectedFile, setSelectedFile] = useState(null);
      const [sizeError, setSizeError] = useState("");
      const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
      const [modelAction, setModelAction] = useState(false)
      const { setLoader, user } = useContext(ConfigContext);
      const [blogCategoryOption, setBlogCategoryOption] = useState([])

      const [error, setError] = useState(false)
      const [customError, setCustomError] = useState(null)
      const [errorMessage, setErrorMessage] = useState(null)
      const [showSuccessModal, setShowSuccessModal] = useState(false)
      const [languageList, setLanguageList] = useState([])

      const [showErrorModal, setShowErrorModal] = useState(false)
      const [isAddressChanged, setIsAddressChanged] = useState(false)
      const [blogObj, setBlogObj] = useState({
            adminID: null,
            appLangID: null,
            blogKeyID: null, // Provide Key ID For Update
            blogTitle: null,
            blog: null,
            metaTitle: null,
            blogCatID: null,
            autherName: null,
            appLangID: null
      })



      useEffect(() => {
            if (isAddressChanged) {
                  handleSearch()
                  setIsAddressChanged(false)
            }
      }, [isAddressChanged])


      useEffect(() => {

            if (modelRequestData?.blogKeyID !== null && modelRequestData?.Action === "Update") {
                  GetBlogModelData(modelRequestData.blogKeyID)
            }

      }, [modelRequestData.Action])


      useEffect(() => {
            GetBlogCategoryLookupListData()
      }, [])

      const GetBlogCategoryLookupListData = async () => {
            // debugger
            // de
            try {
                  let response = await GetBlogCategoryLookupList();
                  if (response?.data?.statusCode === 200) {
                        const cityList = response?.data?.responseData?.data || [];
                        const formattedCityList = cityList.map((city) => ({
                              value: city.blogCatID,
                              label: city.blogCatName
                        }));

                        setBlogCategoryOption(formattedCityList); // Ensure this is called with correct data
                  } else {
                        console.error('Bad request');
                  }
            } catch (error) {
                  console.log(error);
            }
      };






      const handleChange = (e) => {
            let { id, value } = e.target;

            if (id === "templeName") {
                  value = value.replace(/[^a-zA-Z\s]/g, ""); // only letters + spaces
                  value = value.charAt(0).toUpperCase() + value.slice(1); // capitalize first letter
            }

            if (id === "seatingCapacity") {
                  // allow only digits, max 6
                  value = value.replace(/\D/g, "").slice(0, 6);
            }

            if (id === "isTrendingPuja") {
                  value = Number(value); // keep as number (1 or 2)
            }

            if (id === "blogSlug" || id === "metaTitle") {
                  value = value
                        .toLowerCase()
                        .trim()
                        .replace(/\s+/g, "-") // replace spaces with "-"
                        .replace(/[^a-z0-9-]/g, ""); // remove special chars
            }

            setBlogObj((prev) => ({
                  ...prev,
                  [id]: value,
            }));
      };



      const handleImageChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                  if (
                        (file.type === "image/jpeg" ||
                              file.type === "image/png") &&
                        file.size <= 2 * 1024 * 1024
                  ) {
                        setSizeError("");
                        setSelectedFile(file);

                        // Preview
                        const reader = new FileReader();
                        reader.onload = (event) => {
                              setFilePreview(event.target.result);
                        };
                        reader.readAsDataURL(file);

                        // 🚀 Call upload immediately
                        handleApiCall(file);

                  } else if (file.size > 10 * 1024 * 1024) {
                        setSizeError("Size of image should not exceed 2MB");
                  } else {
                        setFilePreview(null);
                        setSizeError("");
                  }
            } else {
                  setFilePreview(null);
                  setSelectedFile(null);
            }



      };




      const handleMetaDescriptionChange = (htmlContent) => {

            // Strip HTML tags and check if anything meaningful remains
            const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();

            setBlogObj((obj) => ({
                  ...obj,
                  blog: strippedContent === '' ? null : htmlContent,
            }));
      };



      const SubmitBtnClicked = () => {
            // debugger
            let isValid = true
            if (

                  // blogObj?.blogImage === null || blogObj?.blogImage === undefined || blogObj?.blogImage === "" ||
                  blogObj?.blog === null || blogObj?.blog === undefined || blogObj?.blog === "" ||

                  // blogObj?.blogCatID === null || blogObj?.blogCatID === undefined || blogObj?.blogCatID === "" ||
                  blogObj?.autherName === null || blogObj?.autherName === undefined || blogObj?.autherName === "" ||
                  blogObj?.appLangID === null || blogObj?.appLangID === undefined || blogObj?.appLangID === ""
            ) {
                  setError(true)
                  isValid = false
            }

            const apiParam = {
                  ...blogObj,
                  adminID: user?.adminID,
                  blogKeyID: modelRequestData?.blogKeyID,
                  blogBylangKeyID: modelRequestData?.blogBylangKeyID,
                  blogCatID: modelRequestData?.blogCatID,
                  appLangID: blogObj?.appLangID,
                  blogTitle: blogObj?.blogTitle,

                  blog: blogObj?.blog,
                  blogSlug: 'blogObj?.BlogSlug',

                  autherName: blogObj?.autherName,


            }

            if (isValid) {
                  AddUpdateBlogData(apiParam)
            }
      }

      const AddUpdateBlogData = async (ApiParam) => {

            setLoader(true);
            try {
                  const response = await AddUpdateBlog(ApiParam);
                  if (response?.data?.statusCode === 200) {
                        setLoader(false);
                        setLoader(false);
                        setModelAction(modelRequestData.Action === null ? "Blog has been added successfully !" : "Blog has been updated successfully !")
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
      console.log(modelRequestData?.appLangID, 'sad34232423');


      const GetBlogModelData = async (id) => {
            // debugger
            if (!id) {
                  return
            }
            setLoader(true);
            try {
                  const response = await GetBlogModel(id, modelRequestData?.appLangID);

                  if (response) {
                        if (response?.data?.statusCode === 200) {
                              setLoader(false);
                              if (response?.data?.responseData?.data) {
                                    const List = response.data.responseData.data;
                                    setBlogObj((prev) => ({
                                          ...prev,
                                          BlogKeyID: List.BlogKeyID, // Provide Key ID For Update
                                          blogCatName: List.blogCatName,
                                          adminID: user?.adminID,
                                          blogKeyID: List?.blogKeyID,
                                          appLangID: List?.appLangID,
                                          blogBylangKeyID: List?.blogBylangKeyID,
                                          blogTitle: List?.blogTitle,
                                          // blogImage: uploadedImageUrl,
                                          metaTitle:
                                                List?.metaTitle,
                                          blog: List?.blog,
                                          metaDescription: List?.metaDescription,
                                          blogSlug: List?.blogSlug,
                                          blogCatID: List?.blogCatID,
                                          autherName: List?.autherName,
                                          blogDate: List?.blogDate,
                                          canonicalTag: List?.canonicalTag,




                                    }))

                                    if (List?.blogImage) {
                                          setFilePreview(List.blogImage);  // show preview
                                          setUploadedImageUrl(List.blogImage); // keep in upload state
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


      const handleSearch = async () => {
            try {
                  const apiKey = "AIzaSyA5rVW7DkyryqQM-cDhsSrHb4soE2iXIJ8"; // Replace with your key
                  const response = await axios.get(
                        `https://maps.googleapis.com/maps/api/geocode/json`,
                        {
                              params: {
                                    address: blogObj?.templeAddress,
                                    key: apiKey,
                              },
                        }
                  );

                  if (response.data.status === "OK") {
                        const location = response.data.results[0].geometry.location;
                        // setCoords(location); // { lat: ..., lng: ... }
                        setBlogObj((prev) => ({
                              ...prev, latitude: location?.lat, longitude: location?.lng
                        }))
                        console.log("Location", location)
                  } else {
                        alert("Address not found!");
                  }
            } catch (error) {
                  console.error(error);
            }
      };
      useEffect(() => {
            GetAppLanguageLookupListData()
      }, [])

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




      const closeAll = () => {

            setError(false);
            setCustomError(null);
            setShowSuccessModal(false)
            onHide()

      }



      const handleApiCall = async (file) => {
            setLoader(true);
            const formData = new FormData();
            formData.append("File", file);

            try {
                  const response = await UploadImage(formData);
                  console.log("Upload raw response:", response);

                  // Pull URL from either shape, just in case API changes later
                  const uploadedUrl = response?.data?.url ?? response?.data?.data?.url ?? null;

                  if (response?.status === 200 && uploadedUrl) {
                        setLoader(false);
                        setUploadedImageUrl(uploadedUrl);


                        // (optional) keep the form as single source of truth
                        setBlogObj(prev => ({ ...prev, blogImage: uploadedUrl }));
                  } else {
                        setLoader(false);
                        console.warn("Upload succeeded but no URL found:", {
                              status: response?.status,
                              data: response?.data
                        });
                        // setErrorMessage("Upload failed: no URL returned.");
                  }
            } catch (error) {
                  console.error("Error uploading image:", error);
                  setLoader(false);
                  // setErrorMessage("An error occurred while uploading the image.");
            }
      };



      const handleRemoveImage = () => {
            setFilePreview(null);
            setSelectedFile(null);
            setUploadedImageUrl("");
            setBlogObj({ ...blogObj, blogImage: null })
      };


      return (
            <>
                  <Modal style={{ zIndex: 1300 }} size='lg' show={show} backdrop="static" keyboard={false} centered>
                        <Modal.Header>
                              <h4 className="text-center">{modelRequestData?.Action === null ? 'Add Blog' : 'Update Blog'}</h4>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
                              <div className="container-fluid ">

                                    <div className="row">
                                          {/* Blog Title */}
                                          <div className="col-md-6 mb-3">
                                                <label htmlFor="blogTitle" className="form-label">
                                                      Blog Title<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                      // maxLength={50}
                                                      type="text"
                                                      className="form-control"
                                                      id="StateName"
                                                      placeholder="Enter Blog Title"
                                                      aria-describedby="Employee"
                                                      value={blogObj.blogTitle}
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

                                                            setBlogObj(prev => ({
                                                                  ...prev,
                                                                  blogTitle: updatedValue
                                                            }));
                                                      }}
                                                />
                                                {error && (blogObj.blogTitle === null || blogObj.blogTitle === undefined || blogObj.blogTitle === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </div>

















                                          {/* Is White Page */}


                                          {/* { onlinePrice} */}
                                          <div className="col-md-6 mb-3">
                                                <label htmlFor="trend" className="form-label">
                                                      Author Name <span className="text-danger">*</span>
                                                </label>

                                                <input
                                                      type="text"
                                                      className="form-control"
                                                      id="OnlinePrice"
                                                      placeholder="Enter Author Name"
                                                      value={blogObj.autherName}
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

                                                            setBlogObj(prev => ({
                                                                  ...prev,
                                                                  autherName: updatedValue
                                                            }));
                                                      }}
                                                />
                                                {error && (blogObj.autherName === null || blogObj.autherName === undefined || blogObj.autherName === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </div>










                                          <div className="row">
                                                <div className="col-md-6 mb-3">
                                                      <label htmlFor="stateID" className="form-label">
                                                            Select Language <span className="text-danger">*</span>
                                                      </label>
                                                      <Select
                                                            options={languageList}
                                                            value={languageList?.filter((v) => v?.value === blogObj?.appLangID)}
                                                            onChange={(selectedOption) => {

                                                                  setBlogObj((prev) => ({
                                                                        ...prev,
                                                                        appLangID: selectedOption ? selectedOption.value : null,
                                                                  }))
                                                            }
                                                            }
                                                            menuPlacement="auto"
                                                            menuPosition="fixed"
                                                      />
                                                      {error && (!blogObj?.appLangID) && (
                                                            <span className="text-danger">{ERROR_MESSAGES}</span>
                                                      )}
                                                </div>
                                          </div>






                                          <div className="col-md-12 mb-3">
                                                <label htmlFor="canonicalTag" className="form-label">
                                                      Blog  Description <span className="text-danger">*</span>
                                                </label>
                                                <Text_Editor
                                                      editorState={blogObj?.blog}
                                                      handleContentChange={handleMetaDescriptionChange}
                                                />
                                                {error && (blogObj.blog === null || blogObj.blog === undefined || blogObj.blog === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </div>

                                          <div className="col-md-12 mb-3">
                                                <div className="mb-3 position-relative">
                                                      <div className="d-flex justify-content-between align-items-center mb-1">
                                                            <label
                                                                  htmlFor="imageUpload"
                                                                  className="form-label "
                                                            >
                                                                  Blog Image
                                                                  {/* <span className="text-danger">*</span> */}
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

export default LanguageWiseAddUpdateBlogModal
