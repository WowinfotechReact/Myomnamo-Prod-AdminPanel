import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const AddUpdateNotificationTemplateAPI = async (params) => {
  let url = '';
  url = `${Base_Url}/api/NotificationTemplate/AddUpdateNotificationTemplate`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetNotificationTemplateModalAPI = async (KeyID) => {
  let url = '';

  url = `${Base_Url}/api/NotificationTemplate/GetNotificationTemplateModel?NotiTemplateKeyID=${KeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetNotificationList = async (params, ProductCatKeyID) => {
  let url = '';

  url = `${Base_Url}/api/NotificationTemplate/GetNotificationTemplateList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const NotificationTemplateChangeStatus = async (id) => {
  let url = '';

  url = `${Base_Url}/api/NotificationTemplate/ChangeNotificationTemplateStatus?NotiTemplateKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetNotificationTemplateLookupList = async () => {
  let url = '';

  url = `${Base_Url}/api/NotificationTemplate/GetNotificationTemplateLookupList`;

  const res = await getListWithAuthenticated(url);
  return res;
};
