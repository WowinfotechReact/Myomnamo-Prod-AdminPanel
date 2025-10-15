import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const stateBaseUrl = `${Base_Url}/api/`;

export const GetStateList = async (params, StateKeyID) => {
  let url = '';
  if (StateKeyID === null || StateKeyID === undefined || StateKeyID === '') {
    url = `${stateBaseUrl}State/GetStateList?StateKeyID`;
  } else {
    url = `${stateBaseUrl}State/GetStateList?StateKeyID=${StateKeyID}`;
  }

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const ChangeStateStatus = async (id, appLangID) => {
  // If `id` already contains the full URL, just use it directly
  let url;

  if (id.startsWith('http')) {
    // Already a full URL
    url = id;
  } else {
    // Build from base url + params
    url = `${stateBaseUrl}State/ChangeStateStatus?StateKeyID=${id}`;
    if (appLangID) {
      url += `&AppLangID=${appLangID}`;
    }
  }

  const res = await getListWithAuthenticated(url);
  return res;
};

export const AddUpdateState = async (params) => {
  const url = `${stateBaseUrl}State/AddUpdateState`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetStateCategoryModel = async (id, AppLangID) => {
  let url = '';
  if (AppLangID == null || AppLangID === undefined || AppLangID === '') {
    url = `${stateBaseUrl}State/GetStateModel?StateKeyID=${id}`;
  } else {
    url = `${stateBaseUrl}State/GetStateModel?StateKeyID=${id}&AppLangID=${AppLangID}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetStateLookupList = async () => {
  let url = `${stateBaseUrl}State/GetStateLookupList`;
  const res = await getListWithAuthenticated(url);
  return res;
};
