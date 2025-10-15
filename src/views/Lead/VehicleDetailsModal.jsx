
import React, { useEffect, useContext, useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { ConfigContext } from 'context/ConfigContext';

import { GetLeadLogList, GetLeadModel } from 'services/LeadAPI/LeadApi';



function VehicleDetailsModal({ show, onHide, modelRequestData }) {
  const { setLoader, user } = useContext(ConfigContext);
  const [imeiLogsList, setIMEILogsList] = useState([]);
  const [govPortalOption, setGovPortalOption] = useState([]);



  useEffect(() => {
    if (modelRequestData.Action === 'TransferView') {
      EmployeeIMEILogs(modelRequestData.leadKeyID);
    }
  }, [show]);

  const EmployeeIMEILogs = async (leadKeyID) => {

    setLoader(true);
    try {
      const response = await GetLeadLogList(leadKeyID);

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const EmployeeIMEILogs = response?.data?.responseData?.data;

            setIMEILogsList(EmployeeIMEILogs);
          }
        } else {
          setLoader(false);
          setErrorMessage(response?.data?.errorMessage);
          setLoader(false);
        }
        return response;
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
      setLoader(false);
    }
  };
  useEffect(() => {
    if (
      modelRequestData?.leadKeyID !== null &&
      modelRequestData.Action === 'Update' // Don't change this naming convention
    ) {
      GetLeadModalData(modelRequestData?.leadKeyID);
    }
  }, [modelRequestData]);
  const [leadObj, setLeadObj] = useState({
    leadKeyID: '',
    customerID: '',
    detailedDescription: '',
    leadTypeID: '',
    vehicleDetails: [], // important,
    productTypeName: null
  });


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
          vehicleDetails: ModelData.vehicleDetails,
          productTypeName: ModelData.productTypeName,
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

  useEffect(() => {
    GetGovtPortalLookupListData();
  }, [show]);
  const GetGovtPortalLookupListData = async () => {
    try {
      const response = await GetGovtPortalLookupList(); // Ensure this function is imported correctly

      if (response?.data?.statusCode === 200) {
        const govPortalLookupList = response?.data?.responseData?.data || [];

        const formattedGOVList = govPortalLookupList.map((govPortalItem) => ({
          value: govPortalItem.governmentPortalID,
          label: govPortalItem.governmentPortalName
        }));

        setGovPortalOption(formattedGOVList); /// Make sure you have a state setter function for IVR list
      } else {
        console.error('Failed to fetch vehicle Type lookup list:', response?.data?.statusMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching vehicle Type lookup list:', error);
    }
  };
  return (
    <Modal size='lg' backdrop="static" keyboard={false} style={{ zIndex: 1300 }} show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <b>Lead Vehicle Details</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="scrollable-table">
        <Table striped bordered hover>
          <thead className="text-nowrap">
            <tr>
              <th className="text-center">Vehicle Number</th>
              <th className="text-center">Driver Name</th>
              <th className="text-center">Driver Contact</th>
              <th className="text-center">Location</th>
              <th className="text-center">Product Name</th>
            </tr>
          </thead>
          <tbody>
            {leadObj.vehicleDetails && leadObj.vehicleDetails.length > 0 ? (
              leadObj.vehicleDetails.map((vehicle, index) => (
                <tr key={index}>
                  <td className="text-center">{vehicle.vehicleNumber || '-'}</td>
                  <td className="text-center">{vehicle.driverName || '-'}</td>
                  <td className="text-center">{vehicle.driverContact || '-'}</td>
                  <td className="text-center">{vehicle.location || '-'}</td>
                  <td className="text-center">{vehicle.productTypeName || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No Records Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>


      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          <b>Close</b>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default VehicleDetailsModal;

