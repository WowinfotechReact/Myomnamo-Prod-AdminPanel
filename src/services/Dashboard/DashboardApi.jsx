import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseURL = `${Base_Url}/api/Dashboard`;

export const GetDashboardCounts = async (params) => {
    let url = `${BaseURL}/GetDashboardCounts`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

