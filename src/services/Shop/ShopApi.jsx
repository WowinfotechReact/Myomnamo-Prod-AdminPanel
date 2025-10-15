import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseURL = `${Base_Url}/api/Shop`;

export const GetShopList = async (params) => {
    const url = `${BaseURL}/GetShopList`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const AddUpdateShop = async (params) => {
    const url = `${BaseURL}/AddUpdateShop`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const GetShopModel = async (id) => {
    let url = `${BaseURL}/GetShopModel?ShopID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};
export const GetShopLookupList = async () => {
    let url = `${BaseURL}/GetShopLookupList`;
    const res = await getListWithAuthenticated(url);
    return res;
};
export const ChangeShopStatus = async (id) => {
    let url = `${BaseURL}/ChangeShopStatus?ShopID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};

