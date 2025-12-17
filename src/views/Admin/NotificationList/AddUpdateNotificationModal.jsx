import { ERROR_MESSAGES } from 'component/GlobalMassage';
import Text_Editor from 'component/Text_Editor';
import { ConfigContext } from 'context/ConfigContext';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SuccessPopupModal from 'component/SuccessPopupModal';
import ErrorModal from 'component/ErrorModal';
import { GetAppLanguageLookupList } from 'services/Admin/AppLangauge/AppLanguageApi';
import { AddUpdateNotificationTemplateAPI, GetNotificationTemplateModalAPI } from 'services/Admin/NotificationAPI/NotificationTemplateAPI';

const AddUpdateNotificationModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
  const { setLoader, user } = useContext(ConfigContext);
  const [error, setError] = useState(false);
  const [customError, setCustomError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [actionMassage, setActionMassage] = useState(null);
  const [formObj, setFormObj] = useState({
    title: null,
    template: null
  });

  console.log("default value on add ==>>", formObj)

  useEffect(() => {
    if (show) {

      GetAppLanguageLookupListData();
      if (
        modelRequestData?.Action === 'update' &&
        modelRequestData?.notiTemplateKeyID !== null &&
        modelRequestData?.notiTemplateKeyID !== ''
      ) {
        GetModelData();
      }
    }
  }, [show]);

  const GetModelData = async () => {
    setLoader(true);
    try {
      const response = await GetNotificationTemplateModalAPI(modelRequestData?.notiTemplateKeyID);

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const List = response.data.responseData.data;
            setFormObj((prev) => ({
              ...prev,
              title: List.title,
              template: List.template
            }));
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
  };

  const GetAppLanguageLookupListData = async () => {
    try {
      const response = await GetAppLanguageLookupList(); // Ensure it's correctly imported

      if (response?.data?.statusCode === 200) {
        const list = response?.data?.responseData?.data || [];

        const formattedLangList = list.map((Lang) => ({
          value: Lang.appLangID,
          label: Lang.languageName
        }));

        const filteredList = formattedLangList?.filter((prev) => prev.value !== 1);
        setLanguageList(filteredList);
      } else {
        console.error('Failed to fetch sim Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching sim Type lookup list:', error);
    }
  };

  const setDataInitial = () => {
    setFormObj((prev) => ({
      ...prev,
      title: null,
      template: null
    }));
  };

  const closeAll = () => {
    setError(false);
    setShowErrorModal(false);
    setShowSuccessModal(false);
    setDataInitial();
    onHide();
  };

  const handleEditorChange = (field, htmlContent) => {
    setError(false);

    // Remove HTML tags and extra whitespace
    const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();
    setFormObj((obj) => ({
      ...obj,
      [field]: strippedContent === '' ? null : strippedContent
    }));
  };

  const SubmitBtnClicked = () => {
    // debugger;
    let isValid = true;
    if (
      formObj.title === null ||
      formObj.title === undefined ||
      formObj.title === '' ||
      formObj.template === null ||
      formObj.template === undefined ||
      formObj.template === ''
    ) {
      setError(true);
      isValid = false;
    }

    const apiParam = {
      adminID: user?.adminID,
      notiTemplateKeyID: modelRequestData.notiTemplateKeyID ? modelRequestData.notiTemplateKeyID : null,
      appLangID: null, // Currently not in use so send it always nullable
      notiBylangKeyID: null, // Currently not in use so send it always nullable
      template: formObj.template,
      title: formObj.title
    };

    if (isValid) {
      AddUpdateNoficationData(apiParam);
    }
  };

  const AddUpdateNoficationData = async (ApiParam) => {
    setLoader(true);
    try {
      const response = await AddUpdateNotificationTemplateAPI(ApiParam);
      if (response?.data?.statusCode === 200) {
        setLoader(false);
        setActionMassage(
          modelRequestData.Action === null ? `Notification Template added successfully.` : `Notification Template updated successfully.`
        );
        setShowSuccessModal(true);
        setIsAddUpdateDone(true);
        onHide();
      } else {
        console.error(response?.response?.data?.errorMessage);
        setCustomError(response?.response?.data?.errorMessage);
        setShowErrorModal(true);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  return (
    <>
      <Modal style={{ zIndex: 1300 }} size="lg" show={show} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <h4 className="text-center">
            {modelRequestData?.Action === null ? `Add Notification Template` : `Update Notification Template`}
          </h4>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
          <div className="container-fluid ">
            <div className="row">
              {/* Puja Name */}
              <div className="col-md-12 mb-3">
                <label htmlFor="pujaName" className="form-label">
                  Title <span className="text-danger">*</span>
                </label>
                <input
                  maxLength={90}
                  type="text"
                  className="form-control"
                  id="catName"
                  placeholder="Enter Title"
                  aria-describedby="Employee"
                  value={formObj.title}
                  onChange={(e) => {
                    let input = e.target.value;
                    if (input.startsWith(' ')) {
                      input = input.trimStart();
                    }

                    setFormObj((prev) => ({
                      ...prev,
                      title: input
                    }));
                  }}
                />
                {error && (formObj.title === null || formObj.title === undefined || formObj.title === '') ? (
                  <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
                ) : (
                  ''
                )}
              </div>
              {/* Language Selection */}
              {/* {modelRequestData?.moduleName === 'LanguageWiseList' && (
                <>
                  <div className="col-md-12 mb-3">
                    <label htmlFor="stateID" className="form-label">
                      Select Language <span className="text-danger">*</span>
                    </label>
                    <Select
                      options={languageList}
                      value={languageList?.filter((v) => v?.value === formObj?.appLangID)}
                      onChange={(selectedOption) => {
                        setFormObj((prev) => ({
                          ...prev,
                          appLangID: selectedOption ? selectedOption.value : null
                        }));
                      }}
                      menuPlacement="auto"
                      menuPosition="fixed"
                    />
                    {error && !formObj?.appLangID && <span className="text-danger">{ERROR_MESSAGES}</span>}
                  </div>
                </>
              )} */}

              {/* Notification Template */}

              <div className="col-md-12 mb-3">
                <label htmlFor="canonicalTag" className="form-label">
                  Notification Template
                  <span className="text-danger">*</span>
                </label>
                <Text_Editor
                  editorState={formObj?.template}
                  handleContentChange={(html) => handleEditorChange('template', html)}
                />
                {error && (!formObj?.template || formObj?.template === '') ? (
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
      </Modal>
      <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={actionMassage} />
      <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
    </>
  );
};

export default AddUpdateNotificationModal;


// import { ERROR_MESSAGES } from 'component/GlobalMassage';
// import Text_Editor from 'component/Text_Editor';
// import { ConfigContext } from 'context/ConfigContext';
// import 'react-calendar/dist/Calendar.css';
// import 'react-date-picker/dist/DatePicker.css';
// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { Modal, Button } from 'react-bootstrap';
// import SuccessPopupModal from 'component/SuccessPopupModal';
// import ErrorModal from 'component/ErrorModal';
// import { GetAppLanguageLookupList } from 'services/Admin/AppLangauge/AppLanguageApi';
// import { AddUpdateNotificationTemplateAPI, GetNotificationTemplateModalAPI } from 'services/Admin/NotificationAPI/NotificationTemplateAPI';

// const AddUpdateNotificationModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
//   const { setLoader, user } = useContext(ConfigContext);
//   const [error, setError] = useState(false);
//   const [customError, setCustomError] = useState(null);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [showErrorModal, setShowErrorModal] = useState(false);
//   const [actionMassage, setActionMassage] = useState(null);
//   debugger;
//   const [formObj, setFormObj] = useState({
//     title: null,
//     template: null
//   });

//   console.log("default value on add ==>>", formObj)

//   useEffect(() => {
//     if (show) {

//       GetAppLanguageLookupListData();
//       if (
//         modelRequestData?.Action === 'update' &&
//         modelRequestData?.notiTemplateKeyID !== null &&
//         modelRequestData?.notiTemplateKeyID !== ''
//       ) {
//         GetModelData();
//       }
//     }
//   }, [show]);

//   const GetModelData = async () => {
//     setLoader(true);
//     try {
//       const response = await GetNotificationTemplateModalAPI(modelRequestData?.notiTemplateKeyID);

//       if (response) {
//         if (response?.data?.statusCode === 200) {
//           setLoader(false);
//           if (response?.data?.responseData?.data) {
//             const List = response.data.responseData.data;
//             setFormObj((prev) => ({
//               ...prev,
//               title: List.title,
//               template: List.template
//             }));
//           }
//         } else {
//           console.error(response?.data?.errorMessage);
//           setLoader(false);
//         }
//       }
//     } catch (error) {
//       setLoader(false);
//       console.log(error);
//     }
//   };

//   const GetAppLanguageLookupListData = async () => {
//     try {
//       const response = await GetAppLanguageLookupList(); // Ensure it's correctly imported

//       if (response?.data?.statusCode === 200) {
//         const list = response?.data?.responseData?.data || [];

//         const formattedLangList = list.map((Lang) => ({
//           value: Lang.appLangID,
//           label: Lang.languageName
//         }));

//         const filteredList = formattedLangList?.filter((prev) => prev.value !== 1);
//         setLanguageList(filteredList);
//       } else {
//         console.error('Failed to fetch sim Type lookup list:', response?.data?.statusMessage || 'Unknown error');
//       }
//     } catch (error) {
//       console.error('Error fetching sim Type lookup list:', error);
//     }
//   };

//   // const setDataInitial = () => {
//   //   setFormObj((prev) => ({
//   //     ...prev,
//   //     title: null,
//   //     template: null
//   //   }));
//   // };

//   const closeAll = () => {
//     setError(false);
//     setShowErrorModal(false);
//     setShowSuccessModal(false);
//     // setDataInitial();
//     onHide();
//   };

//   const handleEditorChange = (field, htmlContent) => {
//     setError(false);

//     // Remove HTML tags and extra whitespace
//     const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();
//     setFormObj((obj) => ({
//       ...obj,
//       [field]: strippedContent === '' ? null : strippedContent
//     }));
//   };

//   const SubmitBtnClicked = () => {
//     // debugger;
//     let isValid = true;
//     if (
//       formObj.title === null ||
//       formObj.title === undefined ||
//       formObj.title === '' ||
//       formObj.template === null ||
//       formObj.template === undefined ||
//       formObj.template === ''
//     ) {
//       setError(true);
//       isValid = false;
//     }

//     const apiParam = {
//       adminID: user?.adminID,
//       notiTemplateKeyID: modelRequestData.notiTemplateKeyID ? modelRequestData.notiTemplateKeyID : null,
//       appLangID: null, // Currently not in use so send it always nullable
//       notiBylangKeyID: null, // Currently not in use so send it always nullable
//       template: formObj.template,
//       title: formObj.title
//     };

//     if (isValid) {
//       AddUpdateNoficationData(apiParam);
//     }
//   };

//   const AddUpdateNoficationData = async (ApiParam) => {
//     setLoader(true);
//     try {
//       const response = await AddUpdateNotificationTemplateAPI(ApiParam);
//       if (response?.data?.statusCode === 200) {
//         setLoader(false);
//         setActionMassage(
//           modelRequestData.Action === null ? `Notification Template added successfully.` : `Notification Template updated successfully.`
//         );
//         setShowSuccessModal(true);
//         setIsAddUpdateDone(true);
//         onHide();
//       } else {
//         console.error(response?.response?.data?.errorMessage);
//         setCustomError(response?.response?.data?.errorMessage);
//         setShowErrorModal(true);
//         setLoader(false);
//       }
//     } catch (error) {
//       setLoader(false);
//       console.log(error);
//     }
//   };

//   return (
//     <>
//       <Modal style={{ zIndex: 1300 }} size="lg" show={show} backdrop="static" keyboard={false} centered>
//         <Modal.Header>
//           <h4 className="text-center">
//             {modelRequestData?.Action === null ? `Add Notification Template` : `Update Notification Template`}
//           </h4>
//         </Modal.Header>
//         <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
//           <div className="container-fluid ">
//             <div className="row">
//               {/* Puja Name */}
//               <div className="col-md-12 mb-3">
//                 <label htmlFor="pujaName" className="form-label">
//                   Title <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   maxLength={90}
//                   type="text"
//                   className="form-control"
//                   id="catName"
//                   placeholder="Enter Title"
//                   aria-describedby="Employee"
//                   value={formObj.title}
//                   onChange={(e) => {
//                     let input = e.target.value;
//                     if (input.startsWith(' ')) {
//                       input = input.trimStart();
//                     }

//                     setFormObj((prev) => ({
//                       ...prev,
//                       title: input
//                     }));
//                   }}
//                 />
//                 {error && (formObj.title === null || formObj.title === undefined || formObj.title === '') ? (
//                   <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
//                 ) : (
//                   ''
//                 )}
//               </div>
//               {/* Language Selection */}
//               {/* {modelRequestData?.moduleName === 'LanguageWiseList' && (
//                 <>
//                   <div className="col-md-12 mb-3">
//                     <label htmlFor="stateID" className="form-label">
//                       Select Language <span className="text-danger">*</span>
//                     </label>
//                     <Select
//                       options={languageList}
//                       value={languageList?.filter((v) => v?.value === formObj?.appLangID)}
//                       onChange={(selectedOption) => {
//                         setFormObj((prev) => ({
//                           ...prev,
//                           appLangID: selectedOption ? selectedOption.value : null
//                         }));
//                       }}
//                       menuPlacement="auto"
//                       menuPosition="fixed"
//                     />
//                     {error && !formObj?.appLangID && <span className="text-danger">{ERROR_MESSAGES}</span>}
//                   </div>
//                 </>
//               )} */}

//               {/* Notification Template */}

//               <div className="col-md-12 mb-3">
//                 <label htmlFor="canonicalTag" className="form-label">
//                   Notification Template
//                   <span className="text-danger">*</span>
//                 </label>
//                 <Text_Editor
//                   editorState={formObj?.template}
//                   handleContentChange={(html) => handleEditorChange('template', html)}
//                 />
//                 {error && (!formObj?.template || formObj?.template === '') ? (
//                   <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
//                 ) : (
//                   ''
//                 )}
//               </div>
//             </div>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => closeAll()}>
//             Close
//           </Button>

//           <Button
//             variant="primary"
//             onClick={() => {
//               SubmitBtnClicked();
//             }}
//           >
//             Submit
//           </Button>
//         </Modal.Footer>
//       </Modal>
//       <SuccessPopupModal show={showSuccessModal} onHide={closeAll} successMassage={actionMassage} />
//       <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} Massage={customError} />
//     </>
//   );
// };

// export default AddUpdateNotificationModal;
