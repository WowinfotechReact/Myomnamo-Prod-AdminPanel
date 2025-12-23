import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseURL = `${Base_Url}/api/Temple`;

export const GetTempleList = async (params, TempleKeyID) => {
    let url = "";
    if (TempleKeyID === null || TempleKeyID === undefined || TempleKeyID === "") {
        url = `${BaseURL}/GetTempleList`;
    } else {
        url = `${BaseURL}/GetTempleList?TempleKeyID=${TempleKeyID}`;
    }

    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const AddUpdateTemple = async (params) => {
    const url = `${BaseURL}/AddUpdateTemple`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const GetTempleModel = async (id, AppLangID) => {
    let url = ""
    if (AppLangID == null || AppLangID === undefined || AppLangID === "") {
        url = `${BaseURL}/GetTempleModel?TempleKeyID=${id}`;
    } else {
        url = `${BaseURL}/GetTempleModel?TempleKeyID=${id}&AppLangID=${AppLangID}`;
    }


    const res = await getListWithAuthenticated(url);
    return res;
};
export const GetTempleLookupList = async (AppLangID) => {
    let url = ""
    if (AppLangID === null || AppLangID === undefined || AppLangID === "") {
        url = `${BaseURL}/GetTempleLookupList`;

    } else {
        url = `${BaseURL}/GetTempleLookupList?AppLangID=${AppLangID}`;
    }
    const res = await getListWithAuthenticated(url);
    return res;
};
export const ChangeTempleStatus = async (id,AppLangID) => {
    let url = `${BaseURL}/ChangeTempleStatus?TempleKeyID=${id}`;
    if (AppLangID !== null && AppLangID !== undefined && AppLangID !== "") {
        url += `&AppLangID=${AppLangID}`;
    }

    const res = await getListWithAuthenticated(url);
    return res;
};

export const GetTempleImageList = async (params, TempleKeyID) => {
    const url = `${BaseURL}/GetTempleImageList?TempleKeyID=${TempleKeyID}`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};
export const AddUpdateTempleImage = async (params, TempleKeyID) => {
    const url = `${BaseURL}/AddUpdateTempleImage`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const GetTempleImageModel = async (id) => {
    let url = `${BaseURL}/GetTempleImageModel?TempImgID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};
export const ChangeTempleImageStatus = async (id) => {
    let url = `${BaseURL}/ChangeTempleImageStatus?TempImgID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};


