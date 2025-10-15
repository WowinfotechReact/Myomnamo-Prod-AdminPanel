import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const TemplePujaCategoryBaseURI = `${Base_Url}/api/TemplePujaSubCategory`;


export const GetTemplePujaSubCategoryList = async (params) => {
    const url = `${TemplePujaCategoryBaseURI}/GetTemplePujaSubCategoryList`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const AddUpdateTemplePujaSubCategory = async (params) => {
    const url = `${TemplePujaCategoryBaseURI}/AddUpdateTemplePujaSubCategory`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const GetTemplePujaSubCategoryModel = async (id) => {
    let url = `${TemplePujaCategoryBaseURI}/GetTemplePujaSubCategoryModel?TempPujaSubCatID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};
export const GetTemplePujaSubCategoryLookupList = async (TempPujaCatID) => {
    let url = `${TemplePujaCategoryBaseURI}/GetTemplePujaSubCategoryLookupList?TempPujaCatID=${TempPujaCatID}`;
    const res = await getListWithAuthenticated(url);
    return res;
};
export const ChangeTemplePujaSubCategoryStatus = async (id) => {
    let url = `${TemplePujaCategoryBaseURI}/ChangeTemplePujaSubCategoryStatus?TempPujaSubCatID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};

