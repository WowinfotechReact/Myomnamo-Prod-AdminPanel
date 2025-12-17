import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const GetEstoreBookingList = async (params) => {
  let url = '';
  url = `${Base_Url}/api/Product/GetAdminProductBookingList?Type=Product`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetEstoreBookingOrderDetailsAPI = async (BookingKeyID) => {
  let url = '';
  url = `${Base_Url}/api/Product/GetAdminProductOrderDetails?EstoreBookingKeyID=${BookingKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const ChangeEstoreOrderStatus = async (BookingKeyID, OrderStatusID) => {
  let url = '';
  url = `${Base_Url}/api/Product/ChangeProductOrderStatus?EstoreBookingKeyID=${BookingKeyID}&ProductOrderStatusID=${OrderStatusID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetProductSubPackageOrderListByUserID = async (params, UserKeyID) => {
  let url = '';
  // url = `${Base_Url}/api/Product/GetProductSubPackageOrderListByUserID?UserKeyID=${UserKeyID}`;
  url = `${Base_Url}/api/Product/GetProductSubPackageOrderListByUserID`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetProductSubPackageOrderDetails = async (EstoreBookingKeyID) => {
  let url = '';
  url = `${Base_Url}/api/Product/GetProductSubPackageOrderDetails?EstoreBookingKeyID=${EstoreBookingKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const ChangeProductSubscriptionPackageRefillStatus = async (PSPMDSID) => {
  let url = '';
  url = `${Base_Url}/api/Product/ChangeProductSubscriptionPackageRefillStatus?PSPMDSID=${PSPMDSID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
export const GetProductSubPackageMontlyStatusList = async (EstoreBookingKeyID) => {
  let url = '';
  url = `${Base_Url}/api/Product/GetProductSubPackageMontlyStatusList?EstoreBookingKeyID=${EstoreBookingKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};