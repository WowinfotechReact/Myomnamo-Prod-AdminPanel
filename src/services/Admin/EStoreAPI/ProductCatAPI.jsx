import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const AddUpdateProductCatAPI = async (params) => {
  let url = '';
  url = `${Base_Url}/api/ProductCategory/AddUpdateProductCategory`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetProductCatModalAPI = async (productCatKeyID, appID) => {
  let url = '';
  if (appID) {
    url = `${Base_Url}/api/ProductCategory/GetProductCategoryModel?ProductCatKeyID=${productCatKeyID}&AppLangID=${appID}`;
  } else {
    url = `${Base_Url}/api/ProductCategory/GetProductCategoryModel?ProductCatKeyID=${productCatKeyID}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetProductCatList = async (params, ProductCatKeyID) => {
  let url = '';
  if (ProductCatKeyID) {
    url = `${Base_Url}/api/ProductCategory/GetProductCategoryList?ProductCatKeyID=${ProductCatKeyID}`;
  } else {
    url = `${Base_Url}/api/ProductCategory/GetProductCategoryList`;
  }

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const ChangeStatus = async (id, AppLangID) => {
  let url = '';
  if (AppLangID === null || AppLangID === undefined || AppLangID === '' || AppLangID === 0) {
    url = `${Base_Url}/api/ProductCategory/ChangeProductCategoryStatus?ProductCatKeyID=${id}`;
  } else {
    url = `${Base_Url}/api/ProductCategory/ChangeProductCategoryStatus?ProductCatKeyID=${id}&AppLangID=${AppLangID}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetProductCategoryLookupList = async () => {
  let url = `${Base_Url}/api/ProductCategory/GetProductCategoryLookupList`;
  const res = await getListWithAuthenticated(url);
  return res;
};
