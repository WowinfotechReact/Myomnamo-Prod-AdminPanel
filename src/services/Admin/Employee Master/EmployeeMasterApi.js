import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseUrl = `${Base_Url}/api`;

export const GetEmployeeMasterList = async (params) => {
  const url = `${BaseUrl}/MyomnamoEmployee/GetMyomnamoEmployeeList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateAdmin = async (params) => {
  const url = `${BaseUrl}Admin/AddUpdateAdmin`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetEmployeeMasterModel = async (id) => {
  let url = `${BaseUrl}/MyomnamoEmployee/GetMyomnamoEmployeeModel?EmployeeKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const EmployeeMasterAddUpdate = async (params) => {
  const url = `${BaseUrl}/MyomnamoEmployee/AddUpdateMyomnamoEmployee`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
