import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const districtBaseUrl = `${Base_Url}/api/`;

export const GetDistrictList = async (params, StateKeyID) => {
  let url = '';
  if (StateKeyID === null || StateKeyID === undefined || StateKeyID === '') {
    url = `${districtBaseUrl}District/GetDistrictList?DistrictKeyID`;
  } else {
    url = `${districtBaseUrl}District/GetDistrictList?DistrictKeyID=${StateKeyID}`;
  }

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const ChangeDistrictStatus = async (id, appLangID) => {
  // If `id` already contains the full URL, just use it directly
  let url;

  if (id.startsWith('http')) {
    // Already a full URL
    url = id;
  } else {
    // Build from base url + params
    url = `${districtBaseUrl}District/ChangeDistrictStatus?DistrictKeyID=${id}`;
    if (appLangID) {
      url += `&AppLangID=${appLangID}`;
    }
  }

  const res = await getListWithAuthenticated(url);
  return res;
};

export const AddUpdateDistrict = async (params) => {
  const url = `${districtBaseUrl}District/AddUpdateDistrict`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetDistrictModel = async (id, AppLangID) => {
  let url = '';
  if (AppLangID == null || AppLangID === undefined || AppLangID === '') {
    url = `${districtBaseUrl}District/GetDistrictModel?DistrictKeyID=${id}`;
  } else {
    url = `${districtBaseUrl}District/GetDistrictModel?DistrictKeyID=${id}&AppLangID=${AppLangID}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};
