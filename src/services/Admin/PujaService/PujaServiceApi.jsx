import { Base_Url } from "component/Base-Url/BaseUrl";
import { getListWithAuthenticated } from "services/ApiMethod/ApiMethod";

const baseUrl = `${Base_Url}/api`

export const GetPujaServiceLookupList = async () => {
    let url = `${baseUrl}/PujaService/GetPujaServiceLookupList`;
    const res = await getListWithAuthenticated(url);
    return res;
};
export const GetPujaSubServiceLookupList = async (PujaServiceID) => {
    let url = `${baseUrl}/PujaSubService/GetPujaSubServiceLookupList?PujaServiceID=${PujaServiceID}`;
    const res = await getListWithAuthenticated(url);
    return res;
};