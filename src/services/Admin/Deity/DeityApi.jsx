import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseURL = `${Base_Url}/api/Deity`;

export const GetDeityList = async (params, DeityKeyID) => {
    let url = ""
    if (DeityKeyID === null || DeityKeyID === undefined || DeityKeyID === "") {
        url = `${BaseURL}/GetDeityList`;
    } else {
        url = `${BaseURL}/GetDeityList?DeityKeyID=${DeityKeyID}`;
    }

    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const AddUpdateDeity = async (params) => {
    const url = `${BaseURL}/AddUpdateDeity`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const GetDeityModel = async (id, AppLangID) => {
    let url = ""
    if (AppLangID === null || AppLangID === undefined || AppLangID === "") {
        url = `${BaseURL}/GetDeityModel?deityKeyID=${id}`;
    } else {
        url = `${BaseURL}/GetDeityModel?deityKeyID=${id}&AppLangID=${AppLangID}`;
    }

    const res = await getListWithAuthenticated(url);
    return res;
};
export const GetDeityLookupList = async () => {
    let url = `${BaseURL}/GetDeityLookupList`;
    const res = await getListWithAuthenticated(url);
    return res;
};
export const ChangeDeityStatus = async (id, AppLangID) => {
    let url = "";
    if (AppLangID === null || AppLangID === undefined || AppLangID === "") {
        url = `${BaseURL}/ChangeDeityStatus?deityKeyID=${id}`;
    } else {
        url = `${BaseURL}/ChangeDeityStatus?deityKeyID=${id}&AppLangID=${AppLangID}`;
    }

    const res = await getListWithAuthenticated(url);
    return res;
};

