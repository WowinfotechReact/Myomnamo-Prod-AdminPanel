import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseURL = `${Base_Url}/api/PujaCategory`;

export const GetPujaCategoryList = async (params, PujaCatKeyID) => {
  let url = '';
  if (PujaCatKeyID === null || PujaCatKeyID === undefined || PujaCatKeyID === '') {
    url = `${BaseURL}/GetPujaCategoryList`;
  } else {
    url = `${BaseURL}/GetPujaCategoryList?PujaCatKeyID=${PujaCatKeyID}`;
  }

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdatePujaCategory = async (params) => {
  const url = `${BaseURL}/AddUpdatePujaCategory`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetPujaCategoryModel = async (id, AppLangID) => {
  let url = '';
  if (AppLangID === null || AppLangID === undefined || AppLangID === '') {
    url = `${BaseURL}/GetPujaCategoryModel?PujaCatKeyID=${id}`;
  } else {
    url = `${BaseURL}/GetPujaCategoryModel?PujaCatKeyID=${id}&AppLangID=${AppLangID}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};

export const ChangePujaCategoryStatus = async (id, AppLangID) => {
  let url = '';
  if (AppLangID === null || AppLangID === undefined || AppLangID === '') {
    url = `${BaseURL}/ChangePujaCategoryStatus?PujaCatKeyID=${id}`;
  } else {
    url = `${BaseURL}/ChangePujaCategoryStatus?PujaCatKeyID=${id}&AppLangID=${AppLangID}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetPujaCategoryLookupList = async (id, AppLangID) => {
  let url = '';
  if (AppLangID === null || AppLangID === undefined || AppLangID === '') {
    url = `${BaseURL}/GetPujaCategoryLookupList`;
  } else {
    url = `${BaseURL}/GetPujaCategoryLookupList?AppLangID=${AppLangID}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};
