import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import BGVdo from '../../assets/images/loginAnimation.mp4';
import logo from '../../assets/images/nelogin.png'
import rightLogo from '../../assets/images/HeaderLogo.png'
import AuthLogin from './AuthLogin';
import { ConfigContext, useAuth } from 'context/ConfigContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ERROR_MESSAGES, InValidMobileNumberMassage } from 'component/GlobalMassage';
import { VerifyLoginCredential } from 'services/LoginAuth/LoginApi';

// ==============================|| LOGIN ||============================== //

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate()
  const { setLoader } = useContext(ConfigContext);
  const [error, setError] = useState(false)
  const { login, authToken } = useAuth();
  const [requireErrorMessage, setRequireErrorMessage] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [LoginObj, setLoginObj] = useState({
    userName: null,
    password: '',
    loginFrom: null,
    macAddress: null
  });




  const LoginBtnClicked = () => {

    let isValid = true
    if (LoginObj.userName === null || LoginObj.userName === undefined || LoginObj.userName === '' ||
      LoginObj.password === null || LoginObj.password === undefined || LoginObj.password === ''
    ) {
      isValid = false
      setError(true)
    } else if ((LoginObj.userName !== null && LoginObj.userName !== undefined && LoginObj.userName !== '') && LoginObj.userName?.length < 10) {
      isValid = false
      setError(true)
    }
    const ApiRequest_ParamsObj = {
      mobileNo: LoginObj.userName,
      password: LoginObj.password,
      loginFrom: 'Admin Panel',
      macAddress: null
    };
    if (isValid) {
      LoginData(ApiRequest_ParamsObj);
    }
  };

  const LoginData = async (ApiRequest_ParamsObj) => {
    setLoader(true); // Start loading
    try {
      const response = await VerifyLoginCredential(ApiRequest_ParamsObj);

      if (response?.data?.statusCode === 200) {
        setLoader(false);
        const userData = response.data.responseData.data; // Extract user data
        const token = userData.token; // Extract token
        login(token, userData);

        window.history.pushState(null, '', '/');
      } else {
        // Handle all types of errors
        const errorMessage = response.response?.data?.errorMessage || 'An error occurred.';
        setLoader(false);
        setErrorMessage(errorMessage);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoader(false);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoader(false);
    }
  };



  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-end"
      style={{
        backgroundImage: `url(${logo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden'
      }}
    >
      <div className="row w-100 justify-content-end">
        <div className="col-md-5  d-flex justify-content-center align-items-center">
          <img
            src={rightLogo}
            alt="Logo"
            className="img-fluid"
            style={{ maxHeight: "300px", objectFit: "contain" }}
          />
        </div>
        <div className="col-md-4 d-flex justify-content-center">
          <div className="card shadow p-4 w-100" style={{ maxWidth: '475px', height: '330px' }}>
            <div className="card-body" style={{ height: 'auto' }}>
              <div className="d-flex align-items-center mb-3">
                <div className="flex-grow-1 border-bottom border-secondary"></div>
                <span className="mx-2 text-muted fw-semibold" style={{ fontSize: '20px' }}>Inventory Panel</span>
                <div className="flex-grow-1 border-bottom border-secondary"></div>
              </div>

              {/* Login Form */}
              <div>
                {ErrorMessage !== null && (
                  <div className="text-danger text-center border fw-bold fs-m mb-2">{ErrorMessage}</div>
                )}

                <div className="mb-3">
                  <label htmlFor="mobile" className="form-label">
                    Mobile No. <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="mobile"
                    placeholder="Enter mobile number"
                    value={LoginObj.userName}
                    maxLength={10}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const updatedValue = inputValue.replace(/[^0-9]/g, '');
                      setErrorMessage(null);
                      setLoginObj({ ...LoginObj, userName: updatedValue });
                    }}
                    autoComplete="off"
                  />
                  {error && !LoginObj.userName ? <div className="text-danger">{ERROR_MESSAGES}</div> : error && LoginObj.userName?.length < 10 ?
                    <div className="text-danger">{InValidMobileNumberMassage}</div> : ''
                  }
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control pe-5"
                      id="password"
                      placeholder="Enter password"
                      value={LoginObj.password}
                      onChange={(e) => {
                        setErrorMessage(null);
                        const inputValue = e.target.value;
                        const passwordWithoutSpaces = inputValue.replace(/\s+/g, '');
                        setLoginObj({ ...LoginObj, password: passwordWithoutSpaces });
                      }}
                    />
                    <span
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      className="position-absolute top-50 end-0 translate-middle-y pe-3"
                      style={{ cursor: 'pointer', zIndex: 10 }}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </span>
                  </div>
                  {error && !LoginObj.password && (
                    <div className="text-danger mt-1">{ERROR_MESSAGES}</div>
                  )}
                </div>

                <button className="btn btn-primary w-100" onClick={() => LoginBtnClicked()}>
                  LOG IN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default Login;
