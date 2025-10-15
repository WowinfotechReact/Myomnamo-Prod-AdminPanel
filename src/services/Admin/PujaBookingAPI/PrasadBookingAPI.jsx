import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const GetPrasadBookingOrderDetailsAPI = async (BookingKeyID) => {
  let url = '';
  url = `${Base_Url}/api/Product/GetAdminProductOrderDetails?EstoreBookingKeyID=${BookingKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetPrasadBookingList = async (params) => {
  let url = '';
  url = `${Base_Url}/api/Product/GetAdminProductBookingList?Type=Prasad`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
