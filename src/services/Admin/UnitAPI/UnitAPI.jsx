import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const GetUnitList = async (params) => {
  let url = '';

  url = `${Base_Url}/api/Unit/GetUnitList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateUnitAPI = async (params) => {
  let url = '';
  url = `${Base_Url}/api/Unit/AddUpdateUnit`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetUnitModalAPI = async (KeyID) => {
  let url = '';

  url = `${Base_Url}/api/Unit/GetUnitModel?UnitKeyID=${KeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const ChangeUnitStatus = async (id) => {
  let url = '';
  url = `${Base_Url}/api/Unit/ChangeUnitStatus?UnitKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
