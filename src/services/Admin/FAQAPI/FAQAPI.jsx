import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const GetFAQList = async (params, KeyID) => {
  let url = '';
  if (KeyID) {
    url = `${Base_Url}/api/FAQ/GetFAQList?FAQKeyID=${KeyID}`;
  } else {
    url = `${Base_Url}/api/FAQ/GetFAQList`;
  }

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const FAQChangeStatus = async (id, AppLangID) => {
  let url = '';
  if (AppLangID === null || AppLangID === undefined || AppLangID === '' || AppLangID === 0) {
    url = `${Base_Url}/api/FAQ/ChangeFAQStatus?FAQKeyID=${id}`;
  } else {
    url = `${Base_Url}/api/FAQ/ChangeFAQStatus?FAQKeyID=${id}&AppLangID=${AppLangID}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetServiceTypeLookupList = async (AppLangID) => {
  let url = '';

  url = `${Base_Url}/api/FAQ/GetServiceTypeLookupList`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetSubServiceTypeLookupList = async (serviceID) => {
  let url = '';

  url = `${Base_Url}/api/FAQ/GetSubServiceTypeLookupList?ServiceTypeID=${serviceID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const AddUpdateFAQAPI = async (params) => {
  let url = '';
  url = `${Base_Url}/api/FAQ/AddUpdateFAQ`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetFAQModalAPI = async (KeyID, appID) => {
  let url = '';
  if (appID) {
    url = `${Base_Url}/api/FAQ/GetFAQModel?FAQKeyID=${KeyID}&AppLangID=${appID}`;
  } else {
    url = `${Base_Url}/api/FAQ/GetFAQModel?FAQKeyID=${KeyID}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};
