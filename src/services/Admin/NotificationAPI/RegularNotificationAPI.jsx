import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const GetRegularNotificationAPI = async (params, ProductCatKeyID) => {
  let url = '';

  url = `${Base_Url}/api/RegularNotification/GetRegularNotificationList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const RegularNotificationChangeStatus = async (id, AppLangID) => {
  let url = '';

  url = `${Base_Url}/api/RegularNotification/ChangeRegularNotificationStatus?NotificationKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const AddUpdateNotificationAPI = async (params) => {
  let url = '';
  url = `${Base_Url}/api/RegularNotification/AddUpdateRegularNotification`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetNotificationModalAPI = async (KeyID) => {
  let url = '';

  url = `${Base_Url}/api/RegularNotification/GetRegularNotificationModel?NotificationKeyID=${KeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
