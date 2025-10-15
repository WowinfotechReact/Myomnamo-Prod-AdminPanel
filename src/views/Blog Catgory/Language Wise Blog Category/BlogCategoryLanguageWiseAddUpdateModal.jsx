










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
import { CityLookupList } from 'services/AddressLookupList/AddressLookupListApi';
import { GetTempleLookupList } from 'services/Admin/TempleApi/TemplesApi';

import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import { GetDeityLookupList } from 'services/Admin/Deity/DeityApi';
import { GetBenefitLookupList } from 'services/Admin/TempleApi/Benefit/BenefitApi';
import { GetTemplePujaCategoryLookupList } from 'services/Temples Puja Category/TemplesPujaCategoryApi';
import { GetStateLookupList } from 'services/Master Api/MasterStateApi';
import { GetDistrictLookupList } from 'services/Master Api/MasterDistrictApi';
import { PujaTypeIDOption } from 'Middleware/Utils';
import dayjs from 'dayjs';
import { GetTemplePujaSubCategoryLookupList } from 'services/Temple Puja Sub Category/TemplesPujaSubCategoryApi';
import { AddUpdateTemplePuja, GetTemplePujaModel } from 'services/Temple Puja/TemplePujaApi';
import { UploadImage } from 'services/Upload Cloud-flare Image/UploadCloudflareImageApi';
import { AddUpdateBlogCategory, GetBlogCategoryModel } from 'services/Blog/BlogCategoryApi';
import { GetAppLanguageLookupList } from 'services/Admin/AppLangauge/AppLanguageApi';


const BlogCategoryLanguageWiseAddUpdateModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {


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
            blogCategoryKeyID: null, // Provide Key ID For Update
            blogCatName: null,
            blogCategoryBylangKeyID: null,
            appLangID: null,

      })

      useEffect(() => {

            if (modelRequestData?.blogCategoryKeyID !== null && modelRequestData?.Action === "Update") {
                  GetBlogCategoryModelData(modelRequestData.blogCategoryKeyID)
            }


      }, [modelRequestData.Action])

      console.log(modelRequestData, '222222222233333');



      const SubmitBtnClicked = () => {
            // debugger
            let isValid = true
            if (

                  blogCatObj?.blogCatName === null || blogCatObj?.blogCatName === undefined || blogCatObj?.blogCatName === "" ||
                  blogCatObj?.appLangID === null || blogCatObj?.appLangID === undefined || blogCatObj?.appLangID === ""
            ) {
                  setError(true)
                  isValid = false
            }

            const apiParam = {
                  adminID: user?.admiN_ID,
                  blogCatName: blogCatObj?.blogCatName,
                  appLangID: blogCatObj?.appLangID,
                  blogCategoryKeyID: modelRequestData?.blogCategoryKeyID,
                  blogCategoryBylangKeyID: blogCatObj?.blogCategoryBylangKeyID,

            }

            if (isValid) {
                  AddUpdateBlogCategoryData(apiParam)
            }
      }



      const AddUpdateBlogCategoryData = async (ApiParam) => {

            setLoader(true);
            try {
                  const response = await AddUpdateBlogCategory(ApiParam);
                  if (response?.data?.statusCode === 200) {
                        setLoader(false);
                        setLoader(false);
                        setModelAction(modelRequestData.Action === null ? "Blog Category has been added successfully !" : "Blog Category has been updated successfully !")
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
      useEffect(() => {
            GetAppLanguageLookupListData()
      }, [])

      console.log(modelRequestData.availableLangID, '3333333dss');

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

                                          blogCategoryKeyID: List.blogCategoryKeyID, // Provide Key ID For Update
                                          blogCatName: List.blogCatName,
                                          appLangID: List.appLangID,
                                          blogCategoryBylangKeyID: List.blogCategoryBylangKeyID



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
                              <h4 className="text-center">{modelRequestData?.Action === null ? 'Add Blog Category' : 'Update Blog Category'}</h4>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
                              <div className="container-fluid ">

                                    <div className="row">
                                          {/* Blog Title */}
                                          <div className="col-md-12 mb-3">
                                                <label htmlFor="blogTitle" className="form-label">
                                                      Blog Category Name<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                      maxLength={50}
                                                      type="text"
                                                      className="form-control"
                                                      id="StateName"
                                                      placeholder="Enter Blog Category Name"
                                                      aria-describedby="Employee"
                                                      value={blogCatObj.blogCatName}
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
                                                                  blogCatName: updatedValue
                                                            }));
                                                      }}
                                                />
                                                {error && (blogCatObj.blogCatName === null || blogCatObj.blogCatName === undefined || blogCatObj.blogCatName === '') ? (
                                                      <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                                                ) : (
                                                      ''
                                                )}
                                          </div>
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

export default BlogCategoryLanguageWiseAddUpdateModal
