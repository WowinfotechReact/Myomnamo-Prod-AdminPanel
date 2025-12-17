import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseUrl = `${Base_Url}/api`;

export const GetPanditMasterList = async (params) => {
  const url = `${BaseUrl}/PanditMaster/GetPanditList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdatePandit = async (params) => {
  const url = `${BaseUrl}/PanditMaster/AddUpdatePandit`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetPanditModel = async (id) => {
  let url = `${BaseUrl}/PanditMaster/GetPanditModel?PanditKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const ChangePanditStatus = async (id) => {
  let url = `${BaseUrl}/PanditMaster/ChangePanditStatus?PanditKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const PanditLookupList = async (params) => {
  let url = `${BaseUrl}/PanditMaster/PanditLookupList?PanditKeyID=${params}`;

  const res = await getListWithAuthenticated(url,params);
  return res;
};

export const GetTempPanditList = async (params) => {
  const url = `${BaseUrl}/Pandit/GetTempPanditList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};