import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const GetImageCatList = async (params, ProductCatKeyID) => {
  let url = '';
  if (ProductCatKeyID) {
    url = `${Base_Url}/api/ProductCategory/GetProductCategoryList?ProductCatKeyID=${ProductCatKeyID}`;
  } else {
    url = `${Base_Url}/api/ProductCategory/GetProductCategoryList`;
  }

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateImageCatAPI = async (params) => {
  let url = '';
  url = `${Base_Url}/api/ProductCategory/AddUpdateProductCategory`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetImageCatModalAPI = async (productCatKeyID, appID) => {
  let url = '';
  if (appID) {
    url = `${Base_Url}/api/ProductCategory/GetProductCategoryModel?ProductCatKeyID=${productCatKeyID}&AppLangID=${appID}`;
  } else {
    url = `${Base_Url}/api/ProductCategory/GetProductCategoryModel?ProductCatKeyID=${productCatKeyID}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};
