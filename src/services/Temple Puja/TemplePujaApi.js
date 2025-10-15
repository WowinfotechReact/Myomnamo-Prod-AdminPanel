
import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const TemplePujaBaseURI = `${Base_Url}/api/TemplePuja`;


export const GetTemplePujaList = async (params) => {
    const url = `${TemplePujaBaseURI}/GetTemplePujaList`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const AddUpdateTemplePuja = async (params) => {
    const url = `${TemplePujaBaseURI}/AddUpdateTemplePuja`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const GetTemplePujaModel = async (id) => {
    let url = `${TemplePujaBaseURI}/GetTemplePujaModel?TemplePujaID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};
export const GetTemplePujaSubCategoryLookupList = async (TempPujaCatID) => {
    let url = `${TemplePujaBaseURI}/GetTemplePujaSubCategoryLookupList?TempPujaCatID=${TempPujaCatID}`;
    const res = await getListWithAuthenticated(url);
    return res;
};
export const ChangeTemplePujaStatus = async (id) => {
    let url = `${TemplePujaBaseURI}/ChangeTemplePujaStatus?TemplePujaID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};

