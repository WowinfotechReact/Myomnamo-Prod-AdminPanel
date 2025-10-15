import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const GetPujaBookingList = async (params, PujaKeyID) => {
  let url = '';
  url = `${Base_Url}/api/Puja/GetPujaBookingList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetPujaBookingOrderDetailsAPI = async (PujaBookingKeyID) => {
  let url = '';
  url = `${Base_Url}/api/Puja/GetPujaBookingOrderDetails?PujaBookingKeyID=${PujaBookingKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetPanditLookupList = async (PujaBookingKeyID) => {
  let url = '';
  url = `${Base_Url}/api/Pandit/GetPanditLookupList`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const AssignPanditAPI = async (params) => {
  let url = '';
  url = `${Base_Url}/api/Puja/AssignPujasToPandit`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const ChangeOrderStatus = async (PujaBookingKeyID, PujaOrderStatusID) => {
  let url = '';
  url = `${Base_Url}/api/Puja/ChangePujaOrderStatus?PujaBookingKeyID=${PujaBookingKeyID}&PujaOrderStatusID=${PujaOrderStatusID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
