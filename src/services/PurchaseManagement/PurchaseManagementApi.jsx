import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseURL = `${Base_Url}/api/PO`;

export const GetPoList = async (params) => {
    const url = `${BaseURL}/GetPoList`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const AddUpdatePo = async (params) => {
    const url = `${BaseURL}/AddUpdatePo`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const GetPOModel = async (id) => {
    let url = `${BaseURL}/GetPOModel?PurchaseID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};
export const GetVendorLookupList = async () => {
    let url = `${BaseURL}/GetVendorLookupList`;
    const res = await getListWithAuthenticated(url);
    return res;
};
export const ChangePOStatus = async (id) => {
    let url = `${BaseURL}/ChangePOStatus?PurchaseID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};

