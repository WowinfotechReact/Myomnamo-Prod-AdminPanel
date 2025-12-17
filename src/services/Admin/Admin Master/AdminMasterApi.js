import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseUrl = `${Base_Url}/api`;

export const GetAdminList = async (params) => {
  const url = `${BaseUrl}/Admin/GetAdminList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateAdmin = async (params) => {
  const url = `${BaseUrl}Admin/AddUpdateAdmin`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetAdminModel = async (id) => {
  let url = `${BaseUrl}/Admin/GetAdminModel?AdminKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const AdminAddUpdate = async (params) => {
  const url = `${BaseUrl}/Admin/AddUpdateAdmin`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
