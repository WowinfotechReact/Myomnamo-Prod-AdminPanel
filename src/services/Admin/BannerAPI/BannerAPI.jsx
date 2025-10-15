import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const GetBannerListAPI = async (params, ProductCatKeyID) => {
  let url = '';

  url = `${Base_Url}/api/Banner/GetBannerList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const ChangeBannerStatus = async (id) => {
  let url = '';

  url = `${Base_Url}/api/Banner/ChangeBannerStatus?BannerKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const AddUpdateBannerAPI = async (params) => {
  let url = '';
  url = `${Base_Url}/api/Banner/AddUpdateBanner`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetBannerModalAPI = async (KeyID) => {
  let url = '';

  url = `${Base_Url}/api/Banner/GetBannerModel?BannerKeyID=${KeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
