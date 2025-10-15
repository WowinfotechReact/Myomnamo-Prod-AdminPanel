import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const AddUpdateCalenderNotifiTemplateAPI = async (params) => {
  let url = '';
  url = `${Base_Url}/api/NotiTempScheduling/AddUpdateNotiTemplateScheduling`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetCalenderNotifiList = async (params) => {
  let url = '';

  url = `${Base_Url}/api/NotiTempScheduling/GetNotiTemplateSchedulingList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const CalenderNotifiChangeStatus = async (id) => {
  let url = '';

  url = `${Base_Url}/api/NotiTempScheduling/ChangeNotiTemplateSchedulingStatus?FestNotiTemplateKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetCalenderTemplateModalAPI = async (KeyID) => {
  let url = '';

  url = `${Base_Url}/api/NotiTempScheduling/GetNotiTemplateSchedulingModel?FestNotiTemplateKeyID=${KeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
