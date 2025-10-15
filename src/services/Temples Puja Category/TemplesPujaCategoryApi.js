import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const TemplePujaCategoryBaseURI = `${Base_Url}/api/TemplePujaCategory`;

export const GetTemplePujaCategoryList = async (params) => {
    const url = `${TemplePujaCategoryBaseURI}/GetTemplePujaCategoryList`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const AddUpdateTemplePujaCategory = async (params) => {
    const url = `${TemplePujaCategoryBaseURI}/AddUpdateTemplePujaCategory`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const GetTemplePujaCategoryModel = async (id) => {
    let url = `${TemplePujaCategoryBaseURI}/GetTemplePujaCategoryModel?TempPujaCatID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};
export const GetTemplePujaCategoryLookupList = async () => {
    let url = `${TemplePujaCategoryBaseURI}/GetTemplePujaCategoryLookupList`;
    const res = await getListWithAuthenticated(url);
    return res;
};
export const ChangeTemplePujaCategoryStatus = async (id) => {
    let url = `${TemplePujaCategoryBaseURI}/ChangeTemplePujaCategoryStatus?TempPujaCatID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};

