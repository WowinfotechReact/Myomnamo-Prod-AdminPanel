import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { AssignPanditAPI, GetPanditLookupList } from 'services/Admin/PujaBookingAPI/PujaBookingAPI';
import { ConfigContext } from 'context/ConfigContext';
import Select from 'react-select';

const AssignPanditModal = ({ show, onHide, modelRequestData, setIsAddUpdateDone }) => {
  // Static Pandit list
  //   const panditList = [
  //     { value: 1, label: 'Pandit Rajesh Sharma' },
  //     { value: 2, label: 'Pandit Anil Joshi' },
  //     { value: 3, label: 'Pandit Suresh Mishra' },
  //     { value: 4, label: 'Pandit Vinod Pandey' }
  //   ];

  const [selectedPandit, setSelectedPandit] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [panditList, setPanditList] = useState([]);
  const { setLoader } = useContext(ConfigContext);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    AssignPanditLookupList();
  }, []);

  const AssignPanditLookupList = async () => {
    try {
      const res = await GetPanditLookupList();
      if (res) {
        if (res?.data?.statusCode === 200) {
          setLoader(false);
          if (res?.data?.responseData?.data) {
            const panditList = res.data.responseData.data.map((item) => ({
              value: item.panditID,
              label: item.panditName
            }));

            console.log('panditList', panditList);

            setPanditList(panditList);
          }
        } else {
          console.error(res?.data?.errorMessage);
          setLoader(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = () => {
    if (!selectedPandit) {
      alert('Please select a pandit');
      return;
    }
    console.log('Assigned Pandit:', selectedPandit);

    // 🔑 Here you can call API to assign pandit
    if (setIsAddUpdateDone) {
      setIsAddUpdateDone(true);
    }
    onHide();
  };

  const handlePanditChange = (selectedOption) => {
    setSelectedPandit(selectedOption);
  };

  const handleAssignPandit = () => {
    if (!selectedPandit) {
      alert('Please select pandit');
      return;
    }

    const params = {
      pujaBookingID: modelRequestData.selectedPujas,
      panditID: selectedPandit.value
    };

    AssignPandit(params);
  };

  const AssignPandit = async (params) => {
    try {
      const res = await AssignPanditAPI(params);
      if (res) {
        if (res?.data?.statusCode === 200) {
          setLoader(false);
          if (res?.data?.responseData?.data) {
            // setShowSuccessModal(true);
            setIsAddUpdateDone(true);
          }
        } else {
          console.error(res?.data?.errorMessage);
          setLoader(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setInitial = () => {
    setSelectedPandit(null);
    onHide();
  };

  const closeAll = () => {
    setShowSuccessModal(false);
  };

  return (
    <Modal style={{ zIndex: 1300 }} show={show} backdrop="static" keyboard={false} centered>
      <Modal.Header>
        <h4 className="text-center">Assign Pandit</h4>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="selectPandit">
          <Form.Label>Select Pandit</Form.Label>

          <Select
            options={panditList}
            value={selectedPandit}
            onChange={handlePanditChange}
            styles={{
              container: (provided) => ({
                ...provided,
                width: '100%',
                minWidth: '320px'
              })
            }}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            onHide();
            setInitial();
          }}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            handleAssignPandit();
            setInitial();
          }}
        >
          Submit
        </Button>
      </Modal.Footer>

      {/* <SuccessModal show={showSuccessModal} onHide={closeAll} /> */}
    </Modal>
  );
};

export default AssignPanditModal;
