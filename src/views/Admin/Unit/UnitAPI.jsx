import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const GetUnitLookupList = async () => {
  let url = `${Base_Url}/api/Unit/GetUnitLookupList`;
  const res = await getListWithAuthenticated(url);
  return res;
};
