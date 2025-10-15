import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const GetImageListAPI = async (params, ProductCatKeyID) => {
  let url = '';

  url = `${Base_Url}/api/Image/GetImageList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const ChangeImageStatus = async (id) => {
  let url = '';

  url = `${Base_Url}/api/Image/ChangeImageStatus?ImageKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetImageCategoryLookupList = async () => {
  let url = '';
  url = `${Base_Url}/api/Image/GetImageCatLookupList`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const AddUpdateImageAPI = async (params) => {
  let url = '';
  url = `${Base_Url}/api/Image/AddUpdateImage`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetImageModalAPI = async (KeyID) => {
  let url = '';

  url = `${Base_Url}/api/Image/GetImageModel?ImageKeyID=${KeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
