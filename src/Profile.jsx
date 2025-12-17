import React, { useContext, useEffect, useState } from 'react';
import { Tooltip } from '@mui/material';
import EmployeeProfileModal from 'component/EmployeeProfileModal';
import { GetEmployeeModel } from 'services/Employee Staff/EmployeeApi';
import { ConfigContext } from 'context/ConfigContext';
import { useLocation } from 'react-router';
import dayjs from 'dayjs';

const Profile = () => {
  const [showEmployeeProfile, setShowEmployeeProfile] = React.useState(false);
  const { setLoader, user } = useContext(ConfigContext);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {

    GetEmployeeModelData();

  }, []);

  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [modelRequestData, setModelRequestData] = useState({
    Action: null,
    employeeKeyID: null
  });
  const location = useLocation();

  const [employeeObj, setEmployeeObj] = useState({
    name: null,
    address: null,
    aadharNo: null,
    userKeyID: null,
    employeeKeyID: null,
    companyID: null,
    profileImageURL: null,
    birthDate: null,
    mobileNo: null,
    emailID: null,
    seniorID: null,
    adharNumber: null,
    panNumber: null,
    bankAccountNumber: null,
    ifsc: null,
    higherAuthorityID: null,
    roleTypeID: null,
    userName: '',
    password: null
  });

  const [passportProfileImage, setPassportProfileImage] = useState(null);
  const [passportProfileImagePreview, setPassportProfileImagePreview] = useState('');


  useEffect(() => {

  }, [])





  return (
    <>
      <div className="card container-fluid">
        <div className="row g-0 d-flex flex-column">
          {/* Image Section (Moved to Top) */}
          <div
            className="col-12 gradient-custom text-white position-relative"
            style={{
              borderTopLeftRadius: "0.2rem",
              borderTopRightRadius: "0.2rem",
              overflow: "hidden",
              height: "300px", // Adjust height as needed
            }}
          >
            {/* Background Image with Low Opacity */}
            {imageUrl && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.5, // Adjust opacity level
                  zIndex: 0,
                }}
              />
            )}

            {/* Profile Image and Details at Bottom Corner */}
            <div
              style={{
                position: "absolute",
                bottom: "20px", // Adjust distance from bottom
                left: "20px", // Adjust distance from left (use "right" for bottom-right corner)
                zIndex: 1,
                display: "flex",
                alignItems: "flex-end", // Align items to the bottom
                gap: "10px", // Space between image and text
              }}
            >
              {/* Profile Image */}
              <img
                src={passportProfileImagePreview}
                alt="Avatar"
                className="img-fluid rounded-circle"
                style={{
                  width: "100px", // Adjust size as needed
                  height: "100px",
                  objectFit: "cover",
                  // border: "1px solid white",
                }}
              />

              {/* Name and Admin Text */}
              <div>
                <h5 style={{ margin: 0 }}>{employeeObj.name}</h5>
                <p style={{ margin: 0 }}>Admin</p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <Tooltip title="Update Profile">
              <span
                style={{
                  position: "absolute",
                  bottom: "20px", // Align with the image and text
                  right: "20px", // Position on the right side
                  cursor: "pointer",
                  zIndex: 1,
                }}
                onClick={EditBtnClick}
              >
                <i className="far fa-edit mb-1"></i> Update Profile
              </span>
            </Tooltip>
          </div>

          {/* Information Section (Moved to Bottom) */}
          <div className="col-12">
            <div className="p-3">
              <h6>Personal Information</h6>
              <hr className="mt-0 mb-1" />
              <div className="row pt-1">
                <div className="col-6 mb-1">
                  <h6>Admin Name</h6>
                  <p className="text-muted">{employeeObj.name}</p>
                </div>
                <div className="col-6 mb-3">
                  <h6>Date of Birth</h6>
                  <p className="text-muted">{employeeObj.birthDate
                    ? dayjs(employeeObj.birthDate, 'YYYY/MM/DD').format('DD/MM/YYYY')
                    : '-'}</p>
                </div>
                <div className="col-6 mb-3">
                  <h6>Contact Number</h6>
                  <p className="text-muted">{employeeObj.mobileNo}</p>
                </div>
                <div className="col-6 mb-3">
                  <h6>Email</h6>
                  <p className="text-muted">{employeeObj.emailID}</p>
                </div>
              </div>

              <h6>Bank Details</h6>
              <hr className="mt-0 mb-1" />
              <div className="row pt-1">
                <div className="col-6 mb-3">
                  <h6>IFSC Number</h6>
                  <p className="text-muted">{employeeObj.ifsc}</p>
                </div>
                <div className="col-6 mb-3">
                  <h6>Bank Account Number</h6>
                  <p className="text-muted">{employeeObj.bankAccountNumber}</p>
                </div>
              </div>

              <h6>Identity Documents</h6>
              <hr className="mt-0 mb-1" />
              <div className="row pt-1">
                <div className="col-6 mb-3">
                  <h6>PAN Number</h6>
                  <p className="text-muted">{employeeObj.panNumber}</p>
                </div>
                <div className="col-6 mb-3">
                  <h6>Aadhaar Card Number</h6>
                  <p className="text-muted">
                    {employeeObj.adharNumber?.toString().replace(/(\d{4})/g, "$1-").slice(0, -1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Section */}
        {showEmployeeProfile && (
          <EmployeeProfileModal
            show={showEmployeeProfile}
            setIsAddUpdateActionDone={setIsAddUpdateActionDone}
            onHide={() => setShowEmployeeProfile(false)}
            modelRequestData={modelRequestData}
          />
        )}
      </div>

    </>
  );
};

export default Profile;
