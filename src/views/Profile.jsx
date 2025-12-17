import React, { useContext, useEffect, useState } from 'react';
import { Tooltip } from '@mui/material';

import { ConfigContext } from 'context/ConfigContext';
import { useLocation } from 'react-router';
import dayjs from 'dayjs';
import { GetAdminProfile, UpdateAdminProfile } from 'services/Admin/Profile/ProfileApi';
import { FaCamera } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Profile = () => {
    const location = useLocation();
    const { setLoader, user } = useContext(ConfigContext);

    const [showError, setShowError] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
    const [profileObj, setProfileObj] = useState({
        adminName: null,
        mobileNo: null,
        password: null,
        roleTypeID: null,
        password: null,
        email: null
    });



    useEffect(() => {
        GetAdminProfileData();
    }, []);

    useEffect(() => {
        if (isAddUpdateActionDone) {
            GetAdminProfileData();
            setIsAddUpdateActionDone(false);
        }
    }, [isAddUpdateActionDone]);

    const GetAdminProfileData = async (id) => {
        setLoader(true);
        try {
            const data = await GetAdminProfile(user?.adminKeyID);
            if (data?.data?.statusCode === 200) {
                setLoader(false);
                const ModelData = data.data.responseData.data; // Assuming data is an array


                setProfileObj({
                    ...profileObj,
                    adminName: ModelData?.adminName,
                    mobileNo: ModelData?.mobileNo,
                    email: ModelData?.email,
                    password: ModelData?.password,
                    roleTypeID: ModelData?.roleTypeID
                });

            } else {
                setLoader(false);
                // Handle non-200 status codes if necessary
                console.error('Error fetching data: ', data?.data?.statusCode);
            }
        } catch (error) {
            setLoader(false);
            console.error('Error in Profile: ', error);
        }
    };

    const [previewImage, setPreviewImage] = useState(profileObj.profileImage);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileObj((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileObj((prev) => ({ ...prev, profileImage: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const HandleSubmitClicked = () => {
        let isValid = true
        if (profileObj?.adminName === null || profileObj?.adminName === undefined || profileObj?.adminName === "" ||
            profileObj?.email === null || profileObj?.email === undefined || profileObj?.email === "" ||
            profileObj?.mobileNo === null || profileObj?.mobileNo === undefined || profileObj?.mobileNo === "" ||
            profileObj?.roleTypeID === null || profileObj?.roleTypeID === undefined || profileObj?.roleTypeID === "" ||
            profileObj?.password === null || profileObj?.password === undefined || profileObj?.password === ""
        ) {
            isValid = false;
            setShowError(true)
        } else if ((profileObj?.mobileNo !== null && profileObj?.mobileNo !== undefined && profileObj?.mobileNo !== "") && profileObj?.mobileNo?.length !== 10) {
            isValid = false;
            setShowError(true)
        } else if ((profileObj?.password !== null && profileObj?.password !== undefined && profileObj?.password !== "") && profileObj?.password?.length <= 5) {
            isValid = false;
            setShowError(true)
        }
        const apiParam = {
            adminkeyID: user?.adminKeyID,
            adminName: profileObj?.adminName,
            mobileNo: profileObj?.mobileNo,
            email: profileObj?.email,
            roleTypeID: profileObj?.roleTypeID,
            password: profileObj?.password,
        }

        if (isValid) {
            UpdateAdminProfileData(apiParam)
        }
    }

    const UpdateAdminProfileData = async (apiParam) => {
        setLoader(true);
        try {
            const data = await UpdateAdminProfile(apiParam);
            if (data?.data?.statusCode === 200) {
                setLoader(false);
                setIsAddUpdateActionDone(true)

            } else {
                setLoader(false);
                // Handle non-200 status codes if necessary
                console.error('Error fetching data: ', data?.data?.statusCode);
            }
        } catch (error) {
            setLoader(false);
            console.error('Error in Profile: ', error);
        }
    };

    return (
        <>
            <div className="card shadow-sm container-fluid p-4 mt-1" style={{ maxWidth: "700px" }}>
                <div className="text-center mb-4 position-relative">
                    <div className="position-relative d-inline-block">
                        <img
                            src={
                                previewImage ||
                                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            }
                            alt="Profile"
                            className="rounded-circle border"
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                        {/* <label
                            htmlFor="profileImage"
                            className="position-absolute bottom-0 end-0 bg-white border rounded-circle p-2 shadow-sm"
                            style={{ cursor: "pointer" }}
                        >
                            <FaCamera color="#8f3246" />
                            <input
                                id="profileImage"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                hidden
                            />
                        </label> */}
                    </div>
                </div>

                <div >
                    <h5 className="mb-3 text-center text-primary">Edit Profile</h5>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Admin Name</label>
                            <input
                                type="text"
                                name="adminName"
                                value={profileObj.adminName}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter name"
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Contact Number</label>
                            <input
                                type="text"
                                name="mobileNo"
                                value={profileObj.mobileNo}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter contact number"
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={profileObj.email}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter email"
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Password</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={profileObj?.password}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Enter password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    style={{
                                        borderColor: "#ced4da",
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    {showPassword ? (
                                        <FaEyeSlash color="#8f3246" />
                                    ) : (
                                        <FaEye color="#8f3246" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Role Type</label>
                            <select
                                name="roleTypeID"
                                value={profileObj.roleTypeID}
                                onChange={handleChange}
                                className="form-select"
                                disabled
                            >
                                <option value={1}>Admin</option>
                                <option value={2}>Inventory</option>
                            </select>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <button
                            onClick={() => HandleSubmitClicked()}
                            className="btn px-4"
                            style={{ backgroundColor: "#8f3246", color: "#fff" }}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Profile;