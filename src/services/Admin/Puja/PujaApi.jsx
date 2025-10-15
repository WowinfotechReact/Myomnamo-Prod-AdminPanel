import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseURL = `${Base_Url}/api/Puja`;

export const GetPujaList = async (params, PujaKeyID) => {
    let url = '';
    if (PujaKeyID === null || PujaKeyID === undefined || PujaKeyID === '') {
        url = `${BaseURL}/GetPujaList`;
    } else {
        url = `${BaseURL}/GetPujaList?PujaKeyID=${PujaKeyID}`;
    }

    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const AddUpdatePuja = async (params) => {
    const url = `${BaseURL}/AddUpdatePuja`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const GetPujaModel = async (id, AppLangID) => {
    let url = '';
    if (AppLangID === null || AppLangID === undefined || AppLangID === '') {
        url = `${BaseURL}/GetPujaModel?PujaKeyID=${id}`;
    } else {
        url = `${BaseURL}/GetPujaModel?PujaKeyID=${id}&AppLangID=${AppLangID}`;
    }

    const res = await getListWithAuthenticated(url);
    return res;
};
export const GetPujaLookupList = async () => {
    let url = ""
    if (AppLangID === null || AppLangID === undefined || AppLangID === "") {
        url = `${BaseURL}/GetPujaLookupList`;
    } else {
        url = `${BaseURL}/GetPujaLookupList&AppLangID=${AppLangID}`;
    }

    const res = await getListWithAuthenticated(url);
    return res;
};
export const ViewPujaDetails = async (PujaKeyID) => {
    let url = `${BaseURL}/ViewPujaDetails?PujaKeyID=${PujaKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
};
export const ChangePujaStatus = async (id, AppLangID) => {
    let url = '';
    if (AppLangID === null || AppLangID === undefined || AppLangID === '') {
        url = `${BaseURL}/ChangePujaStatus?PujaKeyID=${id}`;
    } else {
        url = `${BaseURL}/ChangePujaStatus?PujaKeyID=${id}&AppLangID=${AppLangID}`;
    }

    const res = await getListWithAuthenticated(url);
    return res;
};

export const GetTemplePujaSubscriptionLookupList = async (PujaSubServiceID, PujaServiceID) => {

    const url = `${BaseURL}/GetTemplePujaSubscriptionLookupList?PujaServiceID=${PujaServiceID}&PujaSubServiceID=${PujaSubServiceID}`;
    const res = await getListWithAuthenticated(url);
    return res;
};

export const AddUpdateTemplePujaSubscription = async (params) => {
    const url = `${BaseURL}/AddUpdateTemplePujaSubscription`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

