import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseURL = `${Base_Url}/api/ProductSubscriptionPlan`;


export const GetProductSubscriptionPlanList = async (params, ProductKeyID, PSubPlanKeyID) => {
    let url = null;
    if (PSubPlanKeyID === null || PSubPlanKeyID === undefined || PSubPlanKeyID === "") {
        url = `${BaseURL}/GetProductSubscriptionPlanList?ProductKeyID=${ProductKeyID}`;

    } else {
        url = `${BaseURL}/GetProductSubscriptionPlanList?ProductKeyID=${ProductKeyID}&PSubPlanKeyID=${PSubPlanKeyID}`;
    }


    const res = await postApiWithAuthenticated(url, params);
    return res;
};


export const GetProductSubscriptionPlanModel = async (PSubPlanKeyID, AppLangID) => {
    let url = ""
    if (AppLangID === null || AppLangID === undefined || AppLangID === "") {
        url = `${BaseURL}/GetProductSubscriptionPlanModel?PSubPlanKeyID=${PSubPlanKeyID}`;
    } else {
        url = `${BaseURL}/GetProductSubscriptionPlanModel?PSubPlanKeyID=${PSubPlanKeyID}&AppLangID=${AppLangID}`;
    }

    const res = await getListWithAuthenticated(url);
    return res;
};
export const ChangeProductSubscriptionPlanStatus = async (PSubPlanKeyID, AppLangID) => {
    let url = ""
    if (AppLangID === null || AppLangID === undefined || AppLangID === "") {
        url = `${BaseURL}/ChangeProductSubscriptionPlanStatus?PSubPlanKeyID=${PSubPlanKeyID}`;
    } else {
        url = `${BaseURL}/ChangeProductSubscriptionPlanStatus?PSubPlanKeyID=${PSubPlanKeyID}&AppLangID=${AppLangID}`;
    }

    const res = await getListWithAuthenticated(url);
    return res;
};

export const AddUpdateProductSubscriptionPlan = async (params) => {
    const url = `${BaseURL}/AddUpdateProductSubscriptionPlan`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};