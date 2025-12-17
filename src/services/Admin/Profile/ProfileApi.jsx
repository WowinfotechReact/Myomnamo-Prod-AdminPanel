import { Base_Url } from "component/Base-Url/BaseUrl";
import { getListWithAuthenticated, postApiWithAuthenticated } from "services/ApiMethod/ApiMethod";

export const GetAdminProfile = async (AdminKeyID) => {
    let url = `${Base_Url}/Api/Admin/GetAdminProfile?AdminKeyID=${AdminKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
};

export const UpdateAdminProfile = async (params) => {
    let url = `${Base_Url}/Api/Admin/UpdateAdminProfile`;

    const res = await postApiWithAuthenticated(url, params);
    return res;
};