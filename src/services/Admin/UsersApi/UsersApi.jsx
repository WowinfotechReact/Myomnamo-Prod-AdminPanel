import { Base_Url } from "component/Base-Url/BaseUrl";
import { getListWithAuthenticated, postApiWithAuthenticated } from "services/ApiMethod/ApiMethod";

export const GetUserList = async (params) => {
    const url = `${Base_Url}/api/User/GetUserList`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const ViewTransactionHistoryByUser = async (UserKeyID) => {

    const url = `${Base_Url}/api/User/ViewTransactionHistoryByUser?UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
};

export const UserReferencedList = async (UserKeyID) => {

    const url = `${Base_Url}/api/User/UserReferencedList?UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
}
export const ViewUserDetails = async (UserKeyID) => {
    const url = `${Base_Url}/api/User/ViewUserDetails?UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
};

export const GetUserProfile = async (AdminKeyID) => {

    const url = `${Base_Url}/Admin/GetAdminProfile?AdminKeyID==${AdminKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
};