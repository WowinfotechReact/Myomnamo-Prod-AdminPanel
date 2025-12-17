import React, { createContext, useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Loader from '../Loader'; // Ensure correct import path for Loader

// Initial state for Config Context
export const ConfigContext = createContext();

// Config Provider
export const ConfigProvider = ({ children }) => {
  const [loader, setLoader] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [companyID, setCompanyID] = useState(localStorage.getItem('companyID') || null);
  const navigate = useNavigate();
  const [reloadOnce, setReloadOnce] = useState(false); // Flag to control reload
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [user, setUser] = useState(() => {
    // Retrieve user from localStorage if available
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  // Login handler
  const login = (token, userData) => {
    // Remove the password property from userData
    const { password, ...userDataWithoutPassword } = userData;

    // Set token and user data in state
    setAuthToken(token);
    setUser(userDataWithoutPassword);

    // Save token and user details (without password) to localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userDataWithoutPassword));

    navigate('/'); // Navigate to the desired route after login
  };

  // Logout handler
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setCompanyID(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); // Remove user details from localStorage
    localStorage.removeItem('companyID');


    navigate('/login');
    window.location.reload();

  };

  // Handle company selection
  const changeCompany = (newCompanyID) => {
    if (newCompanyID !== companyID) {
      setCompanyID(newCompanyID);
      if (newCompanyID === null) {
        localStorage.removeItem('companyID');
      } else {
        localStorage.setItem('companyID', newCompanyID);
      }
      setReloadOnce(true); // Set flag to trigger a one-time reload
    }
  };


  useEffect(() => {
    if (reloadOnce) {
      // Reload the component or perform necessary actions
      window.location.reload(); // Reloads the page without using the cache

      console.log('Reloading component for companyID:', companyID);
      setReloadOnce(false); // Reset the flag after reload
    }
  }, [reloadOnce, companyID]); // Only run when reloadOnce is true or companyID changes


  // Redirect to login if no token is present
  useEffect(() => {
    if (!authToken) {
      navigate('/login');
    }
  }, [authToken, navigate]);

  const formatTimeToAmPm = (time) => {
    return dayjs(time).format('hh:mm A');
  };


  const formatSlug = (value) => {
    const slug = value.toLowerCase().replace(/\s+/g, '-');
    return slug
  }

  const setListCount = (list) => {
    return list.length;
  };


  useEffect(() => {
    // Check if we're accessing through /logout path
    if (location.pathname === '/logout') {
      logout(); // Clear auth data
      // Force reload after logout
      // window.location.reload();
    }
  }, [logout]);

  const isValidEmail = (email) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
  };
  const isValidGST = (gst) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst.toUpperCase());
  };
  function formatToIndianCurrency(amount) {
    if (!amount) return "";

    const [integerPart, decimalPart] = amount.toString().split(".");

    // Format the integer part using Indian numbering system
    const formattedIntegerPart = integerPart.replace(
      // Match groups of 3 digits initially, then groups of 2 digits
      /(\d)(?=(\d\d)+\d$)/g,
      "$1,"
    );

    // Return the formatted value with the decimal part (if present)
    return decimalPart !== undefined
      ? `${formattedIntegerPart}.${decimalPart}`
      : formattedIntegerPart;
  }



  //slug generation function for all slug fields
  //TODO:move this under utils to prevent re-rendering
  function generateSlug(value = '') {
    if (!value) return '';
    return value
      .trim()                      // remove leading/trailing spaces
      .toLowerCase()               // lowercase everything
      .replace(/\s+/g, '-')        // replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '')  // remove special characters
      .replace(/-+/g, '-')         // collapse multiple hyphens
      .replace(/^-+|-+$/g, '');    // remove leading/trailing hyphens
  }


  function formatSlugOnChange(value = '') {
    return value
      .toLowerCase()
      .replace(/\s+/g, '-')        // replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '')  // remove special characters
      .replace(/-+/g, '-');        // collapse multiple hyphens
  }


  function cleanSlugOnBlur(value = '') {
    return value
      .trim()                      // remove spaces from start/end
      .replace(/^-+|-+$/g, '');    // remove leading/trailing hyphens
  }


  const truncateText = (text, maxLength = 30) => {
    if (!text) return ''; // handles null or undefined
    return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
  };



  return (
    <ConfigContext.Provider
      value={{
        loader,
        setToDate,
        toDate, fromDate, setFromDate,
        setLoader,
        authToken,
        user,
        login,
        companyID,
        changeCompany,
        logout,
        formatTimeToAmPm,
        setListCount,
        isValidEmail, isValidGST, isValidPAN,
        roleTypeID: user?.roleTypeID, // <-- Add this line
        formatToIndianCurrency,
        generateSlug,
        formatSlugOnChange,
        cleanSlugOnBlur,
        truncateText,
        formatSlug
      }}
    >
      {children}
      {loader && <Loader />}
    </ConfigContext.Provider>
  );
};

ConfigProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook for authentication
export const useAuth = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useAuth must be used within a ConfigProvider');
  }
  return {
    authToken: context?.authToken,
    user: context?.user,
    companyID: context?.companyID,
    changeCompany: context?.changeCompany,
    login: context?.login,
    logout: context?.logout,
  };
};

// Utility function for formatting date
export const formatDate = (newValue) => {
  if (dayjs(newValue).isValid()) {
    return dayjs(newValue).format('YYYY-MM-DD');
  }
};

export default ConfigProvider;
