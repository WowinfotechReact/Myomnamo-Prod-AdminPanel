import { Base_Url } from "component/Base-Url/BaseUrl";
import { getListWithAuthenticated } from "services/ApiMethod/ApiMethod";

const BaseUrl = `${Base_Url}/api/AppLanguage`

export const GetAppLanguageLookupList = async () => {
    let url = `${BaseUrl}/GetAppLanguageLookupList?ApplicationType=Website`;
    const res = await getListWithAuthenticated(url);
    return res;
};