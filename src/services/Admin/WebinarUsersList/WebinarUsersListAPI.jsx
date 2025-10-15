import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const GetWebinarUserList = async (params, KeyID) => {
  let url = '';

  url = `${Base_Url}/api/WebinarUser/GetWebinarUserList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
