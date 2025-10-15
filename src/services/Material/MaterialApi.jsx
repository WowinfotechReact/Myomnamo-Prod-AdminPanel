import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseURL = `${Base_Url}/api/Material`;

export const GetMaterialList = async (params, id) => {
    const url = `${BaseURL}/GetMaterialList?PurchaseID=${id}`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const AddUpdateMaterial = async (params) => {
    const url = `${BaseURL}/AddUpdateMaterial`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const GetMaterialModel = async (id) => {
    let url = `${BaseURL}/GetMaterialModel?MaterialID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};
export const GetProductLookupList = async () => {
    let url = `${BaseURL}/GetProductLookupList`;
    const res = await getListWithAuthenticated(url);
    return res;
};
export const ChangeMaterialStatus = async (id) => {
    let url = `${BaseURL}/ChangeMaterialStatus?MaterialID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};

