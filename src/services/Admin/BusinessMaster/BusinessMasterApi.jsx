import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseURL = `${Base_Url}/api/BusinessMaster`;

export const GetBusinessMasterList = async (params,BusinessTypeID) => {
    const url = `${BaseURL}/GetBusinessMasterList?BusinessTypeID=${BusinessTypeID}`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};
