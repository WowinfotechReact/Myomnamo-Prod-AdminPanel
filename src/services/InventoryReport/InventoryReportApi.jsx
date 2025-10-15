import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseURL = `${Base_Url}/api/InventoryReport`;

export const GetInventoryReport = async (params, id) => {
    let url = null
    if (id === null || id === undefined) {
        url = `${BaseURL}/GetInventoryReport`;
    } else {
        url = `${BaseURL}/GetInventoryReport?ProductTypeID=${id}`;
    }
    const res = await postApiWithAuthenticated(url, params);
    return res;
};


export const GetWarehouseLookupList = async () => {
    let url = `${BaseURL}/GetWarehouseLookupList`;
    const res = await getListWithAuthenticated(url);
    return res;
};


