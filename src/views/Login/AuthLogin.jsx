import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Grid, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { VerifyLoginCredential } from 'services/LoginAuth/LoginApi';
import { ConfigContext, useAuth } from 'context/ConfigContext';
import { ERROR_MESSAGES } from 'component/GlobalMassage';
import { useNavigate } from 'react-router';
const AuthLogin = () => {

  const navigate=useNavigate()
  const { setLoader } = useContext(ConfigContext);

  const { login,authToken } = useAuth();
  const [requireErrorMessage, setRequireErrorMessage] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [LoginObj, setLoginObj] = useState({
    userName: null,
    password: '',
    loginFrom: null,
    macAddress: null
  });

   // Prevent authenticated users from accessing login page
   useEffect(() => {
    if (authToken) {
      navigate('/', { replace: true });
    }
  }, [authToken, navigate]);

  // Prevent back navigation on login page
  useEffect(() => {
    const preventBackNavigation = () => {
      window.history.pushState(null, '', window.location.href);
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', preventBackNavigation);

    return () => {
      window.removeEventListener('popstate', preventBackNavigation);
    };
  }, []);

  // 2] This function validate email id & password is in valid format
  const LoginBtnClicked = () => {
    // debugger;
    setErrorMessage('');
    if (LoginObj.userName === undefined || LoginObj.password === '') {
      setRequireErrorMessage(true);
      return false; // Return false or break the execution if password or email id is not fullFilled there regex condition.
    } else {
      setRequireErrorMessage(''); // Clear the error message if there are no errors.
    }

    setErrorMessage('');

    const ApiRequest_ParamsObj = {
      userName: LoginObj.userName,
      password: LoginObj.password,
      loginFrom: 'Admin Panel',
      macAddress: null
    };
    LoginData(ApiRequest_ParamsObj);
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

  useEffect(() => {
    if (location.pathname === '/logout') {
      const { logout } = useAuth();
      logout();
      // Replace current history entry
      window.location.replace('/login');
    }
  }, [location.pathname]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // useEffect(() => {
  //   const fetchIp = async () => {
  //     try {
  //       const response = await fetch('https://api.ipify.org?format=json');
  //       const data = await response.json();
  //       // setIpAddress(data.ip);
  //       setLoginObj((prev) => ({
  //         ...prev,
  //         macAddress: data.ip
  //       }));
  //       console.log(data.ip, 'IP Address');
  //     } catch (error) {
  //       console.error('Error fetching IP address:', error);
  //     }
  //   };
  //   fetchIp();
  // }, []);

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item xs={12}></Grid>
      </Grid>

      {ErrorMessage && (
        <div
          className="alert alert-danger fade show"
          style={{
            fontSize: 'small',
            textAlign: 'center' // Center the text
          }}
          role="alert"
        >
          {ErrorMessage === 'Username or password is incorrect' ? (
            'Email or password is incorrect'
          ) : ErrorMessage === 'Wrong Email/Password Combination' ? (
            <>{ErrorMessage}</>
          ) : (
            <>{ErrorMessage}</>
          )}
        </div>
      )}

      <TextField
        fullWidth
        label="Mobile No."
        margin="normal"
        name="userName"
        type="text"
        value={LoginObj.userName}
        maxLength={10}
        autoComplete="off"
        onChange={(e) => {
          const inputValue = e.target.value;
          const updatedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');

          setLoginObj({
            ...LoginObj,
            userName: updatedValue
          });
        }}
        // required
        variant="outlined"
      />

      {requireErrorMessage && (LoginObj.userName === null || LoginObj.userName === undefined || LoginObj.userName === '') ? (
        <span className='mb-1' style={{ color: 'red' }}>{ERROR_MESSAGES}</span>
      ) : (
        ''
      )}

      <FormControl fullWidth>
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={LoginObj.password}
          onChange={(e) => {
            const inputValue = e.target.value;
            const passwordWithoutSpaces = inputValue.replace(/\s+/g, ''); // Remove all spaces
            setLoginObj({
              ...LoginObj,
              password: passwordWithoutSpaces
            });
          }}
          label="Password"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
        {requireErrorMessage && (LoginObj.password === undefined || LoginObj.password === '') ? (
          <label className="validation mt-1" style={{ color: 'red' }}>
            {ERROR_MESSAGES}
          </label>
        ) : (
          ''
        )}
      </FormControl>

      <Box mt={2}>
        <Button color="primary" onClick={LoginBtnClicked} fullWidth size="large" type="submit" variant="contained">
          Log In
        </Button>
      </Box>
    </>
  );
};

export default AuthLogin;
