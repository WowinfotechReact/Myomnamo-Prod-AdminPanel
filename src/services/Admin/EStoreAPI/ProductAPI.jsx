import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const GetProductListAPI = async (params, type, id) => {
  let url = '';
  if (id) {
    url = `${Base_Url}/api/Product/GetProductList?ProductKeyID=${id}&Type=${type}`;
  } else {
    url = `${Base_Url}/api/Product/GetProductList?Type=${type}`;
  }

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateDataAPI = async (params) => {
  let url = '';
  url = `${Base_Url}/api/Product/AddUpdateProduct`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetProductModel = async (id, AppLangID) => {
  let url = '';
  if (AppLangID === null || AppLangID === undefined || AppLangID === '') {
    url = `${Base_Url}/api/Product/GetProductModel?ProductKeyID=${id}`;
  } else {
    url = `${Base_Url}/api/Product/GetProductModel?ProductKeyID=${id}&AppLangID=${AppLangID}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};

export const ChangeStatus = async (id, AppLangID) => {
  let url = '';
  if (AppLangID === null || AppLangID === undefined || AppLangID === '' || AppLangID === 0) {
    url = `${Base_Url}/api/Product/ChangeProductStatus?ProductKeyID=${id}`;
  } else {
    url = `${Base_Url}/api/Product/ChangeProductStatus?ProductKeyID=${id}&AppLangID=${AppLangID}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};

// export const GetProductCatModalAPI = async (productCatKeyID) => {
//   let url = '';
//   url = `${Base_Url}/api/Puja/GetPujaBookingOrderDetails?productCatKeyID=${productCatKeyID}`;

//   const res = await getListWithAuthenticated(url);
//   return res;
// };
