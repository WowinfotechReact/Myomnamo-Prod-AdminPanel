import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const GetBannerListAPI = async (params, KeyID) => {
  let url = '';

  if (KeyID !== null && KeyID !== '' && KeyID !== undefined) {
    url = `${Base_Url}/api/Banner/GetBannerList?BannerKeyID=${KeyID}`;
  } else {
    url = `${Base_Url}/api/Banner/GetBannerList`;
  }

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const ChangeBannerStatus = async (id, AppLangID) => {
  let url = '';

  if (AppLangID === null || AppLangID === undefined || AppLangID === '' || AppLangID === 0) {
    url = `${Base_Url}/api/Banner/ChangeBannerStatus?BannerKeyID=${id}`;
  } else {
    url = `${Base_Url}/api/Banner/ChangeBannerStatus?BannerKeyID=${id}&AppLangID=${AppLangID}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};

export const AddUpdateBannerAPI = async (params) => {
  let url = '';
  url = `${Base_Url}/api/Banner/AddUpdateBanner`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetBannerModalAPI = async (KeyID, appLangID) => {
  let url = '';
  if (appLangID === null || appLangID === undefined || appLangID === "") {
    url = `${Base_Url}/api/Banner/GetBannerModel?BannerKeyID=${KeyID}`;
  } else {
    url = `${Base_Url}/api/Banner/GetBannerModel?BannerKeyID=${KeyID}&AppLangID=${appLangID}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};
