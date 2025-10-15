import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const GetNewsLetterList = async (params, KeyID) => {
  let url = '';

  url = `${Base_Url}/api/NewsLetter/GetNewsLetterList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
