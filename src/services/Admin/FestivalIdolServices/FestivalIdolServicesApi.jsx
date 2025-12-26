import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseURL = `${Base_Url}/api/FestivalPackage`;

export const AddUpdateFestivalPackage = async (params) => {
    const url = `${BaseURL}/AddUpdateFestivalPackage`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};
export const GetFestivalPackageList = async (params) => {
    const url = `${BaseURL}/GetFestivalPackageList`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const GetFestivalPackageModel = async (FIB_ServiceKeyID, AppLangID) => {
    let url = `${BaseURL}/GetFestivalPackageModel?FIB_ServiceKeyID=${FIB_ServiceKeyID}`;
    if(AppLangID !== null && AppLangID !== undefined && AppLangID !== ''){
        url += `&AppLangID=${AppLangID}`;
    }
    const res = await getListWithAuthenticated(url);
    return res;
};
export const ChangeFestivalPackageStatus = async (FIB_ServiceKeyID, AppLangID) => {
    let url = `${BaseURL}/ChangeFestivalPackageStatus?FIB_ServiceKeyID=${FIB_ServiceKeyID}`;
    if(AppLangID !== null && AppLangID !== undefined && AppLangID !== ''){
        url += `&AppLangID=${AppLangID}`;
    }
    const res = await getListWithAuthenticated(url);
    return res;
};

export const GetFestivalIdolBookingList = async (params) => {
    const url = `${BaseURL}/GetFestivalIdolBookingList`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};