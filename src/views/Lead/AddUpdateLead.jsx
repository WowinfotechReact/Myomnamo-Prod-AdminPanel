import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import { ConfigContext } from 'context/ConfigContext';
import SuccessPopupModal from 'component/SuccessPopupModal';
import { LeadTypeNameList } from 'Middleware/Utils';
import { AddUpdateLeadApi, GetLeadModel } from 'services/LeadAPI/LeadApi';
import { ERROR_MESSAGES } from 'component/GlobalMassage';

import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
;

const AddUpdateLeadModal = ({ show, handleClose, modelRequestData, setIsAddUpdateActionDone, isAddUpdateActionDone }) => {
  const [error, setErrors] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [govPortalOption, setGovPortalOption] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [actionMassage, setActionMassage] = useState(null);
  const [customerOption, setCustomerOption] = useState([]);
  const [showSuccessModel, setShowSuccessModal] = useState('');
  const { user, setLoader, companyID } = useContext(ConfigContext);
  const [networkOption, setNetworkOption] = useState([]);
  const [leadObj, setLeadObj] = useState({
    entityName: null,
    customerID: null,
    vehicleDetails: [
      {
        driverName: '',
        driverContact: '',
        productType: '', // will store number
        vehicleNumber: '',
        location: '',
        networkTypeID: '', // <-- added
        installationKeyID: '', // <-- added

        errors: {
          vehicleNumber: '',
          productType: '',
          // driverName: '',
          // driverContact: '',
          location: ''
        }
      }
    ],
    contactNumber: null,
    stateID: null,
    districtID: null,
    talukaID: null,
    villageID: null,
    address: null,
    detailedDescription: null,
    leadTypeID: null,
    leadKeyID: null,
    userKeyID: null
  });

  useEffect(() => {
    if (!leadObj.vehicleDetails || leadObj.vehicleDetails.length === 0) {
      setLeadObj((prev) => ({
        ...prev,
        vehicleDetails: [{ driverName: '', phone: '', vehicleNumber: '', location: '' }]
      }));
    }
  }, [show]);

  useEffect(() => {
    GetGovtPortalLookupListData()
  }, [show])
  const GetGovtPortalLookupListData = async () => {
    try {
      const response = await GetGovtPortalLookupList();
      if (response?.data?.statusCode === 200) {
        const govPortalLookupList = response?.data?.responseData?.data || [];
        const formattedOptions = govPortalLookupList.map((item) => ({
          value: item.governmentPortalID,
          label: item.governmentPortalName
        }));
        setGovPortalOption(formattedOptions);

        // Set default selection & fetch data
        if (formattedOptions.length > 0) {
          setSelectedPortal(formattedOptions[0]);
          fetchInstallationList(formattedOptions[0].value, 0);
        }
      } else {
        console.error('Failed to fetch lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching lookup list:', error);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...leadObj.vehicleDetails];
    updated[index][field] = value;

    // Auto-clear error when value is filled
    if (value && updated[index].errors && updated[index].errors[field]) {
      updated[index].errors[field] = '';
    }

    setLeadObj((prev) => ({
      ...prev,
      vehicleDetails: updated
    }));
  };

  const handleAddMore = () => {
    const newEntry = {
      driverName: '',
      driverContact: '',
      productType: '',
      vehicleNumber: '',
      location: '',
      networkTypeID: '', // <-- added
    };
    setLeadObj((prev) => ({
      ...prev,
      vehicleDetails: [...prev.vehicleDetails, newEntry]
    }));
  };
  const SpectrumTypeOption = [
    { value: 1, label: '2G' },
    { value: 2, label: '4G' }
  ];

  const handleDelete = (index) => {
    const updated = leadObj.vehicleDetails.filter((_, i) => i !== index);
    setLeadObj((prev) => ({
      ...prev,
      vehicleDetails:
        updated.length > 0
          ? updated
          : [
            {
              driverName: '',
              driverContact: '',
              productType: null,
              vehicleNumber: '',
              location: '',
              networkTypeID: '' // <-- added

            }
          ]
    }));
  };

  const isLastGroupFilled = () => {
    const { vehicleDetails } = leadObj;

    if (!vehicleDetails || vehicleDetails.length === 0) return false;

    const last = vehicleDetails[vehicleDetails.length - 1];
    if (!last) return false;

    return (
      // last.driverName?.trim() &&
      // last.driverContact &&
      !!last.productType &&
      last.vehicleNumber?.trim() &&
      last.location?.trim() &&
      !!last.networkTypeID // ✅ this was missing
    );
  };


  useEffect(() => {
    if (
      modelRequestData?.leadKeyID !== null &&
      modelRequestData.Action === 'Update' // Don't change this naming convention
    ) {
      GetLeadModalData(modelRequestData?.leadKeyID);
    }
  }, [modelRequestData]);

  const AddLeadBtnClick = () => {
    let isValid = false;
    if (
      leadObj.customerID === undefined ||
      leadObj.customerID === '' ||
      leadObj.customerID === null ||
      leadObj.detailedDescription === undefined ||
      leadObj.detailedDescription === '' ||
      leadObj.detailedDescription === null ||
      leadObj.leadTypeID === undefined ||
      leadObj.leadTypeID === '' ||
      leadObj.leadTypeID === null
    ) {
      setErrors(true);
      isValid = true;
    }

    const updatedVehicleDetails = leadObj.vehicleDetails.map((item) => {
      const errors = {
        vehicleNumber: '',
        productType: '',
        // driverName: '',
        // driverContact: '',
        location: '', networkTypeID: ''
      };

      if (!item.vehicleNumber) {
        errors.vehicleNumber = 'This field is required.';
        isValid = true;
      }

      if (!item.productType) {
        errors.productType = 'This field is required.';
        isValid = true;
      }
      if (!item.networkTypeID) {
        errors.networkTypeID = 'This field is required.';
        isValid = true;
      }

      // if (!item.driverName) {
      //   errors.driverName = 'This field is required.';
      //   isValid = true;
      // }

      // if (!item.driverContact || item.driverContact.length !== 10 || item.driverContact[0] < '6') {
      //   errors.driverContact = 'This field is required. It should start with 6-9 and be 10 digits long.';
      //   isValid = true;
      // }

      if (!item.location) {
        errors.location = 'This field is required.';
        isValid = true;
      }

      return {
        ...item,
        errors
      };
    });

    setLeadObj((prev) => ({
      ...prev,
      vehicleDetails: updatedVehicleDetails
    }));



    const apiParamObj = {
      customerID: leadObj.customerID,
      detailedDescription: leadObj.detailedDescription,
      userKeyID: user.userKeyID,
      leadKeyID: leadObj.leadKeyID,
      leadTypeID: leadObj.leadTypeID,
      companyKeyID: companyID,
      vehicleDetails: leadObj.vehicleDetails
    };
    if (!isValid) {
      AddUpdateLeadData(apiParamObj);
    }
  };

  const AddUpdateLeadData = async (apiParams) => {
    // debugger
    setLoader(true);

    try {
      const response = await AddUpdateLeadApi(apiParams); //Call this api
      console.log(response, 'ssssssssssssssssssssssssss');

      if (response?.data.statusCode === 200) {
        setLoader(false);
        setIsAddUpdateActionDone(true);

        if (modelRequestData?.Action === null || modelRequestData?.Action === undefined) {
          setActionMassage(`Lead  ${leadObj.entityName} Added Successfully`);
        } else {
          setActionMassage(`Lead ${leadObj.entityName} Updated Successfully`);
        }
        setShowSuccessModal(true);
      } else {
        setLoader(false);

        setErrorMessage(errorMsg, 'sss111ssssssss');
        console.error('Bad request');
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = error?.response?.data?.errorMessage || error?.message || 'Something went wrong';

      setErrorMessage(errorMsg, 'sss111ssssssss');
      console.log(error);
    }
  };


  useEffect(() => {
    GetNetworkTypeLookupListData()
  }, [show])

  const GetNetworkTypeLookupListData = async () => {
    try {
      const response = await GetNetworkTypeLookupList(); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const networkLookupList = response?.data?.responseData?.data;

        const formattedNetworkList = networkLookupList.map((networkItem) => ({
          value: networkItem.networkTypeID,
          label: networkItem.networkTypeName,
        }));

        setNetworkOption(formattedNetworkList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch Customer lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching Customer lookup list:', error);
    }
  };

  //Get lead Modal
  const GetLeadModalData = async (id) => {
    setLoader(true);
    try {
      const response = await GetLeadModel(id);
      if (response?.data?.statusCode === 200) {
        setLoader(false);

        const ModelData = response.data.responseData?.data || []; // Assuming the data is an array and we need the first item
        setLeadObj({
          ...leadObj,
          leadKeyID: ModelData.leadKeyID,
          customerID: ModelData.customerID,

          detailedDescription: ModelData.detailedDescription,

          leadTypeID: ModelData.leadTypeID,
          installationKeyID: ModelData.installationKeyID,
          vehicleDetails: ModelData.vehicleDetails
        });
      } else {
        setLoader(false);
        console.error('Error fetching data: ', response?.data?.data?.statusCode);
      }
    } catch (error) {
      setLoader(false);

      console.error('Error', error);
    }
  };

  const handleLeadStatusChange = (selectedOption) => {
    setLeadObj((prev) => ({
      ...prev,
      leadTypeID: selectedOption.value
    }));
  };


  const setInitialData = () => {
    setErrors(false);
    setLeadObj({
      customerID: '',

      productType: '',
      quantity: '',
      remark: ''
    });
  };

  const closeAllModal = () => {
    setInitialData();
    setShowSuccessModal(false);
    handleClose();
  };
  useEffect(() => {
    GetCustomerLookupListData();
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    GetCustomerLookupListData();
  }, [modelRequestData.Action]);

  const AddCustomerForInstallation = () => {
    setShowCustomerModal(true);
  };

  const GetCustomerLookupListData = async () => {
    try {
      const response = await GetCustomerLookupList(companyID || undefined); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const customerLookupList = response?.data?.responseData?.data;

        const formattedCustomerList = customerLookupList.map((customerItem) => ({
          value: customerItem.customerID,
          label: customerItem.name,
          customerKeyID: customerItem.customerKeyID
        }));

        setCustomerOption(formattedCustomerList); // Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch Customer lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching Customer lookup list:', error);
    }
  };
  const handleError = (index, errorMsg) => {
    const updated = [...leadObj.vehicleDetails];
    updated[index].error = errorMsg;
    setLeadObj((prev) => ({
      ...prev,
      vehicleDetails: updated
    }));
  };


  useEffect(() => {
    if (!Array.isArray(customerOption) || customerOption.length === 0) return;

    const selectedOption = customerOption.find(
      (option) => option?.value === leadObj?.customerID
    );

    // If valid option is found and entityName is out of sync, update it
    if (selectedOption && leadObj?.entityName !== selectedOption.label) {
      setLeadObj((prev) => ({
        ...prev,
        customerID: selectedOption.value,
        entityName: selectedOption.label,
      }));
    }


  }, [customerOption, leadObj?.customerID]);


  return (
    <Modal
      size="lg"
      show={show}
      onHide={() => {
        handleClose();
        setInitialData();
      }}
      style={{ zIndex: 1300 }}
      backdrop="static"
      keyboard={false}
      centered // Adjust the z-index as needed
    >
      <Modal.Header closeButton>
        <Modal.Title>{modelRequestData?.Action != null ? 'Update Lead' : 'Add Lead'}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '55vh', overflow: 'overlay' }}>
        <div className="row">
          <div className="col-12 col-md-6 mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <label htmlFor="customerID" className="form-label">
                Select Customer
                <span style={{ color: 'red' }}>*</span>
              </label>
              <Tooltip title="Add Customer">
                <Link onClick={AddCustomerForInstallation} style={{ whiteSpace: 'nowrap' }}>
                  + Add Customer
                </Link>
              </Tooltip>
            </div>

            <Select
              menuPosition="fixed"
              menuPlacement="auto"
              options={customerOption}
              value={customerOption.find((option) => option.value === leadObj.customerID)} // Find the selected option
              onChange={(selectedOption) =>
                setLeadObj((prev) => ({
                  ...prev,
                  customerID: selectedOption ? selectedOption.value : null,
                  entityName: selectedOption ? selectedOption.label : null,
                }))
              }
              placeholder="Select Customer"
            />
            {error && (leadObj.customerID === null || leadObj.customerID === undefined || leadObj.customerID === '') ? (
              <span style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
            ) : (
              ''
            )}
          </div>
          <div className="col-12 col-md-6 mb-2">
            <label htmlFor="customerID" className="form-label">
              Lead Status
              <span style={{ color: 'red' }}>*</span>
            </label>
            <Select
              options={LeadTypeNameList}
              value={LeadTypeNameList.find((item) => item.value === leadObj.leadTypeID)} // Correctly maps the selected value
              onChange={handleLeadStatusChange}
              className="placeHolderStyle"
              placeholder="Select Lead Status"
              menuPosition="fixed"
              menuplacement="auto"
            />
            {error & (leadObj.leadTypeID === null || leadObj.leadTypeID === undefined || leadObj.leadTypeID === '') ? (
              <span className="errorMassage">{ERROR_MESSAGES}</span>
            ) : (
              ''
            )}
          </div>
        </div>

        <div className="row">

          <div className="col-6 col-md-12 mb-2">
            <label for="remark" className="form-label">
              Detailed Description
              <span style={{ color: 'red' }}>*</span>
            </label>
            <textarea
              type="text"
              placeholder="Enter Detailed Description"
              className="form-control placeHolderStyle"
              maxLength={150}
              id="DetailedDescription"
              value={leadObj.detailedDescription}
              // onChange={(e) => setLeadObj({ ...leadObj, detailedDescription: e.target.value })}
              onChange={(e) => {
                let inputValue = e.target.value;

                // Remove leading space
                if (inputValue.startsWith(' ')) {
                  inputValue = inputValue.trimStart();
                }

                // Capitalize the first letter after every period, newline, or space (basic approach)
                const capitalizedValue = inputValue
                  ?.split(' ')
                  ?.map((word) => word.charAt(0)?.toUpperCase() + word?.slice(1))
                  ?.join(' ');

                setLeadObj((prev) => ({
                  ...prev,
                  detailedDescription: capitalizedValue
                }));
              }}
            />
            {error &
              (leadObj.detailedDescription === null || leadObj.detailedDescription === undefined || leadObj.detailedDescription === '') ? (
              <span className="errorMassage">{ERROR_MESSAGES}</span>
            ) : (
              ''
            )}
          </div>
        </div>

        <div className="position-relative border-top border-bottom border-start mt-2 border-end border-2 p-3">
          <span
            className="position-absolute top-0 translate-middle-y px-3 fw-bold bg-light"
            style={{ left: '10px', paddingTop: '5px', paddingBottom: '5px' }}
          >
            Add More Lead Details
          </span>

          {/* Top Add Button */}

          <div className="container">
            {leadObj.vehicleDetails?.map((item, index) => {
              const isDisabled = Boolean(item.installationKeyID);

              return (
                <div key={index} className="border rounded p-3 mb-3">
                  <h6 className="fw-bold mb-3">Vehicle {index + 1}</h6>

                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <label className="form-label">Vehicle Number</label>
                      <span style={{ color: 'red' }}>*</span>

                      <input
                        type="text"
                        maxLength={14}
                        className="form-control"
                        placeholder="Enter vehicle number"
                        value={item.vehicleNumber}
                        onChange={(e) => !isDisabled && handleChange(index, 'vehicleNumber', e.target.value.toUpperCase())}
                        disabled={isDisabled}
                      />
                      {item.errors?.vehicleNumber && <span style={{ color: 'red' }}>{item.errors.vehicleNumber}</span>}
                    </div>

                    <div className="col-md-6 mb-2">
                      <label className="form-label">Network Name</label>
                      <span style={{ color: 'red' }}>*</span>

                      <Select
                        placeholder="Select Network"
                        options={networkOption}
                        value={networkOption.find((opt) => opt.value === item.networkTypeID)}
                        onChange={(selected) =>
                          !isDisabled && handleChange(index, 'networkTypeID', Number(selected?.value) || '')
                        }
                        menuPosition="fixed"
                        isDisabled={isDisabled}
                      />
                      {item.errors?.networkTypeID && (
                        <span style={{ color: 'red' }}>{item.errors.networkTypeID}</span>
                      )}

                      {item.errors?.networkTypeID && <span style={{ color: 'red' }}>{item.errors.networkTypeID}</span>}
                    </div>

                    <div className="col-md-6 mb-2">
                      <label className="form-label">Product Type</label>
                      <span style={{ color: 'red' }}>*</span>

                      <Select
                        placeholder="Select Product Type"
                        options={govPortalOption}
                        value={govPortalOption.find((opt) => opt.value === item.productType)}
                        onChange={(selectedOption) => !isDisabled && handleChange(index, 'productType', Number(selectedOption?.value) || '')}
                        menuPosition="fixed"
                        isDisabled={isDisabled}
                      />
                      {item.errors?.productType && <span style={{ color: 'red' }}>{item.errors.productType}</span>}
                    </div>

                    <div className="col-md-6 mb-2">
                      <label className="form-label">Driver Name</label>
                      {/* <span style={{ color: 'red' }}>*</span> */}

                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter driver name"
                        value={item.driverName}
                        onChange={(e) => !isDisabled && handleChange(index, 'driverName', e.target.value)}
                        disabled={isDisabled}
                      />
                      {/* {item.errors?.driverName && <span style={{ color: 'red' }}>{item.errors.driverName}</span>} */}
                    </div>

                    <div className="col-md-6 mb-2">
                      <label className="form-label">Driver Phone Number</label>
                      {/* <span style={{ color: 'red' }}>*</span> */}

                      <input
                        type="text"
                        maxLength={10}
                        className="form-control"
                        placeholder="Enter phone number"
                        value={item.driverContact}
                        onChange={(e) => {
                          if (isDisabled) return;
                          const digitsOnly = e.target.value.replace(/\D/g, '');
                          if (digitsOnly === '' || digitsOnly[0] >= '6') {
                            handleChange(index, 'driverContact', digitsOnly);
                            handleError(index, ''); // clear error
                          } else {
                            handleError(index, 'Invalid phone number. It should start with 6-9');
                          }
                        }}
                        disabled={isDisabled}
                      />
                      {/* {item.errors?.driverContact && <span style={{ color: 'red' }}>{item.errors.driverContact}</span>} */}
                    </div>

                    <div className="col-md-6 mb-2">
                      <label className="form-label">Location</label>
                      <span style={{ color: 'red' }}>*</span>

                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter location"
                        value={item.location}
                        onChange={(e) => !isDisabled && handleChange(index, 'location', e.target.value)}
                        disabled={isDisabled}
                      />
                      {item.errors?.location && <span style={{ color: 'red' }}>{item.errors.location}</span>}
                    </div>
                  </div>

                  {/* Delete Button - Hide if disabled */}
                  {leadObj.vehicleDetails.length > 1 && !isDisabled && (
                    <div className="d-flex justify-content-end mt-2">
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(index)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}


            {/* Bottom Add Button */}
          </div>
        </div>
        <span style={{ color: 'red' }}>{errorMessage}</span>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="success" onClick={handleAddMore} disabled={!isLastGroupFilled()}>
          Add More +
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            handleClose();
            setInitialData();
          }}
        >
          Close
        </Button>
        <Button variant="primary" onClick={() => AddLeadBtnClick()}>
          {modelRequestData?.Action != null ? 'Update Lead' : 'Add Lead'}
        </Button>
      </Modal.Footer>

      <SuccessPopupModal
        show={showSuccessModel}
        onHide={() => closeAllModal()}
        setShowSuccessModal={setShowSuccessModal}
        modelAction={actionMassage}
      />

    </Modal>
  );
};

export default AddUpdateLeadModal;
