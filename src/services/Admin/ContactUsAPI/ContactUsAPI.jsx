import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const GetContactUsList = async (params, ProductCatKeyID) => {
  let url = '';

  url = `${Base_Url}/api/ContactUs/GetContactUsList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
