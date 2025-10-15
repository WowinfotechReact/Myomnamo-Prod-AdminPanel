import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const GetCouponCodeList = async (params, KeyID) => {
  let url = '';

  url = `${Base_Url}/api/CouponCode/GetCouponCodeList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const CouponChangeStatus = async (id, adminID) => {
  let url = '';

  url = `${Base_Url}/api/CouponCode/ChangeCouponCodeStatus?CouponCodeKeyID=${id}&AdminID=${adminID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const AddUpdateCouponCodeAPI = async (params) => {
  let url = '';
  url = `${Base_Url}/api/CouponCode/AddUpdateCouponCode`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetCouponCodeModalAPI = async (KeyID) => {
  let url = '';

  url = `${Base_Url}/api/CouponCode/GetCouponCodeModel?CouponCodeKeyID=${KeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
