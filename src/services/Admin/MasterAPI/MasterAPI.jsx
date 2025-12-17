import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const GetPujaServiceTypeLookupList = async () => {
  let url = '';

  url = `${Base_Url}/api/PujaService/GetPujaServiceLookupList`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetPujaSubServiceTypeLookupList = async (id) => {
  let url = '';

  url = `${Base_Url}/api/PujaSubService/GetPujaSubServiceLookupList?PujaServiceID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetPujaTypeLookupList = async (params) => {
  let url = '';

  url = `${Base_Url}/api/Puja/GetPujaLookupList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetModuleTypeLookupList = async (PujaServiceID, PujaSubServiceID) => {
  let url = '';

  url = `${Base_Url}/api/Banner/GetBannerModuleLookupList?PujaServiceID=${PujaServiceID}&PujaSubServiceID=${PujaSubServiceID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
