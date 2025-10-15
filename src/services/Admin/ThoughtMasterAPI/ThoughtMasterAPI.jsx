import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const GetThoughtList = async (params, ThoughtKeyID) => {
  let url = '';

  if (ThoughtKeyID) {
    url = `${Base_Url}/api/Thought/GetThoughtList?ThoughtKeyID=${ThoughtKeyID}`;
  } else {
    url = `${Base_Url}/api/Thought/GetThoughtList`;
  }

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateThoughtAPI = async (params) => {
  let url = '';
  url = `${Base_Url}/api/Thought/AddUpdateThought`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetThoughtModalAPI = async (KeyID, appID) => {
  let url = '';
  if (appID) {
    url = `${Base_Url}/api/Thought/GetThoughtModel?ThoughtKeyID=${KeyID}&AppLangID=${appID}`;
  } else {
    url = `${Base_Url}/api/Thought/GetThoughtModel?ThoughtKeyID=${KeyID}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};

export const ThoughtChangeStatusByLang = async (id, AppLangID) => {
  let url = '';
  if (AppLangID === null || AppLangID === undefined || AppLangID === '' || AppLangID === 0) {
    url = `${Base_Url}/api/Thought/ChangeThoughtStatus?ThoughtKeyID=${id}`;
  } else {
    url = `${Base_Url}/api/Thought/ChangeThoughtStatus?ThoughtKeyID=${id}&AppLangID=${AppLangID}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};
