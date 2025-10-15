import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseURL = `${Base_Url}/api/SubscriptionPackage`;


export const GetPujaSubscriptionPackageList = async (params, PujaKeyID, TempPujaSubPackageKeyID) => {
    let url = null;
    if (TempPujaSubPackageKeyID === null || TempPujaSubPackageKeyID === undefined || TempPujaSubPackageKeyID === "") {
        url = `${BaseURL}/GetPujaSubscriptionPackageList?PujaKeyID=${PujaKeyID}`;

    } else {
        url = `${BaseURL}/GetPujaSubscriptionPackageList?PujaKeyID=${PujaKeyID}&TempPujaSubPackageKeyID=${TempPujaSubPackageKeyID}`;
    }


    const res = await postApiWithAuthenticated(url, params);
    return res;
};


export const GetPujaSubscriptionPackageModel = async (TempPujaSubPackageKeyID, AppLangID) => {
    let url = ""
    if (AppLangID === null || AppLangID === undefined || AppLangID === "") {
        url = `${BaseURL}/GetPujaSubscriptionPackageModel?TempPujaSubPackageKeyID=${TempPujaSubPackageKeyID}`;
    } else {
        url = `${BaseURL}/GetPujaSubscriptionPackageModel?TempPujaSubPackageKeyID=${TempPujaSubPackageKeyID}&AppLangID=${AppLangID}`;
    }

    const res = await getListWithAuthenticated(url);
    return res;
};

export const AddUpdatePujaSubscriptionPackage = async (params) => {
    const url = `${BaseURL}/AddUpdatePujaSubscriptionPackage`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};